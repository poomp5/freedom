import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import SheetsClient from "./SheetsClient";

export default async function SheetsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const sheets = await prisma.sheet.findMany({
    include: {
      uploader: { select: { id: true, name: true, image: true } },
      ratings: { select: { score: true, userId: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const userId = session?.user?.id ?? null;

  const formattedSheets = sheets.map((sheet) => {
    const totalRatings = sheet.ratings.length;
    const averageRating =
      totalRatings > 0
        ? Math.round(
            (sheet.ratings.reduce((sum, r) => sum + r.score, 0) / totalRatings) * 10
          ) / 10
        : 0;
    const userRating =
      userId
        ? sheet.ratings.find((r) => r.userId === userId)?.score ?? null
        : null;

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
      averageRating,
      totalRatings,
      userRating,
      createdAt: sheet.createdAt.toISOString(),
    };
  });

  return <SheetsClient sheets={formattedSheets} isLoggedIn={!!session} />;
}
