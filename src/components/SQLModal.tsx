import React from "react";
import type { ColumnQuery } from "./Table";
import { XIcon } from "lucide-react";

export type SQLModalProps = {
    exit: () => void;
    queries: ColumnQuery[];
    setQueries: (cb: (prev: ColumnQuery[]) => ColumnQuery[]) => void;
};

const CodeMirror = React.lazy(() => import("./CodeMirror"));

function SQLModalInner({
    exit,
    queries,
    setQueries,
}: SQLModalProps) {
    const valueRef = React.useRef<string>("");

    return (
        <div className="block">
            <React.Suspense fallback={<div>Loading...</div>}>
                <CodeMirror
                    value={valueRef.current}
                    height="300px"
                    width="100%"
                    onChange={(val) => {
                        valueRef.current = val;
                    }}
                />
            </React.Suspense>
        </div>
    )
}

const SQLModal = React.forwardRef<HTMLDialogElement, SQLModalProps>((props, ref) => {
    return (
        <dialog
            ref={ref}
            className="m-auto p-0 rounded-md max-w-lg"
            onClick={() => props.exit()}
        >
            <div onClick={e => e.stopPropagation()}>
                <div className="bg-white p-4 block w-full h-full">
                    <header>
                        <div className="flex gap-2 items-center">
                            <form method="dialog">
                                <button type="submit" className="py-4 rounded-md">
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </form>
                            <h2 className="text-lg font-bold">Add SQL Columns</h2>
                        </div>
                    </header>
                    <hr className="mt-2 mb-4 border-gray-200" />
                    <SQLModalInner {...props} />
                </div>
            </div>
        </dialog>
    );
});
SQLModal.displayName = "SQLModal";

export default SQLModal;
