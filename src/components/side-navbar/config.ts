import {
  Calendar,
  ClipboardList,
  Clock,
  Home,
  Mail,
  Settings,
  Users,
} from "lucide-react";

import { NavGroup, NavItem } from "./types";

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "primary",
    items: [
      { label: "Strona główna", href: "/", icon: Home },
      { label: "Zespoły", href: "/teams", icon: Users },
    ],
  },
  {
    id: "work",
    items: [
      { label: "Wiadomości", href: "/inbox", icon: Mail },
      { label: "Zadania", href: "/tasks", icon: ClipboardList },
      { label: "Kalendarz", href: "/calendar", icon: Calendar },
      { label: "Czas pracy", href: "/time", icon: Clock },
    ],
  },
  {
    id: "settings",
    items: [{ label: "Ustawienia", href: "/settings", icon: Settings }],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((group) => group.items);
