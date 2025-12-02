import { MutableRefObject, RefObject } from "react";
import { InView } from "react-intersection-observer";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DataStateWrapper } from "@/components/ui/data-state-wrapper";
import { Spinner } from "@/components/ui/spinner";

import type { UseTasksInfiniteResult } from "../hooks/use-tasks-infinite";
import { TaskElement } from "./task-element";

type ScrollContainerRef =
  | RefObject<Element>
  | MutableRefObject<Element | null>
  | null
  | undefined;

export const TaskList = ({
  queryResult,
  title,
  scrollContainerRef,
}: {
  queryResult: UseTasksInfiniteResult;
  title: string;
  scrollContainerRef?: ScrollContainerRef;
}) => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = queryResult;

  const tasks = data?.pages?.flatMap((page) => page.data.data) ?? [];

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
              <TaskElement key={task.id} task={task} />
            ))}

            {(hasNextPage || isFetchingNextPage) && (
              <InView
                root={scrollContainerRef?.current ?? undefined}
                onChange={(inView) => {
                  if (inView && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                  }
                }}
              >
                {({ ref }) => (
                  <div
                    ref={ref}
                    className="flex flex-col items-center gap-2 py-4 text-center text-sm text-gray-500"
                  >
                    {isFetchingNextPage ? (
                      <span className="flex items-center gap-2">
                        <Spinner className="size-4" />
                        Ładowanie kolejnych...
                      </span>
                    ) : hasNextPage ? (
                      "Przescrolluj niżej, żeby załadować więcej"
                    ) : (
                      "To już wszystko"
                    )}
                  </div>
                )}
              </InView>
            )}
          </DataStateWrapper>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
