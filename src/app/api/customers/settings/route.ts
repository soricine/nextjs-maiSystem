import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { authOptions } from "../../../../lib/auth";

export async function POST(request: Request) {
  try {
    console.log("POST /api/customers/settings");

    const session = await getServerSession(authOptions);

    console.log("SESSION:", session);

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

    if (session.user.role !== "CUSTOMER") {
      return NextResponse.json(
        {
          error: "Only customers can change their name.",
        },
        {
          status: 403,
        }
      );
    }

    if (!session.user.email) {
      return NextResponse.json(
        {
          error: "Email is missing from your session.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    if (!name) {
      return NextResponse.json(
        {
          error: "Name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        {
          error: "Name must be at least 2 characters.",
        },
        {
          status: 400,
        }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          error: "Name cannot be longer than 100 characters.",
        },
        {
          status: 400,
        }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        name,
      },
    });

    console.log(
      "USER NAME UPDATED:",
      updatedUser.email,
      updatedUser.name
    );

    return NextResponse.json({
      success: true,
      name: updatedUser.name,
    });
  } catch (error) {
    console.error(
      "CUSTOMER SETTINGS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to update your name.",
      },
      {
        status: 500,
      }
    );
  }
}