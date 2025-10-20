import Image from "next/image";

import { AuthForm } from "./components/auth-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <Image
          src="/login-deco.png"
          alt="HiveR dekoracja"
          fill
          priority
          className="object-contain object-center select-none"
          style={{ transform: "translate(-30%, 15%) scale(1.5)" }}
        />
      </div>

      <div className="relative z-10 flex w-full items-center justify-center px-6 py-10 lg:justify-end lg:px-20 lg:py-0">
        <div className="flex w-full max-w-md flex-col items-center gap-6 p-8 text-center lg:ml-auto">
          <Image
            src="/logo.svg"
            alt="HiveR"
            width={280}
            height={180}
            priority
            className="h-auto w-40 md:w-56"
          />
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
