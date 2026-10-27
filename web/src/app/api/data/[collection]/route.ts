import { NextResponse } from "next/server";
import { getDb } from "@/server/runtime";
import type { CollectionName, DB } from "@/server/store";

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
  let items = [...(d[collection as CollectionName] as DB[CollectionName])] as unknown as Record<string, unknown>[];
  for (const [k, v] of url.searchParams.entries()) {
    if (["limit", "offset", "order", "q", "since"].includes(k)) continue;
    items = items.filter((x) => String(x[k]) === v);
  }
  const since = url.searchParams.get("since");
  if (since) items = items.filter((x) => String(x.at ?? x.createdAt ?? x.openedAt ?? x.arrivedAt ?? x.capturedAt ?? "") >= since);
  const q = url.searchParams.get("q")?.trim();
  if (q) items = items.filter((x) => JSON.stringify(x).includes(q));
  if (url.searchParams.get("order") !== "asc") items.reverse();
  const total = items.length;
  const offset = Number(url.searchParams.get("offset") ?? 0);
  const limit = Math.min(5000, Number(url.searchParams.get("limit") ?? 200));
  return NextResponse.json({ revision: d.revision, total, items: items.slice(offset, offset + limit) });
}
