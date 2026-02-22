import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from "../init";
import { prisma } from "@/lib/prisma";

const VALID_ROLES = [
  "user",
  "admin",
  "publisher",
  "suspended",
  "pending_publisher",
] as const;

export const usersRouter = createTRPCRouter({
  setSchool: protectedProcedure
    .input(
      z.object({
        schoolId: z.string(),
        gradeLevel: z.number().int().min(1).max(6),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const school = await prisma.school.findUnique({
        where: { id: input.schoolId },
      });
      if (!school) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "School not found",
        });
      }

      await prisma.user.update({
        where: { id: ctx.auth.user.id },
        data: {
          schoolId: input.schoolId,
          gradeLevel: input.gradeLevel,
        },
      });

      return { success: true };
    }),

  list: adminProcedure.query(async () => {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        _count: { select: { sheets: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  getUserSheets: adminProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const sheets = await prisma.sheet.findMany({
        where: { uploadedBy: input.userId },
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

  setBankAccount: protectedProcedure
    .input(
      z.object({
        paymentMethod: z.enum(["bank", "promptpay"]),
        bankProvider: z.string().optional(),
        bankAccountNumber: z.string().optional(),
        bankAccountName: z.string().optional(),
        promptPayNumber: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.paymentMethod === "bank") {
        if (!input.bankProvider || !input.bankAccountNumber || !input.bankAccountName) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "กรุณากรอกข้อมูลธนาคารให้ครบ",
          });
        }
      }

      if (input.paymentMethod === "promptpay") {
        if (!input.promptPayNumber) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "กรุณากรอกหมายเลขพร้อมเพย์",
          });
        }
      }

      await prisma.user.update({
        where: { id: ctx.auth.user.id },
        data: {
          paymentMethod: input.paymentMethod,
          bankProvider: input.paymentMethod === "bank" ? input.bankProvider : null,
          bankAccountNumber: input.paymentMethod === "bank" ? input.bankAccountNumber : null,
          bankAccountName: input.paymentMethod === "bank" ? input.bankAccountName : null,
          promptPayNumber: input.paymentMethod === "promptpay" ? input.promptPayNumber : null,
        },
      });

      return { success: true };
    }),

  getBankAccount: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: { id: ctx.auth.user.id },
      select: {
        paymentMethod: true,
        bankProvider: true,
        bankAccountNumber: true,
        bankAccountName: true,
        promptPayNumber: true,
      },
    });

    return user;
  }),

  updateRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(VALID_ROLES),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.auth.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot change your own role",
        });
      }

      await prisma.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      });

      return { success: true };
    }),
});
