import { describe, expect, it } from "vitest";
import { appendAudit, verifyChain } from "./audit";
import { guidanceFor } from "./driverGuidance";
import { evaluateGate, resolveIdentity, type GateContext } from "./gate";
import { computeKpis, median, percentile } from "./kpi";
import { PermitLedger, remainingKg, validatePermit } from "./permits";
import { formatPlate, normalizePlate, parsePlate } from "./plate";
import type { AuditEvent, Permit, PermitLedgerEntry, Visit } from "./types";
import { captureGuard, computeNet, NegativeNetError, resolveGrossTare, storedTareUsable } from "./weighing";
import { assertTransition, TX_TRANSITIONS, EXIT_PERMIT_TRANSITIONS, TransitionError } from "./workflow";

const permit = (over: Partial<Permit> = {}): Permit => ({
  id: "P1", permitNo: "SO-1", type: "SALE", customerId: "C", materialId: "M", originId: "O", destinationId: "D",
  allowedKg: 100_000, reservedKg: 0, consumedKg: 0, tripsUsed: 0, allowedVehicleIds: [],
  validFrom: new Date(Date.now() - 864e5).toISOString(), validTo: new Date(Date.now() + 864e5).toISOString(),
  status: "ACTIVE", issuer: "x", documentHash: "h", ...over,
});

describe("weighing", () => {
  it("dispatch: first = tare, second = gross", () => {
    expect(resolveGrossTare("DISPATCH", 16_000, 44_000)).toEqual({ grossKg: 44_000, tareKg: 16_000, orderAnomaly: false });
  });
  it("receive: first = gross, second = tare", () => {
    expect(resolveGrossTare("RECEIVE", 44_000, 16_000)).toEqual({ grossKg: 44_000, tareKg: 16_000, orderAnomaly: false });
  });
  it("flags reversed order instead of silently using abs()", () => {
    expect(resolveGrossTare("DISPATCH", 44_000, 16_000).orderAnomaly).toBe(true);
  });
  it("negative net throws", () => {
    expect(() => computeNet(10_000, 12_000)).toThrow(NegativeNetError);
    expect(computeNet(44_000, 16_000)).toBe(28_000);
  });
  it("capture guard blocks unstable, stale, off-deck and expired calibration", () => {
    const base = { reading: { weightKg: 30_000, stable: true, ageMs: 500, online: true }, scale: { capacityKg: 80_000, status: "READY" as const, legalForTrade: true }, positionOk: true, identityResolved: true, calibrationValid: true };
    expect(captureGuard(base).allowed).toBe(true);
    expect(captureGuard({ ...base, reading: { ...base.reading, stable: false } }).reasons).toContain("UNSTABLE");
    expect(captureGuard({ ...base, reading: { ...base.reading, ageMs: 20_000 } }).reasons).toContain("STALE");
    expect(captureGuard({ ...base, positionOk: false }).reasons).toContain("POSITION");
    expect(captureGuard({ ...base, calibrationValid: false }).reasons).toContain("CALIBRATION_EXPIRED");
    expect(captureGuard({ ...base, reading: { ...base.reading, online: false } }).reasons).toContain("INDICATOR_OFFLINE");
  });
  it("stored tare must be valid", () => {
    expect(storedTareUsable({ storedTareKg: 16_000, tareValidUntil: new Date(Date.now() + 1000).toISOString() }, new Date())).toBe(true);
    expect(storedTareUsable({ storedTareKg: 16_000, tareValidUntil: new Date(Date.now() - 1000).toISOString() }, new Date())).toBe(false);
  });
});

describe("permits ledger", () => {
  const setup = (p = permit()) => {
    const map = new Map([[p.id, p]]);
    const ledger: PermitLedgerEntry[] = [];
    let n = 0;
    return { p, ledger, l: new PermitLedger(map, ledger, () => `E${++n}`, () => new Date().toISOString()) };
  };
  it("commits atomically and never goes negative", () => {
    const { p, l } = setup(permit({ allowedKg: 50_000 }));
    l.commit("P1", "T1", 30_000, "u");
    expect(remainingKg(p)).toBe(20_000);
    expect(() => l.commit("P1", "T2", 25_000, "u")).toThrow("QUOTA_EXHAUSTED");
    expect(remainingKg(p)).toBe(20_000);
  });
  it("commit is idempotent per transaction", () => {
    const { p, l, ledger } = setup();
    l.commit("P1", "T1", 10_000, "u");
    l.commit("P1", "T1", 10_000, "u");
    expect(p.consumedKg).toBe(10_000);
    expect(ledger).toHaveLength(1);
  });
  it("release restores quota without deleting history", () => {
    const { p, l, ledger } = setup();
    l.commit("P1", "T1", 10_000, "u");
    l.release("P1", "T1", "u");
    expect(p.consumedKg).toBe(0);
    expect(ledger.map((e) => e.kind)).toEqual(["COMMIT", "RELEASE"]);
  });
  it("validates expiry, vehicle and material", () => {
    const v = { id: "V1", carrierId: "C1" };
    expect(validatePermit(permit({ validTo: new Date(Date.now() - 1).toISOString() }), { vehicle: v, now: new Date() })).toEqual({ ok: false, reason: "PERMIT_EXPIRED" });
    expect(validatePermit(permit({ allowedVehicleIds: ["V2"] }), { vehicle: v, now: new Date() })).toEqual({ ok: false, reason: "VEHICLE_NOT_ALLOWED" });
    expect(validatePermit(permit(), { vehicle: v, now: new Date(), materialId: "X" })).toEqual({ ok: false, reason: "MATERIAL_MISMATCH" });
    expect(validatePermit(permit(), { vehicle: v, now: new Date() })).toEqual({ ok: true });
  });
});

describe("gate decision", () => {
  const ctx = (over: Partial<GateContext> = {}): GateContext => ({
    direction: "IN", safety: { emergencyStop: false, laneClear: true, interlockFault: false }, identity: "MATCH",
    vehicleBlocked: false, driverBlocked: false, documentsExpired: false, hasOpenVisit: false, permit: { ok: true }, openCriticalAlerts: 0, ...over,
  });
  it("passes a clean entry", () => expect(evaluateGate(ctx()).decision).toBe("PASS"));
  it("mismatch → REVIEW, never PASS", () => expect(evaluateGate(ctx({ identity: "MISMATCH" }))).toMatchObject({ decision: "REVIEW", code: "IDENTITY_MISMATCH" }));
  it("unknown → HOLD", () => expect(evaluateGate(ctx({ identity: "UNKNOWN" })).decision).toBe("HOLD"));
  it("low confidence without RFID → REVIEW", () => expect(evaluateGate(ctx({ identity: "UNKNOWN", lowConfidence: true })).code).toBe("LOW_ANPR_CONFIDENCE"));
  it("expired permit → BLOCK", () => expect(evaluateGate(ctx({ permit: { ok: false, reason: "PERMIT_EXPIRED" } }))).toMatchObject({ decision: "BLOCK" }));
  it("safety first", () => expect(evaluateGate(ctx({ identity: "MISMATCH", safety: { emergencyStop: true, laneClear: true, interlockFault: false } })).code).toBe("EMERGENCY_STOP"));
  it("exit requires an exit permit", () => expect(evaluateGate(ctx({ direction: "OUT", allTransactionsApproved: true, exitPermitApproved: false, evidenceComplete: true })).code).toBe("NO_EXIT_PERMIT"));
  it("identity fusion", () => {
    expect(resolveIdentity({ anprVehicleId: "A", anprConfidence: 0.95, rfidVehicleId: "A", minConfidence: 0.85 })).toBe("MATCH");
    expect(resolveIdentity({ anprVehicleId: "A", anprConfidence: 0.95, rfidVehicleId: "B", minConfidence: 0.85 })).toBe("MISMATCH");
    expect(resolveIdentity({ anprVehicleId: "A", anprConfidence: 0.5, minConfidence: 0.85 })).toBe("UNKNOWN");
  });
});

describe("workflow", () => {
  it("rejects illegal transitions", () => {
    expect(() => assertTransition(TX_TRANSITIONS, "DRAFT", "APPROVED")).toThrow(TransitionError);
    expect(() => assertTransition(EXIT_PERMIT_TRANSITIONS, "CONSUMED", "APPROVED")).toThrow(TransitionError);
  });
});

describe("audit chain", () => {
  it("detects tampering", () => {
    const chain: AuditEvent[] = [];
    for (let i = 0; i < 5; i++) appendAudit(chain, { id: `A${i}`, at: new Date().toISOString(), actorId: "u", actorType: "HUMAN", action: "x", entityType: "T", entityId: String(i), data: { kg: i } });
    expect(verifyChain(chain).ok).toBe(true);
    chain[2].data = { kg: 999 };
    expect(verifyChain(chain)).toMatchObject({ ok: false, seq: 3 });
  });
});

describe("plates, kpis, guidance", () => {
  it("parses and formats Iranian plates", () => {
    const p = { d2: "12", letter: "ب", d3: "345", region: "67" };
    expect(normalizePlate(p)).toBe("12ب345-67");
    expect(parsePlate("12ب345-67")).toEqual(p);
    expect(formatPlate(p)).toBe("۱۲ ب ۳۴۵ - ۶۷");
  });
  it("kpis return null when there is no data", () => {
    const k = computeKpis([], []);
    expect(k.netApprovedT).toBeNull();
    expect(k.turnaroundP50).toBeNull();
    expect(median([3, 1, 2])).toBe(2);
    expect(percentile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 90)).toBe(9);
  });
  it("guidance tells the driver to move forward when off deck", () => {
    const v = { state: "ON_SCALE_1", laneCode: "B", transactionIds: [] } as unknown as Visit;
    expect(guidanceFor(v, { code: "B", kind: "SCALE", visitId: "x", phase: "POSITION_BAD", barrier: "CLOSED", barrierAck: true, light: "RED" }).code).toBe("POSITION_BAD");
    expect(guidanceFor(undefined, { code: "B", kind: "SCALE", barrier: "CLOSED", barrierAck: true, light: "GREEN" }).code).toBe("SCALE_FREE");
  });
});
