import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  const protectedRoutes = [
    "/dashboard",
    "/resume-builder",
    "/roadmaps",
    "/interview",
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
    "/roadmaps/:path*",
    "/interview/:path*",
    "/dashboard/:path*",
  ],
};
