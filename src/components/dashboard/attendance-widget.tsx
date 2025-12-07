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

import { useAttendanceStats } from "@/app/(app)/dashboard/hooks/use-attendance-stats";

import { Widget } from "./widget";

export function AttendanceWidget() {
  const { data, isLoading, error } = useAttendanceStats();

  return (
    <Widget size="2x1" className="min-h-[250px] sm:min-h-[280px] md:min-h-0">
      <div className="flex h-full min-h-0 flex-col gap-2 sm:gap-3 md:gap-4">
        <h2 className="text-foreground shrink-0 text-xs font-semibold sm:text-sm md:text-sm lg:text-lg xl:text-xl">
          Obecność (aktualnie dostępne{" "}
          {data?.data.find((d) => d.isCurrentHour)?.count ?? 0} osób)
        </h2>
        <div className="min-h-[180px] w-full flex-1 sm:min-h-[200px] md:min-h-0">
          {isLoading && (
            <div className="flex h-full items-center justify-center">
              <span className="text-sm text-gray-500">Ładowanie...</span>
            </div>
          )}
          {error && (
            <div className="flex h-full items-center justify-center">
              <span className="text-sm text-red-600">{error.error}</span>
            </div>
          )}
          {!isLoading && !error && data?.data && data.data.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.data}
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
          )}
          {!isLoading && !error && (!data?.data || data.data.length === 0) && (
            <div className="flex h-full items-center justify-center">
              <span className="text-sm text-gray-500">
                Brak danych do wyświetlenia.
              </span>
            </div>
          )}
        </div>
      </div>
    </Widget>
  );
}
