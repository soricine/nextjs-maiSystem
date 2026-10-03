"use client";

import { Button, Card, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";

import { Stack } from "@/components/ui/layout";
import { BodyText, PageTitle } from "@/components/ui/typography";
import { useMe, useLogout } from "@/lib/api/auth";
import { useStaffUsers } from "@/lib/api/staff";
import { clearSession } from "@/lib/api/client";

export default function StaffProfilePage() {
  const router = useRouter();

  const me = useMe();
  const users = useStaffUsers();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => {
        clearSession();
        router.replace("/login");
      },
    });
  };

  if (users.isLoading) {
    return (
      <Stack className="gap-8">
        <PageTitle className="text-3xl">Profile</PageTitle>

        <Card>
          <Card.Content className="flex justify-center py-10">
            <Spinner size="lg" aria-label="Loading users" />
          </Card.Content>
        </Card>
      </Stack>
    );
  }

  if (users.isError) {
    return (
      <Stack className="gap-8">
        <div className="flex items-start justify-between gap-4">
          <PageTitle className="text-3xl">Profile</PageTitle>

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
            <Card.Title>Users</Card.Title>
            <Card.Description>
              Unable to load users.
            </Card.Description>
          </Card.Header>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack className="gap-8">
      {/* Staff profile */}
      <div className="flex items-start justify-between gap-4">
        <Stack className="gap-2">
          <PageTitle className="text-3xl">
            Profile
          </PageTitle>

          <BodyText color="muted">
            Manage your staff profile.
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
          <Card.Title>Account information</Card.Title>
        </Card.Header>

        <Card.Content>
          <Stack className="gap-2">
            <p>
              <strong>Name:</strong> {me.data?.name}
            </p>

            <p>
              <strong>Email:</strong> {me.data?.email}
            </p>

            <p>
              <strong>Role:</strong> {me.data?.role}
            </p>
          </Stack>
        </Card.Content>
      </Card>

      {/* Users */}
      <Card>
        <Card.Header>
          <Card.Title>Users</Card.Title>

          <Card.Description>
            Users registered in the CMS.
          </Card.Description>
        </Card.Header>

        <Card.Content>
          {users.data?.users.length === 0 ? (
            <BodyText color="muted">
              No users found.
            </BodyText>
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
                  {users.data?.users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-3">
                        {user.name}
                      </td>

                      <td className="px-4 py-3">
                        {user.email}
                      </td>

                      <td className="px-4 py-3">
                        {user.role}
                      </td>

                      <td className="px-4 py-3">
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