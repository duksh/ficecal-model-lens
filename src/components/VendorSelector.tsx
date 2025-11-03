import React from "react";
import type { ColumnDataType, ColumnQuery } from "./Table";
import type { VendorInfo } from "../dataFormat";

type VendorQueryBuilder = {
    name: string;
} & ({
    region: true;
    queryBuilder: (vendorSlug: string, vendorName: string, region: null | string | { eu: true }) => [
        string,
        { [key: string]: ColumnDataType },
    ];
} | {
    region: false;
    queryBuilder: (vendorSlug: string, vendorName: string) => [
        string,
        { [key: string]: ColumnDataType },
    ];
});

function vendorOnlySelectAsWrapper(niceName: string, key: string, explicitDataType?: ColumnDataType) {
    return (vendorSlug: string, vendorName: string) => {
        const niceNameReplaced = niceName.replace("?", vendorName);
        return [
            `SELECT ${key} AS \`${niceNameReplaced}\` FROM models_vendors WHERE vendor_id = '${vendorSlug}' AND model_id = ?`,
            explicitDataType ? { [niceNameReplaced]: explicitDataType } : {},
        ] as [string, { [key: string]: ColumnDataType }];
    };
}

function vendorAndRegionSelectAsWrapper(
    niceName: string,
    key: string,
    explicitDataType?: ColumnDataType,
) {
    return (
        vendorSlug: string,
        vendorName: string,
        region: null | string | { eu: true },
    ) => {
        let formatted: string;
        if (region === null) {
            formatted = "Average";
        } else if (typeof region === "string") {
            formatted = region;
        } else {
            formatted = "EU / UK Regions";
        }
        const niceNameReplaced = niceName.replace("?", vendorName + " " + formatted);

        const explicitDataTypes = explicitDataType
            ? { [niceNameReplaced]: explicitDataType }
            : {};

        let query: string;
        if (region === null) {
            query = `SELECT AVG(${key}) AS \`${niceNameReplaced}\`
    FROM models_vendors_regions
    WHERE vendor_id = '${vendorSlug}' AND model_id = ?`;
        } else if (typeof region === "string") {
            query = `SELECT ${key} AS \`${niceNameReplaced}\`
    FROM models_vendors_regions
    WHERE vendor_id = '${vendorSlug}' AND model_id = ? AND region_code = '${region}'`;
        } else if (region.eu) {
            query = `SELECT AVG(models_vendors_regions.${key}) AS \`${niceNameReplaced}\`
    FROM models_vendors_regions JOIN vendors ON models_vendors_regions.vendor_id = vendors.vendor_id
    WHERE models_vendors_regions.vendor_id = '${vendorSlug}' AND models_vendors_regions.model_id = ? AND EXISTS (
        SELECT 1 FROM json_each(vendors.eu_or_uk_regions) WHERE value = models_vendors_regions.region_code
    )`;
        } else {
            throw new Error("Invalid region");
        }

        return [
            query,
            explicitDataTypes,
        ] as [string, { [key: string]: ColumnDataType }];
    };
}

const vendorQueryBuilders: VendorQueryBuilder[] = [
    {
        name: "Latency (ms)",
        region: false,
        queryBuilder: vendorOnlySelectAsWrapper("? Latency (ms)", "latency_ms"),
    },
    {
        name: "Tokens per Second",
        region: false,
        queryBuilder: vendorOnlySelectAsWrapper("? Tokens per Second", "tokens_per_second"),
    },
    {
        name: "Low Capacity",
        region: false,
        queryBuilder: vendorOnlySelectAsWrapper("? Low Capacity", "low_capacity", "boolean"),
    },
    {
        name: "Cost per 1K Input Tokens",
        region: true,
        queryBuilder: vendorAndRegionSelectAsWrapper(
            "? Cost per 1K Input Tokens",
            "input_token_cost * 1000",
            "currency",
        ),
    },
    {
        name: "Cost per 1K Output Tokens",
        region: true,
        queryBuilder: vendorAndRegionSelectAsWrapper(
            "? Cost per 1K Output Tokens",
            "output_token_cost * 1000",
            "currency",
        ),
    },
];

function VendorItems({
    vendors,
    vendorSlug,
    setQueries,
    exit,
}: {
    vendors: Record<string, VendorInfo>;
    vendorSlug: string;
    setQueries: (cb: (prev: ColumnQuery[]) => ColumnQuery[]) => void;
    exit: () => void;
}) {
    const vendorInfo = vendors[vendorSlug];
    const [queryBuilderIndex, setQueryBuilderIndex] = React.useState<number>(-1);
    const [region, setRegion] = React.useState<string | { eu: true } | null>(null);
    const [disabled, setDisabled] = React.useState(true);

    const handleQueryBuilderChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setQueryBuilderIndex(parseInt(e.target.value, 10));
        setRegion(null);
        setDisabled(false);
    }, []);

    const submit = React.useCallback(() => {
        if (queryBuilderIndex === -1) {
            return;
        }
        const builder = vendorQueryBuilders[queryBuilderIndex];
        let queryAndTypes: [string, { [key: string]: ColumnDataType }];
        if (builder.region) {
            queryAndTypes = builder.queryBuilder(vendorSlug, vendorInfo.cleanName, region);
        } else {
            queryAndTypes = builder.queryBuilder(vendorSlug, vendorInfo.cleanName);
        }

        setQueries((prev) => [
            ...prev,
            {
                columnExplicitlySetDataTypes: queryAndTypes[1] || {},
                columnFilters: {},
                columnOrdering: {},
                query: queryAndTypes[0],
            },
        ]);
        exit();
    }, [queryBuilderIndex, vendorSlug, vendorInfo, region, setQueries, exit]);

    return (
        <div>
            <div className="mb-4">
                <label className="block mb-2 font-medium">Select Data to Add:</label>
                <select
                    value={queryBuilderIndex}
                    onChange={handleQueryBuilderChange}
                    className="w-full p-2 border rounded-md"
                    autoComplete="off"
                >
                    <option value={-1} disabled>
                        Select an option
                    </option>
                    {vendorQueryBuilders.map((builder, index) => (
                        <option key={index} value={index}>
                            {builder.name}
                        </option>
                    ))}
                </select>
            </div>
            {queryBuilderIndex !== -1 && vendorQueryBuilders[queryBuilderIndex].region && (
                <div className="mb-4">
                    <label className="block mb-2 font-medium">Select Region:</label>
                    <select
                        value={typeof region === "string" ? region : (region ? "eu" : "")}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === "eu") {
                                setRegion({ eu: true });
                            } else if (val) {
                                setRegion(val);
                            } else {
                                setRegion(null);
                            }
                        }}
                        className="w-full p-2 border rounded-md"
                        autoComplete="off"
                    >
                        <option value="">No Region</option>
                        {
                            Object.entries(vendorInfo.regionCleanNames).map(([category, regions]) => {
                                const child = Object.entries(regions).map(([regionCode, regionName]) => (
                                    <option key={regionCode} value={regionCode}>
                                        {regionName}
                                    </option>
                                ));
                                if (category === "") {
                                    return child;
                                }
                                return (
                                    <optgroup key={category} label={category}>
                                        {child}
                                    </optgroup>
                                );
                            })
                        }
                        {vendorInfo.euOrUKRegions.length > 0 && (
                            <option value="eu">
                                EU / UK Regions
                            </option>
                        )}
                    </select>
                </div>
            )}
            <button
                className={`py-1 px-4 rounded text-white ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                onClick={submit}
                disabled={disabled}
            >
                Add Column
            </button>
        </div>
    );
}

export default function VendorSelector({
    setQueries,
    exit,
    vendors,
}: {
    setQueries: (cb: (prev: ColumnQuery[]) => ColumnQuery[]) => void;
    exit: () => void;
    vendors: Record<string, VendorInfo>;
}) {
    const [selectedVendorSlug, setSelectedVendorSlug] = React.useState<string>("");

    const handleVendorChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedVendorSlug(e.target.value);
    }, []);

    return (
        <div className="p-4 w-full max-w-md">
            <select
                value={selectedVendorSlug}
                onChange={handleVendorChange}
                className="w-full p-2 border rounded-md mb-4"
                autoComplete="off"
            >
                <option value="" disabled>
                    Select a vendor
                </option>
                {Object.entries(vendors).map(([slug, info]) => (
                    <option key={slug} value={slug}>
                        {info.cleanName}
                    </option>
                ))}
            </select>
            {selectedVendorSlug && (
                <VendorItems
                    vendors={vendors}
                    vendorSlug={selectedVendorSlug}
                    setQueries={setQueries}
                    exit={exit}
                />
            )}
        </div>
    )
}
