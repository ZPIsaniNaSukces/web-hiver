"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiSuccess } from "@/lib/fetch";
import { jsonFetch } from "@/lib/fetch";
import type { TeamsResponse } from "@/types/team-types";

type ApiError = { error: string; status: number };

export function useTeams() {
  return useQuery<ApiSuccess<TeamsResponse>, ApiError>({
    queryKey: ["teams"],
    queryFn: () => jsonFetch<TeamsResponse>("/api/teams"),
    staleTime: 1000 * 60,
  });
}
