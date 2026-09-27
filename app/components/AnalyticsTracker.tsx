"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics-client";

/** Records one page view per client-side navigation. Dashboard and auth pages are skipped. */
export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || /^\/(dashboard|api|signin|signup|onboarding)(\/|$)/.test(pathname)) return;
    trackEvent({ type: "page_view", path: pathname });
  }, [pathname]);

  return null;
}
