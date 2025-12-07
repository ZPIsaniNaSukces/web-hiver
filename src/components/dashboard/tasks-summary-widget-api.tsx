"use client";

import { useTasksSummary } from "@/app/dashboard/hooks/use-tasks-summary";
import { Button } from "@/components/ui/button";

import { Widget } from "./widget";

export function TasksSummaryWidgetApi() {
  const { data, isLoading, error } = useTasksSummary();

  const handleClick = () => {
    console.log("tu link do zadań");
  };

  return (
    <Widget size="1x1">
      <div className="flex h-full flex-col justify-between gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        <h2 className="text-foreground shrink-0 text-xs font-semibold sm:text-sm md:text-sm lg:text-lg xl:text-xl">
          Zadania
        </h2>
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2">
          {isLoading && (
            <span className="text-sm text-gray-500">Ładowanie...</span>
          )}
          {error && <span className="text-sm text-red-600">{error.error}</span>}
          {!isLoading && !error && data?.data && (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-[#483A2B] sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
                  {data.data.completed}
                </span>
                <span className="text-xs text-gray-500 sm:text-sm">
                  zrealizowane
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-amber-500 sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
                  {data.data.pending}
                </span>
                <span className="text-xs text-gray-500 sm:text-sm">
                  oczekujące
                </span>
              </div>
            </>
          )}
        </div>
        <Button
          onClick={handleClick}
          className="w-full shrink-0 text-xs sm:text-sm"
          size="default"
        >
          Zobacz zadania
        </Button>
      </div>
    </Widget>
  );
}
