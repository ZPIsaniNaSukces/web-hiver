"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { Button } from "@/components/ui/button";
import type { TasksSummaryData } from "@/types/widget-types";

import { Widget } from "./widget";

const COLORS = {
  completed: "#483A2B",
  pending: "#f59e0b",
};

export function TasksSummaryWidget({ completed, pending }: TasksSummaryData) {
  const handleClick = () => {
    console.log("tu link do zadań");
  };

  const data = [
    { name: "Zrealizowane", value: completed, color: COLORS.completed },
    { name: "Oczekujące", value: pending, color: COLORS.pending },
  ];

  const total = completed + pending;

  return (
    <Widget size="1x1">
      <div className="flex h-full flex-col justify-between gap-2 sm:gap-3 md:gap-4">
        <h2 className="text-foreground shrink-0 text-xs font-semibold sm:text-sm md:text-sm lg:text-lg xl:text-xl">
          Zadania
        </h2>
        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="80%"
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-800 sm:text-3xl md:text-4xl">
              {total}
            </span>
            <span className="text-[10px] text-gray-500 sm:text-xs">zadań</span>
          </div>
        </div>
        {/* Legend */}
        <div className="flex justify-center gap-3 text-[10px] sm:gap-4 sm:text-xs">
          <div className="flex items-center gap-1">
            <div
              className="h-2 w-2 rounded-full sm:h-3 sm:w-3"
              style={{ backgroundColor: COLORS.completed }}
            />
            <span className="text-gray-600">{completed} zrealizowane</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="h-2 w-2 rounded-full sm:h-3 sm:w-3"
              style={{ backgroundColor: COLORS.pending }}
            />
            <span className="text-gray-600">{pending} oczekujące</span>
          </div>
        </div>
        <Button
          onClick={handleClick}
          className="w-full shrink-0 text-xs sm:text-sm"
          size="default"
        >
          Zobacz zadania
        </Button>
      </div>
    </Widget>
  );
}
