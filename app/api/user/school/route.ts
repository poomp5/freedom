import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      gradeLevel: true,
      schoolId: true,
      school: { select: { id: true, name: true, province: true } },
    },
  });

  return NextResponse.json(user ?? {});
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { schoolId, gradeLevel } = body;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(schoolId !== undefined && { schoolId: schoolId || null }),
      ...(gradeLevel !== undefined && { gradeLevel: gradeLevel || null }),
    },
  });

  return NextResponse.json({ success: true });
}
