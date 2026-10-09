import { z } from "zod";

// Shared between the front-end forms and the API route handlers so both
// sides enforce identical rules. This file must stay free of server-only
// imports (no Prisma, no Node APIs).

export const ROLES = ["ADMIN", "STAFF", "CUSTOMER"] as const;
export type Role = (typeof ROLES)[number];

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .max(254, "Email is too long")
  .email("Enter a valid email address")
  .transform((value) => value.toLowerCase());

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters")
  .regex(/[a-zA-Z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name is too long");

export const otpSchema = z
  .string()
  .trim()
  .length(6, "The code is 6 digits")
  .regex(/^\d{6}$/, "The code contains only digits");

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const verifyOtpSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});

export const resetPasswordSchema = z.object({
  resetToken: z.string().min(1, "Reset token is required"),
  newPassword: passwordSchema,
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const signupFormSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters."),

    email: z
      .string()
      .email("Please enter a valid email address."),

    address: z
      .string()
      .trim()
      .min(1, "Address is required."),

    zipCode: z
      .string()
      .trim()
      .min(1, "ZIP / postal code is required."),

    country: z
      .string()
      .trim()
      .min(1, "Country is required."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Za-z]/, "Password must contain a letter.")
      .regex(/[0-9]/, "Password must contain a number."),

    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    },
  );
  export const updateAddressDetailsSchema = z.object({
  zipCode: z
    .string()
    .trim()
    .min(1, "ZIP / postal code is required.")
    .max(20, "ZIP / postal code is too long."),

  country: z
    .string()
    .trim()
    .min(1, "Country is required.")
    .max(100, "Country name is too long."),
});

export type UpdateAddressDetailsInput = z.infer<
  typeof updateAddressDetailsSchema
>;

export const changePasswordFormSchema = changePasswordSchema
  .extend({
    confirmNewPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export const newPasswordFormSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormInput = z.infer<typeof signupFormSchema>;
export type ChangePasswordFormInput = z.infer<typeof changePasswordFormSchema>;
export type NewPasswordFormInput = z.infer<typeof newPasswordFormSchema>;

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
