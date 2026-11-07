import { NextResponse } from "next/server";
import { getDb } from "@/server/runtime";
import type { CollectionName } from "@/server/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED: CollectionName[] = [
  "sites", "lanes", "scales", "devices", "vehicles", "drivers", "carriers", "customers", "materials", "locations", "shifts", "users", "equipment",
  "contracts", "permits", "ledger", "bookings", "visits", "transactions", "weighEvents", "evidence", "plateReads", "rfidReads", "gateEvents",
  "exitPermits", "lidarScans", "uvssScans", "payloadEvents", "fleetCycles", "rules", "alerts", "fraudCases", "calibrations", "loadCells", "audit", "outbox",
];
const MASTERS: CollectionName[] = ["sites", "lanes", "scales", "devices", "vehicles", "drivers", "carriers", "customers", "materials", "locations", "shifts", "users", "equipment", "permits", "contracts", "rules", "calibrations"];

export async function GET(req: Request, ctx: { params: Promise<{ collection: string }> }) {
  const { collection } = await ctx.params;
  const d = getDb();
  if (collection === "masters") {
    return NextResponse.json({ revision: d.revision, ...Object.fromEntries(MASTERS.map((m) => [m, d[m]])) });
  }
  if (!ALLOWED.includes(collection as CollectionName)) return NextResponse.json({ error: "UNKNOWN_COLLECTION" }, { status: 404 });
  const url = new URL(req.url);
  const src = d[collection as CollectionName] as unknown as Record<string, unknown>[];
  const filters = [...url.searchParams.entries()].filter(([k]) => !["limit", "offset", "order", "q", "since", "until"].includes(k));
  const since = url.searchParams.get("since");
  const until = url.searchParams.get("until");
  const q = url.searchParams.get("q")?.trim();
  const asc = url.searchParams.get("order") === "asc";
  const offset = Number(url.searchParams.get("offset") ?? 0);
  const limit = Math.min(5000, Number(url.searchParams.get("limit") ?? 200));
  const match = (x: Record<string, unknown>) => {
    for (const [k, v] of filters) if (String(x[k]) !== v) return false;
    const at = String(x.at ?? x.createdAt ?? x.openedAt ?? x.arrivedAt ?? x.capturedAt ?? "");
    if (since && at < since) return false;
    if (until && at >= until) return false;
    if (q && !JSON.stringify(x).includes(q)) return false;
    return true;
  };
  // walk from the newest end without copying the collection; only the requested page is materialized
  const items: Record<string, unknown>[] = [];
  let total = 0;
  for (let n = 0; n < src.length; n++) {
    const x = src[asc ? n : src.length - 1 - n];
    if (!match(x)) continue;
    if (total >= offset && items.length < limit) items.push(x);
    total++;
  }
  return NextResponse.json({ revision: d.revision, total, items });
}
