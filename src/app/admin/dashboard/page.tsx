import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../lib/auth";
import LogoutButton from "../../../components/LogoutButton";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="wp-dashboard">
      <aside className="wp-sidebar">
        <div className="wp-logo">
          <span>CMS</span>
          <small>Administration</small>
        </div>

        <nav className="wp-menu">
          <Link
            href="/admin/dashboard"
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
            Users
          </Link>

          <Link
            href="#"
            className="wp-menu-item"
          >
            <span>⚙</span>
            Settings
          </Link>
        </nav>
      </aside>

      <div className="wp-main">
        <header className="wp-topbar">
          <div>
            <span className="wp-breadcrumb">
              Dashboard
            </span>
          </div>

          <div className="wp-user">
            <span>
              {session.user.name || "Administrator"}
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
                  {session.user.name || "Administrator"}
                </strong>
                .
              </p>
            </div>

            <button className="wp-primary-button">
              Add New
            </button>
          </div>

          <section className="wp-stats">
            <div className="wp-stat-card">
              <span className="wp-stat-label">
                Posts
              </span>
              <strong>24</strong>
              <small>Total published posts</small>
            </div>

            <div className="wp-stat-card">
              <span className="wp-stat-label">
                Pages
              </span>
              <strong>12</strong>
              <small>Total pages</small>
            </div>

            <div className="wp-stat-card">
              <span className="wp-stat-label">
                Users
              </span>
              <strong>48</strong>
              <small>Registered users</small>
            </div>

            <div className="wp-stat-card">
              <span className="wp-stat-label">
                Comments
              </span>
              <strong>36</strong>
              <small>Pending moderation</small>
            </div>
          </section>

          <section className="wp-grid">
            <div className="wp-card">
              <div className="wp-card-header">
                <h2>Recent Activity</h2>

                <Link href="#">
                  View All
                </Link>
              </div>

              <div className="wp-table-wrapper">
                <table className="wp-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>Welcome to our website</td>
                      <td>Admin</td>
                      <td>
                        <span className="wp-status published">
                          Published
                        </span>
                      </td>
                      <td>Today</td>
                    </tr>

                    <tr>
                      <td>Company News</td>
                      <td>Staff</td>
                      <td>
                        <span className="wp-status draft">
                          Draft
                        </span>
                      </td>
                      <td>Yesterday</td>
                    </tr>

                    <tr>
                      <td>About Us</td>
                      <td>Admin</td>
                      <td>
                        <span className="wp-status published">
                          Published
                        </span>
                      </td>
                      <td>2 days ago</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="wp-card">
              <div className="wp-card-header">
                <h2>Quick Draft</h2>
              </div>

              <form className="wp-draft-form">
                <label>
                  Title
                </label>

                <input
                  type="text"
                  placeholder="Enter title"
                />

                <label>
                  Content
                </label>

                <textarea
                  placeholder="What's on your mind?"
                  rows={6}
                />

                <button
                  type="button"
                  className="wp-primary-button"
                >
                  Save Draft
                </button>
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}