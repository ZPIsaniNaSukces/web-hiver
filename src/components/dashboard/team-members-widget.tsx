"use client";

import { Button } from "@/components/ui/button";

import { Widget } from "./widget";

interface TeamMembersWidgetProps {
  //pendingCount: number;
}

export function TeamMembersWidget({}: TeamMembersWidgetProps) {
  const handleClick = () => {
    console.log("tu link do teamu");
  };

  return (
    <Widget size="1x1">
      <div className="flex h-full flex-col justify-between gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        <h2 className="text-foreground mmd:text-sm shrink-0 text-xs font-semibold sm:text-sm lg:text-lg xl:text-xl">
          Moi podwładni
        </h2>
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden text-xs sm:text-sm md:text-base">
          tu ziomki + ich dostępność
        </div>
        <Button
          onClick={handleClick}
          className="w-full shrink-0 text-xs sm:text-sm"
          size="default"
        >
          Zobacz więcej
        </Button>
      </div>
    </Widget>
  );
}
