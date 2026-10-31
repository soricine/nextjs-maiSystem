
"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Spinner } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";

import { apiFetch } from "@/lib/api/client";
import { Stack } from "@/components/ui/layout";
import { BodyText, PageTitle } from "@/components/ui/typography";
import { useStaffCustomer } from "@/lib/api/staff-customer";

export type StaffCustomerWithPhoto = {
  id: string;
  name: string;
  email: string;
  role: string;
  address?: string | null;
  zipCode?: string | null;
  country?: string | null;
  createdAt: string;
  profilePhotoUrl?: string | null;
};

type MailItem = {
  id: string;
  label: string;
  photoUrl: string;
  createdAt: string;
};

export default function EditCustomerPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const customerId = params.id;

  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  const customerQuery = useStaffCustomer(customerId);

  const customer = customerQuery.data?.customer as
    | StaffCustomerWithPhoto
    | undefined;

  const uploadPhoto = useMutation({
    mutationFn: async (photo: File) => {
      const formData = new FormData();

      formData.append("photo", photo);

      // The API requires a label, so generate one automatically.
      const existingCount = queryClient.getQueryData<{
        mailItems: MailItem[];
      }>(["mail-items", customerId])?.mailItems.length;

      const label = `Letter ${(existingCount ?? 0) + 1}`;
      formData.append("label", label);

      return apiFetch<{ mailItem: MailItem }>(
        `/api/staff/customers/${encodeURIComponent(
          customerId,
        )}/mail-items`,
        {
          method: "POST",
          body: formData,
          auth: true,
        },
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mail-items"],
      });

      setSelectedPhoto(null);
      setUploadError("");
      setUploadSuccess("Letter photo uploaded successfully.");

      // Clear the file input so the same file can be selected again.
      const input = document.getElementById(
        "customer-letter-photo",
      ) as HTMLInputElement | null;

      if (input) input.value = "";
    },

    onError: (error: Error) => {
      setUploadError(error.message || "Unable to upload the letter photo.");
      setUploadSuccess("");
    },
  });

  const handleBack = () => {
    router.push("/staff/dashboard");
  };

  if (customerQuery.isLoading) {
    return (
      <Stack className="gap-6">
        <PageTitle className="text-3xl">Customer Information</PageTitle>
        <Card>
          <Card.Content className="flex flex-col items-center justify-center gap-4 py-12">
            <Spinner size="lg" aria-label="Loading customer information" />
            <BodyText color="muted">
              Loading customer information...
            </BodyText>
          </Card.Content>
        </Card>
      </Stack>
    );
  }

  if (customerQuery.isError || !customer) {
    const errorMessage =
      customerQuery.error instanceof Error
        ? customerQuery.error.message
        : "Unable to load this customer's information.";

    return (
      <Stack className="gap-6">
        <PageTitle className="text-3xl">Customer Information</PageTitle>
        <Card>
          <Card.Header>
            <Card.Title>Unable to Load Customer</Card.Title>
            <Card.Description>
              The customer's account information could not be retrieved.
            </Card.Description>
          </Card.Header>
          <Card.Content className="gap-4">
            <BodyText>{errorMessage}</BodyText>
            <BodyText color="muted">Customer ID: {customerId}</BodyText>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onPress={() => customerQuery.refetch()}
                isDisabled={customerQuery.isFetching}
              >
                {customerQuery.isFetching ? "Retrying..." : "Try Again"}
              </Button>
              <Button onPress={handleBack} variant="outline">
                Back to Users
              </Button>
            </div>
          </Card.Content>
        </Card>
      </Stack>
    );
  }

  const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Unavailable";

    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const details = [
    { label: "Full name", value: customer.name },
    { label: "Email address", value: customer.email },
    { label: "Account role", value: customer.role },
    { label: "Street address", value: customer.address || "Not provided" },
    { label: "ZIP / Postal code", value: customer.zipCode || "Not provided" },
    { label: "Country", value: customer.country || "Not provided" },
    { label: "Registration date", value: formatDate(customer.createdAt) },
    { label: "Customer ID", value: customer.id },
  ];

  return (
    <Stack className="gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Stack className="gap-2">
          <PageTitle className="text-3xl">{customer.name}</PageTitle>
          <BodyText color="muted">
            View customer information and upload letter photos.
          </BodyText>
        </Stack>

        <Button variant="outline" onPress={handleBack}>
          Back to Users
        </Button>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>Upload customer letter</Card.Title>
          <Card.Description>
            Select a photo to add it to this customer's letters. No description
            is required.
          </Card.Description>
        </Card.Header>

        <Card.Content className="flex flex-col gap-4">
          <label htmlFor="customer-letter-photo" className="font-medium">
            Choose a letter photo
          </label>

          <input
            id="customer-letter-photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={uploadPhoto.isPending}
            onChange={(event) => {
              const file = event.currentTarget.files?.[0] ?? null;

              setSelectedPhoto(file);
              setUploadError("");
              setUploadSuccess("");

              if (file && file.size > 5 * 1024 * 1024) {
                setUploadError("The photo must be 5 MB or smaller.");
                setSelectedPhoto(null);
                event.currentTarget.value = "";
              }
            }}
          />

          {selectedPhoto && (
            <div className="max-w-sm">
              <p className="mb-2 text-sm text-muted-foreground">
                Selected: {selectedPhoto.name}
              </p>
              <img
                src={URL.createObjectURL(selectedPhoto)}
                alt="Selected letter preview"
                className="aspect-[4/3] w-full rounded-lg border object-cover"
              />
            </div>
          )}

          <div>
            <Button
              onPress={() => {
                setUploadError("");
                setUploadSuccess("");

                if (!selectedPhoto) {
                  setUploadError("Please choose a photo first.");
                  return;
                }

                uploadPhoto.mutate(selectedPhoto);
              }}
              isDisabled={uploadPhoto.isPending}
            >
              {uploadPhoto.isPending ? "Uploading..." : "Upload letter"}
            </Button>
          </div>

          {uploadError && (
            <p role="alert" className="text-sm text-danger">
              {uploadError}
            </p>
          )}

          {uploadSuccess && (
            <p role="status" className="text-sm text-success">
              {uploadSuccess}
            </p>
          )}
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title>Customer Information</Card.Title>
          <Card.Description>
            Account details for {customer.name}.
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {details.map((detail) => (
              <div
                key={detail.label}
                className="min-w-0 rounded-lg border border-default-200 p-4"
              >
                <BodyText color="muted">{detail.label}</BodyText>
                <p className="mt-2 break-words font-medium">{detail.value}</p>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    </Stack>
  );
}
