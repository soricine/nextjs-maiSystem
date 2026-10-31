
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";

export type StaffCustomer = {
  id: string;
  name: string;
  email: string;
  role: string;
  address: string | null;
  zipCode: string | null;
  country: string | null;
  createdAt: string;
};

type StaffCustomerResponse = {
  customer: StaffCustomer;
};

async function fetchStaffCustomer(
  id: string,
): Promise<StaffCustomerResponse> {
  return apiFetch<StaffCustomerResponse>(
    `/api/staff/customers/${encodeURIComponent(id)}`,
    {
      method: "GET",
      auth: true,
    },
  );
}

export function useStaffCustomer(id: string) {
  return useQuery({
    queryKey: ["staff", "customer", id],
    queryFn: () => fetchStaffCustomer(id),
    enabled: Boolean(id),
  });
}
