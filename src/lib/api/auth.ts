"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiFetch,
  clearSession,
  getRefreshToken,
  hasSession,
  storeSession,
} from "@/lib/api/client";
import type {
  AuthSession,
  MessageResponse,
  PublicUser,
  VerifyOtpResponse,
} from "@/lib/api/types";
import type {
  ChangePasswordInput,
  DeleteAccountInput,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyOtpInput,
} from "@/lib/validation/auth";

const ME_KEY = ["auth", "me"] as const;

export function useMe() {
  return useQuery({
    queryKey: ME_KEY,
    queryFn: async () => {
      const { user } = await apiFetch<{ user: PublicUser }>("/api/auth/me", {
        auth: true,
      });
      return user;
    },
    enabled: typeof window !== "undefined" && hasSession(),
    staleTime: 60_000,
    retry: false,
  });
}

function useSessionMutation<TInput>(path: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TInput) =>
      apiFetch<AuthSession>(path, { method: "POST", body: input }),
    onSuccess: (session) => {
      storeSession(session);
      queryClient.setQueryData(ME_KEY, session.user);
    },
  });
}

export function useRegister() {
  return useSessionMutation<RegisterInput>("/api/auth/register");
}

export function useLogin() {
  return useSessionMutation<LoginInput>("/api/auth/login");
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        // Best effort — local sign-out proceeds even if the API is down.
        await apiFetch<MessageResponse>("/api/auth/logout", {
          method: "POST",
          body: { refreshToken },
        }).catch(() => undefined);
      }
    },
    onSettled: () => {
      clearSession();
      queryClient.removeQueries({ queryKey: ME_KEY });
    },
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ChangePasswordInput) =>
      apiFetch<AuthSession>("/api/auth/change-password", {
        method: "POST",
        body: input,
        auth: true,
      }),
    // The server revoked every refresh token; adopt the fresh pair.
    onSuccess: (session) => {
      storeSession(session);
      queryClient.setQueryData(ME_KEY, session.user);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (input: ForgotPasswordInput) =>
      apiFetch<MessageResponse>("/api/auth/forgot-password", {
        method: "POST",
        body: input,
      }),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (input: VerifyOtpInput) =>
      apiFetch<VerifyOtpResponse>("/api/auth/verify-otp", {
        method: "POST",
        body: input,
      }),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (input: ResetPasswordInput) =>
      apiFetch<MessageResponse>("/api/auth/reset-password", {
        method: "POST",
        body: input,
      }),
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: DeleteAccountInput) =>
      apiFetch<MessageResponse>("/api/auth/account", {
        method: "DELETE",
        body: input,
        auth: true,
      }),
    onSuccess: () => {
      clearSession();
      queryClient.removeQueries({ queryKey: ME_KEY });
    },
  });
}
