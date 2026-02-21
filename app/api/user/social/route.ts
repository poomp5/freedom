import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;

  const user = await prisma.user.findUnique({
    where: { id: auth.session.user.id },
    select: {
      socialIg: true,
      socialFacebook: true,
      socialLine: true,
      socialDiscord: true,
      socialX: true,
    },
  });

  return NextResponse.json(user ?? {});
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const { socialIg, socialFacebook, socialLine, socialDiscord, socialX } = body;

  await prisma.user.update({
    where: { id: auth.session.user.id },
    data: {
      socialIg: socialIg?.trim() || null,
      socialFacebook: socialFacebook?.trim() || null,
      socialLine: socialLine?.trim() || null,
      socialDiscord: socialDiscord?.trim() || null,
      socialX: socialX?.trim() || null,
    },
  });

  return NextResponse.json({ success: true });
}
