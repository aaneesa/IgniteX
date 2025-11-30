import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  const protectedRoutes = [
    "/dashboard",
    "/resume-builder",
    "/roadmap",
    "/interview",
    "/onboarding"
  ];

  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/resume-builder/:path*",
    "/roadmap/:path*",
    "/interview/:path*",
    "/dashboard/:path*",
    "/onboarding/:path*"
  ],
};
