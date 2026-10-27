"use client";
import { Activity, Factory } from "lucide-react";
import { useMemo } from "react";
import { Bars, Gauge } from "@/components/charts";
import { IranPlate } from "@/components/domain/IranPlate";
import { Badge, Card, CardHeader, KpiTile, PageHeader, Progress, Skeleton } from "@/components/ui";
import type { FleetCycle, Transaction } from "@/domain/types";
import { avg, percentile } from "@/domain/kpi";
import { fmtNum, fmtT, fmtTime } from "@/lib/format";
import { useData, useMasters, useNow } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";

const PHASES = [
  { key: "loadMin", fa: "بارگیری", en: "Load", color: "#1273a6" },
  { key: "haulMin", fa: "حمل پر", en: "Haul", color: "#7c3aed" },
  { key: "queueMin", fa: "صف", en: "Queue", color: "#b42335" },
  { key: "dumpMin", fa: "تخلیه", en: "Dump", color: "#b7791f" },
  { key: "returnMin", fa: "برگشت خالی", en: "Return", color: "#168567" },
] as const;
const total = (c: FleetCycle) => c.loadMin + c.haulMin + c.queueMin + c.dumpMin + c.returnMin;

export default function FleetModulePage() {
  const L = useL();
  const locale = useLocale();
  const now = useNow(10000);
  const masters = useMasters();
  const { data } = useData<FleetCycle>("fleetCycles", { limit: 2000 }, 8000);
  const since = new Date(now - 24 * 3600_000).toISOString();
  const { data: txs } = useData<Transaction>("transactions", { limit: 3000, state: "APPROVED", since }, 8000);
  const cycles = useMemo(() => data?.items ?? [], [data]);
  const windowStart = now - 8 * 3600_000;
  const byVehicle = useMemo(() => {
    const m = new Map<string, FleetCycle[]>();
    for (const c of cycles) {
      if (new Date(c.start).getTime() < windowStart) continue;
      m.set(c.vehicleId, [...(m.get(c.vehicleId) ?? []), c]);
    }
    return [...m.entries()].slice(0, 12);
  }, [cycles, windowStart]);
  const mins = cycles.map(total);
  const hist = [20, 25, 30, 35, 40, 45, 50].map((b, i, a) => ({ b: i === 0 ? `<${b}` : `${a[i - 1]}–${b}`, n: mins.filter((m) => (i === 0 ? m < b : m >= a[i - 1] && m < b)).length }));
  const tx = txs?.items ?? [];
  const sumT = (op: Transaction["operation"]) => tx.filter((t) => t.operation === op).reduce((a, t) => a + (t.netKg ?? 0), 0) / 1000;
  const internalT = sumT("INTERNAL") + cycles.filter((c) => new Date(c.start).getTime() > now - 24 * 3600_000).reduce((a, c) => a + c.payloadKg, 0) / 1000;
  const shiftT = (code: string) => tx.filter((t) => t.shiftCode === code && t.operation !== "RECEIVE").reduce((a, t) => a + (t.netKg ?? 0), 0) / 1000;
  return (
    <div>
      <PageHeader icon={<Activity className="size-5" />} title={L("KPI ناوگان و تولید", "Fleet & production KPIs")} subtitle={L("چرخه کامیون‌های داخلی معدن، هدف/واقعی شیفت و سه جمع جدا: جابه‌جایی داخلی، ارسال به سایت، فروش", "Internal haul-truck cycles, shift target vs actual and three separate totals: internal moves, site transfers, sales")} />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
        <KpiTile label={L("چرخه‌ها (۸ ساعت)", "Cycles (8 h)")} value={fmtNum(byVehicle.reduce((a, [, c]) => a + c.length, 0), locale)} />
        <KpiTile label={L("میانگین زمان چرخه", "Avg cycle time")} value={fmtNum(avg(mins), locale, { maximumFractionDigits: 1 })} unit={L("دقیقه", "min")} tone="info" />
        <KpiTile label={L("P95 صف لودر", "P95 loader queue")} value={fmtNum(percentile(cycles.map((c) => c.queueMin), 95), locale, { maximumFractionDigits: 1 })} unit={L("دقیقه", "min")} tone="warning" />
        <KpiTile label={L("میانگین Payload", "Avg payload")} value={fmtT((avg(cycles.map((c) => c.payloadKg)) ?? 0) / 1000, locale)} unit="t" tone="success" />
        <KpiTile label={L("کامیون فعال", "Active trucks")} value={fmtNum(byVehicle.length, locale)} />
      </div>
      <div className="mb-4 grid gap-4 md:grid-cols-3">
        {[
          { fa: "جابه‌جایی داخل معدن", en: "Internal mine moves", t: internalT, tone: "#7c3aed", hint: L("کامیون‌های داخلی؛ وارد فروش نمی‌شود", "Internal trucks; never counted as sales") },
          { fa: "ارسال به سایت/کارخانه", en: "Site / plant transfers", t: sumT("TRANSFER"), tone: "#0891b2", hint: L("حواله انتقال بین سایت‌ها", "Inter-site transfer permits") },
          { fa: "فروش (خروج تجاری)", en: "Sales (commercial out)", t: sumT("DISPATCH"), tone: "#168567", hint: L("فقط تیکت‌های تأییدشده قانونی", "Approved legal tickets only") },
        ].map((x) => (
          <Card key={x.en} className="p-4">
            <div className="text-sm text-muted">{L(x.fa, x.en)} · {L("۲۴ ساعت", "24 h")}</div>
            <div className="num mt-1 text-3xl font-black" style={{ color: x.tone }}>
              {fmtT(x.t, locale)} <span className="text-base font-normal text-muted">t</span>
            </div>
            <div className="mt-1 text-xs text-muted">{x.hint}</div>
          </Card>
        ))}
      </div>
      <Card className="mb-4">
        <CardHeader
          title={L("گانت چرخه‌ها — ۸ ساعت اخیر", "Cycle Gantt — last 8 hours")}
          actions={
            <div className="flex flex-wrap gap-2 text-xs">
              {PHASES.map((p) => (
                <span key={p.key} className="flex items-center gap-1">
                  <span className="inline-block size-3 rounded-sm" style={{ background: p.color }} />
                  {L(p.fa, p.en)}
                </span>
              ))}
            </div>
          }
        />
        {!data ? (
          <Skeleton className="m-4 h-72" />
        ) : (
          <div className="p-3" dir="ltr">
            <div className="mb-1 ms-[120px] flex justify-between text-[10px] text-muted">
              {Array.from({ length: 9 }, (_, i) => (
                <span key={i}>{fmtTime(windowStart + i * 3600_000, locale)}</span>
              ))}
            </div>
            {byVehicle.map(([vid, cs]) => {
              const veh = masters?.vehicles.find((v) => v.id === vid);
              return (
                <div key={vid} className="flex items-center gap-2 py-0.5">
                  <div className="w-[112px] shrink-0">{veh ? <IranPlate plate={veh.plate} size="xs" /> : vid}</div>
                  <div className="relative h-5 flex-1 rounded bg-surface-2">
                    {cs.map((c) => {
                      let t = new Date(c.start).getTime();
                      return PHASES.map((p) => {
                        const w = c[p.key] * 60_000;
                        const left = ((t - windowStart) / (8 * 3600_000)) * 100;
                        const width = (w / (8 * 3600_000)) * 100;
                        t += w;
                        return <span key={c.id + p.key} className="absolute top-0 h-full" style={{ left: `${left}%`, width: `${width}%`, background: p.color }} title={`${L(p.fa, p.en)} ${c[p.key]} min`} />;
                      });
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title={L("هیستوگرام زمان چرخه", "Cycle time histogram")} />
          <div className="p-3">
            <Bars data={hist} x="b" series={[{ key: "n", name: L("چرخه", "Cycles"), color: "#1273a6" }]} height={220} />
          </div>
        </Card>
        <Card>
          <CardHeader title={L("هدف / واقعی شیفت‌ها", "Shift target vs actual")} />
          <div className="grid grid-cols-3 gap-2 p-3">
            {(masters?.shifts ?? []).map((s) => (
              <Gauge key={s.id} value={Math.round(shiftT(s.code))} max={s.targetTons} label={locale === "fa" ? s.name : s.nameEn} sub={`${fmtNum(Math.round(shiftT(s.code)), locale)} / ${fmtNum(s.targetTons, locale)} t`} />
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title={L("بانکر و دوزینگ (فقط‌خواندنی)", "Bunker & dosing (read-only)")} icon={<Factory className="size-4" />} subtitle={L("افزونه — داده از PLC کارخانه", "Add-on — data from plant PLC")} />
          <div className="flex flex-col gap-3 p-4">
            {[
              { n: "BN-1", m: L("سنگ آهن دانه‌بندی", "Sized iron ore"), lvl: 62 + Math.round(Math.sin(now / 6e5) * 10), ratio: 70 },
              { n: "BN-2", m: L("کنسانتره", "Concentrate"), lvl: 38 + Math.round(Math.cos(now / 5e5) * 8), ratio: 25 },
              { n: "BN-3", m: L("آهک", "Limestone"), lvl: 14, ratio: 5 },
            ].map((b) => (
              <div key={b.n}>
                <div className="flex items-center justify-between text-sm">
                  <span>
                    <span className="font-mono text-xs text-muted">{b.n}</span> {b.m}
                  </span>
                  <span className="flex items-center gap-2">
                    <Badge tone="info">{fmtNum(b.ratio, locale)}% {L("نسبت", "ratio")}</Badge>
                    <span className="num font-bold">{fmtNum(b.lvl, locale)}%</span>
                  </span>
                </div>
                <Progress value={b.lvl} tone={b.lvl < 20 ? "danger" : b.lvl < 40 ? "warning" : "success"} />
              </div>
            ))}
            <div className="text-[11px] text-muted">{L("نمایش فقط‌خواندنی؛ هیچ فرمانی به کارخانه ارسال نمی‌شود.", "Read-only view; no commands are sent to the plant.")}</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
