import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/auth-types";

import { formatRole, getInitials } from "../utils";

type UserRowProps = {
  user: User;
};

function UserRow({ user }: UserRowProps) {
  const href = `/users/${user.id}`;

  return (
    <li className="grid grid-cols-1 gap-4 px-6 py-4 text-sm text-gray-700 sm:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1fr)_auto] sm:items-center">
      <div className="flex items-center gap-3">
        <Avatar className="size-12">
          <AvatarFallback className="bg-amber-100 text-amber-700">
            {getInitials(user.name, user.surname)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-gray-900">
            {user.name} {user.surname}
          </p>
          <p className="text-xs text-gray-500 sm:hidden">
            {formatRole(user.title ?? "unknown")}
          </p>
        </div>
      </div>

      <div className="text-sm text-gray-600">{user.email}</div>

      <div className="hidden text-sm text-gray-600 sm:block">
        {formatRole(user.title ?? "unknown")}
      </div>

      <div className="flex items-center justify-start sm:justify-end">
        <Button
          asChild
          type="button"
          variant="ghost"
          size="sm"
          className="text-amber-500 transition hover:text-amber-600"
          aria-label={`Przejdź do szczegółów użytkownika ${user.name} ${user.surname}`}
        >
          <Link href={href}>
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>
    </li>
  );
}

export { UserRow };
