"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 overflow-hidden bg-slate-900">
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
        Witaj w HiveR
      </h1>
      <div className="flex gap-4">
        <Link href="/login">
          <Button variant="secondary" size="lg">
            Zaloguj się
          </Button>
        </Link>
      </div>
    </div>
  );
}
