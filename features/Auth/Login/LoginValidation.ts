import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter email") // ✅ handles empty
    .email("Invalid email address"), // ✅ handles format

  password: z
    .string()
    .min(1, "Please enter password")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
