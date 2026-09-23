import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { consumePasswordReset, revokeAllRefreshTokens } from "@/lib/db/auth";
import { verifyResetToken } from "@/lib/server/jwt";
import { handleApiError, parseBody, ApiRouteError } from "@/lib/server/api";
import { resetPasswordSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    const { resetToken, newPassword } = await parseBody(
      request,
      resetPasswordSchema,
    );

    const payload = await verifyResetToken(resetToken);
    if (!payload) {
      throw new ApiRouteError(
        401,
        "This reset link has expired. Start over from “Forgot password”.",
      );
    }

    // Single-use: consuming the reset record invalidates the token even
    // though the JWT itself is still within its lifetime.
    const consumed = await consumePasswordReset(payload.resetId, payload.sub);
    if (!consumed) {
      throw new ApiRouteError(
        401,
        "This reset code was already used. Start over from “Forgot password”.",
      );
    }

    await prisma.user.update({
      where: { id: payload.sub },
      data: { password: await bcrypt.hash(newPassword, 12) },
    });
    await revokeAllRefreshTokens(payload.sub);

    return NextResponse.json({
      message: "Password updated. Sign in with your new password.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
