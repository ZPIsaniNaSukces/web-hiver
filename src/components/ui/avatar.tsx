"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";

import { cn } from "@/lib/utils";

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

type AvatarFallbackProps = React.ComponentProps<
  typeof AvatarPrimitive.Fallback
> & {
  colorSeed?: string;
};

const FALLBACK_COLOR_CLASSES = [
  "bg-amber-100 text-amber-700",
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
  "bg-lime-100 text-lime-700",
  "bg-indigo-100 text-indigo-700",
  "bg-orange-100 text-orange-700",
  "bg-cyan-100 text-cyan-700",
  "bg-fuchsia-100 text-fuchsia-700",
];

function extractSeedFromChildren(children: React.ReactNode): string {
  if (children == null) {
    return "";
  }

  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(extractSeedFromChildren).join("");
  }

  if (React.isValidElement(children)) {
    const elementChildren = (children.props as { children?: React.ReactNode })
      ?.children;
    return extractSeedFromChildren(elementChildren);
  }

  return "";
}

function getColorClasses(seed: string): string {
  if (!seed) {
    return FALLBACK_COLOR_CLASSES[0];
  }

  const normalizedSeed = seed.trim().toLowerCase();

  if (!normalizedSeed) {
    return FALLBACK_COLOR_CLASSES[0];
  }

  const charCodeSum = Array.from(normalizedSeed).reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0,
  );

  const index = charCodeSum % FALLBACK_COLOR_CLASSES.length;
  return FALLBACK_COLOR_CLASSES[index];
}

function AvatarFallback({
  className,
  colorSeed,
  children,
  ...props
}: AvatarFallbackProps) {
  const seed = colorSeed ?? extractSeedFromChildren(children);
  const colorClasses = React.useMemo(() => getColorClasses(seed), [seed]);

  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        colorClasses,
        className,
      )}
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  );
}

export { Avatar, AvatarImage, AvatarFallback };
