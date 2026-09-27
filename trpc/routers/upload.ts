import { z } from "zod/v4";
import { createTRPCRouter, publisherOrAdminProcedure, protectedProcedure } from "../init";
import {
  generatePresignedUniqueUploadUrl,
  generatePresignedUploadUrl,
} from "@/lib/r2";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const MAX_SLIP_SIZE = 5 * 1024 * 1024; // 5MB
const VALID_LEVELS = ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"] as const;

const SUBJECT_SLUGS: Record<string, string> = {
  คณิตศาสตร์: "math",
  วิทยาศาสตร์: "science",
  ภาษาไทย: "thai",
  ภาษาอังกฤษ: "english",
  สังคมศึกษา: "social",
  สุขศึกษา: "health",
  ศิลปะ: "art",
  การงานอาชีพ: "career",
  ฟิสิกส์: "physics",
  เคมี: "chemistry",
  ชีววิทยา: "biology",
};

function slugify(value: string) {
  const mapped = SUBJECT_SLUGS[value];
  if (mapped) return mapped;

  const slug = value
    .trim()
    .toLowerCase()
    .replace(/ม\./g, "m")
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "sheet";
}

function levelSlug(level: string) {
  return level.replace("ม.", "m");
}

export const uploadRouter = createTRPCRouter({
  presign: publisherOrAdminProcedure
    .input(
      z.object({
        fileName: z.string().min(1, "กรุณาระบุชื่อไฟล์"),
        level: z.enum(VALID_LEVELS),
        subject: z.string().min(1, "กรุณาเลือกวิชา"),
        contentType: z.literal("application/pdf", {
          message: "รองรับเฉพาะไฟล์ PDF เท่านั้น",
        }),
        fileSize: z.number().min(1, "ไฟล์ PDF ว่างเปล่า").max(MAX_FILE_SIZE, "ไฟล์มีขนาดเกิน 25MB"),
      })
    )
    .mutation(async ({ input }) => {
      const existingCount = await prisma.sheet.count({
        where: {
          level: input.level,
          subject: input.subject,
        },
      });
      const fileName = `${levelSlug(input.level)}-${slugify(input.subject)}-${existingCount + 1}.pdf`;
      const result = await generatePresignedUploadUrl(
        fileName,
        input.contentType,
        input.fileSize,
        "freedom/pdf"
      );
      return result;
    }),

  presignSlip: protectedProcedure
    .input(
      z.object({
        fileName: z.string().min(1, "กรุณาระบุชื่อไฟล์"),
        contentType: z.enum(["image/jpeg", "image/png", "image/webp"], {
          message: "รองรับเฉพาะไฟล์ JPEG, PNG, หรือ WebP",
        }),
        fileSize: z.number().min(1, "ไฟล์สลิปว่างเปล่า").max(MAX_SLIP_SIZE, "ไฟล์สลิปมีขนาดเกิน 5MB"),
      })
    )
    .mutation(async ({ input }) => {
      const result = await generatePresignedUniqueUploadUrl(
        `slip-${input.fileName}`,
        input.contentType,
        input.fileSize,
        "freedom/slip"
      );
      return result;
    }),
});
