import { Typography } from "@heroui/react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

export type EyebrowProps = ComponentProps<typeof Typography.Paragraph>;

/** The short uppercase label that sits above a section title. */
export function Eyebrow({ className, ...props }: EyebrowProps) {
  return (
    <Typography.Paragraph
      size="xs"
      color="muted"
      weight="semibold"
      className={cn("uppercase tracking-widest", className)}
      {...props}
    />
  );
}
