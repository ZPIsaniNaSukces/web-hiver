"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiSuccess } from "@/lib/fetch";
import { jsonFetch } from "@/lib/fetch";
import type { TeamDetails } from "@/types/team-types";

type ApiError = { error: string; status: number };

export function useTeamDetails(teamId?: string) {
  return useQuery<ApiSuccess<TeamDetails>, ApiError>({
    queryKey: ["team", teamId],
    enabled: Boolean(teamId),
    queryFn: async () => {
      if (!teamId) {
        throw {
          error: "Brak identyfikatora zespołu",
          status: 400,
        } satisfies ApiError;
      }

      return jsonFetch<TeamDetails>(`/api/teams/${teamId}`);
    },
    staleTime: 1000 * 30,
  });
}
