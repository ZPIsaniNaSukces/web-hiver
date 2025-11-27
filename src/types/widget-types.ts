export type WidgetSize = "1x1" | "2x1";

export interface BaseWidget {
  id: string;
  type: string;
  size: WidgetSize;
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

export type Widget = AttendanceWidgetData;
