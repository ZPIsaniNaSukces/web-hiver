"use client";

import type { UserSelectProps } from "@/components/users/user-select";
import { UserSelect } from "@/components/users/user-select";

export function LeaderSelect(props: UserSelectProps) {
  return (
    <UserSelect
      placeholder="Wybierz lidera"
      searchPlaceholder="Szukaj lidera..."
      emptyOptionLabel="Brak lidera"
      {...props}
    />
  );
}
