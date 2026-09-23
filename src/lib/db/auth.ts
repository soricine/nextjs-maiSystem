import { createHash, randomBytes, randomInt } from "crypto";
import type { User } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { signAuthToken } from "@/lib/server/jwt";
import type { AuthSession, PublicUser } from "@/lib/api/types";

// Refresh tokens and password-reset OTPs are stored hashed (SHA-256) so a
// database leak cannot be replayed. The raw values exist only in transit.

const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const OTP_TTL_MS = 15 * 60 * 1000; // 15 minutes
export const OTP_MAX_ATTEMPTS = 5;

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}

// The full login payload: sanitized user + fresh token pair.
export async function issueSession(user: User): Promise<AuthSession> {
  const [authToken, refreshToken] = await Promise.all([
    signAuthToken(user),
    issueRefreshToken(user.id),
  ]);
  return { user: toPublicUser(user), authToken, refreshToken };
}

// --- Refresh tokens -----------------------------------------------------

export async function issueRefreshToken(userId: string): Promise<string> {
  const raw = randomBytes(48).toString("base64url");
  await prisma.refreshToken.create({
    data: {
      tokenHash: sha256(raw),
      userId,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });
  return raw;
}

// Returns the owning user if the token is live, revoking it in the same
// step (rotation): every refresh consumes the old token and issues a new one.
export async function consumeRefreshToken(raw: string) {
  const record = await prisma.refreshToken.findUnique({
    where: { tokenHash: sha256(raw) },
    include: { user: true },
  });
  if (!record || record.revokedAt || record.expiresAt < new Date()) {
    return null;
  }
  await prisma.refreshToken.update({
    where: { id: record.id },
    data: { revokedAt: new Date() },
  });
  return record.user;
}

export async function revokeRefreshToken(raw: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { tokenHash: sha256(raw), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function revokeAllRefreshTokens(userId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

// --- Password-reset OTPs ------------------------------------------------

export async function createPasswordResetOtp(userId: string) {
  // Invalidate any outstanding codes so only the latest email is usable.
  await prisma.passwordReset.updateMany({
    where: { userId, consumedAt: null },
    data: { consumedAt: new Date() },
  });
  const otp = randomInt(0, 1_000_000).toString().padStart(6, "0");
  const record = await prisma.passwordReset.create({
    data: {
      userId,
      otpHash: sha256(otp),
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });
  return { otp, resetId: record.id };
}

export type OtpCheckResult =
  | { ok: true; resetId: string }
  | { ok: false; reason: "invalid" | "expired" | "too_many_attempts" };

// Validates an OTP without consuming it — consumption happens when the
// password is actually reset, so the reset token stays single-use.
export async function checkPasswordResetOtp(
  userId: string,
  otp: string,
): Promise<OtpCheckResult> {
  const record = await prisma.passwordReset.findFirst({
    where: { userId, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });
  if (!record) return { ok: false, reason: "invalid" };
  if (record.expiresAt < new Date()) return { ok: false, reason: "expired" };
  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    return { ok: false, reason: "too_many_attempts" };
  }
  if (record.otpHash !== sha256(otp)) {
    const updated = await prisma.passwordReset.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    return {
      ok: false,
      reason:
        updated.attempts >= OTP_MAX_ATTEMPTS ? "too_many_attempts" : "invalid",
    };
  }
  return { ok: true, resetId: record.id };
}

// Marks a reset record used. Returns false if it was already consumed,
// expired, or does not belong to the user — callers must treat that as
// an invalid token.
export async function consumePasswordReset(
  resetId: string,
  userId: string,
): Promise<boolean> {
  const { count } = await prisma.passwordReset.updateMany({
    where: {
      id: resetId,
      userId,
      consumedAt: null,
      expiresAt: { gt: new Date() },
    },
    data: { consumedAt: new Date() },
  });
  return count === 1;
}
