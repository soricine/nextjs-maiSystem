import { Typography } from "@heroui/react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

export type SectionTitleProps = ComponentProps<typeof Typography.Heading>;

/** An `<h2>` that opens a major section of a page. */
export function SectionTitle({ className, ...props }: SectionTitleProps) {
  return (
    <Typography.Heading
      level={2}
      weight="semibold"
      className={cn("tracking-tight", className)}
      {...props}
    />
  );
}
