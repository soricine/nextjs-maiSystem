import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../lib/auth";
import LogoutButton from "../../../components/LogoutButton";

export default async function StaffDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "STAFF") {
    redirect("/login");
  }

  return (
    <main className="account-page">
      <section className="account-card">
        <div className="account-card-header">
          <p className="account-label">Staff Dashboard</p>

          <h1>
            Welcome, {session.user.name}
          </h1>

          <p className="account-description">
            Welcome to your staff dashboard.
          </p>
        </div>

        <div className="account-info">
          <div className="account-info-item">
            <span>Name</span>
            <strong>{session.user.name}</strong>
          </div>

          <div className="account-info-item">
            <span>Email</span>
            <strong>{session.user.email}</strong>
          </div>

          <div className="account-info-item">
            <span>Account type</span>
            <strong>Staff</strong>
          </div>
        </div>
        <div className="account-info-item">
          <LogoutButton />
        </div>
      </section>
    </main>
  );
}