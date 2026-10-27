"use client";
import { Download, FileSpreadsheet, Printer, Receipt, Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { IranPlate } from "@/components/domain/IranPlate";
import { Badge, Button, Card, Input, PageHeader, Select, Skeleton, StatusPill, Table, Td } from "@/components/ui";
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
  const [state, setState] = useState("");
  const [material, setMaterial] = useState("");
  const [op, setOp] = useState("");
  const [shift, setShift] = useState("");
  const [method, setMethod] = useState("");
  const [page, setPage] = useState(0);
  const { data } = useData<Transaction>("transactions", { limit: 2000, ...(sp.get("visit") ? { visitId: sp.get("visit")! } : {}) }, 4000);
  const { data: we } = useData<WeighEvent>("weighEvents", { limit: 5000, captureMethod: "MANUAL" }, 10000);
  const manualTx = useMemo(() => new Set((we?.items ?? []).map((w) => w.transactionId)), [we]);
  const veh = (id: string) => masters?.vehicles.find((v) => v.id === id);
  const mat = (id: string) => masters?.materials.find((m) => m.id === id);
  const cus = (id?: string) => masters?.customers.find((c) => c.id === id);

  const rows = useMemo(() => {
    let r = data?.items ?? [];
    if (state) r = r.filter((t) => t.state === state);
    if (material) r = r.filter((t) => t.materialId === material);
    if (op) r = r.filter((t) => t.operation === op);
    if (shift) r = r.filter((t) => t.shiftCode === shift);
    if (method === "MANUAL") r = r.filter((t) => manualTx.has(t.id));
    if (method === "STORED") r = r.filter((t) => t.tareSource === "STORED");
    if (q.trim()) {
      const s = q.trim();
      r = r.filter((t) => t.ticketNo.includes(s) || veh(t.vehicleId)?.plateNormalized.includes(s) || masters?.permits.find((p) => p.id === t.permitId)?.permitNo.includes(s) || cus(t.customerId)?.name.includes(s));
    }
    return r;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, state, material, op, shift, method, q, masters, manualTx]);
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
            <Button size="sm" onClick={() => window.print()}>
              <Printer className="size-4" /> PDF
            </Button>
          </>
        }
      />
      <Card className="mb-3 flex flex-wrap items-center gap-2 p-3 no-print">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute start-2.5 top-3 size-4 text-muted" />
          <Input className="ps-8" placeholder={L("تیکت، پلاک، حواله، مشتری…", "Ticket, plate, permit, customer…")} value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} />
        </div>
        <Select value={state} onChange={(e) => setState(e.target.value)}>
          <option value="">{L("همه وضعیت‌ها", "All states")}</option>
          {Object.keys(TX_STATE).map((s) => (
            <option key={s} value={s}>
              {lbl(TX_STATE, s, locale)}
            </option>
          ))}
        </Select>
        <Select value={op} onChange={(e) => setOp(e.target.value)}>
          <option value="">{L("همه عملیات", "All operations")}</option>
          {Object.keys(OPERATION).map((s) => (
            <option key={s} value={s}>
              {lbl(OPERATION, s, locale)}
            </option>
          ))}
        </Select>
        <Select value={material} onChange={(e) => setMaterial(e.target.value)}>
          <option value="">{L("همه مواد", "All materials")}</option>
          {masters?.materials.map((m) => (
            <option key={m.id} value={m.id}>
              {locale === "fa" ? m.name : m.nameEn}
            </option>
          ))}
        </Select>
        <Select value={shift} onChange={(e) => setShift(e.target.value)}>
          <option value="">{L("همه شیفت‌ها", "All shifts")}</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </Select>
        <Select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="">{L("همه روش‌های وزن", "All weigh methods")}</option>
          <option value="MANUAL">{L("دارای وزن دستی", "Has manual weight")}</option>
          <option value="STORED">{L("تارای ذخیره", "Stored tare")}</option>
        </Select>
      </Card>
      <Card>
        {!data ? (
          <Skeleton className="m-4 h-96" />
        ) : (
          <Table head={[L("تیکت", "Ticket"), L("پلاک", "Plate"), L("ماده", "Material"), L("مشتری", "Customer"), L("عملیات", "Op"), L("ناخالص", "Gross"), L("تارا", "Tare"), L("خالص", "Net"), L("روش", "Method"), L("زمان", "Time"), L("وضعیت", "State"), L("چاپ", "Prints"), "ERP"]}>
            {pageRows.map((t) => (
              <tr key={t.id} className="hover:bg-surface-2">
                <Td>
                  <Link href={`/app/transactions/${t.id}`} className="num font-mono text-xs text-primary hover:underline">
                    {t.ticketNo}
                  </Link>
                </Td>
                <Td>{veh(t.vehicleId) && <IranPlate plate={veh(t.vehicleId)!.plate} size="xs" />}</Td>
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
