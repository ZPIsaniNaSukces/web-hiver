"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiSuccess } from "@/lib/fetch";
import { jsonFetch } from "@/lib/fetch";

type ApiError = { error: string; status: number };

export interface RequestsPendingData {
  pendingCount: number;
}

export function useRequestsPending() {
  return useQuery<ApiSuccess<RequestsPendingData>, ApiError>({
    queryKey: ["requests-pending"],
    queryFn: () => jsonFetch<RequestsPendingData>("/api/requests/pending"),
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 * 5, // refetch every 5 minutes
  });
}
