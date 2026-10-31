
"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { Card, Spinner, Button } from "@heroui/react";

import { Stack } from "@/components/ui/layout";
import { BodyText, PageTitle } from "@/components/ui/typography";
import { useMe } from "@/lib/api/auth";
import { apiFetch } from "@/lib/api/client";

type MailItem = {
  id: string;
  label: string;
  photoUrl: string;
  createdAt: string;
};

export default function AccountPage() {
  const me = useMe();
  const queryClient = useQueryClient();

  // Load only letters belonging to the logged-in customer.
  const letters = useQuery({
    queryKey: ["mail-items"],
    queryFn: () =>
      apiFetch<{ mailItems: MailItem[] }>("/api/mail-items", {
        auth: true,
      }),
    enabled: Boolean(me.data),
    retry: false,
  });

  // Delete a single letter.
  const deleteLetter = useMutation({
    mutationFn: (id: string) =>
      apiFetch<{ message: string }>(
        `/api/mail-items/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          auth: true,
        },
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mail-items"],
      });
    },
  });

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

  const photoUrl = me.data.profilePhotoUrl;
  const mailItems = letters.data?.mailItems ?? [];

  return (
    <Stack className="gap-8">
      <Stack className="gap-2">
        <PageTitle className="text-3xl">My account</PageTitle>
        <BodyText color="muted">
          View your account information and received letters.
        </BodyText>
      </Stack>

      {/* Customer profile information */}
      <Card>
        <Card.Header>
          <Card.Title>Account information</Card.Title>
          <Card.Description>
            Your personal account details.
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <Stack className="gap-6">
            <div className="flex items-center gap-4">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={`${me.data.name}'s profile`}
                  className="h-24 w-24 rounded-full border object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-default-100 text-sm text-default-500">
                  No photo uploaded
                </div>
              )}

              <div>
                <p className="font-semibold">{me.data.name}</p>
                <p className="text-sm text-muted-foreground">
                  Customer profile
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Full name</p>
              <p>{me.data.name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{me.data.email}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p>{me.data.address || "Not provided"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                ZIP / Postal code
              </p>
              <p>{me.data.zipCode || "Not provided"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Country</p>
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

      {/* Customer-specific letter gallery */}
      <Card>
        <Card.Header>
          <Card.Title>My Letters</Card.Title>
          <Card.Description>
            Photos of letters uploaded to your account by our staff.
          </Card.Description>
        </Card.Header>

        <Card.Content>
          {letters.isLoading ? (
            <div className="flex justify-center p-6">
              <Spinner size="lg" aria-label="Loading letters" />
            </div>
          ) : letters.isError ? (
            <BodyText color="muted">
              Unable to load your letters. Please try again later.
            </BodyText>
          ) : mailItems.length === 0 ? (
            <BodyText color="muted">
              No letters have been uploaded to your account yet.
            </BodyText>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {mailItems.map((letter) => (
                <article
                  key={letter.id}
                  className="overflow-hidden rounded-lg border border-default-200"
                >
                  <img
                    src={letter.photoUrl}
                    alt={letter.label}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />

                  <div className="space-y-3 p-3">
                    <div>
                      <h3 className="font-semibold">{letter.label}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Received{" "}
                        {new Date(letter.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <Button
                      color="danger"
                      variant="flat"
                      className="w-full"
                      isLoading={
                        deleteLetter.isPending &&
                        deleteLetter.variables === letter.id
                      }
                      isDisabled={deleteLetter.isPending}
                      onPress={() => {
                        const confirmed = window.confirm(
                          `Are you sure you want to delete "${letter.label}"?`,
                        );

                        if (confirmed) {
                          deleteLetter.mutate(letter.id);
                        }
                      }}
                    >
                      Delete letter
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {deleteLetter.isError && (
            <BodyText color="danger">
              Unable to delete the letter. Please try again.
            </BodyText>
          )}
        </Card.Content>
      </Card>
    </Stack>
  );
}
