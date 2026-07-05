export { default } from "next-auth/middleware";

// Protect the authenticated app surface. Public: /, /login, /register, /api/auth, /api/register.
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/tracking/:path*",
    "/nutrition/:path*",
    "/training/:path*",
    "/coach/:path*",
    "/progress/:path*",
    "/reports/:path*",
    "/biodata/:path*",
    "/supplements/:path*",
    "/bloodwork/:path*",
  ],
};
