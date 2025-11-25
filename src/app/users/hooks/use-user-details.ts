"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiSuccess } from "@/lib/fetch";
import { jsonFetch } from "@/lib/fetch";
import type { User } from "@/types/auth-types";

type ApiError = { error: string; status: number };

export function useUserDetails(userId?: string) {
  return useQuery<ApiSuccess<User>, ApiError>({
    queryKey: ["user", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      if (!userId) {
        throw {
          error: "Brak identyfikatora użytkownika",
          status: 400,
        } satisfies ApiError;
      }

      return jsonFetch<User>(`/api/users/${userId}`);
    },
    staleTime: 1000 * 30,
  });
}
