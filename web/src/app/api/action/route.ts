import { NextResponse } from "next/server";
import { dispatch } from "@/server/actions";
import { OpError } from "@/server/ops";
import { getDb } from "@/server/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const seen = new Map<string, unknown>();

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { type?: string; payload?: Record<string, unknown>; idempotencyKey?: string };
  const actor = req.headers.get("x-demo-user") || "public";
  if (!body.type) return NextResponse.json({ ok: false, error: "BAD_REQUEST" }, { status: 400 });
  if (body.idempotencyKey && seen.has(body.idempotencyKey)) return NextResponse.json({ ok: true, duplicate: true, result: seen.get(body.idempotencyKey) });
  try {
    const result = dispatch(getDb(), body.type, body.payload ?? {}, actor);
    if (body.idempotencyKey) {
      seen.set(body.idempotencyKey, result);
      if (seen.size > 500) seen.delete(seen.keys().next().value as string);
    }
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    const code = e instanceof OpError ? e.code : "ERROR";
    const status = code === "FORBIDDEN" ? 403 : e instanceof OpError ? 409 : 500;
    if (!(e instanceof OpError)) console.error(e);
    return NextResponse.json({ ok: false, error: code, message: (e as Error).message }, { status });
  }
}
