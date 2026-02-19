import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;

  const publisherRequest = await prisma.publisherRequest.findUnique({
    where: { id },
  });

  if (!publisherRequest || publisherRequest.status !== "pending") {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.publisherRequest.update({
      where: { id },
      data: { status: "approved" },
    }),
    prisma.user.update({
      where: { id: publisherRequest.userId },
      data: { role: "publisher" },
    }),
  ]);

  return NextResponse.json({ success: true });
}
