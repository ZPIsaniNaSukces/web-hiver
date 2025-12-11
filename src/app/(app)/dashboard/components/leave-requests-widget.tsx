"use client";

import { useRequestsPending } from "@/app/(app)/dashboard/hooks/use-requests-pending";
import { Button } from "@/components/ui/button";

import { Widget } from "./widget";
import { WidgetButton } from "./widget-button";

export function LeaveRequestsWidget() {
  const { data, isLoading, error } = useRequestsPending();

  const handleClick = () => {
    console.log("tu link do wnioskow");
  };

  const pendingCount = data?.data?.pendingCount ?? 0;

  return (
    <Widget size="1x1">
      <div className="flex h-full flex-col justify-between gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        <h2 className="text-foreground shrink-0 text-xs font-semibold sm:text-sm md:text-sm lg:text-lg xl:text-xl">
          Oczekujące wnioski
        </h2>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          {isLoading ? (
            <p className="text-muted-foreground text-sm">Ładowanie...</p>
          ) : error ? (
            <p className="text-destructive text-sm">Błąd wczytywania</p>
          ) : (
            <p className="text-6xl font-extrabold text-[#483A2B] sm:text-7xl md:text-8xl lg:text-8xl xl:text-8xl 2xl:text-9xl">
              {pendingCount}
            </p>
          )}
        </div>
        <WidgetButton href="/requests" isLoading={isLoading} />
      </div>
    </Widget>
  );
}
