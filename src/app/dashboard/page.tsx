"use client";

import { Card, Spinner } from "@heroui/react";

import { Stack } from "@/components/ui/layout";
import { BodyText, PageTitle } from "@/components/ui/typography";
import { useMe } from "@/lib/api/auth";

export default function AccountPage() {
  const me = useMe();

  if (me.isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Spinner size="lg" aria-label="Loading account" />
      </div>
    );
  }

  if (me.isError || !me.data) {
    return (
      <Stack className="gap-2">
        <PageTitle className="text-3xl">Account</PageTitle>
        <BodyText color="muted">
          Unable to load your account information.
        </BodyText>
      </Stack>
    );
  }

  return (
    <Stack className="gap-8">
      <Stack className="gap-2">
        <PageTitle className="text-3xl">Account</PageTitle>

        <BodyText color="muted">
          View your account and mailing information.
        </BodyText>
      </Stack>

      <Card>
        <Card.Header>
          <Card.Title>Account information</Card.Title>
          <Card.Description>
            Your personal account details.
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <Stack className="gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Full name
              </p>
              <p>{me.data.name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Email
              </p>
              <p>{me.data.email}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Address
              </p>
              <p>{me.data.address || "Not provided"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                ZIP / Postal code
              </p>
              <p>{me.data.zipCode || "Not provided"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Country
              </p>
              <p>{me.data.country || "Not provided"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Account type
              </p>
              <p>{me.data.role}</p>
            </div>
          </Stack>
        </Card.Content>
      </Card>
    </Stack>
  );
}