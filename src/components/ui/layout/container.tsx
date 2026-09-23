"use client";

import type { BoxProps } from "./box";
import { Box } from "./box";
import { cn } from "@/lib/cn";

export type ContainerProps = BoxProps;

/** Centres page content and applies the standard max width and padding. */
export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <Box className={cn("mx-auto w-full max-w-6xl px-6", className)} {...props}>
      {children}
    </Box>
  );
}
