// Road trips after the exit gate and before arrival, derived from visits + routes. Nothing is
// stored: position and events are a pure function of time, so the map costs no server state and
// the presentation scene stays fixed while trucks still move along their routes.
import { CARRIER_HOME, CUSTOMER_ROUTES, DUMP_LOOP, HAUL_LOOP, inboundPath, pathKm, pointAlong, type CityKey, type LatLng } from "./geo";

export const ROAD_KMH = 62;
export const ROAD_LIMIT_KMH = 80;

export type GeoEventKind = "SPEEDING" | "STOP" | "DEVIATION" | "GPS_LOST" | "DELIVERED" | "ARRIVING";
export interface GeoEvent {
  id: string;
  kind: GeoEventKind;
  visitId: string;
  at: string;
  pos: LatLng;
  value?: number;
}

export interface TripState {
  routeId: string;
  to: CityKey;
  path: LatLng[];
  km: number;
  progress: number;
  pos: LatLng;
  heading: number;
  speedKmh: number;
  etaAt: string;
  delivered: boolean;
  events: GeoEvent[];
}

function hashSeed(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
function rand(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Route for a visit: to the customer for dispatch/transfer, back to the carrier's town for inbound deliveries. */
export function routeFor(operation: string, customerId: string | undefined, carrierId: string) {
  if (operation === "RECEIVE") {
    const home = CARRIER_HOME[carrierId] ?? "yazd";
    const r = Object.values(CUSTOMER_ROUTES).find((x) => x.to === home);
    return r ?? null;
  }
  return customerId ? CUSTOMER_ROUTES[customerId] ?? null : null;
}

/** Trip from the exit gate to the destination, `now` decides where the truck is. */
export function outboundTrip(visitId: string, exitedAt: string, route: { id: string; to: CityKey; path: LatLng[] }, now: number): TripState {
  const km = pathKm(route.path);
  const r = rand(hashSeed(visitId));
  const t0 = new Date(exitedAt).getTime();
  // one optional unscheduled stop adds dwell time to the trip
  const stop = r() < 0.14 ? { p: 0.15 + r() * 0.6, min: 15 + Math.round(r() * 25) } : null;
  const driveMs = (km / ROAD_KMH) * 3600_000;
  const totalMs = driveMs + (stop ? stop.min * 60_000 : 0);
  const elapsed = Math.max(0, now - t0);
  let drivenMs = elapsed;
  let stopped = false;
  if (stop) {
    const stopAt = stop.p * driveMs;
    if (elapsed > stopAt) drivenMs = elapsed < stopAt + stop.min * 60_000 ? stopAt : elapsed - stop.min * 60_000;
    stopped = elapsed > stopAt && elapsed < stopAt + stop.min * 60_000;
  }
  const progress = Math.min(1, drivenMs / driveMs);
  const { at, heading } = pointAlong(route.path, progress);
  const events: GeoEvent[] = [];
  const evAt = (p: number, extraMs = 0) => new Date(t0 + p * driveMs + extraMs).toISOString();
  const add = (kind: GeoEventKind, p: number, value?: number, extraMs = 0) => {
    if (p <= progress + 1e-9) events.push({ id: `${visitId}-${kind}`, kind, visitId, at: evAt(p, extraMs), pos: pointAlong(route.path, p).at, value });
  };
  if (r() < 0.22) add("SPEEDING", 0.08 + r() * 0.7, Math.round(ROAD_LIMIT_KMH + 10 + r() * 22));
  if (stop) add("STOP", stop.p, stop.min);
  if (r() < 0.07) add("DEVIATION", 0.2 + r() * 0.6, Math.round(2 + r() * 6));
  if (r() < 0.05) add("GPS_LOST", 0.3 + r() * 0.5, Math.round(4 + r() * 12));
  if (progress >= 1) add("DELIVERED", 1, undefined, stop ? stop.min * 60_000 : 0);
  return {
    routeId: route.id,
    to: route.to,
    path: route.path,
    km: Math.round(km),
    progress,
    pos: at,
    heading,
    speedKmh: progress >= 1 || stopped ? 0 : Math.round(ROAD_KMH - 8 + r() * 18),
    etaAt: new Date(t0 + totalMs).toISOString(),
    delivered: progress >= 1,
    events,
  };
}

/** A booked truck on its way to the mine; arrives at the slot start. */
export function inboundTrip(bookingId: string, carrierId: string, slotStart: string, now: number): TripState | null {
  const path = inboundPath(carrierId);
  const km = pathKm(path);
  const driveMs = (km / ROAD_KMH) * 3600_000;
  const arrive = new Date(slotStart).getTime();
  const start = arrive - driveMs;
  if (now < start || now > arrive) return null;
  const progress = (now - start) / driveMs;
  const { at, heading } = pointAlong(path, progress);
  const r = rand(hashSeed(bookingId));
  const events: GeoEvent[] = progress > 0.9 ? [{ id: `${bookingId}-ARR`, kind: "ARRIVING", visitId: bookingId, at: new Date(start + 0.9 * driveMs).toISOString(), pos: pointAlong(path, 0.9).at }] : [];
  return { routeId: `IN-${carrierId}`, to: CARRIER_HOME[carrierId] ?? "yazd", path, km: Math.round(km), progress, pos: at, heading, speedKmh: Math.round(ROAD_KMH - 6 + r() * 14), etaAt: new Date(arrive).toISOString(), delivered: false, events };
}

export const GEO_EVENT_LABEL: Record<GeoEventKind, [string, string]> = {
  SPEEDING: ["سرعت غیرمجاز", "Speeding"],
  STOP: ["توقف غیرمجاز", "Unscheduled stop"],
  DEVIATION: ["انحراف از مسیر", "Route deviation"],
  GPS_LOST: ["قطع GPS", "GPS signal lost"],
  DELIVERED: ["تحویل در مقصد", "Delivered"],
  ARRIVING: ["نزدیک معدن", "Approaching the mine"],
};

/** Road truck descriptor from the map view → where it is at `now`. */
export function roadTripAt(r: { id: string; kind: "OUT" | "IN"; t: string; routeKey: string }, now: number): TripState | null {
  if (r.kind === "IN") return inboundTrip(r.id, r.routeKey, r.t, now);
  const route = r.routeKey.startsWith("CARRIER:") ? routeFor("RECEIVE", undefined, r.routeKey.slice(8)) : CUSTOMER_ROUTES[r.routeKey];
  return route ? outboundTrip(r.id, r.t, route, now) : null;
}

/** The mine's own trucks loop between the shovel and the crusher / dump. */
export function fleetAt(f: { loop: "HAUL" | "DUMP"; cycleMin: number; offsetMin: number }, now: number) {
  const phase = (((now / 60_000 + f.offsetMin) % f.cycleMin) + f.cycleMin) % f.cycleMin / f.cycleMin;
  return pointAlong(f.loop === "HAUL" ? HAUL_LOOP : DUMP_LOOP, phase);
}
