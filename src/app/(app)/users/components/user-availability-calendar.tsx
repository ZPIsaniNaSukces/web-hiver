"use client";

import { useMemo } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  type AvailabilityRequest,
  AvailabilityType,
} from "@/types/request-types";

type UserAvailabilityCalendarProps = {
  requests: AvailabilityRequest[];
  className?: string;
};

export function UserAvailabilityCalendar({
  requests,
  className,
}: UserAvailabilityCalendarProps) {
  const { year, month, daysInMonth, firstDayOfWeek, requestsByDate } =
    useMemo(() => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const firstDay = new Date(year, month, 1).getDay();
      const firstDayOfWeek = firstDay === 0 ? 6 : firstDay - 1;

      const requestsByDate = new Map<string, AvailabilityRequest[]>();
      requests.forEach((req) => {
        const dateKey = req.date.split("T")[0];
        if (!requestsByDate.has(dateKey)) {
          requestsByDate.set(dateKey, []);
        }
        requestsByDate.get(dateKey)!.push(req);
      });

      return { year, month, daysInMonth, firstDayOfWeek, requestsByDate };
    }, [requests]);

  const monthName = new Date(year, month, 1).toLocaleDateString("pl-PL", {
    month: "long",
    year: "numeric",
  });

  const weekDays = ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"];
  const typeLabels: Record<AvailabilityType, string> = {
    [AvailabilityType.VACATION]: "Urlop",
    [AvailabilityType.ONLINE_WORK]: "Praca zdalna",
    [AvailabilityType.OFFLINE_WORK]: "Praca stacjonarna",
  };

  const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm",
        className,
      )}
    >
      <div className="px-4 py-4 sm:px-5">
        <h2 className="text-base font-semibold text-gray-900 capitalize">
          {monthName}
        </h2>
        <p className="text-xs text-gray-500">
          Kalendarz zaakceptowanych wniosków o dostępność
        </p>
      </div>

      <div className="flex flex-1 flex-col border-t border-gray-100 px-3 py-4 sm:px-4">
        <div className="grid grid-cols-7 gap-1.5 text-[11px]">
          {weekDays.map((day) => (
            <div
              key={day}
              className="py-1 text-center text-[10px] font-medium tracking-wide text-gray-500 uppercase"
            >
              {day}
            </div>
          ))}

          {emptyDays.map((i) => (
            <div key={`empty-${i}`} className="h-14" />
          ))}

          {days.map((day) => {
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayRequests = requestsByDate.get(dateStr) || [];
            const hasVacation = dayRequests.some(
              (r) => r.type === AvailabilityType.VACATION,
            );
            const hasOnlineWork = dayRequests.some(
              (r) => r.type === AvailabilityType.ONLINE_WORK,
            );
            const hasOfflineWork = dayRequests.some(
              (r) => r.type === AvailabilityType.OFFLINE_WORK,
            );

            const today = new Date();
            const isToday =
              today.getDate() === day &&
              today.getMonth() === month &&
              today.getFullYear() === year;

            const cellClasses = `
              flex h-14 w-full flex-col items-center justify-center rounded-lg border p-1
              ${isToday ? "border-blue-500 bg-blue-50" : "border-gray-200"}
              ${dayRequests.length > 0 ? "font-semibold" : ""}
            `;

            const cellInner = (
              <>
                <span className="text-[11px] text-gray-700">{day}</span>
                <div className="mt-1 flex gap-0.5">
                  {hasVacation && (
                    <div className="size-2 rounded-full bg-green-500" />
                  )}
                  {hasOnlineWork && (
                    <div className="size-2 rounded-full bg-blue-500" />
                  )}
                  {hasOfflineWork && (
                    <div className="size-2 rounded-full bg-orange-500" />
                  )}
                </div>
              </>
            );

            if (!dayRequests.length) {
              return (
                <div
                  key={day}
                  className={cellClasses}
                  aria-label={`Dzień ${day}. Brak wniosków`}
                >
                  {cellInner}
                </div>
              );
            }

            const formattedDayLabel = new Date(
              `${dateStr}T00:00:00`,
            ).toLocaleDateString("pl-PL", {
              weekday: "long",
              day: "numeric",
              month: "long",
            });

            return (
              <Tooltip key={day} delayDuration={120}>
                <TooltipTrigger asChild>
                  <div
                    className={cellClasses}
                    aria-label={`Dzień ${day}. ${dayRequests.length} zaakceptowanych wniosków`}
                  >
                    {cellInner}
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={6}
                  className="max-w-[220px] space-y-1 text-left"
                >
                  <p className="text-[11px] font-semibold capitalize">
                    {formattedDayLabel}
                  </p>
                  <ul className="space-y-1 text-[11px]">
                    {dayRequests.map((request) => (
                      <li key={request.id} className="flex flex-col">
                        <span>{typeLabels[request.type]}</span>
                        <span className="text-[10px] text-gray-300">
                          {request.hours}h
                        </span>
                      </li>
                    ))}
                  </ul>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-gray-600">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-green-500" />
            <span>Urlop</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-blue-500" />
            <span>Praca zdalna</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-orange-500" />
            <span>Praca stacjonarna</span>
          </div>
        </div>
      </div>
    </div>
  );
}
