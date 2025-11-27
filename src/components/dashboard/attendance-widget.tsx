"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { AttendanceHourData } from "@/types/widget-types";

import { Widget } from "./widget";

interface AttendanceWidgetProps {
  data: AttendanceHourData[];
}

export function AttendanceWidget({ data }: AttendanceWidgetProps) {
  return (
    <Widget size="2x1" className="min-h-[250px] sm:min-h-[280px] md:min-h-0">
      <div className="flex h-full min-h-0 flex-col gap-2 sm:gap-3 md:gap-4">
        <h2 className="text-foreground shrink-0 text-xs font-semibold sm:text-sm md:text-sm lg:text-lg xl:text-xl">
          Obecność (aktualnie dostępne X osób)
        </h2>
        <div className="min-h-[180px] flex-1 overflow-hidden sm:min-h-[200px] md:min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis
                dataKey="hour"
                tick={{ fill: "#6b7280", fontSize: 10 }}
                tickLine={false}
                className="text-[10px] sm:text-xs"
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                className="text-[10px] sm:text-xs"
              />
              <Tooltip
                cursor={{ fill: "rgba(232, 178, 0, 0.1)" }}
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
              <Bar
                dataKey="count"
                name="Liczba osób"
                fill="#e8b200"
                radius={[4, 4, 0, 0]}
                shape={(props: any) => {
                  const { fill, x, y, width, height, payload } = props;
                  const radius = Math.min(4, width / 2);
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={payload.isCurrentHour ? "#ce8003" : fill}
                      rx={radius}
                      ry={radius}
                    />
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Widget>
  );
}
