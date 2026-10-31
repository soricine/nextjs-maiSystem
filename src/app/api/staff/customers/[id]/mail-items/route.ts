
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { prisma } from "@/lib/db/prisma";
import {
  ApiRouteError,
  handleApiError,
  requireAuth,
} from "@/lib/server/api";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedTypes: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export async function POST(
  request: Request,
  context: RouteContext,
) {
  let savedFilePath: string | undefined;

  try {
    const payload = await requireAuth(request);

    const staff = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { role: true },
    });

    if (!staff || !["STAFF", "ADMIN"].includes(staff.role)) {
      throw new ApiRouteError(403, "Staff access required");
    }

    const { id: customerId } = await context.params;

    const customer = await prisma.user.findUnique({
      where: { id: customerId },
      select: { id: true },
    });

    if (!customer) {
      throw new ApiRouteError(404, "Customer not found");
    }

    const formData = await request.formData();
    const photo = formData.get("photo");
    const labelValue = formData.get("label");

    if (!(photo instanceof File)) {
      throw new ApiRouteError(400, "Please choose a letter photo");
    }

    const label =
      typeof labelValue === "string" ? labelValue.trim() : "";

    if (!label || label.length > 120) {
      throw new ApiRouteError(
        400,
        "Enter a letter description of up to 120 characters",
      );
    }

    const extension = allowedTypes[photo.type];

    if (!extension) {
      throw new ApiRouteError(
        400,
        "Use a JPEG, PNG, or WebP image",
      );
    }

    if (photo.size === 0 || photo.size > MAX_FILE_SIZE) {
      throw new ApiRouteError(
        400,
        "The image must be larger than 0 bytes and no bigger than 5 MB",
      );
    }

    const filename = `${randomUUID()}${extension}`;
    const uploadDirectory = path.join(process.cwd(), "public", "uploads");

    await mkdir(uploadDirectory, { recursive: true });

    savedFilePath = path.join(uploadDirectory, filename);

    const bytes = Buffer.from(await photo.arrayBuffer());
    await writeFile(savedFilePath, bytes);

    
    const prismaClient = prisma as any;
    const mailItem = await prismaClient.mailItem.create({
      data: {
        userId: customer.id,
        label,
        photoUrl: `/uploads/${filename}`,
      },
      select: {
        id: true,
        label: true,
        photoUrl: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ mailItem }, { status: 201 });
  } catch (error) {
    if (savedFilePath) {
      await unlink(savedFilePath).catch(() => undefined);
    }

    return handleApiError(error);
  }
}
