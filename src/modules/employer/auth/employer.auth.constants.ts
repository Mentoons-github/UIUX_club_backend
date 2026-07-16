export const EMPLOYER_REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/api/v1/employer/auth/refresh-token",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
