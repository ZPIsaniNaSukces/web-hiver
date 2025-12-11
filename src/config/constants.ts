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
  {
    pattern: /^\/users\/add$/,
    roles: [Role.ADMIN],
  },
  {
    pattern: /^\/users\/[\w-]+\/edit$/,
    roles: [Role.ADMIN],
  },
  {
    pattern: /^\/teams\/add$/,
    roles: [Role.ADMIN],
  },
  {
    pattern: /^\/(dashboard|requests|tasks|teams|users)(?:\/|$)/,
    roles: [Role.ADMIN, Role.MANAGER],
  },
];

// Environment variables with defaults
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
export const BACKEND_FOR_FRONTEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_FOR_FRONTEND_URL ?? "http://localhost:3000";
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const USE_HTTPS = process.env.USE_HTTPS === "true";

const AUTH_QK = ["auth", "session"] as const;
