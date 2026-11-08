"use client";
import { ArrowDownToLine, ArrowUpFromLine, FileSpreadsheet, Layers3, Printer } from "lucide-react";
import { useState } from "react";
import { VehicleTag } from "@/components/domain/VehicleTag";
import { Button, Card, CardHeader, cx, PageHeader, Skeleton } from "@/components/ui";
import { DateRange, describeRange, type DateRangeValue } from "@/components/ui/DateRange";
import { clockNow } from "@/domain/clock";
import { presetRange } from "@/domain/reportFilter";
import { downloadCsv } from "@/lib/export";
import { fmtDateTime, fmtNum, fmtT, faDigits } from "@/lib/format";
import { useMasters, useView } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import type { StockpilesData } from "@/server/views";

function Fill({ pct, color }: { pct: number; color: string }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  return (
    <svg width="84" height="84" viewBox="0 0 100 100" className="-rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="12" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${c * Math.min(1, pct)} ${c}`} />
    </svg>
  );
}

export default function StockpilesPage() {
  const L = useL();
  const locale = useLocale();
  const masters = useMasters();
  const [range, setRange] = useState<DateRangeValue>(() => ({ ...presetRange("7d", clockNow()), preset: "7d" }));
  const { data } = useView<StockpilesData>("stockpiles", { from: range.from, to: range.to }, 30_000);
  const loc = (id: string) => masters?.locations.find((l) => l.id === id);
  const nm = (x?: { name: string; nameEn?: string }) => (x ? (locale === "fa" ? x.name : x.nameEn ?? x.name) : "—");
  const shortName = (id: string) => nm(loc(id)).split(" — ")[0];
  const color = (mid?: string) => masters?.materials.find((m) => m.id === mid)?.color ?? "#1273a6";
  if (!data) return <Skeleton className="h-[70vh]" />;
  const totIn = data.moves.filter((m) => m.dir === "IN").reduce((a, m) => a + m.t, 0);
  const totOut = data.moves.filter((m) => m.dir === "OUT").reduce((a, m) => a + m.t, 0);

  return (
    <div>
      <PageHeader
        icon={<Layers3 className="size-5" />}
        title={L("دپوها", "Stockpiles")}
        subtitle={L("موجودی هر دپو از روی تیکت‌های توزین: ورود از پیت یا کارخانه، برداشت برای فروش یا کارخانه", "Stockpile balances from weighed tickets: in from pit or plant, out to sales or the plant")}
        actions={
          <>
            <Button size="sm" onClick={() => downloadCsv("stockpile-moves.csv", [L("زمان", "Time"), L("تیکت", "Ticket"), L("خودرو", "Vehicle"), L("دپو", "Stockpile"), L("جهت", "Direction"), L("مبدأ", "Origin"), L("مقصد", "Destination"), L("تن", "t")], data.moves.map((m) => [m.at, m.ticketNo, m.vehicleId, shortName(m.stockpileId), m.dir === "IN" ? L("ورود", "In") : L("برداشت", "Out"), nm(loc(m.originId)), nm(loc(m.destinationId)), +m.t.toFixed(2)]))}>
              <FileSpreadsheet className="size-4" /> Excel
            </Button>
            <Button size="sm" variant="primary" onClick={() => window.print()}>
              <Printer className="size-4" /> {L("چاپ / PDF", "Print / PDF")}
            </Button>
          </>
        }
      />

      <div className="mb-4 grid gap-4 lg:grid-cols-3">
        {data.stockpiles.map((p) => {
          const pct = p.capacityT ? p.balanceT / p.capacityT : 0;
          const max = Math.max(1, ...p.days.flatMap((x) => [x.inT, x.outT]));
          return (
            <Card key={p.id} className="p-5">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Fill pct={pct} color={color(p.materialId)} />
                  <span className="num absolute inset-0 grid place-items-center text-sm font-black">{fmtNum(Math.round(pct * 100), locale)}٪</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold">{nm(p)}</div>
                  <div className="text-xs text-muted">{nm(masters?.materials.find((x) => x.id === p.materialId))}</div>
                  <div className="num mt-1 text-2xl font-black">
                    {fmtT(p.balanceT, locale, 0)} <span className="text-sm font-medium text-muted">{L("تن", "t")}</span>
                  </div>
                  <div className="text-xs text-muted">
                    {L("ظرفیت", "Capacity")} <span className="num">{fmtNum(p.capacityT, locale)}</span> {L("تن", "t")}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-success/8 px-3 py-2">
                  <div className="flex items-center gap-1 text-xs text-success">
                    <ArrowDownToLine className="size-3.5" /> {L("ورود امروز", "In today")}
                  </div>
                  <div className="num font-bold">{fmtT(p.todayIn, locale)}</div>
                </div>
                <div className="rounded-lg bg-warning/10 px-3 py-2">
                  <div className="flex items-center gap-1 text-xs text-warning">
                    <ArrowUpFromLine className="size-3.5" /> {L("برداشت امروز", "Out today")}
                  </div>
                  <div className="num font-bold">{fmtT(p.todayOut, locale)}</div>
                </div>
              </div>
              {/* 7-day in (up) / out (down) */}
              <div className="mt-4">
                <div className="mb-1 text-[11px] text-muted">{L("۷ روز اخیر — ورود بالا، برداشت پایین", "Last 7 days — in above, out below")}</div>
                <div className="flex h-24 items-stretch gap-1">
                  {p.days.map((x) => (
                    <div key={x.day} className="flex flex-1 flex-col" title={`${x.day}: +${x.inT} / −${x.outT}`}>
                      <div className="flex flex-1 items-end">
                        <div className="w-full rounded-t bg-success/70" style={{ height: `${(x.inT / max) * 100}%` }} />
                      </div>
                      <div className="h-px bg-border" />
                      <div className="flex flex-1 items-start">
                        <div className="w-full rounded-b bg-warning/70" style={{ height: `${(x.outT / max) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-1 flex gap-1 text-center text-[9px] text-muted">
                  {p.days.map((x) => (
                    <span key={x.day} className="num flex-1">
                      {locale === "fa" ? faDigits(x.day.slice(8)) : x.day.slice(8)}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader
          title={L("حرکات دپو", "Stockpile movements")}
          subtitle={`${describeRange(range, locale)} · ${L("ورود", "in")} ${fmtT(totIn, locale)} ${L("تن", "t")} · ${L("برداشت", "out")} ${fmtT(totOut, locale)} ${L("تن", "t")}`}
        />
        <div className="border-b border-border p-4 print:hidden">
          <DateRange value={range} onChange={setRange} />
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-xs text-muted">
              <tr>
                {[L("زمان", "Time"), L("تیکت", "Ticket"), L("خودرو", "Vehicle"), L("دپو", "Stockpile"), L("حرکت", "Move"), L("مسیر", "Route"), L("تن", "t")].map((h) => (
                  <th key={h} className="px-3 py-2 text-start font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.moves.slice(0, 60).map((m) => (
                <tr key={m.txId + m.dir} className="border-t border-border">
                  <td className="num px-3 py-1.5 text-xs">{fmtDateTime(m.at, locale)}</td>
                  <td className="px-3 py-1.5 font-mono text-xs ltr">{m.ticketNo}</td>
                  <td className="px-3 py-1.5">
                    <VehicleTag vehicleId={m.vehicleId} size="xs" />
                  </td>
                  <td className="px-3 py-1.5 text-xs">{shortName(m.stockpileId)}</td>
                  <td className="px-3 py-1.5">
                    <span className={cx("rounded px-1.5 py-0.5 text-[11px] font-semibold", m.dir === "IN" ? "bg-success/10 text-success" : "bg-warning/15 text-warning")}>{m.dir === "IN" ? L("ورود به دپو", "Into stockpile") : L("برداشت از دپو", "Out of stockpile")}</span>
                  </td>
                  <td className="px-3 py-1.5 text-xs">
                    {shortName(m.originId)} ← {shortName(m.destinationId)}
                  </td>
                  <td className={cx("num px-3 py-1.5 font-semibold", m.dir === "IN" ? "text-success" : "text-warning")}>
                    {m.dir === "IN" ? "+" : "−"}
                    {fmtT(m.t, locale)}
                  </td>
                </tr>
              ))}
              {!data.moves.length && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-sm text-muted">
                    {L("در این بازه حرکتی ثبت نشده", "No movements in this period")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {data.moves.length > 60 && <div className="border-t border-border px-3 py-2 text-center text-xs text-muted">{L(`نمایش ۶۰ حرکت آخر از ${fmtNum(data.moves.length, locale)} — همه در خروجی Excel`, `Showing the last 60 of ${data.moves.length} moves — all in the Excel export`)}</div>}
      </Card>
    </div>
  );
}
