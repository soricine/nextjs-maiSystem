import { useQuery } from "@tanstack/react-query";

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

type StaffUsersResponse = {
  users: StaffUser[];
};

async function fetchStaffUsers(): Promise<StaffUsersResponse> {
  const response = await fetch("/api/staff/users", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load users");
  }

  return response.json();
}

export function useStaffUsers() {
  return useQuery({
    queryKey: ["staff", "users"],
    queryFn: fetchStaffUsers,
  });
}