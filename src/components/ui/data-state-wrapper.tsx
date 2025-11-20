import { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Spinner } from "./spinner";

type DataStateWrapperProps = {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  hasData: boolean;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode;
  emptyFallback?: ReactNode;
  className?: string;
  children: ReactNode;
};

function DataStateWrapper({
  isLoading,
  isError,
  errorMessage,
  hasData,
  loadingFallback,
  errorFallback,
  emptyFallback,
  className,
  children,
}: DataStateWrapperProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10 text-sm text-gray-500">
        {loadingFallback ?? (
          <div className="flex items-center gap-2">
            <Spinner className="size-4" />
            <span>Ładowanie...</span>
          </div>
        )}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
        {errorFallback ?? (
          <span>
            Wystąpił błąd
            {errorMessage ? `: ${errorMessage}` : ". Spróbuj ponownie."}
          </span>
        )}
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-sm text-gray-500">
        {emptyFallback ?? <span>Brak danych do wyświetlenia.</span>}
      </div>
    );
  }

  return <div className={cn("flex flex-col gap-4", className)}>{children}</div>;
}

export { DataStateWrapper };
