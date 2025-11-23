"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { BackArrow } from "@/app/users/components/back-arrow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { UserSelect } from "@/components/users/user-select";
import type { User } from "@/types/auth-types";
import { CreateTeamSchema } from "@/types/team-types";

import { useCreateTeam } from "../hooks/use-create-team";

type FormValues = {
  name: string;
  companyId: string;
};

type FormErrors = Partial<Record<"name" | "companyId" | "leaderId", string>>;

export default function AddTeamPage() {
  const router = useRouter();

  const [values, setValues] = useState<FormValues>({
    name: "",
    companyId: "",
  });
  const [selectedLeader, setSelectedLeader] = useState<User | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const createTeamMutation = useCreateTeam();
  const isSubmitting = createTeamMutation.isPending;

  const resetForm = () => {
    setValues({ name: "", companyId: "" });
    setSelectedLeader(null);
    setErrors({});
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = values.name.trim();
    const companyIdNumber =
      values.companyId.trim() === ""
        ? Number.NaN
        : Number(values.companyId.trim());
    const leaderIdNumber = selectedLeader
      ? Number(selectedLeader.id)
      : undefined;

    if (selectedLeader && Number.isNaN(leaderIdNumber)) {
      setErrors((prev) => ({ ...prev, leaderId: "Niepoprawny lider" }));
      toast.error("Popraw błędy w formularzu");
      return;
    }

    const result = CreateTeamSchema.safeParse({
      name: trimmedName,
      companyId: companyIdNumber,
      leaderId: leaderIdNumber,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        companyId: fieldErrors.companyId?.[0],
        leaderId: fieldErrors.leaderId?.[0],
      });
      toast.error("Popraw błędy w formularzu");
      return;
    }

    setErrors({});

    createTeamMutation.mutate(result.data, {
      onSuccess: (response) => {
        toast.success("Zespół został dodany");
        resetForm();

        const createdTeamId = response?.data?.id;
        if (createdTeamId) {
          router.push(`/teams/${createdTeamId}`);
        } else {
          router.push("/teams");
        }
      },
      onError: (error) => {
        toast.error(error?.error ?? "Nie udało się dodać zespołu");
      },
    });
  };

  const handleLeaderChange = (leader: User | null) => {
    setSelectedLeader(leader);
    setErrors((prev) => ({ ...prev, leaderId: undefined }));
  };

  return (
    <div className="mx-4 space-y-6 md:mr-8 md:ml-0">
      <BackArrow href="/teams" label="Wróć do listy zespołów" />
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Dodaj zespół</h1>
        <p className="text-sm text-gray-500">
          Uzupełnij dane nowego zespołu. Pola oznaczone gwiazdką są obowiązkowe.
        </p>
      </div>

      <form
        className="overflow-hidden rounded-xl border bg-white shadow-sm"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="grid gap-6 px-6 py-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nazwa zespołu*
            </label>
            <Input
              id="name"
              type="text"
              placeholder="np. Dział sprzedaży"
              value={values.name}
              onChange={(event) => {
                const nextValue = event.target.value;
                setValues((prev) => ({ ...prev, name: nextValue }));
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }
              }}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "team-name-error" : undefined}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p id="team-name-error" className="text-destructive text-sm">
                {errors.name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="companyId"
              className="text-sm font-medium text-gray-700"
            >
              Identyfikator firmy*
            </label>
            <Input
              id="companyId"
              type="number"
              min={0}
              step={1}
              placeholder="np. 123"
              value={values.companyId}
              onChange={(event) => {
                const nextValue = event.target.value;
                setValues((prev) => ({ ...prev, companyId: nextValue }));
                if (errors.companyId) {
                  setErrors((prev) => ({ ...prev, companyId: undefined }));
                }
              }}
              aria-invalid={!!errors.companyId}
              aria-describedby={
                errors.companyId ? "team-company-error" : undefined
              }
              disabled={isSubmitting}
            />
            {errors.companyId && (
              <p id="team-company-error" className="text-destructive text-sm">
                {errors.companyId}
              </p>
            )}
            <p className="text-xs text-gray-400">
              Wprowadź identyfikator firmy, do której ma należeć zespół.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">Lider</span>
            <UserSelect
              value={selectedLeader}
              onChange={handleLeaderChange}
              disabled={isSubmitting}
              error={errors.leaderId}
              placeholder="Wybierz lidera"
              searchPlaceholder="Szukaj lidera..."
              emptyOptionLabel="Brak lidera"
            />
            <span className="text-xs text-gray-400">
              Wybierz lidera z listy lub pozostaw puste, jeśli nie dotyczy.
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
              "Dodaj zespół"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
