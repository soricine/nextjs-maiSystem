
import { useMutation } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api/client";
import type { PublicUser } from "@/lib/api/types";
import type { UpdateAddressDetailsInput } from "@/lib/validation/auth";

// Update the user's name.
export type UpdateMyProfileInput = {
  name: string;
};

async function updateMyProfile(input: UpdateMyProfileInput) {
  return apiFetch<{ message: string; user: PublicUser }>(
    "/api/user/profile",
    {
      method: "PATCH",
      body: input,
      auth: true,
    },
  );
}

export function useUpdateMyProfile() {
  return useMutation({
    mutationFn: updateMyProfile,
  });
}

// Update the user's ZIP/postal code and country.
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

async function changeMyPassword(input: ChangeMyPasswordInput) {
  return apiFetch<{ message: string }>(
    "/api/user/profile/password",
    {
      method: "PATCH",
      body: input,
      auth: true,
    },
  );
}

export function useChangeMyPassword() {
  return useMutation({
    mutationFn: changeMyPassword,
  });
}