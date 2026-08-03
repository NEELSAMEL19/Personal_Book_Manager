import type React from "react";

export interface RowData {
  id: string | number;
  [key: string]: unknown;
}

export type Align = "left" | "right" | "center";

export interface ColumnDef<TRow extends RowData = RowData> {
  field: string;
  headerName: string;
  width?: number;
  minWidth?: number;
  align?: Align;
  headerAlign?: Align;
  sortable?: boolean;
  hidden?: boolean;
  skeletonWidth?: string;
  renderCell?: (row: TRow) => React.ReactNode;
  searchValue?: (row: TRow) => unknown;
  sortValue?: (row: TRow) => unknown;
  cellClassName?: (row: TRow) => string | undefined;
  onCellClick?: (row: TRow) => void;
}

export interface SortState {
  field: string;
  dir: "asc" | "desc";
}

export interface GridProps<TRow extends RowData = RowData> {
  rows?: TRow[];
  columns?: ColumnDef<TRow>[];
  onRowClick?: (row: TRow) => void;
  loading?: boolean;
  pageSize?: number;
  searchable?: boolean;
  stickyHeader?: boolean;
  page?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  sortField?: string | null;
  sortDir?: "asc" | "desc";
  onSortChange?: (sort: SortState) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  filters?: React.ReactNode;
}
