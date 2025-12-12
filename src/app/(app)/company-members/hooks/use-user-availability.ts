"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiSuccess } from "@/lib/fetch";
import { jsonFetch } from "@/lib/fetch";
import type { AvailabilityRequest } from "@/types/request-types";
import { RequestStatus } from "@/types/request-types";

type ApiError = { error: string; status: number };

type UseUserAvailabilityParams = {
  userId?: string;
  status?: RequestStatus;
};

export function useUserAvailability({
  userId,
  status = RequestStatus.APPROVED,
}: UseUserAvailabilityParams) {
  return useQuery<ApiSuccess<AvailabilityRequest[]>, ApiError>({
    queryKey: ["userAvailability", userId, status],
    enabled: Boolean(userId),
    queryFn: async () => {
      if (!userId) {
        throw {
          error: "Brakuje identyfikatora użytkownika",
          status: 400,
        } satisfies ApiError;
      }

      const searchParams = new URLSearchParams();
      searchParams.set("userId", userId);
      if (status) {
        searchParams.set("status", status);
      }

      return jsonFetch<AvailabilityRequest[]>(
        `/api/requests/availability?${searchParams}`,
      );
    },
    staleTime: 1000 * 30,
    select: (data) => {
      const payload = (() => {
        const raw = data.data;

        if (Array.isArray(raw)) {
          return raw;
        }

        if (raw && typeof raw === "object") {
          const rawObj = raw as Record<string, unknown>;

          if ("buckets" in rawObj && rawObj.buckets) {
            const bucketContainer = rawObj.buckets as Record<
              string,
              AvailabilityRequest[]
            >;
            return bucketContainer.accepted || bucketContainer.approved || [];
          }

          if ("accepted" in rawObj || "approved" in rawObj) {
            const maybeBuckets = rawObj as Record<
              string,
              AvailabilityRequest[]
            >;
            return maybeBuckets.accepted || maybeBuckets.approved || [];
          }
        }

        return [] as AvailabilityRequest[];
      })();

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      const filtered = payload.filter((req: AvailabilityRequest) => {
        if (userId && String(req.userId) !== String(userId)) {
          return false;
        }
        if (status && req.status !== status) {
          return false;
        }

        const datePart = req.date.split("T")[0];
        const dateObj = new Date(`${datePart}T00:00:00`);
        return (
          dateObj.getFullYear() === currentYear &&
          dateObj.getMonth() === currentMonth
        );
      });

      return {
        ...data,
        data: filtered,
      } satisfies ApiSuccess<AvailabilityRequest[]>;
    },
  });
}
