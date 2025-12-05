"use client";

import { useGeneralRequestActions } from "../../hooks/use-request-actions";
import { RequestActions } from "./request-actions";

export const GeneralRequestActions = ({ requestId }: { requestId: string }) => {
  const generalActions = useGeneralRequestActions();
  const onApprove = async () => {
    generalActions.mutate({
      id: requestId,
      action: "approve",
    });
  };
  const onReject = async () => {
    generalActions.mutate({
      id: requestId,
      action: "reject",
    });
  };
  return <RequestActions onApprove={onApprove} onReject={onReject} />;
};
