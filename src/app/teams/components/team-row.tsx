import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { getInitials } from "@/app/users/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { TeamSummary } from "@/types/team-types";

type TeamRowProps = {
  team: TeamSummary;
};

export function TeamRow({ team }: TeamRowProps) {
  const leader = team.leader;

  return (
    <li className="grid grid-cols-1 gap-4 px-6 py-4 text-sm text-gray-700 sm:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-4">
      <div className="flex items-center gap-3">
        <Avatar className="size-12">
          <AvatarFallback>
            {leader ? getInitials(leader.name, leader.surname) : "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-gray-900">
            {leader ? `${leader.name} ${leader.surname}` : "Brak lidera"}
          </p>
          {leader?.email && (
            <p className="text-xs text-gray-500">{leader.email}</p>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-600">{team.name}</div>

      <div className="flex flex-col pr-8 text-sm text-gray-600 sm:justify-self-end sm:text-right">
        <span className="text-xs text-gray-500 sm:hidden">Liczba członków</span>
        <span>{team.usersCount ?? 0}</span>
      </div>

      <div className="flex items-center justify-start gap-2 sm:justify-start">
        <span className="text-xs text-gray-500 sm:hidden">Szczegóły</span>
        <Button
          asChild
          type="button"
          variant="ghost"
          size="sm"
          className="text-amber-500 transition hover:text-amber-600"
          aria-label={`Przejdź do szczegółów zespołu ${team.name}`}
        >
          <Link href={`/teams/${team.id}`}>
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>
    </li>
  );
}
