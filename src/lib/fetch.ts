"use client";

export type ApiSuccess<T> = { data: T; status: number };

export async function clientFetch<T = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<ApiSuccess<T>> {
  const res = await fetch(input, {
    credentials: "same-origin",
    cache: "no-store",
    ...init,
  });

  const fallbackStatus = res.status;

  let json: any = null;
  try {
    json = await res.json();
  } catch {}

  if (res.ok) {
    return { data: json as T, status: fallbackStatus };
  }

  const message = (json && (json.error || json.message)) || "Request failed";
  const normalizedStatus =
    typeof json?.status === "number"
      ? json.status
      : typeof json?.statusCode === "number"
        ? json.statusCode
        : fallbackStatus;

  throw { error: String(message), status: normalizedStatus };
}

export const jsonFetch = clientFetch;
