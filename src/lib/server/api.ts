
import { NextResponse } from "next/server";
import type { z } from "zod";
import {
  verifyAuthToken,
  type AuthTokenPayload,
} from "@/lib/server/jwt";


export type ApiErrorBody = {
  error: string;
  fieldErrors?: Record<string, string[]>;
};


export class ApiRouteError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(
    status: number,
    message: string,
    fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiRouteError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export async function parseBody<T extends z.ZodType>(
  request: Request,
  schema: T,
): Promise<z.output<T>> {
  let raw: unknown;

  try {
    raw = await request.json();
  } catch {
    throw new ApiRouteError(
      400,
      "Request body must be valid JSON",
    );
  }

  const result = schema.safeParse(raw);

  if (!result.success) {
    const fieldErrors = z_flatten(result.error);

    throw new ApiRouteError(
      400,
      "Validation failed",
      fieldErrors,
    );
  }

  return result.data;
}

function z_flatten(
  error: z.ZodError,
): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const key =
      issue.path.length > 0
        ? issue.path.join(".")
        : "_";

    (fieldErrors[key] ??= []).push(issue.message);
  }

  return fieldErrors;
}

// Authenticate requests using a JWT Bearer token
export async function requireAuth(
  request: Request,
): Promise<AuthTokenPayload> {
  const authorization =
    request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new ApiRouteError(
      401,
      "Authentication required",
    );
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    throw new ApiRouteError(
      401,
      "Authentication required",
    );
  }

  const payload = await verifyAuthToken(token);

  if (!payload) {
    throw new ApiRouteError(
      401,
      "Invalid or expired authentication token",
    );
  }

  return payload;
}

// Convert API errors into JSON responses
export function handleApiError(
  error: unknown,
): NextResponse<ApiErrorBody> {
  if (error instanceof ApiRouteError) {
    return NextResponse.json(
      {
        error: error.message,
        fieldErrors: error.fieldErrors,
      },
      {
        status: error.status,
      },
    );
  }

  console.error("[api] Unhandled error:", error);

  return NextResponse.json(
    {
      error: "Something went wrong. Please try again.",
    },
    {
      status: 500,
    },
  );
}
