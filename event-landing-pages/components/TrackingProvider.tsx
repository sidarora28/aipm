"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/tracking";
import { track } from "@/lib/analytics";

/**
 * Captures UTM/attribution on first paint and fires a page_view.
 * Drop once near the top of every page (it renders nothing).
 */
export function TrackingProvider({ page }: { page: string }) {
  useEffect(() => {
    const attr = captureAttribution();
    track("page_view", { page, ...attr });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
