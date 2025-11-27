"use client";

import { Button } from "@/components/ui/button";

import { Widget } from "./widget";

interface LeaveRequestsWidgetProps {
  pendingCount: number;
}

export function LeaveRequestsWidget({
  pendingCount,
}: LeaveRequestsWidgetProps) {
  const handleClick = () => {
    console.log("tu link do wnioskow");
  };

  return (
    <Widget size="1x1">
      <div className="flex h-full flex-col justify-between gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        <h2 className="text-foreground shrink-0 text-xs font-semibold sm:text-sm md:text-sm lg:text-lg xl:text-xl">
          Oczekujące wnioski
        </h2>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <p className="text-6xl font-extrabold text-black sm:text-7xl md:text-8xl lg:text-8xl xl:text-8xl 2xl:text-9xl">
            {pendingCount}
          </p>
        </div>
        <Button
          onClick={handleClick}
          className="w-full shrink-0 text-xs sm:text-sm"
          size="default"
        >
          Rozpatrz
        </Button>
      </div>
    </Widget>
  );
}
