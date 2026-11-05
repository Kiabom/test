import { describe, expect, it } from "vitest";
import { CUSTOMER_ROUTES, distanceKm, local, pathKm, pointAlong, STATIONS } from "./geo";
import { JOURNEY_STEPS, journeyIndex, stepStation } from "./journey";
import type { VisitState } from "./types";

const ALL: VisitState[] = ["EXPECTED", "ARRIVED", "IDENTIFIED", "IN_SITE", "ON_SCALE_1", "LOADING", "ON_SCALE_2", "READY_TO_EXIT", "EXITED", "HOLD", "REJECTED", "CANCELLED"];

describe("journey", () => {
  it("numbers the steps 0..9 in order", () => {
    expect(JOURNEY_STEPS.map((s) => s.n)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("maps every visit state to a valid step", () => {
    for (const state of ALL) for (const prevState of [undefined, ...ALL]) {
      const i = journeyIndex({ state, prevState });
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan(JOURNEY_STEPS.length);
    }
  });

  it("follows a dispatch trip through the site", () => {
    expect(journeyIndex({ state: "ARRIVED" })).toBe(1);
    expect(journeyIndex({ state: "IN_SITE", prevState: "IDENTIFIED" })).toBe(2);
    expect(journeyIndex({ state: "ON_SCALE_1" })).toBe(3);
    expect(journeyIndex({ state: "LOADING" })).toBe(4);
    expect(journeyIndex({ state: "IN_SITE", prevState: "LOADING" })).toBe(6);
    expect(journeyIndex({ state: "ON_SCALE_2" })).toBe(6);
    expect(journeyIndex({ state: "READY_TO_EXIT" })).toBe(8);
    expect(journeyIndex({ state: "EXITED" })).toBe(9);
  });

  it("keeps a held truck on the step where it was stopped", () => {
    expect(journeyIndex({ state: "HOLD", prevState: "IDENTIFIED" })).toBe(1);
    expect(journeyIndex({ state: "HOLD", prevState: "ON_SCALE_2" })).toBe(6);
  });

  it("sends the driver to the right loading point", () => {
    const load = JOURNEY_STEPS.find((s) => s.id === "LOAD")!;
    expect(stepStation(load, { operation: "DISPATCH", loadingEquipmentId: "EQ-L2" })).toBe("L-02");
    expect(stepStation(load, { operation: "DISPATCH", loadingEquipmentId: "EQ-S1" })).toBe("SH-01");
    expect(stepStation(load, { operation: "RECEIVE", loadingEquipmentId: undefined })).toBe("unload");
  });
});

describe("geo", () => {
  it("places local metres at the right distance", () => {
    expect(distanceKm(local(0, 0), local(1000, 0))).toBeCloseTo(1, 2);
    expect(distanceKm(local(0, 0), local(0, -2000))).toBeCloseTo(2, 2);
  });

  it("interpolates along a path", () => {
    const path = [local(0, 0), local(1000, 0), local(1000, 1000)];
    expect(pathKm(path)).toBeCloseTo(2, 2);
    expect(distanceKm(pointAlong(path, 0).at, path[0])).toBeLessThan(0.001);
    expect(distanceKm(pointAlong(path, 0.5).at, path[1])).toBeLessThan(0.002);
    expect(distanceKm(pointAlong(path, 1).at, path[2])).toBeLessThan(0.001);
    expect(distanceKm(pointAlong(path, 0.75).at, local(1000, 500))).toBeLessThan(0.002);
    expect(Math.round(pointAlong(path, 0.25).heading)).toBe(90);
  });

  it("starts every delivery route at the exit gate", () => {
    for (const r of Object.values(CUSTOMER_ROUTES)) {
      expect(r.path[0]).toEqual(STATIONS.E.at);
      expect(pathKm(r.path)).toBeGreaterThan(20);
    }
  });
});
