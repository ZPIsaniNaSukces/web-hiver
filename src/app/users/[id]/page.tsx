"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DataStateWrapper } from "@/components/ui/data-state-wrapper";

import { useUserDetails } from "../hooks/useUserDetails";
import { formatRole, getInitials } from "../utils";

export default function UserDetailsPage() {
  const params = useParams<{ id: string }>();
  const userId = params?.id;

  const { data, isLoading, isError, error } = useUserDetails(userId);

  const user = data?.data;

  return (
    <div className="mx-4 space-y-6 md:mr-8 md:ml-0">
      <Button asChild variant="ghost" size="sm" className="w-fit px-2">
        <Link href="/users" className="flex items-center gap-2">
          <ArrowLeft className="size-4" />
          <span>Wróć do listy</span>
        </Link>
      </Button>

      <DataStateWrapper
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.error}
        hasData={Boolean(user)}
        emptyFallback={<span>Nie znaleziono danych użytkownika.</span>}
      >
        {user && (
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="flex flex-col gap-6 px-6 py-6 sm:flex-row sm:items-center">
              <Avatar className="size-20">
                <AvatarFallback className="bg-amber-100 text-2xl text-amber-700">
                  {getInitials(user.name, user.surname)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-xl font-semibold text-gray-900">
                  {user.name} {user.surname}
                </p>
                <p className="text-sm text-gray-500">{formatRole(user.role)}</p>
              </div>
            </div>

            <div className="grid gap-4 border-t border-gray-100 px-6 py-6 sm:grid-cols-2">
              <DetailRow label="Adres e-mail" value={user.email} />
              <DetailRow label="Telefon" value={user.phone ?? "—"} />
              <DetailRow
                label="Identyfikator firmy"
                value={String(user.companyId ?? "—")}
              />
              <DetailRow
                label="Zespoły"
                value={user.teamIds?.length ? user.teamIds.join(", ") : "—"}
              />
            </div>
          </div>
        )}
      </DataStateWrapper>
    </div>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
};

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
