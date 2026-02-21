import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

const BUCKET = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!;

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "ไม่พบไฟล์" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "รองรับเฉพาะ JPG, PNG, WebP, GIF" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "ไฟล์มีขนาดเกิน 5MB" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const key = `avatars/${session.user.id}-${uuidv4()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ContentLength: buffer.byteLength,
    })
  );

  const newImageUrl = `${PUBLIC_URL}/${key}`;

  // ถ้ารูปเดิมเป็น R2 (ไม่ใช่ Google) ให้ลบทิ้ง
  const existing = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { image: true },
  });
  if (existing?.image && existing.image.startsWith(PUBLIC_URL)) {
    const oldKey = existing.image.replace(`${PUBLIC_URL}/`, "");
    await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: oldKey })).catch(() => {});
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: newImageUrl },
  });

  return NextResponse.json({ imageUrl: newImageUrl });
}
