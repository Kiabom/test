"use client";
import { FileDown, Printer, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { Logo } from "@/components/shell/Logo";
import { Badge, Button, Card, CardHeader, KpiTile, PageHeader, Segmented, Select, Skeleton, Table, Td } from "@/components/ui";
import type { Transaction } from "@/domain/types";
import { downloadCsv } from "@/lib/export";
import { fmtDate, fmtDateTime, fmtKg, fmtNum } from "@/lib/format";
import { useData, useMasters } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";

const VAT = 0.1;

export default function BillingPage() {
  const L = useL();
  const locale = useLocale();
  const masters = useMasters();
  const [range, setRange] = useState<"7d" | "30d">("7d");
  const since = useMemo(() => new Date(Date.now() - (range === "7d" ? 7 : 30) * 864e5).toISOString(), [range]);
  const { data } = useData<Transaction>("transactions", { limit: 5000, state: "APPROVED", since }, 10000);
  const [cust, setCust] = useState("");
  const customers = (masters?.customers ?? []).filter((c) => c.type !== "SUPPLIER");
  const customerId = cust || customers[0]?.id;
  const customer = customers.find((c) => c.id === customerId);
  const lines = useMemo(() => {
    return (data?.items ?? [])
      .filter((t) => t.customerId === customerId && t.operation === "DISPATCH")
      .map((t) => {
        const contract = masters?.contracts.find((c) => c.customerId === t.customerId && c.materialId === t.materialId);
        const price = contract?.pricePerTon ?? masters?.materials.find((m) => m.id === t.materialId)?.pricePerTon ?? 0;
        const kg = t.billableKg ?? t.netKg ?? 0;
        return { t, price, kg, amount: Math.round((kg / 1000) * price), contract };
      });
  }, [data, customerId, masters]);
  const subtotal = lines.reduce((a, l) => a + l.amount, 0);
  const tons = lines.reduce((a, l) => a + l.kg, 0) / 1000;
  const invoiceNo = `INV-1405-${(customerId ?? "0").replace(/\D/g, "").padStart(3, "0")}-${range === "7d" ? "W" : "M"}`;
  const nm = (x?: { name: string; nameEn?: string }) => (x ? (locale === "fa" ? x.name : x.nameEn ?? x.name) : "—");
  return (
    <div>
      <PageHeader
        icon={<Wallet className="size-5" />}
        title={L("صورت‌حساب مشتری", "Customer billing")}
        subtitle={L("افزونه: صورت‌حساب از تیکت‌های تأییدشده با وزن قابل محاسبه (خالص − کسر) و نرخ قرارداد", "Add-on: statements from approved tickets using billable weight (net − deduction) and contract price")}
        actions={
          <div className="flex gap-2 print:hidden">
            <Segmented options={[{ id: "7d", label: L("هفتگی", "Weekly") }, { id: "30d", label: L("ماهانه", "Monthly") }]} value={range} onChange={setRange} />
            <Select value={customerId ?? ""} onChange={(e) => setCust(e.target.value)}>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {nm(c)}
                </option>
              ))}
            </Select>
            <Button onClick={() => downloadCsv(`${invoiceNo}.csv`, ["ticket", "date", "material", "billable_kg", "price_per_t", "amount"], lines.map((l) => [l.t.ticketNo, l.t.approvedAt ?? "", l.t.materialId, l.kg, l.price, l.amount]))}>
              <FileDown className="size-4" /> CSV
            </Button>
            <Button variant="primary" onClick={() => window.print()}>
              <Printer className="size-4" /> {L("چاپ", "Print")}
            </Button>
          </div>
        }
      />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4 print:hidden">
        <KpiTile label={L("تیکت‌ها", "Tickets")} value={fmtNum(lines.length, locale)} />
        <KpiTile label={L("تناژ قابل محاسبه", "Billable tons")} value={fmtNum(tons, locale, { maximumFractionDigits: 1 })} unit="t" tone="info" />
        <KpiTile label={L("جمع (ریال)", "Subtotal (IRR)")} value={fmtNum(subtotal, locale)} tone="success" />
        <KpiTile label={L("سقف اعتبار مشتری", "Credit limit")} value={fmtNum(customer?.creditLimit, locale)} tone={subtotal * (1 + VAT) > (customer?.creditLimit ?? Infinity) ? "danger" : "neutral"} />
      </div>
      <Card className="mx-auto max-w-4xl p-8 print:border-0 print:shadow-none">
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div>
            <Logo locale={locale} />
            <div className="mt-2 text-xs text-muted">{L("معدن نمونه — داده ساختگی", "Sample mine — demo data")}</div>
          </div>
          <div className="text-end">
            <div className="text-xl font-black">{L("صورت‌حساب فروش", "Sales statement")}</div>
            <div className="font-mono text-sm">{invoiceNo}</div>
            <div className="text-xs text-muted">
              {fmtDate(since, locale)} — {fmtDate(Date.now(), locale)}
            </div>
            <Badge tone="warning">{L("پیش‌نویس", "Draft")}</Badge>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 py-4 text-sm">
          <div>
            <div className="text-xs text-muted">{L("خریدار", "Bill to")}</div>
            <div className="font-bold">{nm(customer)}</div>
            <div className="text-xs">
              {customer?.city} · ERP {customer?.erpCode}
            </div>
          </div>
          <div className="text-end">
            <div className="text-xs text-muted">{L("قرارداد", "Contract")}</div>
            <div className="font-mono">{lines[0]?.contract?.no ?? L("نرخ پایه ماده", "Material base price")}</div>
          </div>
        </div>
        {!data ? (
          <Skeleton className="h-64" />
        ) : (
          <Table head={[L("تیکت", "Ticket"), L("تاریخ", "Date"), L("ماده", "Material"), L("قابل محاسبه", "Billable"), L("نرخ/تن", "Price/t"), L("مبلغ (ریال)", "Amount (IRR)")]} dense>
            {lines.map((l) => (
              <tr key={l.t.id}>
                <Td className="font-mono text-xs">{l.t.ticketNo}</Td>
                <Td className="num text-xs">{fmtDateTime(l.t.approvedAt, locale)}</Td>
                <Td className="text-xs">{nm(masters?.materials.find((m) => m.id === l.t.materialId))}</Td>
                <Td className="num">
                  {fmtKg(l.kg, locale)}
                  {l.t.deductionKg > 0 && <span className="ms-1 text-[10px] text-warning">(−{fmtNum(l.t.deductionKg, locale)})</span>}
                </Td>
                <Td className="num">{fmtNum(l.price, locale)}</Td>
                <Td className="num font-semibold">{fmtNum(l.amount, locale)}</Td>
              </tr>
            ))}
          </Table>
        )}
        <div className="ms-auto mt-4 w-72 text-sm">
          <div className="flex justify-between py-1">
            <span>{L("جمع", "Subtotal")}</span>
            <span className="num">{fmtNum(subtotal, locale)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>{L("مالیات بر ارزش افزوده ۱۰٪", "VAT 10%")}</span>
            <span className="num">{fmtNum(Math.round(subtotal * VAT), locale)}</span>
          </div>
          <div className="flex justify-between border-t border-border py-2 text-lg font-black">
            <span>{L("قابل پرداخت", "Total due")}</span>
            <span className="num">{fmtNum(Math.round(subtotal * (1 + VAT)), locale)}</span>
          </div>
        </div>
        <div className="mt-6 text-[11px] text-muted">{L("وزن‌ها از تیکت‌های تأییدشده و indicator کالیبره؛ حجم LiDAR و payload در صورت‌حساب استفاده نمی‌شوند.", "Weights come from approved tickets and calibrated indicators; LiDAR volume and payload are never billed.")}</div>
      </Card>
      <Card className="mt-4 print:hidden">
        <CardHeader title={L("خلاصه همه مشتریان", "All customers summary")} />
        <Table head={[L("مشتری", "Customer"), L("تیکت", "Tickets"), L("تن", "Tons"), L("سقف اعتبار", "Credit limit")]} dense>
          {customers.map((c) => {
            const ts = (data?.items ?? []).filter((t) => t.customerId === c.id && t.operation === "DISPATCH");
            return (
              <tr key={c.id} onClick={() => setCust(c.id)} className="cursor-pointer hover:bg-surface-2">
                <Td>{nm(c)}</Td>
                <Td className="num">{fmtNum(ts.length, locale)}</Td>
                <Td className="num">{fmtNum(ts.reduce((a, t) => a + (t.billableKg ?? t.netKg ?? 0), 0) / 1000, locale, { maximumFractionDigits: 1 })}</Td>
                <Td className="num">{fmtNum(c.creditLimit, locale)}</Td>
              </tr>
            );
          })}
        </Table>
      </Card>
    </div>
  );
}
