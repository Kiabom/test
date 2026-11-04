import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { verifyChain } from "@/domain/audit";
import { buildSeed } from "./seed";
import { stageShowcase } from "./showcase";
import { pruneOld, setScene, tick } from "./sim";
import type { DB } from "./store";

let d: DB;
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-04T09:30:00Z"));
  d = buildSeed();
});
afterEach(() => vi.useRealTimers());

const lanes = (x: DB) => Object.fromEntries(x.live.lanes.map((l) => [l.code, `${l.phase}:${l.visitId ?? "-"}`]));

describe("presentation scene", () => {
  it("parks every lane at a point that waits for a person", () => {
    const refs = stageShowcase(d);
    const ph = Object.fromEntries(d.live.lanes.map((l) => [l.code, l.phase]));
    expect(ph).toEqual({ A: "HELD", B: "STABLE", C: "STABLE", D: "SCANNING", E: "AWAIT_QR" });
    expect(refs.loading).toHaveLength(3);
    expect(refs.queued).toHaveLength(3);
    expect(refs.exited).toHaveLength(3);
    expect(d.visits.find((v) => v.id === refs.overdrawVisit)?.state).toBe("HOLD");
    expect(d.alerts.some((a) => a.ruleCode === "R36" && a.visitId === refs.qrReuseVisit)).toBe(true);
    expect(d.alerts.some((a) => a.ruleCode === "R05" && a.visitId === refs.gateHold)).toBe(true);
    expect(verifyChain(d.audit).ok).toBe(true);
  });

  it("is identical every time it is built", () => {
    stageShowcase(d);
    const a = { lanes: lanes(d), visits: d.visits.slice(-20).map((v) => `${v.id}:${v.vehicleId}:${v.state}`) };
    const d2 = buildSeed();
    stageShowcase(d2);
    expect({ lanes: lanes(d2), visits: d2.visits.slice(-20).map((v) => `${v.id}:${v.vehicleId}:${v.state}`) }).toEqual(a);
  });

  it("does not change on its own", () => {
    stageShowcase(d);
    const before = { lanes: lanes(d), visits: d.visits.length, tx: d.transactions.length, ev: d.evidence.length, audit: d.audit.length, rev: d.revision };
    for (let i = 0; i < 300; i++) {
      vi.advanceTimersByTime(1000);
      tick(d);
    }
    expect({ lanes: lanes(d), visits: d.visits.length, tx: d.transactions.length, ev: d.evidence.length, audit: d.audit.length, rev: d.revision }).toEqual(before);
  });

  it("continues as a live simulation when switched on", () => {
    stageShowcase(d);
    const n = d.visits.length;
    setScene(d, "LIVE");
    d.live.speed = 10;
    for (let i = 0; i < 200; i++) {
      vi.advanceTimersByTime(1000);
      tick(d);
    }
    expect(d.visits.length).toBeGreaterThan(n);
    expect(d.visits.slice(n).some((v) => v.state !== "ARRIVED")).toBe(true);
  });
});

describe("retention", () => {
  it("archives old visits and keeps the audit chain verifiable", () => {
    vi.advanceTimersByTime(5 * 864e5); // five days later the first two seed days are older than 7 days
    const before = d.visits.length;
    const removed = pruneOld(d);
    expect(removed).toBeGreaterThan(0);
    expect(d.visits.length).toBe(before - removed);
    expect(d.auditBase.archived).toBeGreaterThan(0);
    expect(verifyChain(d.audit, d.auditBase.prevHash).ok).toBe(true);
    expect(d.transactions.every((t) => d.visits.some((v) => v.id === t.visitId))).toBe(true);
  });
});
