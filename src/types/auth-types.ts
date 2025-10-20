import { Role } from "@/config/enums";

type SessionPayload = {
  accessToken: string;
  user?: User;
  expires: number;
};

export type { SessionPayload };

type User = {
  id: string;
  email: string;
  name?: string;
  secondName?: string;
  image?: string;
  roles: Role[];
};
