"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiSuccess } from "@/lib/fetch";
import { jsonFetch } from "@/lib/fetch";

type ApiError = { error: string; status: number };

export interface ManagedTeamData {
  id: string;
  name: string;
  memberCount: number;
}

export interface ManagedTeamsData {
  teams: ManagedTeamData[];
}

export function useManagedTeams() {
  return useQuery<ApiSuccess<ManagedTeamsData>, ApiError>({
    queryKey: ["managed-teams"],
    queryFn: () => jsonFetch<ManagedTeamsData>("/api/teams/managed"),
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 * 5, // refetch every 5 minutes
  });
}
