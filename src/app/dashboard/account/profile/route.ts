import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { toPublicUser } from "@/lib/db/auth";
import {
  handleApiError,
  requireAuth,
  ApiRouteError,
  parseBody,
} from "@/lib/server/api";
import { updateAddressDetailsSchema } from "@/lib/validation/auth";

export async function PATCH(request: Request) {
  try {
    const payload = await requireAuth(request);

    const { zipCode, country } = await parseBody(
      request,
      updateAddressDetailsSchema,
    );

    const existingUser = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true },
    });

    if (!existingUser) {
      throw new ApiRouteError(401, "Account no longer exists.");
    }

    const user = await prisma.user.update({
      where: { id: payload.sub },
      data: {
        zipCode,
        country,
      },
    });

    return NextResponse.json({
      message: "Account details updated successfully.",
      user: toPublicUser(user),
    });
  } catch (error) {
    return handleApiError(error);
  }
}