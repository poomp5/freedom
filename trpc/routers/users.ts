import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  baseProcedure,
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
        donatePromptPay: true,
        createdAt: true,
        _count: { select: { sheets: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  /**
   * Re-fetch a user's profile picture from Google.
   *
   * Some accounts have a null `image` (they signed in before the picture was
   * persisted). Google's userinfo endpoint needs a valid access token; stored
   * ones are short-lived, so refresh first when we have a refresh token.
   * Accounts created before `accessType: "offline"` was enabled have no refresh
   * token at all -- those users have to sign in again, which we report clearly
   * instead of failing silently.
   */
  refreshGoogleImage: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      const account = await prisma.account.findFirst({
        where: { userId: input.userId, providerId: "google" },
      });

      if (!account) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "ผู้ใช้นี้ไม่ได้เชื่อมต่อบัญชี Google",
        });
      }

      let accessToken = account.accessToken;
      const expired =
        !account.accessTokenExpiresAt ||
        account.accessTokenExpiresAt.getTime() <= Date.now();

      if (expired) {
        if (!account.refreshToken) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "โทเค็นของ Google หมดอายุแล้ว และไม่มี refresh token — ผู้ใช้ต้องเข้าสู่ระบบด้วย Google อีกครั้ง",
          });
        }

        const res = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID as string,
            client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
            refresh_token: account.refreshToken,
            grant_type: "refresh_token",
          }),
        });

        if (!res.ok) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ต่ออายุโทเค็นของ Google ไม่สำเร็จ ผู้ใช้อาจต้องเข้าสู่ระบบใหม่",
          });
        }

        const refreshed = (await res.json()) as {
          access_token: string;
          expires_in?: number;
        };
        accessToken = refreshed.access_token;

        await prisma.account.update({
          where: { id: account.id },
          data: {
            accessToken: refreshed.access_token,
            accessTokenExpiresAt: refreshed.expires_in
              ? new Date(Date.now() + refreshed.expires_in * 1000)
              : null,
          },
        });
      }

      const profileRes = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (!profileRes.ok) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "ดึงข้อมูลโปรไฟล์จาก Google ไม่สำเร็จ",
        });
      }

      const profile = (await profileRes.json()) as { picture?: string };
      if (!profile.picture) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "บัญชี Google นี้ไม่มีรูปโปรไฟล์",
        });
      }

      const updated = await prisma.user.update({
        where: { id: input.userId },
        data: { image: profile.picture },
        select: { id: true, image: true },
      });

      return updated;
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

  getPublicProfile: baseProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { username: input.username },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          gradeLevel: true,
          createdAt: true,
          school: { select: { name: true, province: true } },
          socialIg: true,
          socialFacebook: true,
          socialLine: true,
          socialDiscord: true,
          socialX: true,
          mainContact: true,
          _count: { select: { sheets: true } },
        },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "ไม่พบผู้ใช้นี้" });
      }

      const sheets = await prisma.sheet.findMany({
        where: { uploadedBy: user.id },
        include: { ratings: { select: { score: true } } },
        orderBy: { createdAt: "desc" },
      });

      const sheetsWithRating = sheets.map((sheet) => {
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
          averageRating,
          totalRatings,
          createdAt: sheet.createdAt,
        };
      });

      return { user, sheets: sheetsWithRating };
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

  /** Admin-side edit of a user's donation PromptPay number. */
  setDonatePromptPay: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        donatePromptPay: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const raw = input.donatePromptPay.trim();

      // Empty clears it; otherwise it must be a 10-digit phone or 13-digit ID.
      let value: string | null = null;
      if (raw !== "") {
        const digits = raw.replace(/\D/g, "");
        if (digits.length !== 10 && digits.length !== 13) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ต้องเป็นเบอร์โทร 10 หลัก หรือเลขบัตรประชาชน 13 หลัก",
          });
        }
        value = digits;
      }

      await prisma.user.update({
        where: { id: input.userId },
        data: { donatePromptPay: value },
      });

      return { success: true, donatePromptPay: value };
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
