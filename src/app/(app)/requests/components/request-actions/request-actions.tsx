"use client";

import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";

export const RequestActions = ({
  onApprove,
  onReject,
}: {
  onApprove: () => void;
  onReject: () => void;
}) => {
  return (
    <div className="flex space-x-2">
      <Button
        onClick={onApprove}
        className="border-emerald-200 bg-emerald-100 text-xs text-emerald-800 hover:bg-emerald-200"
      >
        <CheckIcon />
        Approve
      </Button>
      <Button
        onClick={onReject}
        className="border-rose-200 bg-rose-100 text-xs text-rose-800 hover:bg-rose-200"
      >
        <Cross1Icon />
        Reject
      </Button>
    </div>
  );
};
