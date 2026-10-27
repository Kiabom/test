import { NextResponse } from "next/server";
import { getDb } from "@/server/runtime";
import { verifyView } from "@/server/views";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const v = verifyView(getDb(), code);
  return v ? NextResponse.json(v) : NextResponse.json({ status: "INVALID" }, { status: 404 });
}
