/**
 * Bulk upload all PDFs from public/m1-m6 to Cloudflare R2
 * AND create Sheet records in the database so they appear on /freedom.
 *
 * Usage:
 *   bun run scripts/upload-to-r2.ts
 *
 * Prerequisites:
 *   - Fill in R2 credentials in .env
 *   - Run `bunx prisma generate` first
 */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL is not set in .env");
  process.exit(1);
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

const {
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_ENDPOINT,
  R2_PUBLIC_URL,
} = process.env;

if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ENDPOINT) {
  console.error("❌ Missing R2 credentials in .env");
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "public");

// All sheet metadata extracted from existing page files
const SHEETS_DATA = [
  { filename: "/m1/final1/sci.pdf", subject: "วิทยาศาสตร์", level: "ม.1", examType: "ปลายภาค", term: "เทอม 1", byName: "nxmnuxng_q" },
  { filename: "/m1/final1/thai.pdf", subject: "ภาษาไทย", level: "ม.1", examType: "ปลายภาค", term: "เทอม 1", byName: "nxmnuxng_q" },
  { filename: "/m1/final1/social.pdf", subject: "สังคมศึกษา", level: "ม.1", examType: "ปลายภาค", term: "เทอม 1", byName: "nxmnuxng_q" },
  { filename: "/m1/final1/history.pdf", subject: "ประวัติศาสตร์", level: "ม.1", examType: "ปลายภาค", term: "เทอม 1", byName: "nxmnuxng_q" },
  { filename: "/m1/final1/eng.pdf", subject: "ภาษาอังกฤษ", level: "ม.1", examType: "ปลายภาค", term: "เทอม 1", byName: "nxmnuxng_q" },
  { filename: "/m1/final2/sci.pdf", subject: "วิทยาศาสตร์", level: "ม.1", examType: "ปลายภาค", term: "เทอม 2", byName: "nxmnuxng_q" },
  { filename: "/m1/final2/eng.pdf", subject: "อังกฤษ", level: "ม.1", examType: "ปลายภาค", term: "เทอม 2", byName: "nxmnuxng_q" },
  { filename: "/m1/final2/history.pdf", subject: "ประวัติศาสตร์", level: "ม.1", examType: "ปลายภาค", term: "เทอม 2", byName: "nxmnuxng_q" },
  { filename: "/m1/final2/social.pdf", subject: "สังคมศึกษา", level: "ม.1", examType: "ปลายภาค", term: "เทอม 2", byName: "nxmnuxng_q" },
  { filename: "/m1/final2/thai.pdf", subject: "ภาษาไทย", level: "ม.1", examType: "ปลายภาค", term: "เทอม 2", byName: "nxmnuxng_q" },
  { filename: "/m2/final1/math.pdf", subject: "คณิตศาสตร์", level: "ม.2", examType: "ปลายภาค", term: "เทอม 1", byName: "blevrsq_" },
  { filename: "/m2/final1/sci.pdf", subject: "วิทยาศาสตร์", level: "ม.2", examType: "ปลายภาค", term: "เทอม 1", byName: "meemmiiimi" },
  { filename: "/m2/final1/eng.pdf", subject: "ภาษาอังกฤษ", level: "ม.2", examType: "ปลายภาค", term: "เทอม 1", byName: "meemmiiimi" },
  { filename: "/m2/final1/social.pdf", subject: "สังคมศึกษา", level: "ม.2", examType: "ปลายภาค", term: "เทอม 1", byName: "ม.ลีฟ" },
  { filename: "/m2/final1/thai.pdf", subject: "ภาษาไทย", level: "ม.2", examType: "ปลายภาค", term: "เทอม 1", byName: "" },
  { filename: "/m2/final1/korea.pdf", subject: "สไลด์ประวัติศาสตร์ (เกาหลี)", level: "ม.2", examType: "ปลายภาค", term: "เทอม 1", byName: "ม.เต" },
  { filename: "/m2/final1/japan.pdf", subject: "สไลด์ประวัติศาสตร์ (ญี่ปุ่น)", level: "ม.2", examType: "ปลายภาค", term: "เทอม 1", byName: "ม.เต" },
  { filename: "/m2/final1/china.pdf", subject: "สไลด์ประวัติศาสตร์ (จีน)", level: "ม.2", examType: "ปลายภาค", term: "เทอม 1", byName: "ม.เต" },
  { filename: "/m2/final1/india.pdf", subject: "สไลด์ประวัติศาสตร์ (อินเดีย)", level: "ม.2", examType: "ปลายภาค", term: "เทอม 1", byName: "ม.เต" },
  { filename: "/m2/final1/arab.pdf", subject: "สไลด์ประวัติศาสตร์ (อาหรับ)", level: "ม.2", examType: "ปลายภาค", term: "เทอม 1", byName: "ม.เต" },
  { filename: "/m2/final2/math_new.pdf", subject: "คณิตศาสตร์ (ใหม่)", level: "ม.2", examType: "ปลายภาค", term: "เทอม 2", byName: "meemmiiimi" },
  { filename: "/m2/final2/math.pdf", subject: "คณิตศาสตร์", level: "ม.2", examType: "ปลายภาค", term: "เทอม 2", byName: "" },
  { filename: "/m2/final2/sci_new.pdf", subject: "วิทยาศาสตร์ (ใหม่)", level: "ม.2", examType: "ปลายภาค", term: "เทอม 2", byName: "meemmiiimi" },
  { filename: "/m2/final2/sci_66.pdf", subject: "วิทยาศาสตร์ (2566)", level: "ม.2", examType: "ปลายภาค", term: "เทอม 2", byName: "nxmnuxng_q" },
  { filename: "/m2/final2/sci.pdf", subject: "วิทยาศาสตร์", level: "ม.2", examType: "ปลายภาค", term: "เทอม 2", byName: "" },
  { filename: "/m2/final2/thai.pdf", subject: "ภาษาไทย (2566)", level: "ม.2", examType: "ปลายภาค", term: "เทอม 2", byName: "" },
  { filename: "/m2/final2/thai_old.pdf", subject: "ภาษาไทย", level: "ม.2", examType: "ปลายภาค", term: "เทอม 2", byName: "" },
  { filename: "/m2/final2/social_europe.pdf", subject: "สังคมศึกษา (ทวีปยุโรป)", level: "ม.2", examType: "ปลายภาค", term: "เทอม 2", byName: "blevrsq_" },
  { filename: "/m2/final2/social_66.pdf", subject: "สังคมศึกษา (2566)", level: "ม.2", examType: "ปลายภาค", term: "เทอม 2", byName: "nxmnuxng_q" },
  { filename: "/m2/final2/social.pdf", subject: "สังคมศึกษา", level: "ม.2", examType: "ปลายภาค", term: "เทอม 2", byName: "" },
  { filename: "/m2/final2/eng_new2.pdf", subject: "ภาษาอังกฤษ (ใหม่)", level: "ม.2", examType: "ปลายภาค", term: "เทอม 2", byName: "meemmiiimi" },
  { filename: "/m2/final2/eng_new.pdf", subject: "ภาษาอังกฤษ (ใหม่)", level: "ม.2", examType: "ปลายภาค", term: "เทอม 2", byName: "resoo0_" },
  { filename: "/m2/final2/eng_66.pdf", subject: "ภาษาอังกฤษ (2566)", level: "ม.2", examType: "ปลายภาค", term: "เทอม 2", byName: "nxmnuxng_q" },
  { filename: "/m2/final2/eng.pdf", subject: "ภาษาอังกฤษ", level: "ม.2", examType: "ปลายภาค", term: "เทอม 2", byName: "" },
  { filename: "/m2/final2/history.pdf", subject: "ประวัติศาสตร์", level: "ม.2", examType: "ปลายภาค", term: "เทอม 2", byName: "" },
  { filename: "/m2/midterm1/history.pdf", subject: "ประวัติศาสตร์", level: "ม.2", examType: "กลางภาค", term: "เทอม 1", byName: "nxtt.ywy" },
  { filename: "/m2/midterm1/social.pdf", subject: "สังคม", level: "ม.2", examType: "กลางภาค", term: "เทอม 1", byName: "blevrsq" },
  { filename: "/m2/midterm1/english.pdf", subject: "ภาษาอังกฤษ", level: "ม.2", examType: "กลางภาค", term: "เทอม 1", byName: "antnut8778" },
  { filename: "/m2/midterm1/math.pdf", subject: "คณิตศาสตร์", level: "ม.2", examType: "กลางภาค", term: "เทอม 1", byName: "" },
  { filename: "/m2/midterm1/sci.pdf", subject: "วิทยาศาสตร์", level: "ม.2", examType: "กลางภาค", term: "เทอม 1", byName: "" },
  { filename: "/m2/midterm2/sci.pdf", subject: "วิทยาศาสตร์", level: "ม.2", examType: "กลางภาค", term: "เทอม 2", byName: "meemmiiimi" },
  { filename: "/m2/midterm2/thai.pdf", subject: "ภาษาไทย", level: "ม.2", examType: "กลางภาค", term: "เทอม 2", byName: "zong_angpao" },
  { filename: "/m2/midterm2/social.pdf", subject: "สังคมศึกษา", level: "ม.2", examType: "กลางภาค", term: "เทอม 2", byName: "zong_angpao" },
  { filename: "/m2/midterm2/history.pdf", subject: "ประวัติศาสตร์", level: "ม.2", examType: "กลางภาค", term: "เทอม 2", byName: "zong_angpao" },
  { filename: "/m2/midterm2/math.pdf", subject: "คณิตศาสตร์", level: "ม.2", examType: "กลางภาค", term: "เทอม 2", byName: "meemmiiimi" },
  { filename: "/m3/final1/math-new.pdf", subject: "คณิตศาสตร์", level: "ม.3", examType: "ปลายภาค", term: "เทอม 1", byName: "blevrsq" },
  { filename: "/m3/final1/math.pdf", subject: "คณิตศาสตร์ (2567)", level: "ม.3", examType: "ปลายภาค", term: "เทอม 1", byName: "" },
  { filename: "/m3/final1/sci-chemis.pdf", subject: "วิทยาศาสตร์", level: "ม.3", examType: "ปลายภาค", term: "เทอม 1", byName: "antnut8778" },
  { filename: "/m3/final1/sci-nana.pdf", subject: "วิทยาศาสตร์ (2567)", level: "ม.3", examType: "ปลายภาค", term: "เทอม 1", byName: "jirariin" },
  { filename: "/m3/final1/sci.pdf", subject: "วิทยาศาสตร์ (2566)", level: "ม.3", examType: "ปลายภาค", term: "เทอม 1", byName: "" },
  { filename: "/m3/final1/thai.pdf", subject: "ภาษาไทย", level: "ม.3", examType: "ปลายภาค", term: "เทอม 1", byName: "" },
  { filename: "/m3/final1/social.pdf", subject: "สังคมศึกษา", level: "ม.3", examType: "ปลายภาค", term: "เทอม 1", byName: "" },
  { filename: "/m3/final1/history-new.pdf", subject: "ประวัติศาสตร์", level: "ม.3", examType: "ปลายภาค", term: "เทอม 1", byName: "antnut8778" },
  { filename: "/m3/final1/history.pdf", subject: "ประวัติศาสตร์ (2567)", level: "ม.3", examType: "ปลายภาค", term: "เทอม 1", byName: "" },
  { filename: "/m3/final1/eng.pdf", subject: "ภาษาอังกฤษ", level: "ม.3", examType: "ปลายภาค", term: "เทอม 1", byName: "" },
  { filename: "/m3/final1/eng-new.pdf", subject: "ภาษาอังกฤษ", level: "ม.3", examType: "ปลายภาค", term: "เทอม 1", byName: "blevrsq" },
  { filename: "/m3/final2/math.pdf", subject: "คณิตศาสตร์", level: "ม.3", examType: "ปลายภาค", term: "เทอม 2", byName: "" },
  { filename: "/m3/final2/sci.pdf", subject: "วิทยาศาสตร์", level: "ม.3", examType: "ปลายภาค", term: "เทอม 2", byName: "" },
  { filename: "/m3/final2/thai_new.pdf", subject: "ภาษาไทย (เนื้อหาวิจัย)", level: "ม.3", examType: "ปลายภาค", term: "เทอม 2", byName: "ขบวนการมะ" },
  { filename: "/m3/final2/thai.pdf", subject: "ภาษาไทย", level: "ม.3", examType: "ปลายภาค", term: "เทอม 2", byName: "" },
  { filename: "/m3/final2/social.pdf", subject: "สังคมศึกษา", level: "ม.3", examType: "ปลายภาค", term: "เทอม 2", byName: "" },
  { filename: "/m3/final2/history_new.pdf", subject: "ประวัติศาสตร์ (ใหม่)", level: "ม.3", examType: "ปลายภาค", term: "เทอม 2", byName: "nxmnuxng_q" },
  { filename: "/m3/final2/history.pdf", subject: "ประวัติศาสตร์", level: "ม.3", examType: "ปลายภาค", term: "เทอม 2", byName: "" },
  { filename: "/m3/final2/eng_new.pdf", subject: "ภาษาอังกฤษ (ใหม่)", level: "ม.3", examType: "ปลายภาค", term: "เทอม 2", byName: "" },
  { filename: "/m3/final2/eng.pdf", subject: "ภาษาอังกฤษ", level: "ม.3", examType: "ปลายภาค", term: "เทอม 2", byName: "" },
  { filename: "/m3/midterm1/math67.pdf", subject: "คณิตศาสตร์", level: "ม.3", examType: "กลางภาค", term: "เทอม 1", byName: "nxmnuxng_q" },
  { filename: "/m3/midterm1/math.pdf", subject: "คณิตศาสตร์", level: "ม.3", examType: "กลางภาค", term: "เทอม 1", byName: "" },
  { filename: "/m3/midterm1/sci67.pdf", subject: "วิทยาศาสตร์ (2567)", level: "ม.3", examType: "กลางภาค", term: "เทอม 1", byName: "nxmnuxng_q" },
  { filename: "/m3/midterm1/sci.pdf", subject: "วิทยาศาสตร์ (ม.ปอนด์)", level: "ม.3", examType: "กลางภาค", term: "เทอม 1", byName: "" },
  { filename: "/m3/midterm1/thai68.pdf", subject: "ภาษาไทย", level: "ม.3", examType: "กลางภาค", term: "เทอม 1", byName: "ger_nakub" },
  { filename: "/m3/midterm1/thai67.pdf", subject: "ภาษาไทย", level: "ม.3", examType: "กลางภาค", term: "เทอม 1", byName: "nxmnuxng_q" },
  { filename: "/m3/midterm1/thai.pdf", subject: "ภาษาไทย", level: "ม.3", examType: "กลางภาค", term: "เทอม 1", byName: "" },
  { filename: "/m3/midterm1/social68.pdf", subject: "สังคมศึกษา", level: "ม.3", examType: "กลางภาค", term: "เทอม 1", byName: "antnut8778" },
  { filename: "/m3/midterm1/social_onepage.pdf", subject: "สังคมศึกษา (One Page)", level: "ม.3", examType: "กลางภาค", term: "เทอม 1", byName: "blevrsq" },
  { filename: "/m3/midterm1/social67.pdf", subject: "สังคมศึกษา (2567)", level: "ม.3", examType: "กลางภาค", term: "เทอม 1", byName: "nxmnuxng_q" },
  { filename: "/m3/midterm1/social.pdf", subject: "สังคมศึกษา (2566)", level: "ม.3", examType: "กลางภาค", term: "เทอม 1", byName: "" },
  { filename: "/m3/midterm1/history.pdf", subject: "ประวัติศาสตร์", level: "ม.3", examType: "กลางภาค", term: "เทอม 1", byName: "ger_nakub" },
  { filename: "/m3/midterm1/history_onepage.pdf", subject: "ประวัติศาสตร์ (One Page)", level: "ม.3", examType: "กลางภาค", term: "เทอม 1", byName: "blevrsq" },
  { filename: "/m3/midterm1/history67.pdf", subject: "ประวัติศาสตร์ (2567)", level: "ม.3", examType: "กลางภาค", term: "เทอม 1", byName: "nxmnuxng_q" },
  { filename: "/m3/midterm1/english68.pdf", subject: "ภาษาอังกฤษ", level: "ม.3", examType: "กลางภาค", term: "เทอม 1", byName: "ger_nakub" },
  { filename: "/m3/midterm1/english67.pdf", subject: "ภาษาอังกฤษ (2567)", level: "ม.3", examType: "กลางภาค", term: "เทอม 1", byName: "nxmnuxng_q" },
  { filename: "/m3/midterm1/eng.pdf", subject: "ภาษาอังกฤษ (2566)", level: "ม.3", examType: "กลางภาค", term: "เทอม 1", byName: "" },
  { filename: "/m3/midterm1/iep.pdf", subject: "ภาษาอังกฤษเพิ่มเติม", level: "ม.3", examType: "กลางภาค", term: "เทอม 1", byName: "" },
  { filename: "/m3/midterm2/math.pdf", subject: "คณิตศาสตร์", level: "ม.3", examType: "กลางภาค", term: "เทอม 2", byName: "" },
  { filename: "/m3/midterm2/sci.pdf", subject: "วิทยาศาสตร์", level: "ม.3", examType: "กลางภาค", term: "เทอม 2", byName: "" },
  { filename: "/m3/midterm2/thai.pdf", subject: "ภาษาไทย", level: "ม.3", examType: "กลางภาค", term: "เทอม 2", byName: "" },
  { filename: "/m3/midterm2/social.pdf", subject: "สังคมศึกษา", level: "ม.3", examType: "กลางภาค", term: "เทอม 2", byName: "" },
  { filename: "/m3/midterm2/history.pdf", subject: "ประวัติศาสตร์", level: "ม.3", examType: "กลางภาค", term: "เทอม 2", byName: "" },
  { filename: "/m3/midterm2/eng.pdf", subject: "ภาษาอังกฤษ", level: "ม.3", examType: "กลางภาค", term: "เทอม 2", byName: "" },
  { filename: "/m4/final1/thai.pdf", subject: "ภาษาไทย (ย่อความ)", level: "ม.4", examType: "ปลายภาค", term: "เทอม 1", byName: "mxyaaxce" },
  { filename: "/m4/final1/math-new.pdf", subject: "คณิตศาสตร์ พื้นฐาน (ใหม่)", level: "ม.4", examType: "ปลายภาค", term: "เทอม 1", byName: "kenmary_15" },
  { filename: "/m4/final1/math.pdf", subject: "คณิตศาสตร์ พื้นฐาน (2567)", level: "ม.4", examType: "ปลายภาค", term: "เทอม 1", byName: "" },
  { filename: "/m4/final1/sci.pdf", subject: "วิทยาศาสตร์ (ห้องศิลป์)", level: "ม.4", examType: "ปลายภาค", term: "เทอม 1", byName: "" },
  { filename: "/m4/final1/biology.pdf", subject: "ชีววิทยา (ห้องสายวิทย์)", level: "ม.4", examType: "ปลายภาค", term: "เทอม 1", byName: "มิสบีม" },
  { filename: "/m4/final1/eng.pdf", subject: "ภาษาอังกฤษ", level: "ม.4", examType: "ปลายภาค", term: "เทอม 1", byName: "creammyeiieee__" },
  { filename: "/m4/final2/math.pdf", subject: "คณิตศาสตร์", level: "ม.4", examType: "ปลายภาค", term: "เทอม 2", byName: "d3w4r_zz" },
  { filename: "/m4/final2/math_extra.pdf", subject: "คณิตศาสตร์ (เพิ่มเติม)", level: "ม.4", examType: "ปลายภาค", term: "เทอม 2", byName: "torgor_xlt.09" },
  { filename: "/m4/final2/biology.pdf", subject: "ชีววิทยา", level: "ม.4", examType: "ปลายภาค", term: "เทอม 2", byName: "torgor_xlt.09" },
  { filename: "/m4/final2/chemistry.pdf", subject: "เคมี", level: "ม.4", examType: "ปลายภาค", term: "เทอม 2", byName: "torgor_xlt.09" },
  { filename: "/m4/final2/sci_new.pdf", subject: "วิทยาศาสตร์", level: "ม.4", examType: "ปลายภาค", term: "เทอม 2", byName: "d3w4r_zz" },
  { filename: "/m4/final2/social.pdf", subject: "สังคมศึกษา", level: "ม.4", examType: "ปลายภาค", term: "เทอม 2", byName: "มิสเกม" },
  { filename: "/m4/final2/physics2.pdf", subject: "ฟิสิกส์", level: "ม.4", examType: "ปลายภาค", term: "เทอม 2", byName: "torgor_xlt.09" },
  { filename: "/m4/final2/eng.pdf", subject: "ภาษาอังกฤษ", level: "ม.4", examType: "ปลายภาค", term: "เทอม 2", byName: "creammyeiieee__" },
  { filename: "/m4/midterm1/thai.pdf", subject: "ภาษาไทย", level: "ม.4", examType: "กลางภาค", term: "เทอม 1", byName: "cholemie" },
  { filename: "/m4/midterm1/english.pdf", subject: "ภาษาอังกฤษ", level: "ม.4", examType: "กลางภาค", term: "เทอม 1", byName: "cholemie" },
  { filename: "/m4/midterm1/history.pdf", subject: "ประวัติศาสตร์", level: "ม.4", examType: "กลางภาค", term: "เทอม 1", byName: "cholemie" },
  { filename: "/m4/midterm1/social.pdf", subject: "สังคมศึกษา", level: "ม.4", examType: "กลางภาค", term: "เทอม 1", byName: "cholemie" },
  { filename: "/m4/midterm1/social2567.pdf", subject: "สังคมศึกษา (2567)", level: "ม.4", examType: "กลางภาค", term: "เทอม 1", byName: "มิสเกม" },
  { filename: "/m4/midterm2/math.pdf", subject: "คณิตศาสตร์", level: "ม.4", examType: "กลางภาค", term: "เทอม 2", byName: "d3w4r_zz" },
  { filename: "/m5/final1/eng-dewar.pdf", subject: "อังกฤษ", level: "ม.5", examType: "ปลายภาค", term: "เทอม 1", byName: "d3w4r_zz" },
  { filename: "/m5/final1/eng.pdf", subject: "อังกฤษ (สไลด์)", level: "ม.5", examType: "ปลายภาค", term: "เทอม 1", byName: "มิสโมนา" },
  { filename: "/m5/final1/thai-tiger.pdf", subject: "ภาษาไทย", level: "ม.5", examType: "ปลายภาค", term: "เทอม 1", byName: "torgor_xlt.09" },
  { filename: "/m5/final1/thai.pdf", subject: "ภาษาไทย", level: "ม.5", examType: "ปลายภาค", term: "เทอม 1", byName: "foko._" },
  { filename: "/m5/final1/math.pdf", subject: "คณิตศาสตร์ (พื้นฐาน)", level: "ม.5", examType: "ปลายภาค", term: "เทอม 1", byName: "d3w4r_zz" },
  { filename: "/m5/final1/sci-dewar.pdf", subject: "วิทยาศาสตร์ (ห้องศิลป์)", level: "ม.5", examType: "ปลายภาค", term: "เทอม 1", byName: "d3w4r_zz" },
  { filename: "/m5/final1/sci.pdf", subject: "วิทยาศาสตร์ (ห้องศิลป์)", level: "ม.5", examType: "ปลายภาค", term: "เทอม 1", byName: "มาสเตอร์พสิษฐ์" },
  { filename: "/m5/final1/chemis.pdf", subject: "เคมี (พื้นฐาน)", level: "ม.5", examType: "ปลายภาค", term: "เทอม 1", byName: "bosssu_p" },
  { filename: "/m5/final1/chemis_gifted.pdf", subject: "เคมี (GIFTED)", level: "ม.5", examType: "ปลายภาค", term: "เทอม 1", byName: "iammaylyyyy" },
  { filename: "/m5/final1/biology-tiger.pdf", subject: "ชีววิทยา (ใหม่)", level: "ม.5", examType: "ปลายภาค", term: "เทอม 1", byName: "torgor_xlt.09" },
  { filename: "/m5/final1/physics.pdf", subject: "ฟิสิกส์", level: "ม.5", examType: "ปลายภาค", term: "เทอม 1", byName: "มาสเตอร์ปอนด์" },
  { filename: "/m5/final1/physics-pai.pdf", subject: "ฟิสิกส์", level: "ม.5", examType: "ปลายภาค", term: "เทอม 1", byName: "kongphobbb.007" },
  { filename: "/m5/final1/biology-oil.pdf", subject: "ชีววิทยา (2567)", level: "ม.5", examType: "ปลายภาค", term: "เทอม 1", byName: "cotarincy_" },
  { filename: "/m5/final1/biology.pdf", subject: "ชีววิทยา (2567)", level: "ม.5", examType: "ปลายภาค", term: "เทอม 1", byName: "bosssu_p" },
  { filename: "/m5/final1/history.pdf", subject: "ประวัติศาสตร์", level: "ม.5", examType: "ปลายภาค", term: "เทอม 1", byName: "มาสเตอร์เขม" },
  { filename: "/m5/final2/thai.pdf", subject: "ภาษาไทย", level: "ม.5", examType: "ปลายภาค", term: "เทอม 2", byName: "bosssu_p" },
  { filename: "/m5/final2/eng.pdf", subject: "ภาษาอังกฤษ", level: "ม.5", examType: "ปลายภาค", term: "เทอม 2", byName: "creammyeiieee__" },
  { filename: "/m5/midterm1/sci.pdf", subject: "วิทยาศาสตร์", level: "ม.5", examType: "กลางภาค", term: "เทอม 1", byName: "มาสเตอร์พสิษฐ์" },
  { filename: "/m5/midterm1/social.pdf", subject: "สังคมศึกษา", level: "ม.5", examType: "กลางภาค", term: "เทอม 1", byName: "มาสเตอร์ตุ๊ต๊ะ" },
  { filename: "/m5/midterm1/history.pdf", subject: "ประวัติศาสตร์", level: "ม.5", examType: "กลางภาค", term: "เทอม 1", byName: "มาสเตอร์เขม" },
  { filename: "/m5/midterm1/history_naresuan.pdf", subject: "ประวัติศาสตร์ (นเรศวร)", level: "ม.5", examType: "กลางภาค", term: "เทอม 1", byName: "มาสเตอร์เขม" },
  { filename: "/m5/midterm1/biology.pdf", subject: "ชีววิทยา", level: "ม.5", examType: "กลางภาค", term: "เทอม 1", byName: "torgor_xlt.09" },
  { filename: "/m5/midterm1/biology_plant.pdf", subject: "ชีววิทยา (Plant tissue)", level: "ม.5", examType: "กลางภาค", term: "เทอม 1", byName: "torgor_xlt.09" },
  { filename: "/m5/midterm1/math.pdf", subject: "คณิตศาสตร์", level: "ม.5", examType: "กลางภาค", term: "เทอม 1", byName: "d3w4r_zz" },
  { filename: "/m5/midterm2/biology.pdf", subject: "ชีววิทยา", level: "ม.5", examType: "กลางภาค", term: "เทอม 2", byName: "torgor_xlt.09" },
  { filename: "/m5/midterm2/biology-edit.pdf", subject: "ชีววิทยา (Circulatory & Respiratory System)", level: "ม.5", examType: "กลางภาค", term: "เทอม 2", byName: "torgor_xlt.09" },
  { filename: "/m5/midterm2/biology-exam.pdf", subject: "ชีววิทยา (แนวข้อสอบ)", level: "ม.5", examType: "กลางภาค", term: "เทอม 2", byName: "torgor_xlt.09" },
  { filename: "/m5/midterm2/biology-67.pdf", subject: "ชีววิทยา (67)", level: "ม.5", examType: "กลางภาค", term: "เทอม 2", byName: "ppuinoon.s" },
  { filename: "/m5/midterm2/sci.pdf", subject: "วิทยาศาสตร์ (สายศิลป์)", level: "ม.5", examType: "กลางภาค", term: "เทอม 2", byName: "มาสเตอร์พสิษฐ์" },
  { filename: "/m6/final1/biology.pdf", subject: "ชีววิทยา (เรื่อง ประชากร)", level: "ม.6", examType: "ปลายภาค", term: "เทอม 1", byName: "cotarincy_" },
  { filename: "/m6/midterm1/biology.pdf", subject: "ชีววิทยา", level: "ม.6", examType: "กลางภาค", term: "เทอม 1", byName: "bosssu_p" },
];

async function main() {
  // Find or create a system admin user to attribute existing sheets to
  const adminUser = await prisma.user.findFirst({
    where: { role: "admin" },
  });

  if (!adminUser) {
    console.error("❌ No admin user found. Please create an admin user first, then re-run.");
    process.exit(1);
  }

  // Find or create a "Freedom" system account for sheets with no author
  const FREEDOM_ID = "freedom-system";
  let freedomUser = await prisma.user.findUnique({ where: { id: FREEDOM_ID } });
  if (!freedomUser) {
    freedomUser = await prisma.user.create({
      data: {
        id: FREEDOM_ID,
        name: "Freedom",
        email: "system@freedom.act.th",
        emailVerified: true,
        role: "admin",
      },
    });
    console.log(`✅ Created "Freedom" system account (${freedomUser.id})`);
  }

  console.log(`Using admin user: ${adminUser.name} (${adminUser.id})`);
  console.log(`Using Freedom account for uncredited sheets: ${freedomUser.id}`);
  console.log(`Found ${SHEETS_DATA.length} sheets to process.\n`);

  let uploaded = 0;
  let dbCreated = 0;
  let skipped = 0;
  let failed = 0;

  for (const sheet of SHEETS_DATA) {
    const key = sheet.filename.slice(1); // remove leading /
    const filePath = join(PUBLIC_DIR, key);
    const publicUrl = `${R2_PUBLIC_URL}/${key}`;

    // Check if file exists locally
    let body: Buffer;
    try {
      body = readFileSync(filePath) as Buffer;
    } catch {
      console.warn(`⚠️  File not found: ${filePath}, skipping`);
      skipped++;
      continue;
    }

    const sizeMB = (body.length / 1024 / 1024).toFixed(2);

    // Upload to R2
    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
          Body: body,
          ContentType: "application/pdf",
        })
      );
      console.log(`✅ R2: ${key} (${sizeMB} MB)`);
      uploaded++;
    } catch (err) {
      console.error(`❌ R2 upload failed: ${key} — ${(err as Error).message}`);
      failed++;
      continue;
    }

    // Create DB record (skip if already exists for this pdfKey)
    const existing = await prisma.sheet.findFirst({ where: { pdfKey: key } });
    if (existing) {
      console.log(`   ⏭️  DB record already exists for ${key}`);
      continue;
    }

    try {
      const byLabel = sheet.byName ? ` (by ${sheet.byName})` : "";
      await prisma.sheet.create({
        data: {
          title: `${sheet.subject}${byLabel}`,
          description: `${sheet.level} ${sheet.examType} ${sheet.term}`,
          subject: sheet.subject,
          level: sheet.level,
          examType: sheet.examType,
          term: sheet.term,
          pdfUrl: publicUrl,
          pdfKey: key,
          uploadedBy: freedomUser.id,
        },
      });
      console.log(`   📝 DB record created`);
      dbCreated++;
    } catch (err) {
      console.error(`   ❌ DB insert failed: ${(err as Error).message}`);
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`R2 uploaded: ${uploaded}`);
  console.log(`DB records created: ${dbCreated}`);
  console.log(`Skipped (file not found): ${skipped}`);
  console.log(`Failed: ${failed}`);

  await prisma.$disconnect();
}

main();
