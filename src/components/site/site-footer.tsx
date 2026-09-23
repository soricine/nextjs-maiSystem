import { ButtonLink } from "@/components/ui/button-link";
import { Container, Footer, Nav } from "@/components/ui/layout";
import { MutedText } from "@/components/ui/typography";
import { cn } from "@/lib/cn";

export type SiteFooterProps = {
  className?: string;
};

/** The footer for the public, unauthenticated side of the site. */
export function SiteFooter({ className }: SiteFooterProps) {
  return (
    <Footer className={cn("border-t border-border px-6 py-10", className)}>
      <Container className="flex flex-col items-start justify-between gap-4 px-0 sm:flex-row sm:items-center">
        <MutedText>© {new Date().getFullYear()} Virtual Mailbox</MutedText>

        <Nav className="flex items-center gap-2">
          <ButtonLink href="/login" variant="ghost" size="sm">
            Sign in
          </ButtonLink>
          <ButtonLink href="/signup" variant="ghost" size="sm">
            Create account
          </ButtonLink>
        </Nav>
      </Container>
    </Footer>
  );
}
