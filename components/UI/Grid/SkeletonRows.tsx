import type React from "react";
import type { ColumnDef, RowData } from "./types";

interface SkeletonRowsProps<TRow extends RowData = RowData> {
  columns: ColumnDef<TRow>[];
  pageSize?: number;
  selectable?: boolean;
}

export const SkeletonRows = <TRow extends RowData = RowData>({
  columns,
  pageSize = 10,
  selectable = false,
}: SkeletonRowsProps<TRow>): React.ReactElement => (
  <>
    {Array.from({ length: pageSize }).map((_, rowIndex) => (
      <tr
        key={rowIndex}
        role="row"
        aria-hidden="true"
        className="!border-b border-gray-100"
      >
        {selectable && (
          <td className="!px-3 !py-3 sm:!px-4 sm:!py-4 md:!px-6">
            <div className="h-4 w-4 rounded bg-gray-200" />
          </td>
        )}
        {columns.map((col, colIndex) => (
          <td
            key={col.field}
            className="!px-3 !py-3 sm:!px-4 sm:!py-4 md:!px-6"
          >
            <div
              className="h-4 rounded-md bg-gray-200"
              style={{
                width:
                  col.skeletonWidth ??
                  ["90%", "70%", "55%", "80%"][colIndex % 4],
              }}
            />
          </td>
        ))}
      </tr>
    ))}
  </>
);
