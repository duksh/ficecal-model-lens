import React from "react";
import type { ColumnQuery } from "../Table";

export default function StringFilter({
    columnName,
    query,
    updateQuery,
}: {
    columnName: string;
    query: ColumnQuery;
    updateQuery: (rerunQuery: boolean) => void;
}) {
    const filterValue = React.useRef<string>(query.columnFilters[columnName] || "");

    React.useEffect(() => {
        filterValue.current = query.columnFilters[columnName] || "";
    }, [query.columnFilters[columnName]]);

    const setFilterValue = React.useCallback(
        (val: string) => {
            filterValue.current = val;
            if (val === "") {
                delete query.columnFilters[columnName];
            } else {
                query.columnFilters[columnName] = val;
            }
            updateQuery(false);
        },
        [columnName, query, updateQuery]
    );

    return (
        <input
            type="text"
            value={filterValue.current}
            onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                    delete query.columnFilters[columnName];
                } else {
                    query.columnFilters[columnName] = val;
                }
                setFilterValue(val);
            }}
            className="w-full border text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md p-1 placeholder:text-gray-500 dark:placeholder:text-gray-400 placeholder:font-light"
            aria-label={`Filter ${columnName}`}
            placeholder={`Filter by ${columnName}...`}
        />
    );
}
