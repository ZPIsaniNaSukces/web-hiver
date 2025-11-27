"use client";

import { AttendanceWidget } from "@/components/dashboard/attendance-widget";
import { LeaveRequestsWidget } from "@/components/dashboard/leave-requests-widget";
import {
  getMockAttendanceData,
  getMockPendingLeaveRequests,
} from "@/components/dashboard/mock-data";
import { TeamMembersWidget } from "@/components/dashboard/team-members-widget";

export default function Home() {
  const attendanceData = getMockAttendanceData();
  const pendingLeaveRequests = getMockPendingLeaveRequests();

  return (
    <div className="mx-auto w-full px-4 py-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <h1 className="text-foreground mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl md:mb-8">
        Dashboard
      </h1>
      <div className="grid auto-rows-fr grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        <AttendanceWidget data={attendanceData} />
        <LeaveRequestsWidget pendingCount={pendingLeaveRequests} />
        <TeamMembersWidget />
      </div>
    </div>
  );
}
