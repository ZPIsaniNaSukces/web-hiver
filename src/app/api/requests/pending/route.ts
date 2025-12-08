import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, BACKEND_URL } from "@/config/constants";
import { parseCookie } from "@/lib/cookie-utils";

export async function GET(req: NextRequest) {
  const rawCookie = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = parseCookie(rawCookie);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Backend doesn't have /requests/pending endpoint yet
  // Using /requests/availability and filtering pending requests for managers
  const backendUrl = new URL("/requests/availability", BACKEND_URL);

  const res = await fetch(backendUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  // Filter for pending requests and count them
  if (Array.isArray(data)) {
    const pendingCount = data.filter(
      (req: any) => req.status === "PENDING",
    ).length;
    return NextResponse.json({ pendingCount }, { status: res.status });
  }

  return NextResponse.json({ pendingCount: 0 }, { status: res.status });
}
