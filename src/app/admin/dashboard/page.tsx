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
          Welcome admin{me.data ? `, ${me.data.name}` : ""}
        </PageTitle>

        <BodyText color="muted">
          Manage your website, users, staff, posts, and media.
        </BodyText>
      </Stack>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <Card.Header>
            <Card.Title>Users</Card.Title>
            <Card.Description>
              View and manage registered users.
            </Card.Description>
          </Card.Header>

          <Card.Footer>
            <a
              href="/admin/users"
              className="text-sm font-medium hover:underline"
            >
              Manage users →
            </a>
          </Card.Footer>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Staff</Card.Title>
            <Card.Description>
              Create and manage staff accounts.
            </Card.Description>
          </Card.Header>

          <Card.Footer>
            <a
              href="/admin/staff"
              className="text-sm font-medium hover:underline"
            >
              Manage staff →
            </a>
          </Card.Footer>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Posts</Card.Title>
            <Card.Description>
              Create and manage website content.
            </Card.Description>
          </Card.Header>

          <Card.Footer>
            <a
              href="/admin/posts"
              className="text-sm font-medium hover:underline"
            >
              Manage posts →
            </a>
          </Card.Footer>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Media</Card.Title>
            <Card.Description>
              Manage images and uploaded files.
            </Card.Description>
          </Card.Header>

          <Card.Footer>
            <a
              href="/admin/media"
              className="text-sm font-medium hover:underline"
            >
              Manage media →
            </a>
          </Card.Footer>
        </Card>
      </div>
    </Stack>
  );
}