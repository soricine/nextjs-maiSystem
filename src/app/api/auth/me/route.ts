import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { toPublicUser } from "@/lib/db/auth";
import { handleApiError, requireAuth, ApiRouteError } from "@/lib/server/api";

export async function GET(request: Request) {
  try {
    const payload = await requireAuth(request);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      // Token is valid but the account was deleted.
      throw new ApiRouteError(401, "Account no longer exists");
    }
    return NextResponse.json({ user: toPublicUser(user) });
  } catch (error) {
    return handleApiError(error);
  }
}
