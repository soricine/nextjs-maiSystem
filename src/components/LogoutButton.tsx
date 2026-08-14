"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({
      redirect: false,
    });

    window.location.href = "/login";
  };

  return (
    <button
      type="button"
      className="logout-button"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}