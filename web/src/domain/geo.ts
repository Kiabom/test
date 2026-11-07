// Geography of the Jalalabad iron ore mine (about 38 km NW of Zarand, Kerman province) and its
// customers. SITE_ANCHOR is the mine reference point; the site layout is in local metres from it.
// Client-safe: used by the fleet map, the driver portal map and the server map view.

export type LatLng = [number, number];

export const SITE_ANCHOR: LatLng = [31.0127, 56.4253];
const M_PER_DEG_LAT = 111_320;

/** Local metres (east, north) from the anchor → lat/lng. */
export function local(east: number, north: number): LatLng {
  const [lat0, lng0] = SITE_ANCHOR;
  return [round6(lat0 + north / M_PER_DEG_LAT), round6(lng0 + east / (M_PER_DEG_LAT * Math.cos((lat0 * Math.PI) / 180)))];
}
const round6 = (x: number) => Math.round(x * 1e6) / 1e6;
const ellipse = (cx: number, cy: number, rx: number, ry: number, n = 28): LatLng[] =>
  Array.from({ length: n }, (_, i) => local(cx + rx * Math.cos((2 * Math.PI * i) / n), cy + ry * Math.sin((2 * Math.PI * i) / n)));
const rect = (x1: number, y1: number, x2: number, y2: number): LatLng[] => [local(x1, y1), local(x2, y1), local(x2, y2), local(x1, y2)];

// ---------------- Stations (numbered signs on site) ----------------
export type StationKey = "approach" | "A" | "parking" | "B" | "L-01" | "L-02" | "SH-01" | "unload" | "D" | "C" | "E" | "control" | "crusher" | "plant" | "dump";
export interface Station {
  key: StationKey;
  fa: string;
  en: string;
  at: LatLng;
}
const st = (key: StationKey, fa: string, en: string, east: number, north: number): Station => ({ key, fa, en, at: local(east, north) });
export const STATIONS: Record<StationKey, Station> = {
  approach: st("approach", "ورودی جاده دسترسی", "Access road entrance", -1250, -660),
  A: st("A", "دروازه ورود (لاین A)", "Entry gate (lane A)", -900, -600),
  parking: st("parking", "پارکینگ انتظار", "Waiting parking", -700, -520),
  B: st("B", "باسکول ۱ (لاین B)", "Scale 1 (lane B)", -520, -600),
  "L-01": st("L-01", "نقطه بارگیری L-01", "Loading point L-01", -120, -340),
  "L-02": st("L-02", "نقطه بارگیری L-02", "Loading point L-02", 160, -290),
  "SH-01": st("SH-01", "جبهه کار شاول SH-01", "Shovel face SH-01", 420, 380),
  unload: st("unload", "سکوی تخلیه کارخانه", "Plant unloading bay", -620, 230),
  D: st("D", "اسکنر LiDAR (لاین D)", "LiDAR scanner (lane D)", -260, -470),
  C: st("C", "باسکول ۲ (لاین C)", "Scale 2 (lane C)", -520, -700),
  E: st("E", "دروازه خروج (لاین E)", "Exit gate (lane E)", -900, -720),
  control: st("control", "اتاق کنترل", "Control room", -780, -800),
  crusher: st("crusher", "سنگ‌شکن اولیه", "Primary crusher", -300, 250),
  plant: st("plant", "کارخانه فرآوری", "Processing plant", -760, 360),
  dump: st("dump", "دامپ باطله", "Waste dump", 1700, 700),
};

export const LANE_STATION: Record<string, StationKey> = { A: "A", B: "B", C: "C", D: "D", E: "E" };
export const LOADER_STATION: Record<string, StationKey> = { "EQ-L1": "L-01", "EQ-L2": "L-02", "EQ-L3": "L-01", "EQ-S1": "SH-01", "EQ-E1": "SH-01" };

// ---------------- Site features ----------------
export interface Feature {
  id: string;
  kind: "boundary" | "pit" | "stockpile" | "building" | "parking" | "dump" | "plant" | "scale" | "gate";
  fa: string;
  en: string;
  ring: LatLng[];
}
export const FEATURES: Feature[] = [
  { id: "boundary", kind: "boundary", fa: "محدوده معدن (geofence)", en: "Mine boundary (geofence)", ring: rect(-1050, -950, 2250, 1350) },
  { id: "pit-n", kind: "pit", fa: "پیت شمالی", en: "North pit", ring: ellipse(720, 720, 460, 340) },
  { id: "pit-s", kind: "pit", fa: "پیت جنوبی", en: "South pit", ring: ellipse(1420, -280, 360, 260) },
  { id: "sp1", kind: "stockpile", fa: "دپو ۱", en: "Stockpile 1", ring: ellipse(-120, -250, 120, 70) },
  { id: "sp2", kind: "stockpile", fa: "دپو ۲", en: "Stockpile 2", ring: ellipse(170, -200, 120, 70) },
  { id: "dump", kind: "dump", fa: "دامپ باطله", en: "Waste dump", ring: ellipse(1720, 720, 300, 220) },
  { id: "plant", kind: "plant", fa: "کارخانه فرآوری", en: "Processing plant", ring: rect(-900, 280, -600, 470) },
  { id: "crusher", kind: "building", fa: "سنگ‌شکن", en: "Crusher", ring: rect(-350, 210, -250, 290) },
  { id: "parking", kind: "parking", fa: "پارکینگ انتظار", en: "Waiting parking", ring: rect(-800, -570, -610, -470) },
  { id: "control", kind: "building", fa: "اتاق کنترل", en: "Control room", ring: rect(-830, -840, -730, -770) },
  { id: "scale-b", kind: "scale", fa: "باسکول ۱", en: "Scale 1", ring: rect(-560, -612, -480, -588) },
  { id: "scale-c", kind: "scale", fa: "باسکول ۲", en: "Scale 2", ring: rect(-560, -712, -480, -688) },
];

// ---------------- Internal roads ----------------
const node = (east: number, north: number) => local(east, north);
const J = { yard: node(-300, -420), pitRoad: node(250, 100) };
/** Driving legs between consecutive stations of a truck trip inside the site. */
const LEGS: Record<string, LatLng[]> = {
  "approach>A": [STATIONS.approach.at, STATIONS.A.at],
  "A>parking": [STATIONS.A.at, node(-800, -600), STATIONS.parking.at],
  "parking>B": [STATIONS.parking.at, node(-620, -600), STATIONS.B.at],
  "B>L-01": [STATIONS.B.at, J.yard, STATIONS["L-01"].at],
  "B>L-02": [STATIONS.B.at, J.yard, node(0, -330), STATIONS["L-02"].at],
  "B>SH-01": [STATIONS.B.at, J.yard, node(0, -100), J.pitRoad, STATIONS["SH-01"].at],
  "B>unload": [STATIONS.B.at, node(-600, -300), STATIONS.unload.at],
  "L-01>D": [STATIONS["L-01"].at, J.yard, STATIONS.D.at],
  "L-02>D": [STATIONS["L-02"].at, node(0, -330), J.yard, STATIONS.D.at],
  "SH-01>D": [STATIONS["SH-01"].at, J.pitRoad, node(0, -100), J.yard, STATIONS.D.at],
  "unload>C": [STATIONS.unload.at, node(-600, -300), node(-480, -640), STATIONS.C.at],
  "D>C": [STATIONS.D.at, node(-380, -620), STATIONS.C.at],
  "C>E": [STATIONS.C.at, node(-700, -720), STATIONS.E.at],
  "E>approach": [STATIONS.E.at, STATIONS.approach.at],
};
export function leg(from: StationKey, to: StationKey): LatLng[] {
  return LEGS[`${from}>${to}`] ?? [STATIONS[from].at, STATIONS[to].at];
}
export const INTERNAL_ROADS: LatLng[][] = [
  ...Object.values(LEGS),
  [STATIONS["SH-01"].at, J.pitRoad, STATIONS.crusher.at],
  [local(1150, -250), local(600, -150), STATIONS.crusher.at],
  [STATIONS["SH-01"].at, local(1100, 650), STATIONS.dump.at],
];
/** Internal haul cycle (pit → crusher → pit) used to place the mine's own trucks. */
export const HAUL_LOOP: LatLng[] = [STATIONS["SH-01"].at, J.pitRoad, STATIONS.crusher.at, J.pitRoad, STATIONS["SH-01"].at];
export const DUMP_LOOP: LatLng[] = [STATIONS["SH-01"].at, local(1100, 650), STATIONS.dump.at, local(1100, 650), STATIONS["SH-01"].at];

// ---------------- Region: cities and main roads ----------------
export const CITIES = {
  junction: { fa: "تقاطع جاده زرند–کوهبنان", en: "Zarand–Kuhbanan road junction", at: local(-4200, -900) },
  zarand: { fa: "زرند", en: "Zarand", at: [30.8127, 56.5639] as LatLng },
  kerman: { fa: "کرمان", en: "Kerman", at: [30.2839, 57.0834] as LatLng },
  rafsanjan: { fa: "رفسنجان", en: "Rafsanjan", at: [30.4067, 55.9939] as LatLng },
  sirjan: { fa: "سیرجان", en: "Sirjan", at: [29.452, 55.6814] as LatLng },
  hajiabad: { fa: "حاجی‌آباد", en: "Hajiabad", at: [28.3091, 55.9017] as LatLng },
  bandarabbas: { fa: "بندرعباس", en: "Bandar Abbas", at: [27.1832, 56.2666] as LatLng },
  kuhbanan: { fa: "کوهبنان", en: "Kuhbanan", at: [31.4103, 56.2825] as LatLng },
  behabad: { fa: "بهاباد", en: "Behabad", at: [31.8717, 56.0235] as LatLng },
  bafq: { fa: "بافق", en: "Bafq", at: [31.6035, 55.4025] as LatLng },
  anar: { fa: "انار", en: "Anar", at: [30.8711, 55.2709] as LatLng },
  mehriz: { fa: "مهریز", en: "Mehriz", at: [31.5917, 54.4318] as LatLng },
  yazd: { fa: "یزد", en: "Yazd", at: [31.8974, 54.3569] as LatLng },
  ravar: { fa: "راور", en: "Ravar", at: [31.2656, 56.8055] as LatLng },
} satisfies Record<string, { fa: string; en: string; at: LatLng }>;
export type CityKey = keyof typeof CITIES;

const OUT: LatLng[] = [STATIONS.E.at, STATIONS.approach.at, CITIES.junction.at];
const via = (...keys: CityKey[]): LatLng[] => [...OUT, ...keys.map((k) => CITIES[k].at)];

export interface Route {
  id: string;
  to: CityKey;
  path: LatLng[];
}
/** Delivery route per customer (by the city in master data), through the towns on the main roads. */
export const CUSTOMER_ROUTES: Record<string, Route> = {
  "C-01": { id: "R-ZRD", to: "zarand", path: via("zarand") },
  "C-02": { id: "R-KRM", to: "kerman", path: via("zarand", "kerman") },
  "C-03": { id: "R-SJN", to: "sirjan", path: via("zarand", "rafsanjan", "sirjan") },
  "C-04": { id: "R-RVR", to: "ravar", path: via("zarand", "ravar") },
};
/** Inbound trucks come from their carrier's home town. */
export const CARRIER_HOME: Record<string, CityKey> = { "CR-1": "kerman", "CR-2": "zarand", "CR-3": "rafsanjan", "CR-4": "sirjan", "CR-5": "yazd", "CR-6": "zarand" };
export function inboundPath(carrierId: string): LatLng[] {
  const home = CARRIER_HOME[carrierId] ?? "zarand";
  const out = Object.values(CUSTOMER_ROUTES).find((r) => r.to === home)?.path ?? via("zarand");
  return [...out].reverse();
}

// ---------------- Geometry ----------------
export function distanceKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
export function pathKm(path: LatLng[]): number {
  let km = 0;
  for (let i = 1; i < path.length; i++) km += distanceKm(path[i - 1], path[i]);
  return km;
}
/** Point and heading (degrees from north) at fraction `t` (0..1) of the path length. */
export function pointAlong(path: LatLng[], t: number): { at: LatLng; heading: number } {
  if (path.length === 1) return { at: path[0], heading: 0 };
  const total = pathKm(path);
  let goal = Math.max(0, Math.min(1, t)) * total;
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1];
    const b = path[i];
    const seg = distanceKm(a, b);
    if (goal <= seg || i === path.length - 1) {
      const k = seg ? Math.min(1, goal / seg) : 0;
      return { at: [round6(a[0] + (b[0] - a[0]) * k), round6(a[1] + (b[1] - a[1]) * k)], heading: headingDeg(a, b) };
    }
    goal -= seg;
  }
  return { at: path[path.length - 1], heading: 0 };
}
function headingDeg(a: LatLng, b: LatLng) {
  const y = Math.sin(((b[1] - a[1]) * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180);
  const x = Math.cos((a[0] * Math.PI) / 180) * Math.sin((b[0] * Math.PI) / 180) - Math.sin((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.cos(((b[1] - a[1]) * Math.PI) / 180);
  return (Math.atan2(y, x) * 180) / Math.PI;
}
/** Small deterministic offset (metres) so several trucks at one station don't stack exactly. */
export function jitter(at: LatLng, slot: number, spacingM = 18): LatLng {
  const [lat0] = SITE_ANCHOR;
  const east = ((slot % 4) - 1.5) * spacingM;
  const north = -Math.floor(slot / 4) * spacingM;
  return [round6(at[0] + north / M_PER_DEG_LAT), round6(at[1] + east / (M_PER_DEG_LAT * Math.cos((lat0 * Math.PI) / 180)))];
}
