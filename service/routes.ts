export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://takshahub.onrender.com";

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/backend/auth/register",
    LOGIN: "/api/backend/auth/login",
    ME: "/api/backend/auth/profile",
    LOGOUT: "/api/backend/auth/logout",
  },
};
