"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

type SidebarProps = {
  role: "ADMIN" | "STAFF" | "CUSTOMER";
};

export default function Sidebar({ role }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>NextCMS</h2>
      </div>

      <nav className="sidebar-nav">
        <Link href={`/${role.toLowerCase()}/dashboard`}>
          Dashboard
        </Link>

        {role === "ADMIN" && (
          <>
            <Link href="/admin/users">Users</Link>
            <Link href="/admin/settings">Settings</Link>
          </>
        )}

        {role === "STAFF" && (
          <>
            <Link href="/staff/customers">Customers</Link>
            <Link href="/staff/content">Content</Link>
          </>
        )}

        {role === "CUSTOMER" && (
          <>
            <Link href="/customer/profile">My Profile</Link>
            <Link href="/customer/orders">My Orders</Link>
          </>
        )}
      </nav>

      <button
        className="sidebar-logout"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        Logout
      </button>
    </aside>
  );
}