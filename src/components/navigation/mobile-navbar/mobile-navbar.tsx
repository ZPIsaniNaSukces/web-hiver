"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { getInitials } from "@/app/(app)/company-members/utils";
import { useAuth } from "@/app/login/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";
import { NAV_ITEMS } from "../side-navbar/config";
import { NavItem } from "../side-navbar/types";

export const MobileNavbar = () => {
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

  if (!pathname) {
    return null;
  }

  const activePath = pathname ?? "/";
  return (
    <Sheet>
      <SheetTrigger className="md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent className="px-4 pt-4">
        <SheetHeader>
          <SheetTitle>
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
          </SheetTitle>
        </SheetHeader>
        {user && (
          <Link
            href={`/company-members/${user.id}`}
            className="mt-6 flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition hover:border-gray-300"
          >
            <Avatar className="size-12 border border-white shadow-sm">
              <AvatarFallback className="text-lg">
                {getInitials(user.name, user.surname)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">
                {user.name} {user.surname}
              </span>
              <span className="text-xs text-gray-500">Zobacz profil</span>
            </div>
          </Link>
        )}
        <div className="mt-8 flex flex-col justify-center gap-6 px-4">
          {NAV_ITEMS.map((item) => (
            <NavbarItem key={item.href} item={item} activePath={activePath} />
          ))}
        </div>
        <SheetFooter className="mt-auto mb-4">
          <Button onClick={onLogout}>Wyloguj</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

const NavbarItem = ({
  item,
  activePath,
}: {
  item: NavItem;
  activePath: string;
}) => {
  const isActive =
    activePath === item.href ||
    (item.href !== "/" && activePath.startsWith(item.href));
  return (
    <div>
      <Link
        href={item.href}
        className={cn("flex flex-row gap-4", isActive && "text-primary")}
      >
        <item.icon className="" />
        <span className="text-lg">{item.label}</span>
      </Link>
    </div>
  );
};
