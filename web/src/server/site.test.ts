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
