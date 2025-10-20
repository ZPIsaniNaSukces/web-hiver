import { Role } from "./enums";

export const AUTH_COOKIE_NAME = "auth_token";
export const PUBLIC_PATH_PREFIXES = [
  "/login",
  "/_next",
  "/public",
  "/favicon.ico",
];
export const ROUTE_PERMISSIONS: Record<string, Role[]> = {
  "/dashboard": [Role.ADMIN],
};
export const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3004";
