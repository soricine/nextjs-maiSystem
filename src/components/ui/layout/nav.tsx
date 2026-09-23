"use client";

import { Surface } from "@heroui/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type NavProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function Nav({ children, className, ...props }: NavProps) {
  return (
    <Surface
      variant="transparent"
      className={cn(className)}
      render={(surfaceProps) => <nav {...surfaceProps} />}
      {...props}
    >
      {children}
    </Surface>
  );
}
