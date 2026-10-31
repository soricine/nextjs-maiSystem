"use admin";

import { AlertDialog, Button, Card, Form } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@heroui/react";
import { apiFetch } from "@/lib/api/client";

import {
  FormAlert,
  RhfTextField,
  applyServerFieldErrors,
  generalErrorMessage,
} from "@/components/ui/form";
import { Row, Stack } from "@/components/ui/layout";
import { BodyText, PageTitle } from "@/components/ui/typography";
import { useChangePassword, useDeleteAccount, useMe } from "@/lib/api/auth";
import {
  changePasswordFormSchema,
  deleteAccountSchema,
  type ChangePasswordFormInput,
  type DeleteAccountInput,
} from "@/lib/validation/auth";

type MailItem = {
  id: string;
  label: string;
  photoUrl: string;
  createdAt: string;
};

export default function AccountPage() {
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

  return (
    <Stack className="gap-8">
      <Stack className="gap-2">
        <PageTitle className="text-3xl">Account</PageTitle>
        <BodyText color="muted">
          Signed in as {me.data?.email}. Manage how you access your mailbox.
        </BodyText>
      </Stack>
      <LettersCard letters={letters} />
      <ChangePasswordCard />
      <DeleteAccountCard />
    </Stack>
  );
}

const CHANGE_FIELDS = ["currentPassword", "newPassword"];

function LettersCard({
  letters,
}: {
  letters: {
    isLoading: boolean;
    isError: boolean;
    data?: { mailItems?: MailItem[] };
  };
}) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>My letters</Card.Title>
        <Card.Description>
          View the letters uploaded to your account.
        </Card.Description>
      </Card.Header>

      <Card.Content>
        {letters.isLoading ? (
          <div className="flex justify-center p-6">
            <Spinner size="lg" />
          </div>
        ) : letters.isError ? (
          <BodyText color="muted">
            Unable to load your letters. Please try again later.
          </BodyText>
        ) : !letters.data?.mailItems?.length ? (
          <BodyText color="muted">
            No letters have been uploaded to your account yet.
          </BodyText>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {letters.data.mailItems.map((letter) => (
              <article
                key={letter.id}
                className="overflow-hidden rounded-lg border border-default-200"
              >
                <img
                  src={letter.photoUrl}
                  alt={letter.label}
                  className="aspect-[4/3] block h-auto w-full object-cover"
                  loading="lazy"
                />
                <div className="p-3">
                  <h3 className="font-semibold">{letter.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Received {new Date(letter.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card.Content>
    </Card>
  );
}

function ChangePasswordCard() {
  const changePassword = useChangePassword();
  const { control, handleSubmit, formState, reset, setError } =
    useForm<ChangePasswordFormInput>({
      resolver: zodResolver(changePasswordFormSchema),
      mode: "onChange",
      defaultValues: {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      },
    });

  const onSubmit = handleSubmit(({ currentPassword, newPassword }) =>
    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => reset(),
        onError: (error) =>
          applyServerFieldErrors(error, setError, CHANGE_FIELDS),
      },
    ),
  );

  return (
    <Card>
      <Card.Header>
        <Card.Title>Change password</Card.Title>
        <Card.Description>
          Update the password you use to sign in.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <Form validationBehavior="aria" onSubmit={onSubmit}>
          <Stack className="gap-4">
            <FormAlert
              status="danger"
              message={generalErrorMessage(changePassword.error, CHANGE_FIELDS)}
            />
            <RhfTextField
              control={control}
              name="currentPassword"
              label="Current password"
              type="password"
              autoComplete="current-password"
            />
            <RhfTextField
              control={control}
              name="newPassword"
              label="New password"
              type="password"
              autoComplete="new-password"
            />
            <RhfTextField
              control={control}
              name="confirmNewPassword"
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
            />
            <Button
              type="submit"
              isDisabled={!formState.isValid || changePassword.isPending}
              isPending={changePassword.isPending}
            >
              {changePassword.isPending ? "Updating…" : "Update password"}
            </Button>
          </Stack>
        </Form>
      </Card.Content>
    </Card>
  );
}

function DeleteAccountCard() {
  const router = useRouter();
  const deleteAccount = useDeleteAccount();
  const { control, handleSubmit, formState, reset, setError } =
    useForm<DeleteAccountInput>({
      resolver: zodResolver(deleteAccountSchema),
      mode: "onChange",
      defaultValues: { password: "" },
    });

  const onConfirm = handleSubmit(({ password }) =>
    deleteAccount.mutate(
      { password },
      {
        onSuccess: () => router.push("/"),
        onError: (error) =>
          applyServerFieldErrors(error, setError, ["password"]),
      },
    ),
  );

  return (
    <Card>
      <Card.Header>
        <Card.Title>Delete account</Card.Title>
        <Card.Description>
          Permanently deletes your account and signs you out everywhere. This
          cannot be undone.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <AlertDialog
          onOpenChange={(open) => {
            if (!open) {
              reset();
              deleteAccount.reset();
            }
          }}
        >
          <Button variant="danger">Delete account…</Button>
          <AlertDialog.Backdrop>
            <AlertDialog.Container size="sm" placement="center">
              <AlertDialog.Dialog>
                {({ close }) => (
                  <Form validationBehavior="aria" onSubmit={onConfirm}>
                    <AlertDialog.Header>
                      <AlertDialog.Icon status="danger" />
                      <AlertDialog.Heading>
                        Delete your account?
                      </AlertDialog.Heading>
                    </AlertDialog.Header>
                    <AlertDialog.Body className="flex flex-col gap-4">
                      <BodyText size="sm">
                        Your mailbox and account details will be permanently
                        removed. Enter your password to confirm.
                      </BodyText>
                      <FormAlert
                        status="danger"
                        message={generalErrorMessage(deleteAccount.error, [
                          "password",
                        ])}
                      />
                      <RhfTextField
                        control={control}
                        name="password"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                      />
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                      <Button
                        variant="tertiary"
                        onPress={close}
                        isDisabled={deleteAccount.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="danger"
                        isDisabled={
                          !formState.isValid || deleteAccount.isPending
                        }
                        isPending={deleteAccount.isPending}
                      >
                        {deleteAccount.isPending
                          ? "Deleting…"
                          : "Delete forever"}
                      </Button>
                    </AlertDialog.Footer>
                  </Form>
                )}
              </AlertDialog.Dialog>
            </AlertDialog.Container>
          </AlertDialog.Backdrop>
        </AlertDialog>
      </Card.Content>
    </Card>
  );
}
