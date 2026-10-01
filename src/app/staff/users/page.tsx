"use client";

import { Card, Spinner } from "@heroui/react";

import { Stack } from "@/components/ui/layout";
import { BodyText, PageTitle } from "@/components/ui/typography";
import { useStaffUsers } from "@/lib/api/staff";

export default function StaffUsersPage() {
  const users = useStaffUsers();

  if (users.isLoading) {
    return (
      <Stack className="gap-8">
        <Stack className="gap-2">
          <PageTitle className="text-3xl">
            Users
          </PageTitle>

          <BodyText color="muted">
            View registered users.
          </BodyText>
        </Stack>

        <Card>
          <Card.Content className="flex justify-center py-12">
            <Spinner
              size="lg"
              aria-label="Loading users"
            />
          </Card.Content>
        </Card>
      </Stack>
    );
  }

  if (users.isError) {
    return (
      <Stack className="gap-8">
        <Stack className="gap-2">
          <PageTitle className="text-3xl">
            Users
          </PageTitle>

          <BodyText color="muted">
            View registered users.
          </BodyText>
        </Stack>

        <Card>
          <Card.Header>
            <Card.Title>
              Unable to load users
            </Card.Title>

            <Card.Description>
              Something went wrong while loading the users.
            </Card.Description>
          </Card.Header>
        </Card>
      </Stack>
    );
  }

  const customerUsers = users.data?.users ?? [];

  return (
    <Stack className="gap-8">
      {/* Page header */}
      <Stack className="gap-2">
        <PageTitle className="text-3xl">
          Users
        </PageTitle>

        <BodyText color="muted">
          View registered customers.
        </BodyText>
      </Stack>

      {/* Users panel */}
      <Card>
        <Card.Header>
          <Card.Title>
            Registered Users
          </Card.Title>

          <Card.Description>
            {customerUsers.length}{" "}
            {customerUsers.length === 1 ? "user" : "users"} registered.
          </Card.Description>
        </Card.Header>

        <Card.Content>
          {customerUsers.length === 0 ? (
            <div className="py-8 text-center">
              <BodyText color="muted">
                No registered users found.
              </BodyText>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-4 py-3 font-medium">
                      Name
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Email
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Registered
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {customerUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-3 font-medium">
                        {user.name}
                      </td>

                      <td className="px-4 py-3">
                        {user.email}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(
                          user.createdAt,
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Content>
      </Card>
    </Stack>
  );
}