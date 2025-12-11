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

  // Fetch both availability and general requests
  const availabilityUrl = new URL("/requests/availability", BACKEND_URL);
  const generalUrl = new URL("/requests/general", BACKEND_URL);

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/json",
  };

  const [availabilityRes, generalRes] = await Promise.all([
    fetch(availabilityUrl, {
      method: "GET",
      headers,
      cache: "no-store",
    }),
    fetch(generalUrl, {
      method: "GET",
      headers,
      cache: "no-store",
    }),
  ]);

  const availabilityData = await availabilityRes.json().catch(() => null);
  const generalData = await generalRes.json().catch(() => null);

  let pendingCount = 0;

  // Count pending availability requests (from requests array in response)
  if (availabilityData?.requests && Array.isArray(availabilityData.requests)) {
    pendingCount += availabilityData.requests.filter(
      (req: any) => req.status === "PENDING",
    ).length;
  }

  // Count pending general requests
  if (Array.isArray(generalData)) {
    pendingCount += generalData.filter(
      (req: any) => req.status === "PENDING",
    ).length;
  }

  return NextResponse.json(
    { pendingCount },
    { status: availabilityRes.ok ? 200 : availabilityRes.status },
  );
}
