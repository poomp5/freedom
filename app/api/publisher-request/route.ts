import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;

  if (auth.role !== "user") {
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
    where: { userId: auth.session.user.id, status: "pending" },
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
        userId: auth.session.user.id,
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        tel,
      },
    }),
    prisma.user.update({
      where: { id: auth.session.user.id },
      data: { role: "pending_publisher" },
    }),
  ]);

  return NextResponse.json({ success: true });
}
