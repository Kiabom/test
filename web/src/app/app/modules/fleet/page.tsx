"use client";
import { Activity, AlertTriangle, Clock3, FileSpreadsheet, Gauge as GaugeIcon, Printer, Repeat, Trophy, Truck } from "lucide-react";
import { useMemo } from "react";
import { VehicleTag } from "@/components/domain/VehicleTag";
import { Button, Card, CardHeader, cx, PageHeader, Skeleton } from "@/components/ui";
import type { FleetCycle, Transaction } from "@/domain/types";
import { downloadCsv } from "@/lib/export";
import { fmtNum, fmtT } from "@/lib/format";
import { useData, useMasters, useNow } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";

const STEPS = [
  { key: "queueMin", fa: "انتظار در صف لودر", en: "Waiting at loader", color: "#dc2626" },
  { key: "loadMin", fa: "بارگیری", en: "Loading", color: "#1273a6" },
  { key: "haulMin", fa: "حمل بار", en: "Hauling", color: "#7c3aed" },
  { key: "dumpMin", fa: "تخلیه", en: "Dumping", color: "#b7791f" },
  { key: "returnMin", fa: "برگشت خالی", en: "Empty return", color: "#16a34a" },
] as const;
const cycleMin = (c: FleetCycle) => c.loadMin + c.haulMin + c.queueMin + c.dumpMin + c.returnMin;
const H = 3_600_000;

/** Ring showing a percentage, plain SVG so it prints well. */
function Ring({ pct, color, size = 92 }: { pct: number; color: string; size?: number }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, pct));
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 -rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="11" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="11" strokeLinecap="round" strokeDasharray={`${c * p} ${c}`} />
    </svg>
  );
}

function Stat({ icon, label, value, unit, note, tone = "primary" }: { icon: React.ReactNode; label: string; value: string; unit?: string; note: string; tone?: "primary" | "success" | "warning" | "danger" }) {
  const t = { primary: "bg-primary/10 text-primary", success: "bg-success/10 text-success", warning: "bg-warning/15 text-warning", danger: "bg-danger/10 text-danger" }[tone];
  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-muted">
        <span className={cx("grid size-8 place-items-center rounded-lg", t)}>{icon}</span>
        {label}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="num text-3xl font-black">{value}</span>
        {unit && <span className="text-sm text-muted">{unit}</span>}
      </div>
      <div className="text-xs leading-5 text-muted">{note}</div>
    </Card>
  );
}

export default function FleetModulePage() {
  const L = useL();
  const locale = useLocale();
  const now = useNow(60_000);
  const masters = useMasters();
  const dayStart = useMemo(() => {
    const d = new Date(now + 210 * 60_000);
    d.setUTCHours(0, 0, 0, 0);
    return d.getTime() - 210 * 60_000;
  }, [now]);
  const since = new Date(dayStart).toISOString();
  const { data } = useData<FleetCycle>("fleetCycles", { limit: 3000 }, 60_000);
  const { data: txd } = useData<Transaction>("transactions", { limit: 3000, state: "APPROVED", since }, 60_000);

  const m = useMemo(() => {
    const cycles = (data?.items ?? []).filter((c) => { const t = new Date(c.start).getTime(); return t >= dayStart && t <= now; });
    const txs = txd?.items ?? [];
    const sum = (op: Transaction["operation"]) => txs.filter((t) => t.operation === op).reduce((a, t) => a + (t.netKg ?? 0), 0) / 1000;
    const internalT = cycles.reduce((a, c) => a + c.payloadKg, 0) / 1000 + sum("INTERNAL");
    const transferT = sum("TRANSFER");
    const salesT = sum("DISPATCH");
    const avgStep = Object.fromEntries(STEPS.map((s) => [s.key, cycles.length ? cycles.reduce((a, c) => a + c[s.key], 0) / cycles.length : 0])) as Record<(typeof STEPS)[number]["key"], number>;
    const avgCycle = STEPS.reduce((a, s) => a + avgStep[s.key], 0);
    const productive = avgCycle ? (avgCycle - avgStep.queueMin) / avgCycle : 0;
    const shifts = (masters?.shifts ?? []).map((sh) => {
      const t = txs.filter((x) => x.shiftCode === sh.code && x.operation !== "RECEIVE").reduce((a, x) => a + (x.netKg ?? 0), 0) / 1000 + cycles.filter((c) => c.shiftCode === sh.code).reduce((a, c) => a + c.payloadKg, 0) / 1000;
      return { ...sh, actual: t };
    });
    const target = shifts.reduce((a, s) => a + s.targetTons, 0);
    const byVeh = new Map<string, FleetCycle[]>();
    for (const c of cycles) byVeh.set(c.vehicleId, [...(byVeh.get(c.vehicleId) ?? []), c]);
    const hoursSoFar = Math.max(1, (now - dayStart) / H);
    const trucks = [...byVeh.entries()]
      .map(([id, list]) => {
        const busy = list.reduce((a, c) => a + cycleMin(c) - c.queueMin, 0);
        return { id, n: list.length, tons: list.reduce((a, c) => a + c.payloadKg, 0) / 1000, avg: list.reduce((a, c) => a + cycleMin(c), 0) / list.length, util: Math.min(1, busy / 60 / hoursSoFar) };
      })
      .sort((a, b) => b.tons - a.tons);
    return { cycles, internalT, transferT, salesT, total: internalT + transferT + salesT, avgStep, avgCycle, productive, shifts, target, trucks };
  }, [data, txd, masters, now, dayStart]);

  if (!data || !txd || !masters) return <Skeleton className="h-[70vh]" />;
  const bottleneck = STEPS.reduce((a, s) => (m.avgStep[s.key] > m.avgStep[a.key] ? s : a), STEPS[0]);
  const prodPct = m.target ? m.total / m.target : 0;
  const tonsSplit = [
    { fa: "فروش و ارسال به مشتری", en: "Sales", v: m.salesT, color: "#1273a6" },
    { fa: "انتقال به کارخانه", en: "To plant", v: m.transferT, color: "#7c3aed" },
    { fa: "جابه‌جایی داخلی معدن", en: "Internal moves", v: m.internalT, color: "#b7791f" },
  ];
  const pct = (v: number, of: number) => (of ? Math.round((v / of) * 100) : 0);

  return (
    <div>
      <PageHeader
        icon={<Activity className="size-5" />}
        title={L("KPI ناوگان و تولید", "Fleet & production KPIs")}
        subtitle={L("وضعیت تولید امروز، عملکرد شیفت‌ها و کامیون‌های داخلی معدن", "Today's production, shift performance and the internal haul fleet")}
        actions={
          <>
            <Button size="sm" onClick={() => downloadCsv("fleet-kpi.csv", [L("خودرو", "Vehicle"), L("سرویس", "Services"), L("تن", "Tons"), L("میانگین سرویس (دقیقه)", "Avg service (min)"), L("بهره‌وری ٪", "Utilisation %")], m.trucks.map((t) => [t.id, t.n, +t.tons.toFixed(1), +t.avg.toFixed(1), Math.round(t.util * 100)]))}>
              <FileSpreadsheet className="size-4" /> Excel
            </Button>
            <Button size="sm" variant="primary" onClick={() => window.print()}>
              <Printer className="size-4" /> {L("چاپ / PDF", "Print / PDF")}
            </Button>
          </>
        }
      />

      {/* headline */}
      <div className="mb-4 grid gap-4 lg:grid-cols-4">
        <Card className="flex items-center gap-4 p-5 lg:col-span-1">
          <div className="relative">
            <Ring pct={prodPct} color={prodPct >= 0.9 ? "#16a34a" : prodPct >= 0.6 ? "#b7791f" : "#dc2626"} />
            <span className="num absolute inset-0 grid place-items-center text-lg font-black">{fmtNum(Math.round(prodPct * 100), locale)}٪</span>
          </div>
          <div>
            <div className="text-sm font-medium text-muted">{L("تولید امروز", "Today's output")}</div>
            <div className="num text-3xl font-black">{fmtT(m.total, locale)}</div>
            <div className="text-xs text-muted">
              {L("تن از هدف", "t of target")} <span className="num">{fmtNum(m.target, locale)}</span>
            </div>
          </div>
        </Card>
        <Stat icon={<Repeat className="size-4" />} label={L("تعداد سرویس امروز", "Services today")} value={fmtNum(m.cycles.length, locale)} note={L("هر سرویس = یک رفت‌وبرگشت کامل کامیون از لودر تا محل تخلیه", "One service = a full truck round trip from loader to dump")} />
        <Stat icon={<Clock3 className="size-4" />} label={L("میانگین زمان هر سرویس", "Average service time")} value={fmtNum(m.avgCycle, locale, { maximumFractionDigits: 1 })} unit={L("دقیقه", "min")} note={L("کمتر بهتر است؛ بیشترین سهم را بخش «کجا زمان از دست می‌رود» نشان می‌دهد", "Lower is better; see where the time goes below")} tone="warning" />
        <Stat
          icon={<GaugeIcon className="size-4" />}
          label={L("زمان مفید ناوگان", "Productive fleet time")}
          value={`${fmtNum(Math.round(m.productive * 100), locale)}٪`}
          note={L("سهم زمانی که کامیون در حال بارگیری، حمل یا تخلیه است (بدون انتظار در صف)", "Share of time loading, hauling or dumping (excluding queueing)")}
          tone={m.productive >= 0.85 ? "success" : "danger"}
        />
      </div>

      {/* tonnage split */}
      <Card className="mb-4 p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="font-bold">{L("تفکیک تناژ امروز", "Today's tonnage split")}</div>
          <div className="num text-sm text-muted">
            {fmtT(m.total, locale)} {L("تن", "t")}
          </div>
        </div>
        <div className="flex h-8 overflow-hidden rounded-lg">
          {tonsSplit.map((x) => (
            <div key={x.en} style={{ width: `${pct(x.v, m.total)}%`, background: x.color }} title={`${L(x.fa, x.en)} ${fmtT(x.v, locale)}`} />
          ))}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {tonsSplit.map((x) => (
            <div key={x.en} className="flex items-center gap-2 text-sm">
              <span className="size-3 rounded-sm" style={{ background: x.color }} />
              <span className="flex-1">{L(x.fa, x.en)}</span>
              <span className="num font-bold">{fmtT(x.v, locale)}</span>
              <span className="num w-10 text-end text-xs text-muted">{fmtNum(pct(x.v, m.total), locale)}٪</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        {/* shifts */}
        <Card>
          <CardHeader title={L("عملکرد شیفت‌ها", "Shift performance")} subtitle={L("تناژ واقعی در برابر هدف هر شیفت", "Actual tonnage against each shift's target")} />
          <div className="flex flex-col gap-4 p-5">
            {m.shifts.map((s) => {
              const p = s.targetTons ? s.actual / s.targetTons : 0;
              const tone = p >= 0.9 ? "#16a34a" : p >= 0.6 ? "#b7791f" : "#dc2626";
              return (
                <div key={s.id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-semibold">
                      {locale === "fa" ? s.name : s.nameEn} <span className="text-xs text-muted">({s.code})</span>
                    </span>
                    <span className="num">
                      <b>{fmtT(s.actual, locale)}</b> <span className="text-muted">/ {fmtNum(s.targetTons, locale)} {L("تن", "t")}</span>
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, p * 100)}%`, background: tone }} />
                  </div>
                  <div className="mt-1 text-xs" style={{ color: tone }}>
                    {p >= 1 ? L("به هدف رسیده", "Target reached") : p >= 0.9 ? L("در مسیر هدف", "On track") : s.actual === 0 ? L("هنوز شروع نشده", "Not started yet") : L("عقب‌تر از هدف", "Behind target")} · <span className="num">{fmtNum(Math.round(p * 100), locale)}٪</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* where time goes */}
        <Card>
          <CardHeader title={L("کجا زمان از دست می‌رود؟", "Where does the time go?")} subtitle={L("میانگین یک سرویس، به تفکیک مرحله", "An average service, step by step")} />
          <div className="p-5">
            <div className="flex h-9 overflow-hidden rounded-lg">
              {STEPS.map((s) => (
                <div key={s.key} className="grid place-items-center text-[11px] font-bold text-white num" style={{ width: `${(m.avgStep[s.key] / (m.avgCycle || 1)) * 100}%`, background: s.color }}>
                  {m.avgStep[s.key] >= 3 ? fmtNum(m.avgStep[s.key], locale, { maximumFractionDigits: 0 }) : ""}
                </div>
              ))}
            </div>
            <ul className="mt-4 flex flex-col gap-2">
              {STEPS.map((s) => (
                <li key={s.key} className={cx("flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm", s.key === bottleneck.key && "bg-danger/8 ring-1 ring-danger/30")}>
                  <span className="size-3 rounded-sm" style={{ background: s.color }} />
                  <span className="flex-1">{L(s.fa, s.en)}</span>
                  {s.key === bottleneck.key && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-danger">
                      <AlertTriangle className="size-3.5" /> {L("گلوگاه", "Bottleneck")}
                    </span>
                  )}
                  <span className="num w-20 text-end font-semibold">
                    {fmtNum(m.avgStep[s.key], locale, { maximumFractionDigits: 1 })} {L("دقیقه", "min")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* truck ranking */}
      <Card>
        <CardHeader title={L("رتبه‌بندی کامیون‌های داخلی", "Internal truck ranking")} subtitle={L("بر اساس تناژ جابه‌جاشده امروز", "By tonnage moved today")} icon={<Trophy className="size-4" />} />
        {m.trucks.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted">{L("امروز هنوز سرویسی ثبت نشده", "No services recorded today yet")}</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-2 text-xs text-muted">
                <tr>
                  {["#", L("خودرو", "Vehicle"), L("تعداد سرویس", "Services"), L("تناژ (تن)", "Tons"), L("میانگین سرویس", "Avg service"), L("زمان مفید", "Productive time")].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-start font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {m.trucks.map((t, i) => (
                  <tr key={t.id} className="border-t border-border">
                    <td className="num px-4 py-2.5 text-muted">{fmtNum(i + 1, locale)}</td>
                    <td className="px-4 py-2.5">
                      <span className="flex items-center gap-2">
                        <Truck className="size-4 text-muted" />
                        <VehicleTag vehicleId={t.id} size="xs" />
                        {i === 0 && <span className="rounded bg-success/10 px-1.5 py-0.5 text-[10px] font-bold text-success">{L("بهترین", "Best")}</span>}
                        {i === m.trucks.length - 1 && m.trucks.length > 1 && <span className="rounded bg-warning/15 px-1.5 py-0.5 text-[10px] font-bold text-warning">{L("نیاز به بررسی", "Review")}</span>}
                      </span>
                    </td>
                    <td className="num px-4 py-2.5">{fmtNum(t.n, locale)}</td>
                    <td className="num px-4 py-2.5 font-semibold">{fmtT(t.tons, locale)}</td>
                    <td className="num px-4 py-2.5">
                      {fmtNum(t.avg, locale, { maximumFractionDigits: 1 })} {L("دقیقه", "min")}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-28 overflow-hidden rounded-full bg-surface-2">
                          <span className="block h-full rounded-full bg-primary" style={{ width: `${Math.round(t.util * 100)}%` }} />
                        </span>
                        <span className="num text-xs">{fmtNum(Math.round(t.util * 100), locale)}٪</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
