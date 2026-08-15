"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [error, setError] = useState("");

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
              Create your  account to get started.
            </p>
          </div>

          <form className="signup-form">

            <div className="signup-field">
              <label htmlFor="name">
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
              />
            </div>

            <div className="signup-field">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
              />
            </div>

            <div className="signup-field">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
              />
            </div>

            <div className="signup-field">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repeat your password"
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
            >
              Create Account
            </button>

          </form>

          <div className="signup-footer">
            Already have an account?{" "}
            <Link href="/login">
              log in
            </Link>
          </div>

        </section>

      </main>

    </div>
  );
}