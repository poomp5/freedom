import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { after } from "next/server";
import { createTRPCRouter, baseProcedure } from "../init";
import { notifyDiscord } from "@/lib/discord";

// Best-effort per-instance limiter so the public form can't flood the channel.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const recentByIp = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const hits = (recentByIp.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) {
    recentByIp.set(ip, hits);
    return true;
  }
  hits.push(now);
  recentByIp.set(ip, hits);
  return false;
}

export const contactRouter = createTRPCRouter({
  /** "ติดต่อใช้ระบบ Freedom" form on the home page — schools asking to use the platform. */
  requestPlatform: baseProcedure
    .input(
      z.object({
        schoolName: z.string().trim().min(2, "กรุณากรอกชื่อโรงเรียน").max(200),
        email: z.email("อีเมลไม่ถูกต้อง").max(200),
        contactName: z.string().trim().max(100).optional(),
        message: z.string().trim().max(1000).optional(),
        // Honeypot: hidden from people, bots tend to fill it.
        website: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      if (input.website) return { success: true };

      const h = await headers();
      const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
      if (isRateLimited(ip)) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "ส่งคำขอบ่อยเกินไป กรุณาลองใหม่ภายหลัง",
        });
      }

      after(() =>
        notifyDiscord({
          title: "🏫 โรงเรียนขอใช้ระบบ Freedom",
          color: 0x2563eb,
          fields: [
            { name: "โรงเรียน", value: input.schoolName },
            { name: "อีเมลติดต่อกลับ", value: input.email, inline: true },
            ...(input.contactName ? [{ name: "ผู้ติดต่อ", value: input.contactName, inline: true }] : []),
            ...(input.message ? [{ name: "ข้อความ", value: input.message }] : []),
          ],
        })
      );

      return { success: true };
    }),
});
