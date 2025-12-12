"use client";

import type { AvailabilityRequest } from "@/types/request-types";

import { AvailabilityRequestCard } from "./components/availability-request-card";
import { AwaitingRequestsGrid } from "./components/awaiting-requests-grid";
import { RequestsArchive } from "./components/requests-archive";
import { useAvailabilityRequests } from "./hooks/use-requests";

export default function RequestsPage() {
  const { data, isLoading, error } = useAvailabilityRequests();
  const buckets = data?.data.buckets;

  return (
    <div className="mx-4 mt-8 space-y-10 pb-12 md:mx-0 md:mr-4">
      <AwaitingRequestsGrid
        title="Oczekujące wnioski obecności"
        description="Lista wniosków, które nadal czekają na Twoją decyzję."
        requests={buckets?.pending}
        isLoading={isLoading}
        error={error?.error}
        emptyMessage="Brak oczekujących wniosków obecności."
        renderCard={(request: AvailabilityRequest) => (
          <AvailabilityRequestCard request={request} />
        )}
      />

      <RequestsArchive
        title="Wnioski archiwalne"
        description="Wszystkie zatwierdzone, odrzucone oraz inne wnioski."
        buckets={buckets}
        isLoading={isLoading}
        emptyMessage="Brak rozpatrzonych wniosków."
        renderCard={(request: AvailabilityRequest) => (
          <AvailabilityRequestCard request={request} />
        )}
      />
    </div>
  );
}
