"use client";

import { LocalNavBar } from "@/components/navigation/local-navigation/navbar";
import { USERS_LAYOUT_NAV_ITEMS } from "@/components/navigation/side-navbar/config";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <LocalNavBar items={USERS_LAYOUT_NAV_ITEMS} />
      {children}
    </div>
  );
}
