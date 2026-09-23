"use client";

import { Surface } from "@heroui/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type MainProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function Main({ children, className, ...props }: MainProps) {
  return (
    <Surface
      variant="transparent"
      className={cn(className)}
      render={(surfaceProps) => <main {...surfaceProps} />}
      {...props}
    >
      {children}
    </Surface>
  );
}
