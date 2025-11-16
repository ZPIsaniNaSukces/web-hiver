"use client";

import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { User } from "@/types/auth-types";

export const authUserAtom = atomWithStorage<User | null>(
  "auth-user-cache",
  null,
  {
    getItem: (key) => {
      if (typeof sessionStorage === "undefined") return null;
      const raw = sessionStorage.getItem(key);
      return raw ? (JSON.parse(raw) as User) : null;
    },
    setItem: (key, value) => {
      if (typeof sessionStorage === "undefined") return;
      if (value == null) sessionStorage.removeItem(key);
      else sessionStorage.setItem(key, JSON.stringify(value));
    },
    removeItem: (key) => {
      if (typeof sessionStorage === "undefined") return;
      sessionStorage.removeItem(key);
    },
  },
);

export const authUserOptimisticAtom = atom<User | null>(null);
