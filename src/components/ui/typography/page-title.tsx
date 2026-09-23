import { Typography } from "@heroui/react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

export type PageTitleProps = ComponentProps<typeof Typography.Heading>;

/** The single `<h1>` of a page. Use exactly one per screen. */
export function PageTitle({ className, ...props }: PageTitleProps) {
  return (
    <Typography.Heading
      level={1}
      weight="semibold"
      className={cn("tracking-tight", className)}
      {...props}
    />
  );
}
