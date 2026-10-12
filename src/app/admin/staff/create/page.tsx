"use client";

import { useState } from "react";
import { Button, Card, Input, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";

import { Stack } from "@/components/ui/layout";
import { BodyText, PageTitle } from "@/components/ui/typography";
import { useCreateStaff } from "@/lib/api/admin";

export default function CreateStaffPage() {
const router = useRouter();
const createStaff = useCreateStaff();

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [successMessage, setSuccessMessage] = useState("");
const [errorMessage, setErrorMessage] = useState("");

const handleCreateStaff = () => {
setSuccessMessage("");
setErrorMessage("");


if (!name.trim() || !email.trim() || !password) {
  setErrorMessage("Please fill in all fields.");
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

return ( <Stack className="gap-8"> <div className="flex flex-wrap items-start justify-between gap-4"> <Stack className="gap-2"> <PageTitle className="text-3xl">
Create Staff Account </PageTitle> <BodyText color="muted">
Create a new staff member account. </BodyText> </Stack>


    <Button
      variant="outline"
      onPress={() => router.push("/admin")}
    >
      Back to Admin
    </Button>
  </div>

  <Card>
    <Card.Header>
      <Card.Title>Staff Details</Card.Title>
      <Card.Description>
        The new account will automatically receive the STAFF role.
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

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Full Name
          </label>
          <Input
            aria-label="Full Name"
            placeholder="Enter staff member's name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Email
          </label>
          <Input
            aria-label="Email"
            type="email"
            placeholder="staff@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Initial Password
          </label>
          <Input
            aria-label="Initial Password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <BodyText color="muted">
          The staff member can use these credentials to sign in.
        </BodyText>

        <div className="flex flex-wrap gap-3">
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

          <Button
            variant="outline"
            onPress={() => router.push("/admin")}
          >
            Cancel
          </Button>
        </div>
      </Stack>
    </Card.Content>
  </Card>
</Stack>

);
}
