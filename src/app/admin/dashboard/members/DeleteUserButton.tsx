"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteUserButtonProps {
  userId: string;
  userName: string;
}

export default function DeleteUserButton({
  userId,
  userName,
}: DeleteUserButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${userName}?`
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/members/${userId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error || "Unable to delete user."
        );

        return;
      }

      router.refresh();
    } catch (error) {
      console.error("DELETE USER ERROR:", error);

      alert(
        "Something went wrong while deleting the user."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      className="delete-user-button"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}