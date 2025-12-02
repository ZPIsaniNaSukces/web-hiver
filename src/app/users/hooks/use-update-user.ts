"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ApiSuccess } from "@/lib/fetch";
import { jsonFetch } from "@/lib/fetch";
import type { ApiError, User } from "@/types/auth-types";
import type { UpdateUserType } from "@/types/user-list-types";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiSuccess<User>,
    ApiError,
    { userId: number | string; data: UpdateUserType }
  >({
    mutationFn: async ({ userId, data }) =>
      jsonFetch<User>(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["user", String(variables.userId)],
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
