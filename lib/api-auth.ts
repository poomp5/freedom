import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserRole } from "@/lib/roles";

type AuthSuccess = {
  session: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;
  role: string;
};

type AuthError = {
  error: NextResponse;
};

export async function requireAuth(): Promise<AuthSuccess | AuthError> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const role = getUserRole(session.user as Record<string, unknown>) ?? "user";
  return { session, role };
}

export async function requireAdmin(): Promise<AuthSuccess | AuthError> {
  const result = await requireAuth();
  if ("error" in result) return result;

  if (result.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return result;
}

export async function requirePublisherOrAdmin(): Promise<
  AuthSuccess | AuthError
> {
  const result = await requireAuth();
  if ("error" in result) return result;

  if (result.role !== "publisher" && result.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return result;
}
