export type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type NavGroup = {
  id: string;
  items: NavItem[];
};
