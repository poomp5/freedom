import { NextRequest, NextResponse, after } from "next/server";
import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";

const eventSchema = z.object({
  type: z.enum(["page_view", "sheet_view", "download"]),
  path: z.string().max(300).optional(),
  sheetId: z.string().max(40).optional(),
  visitorId: z.string().max(64).optional(),
});

const BOT_UA = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse/i;

/** Receives beacons from `AnalyticsTracker` / `trackEvent`. Always 204 — tracking must never break a page. */
export async function POST(request: NextRequest) {
  if (BOT_UA.test(request.headers.get("user-agent") ?? "")) {
    return new NextResponse(null, { status: 204 });
  }

  let body: unknown;
  try {
    // sendBeacon posts text/plain, so parse the raw body.
    body = JSON.parse(await request.text());
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const parsed = eventSchema.safeParse(body);
  if (parsed.success) {
    after(() =>
      prisma.analyticsEvent
        .create({ data: parsed.data })
        .catch((err: unknown) => console.error("[track] failed to record event", err))
    );
  }

  return new NextResponse(null, { status: 204 });
}
