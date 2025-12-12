"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

import { useAuth } from "@/app/login/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { DataStateWrapper } from "@/components/ui/data-state-wrapper";
import { Input } from "@/components/ui/input";

import { UserList } from "./components/user-list";
import { useUsersInfiniteSearch } from "./hooks/use-users-infinite-search";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const { isAdmin } = useAuth();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [observerRoot, setObserverRoot] = useState<Element | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUsersInfiniteSearch(deferredSearch);

  const users = data?.pages.flatMap((page) => page?.data?.data ?? []) ?? [];

  const lastPage = data?.pages[data.pages.length - 1];
  const meta = lastPage?.data?.meta;

  const { ref, inView } = useInView({
    root: observerRoot,
    rootMargin: "200px",
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  return (
    <div className="h-full flex-1">
      <div
        ref={(node) => {
          scrollRef.current = node;
          setObserverRoot(node);
        }}
        className="mx-4 h-full space-y-4 overflow-y-auto md:mr-8 md:ml-0"
      >
        <h1 className="text-2xl font-semibold">Pracownicy</h1>
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Szukaj po imieniu, mailu itd..."
              className="max-w-md"
            />
            {isAdmin ? (
              <Button asChild>
                <Link href="/users/add">Dodaj</Link>
              </Button>
            ) : null}
          </div>
          {meta && (
            <span className="text-xs text-gray-500">
              Znaleziono {meta.total} użytkowników
            </span>
          )}
        </div>
        <DataStateWrapper
          isLoading={isLoading}
          isError={isError}
          errorMessage={error?.error}
          hasData={users.length > 0}
          emptyFallback={<span>Nie znaleziono użytkowników.</span>}
        >
          <UserList users={users} />

          <div ref={ref} className="py-4 text-center text-sm text-gray-500">
            {isFetchingNextPage
              ? "Ładowanie kolejnych..."
              : hasNextPage
                ? "Przescrolluj niżej, żeby załadować więcej"
                : "To już wszystko"}
          </div>
        </DataStateWrapper>
      </div>
    </div>
  );
}
