import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { deleteFromR2 } from "@/lib/r2";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const auth = await requireAuth();
  if ("error" in auth) return auth.error;

  const sheet = await prisma.sheet.findUnique({ where: { id } });

  if (!sheet) {
    return NextResponse.json({ error: "ไม่พบชีท" }, { status: 404 });
  }

  if (sheet.uploadedBy !== auth.session.user.id && auth.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await deleteFromR2(sheet.pdfKey);

  await prisma.sheet.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
