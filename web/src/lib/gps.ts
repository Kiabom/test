"use client";
import { useEffect, useState } from "react";
import type { LatLng } from "@/domain/geo";

export type GpsState = { pos: LatLng | null; accuracy?: number; error?: "INSECURE" | "DENIED" | "UNAVAILABLE" };

/** Live phone position. Browsers only allow it on HTTPS or localhost. */
export function useGps(enabled: boolean): GpsState {
  const [st, setSt] = useState<GpsState>({ pos: null });
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setSt({ pos: null, error: "UNAVAILABLE" });
      return;
    }
    if (!window.isSecureContext) {
      setSt({ pos: null, error: "INSECURE" });
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (p) => setSt({ pos: [p.coords.latitude, p.coords.longitude], accuracy: p.coords.accuracy }),
      (e) => setSt({ pos: null, error: e.code === e.PERMISSION_DENIED ? "DENIED" : "UNAVAILABLE" }),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [enabled]);
  return st;
}
