"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardHeader from "./Header/DashboardHeader";
import DashboardTable from "./Table/DashboardTable";
import AddBook from "./Modal/AddBook";
import EditBook from "./Modal/EditBook";
import { useBooks } from "@/hooks/books/useBooks";

interface DashboardPageContentProps {
  editBookId?: string;
}

const DashboardPageContent = ({ editBookId }: DashboardPageContentProps) => {
  const params = useParams();
  const routeBookId = params?.id as string | undefined;
  const activeEditBookId = editBookId ?? routeBookId;
  const [isAddOpen, setAddOpen] = useState(false);
  const router = useRouter();
  const { data } = useBooks();

  const editingBook = useMemo(
    () => data?.data.find((book) => book._id === activeEditBookId),
    [data?.data, activeEditBookId],
  );

  return (
    <div>
      <DashboardHeader onAdd={() => setAddOpen(true)} />
      <DashboardTable />

      <AddBook
        key={isAddOpen ? "add-open" : "add-closed"}
        open={isAddOpen}
        onClose={() => setAddOpen(false)}
      />

      <EditBook
        key={editingBook?._id ?? activeEditBookId ?? "no-edit"}
        open={Boolean(activeEditBookId)}
        onClose={() => router.push("/dashboard")}
        book={editingBook ?? undefined}
      />
    </div>
  );
};

export default DashboardPageContent;
