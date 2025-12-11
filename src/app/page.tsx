"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="">
      <div className="mt-16 flex w-full flex-col items-center justify-center px-4 md:mt-64">
        <div className="z-30 flex w-full flex-col justify-center gap-4 text-start md:text-center">
          <h1 className="w-full text-5xl font-semibold md:text-7xl 2xl:text-9xl">
            Zbuduj idealnie
          </h1>
          <h1 className="flex flex-col justify-center gap-3 text-start text-5xl font-semibold md:flex-row md:text-center md:text-7xl 2xl:text-9xl">
            zorganizowany <p className="text-primary font-serif">ul pracy</p>
          </h1>
        </div>
        <h2 className="mt-8 w-full max-w-full justify-center text-start text-lg md:max-w-3/5 md:text-center md:text-2xl 2xl:max-w-1/2 2xl:text-4xl">
          Nowoczesny system HR dla firm, które nie chcą tracić czasu (ani
          pieniędzy). Automatyzuj swoje procesy i skup się na tym, co ważne.
        </h2>
      </div>
      <div className="pointer-events-none inset-0 -z-10 hidden lg:block">
        <Image
          src="/HONEYYYY3.svg"
          alt="HiveR dekoracja"
          fill
          priority
          className="object-contain object-right select-none"
          style={{ transform: "translate(10%, -10%) scale(0.8)" }}
        />
      </div>
      <div className="pointer-events-none inset-0 -z-10 hidden lg:block">
        <Image
          src="/honey.svg"
          alt="HiveR dekoracja"
          fill
          priority
          className="object-contain select-none"
          style={{ transform: "translate(-40%, 60%) scale(0.8)" }}
        />
      </div>
      <div className="pointer-events-none inset-0 -z-10 hidden lg:block 2xl:hidden">
        <Image
          src="/bee.svg"
          alt="HiveR dekoracja"
          fill
          priority
          className="z-100 object-contain object-right select-none"
          style={{ transform: "translate(-25%, -15%) scale(0.1)" }}
        />
      </div>
      <div className="pointer-events-none inset-0 -z-10 hidden 2xl:block">
        <Image
          src="/bee.svg"
          alt="HiveR dekoracja"
          fill
          priority
          className="z-100 object-contain object-right select-none"
          style={{ transform: "translate(-20%, -30%) scale(0.1)" }}
        />
      </div>
    </div>
  );
}
