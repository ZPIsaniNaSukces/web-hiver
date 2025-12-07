"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { AvailabilityRequest } from "@/types/request-types";
import { RequestStatus } from "@/types/request-types";

import { AvailabilityRequestActions } from "./request-actions/availability-actions";
import { RequestCardShell } from "./request-card-shell";
import {
  formatAvailabilityType,
  formatDate,
  formatDateTime,
  getUserFullName,
  getUserInitials,
} from "./request-helpers";

const decisionLabel: Record<RequestStatus, string> = {
  [RequestStatus.PENDING]: "Oczekuje na decyzję",
  [RequestStatus.APPROVED]: "Zatwierdzono",
  [RequestStatus.REJECTED]: "Odrzucono",
};

export const AvailabilityRequestCard = ({
  request,
}: {
  request: AvailabilityRequest;
}) => {
  const fullName = getUserFullName(request.user);
  const initials = getUserInitials(request.user);
  const requestDate = formatDate(request.date);
  const createdAt = formatDateTime(request.createdAt);
  const decisionDate = formatDateTime(
    request.acceptedRejectedAt ?? request.updatedAt,
  );

  const footerLabel =
    request.status === RequestStatus.PENDING ? (
      <AvailabilityRequestActions requestId={String(request.id)} />
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
              #{request.id} • {requestDate}
            </p>
          </div>
        </div>
      }
      footer={footerLabel}
    >
      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-muted-foreground text-xs tracking-wide uppercase">
            Data
          </dt>
          <dd className="font-medium">{requestDate}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs tracking-wide uppercase">
            Godziny
          </dt>
          <dd className="font-medium">{request.hours}h</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs tracking-wide uppercase">
            Typ
          </dt>
          <dd className="font-medium">
            {formatAvailabilityType(request.type)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs tracking-wide uppercase">
            Utworzono
          </dt>
          <dd className="font-medium">{createdAt}</dd>
        </div>
      </dl>
    </RequestCardShell>
  );
};
