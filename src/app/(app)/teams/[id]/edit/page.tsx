"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { BackArrow } from "@/app/(app)/users/components/back-arrow";
import { Button } from "@/components/ui/button";
import { DataStateWrapper } from "@/components/ui/data-state-wrapper";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { UserSelect } from "@/components/users/user-select";
import type { User } from "@/types/auth-types";
import { CreateTeamSchema } from "@/types/team-types";

import { TeamMembersSelect } from "../../add/components/team-members-select";
import { useTeamDetails } from "../../hooks/use-team-details";
import { useUpdateTeam } from "../../hooks/use-update-team";

type FormValues = {
  name: string;
};

type FormErrors = Partial<Record<"name" | "leaderId" | "memberIds", string>>;

export default function EditTeamPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const teamId = params?.id;

  const { data, isLoading, isError, error } = useTeamDetails(teamId);
  const team = data?.data;

  const [values, setValues] = useState<FormValues>({ name: "" });
  const [selectedLeader, setSelectedLeader] = useState<User | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!team) {
      return;
    }

    setValues({ name: team.name });
    setSelectedLeader(team.leader);
    setSelectedMembers(team.users ?? []);
  }, [team]);

  const updateTeamMutation = useUpdateTeam();
  const isSubmitting = updateTeamMutation.isPending;

  const handleLeaderChange = (leader: User | null) => {
    setSelectedLeader(leader);
    setErrors((prev) => ({ ...prev, leaderId: undefined }));
  };

  const handleMembersChange = (members: User[]) => {
    setSelectedMembers(members);
    setErrors((prev) => ({ ...prev, memberIds: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!teamId) {
      toast.error("Brak identyfikatora zespołu");
      return;
    }

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

    if (selectedLeader && Number.isNaN(leaderIdNumber)) {
      setErrors((prev) => ({ ...prev, leaderId: "Niepoprawny lider" }));
      toast.error("Popraw błędy w formularzu");
      return;
    }

    const uniqueMemberIds = Array.from(new Set(memberIdsNumbers));

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

    updateTeamMutation.mutate(
      { teamId, data: result.data },
      {
        onSuccess: (response) => {
          toast.success("Zespół został zaktualizowany");
          router.push(`/teams/${response?.data?.id ?? teamId}`);
        },
        onError: (mutationError) => {
          toast.error(
            mutationError?.error ?? "Nie udało się zaktualizować zespołu",
          );
        },
      },
    );
  };

  return (
    <div className="mx-4 space-y-6 md:mr-8 md:ml-0">
      <BackArrow
        href={`/teams/${teamId ?? ""}`}
        label="Wróć do szczegółów zespołu"
      />
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Edytuj zespół</h1>
        <p className="text-sm text-gray-500">
          Zaktualizuj dane zespołu i zarządzaj jego członkami.
        </p>
      </div>

      <DataStateWrapper
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.error}
        hasData={Boolean(team)}
        emptyFallback={<span>Nie znaleziono danych zespołu.</span>}
      >
        <form
          className="overflow-hidden rounded-xl border bg-white shadow-sm"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="grid gap-6 px-6 py-6">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
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
                disabled={isSubmitting || !team}
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
                disabled={isSubmitting || !team}
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
                disabled={isSubmitting || !team}
                error={errors.memberIds}
                placeholder="Dodaj członków zespołu"
                searchPlaceholder="Szukaj członka..."
                emptyOptionLabel="Wyczyść wybór"
              />
              <span className="text-xs text-gray-400">
                Wybierz osoby, które należą do zespołu.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t bg-gray-50 px-6 py-4">
            <Button type="submit" disabled={isSubmitting || !team}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Spinner className="size-4" />
                  Zapisywanie...
                </span>
              ) : (
                "Zapisz zmiany"
              )}
            </Button>
          </div>
        </form>
      </DataStateWrapper>
    </div>
  );
}
