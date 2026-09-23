"use client";

import { Surface } from "@heroui/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type HeaderProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function Header({ children, className, ...props }: HeaderProps) {
  return (
    <Surface
      variant="transparent"
      className={cn(className)}
      render={(surfaceProps) => <header {...surfaceProps} />}
      {...props}
    >
      {children}
    </Surface>
  );
}
