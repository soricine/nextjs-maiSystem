import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  ApiRouteError,
  handleApiError,
  requireAuth,
} from "@/lib/server/api";

export async function GET(request: Request) {
  try {
    const session = await requireAuth(request);

    const currentUser = await prisma.user.findUnique({
      where: { id: session.sub },
      select: { role: true },
    });

    if (currentUser?.role !== "ADMIN") {
      throw new ApiRouteError(403, "Admin access required.");
    }

    const users = await prisma.user.findMany({
      where: {
        role: { not: "ADMIN" },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await requireAuth(request);

    const currentUser = await prisma.user.findUnique({
      where: { id: session.sub },
      select: { role: true },
    });

    if (currentUser?.role !== "ADMIN") {
      throw new ApiRouteError(403, "Admin access required.");
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      throw new ApiRouteError(400, "User ID is required.");
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        role: true,
      },
    });

    if (!targetUser) {
      throw new ApiRouteError(404, "User not found.");
    }

    if (targetUser.role === "ADMIN") {
      throw new ApiRouteError(
        403,
        "Administrator accounts cannot be deleted here.",
      );
    }

    await prisma.user.delete({
      where: { id: targetUser.id },
    });

    return NextResponse.json({
      message: `User "${targetUser.name}" was deleted successfully.`,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

