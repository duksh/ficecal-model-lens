import React from "react";
import { defaultQueries } from "../constants";
import type { ColumnQuery } from "./Table";
import { ToolCase, Warehouse, Wrench } from "lucide-react";
import SQLModal from "./SQLModal";

function DefaultSelector({
    queries,
    setQueries,
    exit,
}: {
    queries: ColumnQuery[];
    setQueries: (cb: (prev: ColumnQuery[]) => ColumnQuery[]) => void;
    exit: () => void;
}) {
    return null;
}

function VendorSelector({
    queries,
    setQueries,
    exit,
}: {
    queries: ColumnQuery[];
    setQueries: (cb: (prev: ColumnQuery[]) => ColumnQuery[]) => void;
    exit: () => void;
}) {
    return null;
}

function SelectionMode({
    queries,
    setQueries,
    exit,
    firstId,
}: {
    queries: ColumnQuery[];
    setQueries: (cb: (prev: ColumnQuery[]) => ColumnQuery[]) => void;
    exit: () => void;
    firstId: string;
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

    switch (mode) {
        case "default":
            return (
                <div className="flex rounded-md bg-gray-50 mt-2">
                    {closer}
                    <DefaultSelector
                        queries={queries}
                        setQueries={setQueries}
                        exit={exit}
                    />
                </div>
            );
        case "vendor":
            return (
                <div className="flex rounded-md bg-gray-50 mt-2">
                    {closer}
                    <VendorSelector
                        queries={queries}
                        setQueries={setQueries}
                        exit={exit}
                    />
                </div>
            );
    }

    return (
        <div className="flex rounded-md bg-gray-50 mt-2">
            <SQLModal
                ref={modalRef}
                setQueries={setQueries}
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
}: {
    queries: ColumnQuery[];
    setQueries: (cb: (prev: ColumnQuery[]) => ColumnQuery[]) => void;
    firstId: string;
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
                exit={() => setSelectionMode(false)}
                firstId={firstId}
            />
        );
    }

    return (
        <div aria-atomic="true" aria-live="assertive">
            {innerContent}
        </div>
    );
}
