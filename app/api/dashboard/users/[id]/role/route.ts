import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
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
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;

  if (id === auth.session.user.id) {
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
