"use client";

import { useEffect, useState } from "react";
import { useCreateBook } from "@/hooks/books/useBooks";
import { TextField, Button, Modal } from "@/components/UI";
import type { BookStatus } from "@/types/books";

interface AddBookProps {
  open: boolean;
  onClose: () => void;
}

const AddBook = ({ open, onClose }: AddBookProps) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    tags: "",
    status: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createBook = useCreateBook((backendErrors) => {
    setErrors(backendErrors);
  });

  useEffect(() => {
    if (!open) return;

    setFormData({
      title: "",
      author: "",
      tags: "",
      status: "",
    });
    setErrors({});
  }, [open]);

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

    if (!validateForm()) {
      return;
    }

    const payload = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      status: formData.status
        ? (formData.status.trim() as BookStatus)
        : undefined,
    };

    try {
      await createBook.mutateAsync(payload);
      onClose();
    } catch {
      // Error handling is managed by the hook.
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Book">
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
            isLoading={createBook.isPending}
            className="w-full sm:w-auto"
          >
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddBook;
