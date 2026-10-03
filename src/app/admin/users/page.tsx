
"use client";

import { Card, Spinner } from "@heroui/react";

import { Stack } from "@/components/ui/layout";
import { BodyText, PageTitle } from "@/components/ui/typography";
import { useAdminUsers } from "@/lib/api/admin";

export default function AdminUsersPage() {
  const users = useAdminUsers();

  if (users.isLoading) {
    return (
      <Stack className="gap-8">
        <Stack className="gap-2">
          <PageTitle className="text-3xl">
            Users
          </PageTitle>

          <BodyText color="muted">
            View all accounts registered in the system.
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
      <Card>
        <Card.Header>
          <Card.Title>
            Unable to load users
          </Card.Title>

          <Card.Description>
            Something went wrong while loading the accounts.
          </Card.Description>
        </Card.Header>
      </Card>
    );
  }

  const allUsers = users.data?.users ?? [];

  return (
    <Stack className="gap-8">
      <Stack className="gap-2">
        <PageTitle className="text-3xl">
          Users
        </PageTitle>

        <BodyText color="muted">
          All accounts registered in the system.
        </BodyText>
      </Stack>

      <Card>
        <Card.Header>
          <Card.Title>
            All Accounts
          </Card.Title>

          <Card.Description>
            Customers, staff, and administrators.
          </Card.Description>
        </Card.Header>

        <Card.Content>
          {allUsers.length === 0 ? (
            <div className="py-8 text-center">
              <BodyText color="muted">
                No accounts found.
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
                      Role
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Created
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {allUsers.map((user) => (
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

                      <td className="px-4 py-3 font-medium">
                        {user.role}
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

