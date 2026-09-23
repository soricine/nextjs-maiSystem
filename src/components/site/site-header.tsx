import { ButtonLink } from "@/components/ui/button-link";
import { Container, Header, Nav } from "@/components/ui/layout";
import { cn } from "@/lib/cn";

export type SiteHeaderProps = {
  className?: string;
};

/**
 * The main navigation bar for the public, unauthenticated side of the site.
 * Rendered once by the public layout so the marketing page, sign in, sign up
 * and password reset all share the same chrome. The dashboard has its own
 * header (see src/app/dashboard/layout.tsx) because its nav is different.
 */
export function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <Header
      className={cn(
        "sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur",
        className,
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <ButtonLink href="/" variant="ghost" className="-ml-3 font-semibold">
          Virtual Mailbox
        </ButtonLink>

        <Nav className="flex items-center gap-2">
          <ButtonLink href="/login" variant="ghost" size="sm">
            Sign in
          </ButtonLink>
          <ButtonLink href="/signup" variant="primary" size="sm">
            Create account
          </ButtonLink>
        </Nav>
      </Container>
    </Header>
  );
}
