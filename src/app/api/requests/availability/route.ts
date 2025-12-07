import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, BACKEND_URL } from "@/config/constants";
import { parseCookie } from "@/lib/cookie-utils";
import { categorizeRequests, normalizeRequestUsers } from "@/lib/request-utils";
import { ErrorBody } from "@/types/auth-types";
import { AvailabilityRequest } from "@/types/request-types";

export async function GET(req: NextRequest) {
  const rawCookie = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = parseCookie(rawCookie);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = new URL("/requests/availability", BACKEND_URL);

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

    const msg = err.message || err.error || "Nie udało się pobrać wniosków";
    return NextResponse.json({ error: msg }, { status: res.status || 400 });
  }

  let payload: AvailabilityRequest[] = [];
  try {
    const json = await res.json();
    payload = Array.isArray(json) ? normalizeRequestUsers(json) : [];
  } catch {}

  const categorized = categorizeRequests(payload);

  return NextResponse.json(
    {
      buckets: categorized,
    },
    { status: res.status || 200 },
  );
}
