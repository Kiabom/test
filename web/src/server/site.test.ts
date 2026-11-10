import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
import { canSee } from "@/domain/access";
import { CLOCK_ANCHOR } from "@/domain/clock";
import { evaluateGate } from "@/domain/gate";
import { buildSeed } from "./seed";
import { gateContextFor } from "./ops";

describe("site data", () => {
  const d = buildSeed();
  it("has the agreed master data sizes", () => {
    expect(d.vehicles.length).toBe(40);
    expect(d.materials.map((m) => m.id)).toEqual(["M-FEL", "M-FEC", "M-PEL", "M-WST"]);
    expect(d.customers.filter((c) => c.type === "CUSTOMER").map((c) => c.name)).toContain("فولاد زرند");
    expect(d.customers.filter((c) => c.type === "CUSTOMER")).toHaveLength(3);
    expect(d.customers.filter((c) => c.type === "SUPPLIER")).toHaveLength(1);
    expect(d.drivers.every((x) => x.phone.startsWith("0913"))).toBe(true);
  });
  it("is identical on every build and dated Tir 1403", () => {
    const again = buildSeed();
    expect(JSON.stringify(again.transactions)).toBe(JSON.stringify(d.transactions));
    expect(JSON.stringify(again.audit)).toBe(JSON.stringify(d.audit));
    const last = d.transactions.map((t) => t.createdAt).sort().at(-1)!;
    expect(new Date(last).getTime()).toBeLessThanOrEqual(CLOCK_ANCHOR);
    expect(last.slice(0, 7)).toBe("2024-07");
  });
  it("gives every vehicle 1–3 authorized drivers with unique tags", () => {
    for (const v of d.vehicles) expect(v.authorizedDriverIds.length).toBeGreaterThanOrEqual(1);
    const tags = d.drivers.map((x) => x.rfidTag);
    expect(new Set(tags).size).toBe(tags.length);
  });
  it("holds a driver who is not authorized for the vehicle", () => {
    const visit = d.visits.find((v) => v.state === "EXITED" && !v.internal)!;
    const vehicle = d.vehicles.find((v) => v.id === visit.vehicleId)!;
    const other = d.drivers.find((x) => !vehicle.authorizedDriverIds.includes(x.id) && x.status === "ACTIVE")!;
    const ctx = gateContextFor(d, { ...visit, driverId: other.id }, "IN");
    expect(ctx.driverNotAuthorized).toBe(true);
    const ok = gateContextFor(d, { ...visit, driverId: vehicle.authorizedDriverIds[0] }, "IN");
    expect(ok.driverNotAuthorized).toBe(false);
    expect(evaluateGate({ ...ctx, identity: "MATCH", hasOpenVisit: false, documentsExpired: false, vehicleBlocked: false, driverBlocked: false }).code).toBe("DRIVER_NOT_AUTHORIZED");
  });
});

describe("page access", () => {
  it("shows each role only its own pages", () => {
    expect(canSee("scale_operator", "/app/weighing")).toBe(true);
    expect(canSee("scale_operator", "/app/audit")).toBe(false);
    expect(canSee("scale_operator", "/app/admin")).toBe(true); // driver assignment tab only
    expect(canSee("gate_guard", "/app/reports")).toBe(false);
    expect(canSee("auditor", "/app/audit")).toBe(true);
    expect(canSee("finance", "/app/gate")).toBe(false);
    expect(canSee("system_admin", "/app/console")).toBe(true);
    expect(canSee("site_manager", "/app/integrations")).toBe(false);
  });
});

describe("manual exit permit", () => {
  it("is accepted once, rejected on reuse and after it expires", async () => {
    const { issueManualExitPermit, consumeExitPermit } = await import("./ops");
    const { initLive } = await import("./sim");
    const d = buildSeed();
    initLive(d);
    const v = d.vehicles.find((x) => x.status === "ACTIVE" && !d.visits.some((s) => s.vehicleId === x.id && !["EXITED", "REJECTED", "CANCELLED", "EXPECTED"].includes(s.state)))!;
    const ep = issueManualExitPermit(d, { vehicleId: v.id, driverId: v.authorizedDriverIds[0], reason: "انتقال به تعمیرگاه", hours: 4, empty: true }, "U-OP1");
    expect(ep.manual).toBe(true);
    expect(consumeExitPermit(d, ep.token, "U-GD1").ok).toBe(true);
    expect(consumeExitPermit(d, ep.token, "U-GD1").ok).toBe(false);
    const v2 = d.vehicles.filter((x) => x.status === "ACTIVE" && x.id !== v.id).at(-1)!;
    const ep2 = issueManualExitPermit(d, { vehicleId: v2.id, driverId: v2.authorizedDriverIds[0], reason: "خروج اضطراری", hours: 1, empty: true }, "U-OP1");
    ep2.validUntil = new Date(Date.now() - 365 * 864e5 * 10).toISOString();
    const r = consumeExitPermit(d, ep2.token, "U-GD1");
    expect(r.ok).toBe(false);
  });
});

describe("internal hauls, stockpiles, guest entry, master create", () => {
  it("weighs in-mine hauls and keeps stockpile balance = opening + in − out", async () => {
    const { stockpilesView } = await import("./views");
    const d = buildSeed();
    const internal = d.transactions.filter((t) => t.operation === "INTERNAL" && t.state === "APPROVED");
    expect(internal.some((t) => t.destinationId.startsWith("LOC-SP"))).toBe(true);
    const v = stockpilesView(d);
    const sp1 = v.stockpiles.find((s) => s.id === "LOC-SP1")!;
    const ins = d.transactions.filter((t) => t.state === "APPROVED" && t.destinationId === "LOC-SP1").reduce((a, t) => a + (t.netKg ?? 0), 0) / 1000;
    const outs = d.transactions.filter((t) => t.state === "APPROVED" && t.originId === "LOC-SP1").reduce((a, t) => a + (t.netKg ?? 0), 0) / 1000;
    expect(Math.abs(sp1.balanceT - (sp1.openingT + ins - outs))).toBeLessThan(0.5);
  });
  it("logs a guest entry without any required field", async () => {
    const { guestEntry } = await import("./ops");
    const { initLive } = await import("./sim");
    const d = buildSeed();
    initLive(d);
    const v = guestEntry(d, {}, "U-GD1") as { scenario?: string };
    expect(v.scenario).toBe("GUEST-ENTRY");
    expect(d.audit.at(-1)?.action).toBe("vehicle.guest_entry");
  });
  it("creates master records and rejects a duplicate RFID tag", async () => {
    const { dispatch } = await import("./actions");
    const d = buildSeed();
    const dr = dispatch(d, "master.create", { collection: "drivers", data: { name: "راننده جدید", rfidTag: "E280-9999-0000-0001" } }, "U-ADMIN") as { id: string };
    expect(d.drivers.some((x) => x.id === dr.id)).toBe(true);
    expect(() => dispatch(d, "master.create", { collection: "vehicles", data: { rfidEpc: "E280-9999-0000-0001" } }, "U-ADMIN")).toThrow();
  });
});

describe("master-data overrides", () => {
  it("re-applies saved edits on top of the locked seed", async () => {
    const { applyOverrides } = await import("./overrides");
    const d = buildSeed();
    applyOverrides(d, [
      { kind: "update", col: "materials", id: "M-PEL", data: { name: "سولفیدی پشت فک" } },
      { kind: "create", col: "carriers", id: "CR-9", data: { name: "حمل نمونه", nameEn: "X", regNo: "1", phone: "1", status: "ACTIVE" } },
    ]);
    expect(d.materials.find((m) => m.id === "M-PEL")!.name).toBe("سولفیدی پشت فک");
    expect(d.carriers.some((c) => c.id === "CR-9")).toBe(true);
    expect(buildSeed().materials.find((m) => m.id === "M-FEL")!.name).toBe("سنگ آهن پرعیار مگنتیتی");
  });
});

describe("route & load assignment", () => {
  it("issues a permit with a route and vehicles, and a new visit for that vehicle uses it", async () => {
    const { dispatch } = await import("./actions");
    const { initLive, runScenario, tick } = await import("./sim");
    const { gateContextFor } = await import("./ops");
    const d = buildSeed();
    initLive(d);
    const v = d.vehicles.find((x) => !x.internal && x.status === "ACTIVE" && !d.visits.some((s) => s.vehicleId === x.id && !["EXITED", "REJECTED", "CANCELLED", "EXPECTED"].includes(s.state)))!;
    const pm = dispatch(d, "permit.create", { type: "TRANSFER", materialId: "M-FEL", originId: "LOC-PN", destinationId: "LOC-SP1", allowedT: 500, days: 10, vehicleIds: [v.id], assign: true }, "U-ADMIN") as { id: string; originId: string; destinationId: string };
    expect(pm.originId).toBe("LOC-PN");
    expect(d.vehicles.find((x) => x.id === v.id)!.assignment?.permitId).toBe(pm.id);
    expect(() => dispatch(d, "permit.create", { type: "SALE", materialId: "M-FEL", originId: "LOC-SP1", destinationId: "LOC-SP1", allowedT: 1 }, "U-ADMIN")).toThrow();
    // another vehicle is not allowed on this permit
    const other = d.vehicles.find((x) => x.id !== v.id && !x.internal)!;
    const visit = d.visits.find((x) => x.vehicleId === other.id)!;
    const ctx = gateContextFor(d, { ...visit, permitId: pm.id }, "IN");
    expect(ctx.permit).toEqual({ ok: false, reason: "VEHICLE_NOT_ALLOWED" });
    void runScenario;
    void tick;
  });
});

describe("fleet performance", () => {
  it("matches the raw tickets for one vehicle", async () => {
    const { fleetPerf } = await import("./views");
    const { initLive } = await import("./sim");
    const d = buildSeed();
    initLive(d);
    const from = "2024-06-30T20:30:00.000Z";
    const to = "2024-07-07T20:30:00.000Z";
    const out = fleetPerf(d, from, to);
    const r = out.vehicles[0];
    const mine = d.transactions.filter((t) => t.vehicleId === r.id && t.state === "APPROVED" && t.tareKg && t.grossKg && (t.approvedAt ?? t.createdAt) >= from && (t.approvedAt ?? t.createdAt) < to);
    expect(r.trips).toBe(mine.length);
    expect(r.avgTare).toBe(Math.round(mine.reduce((a, t) => a + t.tareKg!, 0) / mine.length));
    expect(r.avgGross).toBe(Math.round(mine.reduce((a, t) => a + t.grossKg!, 0) / mine.length));
    const v = d.vehicles.find((x) => x.id === r.id)!;
    expect(r.overloads).toBe(mine.filter((t) => t.grossKg! > v.maxGvwKg).length);
    expect(out.drivers.length).toBeGreaterThan(0);
  });
});

describe("fleet performance filters", () => {
  it("narrows every figure to the fleet / carrier filter and carries display names", async () => {
    const { fleetPerf } = await import("./views");
    const d = buildSeed();
    const from = "2024-06-30T20:30:00.000Z";
    const to = "2024-07-07T20:30:00.000Z";
    const all = fleetPerf(d, from, to);
    const internal = fleetPerf(d, from, to, undefined, { fleet: "internal" });
    expect(internal.vehicles.every((r) => r.internal)).toBe(true);
    expect(internal.summary.trips).toBeLessThan(all.summary.trips);
    expect(internal.summary.trips).toBe(internal.vehicles.reduce((a, r) => a + r.trips, 0));
    const cr = fleetPerf(d, from, to, undefined, { carrierId: "CR-1" });
    expect(cr.vehicles.every((r) => d.vehicles.find((v) => v.id === r.id)!.carrierId === "CR-1")).toBe(true);
    expect(all.drivers[0].label).toBe(d.drivers.find((x) => x.id === all.drivers[0].id)!.name);
    expect(all.vehicles[0].tag).toBeTruthy();
  });
});

describe("performance score and production view", () => {
  const from = "2024-06-30T20:30:00.000Z";
  const to = "2024-07-07T20:30:00.000Z";
  it("scores stay within 0–100 and ranks follow the score", async () => {
    const { fleetPerf } = await import("./views");
    const d = buildSeed();
    for (const rows of [fleetPerf(d, from, to).vehicles, fleetPerf(d, from, to).drivers]) {
      expect(rows.every((r) => r.score >= 0 && r.score <= 100 && r.score === r.parts.load + r.parts.productivity + r.parts.time + r.parts.discipline)).toBe(true);
      const byRank = [...rows].sort((a, b) => a.rank - b.rank);
      expect(byRank.every((r, i) => i === 0 || byRank[i - 1].score >= r.score)).toBe(true);
      expect(new Set(rows.map((r) => r.rank)).size).toBe(rows.length);
    }
  });
  it("shift totals equal the grand total and the day × shift matrix", async () => {
    const { productionView } = await import("./views");
    const d = buildSeed();
    const p = productionView(d, from, to);
    const sum = (xs: number[]) => Math.round(xs.reduce((a, b) => a + b, 0));
    expect(Math.abs(sum(p.shifts.map((s) => s.tons)) - Math.round(p.total))).toBeLessThanOrEqual(1);
    expect(Math.abs(sum(p.matrix.flatMap((m) => m.cells.map((c) => c.tons))) - Math.round(p.total))).toBeLessThanOrEqual(2);
    expect(p.target).toBe(p.dailyTarget * p.days);
    expect(p.shifts.reduce((a, s) => a + s.trips, 0)).toBe(p.trips);
    expect(p.cycles.count).toBeGreaterThan(100);
  });
});
