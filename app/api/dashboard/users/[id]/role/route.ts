import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { isAdmin, getUserRole } from "@/lib/roles";
import { prisma } from "@/lib/prisma";

const VALID_ROLES = [
  "user",
  "admin",
  "publisher",
  "suspended",
  "pending_publisher",
];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const role = session
    ? getUserRole(session.user as Record<string, unknown>)
    : undefined;

  if (!session || !isAdmin(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;

  if (id === session.user.id) {
    return NextResponse.json(
      { error: "Cannot change your own role" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { role: newRole } = body;

  if (!newRole || !VALID_ROLES.includes(newRole)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id },
    data: { role: newRole },
  });

  return NextResponse.json({ success: true });
}
