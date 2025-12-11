"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "../ui/button";

export const LandingNavbar = () => {
  const pathname = usePathname();

  if (!pathname) {
    return null;
  }
  if (pathname !== "/") {
    return null;
  }
  return (
    <nav className="relative z-20 w-full px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="text-lg font-bold text-white">
          <Image
            src="/logo.svg"
            alt="HiveR Logo"
            width={100}
            height={40}
            className="mr-2 inline-block"
          />
        </Link>
        <div>
          <Button asChild className="bg-accent3 hover:bg-accent3/90 text-white">
            <Link href="/login">Zaloguj się</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};
