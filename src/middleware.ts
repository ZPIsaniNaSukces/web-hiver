import { NextRequest, NextResponse } from "next/server";

import {
  AUTH_COOKIE_NAME,
  PUBLIC_PATH_PREFIXES,
  ROUTE_PERMISSIONS,
} from "./config/constants";
import { parseCookie } from "./lib/cookie-utils";
import { SessionPayload } from "./types/auth-types";

function isPublicPath(pathname: string) {
  return PUBLIC_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function getRequiredRoles(pathname: string) {
  const match = ROUTE_PERMISSIONS.find(({ pattern }) => pattern.test(pathname));
  return match?.roles ?? [];
}

function hasAccess(pathname: string, session: SessionPayload | null): boolean {
  if (isPublicPath(pathname)) return true;
  const required = getRequiredRoles(pathname);
  if (required.length === 0) {
    return true;
  }
  if (!session) {
    return false;
  }
  const userRole = session.user?.role;
  return userRole ? required.includes(userRole) : false;
}

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const rawCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = parseCookie(rawCookie);
  const expired = session?.expires && Date.now() > session.expires;

  if (pathname === "/login") {
    if (!session) {
      return NextResponse.next();
    }
    if (expired) {
      const res = NextResponse.next();
      res.cookies.delete(AUTH_COOKIE_NAME);
      return res;
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname === "/") {
    if (session && !expired) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!session || expired) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    const res = NextResponse.redirect(loginUrl);
    if (rawCookie) {
      res.cookies.delete(AUTH_COOKIE_NAME);
    }
    return res;
  }

  if (!hasAccess(pathname, session)) {
    return NextResponse.rewrite(new URL("/error/403", request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-session-token", session.accessToken);
  if (session.user?.id) {
    requestHeaders.set("x-user-id", session.user.id);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
};

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|[^/]+\\.(?:png|svg|jpg|jpeg|gif|webp|ico)).*)",
  ],
  runtime: "nodejs",
};
