import { cn } from "@/lib/utils";
import type { WidgetSize } from "@/types/widget-types";

interface WidgetProps {
  size: WidgetSize;
  children: React.ReactNode;
  className?: string;
}

export function Widget({ size, children, className }: WidgetProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-white shadow-md sm:rounded-xl md:rounded-2xl",
        "p-3 sm:p-4 md:p-5 lg:p-6",
        "flex flex-col",
        size === "1x1" && "col-span-1 aspect-square",
        size === "2x1" && "col-span-2 lg:col-span-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
