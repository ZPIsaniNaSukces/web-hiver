import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, BACKEND_URL } from "@/config/constants";
import { parseCookie } from "@/lib/cookie-utils";
import { ErrorBody } from "@/types/auth-types";

const DEFAULT_ERROR = "Nie udało się zaktualizować statusu zadania";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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

  const backendUrl = new URL(`/tasks/${id}/done`, BACKEND_URL);

  const contentType = req.headers.get("content-type") || undefined;
  const body = contentType ? await req.text() : undefined;

  const res = await fetch(backendUrl, {
    method: "PATCH",
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
