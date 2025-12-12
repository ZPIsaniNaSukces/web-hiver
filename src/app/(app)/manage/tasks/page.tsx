"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRef, useState } from "react";

import { useUpdateTask } from "@/app/(app)/manage/tasks/hooks/use-update-task";
import { Button } from "@/components/ui/button";
import { TaskStatus } from "@/config/enums";
import type { ApiSuccess } from "@/lib/fetch";
import { Task } from "@/types/task-types";
import type { TasksPage } from "@/types/task-types";

import { TaskCard } from "./components/task-element";
import { TaskList } from "./components/task-list";
import { useTasksInfinite } from "./hooks/use-tasks-infinite";

export default function TasksPage() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  const todoTasksQuery = useTasksInfinite({ status: TaskStatus.TODO });
  const doneTasksQuery = useTasksInfinite({ status: TaskStatus.DONE });
  const updateTaskMutation = useUpdateTask();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeTaskRect, setActiveTaskRect] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 120,
        tolerance: 8,
      },
    }),
  );

  const updateStatusCache = (
    status: TaskStatus,
    updater: (tasks: Task[], pageIndex: number) => Task[] | null,
  ) => {
    queryClient.setQueriesData<InfiniteData<ApiSuccess<TasksPage>>>(
      { queryKey: ["tasks", "status", status] },
      (oldData) => {
        if (!oldData) {
          return oldData;
        }

        let hasChanged = false;
        const pages = oldData.pages.map((page, index) => {
          const updatedTasks = updater(page.data.data, index);
          if (!updatedTasks) {
            return page;
          }

          hasChanged = true;
          return {
            ...page,
            data: {
              ...page.data,
              data: updatedTasks,
            },
          };
        });

        return hasChanged ? { ...oldData, pages } : oldData;
      },
    );
  };

  const removeTaskFromStatus = (status: TaskStatus, taskId: number) => {
    updateStatusCache(status, (tasks) => {
      if (!tasks.some((task) => task.id === taskId)) {
        return null;
      }

      return tasks.filter((task) => task.id !== taskId);
    });
  };

  const addTaskToStatus = (status: TaskStatus, task: Task) => {
    updateStatusCache(status, (tasks, pageIndex) => {
      if (pageIndex !== 0) {
        return null;
      }

      if (tasks.some((existing) => existing.id === task.id)) {
        return tasks.map((existing) =>
          existing.id === task.id ? task : existing,
        );
      }

      return [task, ...tasks];
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task | undefined;
    if (task) {
      setActiveTask(task);
      const initialRect = event.active.rect.current?.initial;
      if (initialRect) {
        setActiveTaskRect({
          width: initialRect.width,
          height: initialRect.height,
        });
      } else {
        setActiveTaskRect(null);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const task = event.active.data.current?.task as Task | undefined;
    const destinationStatus = event.over?.data.current?.status as
      | TaskStatus
      | undefined;

    if (
      task &&
      destinationStatus &&
      destinationStatus !== task.status &&
      !updateTaskMutation.isPending
    ) {
      const updatedTask = { ...task, status: destinationStatus };
      removeTaskFromStatus(task.status, task.id);
      addTaskToStatus(destinationStatus, updatedTask);

      updateTaskMutation.mutate(
        {
          id: task.id,
          data: { status: destinationStatus },
        },
        {
          onError: () => {
            removeTaskFromStatus(destinationStatus, task.id);
            addTaskToStatus(task.status, task);
          },
        },
      );
    }

    setActiveTask(null);
    setActiveTaskRect(null);
  };

  const handleDragCancel = () => {
    setActiveTask(null);
    setActiveTaskRect(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="h-full flex-1">
        <div
          ref={scrollRef}
          className="mx-4 mt-4 h-full space-y-4 overflow-y-auto md:mr-8 md:ml-0"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Zadania</h1>
            <Button asChild>
              <Link href="/manage/tasks/add">Dodaj</Link>
            </Button>
          </div>
          <div className="space-y-4">
            <TaskList
              title="Do zrobienia"
              queryResult={todoTasksQuery}
              status={TaskStatus.TODO}
              scrollContainerRef={scrollRef}
            />
            <TaskList
              title="Zrobione"
              queryResult={doneTasksQuery}
              status={TaskStatus.DONE}
              scrollContainerRef={scrollRef}
            />
          </div>
        </div>
      </div>
      <DragOverlay>
        {activeTask ? (
          <div
            style={{
              width: activeTaskRect?.width,
              height: activeTaskRect?.height,
            }}
          >
            <TaskCard task={activeTask} className="shadow-lg" />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
