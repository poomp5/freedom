import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserRole } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { deleteFromR2 } from "@/lib/r2";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sheet = await prisma.sheet.findUnique({ where: { id } });

  if (!sheet) {
    return NextResponse.json({ error: "ไม่พบชีท" }, { status: 404 });
  }

  const role = getUserRole(session.user as Record<string, unknown>);
  if (sheet.uploadedBy !== session.user.id && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await deleteFromR2(sheet.pdfKey);

  await prisma.sheet.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
