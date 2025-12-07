"use client";

import type { UserSelectProps } from "@/components/users/user-select";
import { UserSelect } from "@/components/users/user-select";

export function AssigneeSelect(props: UserSelectProps) {
  return (
    <UserSelect
      placeholder="Przypisz do..."
      searchPlaceholder="Szukaj użytkownika..."
      emptyOptionLabel="Brak przypisanego"
      {...props}
    />
  );
}
