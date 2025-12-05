import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, BACKEND_URL } from "@/config/constants";
import { parseCookie } from "@/lib/cookie-utils";
import { ErrorBody } from "@/types/auth-types";

type RequestResource = "availability" | "general";
type RequestAction = "approve" | "reject";

const DEFAULT_ERROR = "Nie udało się zaktualizować wniosku";

export async function forwardRequestAction(
  req: NextRequest,
  id: string,
  resource: RequestResource,
  action: RequestAction,
) {
  if (!id) {
    return NextResponse.json(
      { error: "Brakuje identyfikatora wniosku" },
      { status: 400 },
    );
  }

  const rawCookie = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = parseCookie(rawCookie);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = new URL(
    `/requests/${resource}/${id}/${action}`,
    BACKEND_URL,
  );

  const contentType = req.headers.get("content-type") || undefined;
  const body = contentType ? await req.text() : undefined;

  const res = await fetch(backendUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      ...(contentType ? { "Content-Type": contentType } : {}),
    },
    cache: "no-store",
    body,
  });

  if (!res.ok) {
    let err: ErrorBody = {};
    try {
      err = await res.json();
    } catch {}

    const msg = err.message || err.error || DEFAULT_ERROR;
    return NextResponse.json({ error: msg }, { status: res.status || 400 });
  }

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
