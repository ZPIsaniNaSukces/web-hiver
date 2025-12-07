import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, BACKEND_URL } from "@/config/constants";
import { parseCookie } from "@/lib/cookie-utils";
import { ErrorBody } from "@/types/auth-types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = (await params).id;

  if (!userId) {
    return NextResponse.json({ message: "Missing user id" }, { status: 400 });
  }

  const rawCookie = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = parseCookie(rawCookie);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = new URL(`/users/${userId}`, BACKEND_URL);

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

  let data = await res.json().catch(() => null);
  console.log("Fetched user data:", data);
  if (data?.bossId) {
    console.log("Fetching boss data for bossId:", data.bossId);
    const backendBossUrl = new URL(`/users/${data?.bossId}`, BACKEND_URL);

    const bossRes = await fetch(backendBossUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (bossRes.ok) {
      const bossData = await bossRes.json().catch(() => null);
      data = { ...data, boss: bossData };
    }
  }

  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = (await params).id;

  if (!userId) {
    return NextResponse.json({ message: "Missing user id" }, { status: 400 });
  }

  const rawCookie = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = parseCookie(rawCookie);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json().catch(() => null);

  const backendUrl = new URL(`/users/${userId}`, BACKEND_URL);

  const res = await fetch(backendUrl, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(payload ?? {}),
  });

  if (!res.ok) {
    let err: ErrorBody = {};
    try {
      err = await res.json();
    } catch {}
    const msg =
      err.message ||
      (res.status === 401 ? "Invalid credentials" : "Update failed");
    return NextResponse.json({ error: msg }, { status: res.status || 400 });
  }

  const data = await res.json().catch(() => null);

  return NextResponse.json(data, { status: res.status });
}
