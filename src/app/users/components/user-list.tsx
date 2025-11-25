import { cn } from "@/lib/utils";
import type { User } from "@/types/auth-types";

import { UserRow } from "./user-row";

type UserListProps = {
  users: User[];
  className?: string;
};

function UserList({ users, className }: UserListProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-white shadow-sm",
        className,
      )}
    >
      <div className="hidden bg-zinc-50 px-6 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase sm:grid sm:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1fr)_auto]">
        <span>Imię i nazwisko</span>
        <span className="text-left">Adres e-mail</span>
        <span>Stanowisko</span>
        <span className="text-right">Szczegóły</span>
      </div>

      <ul role="list" className="divide-y divide-gray-100">
        {users.map((user) => (
          <UserRow key={user.id} user={user} />
        ))}
      </ul>
    </div>
  );
}

export { UserList };
