import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserRole } from "@/lib/roles";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = getUserRole(session.user as Record<string, unknown>);

  if (role !== "user") {
    return NextResponse.json(
      { error: "ไม่สามารถส่งคำขอได้" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { firstName, lastName, dateOfBirth, tel } = body;

  if (!firstName || !lastName || !dateOfBirth || !tel) {
    return NextResponse.json(
      { error: "กรุณากรอกข้อมูลให้ครบ" },
      { status: 400 }
    );
  }

  if (!/^0\d{8,9}$/.test(tel)) {
    return NextResponse.json(
      { error: "เบอร์โทรศัพท์ไม่ถูกต้อง" },
      { status: 400 }
    );
  }

  const existing = await prisma.publisherRequest.findFirst({
    where: { userId: session.user.id, status: "pending" },
  });

  if (existing) {
    return NextResponse.json(
      { error: "คุณมีคำขอที่รอดำเนินการอยู่แล้ว" },
      { status: 400 }
    );
  }

  await prisma.$transaction([
    prisma.publisherRequest.create({
      data: {
        userId: session.user.id,
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        tel,
      },
    }),
    prisma.user.update({
      where: { id: session.user.id },
      data: { role: "pending_publisher" },
    }),
  ]);

  return NextResponse.json({ success: true });
}
