
import {
  useMutation,
  useQuery,
  useQueryClient,
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

type ApiResponse = {
  message?: string;
  error?: string;
  staff?: AdminUser;
};

async function readResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  let data: T | ApiResponse = {} as T;

  if (text.trim()) {
    try {
      data = JSON.parse(text) as T;
    } catch {
      throw new Error(
        `Invalid server response (HTTP ${response.status}).`,
      );
    }
  }

  if (!response.ok) {
    const errorData = data as ApiResponse;

    throw new Error(
      errorData.error ??
        errorData.message ??
        `Request failed (HTTP ${response.status}).`,
    );
  }

  return data as T;
}

async function fetchAdminUsers(): Promise<AdminUsersResponse> {
  const response = await fetch("/api/admin/users", {
    credentials: "include",
  });

  return readResponse<AdminUsersResponse>(response);
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

  return readResponse<CreateStaffResponse>(response);
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

async function deleteAdminUser(userId: string): Promise<ApiResponse> {
  const response = await fetch(
    `/api/admin/users?id=${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  return readResponse<ApiResponse>(response);
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
