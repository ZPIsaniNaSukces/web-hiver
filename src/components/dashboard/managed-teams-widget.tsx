"use client";

import { useRouter } from "next/navigation";

import { useManagedTeams } from "@/app/(app)/dashboard/hooks/use-managed-teams";
import { Button } from "@/components/ui/button";

import { Widget } from "./widget";

export function ManagedTeamsWidget() {
  const router = useRouter();
  const { data, isLoading, error } = useManagedTeams();

  const teams = data?.data?.teams ?? [];

  const handleTeamClick = (teamId: string) => {
    router.push(`/teams/${teamId}`);
  };

  const handleViewAllClick = () => {
    router.push("/teams");
  };

  return (
    <Widget size="1x1">
      <div className="flex h-full flex-col justify-between gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        <h2 className="text-foreground shrink-0 text-xs font-semibold sm:text-sm md:text-sm lg:text-lg xl:text-xl">
          Moje zespoły
        </h2>
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto text-xs sm:text-sm">
          {isLoading ? (
            <p className="text-muted-foreground text-center">Ładowanie...</p>
          ) : error ? (
            <p className="text-destructive text-center">Błąd wczytywania</p>
          ) : teams.length === 0 ? (
            <p className="text-muted-foreground text-center">Brak zespołów</p>
          ) : (
            teams.map((team) => (
              <button
                key={team.id}
                onClick={() => handleTeamClick(team.id)}
                className="hover:bg-muted flex items-center justify-between rounded px-2 py-2 text-left"
              >
                <span className="truncate font-medium">{team.name}</span>
                <span className="text-muted-foreground ml-2 text-xs">
                  {team.memberCount}
                </span>
              </button>
            ))
          )}
        </div>
        <Button
          onClick={handleViewAllClick}
          className="w-full shrink-0 text-xs sm:text-sm"
          size="default"
          disabled={isLoading}
        >
          Zobacz zespoły
        </Button>
      </div>
    </Widget>
  );
}
