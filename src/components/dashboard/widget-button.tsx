import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { Button } from "../ui/button";

export function WidgetButton({
  href,
  isLoading,
}: {
  href: string;
  isLoading?: boolean;
}) {
  return (
    <Link href={href}>
      <Button
        asChild
        variant="link"
        className="text-primary w-full shrink-0 text-xs hover:underline sm:text-sm"
        size="default"
        disabled={isLoading}
      >
        <p className="flex items-center justify-center gap-1">
          Zobacz więcej <ChevronRight />
        </p>
      </Button>
    </Link>
  );
}
