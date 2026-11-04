"use client";
import { AlertTriangle, ArrowLeft, Clock, ExternalLink, Gauge as GaugeIcon, ShieldCheck, Truck, Workflow } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { CONTROLS } from "@/components/marketing/content";
import { Badge, Card, CardHeader, cx, KpiTile, PageHeader, Skeleton } from "@/components/ui";
import type { StationKey } from "@/domain/geo";
import { JOURNEY_STEPS } from "@/domain/journey";
import { fmtNum } from "@/lib/format";
import { useView } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import type { ProcessData } from "@/server/views";

const SiteOverviewMap = dynamic(() => import("@/components/map/SiteOverviewMap"), { ssr: false, loading: () => <Skeleton className="h-full w-full" /> });
const NUMBERS: Partial<Record<StationKey, number>> = { approach: 0, A: 1, parking: 2, B: 3, "L-01": 4, "L-02": 4, "SH-01": 4, D: 5, C: 6, E: 8 };

/** Owner's view: every step of the truck process — what happens, who/what does it, controls, and today's numbers. */
export default function ProcessPage() {
  const L = useL();
  const locale = useLocale();
  const { data } = useView<ProcessData>("process", {}, 10_000);
  const byId = new Map(data?.steps.map((s) => [s.id, s]) ?? []);
  const maxFunnel = Math.max(1, ...(data?.funnel.map((f) => f.count) ?? [1]));
  return (
    <div>
      <PageHeader
        icon={<Workflow className="size-5" />}
        title={L("فرآیند و مراحل — نمای معدن‌دار", "Process & steps — owner's view")}
        subtitle={L("هر کامیون از نوبت تا تحویل از ۱۰ مرحله می‌گذرد. برای هر مرحله: چه اتفاقی می‌افتد، چه کسی یا چه دستگاهی انجامش می‌دهد، کدام کنترل ضدتقلب اعمال می‌شود و آمار امروز.", "Every truck passes 10 steps from booking to delivery. For each: what happens, who or what does it, which anti-fraud control applies, and today's numbers.")}
      />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiTile label={L("خالص تأییدشده امروز", "Approved net today")} value={fmtNum(data?.netTonsToday, locale)} unit="t" tone="success" icon={<Truck className="size-4" />} />
        <KpiTile label={L("الان داخل معدن", "On site now")} value={fmtNum(data ? data.steps.filter((s) => !["BOOK", "DELIVER"].includes(s.id)).reduce((a, s) => a + s.now, 0) : null, locale)} tone="primary" />
        <KpiTile label={L("الان در جاده", "On the road now")} value={fmtNum(byId.get("DELIVER")?.now, locale)} tone="info" />
        <KpiTile
          label={L("گلوگاه امروز", "Today's bottleneck")}
          value={data?.bottleneck ? L(JOURNEY_STEPS.find((s) => s.id === data.bottleneck!.step)!.fa, JOURNEY_STEPS.find((s) => s.id === data.bottleneck!.step)!.en) : "—"}
          hint={data?.bottleneck ? L(`میانگین ${fmtNum(data.bottleneck.avgMin, locale)} دقیقه`, `avg ${data.bottleneck.avgMin} min`) : undefined}
          tone="warning"
          icon={<GaugeIcon className="size-4" />}
        />
      </div>

      <Card className="mb-4">
        <CardHeader title={L("قیف امروز", "Today's funnel")} subtitle={L("از نوبت تا تحویل؛ فاصله بین ستون‌ها = کامیون‌هایی که هنوز در راه‌اند یا متوقف شده‌اند", "From booking to delivery; the gap between bars = trucks still in progress or stopped")} />
        {!data ? (
          <Skeleton className="m-4 h-32" />
        ) : (
          <div className="grid grid-cols-6 items-end gap-2 p-4">
            {data.funnel.map((f, i) => (
              <div key={f.key} className="flex flex-col items-center gap-1 text-center">
                <div className="num text-lg font-black">{fmtNum(f.count, locale)}</div>
                <div className="w-full rounded-t-lg bg-primary/80" style={{ height: `${Math.max(6, (f.count / maxFunnel) * 120)}px`, opacity: 1 - i * 0.08 }} />
                <div className="text-[11px] leading-4 text-muted">{L(f.fa, f.en)}</div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {JOURNEY_STEPS.map((s, i) => {
          const st = byId.get(s.id);
          const bottleneck = data?.bottleneck?.step === s.id;
          return (
            <Card key={s.id} className={cx("relative flex flex-col p-3", bottleneck && "ring-2 ring-warning")}>
              <div className="flex items-center justify-between">
                <span className="grid size-9 place-items-center rounded-full bg-primary text-lg font-black text-white">{fmtNum(s.n, locale)}</span>
                <div className="flex gap-1">
                  {st && st.now > 0 && (
                    <Badge tone="primary">
                      {fmtNum(st.now, locale)} {L("کامیون", "trucks")}
                    </Badge>
                  )}
                  {st && st.exceptions > 0 && (
                    <Badge tone="danger">
                      <AlertTriangle className="size-3" /> {fmtNum(st.exceptions, locale)}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="mt-2 font-bold">{L(s.fa, s.en)}</div>
              <div className="mt-1 flex-1 text-xs leading-6 text-muted">{L(...s.ownerWhat)}</div>
              <div className="mt-2 space-y-1 text-[11px]">
                <div>
                  <b>{L("مسئول: ", "Owner: ")}</b>
                  {L(...s.role)}
                </div>
                <div>
                  <b>{L("تجهیزات: ", "Devices: ")}</b>
                  {s.devices.map((x) => L(...x)).join("، ")}
                </div>
                <div>
                  <b>{L("خروجی: ", "Output: ")}</b>
                  {L(...s.output)}
                </div>
                {st?.avgMin != null && (
                  <div className={cx("flex items-center gap-1", bottleneck && "font-bold text-warning")}>
                    <Clock className="size-3" />
                    {L(`میانگین امروز ${fmtNum(st.avgMin, locale)} دقیقه`, `Today's avg ${st.avgMin} min`)}
                    {bottleneck && ` — ${L("گلوگاه", "bottleneck")}`}
                  </div>
                )}
              </div>
              {s.controls.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {s.controls.map((c) => {
                    const ctl = CONTROLS.find((x) => x.n === c);
                    return (
                      <span key={c} title={ctl ? L(ctl.dfa, ctl.den) : c} className="inline-flex items-center gap-1 rounded-md bg-success/10 px-1.5 py-0.5 text-[10px] font-semibold text-success">
                        <ShieldCheck className="size-3" /> {c} {ctl ? L(ctl.fa, ctl.en) : ""}
                      </span>
                    );
                  })}
                </div>
              )}
              <Link href={s.page} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                {L("صفحه عملیات", "Operations page")} <ExternalLink className="size-3" />
              </Link>
              {i < JOURNEY_STEPS.length - 1 && <ArrowLeft className="absolute -start-2.5 top-1/2 hidden size-4 text-muted ltr:rotate-180 xl:block" />}
            </Card>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Card className="overflow-hidden">
          <CardHeader title={L("محل ایستگاه‌ها در معدن", "Where the stations are")} subtitle={L("شماره‌ها همان شماره تابلوهای سایت و مراحل بالا هستند", "Numbers match the site signs and the steps above")} actions={<Link href="/app/map" className="text-xs text-primary">{L("نقشه ناوگان و رویدادها ←", "Fleet & events map →")}</Link>} />
          <div className="h-[360px] p-2">
            <SiteOverviewMap locale={locale} numbers={NUMBERS} />
          </div>
        </Card>
        <Card>
          <CardHeader title={L("۱۰ کنترل ضدتقلب", "The 10 anti-fraud controls")} />
          <div className="divide-y divide-border">
            {CONTROLS.map((c) => (
              <div key={c.n} className="flex gap-3 px-4 py-2">
                <span className="num font-black text-primary">{c.n}</span>
                <div>
                  <div className="text-sm font-semibold">{L(c.fa, c.en)}</div>
                  <div className="text-xs text-muted">{L(c.dfa, c.den)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
