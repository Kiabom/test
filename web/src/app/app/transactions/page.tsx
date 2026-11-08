"use client";
import { Download, FileSpreadsheet, Printer, Receipt, Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { VehicleTag } from "@/components/domain/VehicleTag";
import { FilterBar } from "@/components/reports/FilterBar";
import { Badge, Button, Card, Input, PageHeader, Skeleton, StatusPill, Table, Td } from "@/components/ui";
import { clockNow } from "@/domain/clock";
import { applyFilter, emptyFilter, filterToQuery, type ReportFilter } from "@/domain/reportFilter";
import type { Transaction, WeighEvent } from "@/domain/types";
import { lbl, OPERATION, TX_STATE } from "@/i18n/labels";
import { fmtDateTime, fmtNum } from "@/lib/format";
import { useData, useMasters } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import { downloadCsv } from "@/lib/export";
import { txStatus } from "@/lib/status";


function Inner() {
  const L = useL();
  const locale = useLocale();
  const sp = useSearchParams();
  const masters = useMasters();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [filter, setFilter] = useState<ReportFilter>(() => emptyFilter(clockNow(), "7d"));
  const [page, setPage] = useState(0);
  const { data } = useData<Transaction>("transactions", { limit: 2000, ...(sp.get("visit") ? { visitId: sp.get("visit")! } : {}) }, 4000);
  const { data: we } = useData<WeighEvent>("weighEvents", { limit: 5000, captureMethod: "MANUAL" }, 30_000);
  const manualTx = useMemo(() => new Set((we?.items ?? []).map((w) => w.transactionId)), [we]);
  const veh = (id: string) => masters?.vehicles.find((v) => v.id === id);
  const mat = (id: string) => masters?.materials.find((m) => m.id === id);
  const cus = (id?: string) => masters?.customers.find((c) => c.id === id);

  const rows = useMemo(() => {
    let r = data?.items ?? [];
    if (!sp.get("visit")) r = applyFilter(r, filter, { manualTxIds: manualTx });
    if (q.trim()) {
      const s = q.trim();
      r = r.filter((t) => t.ticketNo.includes(s) || t.vehicleId.includes(s.toUpperCase()) || (veh(t.vehicleId)?.rfidEpc ?? "").includes(s.toUpperCase()) || veh(t.vehicleId)?.plateNormalized.includes(s) || masters?.permits.find((p) => p.id === t.permitId)?.permitNo.includes(s) || cus(t.customerId)?.name.includes(s));
    }
    return r;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, filter, q, masters, manualTx]);
  const pageRows = rows.slice(page * 25, page * 25 + 25);
  const totalNet = rows.filter((t) => t.state === "APPROVED").reduce((a, t) => a + (t.netKg ?? 0), 0);

  const exportCsv = (ext: "csv" | "xls") =>
    downloadCsv(
      `transactions.${ext}`,
      ["ticket", "plate", "operation", "material", "customer", "gross_kg", "tare_kg", "net_kg", "deduction_kg", "billable_kg", "state", "approved_at", "print_count", "erp"],
      rows.map((t) => [t.ticketNo, veh(t.vehicleId)?.plateNormalized ?? "", t.operation, mat(t.materialId)?.code ?? "", cus(t.customerId)?.nameEn ?? "", t.grossKg ?? "", t.tareKg ?? "", t.netKg ?? "", t.deductionKg, t.billableKg ?? "", t.state, t.approvedAt ?? "", t.printCount, t.erpStatus]),
    );

  return (
    <div>
      <PageHeader
        icon={<Receipt className="size-5" />}
        title={L("تراکنش‌ها و تیکت‌ها", "Transactions & tickets")}
        subtitle={L(`${fmtNum(rows.length, locale)} تراکنش · خالص تأییدشده ${fmtNum(totalNet / 1000, locale)} تن`, `${rows.length} transactions · approved net ${fmtNum(totalNet / 1000, locale)} t`)}
        actions={
          <>
            <Button size="sm" onClick={() => exportCsv("csv")}>
              <Download className="size-4" /> CSV
            </Button>
            <Button size="sm" onClick={() => exportCsv("xls")}>
              <FileSpreadsheet className="size-4" /> Excel
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                const qs = filterToQuery(filter);
                qs.set("tpl", "daily");
                qs.set("cols", "ticket,time,plate,customer,material,operation,gross,tare,net,state");
                qs.set("auto", "1");
                window.open(`/print/report?${qs.toString()}`, "_blank");
              }}
            >
              <Printer className="size-4" /> {L("چاپ / PDF", "Print / PDF")}
            </Button>
          </>
        }
      />
      <Card className="mb-3 flex flex-col gap-3 p-3 no-print">
        <div className="relative">
          <Search className="pointer-events-none absolute start-2.5 top-3 size-4 text-muted" />
          <Input className="ps-8" placeholder={L("جست‌وجوی تیکت، تگ خودرو، حواله، مشتری…", "Ticket, vehicle tag, permit, customer…")} value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} />
        </div>
        <FilterBar value={filter} onChange={(f) => { setFilter(f); setPage(0); }} masters={masters} count={data ? rows.length : undefined} />
      </Card>
      <Card>
        {!data ? (
          <Skeleton className="m-4 h-96" />
        ) : (
          <Table head={[L("تیکت", "Ticket"), L("تگ خودرو", "Vehicle tag"), L("ماده", "Material"), L("مشتری", "Customer"), L("عملیات", "Op"), L("ناخالص", "Gross"), L("تارا", "Tare"), L("خالص", "Net"), L("روش", "Method"), L("زمان", "Time"), L("وضعیت", "State"), L("چاپ", "Prints"), "ERP"]}>
            {pageRows.map((t) => (
              <tr key={t.id} className="hover:bg-surface-2">
                <Td>
                  <Link href={`/app/transactions/${t.id}`} className="num font-mono text-xs text-primary hover:underline">
                    {t.ticketNo}
                  </Link>
                </Td>
                <Td>{veh(t.vehicleId) && <VehicleTag plate={veh(t.vehicleId)!.plate} size="xs" />}</Td>
                <Td>{locale === "fa" ? mat(t.materialId)?.name : mat(t.materialId)?.nameEn}</Td>
                <Td className="max-w-40 truncate">{locale === "fa" ? cus(t.customerId)?.name : cus(t.customerId)?.nameEn}</Td>
                <Td>{lbl(OPERATION, t.operation, locale)}</Td>
                <Td className="num">{fmtNum(t.grossKg, locale)}</Td>
                <Td className="num">{fmtNum(t.tareKg, locale)}</Td>
                <Td className="num font-bold">{fmtNum(t.netKg, locale)}</Td>
                <Td>{manualTx.has(t.id) ? <StatusPill status="MANUAL" /> : t.tareSource === "STORED" ? <Badge tone="info">STORED</Badge> : <Badge>SENSOR</Badge>}</Td>
                <Td className="num text-xs">{fmtDateTime(t.approvedAt ?? t.createdAt, locale)}</Td>
                <Td>
                  <StatusPill status={txStatus(t.state)} label={lbl(TX_STATE, t.state, locale)} />
                </Td>
                <Td className="num">{fmtNum(t.printCount, locale)}</Td>
                <Td>
                  <Badge tone={t.erpStatus === "SENT" ? "success" : t.erpStatus === "FAILED" ? "danger" : t.erpStatus === "PENDING" ? "warning" : "neutral"}>{t.erpStatus}</Badge>
                </Td>
              </tr>
            ))}
          </Table>
        )}
        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-sm no-print">
          <span className="text-muted">
            {fmtNum(page * 25 + 1, locale)}–{fmtNum(Math.min(rows.length, page * 25 + 25), locale)} / {fmtNum(rows.length, locale)}
          </span>
          <div className="flex gap-2">
            <Button size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              {L("قبلی", "Prev")}
            </Button>
            <Button size="sm" disabled={(page + 1) * 25 >= rows.length} onClick={() => setPage((p) => p + 1)}>
              {L("بعدی", "Next")}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <Inner />
    </Suspense>
  );
}
