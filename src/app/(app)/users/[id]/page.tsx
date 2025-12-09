"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";

import { useAuth } from "@/app/login/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DataStateWrapper } from "@/components/ui/data-state-wrapper";
import { TaskStatus } from "@/config/enums";

import { TaskCard } from "../../tasks/components/task-element";
import { BackArrow } from "../components/back-arrow";
import { UserAvailabilityCalendar } from "../components/user-availability-calendar";
import { useUserAvailability } from "../hooks/use-user-availability";
import { useUserDetails } from "../hooks/use-user-details";
import { useUserTasks } from "../hooks/use-user-tasks";
import { formatRole, getInitials } from "../utils";

export default function UserDetailsPage() {
  const params = useParams<{ id: string }>();
  const userId = params?.id;
  const { isAdmin } = useAuth();

  const { data, isLoading, isError, error } = useUserDetails(userId);

  const user = data?.data;
  const {
    data: tasksData,
    isLoading: isTasksLoading,
    isError: isTasksError,
    error: tasksError,
  } = useUserTasks({ userId, type: "assigned" });

  const {
    data: availabilityData,
    isLoading: isAvailabilityLoading,
    isError: isAvailabilityError,
  } = useUserAvailability({ userId });

  const todoTasks = (tasksData?.data ?? []).filter(
    (task) => task.status === TaskStatus.TODO,
  );

  const approvedRequests = availabilityData?.data ?? [];

  return (
    <div className="mx-4 space-y-6 md:mr-8 md:ml-0">
      <div className="flex items-center justify-between">
        <BackArrow />
        {userId && isAdmin && (
          <Button asChild size="sm">
            <Link href={`/users/${userId}/edit`}>Edytuj</Link>
          </Button>
        )}
      </div>

      <DataStateWrapper
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.error}
        hasData={Boolean(user)}
        emptyFallback={<span>Nie znaleziono danych użytkownika.</span>}
      >
        {user && (
          <>
            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
              <div className="flex flex-col gap-6 px-6 py-6 sm:flex-row sm:items-center">
                <Avatar className="size-20">
                  <AvatarFallback className="text-2xl">
                    {getInitials(user.name, user.surname)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-xl font-semibold text-gray-900">
                    {user.name} {user.surname}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user.title ?? "Brak stanowiska"}
                  </p>
                  <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                    {formatRole(user.role)}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 border-t border-gray-100 px-6 py-6 sm:grid-cols-2">
                <DetailRow label="Adres e-mail" value={user.email} />
                <DetailRow label="Telefon" value={user.phone?.trim() || "—"} />
                <DetailRow label="Stanowisko" value={user.title ?? "—"} />
                <DetailRow label="Rola" value={formatRole(user.role)} />
                <DetailRow
                  label="Data urodzenia"
                  value={formatDateOfBirth(user.dateOfBirth)}
                />
                <DetailRow
                  label="Przełożony"
                  value={
                    user.boss ? (
                      <Link
                        href={`/users/${user.boss.id}`}
                        className="hover:underline"
                      >
                        {user.boss?.name} {user.boss?.surname}
                      </Link>
                    ) : (
                      "—"
                    )
                  }
                />
                <div className="sm:col-span-2">
                  <DetailRow
                    label="Zespoły"
                    value={
                      user.teams?.length
                        ? user.teams.map((team) => team.name).join(", ")
                        : "—"
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <div className="px-4 py-5 sm:px-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Zadania użytkownika
                  </h2>
                  <Link
                    href={"/tasks"}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    Przejdź do zadań
                  </Link>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:px-6">
                  <DataStateWrapper
                    isLoading={isTasksLoading}
                    isError={isTasksError}
                    errorMessage={tasksError?.error}
                    hasData={todoTasks.length > 0}
                    emptyFallback={
                      <span className="text-sm text-gray-500">
                        Brak zadań w statusie TODO.
                      </span>
                    }
                  >
                    <div className="space-y-3">
                      {todoTasks.map((task) => (
                        <TaskCard key={task.id} task={task} layout="compact" />
                      ))}
                    </div>
                  </DataStateWrapper>
                </div>
              </section>

              {!isAvailabilityLoading && !isAvailabilityError && (
                <UserAvailabilityCalendar
                  requests={approvedRequests}
                  className="h-full"
                />
              )}
            </div>
          </>
        )}
      </DataStateWrapper>
    </div>
  );
}

type DetailRowProps = {
  label: string;
  value: ReactNode;
};

function formatDateOfBirth(value: string | null | undefined) {
  if (!value) {
    return "—";
  }

  const normalized = value.split("T")[0] ?? value;
  const [year, month, day] = normalized.split("-");

  if (year && month && day) {
    return `${day}.${month}.${year}`;
  }

  return normalized;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">
        {label}
      </span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}
