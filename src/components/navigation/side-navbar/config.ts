import {
  Calendar,
  ClipboardList,
  Clock,
  Home,
  MailCheck,
  Settings,
  User,
  Users,
} from "lucide-react";

import { NavGroup, NavItem } from "./types";

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "primary",
    items: [
      { label: "Strona główna", href: "/dashboard", icon: Home },
      { label: "Pracownicy", href: "/users", icon: User },
    ],
  },
  {
    id: "work",
    items: [
      { label: "Zespoły", href: "/teams", icon: Users },
      { label: "Zadania", href: "/tasks", icon: ClipboardList },
      { label: "Wnioski", href: "/requests", icon: MailCheck },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((group) => group.items);

export const USERS_LAYOUT_NAV_ITEMS: NavItem[] = [
  { label: "Pracownicy", href: "/users", icon: Users },
  { label: "Zespoły", href: "/users/teams", icon: Users },
];
