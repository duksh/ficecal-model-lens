import React from "react";
import type { ColumnDataType } from "./Table";

type ColumnCustomTypeSelectorProps = {
    columnCustomTypes: {
        [key: string]: ColumnDataType;
    };
};

export default function ColumnCustomTypeSelector({
    columnCustomTypes,
}: ColumnCustomTypeSelectorProps) {
    const [columnKeys, setColumnKeys] = React.useState(() => Object.keys(columnCustomTypes));

    React.useEffect(() => {
        setColumnKeys(Object.keys(columnCustomTypes));
    }, [columnCustomTypes]);

    const handleTypeChange = React.useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            const { name } = e.target.dataset;
            const newType = e.target.value as ColumnDataType | "other";
            if (newType === "other") {
                delete columnCustomTypes[name!];
            } else {
                columnCustomTypes[name!] = newType;
            }
        },
        [columnCustomTypes]
    );

    return (
        <>
            <table id="col-editor-table" className="mt-4">
                <thead>
                    <tr>
                        <th className="border px-2 py-1 text-left">Column Name</th>
                        <th className="border px-2 py-1 text-left">Data Type</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {columnKeys.map((col, idx) => (
                        <tr key={col}>
                            <td className="border px-2 py-1">{col}</td>
                            <td className="border px-2 py-1">
                                <select
                                    data-name={col}
                                    defaultValue={columnCustomTypes[col] || "other"}
                                    onChange={handleTypeChange}
                                    className="border px-1 py-0.5"
                                >
                                    <option value="other">SQL Native</option>
                                    <option value="boolean">Boolean</option>
                                    <option value="currency">Currency</option>
                                </select>
                            </td>
                            <td className="border px-2 py-1">
                                <button
                                    type="button"
                                    data-name={col}
                                    onClick={() => {
                                        delete columnCustomTypes[col];
                                        setColumnKeys((prev) => prev.filter((_, i) => i !== idx));
                                    }}
                                    className="text-red-500 hover:underline"
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button
                aria-label="Add Column"
                type="button"
                onClick={() => {
                    const newColName = prompt("Enter the new column name:");
                    if (newColName && !columnKeys.includes(newColName)) {
                        setColumnKeys((prev) => [...prev, newColName]);
                    }
                }}
                className="mt-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Add Custom Column Type
            </button>
        </>
    );
}
