"use client";

import { useMutation } from "@tanstack/react-query";

import type { ApiSuccess } from "@/lib/fetch";
import { jsonFetch } from "@/lib/fetch";
import type { ApiError } from "@/types/auth-types";
import { Task } from "@/types/task-types";

export function useCreateTask() {
  return useMutation<ApiSuccess<Task>, ApiError, Task>({
    mutationFn: async (payload) =>
      jsonFetch<Task>("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      }),
  });
}
