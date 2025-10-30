import type { ColumnDataType } from "./Table";

type ColumnCustomTypeSelectorProps = {
    columnCustomTypesPtr: [
        {
            [key: string]: ColumnDataType;
        }
    ];
    setColumnCustomTypes: (
        newTypes: { [key: string]: ColumnDataType } 
    ) => void;
};

export default function ColumnCustomTypeSelector({
    columnCustomTypesPtr: [columnCustomTypes],
    setColumnCustomTypes,
}: ColumnCustomTypeSelectorProps) {
    return null;
}
