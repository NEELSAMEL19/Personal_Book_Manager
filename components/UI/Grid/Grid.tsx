"use client";

import React, { useCallback, useEffect, useId, useMemo, type MouseEvent } from "react";
import { SkeletonRows } from "./SkeletonRows";
import { SortIcon } from "./SortIcon";
import { Toolbar } from "./Toolbar";
import type { ColumnDef, GridProps, RowData } from "./types";
import { ALIGN, cx, getValue } from "./utils";
import { useControllableState, useGridPipeline } from "./hooks";

export function Grid<TRow extends RowData = RowData>({
  rows = [],
  columns = [],
  filters,
  onRowClick,
  loading = false,
  pageSize = 8,
  searchable = false,
  stickyHeader = false,
  page: controlledPage,
  totalRows,
  onPageChange,
  sortField: controlledSortField,
  sortDir: controlledSortDir,
  onSortChange,
  searchQuery: controlledSearch,
  onSearchChange: onSearchChangeProp,
}: GridProps<TRow>): React.ReactElement {
  const tableId = useId();

  const isServerPagination = typeof onPageChange === "function";
  const isServerSort = typeof onSortChange === "function";
  const isServerSearch = typeof onSearchChangeProp === "function";

  const visibleColumns = useMemo(
    () => columns.filter((c) => !c.hidden),
    [columns],
  );

  const [page, setPage] = useControllableState(
    isServerPagination,
    controlledPage,
    1,
  );
  const [searchQuery, setSearchQuery] = useControllableState(
    isServerSearch,
    controlledSearch,
    "",
  );

  const handleSearchChange = useCallback(
    (q: string) => {
      if (isServerSearch) {
        onSearchChangeProp!(q);
      } else {
        setSearchQuery(q);
        setPage(1);
      }
    },
    [isServerSearch, onSearchChangeProp, setPage, setSearchQuery],
  );

  const setPageResolved = isServerPagination ? onPageChange! : setPage;

  const [sortField, setSortField] = useControllableState<string | null>(
    isServerSort,
    controlledSortField,
    null,
  );
  const [sortDir, setSortDir] = useControllableState(
    isServerSort,
    controlledSortDir,
    "asc" as "asc" | "desc",
  );

  const handleSort = useCallback(
    (field: string) => {
      if (isServerSort) {
        const nextDir: "asc" | "desc" =
          sortField === field ? (sortDir === "asc" ? "desc" : "asc") : "asc";
        onSortChange!({ field, dir: nextDir });
      } else if (sortField === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDir("asc");
      }
    },
    [isServerSort, sortField, sortDir, onSortChange, setSortField, setSortDir],
  );

  const { sortedRows, pagedRows, effectiveTotalRows, totalPages } =
    useGridPipeline({
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
    });

  useEffect(() => {
    if (!isServerPagination && page > totalPages) {
      setTimeout(() => setPage(totalPages), 0);
    }
  }, [page, totalPages, isServerPagination, setPage]);

  const renderCell = (row: TRow, col: ColumnDef<TRow>): React.ReactNode => {
    if (col.renderCell) return col.renderCell(row);
    return (getValue(row, col.field) ?? "—") as React.ReactNode;
  };

  const ariaSort = (field: string): React.AriaAttributes["aria-sort"] => {
    if (sortField !== field) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  };

  return (
    <div className="w-full">
      <Toolbar
        searchable={searchable}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        tableId={tableId}
        filters={filters}
      />

      <div className="overflow-x-auto shadow-sm">
        <table
          id={tableId}
          role="grid"
          aria-label="Data grid"
          aria-rowcount={effectiveTotalRows}
          className="w-full border-collapse"
        >
          <thead className={cx(stickyHeader && "sticky top-0 z-20")}>
            <tr role="row" className="bg-gray-100">
              {visibleColumns.map((col) => {
                const width = col.width;
                const isSorted = sortField === col.field;
                const headerAlign = col.headerAlign ?? col.align ?? "left";
                return (
                  <th
                    key={col.field}
                    role="columnheader"
                    scope="col"
                    aria-sort={col.sortable ? ariaSort(col.field) : undefined}
                    className={cx(
                      "relative text-xs sm:text-sm font-semibold select-none bg-gray-100 !px-3 !py-2.5 sm:!px-4 sm:!py-3 md:!px-6",
                      ALIGN[headerAlign],
                      col.sortable &&
                        "cursor-pointer hover:bg-gray-200 transition-colors",
                    )}
                    style={{ width }}
                    onClick={
                      col.sortable ? () => handleSort(col.field) : undefined
                    }
                  >
                    <span
                      className={cx(
                        "flex items-center gap-0.5 pr-2 sm:pr-3",
                        headerAlign === "left" && "justify-start",
                        headerAlign === "center" && "justify-center",
                        headerAlign === "right" && "justify-end",
                      )}
                    >
                      {col.headerName}
                      {col.sortable && <SortIcon active={isSorted} dir={sortDir} />}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <SkeletonRows columns={visibleColumns as ColumnDef[]} pageSize={pageSize} />
            ) : pagedRows.length === 0 ? (
              <tr role="row">
                <td
                  colSpan={visibleColumns.length}
                  className="!px-3 sm:!px-6 text-center text-sm text-gray-400"
                  style={{ height: "200px" }}
                >
                  {searchQuery
                    ? `No results for "${searchQuery}"`
                    : "No records found"}
                </td>
              </tr>
            ) : (
              pagedRows.map((row, rowIdx) => (
                <tr
                  key={row.id}
                  role="row"
                  aria-rowindex={(page - 1) * pageSize + rowIdx + 2}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cx(onRowClick && "cursor-pointer")}
                >
                  {visibleColumns.map((col) => {
                    const width = col.width;
                    return (
                      <td
                        key={`${row.id}-${col.field}`}
                        role="gridcell"
                        className={cx(
                          "text-xs sm:text-sm !px-3 !py-2.5 sm:!px-4 sm:!py-3 md:!px-6",
                          ALIGN[col.align ?? "left"],
                          col.cellClassName?.(row),
                          col.onCellClick && "cursor-pointer hover:underline",
                        )}
                        style={{ width }}
                        onClick={
                          col.onCellClick
                            ? (e: MouseEvent) => {
                                e.stopPropagation();
                                col.onCellClick!(row);
                              }
                            : undefined
                        }
                      >
                        {renderCell(row, col)}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex mt-2 text-typography-secondary border-t-0 items-center justify-between px-3 py-3 sm:px-5 flex-wrap gap-2">
        <span
          className="text-xs sm:text-sm"
          aria-live="polite"
          aria-atomic="true"
        >
          {effectiveTotalRows} records
        </span>

        <div className="flex items-center gap-2">
          <button
            aria-label="Previous page"
            className="px-3 py-2 sm:py-1 text-xs sm:text-sm rounded transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            onClick={() => setPageResolved(Math.max(1, page - 1))}
            disabled={page === 1 || loading}
          >
            Previous
          </button>

          <span className="text-xs sm:text-sm" aria-live="polite">
            Page {page} of {totalPages}
          </span>

          <button
            aria-label="Next page"
            className="px-3 py-2 sm:py-1 text-xs sm:text-sm rounded transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            onClick={() => setPageResolved(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || loading}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Grid;
