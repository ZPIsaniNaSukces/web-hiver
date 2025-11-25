"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { TaskStatus } from "@/config/enums";

import { TaskList } from "./components/task-list";
import { useTasks } from "./hooks/use-tasks";

export default function TasksPage() {
  const todoTasksQuery = useTasks({ status: TaskStatus.TODO });
  const doneTasksQuery = useTasks({ status: TaskStatus.DONE });

  return (
    <div className="h-full flex-1">
      <div className="mx-4 h-full space-y-4 overflow-y-auto md:mr-8 md:ml-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Zadania</h1>
          <Button asChild>
            <Link href="/teams/add">Dodaj</Link>
          </Button>
        </div>
        <div className="space-y-4">
          <TaskList title="Do zrobienia" queryResult={todoTasksQuery} />
          <TaskList title="Zrobione" queryResult={doneTasksQuery} />
        </div>
      </div>
    </div>
  );
}
