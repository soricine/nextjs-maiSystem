import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { issueSession } from "@/lib/db/auth";
import { handleApiError, parseBody, ApiRouteError } from "@/lib/server/api";
import { registerSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await parseBody(request, registerSchema);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ApiRouteError(
        409,
        "An account with this email already exists",
        {
          email: ["An account with this email already exists"],
        },
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 12),
      },
    });

    return NextResponse.json(await issueSession(user), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
