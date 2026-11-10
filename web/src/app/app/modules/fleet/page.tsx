"use client";
import { Activity, ChevronDown, ChevronUp, FileSpreadsheet, Printer, RotateCcw, Truck, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { Lines } from "@/components/charts";
import { VehicleTag } from "@/components/domain/VehicleTag";
import { C_GROSS, C_TARE, DailyWeights, GRADE, WeightCompare, type CompareRow } from "@/components/fleet/charts";
import { ProductionTab } from "@/components/fleet/ProductionTab";
import { Badge, Button, Card, CardHeader, cx, Drawer, Input, Kv, PageHeader, Segmented, Select, Skeleton, Tabs } from "@/components/ui";
import { DateRange, describeRange, type DateRangeValue } from "@/components/ui/DateRange";
import { clockNow } from "@/domain/clock";
import { emptyFilter, filterToQuery, presetRange } from "@/domain/reportFilter";
import { downloadCsv } from "@/lib/export";
import { fmtDateTime, fmtNum, fmtT } from "@/lib/format";
import { useMasters, useView } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import type { FleetPerfData, PerfRow } from "@/server/views";

type Tab = "vehicles" | "drivers" | "production";
type SortKey = "score" | "tons" | "trips" | "avgTare" | "avgGross" | "avgNet" | "loadFactor" | "overloads" | "tareDev" | "avgSiteMin" | "avgWaitMin" | "tripsPerDay" | "holds" | "manual" | "lastAt";
type ColView = "weight" | "time";
const SORTS: { id: string; k: SortKey; desc: boolean; fa: string; en: string }[] = [
  { id: "best", k: "score", desc: true, fa: "بهترین عملکرد (امتیاز)", en: "Best performance (score)" },
  { id: "worst", k: "score", desc: false, fa: "ضعیف‌ترین عملکرد", en: "Weakest performance" },
  { id: "tons+", k: "tons", desc: true, fa: "بیشترین تناژ", en: "Most tons" },
  { id: "tons-", k: "tons", desc: false, fa: "کمترین تناژ", en: "Fewest tons" },
  { id: "trips+", k: "trips", desc: true, fa: "بیشترین سفر", en: "Most trips" },
  { id: "lf+", k: "loadFactor", desc: true, fa: "بهترین ضریب بارگیری", en: "Best load factor" },
  { id: "lf-", k: "loadFactor", desc: false, fa: "کمترین ضریب بارگیری", en: "Lowest load factor" },
  { id: "gross+", k: "avgGross", desc: true, fa: "سنگین‌ترین وزن پر", en: "Heaviest loaded weight" },
  { id: "over+", k: "overloads", desc: true, fa: "بیشترین اضافه‌بار", en: "Most overloads" },
  { id: "drift+", k: "tareDev", desc: true, fa: "بیشترین انحراف تارا", en: "Largest tare drift" },
  { id: "site+", k: "avgSiteMin", desc: true, fa: "طولانی‌ترین زمان در سایت", en: "Longest time on site" },
  { id: "site-", k: "avgSiteMin", desc: false, fa: "کوتاه‌ترین زمان در سایت", en: "Shortest time on site" },
  { id: "holds+", k: "holds", desc: true, fa: "بیشترین توقف / استثنا", en: "Most holds" },
];

export default function FleetPerformancePage() {
  const L = useL();
  const locale = useLocale();
  const masters = useMasters();
  const [tab, setTab] = useState<Tab>("vehicles");
  const [range, setRange] = useState<DateRangeValue>(() => ({ ...presetRange("7d", clockNow()), preset: "7d" }));
  const [fleet, setFleet] = useState<"" | "internal" | "external">("");
  const [carrierId, setCarrierId] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Record<"vehicles" | "drivers", { k: SortKey; desc: boolean }>>({ vehicles: { k: "score", desc: true }, drivers: { k: "score", desc: true } });
  const [size, setSize] = useState<"10" | "25" | "all">("10");
  const [cols, setCols] = useState<ColView>("weight");
  const [onlyIssues, setOnlyIssues] = useState(false);
  const [open, setOpen] = useState<{ kind: "vehicle" | "driver"; id: string } | null>(null);
  const { data } = useView<FleetPerfData>("fleetPerf", { from: range.from, to: range.to, fleet: fleet || undefined, carrierId: carrierId || undefined }, 30_000);
  const who = tab === "drivers" ? "drivers" : "vehicles";
  const srt = sort[who];
  const nm = (r: PerfRow) => (locale === "fa" ? r.label : r.labelEn);

  const rows = useMemo(() => {
    if (!data) return [];
    const s = q.trim().toUpperCase();
    const list = (who === "drivers" ? data.drivers : data.vehicles).filter((r) => !s || r.label.includes(q.trim()) || r.labelEn.toUpperCase().includes(s) || (r.tag ?? "").includes(s) || r.id.includes(s)).filter((r) => !onlyIssues || !!r.issue || r.score < 50);
    const val = (r: PerfRow) => (srt.k === "lastAt" ? (r.lastAt ? Date.parse(r.lastAt) : undefined) : srt.k === "tareDev" ? (r.tareDev == null ? undefined : Math.abs(r.tareDev)) : (r[srt.k] as number | undefined));
    return [...list].sort((a, b) => {
      const x = val(a);
      const y = val(b);
      if (x == null && y == null) return 0;
      if (x == null) return 1; // missing values always last
      if (y == null) return -1;
      return srt.desc ? y - x : x - y;
    });
  }, [data, who, q, srt, onlyIssues]);
  const shown = size === "all" ? rows : rows.slice(0, Number(size));

  if (!data || !masters) return <Skeleton className="h-[70vh]" />;
  const s = data.summary;
  const t = (kg?: number) => (kg == null ? "—" : fmtNum(+(kg / 1000).toFixed(1), locale));
  const pct = (x?: number) => (x == null ? "—" : `${fmtNum(Math.round(x * 100), locale)}٪`);
  const min = (x?: number) => (x == null ? "—" : `${fmtNum(x, locale)} ${L("دقیقه", "min")}`);
  const narrowed = [fleet === "internal" ? L("ناوگان داخلی", "internal fleet") : fleet === "external" ? L("پیمانکاران", "contractors") : "", carrierId ? masters.carriers.find((c) => c.id === carrierId)?.name ?? "" : "", q.trim() ? `«${q.trim()}»` : "", onlyIssues ? L("فقط موارد مشکل‌دار", "issues only") : ""].filter(Boolean);
  const reset = () => (setFleet(""), setCarrierId(""), setQ(""), setSize("10"), setOnlyIssues(false));
  const all = who === "drivers" ? data.drivers : data.vehicles;
  const ranked = [...all].sort((a, b) => a.rank - b.rank);
  const top3 = ranked.slice(0, 3);
  const bottom3 = ranked.length > 3 ? ranked.slice(-3).reverse() : [];
  const sortId = SORTS.find((x) => x.k === srt.k && x.desc === srt.desc)?.id ?? "";
  const compare: CompareRow[] = shown.map((r) => ({ id: r.id, label: nm(r), sub: [r.tag, r.carrier].filter(Boolean).join(" · "), tareKg: r.avgTare, grossKg: r.avgGross, loadFactor: r.loadFactor, overloads: r.overloads, trips: r.trips, rank: r.rank, score: r.score, grade: r.grade }));

  const Th = ({ k, fa, en }: { k: SortKey; fa: string; en: string }) => {
    const on = srt.k === k;
    return (
      <th className="px-3 py-2.5 text-start font-medium">
        <button type="button" onClick={() => setSort({ ...sort, [who]: { k, desc: on ? !srt.desc : true } })} className={cx("inline-flex items-center gap-0.5 whitespace-nowrap", on && "font-bold text-primary")}>
          {L(fa, en)}
          {on ? srt.desc ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" /> : <span className="w-3.5" />}
        </button>
      </th>
    );
  };
  const exportXls = () => {
    const head = [who === "drivers" ? L("راننده", "Driver") : L("خودرو", "Vehicle"), L("تگ", "Tag"), L("شرکت حمل", "Carrier"), L("رتبه", "Rank"), L("امتیاز", "Score"), L("سفر", "Trips"), L("تناژ (تن)", "Tons"), L("وزن خالی kg", "Empty kg"), L("وزن پر kg", "Loaded kg"), L("بار خالص kg", "Net kg"), L("ضریب بارگیری ٪", "Load factor %"), L("اضافه‌بار", "Overloads"), L("کم‌بار", "Underloads"), L("انحراف تارا kg", "Tare drift kg"), L("زمان در سایت (دقیقه)", "On site min"), L("انتظار تا توزین اول", "Wait min"), L("سفر در روز", "Trips/day"), L("توقف", "Holds"), L("دستی", "Manual"), L("آخرین سفر", "Last trip")];
    downloadCsv(`fleet-${who}.csv`, head, rows.map((r) => [nm(r), r.tag ?? "", r.carrier ?? "", r.rank, r.score, r.trips, r.tons, r.avgTare, r.avgGross, r.avgNet, r.loadFactor != null ? Math.round(r.loadFactor * 100) : "", r.overloads, r.underloads, r.tareDev ?? "", r.avgSiteMin ?? "", r.avgWaitMin ?? "", r.tripsPerDay, r.holds, r.manual, r.lastAt ?? ""]));
  };

  return (
    <div>
      <style media="print">{"@page { size: A4 landscape; }"}</style>
      <PageHeader
        icon={<Activity className="size-5" />}
        title={L("KPI ناوگان و تولید", "Fleet & production KPIs")}
        subtitle={L("عملکرد تک‌تک خودروها و رانندگان از روی توزین‌ها", "Each vehicle's and driver's performance from the weighings")}
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
        className="mb-3 print:hidden"
        value={tab}
        onChange={(v) => (setTab(v), setQ(""))}
        tabs={[
          { id: "vehicles", label: L("عملکرد خودروها", "Vehicles"), icon: <Truck className="size-4" /> },
          { id: "drivers", label: L("عملکرد رانندگان", "Drivers"), icon: <UserRound className="size-4" /> },
          { id: "production", label: L("تولید و شیفت‌ها", "Production & shifts"), icon: <Activity className="size-4" /> },
        ]}
      />
      {tab === "production" ? (
        <>
          <Card className="mb-4 p-4 print:hidden">
            <DateRange value={range} onChange={setRange} />
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
              <Segmented size="sm" options={[{ id: "", label: L("همه خودروها", "All vehicles") }, { id: "internal", label: L("ناوگان داخلی", "Internal") }, { id: "external", label: L("پیمانکاران", "Contractors") }]} value={fleet} onChange={setFleet} />
              <Select value={carrierId} onChange={(e) => setCarrierId(e.target.value)} className="h-9 text-xs">
                <option value="">{L("همه شرکت‌های حمل", "All carriers")}</option>
                {masters.carriers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {locale === "fa" ? c.name : c.nameEn}
                  </option>
                ))}
              </Select>
            </div>
          </Card>
          <ProductionTab range={range} fleet={fleet} carrierId={carrierId} />
        </>
      ) : (
        <>
          {/* filters */}
          <Card className="mb-4 p-4 print:hidden">
            <DateRange value={range} onChange={setRange} />
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
              <Segmented
                size="sm"
                options={[
                  { id: "", label: L("همه خودروها", "All vehicles") },
                  { id: "internal", label: L("ناوگان داخلی", "Internal") },
                  { id: "external", label: L("پیمانکاران", "Contractors") },
                ]}
                value={fleet}
                onChange={setFleet}
              />
              <Select value={carrierId} onChange={(e) => setCarrierId(e.target.value)} className="h-9 text-xs" aria-label={L("شرکت حمل", "Carrier")}>
                <option value="">{L("همه شرکت‌های حمل", "All carriers")}</option>
                {masters.carriers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {locale === "fa" ? c.name : c.nameEn}
                  </option>
                ))}
              </Select>
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={who === "drivers" ? L("نام یا تگ کارت راننده…", "Driver name or card tag…") : L("کد یا تگ خودرو…", "Vehicle code or tag…")} className="h-9 w-52" />
              <label className={cx("flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 text-xs", onlyIssues ? "border-danger bg-danger/5 font-semibold text-danger" : "border-border")}>
                <input type="checkbox" checked={onlyIssues} onChange={(e) => setOnlyIssues(e.target.checked)} /> {L("فقط موارد مشکل‌دار", "Issues only")}
              </label>
              {narrowed.length > 0 && (
                <Button size="sm" variant="ghost" onClick={reset}>
                  <RotateCcw className="size-3.5" /> {L("پاک کردن فیلترها", "Clear filters")}
                </Button>
              )}
            </div>
          </Card>

          {/* summary */}
          <div className="mb-1 flex items-center gap-2 text-xs text-muted">
            <span>{describeRange(range, locale)}</span>
            {narrowed.length > 0 && <Badge tone="primary">{L("فیلتر", "Filter")}: {narrowed.join(" · ")}</Badge>}
          </div>
          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
            {[
              [L("سفرها", "Trips"), fmtNum(s.trips, locale), "", ""],
              [L("تناژ حمل‌شده", "Tons moved"), fmtT(s.tons, locale), L("تن", "t"), ""],
              [L("میانگین وزن خالی", "Avg empty"), t(s.avgTare), L("تن", "t"), L("توزین اول", "1st weigh")],
              [L("میانگین وزن پر", "Avg loaded"), t(s.avgGross), L("تن", "t"), L("توزین دوم", "2nd weigh")],
              [L("میانگین بار خالص", "Avg net"), t(s.avgNet), L("تن", "t"), L("پر − خالی", "loaded − empty")],
              [L("ضریب بارگیری", "Load factor"), pct(s.loadFactor), "", L("بار خالص ÷ ظرفیت", "net ÷ capacity")],
              [L("اضافه‌بار", "Overloads"), fmtNum(s.overloads, locale), L("سفر", "trips"), ""],
              [L("زمان در سایت", "Time on site"), fmtNum(s.avgSiteMin, locale), L("دقیقه", "min"), L("ورود تا خروج", "in → out")],
            ].map(([k, v, u, h]) => (
              <Card key={k} className="p-3">
                <div className="text-[11px] text-muted">{k}</div>
                <div className="num mt-1 text-xl font-black">
                  {v} <span className="text-xs font-normal text-muted">{u}</span>
                </div>
                {h && <div className="text-[10px] text-muted">{h}</div>}
              </Card>
            ))}
          </div>

          {/* best / needs attention */}
          <div className="mb-4 grid gap-4 lg:grid-cols-2">
            {(
              [
                ["best", L("بهترین عملکرد", "Best performers"), top3, "border-success/40"],
                ["low", L("نیاز به توجه", "Needs attention"), bottom3, "border-danger/40"],
              ] as const
            ).map(([key, title, list, border]) => (
              <Card key={key} className={cx("border-s-4 p-4", border)}>
                <div className="mb-2 text-sm font-bold">{title}</div>
                <div className="flex flex-col gap-1.5">
                  {list.map((r) => (
                    <button key={r.id} type="button" onClick={() => setOpen({ kind: who === "drivers" ? "driver" : "vehicle", id: r.id })} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-start text-sm hover:bg-surface-2">
                      <span className="num w-6 text-center text-xs font-bold text-muted">{fmtNum(r.rank, locale)}</span>
                      <span className="min-w-0 flex-1 truncate font-semibold">
                        {nm(r)} <span className="font-mono text-[10px] font-normal text-muted ltr">{r.tag}</span>
                      </span>
                      <span className="truncate text-xs text-muted">{key === "low" ? r.issue ?? L("امتیاز پایین", "low score") : `${fmtT(r.tons, locale)} ${L("تن", "t")}`}</span>
                      <span className={cx("num rounded-full px-2 py-0.5 text-[11px] font-bold", GRADE[r.grade].cls)}>{fmtNum(r.score, locale)}</span>
                    </button>
                  ))}
                  {!list.length && <div className="text-xs text-muted">—</div>}
                </div>
              </Card>
            ))}
          </div>

          {/* charts */}
          <div className="mb-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="break-inside-avoid">
              <CardHeader title={L("وزن خالی و پر — میانگین روزانه", "Empty vs loaded — daily average")} subtitle={L("روی هر نقطه نگه دارید تا مقدار را ببینید", "Hover a point for its value")} />
              <div className="p-4">
                <DailyWeights days={data.daily} />
              </div>
            </Card>
            <Card className="break-inside-avoid">
              <CardHeader
                title={who === "drivers" ? L("مقایسه رانندگان — وزن خالی، بار خالص و وزن پر", "Drivers — empty, net and loaded") : L("مقایسه خودروها — وزن خالی، بار خالص و وزن پر", "Vehicles — empty, net and loaded")}
                subtitle={L(`میانگین هر سفر (تن) · ${fmtNum(shown.length, "fa")} از ${fmtNum(rows.length, "fa")}`, `Average per trip (t) · sorted by the table's column · ${shown.length} of ${rows.length}`)}
                actions={
                  <div className="flex flex-wrap items-center gap-2 print:hidden">
                    <Select value={sortId} onChange={(e) => { const o = SORTS.find((x) => x.id === e.target.value); if (o) setSort({ ...sort, [who]: { k: o.k, desc: o.desc } }); }} className="h-9 text-xs" aria-label={L("مرتب‌سازی", "Sort")}>
                      {!sortId && <option value="">{L("مرتب‌سازی سفارشی", "Custom sort")}</option>}
                      {SORTS.filter((o) => who === "vehicles" || !["lf+", "lf-", "drift+"].includes(o.id)).map((o) => (
                        <option key={o.id} value={o.id}>
                          {L(o.fa, o.en)}
                        </option>
                      ))}
                    </Select>
                    <Segmented size="sm" options={[{ id: "10", label: "۱۰" }, { id: "25", label: "۲۵" }, { id: "all", label: L("همه", "All") }]} value={size} onChange={setSize} />
                  </div>
                }
              />
              <div className="max-h-[30rem] overflow-y-auto px-4 pb-3 print:max-h-none">
                <WeightCompare rows={compare} onPick={(id) => setOpen({ kind: who === "drivers" ? "driver" : "vehicle", id })} />
                {!compare.length && <div className="py-8 text-center text-sm text-muted">{L("موردی مطابق فیلتر نیست", "Nothing matches the filter")}</div>}
              </div>
            </Card>
          </div>

          {/* table */}
          <Card>
            <CardHeader
              title={who === "drivers" ? L("جدول عملکرد رانندگان", "Driver performance") : L("جدول عملکرد خودروها", "Vehicle performance")}
              subtitle={L("روی سرستون بزنید تا مرتب شود؛ روی ردیف بزنید تا کارنامه باز شود", "Click a header to sort; click a row for the scorecard")}
              actions={<Segmented size="sm" options={[{ id: "weight", label: L("وزن و بار", "Weight & load") }, { id: "time", label: L("زمان و رفتار", "Time & behaviour") }]} value={cols} onChange={setCols} />}
            />
            {/* desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="bg-surface-2 text-xs text-muted">
                  <tr>
                    <th className="px-3 py-2.5 text-start font-medium">{who === "drivers" ? L("راننده", "Driver") : L("خودرو", "Vehicle")}</th>
                    <Th k="score" fa="امتیاز / رتبه" en="Score / rank" />
                    <Th k="trips" fa="سفر" en="Trips" />
                    <Th k="tons" fa="تناژ (تن)" en="Tons" />
                    {cols === "weight" ? (
                      <>
                        <Th k="avgTare" fa="وزن خالی" en="Empty" />
                        <Th k="avgGross" fa="وزن پر" en="Loaded" />
                        <Th k="avgNet" fa="بار خالص" en="Net" />
                        {who === "vehicles" && <Th k="loadFactor" fa="ضریب بارگیری" en="Load factor" />}
                        <Th k="overloads" fa="اضافه‌بار" en="Overload" />
                        {who === "vehicles" && <Th k="tareDev" fa="انحراف تارا" en="Tare drift" />}
                      </>
                    ) : (
                      <>
                        <Th k="avgSiteMin" fa="زمان در سایت" en="On site" />
                        <Th k="avgWaitMin" fa="انتظار تا توزین" en="Wait" />
                        <Th k="tripsPerDay" fa="سفر در روز" en="Trips/day" />
                        <Th k="holds" fa="توقف/استثنا" en="Holds" />
                        <Th k="manual" fa="توزین دستی" en="Manual" />
                        <Th k="lastAt" fa="آخرین سفر" en="Last trip" />
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {shown.map((r) => (
                    <tr key={r.id} onClick={() => setOpen({ kind: who === "drivers" ? "driver" : "vehicle", id: r.id })} className="cursor-pointer border-t border-border hover:bg-surface-2/70 [&>td]:px-3 [&>td]:py-2">
                      <td>
                        <div className="flex items-center gap-2">
                          {who === "vehicles" ? <VehicleTag vehicleId={r.id} size="xs" /> : <span className="font-semibold">{nm(r)}</span>}
                          {r.internal && <Badge tone="info">{L("داخلی", "Int.")}</Badge>}
                        </div>
                        <div className="text-[10px] text-muted">{who === "drivers" ? <span className="font-mono ltr">{r.tag}</span> : null} {r.carrier}</div>
                      </td>
                      <td>
                        <span className={cx("num rounded-full px-2 py-0.5 text-[11px] font-bold", GRADE[r.grade].cls)} title={`${L("بار", "load")} ${r.parts.load}/35 · ${L("بهره‌وری", "productivity")} ${r.parts.productivity}/25 · ${L("زمان", "time")} ${r.parts.time}/20 · ${L("انضباط", "discipline")} ${r.parts.discipline}/20`}>
                          {fmtNum(r.score, locale)} · {L(GRADE[r.grade].fa, GRADE[r.grade].en)}
                        </span>
                        <span className="num ms-1.5 text-[11px] text-muted">#{fmtNum(r.rank, locale)}</span>
                      </td>
                      <td className="num">{fmtNum(r.trips, locale)}</td>
                      <td className="num font-semibold">{fmtT(r.tons, locale)}</td>
                      {cols === "weight" ? (
                        <>
                          <td className="num text-muted">{t(r.avgTare)}</td>
                          <td className="num">{t(r.avgGross)}</td>
                          <td className="num font-semibold text-primary">{t(r.avgNet)}</td>
                          {who === "vehicles" && (
                            <td>
                              <span className="flex items-center gap-2">
                                <span className="h-1.5 w-14 overflow-hidden rounded-full bg-surface-2">
                                  <span className={cx("block h-full rounded-full", (r.loadFactor ?? 0) < 0.75 ? "bg-warning" : (r.loadFactor ?? 0) > 1 ? "bg-danger" : "bg-success")} style={{ width: `${Math.min(100, (r.loadFactor ?? 0) * 100)}%` }} />
                                </span>
                                <span className="num text-xs">{pct(r.loadFactor)}</span>
                              </span>
                            </td>
                          )}
                          <td className={cx("num", r.overloads > 0 && "font-bold text-danger")}>{fmtNum(r.overloads, locale)}</td>
                          {who === "vehicles" && <td className={cx("num text-xs", Math.abs(r.tareDev ?? 0) > 300 && "font-bold text-danger")}>{r.tareDev == null ? "—" : `${r.tareDev > 0 ? "+" : ""}${fmtNum(r.tareDev, locale)} kg`}</td>}
                        </>
                      ) : (
                        <>
                          <td className={cx("num text-xs", (r.avgSiteMin ?? 0) > 120 && "font-bold text-warning")}>{min(r.avgSiteMin)}</td>
                          <td className="num text-xs">{min(r.avgWaitMin)}</td>
                          <td className="num">{fmtNum(r.tripsPerDay, locale)}</td>
                          <td className={cx("num", r.holds > 0 && "text-warning")}>{fmtNum(r.holds, locale)}</td>
                          <td className="num">{fmtNum(r.manual, locale)}</td>
                          <td className="num text-xs text-muted">{fmtDateTime(r.lastAt, locale)}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* phone cards */}
            <div className="flex flex-col divide-y divide-border md:hidden">
              {shown.map((r) => (
                <button key={r.id} type="button" onClick={() => setOpen({ kind: who === "drivers" ? "driver" : "vehicle", id: r.id })} className="p-3 text-start">
                  <div className="flex items-center justify-between gap-2">
                    {who === "vehicles" ? <VehicleTag vehicleId={r.id} size="xs" /> : <span className="font-semibold">{nm(r)}</span>}
                    <span className="num text-sm font-bold">
                      {fmtT(r.tons, locale)} {L("تن", "t")}
                    </span>
                  </div>
                  <div className="num mt-1 grid grid-cols-3 gap-1 text-[11px] text-muted">
                    <span>
                      {L("خالی", "Empty")} {t(r.avgTare)}
                    </span>
                    <span>
                      {L("پر", "Loaded")} {t(r.avgGross)}
                    </span>
                    <span>
                      {fmtNum(r.trips, locale)} {L("سفر", "trips")}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            {!shown.length && <div className="px-3 py-10 text-center text-sm text-muted">{L("موردی مطابق فیلتر نیست", "Nothing matches the filter")}</div>}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-2 text-[11px] text-muted">
              <span>{L("ضریب بارگیری = بار خالص ÷ ظرفیت خودرو (زیر ۷۵٪ زرد) · انحراف تارا = وزن خالی اندازه‌گیری‌شده − تارای ثبت‌شده (بیش از ۳۰۰ کیلو قرمز)", "Load factor = net ÷ capacity (under 75% amber) · Tare drift = measured − stored tare (over 300 kg red)")}</span>
              {rows.length > shown.length && (
                <button type="button" className="text-primary print:hidden" onClick={() => setSize("all")}>
                  {L(`نمایش همه ${fmtNum(rows.length, "fa")} ردیف`, `Show all ${rows.length}`)}
                </button>
              )}
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
  const series = trips.map((x) => ({
    when: fmtDateTime(x.at, locale),
    tare: +(x.tare / 1000).toFixed(2),
    gross: +(x.gross / 1000).toFixed(2),
    ...(v ? { gvw: +(v.maxGvwKg / 1000).toFixed(1), ...(v.storedTareKg ? { stored: +(v.storedTareKg / 1000).toFixed(2) } : {}) } : {}),
  }));
  const last = trips.slice(-12).reverse();
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
          <div className="text-xs text-muted">{describeRange(range, locale)}</div>
          {v && (
            <div className="rounded-xl border border-border p-3">
              <VehicleTag vehicleId={v.id} size="md" />
              <Kv k={L("ظرفیت بار", "Rated payload")} v={t(v.ratedPayloadKg)} />
              <Kv k={L("حداکثر وزن کل مجاز", "Max GVW")} v={t(v.maxGvwKg)} />
              <Kv k={L("تارای ثبت‌شده", "Stored tare")} v={t(v.storedTareKg)} />
              <Kv k={L("شرکت حمل", "Carrier")} v={nm(masters?.carriers.find((c) => c.id === v.carrierId))} />
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
            <div className="rounded-xl border border-border p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold">{L("امتیاز عملکرد", "Performance score")}</span>
                <span>
                  <span className={cx("num rounded-full px-2.5 py-1 text-sm font-black", GRADE[row.grade].cls)}>
                    {fmtNum(row.score, locale)} · {L(GRADE[row.grade].fa, GRADE[row.grade].en)}
                  </span>
                  <span className="num ms-2 text-xs text-muted">
                    {L("رتبه", "rank")} {fmtNum(row.rank, locale)} {L("از", "of")} {fmtNum((kind === "vehicle" ? data.vehicles : data.drivers).length, locale)}
                  </span>
                </span>
              </div>
              {(
                [
                  [L("بار (ضریب بارگیری)", "Load"), row.parts.load, 35],
                  [L("بهره‌وری (تناژ روزانه)", "Productivity"), row.parts.productivity, 25],
                  [L("زمان در سایت", "Time on site"), row.parts.time, 20],
                  [L("انضباط (اضافه‌بار، توقف، دستی)", "Discipline"), row.parts.discipline, 20],
                ] as const
              ).map(([k, v, max]) => (
                <div key={k} className="mt-1.5 flex items-center gap-2 text-xs">
                  <span className="w-44 shrink-0">{k}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                    <span className={cx("block h-full rounded-full", v / max >= 0.8 ? "bg-success" : v / max >= 0.5 ? "bg-warning" : "bg-danger")} style={{ width: `${(v / max) * 100}%` }} />
                  </span>
                  <span className="num w-12 text-end">
                    {fmtNum(v, locale)}/{fmtNum(max, locale)}
                  </span>
                </div>
              ))}
              {row.issue && <div className="mt-2 rounded-lg bg-danger/8 px-2 py-1.5 text-xs text-danger">{row.issue}</div>}
            </div>
          )}
          {row ? (
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
          ) : (
            <div className="rounded-lg bg-surface-2 px-3 py-4 text-center text-sm text-muted">{L("در این بازه سفری ثبت نشده", "No trips in this period")}</div>
          )}
          {trips.length > 0 && (
            <>
              <div>
                <div className="mb-1 text-sm font-semibold">{L("روند وزن خالی و پر در سفرها (تن)", "Empty and loaded weight across trips (t)")}</div>
                <Lines
                  data={series}
                  x="when"
                  unit={L("تن", "t")}
                  height={200}
                  series={[
                    { key: "gross", name: L("وزن پر", "Loaded"), color: C_GROSS },
                    { key: "tare", name: L("وزن خالی", "Empty"), color: C_TARE },
                    ...(v ? [{ key: "gvw", name: L("حداکثر وزن مجاز", "Max GVW"), color: "#b42335", dashed: true }] : []),
                    ...(v?.storedTareKg ? [{ key: "stored", name: L("تارای ثبت‌شده", "Stored tare"), color: "#475569", dashed: true }] : []),
                  ]}
                />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm font-semibold">
                  {L("آخرین سفرها — خالی و بار خالص", "Latest trips — empty and net")}
                  <a href={reportHref()} target="_blank" rel="noreferrer" className="text-xs font-normal text-primary">
                    {L("گزارش کامل / PDF", "Full report / PDF")}
                  </a>
                </div>
                <WeightCompare
                  maxKg={v ? Math.max(v.maxGvwKg, ...last.map((x) => x.gross)) : undefined}
                  rows={last.map((x) => ({ id: x.txId, label: fmtDateTime(x.at, locale), sub: `${kind === "vehicle" ? nm(masters?.drivers.find((y) => y.id === x.driverId)) : x.vehicleId} · ${loc(x.originId)} ← ${loc(x.destinationId)}`, tareKg: x.tare, grossKg: x.gross, overloads: x.overload ? 1 : 0, trips: 1, loadFactor: v ? x.net / v.ratedPayloadKg : undefined, plain: true }))}
                />
              </div>
            </>
          )}
        </div>
      )}
    </Drawer>
  );
}
