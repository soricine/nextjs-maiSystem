"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Input,
  Spinner,
} from "@heroui/react";

import {
  Stack,
} from "@/components/ui/layout";

import {
  BodyText,
  PageTitle,
} from "@/components/ui/typography";

import {
  useAdminUsers,
  useCreateStaff,
} from "@/lib/api/admin";

export default function AdminStaffPage() {
  const users = useAdminUsers();
  const createStaff = useCreateStaff();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    if (createStaff.isSuccess) {
      users.refetch();
    }
  }, [createStaff.isSuccess]);

  const handleCreateStaff = () => {
    setSuccessMessage("");
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Please enter the staff member's name.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Please enter the staff member's email.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter a password.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage(
        "Password must be at least 8 characters.",
      );
      return;
    }

    createStaff.mutate(
      {
        name: name.trim(),
        email: email.trim(),
        password,
      },
      {
        onSuccess: () => {
          setName("");
          setEmail("");
          setPassword("");

          setSuccessMessage(
            "Staff account created successfully.",
          );
        },

        onError: (error) => {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Failed to create staff account.",
          );
        },
      },
    );
  };

  const staffUsers =
    users.data?.users.filter(
      (user) => user.role === "STAFF",
    ) ?? [];

  return (
    <Stack className="gap-8">
      {/* Page header */}
      <Stack className="gap-2">
        <PageTitle className="text-3xl">
        Admin Dashboard  
        </PageTitle>

        <BodyText color="muted">
          Create and manage staff accounts.
        </BodyText>
      </Stack>

      {/* Create staff */}
      <Card>
        <Card.Header>
          <Card.Title>
            Create Staff Account
          </Card.Title>

          <Card.Description>
            Create a new account with the STAFF role.
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <Stack className="gap-5">
            {successMessage && (
              <div className="rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm">
                {errorMessage}
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Full Name
                </label>
                <Input
                  aria-label="Full Name"
                  placeholder="Enter staff name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  aria-label="Email"
                  type="email"
                  placeholder="staff@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                aria-label="Password"
                type="password"
                placeholder="Enter initial password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
              />
            </div>

            <BodyText color="muted">
              The password must contain at least 8
              characters.
            </BodyText>

            <div>
              <Button
                variant="primary"
                onPress={handleCreateStaff}
                isDisabled={createStaff.isPending}
              >
                {createStaff.isPending ? (
                  <>
                    <Spinner
                      size="sm"
                      aria-label="Creating staff"
                    />
                    Creating...
                  </>
                ) : (
                  "Create Staff Account"
                )}
              </Button>
            </div>
          </Stack>
        </Card.Content>
      </Card>

      
      <Card>
        <Card.Header>
          <Card.Title>
            Staff Accounts
          </Card.Title>

          <Card.Description>
            Accounts with the STAFF role.
          </Card.Description>
        </Card.Header>

        <Card.Content>
          {users.isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner
                size="lg"
                aria-label="Loading staff"
              />
            </div>
          ) : users.isError ? (
            <div className="py-8 text-center">
              <BodyText color="muted">
                Unable to load staff accounts.
              </BodyText>
            </div>
          ) : staffUsers.length === 0 ? (
            <div className="py-8 text-center">
              <BodyText color="muted">
                No staff accounts found.
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
                  {staffUsers.map((staff) => (
                    <tr
                      key={staff.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-3 font-medium">
                        {staff.name}
                      </td>

                      <td className="px-4 py-3">
                        {staff.email}
                      </td>

                      <td className="px-4 py-3 font-medium">
                        {staff.role}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(
                          staff.createdAt,
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