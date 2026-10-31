
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";

import { prisma } from "@/lib/db/prisma";
import {
  handleApiError,
  requireAuth,
  ApiRouteError,
} from "@/lib/server/api";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

type RouteContext = {
  params: { id: string } | Promise<{ id: string }>;
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
      select: { id: true, role: true },
    });

    if (!staff) {
      throw new ApiRouteError(401, "Account no longer exists");
    }

    if (!["STAFF", "ADMIN"].includes(staff.role.toUpperCase())) {
      throw new ApiRouteError(
        403,
        "Only staff members can upload customer letters",
      );
    }

    
    const { id: customerId } = await context.params;

    const customer = await prisma.user.findUnique({
      where: { id: customerId },
      select: { id: true, role: true },
    });

    if (!customer || customer.role.toUpperCase() !== "CUSTOMER") {
      throw new ApiRouteError(404, "Customer not found");
    }

    
    const formData = await request.formData();
    const photo = formData.get("photo");
    const rawLabel = formData.get("label");

    if (typeof rawLabel !== "string" || !rawLabel.trim()) {
      throw new ApiRouteError(400, "Please provide a letter label");
    }

    const label = rawLabel.trim();

    if (label.length > 120) {
      throw new ApiRouteError(
        400,
        "The letter label must be 120 characters or fewer",
      );
    }

    if (
      !photo ||
      typeof photo === "string" ||
      typeof photo.arrayBuffer !== "function"
    ) {
      throw new ApiRouteError(400, "Please select a letter image");
    }

    if (!ALLOWED_TYPES[photo.type]) {
      throw new ApiRouteError(
        400,
        "Only JPEG, PNG, and WebP images are supported",
      );
    }

    if (photo.size === 0 || photo.size > MAX_FILE_SIZE) {
      throw new ApiRouteError(
        400,
        "The image must be larger than 0 bytes and no bigger than 5 MB",
      );
    }


    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
    );

    await mkdir(uploadDirectory, { recursive: true });

    const filename = `${randomUUID()}${ALLOWED_TYPES[photo.type]}`;
    savedFilePath = path.join(uploadDirectory, filename);

    const imageBuffer = Buffer.from(await photo.arrayBuffer());
    await writeFile(savedFilePath, imageBuffer);
    const photoUrl = `/uploads/${filename}`;

    const mailItem = await prisma.mailItem.create({
      data: {
        userId: customerId,
        label,
        photoUrl,
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

