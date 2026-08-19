"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangeNamePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const newName = name.trim();

    if (newName.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/customers/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
        }),
      });

      const contentType =
        response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        const text = await response.text();

        console.error(
          "API returned non-JSON response:",
          text
        );

        setError(
          `Server returned ${response.status} instead of JSON.`
        );

        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Unable to change your name."
        );

        return;
      }

      setSuccess("Your name has been changed successfully.");

      setTimeout(() => {
        router.push("/customers/profile");
        router.refresh();
      }, 800);
    } catch (error) {
      console.error("CHANGE NAME ERROR:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="account-page">
      <section className="account-card">
        <div className="account-card-header">
          <p className="account-label">
            Customer Profile
          </p>

          <h1>Change Name</h1>

          <p className="account-description">
            Enter the new name you want to use on your
            account.
          </p>
        </div>

        <form
          className="account-form"
          onSubmit={handleSubmit}
        >
          <div className="account-field">
            <label htmlFor="name">
              New Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Enter your new name"
              minLength={2}
              maxLength={100}
              required
            />
          </div>

          {error && (
            <p className="account-error">
              {error}
            </p>
          )}

          {success && (
            <p className="account-success">
              {success}
            </p>
          )}

          <div className="account-actions">
            <button
            name="submit"
              type="submit"
              className="account-button"
              // disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            
            </button>

            <Link
              href="/customers/profile"
              className="account-button secondary"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}