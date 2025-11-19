"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";
import { NAV_ITEMS } from "../side-navbar/config";
import { NavItem } from "../side-navbar/types";

export const MobileNavbar = () => {
  const pathname = usePathname();

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
        <div className="mt-8 flex flex-col justify-center gap-6 px-4">
          {NAV_ITEMS.map((item) => (
            <NavbarItem key={item.href} item={item} activePath={activePath} />
          ))}
        </div>
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
