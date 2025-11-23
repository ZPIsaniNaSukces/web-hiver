"use client";

import { useMutation } from "@tanstack/react-query";

import type { ApiSuccess } from "@/lib/fetch";
import { jsonFetch } from "@/lib/fetch";
import type { ApiError } from "@/types/auth-types";
import type { CreateTeamType, TeamDetails } from "@/types/team-types";

export function useCreateTeam() {
  return useMutation<ApiSuccess<TeamDetails>, ApiError, CreateTeamType>({
    mutationFn: async (payload) =>
      jsonFetch<TeamDetails>("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      }),
  });
}
