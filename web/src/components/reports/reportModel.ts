import { jKey, toJDate, txTime } from "@/domain/reportFilter";
import type { Plate, Transaction, Visit, WeighEvent } from "@/domain/types";
import { lbl, OPERATION, PERMIT_STATUS, TX_STATE, VISIT_STATE } from "@/i18n/labels";
import { fmtDateTime, faDigits } from "@/lib/format";
import type { Masters } from "@/lib/live";
import type { Locale } from "@/lib/prefs";
import { userName } from "@/lib/users";

export type TplId = "daily" | "route" | "customer" | "material" | "vehicle" | "carrier" | "driver" | "shift" | "day" | "trips" | "exceptions" | "manual" | "permit";
export const TEMPLATES: { id: TplId; fa: string; en: string; group?: "detail" | "summary" | "other" }[] = [
  { id: "daily", fa: "فهرست تیکت‌ها (ریز)", en: "Ticket list (detail)", group: "detail" },
  { id: "day", fa: "خلاصه روزانه", en: "Daily summary", group: "summary" },
  { id: "route", fa: "به تفکیک مسیر (مبدأ ← مقصد)", en: "By route (origin → destination)", group: "summary" },
  { id: "customer", fa: "به تفکیک مشتری", en: "By customer", group: "summary" },
  { id: "material", fa: "به تفکیک ماده", en: "By material", group: "summary" },
  { id: "vehicle", fa: "به تفکیک خودرو", en: "By vehicle", group: "summary" },
  { id: "carrier", fa: "به تفکیک شرکت حمل", en: "By carrier", group: "summary" },
  { id: "driver", fa: "به تفکیک راننده", en: "By driver", group: "summary" },
  { id: "shift", fa: "گزارش شیفت", en: "Shift report", group: "summary" },
  { id: "trips", fa: "سفرهای کامل / ناقص", en: "Complete / incomplete trips", group: "other" },
  { id: "exceptions", fa: "استثناها و اصلاحیه‌ها", en: "Exceptions & overrides", group: "other" },
  { id: "manual", fa: "توزین‌های دستی", en: "Manual weighings", group: "other" },
  { id: "permit", fa: "مصرف حواله‌ها", en: "Permit consumption", group: "other" },
];

export type GroupBy = "" | "route" | "day" | "shift" | "customer" | "material" | "vehicle" | "carrier" | "driver";
export const GROUP_BY: { id: GroupBy; fa: string; en: string }[] = [
  { id: "", fa: "بدون گروه‌بندی", en: "No grouping" },
  { id: "route", fa: "مسیر", en: "Route" },
  { id: "day", fa: "روز", en: "Day" },
  { id: "shift", fa: "شیفت", en: "Shift" },
  { id: "customer", fa: "مشتری", en: "Customer" },
  { id: "material", fa: "ماده", en: "Material" },
  { id: "vehicle", fa: "خودرو", en: "Vehicle" },
  { id: "carrier", fa: "شرکت حمل", en: "Carrier" },
  { id: "driver", fa: "راننده", en: "Driver" },
];

export interface Col {
  key: string;
  fa: string;
  en: string;
  num?: boolean;
  /** summed into subtotals / grand total */
  sum?: boolean;
}
export type Cell = string | number;
export interface Section {
  label?: string;
  rows: Cell[][];
  subtotal?: Cell[];
}
export interface ReportOut {
  cols: Col[];
  sections: Section[];
  total?: Cell[];
  rowCount: number;
  chart?: { k: string; v: number }[];
  chartUnit?: string;
}

/** Detail columns the user can show or hide. */
export const DETAIL_COLS: (Col & { def?: boolean })[] = [
  { key: "ticket", fa: "تیکت", en: "Ticket", def: true },
  { key: "time", fa: "زمان", en: "Time", def: true },
  { key: "plate", fa: "تگ خودرو", en: "Vehicle tag", def: true },
  { key: "driver", fa: "راننده", en: "Driver" },
  { key: "carrier", fa: "شرکت حمل", en: "Carrier" },
  { key: "customer", fa: "مشتری", en: "Customer", def: true },
  { key: "material", fa: "ماده", en: "Material", def: true },
  { key: "operation", fa: "عملیات", en: "Operation" },
  { key: "route", fa: "مبدأ ← مقصد", en: "Origin → destination", def: true },
  { key: "shift", fa: "شیفت", en: "Shift" },
  { key: "permit", fa: "حواله", en: "Permit" },
  { key: "gross", fa: "ناخالص (kg)", en: "Gross (kg)", num: true, sum: true, def: true },
  { key: "tare", fa: "تارا (kg)", en: "Tare (kg)", num: true, sum: true, def: true },
  { key: "net", fa: "خالص (kg)", en: "Net (kg)", num: true, sum: true, def: true },
  { key: "deduction", fa: "کسر (kg)", en: "Deduction (kg)", num: true, sum: true },
  { key: "billable", fa: "قابل محاسبه (kg)", en: "Billable (kg)", num: true, sum: true },
  { key: "state", fa: "وضعیت", en: "State", def: true },
];
export const DEFAULT_DETAIL_COLS = DETAIL_COLS.filter((c) => c.def).map((c) => c.key);

export interface ModelCtx {
  masters: Masters | null;
  locale: Locale;
  visits?: Visit[];
  manualWeighs?: WeighEvent[];
  /** all (unfiltered by date) permits are shown by the permit template; restricted by the filter's lists */
  permitIds?: string[];
  customerIds?: string[];
  materialIds?: string[];
}

export function buildReport(tpl: TplId, txs: Transaction[], ctx: ModelCtx, opts: { groupBy?: GroupBy; cols?: string[] } = {}): ReportOut {
  const { masters: m, locale } = ctx;
  const fa = locale === "fa";
  const nm = (x?: { name: string; nameEn?: string }) => (x ? (fa ? x.name : x.nameEn ?? x.name) : "—");
  const plate = (id: string) => {
    const v = m?.vehicles.find((x) => x.id === id);
    return v ? `${v.id} · ${(v.rfidEpc ?? "").split("-").slice(-2).join("-")}` : id;
  };
  const shiftName = (c: string) => nm(m?.shifts.find((s) => s.code === c)) + ` (${c})`;
  const dayLabel = (iso: string) => (fa ? faDigits(jKey(toJDate(new Date(iso).getTime()))) : jKey(toJDate(new Date(iso).getTime())));
  const locName = (id?: string) => nm(m?.locations.find((l) => l.id === id)).split(" — ")[0];
  const routeOf = (t: Transaction) => `${locName(t.originId)} ← ${locName(t.destinationId)}`;
  const keyOf = (g: GroupBy, t: Transaction): string => {
    switch (g) {
      case "route":
        return routeOf(t);
      case "day":
        return dayLabel(txTime(t));
      case "shift":
        return shiftName(t.shiftCode);
      case "customer":
        return nm(m?.customers.find((c) => c.id === t.customerId));
      case "material":
        return nm(m?.materials.find((c) => c.id === t.materialId));
      case "vehicle":
        return plate(t.vehicleId);
      case "carrier":
        return nm(m?.carriers.find((c) => c.id === t.carrierId));
      case "driver":
        return nm(m?.drivers.find((c) => c.id === t.driverId));
      default:
        return "";
    }
  };
  const approved = txs.filter((t) => t.state === "APPROVED");

  // -------- summaries: one row per group
  const SUMMARY: Partial<Record<TplId, GroupBy>> = { route: "route", day: "day", customer: "customer", material: "material", vehicle: "vehicle", carrier: "carrier", driver: "driver", shift: "shift" };
  const dim = SUMMARY[tpl];
  if (dim) {
    const map = new Map<string, { n: number; gross: number; tare: number; net: number; bill: number; order: string }>();
    for (const t of approved) {
      const k = keyOf(dim, t);
      const s = map.get(k) ?? { n: 0, gross: 0, tare: 0, net: 0, bill: 0, order: dim === "day" ? txTime(t) : dim === "shift" ? t.shiftCode : "" };
      s.n++;
      s.gross += t.grossKg ?? 0;
      s.tare += t.tareKg ?? 0;
      s.net += t.netKg ?? 0;
      s.bill += t.billableKg ?? t.netKg ?? 0;
      map.set(k, s);
    }
    const entries = [...map.entries()].sort((a, b) => (dim === "day" || dim === "shift" ? a[1].order.localeCompare(b[1].order) : b[1].net - a[1].net));
    const t2 = (kg: number) => +(kg / 1000).toFixed(2);
    const label = GROUP_BY.find((g) => g.id === dim)!;
    const cols: Col[] = [
      { key: "k", fa: label.fa, en: label.en },
      { key: "n", fa: "تعداد سفر", en: "Trips", num: true, sum: true },
      { key: "gross", fa: "ناخالص (تن)", en: "Gross (t)", num: true, sum: true },
      { key: "tare", fa: "تارا (تن)", en: "Tare (t)", num: true, sum: true },
      { key: "net", fa: "خالص (تن)", en: "Net (t)", num: true, sum: true },
      { key: "bill", fa: "قابل محاسبه (تن)", en: "Billable (t)", num: true, sum: true },
      { key: "avg", fa: "میانگین خالص هر سفر (تن)", en: "Avg net / trip (t)", num: true },
    ];
    if (dim === "shift") cols.push({ key: "target", fa: "هدف روزانه (تن)", en: "Daily target (t)", num: true });
    const rows = entries.map(([k, s]) => {
      const r: Cell[] = [k, s.n, t2(s.gross), t2(s.tare), t2(s.net), t2(s.bill), s.n ? t2(s.net / s.n) : 0];
      if (dim === "shift") r.push(m?.shifts.find((x) => k.endsWith(`(${x.code})`))?.targetTons ?? 0);
      return r;
    });
    const tot = sumRow(cols, rows, fa);
    const n = Number(tot[1]) || 0;
    tot[6] = n ? +(Number(tot[4]) / n).toFixed(2) : 0;
    if (dim === "shift") tot[7] = "";
    return { cols, sections: [{ rows }], total: tot, rowCount: rows.length, chart: entries.slice(0, 14).map(([k, s]) => ({ k, v: +(s.net / 1000).toFixed(1) })), chartUnit: fa ? "تن خالص" : "net t" };
  }

  // -------- detail list (with optional grouping and column choice)
  if (tpl === "daily") {
    const chosen = (opts.cols?.length ? opts.cols : DEFAULT_DETAIL_COLS).filter((k) => DETAIL_COLS.some((c) => c.key === k));
    const cols = DETAIL_COLS.filter((c) => chosen.includes(c.key));
    const cell = (t: Transaction, k: string): Cell => {
      switch (k) {
        case "ticket":
          return t.ticketNo;
        case "time":
          return fmtDateTime(txTime(t), locale);
        case "plate":
          return plate(t.vehicleId);
        case "driver":
          return nm(m?.drivers.find((c) => c.id === t.driverId));
        case "carrier":
          return nm(m?.carriers.find((c) => c.id === t.carrierId));
        case "customer":
          return nm(m?.customers.find((c) => c.id === t.customerId));
        case "material":
          return nm(m?.materials.find((c) => c.id === t.materialId));
        case "operation":
          return lbl(OPERATION, t.operation, locale);
        case "route":
          return routeOf(t);
        case "shift":
          return shiftName(t.shiftCode);
        case "permit":
          return m?.permits.find((p) => p.id === t.permitId)?.permitNo ?? "—";
        case "gross":
          return t.grossKg ?? "";
        case "tare":
          return t.tareKg ?? "";
        case "net":
          return t.netKg ?? "";
        case "deduction":
          return t.deductionKg;
        case "billable":
          return t.billableKg ?? "";
        case "state":
          return lbl(TX_STATE, t.state, locale);
        default:
          return "";
      }
    };
    const sorted = [...txs].sort((a, b) => txTime(a).localeCompare(txTime(b)));
    const toRow = (t: Transaction) => cols.map((c) => cell(t, c.key));
    const g = opts.groupBy ?? "";
    let sections: Section[];
    if (!g) sections = [{ rows: sorted.map(toRow) }];
    else {
      const map = new Map<string, Transaction[]>();
      for (const t of sorted) {
        const k = keyOf(g, t);
        map.set(k, [...(map.get(k) ?? []), t]);
      }
      sections = [...map.entries()].map(([k, list]) => {
        const rows = list.map(toRow);
        return { label: k, rows, subtotal: sumRow(cols, rows, fa, list.length) };
      });
    }
    const all = sections.flatMap((s) => s.rows);
    return { cols, sections, total: sumRow(cols, all, fa, all.length), rowCount: all.length };
  }

  if (tpl === "trips") {
    const vs = ctx.visits ?? [];
    const complete = vs.filter((v) => v.state === "EXITED");
    const rejected = vs.filter((v) => v.state === "REJECTED");
    const open = vs.filter((v) => !["EXITED", "REJECTED", "CANCELLED"].includes(v.state));
    const cols: Col[] = [
      { key: "plate", fa: "تگ خودرو", en: "Vehicle tag" },
      { key: "arrived", fa: "ورود", en: "Arrived" },
      { key: "exited", fa: "خروج", en: "Exited" },
      { key: "state", fa: "وضعیت", en: "State" },
      { key: "done", fa: "کامل", en: "Complete" },
    ];
    const row = (v: Visit): Cell[] => [plate(v.vehicleId), fmtDateTime(v.arrivedAt, locale), v.exitedAt ? fmtDateTime(v.exitedAt, locale) : "—", lbl(VISIT_STATE, v.state, locale), v.state === "EXITED" ? (fa ? "بله" : "Yes") : fa ? "خیر" : "No"];
    const sections: Section[] = [
      { label: fa ? `ناقص / باز (${faDigits(String(open.length))})` : `Incomplete / open (${open.length})`, rows: open.map(row) },
      { label: fa ? `رد شده (${faDigits(String(rejected.length))})` : `Rejected (${rejected.length})`, rows: rejected.map(row) },
      { label: fa ? `کامل (${faDigits(String(complete.length))})` : `Complete (${complete.length})`, rows: complete.map(row) },
    ].filter((s) => s.rows.length);
    return {
      cols,
      sections,
      rowCount: vs.length,
      chart: [
        { k: fa ? "کامل" : "Complete", v: complete.length },
        { k: fa ? "ناقص/باز" : "Open", v: open.length },
        { k: fa ? "رد شده" : "Rejected", v: rejected.length },
      ],
      chartUnit: fa ? "سفر" : "trips",
    };
  }

  if (tpl === "exceptions") {
    const ex = txs.filter((t) => t.holdReasons.length || t.revisions.some((r) => r.reason) || t.state === "EXCEPTION" || t.state === "VOIDED");
    const cols: Col[] = [
      { key: "ticket", fa: "تیکت", en: "Ticket" },
      { key: "time", fa: "زمان", en: "Time" },
      { key: "plate", fa: "تگ خودرو", en: "Vehicle tag" },
      { key: "state", fa: "وضعیت", en: "State" },
      { key: "reasons", fa: "قواعد / دلایل", en: "Rules / reasons" },
      { key: "ver", fa: "نسخه", en: "Ver", num: true },
      { key: "appr", fa: "تأییدکننده", en: "Approver" },
    ];
    const rows = ex.map((t): Cell[] => [t.ticketNo, fmtDateTime(txTime(t), locale), plate(t.vehicleId), lbl(TX_STATE, t.state, locale), [...t.holdReasons, ...t.revisions.map((r) => r.reason).filter(Boolean)].join("، ") || "—", t.version, userName(t.approvedBy, locale)]);
    return { cols, sections: [{ rows }], rowCount: rows.length };
  }

  if (tpl === "manual") {
    const ids = new Map(txs.map((t) => [t.id, t]));
    const list = (ctx.manualWeighs ?? []).filter((w) => ids.has(w.transactionId));
    const cols: Col[] = [
      { key: "time", fa: "زمان", en: "Time" },
      { key: "ticket", fa: "تیکت", en: "Ticket" },
      { key: "w", fa: "وزن (kg)", en: "Weight (kg)", num: true },
      { key: "reason", fa: "دلیل", en: "Reason" },
      { key: "op", fa: "اپراتور", en: "Operator" },
      { key: "s2", fa: "امضای دوم", en: "2nd signer" },
    ];
    const rows = list.map((w): Cell[] => [fmtDateTime(w.capturedAt, locale), ids.get(w.transactionId)?.ticketNo ?? "—", w.weightKg, w.manualReason ?? "—", userName(w.operatorId, locale), userName(w.secondSigner, locale)]);
    return { cols, sections: [{ rows }], rowCount: rows.length };
  }

  // permit consumption
  const has = (list: string[] | undefined, v?: string) => !list?.length || (!!v && list.includes(v));
  const permits = (m?.permits ?? []).filter((p) => has(ctx.permitIds, p.id) && has(ctx.customerIds, p.customerId) && has(ctx.materialIds, p.materialId));
  const usedInRange = new Map<string, number>();
  for (const t of approved) if (t.permitId) usedInRange.set(t.permitId, (usedInRange.get(t.permitId) ?? 0) + (t.netKg ?? 0));
  const cols: Col[] = [
    { key: "no", fa: "حواله", en: "Permit" },
    { key: "cus", fa: "مشتری", en: "Customer" },
    { key: "mat", fa: "ماده", en: "Material" },
    { key: "allowed", fa: "مجاز (تن)", en: "Allowed (t)", num: true, sum: true },
    { key: "range", fa: "مصرف در بازه (تن)", en: "Used in range (t)", num: true, sum: true },
    { key: "used", fa: "مصرف کل (تن)", en: "Used total (t)", num: true, sum: true },
    { key: "left", fa: "مانده (تن)", en: "Left (t)", num: true, sum: true },
    { key: "status", fa: "وضعیت", en: "Status" },
  ];
  const rows = permits.map((p): Cell[] => [
    p.permitNo,
    nm(m?.customers.find((c) => c.id === p.customerId)),
    nm(m?.materials.find((c) => c.id === p.materialId)),
    +(p.allowedKg / 1000).toFixed(2),
    +((usedInRange.get(p.id) ?? 0) / 1000).toFixed(2),
    +(p.consumedKg / 1000).toFixed(2),
    +((p.allowedKg - p.consumedKg - p.reservedKg) / 1000).toFixed(2),
    lbl(PERMIT_STATUS, p.status, locale),
  ]);
  return { cols, sections: [{ rows }], total: sumRow(cols, rows, fa), rowCount: rows.length };
}

/** Plate as read aloud on paper: «۴۰ ج ۵۶۶ ایران ۶۵» (no hyphen, so it never flips in right-to-left text). */
export function plateText(p: Plate, locale: Locale): string {
  return locale === "fa" ? faDigits(`${p.d2} ${p.letter} ${p.d3} ایران ${p.region}`) : `${p.d2} ${p.letter} ${p.d3} IR ${p.region}`;
}

function sumRow(cols: Col[], rows: Cell[][], fa: boolean, count?: number): Cell[] {
  return cols.map((c, i) => {
    if (i === 0) return count != null ? (fa ? `جمع (${faDigits(String(count))} ردیف)` : `Total (${count} rows)`) : fa ? "جمع" : "Total";
    if (!c.sum) return "";
    return +rows.reduce((a, r) => a + (typeof r[i] === "number" ? (r[i] as number) : 0), 0).toFixed(2);
  });
}

/** Flat rows for CSV / Excel, including group headings and subtotals. */
export function flatRows(out: ReportOut): Cell[][] {
  const res: Cell[][] = [];
  for (const s of out.sections) {
    if (s.label) res.push([s.label]);
    res.push(...s.rows);
    if (s.subtotal) res.push(s.subtotal);
  }
  if (out.total) res.push(out.total);
  return res;
}
