export type BookStatus = "to-read" | "reading" | "read";

export interface Book {
  _id: string;
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookPayload {
  title: string;
  author: string;
  tags?: string[];
  status?: BookStatus;
}

export interface UpdateBookPayload {
  title?: string;
  author?: string;
  tags?: string[];
  status?: BookStatus;
}

export interface GetBooksFilters {
  status?: BookStatus;
  tag?: string;
}

export interface CreateBookResponse {
  success: boolean;
  message: string;
  data: Book;
}

export interface GetBooksResponse {
  success: boolean;
  message: string;
  data: Book[];
}

export interface UpdateBookResponse {
  success: boolean;
  message: string;
  data: Book;
}

export interface DeleteBookResponse {
  success: boolean;
  message: string;
}

export interface BookFormData {
  title: string;
  author: string;
  tags?: string[];
  status?: BookStatus;
}
