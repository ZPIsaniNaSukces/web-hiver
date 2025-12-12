"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiSuccess } from "@/lib/fetch";
import { jsonFetch } from "@/lib/fetch";
import type { Task } from "@/types/task-types";

type ApiError = { error: string; status: number };

type TaskListType = "assigned" | "reported";

type UseUserTasksParams = {
  userId?: string;
  type?: TaskListType;
};

export function useUserTasks({
  userId,
  type = "assigned",
}: UseUserTasksParams) {
  return useQuery<ApiSuccess<Task[]>, ApiError>({
    queryKey: ["userTasks", userId, type],
    enabled: Boolean(userId),
    queryFn: async () => {
      if (!userId) {
        throw {
          error: "Brakuje identyfikatora użytkownika",
          status: 400,
        } satisfies ApiError;
      }

      const searchParams = new URLSearchParams();
      if (type) {
        searchParams.set("type", type);
      }

      const suffix = searchParams.toString() ? `?${searchParams}` : "";

      return jsonFetch<Task[]>(`/api/tasks/user/${userId}${suffix}`);
    },
    staleTime: 1000 * 30,
  });
}
