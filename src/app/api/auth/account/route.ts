import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import {
  handleApiError,
  parseBody,
  requireAuth,
  ApiRouteError,
} from "@/lib/server/api";
import { deleteAccountSchema } from "@/lib/validation/auth";

// Permanently deletes the authenticated user's account. Requires the
// current password as confirmation. Refresh tokens and reset codes are
// removed by the schema's cascade rules.
export async function DELETE(request: Request) {
  try {
    const payload = await requireAuth(request);
    const { password } = await parseBody(request, deleteAccountSchema);

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      throw new ApiRouteError(401, "Account no longer exists");
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new ApiRouteError(400, "Password is incorrect", {
        password: ["Password is incorrect"],
      });
    }

    await prisma.user.delete({ where: { id: user.id } });
    return NextResponse.json({ message: "Account deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
