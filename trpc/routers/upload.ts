import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publisherOrAdminProcedure } from "../init";
import { generatePresignedUploadUrl } from "@/lib/r2";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export const uploadRouter = createTRPCRouter({
  presign: publisherOrAdminProcedure
    .input(
      z.object({
        fileName: z.string().min(1, "กรุณาระบุชื่อไฟล์"),
        contentType: z.literal("application/pdf", {
          message: "รองรับเฉพาะไฟล์ PDF เท่านั้น",
        }),
        fileSize: z.number().max(MAX_FILE_SIZE, "ไฟล์มีขนาดเกิน 25MB"),
      })
    )
    .mutation(async ({ input }) => {
      const result = await generatePresignedUploadUrl(
        input.fileName,
        input.contentType,
        input.fileSize
      );
      return result;
    }),
});
