import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publisherOrAdminProcedure,
} from "../init";
import { prisma } from "@/lib/prisma";
import { verifySlipByImage, verifySlipByPayload } from "@/lib/slipok";

export const paymentsRouter = createTRPCRouter({
  getPlatformPaymentInfo: protectedProcedure.query(() => {
    return {
      bankProvider: process.env.PLATFORM_BANK_PROVIDER || null,
      bankAccountNumber: process.env.PLATFORM_BANK_ACCOUNT_NUMBER || null,
      bankAccountName: process.env.PLATFORM_BANK_ACCOUNT_NAME || null,
      promptPayNumber: process.env.PLATFORM_PROMPTPAY_NUMBER || null,
    };
  }),

  purchaseSheet: protectedProcedure
    .input(
      z.object({
        sheetId: z.string(),
        slipImageBase64: z.string().optional(),
        slipImageContentType: z.string().optional(),
        qrPayload: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Validate sheet exists and is paid
      const sheet = await prisma.sheet.findUnique({
        where: { id: input.sheetId },
        include: { uploader: { select: { id: true } } },
      });

      if (!sheet) {
        throw new TRPCError({ code: "NOT_FOUND", message: "ไม่พบชีท" });
      }

      if (sheet.isFree || !sheet.price) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "ชีทนี้เป็นชีทฟรี ไม่ต้องชำระเงิน",
        });
      }

      const sheetPrice = sheet.price;

      // Publishers/uploaders get free access to their own sheets
      if (sheet.uploadedBy === ctx.auth.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "คุณเป็นเจ้าของชีทนี้",
        });
      }

      // 2. Check if user already has access
      const existingAccess = await prisma.sheetAccess.findUnique({
        where: {
          userId_sheetId: {
            userId: ctx.auth.user.id,
            sheetId: input.sheetId,
          },
        },
      });

      if (existingAccess) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "คุณมีสิทธิ์เข้าถึงชีทนี้แล้ว",
        });
      }

      // 3. Verify slip
      if (!input.slipImageBase64 && !input.qrPayload) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "กรุณาอัปโหลดสลิปหรือระบุ QR payload",
        });
      }

      let verificationResult;
      if (input.slipImageBase64 && input.slipImageContentType) {
        const buffer = Buffer.from(input.slipImageBase64, "base64");
        verificationResult = await verifySlipByImage(
          buffer,
          input.slipImageContentType
        );
      } else if (input.qrPayload) {
        verificationResult = await verifySlipByPayload(input.qrPayload);
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "ข้อมูลการชำระเงินไม่ถูกต้อง",
        });
      }

      if (!verificationResult.success) {
        // Create failed transaction record
        await prisma.transaction.create({
          data: {
            buyerId: ctx.auth.user.id,
            sheetId: input.sheetId,
            amount: sheetPrice,
            commission: Math.round(sheetPrice * 0.1),
            publisherAmount: Math.round(sheetPrice * 0.9),
            status: "failed",
            slipVerificationData: verificationResult as object,
          },
        });

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `การตรวจสอบสลิปล้มเหลว: ${verificationResult.error}`,
        });
      }

      // 4. Validate amount matches sheet price
      const verifiedAmount = verificationResult.data?.amount;
      if (verifiedAmount !== undefined && verifiedAmount < sheetPrice) {
        await prisma.transaction.create({
          data: {
            buyerId: ctx.auth.user.id,
            sheetId: input.sheetId,
            amount: sheetPrice,
            commission: Math.round(sheetPrice * 0.1),
            publisherAmount: Math.round(sheetPrice * 0.9),
            status: "rejected",
            slipVerificationData: verificationResult as object,
          },
        });

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `จำนวนเงินไม่ตรงกัน ต้องจ่าย ฿${sheetPrice} แต่โอนมา ฿${verifiedAmount}`,
        });
      }

      // 5. Create transaction and grant access in a transaction
      const commission = Math.round(sheetPrice * 0.1);
      const publisherAmount = sheetPrice - commission;

      const transaction = await prisma.$transaction(async (tx) => {
        const txn = await tx.transaction.create({
          data: {
            buyerId: ctx.auth.user.id,
            sheetId: input.sheetId,
            amount: sheetPrice,
            commission,
            publisherAmount,
            status: "verified",
            slipVerificationData: verificationResult as object,
            verifiedAt: new Date(),
          },
        });

        await tx.sheetAccess.create({
          data: {
            userId: ctx.auth.user.id,
            sheetId: input.sheetId,
            transactionId: txn.id,
          },
        });

        return txn;
      });

      return { success: true, transactionId: transaction.id };
    }),

  checkAccess: protectedProcedure
    .input(z.object({ sheetId: z.string() }))
    .query(async ({ ctx, input }) => {
      const sheet = await prisma.sheet.findUnique({
        where: { id: input.sheetId },
      });

      if (!sheet) {
        throw new TRPCError({ code: "NOT_FOUND", message: "ไม่พบชีท" });
      }

      // Free sheets = everyone has access
      if (sheet.isFree) return { hasAccess: true, isFree: true };

      // Owner always has access
      if (sheet.uploadedBy === ctx.auth.user.id) {
        return { hasAccess: true, isFree: false, isOwner: true };
      }

      // Check purchased access
      const access = await prisma.sheetAccess.findUnique({
        where: {
          userId_sheetId: {
            userId: ctx.auth.user.id,
            sheetId: input.sheetId,
          },
        },
      });

      return { hasAccess: !!access, isFree: false };
    }),

  myPurchases: protectedProcedure.query(async ({ ctx }) => {
    const accesses = await prisma.sheetAccess.findMany({
      where: { userId: ctx.auth.user.id },
      include: {
        sheet: {
          select: {
            id: true,
            title: true,
            subject: true,
            level: true,
            pdfUrl: true,
            price: true,
          },
        },
        transaction: {
          select: { amount: true, createdAt: true, status: true },
        },
      },
      orderBy: { grantedAt: "desc" },
    });

    return accesses;
  }),

  myTransactions: publisherOrAdminProcedure.query(async ({ ctx }) => {
    const transactions = await prisma.transaction.findMany({
      where: {
        sheet: { uploadedBy: ctx.auth.user.id },
      },
      include: {
        sheet: { select: { id: true, title: true, price: true } },
        buyer: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const summary = {
      totalEarnings: transactions
        .filter((t) => t.status === "verified")
        .reduce((sum, t) => sum + t.publisherAmount, 0),
      totalTransactions: transactions.filter((t) => t.status === "verified")
        .length,
      pendingTransactions: transactions.filter((t) => t.status === "pending")
        .length,
    };

    return { transactions, summary };
  }),
});
