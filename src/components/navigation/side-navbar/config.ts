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
      { label: "Pracownicy", href: "/company-members", icon: User },
    ],
  },
  {
    id: "work",
    items: [
      { label: "Zespoły", href: "/manage/teams", icon: Users },
      { label: "Zadania", href: "/manage/tasks", icon: ClipboardList },
      { label: "Wnioski", href: "/manage/requests", icon: MailCheck },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((group) => group.items);

export const USERS_LAYOUT_NAV_ITEMS: NavItem[] = [
  { label: "Pracownicy", href: "/company-members", icon: Users },
  { label: "Zespoły", href: "/manage/teams", icon: Users },
];
