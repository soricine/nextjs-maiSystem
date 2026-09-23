import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { issueSession } from "@/lib/db/auth";
import { handleApiError, parseBody, ApiRouteError } from "@/lib/server/api";
import { loginSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await parseBody(request, loginSchema);

    // Same error for unknown email and wrong password so the endpoint
    // can't be used to probe which emails are registered.
    const user = await prisma.user.findUnique({ where: { email } });
    const passwordValid =
      user !== null && (await bcrypt.compare(password, user.password));
    if (!user || !passwordValid) {
      throw new ApiRouteError(401, "Incorrect email or password");
    }

    return NextResponse.json(await issueSession(user));
  } catch (error) {
    return handleApiError(error);
  }
}
