import { describe, expect, it } from "vitest";
import { buildReport, flatRows } from "@/components/reports/reportModel";
import { buildSeed } from "@/server/seed";
import { CLOCK_ANCHOR } from "./clock";
import { applyFilter, emptyFilter, filterToQuery, jDayStart, presetRange, queryToFilter, toJDate, txTime } from "./reportFilter";

describe("jalali", () => {
  it("converts known dates", () => {
    expect(toJDate(CLOCK_ANCHOR)).toEqual({ jy: 1403, jm: 4, jd: 17 });
    expect(toJDate(Date.UTC(2024, 2, 20, 12))).toEqual({ jy: 1403, jm: 1, jd: 1 }); // Nowruz 1403
    expect(toJDate(Date.UTC(2025, 2, 20, 12))).toEqual({ jy: 1403, jm: 12, jd: 30 }); // 1403 is a leap year
  });
  it("day start is 00:00 site time", () => {
    expect(new Date(jDayStart({ jy: 1403, jm: 4, jd: 17 })).toISOString()).toBe("2024-07-06T20:30:00.000Z");
  });
  it("presets", () => {
    const m = presetRange("month", CLOCK_ANCHOR);
    expect(toJDate(new Date(m.from).getTime())).toEqual({ jy: 1403, jm: 4, jd: 1 });
    expect(m.to).toBe("2024-07-07T20:30:00.000Z");
    const w = presetRange("week", CLOCK_ANCHOR); // 1403/04/17 is a Sunday → week from Saturday 04/16
    expect(toJDate(new Date(w.from).getTime())).toEqual({ jy: 1403, jm: 4, jd: 16 });
  });
});

describe("report filter", () => {
  const d = buildSeed();
  const base = emptyFilter(CLOCK_ANCHOR, "7d");
  it("round-trips through the URL", () => {
    const f = { ...base, customers: ["C-01"], shifts: ["A", "B"], method: "STORED" as const, netMin: 10 };
    expect(queryToFilter(filterToQuery(f), CLOCK_ANCHOR)).toEqual(f);
  });
  it("filters by attributes and range", () => {
    const all = applyFilter(d.transactions, base);
    expect(all.length).toBeGreaterThan(100);
    const f = { ...base, customers: ["C-01"], shifts: ["A"] };
    const some = applyFilter(d.transactions, f);
    expect(some.length).toBeGreaterThan(0);
    expect(some.every((t) => t.customerId === "C-01" && t.shiftCode === "A" && txTime(t) >= f.from && txTime(t) < f.to)).toBe(true);
    const day = { ...base, ...presetRange("yesterday", CLOCK_ANCHOR) };
    expect(applyFilter(d.transactions, day).every((t) => txTime(t) >= day.from && txTime(t) < day.to)).toBe(true);
  });
  it("group subtotals add up to the grand total", () => {
    const txs = applyFilter(d.transactions, base);
    const out = buildReport("daily", txs, { masters: d as never, locale: "fa" }, { groupBy: "customer", cols: ["ticket", "net"] });
    const sub = out.sections.reduce((a, s) => a + Number(s.subtotal?.[1] ?? 0), 0);
    expect(Math.round(sub)).toBe(Math.round(Number(out.total?.[1])));
    expect(out.rowCount).toBe(txs.length);
    expect(flatRows(out).length).toBe(txs.length + out.sections.length * 2 + 1);
  });
});
