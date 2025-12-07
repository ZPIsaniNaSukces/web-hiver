import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, BACKEND_URL } from "@/config/constants";
import { parseCookie } from "@/lib/cookie-utils";
import { ErrorBody } from "@/types/auth-types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ message: "Missing user id" }, { status: 400 });
  }

  const rawCookie = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = parseCookie(rawCookie);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = new URL(`/tasks/user/${userId}`, BACKEND_URL);

  req.nextUrl.searchParams.forEach((value, key) => {
    backendUrl.searchParams.set(key, value);
  });

  const res = await fetch(backendUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let err: ErrorBody = {};
    try {
      err = await res.json();
    } catch {}
    const msg = err.message || "Something went wrong";
    return NextResponse.json({ error: msg }, { status: res.status || 400 });
  }

  const data = await res.json().catch(() => null);

  return NextResponse.json(data, { status: res.status });
}
