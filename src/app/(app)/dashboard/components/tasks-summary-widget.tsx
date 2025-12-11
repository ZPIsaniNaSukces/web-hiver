"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { useTasksSummary } from "@/app/(app)/dashboard/hooks/use-tasks-summary";
import { Button } from "@/components/ui/button";

import { Widget } from "./widget";
import { WidgetButton } from "./widget-button";

const TASK_COLORS = {
  completed: "var(--task-done)",
  pending: "var(--task-in-progress)",
};

export function TasksSummaryWidget() {
  const { data, isLoading, error } = useTasksSummary();

  const completed = data?.data?.completed || 0;
  const pending = data?.data?.pending || 0;

  const chartData = [
    { name: "Zrealizowane", value: completed, color: TASK_COLORS.completed },
    { name: "Oczekujące", value: pending, color: TASK_COLORS.pending },
  ];

  const total = completed + pending;

  return (
    <Widget size="1x1">
      <div className="flex h-full flex-col gap-1 sm:gap-2 md:gap-3">
        <h2 className="text-foreground shrink-0 text-xs font-semibold sm:text-sm md:text-sm lg:text-lg xl:text-xl">
          Zadania
        </h2>
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
          {isLoading ? (
            <span className="text-sm text-gray-500">Ładowanie...</span>
          ) : error ? (
            <span className="text-sm text-red-600">{error.error}</span>
          ) : (
            <div className="w-min-[100%] relative aspect-square h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius="40%"
                    outerRadius="90%"
                    paddingAngle={0}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-bold text-gray-800 sm:text-lg md:text-xl lg:text-2xl">
                  {total}
                </span>
                <span className="text-[7px] text-gray-500 sm:text-[8px] md:text-[10px]">
                  zadań
                </span>
              </div>
            </div>
          )}
        </div>
        {/* Legend */}
        <div className="flex shrink-0 flex-wrap justify-center gap-2 text-[8px] sm:gap-3 sm:text-[10px] md:text-xs">
          <div className="flex items-center gap-1">
            <div
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: TASK_COLORS.completed }}
            />
            <span className="text-gray-600">{completed} zreal.</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: TASK_COLORS.pending }}
            />
            <span className="text-gray-600">{pending} oczek.</span>
          </div>
        </div>
        <WidgetButton href="/tasks" isLoading={isLoading} />
      </div>
    </Widget>
  );
}
