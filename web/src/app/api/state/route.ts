import { NextResponse } from "next/server";
import { getDb } from "@/server/runtime";
import { liveSnapshotJson } from "@/server/views";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return new NextResponse(liveSnapshotJson(getDb()).json, { headers: { "Content-Type": "application/json" } });
}
