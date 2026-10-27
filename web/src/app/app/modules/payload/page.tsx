"use client";
import { Mountain, Truck } from "lucide-react";
import { useMemo } from "react";
import { Bars } from "@/components/charts";
import { IranPlate } from "@/components/domain/IranPlate";
import { Badge, Card, CardHeader, cx, KpiTile, PageHeader, Skeleton, StatusPill, Table, Td } from "@/components/ui";
import type { Equipment, PayloadEvent, Transaction } from "@/domain/types";
import { payloadVariancePct } from "@/domain/kpi";
import { fmtKg, fmtNum, fmtPct, fmtTime } from "@/lib/format";
import { useData, useLive, useMasters, useNow } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import type { VisitBrief } from "@/server/views";

const EQ_TONE = { WORKING: "success", IDLE: "warning", DOWN: "danger" } as const;

export default function PayloadModulePage() {
  const L = useL();
  const locale = useLocale();
  const live = useLive();
  const masters = useMasters();
  const { data } = useData<PayloadEvent>("payloadEvents", { limit: 400 }, 4000);
  const { data: txs } = useData<Transaction>("transactions", { limit: 3000 }, 15000);
  const events = data?.items ?? [];
  const netByVisit = useMemo(() => new Map((txs?.items ?? []).map((t) => [t.visitId, t.netKg])), [txs]);
  const loading = (live?.activeIds ?? []).map((id) => live!.visits[id]).filter((v) => v?.state === "LOADING");
  const variances = events.map((e) => (e.visitId && netByVisit.get(e.visitId) ? payloadVariancePct(e.payloadKg, netByVisit.get(e.visitId)!) : null)).filter((x): x is number => x != null);
  const hist = [-8, -4, -2, 0, 2, 4, 8].map((b, i, a) => ({ b: i === 0 ? `<${b}` : `${a[i - 1]}…${b}`, n: variances.filter((v) => (i === 0 ? v < b : v >= a[i - 1] && v < b)).length }));
  const equipment = masters?.equipment ?? [];
  return (
    <div>
      <PageHeader icon={<Mountain className="size-5" />} title={L("Payload لودر و شاول", "Loader & shovel payload")} subtitle={L("وزن سطل‌به‌سطل از سیستم توزین روی بیل (تخمینی)، صف کار لودر و مقایسه با خالص باسکول — R34 در اختلاف بیش از ۸٪", "Bucket-by-bucket on-board weighing (estimated), loader work queue and comparison with scale net — R34 above 8% gap")} />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiTile label={L("بارگیری‌ها", "Loads")} value={fmtNum(events.length, locale)} />
        <KpiTile label={L("میانگین سطل در هر بار", "Avg buckets/load")} value={fmtNum(events.reduce((a, e) => a + e.buckets.length, 0) / (events.length || 1), locale, { maximumFractionDigits: 1 })} tone="info" />
        <KpiTile label={L("میانگین انحراف از باسکول", "Avg gap to scale")} value={fmtPct(variances.reduce((a, v) => a + Math.abs(v), 0) / (variances.length || 1), locale)} tone="warning" />
        <KpiTile label={L("در حال بارگیری", "Loading now")} value={fmtNum(loading.length, locale)} tone="success" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {equipment.filter((e) => e.type !== "EXCAVATOR" || e.status !== "DOWN").slice(0, 3).map((eq) => (
          <CabDisplay key={eq.id} eq={eq} current={loading.find((v) => v.loadingEquipmentId === eq.id)} last={events.find((e) => e.equipmentId === eq.id)} />
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title={L("صف کار لودرها", "Loader work queue")} subtitle={L("کامیون‌های داخل سایت که منتظر یا در حال بارگیری‌اند", "Trucks on site waiting for or being loaded")} />
          <div className="grid gap-3 p-3 md:grid-cols-2">
            {equipment.map((eq) => {
              const q = loading.filter((v) => v.loadingEquipmentId === eq.id);
              return (
                <div key={eq.id} className="rounded-xl border border-border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-bold">{locale === "fa" ? eq.name : eq.nameEn}</span>
                    <Badge tone={EQ_TONE[eq.status]}>{eq.status}</Badge>
                  </div>
                  {q.length === 0 ? (
                    <div className="text-xs text-muted">{eq.status === "DOWN" ? L("خارج از سرویس — تعمیرات", "Out of service — maintenance") : L("صف خالی", "Queue empty")}</div>
                  ) : (
                    q.map((v, i) => (
                      <div key={v.id} className="flex items-center justify-between gap-2 py-1">
                        <span className="num text-xs text-muted">{i === 0 ? L("در حال بارگیری", "Loading") : `#${i + 1}`}</span>
                        <IranPlate plate={v.plate} size="xs" />
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <CardHeader title={L("انحراف Payload از خالص باسکول", "Payload vs scale net deviation")} subtitle={L("مثبت = تخمین بیشتر از باسکول", "Positive = estimate above scale")} />
          <div className="p-3">
            <Bars data={hist} x="b" series={[{ key: "n", name: L("تعداد", "Count"), color: "#7c3aed" }]} height={240} unit="%" />
          </div>
        </Card>
      </div>
      <Card className="mt-4">
        <CardHeader title={L("رویدادهای Payload", "Payload events")} />
        {!data ? (
          <Skeleton className="m-4 h-64" />
        ) : (
          <Table head={[L("زمان", "Time"), L("تجهیز", "Equipment"), L("پلاک", "Plate"), L("سطل‌ها", "Buckets"), "Payload", L("خالص باسکول", "Scale net"), L("انحراف", "Gap")]} dense>
            {events.slice(0, 80).map((e) => {
              const net = e.visitId ? netByVisit.get(e.visitId) : undefined;
              const v = net ? payloadVariancePct(e.payloadKg, net) : null;
              const veh = masters?.vehicles.find((x) => x.id === e.vehicleId);
              return (
                <tr key={e.id}>
                  <Td className="num text-xs">{fmtTime(e.at, locale)}</Td>
                  <Td className="text-xs">{equipment.find((x) => x.id === e.equipmentId)?.code}</Td>
                  <Td>{veh && <IranPlate plate={veh.plate} size="xs" />}</Td>
                  <Td>
                    <div className="flex items-end gap-0.5">
                      {e.buckets.map((b, i) => (
                        <span key={i} className="w-2 rounded-sm bg-primary/70" style={{ height: Math.max(4, b / 800) }} title={fmtKg(b, locale)} />
                      ))}
                    </div>
                  </Td>
                  <Td>
                    <StatusPill status="ESTIMATED" label={fmtKg(e.payloadKg, locale)} />
                  </Td>
                  <Td className="num">{fmtKg(net, locale)}</Td>
                  <Td className={cx("num", v != null && Math.abs(v) > 8 && "font-bold text-danger")}>{v == null ? "N/A" : `${v > 0 ? "+" : ""}${v.toFixed(1)}%`}</Td>
                </tr>
              );
            })}
          </Table>
        )}
      </Card>
    </div>
  );
}

/** Mock of the in-cab payload screen (dark, glove-friendly). */
function CabDisplay({ eq, current, last }: { eq: Equipment; current?: VisitBrief; last?: PayloadEvent }) {
  const L = useL();
  const locale = useLocale();
  const now = useNow(1500);
  const target = last?.targetKg ?? eq.ratedBucketKg * 4;
  const n = Math.max(2, Math.round(target / eq.ratedBucketKg));
  // while a truck is under the bucket, animate passes; otherwise show the last completed load
  const done = current ? Math.floor(now / 3000) % (n + 1) : last?.buckets.length ?? 0;
  const buckets = current ? Array.from({ length: done }, (_, i) => Math.round((target / n) * (0.94 + ((i * 37) % 11) / 100))) : last?.buckets ?? [];
  const sum = buckets.reduce((a, b) => a + b, 0);
  const pct = Math.min(1.2, sum / target);
  return (
    <div className="overflow-hidden rounded-2xl border-4 border-slate-700 bg-slate-950 p-4 text-slate-100 shadow-xl" dir="ltr">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-mono">{eq.code} · PAYLOAD</span>
        <span className={cx("rounded px-2 py-0.5 font-bold", eq.status === "WORKING" ? "bg-emerald-600/30 text-emerald-300" : eq.status === "IDLE" ? "bg-amber-600/30 text-amber-300" : "bg-red-600/30 text-red-300")}>{eq.status}</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Truck className="size-5 text-slate-400" />
        {current ? <IranPlate plate={current.plate} size="xs" /> : <span className="text-sm text-slate-500">{L("بدون کامیون", "No truck")}</span>}
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="font-mono text-4xl font-black tabular-nums text-emerald-300">{fmtNum(Math.round(sum / 100) / 10, "en")}</span>
        <span className="text-sm text-slate-400">/ {fmtNum(Math.round(target / 100) / 10, "en")} t</span>
      </div>
      <div className="mt-2 h-4 overflow-hidden rounded-full bg-slate-800">
        <div className={cx("h-full transition-all", pct > 1.05 ? "bg-red-500" : pct > 0.95 ? "bg-emerald-500" : "bg-sky-500")} style={{ width: `${Math.min(100, pct * 100)}%` }} />
      </div>
      <div className="mt-3 flex h-16 items-end gap-1.5">
        {Array.from({ length: n }, (_, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div className={cx("w-full rounded-t", buckets[i] ? "bg-sky-400" : "border border-dashed border-slate-700")} style={{ height: buckets[i] ? `${Math.min(100, (buckets[i] / eq.ratedBucketKg) * 85)}%` : "30%" }} />
            <span className="font-mono text-[10px] text-slate-500">{i + 1}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 text-center text-sm font-bold">
        {pct > 1.05 ? <span className="text-red-400">{L("اضافه‌بار — یک سطل کم کنید", "Overload — remove a bucket")}</span> : pct > 0.95 ? <span className="text-emerald-400">{L("هدف رسید — حرکت کنید", "Target reached — go")}</span> : <span className="text-sky-300">{L(`سطل بعدی: ${fmtNum(Math.round((target - sum) / 100) / 10, locale)} t باقی‌مانده`, `Next bucket: ${((target - sum) / 1000).toFixed(1)} t to go`)}</span>}
      </div>
    </div>
  );
}
