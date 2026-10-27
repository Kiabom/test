import { NextResponse } from "next/server";
import { getDb } from "@/server/runtime";
import { dashboard, driverView, verifyView, visitDetail } from "@/server/views";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request, ctx: { params: Promise<{ name: string }> }) {
  const { name } = await ctx.params;
  const url = new URL(req.url);
  const d = getDb();
  const id = url.searchParams.get("id") ?? "";
  switch (name) {
    case "dashboard":
      return NextResponse.json(dashboard(d, url.searchParams.get("range") === "7d" ? "7d" : "today"));
    case "visit": {
      const v = visitDetail(d, id);
      return v ? NextResponse.json(v) : NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }
    case "tx": {
      const tx = d.transactions.find((t) => t.id === id || t.ticketNo === id);
      const v = tx ? visitDetail(d, tx.visitId) : null;
      return v ? NextResponse.json({ ...v, focusTxId: tx!.id }) : NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }
    case "driver": {
      const v = driverView(d, id);
      return v ? NextResponse.json(v) : NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }
    case "verify": {
      const v = verifyView(d, id);
      return v ? NextResponse.json(v) : NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }
  }
  return NextResponse.json({ error: "UNKNOWN_VIEW" }, { status: 404 });
}
