"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { jsonFetch } from "@/lib/fetch";
import type { ApiError } from "@/types/auth-types";

export type RequestAction = "approve" | "reject";
export type RequestResource = "availability" | "general";

export type RequestActionVariables = {
  id: number | string;
  action: RequestAction;
  payload?: Record<string, unknown>;
};

const buildEndpoint = (
  resource: RequestResource,
  id: number | string,
  action: RequestAction,
) => `/api/requests/${resource}/${id}/${action}`;

const createRequestActionHook = (resource: RequestResource) => {
  return () => {
    const queryClient = useQueryClient();

    return useMutation<unknown, ApiError, RequestActionVariables>({
      mutationFn: async ({ id, action, payload }) => {
        const body = payload ? JSON.stringify(payload) : undefined;

        return jsonFetch(buildEndpoint(resource, id, action), {
          method: "POST",
          headers: body
            ? {
                "Content-Type": "application/json",
              }
            : undefined,
          body,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["requests", resource] });
      },
    });
  };
};

export const useAvailabilityRequestActions =
  createRequestActionHook("availability");
export const useGeneralRequestActions = createRequestActionHook("general");

export type UseAvailabilityRequestActionsResult = ReturnType<
  typeof useAvailabilityRequestActions
>;
export type UseGeneralRequestActionsResult = ReturnType<
  typeof useGeneralRequestActions
>;
