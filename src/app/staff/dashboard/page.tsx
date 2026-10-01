"use client";

import { Card } from "@heroui/react";

import { Stack } from "@/components/ui/layout";
import { BodyText, PageTitle } from "@/components/ui/typography";
import { useMe } from "@/lib/api/auth";

export default function StaffDashboardPage() {
  const me = useMe();

  return (
    <Stack className="gap-8">
      <Stack className="gap-2">
        <PageTitle className="text-3xl">
          Welcome{me.data ? `, ${me.data.name}` : ""}
        </PageTitle>

        <BodyText color="muted">
          Welcome to the staff dashboard.
        </BodyText>
      </Stack>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <Card.Header>
            <Card.Title>Users</Card.Title>
            <Card.Description>
              View registered users.
            </Card.Description>
          </Card.Header>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Posts</Card.Title>
            <Card.Description>
              Manage website posts.
            </Card.Description>
          </Card.Header>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Media</Card.Title>
            <Card.Description>
              Manage uploaded media.
            </Card.Description>
          </Card.Header>
        </Card>
      </div>
    </Stack>
  );
}