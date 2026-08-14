import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  if (session.user.role === "STAFF") {
    redirect("/staff/dashboard");
  }

  if (session.user.role === "CUSTOMER") {
    redirect("/customer/dashboard");
  }

  redirect("/login");
}