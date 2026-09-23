import type { ReactNode } from "react";

import { SiteFooter, SiteHeader } from "@/components/site";
import { Main, Stack } from "@/components/ui/layout";

/*
 * Public layout: the marketing chrome — main nav bar on top, footer at the
 * bottom — shared by every unauthenticated page, including the auth forms.
 * Authenticated pages use the dashboard layout instead
 * (src/app/dashboard/layout.tsx), which has its own header.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <Stack className="min-h-dvh">
      <SiteHeader />
      <Main className="flex flex-1 flex-col">{children}</Main>
      <SiteFooter />
    </Stack>
  );
}
