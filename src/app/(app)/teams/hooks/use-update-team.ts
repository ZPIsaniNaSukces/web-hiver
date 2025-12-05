"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ApiSuccess } from "@/lib/fetch";
import { jsonFetch } from "@/lib/fetch";
import type { ApiError } from "@/types/auth-types";
import type { TeamDetails, UpdateTeamType } from "@/types/team-types";

export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiSuccess<TeamDetails>,
    ApiError,
    { teamId: number | string; data: UpdateTeamType }
  >({
    mutationFn: async ({ teamId, data }) =>
      jsonFetch<TeamDetails>(`/api/teams/${teamId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["team", String(variables.teamId)],
      });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}
