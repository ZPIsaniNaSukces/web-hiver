"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiSuccess } from "@/lib/fetch";
import { jsonFetch } from "@/lib/fetch";
import {
  QueryParams,
  type RequestBuckets,
  buildParamsMeta,
} from "@/lib/request-utils";
import type { ApiError } from "@/types/auth-types";
import type {
  AvailabilityRequest,
  GeneralRequest,
} from "@/types/request-types";

type RequestsBucketsResponse<T> = {
  buckets: RequestBuckets<T>;
};

const createRequestsHook = <T>(resource: "availability" | "general") => {
  return (params?: QueryParams) => {
    const meta = buildParamsMeta(params);

    return useQuery<ApiSuccess<RequestsBucketsResponse<T>>, ApiError>({
      queryKey: ["requests", resource, meta.key],
      queryFn: () =>
        jsonFetch<RequestsBucketsResponse<T>>(
          `/api/requests/${resource}${meta.search}`,
        ),
      staleTime: 60 * 1000,
    });
  };
};

export const useAvailabilityRequests =
  createRequestsHook<AvailabilityRequest>("availability");
export const useGeneralRequests = createRequestsHook<GeneralRequest>("general");

export type UseAvailabilityRequestsResult = ReturnType<
  typeof useAvailabilityRequests
>;
export type UseGeneralRequestsResult = ReturnType<typeof useGeneralRequests>;
