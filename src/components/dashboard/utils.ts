import type { AttendanceHourData } from "@/types/widget-types";

//for the future api endpoint
//process attendance data from API and add empty slots for hours
//to ensure minimum number of columns on chart (7:00-13:00)

export function normalizeAttendanceData(
  apiData: AttendanceHourData[],
  currentHour?: number,
): AttendanceHourData[] {
  const now = currentHour ?? new Date().getHours();
  const minHourForEmptyColumns = 13;

  const allHours = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  const dataMap = new Map<string, AttendanceHourData>();
  apiData.forEach((item) => {
    dataMap.set(item.hour, item);
  });

  return allHours
    .map((hour) => {
      const hourValue = parseInt(hour.split(":")[0]);

      if (hourValue <= minHourForEmptyColumns) {
        if (dataMap.has(hour)) {
          return dataMap.get(hour)!;
        }
        return {
          hour,
          count: 0,
          isCurrentHour: hourValue === now,
        };
      }

      return dataMap.get(hour) ?? null;
    })
    .filter((item): item is AttendanceHourData => item !== null);
}
