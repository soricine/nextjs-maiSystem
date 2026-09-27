"use client";

import { useEffect, useState } from "react";
import { Button, Dropdown, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";

import { ButtonLink } from "@/components/ui/button-link";
import {
  Container,
  Header,
  Main,
  Nav,
  Row,
  Stack,
} from "@/components/ui/layout";
import { useLogout, useMe } from "@/lib/api/auth";
import { clearSession, hasSession } from "@/lib/api/client";

// Dashboard layout: client-side auth guard + top navigation. The front-end
// is a static client (docs/architecture.md), so the guard runs in the
// browser: no tokens -> /login; a session that fails /api/auth/me even
// after a refresh attempt is treated as expired.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const me = useMe();
  const logout = useLogout();
  const [checkedSession, setCheckedSession] = useState(false);

  useEffect(() => {
    if (!hasSession()) {
      router.replace("/login");
    } else {
      setCheckedSession(true);
    }
  }, [router]);

  useEffect(() => {
    if (checkedSession && me.isError) {
      clearSession();
      router.replace("/login");
    }
  }, [checkedSession, me.isError, router]);

  if (!checkedSession || !me.data) {
    return (
      <Row className="min-h-dvh justify-center">
        <Spinner size="lg" aria-label="Loading your mailbox" />
      </Row>
    );
  }

  const signOut = () =>
    logout.mutate(undefined, { onSettled: () => router.push("/login") });

  return (
    <Stack className="min-h-dvh">
      <Header className="border-b border-border bg-background/80 backdrop-blur">
        <Container className="flex h-16 items-center justify-between">
          <Row className="gap-4">
            <ButtonLink
              href="/dashboard"
              variant="ghost"
              className="-ml-3 font-semibold"
            >
              Virtual Mailbox
            </ButtonLink>
            <Nav className="flex items-center gap-1">
              <ButtonLink href="/dashboard" variant="ghost" size="sm">
                Inbox
              </ButtonLink>
              <ButtonLink href="/dashboard/account" variant="ghost" size="sm">
                Account
              </ButtonLink>
            </Nav>
          </Row>
          <Dropdown>
            <Button variant="ghost">{me.data.name}</Button>
            <Dropdown.Popover placement="bottom end">
              <Dropdown.Menu
                onAction={(key) => {
                  if (key === "signout") signOut();
                }}
              >
                <Dropdown.Item id="account" href="/dashboard/account">
                  Account settings
                </Dropdown.Item>
                <Dropdown.Item id="signout" variant="danger">
                  Sign out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </Container>
      </Header>
      <Main className="flex-1">
        <Container className="py-10">{children}</Container>
      </Main>
    </Stack>
  );
}
