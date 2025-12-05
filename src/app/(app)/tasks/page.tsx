"use client";

import Link from "next/link";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { TaskStatus } from "@/config/enums";

import { TaskList } from "./components/task-list";
import { useTasksInfinite } from "./hooks/use-tasks-infinite";

export default function TasksPage() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const todoTasksQuery = useTasksInfinite({ status: TaskStatus.TODO });
  const doneTasksQuery = useTasksInfinite({ status: TaskStatus.DONE });

  return (
    <div className="h-full flex-1">
      <div
        ref={scrollRef}
        className="mx-4 h-full space-y-4 overflow-y-auto md:mr-8 md:ml-0"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Zadania</h1>
          <Button asChild>
            <Link href="/tasks/add">Dodaj</Link>
          </Button>
        </div>
        <div className="space-y-4">
          <TaskList
            title="Do zrobienia"
            queryResult={todoTasksQuery}
            scrollContainerRef={scrollRef}
          />
          <TaskList
            title="Zrobione"
            queryResult={doneTasksQuery}
            scrollContainerRef={scrollRef}
          />
        </div>
      </div>
    </div>
  );
}
