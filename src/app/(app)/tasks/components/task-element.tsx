import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties } from "react";

import { cn } from "@/lib/utils";
import { Task } from "@/types/task-types";

const formatDueDate = (
  dueDate: Task["dueDate"] | string | null | undefined,
) => {
  if (!dueDate) {
    return null;
  }

  const normalizedDate =
    typeof dueDate === "string" ? new Date(dueDate) : dueDate;

  if (
    !(normalizedDate instanceof Date) ||
    Number.isNaN(normalizedDate.getTime())
  ) {
    return typeof dueDate === "string" ? dueDate : null;
  }

  return new Intl.DateTimeFormat("pl-PL", { dateStyle: "medium" }).format(
    normalizedDate,
  );
};

export const TaskCard = ({
  task,
  className,
}: {
  task: Task;
  className?: string;
}) => {
  const formattedDueDate = formatDueDate(task.dueDate);

  return (
    <div
      className={cn(
        "bg-background space-y-2.5 rounded-md p-4 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <h3 className="font-semibold">{task.title}</h3>
          <p className="bg-primary rounded-md p-1 text-xs text-white lowercase">
            {task.type}
          </p>
        </div>

        <p className="hidden text-sm text-gray-600 md:flex">
          {formattedDueDate ?? "Brak terminu"}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-600">{task.description}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600 md:hidden">
          {formattedDueDate ?? "Brak terminu"}
        </p>
      </div>
    </div>
  );
};

export const TaskElement = ({ task }: { task: Task }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `task-${task.id}`,
      data: { task },
    });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    visibility: isDragging ? "hidden" : "visible",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-full cursor-grab active:cursor-grabbing"
      {...listeners}
      {...attributes}
    >
      <TaskCard task={task} />
    </div>
  );
};
