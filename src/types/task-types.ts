import z from "zod";

import { TaskStatus } from "@/config/enums";

export const createTaskSchema = z.object({
  title: z.string().max(255),
  description: z.string().max(2000).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  type: z.nativeEnum(TaskStatus).optional(),
  dueDate: z.coerce.date().optional(),
  reporterId: z.number().int().optional(),
  assigneeId: z.number().int().optional(),
});

export type Task = z.infer<typeof createTaskSchema>;

export type TasksResponse = Task[];
