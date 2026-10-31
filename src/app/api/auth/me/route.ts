
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { toPublicUser } from "@/lib/db/auth";
import {
  handleApiError,
  requireAuth,
  ApiRouteError,
} from "@/lib/server/api";

export async function GET(request: Request) {
  console.log("[auth/me] ROUTE HIT");

  console.log(
    "[auth/me] Authorization header present:",
    request.headers.has("authorization"),
  );

  try {
    const payload = await requireAuth(request);

    console.log("[auth/me] Token verified");

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new ApiRouteError(401, "Account no longer exists");
    }

    return NextResponse.json({
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error("[auth/me] Route error:", error);
    return handleApiError(error);
  }
}
