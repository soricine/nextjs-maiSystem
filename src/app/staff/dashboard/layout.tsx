
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
        <Spinner size="lg" aria-label="Loading staff dashboard" />
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
    <Stack className="min-h-dvh bg-background">
      {/* Top staff bar */}
      <Header className="border-b border-border bg-background">
        <Container className="flex h-14 items-center justify-between">
          <Row className="gap-6">
            <ButtonLink
              href="/staff/dashboard"
              variant="ghost"
              className="-ml-3 font-semibold"
            >
              My virtual mailbox
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

      {/* Staff body */}
      <Stack className="flex-1 md:flex-row">
        {/* Sidebar */}
        <aside className="w-full border-b border-border bg-muted/30 md:w-64 md:border-b-0 md:border-r">
          <Container className="py-6 md:px-4">
            <Stack className="gap-1">
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Staff Workspace
              </p>

              <ButtonLink
                href="/staff/dashboard"
                variant="ghost"
                className="justify-start"
              >
                Dashboard
              </ButtonLink>

              


              <ButtonLink
                href="/staff/media"
                variant="ghost"
                className="justify-start"
              >
                Media
              </ButtonLink>

              <div className="my-4 border-t border-border" />

              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Account
              </p>

              <ButtonLink
                href="/staff/profile"
                variant="ghost"
                className="justify-start"
              >
                Profile
              </ButtonLink>
            </Stack>
          </Container>
        </aside>

        {/* Main content */}
        <Main className="min-w-0 flex-1">
          <Container className="py-8">
            {children}
          </Container>
        </Main>
      </Stack>
    </Stack>
  );
}
