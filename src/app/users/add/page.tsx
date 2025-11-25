"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { UserSelect } from "@/components/users/user-select";
import type { User } from "@/types/auth-types";
import { CreateUserSchema } from "@/types/user-list-types";

import { BackArrow } from "../components/back-arrow";
import { useCreateUser } from "../hooks/use-create-user";

type FormValues = {
  email: string;
};

type FormErrors = Partial<Record<"email" | "bossId", string>>;

export default function AddUserPage() {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({
    email: "",
  });
  const [selectedBoss, setSelectedBoss] = useState<User | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const createUserMutation = useCreateUser();
  const isSubmitting = createUserMutation.isPending;

  const resetForm = () => {
    setValues({ email: "" });
    setSelectedBoss(null);
    setErrors({});
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = values.email.trim();
    const bossIdNumber = selectedBoss ? Number(selectedBoss.id) : undefined;

    if (selectedBoss && Number.isNaN(bossIdNumber)) {
      setErrors((prev) => ({ ...prev, bossId: "Niepoprawny przełożony" }));
      toast.error("Popraw błędy w formularzu");
      return;
    }

    const result = CreateUserSchema.safeParse({
      email: trimmedEmail,
      bossId: bossIdNumber,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        bossId: fieldErrors.bossId?.[0],
      });
      toast.error("Popraw błędy w formularzu");
      return;
    }

    setErrors({});

    createUserMutation.mutate(result.data, {
      onSuccess: (response) => {
        toast.success("Użytkownik został dodany");
        resetForm();

        const createdUserId = response?.data?.id;
        if (createdUserId) {
          router.push(`/users/${createdUserId}`);
        } else {
          router.push("/users");
        }
      },
      onError: (error) => {
        toast.error(error?.error ?? "Nie udało się dodać użytkownika");
      },
    });
  };

  const handleBossChange = (boss: User | null) => {
    setSelectedBoss(boss);
    setErrors((prev) => ({ ...prev, bossId: undefined }));
  };

  return (
    <div className="mx-4 space-y-6 md:mr-8 md:ml-0">
      <BackArrow />
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Dodaj pracownika</h1>
        <p className="text-sm text-gray-500">
          Uzupełnij dane nowego pracownika. Pola oznaczone gwiazdką są
          obowiązkowe.
        </p>
      </div>

      <form
        className="overflow-hidden rounded-xl border bg-white shadow-sm"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="grid gap-6 px-6 py-6">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Adres e-mail*
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="np. jan.kowalski@example.com"
              value={values.email}
              onChange={(event) => {
                const nextValue = event.target.value;
                setValues((prev) => ({ ...prev, email: nextValue }));
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p id="email-error" className="text-destructive text-sm">
                {errors.email}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">
              Przełożony
            </span>
            <UserSelect
              value={selectedBoss}
              onChange={handleBossChange}
              disabled={isSubmitting}
              error={errors.bossId}
              placeholder="Wybierz przełożonego"
              searchPlaceholder="Szukaj po nazwisku, mailu..."
              emptyOptionLabel="Brak przełożonego"
            />
            <span className="text-xs text-gray-400">
              Wybierz przełożonego z listy lub pozostaw puste, jeśli jesteś
              przełożonym.
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t bg-gray-50 px-6 py-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Spinner className="size-4" />
                Zapisywanie...
              </span>
            ) : (
              "Dodaj pracownika"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
