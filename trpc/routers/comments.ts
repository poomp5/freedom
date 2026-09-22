import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "../init";
import { prisma } from "@/lib/prisma";

const COMMENT_MAX = 1000;

const COMMENT_SELECT = {
  id: true,
  body: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: { id: true, name: true, username: true, image: true },
  },
} as const;

export const commentsRouter = createTRPCRouter({
  /** Comments for a sheet, newest first. Readable by anyone. */
  list: baseProcedure
    .input(z.object({ sheetId: z.string() }))
    .query(async ({ input }) => {
      return prisma.comment.findMany({
        where: { sheetId: input.sheetId },
        select: COMMENT_SELECT,
        orderBy: { createdAt: "desc" },
      });
    }),

  /** Post a comment. Login required. */
  create: protectedProcedure
    .input(
      z.object({
        sheetId: z.string(),
        body: z.string().trim().min(1, "กรุณาพิมพ์ความคิดเห็น").max(COMMENT_MAX),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const sheet = await prisma.sheet.findUnique({
        where: { id: input.sheetId },
        select: { id: true },
      });
      if (!sheet) {
        throw new TRPCError({ code: "NOT_FOUND", message: "ไม่พบชีทนี้" });
      }

      return prisma.comment.create({
        data: {
          sheetId: input.sheetId,
          userId: ctx.auth.user.id,
          body: input.body.trim(),
        },
        select: COMMENT_SELECT,
      });
    }),

  /** Delete a comment. Allowed for its author, the sheet's owner, or an admin. */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const comment = await prisma.comment.findUnique({
        where: { id: input.id },
        select: { id: true, userId: true, sheet: { select: { uploadedBy: true } } },
      });
      if (!comment) {
        throw new TRPCError({ code: "NOT_FOUND", message: "ไม่พบความคิดเห็นนี้" });
      }

      const canDelete =
        comment.userId === ctx.auth.user.id ||
        comment.sheet.uploadedBy === ctx.auth.user.id ||
        ctx.role === "admin";

      if (!canDelete) {
        throw new TRPCError({ code: "FORBIDDEN", message: "ไม่มีสิทธิ์ลบความคิดเห็นนี้" });
      }

      await prisma.comment.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
