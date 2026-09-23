"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RouterProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// HeroUI v3 needs no provider of its own; RouterProvider makes every
// HeroUI Link/Dropdown.Item href do soft client-side navigation.
export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider navigate={(href, opts) => router.push(href, opts)}>
        {children}
      </RouterProvider>
    </QueryClientProvider>
  );
}
