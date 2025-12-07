"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiSuccess } from "@/lib/fetch";
import { jsonFetch } from "@/lib/fetch";
import type { AttendanceHourData } from "@/types/widget-types";

type ApiError = { error: string; status: number };

export function useAttendanceStats() {
  return useQuery<ApiSuccess<AttendanceHourData[]>, ApiError>({
    queryKey: ["attendance-stats"],
    queryFn: () =>
      jsonFetch<AttendanceHourData[]>("/api/checkincheckout/stats"),
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60 * 5,
  });
}
