
import { randomUUID } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import {
  ApiRouteError,
  handleApiError,
  requireAuth,
} from "@/lib/server/api";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedTypes: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  let savedFilePath: string | null = null;

  try {
    const payload = await requireAuth(request);

    const staffUser = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { role: true },
    });

    if (staffUser?.role !== "STAFF" && staffUser?.role !== "ADMIN") {
      throw new ApiRouteError(403, "Staff access required.");
    }

    const { id } = await params;

    const customer = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true, profilePhotoUrl: true },
    });

    if (!customer || customer.role !== "CUSTOMER") {
      throw new ApiRouteError(404, "Customer not found.");
    }

    const formData = await request.formData();
    const file = formData.get("photo");

    if (!(file instanceof File)) {
      throw new ApiRouteError(400, "Please select a photo.");
    }

    const extension = allowedTypes[file.type];

    if (!extension) {
      throw new ApiRouteError(
        400,
        "Use a JPEG, PNG, or WebP image.",
      );
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      throw new ApiRouteError(
        400,
        "The photo must be larger than 0 bytes and no larger than 5 MB.",
      );
    }

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "customer-profiles",
    );

    await mkdir(uploadDirectory, { recursive: true });

    const filename = `${randomUUID()}${extension}`;
    savedFilePath = path.join(uploadDirectory, filename);

    const bytes = await file.arrayBuffer();
    await writeFile(savedFilePath, Buffer.from(bytes));

    const profilePhotoUrl = `/uploads/customer-profiles/${filename}`;

    await prisma.user.update({
      where: { id: customer.id },
      data: { profilePhotoUrl },
    });


    const oldUrl = customer.profilePhotoUrl as string | null | undefined;
    if (oldUrl && oldUrl.startsWith("/uploads/customer-profiles/")) {
      const oldFilename = path.basename(oldUrl);
      const oldPath = path.join(uploadDirectory, oldFilename);

      if (oldPath !== savedFilePath) {
        await unlink(oldPath).catch(() => undefined);
      }
    }

    return NextResponse.json({ profilePhotoUrl });
  } catch (error) {
    if (savedFilePath) {
      await unlink(savedFilePath).catch(() => undefined);
    }

    return handleApiError(error);
  }
}
