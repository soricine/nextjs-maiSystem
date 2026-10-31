
import { NextResponse } from "next/server";
import { unlink } from "node:fs/promises";
import path from "node:path";

import { prisma } from "@/lib/db/prisma";
import {
  handleApiError,
  requireAuth,
  ApiRouteError,
} from "@/lib/server/api";

export const runtime = "nodejs";

type RouteContext = {
  params: { id: string } | Promise<{ id: string }>;
};

export async function DELETE(
  request: Request,
  context: RouteContext,
) {
  try {
    const payload = await requireAuth(request);
    const { id } = await context.params;

    // Find the letter only if it belongs to the logged-in customer.
    const mailItem = await prisma.mailItem.findFirst({
      where: {
        id,
        userId: payload.sub,
      },
    });

    if (!mailItem) {
      throw new ApiRouteError(404, "Letter not found");
    }

    // Delete the database record.
    await prisma.mailItem.delete({
      where: {
        id: mailItem.id,
      },
    });

    
    const uploadDirectory = path.resolve(
      process.cwd(),
      "public",
      "uploads",
    );

    const filePath = path.resolve(
      process.cwd(),
      "public",
      mailItem.photoUrl.replace(/^\/+/, ""),
    );

    if (
      mailItem.photoUrl.startsWith("/uploads/") &&
      filePath.startsWith(uploadDirectory + path.sep)
    ) {
      await unlink(filePath).catch((error: NodeJS.ErrnoException) => {
        if (error.code !== "ENOENT") {
          console.error("Unable to delete letter image:", error);
        }
      });
    }

    return NextResponse.json({
      message: "Letter deleted successfully",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
