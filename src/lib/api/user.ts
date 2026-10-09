import { useMutation } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api/client";
import type { PublicUser } from "@/lib/api/types";
import type { UpdateAddressDetailsInput } from "@/lib/validation/auth";

export type UpdateMyProfileInput = {
  name: string;
};

async function updateMyProfile(
  input: UpdateMyProfileInput,
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
      data.message ?? "Failed to update profile",
    );
  }

  return data;
}

export function useUpdateMyProfile() {
  return useMutation({
    mutationFn: updateMyProfile,
  });
}

export async function updateAddressDetails(
  input: UpdateAddressDetailsInput,
) {
  return apiFetch<{ message: string; user: PublicUser }>(
    "/api/user/profile",
    {
      method: "PATCH",
      body: input,
      auth: true,
    },
  );
}

export function useUpdateAddressDetails() {
  return useMutation({
    mutationFn: updateAddressDetails,
  });
}

export type ChangeMyPasswordInput = {
  password: string;
};

async function changeMyPassword(
  input: ChangeMyPasswordInput,
) {
  const response = await fetch("/api/user/profile/password", {
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
      data.message ?? "Failed to change password",
    );
  }

  return data;
}

export function useChangeMyPassword() {
  return useMutation({
    mutationFn: changeMyPassword,
  });
}