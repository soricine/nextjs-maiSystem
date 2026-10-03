import { useMutation } from "@tanstack/react-query";

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