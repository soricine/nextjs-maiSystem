import type { ReactNode } from "react";

import { Row, Stack } from "@/components/ui/layout";

/*
 * Auth layout: a centred card inside the public chrome, for sign in, sign up
 * and password reset. It nests under the public layout, so these pages keep
 * the main nav bar rather than being a dead end.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Row className="flex-1 justify-center px-6 py-16">
      <Stack className="w-full max-w-md gap-6">{children}</Stack>
    </Row>
  );
}
