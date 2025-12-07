import { DndContext } from "@dnd-kit/core";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TaskList } from "@/app/(app)/tasks/components/task-list";
import { useTasksInfinite } from "@/app/(app)/tasks/hooks/use-tasks-infinite";
import { TaskStatus } from "@/config/enums";
import { renderWithProviders } from "@/test/utils";

const TaskListWrapper = () => {
  const queryResult = useTasksInfinite({ status: TaskStatus.TODO });
  return (
    <DndContext>
      <TaskList
        queryResult={queryResult}
        title="To Do"
        status={TaskStatus.TODO}
      />
    </DndContext>
  );
};

describe("TaskList", () => {
  it("renders tasks fetched from API", async () => {
    renderWithProviders(<TaskListWrapper />);

    expect(await screen.findByText("Test Task 1")).toBeInTheDocument();
    expect(await screen.findByText("Test Task 2")).toBeInTheDocument();

    expect(screen.getByText("Description for task 1")).toBeInTheDocument();
    expect(screen.getByText("Description for task 2")).toBeInTheDocument();
  });
});
