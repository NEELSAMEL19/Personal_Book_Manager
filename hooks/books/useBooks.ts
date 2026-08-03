"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { booksApi } from "@/service/books";

import type {
  CreateBookPayload,
  CreateBookResponse,
  GetBooksFilters,
  GetBooksResponse,
  UpdateBookPayload,
  UpdateBookResponse,
  DeleteBookResponse,
} from "@/types/books";

import { handleError } from "@/utils/toast";
import type { FieldErrors } from "@/types/ui";

// ---------------- LIST (with filters) ----------------
export const useBooks = (filters?: GetBooksFilters) => {
  return useQuery<GetBooksResponse>({
    queryKey: ["books", filters],
    queryFn: () => booksApi.getAll(filters),
  });
};

// ---------------- CREATE ----------------
export const useCreateBook = (onFieldError?: (errors: FieldErrors) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookPayload) => booksApi.create(data),

    onSuccess: async (response: CreateBookResponse) => {
      await queryClient.invalidateQueries({ queryKey: ["books"] });
      return response;
    },

    onError: (error) => {
      handleError(error, "Failed to add book", onFieldError);
    },
  });
};

// ---------------- UPDATE ----------------
export const useUpdateBook = (onFieldError?: (errors: FieldErrors) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookPayload }) =>
      booksApi.update(id, data),

    onSuccess: async (response: UpdateBookResponse) => {
      await queryClient.invalidateQueries({ queryKey: ["books"] });
      return response;
    },

    onError: (error) => {
      handleError(error, "Failed to update book", onFieldError);
    },
  });
};

// ---------------- DELETE ----------------
export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => booksApi.delete(id),

    onSuccess: async (response: DeleteBookResponse) => {
      await queryClient.invalidateQueries({ queryKey: ["books"] });
      return response;
    },

    onError: (error) => {
      handleError(
        error,
        "Failed to delete book",
        error ? undefined : undefined,
      );
    },
  });
};
