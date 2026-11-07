"use client";
import { CalendarRange } from "lucide-react";
import { clockNow } from "@/domain/clock";
import { J_MONTHS, jDayStart, jMonthLength, presetRange, toJDate, type JDate, type RangePreset } from "@/domain/reportFilter";
import { faDigits } from "@/lib/format";
import { useL, useLocale } from "@/lib/prefs";
import { cx } from "./index";

const DAY = 86_400_000;
const PRESETS: { id: RangePreset; fa: string; en: string }[] = [
  { id: "today", fa: "امروز", en: "Today" },
  { id: "yesterday", fa: "دیروز", en: "Yesterday" },
  { id: "7d", fa: "۷ روز اخیر", en: "Last 7 days" },
  { id: "week", fa: "این هفته", en: "This week" },
  { id: "month", fa: "این ماه", en: "This month" },
  { id: "custom", fa: "بازه دلخواه", en: "Custom" },
];

export interface DateRangeValue {
  from: string;
  to: string;
  preset: RangePreset;
}

const minutesOf = (iso: string, base: JDate) => Math.round((new Date(iso).getTime() - jDayStart(base)) / 60_000);
const hhmm = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
const parseHHMM = (s: string) => {
  const [h, m] = s.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

/** Jalali date range with presets; "to" is exclusive internally but shown inclusive (the last day). */
export function DateRange({ value, onChange, className }: { value: DateRangeValue; onChange: (v: DateRangeValue) => void; className?: string }) {
  const L = useL();
  const locale = useLocale();
  const fromMs = new Date(value.from).getTime();
  const toMs = new Date(value.to).getTime();
  const fromJ = toJDate(fromMs);
  const lastJ = toJDate(toMs - 1);
  const fromMin = minutesOf(value.from, fromJ);
  const toMin = Math.min(1440, minutesOf(value.to, lastJ));

  const setCustom = (f: JDate, fMin: number, t: JDate, tMin: number) => {
    let a = jDayStart(f, fMin);
    let b = jDayStart(t, tMin);
    if (b <= a) b = a + (tMin === 1440 ? DAY : 60 * 60_000);
    if (b - a > 366 * DAY) a = b - 366 * DAY;
    onChange({ from: new Date(a).toISOString(), to: new Date(b).toISOString(), preset: "custom" });
  };

  return (
    <div className={cx("flex flex-col gap-2", className)}>
      <div className="flex flex-wrap items-center gap-1">
        <CalendarRange className="me-1 size-4 text-muted" />
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => (p.id === "custom" ? onChange({ ...value, preset: "custom" }) : onChange({ ...presetRange(p.id, clockNow()), preset: p.id }))}
            className={cx("rounded-lg px-2.5 py-1.5 text-xs font-medium transition", value.preset === p.id ? "bg-primary text-white" : "bg-surface-2 text-text hover:bg-primary/10")}
          >
            {L(p.fa, p.en)}
          </button>
        ))}
      </div>
      {value.preset === "custom" && (
        <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface-2/50 p-2">
          <JField label={L("از تاریخ", "From")} value={fromJ} onChange={(j) => setCustom(j, fromMin, lastJ, toMin)} />
          <TimeField label={L("از ساعت", "From time")} value={hhmm(fromMin)} onChange={(s) => setCustom(fromJ, parseHHMM(s), lastJ, toMin)} />
          <JField label={L("تا تاریخ", "To")} value={lastJ} onChange={(j) => setCustom(fromJ, fromMin, j, toMin)} />
          <TimeField label={L("تا ساعت", "To time")} value={toMin >= 1440 ? "24:00" : hhmm(toMin)} onChange={(s) => setCustom(fromJ, fromMin, lastJ, s === "24:00" ? 1440 : parseHHMM(s))} end />
        </div>
      )}
      <div className="text-[11px] text-muted">
        {L("بازه انتخاب‌شده:", "Selected:")}{" "}
        <span className="font-medium text-text">{describeRange(value, locale)}</span>
      </div>
    </div>
  );
}

export function describeRange(v: { from: string; to: string }, locale: "fa" | "en") {
  const a = new Date(v.from).getTime();
  const b = new Date(v.to).getTime();
  const fa = toJDate(a);
  const ta = toJDate(b - 1);
  const d = (j: JDate) => `${j.jy}/${String(j.jm).padStart(2, "0")}/${String(j.jd).padStart(2, "0")}`;
  const fm = minutesOf(v.from, fa);
  const tm = minutesOf(v.to, ta);
  const fullDays = fm === 0 && tm === 1440;
  let s: string;
  if (fullDays) s = d(fa) === d(ta) ? d(fa) : locale === "fa" ? `${d(fa)} تا ${d(ta)}` : `${d(fa)} – ${d(ta)}`;
  else s = locale === "fa" ? `${d(fa)} ساعت ${hhmm(fm)} تا ${d(ta)} ساعت ${hhmm(Math.min(tm, 1440))}` : `${d(fa)} ${hhmm(fm)} – ${d(ta)} ${hhmm(Math.min(tm, 1440))}`;
  return locale === "fa" ? faDigits(s) : s;
}

function JField({ label, value, onChange }: { label: string; value: JDate; onChange: (j: JDate) => void }) {
  const locale = useLocale();
  const n = (x: number) => (locale === "fa" ? faDigits(String(x)) : String(x));
  const years = [1400, 1401, 1402, 1403, 1404];
  const days = jMonthLength(value.jy, value.jm);
  const sel = "h-9 rounded-lg border border-border bg-surface px-1.5 text-sm outline-none focus:border-primary";
  const set = (p: Partial<JDate>) => {
    const j = { ...value, ...p };
    j.jd = Math.min(j.jd, jMonthLength(j.jy, j.jm));
    onChange(j);
  };
  return (
    <label className="flex flex-col gap-1 text-[11px] text-muted">
      {label}
      <span className="flex gap-1">
        <select className={sel} value={value.jd} onChange={(e) => set({ jd: Number(e.target.value) })} aria-label="day">
          {Array.from({ length: days }, (_, i) => i + 1).map((d) => (
            <option key={d} value={d}>
              {n(d)}
            </option>
          ))}
        </select>
        <select className={sel} value={value.jm} onChange={(e) => set({ jm: Number(e.target.value) })} aria-label="month">
          {J_MONTHS.map((m, i) => (
            <option key={m} value={i + 1}>
              {locale === "fa" ? m : `${i + 1}`}
            </option>
          ))}
        </select>
        <select className={sel} value={value.jy} onChange={(e) => set({ jy: Number(e.target.value) })} aria-label="year">
          {years.map((y) => (
            <option key={y} value={y}>
              {n(y)}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}

function TimeField({ label, value, onChange, end }: { label: string; value: string; onChange: (s: string) => void; end?: boolean }) {
  const opts = Array.from({ length: 48 }, (_, i) => hhmm(i * 30));
  if (end) opts.push("24:00");
  const locale = useLocale();
  return (
    <label className="flex flex-col gap-1 text-[11px] text-muted">
      {label}
      <select className="h-9 rounded-lg border border-border bg-surface px-1.5 text-sm outline-none focus:border-primary" value={opts.includes(value) ? value : opts[0]} onChange={(e) => onChange(e.target.value)}>
        {opts.map((o) => (
          <option key={o} value={o}>
            {locale === "fa" ? faDigits(o) : o}
          </option>
        ))}
      </select>
    </label>
  );
}
