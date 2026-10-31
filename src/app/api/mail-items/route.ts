
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  handleApiError,
  requireAuth,
} from "@/lib/server/api";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const payload = await requireAuth(request);

    const mailItems = await prisma.mailItem.findMany({
      where: {
        userId: payload.sub,
      },
      select: {
        id: true,
        label: true,
        photoUrl: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ mailItems });
  } catch (error) {
    console.error("GET mail-items error:", error);
    return handleApiError(error);
  }
}
