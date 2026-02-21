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
      },
      orderBy: { createdAt: "desc" },
    });
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
