"use client";

export type TrackEvent = {
  type: "page_view" | "sheet_view" | "download";
  path?: string;
  sheetId?: string;
};

const VISITOR_KEY = "freedom-visitor-id";

function getVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return undefined;
  }
}

/** Fire-and-forget; uses sendBeacon so it survives navigating away (e.g. opening a PDF). */
export function trackEvent(event: TrackEvent) {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({ ...event, visitorId: getVisitorId() });
  try {
    if (navigator.sendBeacon?.("/api/track", body)) return;
  } catch {
    // fall through to fetch
  }
  fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
}
