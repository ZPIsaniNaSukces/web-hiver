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

  const backendUrl = new URL("/teams/managed", BACKEND_URL);

  const res = await fetch(backendUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  // Transform backend response to match expected format
  if (Array.isArray(data)) {
    const teams = data.map((team: any) => ({
      id: team.id.toString(),
      name: team.name,
      memberCount: team.usersCount || 0,
    }));
    return NextResponse.json({ teams }, { status: res.status });
  }

  return NextResponse.json({ teams: [] }, { status: res.status });
}
