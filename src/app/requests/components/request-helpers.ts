import type { User } from "@/types/auth-types";
import { AvailabilityType } from "@/types/request-types";

const DATE_FORMATTER = new Intl.DateTimeFormat("pl-PL", {
  dateStyle: "medium",
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("pl-PL", {
  dateStyle: "medium",
  timeStyle: "short",
});

export const formatDate = (value?: string | null) => {
  if (!value) return "Brak danych";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return DATE_FORMATTER.format(date);
};

export const formatDateTime = (value?: string | null) => {
  if (!value) return "Brak danych";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return DATE_TIME_FORMATTER.format(date);
};

export const formatAvailabilityType = (type?: AvailabilityType) => {
  switch (type) {
    case AvailabilityType.VACATION:
      return "Urlop";
    case AvailabilityType.ONLINE_WORK:
      return "Praca zdalna";
    case AvailabilityType.OFFLINE_WORK:
      return "Praca stacjonarna";
    default:
      return type ?? "Nieznany";
  }
};

export const getUserFullName = (
  user?: Pick<User, "name" | "surname" | "email">,
) => {
  if (!user) return "Nieznany użytkownik";
  const fullName = [user.name, user.surname].filter(Boolean).join(" ");
  return fullName || user.email || "Nieznany użytkownik";
};

export const getUserInitials = (user?: Pick<User, "name" | "surname">) => {
  if (!user) return "?";
  const first = user.name?.[0] ?? "";
  const last = user.surname?.[0] ?? "";
  const initials = `${first}${last}`.trim();
  return initials || "?";
};
