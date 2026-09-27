import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  baseProcedure,
  protectedProcedure,
  publisherOrAdminProcedure,
  adminProcedure,
} from "../init";
import { prisma } from "@/lib/prisma";
import { deleteFromR2 } from "@/lib/r2";
import { SUBJECTS } from "@/lib/subjects";
import { getPublicSheetList, invalidateSheetList } from "@/lib/sheets-cache";

const VALID_SUBJECTS = SUBJECTS as readonly string[];
const VALID_LEVELS = ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"];
const VALID_EXAM_TYPES = ["กลางภาค", "ปลายภาค"];
const VALID_TERMS = ["เทอม 1", "เทอม 2"];

const SHEET_LIST_SELECT = {
  id: true,
  title: true,
  description: true,
  subject: true,
  level: true,
  examType: true,
  term: true,
  pdfUrl: true,
  isFree: true,
  price: true,
  pageCount: true,
  academicYear: true,
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
      donatePromptPay: true,
    },
  },
} as const;

const SHEET_RECENT_SELECT = {
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
      name: true,
      username: true,
    },
  },
} as const;

type SheetRow = {
  id: string;
  createdAt: Date;
};

async function attachRatingStats<T extends SheetRow>(
  sheets: T[],
  userId: string | null
) {
  const sheetIds = sheets.map((s) => s.id);
  if (sheetIds.length === 0) return [];

  const [ratingStats, userRatings] = await Promise.all([
    prisma.rating.groupBy({
      by: ["sheetId"],
      where: { sheetId: { in: sheetIds } },
      _count: { _all: true },
      _avg: { score: true },
    }),
    userId
      ? prisma.rating.findMany({
          where: { sheetId: { in: sheetIds }, userId },
          select: { sheetId: true, score: true },
        })
      : Promise.resolve([]),
  ]);

  const statsBySheetId = new Map(ratingStats.map((s) => [s.sheetId, s]));
  const userRatingBySheetId = new Map(
    userRatings.map((r) => [r.sheetId, r.score])
  );

  return sheets.map((sheet) => {
    const stats = statsBySheetId.get(sheet.id);
    const totalRatings = stats?._count._all ?? 0;
    const averageRating =
      stats?._avg.score != null
        ? Math.round(stats._avg.score * 10) / 10
        : 0;

    return {
      ...sheet,
      averageRating,
      totalRatings,
      userRating: userRatingBySheetId.get(sheet.id) ?? null,
    };
  });
}

export const sheetsRouter = createTRPCRouter({
  recent: baseProcedure.query(async ({ ctx }) => {
    const sheets = await prisma.sheet.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      select: SHEET_RECENT_SELECT,
    });

    return attachRatingStats(sheets, ctx.userId);
  }),

  /** Full detail for one sheet — powers the sheet detail ("product") page. */
  getById: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const sheet = await prisma.sheet.findUnique({
        where: { id: input.id },
        select: { ...SHEET_LIST_SELECT, pdfKey: true },
      });

      if (!sheet) {
        throw new TRPCError({ code: "NOT_FOUND", message: "ไม่พบชีทนี้" });
      }

      const [withStats] = await attachRatingStats([sheet], ctx.userId);

      // A paid sheet's pdfUrl is only handed out to the buyer, the uploader or
      // an admin -- otherwise the detail page would leak the file for free.
      const isPaid = !sheet.isFree && sheet.price;
      let hasAccess = !isPaid;

      if (isPaid && ctx.userId) {
        if (ctx.userId === sheet.uploader.id) {
          hasAccess = true;
        } else {
          const access = await prisma.sheetAccess.findFirst({
            where: { userId: ctx.userId, sheetId: sheet.id },
            select: { id: true },
          });
          hasAccess = !!access;
        }
      }

      // Other sheets by the same uploader, for the "more from this publisher" rail.
      const moreBySameUploader = await prisma.sheet.findMany({
        where: { uploadedBy: sheet.uploader.id, id: { not: sheet.id } },
        select: {
          id: true,
          title: true,
          subject: true,
          level: true,
          examType: true,
          term: true,
          isFree: true,
          price: true,
        },
        orderBy: { createdAt: "desc" },
        take: 4,
      });

      return {
        ...withStats,
        pdfUrl: hasAccess ? sheet.pdfUrl : null,
        hasAccess,
        moreBySameUploader,
      };
    }),

  /** Public catalog, served from the Next.js data cache (see lib/sheets-cache). */
  list: baseProcedure
    .input(
      z
        .object({
          level: z.string().optional(),
          examType: z.string().optional(),
          term: z.string().optional(),
          subject: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const sheets = await getPublicSheetList();
      if (!input) return sheets;
      return sheets.filter(
        (s) =>
          (!input.level || s.level === input.level) &&
          (!input.examType || s.examType === input.examType) &&
          (!input.term || s.term === input.term) &&
          (!input.subject || s.subject === input.subject)
      );
    }),

  /** The viewer's own ratings, keyed by sheet id — kept out of the shared list cache. */
  myRatings: protectedProcedure.query(async ({ ctx }) => {
    const ratings = await prisma.rating.findMany({
      where: { userId: ctx.auth.user.id },
      select: { sheetId: true, score: true },
    });
    return Object.fromEntries(ratings.map((r) => [r.sheetId, r.score])) as Record<
      string,
      number
    >;
  }),

  mySheets: protectedProcedure.query(async ({ ctx }) => {
    const sheets = await prisma.sheet.findMany({
      where: { uploadedBy: ctx.auth.user.id },
      include: { ratings: { select: { score: true } } },
      orderBy: { createdAt: "desc" },
    });

    return sheets.map((sheet) => {
      const totalRatings = sheet.ratings.length;
      const averageRating =
        totalRatings > 0
          ? Math.round(
              (sheet.ratings.reduce((sum, r) => sum + r.score, 0) /
                totalRatings) *
                10
            ) / 10
          : 0;

      return {
        id: sheet.id,
        title: sheet.title,
        subject: sheet.subject,
        level: sheet.level,
        examType: sheet.examType,
        term: sheet.term,
        pdfUrl: sheet.pdfUrl,
        isFree: sheet.isFree,
        price: sheet.price,
        averageRating,
        totalRatings,
        createdAt: sheet.createdAt,
      };
    });
  }),

  create: publisherOrAdminProcedure
    .input(
      z.object({
        title: z.string().min(1, "กรุณากรอกชื่อชีท"),
        description: z.string().optional(),
        subject: z.enum(VALID_SUBJECTS as [string, ...string[]], { message: "กรุณาเลือกวิชา" }),
        level: z.enum(VALID_LEVELS as [string, ...string[]]),
        examType: z.enum(VALID_EXAM_TYPES as [string, ...string[]]),
        term: z.enum(VALID_TERMS as [string, ...string[]]),
        pdfUrl: z.url(),
        pdfKey: z.string().min(1),
        isFree: z.boolean().default(true),
        price: z.number().int().min(1).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // If paid sheet, require price and publisher bank account
      if (!input.isFree) {
        if (!input.price || input.price <= 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "กรุณาระบุราคาชีท",
          });
        }

        const user = await prisma.user.findUnique({
          where: { id: ctx.auth.user.id },
          select: { paymentMethod: true, bankAccountNumber: true, promptPayNumber: true },
        });

        if (!user?.paymentMethod || (!user.bankAccountNumber && !user.promptPayNumber)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "กรุณาตั้งค่าบัญชีธนาคารก่อนเผยแพร่ชีทแบบเสียเงิน",
          });
        }
      }

      const sheet = await prisma.sheet.create({
        data: {
          title: input.title,
          description: input.description || null,
          subject: input.subject,
          level: input.level,
          examType: input.examType,
          term: input.term,
          pdfUrl: input.pdfUrl,
          pdfKey: input.pdfKey,
          uploadedBy: ctx.auth.user.id,
          isFree: input.isFree,
          price: input.isFree ? null : input.price,
        },
      });

      invalidateSheetList();
      return sheet;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const sheet = await prisma.sheet.findUnique({
        where: { id: input.id },
      });

      if (!sheet) {
        throw new TRPCError({ code: "NOT_FOUND", message: "ไม่พบชีท" });
      }

      if (sheet.uploadedBy !== ctx.auth.user.id && ctx.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Forbidden" });
      }

      await deleteFromR2(sheet.pdfKey);
      await prisma.sheet.delete({ where: { id: input.id } });
      invalidateSheetList();

      return { success: true };
    }),

  allSheets: adminProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          level: z.string().optional(),
          examType: z.string().optional(),
          term: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const where: Record<string, unknown> = {};
      if (input?.level) where.level = input.level;
      if (input?.examType) where.examType = input.examType;
      if (input?.term) where.term = input.term;
      if (input?.search) {
        where.OR = [
          { title: { contains: input.search, mode: "insensitive" } },
          { subject: { contains: input.search, mode: "insensitive" } },
          {
            uploader: {
              name: { contains: input.search, mode: "insensitive" },
            },
          },
        ];
      }

      const sheets = await prisma.sheet.findMany({
        where,
        include: {
          uploader: {
            select: { id: true, name: true, username: true, image: true },
          },
          ratings: { select: { score: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      return sheets.map((sheet) => {
        const totalRatings = sheet.ratings.length;
        const averageRating =
          totalRatings > 0
            ? Math.round(
                (sheet.ratings.reduce((sum, r) => sum + r.score, 0) /
                  totalRatings) *
                  10
              ) / 10
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
          isFree: sheet.isFree,
          price: sheet.price,
          uploader: sheet.uploader,
          averageRating,
          totalRatings,
          createdAt: sheet.createdAt,
        };
      });
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        subject: z.enum(VALID_SUBJECTS as [string, ...string[]]).optional(),
        level: z.enum(VALID_LEVELS as [string, ...string[]]).optional(),
        examType: z.enum(VALID_EXAM_TYPES as [string, ...string[]]).optional(),
        term: z.enum(VALID_TERMS as [string, ...string[]]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      const sheet = await prisma.sheet.findUnique({ where: { id } });
      if (!sheet) {
        throw new TRPCError({ code: "NOT_FOUND", message: "ไม่พบชีท" });
      }

      const updated = await prisma.sheet.update({
        where: { id },
        data,
      });

      invalidateSheetList();
      return updated;
    }),

  rate: protectedProcedure
    .input(
      z.object({
        sheetId: z.string(),
        score: z.number().int().min(1).max(5),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sheet = await prisma.sheet.findUnique({
        where: { id: input.sheetId },
      });
      if (!sheet) {
        throw new TRPCError({ code: "NOT_FOUND", message: "ไม่พบชีท" });
      }

      await prisma.rating.upsert({
        where: {
          userId_sheetId: {
            userId: ctx.auth.user.id,
            sheetId: input.sheetId,
          },
        },
        update: { score: input.score },
        create: {
          userId: ctx.auth.user.id,
          sheetId: input.sheetId,
          score: input.score,
        },
      });

      const ratings = await prisma.rating.findMany({
        where: { sheetId: input.sheetId },
        select: { score: true },
      });

      const totalRatings = ratings.length;
      const averageRating =
        totalRatings > 0
          ? Math.round(
              (ratings.reduce((sum, r) => sum + r.score, 0) / totalRatings) *
                10
            ) / 10
          : 0;

      invalidateSheetList(false);
      return { averageRating, totalRatings };
    }),
});
