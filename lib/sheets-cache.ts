import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

/**
 * Cached public sheet catalog.
 *
 * The list is identical for every visitor, so it is read from the Next.js data
 * cache instead of hitting Postgres on every /sheets or home page request.
 * Per-user data (the viewer's own ratings) is fetched separately via
 * `sheets.myRatings`, which keeps this entry shareable.
 *
 * Mutations that change what the list shows call `invalidateSheetList()`.
 */
export const SHEETS_CACHE_TAG = "sheets";

const PUBLIC_SHEET_SELECT = {
  id: true,
  title: true,
  description: true,
  subject: true,
  level: true,
  examType: true,
  term: true,
  isFree: true,
  price: true,
  createdAt: true,
  uploader: {
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      socialIg: true,
      socialFacebook: true,
      socialLine: true,
      socialDiscord: true,
      socialX: true,
      mainContact: true,
    },
  },
} as const;

const readPublicSheetList = unstable_cache(
  async () => {
    const [sheets, ratingStats] = await Promise.all([
      prisma.sheet.findMany({
        select: PUBLIC_SHEET_SELECT,
        orderBy: { createdAt: "desc" },
      }),
      prisma.rating.groupBy({
        by: ["sheetId"],
        _count: { _all: true },
        _avg: { score: true },
      }),
    ]);

    const statsBySheetId = new Map(ratingStats.map((s) => [s.sheetId, s]));

    return sheets.map((sheet) => {
      const stats = statsBySheetId.get(sheet.id);
      return {
        ...sheet,
        averageRating:
          stats?._avg.score != null ? Math.round(stats._avg.score * 10) / 10 : 0,
        totalRatings: stats?._count._all ?? 0,
      };
    });
  },
  ["public-sheet-list-v1"],
  { tags: [SHEETS_CACHE_TAG], revalidate: 300 }
);

export async function getPublicSheetList() {
  const sheets = await readPublicSheetList();
  // The data cache stores JSON, so Dates come back as strings.
  return sheets.map((sheet) => ({ ...sheet, createdAt: new Date(sheet.createdAt) }));
}

export type PublicSheet = Awaited<ReturnType<typeof getPublicSheetList>>[number];

/**
 * `immediate` drops the cached list so the next request refetches (uploads,
 * deletes, edits). Otherwise stale data is served while it refreshes (ratings).
 */
export function invalidateSheetList(immediate = true) {
  revalidateTag(SHEETS_CACHE_TAG, immediate ? { expire: 0 } : "max");
}
