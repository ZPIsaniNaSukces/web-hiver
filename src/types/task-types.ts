import z from "zod";

import { TaskStatus, TaskType } from "@/config/enums";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Tytuł zadania jest wymagany")
    .max(255, "Tytuł zadania może mieć maksymalnie 255 znaków"),
  description: z
    .string()
    .max(2000, "Opis zadania może mieć maksymalnie 2000 znaków")
    .optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  type: z.nativeEnum(TaskType).optional(),
  dueDate: z.coerce.date().optional(),
  reporterId: z.number().int().positive().optional(),
  assigneeId: z.number().int().positive().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  type: TaskType;
  dueDate: string | null;
  reporterId: number | null;
  assigneeId: number | null;
  createdAt: string;
  updatedAt: string;
};

export type TasksMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type TasksPage = {
  data: Task[];
  meta: TasksMeta;
};
