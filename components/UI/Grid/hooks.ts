import { useMemo, useState } from "react";
import type { ColumnDef, RowData } from "./types";
import { getValue } from "./utils";

export function useControllableState<T>(
  isControlled: boolean,
  controlledValue: T | undefined,
  defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [internalValue, setInternalValue] = useState<T>(defaultValue);
  const value = isControlled ? (controlledValue as T) : internalValue;
  return [value, setInternalValue];
}

interface UseGridPipelineArgs<TRow extends RowData> {
  rows: TRow[];
  visibleColumns: ColumnDef<TRow>[];
  pageSize: number;
  isServerSearch: boolean;
  isServerSort: boolean;
  isServerPagination: boolean;
  searchQuery: string;
  sortField: string | null | undefined;
  sortDir: "asc" | "desc";
  page: number;
  totalRows?: number;
}

export function useGridPipeline<TRow extends RowData>({
  rows,
  visibleColumns,
  pageSize,
  isServerSearch,
  isServerSort,
  isServerPagination,
  searchQuery,
  sortField,
  sortDir,
  page,
  totalRows,
}: UseGridPipelineArgs<TRow>) {
  const searchedRows = useMemo<TRow[]>(() => {
    if (isServerSearch || !searchQuery.trim()) return rows;
    const q = searchQuery.toLowerCase();
    return rows.filter((row) =>
      visibleColumns.some((col) => {
        const val = col.searchValue ? col.searchValue(row) : getValue(row, col.field);
        return String(val).toLowerCase().includes(q);
      }),
    );
  }, [rows, visibleColumns, searchQuery, isServerSearch]);

  const sortedRows = useMemo<TRow[]>(() => {
    if (isServerSort || !sortField) return searchedRows;
    const col = visibleColumns.find((c) => c.field === sortField);
    return [...searchedRows].sort((a, b) => {
      const av = col?.sortValue ? col.sortValue(a) : getValue(a, sortField);
      const bv = col?.sortValue ? col.sortValue(b) : getValue(b, sortField);
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [searchedRows, visibleColumns, sortField, sortDir, isServerSort]);

  const effectiveTotalRows = isServerPagination ? (totalRows ?? 0) : sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(effectiveTotalRows / pageSize));

  const pagedRows = isServerPagination
    ? rows
    : sortedRows.slice((page - 1) * pageSize, page * pageSize);

  return { sortedRows, pagedRows, effectiveTotalRows, totalPages };
}
