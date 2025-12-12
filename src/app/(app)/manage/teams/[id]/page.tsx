"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { BackArrow } from "@/app/(app)/company-members/components/back-arrow";
import { formatRole, getInitials } from "@/app/(app)/company-members/utils";
import { useAuth } from "@/app/login/hooks/useAuth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DataStateWrapper } from "@/components/ui/data-state-wrapper";

import { useTeamDetails } from "../hooks/use-team-details";

export default function TeamDetailsPage() {
  const params = useParams<{ id: string }>();
  const teamId = params?.id;
  const { isAdmin } = useAuth();

  const { data, isLoading, isError, error } = useTeamDetails(teamId);

  const team = data?.data;
  const members = team?.users ?? [];

  return (
    <div className="mx-4 mt-4 space-y-6 md:mr-8 md:ml-0">
      <div className="flex items-center justify-between">
        <BackArrow href="/manage/teams" label="Wróć do listy zespołów" />
        {teamId && isAdmin && (
          <Button asChild size="sm">
            <Link href={`/manage/teams/${teamId}/edit`}>Edytuj</Link>
          </Button>
        )}
      </div>

      <DataStateWrapper
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.error}
        hasData={Boolean(team)}
        emptyFallback={<span>Nie znaleziono danych zespołu.</span>}
      >
        {team && (
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="grid gap-6 px-6 py-6 md:grid-cols-[auto_1fr] md:items-center">
              <div className="flex items-center gap-4">
                <Avatar className="size-20">
                  <AvatarFallback className="text-2xl">
                    {team.leader
                      ? getInitials(team.leader.name, team.leader.surname)
                      : team.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-xl font-semibold text-gray-900">
                    {team.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Firma: {team.companyId}
                  </p>
                  <p className="text-sm text-gray-500">
                    Liczba członków: {team.usersCount}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">Lider</p>
                {team.leader ? (
                  <div className="flex flex-col gap-1 text-sm text-gray-600">
                    <span className="font-medium text-gray-900">
                      {team.leader.name} {team.leader.surname}
                    </span>
                    <span>{team.leader.email}</span>
                    <span className="text-xs text-gray-500">
                      {formatRole(team.leader.role)}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Brak przypisanego lidera.
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 px-6 py-6">
              <Accordion type="single" collapsible defaultValue="members">
                <AccordionItem value="members">
                  <AccordionTrigger>
                    Członkowie ({members.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    {members.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        Ten zespół nie ma jeszcze członków.
                      </p>
                    ) : (
                      <ul className="divide-y divide-gray-100">
                        {members.map((member) => (
                          <li
                            key={member.id}
                            className="flex flex-col gap-1 py-3 text-sm text-gray-700 md:flex-row md:items-center md:justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="size-10">
                                <AvatarFallback>
                                  {getInitials(member.name, member.surname)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {member.name} {member.surname}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {member.email}
                                </p>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 md:text-sm">
                              {formatRole(member.role)}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        )}
      </DataStateWrapper>
    </div>
  );
}
