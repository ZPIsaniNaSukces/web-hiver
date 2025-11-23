import { z } from "zod";

import type { User } from "./auth-types";

export type TeamMember = User;

export type TeamCounts = {
  users: number;
};

export type TeamSummary = {
  id: number;
  name: string;
  companyId: number;
  leaderId: number | null;
  leader: TeamMember | null;
  _count: TeamCounts;
};

export type TeamDetails = TeamSummary & {
  users: TeamMember[];
};

export type TeamsResponse = TeamSummary[];

export const CreateTeamSchema = z.object({
  name: z.string().min(1, "Nazwa zespołu jest wymagana"),
  companyId: z
    .number()
    .int("Identyfikator firmy musi być liczbą całkowitą")
    .positive("Identyfikator firmy musi być dodatni"),
  leaderId: z
    .number()
    .int("Identyfikator lidera musi być liczbą całkowitą")
    .positive("Identyfikator lidera musi być dodatni")
    .optional(),
});

export type CreateTeamType = z.infer<typeof CreateTeamSchema>;
