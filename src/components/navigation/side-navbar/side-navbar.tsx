"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { NAV_GROUPS } from "./config";
import { NavItem } from "./types";

export default function SideDock() {
  const pathname = usePathname();

  if (!pathname) {
    return null;
  }

  const isLoginRoute = pathname === "/login" || pathname.startsWith("/login/");
  if (isLoginRoute) {
    return null;
  }

  const activePath = pathname ?? "/";

  return (
    <aside
      aria-label="Nawigacja boczna"
      className="fixed top-32 left-6 hidden md:block"
    >
      <nav className="flex flex-col gap-6">
        {NAV_GROUPS.map((group) => (
          <NavPill key={group.id} items={group.items} activePath={activePath} />
        ))}
      </nav>
    </aside>
  );
}

function NavPill({
  items,
  activePath,
}: {
  items: Array<NavItem>;
  activePath: string;
}) {
  return (
    <div
      className={cn(
        "group relative w-16 justify-center rounded-[2rem] bg-white shadow",
        "flex flex-col items-center px-3 py-3",
        "transition-[width] duration-300 focus-within:w-42 hover:w-42",
      )}
      style={{ boxShadow: "0 16px 48px -24px rgba(0,0,0,0.25)" }}
    >
      {items.map(({ label, href, icon: Icon }) => {
        const isActive =
          activePath === href || (href !== "/" && activePath.startsWith(href));

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "my-2 w-full",
              "rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <div
              className={cn(
                "flex h-10 w-full items-center gap-3 rounded-xl px-2",
                "transition-all duration-200",
                "text-slate-700",
                "hover:bg-slate-100",
                isActive && "text-primary",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span
                className={cn(
                  "text-sm whitespace-nowrap",
                  "max-w-[9rem] overflow-hidden",
                  "translate-x-[-4px] opacity-0",
                  "transition-all duration-200",
                  "group-hover:translate-x-0 group-hover:opacity-100",
                  "group-focus-within:translate-x-0 group-focus-within:opacity-100",
                )}
              >
                {label}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
