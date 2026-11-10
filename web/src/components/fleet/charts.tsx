"use client";
import { cx } from "@/components/ui";
import { faDigits, fmtNum } from "@/lib/format";
import { useLocale } from "@/lib/prefs";

export const C_TARE = "#94a3b8";
export const C_NET = "#1273a6";
export const C_GROSS = "#0b4f73";

export interface CompareRow {
  id: string;
  label: string;
  sub?: string;
  tareKg: number;
  grossKg: number;
  loadFactor?: number;
  overloads: number;
  trips: number;
  rank?: number;
  score?: number;
  grade?: "A" | "B" | "C" | "D";
  /** shown instead of the score pill (e.g. in trip lists) */
  plain?: boolean;
}
export const GRADE: Record<string, { fa: string; en: string; cls: string }> = {
  A: { fa: "عالی", en: "Excellent", cls: "bg-success/10 text-success" },
  B: { fa: "خوب", en: "Good", cls: "bg-primary/10 text-primary" },
  C: { fa: "متوسط", en: "Fair", cls: "bg-warning/15 text-warning" },
  D: { fa: "ضعیف", en: "Weak", cls: "bg-danger/10 text-danger" },
};

/**
 * One row per vehicle / driver: a stacked bar whose grey part is the empty weight (tare) and blue part the
 * net load, so the whole bar is the loaded weight. Values are written on the bar; the scale is shared.
 */
export function WeightCompare({ rows, onPick, maxKg }: { rows: CompareRow[]; onPick?: (id: string) => void; maxKg?: number }) {
  const locale = useLocale();
  const fa = locale === "fa";
  const L = (a: string, b: string) => (fa ? a : b);
  const max = maxKg ?? Math.max(1, ...rows.map((r) => r.grossKg));
  const t = (kg: number) => fmtNum(+(kg / 1000).toFixed(1), locale);
  return (
    <div className="flex flex-col">
      <div className="mb-2 flex flex-wrap items-center gap-4 px-1 text-[11px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-5 rounded-sm" style={{ background: C_TARE }} /> {L("وزن خالی (تارا — توزین اول)", "Empty (tare — first weigh)")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-5 rounded-sm" style={{ background: C_NET }} /> {L("بار خالص", "Net load")}
        </span>
        <span>{L("طول کل نوار = وزن پر (ناخالص — توزین دوم)", "Whole bar = loaded weight (gross — second weigh)")}</span>
        <span className="inline-flex items-center gap-1">
          <span className="size-2 rounded-full bg-danger" /> {L("اضافه‌بار داشته", "had an overload")}
        </span>
      </div>
      <div className="flex flex-col divide-y divide-border">
        {rows.map((r) => {
          const tw = (r.tareKg / max) * 100;
          const nw = ((r.grossKg - r.tareKg) / max) * 100;
          const lf = r.loadFactor;
          return (
            <button key={r.id} type="button" onClick={() => onPick?.(r.id)} className="grid grid-cols-[1.6rem_minmax(0,10rem)_minmax(0,1fr)_6.5rem] items-center gap-2 px-1 py-2 text-start hover:bg-surface-2/60">
              <span className={cx("num grid size-6 place-items-center rounded-full text-[11px] font-bold", r.rank && r.rank <= 3 ? "bg-amber-400/25 text-amber-700 dark:text-amber-300" : "text-muted")}>{r.rank ? fmtNum(r.rank, locale) : ""}</span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{r.label}</span>
                <span className="block truncate font-mono text-[10px] text-muted ltr">{r.sub ?? ""}</span>
              </span>
              <span className="flex min-w-0 items-center gap-2">
                <span className="relative flex h-6 min-w-0 flex-1 overflow-hidden rounded-md bg-surface-2">
                  <span className="grid h-full place-items-center text-[10px] font-semibold text-slate-900" style={{ width: `${tw}%`, background: C_TARE }}>
                    {tw > 9 ? t(r.tareKg) : ""}
                  </span>
                  <span className="grid h-full place-items-center text-[10px] font-semibold text-white" style={{ width: `${nw}%`, background: C_NET }}>
                    {nw > 9 ? t(r.grossKg - r.tareKg) : ""}
                  </span>
                </span>
                <span className="num w-16 shrink-0 text-xs font-bold">
                  {t(r.grossKg)} <span className="font-normal text-muted">{L("تن", "t")}</span>
                </span>
              </span>
              <span className="flex items-center justify-end gap-1">
                {r.overloads > 0 && <span className="size-2 rounded-full bg-danger" title={L("اضافه‌بار", "Overload")} />}
                {r.score != null && !r.plain ? (
                  <span className={cx("num rounded-full px-2 py-0.5 text-[11px] font-bold", GRADE[r.grade ?? "C"].cls)} title={L("امتیاز عملکرد از ۱۰۰", "Performance score / 100")}>
                    {fmtNum(r.score, locale)} · {L(GRADE[r.grade ?? "C"].fa, GRADE[r.grade ?? "C"].en)}
                  </span>
                ) : lf != null ? (
                  <span className={cx("num rounded-full px-2 py-0.5 text-[11px] font-bold", lf < 0.75 ? "bg-warning/15 text-warning" : lf > 1 ? "bg-danger/10 text-danger" : "bg-success/10 text-success")}>{fmtNum(Math.round(lf * 100), locale)}٪</span>
                ) : (
                  <span className="num text-[11px] text-muted">
                    {fmtNum(r.trips, locale)} {L("سفر", "trips")}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Daily averages of empty, loaded and net weight (t) with trips per day underneath — plain SVG, labelled. */
export function DailyWeights({ days }: { days: { day: string; trips: number; avgTare: number; avgGross: number; avgNet: number }[] }) {
  const locale = useLocale();
  const fa = locale === "fa";
  const L = (a: string, b: string) => (fa ? a : b);
  if (!days.length) return <div className="py-10 text-center text-sm text-muted">{L("داده‌ای در این بازه نیست", "No data in this period")}</div>;
  const W = 640;
  const H = 210;
  const padL = 44;
  const padR = 14;
  const top = 14;
  const bottom = 30;
  const maxT = Math.ceil(Math.max(...days.map((d) => d.avgGross)) / 1000 / 10) * 10 || 10;
  const x = (i: number) => padL + (days.length === 1 ? (W - padL - padR) / 2 : (i / (days.length - 1)) * (W - padL - padR));
  const y = (kg: number) => top + (1 - kg / 1000 / maxT) * (H - top - bottom);
  const path = (k: "avgTare" | "avgGross" | "avgNet") => days.map((d, i) => `${i ? "L" : "M"}${x(i)} ${y(d[k])}`).join(" ");
  const label = (day: string) => {
    // site date (YYYY-MM-DD, Gregorian) → Jalali MM/DD
    const ms = Date.parse(day + "T12:00:00Z");
    const s = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { month: "2-digit", day: "2-digit", timeZone: "Asia/Tehran" }).format(ms);
    return fa ? s : faToLatin(s);
  };
  const maxTrips = Math.max(1, ...days.map((d) => d.trips));
  const ticks = [0, maxT / 4, maxT / 2, (3 * maxT) / 4, maxT];
  const series = [
    { k: "avgGross" as const, c: C_GROSS, n: L("وزن پر (ناخالص)", "Loaded (gross)") },
    { k: "avgNet" as const, c: C_NET, n: L("بار خالص", "Net load") },
    { k: "avgTare" as const, c: C_TARE, n: L("وزن خالی (تارا)", "Empty (tare)") },
  ];
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ direction: "ltr" }}>
        {ticks.map((v) => (
          <g key={v}>
            <line x1={padL} x2={W - padR} y1={y(v * 1000)} y2={y(v * 1000)} stroke="var(--border)" strokeDasharray="3 3" />
            <text x={padL - 6} y={y(v * 1000) + 4} textAnchor="end" fontSize="10" fill="var(--muted)">
              {fa ? faDigits(String(Math.round(v))) : Math.round(v)}
            </text>
          </g>
        ))}
        <text x={10} y={top + 4} fontSize="10" fill="var(--muted)">
          {L("تن", "t")}
        </text>
        {series.map((s) => (
          <g key={s.k}>
            <path d={path(s.k)} fill="none" stroke={s.c} strokeWidth="2.5" />
            {days.map((d, i) => (
              <g key={i}>
                <circle cx={x(i)} cy={y(d[s.k])} r="3.5" fill={s.c} />
                <title>{`${label(d.day)} — ${s.n}: ${(d[s.k] / 1000).toFixed(1)} t`}</title>
              </g>
            ))}
            <text x={x(days.length - 1) + 4} y={y(days[days.length - 1][s.k]) - 6} fontSize="10" fontWeight="700" fill={s.c} textAnchor="end">
              {fa ? faDigits((days[days.length - 1][s.k] / 1000).toFixed(1)) : (days[days.length - 1][s.k] / 1000).toFixed(1)}
            </text>
          </g>
        ))}
        {days.map((d, i) => (
          <text key={d.day} x={x(i)} y={H - 10} fontSize="10" fill="var(--muted)" textAnchor="middle">
            {label(d.day)}
          </text>
        ))}
      </svg>
      <div className="mt-1 flex items-end gap-1 ps-[7%] pe-[2%]" dir="ltr">
        {days.map((d) => (
          <div key={d.day} className="flex flex-1 flex-col items-center gap-0.5" title={`${d.trips}`}>
            <div className="w-3/5 rounded-t bg-primary/25" style={{ height: `${(d.trips / maxTrips) * 28}px` }} />
            <span className="num text-[10px] text-muted">{fmtNum(d.trips, locale)}</span>
          </div>
        ))}
      </div>
      <div className="mt-1 text-center text-[10px] text-muted">{L("تعداد سفر در هر روز", "Trips per day")}</div>
      <div className="mt-2 flex flex-wrap justify-center gap-4 text-[11px]">
        {series.map((s) => (
          <span key={s.k} className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-5 rounded" style={{ background: s.c, height: 3 }} /> {s.n}
          </span>
        ))}
      </div>
    </div>
  );
}

const faToLatin = (s: string) => s.replace(/[۰-۹]/g, (c) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(c)));
