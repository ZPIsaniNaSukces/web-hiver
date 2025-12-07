"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiSuccess } from "@/lib/fetch";
import { jsonFetch } from "@/lib/fetch";
import type { TasksChartDataPoint } from "@/types/widget-types";

type ApiError = { error: string; status: number };

export function useTasksChart() {
  return useQuery<ApiSuccess<TasksChartDataPoint[]>, ApiError>({
    queryKey: ["tasks-chart"],
    queryFn: () => jsonFetch<TasksChartDataPoint[]>("/api/tasks/chart"),
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60 * 5,
  });
}
