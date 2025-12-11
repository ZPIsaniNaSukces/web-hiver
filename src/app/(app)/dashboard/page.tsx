"use client";

import { AttendanceWidget } from "@/components/dashboard/attendance-widget";
import { LeaveRequestsWidget } from "@/components/dashboard/leave-requests-widget";
import { ManagedTeamsWidget } from "@/components/dashboard/managed-teams-widget";
import { TasksChartWidget } from "@/components/dashboard/tasks-chart-widget";
import { TasksSummaryWidget } from "@/components/dashboard/tasks-summary-widget";
import { TeamMembersWidget } from "@/components/dashboard/team-members-widget";

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col gap-3 sm:gap-4">
      <h1 className="shrink-0 text-xl font-bold md:text-2xl">Dashboard</h1>
      <div className="grid flex-1 auto-rows-fr grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        <AttendanceWidget />
        <LeaveRequestsWidget />
        <TeamMembersWidget />
        <ManagedTeamsWidget />
        <TasksSummaryWidget />
        <TasksChartWidget />
      </div>
    </div>
  );
}
