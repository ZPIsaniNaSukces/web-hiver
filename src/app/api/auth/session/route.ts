import { NextRequest, NextResponse } from "next/server";
import { parse } from "path";

import { AUTH_COOKIE_NAME, BACKEND_URL } from "@/config/constants";
import { parseCookie } from "@/lib/cookie-utils";
import { ErrorBody, LoginResponse } from "@/types/auth-types";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      let err: ErrorBody = {};
      try {
        err = await res.json();
      } catch {}
      const msg =
        err.message ||
        (res.status === 401 ? "Invalid credentials" : "Login failed");
      return NextResponse.json({ error: msg }, { status: res.status || 400 });
    }

    const body: LoginResponse = await res.json();

    const accessExpMs = new Date(body.accessTokenExpiresAt).getTime();
    const refreshExp = new Date(body.refreshTokenExpiresAt).getTime();

    const sessionPayload = {
      accessToken: body.accessToken,
      refreshToken: body.refreshToken,
      user: body.user,
      expires: accessExpMs,
    };

    const response = NextResponse.json({
      ok: true,
      user: sessionPayload.user,
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: encodeURIComponent(JSON.stringify(sessionPayload)),
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires: refreshExp,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete({ name: AUTH_COOKIE_NAME, path: "/" });
  return response;
}

export async function GET(req: NextRequest) {
  const rawCookie = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!rawCookie) {
    return NextResponse.json({ error: "No active session" }, { status: 401 });
  }
  const session = parseCookie(rawCookie);
  if (!session) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, user: session.user });
}
