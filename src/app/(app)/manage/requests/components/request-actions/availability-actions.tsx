"use client";

import { useAvailabilityRequestActions } from "../../hooks/use-request-actions";
import { RequestActions } from "./request-actions";

export const AvailabilityRequestActions = ({
  requestId,
}: {
  requestId: string;
}) => {
  const availabilityActions = useAvailabilityRequestActions();
  const onApprove = async () => {
    availabilityActions.mutate({
      id: requestId,
      action: "approve",
    });
  };
  const onReject = async () => {
    availabilityActions.mutate({
      id: requestId,
      action: "reject",
    });
  };
  return <RequestActions onApprove={onApprove} onReject={onReject} />;
};
