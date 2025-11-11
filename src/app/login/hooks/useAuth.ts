import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";

import { authUserAtom, authUserOptimisticAtom } from "@/lib/auth-user-atom";
import { clientFetch } from "@/lib/fetch";
import { User } from "@/types/auth-types";

type LoginInput = { email: string; password: string };
type AuthError = { error: string; status: number };

const AUTH_QK = ["auth", "session"] as const;

export function useAuth() {
  const [user] = useAtom(authUserAtom);
  const setUser = useSetAtom(authUserAtom);
  const setUserOptimistic = useSetAtom(authUserOptimisticAtom);
  const queryClient = useQueryClient();

  const sessionQuery = useQuery<User, AuthError>({
    queryKey: AUTH_QK,
    queryFn: async () => {
      const { data } = await clientFetch<{ ok: true; data: User }>(
        "/api/auth/session",
      );
      return data.data;
    },
    staleTime: 60_000,
    gcTime: 600_000,
    retry: 0,
  });

  useEffect(() => {
    if (sessionQuery.status === "success") {
      setUser(sessionQuery.data ?? null);
    }
    if (sessionQuery.status === "error") {
      setUser(null);
    }
  }, [sessionQuery.status, sessionQuery.data, setUser]);

  const loginMutation = useMutation<User, AuthError, LoginInput>({
    mutationFn: async (input: LoginInput) => {
      setUserOptimistic(null);

      const res = await clientFetch<{ ok: true; data: User }>(
        "/api/auth/session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        },
      );

      return res.data.data;
    },
    onSuccess: (newUser) => {
      setUser(newUser);
      setUserOptimistic(null);
      queryClient.setQueryData(AUTH_QK, newUser);
    },
    onError: () => {
      setUserOptimistic(null);
    },
  });

  const logoutMutation = useMutation<void, AuthError>({
    mutationFn: async () => {
      await clientFetch<{ ok: true }>("/api/auth/session", {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      setUser(null);
      queryClient.removeQueries({ queryKey: AUTH_QK });
    },
  });

  const login = (
    input: LoginInput,
    options?: Parameters<typeof loginMutation.mutate>[1],
  ) => loginMutation.mutate(input, options);
  const logout = (options?: Parameters<typeof logoutMutation.mutate>[1]) =>
    logoutMutation.mutate(undefined, options);

  return {
    user,
    isAuthenticated: !!user,
    sessionQuery,
    loginMutation,
    logoutMutation,
    login,
    logout,
  };
}
