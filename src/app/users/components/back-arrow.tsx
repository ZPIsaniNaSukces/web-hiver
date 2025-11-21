import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const BackArrow = () => {
  return (
    <Button asChild variant="ghost" size="sm" className="w-fit px-2">
      <Link href="/users" className="flex items-center gap-2">
        <ArrowLeft className="size-4" />
        <span>Wróć do listy</span>
      </Link>
    </Button>
  );
};
