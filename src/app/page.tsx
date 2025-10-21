"use client";

import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { fetchLogout } from "./login/utils";

export default function Home() {
  const router = useRouter();
  const { isPending, isSuccess, mutate } = useMutation({
    mutationFn: fetchLogout,
    onSuccess: () => {
      console.log("Logged out successfully");
      router.push("/login");
    },
    onError: (error: any) => {
      alert(error?.error || "Logout failed");
    },
  });

  const handleLogout = async () => {
    mutate();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 overflow-hidden bg-gradient-to-br from-slate-950 to-blue-900">
      <Image
        className="px-4"
        src="/logo.svg"
        alt="Solvro Logo"
        style={{ objectFit: "cover" }}
        width={400}
        height={400}
        priority
      />
      <h1 className="px-4 text-center font-sans text-xl text-white md:text-4xl">
        Twoja aplikacja NEXT.JS się odpala
      </h1>
      <Button onClick={handleLogout} disabled={isPending}>
        Wyloguj się
      </Button>
    </div>
  );
}
