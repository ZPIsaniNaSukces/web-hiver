import { Role } from "./enums";

export const AUTH_COOKIE_NAME = "auth_token";
export const PUBLIC_PATH_PREFIXES = [
  "/login",
  "/_next",
  "/public",
  "/favicon.ico",
  "/",
];
export const ROUTE_PERMISSIONS: Record<string, Role[]> = {
  "/dashboard": [Role.ADMIN, Role.MANAGER],
  "/users/add": [Role.ADMIN],
  "/users/[id]/edit": [Role.ADMIN],
  "/teams/add": [Role.ADMIN],
};
export const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";
export const BACKEND_FOR_FRONTEND_URL =
  process.env.BACKEND_FOR_FRONTEND_URL || "http://localhost:3000";

const AUTH_QK = ["auth", "session"] as const;
