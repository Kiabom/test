import type { Operation, Scale, Vehicle } from "./types";

export const DEFAULT_FRESH_MS = 12_000;

export interface LiveReading {
  weightKg: number;
  stable: boolean;
  ageMs: number;
  online: boolean;
}

export interface CaptureContext {
  reading: LiveReading;
  scale: Pick<Scale, "capacityKg" | "status" | "legalForTrade">;
  positionOk: boolean;
  identityResolved: boolean;
  calibrationValid: boolean;
  freshMs?: number;
}

export type CaptureBlockReason =
  | "INDICATOR_OFFLINE"
  | "UNSTABLE"
  | "STALE"
  | "POSITION"
  | "SCALE_LOCKED"
  | "CALIBRATION_EXPIRED"
  | "IDENTITY"
  | "OVER_CAPACITY"
  | "EMPTY_DECK";

/** Capture guard — weight may only be recorded when stable, fresh and the vehicle is fully on the deck. */
export function captureGuard(ctx: CaptureContext): { allowed: boolean; reasons: CaptureBlockReason[] } {
  const reasons: CaptureBlockReason[] = [];
  const freshMs = ctx.freshMs ?? DEFAULT_FRESH_MS;
  if (!ctx.reading.online) reasons.push("INDICATOR_OFFLINE");
  if (ctx.scale.status === "LOCKED") reasons.push("SCALE_LOCKED");
  if (!ctx.calibrationValid && ctx.scale.legalForTrade) reasons.push("CALIBRATION_EXPIRED");
  if (ctx.reading.online && ctx.reading.weightKg < 500) reasons.push("EMPTY_DECK");
  if (ctx.reading.online && !ctx.reading.stable) reasons.push("UNSTABLE");
  if (ctx.reading.online && ctx.reading.ageMs > freshMs) reasons.push("STALE");
  if (!ctx.positionOk) reasons.push("POSITION");
  if (!ctx.identityResolved) reasons.push("IDENTITY");
  if (ctx.reading.weightKg > ctx.scale.capacityKg) reasons.push("OVER_CAPACITY");
  return { allowed: reasons.length === 0, reasons };
}

/**
 * Gross/tare are decided by operation type, never by capture order alone.
 * DISPATCH / INTERNAL / TRANSFER: truck enters empty → first = tare, second = gross.
 * RECEIVE: truck enters loaded → first = gross, second = tare.
 * If the measured values contradict the expected order, the larger value is used as gross
 * but the result is flagged for review.
 */
export function resolveGrossTare(
  operation: Operation,
  firstKg: number,
  secondKg: number,
): { grossKg: number; tareKg: number; orderAnomaly: boolean } {
  const expectFirstIsTare = operation !== "RECEIVE";
  const gross = expectFirstIsTare ? secondKg : firstKg;
  const tare = expectFirstIsTare ? firstKg : secondKg;
  if (gross >= tare) return { grossKg: gross, tareKg: tare, orderAnomaly: false };
  return { grossKg: Math.max(firstKg, secondKg), tareKg: Math.min(firstKg, secondKg), orderAnomaly: true };
}

export class NegativeNetError extends Error {
  constructor(public grossKg: number, public tareKg: number) {
    super(`Negative net: gross ${grossKg} < tare ${tareKg}`);
  }
}

/** net = gross − tare. abs() is forbidden; negative net is an exception. */
export function computeNet(grossKg: number, tareKg: number): number {
  if (grossKg < tareKg) throw new NegativeNetError(grossKg, tareKg);
  return grossKg - tareKg;
}

export function computeBillable(netKg: number, deductionKg: number): number {
  return Math.max(0, netKg - Math.max(0, deductionKg));
}

export function storedTareUsable(v: Pick<Vehicle, "storedTareKg" | "tareValidUntil">, now: Date): boolean {
  return v.storedTareKg != null && v.tareValidUntil != null && new Date(v.tareValidUntil) > now;
}

/** Round to the scale division for display / ticket (stored raw value is kept untouched). */
export function roundToDivision(kg: number, divisionKg: number): number {
  return Math.round(kg / divisionKg) * divisionKg;
}

export function indicatorFrame(weightKg: number, stable: boolean): string {
  const sign = weightKg < 0 ? "-" : "+";
  const abs = String(Math.abs(Math.round(weightKg))).padStart(7, "0");
  return `${stable ? "ST" : "US"},GS,${sign}${abs}kg`;
}

export function grossOverLimit(grossKg: number, limits: (number | undefined)[]): { over: boolean; limitKg?: number } {
  const valid = limits.filter((x): x is number => typeof x === "number" && x > 0);
  if (!valid.length) return { over: false };
  const limitKg = Math.min(...valid);
  return { over: grossKg > limitKg, limitKg };
}
