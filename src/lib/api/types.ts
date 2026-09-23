// Response shapes shared by the API routes and the front-end client.
// Must stay free of server-only imports.

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export type AuthSession = {
  user: PublicUser;
  authToken: string;
  refreshToken: string;
};

export type MessageResponse = {
  message: string;
};

export type VerifyOtpResponse = {
  resetToken: string;
};

export type ApiErrorBody = {
  error: string;
  fieldErrors?: Record<string, string[]>;
};
