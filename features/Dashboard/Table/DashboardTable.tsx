"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Book as BookIcon, Check } from "lucide-react";
import Grid from "@/components/UI/Grid";
import { useBooks, useDeleteBook } from "@/hooks/books/useBooks";
import type { Book } from "@/types/books";

const DashboardTable = () => {
  const router = useRouter();
  const { data, isLoading } = useBooks();
  const { mutate: deleteBook, isPending: isDeleting } = useDeleteBook();

  const handleDelete = (row: Book) => {
    deleteBook(row._id);
  };

  const columns = useMemo(
    () => [
      {
        field: "title",
        headerName: "Book",
        sortable: true,
      },
      {
        field: "author",
        headerName: "Author",
        sortable: true,
      },
      {
        field: "tags",
        headerName: "Tags",
        renderCell: (row: Book) => (row.tags?.length ? row.tags.join(", ") : "—"),
      },
      {
        field: "status",
        headerName: "Status",
        renderCell: (row: Book) => {
          const raw = row.status ?? "Unknown";
          const statusLabel = (raw as string).replace("-", " ");
          const capitalized = statusLabel
            ? statusLabel.charAt(0).toUpperCase() + statusLabel.slice(1)
            : "Unknown";

          const statusClasses =
            raw === "completed"
              ? "bg-emerald-100 border border-emerald-400 text-emerald-700"
              : raw === "reading"
              ? "bg-sky-100 border border-sky-300 text-sky-700"
              : raw === "want to read"
              ? "bg-orange-100 border border-orange-300 text-orange-700"
              : "bg-slate-100 border border-slate-300 text-slate-700";

          return (
            <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses}`}>
              <BookIcon className="w-3 h-3" />
              <span>{capitalized}</span>
              {raw === "completed" && (
                <Check className="w-3 h-3 text-emerald-700" />
              )}
            </span>
          );
        },
      },
      {
        field: "createdAt",
        headerName: "Created",
        renderCell: (row: Book) =>
          row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—",
      },
      {
        field: "actions",
        headerName: "Action",
        renderCell: (row: Book) => (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
            disabled={isDeleting}
            className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50 cursor-pointer"
          >
            Delete
          </button>
        ),
      },
    ],
    [isDeleting],
  );

  const rows = useMemo(
    () =>
      (data?.data ?? []).map((book) => ({
        ...book,
        id: book._id,
      })),
    [data?.data],
  );

  return (
    <Grid
      rows={rows}
      columns={columns}
      loading={isLoading}
      searchable
      onRowClick={(row) => {
        router.push(`/dashboard/edit/${row._id}`);
      }}
    />
  );
};

export default DashboardTable;