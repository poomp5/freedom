import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from "../init";
import { prisma } from "@/lib/prisma";

export const publisherRequestsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1, "กรุณากรอกชื่อ"),
        lastName: z.string().min(1, "กรุณากรอกนามสกุล"),
        dateOfBirth: z.string().min(1, "กรุณากรอกวันเกิด"),
        tel: z.string().regex(/^0\d{8,9}$/, "เบอร์โทรศัพท์ไม่ถูกต้อง"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.role !== "user") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "ไม่สามารถส่งคำขอได้",
        });
      }

      const existing = await prisma.publisherRequest.findFirst({
        where: { userId: ctx.auth.user.id, status: "pending" },
      });

      if (existing) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "คุณมีคำขอที่รอดำเนินการอยู่แล้ว",
        });
      }

      await prisma.$transaction([
        prisma.publisherRequest.create({
          data: {
            userId: ctx.auth.user.id,
            firstName: input.firstName,
            lastName: input.lastName,
            dateOfBirth: new Date(input.dateOfBirth),
            tel: input.tel,
          },
        }),
        prisma.user.update({
          where: { id: ctx.auth.user.id },
          data: { role: "pending_publisher" },
        }),
      ]);

      return { success: true };
    }),

  listPending: adminProcedure.query(async () => {
    return prisma.publisherRequest.findMany({
      where: { status: "pending" },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  approve: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const request = await prisma.publisherRequest.findUnique({
        where: { id: input.id },
      });

      if (!request || request.status !== "pending") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Request not found",
        });
      }

      await prisma.$transaction([
        prisma.publisherRequest.update({
          where: { id: input.id },
          data: { status: "approved" },
        }),
        prisma.user.update({
          where: { id: request.userId },
          data: { role: "publisher" },
        }),
      ]);

      return { success: true };
    }),

  reject: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const request = await prisma.publisherRequest.findUnique({
        where: { id: input.id },
      });

      if (!request || request.status !== "pending") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Request not found",
        });
      }

      await prisma.$transaction([
        prisma.publisherRequest.update({
          where: { id: input.id },
          data: { status: "rejected" },
        }),
        prisma.user.update({
          where: { id: request.userId },
          data: { role: "user" },
        }),
      ]);

      return { success: true };
    }),
});
