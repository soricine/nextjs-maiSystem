import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createPasswordResetOtp } from "@/lib/db/auth";
import { sendPasswordResetOtp } from "@/lib/server/email";
import { handleApiError, parseBody } from "@/lib/server/api";
import { forgotPasswordSchema } from "@/lib/validation/auth";

// Always responds 200 with the same message, whether or not the email
// exists, so the endpoint can't be used to probe registered addresses.
export async function POST(request: Request) {
  try {
    const { email } = await parseBody(request, forgotPasswordSchema);

    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const { otp } = await createPasswordResetOtp(user.id);
      await sendPasswordResetOtp(user.email, otp);
    }

    return NextResponse.json({
      message:
        "If an account exists for that email, a 6-digit code is on its way.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
