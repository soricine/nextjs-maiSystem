"use client";

import type { BoxProps } from "./box";
import { Box } from "./box";
import { cn } from "@/lib/cn";

export type RowProps = BoxProps;

/** Children in a horizontal, vertically-centred row. */
export function Row({ children, className, ...props }: RowProps) {
  return (
    <Box className={cn("flex items-center", className)} {...props}>
      {children}
    </Box>
  );
}
