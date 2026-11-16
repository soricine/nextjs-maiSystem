
"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Input,
  Spinner,
} from "@heroui/react";
import { useRouter } from "next/navigation";

import { Stack } from "@/components/ui/layout";
import {
  BodyText,
  PageTitle,
} from "@/components/ui/typography";

import {
  useAdminUsers,
  useCreateStaff,
  useDeleteAdminUser,
  type AdminUser,
} from "@/lib/api/admin";

import { useLogout } from "@/lib/api/auth";
import { clearSession } from "@/lib/api/client";

export default function AdminStaffPage() {
  const router = useRouter();

  const users = useAdminUsers();
  const createStaff = useCreateStaff();
  const deleteStaff = useDeleteAdminUser();
  const logout = useLogout();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedStaff, setSelectedStaff] =
    useState<AdminUser | null>(null);

  const [deleteError, setDeleteError] = useState("");

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => {
        clearSession();
        router.replace("/login");
      },
    });
  };

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
      setErrorMessage("Password must be at least 8 characters.");
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
          setSuccessMessage("Staff account created successfully.");
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

  const handleDeleteClick = (staff: AdminUser) => {
    setDeleteError("");
    setSelectedStaff(staff);
  };

  const handleConfirmDelete = () => {
    if (!selectedStaff) return;

    setDeleteError("");

    deleteStaff.mutate(selectedStaff.id, {
      onSuccess: () => {
        setSuccessMessage(
          `${selectedStaff.name} was deleted successfully.`,
        );
        setSelectedStaff(null);
      },
      onError: (error) => {
        setDeleteError(
          error instanceof Error
            ? error.message
            : "Failed to delete staff member.",
        );
      },
    });
  };

  const staffUsers =
    users.data?.users.filter(
      (user) => user.role === "STAFF",
    ) ?? [];

  return (
    <Stack className="gap-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <Stack className="gap-2">
          <PageTitle className="text-3xl">
            Admin Dashboard
          </PageTitle>

          <BodyText color="muted">
            Create and manage staff accounts.
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

      {/* Messages */}
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

      {/* Create staff */}
      <Card>
        <Card.Header>
          <Card.Title>Create Staff Account</Card.Title>
          <Card.Description>
            Create a new account with the STAFF role.
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <Stack className="gap-5">
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
              The password must contain at least 8 characters.
            </BodyText>

            <div>
              <Button
                variant="primary"
                onPress={handleCreateStaff}
                isDisabled={createStaff.isPending}
              >
                {createStaff.isPending ? (
                  <>
                    <Spinner size="sm" aria-label="Creating staff" />
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

      {/* Staff accounts */}
      <Card>
        <Card.Header>
          <Card.Title>Staff Accounts</Card.Title>
          <Card.Description>
            Accounts with the STAFF role. You can delete an account
            using the button beside it.
          </Card.Description>
        </Card.Header>

        <Card.Content>
          {users.isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" aria-label="Loading staff" />
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
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                    <th className="px-4 py-3 font-medium">Action</th>
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

                      <td className="px-4 py-3">
                        <Button
                          variant="danger"
                          size="sm"
                          onPress={() => handleDeleteClick(staff)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Delete confirmation dialog */}
      {selectedStaff && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deleteStaff.isPending
            ) {
              setSelectedStaff(null);
              setDeleteError("");
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            className="w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-xl"
          >
            <h2
              id="delete-dialog-title"
              className="text-lg font-semibold"
            >
              Delete staff member?
            </h2>

            <p
              id="delete-dialog-description"
              className="mt-3 text-sm text-muted-foreground"
            >
              Are you sure you want to permanently delete{" "}
              <strong className="text-foreground">
                {selectedStaff.name}
              </strong>
              ?
            </p>

            <p className="mt-2 text-sm text-danger">
              This action cannot be undone.
            </p>

            {deleteError && (
              <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-danger">
                {deleteError}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                onPress={() => {
                  setSelectedStaff(null);
                  setDeleteError("");
                }}
                isDisabled={deleteStaff.isPending}
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                onPress={handleConfirmDelete}
                isDisabled={deleteStaff.isPending}
              >
                {deleteStaff.isPending ? (
                  <>
                    <Spinner size="sm" aria-label="Deleting staff" />
                    Deleting...
                  </>
                ) : (
                  "Yes, delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Stack>
  );
}
