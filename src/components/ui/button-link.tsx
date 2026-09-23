import { buttonVariants, Link } from "@heroui/react";
import type { ButtonVariants } from "@heroui/react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

/**
 * A link that looks like a button.
 *
 * HeroUI's `Button` renders a `<button>` and deliberately has no `href` — a
 * button that navigates should be a real link, so keyboard users get
 * "open in new tab" and screen readers announce it correctly. This component
 * pairs HeroUI's `Link` with the button styles so navigation still looks like
 * a call to action.
 *
 *   <ButtonLink href="/signup" variant="primary" size="lg">Create account</ButtonLink>
 *
 * Use `Button` when the click does something (submit, open a dialog, delete),
 * and `ButtonLink` when it goes somewhere.
 */
export type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> &
  ButtonVariants & {
    className?: string;
  };

export function ButtonLink({
  className,
  fullWidth,
  isIconOnly,
  size,
  variant,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        buttonVariants({ fullWidth, isIconOnly, size, variant }),
        "no-underline",
        className,
      )}
      {...props}
    />
  );
}
