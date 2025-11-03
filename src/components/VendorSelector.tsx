import React from "react";
import type { ColumnDataType, ColumnQuery } from "./Table";
import type { VendorInfo } from "../dataFormat";

type VendorQueryBuilder = {
    name: string;
    columnExplicitlySetDataTypes?: { [key: string]: ColumnDataType };
} & ({
    region: true;
    queryBuilder: (vendorSlug: string, vendorName: string, region: null | string | { eu: true }) => string;
} | {
    region: false;
    queryBuilder: (vendorSlug: string, vendorName: string) => string;
});

function vendorOnlySelectAsWrapper(niceName: string, key: string) {
    return (vendorSlug: string, vendorName: string) =>
        `SELECT ${key} AS \`${niceName.replace("?", vendorName)}\` FROM models_vendors WHERE vendor_id = '${vendorSlug}' AND model_id = ?`;
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
        queryBuilder: vendorOnlySelectAsWrapper("? Low Capacity", "low_capacity"),
        columnExplicitlySetDataTypes: {
            "? Low Capacity": "boolean",
        },
    },
];

function replaceWithName(
    columnExplicitlySetDataTypes: { [key: string]: ColumnDataType } | undefined,
    vendorName: string,
): { [key: string]: ColumnDataType } | undefined {
    if (!columnExplicitlySetDataTypes) {
        return undefined;
    }
    const replaced: { [key: string]: ColumnDataType } = {};
    for (const [key, value] of Object.entries(columnExplicitlySetDataTypes)) {
        const newKey = key.replace("?", vendorName);
        replaced[newKey] = value;
    }
    return replaced;
}

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
        let query: string;
        if (builder.region) {
            query = builder.queryBuilder(vendorSlug, vendorInfo.cleanName, region);
        } else {
            query = builder.queryBuilder(vendorSlug, vendorInfo.cleanName);
        }

        setQueries((prev) => [
            ...prev,
            {
                columnExplicitlySetDataTypes: replaceWithName(builder.columnExplicitlySetDataTypes, vendorInfo.cleanName) || {},
                columnFilters: {},
                columnOrdering: {},
                query,
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
                        {/* {vendorInfo..map((reg) => (
                            <option key={reg} value={reg}>
                                {reg}
                            </option>
                        ))} */}
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
