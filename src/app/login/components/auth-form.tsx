"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useAuth } from "../hooks/useAuth";

const AuthForm = () => {
  const { authData, setAuthData, fetchLogin } = useAuth();
  const router = useRouter();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: fetchLogin,
    onSuccess: () => {
      router.push("/");
    },
    onError: (error: any) => {
      alert(error?.error || "Login failed");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-items-start gap-6"
    >
      <h1 className="text-3xl font-semibold">Zaloguj się</h1>
      <Input
        placeholder="Email"
        value={authData.login}
        onChange={(e) => setAuthData({ ...authData, login: e.target.value })}
      />
      <Input
        placeholder="Hasło"
        type="password"
        value={authData.password}
        onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
      />
      <Button type="submit" disabled={isPending}>
        Zaloguj się
      </Button>
    </form>
  );
};

export { AuthForm };
