import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@/lib/validation/auth";

// Stateless JWT helpers. No database access here — token revocation is
// handled at the refresh-token layer (src/lib/db/auth.ts).

const AUTH_TOKEN_TTL = "15m";
const RESET_TOKEN_TTL = "15m";

export type AuthTokenPayload = {
  sub: string; // user id
  email: string;
  name: string;
  role: Role;
  purpose: "auth";
};

export type ResetTokenPayload = {
  sub: string; // user id
  resetId: string; // PasswordReset row consumed by /api/auth/reset-password
  purpose: "password-reset";
};

function secretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set — see .env.example");
  }
  return new TextEncoder().encode(secret);
}

export async function signAuthToken(user: {
  id: string;
  email: string;
  name: string;
  role: string;
}): Promise<string> {
  return new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
    purpose: "auth",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(AUTH_TOKEN_TTL)
    .sign(secretKey());
}

export async function signResetToken(
  userId: string,
  resetId: string,
): Promise<string> {
  return new SignJWT({ resetId, purpose: "password-reset" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(RESET_TOKEN_TTL)
    .sign(secretKey());
}

export async function verifyAuthToken(
  token: string,
): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (payload.purpose !== "auth" || typeof payload.sub !== "string") {
      return null;
    }
    return payload as unknown as AuthTokenPayload;
  } catch {
    return null;
  }
}

export async function verifyResetToken(
  token: string,
): Promise<ResetTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (
      payload.purpose !== "password-reset" ||
      typeof payload.sub !== "string" ||
      typeof payload.resetId !== "string"
    ) {
      return null;
    }
    return payload as unknown as ResetTokenPayload;
  } catch {
    return null;
  }
}
