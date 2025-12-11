"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { useSubordinates } from "@/app/(app)/dashboard/hooks/use-subordinates";
import { Button } from "@/components/ui/button";

import { Widget } from "./widget";
import { WidgetButton } from "./widget-button";

export function TeamMembersWidget() {
  const { data, isLoading, error } = useSubordinates();

  const subordinates = data?.data?.subordinates ?? [];
  const managerTeamId = data?.data?.managerTeamId;

  const getStatusLabel = (status: "available" | "unavailable" | "on-leave") => {
    switch (status) {
      case "available":
        return "✓";
      case "unavailable":
        return "✗";
      case "on-leave":
        return "○";
      default:
        return "";
    }
  };

  return (
    <Widget size="1x1">
      <div className="flex h-full flex-col justify-between gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        <h2 className="text-foreground shrink-0 text-xs font-semibold sm:text-sm md:text-sm lg:text-lg xl:text-xl">
          Moi podwładni
        </h2>
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto text-xs sm:text-sm">
          {isLoading ? (
            <p className="text-muted-foreground text-center">Ładowanie...</p>
          ) : error ? (
            <p className="text-destructive text-center">Błąd wczytywania</p>
          ) : subordinates.length === 0 ? (
            <p className="text-muted-foreground text-center">
              Brak podwładnych
            </p>
          ) : (
            subordinates.map((subordinate) => (
              <div
                key={subordinate.id}
                className="hover:bg-muted flex items-center gap-2 rounded border border-gray-100 px-2 py-2"
              >
                <div className="flex-1 overflow-hidden">
                  <div className="truncate font-medium">{subordinate.name}</div>
                  <div className="text-muted-foreground truncate text-[10px]">
                    {subordinate.teamName}
                  </div>
                </div>
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    subordinate.status === "available"
                      ? "bg-green-100 text-green-700"
                      : subordinate.status === "unavailable"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {getStatusLabel(subordinate.status)}
                </span>
              </div>
            ))
          )}
        </div>
        <WidgetButton
          href={managerTeamId ? `/teams/${managerTeamId}` : "/teams"}
          isLoading={isLoading}
        />
      </div>
    </Widget>
  );
}
