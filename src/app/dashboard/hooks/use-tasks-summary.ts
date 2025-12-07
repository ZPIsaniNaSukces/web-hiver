"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiSuccess } from "@/lib/fetch";
import { jsonFetch } from "@/lib/fetch";
import type { TasksSummaryData } from "@/types/widget-types";

type ApiError = { error: string; status: number };

export function useTasksSummary() {
  return useQuery<ApiSuccess<TasksSummaryData>, ApiError>({
    queryKey: ["tasks-summary"],
    queryFn: () => jsonFetch<TasksSummaryData>("/api/tasks/summary"),
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60 * 5,
  });
}
