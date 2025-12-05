"use client";

import type { GeneralRequest } from "@/types/request-types";

import { AwaitingRequestsGrid } from "../components/awaiting-requests-grid";
import { GeneralRequestCard } from "../components/general-request-card";
import { RequestsArchive } from "../components/requests-archive";
import { useGeneralRequests } from "../hooks/use-requests";

export default function GeneralRequestsPage() {
  const { data, isLoading, error } = useGeneralRequests();
  const buckets = data?.data.buckets;

  return (
    <div className="mx-4 mt-8 space-y-10 pb-12 md:mx-0">
      <AwaitingRequestsGrid
        title="Oczekujące wnioski ogólne"
        description="Sprawy wymagające decyzji lub komentarza."
        requests={buckets?.pending}
        isLoading={isLoading}
        error={error?.error}
        emptyMessage="Brak oczekujących wniosków ogólnych."
        renderCard={(request: GeneralRequest) => (
          <GeneralRequestCard request={request} />
        )}
      />

      <RequestsArchive
        title="Archiwum wniosków ogólnych"
        description="Wszystkie sprawy, które zostały już rozpatrzone."
        buckets={buckets}
        isLoading={isLoading}
        emptyMessage="Brak archiwalnych wniosków ogólnych."
        renderCard={(request: GeneralRequest) => (
          <GeneralRequestCard request={request} />
        )}
      />
    </div>
  );
}
