import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod/v4";
import { adminProcedure, baseProcedure, createTRPCRouter } from "../init";

const DEFAULT_COUNTDOWN_ID = "default";

function getFallbackTargetAt() {
  return new Date(Date.UTC(new Date().getFullYear(), 1, 23, 1, 30, 0, 0));
}

export const settingsRouter = createTRPCRouter({
  getCountdown: baseProcedure.query(async () => {
    try {
      const setting = await prisma.countdownSetting.findUnique({
        where: { id: DEFAULT_COUNTDOWN_ID },
      });

      const targetAt = setting?.targetAt ?? getFallbackTargetAt();
      // #region agent log
      try {
        const fs = await import("fs");
        const now = Date.now();
        const targetTs = targetAt.getTime();
        fs.appendFileSync(
          "/Users/poomp5/Documents/GitHub/freedom/.cursor/debug-90ed45.log",
          JSON.stringify({
            sessionId: "90ed45",
            runId: "post-fix",
            hypothesisId: "A,E",
            location: "settings.ts:getCountdown",
            message: "server countdown response",
            data: {
              source: setting?.targetAt ? "db" : "server-fallback",
              targetAt: targetAt.toISOString(),
              targetTs,
              isPast: targetTs <= now,
              serverFallback: getFallbackTargetAt().toISOString(),
            },
            timestamp: now,
          }) + "\n"
        );
      } catch {}
      // #endregion

      return {
        targetAt,
        updatedAt: setting?.updatedAt ?? null,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === "P2021" || error.code === "P2022")
      ) {
        return {
          targetAt: getFallbackTargetAt(),
          updatedAt: null,
        };
      }

      throw error;
    }
  }),

  updateCountdown: adminProcedure
    .input(
      z.object({
        targetAt: z.coerce.date().refine((date) => !Number.isNaN(date.getTime()), {
          message: "วันที่ไม่ถูกต้อง",
        }),
      })
    )
    .mutation(async ({ input }) => {
      const setting = await prisma.countdownSetting.upsert({
        where: { id: DEFAULT_COUNTDOWN_ID },
        create: {
          id: DEFAULT_COUNTDOWN_ID,
          targetAt: input.targetAt,
        },
        update: {
          targetAt: input.targetAt,
        },
      });

      return {
        targetAt: setting.targetAt,
        updatedAt: setting.updatedAt,
      };
    }),
});
