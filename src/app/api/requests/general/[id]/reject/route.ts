import { NextRequest } from "next/server";

import { forwardRequestAction } from "@/app/api/requests/action-handler";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return forwardRequestAction(req, id, "general", "reject");
}
