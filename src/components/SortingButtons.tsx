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
                onClick={() => setSorting(columnName, (oldValue) => {
                    if (oldValue === true) {
                        return null;
                    }
                    return true;
                })}
                className="leading-2 p-0 border-none bg-none cursor-pointer"
                aria-label="Sort ascending"
            >
                <ArrowUp size={16} color={ascending === true ? "black" : "gray"} />
            </button>
            <button
                onClick={() => setSorting(columnName, (oldValue) => {
                    if (oldValue === false) {
                        return null;
                    }
                    return false;
                })}
                className="leading-2 p-0 border-none bg-none cursor-pointer"
                aria-label="Sort descending"
            >
                <ArrowDown size={16} color={ascending === false ? "black" : "gray"} />
            </button>
        </div>
    );
}
