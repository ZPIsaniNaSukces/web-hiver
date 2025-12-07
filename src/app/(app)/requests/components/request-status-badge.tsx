import { cn } from "@/lib/utils";
import { RequestStatus } from "@/types/request-types";

const STATUS_LABELS: Record<RequestStatus, string> = {
  [RequestStatus.PENDING]: "Oczekuje",
  [RequestStatus.APPROVED]: "Zatwierdzony",
  [RequestStatus.REJECTED]: "Odrzucony",
};

const STATUS_CLASSES: Record<RequestStatus, string> = {
  [RequestStatus.PENDING]: "bg-amber-100 text-amber-800 border-amber-200",
  [RequestStatus.APPROVED]:
    "bg-emerald-100 text-emerald-800 border-emerald-200",
  [RequestStatus.REJECTED]: "bg-rose-100 text-rose-800 border-rose-200",
};

export const RequestStatusBadge = ({
  status,
  className,
}: {
  status: RequestStatus;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase",
        STATUS_CLASSES[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
};
