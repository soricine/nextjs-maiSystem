"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignInPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to create account.");
        return;
      }

      router.push("/login");
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-page">

      <header className="signup-header">
        <div className="signup-header-inner">

          <h2 className="signup-logo">
            Need Name
          </h2>

          <nav className="signup-nav">
            <Link href="/">
              Home
            </Link>

          </nav>

        </div>
      </header>

      <main className="signup-main">

        <section className="signup-card">

          <div className="signup-card-header">
            <h1>Create Account</h1>

            <p>
              Create your customer account.
            </p>
          </div>

          <form
            className="signup-form"
            onSubmit={handleSubmit}
          >

            <div className="signup-field">
              <label htmlFor="name">
                Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />
            </div>

            <div className="signup-field">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />
            </div>

            <div className="signup-field">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
                minLength={8}
              />
            </div>

            <div className="signup-field">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                required
              />
            </div>

            {error && (
              <p className="signup-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="signup-submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>

          </form>

          <div className="signup-footer">
            Already have an account?{" "}
            <Link href="/login">
              Log in
            </Link>
          </div>

        </section>

      </main>

    </div>
  );
}