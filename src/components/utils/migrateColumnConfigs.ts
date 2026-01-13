import type { ColumnQuery } from "../Table";

type RowData = { [column: string]: any };

/**
 * Detects if exactly one column was renamed (1 removed + 1 added)
 * and checks if the types match.
 *
 * @returns The old and new column names if a single rename is detected with matching types, null otherwise
 */
export function detectColumnRename(
    oldRow: RowData,
    newRow: RowData
): { oldName: string; newName: string } | null {
    const oldColumns = new Set(Object.keys(oldRow));
    const newColumns = new Set(Object.keys(newRow));

    // Find removed columns (in old but not in new)
    const removedColumns = [...oldColumns].filter((col) => !newColumns.has(col));

    // Find added columns (in new but not in old)
    const addedColumns = [...newColumns].filter((col) => !oldColumns.has(col));

    // Must have exactly 1 removed and 1 added for a rename
    if (removedColumns.length !== 1 || addedColumns.length !== 1) {
        return null;
    }

    const oldName = removedColumns[0];
    const newName = addedColumns[0];

    // Check if types match (handling null appropriately)
    const oldValue = oldRow[oldName];
    const newValue = newRow[newName];

    // Get effective types (null values don't tell us the type)
    const oldType = oldValue === null ? null : typeof oldValue;
    const newType = newValue === null ? null : typeof newValue;

    // If both are null, we can't determine type compatibility - allow migration
    // If one is null, we assume compatibility (benefit of the doubt)
    // If both have types, they must match
    if (oldType !== null && newType !== null && oldType !== newType) {
        return null;
    }

    return { oldName, newName };
}

/**
 * Migrates column configs from old column name to new column name.
 * Modifies the query object in place.
 */
export function migrateColumnConfigs(query: ColumnQuery, oldName: string, newName: string): void {
    // Migrate columnFilters
    if (oldName in query.columnFilters) {
        query.columnFilters[newName] = query.columnFilters[oldName];
        delete query.columnFilters[oldName];
    }

    // Migrate widths
    if (query.widths && oldName in query.widths) {
        query.widths[newName] = query.widths[oldName];
        delete query.widths[oldName];
    }

    // Migrate columnExplicitlySetDataTypes
    if (oldName in query.columnExplicitlySetDataTypes) {
        query.columnExplicitlySetDataTypes[newName] = query.columnExplicitlySetDataTypes[oldName];
        delete query.columnExplicitlySetDataTypes[oldName];
    }
}
