"use client";

import { Button, Card, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";

import { Stack } from "@/components/ui/layout";
import { BodyText, PageTitle } from "@/components/ui/typography";
import { useLogout, useMe } from "@/lib/api/auth";
import { clearSession } from "@/lib/api/client";

export default function DashboardPage() {
  const router = useRouter();

  const me = useMe();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => {
        clearSession();
        router.replace("/login");
      },
    });
  };

  return (
    <Stack className="gap-8">
      <div className="flex items-start justify-between gap-4">
        <Stack className="gap-2">
          <PageTitle className="text-3xl">
            Welcome{me.data ? `, ${me.data.name}` : ""}
          </PageTitle>

          <BodyText color="muted">
            This is your mailbox. Mail that arrives at your street address will
            show up here.
          </BodyText>
        </Stack>

        <Button
          variant="danger"
          onPress={handleLogout}
          isDisabled={logout.isPending}
        >
          {logout.isPending ? (
            <>
              <Spinner size="sm" aria-label="Signing out" />
              Signing out...
            </>
          ) : (
            "Sign out"
          )}
        </Button>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>Your inbox is empty</Card.Title>

          <Card.Description>
            When an envelope arrives, we photograph it and drop it in this
            inbox — then you choose to open &amp; scan, forward, or shred it.
          </Card.Description>
        </Card.Header>
      </Card>
    </Stack>
  );
}