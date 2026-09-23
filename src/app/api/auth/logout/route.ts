import { NextResponse } from "next/server";
import { revokeRefreshToken } from "@/lib/db/auth";
import { handleApiError, parseBody } from "@/lib/server/api";
import { refreshSchema } from "@/lib/validation/auth";

// Logout succeeds even with an expired auth token — the point is to
// revoke the long-lived refresh token server-side.
export async function POST(request: Request) {
  try {
    const { refreshToken } = await parseBody(request, refreshSchema);
    await revokeRefreshToken(refreshToken);
    return NextResponse.json({ message: "Signed out" });
  } catch (error) {
    return handleApiError(error);
  }
}
