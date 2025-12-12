"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { BackArrow } from "@/app/(app)/company-members/components/back-arrow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { UserSelect } from "@/components/users/user-select";
import type { User } from "@/types/auth-types";
import { CreateTeamSchema } from "@/types/team-types";

import { useCreateTeam } from "../hooks/use-create-team";
import { TeamMembersSelect } from "./components/team-members-select";

type FormValues = {
  name: string;
};

type FormErrors = Partial<Record<"name" | "leaderId" | "memberIds", string>>;

export default function AddTeamPage() {
  const router = useRouter();

  const [values, setValues] = useState<FormValues>({
    name: "",
  });
  const [selectedLeader, setSelectedLeader] = useState<User | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  const createTeamMutation = useCreateTeam();
  const isSubmitting = createTeamMutation.isPending;

  const resetForm = () => {
    setValues({ name: "" });
    setSelectedLeader(null);
    setSelectedMembers([]);
    setErrors({});
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = values.name.trim();
    const leaderIdNumber = selectedLeader
      ? Number(selectedLeader.id)
      : undefined;
    const memberIdsNumbers = selectedMembers.map((member) => Number(member.id));

    const hasInvalidMemberId = memberIdsNumbers.some((id) => Number.isNaN(id));

    if (hasInvalidMemberId) {
      setErrors((prev) => ({
        ...prev,
        memberIds: "Niepoprawni członkowie zespołu",
      }));
      toast.error("Popraw błędy w formularzu");
      return;
    }

    const uniqueMemberIds = Array.from(new Set(memberIdsNumbers));

    if (selectedLeader && Number.isNaN(leaderIdNumber)) {
      setErrors((prev) => ({ ...prev, leaderId: "Niepoprawny lider" }));
      toast.error("Popraw błędy w formularzu");
      return;
    }

    const result = CreateTeamSchema.safeParse({
      name: trimmedName,
      leaderId: leaderIdNumber,
      memberIds: uniqueMemberIds.length > 0 ? uniqueMemberIds : undefined,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        leaderId: fieldErrors.leaderId?.[0],
        memberIds: fieldErrors.memberIds?.[0],
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

  const handleMembersChange = (members: User[]) => {
    setSelectedMembers(members);
    setErrors((prev) => ({ ...prev, memberIds: undefined }));
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

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">
              Członkowie zespołu
            </span>
            <TeamMembersSelect
              value={selectedMembers}
              onChange={handleMembersChange}
              disabled={isSubmitting}
              error={errors.memberIds}
              placeholder="Dodaj członków zespołu"
              searchPlaceholder="Szukaj członka..."
              emptyOptionLabel="Wyczyść wybór"
            />
            <span className="text-xs text-gray-400">
              Wybierz osoby, które mają dołączyć do zespołu już teraz.
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
