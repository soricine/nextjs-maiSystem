import { NextResponse } from "next/server";
import { consumeRefreshToken, issueSession } from "@/lib/db/auth";
import { handleApiError, parseBody, ApiRouteError } from "@/lib/server/api";
import { refreshSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    const { refreshToken } = await parseBody(request, refreshSchema);

    // Rotation: the presented token is revoked and a fresh pair is issued.
    const user = await consumeRefreshToken(refreshToken);
    if (!user) {
      throw new ApiRouteError(401, "Session expired — please sign in again");
    }

    return NextResponse.json(await issueSession(user));
  } catch (error) {
    return handleApiError(error);
  }
}
