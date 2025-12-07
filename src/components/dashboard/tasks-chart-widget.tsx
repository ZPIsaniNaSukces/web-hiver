"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TasksChartDataPoint } from "@/types/widget-types";

import { Widget } from "./widget";

interface TasksChartWidgetProps {
  data: TasksChartDataPoint[];
}

//formatowanie daty
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" });
}

export function TasksChartWidget({ data }: TasksChartWidgetProps) {
  const formattedData = data.map((item) => ({
    ...item,
    displayDate: formatDate(item.date),
  }));

  return (
    <Widget size="2x1" className="min-h-[250px] sm:min-h-[280px] md:min-h-0">
      <div className="flex h-full min-h-0 flex-col gap-2 sm:gap-3 md:gap-4">
        <h2 className="text-foreground shrink-0 text-xs font-semibold sm:text-sm md:text-sm lg:text-lg xl:text-xl">
          Zadania w czasie
        </h2>
        <div className="min-h-[180px] w-full flex-1 sm:min-h-[200px] md:min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis
                dataKey="displayDate"
                tick={{ fill: "#6b7280", fontSize: 10 }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e5e5",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "#374151", fontWeight: 600 }}
                itemStyle={{ color: "#6b7280" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} iconType="circle" />
              <Line
                type="monotone"
                dataKey="completed"
                name="Zrealizowane"
                stroke="#483A2B"
                strokeWidth={2}
                dot={{ fill: "#483A2B", strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="pending"
                name="Oczekujące"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: "#f59e0b", strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Widget>
  );
}
