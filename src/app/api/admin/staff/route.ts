import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "../../../../lib/prisma";
import { authOptions } from "../../../../lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    /*
     * User must be logged in.
     */
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

    /*
     * ONLY ADMIN can create staff accounts.
     */
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "Only administrators can create staff accounts.",
        },
        {
          status: 403,
        }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    /*
     * Validate name.
     */
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

    /*
     * Validate email.
     */
    if (!email) {
      return NextResponse.json(
        {
          error: "Email is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Validate password.
     */
    if (password.length < 8) {
      return NextResponse.json(
        {
          error: "Password must be at least 8 characters.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Check if email already exists.
     */
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "A user with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    /*
     * Hash password before storing it.
     */
    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    /*
     * Create STAFF account.
     */
    const staff = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STAFF",
      },
    });

    return NextResponse.json(
      {
        success: true,
        staff: {
          id: staff.id,
          name: staff.name,
          email: staff.email,
          role: staff.role,
        },
      },
      {
        status: 201,
      }
    );

  } catch (error) {
    console.error("CREATE STAFF ERROR:", error);

    return NextResponse.json(
      {
        error: "Unable to create staff account.",
      },
      {
        status: 500,
      }
    );
  }
}