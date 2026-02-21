import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = getSessionCookie(request);

  const isAuthenticated = !!sessionCookie;

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && (pathname === "/signin" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protect onboarding routes — require auth
  if (!isAuthenticated && pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Protect dashboard routes — require auth
  if (!isAuthenticated && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Check session for role-based routing
  if (isAuthenticated && !pathname.startsWith("/onboarding")) {
    try {
      const sessionRes = await fetch(
        `${request.nextUrl.origin}/api/auth/get-session`,
        {
          headers: { cookie: request.headers.get("cookie") || "" },
        },
      );

      if (sessionRes.ok) {
        const session = await sessionRes.json();
        const role = session.user?.role;

        // Suspended users: redirect to /suspended
        if (role === "suspended" && pathname !== "/suspended") {
          return NextResponse.redirect(new URL("/suspended", request.url));
        }

        // Non-suspended users should not access /suspended
        if (role !== "suspended" && pathname === "/suspended") {
          return NextResponse.redirect(new URL("/", request.url));
        }

        // Dashboard access: require admin or publisher role
        if (pathname.startsWith("/dashboard")) {
          if (role !== "admin" && role !== "publisher") {
            return NextResponse.redirect(new URL("/", request.url));
          }

          // Admin sub-routes: require admin role
          if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
        }

        // Onboarding check (skip for dashboard and suspended)
        if (!pathname.startsWith("/dashboard") && pathname !== "/suspended") {
          if (!session.user?.schoolId || !session.user?.gradeLevel) {
            return NextResponse.redirect(
              new URL("/onboarding/school", request.url),
            );
          }
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
    "/suspended",
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
