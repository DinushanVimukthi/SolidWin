import { NextResponse } from "next/server";
import { analyticsRepository } from "@/lib/dal/analytics-repository";
import type { AnalyticsEventType } from "@/lib/dal/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, page, details } = body;

    if (!type || !page) {
      return NextResponse.json({ ok: false, error: "Missing type or page" }, { status: 400 });
    }

    await analyticsRepository.trackEvent(type as AnalyticsEventType, page, details);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error tracking event";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
