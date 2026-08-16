import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LogoutButton from "../../../components/LogoutButton";

export default async function CustomerProfilePage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  // if (session.user.role !== "CUSTOMER") {
  //   redirect("/dashboard");
  // }

  return (
    <main className="customer-profile-page">

      {/* Header */}
      <header className="profile-header">
        <div className="profile-header-inner">

          <Link href="/" className="profile-logo">
            Need Name
          </Link>

          <nav className="profile-nav">
            <Link href="/customer/profile">
              <LogoutButton />
            </Link>
{/* 
            <Link href="/customer/orders">
              Orders
            </Link>

            <Link href="/customer/settings">
              Settings
            </Link> */}
          </nav>

        </div>
      </header>

      {/* Main content */}
      <section className="profile-main">

        <div className="profile-heading">
          <p className="profile-eyebrow">
            CUSTOMER ACCOUNT  {session.user.name}
          </p>

          <h1>
            Welcome back, {session.user.name}
          </h1>

          <p>
            Manage your personal information and account.
          </p>
        </div>

        <div className="profile-grid">

          {/* Profile card */}
          <section className="profile-card profile-card-main">

            <div className="profile-card-header">
              <div>
                <p className="profile-card-label">
                  Personal Information
                </p>

                <h2>
                  My Profile
                </h2>
              </div>

              <div className="profile-avatar">
                {session.user.name?.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="profile-details">

              <div className="profile-detail">
                <span>Name</span>
                <strong>
                  {session.user.name}
                </strong>
              </div>

              <div className="profile-detail">
                <span>Email</span>
                <strong>
                  {session.user.email}
                </strong>
              </div>

              <div className="profile-detail">
                <span>Account</span>
                <strong>
                  Customer
                </strong>
              </div>

            </div>

            <div className="profile-card-actions">
              <Link
                href="/customer/settings"
                className="profile-button"
              >
                Edit Profile
              </Link>
            </div>

          </section>

          {/* Quick links */}
          <section className="profile-card">

            <div className="profile-card-header">
              <div>
                <p className="profile-card-label">
                  Account
                </p>

                <h2>
                  Quick Access
                </h2>
              </div>
            </div>

            <div className="profile-links">

              <Link href="/customer/orders">
                <span>
                  My Orders
                </span>

                <span>
                  →
                </span>
              </Link>

              <Link href="/customer/settings">
                <span>
                  Account Settings
                </span>

                <span>
                  →
                </span>
              </Link>

              <Link href="/">
                <span>
                  Back to Home
                </span>

                <span>
                  →
                </span>
              </Link>

            </div>

          </section>

        </div>

      </section>

    </main>
  );
}