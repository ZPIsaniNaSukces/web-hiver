import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, BACKEND_URL } from "@/config/constants";
import { parseCookie } from "@/lib/cookie-utils";

export async function POST(req: NextRequest) {
  const rawCookie = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = parseCookie(rawCookie);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Nieprawidłowe dane" },
      { status: 400 },
    );
  }

  const backendUrl = new URL("/users/register", BACKEND_URL);

  const res = await fetch(backendUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  return NextResponse.json(data, { status: res.status });
}
