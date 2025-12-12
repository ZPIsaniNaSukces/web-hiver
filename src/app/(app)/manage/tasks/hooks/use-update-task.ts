"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiSuccess, jsonFetch } from "@/lib/fetch";
import { ApiError } from "@/types/auth-types";
import { Task } from "@/types/task-types";

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation<
    ApiSuccess<Task>,
    ApiError,
    { id: number; data: Partial<Task> }
  >({
    mutationFn: async ({ id, data }) =>
      jsonFetch<Task>(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", "status", "DONE"],
      });
      queryClient.invalidateQueries({ queryKey: ["tasks", "status", "TODO"] });
    },
  });
}
