"use client";

import { useDeferredValue, useRef, useState } from "react";
import { InView } from "react-intersection-observer";

import { Input } from "@/components/ui/input";

import { useUsersInfiniteSearch } from "./hooks/useUsersInfiniteSearch";

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

  if (isLoading) return <div>Ładowanie...</div>;
  if (isError) return <div>Błąd: {error.error}</div>;

  const users = data?.pages.flatMap((page) => page.data.data) ?? [];

  const lastPage = data?.pages[data.pages.length - 1];
  const meta = lastPage?.data.meta;

  return (
    <div className="h-full flex-1">
      <div ref={scrollRef} className="h-full space-y-4 overflow-y-auto p-4">
        <div className="flex max-w-md flex-col gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj po imieniu, mailu itd..."
            className=""
          />
          {meta && (
            <span className="text-xs text-gray-500">
              Znaleziono {meta.total} użytkowników
            </span>
          )}
        </div>

        <ul className="space-y-2">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex flex-col gap-1 rounded border px-3 py-2"
            >
              <span className="font-medium">
                {user.name} {user.surname}
              </span>
              <span className="text-sm text-gray-600">{user.email}</span>
              <span className="text-xs text-gray-500">
                {user.role} · companyId: {user.companyId}
              </span>
            </li>
          ))}
        </ul>

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
                  : "To już wszystko 🙂"}
            </div>
          )}
        </InView>
      </div>
    </div>
  );
}
