import { Typography } from "@heroui/react";
import type { ComponentProps } from "react";

export type BodyTextProps = ComponentProps<typeof Typography.Paragraph>;

/** Ordinary running text. `size="sm"` for dense UI such as table cells. */
export function BodyText({ className, ...props }: BodyTextProps) {
  return <Typography.Paragraph className={className} {...props} />;
}
