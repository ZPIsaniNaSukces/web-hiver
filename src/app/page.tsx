"use client";

import { AttendanceWidget } from "@/components/dashboard/attendance-widget";
import { LeaveRequestsWidget } from "@/components/dashboard/leave-requests-widget";
import { getMockPendingLeaveRequests } from "@/components/dashboard/mock-data";
import { getMockTasksChartData } from "@/components/dashboard/mock-data";
import { getMockTasksSummary } from "@/components/dashboard/mock-data";
import { PlaceholderWidget } from "@/components/dashboard/placeholder-widget";
import { TasksChartWidget } from "@/components/dashboard/tasks-chart-widget";
import { TasksSummaryWidget } from "@/components/dashboard/tasks-summary-widget";
import { TeamMembersWidget } from "@/components/dashboard/team-members-widget";

export default function Home() {
  const pendingLeaveRequests = getMockPendingLeaveRequests();
  const tasksChartData = getMockTasksChartData();
  const tasksSummary = getMockTasksSummary();

  return (
    <div className="mx-auto w-full px-4 py-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <h1 className="text-foreground mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl md:mb-8">
        Dashboard
      </h1>
      <div className="grid auto-rows-fr grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        <AttendanceWidget />
        <LeaveRequestsWidget pendingCount={pendingLeaveRequests} />
        <TeamMembersWidget />
        {/* CHANGE THIS TO API VERSIONS later*/}
        <PlaceholderWidget />
        <TasksSummaryWidget {...tasksSummary} />
        <TasksChartWidget data={tasksChartData} />
      </div>
    </div>
  );
}
