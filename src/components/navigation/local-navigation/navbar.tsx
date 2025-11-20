"use client";

import { usePathname } from "next/navigation";

import { NavItem } from "../side-navbar/types";
import { LocalNavItem } from "./navigation-item";

export const LocalNavBar = ({ items }: { items: NavItem[] }) => {
  const pathname = usePathname();

  if (!pathname) {
    return null;
  }

  const normalize = (path: string) =>
    path === "/" ? "/" : path.replace(/\/+$/, "");

  const normalizedPath = normalize(pathname);

  const activeHref = [...items]
    .sort((a, b) => normalize(b.href).length - normalize(a.href).length)
    .find((item) => {
      const normalizedHref = normalize(item.href);

      return (
        normalizedPath === normalizedHref ||
        normalizedPath.startsWith(`${normalizedHref}/`)
      );
    })?.href;

  return (
    <nav className="flex items-center justify-start gap-4">
      {items.map((item) => (
        <LocalNavItem
          key={item.label}
          item={item}
          isActive={activeHref === item.href}
        />
      ))}
    </nav>
  );
};
