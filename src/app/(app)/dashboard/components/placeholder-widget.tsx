"use client";

import { Button } from "@/components/ui/button";

import { Widget } from "./widget";

export function PlaceholderWidget() {
  const handleClick = () => {
    console.log("tu link");
  };

  return (
    <Widget size="1x1">
      <div className="flex h-full flex-col justify-between gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        <h2 className="text-foreground mmd:text-sm shrink-0 text-xs font-semibold sm:text-sm lg:text-lg xl:text-xl">
          Moje zespoły
        </h2>
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden text-xs sm:text-sm md:text-base">
          zespoły, których jestem szefem
        </div>
        <Button
          onClick={handleClick}
          className="w-full shrink-0 text-xs sm:text-sm"
          size="default"
        >
          Zobacz zespoły
        </Button>
      </div>
    </Widget>
  );
}
