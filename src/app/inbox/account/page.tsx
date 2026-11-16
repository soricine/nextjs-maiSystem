
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Spinner } from "@heroui/react";

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
  const queryClient = useQueryClient();
  const me = useMe();

  const letters = useQuery({
    queryKey: ["mail-items"],
    queryFn: () =>
      apiFetch<{ mailItems: MailItem[] }>("/api/mail-items", {
        auth: true,
      }),
    enabled: Boolean(me.data),
    retry: false,
  });

  const deleteLetter = useMutation({
    mutationFn: (letterId: string) =>
      apiFetch<{ success: boolean }>(
        `/api/mail-items/${encodeURIComponent(letterId)}`,
        {
          method: "DELETE",
          auth: true,
        },
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
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

  const mailItems = letters.data?.mailItems ?? [];

  return (
    <Stack className="gap-8">
      <Stack className="gap-2">
        <PageTitle className="text-3xl">My account</PageTitle>
        <BodyText color="muted">
          View your account information and uploaded letters.
        </BodyText>
      </Stack>

      <Card>
        <Card.Header>
          <Card.Title>My letters</Card.Title>
          <Card.Description>
            View or delete the letter photos uploaded to your account.
          </Card.Description>
        </Card.Header>

        <Card.Content>
          {letters.isLoading ? (
            <div className="flex justify-center p-6">
              <Spinner size="lg" aria-label="Loading letters" />
            </div>
          ) : letters.isError ? (
            <Stack className="gap-3">
              <BodyText color="muted">
                Unable to load your letters. Please try again.
              </BodyText>
              <div>
                <Button
                  variant="outline"
                  onPress={() => letters.refetch()}
                  isDisabled={letters.isFetching}
                >
                  {letters.isFetching ? "Loading..." : "Retry"}
                </Button>
              </div>
            </Stack>
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
                    className="!block aspect-[4/3] !h-auto !w-full !rounded-none object-cover"
                    loading="lazy"
                  />

                  <div className="flex items-center justify-between gap-3 p-3">
                    <div className="min-w-0">
                      <h3 className="break-words font-semibold">
                        {letter.label}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Received{" "}
                        {new Date(letter.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      isDisabled={deleteLetter.isPending}
                      onPress={() => {
                        const confirmed = window.confirm(
                          "Are you sure you want to permanently delete this letter photo?",
                        );

                        if (confirmed) {
                          deleteLetter.mutate(letter.id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {deleteLetter.isError && (
            <p role="alert" className="mt-4 text-sm text-danger">
              Unable to delete this letter photo. Please try again.
            </p>
          )}
        </Card.Content>
      </Card>

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
