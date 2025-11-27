import { z } from "zod";

import type { User } from "./auth-types";

export type TeamMember = User;

export type TeamSummary = {
  id: number;
  name: string;
  companyId: number;
  leaderId: number | null;
  leader: TeamMember | null;
  usersCount: number;
};

export type TeamDetails = TeamSummary & {
  users: TeamMember[];
};

export type TeamsResponse = TeamSummary[];

export const CreateTeamSchema = z.object({
  name: z.string().min(1, "Nazwa zespołu jest wymagana"),
  leaderId: z
    .number()
    .int("Identyfikator lidera musi być liczbą całkowitą")
    .positive("Identyfikator lidera musi być dodatni")
    .optional(),
  memberIds: z
    .array(
      z
        .number()
        .int("Identyfikator członka musi być liczbą całkowitą")
        .positive("Identyfikator członka musi być dodatni"),
    )
    .max(1000, "Zbyt wiele członków w jednym zespole")
    .optional(),
});

export type CreateTeamType = z.infer<typeof CreateTeamSchema>;
