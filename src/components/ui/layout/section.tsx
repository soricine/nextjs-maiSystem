"use client";

import { Surface } from "@heroui/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function Section({ children, className, ...props }: SectionProps) {
  return (
    <Surface
      variant="transparent"
      className={cn(className)}
      render={(surfaceProps) => <section {...surfaceProps} />}
      {...props}
    >
      {children}
    </Surface>
  );
}
