import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

export default function SortingButtons({
    ascending,
    setSorting,
    columnName,
}: {
    ascending: boolean | null;
    setSorting: (columnName: string, cb: (value: boolean | null) => boolean | null) => void;
    columnName: string;
}) {
    return (
        <div className="top-0 mt-0.5 mr-1 inline-block dark:invert">
            <button
                className={`${
                    ascending === false ? "text-gray-800" : "text-gray-400"
                } p-0 text-xs block cursor-pointer hover:text-gray-700 overflow-hidden w-4 h-3`}
                title="Sort ascending"
                aria-pressed={ascending === false}
                onClick={() =>
                    setSorting(columnName, (oldValue) => {
                        if (oldValue === true) {
                            return null;
                        }
                        return true;
                    })
                }
            >
                <ChevronUpIcon className="relative w-4 h-4" />
            </button>
            <button
                className={`${
                    ascending === true ? "text-gray-800" : "text-gray-400"
                } p-0 text-xs block cursor-pointer hover:text-gray-700 overflow-hidden w-4 h-3 mt-[1px]`}
                title="Sort descending"
                aria-pressed={ascending === true}
                onClick={() =>
                    setSorting(columnName, (oldValue) => {
                        if (oldValue === false) {
                            return null;
                        }
                        return false;
                    })
                }
            >
                <ChevronDownIcon className="relative -top-1 w-4 h-4" />
            </button>
        </div>
    );
}
