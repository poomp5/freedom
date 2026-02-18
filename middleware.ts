import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get("better-auth.session_token");
  const isAuthenticated = !!sessionCookie;

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && (pathname === "/signin" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protect onboarding routes — require auth
  if (
    !isAuthenticated &&
    (pathname.startsWith("/onboarding") || pathname.startsWith("/dashboard"))
  ) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Check if authenticated user has completed onboarding (school + grade)
  // Skip this check for onboarding, API, auth, and static asset routes
  if (isAuthenticated && !pathname.startsWith("/onboarding")) {
    try {
      const sessionRes = await fetch(
        `${request.nextUrl.origin}/api/auth/get-session`,
        {
          headers: { cookie: request.headers.get("cookie") || "" },
        }
      );

      if (sessionRes.ok) {
        const session = await sessionRes.json();
        if (!session.user?.schoolId || !session.user?.gradeLevel) {
          return NextResponse.redirect(
            new URL("/onboarding/school", request.url)
          );
        }
      }
    } catch {
      // If session check fails, let the request through
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/signin",
    "/signup",
    "/onboarding/:path*",
    "/dashboard/:path*",
    "/",
    "/select",
    "/donate/:path*",
    "/freedom",
    "/m1/:path*",
    "/m2/:path*",
    "/m3/:path*",
    "/m4/:path*",
    "/m5/:path*",
    "/m6/:path*",
  ],
};
