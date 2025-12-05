"use client";

import Link from "next/link";
import { useDeferredValue, useRef, useState } from "react";
import { InView } from "react-intersection-observer";

import { Button } from "@/components/ui/button";
import { DataStateWrapper } from "@/components/ui/data-state-wrapper";
import { Input } from "@/components/ui/input";

import { UserList } from "./components/user-list";
import { useUsersInfiniteSearch } from "./hooks/use-users-infinite-search";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUsersInfiniteSearch(deferredSearch);

  const users = data?.pages.flatMap((page) => page.data.data) ?? [];

  const lastPage = data?.pages[data.pages.length - 1];
  const meta = lastPage?.data.meta;

  return (
    <div className="h-full flex-1">
      <div
        ref={scrollRef}
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
            <Button asChild>
              <Link href="/users/add">Dodaj</Link>
            </Button>
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

          <InView
            root={scrollRef.current}
            onChange={(inView) => {
              if (inView && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
          >
            {({ ref }) => (
              <div ref={ref} className="py-4 text-center text-sm text-gray-500">
                {isFetchingNextPage
                  ? "Ładowanie kolejnych..."
                  : hasNextPage
                    ? "Przescrolluj niżej, żeby załadować więcej"
                    : "To już wszystko"}
              </div>
            )}
          </InView>
        </DataStateWrapper>
      </div>
    </div>
  );
}
