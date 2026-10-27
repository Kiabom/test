"use client";
import { Activity, AlertTriangle, ArrowDownToLine, ArrowUpFromLine, Clock, Gauge as GaugeIcon, LayoutDashboard, Receipt, Scale, ShieldAlert, Truck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AreaSeries, Bars, Donut, Gauge, PALETTE } from "@/components/charts";
import { IranPlate } from "@/components/domain/IranPlate";
import { CameraFeed } from "@/components/hardware/CameraFeed";
import { Badge, Card, CardHeader, KpiTile, PageHeader, Progress, Segmented, Skeleton, StatusPill, Table, Td } from "@/components/ui";
import { lbl, OPERATION, SEVERITY, TX_STATE } from "@/i18n/labels";
import { fmtNum, fmtPct, fmtRelative, fmtT, fmtTime, weekdayHour } from "@/lib/format";
import { useLive, useMasters, useNow, useView } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import type { DashboardData } from "@/server/views";

export default function DashboardPage() {
  const L = useL();
  const locale = useLocale();
  const [range, setRange] = useState<"today" | "7d">("today");
  const { data } = useView<DashboardData>("dashboard", { range }, 3000);
  const masters = useMasters();
  const live = useLive();
  const now = useNow(1000);
  const mat = (id: string) => masters?.materials.find((m) => m.id === id);
  const k = data?.kpis;
  const hourly = (data?.hourly ?? []).map((h) => ({ ...h, label: fmtNum(h.hour, locale), outT: Number(h.outT.toFixed(1)), inT: Number(h.inT.toFixed(1)) }));
  const daily = (data?.daily ?? []).map((d) => ({ ...d, label: weekdayHour(d.day, locale), outT: Number(d.outT.toFixed(0)), inT: Number(d.inT.toFixed(0)) }));
  const shiftTarget = data?.shiftTotals.find((s) => s.code === data.currentShift);

  return (
    <div>
      <PageHeader
        icon={<LayoutDashboard className="size-5" />}
        title={L("داشبورد عملیات", "Operations dashboard")}
        subtitle={L("سایت مرکزی معدن سنگ آهن — تناژ، سفر، صف و هشدارها به‌صورت زنده", "Central iron-ore site — tonnage, trips, queues and alerts in real time")}
        actions={
          <>
            <Segmented options={[{ id: "today", label: L("امروز", "Today") }, { id: "7d", label: L("۷ روز", "7 days") }]} value={range} onChange={setRange} />
            <Badge tone="success">
              ● {L("آخرین بروزرسانی", "Updated")} {live ? fmtRelative(live.now, locale, now) : "—"}
            </Badge>
          </>
        }
      />
      {!data ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
            <KpiTile label={L("خروجی (فروش)", "Outbound")} value={fmtT(k!.outboundT, locale)} unit="t" icon={<ArrowUpFromLine className="size-4" />} spark={hourly.map((h) => h.outT)} />
            <KpiTile label={L("ورودی (خرید)", "Inbound")} value={fmtT(k!.inboundT, locale)} unit="t" icon={<ArrowDownToLine className="size-4" />} tone="info" />
            <KpiTile label={L("خالص تأییدشده", "Net approved")} value={fmtT(k!.netApprovedT, locale)} unit="t" icon={<Scale className="size-4" />} tone="success" />
            <KpiTile label={L("سفرهای کامل", "Completed trips")} value={fmtNum(k!.tripsCompleted, locale)} icon={<Truck className="size-4" />} tone="primary" spark={hourly.map((h) => h.trucksOut)} />
            <KpiTile label={L("داخل سایت", "On site")} value={fmtNum(live?.activeIds.length ?? k!.onSite, locale)} icon={<Activity className="size-4" />} tone="info" />
            <KpiTile label={L("تیکت معلق", "Pending tickets")} value={fmtNum(k!.pendingTickets, locale)} icon={<Receipt className="size-4" />} tone="warning" />
            <KpiTile label={L("هشدار باز", "Open alerts")} value={fmtNum(live?.openAlerts ?? k!.openAlerts, locale)} icon={<AlertTriangle className="size-4" />} tone={live?.criticalAlerts ? "danger" : "warning"} />
            <KpiTile label={L("باسکول‌های آماده", "Scales ready")} value={`${fmtNum(k!.scalesReady, locale)}/${fmtNum(k!.scalesTotal, locale)}`} icon={<GaugeIcon className="size-4" />} tone={k!.scalesReady < k!.scalesTotal ? "warning" : "success"} />
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader title={range === "today" ? L("تناژ ساعتی امروز", "Hourly tonnage today") : L("تناژ روزانه ۷ روز اخیر", "Daily tonnage, last 7 days")} subtitle={L("خط چین: هدف ساعتی شیفت جاری", "Dashed: current shift hourly target")} />
              <div className="p-3">
                {range === "today" ? (
                  <AreaSeries data={hourly} x="label" unit="t" target={shiftTarget ? shiftTarget.target / 8 : undefined} series={[{ key: "outT", name: L("خروجی", "Outbound"), color: PALETTE[0] }, { key: "inT", name: L("ورودی", "Inbound"), color: PALETTE[1] }]} />
                ) : (
                  <Bars data={daily} x="label" unit="t" stacked series={[{ key: "outT", name: L("خروجی", "Outbound"), color: PALETTE[0] }, { key: "inT", name: L("ورودی", "Inbound"), color: PALETTE[1] }]} height={240} />
                )}
              </div>
            </Card>
            <Card>
              <CardHeader title={L("ترکیب مواد", "Material mix")} subtitle={L("تن خالص تأییدشده", "Approved net tonnes")} />
              <div className="p-2">
                <Donut unit="t" data={data.materialMix.map((m) => ({ name: (locale === "fa" ? mat(m.id)?.name : mat(m.id)?.nameEn) ?? m.id, value: Number(m.tons.toFixed(1)), color: mat(m.id)?.color }))} />
              </div>
            </Card>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <Card>
              <CardHeader title={L("پیشرفت هدف شیفت‌ها", "Shift targets")} subtitle={L("خروجی تأییدشده در برابر هدف", "Approved outbound vs target")} />
              <div className="grid grid-cols-3 gap-2 p-4">
                {data.shiftTotals.map((s) => (
                  <Gauge key={s.code} value={s.tons} max={s.target} label={`${locale === "fa" ? s.name : s.nameEn}${s.code === data.currentShift ? " ●" : ""}`} sub={`${fmtNum(s.tons, locale, { maximumFractionDigits: 0 })} / ${fmtNum(s.target, locale)} t`} />
                ))}
              </div>
            </Card>
            <Card>
              <CardHeader title={L("قیف جریان کامیون‌ها", "Truck flow funnel")} />
              <div className="flex flex-col gap-2.5 p-4">
                {[
                  ["arrived", L("رسیده", "Arrived")],
                  ["entered", L("وارد شده", "Entered")],
                  ["firstWeighed", L("وزن اول", "1st weigh")],
                  ["secondWeighed", L("وزن دوم", "2nd weigh")],
                  ["exited", L("خارج شده", "Exited")],
                ].map(([key, name], i) => {
                  const v = data.funnel[key as keyof typeof data.funnel];
                  const pct = data.funnel.arrived ? (v / data.funnel.arrived) * 100 : 0;
                  return (
                    <div key={key}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span>{name}</span>
                        <span className="num font-semibold">{fmtNum(v, locale)}</span>
                      </div>
                      <div className="h-6 rounded-md bg-surface-2">
                        <div className="h-6 rounded-md" style={{ width: `${pct}%`, background: PALETTE[i], opacity: 0.85 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
            <Card>
              <CardHeader title={L("شاخص‌های کیفیت و کنترل", "Quality & control KPIs")} />
              <div className="grid grid-cols-2 gap-3 p-4 text-sm">
                {[
                  [L("Turnaround میانه (P50)", "Turnaround P50"), k!.turnaroundP50 != null ? `${fmtNum(k!.turnaroundP50, locale, { maximumFractionDigits: 0 })} ${L("دقیقه", "min")}` : "—"],
                  [L("Turnaround P90", "Turnaround P90"), k!.turnaroundP90 != null ? `${fmtNum(k!.turnaroundP90, locale, { maximumFractionDigits: 0 })} ${L("دقیقه", "min")}` : "—"],
                  [L("میانگین انتظار صف", "Avg queue wait"), k!.queueAvg != null ? `${fmtNum(k!.queueAvg, locale, { maximumFractionDigits: 1 })} ${L("دقیقه", "min")}` : "—"],
                  [L("نرخ اضافه‌بار", "Overload rate"), fmtPct(k!.overloadRatePct, locale)],
                  [L("نرخ بازبینی ANPR", "ANPR review rate"), fmtPct(k!.anprReviewRatePct, locale)],
                  [L("مغایرت RFID", "RFID mismatches"), fmtNum(k!.unmatchedRfid, locale)],
                  [L("سهم ثبت دستی", "Manual entry share"), fmtPct(k!.manualSharePct, locale)],
                  [L("پوشش شواهد تصویری", "Photo evidence coverage"), fmtPct(k!.coveragePct, locale)],
                ].map(([a, b]) => (
                  <div key={a} className="rounded-lg bg-surface-2 p-2.5">
                    <div className="text-[11px] text-muted">{a}</div>
                    <div className="num mt-0.5 font-bold">{b}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader title={L("آخرین سفرها", "Latest trips")} actions={<Link href="/app/transactions" className="text-xs text-primary">{L("همه", "All")} ←</Link>} />
              <Table head={[L("تصویر", "Photo"), L("پلاک", "Plate"), L("تیکت", "Ticket"), L("ماده", "Material"), L("عملیات", "Operation"), L("خالص", "Net"), L("زمان", "Time"), L("وضعیت", "Status")]}>
                {data.recent.map((t) => (
                  <tr key={t.id} className="hover:bg-surface-2">
                    <Td>
                      <Link href={`/app/transactions/${t.id}`}>
                        <CameraFeed view="front" seed={t.evidenceSeed} plate={t.plate} color={t.vehicleColor} className="w-20" compact rec={false} showBox={false} />
                      </Link>
                    </Td>
                    <Td>
                      <IranPlate plate={t.plate} size="sm" />
                    </Td>
                    <Td className="num font-mono text-xs">
                      <Link href={`/app/transactions/${t.id}`} className="text-primary hover:underline">
                        {t.ticketNo}
                      </Link>
                    </Td>
                    <Td>{(locale === "fa" ? mat(t.materialId)?.name : mat(t.materialId)?.nameEn) ?? "—"}</Td>
                    <Td>{lbl(OPERATION, t.operation, locale)}</Td>
                    <Td className="num font-semibold">{t.netKg != null ? fmtNum(t.netKg, locale) : "—"}</Td>
                    <Td className="num">{fmtTime(t.at, locale)}</Td>
                    <Td>
                      <StatusPill status={t.state === "APPROVED" ? "PASS" : t.state === "EXCEPTION" ? "HOLD" : t.state === "VOIDED" ? "BLOCK" : "REVIEW"} label={lbl(TX_STATE, t.state, locale)} />
                    </Td>
                  </tr>
                ))}
              </Table>
            </Card>
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader title={L("هشدارهای باز", "Open alerts")} icon={<AlertTriangle className="size-4" />} actions={<Link href="/app/alerts" className="text-xs text-primary">{L("مرکز هشدار", "Alerts")} ←</Link>} />
                <ul className="divide-y divide-border">
                  {(live?.latestAlerts ?? []).map((a) => (
                    <li key={a.id} className="flex items-center gap-2 px-4 py-2 text-sm">
                      <Badge tone={a.severity === "CRITICAL" || a.severity === "HIGH" ? "danger" : a.severity === "WARNING" ? "warning" : "info"}>{lbl(SEVERITY, a.severity, locale)}</Badge>
                      <span className="flex-1 truncate">{locale === "fa" ? a.title : a.titleEn}</span>
                      <span className="num text-[11px] text-muted">{fmtRelative(a.openedAt, locale, now)}</span>
                    </li>
                  ))}
                  {!live?.latestAlerts.length && <li className="px-4 py-6 text-center text-sm text-muted">{L("هشدار بازی نیست", "No open alerts")}</li>}
                </ul>
              </Card>
              <Card>
                <CardHeader title={L("پنل ریسک (تقلب)", "Risk panel (fraud)")} icon={<ShieldAlert className="size-4" />} actions={<Link href="/app/fraud" className="text-xs text-primary">{L("بازبینی", "Review")} ←</Link>} />
                <ul className="divide-y divide-border">
                  {data.risk.map((r) => (
                    <li key={r.id} className="px-4 py-2.5 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">{locale === "fa" ? r.title : r.titleEn}</span>
                        <span className="num text-xs font-bold text-danger">{Math.round(r.score * 100)}</span>
                      </div>
                      <Progress value={r.score * 100} tone={r.score > 0.75 ? "danger" : "warning"} className="mt-1.5 h-1.5" />
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader title={L("تفکیک شعب", "By branch")} />
              <div className="flex flex-col gap-3 p-4">
                {data.branches.map((b) => (
                  <div key={b.id} className="flex items-center justify-between rounded-lg bg-surface-2 p-3 text-sm">
                    <span>{locale === "fa" ? b.name : b.nameEn}</span>
                    <span className="num font-bold">
                      {fmtNum(b.tons, locale, { maximumFractionDigits: 0 })} t · {fmtNum(b.trips, locale)} {L("سفر", "trips")}
                    </span>
                  </div>
                ))}
                <div className="text-[11px] text-muted">{L("داده شعبه دوم نمونه/تجمیعی است", "Second branch data is illustrative")}</div>
              </div>
            </Card>
            <Card>
              <CardHeader title={L("حمل‌کننده‌ها", "Carriers")} />
              <div className="p-2">
                <Bars layout="vertical" data={data.byCarrier.map((c) => ({ name: locale === "fa" ? c.name : c.nameEn, tons: Number(c.tons.toFixed(0)) }))} x="name" unit="t" series={[{ key: "tons", name: L("تن", "t"), color: PALETTE[2] }]} height={210} />
              </div>
            </Card>
            <Card>
              <CardHeader title={L("عملکرد اپراتورها", "Operator performance")} icon={<Clock className="size-4" />} />
              <Table head={[L("اپراتور", "Operator"), L("توزین", "Captures"), L("دستی", "Manual")]}>
                {data.byOperator.map((o) => (
                  <tr key={o.id}>
                    <Td>{locale === "fa" ? o.name : o.nameEn}</Td>
                    <Td className="num">{fmtNum(o.captures, locale)}</Td>
                    <Td className="num">
                      {fmtNum(o.manual, locale)} {o.captures ? <span className="text-muted">({fmtPct((o.manual / o.captures) * 100, locale)})</span> : null}
                    </Td>
                  </tr>
                ))}
              </Table>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
