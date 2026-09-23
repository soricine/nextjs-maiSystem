"use client";

import { Surface } from "@heroui/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type FooterProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function Footer({ children, className, ...props }: FooterProps) {
  return (
    <Surface
      variant="transparent"
      className={cn(className)}
      render={(surfaceProps) => <footer {...surfaceProps} />}
      {...props}
    >
      {children}
    </Surface>
  );
}
