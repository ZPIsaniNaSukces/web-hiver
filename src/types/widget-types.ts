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

// Tasks Summary (1x1 widget)
export interface TasksSummaryData {
  completed: number;
  pending: number;
}

// Tasks Chart (2x1 widget) - daily stats over time
export interface TasksChartDataPoint {
  date: string; // ISO date string, e.g. "2025-12-04"
  completed: number;
  pending: number;
}

export type Widget = AttendanceWidgetData;
