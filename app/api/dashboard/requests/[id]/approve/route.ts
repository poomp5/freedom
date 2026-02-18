import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { isAdmin, getUserRole } from "@/lib/roles";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: NextRequest,
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
