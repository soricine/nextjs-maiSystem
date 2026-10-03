import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";

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

async function fetchAdminUsers(): Promise<AdminUsersResponse> {
  const response = await fetch("/api/admin/users", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load users");
  }

  return response.json();
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: fetchAdminUsers,
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
  const response = await fetch("/api/admin/staff", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(input),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ?? "Failed to create staff account",
    );
  }

  return data;
}

export function useCreateStaff() {
  return useMutation({
    mutationFn: createStaff,
  });
}