import { useMutation } from "@tanstack/react-query";

export type UpdateAddressDetailsInput = {
  zipCode: string;
  country: string;
};

async function updateAddressDetails(
  input: UpdateAddressDetailsInput,
) {
  const response = await fetch("/api/user/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(input),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ?? "Failed to update account details.",
    );
  }

  return data;
}

export function useUpdateAddressDetails() {
  return useMutation({
    mutationFn: updateAddressDetails,
  });
}