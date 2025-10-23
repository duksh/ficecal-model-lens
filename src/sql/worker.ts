import type { DataFormat } from "../dataFormat";
import schema from "./schema";
import sqlite3, { type Database, type PreparedStatement } from "@sqlite.org/sqlite-wasm";

let sqlite3Db: Database | null = null;
let loaded = false;

async function loadData(data: DataFormat) {
    // Add the vendors
    const vendorsPrep = sqlite3Db!.prepare("INSERT INTO vendors (vendor_id, clean_name, learn_more_url, eu_or_uk_regions) VALUES (?, ?, ?, ?)");
    const vendorRegionsPrep = sqlite3Db!.prepare("INSERT INTO vendor_regions (vendor_id, region_code, category, region_name) VALUES (?, ?, ?, ?)");
    for (const [vendorId, vendorData] of Object.entries(data.vendors)) {
        vendorsPrep.bind([vendorId, vendorData.cleanName, vendorData.learnMoreUrl, JSON.stringify(vendorData.euOrUKRegions)]).step();
        vendorsPrep.reset();
        for (const [categoryOrEmpty, regions] of Object.entries(vendorData.regionCleanNames)) {
            const category = categoryOrEmpty === "" ? null : categoryOrEmpty;
            for (const [regionCode, regionName] of Object.entries(regions)) {
                vendorRegionsPrep.bind([vendorId, regionCode, category, regionName]).step();
                vendorRegionsPrep.reset();
            }
        }
    }

    // Add the models
    const modelsPrep = sqlite3Db!.prepare("INSERT INTO models (model_id, clean_name, brand, company_country_code, selfhostable, reasoning, humanitys_last_exam_percentage, swe_bench_resolved_percentage, skatebench_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    const modelsTokenisersPrep = sqlite3Db!.prepare("INSERT INTO models_tokenisers (model_id, tokeniser, url) VALUES (?, ?, ?)");
    const modelsVendorsPrep = sqlite3Db!.prepare("INSERT INTO models_vendors (model_id, vendor_id, latency_ms, tokens_per_second, low_capacity) VALUES (?, ?, ?, ?, ?)");
    const modelsVendorsRegionsPrep = sqlite3Db!.prepare("INSERT INTO models_vendors_regions (model_id, vendor_id, region_code, input_token_cost, output_token_cost) VALUES (?, ?, ?, ?, ?)");
    for (const [modelId, modelData] of Object.entries(data.models)) {
        modelsPrep.bind([
            modelId,
            modelData.cleanName,
            modelData.brand,
            modelData.companyCountryCode,
            modelData.selfhostable,
            modelData.reasoning,
            modelData.humanitysLastExamPercentage ?? null,
            modelData.sweBenchResolvedPercentage ?? null,
            modelData.skatebenchScore ?? null,
        ]).step();
        modelsPrep.reset();
        switch (modelData.tokeniser.type) {
            case "site-api":
                modelsTokenisersPrep.bind([modelId, "site-api", modelData.tokeniser.apiUrl]).step();
                modelsTokenisersPrep.reset();
                break;
            case "tiktoken":
                modelsTokenisersPrep.bind([modelId, "tiktoken", modelData.tokeniser.bpePath]).step();
                modelsTokenisersPrep.reset();
                break;
            case "transformers":
                modelsTokenisersPrep.bind([modelId, "transformers", modelData.tokeniser.pretrainedPath]).step();
                modelsTokenisersPrep.reset();
                break;
            default:
                throw new Error(`Unknown tokeniser type: ${modelData.tokeniser}`);
        }
        for (const vendor of modelData.vendors) {
            modelsVendorsPrep.bind([
                modelId,
                vendor.vendorRef,
                vendor.latencyMs,
                vendor.tokensPerSecond,
                vendor.lowCapacity,
            ]).step();
            modelsVendorsPrep.reset();
            for (const [regionCode, [inputTokenCost, outputTokenCost]] of Object.entries(vendor.regionPricing)) {
                modelsVendorsRegionsPrep.bind([
                    modelId,
                    vendor.vendorRef,
                    regionCode,
                    inputTokenCost,
                    outputTokenCost,
                ]).step();
                modelsVendorsRegionsPrep.reset();
            }
        }
    }

    // Finalize the statements
    modelsPrep.finalize();
    modelsTokenisersPrep.finalize();
    modelsVendorsPrep.finalize();
    modelsVendorsRegionsPrep.finalize();
    vendorsPrep.finalize();
    vendorRegionsPrep.finalize();

    // Drop the DB to readonly
    sqlite3Db!.exec("PRAGMA query_only = TRUE;");
}

const compilationCache = new Map<string, PreparedStatement>();

self.onmessage = async (event) => {
    if (!loaded) {
        loaded = true;
        const data = event.data;
        if (!sqlite3Db) {
            sqlite3Db = new (await sqlite3({
                print: console.log,
                printErr: console.error,
            })).oo1.DB(":memory:");
        }
        sqlite3Db.exec(schema);
        await loadData(data);
        self.postMessage(null);
        return;
    }

    const [id, query, param] = event.data;
    if (id === 0) {
        let prep = compilationCache.get(query);
        if (!prep) {
            prep = sqlite3Db!.prepare(query);
            compilationCache.set(query, prep);
        }
        prep.bind([param]);
        const res = [];
        while (prep.step()) {
            res.push(prep.get({}));
        }
        prep.reset();
        self.postMessage(res[0] ?? null);
        return;
    }

    let prep = compilationCache.get(query);
    if (!prep) {
        prep = sqlite3Db!.prepare(query);
        compilationCache.set(query, prep);
    }
    prep.bind(param);
    const res = [];
    while (prep.step()) {
        res.push(prep.get({}));
    }
    prep.reset();
    self.postMessage(res);
};
