import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: sheetId } = await params;

  const auth = await requireAuth();
  if ("error" in auth) return auth.error;

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
        userId: auth.session.user.id,
        sheetId,
      },
    },
    update: { score },
    create: {
      userId: auth.session.user.id,
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
