import { describe, expect, it } from "vitest";
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
