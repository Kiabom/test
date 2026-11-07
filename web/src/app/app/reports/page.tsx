"use client";
import { BarChart3, Bookmark, CalendarCheck2, Columns3, FileDown, FileSpreadsheet, Mail, Printer, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Bars } from "@/components/charts";
import { FilterBar, describeFilter } from "@/components/reports/FilterBar";
import { ReportTable, useReportData } from "@/components/reports/ReportTable";
import { buildReport, DEFAULT_DETAIL_COLS, DETAIL_COLS, flatRows, GROUP_BY, TEMPLATES, type GroupBy, type TplId } from "@/components/reports/reportModel";
import { Button, Card, CardHeader, ConfirmDialog, cx, Dialog, Field, Input, KpiTile, PageHeader, Select, Skeleton, toast } from "@/components/ui";
import { BRAND, SITE } from "@/config/brand";
import { clockNow } from "@/domain/clock";
import { emptyFilter, filterCode, filterToQuery, queryToFilter, type ReportFilter } from "@/domain/reportFilter";
import type { AuditEvent } from "@/domain/types";
import { ERRORS, lbl } from "@/i18n/labels";
import { downloadCsv } from "@/lib/export";
import { fmtDate, fmtNum, fmtT } from "@/lib/format";
import { act, ActionError, useData, useMasters } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import { userName } from "@/lib/users";

const COLS_KEY = "tozin-report-cols";
const SAVED_KEY = "tozin-report-saved";
interface SavedFilter {
  name: string;
  tpl: TplId;
  g: GroupBy;
  q: string;
}
function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function store(key: string, v: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* storage unavailable */
  }
}
const loadCols = () => read<string[]>(COLS_KEY, DEFAULT_DETAIL_COLS);
const loadSaved = () => read<SavedFilter[]>(SAVED_KEY, []);

export default function ReportsPage() {
  const L = useL();
  const locale = useLocale();
  const masters = useMasters();
  const [tpl, setTpl] = useState<TplId>("daily");
  const [filter, setFilter] = useState<ReportFilter>(() => emptyFilter(clockNow(), "today"));
  const [groupBy, setGroupBy] = useState<GroupBy>("");
  const [cols, setCols] = useState<string[]>(() => loadCols());
  const [colsOpen, setColsOpen] = useState(false);
  const [saved, setSaved] = useState<SavedFilter[]>(() => loadSaved());
  const [saveDlg, setSaveDlg] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [sched, setSched] = useState(false);
  const [email, setEmail] = useState("manager@example.com");
  const [time, setTime] = useState("07:00");
  const [closeDlg, setCloseDlg] = useState(false);
  const rd = useReportData(filter);
  const { data: closes } = useData<AuditEvent>("audit", { action: "day.closed", limit: 30 }, 5000);
  const txs = useMemo(() => rd?.txs ?? [], [rd]);
  const approved = txs.filter((t) => t.state === "APPROVED");
  const out = useMemo(
    () => buildReport(tpl, txs, { masters, locale, visits: rd?.visits, manualWeighs: rd?.manualWeighs, permitIds: filter.permits, customerIds: filter.customers, materialIds: filter.materials }, { groupBy, cols }),
    [tpl, txs, rd, masters, locale, groupBy, cols, filter.permits, filter.customers, filter.materials],
  );
  const t = TEMPLATES.find((x) => x.id === tpl)!;
  const title = L(t.fa, t.en);
  const filterLines = describeFilter(filter, masters, locale);
  const fileBase = `report-${tpl}-${filterCode(filter, tpl)}`;

  const printUrl = () => {
    const q = filterToQuery(filter);
    q.set("tpl", tpl);
    if (tpl === "daily" && groupBy) q.set("g", groupBy);
    if (tpl === "daily") q.set("cols", cols.join(","));
    q.set("auto", "1");
    return `/print/report?${q.toString()}`;
  };
  const exportCsv = () => downloadCsv(`${fileBase}.csv`, ["#", ...out.cols.map((c) => L(c.fa, c.en))], flatRows(out).map((r, i) => [i + 1, ...r]));
  const exportXls = () => {
    // Excel-compatible HTML workbook with a title block (opens natively in Excel / LibreOffice)
    const esc = (v: unknown) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
    const span = out.cols.length;
    const head = [`<tr><th colspan="${span}" style="font-size:14pt">${esc(BRAND.name)} — ${esc(title)}</th></tr>`, `<tr><td colspan="${span}">${esc(SITE.name)}</td></tr>`, ...filterLines.map((x) => `<tr><td colspan="${span}">${esc(x.label)}: ${esc(x.value)}</td></tr>`), "<tr></tr>"].join("");
    const body = `<tr>${out.cols.map((c) => `<th style="background:#e9eef4">${esc(L(c.fa, c.en))}</th>`).join("")}</tr>${flatRows(out).map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}`;
    const html = `<html dir="${locale === "fa" ? "rtl" : "ltr"}"><head><meta charset="utf-8"></head><body><table border="1">${head}${body}</table></body></html>`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["\ufeff" + html], { type: "application/vnd.ms-excel" }));
    a.download = `${fileBase}.xls`;
    a.click();
  };
  const run = async (type: string, payload: Record<string, unknown>, ok: string) => {
    try {
      await act(type, payload);
      toast.success(ok);
    } catch (e) {
      toast.error(e instanceof ActionError ? lbl(ERRORS, e.code, locale) : String(e));
    }
  };
  const toggleCol = (k: string) => {
    const next = cols.includes(k) ? cols.filter((c) => c !== k) : DETAIL_COLS.map((c) => c.key).filter((c) => c === k || cols.includes(c));
    if (next.length === 0) return;
    setCols(next);
    store(COLS_KEY, next);
  };
  const applySaved = (s: SavedFilter) => {
    const f = queryToFilter(new URLSearchParams(s.q), clockNow());
    setFilter(f);
    setTpl(s.tpl);
    setGroupBy(s.g);
  };
  const today = new Date(clockNow() + 210 * 60000).toISOString().slice(0, 10);
  const closedToday = (closes?.items ?? []).some((a) => a.entityId === today);
  const netT = approved.reduce((a, x) => a + (x.netKg ?? 0), 0) / 1000;
  const billT = approved.reduce((a, x) => a + (x.billableKg ?? x.netKg ?? 0), 0) / 1000;
  return (
    <div>
      <PageHeader icon={<BarChart3 className="size-5" />} title={L("گزارش‌ها", "Reports")} subtitle={L("بازه زمانی و ویژگی‌های داده را انتخاب کنید؛ همان نتیجه چاپ، PDF یا Excel می‌شود", "Pick a period and any attributes; exactly that result is printed or exported")} />

      <Card className="mb-4 p-4">
        <FilterBar value={filter} onChange={setFilter} masters={masters} count={rd ? txs.length : undefined} />
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
          {saved.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <Bookmark className="size-4 text-muted" />
              {saved.map((x, i) => (
                <span key={x.name + i} className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs">
                  <button type="button" onClick={() => applySaved(x)} className="hover:text-primary">
                    {x.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const next = saved.filter((_, j) => j !== i);
                      setSaved(next);
                      store(SAVED_KEY, next);
                    }}
                    className="text-muted hover:text-danger"
                    aria-label={L("حذف", "Delete")}
                  >
                    <Trash2 className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <Button size="sm" variant="ghost" onClick={() => setSaveDlg(true)}>
            <Bookmark className="size-4" /> {L("ذخیره این فیلتر", "Save this filter")}
          </Button>
          <div className="flex-1" />
          <Button size="sm" onClick={exportCsv} disabled={!rd}>
            <FileDown className="size-4" /> CSV
          </Button>
          <Button size="sm" onClick={exportXls} disabled={!rd}>
            <FileSpreadsheet className="size-4" /> Excel
          </Button>
          <Button size="sm" variant="primary" onClick={() => window.open(printUrl(), "_blank")} disabled={!rd}>
            <Printer className="size-4" /> {L("چاپ / PDF", "Print / PDF")}
          </Button>
          <Button size="sm" onClick={() => setSched(true)}>
            <Mail className="size-4" /> {L("ایمیل زمان‌بندی", "Schedule e-mail")}
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[250px_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title={L("نوع گزارش", "Report type")} />
            <div className="p-2">
              {(["detail", "summary", "other"] as const).map((grp) => (
                <div key={grp} className="mb-1">
                  <div className="px-3 pb-1 pt-2 text-[10px] font-semibold text-muted">{grp === "detail" ? L("ریز تیکت‌ها", "Detail") : grp === "summary" ? L("خلاصه‌ها", "Summaries") : L("کنترلی", "Control")}</div>
                  {TEMPLATES.filter((x) => x.group === grp).map((x) => (
                    <button key={x.id} onClick={() => setTpl(x.id)} className={cx("flex w-full items-center rounded-lg px-3 py-2 text-start text-sm hover:bg-surface-2", tpl === x.id && "bg-primary/10 font-semibold text-primary")}>
                      {L(x.fa, x.en)}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <CalendarCheck2 className="size-4 text-primary" /> {L("بستن روز", "Daily close")}
            </div>
            <div className="text-xs text-muted">{L("قفل اسناد امروز پس از تطبیق؛ بعد از بستن، اصلاح فقط با سند اصلاحی.", "Locks today's documents after reconciliation; afterwards only correction documents.")}</div>
            <Button className="mt-3 w-full" variant={closedToday ? "ghost" : "primary"} disabled={closedToday} onClick={() => setCloseDlg(true)}>
              {closedToday ? L("امروز بسته شده ✓", "Today closed ✓") : L("بستن روز", "Close day")}
            </Button>
            {(closes?.items ?? []).slice(0, 4).map((a) => (
              <div key={a.id} className="mt-1 flex justify-between text-[11px] text-muted">
                <span>{fmtDate(a.entityId, locale)}</span>
                <span>{userName(a.actorId, locale)}</span>
              </div>
            ))}
          </Card>
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <KpiTile label={L("تیکت‌ها", "Tickets")} value={fmtNum(txs.length, locale)} />
            <KpiTile label={L("خالص تأییدشده", "Approved net")} value={fmtT(netT, locale)} unit="t" tone="success" />
            <KpiTile label={L("قابل محاسبه", "Billable")} value={fmtT(billT, locale)} unit="t" tone="info" />
            <KpiTile label={L("میانگین خالص هر سفر", "Avg net per trip")} value={fmtT(approved.length ? netT / approved.length : 0, locale)} unit="t" tone="neutral" />
          </div>
          <Card className="min-w-0">
            <CardHeader
              title={title}
              subtitle={`${filterLines[0].value} · ${fmtNum(out.rowCount, locale)} ${L("ردیف", "rows")}`}
              actions={
                tpl === "daily" ? (
                  <div className="flex items-center gap-2">
                    <Select value={groupBy} onChange={(e) => setGroupBy(e.target.value as GroupBy)} className="h-9 text-xs" aria-label={L("گروه‌بندی", "Group by")}>
                      {GROUP_BY.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.id ? `${L("گروه‌بندی:", "Group:")} ${L(g.fa, g.en)}` : L(g.fa, g.en)}
                        </option>
                      ))}
                    </Select>
                    <div className="relative">
                      <Button size="sm" variant="ghost" onClick={() => setColsOpen((o) => !o)}>
                        <Columns3 className="size-4" /> {L("ستون‌ها", "Columns")}
                      </Button>
                      {colsOpen && (
                        <div className="absolute end-0 top-10 z-40 w-56 rounded-xl border border-border bg-surface p-2 shadow-xl">
                          {DETAIL_COLS.map((c) => (
                            <label key={c.key} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs hover:bg-surface-2">
                              <input type="checkbox" checked={cols.includes(c.key)} onChange={() => toggleCol(c.key)} />
                              {L(c.fa, c.en)}
                            </label>
                          ))}
                          <button type="button" className="mt-1 w-full rounded-lg px-2 py-1 text-xs text-primary hover:bg-primary/10" onClick={() => (setCols(DEFAULT_DETAIL_COLS), store(COLS_KEY, DEFAULT_DETAIL_COLS))}>
                            {L("ستون‌های پیش‌فرض", "Default columns")}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : undefined
              }
            />
            {out.chart && out.chart.length > 0 && (
              <div className="border-b border-border p-3">
                <Bars data={out.chart} x="k" series={[{ key: "v", name: out.chartUnit ?? L("مقدار", "Value"), color: "#1273a6" }]} height={200} />
              </div>
            )}
            {!rd ? <Skeleton className="m-4 h-64" /> : <ReportTable out={out} max={300} />}
          </Card>
        </div>
      </div>

      <Dialog
        open={saveDlg}
        onClose={() => setSaveDlg(false)}
        title={L("ذخیره فیلتر", "Save filter")}
        footer={
          <Button
            variant="primary"
            disabled={!saveName.trim()}
            onClick={() => {
              const next = [...saved.filter((x) => x.name !== saveName.trim()), { name: saveName.trim(), tpl, g: groupBy, q: filterToQuery(filter).toString() }];
              setSaved(next);
              store(SAVED_KEY, next);
              setSaveDlg(false);
              setSaveName("");
              toast.success(L("فیلتر ذخیره شد", "Filter saved"));
            }}
          >
            {L("ذخیره", "Save")}
          </Button>
        }
      >
        <Field label={L("نام فیلتر", "Name")} hint={L("مثلاً: فولاد زرند — شیفت صبح", "e.g. Zarand Steel — morning shift")}>
          <Input value={saveName} onChange={(e) => setSaveName(e.target.value)} autoFocus />
        </Field>
      </Dialog>
      <Dialog
        open={sched}
        onClose={() => setSched(false)}
        title={L("ارسال زمان‌بندی‌شده", "Scheduled delivery")}
        footer={
          <Button
            variant="primary"
            onClick={async () => {
              await run("report.schedule", { template: tpl, email, time }, L("زمان‌بندی ثبت شد (صف ارسال ایمیل)", "Scheduled (e-mail queue)"));
              setSched(false);
            }}
          >
            {L("ثبت", "Save")}
          </Button>
        }
      >
        <div className="flex flex-col gap-3">
          <Field label={L("گزارش", "Report")}>
            <Input value={title} readOnly />
          </Field>
          <Field label={L("ایمیل گیرنده", "Recipient e-mail")}>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="ltr" />
          </Field>
          <Field label={L("ساعت ارسال روزانه", "Daily send time")}>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="ltr" />
          </Field>
        </div>
      </Dialog>
      <ConfirmDialog open={closeDlg} onClose={() => setCloseDlg(false)} needReason={false} title={L("بستن روز", "Close the day")} description={L(`${fmtNum(txs.length - approved.length, locale)} سند باز/استثنا در بازه انتخابی دارید. بستن روز در ردپای ممیزی ثبت می‌شود.`, `${txs.length - approved.length} open/exception documents in the selected period. Closing is audited.`)} onConfirm={() => run("day.close", {}, L("روز بسته شد", "Day closed"))} />
    </div>
  );
}
