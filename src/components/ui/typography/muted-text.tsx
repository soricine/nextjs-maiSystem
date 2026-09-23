import { Typography } from "@heroui/react";
import type { ComponentProps } from "react";

export type MutedTextProps = ComponentProps<typeof Typography.Paragraph>;

/** Small, de-emphasised text: hints, timestamps, helper copy. */
export function MutedText({ className, ...props }: MutedTextProps) {
  return (
    <Typography.Paragraph
      size="sm"
      color="muted"
      className={className}
      {...props}
    />
  );
}
