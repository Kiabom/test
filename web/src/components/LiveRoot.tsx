"use client";
import type { ReactNode } from "react";
import { useLiveConnection } from "@/lib/live";

/** Opens the shared SSE stream for standalone screens (displays, kiosk, driver portal). */
export function LiveRoot({ children }: { children: ReactNode }) {
  useLiveConnection();
  return <>{children}</>;
}
