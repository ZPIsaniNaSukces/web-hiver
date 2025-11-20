type RoleLike = string | null | undefined;

export function getInitials(
  name: string | null | undefined,
  surname: string | null | undefined,
) {
  const initials = `${name?.[0] ?? ""}${surname?.[0] ?? ""}`.trim();

  return initials ? initials.toUpperCase() : "?";
}

export function formatRole(role: RoleLike) {
  if (!role) return "—";

  return role
    .toString()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
