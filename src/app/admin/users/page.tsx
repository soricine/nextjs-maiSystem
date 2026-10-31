"use client";

import { useState } from "react";
import { Button, Card, Spinner } from "@heroui/react";

import { Stack } from "@/components/ui/layout";
import { BodyText, PageTitle } from "@/components/ui/typography";
import {useAdminUsers,useDeleteAdminUser,} from "@/lib/api/admin";

export default function AdminUsersPage() {
const users = useAdminUsers();
const deleteUser = useDeleteAdminUser();

const [message, setMessage] = useState("");
const [errorMessage, setErrorMessage] = useState("");

const handleDelete = (user: {
id: string;
name: string;
role: string;
}) => {
if (user.role !== "STAFF" && user.role !== "CUSTOMER") {
return;
}

const confirmed = window.confirm(
  `Do you want to delete the user "${user.name}" with role "${user.role}"? This action cannot be undone.`,
);

if (!confirmed) {
  return;
}

setMessage("");
setErrorMessage("");

deleteUser.mutate(user.id, {
  onSuccess: async () => {
    setMessage(`User "${user.name}" was deleted successfully.`);
    await users.refetch();
  },
  onError: (error) => {
    setErrorMessage(
      error instanceof Error
        ? error.message
        : "Failed to delete the user.",
    );
  },
});


};

if (users.isLoading) {
return ( <Stack className="gap-8"> <Stack className="gap-2"> <PageTitle className="text-3xl">Users</PageTitle> <BodyText color="muted">
View and manage customer and staff accounts. </BodyText> </Stack>

```
    <Card>
      <Card.Content className="flex justify-center py-12">
        <Spinner size="lg" aria-label="Loading users" />
      </Card.Content>
    </Card>
  </Stack>
);


}

if (users.isError) {
return ( <Card>
<Card.Header>
<Card.Title>Unable to load users</Card.Title>
<Card.Description>
Something went wrong while loading the accounts.
</Card.Description>
</Card.Header>
<Card.Content>
<Button variant="outline" onPress={() => users.refetch()}>
Try again </Button>
</Card.Content> </Card>
);
}

const allUsers =
users.data?.users.filter(
(user) => user.role === "STAFF" || user.role === "CUSTOMER",
) ?? [];

return ( <Stack className="gap-8"> <Stack className="gap-2"> <PageTitle className="text-3xl">Users</PageTitle> <BodyText color="muted">
Manage customer and staff accounts.  </BodyText> </Stack>

  {message && (
    <div className="rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm">
      {message}
    </div>
  )}

  {errorMessage && (
    <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm">
      {errorMessage}
    </div>
  )}

  <Card>
    <Card.Header>
      <Card.Title>Customer and Staff Accounts</Card.Title>
      <Card.Description>
        Delete a customer or staff account when necessary.
      </Card.Description>
    </Card.Header>

    <Card.Content>
      {allUsers.length === 0 ? (
        <div className="py-8 text-center">
          <BodyText color="muted">
            No customer or staff accounts found.
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
                <th className="px-4 py-3 text-right font-medium">
                  Actions
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

                  <td className="px-4 py-3">{user.email}</td>

                  <td className="px-4 py-3 font-medium">
                    {user.role}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="danger"
                      isDisabled={deleteUser.isPending}
                      onPress={() => handleDelete(user)}
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
</Stack>


);
}
