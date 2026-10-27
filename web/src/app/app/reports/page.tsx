"use client";
import { BarChart3, CalendarCheck2, FileDown, FileSpreadsheet, Mail, Printer } from "lucide-react";
import { useMemo, useState } from "react";
import { Bars } from "@/components/charts";
import { Badge, Button, Card, CardHeader, ConfirmDialog, cx, Dialog, Field, Input, KpiTile, PageHeader, Segmented, Select, Skeleton, Table, Td, toast } from "@/components/ui";
import type { AuditEvent, Transaction, Visit, WeighEvent } from "@/domain/types";
import { ERRORS, lbl, OPERATION } from "@/i18n/labels";
import { downloadCsv } from "@/lib/export";
import { fmtDate, fmtDateTime, fmtKg, fmtNum, fmtT } from "@/lib/format";
import { act, ActionError, useData, useMasters } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import { userName } from "@/lib/users";

type TplId = "daily" | "customer" | "material" | "vehicle" | "trips" | "exceptions" | "manual" | "shift" | "permit";
const TEMPLATES: { id: TplId; fa: string; en: string; src: string }[] = [
  { id: "daily", fa: "خلاصه روزانه تیکت‌ها", en: "Daily ticket summary", src: "WeighHub" },
  { id: "customer", fa: "به تفکیک مشتری", en: "By customer", src: "WeighHub" },
  { id: "material", fa: "به تفکیک ماده", en: "By material", src: "Metrici" },
  { id: "vehicle", fa: "سفرهای هر خودرو", en: "Trips per vehicle", src: "Punit" },
  { id: "trips", fa: "سفرهای کامل / ناقص", en: "Complete / incomplete trips", src: "Punit" },
  { id: "exceptions", fa: "استثناها و override", en: "Exceptions & overrides", src: "WIS" },
  { id: "manual", fa: "توزین‌های دستی", en: "Manual weighings", src: "STAIN PESA" },
  { id: "shift", fa: "گزارش شیفت", en: "Shift report", src: "Smart Traffic" },
  { id: "permit", fa: "مصرف حواله‌ها", en: "Permit consumption", src: "WeighHub" },
];

export default function ReportsPage() {
  const L = useL();
  const locale = useLocale();
  const masters = useMasters();
  const [tpl, setTpl] = useState<TplId>("daily");
  const [range, setRange] = useState<"today" | "7d">("today");
  const [op, setOp] = useState("");
  const [sched, setSched] = useState(false);
  const [email, setEmail] = useState("manager@example.com");
  const [time, setTime] = useState("07:00");
  const [closeDlg, setCloseDlg] = useState(false);
  const since = useMemo(() => {
    const d = new Date(Date.now() + 210 * 60000);
    d.setUTCHours(0, 0, 0, 0);
    return new Date(d.getTime() - 210 * 60000 - (range === "7d" ? 6 * 864e5 : 0)).toISOString();
  }, [range]);
  const { data } = useData<Transaction>("transactions", { limit: 5000, since }, 5000);
  const { data: visits } = useData<Visit>("visits", { limit: 5000, since }, 8000);
  const { data: we } = useData<WeighEvent>("weighEvents", { limit: 5000, captureMethod: "MANUAL" }, 15000);
  const { data: closes } = useData<AuditEvent>("audit", { action: "day.closed", limit: 30 }, 5000);
  const txs = (data?.items ?? []).filter((t) => !op || t.operation === op);
  const approved = txs.filter((t) => t.state === "APPROVED");
  const nm = (x?: { name: string; nameEn?: string }) => (x ? (locale === "fa" ? x.name : x.nameEn ?? x.name) : "—");
  const plate = (id: string) => masters?.vehicles.find((v) => v.id === id)?.plateNormalized ?? id;

  const report = useMemo((): { head: string[]; rows: (string | number)[][]; chart?: { k: string; v: number }[] } => {
    const group = (key: (t: Transaction) => string) => {
      const m = new Map<string, { n: number; kg: number }>();
      for (const t of approved) {
        const k = key(t);
        const s = m.get(k) ?? { n: 0, kg: 0 };
        s.n++;
        s.kg += t.netKg ?? 0;
        m.set(k, s);
      }
      return [...m.entries()].sort((a, b) => b[1].kg - a[1].kg);
    };
    switch (tpl) {
      case "customer": {
        const g = group((t) => nm(masters?.customers.find((c) => c.id === t.customerId)));
        return { head: [L("مشتری", "Customer"), L("سفر", "Trips"), L("خالص (تن)", "Net (t)")], rows: g.map(([k, s]) => [k, s.n, +(s.kg / 1000).toFixed(2)]), chart: g.map(([k, s]) => ({ k, v: s.kg / 1000 })) };
      }
      case "material": {
        const g = group((t) => nm(masters?.materials.find((c) => c.id === t.materialId)));
        return { head: [L("ماده", "Material"), L("سفر", "Trips"), L("خالص (تن)", "Net (t)")], rows: g.map(([k, s]) => [k, s.n, +(s.kg / 1000).toFixed(2)]), chart: g.map(([k, s]) => ({ k, v: s.kg / 1000 })) };
      }
      case "vehicle": {
        const g = group((t) => plate(t.vehicleId));
        return { head: [L("پلاک", "Plate"), L("سفر", "Trips"), L("خالص (تن)", "Net (t)")], rows: g.slice(0, 40).map(([k, s]) => [k, s.n, +(s.kg / 1000).toFixed(2)]), chart: g.slice(0, 12).map(([k, s]) => ({ k, v: s.n })) };
      }
      case "trips": {
        const vs = visits?.items ?? [];
        const complete = vs.filter((v) => v.state === "EXITED");
        const incomplete = vs.filter((v) => v.state !== "EXITED" && v.state !== "REJECTED" && v.state !== "CANCELLED");
        return {
          head: [L("پلاک", "Plate"), L("ورود", "Arrived"), L("وضعیت", "State"), L("کامل؟", "Complete?")],
          rows: [...incomplete, ...complete].slice(0, 80).map((v) => [plate(v.vehicleId), fmtDateTime(v.arrivedAt, locale), v.state, v.state === "EXITED" ? "✓" : "✗"]),
          chart: [{ k: L("کامل", "Complete"), v: complete.length }, { k: L("ناقص/باز", "Incomplete/open"), v: incomplete.length }, { k: L("ردشده", "Rejected"), v: vs.filter((v) => v.state === "REJECTED").length }],
        };
      }
      case "exceptions": {
        const ex = txs.filter((t) => t.holdReasons.length || t.revisions.some((r) => r.reason));
        return { head: [L("تیکت", "Ticket"), L("وضعیت", "State"), L("دلایل", "Reasons"), L("نسخه", "Ver"), L("تأییدکننده", "Approver")], rows: ex.map((t) => [t.ticketNo, t.state, t.holdReasons.join(" "), t.version, userName(t.approvedBy, locale)]) };
      }
      case "manual": {
        const ids = new Set(txs.map((t) => t.id));
        const m = (we?.items ?? []).filter((w) => ids.has(w.transactionId));
        return { head: [L("زمان", "Time"), L("وزن", "Weight"), L("دلیل", "Reason"), L("اپراتور", "Operator"), L("امضای دوم", "2nd signer")], rows: m.map((w) => [fmtDateTime(w.capturedAt, locale), w.weightKg, w.manualReason ?? "", userName(w.operatorId, locale), userName(w.secondSigner, locale)]) };
      }
      case "shift": {
        const g = group((t) => t.shiftCode);
        return { head: [L("شیفت", "Shift"), L("سفر", "Trips"), L("خالص (تن)", "Net (t)"), L("هدف (تن)", "Target (t)")], rows: g.map(([k, s]) => [k, s.n, +(s.kg / 1000).toFixed(1), masters?.shifts.find((x) => x.code === k)?.targetTons ?? 0]), chart: g.map(([k, s]) => ({ k, v: s.kg / 1000 })) };
      }
      case "permit": {
        return {
          head: [L("حواله", "Permit"), L("مشتری", "Customer"), L("مجاز (تن)", "Allowed (t)"), L("مصرف (تن)", "Used (t)"), L("مانده (تن)", "Left (t)"), L("وضعیت", "Status")],
          rows: (masters?.permits ?? []).map((p) => [p.permitNo, nm(masters?.customers.find((c) => c.id === p.customerId)), p.allowedKg / 1000, +(p.consumedKg / 1000).toFixed(2), +((p.allowedKg - p.consumedKg - p.reservedKg) / 1000).toFixed(2), p.status]),
        };
      }
      default:
        return {
          head: [L("تیکت", "Ticket"), L("زمان", "Time"), L("پلاک", "Plate"), L("عملیات", "Operation"), L("ماده", "Material"), L("ناخالص", "Gross"), L("تارا", "Tare"), L("خالص", "Net"), L("کسر", "Deduct."), L("قابل محاسبه", "Billable"), L("وضعیت", "State")],
          rows: txs.map((t) => [t.ticketNo, fmtDateTime(t.approvedAt ?? t.createdAt, locale), plate(t.vehicleId), lbl(OPERATION, t.operation, locale), nm(masters?.materials.find((m) => m.id === t.materialId)), t.grossKg ?? "", t.tareKg ?? "", t.netKg ?? "", t.deductionKg, t.billableKg ?? "", t.state]),
        };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tpl, txs, visits, we, masters, locale]);

  const exportXls = () => {
    // Excel-compatible HTML table (opens natively in Excel/LibreOffice; avoids a heavy xlsx dependency)
    const esc = (s: unknown) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
    const html = `<html><head><meta charset="utf-8"></head><body><table border="1"><tr>${report.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr>${report.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</table></body></html>`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + html], { type: "application/vnd.ms-excel" }));
    a.download = `report-${tpl}.xls`;
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
  const t = TEMPLATES.find((x) => x.id === tpl)!;
  const today = new Date(Date.now() + 210 * 60000).toISOString().slice(0, 10);
  const closedToday = (closes?.items ?? []).some((a) => a.entityId === today);
  return (
    <div>
      <PageHeader icon={<BarChart3 className="size-5" />} title={L("گزارش‌ها", "Reports")} subtitle={L("قالب‌های آماده، فیلتر، خروجی CSV/Excel/PDF، ارسال زمان‌بندی‌شده ایمیل و بستن روز (Daily Close)", "Ready templates, filters, CSV/Excel/PDF export, scheduled e-mail and Daily Close")} />
      <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
        <div className="flex flex-col gap-4 print:hidden">
          <Card>
            <CardHeader title={L("قالب‌ها", "Templates")} />
            <div className="p-2">
              {TEMPLATES.map((x) => (
                <button key={x.id} onClick={() => setTpl(x.id)} className={cx("flex w-full items-center justify-between rounded-lg px-3 py-2 text-start text-sm hover:bg-surface-2", tpl === x.id && "bg-primary/10 font-semibold text-primary")}>
                  {L(x.fa, x.en)}
                  <span className="text-[10px] text-muted">{x.src}</span>
                </button>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <CalendarCheck2 className="size-4 text-primary" /> Daily Close
            </div>
            <div className="text-xs text-muted">{L("قفل اسناد امروز پس از تطبیق؛ بعد از بستن، اصلاح فقط با سند اصلاحی.", "Locks today's documents after reconciliation; afterwards only correction documents.")}</div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-lg bg-surface-2 p-2">
                <div className="text-muted">{L("تأییدشده", "Approved")}</div>
                <div className="num text-lg font-bold">{fmtNum(approved.length, locale)}</div>
              </div>
              <div className="rounded-lg bg-surface-2 p-2">
                <div className="text-muted">{L("باز/استثنا", "Open/exception")}</div>
                <div className="num text-lg font-bold text-warning">{fmtNum(txs.length - approved.length, locale)}</div>
              </div>
            </div>
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
        <div className="flex flex-col gap-4">
          <Card className="p-3 print:hidden">
            <div className="flex flex-wrap items-center gap-2">
              <Segmented options={[{ id: "today", label: L("امروز", "Today") }, { id: "7d", label: L("۷ روز", "7 days") }]} value={range} onChange={setRange} />
              <Select value={op} onChange={(e) => setOp(e.target.value)}>
                <option value="">{L("همه عملیات‌ها", "All operations")}</option>
                {Object.keys(OPERATION).map((o) => (
                  <option key={o} value={o}>
                    {lbl(OPERATION, o, locale)}
                  </option>
                ))}
              </Select>
              <div className="flex-1" />
              <Button size="sm" onClick={() => downloadCsv(`report-${tpl}.csv`, report.head, report.rows)}>
                <FileDown className="size-4" /> CSV
              </Button>
              <Button size="sm" onClick={exportXls}>
                <FileSpreadsheet className="size-4" /> Excel
              </Button>
              <Button size="sm" onClick={() => window.print()}>
                <Printer className="size-4" /> PDF
              </Button>
              <Button size="sm" variant="primary" onClick={() => setSched(true)}>
                <Mail className="size-4" /> {L("ایمیل زمان‌بندی", "Schedule e-mail")}
              </Button>
            </div>
          </Card>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <KpiTile label={L("تیکت‌ها", "Tickets")} value={fmtNum(txs.length, locale)} />
            <KpiTile label={L("خالص تأییدشده", "Approved net")} value={fmtT(approved.reduce((a, x) => a + (x.netKg ?? 0), 0) / 1000, locale)} unit="t" tone="success" />
            <KpiTile label={L("کسر مجاز", "Deductions")} value={fmtKg(approved.reduce((a, x) => a + x.deductionKg, 0), locale)} tone="warning" />
            <KpiTile label={L("ارسال‌نشده به ERP", "Not synced to ERP")} value={fmtNum(txs.filter((x) => x.erpStatus === "PENDING" || x.erpStatus === "FAILED").length, locale)} tone="danger" />
          </div>
          <Card>
            <CardHeader title={L(t.fa, t.en)} subtitle={`${range === "today" ? L("امروز", "Today") : L("۷ روز اخیر", "Last 7 days")} · ${fmtNum(report.rows.length, locale)} ${L("ردیف", "rows")}`} actions={<Badge>{L("الهام از", "Inspired by")} {t.src}</Badge>} />
            {report.chart && report.chart.length > 0 && (
              <div className="border-b border-border p-3">
                <Bars data={report.chart.slice(0, 14)} x="k" series={[{ key: "v", name: L("مقدار", "Value"), color: "#1273a6" }]} height={200} />
              </div>
            )}
            {!data ? (
              <Skeleton className="m-4 h-64" />
            ) : (
              <Table head={report.head} dense>
                {report.rows.slice(0, 200).map((r, i) => (
                  <tr key={i}>
                    {r.map((c, j) => (
                      <Td key={j} className={typeof c === "number" ? "num" : "text-xs"}>
                        {typeof c === "number" ? fmtNum(c, locale) : c}
                      </Td>
                    ))}
                  </tr>
                ))}
              </Table>
            )}
          </Card>
        </div>
      </div>
      <Dialog
        open={sched}
        onClose={() => setSched(false)}
        title={L("ارسال زمان‌بندی‌شده", "Scheduled delivery")}
        footer={
          <Button
            variant="primary"
            onClick={async () => {
              await run("report.schedule", { template: tpl, email, time }, L("زمان‌بندی ثبت شد (outbox ایمیل)", "Scheduled (e-mail outbox)"));
              setSched(false);
            }}
          >
            {L("ثبت", "Save")}
          </Button>
        }
      >
        <div className="flex flex-col gap-3">
          <Field label={L("قالب", "Template")}>
            <Input value={L(t.fa, t.en)} readOnly />
          </Field>
          <Field label={L("ایمیل گیرنده", "Recipient e-mail")}>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="ltr" />
          </Field>
          <Field label={L("ساعت ارسال روزانه", "Daily send time")}>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="ltr" />
          </Field>
        </div>
      </Dialog>
      <ConfirmDialog open={closeDlg} onClose={() => setCloseDlg(false)} needReason={false} title={L("بستن روز", "Close the day")} description={L(`${fmtNum(txs.length - approved.length, locale)} سند باز/استثنا دارید. بستن روز در audit ثبت می‌شود.`, `${txs.length - approved.length} open/exception documents remain. Closing is audited.`)} onConfirm={() => run("day.close", {}, L("روز بسته شد", "Day closed"))} />
    </div>
  );
}
