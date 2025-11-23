import { cn } from "@/lib/utils";
import type { TeamSummary } from "@/types/team-types";

import { TeamRow } from "./team-row";

type TeamListProps = {
  teams: TeamSummary[];
  className?: string;
};

export function TeamList({ teams, className }: TeamListProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-white shadow-sm",
        className,
      )}
    >
      <div className="hidden bg-zinc-50 px-6 py-3 text-xs font-medium tracking-wide text-gray-500 uppercase sm:grid sm:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-4">
        <span>Lider</span>
        <span>Nazwa</span>
        <span className="justify-self-end text-left">Liczba członków</span>
        <span className="justify-self-end text-right">Szczegóły</span>
      </div>

      <ul role="list" className="divide-y divide-gray-100">
        {teams.map((team) => (
          <TeamRow key={team.id} team={team} />
        ))}
      </ul>
    </div>
  );
}
