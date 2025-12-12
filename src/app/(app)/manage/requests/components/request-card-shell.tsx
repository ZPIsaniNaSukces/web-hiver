import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { RequestStatus } from "@/types/request-types";

import { RequestStatusBadge } from "./request-status-badge";

type RequestCardShellProps = {
  status: RequestStatus;
  heading: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export const RequestCardShell = ({
  status,
  heading,
  children,
  footer,
  className,
}: RequestCardShellProps) => {
  return (
    <article
      className={cn(
        "border-border rounded-2xl border bg-white p-4 shadow-sm backdrop-blur",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">{heading}</div>
        <RequestStatusBadge status={status} />
      </div>

      {children ? (
        <div className="mt-4 space-y-3 text-sm">{children}</div>
      ) : null}

      {footer ? (
        <div className="text-muted-foreground mt-4 border-t pt-4 text-xs">
          {footer}
        </div>
      ) : null}
    </article>
  );
};
