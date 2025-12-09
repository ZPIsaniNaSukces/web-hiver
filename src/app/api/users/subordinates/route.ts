import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, BACKEND_URL } from "@/config/constants";
import { parseCookie } from "@/lib/cookie-utils";

export async function GET(req: NextRequest) {
  const rawCookie = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = parseCookie(rawCookie);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Backend doesn't have /users/subordinates endpoint
  // We need to get the current user's details which includes subordinates
  // First, get current user ID from session
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ message: "User ID not found" }, { status: 401 });
  }

  const backendUrl = new URL(`/users/${userId}`, BACKEND_URL);

  const res = await fetch(backendUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  console.log("User data from backend:", JSON.stringify(data, null, 2));
  console.log("Subordinates array:", data?.subordinates);

  // Strategy: Get subordinates from two sources:
  // 1. Direct subordinates (bossId relation)
  // 2. Team members from teams where user is leader

  let allSubordinates: any[] = [];

  // Add direct subordinates
  if (data && data.subordinates && Array.isArray(data.subordinates)) {
    allSubordinates = [...data.subordinates];
  }

  // Add team members from managed teams
  if (data && data.teams && Array.isArray(data.teams)) {
    for (const team of data.teams) {
      try {
        // Get team details with members
        const teamUrl = new URL(`/teams/${team.id}`, BACKEND_URL);
        const teamRes = await fetch(teamUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
          cache: "no-store",
        });

        if (teamRes.ok) {
          const teamData = await teamRes.json().catch(() => null);
          console.log(
            `Team ${team.id} data:`,
            JSON.stringify(teamData, null, 2),
          );

          // If user is leader of this team, add all team members (except self)
          if (
            teamData &&
            teamData.leader &&
            teamData.leader.id === parseInt(userId)
          ) {
            if (teamData.users && Array.isArray(teamData.users)) {
              const teamMembers = teamData.users.filter(
                (member: any) => member.id !== parseInt(userId),
              );
              allSubordinates = [...allSubordinates, ...teamMembers];
            }
          }
        }
      } catch (e) {
        console.error(`Error fetching team ${team.id}:`, e);
      }
    }
  }

  // Remove duplicates by id
  const uniqueSubordinates = Array.from(
    new Map(allSubordinates.map((sub) => [sub.id, sub])).values(),
  );

  console.log("All subordinates (unique):", uniqueSubordinates.length);

  // Extract subordinates from user data
  if (uniqueSubordinates.length > 0) {
    // Fetch detailed info for each subordinate to get their teams
    const subordinatesWithDetails = await Promise.all(
      uniqueSubordinates.map(async (sub: any) => {
        try {
          const subDetailUrl = new URL(`/users/${sub.id}`, BACKEND_URL);
          const subRes = await fetch(subDetailUrl, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
            cache: "no-store",
          });

          if (subRes.ok) {
            const subDetail = await subRes.json().catch(() => null);

            // Get check-in status
            let isCheckedIn = false;
            try {
              const checkinUrl = new URL(`/checkincheckout`, BACKEND_URL);
              checkinUrl.searchParams.set("userId", sub.id.toString());
              const checkinRes = await fetch(checkinUrl, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  Accept: "application/json",
                },
                cache: "no-store",
              });

              if (checkinRes.ok) {
                const checkinData = await checkinRes.json().catch(() => null);
                isCheckedIn = checkinData?.checkinDirection === "IN";
              }
            } catch (e) {
              // Ignore check-in errors
            }

            return {
              id: sub.id.toString(),
              name: `${sub.name} ${sub.surname}`,
              email: sub.email,
              teamName: subDetail?.teams?.[0]?.name || "Brak zespołu",
              status: isCheckedIn
                ? ("available" as const)
                : ("unavailable" as const),
            };
          }
        } catch (e) {
          // If fetching details fails, return basic info
        }

        return {
          id: sub.id.toString(),
          name: `${sub.name} ${sub.surname}`,
          email: sub.email,
          teamName: "Brak zespołu",
          status: "unavailable" as const,
        };
      }),
    );

    // Sort by status (available first) then alphabetically
    const sorted = subordinatesWithDetails.sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === "available" ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({ subordinates: sorted }, { status: res.status });
  }

  return NextResponse.json({ subordinates: [] }, { status: res.status });
}
