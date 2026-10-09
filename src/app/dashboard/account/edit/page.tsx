"use client";

import { useEffect } from "react";
import { Button, Card, Form, Spinner } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import {
  FormAlert,
  RhfTextField,
} from "@/components/ui/form";
import { Stack } from "@/components/ui/layout";
import { BodyText, PageTitle } from "@/components/ui/typography";

import { useMe } from "@/lib/api/auth";
import { useUpdateAddressDetails } from "@/lib/api/user";
import {
  updateAddressDetailsSchema,
  type UpdateAddressDetailsInput,
} from "@/lib/validation/auth";

export default function EditAccountPage() {
  const router = useRouter();
  const me = useMe();
  const updateDetails = useUpdateAddressDetails();

  const {
    control,
    handleSubmit,
    reset,
    formState,
  } = useForm<UpdateAddressDetailsInput>({
    resolver: zodResolver(updateAddressDetailsSchema),
    mode: "onChange",
    defaultValues: {
      zipCode: "",
      country: "",
    },
  });

  useEffect(() => {
    if (me.data) {
      reset({
        zipCode: me.data.zipCode ?? "",
        country: me.data.country ?? "",
      });
    }
  }, [me.data, reset]);

  const onSubmit = handleSubmit(async (values) => {
    updateDetails.mutate(values, {
      onSuccess: async () => {
        await me.refetch();
        router.push("/dashboard/account");
      },
    });
  });

  if (me.isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Spinner size="lg" aria-label="Loading account details" />
      </div>
    );
  }

  if (me.isError || !me.data) {
    return (
      <Stack className="gap-4">
        <PageTitle className="text-3xl">Edit Account</PageTitle>
        <BodyText color="muted">
          Unable to load your account details. Please try again.
        </BodyText>
        <Button
          variant="outline"
          onPress={() => router.push("/dashboard/account")}
        >
          Back to Account
        </Button>
      </Stack>
    );
  }

  return (
    <Stack className="gap-8">
      <Stack className="gap-2">
        <PageTitle className="text-3xl">Edit Account</PageTitle>
        <BodyText color="muted">
          Update your ZIP / postal code and country.
        </BodyText>
      </Stack>

      <Card>
        <Card.Header>
          <Card.Title>Mailing details</Card.Title>
          <Card.Description>
            Your name, email, and street address will remain unchanged.
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <Form
            validationBehavior="aria"
            onSubmit={onSubmit}
            className="flex flex-col gap-5"
          >
            <FormAlert
              status="danger"
              message={
                updateDetails.error instanceof Error
                  ? updateDetails.error.message
                  : null
              }
            />

            <RhfTextField
              control={control}
              name="zipCode"
              label="ZIP / Postal code"
              autoComplete="postal-code"
            />

            <RhfTextField
              control={control}
              name="country"
              label="Country"
              autoComplete="country-name"
            />

            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                variant="primary"
                isDisabled={
                  !formState.isValid || updateDetails.isPending
                }
                isPending={updateDetails.isPending}
              >
                {updateDetails.isPending
                  ? "Saving changes..."
                  : "Save changes"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onPress={() => router.push("/dashboard/account")}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Content>
      </Card>
    </Stack>
  );
}