"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/service/auth";

import type {
  ProfileResponse,
  LoginPayload,
  RegisterPayload,
  LoginResponse,
  RegisterResponse,
} from "@/types/auth";

import { handleError } from "@/utils/toast";
import type { FieldErrors } from "@/types/ui";

// ---------------- REGISTER ----------------
export const useRegister = (onFieldError?: (errors: FieldErrors) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterPayload) => authApi.register(data),

    onSuccess: async (response: RegisterResponse) => {
      queryClient.clear();

      await queryClient.invalidateQueries({
        queryKey: ["me"],
      });

      return response;
    },

    onError: (error) => {
      handleError(error, "Registration failed", onFieldError);
    },
  });
};

// ---------------- LOGIN ----------------
export const useLogin = (onFieldError?: (errors: FieldErrors) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),

    onSuccess: async (response: LoginResponse) => {
      queryClient.clear();

      // Fetch the newly logged-in user's data fresh
      await queryClient.invalidateQueries({
        queryKey: ["me"],
      });

      return response;
    },

    onError: (error) => {
      handleError(error, "Login failed", onFieldError);
    },
  });
};

// ---------------- LOGOUT ----------------
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),

    onSuccess: (response) => {
      queryClient.clear();
      window.location.href = "/login";
    },

    onError: (error) => {
      queryClient.clear();
      window.location.href = "/login";
      handleError(error, "Logout failed");
    },
  });
};

// ---------------- ME ----------------
export const useMe = () => {
  return useQuery<ProfileResponse>({
    queryKey: ["me"],
    queryFn: authApi.me,

    retry: false,

    // Auth data should always be fresh
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};
