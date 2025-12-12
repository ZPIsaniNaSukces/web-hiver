import { Role } from "./enums";

export const AUTH_COOKIE_NAME = "auth_token";
export const PUBLIC_PATH_PREFIXES = [
  "/login",
  "/_next",
  "/public",
  "/favicon.ico",
  "/",
];

export type RoutePermission = {
  pattern: RegExp;
  roles: Role[];
};

export const ROUTE_PERMISSIONS: RoutePermission[] = [
  // Specific Admin-only routes (must come first)
  {
    pattern: /^\/company-members\/add$/,
    roles: [Role.ADMIN],
  },
  {
    pattern: /^\/company-members\/[\w-]+\/edit$/,
    roles: [Role.ADMIN],
  },
  {
    pattern: /^\/manage\/teams\/add$/,
    roles: [Role.ADMIN],
  },
  // General access for Admin and Manager to all app sections
  {
    pattern: /^\/(dashboard|manage|company-members)(?:\/|$)/,
    roles: [Role.ADMIN, Role.MANAGER],
  },
];

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
export const BACKEND_FOR_FRONTEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_FOR_FRONTEND_URL ?? "http://localhost:3000";
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const USE_HTTPS = process.env.USE_HTTPS === "true";

const AUTH_QK = ["auth", "session"] as const;
