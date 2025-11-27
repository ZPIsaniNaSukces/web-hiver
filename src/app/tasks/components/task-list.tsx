import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DataStateWrapper } from "@/components/ui/data-state-wrapper";

import type { UseTasksResult } from "../hooks/use-tasks";
import { TaskElement } from "./task-element";

export const TaskList = ({
  queryResult,
  title,
}: {
  queryResult: UseTasksResult;
  title: string;
}) => {
  const { data, isLoading, isError, error } = queryResult;
  const tasks = data?.data ?? [];

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full space-y-2 rounded-md bg-white px-4"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="cursor-pointer text-lg font-semibold">
          {title}
        </AccordionTrigger>
        <AccordionContent className="space-y-2">
          <DataStateWrapper
            isLoading={isLoading}
            isError={isError}
            errorMessage={error?.error}
            hasData={tasks.length > 0}
          >
            {tasks.map((task) => (
              <TaskElement key={task.title} task={task} />
            ))}
          </DataStateWrapper>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
