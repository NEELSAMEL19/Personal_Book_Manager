import { useId, type ChangeEvent } from "react";
import type React from "react";
import { Search } from "lucide-react";

interface ToolbarProps {
  searchable: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  tableId: string;
  filters?: React.ReactNode;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  searchable,
  searchQuery,
  onSearchChange,
  tableId,
  filters,
}) => {
  const inputId = useId();

  if (!filters && !searchable) return null;

  return (
    <div className="rounded-t-xl px-4 py-3 backdrop-blur-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {filters && <div className="flex-1">{filters}</div>}

        {searchable && (
          <div className="relative w-full sm:ml-auto sm:w-80">
            <label htmlFor={inputId} className="sr-only">
              Search
            </label>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400"
              aria-hidden="true"
            />
            <input
              id={inputId}
              type="search"
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onSearchChange(e.target.value)
              }
              placeholder="Search books, authors, tags..."
              aria-controls={tableId}
              className="w-full rounded-lg border border-blue-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};
