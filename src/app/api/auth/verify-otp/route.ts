import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { checkPasswordResetOtp } from "@/lib/db/auth";
import { signResetToken } from "@/lib/server/jwt";
import { handleApiError, parseBody, ApiRouteError } from "@/lib/server/api";
import { verifyOtpSchema } from "@/lib/validation/auth";

const OTP_ERRORS = {
  invalid: "That code is incorrect. Check the email and try again.",
  expired: "That code has expired. Request a new one.",
  too_many_attempts: "Too many incorrect attempts. Request a new code.",
} as const;

// Exchanges a valid OTP for a short-lived reset token that authorizes
// POST /api/auth/reset-password.
export async function POST(request: Request) {
  try {
    const { email, otp } = await parseBody(request, verifyOtpSchema);

    const user = await prisma.user.findUnique({ where: { email } });
    // Don't reveal whether the email exists; behave like a wrong code.
    const result = user
      ? await checkPasswordResetOtp(user.id, otp)
      : ({ ok: false, reason: "invalid" } as const);

    if (!result.ok) {
      throw new ApiRouteError(400, OTP_ERRORS[result.reason], {
        otp: [OTP_ERRORS[result.reason]],
      });
    }

    const resetToken = await signResetToken(user!.id, result.resetId);
    return NextResponse.json({ resetToken });
  } catch (error) {
    return handleApiError(error);
  }
}
