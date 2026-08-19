import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "You must be logged in.",
        },
        {
          status: 401,
        }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "Only administrators can delete users.",
        },
        {
          status: 403,
        }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          error: "User ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    // Prevent the admin from deleting themselves.
    if (id === session.user.id) {
      return NextResponse.json(
        {
          error: "You cannot delete your own account.",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Extra protection:
    // this endpoint only deletes STAFF or CUSTOMER accounts.
    if (
      user.role !== "STAFF" &&
      user.role !== "CUSTOMER"
    ) {
      return NextResponse.json(
        {
          error: "This account cannot be deleted here.",
        },
        {
          status: 403,
        }
      );
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    return NextResponse.json(
      {
        error: "Unable to delete user.",
      },
      {
        status: 500,
      }
    );
  }
}