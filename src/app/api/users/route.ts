import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, BACKEND_URL } from "@/config/constants";
import { parseCookie } from "@/lib/cookie-utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "10";
  const search = searchParams.get("search") ?? "";

  const rawCookie = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = parseCookie(rawCookie);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = new URL("/users", BACKEND_URL);
  backendUrl.searchParams.set("page", page);
  backendUrl.searchParams.set("limit", limit);
  if (search) backendUrl.searchParams.set("search", search);

  const res = await fetch(backendUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  return NextResponse.json(data, { status: res.status });
}
