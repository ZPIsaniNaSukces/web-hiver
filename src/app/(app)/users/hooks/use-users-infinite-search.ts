"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { ApiSuccess, jsonFetch } from "@/lib/fetch";
import { UsersPage } from "@/types/user-list-types";

function buildUrl(
  base: string,
  params: Record<string, string | number | undefined>,
) {
  const url = new URL(
    base,
    typeof window === "undefined" ? "http://localhost" : window.location.origin,
  );

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.pathname + url.search;
}

export function useUsersInfiniteSearch(search: string) {
  const limit = 10;

  return useInfiniteQuery<
    ApiSuccess<UsersPage>,
    { error: string; status: number }
  >({
    queryKey: ["users", search],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const url = buildUrl("/api/users", {
        page: pageParam as number,
        limit,
        search: search || undefined,
      });

      return jsonFetch<UsersPage>(url);
    },
    getNextPageParam: (lastPage) => {
      const { meta } = lastPage.data;
      const hasNextExplicit =
        typeof meta.hasNextPage === "boolean" ? meta.hasNextPage : null;
      const hasNextDerived = meta.total > meta.page * meta.limit;
      const hasNext = hasNextExplicit ?? hasNextDerived;

      return hasNext ? meta.page + 1 : undefined;
    },
  });
}
