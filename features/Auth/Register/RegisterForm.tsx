"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { registerSchema } from "./RegisterValidation";
import type { RegisterFormData } from "@/types/auth";
import { useRegister } from "@/hooks/auth/useAuth";

import { TextField, Button } from "@/components/UI";
import { Status } from "@/types/ui";

const RegisterForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const [status, setStatus] = useState<{
    name: Status;
    email: Status;
    password: Status;
  }>({
    name: "info",
    email: "info",
    password: "info",
  });

  const registerMutation = useRegister(
    (backendErrors: Record<string, string>) => {
      setErrors(backendErrors);

      setStatus({
        name: backendErrors?.name ? "error" : "success",
        email: backendErrors?.email ? "error" : "success",
        password: backendErrors?.password ? "error" : "success",
      });
    },
  );

  const validateField = (
    field: "name" | "email" | "password",
    value: string,
  ) => {
    const result = registerSchema.shape[field].safeParse(value);

    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        [field]: result.error.issues[0].message,
      }));

      setStatus((prev) => ({
        ...prev,
        [field]: "error",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));

      setStatus((prev) => ({
        ...prev,
        [field]: value ? "success" : "info",
      }));
    }
  };

  const handleChange =
    (field: "name" | "email" | "password") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      validateField(field, value);
    };

  const onSubmit = async () => {
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as "name" | "email" | "password";

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);

      setStatus({
        name: fieldErrors.name ? "error" : status.name,
        email: fieldErrors.email ? "error" : status.email,
        password: fieldErrors.password ? "error" : status.password,
      });

      return;
    }

    setErrors({});

    try {
      await registerMutation.mutateAsync(formData);
      router.replace("/dashboard");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="w-full min-[850px]:w-[70%] flex items-center justify-center h-full p-6 ">
      <div className="w-full max-w-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex flex-col gap-5"
        >
          <TextField
            label="Name"
            type="text"
            name="name"
            required
            maxLength={100}
            placeholder="Name"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange("name")}
            color={errors.name ? "error" : status.name}
            error={errors.name || ""}
          />
          <TextField
            label="Email"
            type="email"
            name="email"
            required
            maxLength={100}
            placeholder="Email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange("email")}
            color={errors.email ? "error" : status.email}
            error={errors.email || ""}
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            placeholder="Password"
            required
            maxLength={100}
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange("password")}
            color={errors.password ? "error" : status.password}
            error={errors.password || ""}
          />

          <Button
            type="submit"
            size="md"
            isLoading={registerMutation.isPending}
            className="w-full"
          >
            Create account
          </Button>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              prefetch={false}
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
