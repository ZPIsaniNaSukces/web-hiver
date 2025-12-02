import z from "zod";

import { Role } from "@/config/enums";

type SessionPayload = {
  accessToken: string;
  refreshToken: string;
  user?: User;
  expires: number;
};

export type User = {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: Role;
  phone: string | null;
  teamIds: number[];
  companyId: number;
  accountStatus?: string | null;
  bossId?: number | null;
  dateOfBirth?: string | null;
  teams?: Array<{ id: number; name: string }>;
  title?: string | null;
  boss?: User | null;
};

export type LoginResponse = {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  user: User;
};

export type { SessionPayload };

export type authPayload = {
  login: string;
  password: string;
};

export type ErrorBody = {
  message?: string;
  error?: string;
  statusCode?: number;
};

export type SessionGetResponse =
  | { isAuthenticated: false }
  | { isAuthenticated: true; user: User };

export const LoginSchema = z.object({
  email: z.string().email("Podaj poprawny adres e-mail"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

export type LoginValues = z.infer<typeof LoginSchema>;
export type ApiError = { error: string; status: number };
