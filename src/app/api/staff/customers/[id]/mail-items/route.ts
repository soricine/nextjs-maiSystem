
import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
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
const MAX_FILES = 20;

const allowedTypes: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

function detectImageType(bytes: Buffer): string | null {
  // JPEG signature
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return "image/jpeg";
  }

  // PNG signature
  if (
    bytes.length >= 8 &&
    bytes.subarray(0, 8).equals(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    )
  ) {
    return "image/png";
  }

  // WebP signature
  if (
    bytes.length >= 12 &&
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
}

function createFilename(
  customerId: string,
  hash: string,
  extension: string,
) {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "")
    .replace("Z", "Z");

  // Example: 20261115T093500Z_a83f91c2d7e4.jpg
  return `${timestamp}_${hash.slice(0, 12)}${extension}`;
}

export async function POST(
  request: Request,
  context: RouteContext,
) {
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

    // Accept the new multiple-photo field.
    // Also accept the old "photo" field for compatibility.
    const photos = [
      ...formData.getAll("photos"),
      ...formData.getAll("photo"),
    ].filter((value): value is File => value instanceof File);

    const labelValue = formData.get("label");
    const label =
      typeof labelValue === "string" ? labelValue.trim() : "";

    if (photos.length === 0) {
      throw new ApiRouteError(400, "Please choose at least one photo");
    }

    if (photos.length > MAX_FILES) {
      throw new ApiRouteError(
        400,
        `You can upload a maximum of ${MAX_FILES} photos at once`,
      );
    }

    if (!label || label.length > 120) {
      throw new ApiRouteError(
        400,
        "Enter a letter description of up to 120 characters",
      );
    }

    const results: Array<{
      filename: string;
      success: boolean;
      mailItem?: {
        id: string;
        label: string;
        photoUrl: string;
        createdAt: Date;
      };
      error?: string;
    }> = [];

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "letters",
      customer.id,
    );

    await mkdir(uploadDirectory, { recursive: true });

    for (const photo of photos) {
      let savedFilePath: string | undefined;

      try {
        if (photo.size === 0) {
          throw new Error("This file is empty");
        }

        if (photo.size > MAX_FILE_SIZE) {
          throw new Error("Image is too large. Maximum size is 5 MB");
        }

        const extension = allowedTypes[photo.type];

        if (!extension) {
          throw new Error("Unsupported format. Use JPEG, PNG, or WebP");
        }

        const bytes = Buffer.from(await photo.arrayBuffer());

        // Verify the actual file signature.
        const detectedType = detectImageType(bytes);

        if (!detectedType || detectedType !== photo.type) {
          throw new Error(
            "The file is not a valid image or its format does not match",
          );
        }

        const hash = createHash("sha256")
          .update(bytes)
          .digest("hex");

        const filename = createFilename(
          customer.id,
          hash,
          extension,
        );

        savedFilePath = path.join(uploadDirectory, filename);

        await writeFile(savedFilePath, bytes, {
          flag: "wx",
        });

        const photoUrl =
          `/uploads/letters/${customer.id}/${filename}`;

        const prismaClient = prisma as any;

        const mailItem = await prismaClient.mailItem.create({
          data: {
            userId: customer.id,
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

        results.push({
          filename: photo.name,
          success: true,
          mailItem,
        });
      } catch (error) {
        // Remove this photo if its database insert failed.
        if (savedFilePath) {
          await unlink(savedFilePath).catch(() => undefined);
        }

        results.push({
          filename: photo.name,
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Upload failed",
        });
      }
    }

    const successCount = results.filter(
      (result) => result.success,
    ).length;

    const failedCount = results.length - successCount;

    return NextResponse.json(
      {
        results,
        successCount,
        failedCount,
      },
      {
        status:
          successCount === 0 ? 400 :
          failedCount > 0 ? 200 : 201,
      },
    );
  } catch (error) {
    console.error("POST mail-items upload error:", error);
    return handleApiError(error);
  }
}
