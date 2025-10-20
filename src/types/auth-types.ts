import { Role } from "@/config/enums";

type SessionPayload = {
  accessToken: string;
  refreshToken: string;
  user?: User;
  expires: number;
};

type User = {
  id: string;
  email: string;
  name?: string;
  secondName?: string;
  image?: string;
  roles: Role[];
};

export type LoginResponse = {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  user: {
    id: number;
    name: string;
    surname: string;
    email: string;
    role: Role;
    phone: string | null;
    teamId: number;
    companyId: number;
  };
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
