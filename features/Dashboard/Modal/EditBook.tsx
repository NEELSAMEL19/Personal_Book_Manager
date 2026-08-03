"use client";

import { useEffect, useState } from "react";
import { useUpdateBook } from "@/hooks/books/useBooks";
import { TextField, Button, Modal } from "@/components/UI";
import type { Book, BookStatus } from "@/types/books";

interface EditBookProps {
  open: boolean;
  onClose: () => void;
  book?: Book;
}

const EditBook = ({ open, onClose, book }: EditBookProps) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    tags: "",
    status: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateBook = useUpdateBook((backendErrors) => {
    setErrors(backendErrors);
  });

  useEffect(() => {
    if (!open) return;

    setFormData({
      title: book?.title ?? "",
      author: book?.author ?? "",
      tags: book?.tags?.join(", ") ?? "",
      status: book?.status ?? "",
    });
    setErrors({});
  }, [book, open]);

  const handleChange = (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      nextErrors.title = "Title is required.";
    }

    if (!formData.author.trim()) {
      nextErrors.author = "Author is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!book) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    const updatePayload = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      ...(formData.tags
        ? {
            tags: formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
          }
        : {}),
      ...(formData.status
        ? { status: formData.status.trim() as BookStatus }
        : {}),
    };

    try {
      await updateBook.mutateAsync({
        id: book._id,
        data: updatePayload,
      });
      onClose();
    } catch {
      // Error handling is managed by the hook.
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Book">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          label="Title"
          name="title"
          placeholder="Book title"
          required
          value={formData.title}
          onChange={handleChange("title")}
          error={errors.title}
        />
        <TextField
          label="Author"
          name="author"
          placeholder="Author name"
          required
          value={formData.author}
          onChange={handleChange("author")}
          error={errors.author}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Tags"
            name="tags"
            placeholder="tag1, tag2"
            value={formData.tags}
            onChange={handleChange("tags")}
          />
          <TextField
            label="Status"
            name="status"
            placeholder="want to read / reading / completed"
            value={formData.status}
            onChange={handleChange("status")}
          />
        </div>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={updateBook.isPending}
            className="w-full sm:w-auto"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditBook;
