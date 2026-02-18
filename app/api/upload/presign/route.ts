import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserRole } from "@/lib/roles";
import { generatePresignedUploadUrl } from "@/lib/r2";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = getUserRole(session.user as Record<string, unknown>);
  if (role !== "publisher" && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { fileName, contentType, fileSize } = body;

  if (!fileName || !contentType || !fileSize) {
    return NextResponse.json(
      { error: "กรุณาระบุข้อมูลไฟล์ให้ครบ" },
      { status: 400 }
    );
  }

  if (contentType !== "application/pdf") {
    return NextResponse.json(
      { error: "รองรับเฉพาะไฟล์ PDF เท่านั้น" },
      { status: 400 }
    );
  }

  if (fileSize > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "ไฟล์มีขนาดเกิน 25MB" },
      { status: 400 }
    );
  }

  const result = await generatePresignedUploadUrl(fileName, contentType, fileSize);
  return NextResponse.json(result);
}
