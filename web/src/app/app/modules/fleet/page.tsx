"use client";
import { Activity, ArrowDownUp, FileSpreadsheet, Printer, Truck, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { Bars, Lines } from "@/components/charts";
import { VehicleTag, shortTag } from "@/components/domain/VehicleTag";
import { ProductionTab } from "@/components/fleet/ProductionTab";
import { Badge, Button, Card, CardHeader, cx, Drawer, Input, Kv, PageHeader, Skeleton, Tabs } from "@/components/ui";
import { DateRange, describeRange, type DateRangeValue } from "@/components/ui/DateRange";
import { clockNow } from "@/domain/clock";
import { emptyFilter, filterToQuery, presetRange } from "@/domain/reportFilter";
import { downloadCsv } from "@/lib/export";
import { faDigits, fmtDateTime, fmtNum, fmtT } from "@/lib/format";
import { useMasters, useView } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import type { FleetPerfData, PerfRow } from "@/server/views";

type Tab = "vehicles" | "drivers" | "production";
type SortKey = keyof Pick<PerfRow, "trips" | "tons" | "avgTare" | "avgGross" | "avgNet" | "loadFactor" | "overloads" | "tareDev" | "avgSiteMin" | "holds">;
const TARE = "#64748b";
const GROSS = "#1273a6";
const NET = "#168567";

export default function FleetPerformancePage() {
  const L = useL();
  const locale = useLocale();
  const masters = useMasters();
  const [tab, setTab] = useState<Tab>("vehicles");
  const [range, setRange] = useState<DateRangeValue>(() => ({ ...presetRange("7d", clockNow()), preset: "7d" }));
  const [fleet, setFleet] = useState<"" | "internal" | "external">("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ k: SortKey; desc: boolean }>({ k: "tons", desc: true });
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState<{ kind: "vehicle" | "driver"; id: string } | null>(null);
  const { data } = useView<FleetPerfData>("fleetPerf", { from: range.from, to: range.to }, 30_000);
  const nm = (x?: { name: string; nameEn?: string }) => (x ? (locale === "fa" ? x.name : x.nameEn ?? x.name) : "—");
  const veh = (id: string) => masters?.vehicles.find((v) => v.id === id);
  const drv = (id: string) => masters?.drivers.find((x) => x.id === id);
  const n0 = (x?: number) => (x == null ? "—" : fmtNum(x, locale));
  const pct = (x?: number) => (x == null ? "—" : `${fmtNum(Math.round(x * 100), locale)}٪`);
  const t = (kg: number) => fmtNum(+(kg / 1000).toFixed(1), locale);

  const rows = useMemo(() => {
    if (!data) return [];
    const base = tab === "drivers" ? data.drivers : data.vehicles;
    const s = q.trim().toUpperCase();
    return base
      .filter((r) => {
        if (tab === "drivers") return !s || nm(drv(r.id)).includes(q.trim()) || (drv(r.id)?.rfidTag ?? "").includes(s);
        const v = veh(r.id);
        if (fleet === "internal" && !v?.internal) return false;
        if (fleet === "external" && v?.internal) return false;
        return !s || r.id.includes(s) || (v?.rfidEpc ?? "").includes(s);
      })
      .sort((a, b) => ((Number(a[sort.k] ?? -1e9) - Number(b[sort.k] ?? -1e9)) * (sort.desc ? -1 : 1)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, tab, q, fleet, sort, masters]);

  if (!data || !masters) return <Skeleton className="h-[70vh]" />;
  const s = data.summary;
  const daily = data.daily.map((x) => ({ ...x, day: locale === "fa" ? faDigits(x.day.slice(5).replace("-", "/")) : x.day.slice(5), tareT: +(x.avgTare / 1000).toFixed(2), grossT: +(x.avgGross / 1000).toFixed(2), netT: +(x.avgNet / 1000).toFixed(2) }));
  const compare = data.vehicles
    .filter((r) => (fleet === "internal" ? veh(r.id)?.internal : fleet === "external" ? !veh(r.id)?.internal : true))
    .slice(0, showAll ? 999 : 15)
    .map((r) => ({ k: r.id, tare: +(r.avgTare / 1000).toFixed(2), gross: +(r.avgGross / 1000).toFixed(2) }));

  const head = (k: SortKey, fa: string, en: string) => (
    <button type="button" onClick={() => setSort({ k, desc: sort.k === k ? !sort.desc : true })} className={cx("inline-flex items-center gap-1 whitespace-nowrap", sort.k === k && "text-primary")}>
      {L(fa, en)} <ArrowDownUp className="size-3 opacity-50" />
    </button>
  );
  const exportXls = () =>
    downloadCsv(
      `fleet-${tab}.csv`,
      [tab === "drivers" ? L("راننده", "Driver") : L("خودرو", "Vehicle"), L("سفر", "Trips"), L("تناژ (تن)", "Tons"), L("میانگین وزن خالی kg", "Avg tare kg"), L("میانگین وزن پر kg", "Avg gross kg"), L("میانگین خالص kg", "Avg net kg"), L("ضریب بارگیری ٪", "Load factor %"), L("اضافه‌بار", "Overloads"), L("کم‌بار", "Underloads"), L("انحراف تارا kg", "Tare deviation kg"), L("پراکندگی تارا kg", "Tare std kg"), L("زمان در سایت (دقیقه)", "Time on site (min)"), L("انتظار تا توزین اول", "Wait to 1st weigh"), L("سفر در روز", "Trips/day"), L("توقف/استثنا", "Holds"), L("توزین دستی", "Manual")],
      rows.map((r) => [tab === "drivers" ? nm(drv(r.id)) : r.id, r.trips, r.tons, r.avgTare, r.avgGross, r.avgNet, r.loadFactor != null ? Math.round(r.loadFactor * 100) : "", r.overloads, r.underloads, r.tareDev ?? "", r.tareStd, r.avgSiteMin ?? "", r.avgWaitMin ?? "", r.tripsPerDay, r.holds, r.manual]),
    );

  return (
    <div>
      <PageHeader
        icon={<Activity className="size-5" />}
        title={L("KPI ناوگان و تولید", "Fleet & production KPIs")}
        subtitle={L("عملکرد تک‌تک خودروها و رانندگان از روی توزین‌ها: وزن خالی و پر، ضریب بارگیری، اضافه‌بار، زمان در سایت", "Every vehicle and driver from the weighings: empty and loaded weight, load factor, overloads, time on site")}
        actions={
          tab !== "production" && (
            <>
              <Button size="sm" onClick={exportXls}>
                <FileSpreadsheet className="size-4" /> Excel
              </Button>
              <Button size="sm" variant="primary" onClick={() => window.print()}>
                <Printer className="size-4" /> {L("چاپ / PDF", "Print / PDF")}
              </Button>
            </>
          )
        }
      />
      <Tabs
        className="mb-3"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "vehicles", label: L("عملکرد خودروها", "Vehicles"), icon: <Truck className="size-4" /> },
          { id: "drivers", label: L("عملکرد رانندگان", "Drivers"), icon: <UserRound className="size-4" /> },
          { id: "production", label: L("تولید و شیفت‌ها (امروز)", "Production & shifts (today)"), icon: <Activity className="size-4" /> },
        ]}
      />
      {tab === "production" ? (
        <ProductionTab />
      ) : (
        <>
          <Card className="mb-4 p-4 print:hidden">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <DateRange value={range} onChange={setRange} />
              {tab === "vehicles" && (
                <div className="flex gap-1">
                  {(
                    [
                      ["", "همه", "All"],
                      ["internal", "ناوگان داخلی", "Internal"],
                      ["external", "پیمانکاران", "Contractors"],
                    ] as const
                  ).map(([k, fa, en]) => (
                    <button key={k} type="button" onClick={() => setFleet(k)} className={cx("rounded-lg px-2.5 py-1.5 text-xs font-medium", fleet === k ? "bg-primary text-white" : "bg-surface-2 hover:bg-primary/10")}>
                      {L(fa, en)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* summary */}
          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
            {[
              [L("سفرها", "Trips"), n0(s.trips), ""],
              [L("تناژ حمل‌شده", "Tons moved"), fmtT(s.tons, locale), L("تن", "t")],
              [L("میانگین وزن خالی", "Avg empty (tare)"), t(s.avgTare), L("تن", "t")],
              [L("میانگین وزن پر", "Avg loaded (gross)"), t(s.avgGross), L("تن", "t")],
              [L("میانگین بار خالص", "Avg net load"), t(s.avgNet), L("تن", "t")],
              [L("ضریب بارگیری", "Load factor"), pct(s.loadFactor), ""],
              [L("اضافه‌بار", "Overloads"), n0(s.overloads), ""],
              [L("زمان در سایت", "Time on site"), n0(s.avgSiteMin), L("دقیقه", "min")],
            ].map(([k, v, u]) => (
              <Card key={k} className="p-3">
                <div className="text-[11px] text-muted">{k}</div>
                <div className="num mt-1 text-xl font-black">
                  {v} <span className="text-xs font-normal text-muted">{u}</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="mb-4 grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader title={L("وزن خالی و پر — میانگین روزانه", "Empty vs loaded — daily average")} subtitle={L("توزین اول (خالی) و توزین دوم (پر) و بار خالص، به تن", "First weigh (empty), second weigh (loaded) and net load, in tonnes")} />
              <div className="p-3">
                <Lines
                  data={daily}
                  x="day"
                  unit={L("تن", "t")}
                  height={240}
                  series={[
                    { key: "grossT", name: L("وزن پر (ناخالص)", "Loaded (gross)"), color: GROSS },
                    { key: "netT", name: L("بار خالص", "Net load"), color: NET },
                    { key: "tareT", name: L("وزن خالی (تارا)", "Empty (tare)"), color: TARE },
                  ]}
                />
              </div>
            </Card>
            <Card>
              <CardHeader
                title={L("مقایسه خودروها — میانگین وزن خالی و پر", "Vehicles — average empty vs loaded")}
                subtitle={L("فاصله دو ستون = بار خالص هر سفر", "Gap between the bars = net load per trip")}
                actions={
                  data.vehicles.length > 15 && (
                    <button type="button" className="text-xs text-primary" onClick={() => setShowAll(!showAll)}>
                      {showAll ? L("۱۵ خودروی اول", "Top 15") : L("نمایش همه", "Show all")}
                    </button>
                  )
                }
              />
              <div className="p-3">
                <Bars
                  data={compare}
                  x="k"
                  unit={L("تن", "t")}
                  height={240}
                  series={[
                    { key: "tare", name: L("وزن خالی", "Empty"), color: TARE },
                    { key: "gross", name: L("وزن پر", "Loaded"), color: GROSS },
                  ]}
                />
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader
              title={tab === "drivers" ? L("عملکرد رانندگان", "Driver performance") : L("عملکرد خودروها", "Vehicle performance")}
              subtitle={`${describeRange(range, locale)} · ${fmtNum(rows.length, locale)} ${tab === "drivers" ? L("راننده", "drivers") : L("خودرو", "vehicles")} · ${L("روی هر ردیف بزنید", "click a row for details")}`}
              actions={<Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tab === "drivers" ? L("نام یا تگ کارت…", "Name or card tag…") : L("کد یا تگ خودرو…", "Vehicle code or tag…")} className="h-9 w-48 print:hidden" />}
            />
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-2 text-xs text-muted">
                  <tr className="[&>th]:px-3 [&>th]:py-2.5 [&>th]:text-start [&>th]:font-medium">
                    <th>{tab === "drivers" ? L("راننده", "Driver") : L("خودرو", "Vehicle")}</th>
                    <th>{head("trips", "سفر", "Trips")}</th>
                    <th>{head("tons", "تناژ (تن)", "Tons")}</th>
                    <th>{head("avgTare", "وزن خالی", "Empty")}</th>
                    <th>{head("avgGross", "وزن پر", "Loaded")}</th>
                    <th>{head("avgNet", "بار خالص", "Net")}</th>
                    {tab === "vehicles" && <th>{head("loadFactor", "ضریب بارگیری", "Load factor")}</th>}
                    <th>{head("overloads", "اضافه‌بار", "Overload")}</th>
                    {tab === "vehicles" && <th>{head("tareDev", "انحراف تارا", "Tare drift")}</th>}
                    <th>{head("avgSiteMin", "زمان در سایت", "On site")}</th>
                    <th>{head("holds", "توقف/استثنا", "Holds")}</th>
                    {tab === "drivers" && <th>{L("خودروهای رانده‌شده", "Vehicles driven")}</th>}
                    <th>{L("آخرین سفر", "Last trip")}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} onClick={() => setOpen({ kind: tab === "drivers" ? "driver" : "vehicle", id: r.id })} className="cursor-pointer border-t border-border hover:bg-surface-2/70 [&>td]:px-3 [&>td]:py-2">
                      <td>
                        {tab === "drivers" ? (
                          <div>
                            <div className="font-semibold">{nm(drv(r.id))}</div>
                            <div className="font-mono text-[10px] text-muted ltr">{shortTag(drv(r.id)?.rfidTag)}</div>
                          </div>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <VehicleTag vehicleId={r.id} size="xs" />
                            {veh(r.id)?.internal && <Badge tone="info">{L("داخلی", "Int.")}</Badge>}
                          </span>
                        )}
                      </td>
                      <td className="num">{n0(r.trips)}</td>
                      <td className="num font-semibold">{fmtT(r.tons, locale)}</td>
                      <td className="num text-muted">{t(r.avgTare)}</td>
                      <td className="num">{t(r.avgGross)}</td>
                      <td className="num">{t(r.avgNet)}</td>
                      {tab === "vehicles" && (
                        <td>
                          <span className="flex items-center gap-2">
                            <span className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-2">
                              <span className={cx("block h-full rounded-full", (r.loadFactor ?? 0) < 0.75 ? "bg-warning" : (r.loadFactor ?? 0) > 1 ? "bg-danger" : "bg-success")} style={{ width: `${Math.min(100, (r.loadFactor ?? 0) * 100)}%` }} />
                            </span>
                            <span className={cx("num text-xs", (r.loadFactor ?? 0) < 0.75 && "text-warning")}>{pct(r.loadFactor)}</span>
                          </span>
                        </td>
                      )}
                      <td className={cx("num", r.overloads > 0 && "font-bold text-danger")}>{n0(r.overloads)}</td>
                      {tab === "vehicles" && <td className={cx("num text-xs", Math.abs(r.tareDev ?? 0) > 300 && "font-bold text-danger")}>{r.tareDev == null ? "—" : `${r.tareDev > 0 ? "+" : ""}${fmtNum(r.tareDev, locale)} kg`}</td>}
                      <td className={cx("num text-xs", (r.avgSiteMin ?? 0) > 120 && "text-warning")}>{r.avgSiteMin == null ? "—" : `${fmtNum(r.avgSiteMin, locale)} ${L("دقیقه", "min")}`}</td>
                      <td className={cx("num", r.holds > 0 && "text-warning")}>{n0(r.holds)}</td>
                      {tab === "drivers" && <td className="num">{n0(r.vehiclesUsed)}</td>}
                      <td className="num text-xs text-muted">{fmtDateTime(r.lastAt, locale)}</td>
                    </tr>
                  ))}
                  {!rows.length && (
                    <tr>
                      <td colSpan={13} className="px-3 py-10 text-center text-sm text-muted">
                        {L("در این بازه سفری ثبت نشده", "No trips in this period")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap gap-4 border-t border-border px-4 py-2 text-[11px] text-muted">
              <span>{L("ضریب بارگیری = میانگین بار خالص ÷ ظرفیت بار خودرو", "Load factor = avg net ÷ rated payload")}</span>
              <span>{L("انحراف تارا = میانگین وزن خالی اندازه‌گیری‌شده − تارای ثبت‌شده (بیش از ۳۰۰ کیلو قرمز)", "Tare drift = measured avg tare − stored tare (red over 300 kg)")}</span>
            </div>
          </Card>
        </>
      )}
      {open && <Detail kind={open.kind} id={open.id} range={range} onClose={() => setOpen(null)} />}
    </div>
  );
}

function Detail({ kind, id, range, onClose }: { kind: "vehicle" | "driver"; id: string; range: DateRangeValue; onClose: () => void }) {
  const L = useL();
  const locale = useLocale();
  const masters = useMasters();
  const { data } = useView<FleetPerfData>("fleetPerf", { from: range.from, to: range.to, [kind === "vehicle" ? "vehicleId" : "driverId"]: id }, 30_000);
  const nm = (x?: { name: string; nameEn?: string }) => (x ? (locale === "fa" ? x.name : x.nameEn ?? x.name) : "—");
  const v = kind === "vehicle" ? masters?.vehicles.find((x) => x.id === id) : undefined;
  const dr = kind === "driver" ? masters?.drivers.find((x) => x.id === id) : undefined;
  const row = (kind === "vehicle" ? data?.vehicles : data?.drivers)?.find((r) => r.id === id);
  const trips = data?.trips ?? [];
  const loc = (lid: string) => nm(masters?.locations.find((l) => l.id === lid));
  const series = trips.map((x, i) => ({
    i: fmtNum(i + 1, locale),
    tare: +(x.tare / 1000).toFixed(2),
    gross: +(x.gross / 1000).toFixed(2),
    ...(v ? { gvw: +(v.maxGvwKg / 1000).toFixed(1), stored: v.storedTareKg ? +(v.storedTareKg / 1000).toFixed(2) : undefined } : {}),
  }));
  const reportHref = () => {
    const f = { ...emptyFilter(clockNow(), "custom"), from: range.from, to: range.to, preset: range.preset, ...(kind === "vehicle" ? { vehicles: [id] } : { drivers: [id] }) };
    const q = filterToQuery(f);
    q.set("tpl", "daily");
    q.set("cols", "ticket,time,plate,driver,route,gross,tare,net,state");
    return `/print/report?${q.toString()}`;
  };
  const t = (kg?: number) => (kg == null ? "—" : `${fmtNum(+(kg / 1000).toFixed(2), locale)} ${L("تن", "t")}`);
  return (
    <Drawer open onClose={onClose} title={kind === "vehicle" ? L("کارنامه خودرو", "Vehicle scorecard") : L("کارنامه راننده", "Driver scorecard")}>
      {!data ? (
        <Skeleton className="h-96" />
      ) : (
        <div className="flex flex-col gap-4">
          {v && (
            <div className="rounded-xl border border-border p-3">
              <VehicleTag vehicleId={v.id} size="md" />
              <Kv k={L("ظرفیت بار", "Rated payload")} v={t(v.ratedPayloadKg)} />
              <Kv k={L("حداکثر وزن کل", "Max GVW")} v={t(v.maxGvwKg)} />
              <Kv k={L("تارای ثبت‌شده", "Stored tare")} v={t(v.storedTareKg)} />
              <Kv k={L("رانندگان مجاز", "Authorized drivers")} v={v.authorizedDriverIds.map((x) => nm(masters?.drivers.find((y) => y.id === x))).join("، ") || "—"} />
              <Kv k={L("حواله / مسیر فعلی", "Current assignment")} v={masters?.permits.find((p) => p.id === v.assignment?.permitId)?.permitNo ?? L("ندارد", "None")} />
            </div>
          )}
          {dr && (
            <div className="rounded-xl border border-border p-3">
              <div className="text-lg font-bold">{nm(dr)}</div>
              <Kv k={L("تگ کارت", "Card tag")} v={dr.rfidTag ?? "—"} mono />
              <Kv k={L("شرکت حمل", "Carrier")} v={nm(masters?.carriers.find((c) => c.id === dr.carrierId))} />
              <Kv k={L("خودروهای رانده‌شده", "Vehicles driven")} v={[...new Set(trips.map((x) => x.vehicleId))].join("، ") || "—"} />
              <Kv k={L("ورود با کارت غیرمجاز", "Unauthorized card holds")} v={fmtNum(row?.unauthorized ?? 0, locale)} />
            </div>
          )}
          {row && (
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                [L("سفر", "Trips"), fmtNum(row.trips, locale)],
                [L("تناژ", "Tons"), `${fmtNum(row.tons, locale)} ${L("تن", "t")}`],
                [L("میانگین وزن خالی", "Avg empty"), t(row.avgTare)],
                [L("میانگین وزن پر", "Avg loaded"), t(row.avgGross)],
                [L("میانگین بار خالص", "Avg net"), t(row.avgNet)],
                [L("ضریب بارگیری", "Load factor"), row.loadFactor == null ? "—" : `${fmtNum(Math.round(row.loadFactor * 100), locale)}٪`],
                [L("اضافه‌بار / کم‌بار", "Over / under"), `${fmtNum(row.overloads, locale)} / ${fmtNum(row.underloads, locale)}`],
                [L("پراکندگی وزن خالی", "Tare spread"), `± ${fmtNum(row.tareStd, locale)} kg`],
                [L("زمان در سایت", "Time on site"), row.avgSiteMin == null ? "—" : `${fmtNum(row.avgSiteMin, locale)} ${L("دقیقه", "min")}`],
                [L("انتظار تا توزین اول", "Wait to 1st weigh"), row.avgWaitMin == null ? "—" : `${fmtNum(row.avgWaitMin, locale)} ${L("دقیقه", "min")}`],
                [L("سفر در روز", "Trips / day"), fmtNum(row.tripsPerDay, locale)],
                [L("توقف / توزین دستی", "Holds / manual"), `${fmtNum(row.holds, locale)} / ${fmtNum(row.manual, locale)}`],
              ].map(([k, val]) => (
                <div key={k} className="rounded-lg bg-surface-2 px-3 py-2">
                  <div className="text-[11px] text-muted">{k}</div>
                  <div className="num font-bold">{val}</div>
                </div>
              ))}
            </div>
          )}
          <div>
            <div className="mb-1 text-sm font-semibold">{L("وزن خالی و پر در هر سفر (تن)", "Empty and loaded weight per trip (t)")}</div>
            <Lines
              data={series}
              x="i"
              unit={L("تن", "t")}
              height={200}
              series={[
                { key: "gross", name: L("وزن پر", "Loaded"), color: GROSS },
                { key: "tare", name: L("وزن خالی", "Empty"), color: TARE },
                ...(v ? [{ key: "gvw", name: L("حداکثر وزن مجاز", "Max GVW"), color: "#b42335", dashed: true }] : []),
                ...(v?.storedTareKg ? [{ key: "stored", name: L("تارای ثبت‌شده", "Stored tare"), color: "#94a3b8", dashed: true }] : []),
              ]}
            />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm font-semibold">
              {L("سفرها", "Trips")}
              <a href={reportHref()} target="_blank" rel="noreferrer" className="text-xs font-normal text-primary">
                {L("گزارش کامل / PDF", "Full report / PDF")}
              </a>
            </div>
            <div className="max-h-72 overflow-auto rounded-lg border border-border">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-surface-2 text-muted">
                  <tr className="[&>th]:px-2 [&>th]:py-1.5 [&>th]:text-start">
                    <th>{L("زمان", "Time")}</th>
                    <th>{kind === "vehicle" ? L("راننده", "Driver") : L("خودرو", "Vehicle")}</th>
                    <th>{L("خالی", "Empty")}</th>
                    <th>{L("پر", "Loaded")}</th>
                    <th>{L("خالص", "Net")}</th>
                    <th>{L("مسیر", "Route")}</th>
                  </tr>
                </thead>
                <tbody>
                  {[...trips].reverse().map((x) => (
                    <tr key={x.txId} className={cx("border-t border-border [&>td]:px-2 [&>td]:py-1.5", x.overload && "bg-danger/5")}>
                      <td className="num whitespace-nowrap">{fmtDateTime(x.at, locale)}</td>
                      <td className="whitespace-nowrap">{kind === "vehicle" ? nm(masters?.drivers.find((y) => y.id === x.driverId)) : x.vehicleId}</td>
                      <td className="num">{fmtNum(x.tare, locale)}</td>
                      <td className={cx("num", x.overload && "font-bold text-danger")}>{fmtNum(x.gross, locale)}</td>
                      <td className="num">{fmtNum(x.net, locale)}</td>
                      <td className="whitespace-nowrap text-muted">
                        {loc(x.originId).split(" — ")[0]} ← {loc(x.destinationId).split(" — ")[0]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}
