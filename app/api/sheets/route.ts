import { NextRequest, NextResponse } from "next/server";
import { requirePublisherOrAdmin } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

const VALID_LEVELS = ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"];
const VALID_EXAM_TYPES = ["กลางภาค", "ปลายภาค"];
const VALID_TERMS = ["เทอม 1", "เทอม 2"];

export async function POST(request: NextRequest) {
  const auth = await requirePublisherOrAdmin();
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const { title, description, subject, level, examType, term, pdfUrl, pdfKey } = body;

  if (!title || !subject || !level || !examType || !term || !pdfUrl || !pdfKey) {
    return NextResponse.json(
      { error: "กรุณากรอกข้อมูลให้ครบ" },
      { status: 400 }
    );
  }

  if (!VALID_LEVELS.includes(level)) {
    return NextResponse.json({ error: "ระดับชั้นไม่ถูกต้อง" }, { status: 400 });
  }

  if (!VALID_EXAM_TYPES.includes(examType)) {
    return NextResponse.json({ error: "ประเภทสอบไม่ถูกต้อง" }, { status: 400 });
  }

  if (!VALID_TERMS.includes(term)) {
    return NextResponse.json({ error: "เทอมไม่ถูกต้อง" }, { status: 400 });
  }

  const sheet = await prisma.sheet.create({
    data: {
      title,
      description: description || null,
      subject,
      level,
      examType,
      term,
      pdfUrl,
      pdfKey,
      uploadedBy: auth.session.user.id,
    },
  });

  return NextResponse.json(sheet, { status: 201 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level");
  const examType = searchParams.get("examType");
  const term = searchParams.get("term");
  const subject = searchParams.get("subject");

  const where: Record<string, string> = {};
  if (level) where.level = level;
  if (examType) where.examType = examType;
  if (term) where.term = term;
  if (subject) where.subject = subject;

  const sheets = await prisma.sheet.findMany({
    where,
    include: {
      uploader: { select: { id: true, name: true, image: true } },
      ratings: { select: { score: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const result = sheets.map((sheet) => {
    const totalRatings = sheet.ratings.length;
    const averageRating =
      totalRatings > 0
        ? sheet.ratings.reduce((sum, r) => sum + r.score, 0) / totalRatings
        : 0;

    return {
      id: sheet.id,
      title: sheet.title,
      description: sheet.description,
      subject: sheet.subject,
      level: sheet.level,
      examType: sheet.examType,
      term: sheet.term,
      pdfUrl: sheet.pdfUrl,
      uploader: sheet.uploader,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings,
      createdAt: sheet.createdAt,
    };
  });

  return NextResponse.json(result);
}
