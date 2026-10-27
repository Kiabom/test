import { createHash, createHmac } from "node:crypto";
import type { AuditEvent } from "./types";

const DEMO_KEY = "tozinnegar-demo-audit-key";

export function sha256(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

function payloadOf(e: Omit<AuditEvent, "hash" | "prevHash">): string {
  return JSON.stringify([e.seq, e.at, e.actorId, e.actorType, e.action, e.entityType, e.entityId, e.reason ?? null, e.data ?? null]);
}

export function chainHash(prevHash: string, e: Omit<AuditEvent, "hash" | "prevHash">, key = DEMO_KEY): string {
  return createHmac("sha256", key).update(prevHash + payloadOf(e)).digest("hex");
}

export function appendAudit(chain: AuditEvent[], e: Omit<AuditEvent, "hash" | "prevHash" | "seq">): AuditEvent {
  const prev = chain[chain.length - 1];
  const prevHash = prev ? prev.hash : "GENESIS";
  const seq = prev ? prev.seq + 1 : 1;
  const base = { ...e, seq };
  const full: AuditEvent = { ...base, prevHash, hash: chainHash(prevHash, base) };
  chain.push(full);
  return full;
}

export function verifyChain(chain: AuditEvent[]): { ok: true; checked: number } | { ok: false; brokenAt: number; seq: number } {
  let prevHash = "GENESIS";
  for (let i = 0; i < chain.length; i++) {
    const e = chain[i];
    const { hash, prevHash: storedPrev, ...rest } = e;
    if (storedPrev !== prevHash || chainHash(prevHash, rest) !== hash) return { ok: false, brokenAt: i, seq: e.seq };
    prevHash = hash;
  }
  return { ok: true, checked: chain.length };
}
