import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { schoolId, gradeLevel } = body;

  if (!schoolId || !gradeLevel) {
    return NextResponse.json(
      { error: "School and grade level are required" },
      { status: 400 }
    );
  }

  if (gradeLevel < 1 || gradeLevel > 6) {
    return NextResponse.json(
      { error: "Grade level must be between 1 and 6" },
      { status: 400 }
    );
  }

  const school = await prisma.school.findUnique({
    where: { id: schoolId },
  });
  if (!school) {
    return NextResponse.json(
      { error: "School not found" },
      { status: 404 }
    );
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      schoolId: schoolId || null,
      gradeLevel: gradeLevel || null,
    },
  });

  return NextResponse.json({ success: true });
}
