"use client";

import { AlertDialog, Button, Card, Form } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

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

export default function AccountPage() {
  const me = useMe();

  return (
    <Stack className="gap-8">
      <Stack className="gap-2">
        <PageTitle className="text-3xl">Account</PageTitle>
        <BodyText color="muted">
          Signed in as {me.data?.email}. Manage how you access your mailbox.
        </BodyText>
      </Stack>
      <ChangePasswordCard />
      <DeleteAccountCard />
    </Stack>
  );
}

const CHANGE_FIELDS = ["currentPassword", "newPassword"];

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
          Changing your password signs you out on every other device.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <Form
          validationBehavior="aria"
          onSubmit={onSubmit}
          className="flex max-w-md flex-col gap-4"
        >
          <FormAlert
            status="success"
            message={
              changePassword.isSuccess
                ? "Password updated. Your other devices were signed out."
                : null
            }
          />
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
            description="At least 8 characters, with a letter and a number."
          />
          <RhfTextField
            control={control}
            name="confirmNewPassword"
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
          />
          <Row>
            <Button
              type="submit"
              variant="primary"
              isDisabled={!formState.isValid || changePassword.isPending}
              isPending={changePassword.isPending}
            >
              {changePassword.isPending ? "Updating…" : "Update password"}
            </Button>
          </Row>
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
