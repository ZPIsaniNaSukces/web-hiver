import Link from "next/link";

import { cn } from "@/lib/utils";

import { NavItem } from "../side-navbar/types";

export const LocalNavItem = ({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) => {
  return (
    <Link
      href={item.href}
      className={cn(
        "text-foreground inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-medium shadow-sm transition-colors",
        "hover:bg-primary/10 hover:text-primary focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2",
        isActive && "bg-primary text-primary-foreground shadow",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <div className="bg-primary/10 text-primary mr-3 rounded-md p-2 text-sm">
        <item.icon />
      </div>
      {item.label}
    </Link>
  );
};
