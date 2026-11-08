import type { Transaction } from "./types";

// ---------------------------------------------------------------- Jalali calendar (site time, UTC+03:30)
// Arithmetic conversion (Borkowski / jalaali-js); independent of the machine's time zone.
const div = (a: number, b: number) => ~~(a / b);
const mod = (a: number, b: number) => a - ~~(a / b) * b;
const BREAKS = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];

function jalCal(jy: number) {
  const gy = jy + 621;
  let leapJ = -14;
  let jp = BREAKS[0];
  let jump = 0;
  for (let i = 1; i < BREAKS.length; i++) {
    const jm = BREAKS[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }
  let n = jy - jp;
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;
  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;
  return { leap, gy, march };
}
function g2d(gy: number, gm: number, gd: number) {
  const d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4) + div(153 * mod(gm + 9, 12) + 2, 5) + gd - 34840408;
  return d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
}
function d2g(jdn: number) {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}
function j2d(jy: number, jm: number, jd: number) {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}
function d2j(jdn: number) {
  const gy = d2g(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy);
  let k = jdn - g2d(gy, 3, r.march);
  if (k >= 0) {
    if (k <= 185) return { jy, jm: 1 + div(k, 31), jd: mod(k, 31) + 1 };
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  return { jy, jm: 7 + div(k, 30), jd: mod(k, 30) + 1 };
}

export interface JDate {
  jy: number;
  jm: number;
  jd: number;
}
const SITE_OFFSET = 210 * 60_000;
const DAY = 86_400_000;

export const jMonthLength = (jy: number, jm: number) => (jm <= 6 ? 31 : jm <= 11 ? 30 : jalCal(jy).leap === 0 ? 30 : 29);
export const J_MONTHS = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];

/** Jalali calendar date of an instant, in site time. */
export function toJDate(ms: number): JDate {
  const d = new Date(ms + SITE_OFFSET);
  return d2j(g2d(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()));
}
/** Instant of 00:00 site time on a Jalali date (plus optional minutes into the day). */
export function jDayStart(j: JDate, minutes = 0): number {
  const g = d2g(j2d(j.jy, j.jm, j.jd));
  return Date.UTC(g.gy, g.gm - 1, g.gd) - SITE_OFFSET + minutes * 60_000;
}
export const jKey = (j: JDate) => `${j.jy}/${String(j.jm).padStart(2, "0")}/${String(j.jd).padStart(2, "0")}`;

// ---------------------------------------------------------------- filter
export type RangePreset = "today" | "yesterday" | "7d" | "week" | "month" | "custom";

export interface ReportFilter {
  /** inclusive start / exclusive end, ISO */
  from: string;
  to: string;
  preset: RangePreset;
  shifts: string[];
  operations: string[];
  customers: string[];
  materials: string[];
  carriers: string[];
  vehicles: string[];
  drivers: string[];
  permits: string[];
  states: string[];
  origins: string[];
  destinations: string[];
  method: "" | "MANUAL" | "STORED";
  /** tons */
  netMin?: number;
  netMax?: number;
}
export const LIST_KEYS = ["shifts", "operations", "customers", "materials", "carriers", "vehicles", "drivers", "permits", "states", "origins", "destinations"] as const;
export type ListKey = (typeof LIST_KEYS)[number];

export function presetRange(preset: RangePreset, now: number): { from: string; to: string } {
  const today = toJDate(now);
  const start = jDayStart(today);
  const end = start + DAY;
  const iso = (ms: number) => new Date(ms).toISOString();
  switch (preset) {
    case "yesterday":
      return { from: iso(start - DAY), to: iso(start) };
    case "7d":
      return { from: iso(start - 6 * DAY), to: iso(end) };
    case "week": {
      // Persian week starts on Saturday
      const dow = new Date(now + SITE_OFFSET).getUTCDay(); // 0 = Sunday … 6 = Saturday
      return { from: iso(start - ((dow + 1) % 7) * DAY), to: iso(end) };
    }
    case "month":
      return { from: iso(jDayStart({ ...today, jd: 1 })), to: iso(end) };
    default:
      return { from: iso(start), to: iso(end) };
  }
}

export function emptyFilter(now: number, preset: RangePreset = "today"): ReportFilter {
  return { ...presetRange(preset, now), preset, shifts: [], operations: [], customers: [], materials: [], carriers: [], vehicles: [], drivers: [], permits: [], states: [], origins: [], destinations: [], method: "" };
}

export const txTime = (t: Pick<Transaction, "approvedAt" | "createdAt">) => t.approvedAt ?? t.createdAt;

export function applyFilter(txs: Transaction[], f: ReportFilter, ctx: { manualTxIds?: Set<string> } = {}): Transaction[] {
  const has = (list: string[], v: string | undefined) => list.length === 0 || (v !== undefined && list.includes(v));
  return txs.filter((t) => {
    const at = txTime(t);
    if (at < f.from || at >= f.to) return false;
    if (!has(f.shifts, t.shiftCode) || !has(f.operations, t.operation) || !has(f.customers, t.customerId) || !has(f.materials, t.materialId)) return false;
    if (!has(f.carriers, t.carrierId) || !has(f.vehicles, t.vehicleId) || !has(f.drivers, t.driverId) || !has(f.permits, t.permitId) || !has(f.states, t.state)) return false;
    if (!has(f.origins, t.originId) || !has(f.destinations, t.destinationId)) return false;
    if (f.method === "MANUAL" && !ctx.manualTxIds?.has(t.id)) return false;
    if (f.method === "STORED" && t.tareSource !== "STORED") return false;
    const netT = (t.netKg ?? 0) / 1000;
    if (f.netMin != null && netT < f.netMin) return false;
    if (f.netMax != null && netT > f.netMax) return false;
    return true;
  });
}

export const activeCount = (f: ReportFilter) => LIST_KEYS.reduce((a, k) => a + (f[k].length ? 1 : 0), 0) + (f.method ? 1 : 0) + (f.netMin != null || f.netMax != null ? 1 : 0);

// ---------------------------------------------------------------- URL encoding (print page, links)
const SHORT: Record<ListKey, string> = { shifts: "sh", operations: "op", customers: "cu", materials: "ma", carriers: "ca", vehicles: "ve", drivers: "dr", permits: "pe", states: "st", origins: "or", destinations: "de" };

export function filterToQuery(f: ReportFilter): URLSearchParams {
  const q = new URLSearchParams();
  q.set("from", f.from);
  q.set("to", f.to);
  q.set("preset", f.preset);
  for (const k of LIST_KEYS) if (f[k].length) q.set(SHORT[k], f[k].join(","));
  if (f.method) q.set("me", f.method);
  if (f.netMin != null) q.set("nmin", String(f.netMin));
  if (f.netMax != null) q.set("nmax", String(f.netMax));
  return q;
}

export function queryToFilter(q: URLSearchParams, now: number): ReportFilter {
  const preset = (q.get("preset") as RangePreset) || "today";
  const f = emptyFilter(now, preset === "custom" ? "today" : preset);
  f.preset = preset;
  if (q.get("from")) f.from = q.get("from")!;
  if (q.get("to")) f.to = q.get("to")!;
  for (const k of LIST_KEYS) {
    const v = q.get(SHORT[k]);
    if (v) f[k] = v.split(",").filter(Boolean);
  }
  const me = q.get("me");
  if (me === "MANUAL" || me === "STORED") f.method = me;
  if (q.get("nmin")) f.netMin = Number(q.get("nmin"));
  if (q.get("nmax")) f.netMax = Number(q.get("nmax"));
  return f;
}

/** Short stable code for a filter, used as the printed document number. */
export function filterCode(f: ReportFilter, tpl: string): string {
  const s = `${tpl}|${filterToQuery(f).toString()}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0).toString(36).toUpperCase().padStart(7, "0").slice(0, 7);
}
