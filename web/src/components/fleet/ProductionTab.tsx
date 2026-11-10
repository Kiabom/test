"use client";
import { AlertTriangle, FileSpreadsheet, Trophy } from "lucide-react";
import { Button, Card, CardHeader, cx, Skeleton } from "@/components/ui";
import type { DateRangeValue } from "@/components/ui/DateRange";
import { clockNow } from "@/domain/clock";
import { emptyFilter, filterToQuery } from "@/domain/reportFilter";
import { lbl, OPERATION } from "@/i18n/labels";
import { downloadCsv } from "@/lib/export";
import { faDigits, fmtNum, fmtT } from "@/lib/format";
import { useMasters, useView } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import type { ProductionData } from "@/server/views";

const SHIFT_COLOR: Record<string, string> = { A: "#1273a6", B: "#b7791f", C: "#475569" };
const PALETTE = ["#1273a6", "#7c3aed", "#b7791f", "#168567", "#b42335", "#0891b2", "#64748b", "#d9480f"];
const STEPS = [
  { key: "queueMin", fa: "انتظار در صف لودر", en: "Waiting at loader", color: "#dc2626" },
  { key: "loadMin", fa: "بارگیری", en: "Loading", color: "#1273a6" },
  { key: "haulMin", fa: "حمل بار", en: "Hauling", color: "#7c3aed" },
  { key: "dumpMin", fa: "تخلیه", en: "Dumping", color: "#b7791f" },
  { key: "returnMin", fa: "برگشت خالی", en: "Empty return", color: "#16a34a" },
] as const;
const tone = (p: number) => (p >= 0.9 ? "#16a34a" : p >= 0.6 ? "#b7791f" : "#dc2626");

function Ring({ pct, size = 84 }: { pct: number; size?: number }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 -rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="11" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={tone(pct)} strokeWidth="11" strokeLinecap="round" strokeDasharray={`${c * Math.min(1, pct)} ${c}`} />
    </svg>
  );
}

/** Labelled stacked bar: one bar split into parts, with a legend row per part (tons and %). */
function SplitBar({ title, parts }: { title: string; parts: { label: string; tons: number; trips: number; color: string }[] }) {
  const locale = useLocale();
  const L = (a: string, b: string) => (locale === "fa" ? a : b);
  const total = parts.reduce((a, p) => a + p.tons, 0) || 1;
  return (
    <div>
      <div className="mb-2 text-sm font-semibold">{title}</div>
      <div className="flex h-6 overflow-hidden rounded-md bg-surface-2">
        {parts.map((p) => (
          <div key={p.label} style={{ width: `${(p.tons / total) * 100}%`, background: p.color }} title={`${p.label}: ${p.tons}`} />
        ))}
      </div>
      <ul className="mt-2 flex flex-col gap-1">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center gap-2 text-xs">
            <span className="size-2.5 shrink-0 rounded-sm" style={{ background: p.color }} />
            <span className="min-w-0 flex-1 truncate">{p.label}</span>
            <span className="num text-muted">
              {fmtNum(p.trips, locale)} {L("سفر", "trips")}
            </span>
            <span className="num w-20 text-end font-semibold">
              {fmtT(p.tons, locale)} {L("تن", "t")}
            </span>
            <span className="num w-9 text-end text-muted">{fmtNum(Math.round((p.tons / total) * 100), locale)}٪</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Production and shift performance for the selected period. */
export function ProductionTab({ range, fleet, carrierId }: { range: DateRangeValue; fleet?: string; carrierId?: string }) {
  const L = useL();
  const locale = useLocale();
  const masters = useMasters();
  const { data } = useView<ProductionData>("production", { from: range.from, to: range.to, fleet: fleet || undefined, carrierId: carrierId || undefined }, 30_000);
  if (!data || !masters) return <Skeleton className="h-[60vh]" />;
  const nm = (x?: { name: string; nameEn?: string }) => (x ? (locale === "fa" ? x.name : x.nameEn ?? x.name) : "—");
  const loc = (id: string) => nm(masters.locations.find((l) => l.id === id));
  const jDay = (day: string) => {
    const s = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { weekday: "short", month: "2-digit", day: "2-digit", timeZone: "Asia/Tehran" }).format(Date.parse(day + "T12:00:00Z"));
    return locale === "fa" ? s : day.slice(5);
  };
  const pct = (x: number) => `${fmtNum(Math.round(x * 100), locale)}٪`;
  const active = data.shifts.filter((s) => s.trips > 0);
  const best = [...active].sort((a, b) => b.attainment - a.attainment)[0];
  const worst = active.length > 1 ? [...active].sort((a, b) => a.attainment - b.attainment)[0] : undefined;
  const attain = data.target ? data.total / data.target : 0;
  const maxDay = Math.max(data.dailyTarget, ...data.matrix.map((m) => m.tons), 1);
  const maxHour = Math.max(...data.hourly.map((h) => h.tons), 1);
  const cycTotal = STEPS.reduce((a, s) => a + data.cycles[s.key], 0);
  const bottleneck = STEPS.reduce((a, s) => (data.cycles[s.key] > data.cycles[a.key] ? s : a), STEPS[0]);
  const cellHref = (day: string, shift: string) => {
    const from = new Date(Date.parse(day + "T00:00:00Z") - 210 * 60_000).toISOString();
    const to = new Date(Date.parse(day + "T00:00:00Z") - 210 * 60_000 + 864e5).toISOString();
    const q = filterToQuery({ ...emptyFilter(clockNow(), "custom"), from, to, shifts: [shift] });
    q.set("tpl", "daily");
    return `/print/report?${q.toString()}`;
  };
  const exportXls = () =>
    downloadCsv(
      "production-shifts.csv",
      [L("روز", "Day"), ...data.shifts.map((s) => `${nm(s)} (${L("تن", "t")})`), L("جمع روز (تن)", "Day total (t)"), L("هدف روز (تن)", "Day target (t)"), L("سفر", "Trips")],
      [...data.matrix.map((m) => [m.day, ...m.cells.map((c) => c.tons), m.tons, data.dailyTarget, m.trips]), [L("جمع دوره", "Period total"), ...data.shifts.map((s) => s.tons), data.total, data.target, data.trips]],
    );

  return (
    <div className="flex flex-col gap-4">
      {/* summary */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {[
          [L("تولید توزین‌شده", "Weighed output"), `${fmtT(data.total, locale)} ${L("تن", "t")}`, L(`هدف دوره ${fmtNum(data.target, "fa")} تن`, `Period target ${data.target} t`)],
          [L("تحقق هدف", "Target attainment"), pct(attain), L(`${fmtNum(data.days, "fa")} روز`, `${data.days} days`)],
          [L("تعداد سفر", "Trips"), fmtNum(data.trips, locale), L("بدون خرید", "purchases excluded")],
          [L("میانگین روزانه", "Daily average"), `${fmtT(data.total / data.days, locale)} ${L("تن", "t")}`, L(`هدف روز ${fmtNum(data.dailyTarget, "fa")} تن`, `Daily target ${data.dailyTarget} t`)],
          [L("بهترین شیفت", "Best shift"), best ? nm(best) : "—", best ? pct(best.attainment) : ""],
          [L("ضعیف‌ترین شیفت", "Weakest shift"), worst ? nm(worst) : "—", worst ? pct(worst.attainment) : ""],
        ].map(([k, v, h]) => (
          <Card key={k} className="p-3">
            <div className="text-[11px] text-muted">{k}</div>
            <div className="num mt-1 text-lg font-black">{v}</div>
            <div className="text-[10px] text-muted">{h}</div>
          </Card>
        ))}
      </div>

      {/* shift cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        {data.shifts.map((s) => (
          <Card key={s.code} className={cx("p-4", best?.code === s.code && "ring-1 ring-success/50", worst?.code === s.code && "ring-1 ring-danger/40")}>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Ring pct={s.attainment} />
                <span className="num absolute inset-0 grid place-items-center text-sm font-black">{pct(s.attainment)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 font-bold">
                  <span className="size-2.5 rounded-full" style={{ background: SHIFT_COLOR[s.code] }} />
                  {nm(s)}
                  <span className="num text-xs font-normal text-muted">
                    {fmtNum(s.startHour, locale)}–{fmtNum(s.endHour, locale)}
                  </span>
                </div>
                <div className="num mt-1 text-2xl font-black">
                  {fmtT(s.tons, locale)} <span className="text-xs font-normal text-muted">/ {fmtNum(s.target, locale)} {L("تن", "t")}</span>
                </div>
                {best?.code === s.code && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                    <Trophy className="size-3.5" /> {L("بهترین شیفت دوره", "Best shift")}
                  </span>
                )}
                {worst?.code === s.code && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-danger">
                    <AlertTriangle className="size-3.5" /> {L("نیاز به توجه", "Needs attention")}
                  </span>
                )}
              </div>
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              {[
                [L("سفر", "Trips"), fmtNum(s.trips, locale)],
                [L("میانگین بار", "Avg load"), `${fmtNum(s.avgNetT, locale)} ${L("تن", "t")}`],
                [L("زمان در سایت", "On site"), s.avgSiteMin == null ? "—" : `${fmtNum(s.avgSiteMin, locale)}′`],
                [L("اضافه‌بار", "Overloads"), fmtNum(s.overloads, locale)],
                [L("توقف / دستی", "Holds / manual"), `${fmtNum(s.holds, locale)} / ${fmtNum(s.manual, locale)}`],
                [L("خودرو / راننده", "Vehicles / drivers"), `${fmtNum(s.vehicles, locale)} / ${fmtNum(s.drivers, locale)}`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg bg-surface-2 px-2 py-1.5">
                  <dt className="text-[10px] text-muted">{k}</dt>
                  <dd className="num font-bold">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* day × shift */}
        <Card className="break-inside-avoid">
          <CardHeader
            title={L("نقشه روز × شیفت (تن)", "Day × shift map (t)")}
            subtitle={L("رنگ = تحقق هدف همان شیفت؛ روی هر خانه بزنید تا گزارش تیکت‌هایش باز شود", "Colour = attainment of that shift's target; click a cell for its tickets")}
            actions={
              <Button size="sm" onClick={exportXls}>
                <FileSpreadsheet className="size-4" /> Excel
              </Button>
            }
          />
          <div className="overflow-x-auto p-3">
            <table className="w-full text-center text-sm">
              <thead className="text-xs text-muted">
                <tr>
                  <th className="px-2 py-1.5 text-start font-medium">{L("روز", "Day")}</th>
                  {data.shifts.map((s) => (
                    <th key={s.code} className="px-2 py-1.5 font-medium">
                      {nm(s)}
                    </th>
                  ))}
                  <th className="px-2 py-1.5 font-medium">{L("جمع روز", "Day total")}</th>
                  <th className="px-2 py-1.5 font-medium">{L("تحقق", "Attain.")}</th>
                </tr>
              </thead>
              <tbody>
                {data.matrix.map((m) => (
                  <tr key={m.day}>
                    <td className="num whitespace-nowrap px-2 py-1 text-start text-xs">{jDay(m.day)}</td>
                    {m.cells.map((c) => (
                      <td key={c.code} className="p-1">
                        <a href={cellHref(m.day, c.code)} target="_blank" rel="noreferrer" className="num block rounded-md px-2 py-1.5 text-xs font-bold text-white" style={{ background: c.trips ? tone(c.attainment) : "var(--surface-2)", color: c.trips ? "#fff" : "var(--muted)" }} title={`${c.trips}`}>
                          {c.trips ? fmtNum(Math.round(c.tons), locale) : "—"}
                        </a>
                      </td>
                    ))}
                    <td className="num px-2 py-1 font-bold">{fmtNum(Math.round(m.tons), locale)}</td>
                    <td className="num px-2 py-1 text-xs" style={{ color: tone(m.tons / data.dailyTarget) }}>
                      {pct(m.tons / data.dailyTarget)}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-border font-bold">
                  <td className="px-2 py-2 text-start text-xs">{L("جمع دوره", "Period")}</td>
                  {data.shifts.map((s) => (
                    <td key={s.code} className="num px-2 py-2">
                      {fmtNum(Math.round(s.tons), locale)}
                    </td>
                  ))}
                  <td className="num px-2 py-2">{fmtNum(Math.round(data.total), locale)}</td>
                  <td className="num px-2 py-2 text-xs" style={{ color: tone(attain) }}>
                    {pct(attain)}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-2 flex flex-wrap justify-center gap-3 text-[11px] text-muted">
              {[
                ["#16a34a", L("۹۰٪ و بالاتر", "≥ 90%")],
                ["#b7791f", L("۶۰ تا ۹۰٪", "60–90%")],
                ["#dc2626", L("زیر ۶۰٪", "< 60%")],
              ].map(([c, t]) => (
                <span key={t} className="inline-flex items-center gap-1">
                  <span className="size-2.5 rounded-sm" style={{ background: c }} /> {t}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* daily trend */}
        <Card className="break-inside-avoid">
          <CardHeader title={L("روند تولید روزانه به تفکیک شیفت", "Daily output by shift")} subtitle={L(`خط‌چین = هدف روزانه ${fmtNum(data.dailyTarget, "fa")} تن`, `Dashed line = daily target ${data.dailyTarget} t`)} />
          <div className="p-4">
            <div className="relative flex h-52 items-end gap-2" dir="ltr">
              <div className="pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-danger/60" style={{ bottom: `${(data.dailyTarget / maxDay) * 100}%` }} />
              {data.matrix.map((m) => (
                <div key={m.day} className="flex h-full flex-1 flex-col justify-end" title={`${m.tons}`}>
                  <div className="num mb-0.5 text-center text-[10px] font-bold">{fmtNum(Math.round(m.tons), locale)}</div>
                  <div className="flex flex-col-reverse overflow-hidden rounded-t" style={{ height: `${(m.tons / maxDay) * 100}%` }}>
                    {m.cells.map((c) => (
                      <div key={c.code} style={{ height: `${m.tons ? (c.tons / m.tons) * 100 : 0}%`, background: SHIFT_COLOR[c.code] }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-1 flex gap-2" dir="ltr">
              {data.matrix.map((m) => (
                <span key={m.day} className="num flex-1 text-center text-[10px] text-muted">
                  {jDay(m.day)}
                </span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs">
              {data.shifts.map((s) => (
                <span key={s.code} className="inline-flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm" style={{ background: SHIFT_COLOR[s.code] }} /> {nm(s)}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* splits */}
      <Card className="break-inside-avoid">
        <CardHeader title={L("تفکیک تولید دوره", "Output breakdown")} subtitle={L("بر اساس نوع عملیات، ماده و مسیر", "By operation, material and route")} />
        <div className="grid gap-6 p-4 lg:grid-cols-3">
          <SplitBar title={L("نوع عملیات", "Operation")} parts={data.byOperation.map((x, i) => ({ label: lbl(OPERATION, x.key, locale), tons: x.tons, trips: x.trips, color: PALETTE[i % PALETTE.length] }))} />
          <SplitBar title={L("ماده", "Material")} parts={data.byMaterial.map((x, i) => ({ label: nm(masters.materials.find((m) => m.id === x.key)), tons: x.tons, trips: x.trips, color: masters.materials.find((m) => m.id === x.key)?.color ?? PALETTE[i % PALETTE.length] }))} />
          <SplitBar title={L("مسیر (مبدأ ← مقصد)", "Route")} parts={data.byRoute.map((x, i) => ({ label: `${loc(x.key.split(">")[0])} ← ${loc(x.key.split(">")[1])}`, tons: x.tons, trips: x.trips, color: PALETTE[i % PALETTE.length] }))} />
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* hourly profile */}
        <Card className="break-inside-avoid">
          <CardHeader title={L("الگوی ساعتی تولید", "Hourly output profile")} subtitle={L("میانگین تن در هر ساعت شبانه‌روز؛ رنگ = شیفت", "Average tons per hour of day; colour = shift")} />
          <div className="p-4">
            <div className="flex h-40 items-end gap-[3px]" dir="ltr">
              {data.hourly.map((h) => {
                const sh = data.shifts.find((s) => (s.startHour < s.endHour ? h.hour >= s.startHour && h.hour < s.endHour : h.hour >= s.startHour || h.hour < s.endHour));
                return <div key={h.hour} className="flex-1 rounded-t" style={{ height: `${Math.max(1, (h.tons / maxHour) * 100)}%`, background: SHIFT_COLOR[sh?.code ?? "A"] }} title={`${h.hour}:00 — ${h.tons} t`} />;
              })}
            </div>
            <div className="mt-1 flex gap-[3px]" dir="ltr">
              {data.hourly.map((h) => (
                <span key={h.hour} className="num flex-1 text-center text-[9px] text-muted">
                  {h.hour % 2 === 0 ? (locale === "fa" ? faDigits(String(h.hour)) : h.hour) : ""}
                </span>
              ))}
            </div>
            <div className="mt-2 text-center text-[11px] text-muted">
              {L("اوج", "Peak")}: <span className="num font-bold text-text">{fmtNum(data.hourly.reduce((a, h) => (h.tons > a.tons ? h : a)).hour, locale)}:۰۰</span> · {L("کم‌کارترین ساعت روز", "quietest daytime hour")}:{" "}
              <span className="num font-bold text-text">{fmtNum(data.hourly.filter((h) => h.hour >= 6 && h.hour < 22).reduce((a, h) => (h.tons < a.tons ? h : a)).hour, locale)}:۰۰</span>
            </div>
          </div>
        </Card>

        {/* cycle breakdown */}
        <Card className="break-inside-avoid">
          <CardHeader
            title={L("کجا زمان از دست می‌رود؟ (ناوگان داخلی)", "Where does the time go? (internal fleet)")}
            subtitle={L(`میانگین یک سرویس در دوره · ${fmtNum(data.cycles.count, "fa")} سرویس · ${fmtNum(Math.round(data.cycles.tons), "fa")} تن جابه‌جایی`, `Average service in the period · ${data.cycles.count} services · ${Math.round(data.cycles.tons)} t moved`)}
          />
          <div className="p-4">
            {data.cycles.count === 0 ? (
              <div className="py-8 text-center text-sm text-muted">{L("در این بازه سرویسی ثبت نشده", "No services in this period")}</div>
            ) : (
              <>
                <div className="flex h-8 overflow-hidden rounded-lg">
                  {STEPS.map((s) => (
                    <div key={s.key} className="num grid place-items-center text-[11px] font-bold text-white" style={{ width: `${(data.cycles[s.key] / cycTotal) * 100}%`, background: s.color }}>
                      {fmtNum(Math.round(data.cycles[s.key]), locale)}
                    </div>
                  ))}
                </div>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {STEPS.map((s) => (
                    <li key={s.key} className={cx("flex items-center gap-2 rounded-lg px-2 py-1 text-sm", s.key === bottleneck.key && "bg-danger/8 ring-1 ring-danger/30")}>
                      <span className="size-3 rounded-sm" style={{ background: s.color }} />
                      <span className="flex-1">{L(s.fa, s.en)}</span>
                      {s.key === bottleneck.key && <span className="text-xs font-semibold text-danger">{L("گلوگاه", "Bottleneck")}</span>}
                      <span className="num w-24 text-end font-semibold">
                        {fmtNum(data.cycles[s.key], locale)} {L("دقیقه", "min")}
                      </span>
                    </li>
                  ))}
                  <li className="flex items-center justify-between border-t border-border px-2 pt-2 text-sm font-bold">
                    <span>{L("جمع یک سرویس", "One service")}</span>
                    <span className="num">
                      {fmtNum(+cycTotal.toFixed(1), locale)} {L("دقیقه", "min")}
                    </span>
                  </li>
                </ul>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
