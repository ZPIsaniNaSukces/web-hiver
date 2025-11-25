"use client";

import { useQuery } from "@tanstack/react-query";

import { TaskStatus } from "@/config/enums";
import type { ApiSuccess } from "@/lib/fetch";
import { jsonFetch } from "@/lib/fetch";
import type { TasksResponse } from "@/types/task-types";

export function useTasks({ status }: { status: TaskStatus }) {
  return useQuery<ApiSuccess<TasksResponse>, { error: string; status: number }>(
    {
      queryKey: ["tasks", status],
      queryFn: () => jsonFetch<TasksResponse>(`/api/tasks/status/${status}`),
      staleTime: 1000 * 60,
    },
  );
}

export type UseTasksResult = ReturnType<typeof useTasks>;
