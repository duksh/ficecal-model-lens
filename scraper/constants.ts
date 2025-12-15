import type { Tokenisers } from "@/src/dataFormat";
import { nullable, array, number, object, parse, string, type BaseSchema, type InferOutput } from "valibot";

const MODEL_REASONING_PREFIXES = {
    "gpt-oss": true,
    "deepseek-v3": true,
    "qwen3-235b-a22b": true,
    "qwen3-coder": true,
    "qwen3-32": false,
    "llama-3": true,
    "mistral-7b": true,
    "llama-4": false,
    "claude-instant": false,
    "mistral-small": true,
    "mistral-large": true,
    "mixtral": true,
    "pixtral": true,
    "deepseek-r1": true,
    "claude-2": true,
    "claude-3": true,
} as const;

export function isReasoningModel(modelId: string): boolean {
    for (
        const [prefix, isReasoning] of Object.entries(MODEL_REASONING_PREFIXES).sort(
            // Longer prefixes first
            (a, b) => b[0].length - a[0].length
        )
    ) {
        if (modelId.startsWith(prefix)) {
            return isReasoning;
        }
    }

    throw new Error(`Unknown model ID: ${modelId}. Please add it to MODEL_REASONING_PREFIXES in scraper/constants.ts.`);
}

export function isSelfHostableModel(modelId: string, provider: string): boolean {
    if (provider === "Meta") {
        // All Meta models are self-hostable
        return true;
    }

    if (provider === "Anthropic") {
        // No Anthropic models are self-hostable
        return false;
    }

    if (provider === "OpenAI") {
        if (modelId.startsWith("gpt-oss-")) {
            return true;
        }
        return false;
    }

    if (provider === "Qwen") {
        // All Qwen models are self-hostable
        return true;
    }

    if (provider === "DeepSeek") {
        // All DeepSeek models are self-hostable
        return true;
    }

    if (provider === "Mistral") {
        // All Mistral models are self-hostable
        return true;
    }

    throw new Error(`Unknown self-hostable status for model ID: ${modelId} with provider: ${provider}. Please update isSelfHostableModel in scraper/constants.ts.`);
}

// Tiktoken BPE file URLs (OpenAI's public CDN)
const TIKTOKEN_CL100K = "https://openaipublic.blob.core.windows.net/encodings/cl100k_base.tiktoken";
const TIKTOKEN_O200K = "https://openaipublic.blob.core.windows.net/encodings/o200k_base.tiktoken";

// Map of model prefixes to their HuggingFace tokenizer paths
const TRANSFORMERS_TOKENISER_PATHS: Record<string, string> = {
    // Meta/Llama
    "llama-4": "meta-llama/Llama-4-Scout-17B-16E-Instruct",
    "llama-3-3": "meta-llama/Llama-3.3-70B-Instruct",
    "llama-3-2": "meta-llama/Llama-3.2-3B-Instruct",
    "llama-3-1": "meta-llama/Llama-3.1-8B-Instruct",
    "llama-3": "meta-llama/Llama-3.1-8B-Instruct",
    // Mistral
    "mistral-large": "mistralai/Mistral-Large-Instruct-2411",
    "mistral-small": "mistralai/Mistral-Small-24B-Instruct-2501",
    "pixtral": "mistralai/Pixtral-Large-Instruct-2411",
    "mixtral": "mistralai/Mixtral-8x22B-Instruct-v0.1",
    "mistral-7b": "mistralai/Mistral-7B-Instruct-v0.3",
    // DeepSeek
    "deepseek-r1": "deepseek-ai/DeepSeek-R1",
    "deepseek-v3": "deepseek-ai/DeepSeek-V3",
    // Qwen
    "qwen3-235b": "Qwen/Qwen3-235B-A22B",
    "qwen3-coder": "Qwen/Qwen3-Coder-480B-A35B-Instruct",
    "qwen3-32": "Qwen/Qwen3-32B",
    "qwen3": "Qwen/Qwen3-32B",
};

export function getTokeniserForModel(modelId: string, provider: string): Tokenisers | undefined {
    // OpenAI models use tiktoken
    if (provider === "OpenAI") {
        // GPT-4o and newer use o200k_base
        if (modelId.startsWith("gpt-4o") || modelId.startsWith("gpt-oss")) {
            return { type: "tiktoken", bpePath: TIKTOKEN_O200K };
        }
        // Older GPT-4, GPT-3.5 use cl100k_base
        if (modelId.startsWith("gpt-4") || modelId.startsWith("gpt-3")) {
            return { type: "tiktoken", bpePath: TIKTOKEN_CL100K };
        }
        return undefined;
    }

    // Anthropic Claude - no public tokenizer available
    if (provider === "Anthropic") {
        return undefined;
    }

    // For other providers, look up in the transformers tokenizer map
    // Sort by prefix length (longest first) for more specific matches
    const sortedPrefixes = Object.keys(TRANSFORMERS_TOKENISER_PATHS).sort(
        (a, b) => b.length - a.length
    );

    for (const prefix of sortedPrefixes) {
        if (modelId.startsWith(prefix)) {
            return {
                type: "transformers",
                pretrainedPath: TRANSFORMERS_TOKENISER_PATHS[prefix],
            };
        }
    }

    return undefined;
}

async function fetchAndParse<S extends BaseSchema<any, any, any>>(url: string, schema: S, headers?: Record<string, string>): Promise<InferOutput<S>> {
    const res = await fetch(url, headers ? { headers } : undefined);
    if (!res.ok) {
        throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return parse(schema, data);
}

const ranking = object({
    model: string(),
    correct: number(),
    incorrect: number(),
    totalTests: number(),
    successRate: number(),
    averageCostPerTest: number(),
});

const skateBenchRankingsObj = object({
    rankings: array(ranking),
});

let skatebenchResult: Promise<InferOutput<typeof skateBenchRankingsObj>> | null = null;

async function getSkatebenchScores() {
    if (skatebenchResult) {
        return (await skatebenchResult).rankings;
    }
    const res = fetchAndParse(
        "https://raw.githubusercontent.com/T3-Content/skatebench/refs/heads/main/visualizer/data/benchmark-results.json",
        skateBenchRankingsObj
    );
    skatebenchResult = res;
    return (await res).rankings;
}

const leaderboardObj = object({
    instance_cost: nullable(number()),
    resolved: number(),
    tags: array(string()),
});

const leaderboardItemSweBench = object({
    name: string(),
    results: array(leaderboardObj),
});

const sweBenchRankingsObj = object({
    leaderboards: array(leaderboardItemSweBench),
});

let sweBenchResult: Promise<{
    [testName: string]: Array<InferOutput<typeof leaderboardObj>>;
}> | null = null;

async function getSweBenchScores() {
    if (sweBenchResult) {
        return sweBenchResult;
    }
    const res = fetchAndParse(
        "https://raw.githubusercontent.com/SWE-bench/swe-bench.github.io/refs/heads/master/data/leaderboards.json",
        sweBenchRankingsObj
    ).then((x) => Object.fromEntries(
        x.leaderboards.map((item) => [item.name, item.results]),
    ));
    sweBenchResult = res;
    return res;
}

const hleLeaderboardItem = object({
    model_id: string(),
    score: number(),
});

let hleResult: Promise<Array<InferOutput<typeof hleLeaderboardItem>>> | null = null;

async function getHumanitysLastExamScores() {
    if (hleResult) {
        return hleResult;
    }
    const res = fetchAndParse(
        "https://api.zeroeval.com/leaderboard/benchmarks/humanity's-last-exam",
        object({
            models: array(hleLeaderboardItem),
        }),
    ).then((x) => x.models);
    hleResult = res;
    return res;
}

const V_NUMBER_DASH_NUMBER_REGEX = /v(\d+)-(\d+)/g;

export async function addBenchmarkDataForModel(modelId: string): Promise<{
    humanitysLastExamPercentage?: number;
    sweBenchResolvedPercentage?: number;
    sweBenchCostPerResolved?: number;
    skatebenchScore?: number;
}> {
    // Replace version numbers like v1-0 with v1.0 for matching
    const dotVersion = modelId.replaceAll(V_NUMBER_DASH_NUMBER_REGEX, (_, p1, p2) => {
        return `v${p1}.${p2}`;
    });

    const [skatebenchScores, sweBenchScores, hleScores] = await Promise.all([
        getSkatebenchScores(),
        getSweBenchScores(),
        getHumanitysLastExamScores(),
    ]);

    const result: {
        humanitysLastExamPercentage?: number;
        sweBenchResolvedPercentage?: number;
        sweBenchCostPerResolved?: number;
        skatebenchScore?: number;
        skatebenchCostPerTest?: number;
    } = {};

    // SkateBench
    const skatebenchEntry = skatebenchScores.find((entry) => entry.model.startsWith(dotVersion));
    if (skatebenchEntry) {
        result.skatebenchScore = skatebenchEntry.successRate;
        result.skatebenchCostPerTest = skatebenchEntry.averageCostPerTest;
    }

    // SweBench
    const verified = sweBenchScores.Verified;
    if (!verified) {
        throw new Error("No 'Verified' leaderboard found in SweBench data");
    }
    const sweBenchModelId = modelId === "deepseek-r1" ? "deepseek-reasoner" : modelId;
    const sweBenchEntry = verified.find((entry) => {
        const tag = entry.tags.find((t) => t.startsWith("Model: "));
        if (tag?.toLowerCase().startsWith(`model: ${sweBenchModelId.toLowerCase()}`)) {
            return true;
        }
        return false;
    });
    if (sweBenchEntry) {
        result.sweBenchResolvedPercentage = sweBenchEntry.resolved;
        if (sweBenchEntry.instance_cost !== null && sweBenchEntry.resolved > 0) {
            result.sweBenchCostPerResolved = sweBenchEntry.instance_cost / sweBenchEntry.resolved;
        }
    }

    // Humanity's Last Exam
    const hleEntry = hleScores.find((entry) => entry.model_id.toLowerCase().startsWith(modelId.toLowerCase()));
    if (hleEntry) {
        result.humanitysLastExamPercentage = hleEntry.score;
    }

    return result;
}
