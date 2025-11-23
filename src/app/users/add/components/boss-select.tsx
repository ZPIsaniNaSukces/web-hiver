"use client";

import type { UserSelectProps } from "@/components/users/user-select";
import { UserSelect } from "@/components/users/user-select";

export function BossSelect(props: UserSelectProps) {
  return (
    <UserSelect
      placeholder="Wybierz przełożonego"
      searchPlaceholder="Szukaj po nazwisku, mailu..."
      emptyOptionLabel="Brak przełożonego"
      {...props}
    />
  );
}
