import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../lib/auth";
import LogoutButton from "../components/LogoutButton";

export default async function StaffDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "STAFF") {
    redirect("/login");
  }

  return (
    <div className="wp-dashboard">
      <aside className="wp-sidebar">
        <div className="wp-logo">
          <span>CMS</span>
          <small>Staff Panel</small>
        </div>

        <nav className="wp-menu">
          <Link
            href="/staff/dashboard"
            className="wp-menu-item active"
          >
            <span>▣</span>
            Dashboard
          </Link>

          <Link
            href="#"
            className="wp-menu-item"
          >
            <span>▤</span>
            Posts
          </Link>

          <Link
            href="#"
            className="wp-menu-item"
          >
            <span>▥</span>
            Pages
          </Link>

          <Link
            href="#"
            className="wp-menu-item"
          >
            <span>▧</span>
            Media
          </Link>

          <Link
            href="#"
            className="wp-menu-item"
          >
            <span>◉</span>
            Profile
          </Link>
        </nav>
      </aside>

      <div className="wp-main">
        <header className="wp-topbar">
          <span className="wp-breadcrumb">
            Dashboard
          </span>

          <div className="wp-user">
            <span>
              {session.user.name || "Staff Member"}
            </span>

            <LogoutButton />
          </div>
        </header>

        <main className="wp-content">
          <div className="wp-page-header">
            <div>
              <h1>Dashboard</h1>

              <p>
                Welcome back,{" "}
                <strong>
                  {session.user.name || "Staff Member"}
                </strong>
                .
              </p>
            </div>

            <button className="wp-primary-button">
              Create Post
            </button>
          </div>

          <section className="wp-stats">
            <div className="wp-stat-card">
              <span className="wp-stat-label">
                My Posts
              </span>
              <strong>18</strong>
              <small>Posts created by you</small>
            </div>

            <div className="wp-stat-card">
              <span className="wp-stat-label">
                Drafts
              </span>
              <strong>5</strong>
              <small>Posts waiting for review</small>
            </div>

            <div className="wp-stat-card">
              <span className="wp-stat-label">
                Published
              </span>
              <strong>13</strong>
              <small>Published posts</small>
            </div>

            <div className="wp-stat-card">
              <span className="wp-stat-label">
                Comments
              </span>
              <strong>9</strong>
              <small>Recent comments</small>
            </div>
          </section>

          <section className="wp-grid">
            <div className="wp-card">
              <div className="wp-card-header">
                <h2>My Recent Posts</h2>

                <Link href="#">
                  View All
                </Link>
              </div>

              <div className="wp-table-wrapper">
                <table className="wp-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Modified</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>Company News</td>
                      <td>
                        <span className="wp-status draft">
                          Draft
                        </span>
                      </td>
                      <td>Today</td>
                    </tr>

                    <tr>
                      <td>New Product</td>
                      <td>
                        <span className="wp-status published">
                          Published
                        </span>
                      </td>
                      <td>Yesterday</td>
                    </tr>

                    <tr>
                      <td>Our Services</td>
                      <td>
                        <span className="wp-status published">
                          Published
                        </span>
                      </td>
                      <td>3 days ago</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="wp-card">
              <div className="wp-card-header">
                <h2>Quick Actions</h2>
              </div>

              <div className="wp-quick-actions">
                <Link
                  href="#"
                  className="wp-action-button"
                >
                  Create Post
                </Link>

                <Link
                  href="#"
                  className="wp-action-button"
                >
                  Manage Media
                </Link>

                <Link
                  href="#"
                  className="wp-action-button"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}