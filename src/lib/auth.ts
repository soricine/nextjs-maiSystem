import { getServerSession } from "next-auth";

export async function getCurrentUser() {
  const session = await getServerSession();

  return session?.user ?? null;
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}