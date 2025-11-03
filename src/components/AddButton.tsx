import React from "react";
import type { ColumnQuery, LoadedValues } from "./Table";
import { ToolCase, Warehouse, Wrench } from "lucide-react";
import SQLModal from "./SQLModal";
import DefaultSelector from "./DefaultSelector";
import VendorSelector from "./VendorSelector";
import type { VendorInfo } from "../dataFormat";

function SelectionMode({
    queries,
    setQueries,
    exit,
    firstId,
    loadedValuesRows,
    vendors,
}: {
    queries: ColumnQuery[];
    setQueries: (cb: (prev: ColumnQuery[]) => ColumnQuery[]) => void;
    exit: () => void;
    firstId: string;
    loadedValuesRows: Map<string, LoadedValues>;
    vendors: Record<string, VendorInfo>;
}) {
    const [mode, setMode] = React.useState<null | "default" | "vendor">(null);
    const modalRef = React.useRef<HTMLDialogElement>(null);

    const closer = (
        <button
            className="text-gray-500 hover:text-gray-800"
            onClick={exit}
            aria-label="Close selection mode"
        >
            ✕
        </button>
    );

    const setQueriesAndPurgeLoadedValues = React.useCallback(
        (cb: (prev: ColumnQuery[]) => ColumnQuery[]) => {
            loadedValuesRows.clear();
            setQueries(cb);
        },
        [setQueries, loadedValuesRows],
    );

    switch (mode) {
        case "default":
            return (
                <div className="flex">
                    {closer}
                    <DefaultSelector
                        queries={queries}
                        setQueries={setQueriesAndPurgeLoadedValues}
                    />
                </div>
            );
        case "vendor":
            return (
                <div className="flex">
                    {closer}
                    <VendorSelector
                        setQueries={setQueriesAndPurgeLoadedValues}
                        exit={exit}
                        vendors={vendors}
                    />
                </div>
            );
    }

    return (
        <div className="flex mt-2">
            <SQLModal
                ref={modalRef}
                setQueries={setQueriesAndPurgeLoadedValues}
                exit={exit}
                firstId={firstId}
            />
            {closer}
            <div className="ml-4 flex flex-col gap-2">
                <button
                    className="py-1 px-2 flex items-center border border-gray-400 rounded hover:bg-gray-200"
                    onClick={() => {
                        setMode("default");
                    }}
                >
                    <ToolCase className="inline mr-1" size={16} />
                    Default Queries
                </button>
                <button
                    className="py-1 px-2 flex items-center border border-gray-400 rounded hover:bg-gray-200"
                    onClick={() => {
                        setMode("vendor");
                    }}
                >
                    <Warehouse className="inline mr-1" size={16} />
                    Vendor Queries
                </button>
                <button
                    className="py-1 px-2 flex items-center border border-gray-400 rounded hover:bg-gray-200"
                    onClick={() => {
                        modalRef.current?.showModal();
                    }}
                >
                    <Wrench className="inline mr-1" size={16} />
                    Custom SQL
                </button>
            </div>
        </div>
    )
}

export default function AddButton({
    queries,
    setQueries,
    firstId,
    loadedValuesRows,
    vendors,
}: {
    queries: ColumnQuery[];
    setQueries: (cb: (prev: ColumnQuery[]) => ColumnQuery[]) => void;
    firstId: string;
    loadedValuesRows: Map<string, LoadedValues>;
    vendors: Record<string, VendorInfo>;
}) {
    const [selectionMode, setSelectionMode] = React.useState(false);

    let innerContent = (
        <button
            className="py-1 px-2 mt-2 border border-gray-400 rounded hover:bg-gray-200"
            onClick={() => setSelectionMode(true)}
        >
            + Add Query
        </button>
    );

    if (selectionMode) {
        innerContent = (
            <SelectionMode
                queries={queries}
                setQueries={setQueries}
                loadedValuesRows={loadedValuesRows}
                exit={() => setSelectionMode(false)}
                firstId={firstId}
                vendors={vendors}
            />
        );
    }

    return (
        <div aria-atomic="true" aria-live="assertive">
            {innerContent}
        </div>
    );
}
