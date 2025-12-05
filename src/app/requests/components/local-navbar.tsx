"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export const LocalNavbar = ({
  hrefs,
}: {
  hrefs: { href: string; label: string }[];
}) => {
  const pathname = usePathname();
  return (
    <nav className="ml-4 flex space-x-4 text-sm">
      {hrefs.map(({ href, label }) => (
        <NavbarElement key={href} href={href} pathname={pathname}>
          {label}
        </NavbarElement>
      ))}
    </nav>
  );
};

const NavbarElement = ({
  href,
  pathname,
  children,
}: {
  href: string;
  pathname: string;
  children: ReactNode;
}) => {
  return (
    <Link
      href={href}
      className={
        pathname === href ? "text-primary border-b-primary border-b-1" : ""
      }
    >
      {children}
    </Link>
  );
};
