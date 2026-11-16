
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { apiFetch } from "@/lib/api/client";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

type AdminUsersResponse = {
  users: AdminUser[];
};

type ApiResponse = {
  message?: string;
  error?: string;
  staff?: AdminUser;
};


async function fetchAdminUsers(): Promise<AdminUsersResponse> {
  return apiFetch<AdminUsersResponse>("/api/admin/users", {
    method: "GET",
    auth: true,
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: fetchAdminUsers,
    retry: false,
  });
}

export type CreateStaffInput = {
  name: string;
  email: string;
  password: string;
};

export type CreateStaffResponse = {
  staff: AdminUser;
};


async function createStaff(
  input: CreateStaffInput,
): Promise<CreateStaffResponse> {
  return apiFetch<CreateStaffResponse>("/api/admin/staff", {
    method: "POST",
    body: input,
    auth: true,
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStaff,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "users"],
      });
    },
  });
}


async function deleteAdminUser(
  userId: string,
): Promise<ApiResponse> {
  return apiFetch<ApiResponse>(
    `/api/admin/users?id=${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
      auth: true,
    },
  );
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "users"],
      });
    },
  });
}
