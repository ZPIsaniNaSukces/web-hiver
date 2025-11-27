import { count } from "console";

import type { AttendanceHourData } from "@/types/widget-types";

export function getMockAttendanceData(): AttendanceHourData[] {
  const currentHour = 10; //new Date().getHours()

  const hours = [
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

  const mockCounts = [2, 5, 12, 18, 22, 15, 20, 23, 21, 16, 10, 6];

  const minHourToShow = 7;
  const minHourForEmptyColumns = 13;

  const result = hours
    .map((hour, index) => {
      const hourValue = parseInt(hour.split(":")[0]);

      //pokazuje godziny od 7 do 13 nawet jesli sa puste, przyszle godziny jako puste
      if (hourValue <= minHourForEmptyColumns) {
        if (hourValue > currentHour) {
          return {
            hour,
            count: 0,
            isCurrentHour: false,
          };
        }
        return {
          hour,
          count: mockCounts[index],
          isCurrentHour: hourValue === currentHour,
        };
      }

      //po 13 pokazuje tylko jesli juz minela ta odzina
      if (hourValue > currentHour) {
        return null;
      }

      return {
        hour,
        count: mockCounts[index],
        isCurrentHour: hourValue === currentHour,
      };
    })
    .filter((item): item is AttendanceHourData => item !== null);

  //console.log("Attendance Data:", JSON.stringify(result, null, 2));
  return result;
}

export function getMockPendingLeaveRequests(): number {
  const count = 7;
  console.log("Pending Leave Requests:", count);
  return count;
}
