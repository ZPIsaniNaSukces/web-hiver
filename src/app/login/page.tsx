import Image from "next/image";

import { AuthForm } from "./components/auth-form";

export default function LoginPage() {
  return (
    <div className="fixed inset-0 z-0 flex min-h-screen w-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <Image
          src="/login-deco.png"
          alt="HiveR dekoracja"
          fill
          priority
          className="object-contain object-center select-none"
          style={{ transform: "translate(-40%, 10%) scale(1.8)" }}
        />
      </div>

      <div className="relative z-10 flex w-full items-center justify-center py-10 lg:justify-end lg:px-20 lg:py-0">
        <div className="flex w-full max-w-md flex-col items-center gap-6 p-8 text-center lg:ml-auto">
          <Image
            src="/logo.svg"
            alt="HiveR"
            width={280}
            height={180}
            priority
            className="h-auto w-56 md:w-64"
          />
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
