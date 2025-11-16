import { SessionPayload } from "@/types/auth-types";

export function parseCookie(raw: string | undefined): SessionPayload | null {
  if (!raw) return null;
  try {
    const decoded = JSON.parse(decodeURIComponent(raw)) as SessionPayload;
    if (!decoded.accessToken) return null;
    return decoded;
  } catch {
    return null;
  }
}
