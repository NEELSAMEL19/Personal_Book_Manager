"use client";

import { apiClient } from "./client";
import { API_ENDPOINTS } from "./routes";
import type {
  CreateBookPayload,
  CreateBookResponse,
  DeleteBookResponse,
  GetBooksFilters,
  GetBooksResponse,
  UpdateBookPayload,
  UpdateBookResponse,
} from "@/types/books";

export const booksApi = {
  create: (payload: CreateBookPayload) =>
    apiClient
      .post<CreateBookResponse>(API_ENDPOINTS.BOOKS.CREATE, payload)
      .then((res) => res.data),

  getAll: (filters?: GetBooksFilters) =>
    apiClient
      .get<GetBooksResponse>(API_ENDPOINTS.BOOKS.GET_ALL, { params: filters })
      .then((res) => res.data),

  update: (id: string, payload: UpdateBookPayload) =>
    apiClient
      .patch<UpdateBookResponse>(API_ENDPOINTS.BOOKS.UPDATE(id), payload)
      .then((res) => res.data),

  delete: (id: string) =>
    apiClient
      .delete<DeleteBookResponse>(API_ENDPOINTS.BOOKS.DELETE(id))
      .then((res) => res.data),
};
