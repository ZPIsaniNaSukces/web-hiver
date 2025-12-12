import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BackArrowProps = {
  href?: string;
  label?: string;
  className?: string;
};

export const BackArrow = ({
  href = "/users",
  label = "Wróć do listy",
  className,
}: BackArrowProps) => {
  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className={cn("w-fit px-2", className)}
    >
      <Link href={href} className="flex items-center gap-2">
        <ArrowLeft className="size-4" />
        <span>{label}</span>
      </Link>
    </Button>
  );
};
