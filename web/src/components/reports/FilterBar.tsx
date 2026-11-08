"use client";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cx } from "@/components/ui";
import { DateRange, describeRange } from "@/components/ui/DateRange";
import type { ListKey, ReportFilter } from "@/domain/reportFilter";
import { lbl, OPERATION, TX_STATE } from "@/i18n/labels";
import { fmtNum } from "@/lib/format";
import type { Masters } from "@/lib/live";
import { useL, useLocale, type Locale } from "@/lib/prefs";

type Opt = { id: string; label: string; sub?: string };

export const FIELD_LABEL: Record<ListKey | "method" | "net", [string, string]> = {
  customers: ["مشتری", "Customer"],
  materials: ["ماده", "Material"],
  shifts: ["شیفت", "Shift"],
  operations: ["عملیات", "Operation"],
  carriers: ["شرکت حمل", "Carrier"],
  vehicles: ["خودرو", "Vehicle"],
  drivers: ["راننده", "Driver"],
  permits: ["حواله", "Permit"],
  states: ["وضعیت", "State"],
  origins: ["مبدأ", "Origin"],
  destinations: ["مقصد", "Destination"],
  method: ["روش توزین", "Weighing method"],
  net: ["خالص (تن)", "Net (t)"],
};

export function filterOptions(m: Masters | null, locale: Locale): Record<ListKey, Opt[]> {
  const nm = (x: { name: string; nameEn?: string }) => (locale === "fa" ? x.name : x.nameEn ?? x.name);
  return {
    customers: (m?.customers ?? []).map((c) => ({ id: c.id, label: nm(c), sub: c.type === "SUPPLIER" ? (locale === "fa" ? "تأمین‌کننده" : "Supplier") : c.city })),
    materials: (m?.materials ?? []).map((x) => ({ id: x.id, label: nm(x), sub: x.grade })),
    shifts: (m?.shifts ?? []).map((x) => ({ id: x.code, label: `${nm(x)} (${x.code})` })),
    operations: Object.keys(OPERATION).map((k) => ({ id: k, label: lbl(OPERATION, k, locale) })),
    carriers: (m?.carriers ?? []).map((x) => ({ id: x.id, label: nm(x) })),
    vehicles: (m?.vehicles ?? []).filter((v) => v.status !== "GUEST").map((v) => ({ id: v.id, label: `${v.id} · ${(v.rfidEpc ?? "").split("-").slice(-2).join("-")}`, sub: v.rfidEpc })),
    drivers: (m?.drivers ?? []).map((x) => ({ id: x.id, label: nm(x), sub: x.licenseNo })),
    permits: (m?.permits ?? []).map((p) => ({ id: p.id, label: p.permitNo })),
    states: Object.keys(TX_STATE).map((k) => ({ id: k, label: lbl(TX_STATE, k, locale) })),
    origins: (m?.locations ?? []).map((x) => ({ id: x.id, label: nm(x) })),
    destinations: (m?.locations ?? []).map((x) => ({ id: x.id, label: nm(x) })),
  };
}

/** Human-readable lines describing a filter (for chips and the printed filter box). */
export function describeFilter(f: ReportFilter, m: Masters | null, locale: Locale): { key: string; label: string; value: string }[] {
  const opts = filterOptions(m, locale);
  const L = (fa: string, en: string) => (locale === "fa" ? fa : en);
  const out = [{ key: "range", label: L("بازه زمانی", "Period"), value: describeRange(f, locale) }];
  for (const k of Object.keys(opts) as ListKey[]) {
    if (!f[k].length) continue;
    const names = f[k].map((id) => opts[k].find((o) => o.id === id)?.label ?? id);
    out.push({ key: k, label: L(...FIELD_LABEL[k]), value: names.join("، ") });
  }
  if (f.method) out.push({ key: "method", label: L(...FIELD_LABEL.method), value: f.method === "MANUAL" ? L("فقط دستی", "Manual only") : L("تارای ذخیره", "Stored tare") });
  if (f.netMin != null || f.netMax != null) out.push({ key: "net", label: L(...FIELD_LABEL.net), value: `${f.netMin != null ? fmtNum(f.netMin, locale) : "…"} – ${f.netMax != null ? fmtNum(f.netMax, locale) : "…"}` });
  return out;
}

export function FilterBar({ value, onChange, masters, fields, count }: { value: ReportFilter; onChange: (f: ReportFilter) => void; masters: Masters | null; fields?: (ListKey | "method" | "net")[]; count?: number }) {
  const L = useL();
  const locale = useLocale();
  const opts = useMemo(() => filterOptions(masters, locale), [masters, locale]);
  const show = fields ?? (["customers", "materials", "shifts", "operations", "origins", "destinations", "carriers", "vehicles", "drivers", "permits", "states", "method", "net"] as const);
  const chips = describeFilter(value, masters, locale).filter((c) => c.key !== "range");
  const clear = (k: string) => {
    if (k === "method") onChange({ ...value, method: "" });
    else if (k === "net") onChange({ ...value, netMin: undefined, netMax: undefined });
    else onChange({ ...value, [k]: [] });
  };
  return (
    <div className="flex flex-col gap-3">
      <DateRange value={value} onChange={(r) => onChange({ ...value, ...r })} />
      <div className="flex flex-wrap items-center gap-2">
        {show.map((k) =>
          k === "method" ? (
            <select key={k} value={value.method} onChange={(e) => onChange({ ...value, method: e.target.value as ReportFilter["method"] })} className={cx("h-9 rounded-lg border bg-surface px-2 text-xs outline-none", value.method ? "border-primary text-primary" : "border-border")}>
              <option value="">{L("روش توزین: همه", "Method: all")}</option>
              <option value="MANUAL">{L("فقط توزین دستی", "Manual weighing only")}</option>
              <option value="STORED">{L("فقط تارای ذخیره", "Stored tare only")}</option>
            </select>
          ) : k === "net" ? (
            <span key={k} className={cx("inline-flex h-9 items-center gap-1 rounded-lg border bg-surface px-2 text-xs", value.netMin != null || value.netMax != null ? "border-primary" : "border-border")}>
              {L("خالص (تن)", "Net (t)")}
              <input type="number" min={0} placeholder={L("از", "min")} value={value.netMin ?? ""} onChange={(e) => onChange({ ...value, netMin: e.target.value === "" ? undefined : Number(e.target.value) })} className="w-14 bg-transparent text-center outline-none ltr" />
              –
              <input type="number" min={0} placeholder={L("تا", "max")} value={value.netMax ?? ""} onChange={(e) => onChange({ ...value, netMax: e.target.value === "" ? undefined : Number(e.target.value) })} className="w-14 bg-transparent text-center outline-none ltr" />
            </span>
          ) : (
            <MultiSelect key={k} label={L(...FIELD_LABEL[k])} options={opts[k]} value={value[k]} onChange={(v) => onChange({ ...value, [k]: v })} />
          ),
        )}
      </div>
      {(chips.length > 0 || count != null) && (
        <div className="flex flex-wrap items-center gap-1.5">
          {chips.map((c) => (
            <span key={c.key} className="inline-flex max-w-full items-center gap-1 rounded-full bg-primary/10 py-1 pe-1 ps-2.5 text-xs text-primary">
              <span className="font-semibold">{c.label}:</span>
              <span className="truncate">{c.value}</span>
              <button type="button" onClick={() => clear(c.key)} className="rounded-full p-0.5 hover:bg-primary/20" aria-label={L("حذف فیلتر", "Remove filter")}>
                <X className="size-3" />
              </button>
            </span>
          ))}
          {chips.length > 0 && (
            <button type="button" onClick={() => onChange({ ...value, shifts: [], operations: [], customers: [], materials: [], carriers: [], vehicles: [], drivers: [], permits: [], states: [], origins: [], destinations: [], method: "", netMin: undefined, netMax: undefined })} className="text-xs text-muted underline-offset-2 hover:text-danger hover:underline">
              {L("پاک کردن همه", "Clear all")}
            </button>
          )}
          {count != null && (
            <span className="ms-auto text-xs text-muted">
              <span className="num font-bold text-text">{fmtNum(count, locale)}</span> {L("تیکت مطابق فیلتر", "matching tickets")}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function MultiSelect({ label, options, value, onChange }: { label: string; options: Opt[]; value: string[]; onChange: (v: string[]) => void }) {
  const L = useL();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const list = options.filter((o) => !q.trim() || o.label.includes(q.trim()) || o.sub?.includes(q.trim()));
  const toggle = (id: string) => onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} className={cx("inline-flex h-9 items-center gap-1.5 rounded-lg border bg-surface px-2.5 text-xs", value.length ? "border-primary font-semibold text-primary" : "border-border")}>
        {label}
        {value.length > 0 && <span className="rounded-full bg-primary px-1.5 text-[10px] text-white num">{fmtNum(value.length, locale)}</span>}
        <ChevronDown className="size-3.5 opacity-60" />
      </button>
      {open && (
        <div className="absolute start-0 top-10 z-40 w-64 rounded-xl border border-border bg-surface p-2 shadow-xl">
          {options.length > 6 && (
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute start-2 top-2.5 size-3.5 text-muted" />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={L("جست‌وجو…", "Search…")} className="h-8 w-full rounded-lg border border-border bg-surface-2 ps-7 pe-2 text-xs outline-none focus:border-primary" />
            </div>
          )}
          <div className="max-h-64 overflow-y-auto">
            {list.map((o) => {
              const on = value.includes(o.id);
              return (
                <button key={o.id} type="button" onClick={() => toggle(o.id)} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-start text-xs hover:bg-surface-2">
                  <span className={cx("grid size-4 shrink-0 place-items-center rounded border", on ? "border-primary bg-primary text-white" : "border-border")}>{on && <Check className="size-3" />}</span>
                  <span className="min-w-0 flex-1 truncate">{o.label}</span>
                  {o.sub && <span className="truncate text-[10px] text-muted ltr">{o.sub}</span>}
                </button>
              );
            })}
            {list.length === 0 && <div className="px-2 py-3 text-center text-xs text-muted">{L("موردی نیست", "Nothing found")}</div>}
          </div>
          <div className="mt-2 flex justify-between border-t border-border pt-2 text-xs">
            <button type="button" className="text-primary" onClick={() => onChange(list.map((o) => o.id))}>
              {L("انتخاب همه", "Select all")}
            </button>
            <button type="button" className="text-muted hover:text-danger" onClick={() => onChange([])}>
              {L("هیچ‌کدام", "None")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
