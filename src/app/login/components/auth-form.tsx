"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ApiError, LoginSchema, LoginValues } from "@/types/auth-types";

import { useAuth } from "../hooks/useAuth";

export function AuthForm() {
  const router = useRouter();
  const { login, loginMutation } = useAuth();

  const [values, setValues] = useState<LoginValues>({
    email: "",
    password: "",
  });
  const [errs, setErrs] = useState<Partial<Record<keyof LoginValues, string>>>(
    {},
  );

  const isPending = loginMutation.isPending;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const r = LoginSchema.safeParse(values);
    if (!r.success) {
      const fe = r.error.flatten().fieldErrors;
      setErrs({ email: fe.email?.[0], password: fe.password?.[0] });
      toast.error("Popraw błędy w formularzu");
      return;
    }

    setErrs({});
    login(values, {
      onSuccess: () => {
        toast.success("Zalogowano pomyślnie");
        router.push("/");
      },
      onError: (err: unknown) => {
        const e = err as ApiError | undefined;
        toast.error(e?.error ?? "Nie udało się zalogować");
      },
    });
  };

  return (
    <form
      onSubmit={submit}
      className="flex w-full flex-col items-center gap-10 pt-16"
      noValidate
    >
      <div className="flex w-full flex-col items-start justify-start gap-6">
        <h1 className="text-3xl font-semibold">Zaloguj się</h1>

        <div className="flex w-full flex-col items-start gap-1">
          <Input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={values.email}
            onChange={(e) =>
              setValues((s) => ({ ...s, email: e.target.value }))
            }
            aria-invalid={!!errs.email}
            aria-describedby={errs.email ? "email-error" : undefined}
          />
          {errs.email && (
            <p id="email-error" className="text-destructive text-sm">
              {errs.email}
            </p>
          )}
        </div>

        <div className="flex w-full flex-col items-start gap-1">
          <Input
            type="password"
            placeholder="Hasło"
            autoComplete="current-password"
            value={values.password}
            onChange={(e) =>
              setValues((s) => ({ ...s, password: e.target.value }))
            }
            aria-invalid={!!errs.password}
            aria-describedby={errs.password ? "password-error" : undefined}
          />
          {errs.password && (
            <p id="password-error" className="text-destructive text-sm">
              {errs.password}
            </p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="max-w-min">
        {isPending ? (
          <p className="flex items-center gap-2">
            <Spinner /> Logowanie...
          </p>
        ) : (
          "Zaloguj się"
        )}
      </Button>
    </form>
  );
}
