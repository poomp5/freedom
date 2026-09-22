import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

/** PromptPay accepts a 10-digit phone number or a 13-digit national ID. */
function normalizePromptPay(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 0) return null;
  if (digits.length !== 10 && digits.length !== 13) return null;
  return digits;
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { donatePromptPay: true },
  });

  return NextResponse.json(user ?? {});
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const raw = body?.donatePromptPay;

  // An empty value clears the number (turns donations off).
  const isClearing = typeof raw === "string" && raw.trim() === "";
  const donatePromptPay = isClearing ? null : normalizePromptPay(raw);

  if (!isClearing && donatePromptPay === null) {
    return NextResponse.json(
      { error: "หมายเลขพร้อมเพย์ต้องเป็นเบอร์โทร 10 หลัก หรือเลขบัตรประชาชน 13 หลัก" },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { donatePromptPay },
  });

  return NextResponse.json({ success: true, donatePromptPay });
}
