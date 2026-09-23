"use client";

import { Surface } from "@heroui/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type BoxProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function Box({ children, className, ...props }: BoxProps) {
  return (
    <Surface variant="transparent" className={cn(className)} {...props}>
      {children}
    </Surface>
  );
}
