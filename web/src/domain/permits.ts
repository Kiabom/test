import type { Permit, PermitLedgerEntry, Vehicle } from "./types";

export function remainingKg(p: Pick<Permit, "allowedKg" | "consumedKg" | "reservedKg">): number {
  return Math.max(0, p.allowedKg - p.consumedKg - p.reservedKg);
}

export function usagePct(p: Pick<Permit, "allowedKg" | "consumedKg" | "reservedKg">) {
  const a = p.allowedKg || 1;
  return {
    consumed: (p.consumedKg / a) * 100,
    reserved: (p.reservedKg / a) * 100,
    remaining: (remainingKg(p) / a) * 100,
  };
}

export type PermitInvalidReason =
  | "PERMIT_MISSING"
  | "PERMIT_NOT_ACTIVE"
  | "PERMIT_NOT_STARTED"
  | "PERMIT_EXPIRED"
  | "VEHICLE_NOT_ALLOWED"
  | "MATERIAL_MISMATCH"
  | "QUOTA_EXHAUSTED"
  | "TRIPS_EXHAUSTED";

export function validatePermit(
  permit: Permit | undefined,
  opts: { vehicle: Pick<Vehicle, "id" | "carrierId">; materialId?: string; now: Date; requiredKg?: number },
): { ok: true } | { ok: false; reason: PermitInvalidReason } {
  if (!permit) return { ok: false, reason: "PERMIT_MISSING" };
  if (permit.status !== "ACTIVE") return { ok: false, reason: "PERMIT_NOT_ACTIVE" };
  if (new Date(permit.validFrom) > opts.now) return { ok: false, reason: "PERMIT_NOT_STARTED" };
  if (new Date(permit.validTo) < opts.now) return { ok: false, reason: "PERMIT_EXPIRED" };
  if (permit.allowedVehicleIds.length && !permit.allowedVehicleIds.includes(opts.vehicle.id))
    return { ok: false, reason: "VEHICLE_NOT_ALLOWED" };
  if (opts.materialId && opts.materialId !== permit.materialId) return { ok: false, reason: "MATERIAL_MISMATCH" };
  if (permit.maxTrips != null && permit.tripsUsed >= permit.maxTrips) return { ok: false, reason: "TRIPS_EXHAUSTED" };
  const need = opts.requiredKg ?? 1;
  if (remainingKg(permit) < need) return { ok: false, reason: "QUOTA_EXHAUSTED" };
  return { ok: true };
}

export class PermitLedger {
  constructor(
    private permits: Map<string, Permit>,
    private ledger: PermitLedgerEntry[],
    private newId: () => string,
    private nowIso: () => string,
  ) {}

  private entriesFor(permitId: string, txId: string) {
    return this.ledger.filter((e) => e.permitId === permitId && e.transactionId === txId);
  }

  /** Commits net kg for a transaction. Idempotent per (permit, tx). Throws when quota would go negative. */
  commit(permitId: string, txId: string, kg: number, by: string, toleranceKg = 0): PermitLedgerEntry {
    const p = this.permits.get(permitId);
    if (!p) throw new Error("PERMIT_MISSING");
    const existing = this.entriesFor(permitId, txId).find((e) => e.kind === "COMMIT");
    const released = this.entriesFor(permitId, txId).some((e) => e.kind === "RELEASE");
    if (existing && !released) return existing;
    const reserved = this.entriesFor(permitId, txId)
      .filter((e) => e.kind === "RESERVE")
      .reduce((s, e) => s + e.kg, 0);
    const available = p.allowedKg - p.consumedKg - (p.reservedKg - reserved) + toleranceKg;
    if (kg > available) throw new Error("QUOTA_EXHAUSTED");
    p.reservedKg = Math.max(0, p.reservedKg - reserved);
    p.consumedKg += kg;
    p.tripsUsed += 1;
    if (p.consumedKg >= p.allowedKg) p.status = "CONSUMED";
    const e: PermitLedgerEntry = { id: this.newId(), permitId, transactionId: txId, kind: "COMMIT", kg, at: this.nowIso(), by };
    this.ledger.push(e);
    return e;
  }

  reserve(permitId: string, txId: string, kg: number, by: string): PermitLedgerEntry {
    const p = this.permits.get(permitId);
    if (!p) throw new Error("PERMIT_MISSING");
    if (kg > remainingKg(p)) throw new Error("QUOTA_EXHAUSTED");
    p.reservedKg += kg;
    const e: PermitLedgerEntry = { id: this.newId(), permitId, transactionId: txId, kind: "RESERVE", kg, at: this.nowIso(), by };
    this.ledger.push(e);
    return e;
  }

  /** Releases a committed amount (void / reversal). Never deletes the original entry. */
  release(permitId: string, txId: string, by: string): PermitLedgerEntry | undefined {
    const p = this.permits.get(permitId);
    if (!p) return;
    const commit = this.entriesFor(permitId, txId).find((e) => e.kind === "COMMIT");
    if (!commit || this.entriesFor(permitId, txId).some((e) => e.kind === "RELEASE")) return;
    p.consumedKg = Math.max(0, p.consumedKg - commit.kg);
    p.tripsUsed = Math.max(0, p.tripsUsed - 1);
    if (p.status === "CONSUMED") p.status = "ACTIVE";
    const e: PermitLedgerEntry = { id: this.newId(), permitId, transactionId: txId, kind: "RELEASE", kg: commit.kg, at: this.nowIso(), by };
    this.ledger.push(e);
    return e;
  }
}
