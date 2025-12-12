"use client";

import Link from "next/link";

import { useAuth } from "@/app/login/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { DataStateWrapper } from "@/components/ui/data-state-wrapper";

import { TeamList } from "./components/team-list";
import { useTeams } from "./hooks/use-teams";

export default function TeamsPage() {
  const { data, isLoading, isError, error } = useTeams();
  const { isAdmin } = useAuth();

  const teams = data?.data ?? [];

  return (
    <div className="h-full flex-1">
      <div className="mx-4 mt-4 h-full space-y-4 overflow-y-auto md:mr-8 md:ml-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Zespoły</h1>
          {isAdmin ? (
            <Button asChild>
              <Link href="/manage/teams/add">Dodaj</Link>
            </Button>
          ) : null}
        </div>
        <DataStateWrapper
          isLoading={isLoading}
          isError={isError}
          errorMessage={error?.error}
          hasData={teams.length > 0}
          emptyFallback={<span>Brak zespołów do wyświetlenia.</span>}
        >
          <TeamList teams={teams} />
        </DataStateWrapper>
      </div>
    </div>
  );
}
