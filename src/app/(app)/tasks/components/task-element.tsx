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

export const TaskElement = ({ task }: { task: Task }) => {
  const formattedDueDate = formatDueDate(task.dueDate);

  return (
    <div className="bg-background space-y-2.5 rounded-md p-4">
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
