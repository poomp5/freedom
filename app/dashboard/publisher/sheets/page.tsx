import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/roles";
import PublisherSheetsClient from "./PublisherSheetsClient";

export default async function PublisherSheetsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/signin");

  const role = getUserRole(session.user as Record<string, unknown>);
  if (role !== "publisher" && role !== "admin") redirect("/dashboard");

  const sheets = await prisma.sheet.findMany({
    where: { uploadedBy: session.user.id },
    include: { ratings: { select: { score: true } } },
    orderBy: { createdAt: "desc" },
  });

  const formattedSheets = sheets.map((sheet) => {
    const totalRatings = sheet.ratings.length;
    const averageRating =
      totalRatings > 0
        ? sheet.ratings.reduce((sum, r) => sum + r.score, 0) / totalRatings
        : 0;

    return {
      id: sheet.id,
      title: sheet.title,
      subject: sheet.subject,
      level: sheet.level,
      examType: sheet.examType,
      term: sheet.term,
      pdfUrl: sheet.pdfUrl,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings,
      createdAt: sheet.createdAt.toISOString(),
    };
  });

  return <PublisherSheetsClient initialSheets={formattedSheets} />;
}
