import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: sheetId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { score } = body;

  if (!score || score < 1 || score > 5 || !Number.isInteger(score)) {
    return NextResponse.json(
      { error: "คะแนนต้องเป็น 1-5" },
      { status: 400 }
    );
  }

  const sheet = await prisma.sheet.findUnique({ where: { id: sheetId } });
  if (!sheet) {
    return NextResponse.json({ error: "ไม่พบชีท" }, { status: 404 });
  }

  await prisma.rating.upsert({
    where: {
      userId_sheetId: {
        userId: session.user.id,
        sheetId,
      },
    },
    update: { score },
    create: {
      userId: session.user.id,
      sheetId,
      score,
    },
  });

  const ratings = await prisma.rating.findMany({
    where: { sheetId },
    select: { score: true },
  });

  const totalRatings = ratings.length;
  const averageRating =
    totalRatings > 0
      ? Math.round(
          (ratings.reduce((sum, r) => sum + r.score, 0) / totalRatings) * 10
        ) / 10
      : 0;

  return NextResponse.json({ averageRating, totalRatings });
}
