import { Typography } from "@heroui/react";
import type { ComponentProps } from "react";

export type SubsectionTitleProps = ComponentProps<typeof Typography.Heading>;

/** An `<h3>` for a card or a subsection. */
export function SubsectionTitle({ className, ...props }: SubsectionTitleProps) {
  return (
    <Typography.Heading
      level={3}
      weight="medium"
      {...props}
      className={className}
    />
  );
}
