"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { TaskStatus } from "@/config/enums";
import type { ApiSuccess } from "@/lib/fetch";
import { jsonFetch } from "@/lib/fetch";
import type { TasksPage } from "@/types/task-types";

const DEFAULT_LIMIT = 10;

type BuildUrlParams = Record<string, string | number | undefined>;

function buildUrl(base: string, params: BuildUrlParams) {
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

export function useTasksInfinite({
  status,
  limit = DEFAULT_LIMIT,
}: {
  status: TaskStatus;
  limit?: number;
}) {
  return useInfiniteQuery<
    ApiSuccess<TasksPage>,
    { error: string; status: number }
  >({
    queryKey: ["tasks", "status", status],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const url = buildUrl(`/api/tasks/status/${status}`, {
        page: pageParam as number,
        limit,
      });

      return jsonFetch<TasksPage>(url);
    },
    getNextPageParam: (lastPage) => {
      const { meta } = lastPage.data;

      return meta.hasNextPage ? meta.page + 1 : undefined;
    },
  });
}

export type UseTasksInfiniteResult = ReturnType<typeof useTasksInfinite>;
