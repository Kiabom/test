// Turn-by-turn navigation hand-off to the driver's own map app.
import type { LatLng } from "@/domain/geo";

export interface NavLinks {
  /** Android: opens the system chooser with every installed navigation app (Neshan, Balad, Google Maps, Waze…). */
  geo: string;
  google: string;
  waze: string;
  apple: string;
}

export function navLinks([lat, lng]: LatLng, label: string): NavLinks {
  return {
    geo: `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(label)})`,
    google: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`,
    waze: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
    apple: `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`,
  };
}

/** Best default for this device: Android chooser, Apple Maps on iOS, Google Maps elsewhere. */
export function primaryNavUrl(at: LatLng, label: string): string {
  const l = navLinks(at, label);
  if (typeof navigator === "undefined") return l.google;
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return l.geo;
  if (/iPhone|iPad|iPod/i.test(ua)) return l.apple;
  return l.google;
}

export const fmtLatLng = ([lat, lng]: LatLng) => `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
