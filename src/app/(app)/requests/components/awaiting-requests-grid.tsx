import type { ReactNode } from "react";

const DEFAULT_SKELETONS = 3;

type AwaitingRequestsGridProps = {
  title: string;
  description?: string;
  requests?: any[];
  isLoading?: boolean;
  error?: string;
  emptyMessage?: string;
  skeletonCount?: number;
  renderCard: (request: any) => ReactNode;
  getKey?: (request: any, index: number) => string | number;
};

const SkeletonCard = () => (
  <div className="border-border/60 bg-muted/40 animate-pulse rounded-2xl border border-dashed p-4">
    <div className="bg-muted-foreground/40 mb-6 h-5 w-2/3 rounded" />
    <div className="bg-muted-foreground/30 mb-3 h-4 w-1/2 rounded" />
    <div className="bg-muted-foreground/20 h-20 rounded" />
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="border-border/80 bg-card/40 text-muted-foreground rounded-2xl border border-dashed p-6 text-center text-sm">
    {message}
  </div>
);

export const AwaitingRequestsGrid = ({
  title,
  description,
  requests,
  isLoading,
  error,
  emptyMessage = "Brak oczekujących pozycji",
  skeletonCount = DEFAULT_SKELETONS,
  renderCard,
  getKey,
}: AwaitingRequestsGridProps) => {
  const getItemKey = (item: any, index: number) => {
    if (typeof getKey === "function") {
      return getKey(item, index);
    }
    if (item && typeof item === "object" && "id" in item) {
      return (item as { id: string | number }).id;
    }
    return `${index}`;
  };

  const showSkeleton = isLoading && (!requests || requests.length === 0);
  const showEmpty =
    !isLoading && !error && (!requests || requests.length === 0);

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </header>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          Nie udało się pobrać danych: {error}
        </div>
      ) : null}

      {showSkeleton ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : null}

      {showEmpty ? <EmptyState message={emptyMessage} /> : null}

      {!showSkeleton && !showEmpty && requests && requests.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {requests.map((request, index) => (
            <div key={getItemKey(request, index)}>{renderCard(request)}</div>
          ))}
        </div>
      ) : null}
    </section>
  );
};
