"use client";

import { useMutation } from "@tanstack/react-query";

import type { ApiSuccess } from "@/lib/fetch";
import { jsonFetch } from "@/lib/fetch";
import type { ApiError, User } from "@/types/auth-types";
import type { CreateUserType } from "@/types/user-list-types";

export function useCreateUser() {
  return useMutation<ApiSuccess<User>, ApiError, CreateUserType>({
    mutationFn: async (payload) =>
      jsonFetch<User>("/api/users/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      }),
  });
}
