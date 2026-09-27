"use client";

import { Card } from "@heroui/react";

import { Stack } from "@/components/ui/layout";
import { BodyText, PageTitle } from "@/components/ui/typography";
import { useMe } from "@/lib/api/auth";

export default function DashboardPage() {
  const me = useMe();

  return (
    <Stack className="gap-8">
      <Stack className="gap-2">
        <PageTitle className="text-3xl">
          Welcome staff {me.data ? `, ${me.data.name}` : ""}
        </PageTitle>
        <BodyText color="muted">
     Check Check 
        </BodyText>
      </Stack>

      <Card>
        <Card.Header>
          <Card.Title>Your inbox is empty</Card.Title>
          <Card.Description>
            When an envelope arrives, we photograph it and drop it in this inbox
            — then you choose to open &amp; scan, forward, or shred it.
          </Card.Description>
        </Card.Header>
      </Card>
    </Stack>
  );
}
