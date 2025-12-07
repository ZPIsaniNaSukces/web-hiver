"use client";

import { UserSelect } from "@/components/users/user-select";
import type { UserSelectProps } from "@/components/users/user-select";
import type { User } from "@/types/auth-types";

type TeamMembersSelectProps = Omit<
  UserSelectProps,
  "multiple" | "value" | "onChange"
> & {
  value: User[];
  onChange: (users: User[]) => void;
};

export function TeamMembersSelect({
  value,
  onChange,
  placeholder = "Dodaj członków zespołu",
  searchPlaceholder = "Szukaj użytkownika...",
  emptyOptionLabel = "Wyczyść wybór",
  allowEmptyOption = true,
  ...rest
}: TeamMembersSelectProps) {
  return (
    <UserSelect
      multiple
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyOptionLabel={emptyOptionLabel}
      allowEmptyOption={allowEmptyOption}
      {...rest}
    />
  );
}
