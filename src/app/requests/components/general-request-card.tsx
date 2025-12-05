"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { GeneralRequest } from "@/types/request-types";
import { RequestStatus } from "@/types/request-types";

import { GeneralRequestActions } from "./request-actions/general-actions";
import { RequestCardShell } from "./request-card-shell";
import {
  formatDateTime,
  getUserFullName,
  getUserInitials,
} from "./request-helpers";

const decisionLabel: Record<RequestStatus, string> = {
  [RequestStatus.PENDING]: "Oczekuje na decyzję",
  [RequestStatus.APPROVED]: "Zatwierdzono",
  [RequestStatus.REJECTED]: "Odrzucono",
};

export const GeneralRequestCard = ({
  request,
}: {
  request: GeneralRequest;
}) => {
  const fullName = getUserFullName(request.user);
  const initials = getUserInitials(request.user);
  const createdAt = formatDateTime(request.createdAt);
  const decisionDate = formatDateTime(
    request.acceptedRejectedAt ?? request.updatedAt,
  );

  const footerLabel =
    request.status === RequestStatus.PENDING ? (
      <GeneralRequestActions requestId={String(request.id)} />
    ) : (
      `${decisionLabel[request.status]} ${decisionDate} przez ${getUserFullName(request.approvedBy ?? undefined)}`
    );

  return (
    <RequestCardShell
      status={request.status}
      heading={
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-base leading-tight font-semibold">{fullName}</p>
            <p className="text-muted-foreground text-xs">
              #{request.id} • {createdAt}
            </p>
          </div>
        </div>
      }
      footer={footerLabel}
    >
      <div>
        <p className="text-muted-foreground text-sm">{request.description}</p>
      </div>
    </RequestCardShell>
  );
};
