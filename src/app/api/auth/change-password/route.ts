import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { issueSession, revokeAllRefreshTokens } from "@/lib/db/auth";
import {
  handleApiError,
  parseBody,
  requireAuth,
  ApiRouteError,
} from "@/lib/server/api";
import { changePasswordSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    const payload = await requireAuth(request);
    const { currentPassword, newPassword } = await parseBody(
      request,
      changePasswordSchema,
    );

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      throw new ApiRouteError(401, "Account no longer exists");
    }
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      throw new ApiRouteError(400, "Current password is incorrect", {
        currentPassword: ["Current password is incorrect"],
      });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { password: await bcrypt.hash(newPassword, 12) },
    });

    // Sign out every other device; the response carries a fresh token
    // pair so this session continues uninterrupted.
    await revokeAllRefreshTokens(user.id);
    return NextResponse.json(await issueSession(updated));
  } catch (error) {
    return handleApiError(error);
  }
}
