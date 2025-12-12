"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { getInitials } from "@/app/(app)/company-members/utils";
import { useAuth } from "@/app/login/hooks/useAuth";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { MobileNavbar } from "./mobile-navbar/mobile-navbar";

export const TopNavbar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!pathname) {
    return null;
  }

  const isLoginRoute = pathname === "/login" || pathname.startsWith("/login/");
  if (isLoginRoute) {
    return null;
  }

  const onLogout = () => {
    logout({
      onSuccess: () => {
        toast.success("Wylogowano pomyślnie");
        router.push("/login");
      },
      onError: () => {
        toast.error("Nie udało się wylogować");
      },
    });
  };

  return (
    <header className="bg-background fixed top-0 z-40 w-full pb-2">
      <div className="mx-auto mt-4 flex h-16 w-full items-center justify-between px-4">
        <Link
          href="/"
          className="text-foreground flex items-center gap-3 text-base font-semibold"
        >
          <Image
            src="/logo.svg"
            alt="HiveR"
            width={120}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <div className="flex">
            <p className="text-lg">
              Witaj{" "}
              <span className="font-semibold">
                {user ? `${user.name} ${user.surname}!` : "Użytkowniku!"}
              </span>
            </p>
          </div>
          <div className="group relative h-16 w-16">
            <div className="absolute top-0 left-0 h-16 w-16 rounded-[2rem] bg-white shadow transition-[height] duration-300 group-focus-within:h-32 group-hover:h-32">
              <Button
                variant="ghost"
                size="icon"
                className="pointer-events-none absolute bottom-2 left-1/2 size-10 -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100"
                aria-label="Wyloguj"
                onClick={() => onLogout()}
              >
                <LogOut className="size-6" />
              </Button>
            </div>
            <Link href={`/company-members/${user?.id || ""}`}>
              <Avatar className="absolute top-2 left-1/2 z-10 h-12 w-12 -translate-x-1/2 ring-1 ring-black/5">
                <AvatarFallback className="text-2xl">
                  {user ? getInitials(user.name, user.surname) : "JA"}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
        <MobileNavbar />
      </div>
    </header>
  );
};
