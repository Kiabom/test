import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { verifyChain } from "@/domain/audit";
import { buildSeed } from "./seed";
import { initLive, runScenario, tick } from "./sim";
import { consumeExitPermit, issueExitPermit } from "./ops";
import type { DB } from "./store";

let d: DB;
let seedLen = 0;
beforeEach(() => {
  vi.useFakeTimers();
  d = buildSeed();
  seedLen = d.visits.length;
  initLive(d);
});
afterEach(() => vi.useRealTimers());

function run(seconds: number) {
  for (let i = 0; i < seconds; i++) {
    vi.advanceTimersByTime(1000);
    tick(d);
  }
}

describe("seed", () => {
  it("builds a consistent history", () => {
    const s = buildSeed();
    expect(s.transactions.length).toBeGreaterThan(400);
    expect(verifyChain(s.audit).ok).toBe(true);
    for (const p of s.permits) expect(p.allowedKg - p.consumedKg).toBeGreaterThanOrEqual(0);
  });
});

describe("simulator", () => {
  it("runs trucks end-to-end in AUTO mode", () => {
    d.live.speed = 10;
    run(400);
    const fresh = d.visits.slice(seedLen);
    if (!fresh.some((v) => v.state === "EXITED")) console.log(fresh.map((v) => `${v.id} ${v.state} ${v.holdReasons} lane=${v.laneCode}`), d.live.lanes.map((l) => `${l.code}:${l.phase}:${l.visitId}`), d.live.log.slice(-25).map((x) => x.source + " " + x.text));
    expect(fresh.some((v) => v.state === "EXITED")).toBe(true);
    expect(verifyChain(d.audit).ok).toBe(true);
    for (const p of d.permits) expect(p.allowedKg - p.consumedKg).toBeGreaterThanOrEqual(0);
  });

  it("exit QR can only be consumed once", () => {
    d.live.speed = 10;
    run(250);
    const tx = d.transactions.filter((t) => t.state === "APPROVED").at(-1)!;
    const v = d.visits.find((x) => x.id === tx.visitId)!;
    const ep = d.exitPermits.find((e) => e.id === v.exitPermitId) ?? issueExitPermit(d, v.id, "U-OP1");
    if (ep.status === "APPROVED") expect(consumeExitPermit(d, ep.token, "U-GD1").ok).toBe(true);
    const again = consumeExitPermit(d, ep.token, "U-GD2");
    expect(again.ok).toBe(false);
    expect(d.alerts.some((a) => a.ruleCode === "R36")).toBe(true);
  });

  it("mismatch scenario holds the truck at the gate", () => {
    d.live.speed = 10;
    runScenario(d, "S-MISMATCH", "U-ADMIN");
    run(30);
    const v = d.visits.find((x) => x.scenario === "S-MISMATCH")!;
    expect(v).toBeDefined();
    expect(d.alerts.some((a) => a.ruleCode === "R05" && a.visitId === v.id)).toBe(true);
  });

  it("calibration expiry locks scale 2", () => {
    runScenario(d, "S-CAL-EXP", "U-ADMIN");
    run(3);
    expect(d.live.lanes.find((l) => l.code === "C")!.locked).toBe(true);
  });
});
