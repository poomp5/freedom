import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
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
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { socialIg, socialFacebook, socialLine, socialDiscord, socialX } = body;

  await prisma.user.update({
    where: { id: session.user.id },
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
