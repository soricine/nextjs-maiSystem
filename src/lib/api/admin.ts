import { useQuery } from "@tanstack/react-query";

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