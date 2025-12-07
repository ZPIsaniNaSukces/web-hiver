import z from "zod";

import { Role } from "@/config/enums";

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
  name: z
    .string()
    .trim()
    .min(2, "Imię musi mieć co najmniej 2 znaki")
    .max(64, "Imię może mieć maksymalnie 64 znaki"),
  surname: z
    .string()
    .trim()
    .min(2, "Nazwisko musi mieć co najmniej 2 znaki")
    .max(64, "Nazwisko może mieć maksymalnie 64 znaki"),
  title: z
    .string()
    .trim()
    .min(2, "Stanowisko musi mieć co najmniej 2 znaki")
    .max(100, "Stanowisko może mieć maksymalnie 100 znaków"),
  bossId: z
    .number()
    .int("Identyfikator przełożonego musi być liczbą całkowitą")
    .positive("Identyfikator przełożonego musi być dodatni")
    .optional(),
});
export type CreateUserType = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
  email: z.string().email("Podaj poprawny adres e-mail"),
  name: z
    .string()
    .trim()
    .min(2, "Imię musi mieć co najmniej 2 znaki")
    .max(64, "Imię może mieć maksymalnie 64 znaki"),
  surname: z
    .string()
    .trim()
    .min(2, "Nazwisko musi mieć co najmniej 2 znaki")
    .max(64, "Nazwisko może mieć maksymalnie 64 znaki"),
  bossId: z
    .number()
    .int("Identyfikator przełożonego musi być liczbą całkowitą")
    .positive("Identyfikator przełożonego musi być dodatni")
    .nullable(),
  phone: z
    .string()
    .trim()
    .min(5, "Podaj poprawny numer telefonu")
    .max(32, "Numer telefonu jest zbyt długi")
    .regex(/^[0-9+()\s-]+$/, "Podaj poprawny numer telefonu")
    .nullable(),
  role: z.nativeEnum(Role),
  title: z
    .string()
    .trim()
    .min(2, "Stanowisko musi mieć co najmniej 2 znaki")
    .max(100, "Stanowisko może mieć maksymalnie 100 znaków")
    .nullable(),
  dateOfBirth: z
    .string()
    .trim()
    .regex(
      /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
      "Podaj poprawną datę w formacie RRRR-MM-DD",
    )
    .nullable(),
});
export type UpdateUserType = z.infer<typeof UpdateUserSchema>;
