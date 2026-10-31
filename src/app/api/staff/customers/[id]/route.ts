
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  ApiRouteError,
  handleApiError,
  requireAuth,
} from "@/lib/server/api";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  { params }: RouteContext,
) {
  try {
    // Authenticate the current user using the Bearer token.
    const session = await requireAuth(request);

    // Only staff and administrators may view customer information.
    const currentUser = await prisma.user.findUnique({
      where: { id: session.sub },
      select: { role: true },
    });

    if (
      currentUser?.role !== "STAFF" &&
      currentUser?.role !== "ADMIN"
    ) {
      throw new ApiRouteError(403, "Staff access required.");
    }

    // Read the customer ID from the URL.
    const { id } = await params;

    const customer = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        address: true,
        zipCode: true,
        country: true,
        createdAt: true,
      },
    });

    if (!customer) {
      throw new ApiRouteError(
        404,
        `No user exists with ID: ${id}`,
      );
    }

    if (customer.role !== "CUSTOMER") {
      throw new ApiRouteError(
        404,
        `The account exists but its role is "${customer.role}", not "CUSTOMER".`,
      );
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error("Staff customer API error:", error);
    return handleApiError(error);
  }
}
