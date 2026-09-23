"use client";

import type { BoxProps } from "./box";
import { Box } from "./box";
import { cn } from "@/lib/cn";

export type StackProps = BoxProps;

/** Children in a vertical column. Set the gap with `className="gap-4"`. */
export function Stack({ children, className, ...props }: StackProps) {
  return (
    <Box className={cn("flex flex-col", className)} {...props}>
      {children}
    </Box>
  );
}
