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

export default function StaffLayout({
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
      return;
    }

    setCheckedSession(true);
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
        <Spinner size="lg" aria-label="Loading dashboard" />
      </Row>
    );
  }

  const signOut = () =>
    logout.mutate(undefined, {
      onSettled: () => {
        clearSession();
        router.push("/login");
      },
    });

  return (
    <Stack className="min-h-dvh bg-muted">
      {/* Top WordPress-style admin bar */}
      <Header className="h-14 border-b border-border bg-background">
        <Container className="flex h-full items-center justify-between">
          <Row className="gap-6">
            <ButtonLink
              href="/staff/dashboard"
              variant="ghost"
              className="font-semibold"
            >
              My CMS
            </ButtonLink>

            <span className="text-sm text-muted-foreground">
              Staff Panel
            </span>
          </Row>

          <Dropdown>
            <Button variant="ghost">
              {me.data.name}
            </Button>

            <Dropdown.Popover placement="bottom end">
              <Dropdown.Menu
                onAction={(key) => {
                  if (key === "profile") {
                    router.push("/staff/profile");
                  }

                  if (key === "signout") {
                    signOut();
                  }
                }}
              >
                <Dropdown.Item id="profile">
                  Profile
                </Dropdown.Item>

                <Dropdown.Item
                  id="signout"
                  variant="danger"
                >
                  Sign out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </Container>
      </Header>

      <Row className="min-h-[calc(100dvh-3.5rem)]">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-border bg-background md:block">
          <Nav className="flex flex-col gap-1 p-4">

            <ButtonLink
              href="/staff/dashboard"
              variant="ghost"
              className="justify-start"
            >
              Dashboard
            </ButtonLink>

            <ButtonLink
              href="/staff/users"
              variant="ghost"
              className="justify-start"
            >
              Users
            </ButtonLink>

            <ButtonLink
              href="/staff/posts"
              variant="ghost"
              className="justify-start"
            >
              Posts
            </ButtonLink>

            <ButtonLink
              href="/staff/media"
              variant="ghost"
              className="justify-start"
            >
              Media
            </ButtonLink>

            <ButtonLink
              href="/staff/profile"
              variant="ghost"
              className="justify-start"
            >
              Profile
            </ButtonLink>

          </Nav>
        </aside>

        {/* Main content */}
        <Main className="min-w-0 flex-1">
          <Container className="py-8">
            {children}
          </Container>
        </Main>
      </Row>
    </Stack>
  );
}