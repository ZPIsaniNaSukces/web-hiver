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
export const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";
export const BACKEND_FOR_FRONTEND_URL =
  process.env.BACKEND_FOR_FRONTEND_URL || "http://localhost:3000";

const AUTH_QK = ["auth", "session"] as const;

export const TASK_COLORS = {
  completed: "#483A2B",
  pending: "#f59e0b",
};
