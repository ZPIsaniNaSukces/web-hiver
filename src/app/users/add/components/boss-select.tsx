"use client";

import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { InView } from "react-intersection-observer";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { User } from "@/types/auth-types";

import { useUsersInfiniteSearch } from "../../hooks/use-users-infinite-search";
import { formatRole, getInitials } from "../../utils";

type BossSelectProps = {
  value: User | null;
  onChange: (user: User | null) => void;
  disabled?: boolean;
  error?: string;
};

export function BossSelect({
  value,
  onChange,
  disabled,
  error,
}: BossSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useUsersInfiniteSearch(open ? deferredSearch : "");

  const users = useMemo(
    () => data?.pages.flatMap((page) => page.data.data) ?? [],
    [data],
  );

  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const handleLoadMore = (inView: boolean) => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="flex w-full flex-col gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="inline-flex w-full items-center justify-between gap-2"
          >
            <span className="truncate text-left">
              {value
                ? `${value.name} ${value.surname}`
                : "Wybierz przełożonego"}
            </span>
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder="Szukaj po nazwisku, mailu..."
            />
            <CommandList>
              <CommandEmpty>
                {isLoading ? "Ładowanie..." : "Brak wyników"}
              </CommandEmpty>
              <CommandItem
                value="__none__"
                onSelect={() => {
                  onChange(null);
                  setOpen(false);
                }}
              >
                Brak przełożonego
                {!value && <Check className="ml-auto size-4" />}
              </CommandItem>
              {users.map((user) => {
                const isSelected = value?.id === user.id;
                return (
                  <CommandItem
                    key={user.id}
                    value={user.id}
                    onSelect={() => {
                      onChange(user);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarFallback className="bg-amber-100 text-amber-700">
                          {getInitials(user.name, user.surname)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-medium text-gray-900">
                          {user.name} {user.surname}
                        </span>
                        <span className="text-xs text-gray-500">
                          {user.email} · {formatRole(user.role)}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="text-primary ml-auto size-4" />
                    )}
                  </CommandItem>
                );
              })}
              <InView onChange={handleLoadMore} rootMargin="200px">
                {({ ref }) => (
                  <div
                    ref={ref}
                    className="py-3 text-center text-xs text-gray-500"
                  >
                    {isFetchingNextPage ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        Ładowanie kolejnych...
                      </span>
                    ) : hasNextPage ? (
                      "Przescrolluj niżej, żeby załadować więcej"
                    ) : (
                      "To już wszystko"
                    )}
                  </div>
                )}
              </InView>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
