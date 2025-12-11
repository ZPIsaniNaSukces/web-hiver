"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiSuccess } from "@/lib/fetch";
import { jsonFetch } from "@/lib/fetch";

type ApiError = { error: string; status: number };

export interface SubordinateData {
  id: string;
  name: string;
  email: string;
  teamName: string;
  avatar?: string;
  status: "available" | "unavailable" | "on-leave";
}

export interface SubordinatesData {
  subordinates: SubordinateData[];
  managerTeamId: number | null;
}

export function useSubordinates() {
  return useQuery<ApiSuccess<SubordinatesData>, ApiError>({
    queryKey: ["subordinates"],
    queryFn: () => jsonFetch<SubordinatesData>("/api/users/subordinates"),
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 * 5, // refetch every 5 minutes
  });
}
