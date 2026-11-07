"use client";
import { Lock, Printer } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { describeFilter } from "@/components/reports/FilterBar";
import { ReportTable, useReportData } from "@/components/reports/ReportTable";
import { buildReport, TEMPLATES, type GroupBy, type TplId } from "@/components/reports/reportModel";
import { LogoMark } from "@/components/shell/Logo";
import { Button, cx, Segmented, Skeleton } from "@/components/ui";
import { BRAND, SITE } from "@/config/brand";
import { canSee } from "@/domain/access";
import { clockNow } from "@/domain/clock";
import { filterCode, queryToFilter, toJDate } from "@/domain/reportFilter";
import { fmtDate, fmtNum, fmtT, fmtTime } from "@/lib/format";
import { useLiveConnection, useMasters } from "@/lib/live";
import { useL, useLocale, usePrefs } from "@/lib/prefs";
import { USERS_LIST } from "@/lib/users";

function ReportDoc() {
  useLiveConnection();
  const L = useL();
  const locale = useLocale();
  const sp = useSearchParams();
  const masters = useMasters();
  const userId = usePrefs((s) => s.userId);
  const user = USERS_LIST.find((u) => u.id === userId);
  const tpl = ((sp.get("tpl") as TplId) || "daily") as TplId;
  const groupBy = (sp.get("g") ?? "") as GroupBy;
  const cols = sp.get("cols")?.split(",").filter(Boolean);
  const filter = useMemo(() => queryToFilter(new URLSearchParams(sp.toString()), clockNow()), [sp]);
  const rd = useReportData(filter);
  const t = TEMPLATES.find((x) => x.id === tpl) ?? TEMPLATES[0];
  const out = useMemo(
    () => buildReport(tpl, rd?.txs ?? [], { masters, locale, visits: rd?.visits, manualWeighs: rd?.manualWeighs, permitIds: filter.permits, customerIds: filter.customers, materialIds: filter.materials }, { groupBy, cols }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tpl, rd, masters, locale, groupBy, sp],
  );
  const [orient, setOrient] = useState<"portrait" | "landscape">(out.cols.length > 7 ? "landscape" : "portrait");
  const [chart, setChart] = useState(false);
  const [size, setSize] = useState<"normal" | "compact">("normal");
  const printed = useRef(false);
  const ready = !!rd && !!masters;
  useEffect(() => {
    if (out.cols.length > 7) setOrient("landscape");
  }, [out.cols.length]);
  useEffect(() => {
    if (ready && sp.get("auto") === "1" && !printed.current) {
      printed.current = true;
      setTimeout(() => window.print(), 600);
    }
  }, [ready, sp]);

  if (!user || !canSee(user.role, "/app/reports"))
    return (
      <div className="mx-auto mt-24 flex max-w-md flex-col items-center gap-3 text-center">
        <Lock className="size-8 text-danger" />
        <div className="font-bold">{L("به گزارش‌ها دسترسی ندارید", "You don't have access to reports")}</div>
      </div>
    );
  if (!ready) return <Skeleton className="m-10 h-96" />;

  const txs = rd.txs;
  const approved = txs.filter((x) => x.state === "APPROVED");
  const netT = approved.reduce((a, x) => a + (x.netKg ?? 0), 0) / 1000;
  const billT = approved.reduce((a, x) => a + (x.billableKg ?? x.netKg ?? 0), 0) / 1000;
  const lines = describeFilter(filter, masters, locale);
  const now = clockNow();
  const docNo = `RPT-${toJDate(now).jy}-${filterCode(filter, tpl)}`;
  const fa = locale === "fa";
  const pageLabel = fa ? `"صفحه " counter(page, persian) " از " counter(pages, persian)` : `"Page " counter(page) " of " counter(pages)`;

  return (
    <div className="min-h-screen bg-zinc-200 py-6 print:bg-white print:py-0">
      <style>{`
        @page { size: A4 ${orient}; margin: 12mm 10mm 14mm; @bottom-center { content: ${pageLabel}; font-family: "Vazirmatn Variable", sans-serif; font-size: 8pt; color: #555; } @bottom-left { content: "${docNo}"; font-family: monospace; font-size: 7pt; color: #777; } }
        @media print { html, body { background: #fff !important; } .report-print-table thead { display: table-header-group; } .report-print-table tr { break-inside: avoid; } }
      `}</style>

      <div className="no-print mx-auto mb-4 flex max-w-[297mm] flex-wrap items-center justify-center gap-3 px-4">
        <Segmented options={[{ id: "portrait", label: L("عمودی", "Portrait") }, { id: "landscape", label: L("افقی", "Landscape") }]} value={orient} onChange={setOrient} />
        <Segmented options={[{ id: "normal", label: L("قلم عادی", "Normal") }, { id: "compact", label: L("فشرده", "Compact") }]} value={size} onChange={setSize} />
        {out.chart && out.chart.length > 0 && (
          <label className="flex items-center gap-1.5 text-sm">
            <input type="checkbox" checked={chart} onChange={(e) => setChart(e.target.checked)} /> {L("نمودار", "Chart")}
          </label>
        )}
        <Button variant="primary" onClick={() => window.print()}>
          <Printer className="size-4" /> {L("چاپ / ذخیره PDF", "Print / save PDF")}
        </Button>
        <span className="text-xs text-zinc-600">{L("برای فایل PDF در پنجره چاپ «ذخیره به‌صورت PDF» را انتخاب کنید", "Choose “Save as PDF” in the print dialog for a PDF file")}</span>
      </div>

      <div className={cx("mx-auto bg-white p-[10mm] text-black shadow-xl print:w-auto print:p-0 print:shadow-none", orient === "landscape" ? "w-[297mm]" : "w-[210mm]", size === "compact" ? "text-[9pt]" : "text-[10pt]")} style={{ fontFamily: "Vazirmatn Variable, sans-serif" }}>
        {/* letterhead */}
        <div className="flex items-start justify-between border-b-2 border-black pb-2">
          <div className="flex items-center gap-2">
            <LogoMark size={34} />
            <div>
              <div className="text-[13pt] font-black">{fa ? BRAND.name : BRAND.nameEn}</div>
              <div className="text-[9pt]">{fa ? `${SITE.name} · ${SITE.place}` : `${SITE.nameEn} · ${SITE.placeEn}`}</div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-[14pt] font-black">{L(t.fa, t.en)}</div>
            <div className="text-[9pt]">{lines[0].value}</div>
          </div>
          <div className="text-end text-[8.5pt] leading-5">
            <div>
              {L("شماره گزارش", "Report no.")}: <span className="font-mono">{docNo}</span>
            </div>
            <div>
              {L("تاریخ تهیه", "Prepared")}: <span className="num">{fmtDate(now, locale)} {fmtTime(now, locale)}</span>
            </div>
            {user && (
              <div>
                {L("تهیه‌کننده", "Prepared by")}: {fa ? user.name : user.nameEn} <span className="num">({fmtNum(Number(user.personnelNo), locale, { useGrouping: false })})</span>
              </div>
            )}
          </div>
        </div>

        {/* filters */}
        <div className="mt-3 rounded border border-zinc-400 px-3 py-2 text-[8.5pt]">
          <div className="mb-1 font-bold">{L("شرایط گزارش", "Report criteria")}</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
            {lines.map((x) => (
              <div key={x.key}>
                <span className="text-zinc-600">{x.label}:</span> <span className="font-medium">{x.value}</span>
              </div>
            ))}
            {lines.length === 1 && <div className="text-zinc-600">{L("بدون فیلتر دیگر (همه داده‌های بازه)", "No other filter (all data in the period)")}</div>}
            {tpl === "daily" && groupBy && (
              <div>
                <span className="text-zinc-600">{L("گروه‌بندی", "Grouped by")}:</span> <span className="font-medium">{L(...(({ day: ["روز", "Day"], shift: ["شیفت", "Shift"], customer: ["مشتری", "Customer"], material: ["ماده", "Material"], vehicle: ["خودرو", "Vehicle"], carrier: ["شرکت حمل", "Carrier"], driver: ["راننده", "Driver"] } as Record<string, [string, string]>)[groupBy]))}</span>
              </div>
            )}
          </div>
        </div>

        {/* summary */}
        <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[8.5pt]">
          {[
            [L("تعداد تیکت", "Tickets"), fmtNum(txs.length, locale)],
            [L("تأییدشده", "Approved"), fmtNum(approved.length, locale)],
            [L("خالص تأییدشده (تن)", "Approved net (t)"), fmtT(netT, locale, 2)],
            [L("قابل محاسبه (تن)", "Billable (t)"), fmtT(billT, locale, 2)],
          ].map(([k, v]) => (
            <div key={k} className="rounded border border-zinc-300 px-2 py-1.5">
              <div className="text-zinc-600">{k}</div>
              <div className="num text-[12pt] font-bold">{v}</div>
            </div>
          ))}
        </div>

        {chart && out.chart && out.chart.length > 0 && (
          <div className="mt-3 break-inside-avoid rounded border border-zinc-300 p-2">
            <div className="mb-1 text-[8.5pt] font-bold">{out.chartUnit}</div>
            {(() => {
              const max = Math.max(...out.chart!.map((c) => c.v), 1);
              return out.chart!.map((c) => (
                <div key={c.k} className="flex items-center gap-2 py-[2px] text-[8.5pt]">
                  <span className="w-40 shrink-0 truncate">{c.k}</span>
                  <span className="h-3 flex-1">
                    <span className="block h-3 rounded-sm bg-zinc-700" style={{ width: `${(c.v / max) * 100}%` }} />
                  </span>
                  <span className="num w-16 shrink-0 text-end">{fmtNum(c.v, locale)}</span>
                </div>
              ));
            })()}
          </div>
        )}

        <div className="mt-3">
          <ReportTable out={out} print />
        </div>

        {/* signatures */}
        <div className="mt-10 grid break-inside-avoid grid-cols-3 gap-6 text-center text-[9pt]">
          {[L("تهیه‌کننده", "Prepared by"), L("کنترل و تأیید", "Checked & approved"), L("مدیر سایت", "Site manager")].map((x) => (
            <div key={x}>
              <div className="mb-10 font-semibold">{x}</div>
              <div className="border-t border-black pt-1 text-[8pt] text-zinc-600">{L("نام، امضا و تاریخ", "Name, signature & date")}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-[7.5pt] text-zinc-500">{L("این گزارش از سامانه فناپ توزین تهیه شده و اعداد آن از تیکت‌های ثبت‌شده در بازه بالا محاسبه شده است.", "Generated by Fanap Tozin from the tickets recorded in the period above.")}</div>
      </div>
    </div>
  );
}

export default function PrintReportPage() {
  return (
    <Suspense fallback={<Skeleton className="m-10 h-96" />}>
      <ReportDoc />
    </Suspense>
  );
}
