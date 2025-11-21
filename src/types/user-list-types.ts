import z from "zod";

import { User } from "./auth-types";

export type UsersPage = {
  data: User[];
  meta: UsersMeta;
};

export type UsersMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export const CreateUserSchema = z.object({
  email: z.string().email("Podaj poprawny adres e-mail"),
  bossId: z
    .number()
    .int("Identyfikator przełożonego musi być liczbą całkowitą")
    .positive("Identyfikator przełożonego musi być dodatni")
    .optional(),
  companyId: z
    .number()
    .int("Identyfikator firmy musi być liczbą całkowitą")
    .positive("Identyfikator firmy musi być dodatni"),
});
export type CreateUserType = z.infer<typeof CreateUserSchema>;
