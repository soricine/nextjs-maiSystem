"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateStaffPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to create staff account.");
        return;
      }

      setSuccess("Staff account created successfully.");

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        router.push("/admin/dashboard");
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("CREATE STAFF ERROR:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
        </nav>
      </aside>

      <main className="admin-main">

        <div className="admin-topbar">
          <h1>Add Staff</h1>
        </div>

        <section className="admin-content">

          <div className="admin-card">

            <div className="admin-card-header">
              <h2>Create Staff Account</h2>

              <p>
                Create a new account for a staff member.
              </p>
            </div>

            <form
              className="admin-form"
              onSubmit={handleSubmit}
            >

              <div className="admin-field">
                <label htmlFor="name">
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Staff member name"
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>

              <div className="admin-field">
                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="staff@example.com"
                  required
                />
              </div>

              <div className="admin-field">
                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                />
              </div>

              {error && (
                <p className="admin-error">
                  {error}
                </p>
              )}

              {success && (
                <p className="admin-success">
                  {success}
                </p>
              )}

              <div className="admin-form-actions">

                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={loading}
                >
                  {loading
                    ? "Creating..."
                    : "Create Staff Account"}
                </button>

                <Link
                  href="/admin/dashboard"
                  className="admin-secondary-button"
                >
                  Cancel
                </Link>

              </div>

            </form>

          </div>

        </section>

      </main>
    </div>
  );
}