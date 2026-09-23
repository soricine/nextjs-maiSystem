import { Resend } from "resend";

// Sends transactional email via Resend (see .env.example for setup).
// In local dev without RESEND_API_KEY, the message is printed to the
// server console instead so flows stay testable end-to-end.

export async function sendPasswordResetOtp(
  to: string,
  otp: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const subject = "Your password reset code";
  const text = [
    `Your password reset code is: ${otp}`,
    "",
    "It expires in 15 minutes. If you didn't request a password reset,",
    "you can safely ignore this email — your password has not changed.",
  ].join("\n");

  if (!apiKey) {
    console.log(
      `[email] RESEND_API_KEY not set — would send to ${to}: "${subject}"\n` +
        `[email] Password reset OTP for ${to}: ${otp}`,
    );
    return;
  }

  const resend = new Resend(apiKey);
  const from = process.env.EMAIL_FROM ?? "onboarding@resend.dev";
  const { error } = await resend.emails.send({ from, to, subject, text });
  if (error) {
    throw new Error(`Resend failed to send email: ${error.message}`);
  }
}
