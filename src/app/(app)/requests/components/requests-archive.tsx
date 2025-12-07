"use client";

import type { ReactNode } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { RequestBuckets } from "@/lib/request-utils";

const ARCHIVE_SECTIONS = [
  {
    key: "accepted" as const,
    title: "Zatwierdzone",
    description: "Wnioski zakończone pozytywnie",
  },
  {
    key: "rejected" as const,
    title: "Odrzucone",
    description: "Wnioski zamknięte z odmową",
  },
  {
    key: "unknown" as const,
    title: "Pozostałe",
    description: "Wnioski w innym stanie",
  },
];

type RequestsArchiveProps = {
  title: string;
  description?: string;
  buckets?: RequestBuckets<any>;
  renderCard: (request: any) => ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
  getKey?: (request: any, index: number) => string | number;
};

const SkeletonRow = () => (
  <div className="border-border/50 bg-muted/30 animate-pulse rounded-xl border border-dashed p-4" />
);

export const RequestsArchive = ({
  title,
  description,
  buckets,
  renderCard,
  isLoading,
  emptyMessage = "Brak archiwalnych pozycji",
  getKey,
}: RequestsArchiveProps) => {
  const sectionsWithCounts = ARCHIVE_SECTIONS.map((section) => {
    const items = buckets?.[section.key] ?? [];
    return { ...section, count: items.length, items };
  });

  const hasAnyItems = sectionsWithCounts.some((section) => section.count > 0);
  const showEmpty = !isLoading && !hasAnyItems;

  const getItemKey = (item: any, index: number) => {
    if (typeof getKey === "function") {
      return getKey(item, index);
    }
    if (item && typeof item === "object" && "id" in item) {
      return (item as { id: string | number }).id;
    }
    return `${index}`;
  };

  const defaultValues = sectionsWithCounts
    .filter((section) => section.count > 0)
    .map((section) => section.key);

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </header>

      {isLoading && !hasAnyItems ? (
        <div className="space-y-3">
          <SkeletonRow />
          <SkeletonRow />
        </div>
      ) : null}

      {showEmpty ? (
        <div className="border-border/80 bg-card/40 text-muted-foreground rounded-2xl border border-dashed p-6 text-center text-sm">
          {emptyMessage}
        </div>
      ) : (
        <Accordion
          type="multiple"
          defaultValue={defaultValues.length ? defaultValues : undefined}
          className="bg-card/30 rounded-2xl md:mr-4"
        >
          {sectionsWithCounts.map((section) => (
            <AccordionItem key={section.key} value={section.key}>
              <AccordionTrigger>
                <div className="flex flex-1 flex-col text-left">
                  <span className="text-base font-medium">{section.title}</span>
                  <span className="text-muted-foreground text-xs">
                    {section.description}
                  </span>
                </div>
                <span className="text-muted-foreground text-xs font-semibold">
                  {section.count}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                {section.count === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Brak pozycji w tej sekcji
                  </p>
                ) : (
                  <div className="space-y-4">
                    {section.items.map((item: any, index: number) => (
                      <div key={getItemKey(item, index)}>
                        {renderCard(item)}
                      </div>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </section>
  );
};
