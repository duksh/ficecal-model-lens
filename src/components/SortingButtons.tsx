import { ArrowUp, ArrowDown } from "lucide-react";

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
        <div className="flex flex-col ml-1">
            <button
                onClick={() =>
                    setSorting(columnName, (oldValue) => {
                        if (oldValue === true) {
                            return null;
                        }
                        return true;
                    })
                }
                className="leading-2 p-0 border-none bg-none cursor-pointer"
                aria-label="Sort ascending"
            >
                <ArrowUp size={14} className={ascending === true ? "text-black dark:text-white" : "text-gray-400"} />
            </button>
            <button
                onClick={() =>
                    setSorting(columnName, (oldValue) => {
                        if (oldValue === false) {
                            return null;
                        }
                        return false;
                    })
                }
                className="leading-2 p-0 border-none bg-none cursor-pointer"
                aria-label="Sort descending"
            >
                <ArrowDown size={14} className={ascending === false ? "text-black dark:text-white" : "text-gray-400"} />
            </button>
        </div>
    );
}
