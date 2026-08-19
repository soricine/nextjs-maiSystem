import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import DeleteUserButton from "./DeleteUserButton";

export default async function MembersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const staff = await prisma.user.findMany({
    where: {
      role: "STAFF",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const customers = await prisma.user.findMany({
    where: {
      role: "CUSTOMER",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin</h2>
        </div>

        <nav className="admin-sidebar-nav">
          <Link href="/admin/dashboard">
            Dashboard
          </Link>

          <Link href="/admin/staff">
            Add Staff
          </Link>

          <Link href="/admin/members">
            Members
          </Link>
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <h1>Members</h1>
        </div>

        <section className="admin-content">

          

          <div className="members-card">
            <div className="members-card-header">
              <div>
                <h2>Staff Members</h2>
                <p>
                  Manage your staff accounts.
                </p>
              </div>

              <span className="member-count">
                {staff.length}
              </span>
            </div>

            {staff.length === 0 ? (
              <div className="members-empty">
                No staff members found.
              </div>
            ) : (
              <div className="members-table-wrapper">
                <table className="members-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Created</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {staff.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <strong>{user.name}</strong>
                        </td>

                        <td>
                          {user.email}
                        </td>

                        <td>
                          {user.createdAt.toLocaleDateString()}
                        </td>

                        <td>
                          <DeleteUserButton
                            userId={user.id}
                            userName={user.name}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>




          <div className="members-card">
            <div className="members-card-header">
              <div>
                <h2>Customers</h2>
                <p>
                  Manage your customer accounts.
                </p>
              </div>

              <span className="member-count">
                {customers.length}
              </span>
            </div>

            {customers.length === 0 ? (
              <div className="members-empty">
                No customers found.
              </div>
            ) : (
              <div className="members-table-wrapper">
                <table className="members-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Created</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {customers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <strong>{user.name}</strong>
                        </td>

                        <td>
                          {user.email}
                        </td>

                        <td>
                          {user.createdAt.toLocaleDateString()}
                        </td>

                        <td>
                          <DeleteUserButton
                            userId={user.id}
                            userName={user.name}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </section>
      </main>
    </div>
  );
}