import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  baseProcedure,
  protectedProcedure,
  publisherOrAdminProcedure,
} from "../init";
import { prisma } from "@/lib/prisma";
import { deleteFromR2 } from "@/lib/r2";

const VALID_LEVELS = ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"];
const VALID_EXAM_TYPES = ["กลางภาค", "ปลายภาค"];
const VALID_TERMS = ["เทอม 1", "เทอม 2"];

export const sheetsRouter = createTRPCRouter({
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
      const where: Record<string, string> = {};
      if (input?.level) where.level = input.level;
      if (input?.examType) where.examType = input.examType;
      if (input?.term) where.term = input.term;
      if (input?.subject) where.subject = input.subject;

      const sheets = await prisma.sheet.findMany({
        where,
        include: {
          uploader: { select: { id: true, name: true, image: true } },
          ratings: { select: { score: true, userId: true } },
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
          uploader: sheet.uploader,
          averageRating,
          totalRatings,
          ratings: sheet.ratings,
          createdAt: sheet.createdAt,
        };
      });
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
        subject: z.string().min(1, "กรุณาเลือกวิชา"),
        level: z.enum(VALID_LEVELS as [string, ...string[]]),
        examType: z.enum(VALID_EXAM_TYPES as [string, ...string[]]),
        term: z.enum(VALID_TERMS as [string, ...string[]]),
        pdfUrl: z.url(),
        pdfKey: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
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
        },
      });

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

      return { success: true };
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

      return { averageRating, totalRatings };
    }),
});
