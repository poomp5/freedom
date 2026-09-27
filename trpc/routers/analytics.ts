import { z } from "zod/v4";
import { Prisma } from "@prisma/client";
import { createTRPCRouter, publisherOrAdminProcedure } from "../init";
import { prisma } from "@/lib/prisma";

const DAY_MS = 24 * 60 * 60 * 1000;
const BKK_OFFSET_MS = 7 * 60 * 60 * 1000;

/** Midnight (Asia/Bangkok) of the current day, as a UTC Date. */
function startOfTodayBangkok() {
  const bkkNow = Date.now() + BKK_OFFSET_MS;
  return new Date(bkkNow - (bkkNow % DAY_MS) - BKK_OFFSET_MS);
}

/** "YYYY-MM-DD" of a date in Asia/Bangkok. */
function bangkokDay(date: Date) {
  return new Date(date.getTime() + BKK_OFFSET_MS).toISOString().slice(0, 10);
}

type EventType = "page_view" | "sheet_view" | "download";
type Counts = Record<EventType | "uploads", number>;
const emptyCounts = (): Counts => ({ page_view: 0, sheet_view: 0, download: 0, uploads: 0 });

export const analyticsRouter = createTRPCRouter({
  /**
   * Traffic for the dashboard. Admins see the whole site; publishers see
   * views/downloads of their own sheets and their own uploads.
   */
  overview: publisherOrAdminProcedure
    .input(z.object({ days: z.union([z.literal(7), z.literal(30), z.literal(90)]).default(30) }))
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx.role === "admin";
      const userId = ctx.auth.user.id;
      const { days } = input;

      const since = new Date(startOfTodayBangkok().getTime() - (days - 1) * DAY_MS);
      const prevSince = new Date(since.getTime() - days * DAY_MS);

      const ownSheets = isAdmin
        ? Prisma.empty
        : Prisma.sql`AND "sheetId" IN (SELECT id FROM "Sheet" WHERE "uploadedBy" = ${userId})`;
      const uploaderWhere = isAdmin ? {} : { uploadedBy: userId };

      const [dailyEvents, prevEvents, visitors, uploads, prevUploads, topRaw] = await Promise.all([
        prisma.$queryRaw<{ day: string; type: EventType; count: number }[]>`
          SELECT to_char(("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Bangkok', 'YYYY-MM-DD') AS day,
                 type, COUNT(*)::int AS count
          FROM "AnalyticsEvent"
          WHERE "createdAt" >= ${since} ${ownSheets}
          GROUP BY 1, 2`,
        prisma.$queryRaw<{ type: EventType; count: number }[]>`
          SELECT type, COUNT(*)::int AS count
          FROM "AnalyticsEvent"
          WHERE "createdAt" >= ${prevSince} AND "createdAt" < ${since} ${ownSheets}
          GROUP BY 1`,
        isAdmin
          ? prisma.$queryRaw<{ current: number; previous: number }[]>`
              SELECT COUNT(DISTINCT "visitorId") FILTER (WHERE "createdAt" >= ${since})::int AS current,
                     COUNT(DISTINCT "visitorId") FILTER (WHERE "createdAt" < ${since})::int AS previous
              FROM "AnalyticsEvent"
              WHERE type = 'page_view' AND "createdAt" >= ${prevSince}`
          : Promise.resolve([{ current: 0, previous: 0 }]),
        prisma.sheet.findMany({
          where: { ...uploaderWhere, createdAt: { gte: since } },
          select: { createdAt: true },
        }),
        prisma.sheet.count({ where: { ...uploaderWhere, createdAt: { gte: prevSince, lt: since } } }),
        prisma.$queryRaw<{ sheetId: string; views: number; downloads: number }[]>`
          SELECT "sheetId",
                 COUNT(*) FILTER (WHERE type = 'sheet_view')::int AS views,
                 COUNT(*) FILTER (WHERE type = 'download')::int AS downloads
          FROM "AnalyticsEvent"
          WHERE "sheetId" IS NOT NULL AND "createdAt" >= ${since} ${ownSheets}
          GROUP BY 1
          ORDER BY downloads DESC, views DESC
          LIMIT 5`,
      ]);

      // Zero-filled daily buckets, oldest first.
      const byDay = new Map<string, Counts>();
      for (let i = 0; i < days; i++) {
        byDay.set(bangkokDay(new Date(since.getTime() + i * DAY_MS)), emptyCounts());
      }
      for (const row of dailyEvents) {
        const bucket = byDay.get(row.day);
        if (bucket) bucket[row.type] += row.count;
      }
      for (const sheet of uploads) {
        const bucket = byDay.get(bangkokDay(sheet.createdAt));
        if (bucket) bucket.uploads += 1;
      }

      const series = [...byDay.entries()].map(([date, c]) => ({
        date,
        pageViews: c.page_view,
        sheetViews: c.sheet_view,
        downloads: c.download,
        uploads: c.uploads,
      }));

      const sum = (key: keyof (typeof series)[number]) =>
        series.reduce((total, d) => total + (d[key] as number), 0);
      const prev = emptyCounts();
      for (const row of prevEvents) prev[row.type] += row.count;

      const titles = await prisma.sheet.findMany({
        where: { id: { in: topRaw.map((t) => t.sheetId) } },
        select: { id: true, title: true, subject: true, level: true },
      });
      const titleById = new Map(titles.map((t) => [t.id, t]));
      const topSheets = topRaw
        .filter((t) => titleById.has(t.sheetId))
        .map((t) => ({ ...titleById.get(t.sheetId)!, views: t.views, downloads: t.downloads }));

      return {
        isAdmin,
        days,
        series,
        totals: {
          pageViews: { current: sum("pageViews"), previous: prev.page_view },
          visitors: { current: visitors[0]?.current ?? 0, previous: visitors[0]?.previous ?? 0 },
          sheetViews: { current: sum("sheetViews"), previous: prev.sheet_view },
          downloads: { current: sum("downloads"), previous: prev.download },
          uploads: { current: sum("uploads"), previous: prevUploads },
        },
        topSheets,
      };
    }),
});
