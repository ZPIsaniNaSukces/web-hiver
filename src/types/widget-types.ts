export type WidgetSize = "1x1" | "2x1";

export interface BaseWidget {
  id: string;
  type: string;
  size: WidgetSize;
}

export interface WidgetProps {
  size: WidgetSize;
  children: React.ReactNode;
  className?: string;
}

export interface AttendanceWidgetData extends BaseWidget {
  type: "attendance";
  data: AttendanceHourData[];
}

export interface AttendanceHourData {
  hour: string;
  count: number;
  isCurrentHour: boolean;
}

//podsumowanie taskow wykres kolowy 1x1
export interface TasksSummaryData {
  completed: number;
  pending: number;
}

//wykres liniowy 2x1
export interface TasksChartDataPoint {
  date: string; //ISO date string "2025-12-04"
  completed: number;
  pending: number;
}

export type Widget = AttendanceWidgetData;
