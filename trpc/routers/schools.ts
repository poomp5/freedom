import { z } from "zod/v4";
import { createTRPCRouter, baseProcedure } from "../init";
import { prisma } from "@/lib/prisma";

export const schoolsRouter = createTRPCRouter({
  search: baseProcedure
    .input(z.object({ q: z.string() }))
    .query(async ({ input }) => {
      if (input.q.length < 2) {
        return [];
      }

      return prisma.school.findMany({
        where: {
          name: {
            contains: input.q,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          name: true,
          province: true,
          district: true,
          schoolType: true,
        },
        take: 20,
      });
    }),
});
