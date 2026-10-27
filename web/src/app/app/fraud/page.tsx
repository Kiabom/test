"use client";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Bars, Lines } from "@/components/charts";
import { EvidenceGallery } from "@/components/domain/visit";
import { IranPlate } from "@/components/domain/IranPlate";
import { Badge, Button, Card, CardHeader, cx, EmptyState, Kv, PageHeader, Progress, Skeleton, Table, Td, toast } from "@/components/ui";
import type { FraudCase, Transaction, WeighEvent } from "@/domain/types";
import { median } from "@/domain/kpi";
import { ERRORS, lbl } from "@/i18n/labels";
import { fmtDateTime, fmtKg, fmtNum, fmtPct } from "@/lib/format";
import { act, ActionError, useData, useMasters, useView } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import { userName, USERS_LIST } from "@/lib/users";
import type { VisitDetail } from "@/server/views";

const KIND: Record<FraudCase["kind"], [string, string]> = {
  TARE_OUTLIER: ["تارای غیرعادی", "Tare outlier"],
  REPEAT_NET: ["خالص تکراری", "Repeated net"],
  IMPOSSIBLE_TRIP: ["سفر غیرممکن", "Impossible trip"],
  MANUAL_RATE: ["نرخ ثبت دستی بالا", "High manual rate"],
  PLATE_SWAP: ["تعویض پلاک/تریلر", "Plate/trailer swap"],
};
const STATUS_TONE = { NEW: "danger", REVIEWING: "warning", CONFIRMED: "danger", FALSE_POSITIVE: "neutral" } as const;

export default function FraudPage() {
  const L = useL();
  const locale = useLocale();
  const masters = useMasters();
  const { data } = useData<FraudCase>("fraudCases", {}, 3000);
  const { data: we } = useData<WeighEvent>("weighEvents", { limit: 5000 }, 60000);
  const [sel, setSel] = useState<string>();
  const [notes, setNotes] = useState("");
  const cases = data?.items ?? [];
  const fc = cases.find((c) => c.id === sel) ?? cases[0];

  // operator scorecard: manual capture share per operator (control 09)
  const score = useMemo(() => {
    const m = new Map<string, { total: number; manual: number }>();
    for (const w of we?.items ?? []) {
      const s = m.get(w.operatorId) ?? { total: 0, manual: 0 };
      s.total++;
      if (w.captureMethod === "MANUAL") s.manual++;
      m.set(w.operatorId, s);
    }
    return [...m.entries()].map(([id, s]) => ({ id, name: userName(id, locale), total: s.total, manualPct: s.total ? (s.manual / s.total) * 100 : 0 })).sort((a, b) => b.manualPct - a.manualPct);
  }, [we, locale]);

  const decide = async (status: FraudCase["status"]) => {
    if (!fc) return;
    try {
      await act("fraud.decide", { id: fc.id, status, notes: notes || fc.notes });
      toast.success(L("تصمیم ثبت شد", "Decision recorded"));
    } catch (e) {
      toast.error(e instanceof ActionError ? lbl(ERRORS, e.code, locale) : String(e));
    }
  };
  const veh = masters?.vehicles.find((v) => v.id === fc?.vehicleId);
  const med = fc ? median(fc.data.slice(0, -1)) : null;

  return (
    <div>
      <PageHeader icon={<ShieldAlert className="size-5" />} title={L("بازبینی تقلب", "Fraud review")} subtitle={L("الگوهای آماری (کنترل ۰۹): تارای غیرعادی، خالص تکراری، سفر غیرممکن، ثبت دستی زیاد — شواهد کنار هم و تصمیم با دلیل", "Statistical patterns (control 09): tare outliers, repeated nets, impossible trips, high manual rate — side-by-side evidence and reasoned decisions")} />
      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="h-fit">
          <CardHeader title={L("پرونده‌ها", "Cases")} subtitle={`${fmtNum(cases.length, locale)} ${L("مورد", "cases")}`} />
          {!data ? (
            <Skeleton className="m-4 h-64" />
          ) : (
            <div className="divide-y divide-border">
              {cases.map((c) => (
                <button key={c.id} onClick={() => { setSel(c.id); setNotes(c.notes); }} className={cx("block w-full p-3 text-start hover:bg-surface-2", fc?.id === c.id && "bg-primary/5 ring-1 ring-inset ring-primary/30")}>
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone="info">{L(...KIND[c.kind])}</Badge>
                    <Badge tone={STATUS_TONE[c.status]}>{c.status}</Badge>
                  </div>
                  <div className="mt-1 text-sm font-medium">{locale === "fa" ? c.title : c.titleEn}</div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                    <span>{L("امتیاز ریسک", "Risk score")}</span>
                    <Progress value={c.score * 100} tone={c.score > 0.75 ? "danger" : c.score > 0.6 ? "warning" : "primary"} className="flex-1" />
                    <span className="num font-bold">{fmtNum(Math.round(c.score * 100), locale)}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-muted">{fmtDateTime(c.openedAt, locale)}</div>
                </button>
              ))}
            </div>
          )}
        </Card>
        {!fc ? (
          <Card>
            <EmptyState title={L("پرونده‌ای انتخاب نشده", "No case selected")} />
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            <Card className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-muted">{fc.id} · {L(...KIND[fc.kind])}</div>
                  <div className="text-lg font-bold">{locale === "fa" ? fc.title : fc.titleEn}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    {veh && <IranPlate plate={veh.plate} size="sm" />}
                    {fc.operatorId && <Badge>{L("اپراتور: ", "Operator: ")}{userName(fc.operatorId, locale)}</Badge>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={L("یادداشت بازبینی (در audit ثبت می‌شود)", "Review note (audited)")} rows={2} className="w-72 rounded-lg border border-border bg-surface p-2 text-sm outline-none focus:border-primary" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => decide("REVIEWING")}>{L("در حال بررسی", "Reviewing")}</Button>
                    <Button size="sm" variant="danger" onClick={() => decide("CONFIRMED")}>{L("تأیید تقلب", "Confirm fraud")}</Button>
                    <Button size="sm" variant="ghost" onClick={() => decide("FALSE_POSITIVE")}>{L("مثبت کاذب", "False positive")}</Button>
                  </div>
                </div>
              </div>
            </Card>
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader title={L("داده الگو", "Pattern data")} subtitle={fc.kind === "TARE_OUTLIER" ? L(`میانه: ${fmtKg(med, locale)} — آخرین: ${fmtKg(fc.data.at(-1), locale)}`, `Median ${fmtKg(med, locale)} — last ${fmtKg(fc.data.at(-1), locale)}`) : undefined} />
                <div className="p-3">
                  {fc.kind === "MANUAL_RATE" ? (
                    <Bars data={fc.data.map((v, i) => ({ d: L(`روز ${i + 1}`, `Day ${i + 1}`), v }))} x="d" series={[{ key: "v", name: L("٪ دستی", "% manual"), color: "#b42335" }]} unit="%" />
                  ) : fc.kind === "IMPOSSIBLE_TRIP" ? (
                    <div className="grid grid-cols-2 gap-3 p-2 text-center">
                      <div className="rounded-xl bg-danger/10 p-4">
                        <div className="text-xs text-muted">{L("فاصله زمانی مشاهده‌شده", "Observed gap")}</div>
                        <div className="num text-3xl font-black text-danger">{fmtNum(fc.data[0], locale)} {L("دقیقه", "min")}</div>
                      </div>
                      <div className="rounded-xl bg-surface-2 p-4">
                        <div className="text-xs text-muted">{L("حداقل زمان ممکن", "Minimum feasible")}</div>
                        <div className="num text-3xl font-black">{fmtNum(fc.data[1], locale)} {L("دقیقه", "min")}</div>
                      </div>
                      <div className="col-span-2 text-xs text-muted">{L("یک پلاک در دو دوربین با فاصله‌ای کمتر از حداقل زمان پیمایش دیده شده — احتمال پلاک تکراری/جعلی.", "One plate seen by two cameras faster than the minimum travel time — possible cloned plate.")}</div>
                    </div>
                  ) : (
                    <Lines data={fc.data.map((v, i) => ({ i: `#${i + 1}`, v, med: med ?? undefined }))} x="i" series={[{ key: "v", name: L("مقدار", "Value"), color: "#1273a6" }, { key: "med", name: L("میانه", "Median"), color: "#b7791f", dashed: true }]} unit="kg" />
                  )}
                </div>
              </Card>
              <Card>
                <CardHeader title={L("تراکنش‌های مرتبط", "Linked transactions")} />
                <Table head={[L("تیکت", "Ticket"), L("خالص", "Net"), L("تارا", "Tare"), L("وضعیت", "State")]} dense>
                  {fc.transactionIds.map((id) => (
                    <TxRow key={id} id={id} />
                  ))}
                </Table>
              </Card>
            </div>
            {fc.transactionIds[0] && <SideBySide ids={fc.transactionIds.slice(0, 2)} />}
          </div>
        )}
      </div>
      <Card className="mt-4">
        <CardHeader title={L("کارنامه اپراتورها — سهم ثبت دستی", "Operator scorecard — manual capture share")} subtitle={L("بیش از ۵٪ = بررسی؛ ثبت دستی همیشه با دو امضا", "Above 5% = review; manual capture always needs two signatures")} />
        <Table head={[L("اپراتور", "Operator"), L("نقش", "Role"), L("تعداد توزین", "Weighings"), L("٪ دستی", "% manual"), ""]}>
          {score.map((s) => (
            <tr key={s.id}>
              <Td>{s.name}</Td>
              <Td className="text-xs text-muted">{USERS_LIST.find((u) => u.id === s.id)?.role ?? "—"}</Td>
              <Td className="num">{fmtNum(s.total, locale)}</Td>
              <Td className={cx("num font-bold", s.manualPct > 5 && "text-danger")}>{fmtPct(s.manualPct, locale)}</Td>
              <Td className="w-48">
                <Progress value={Math.min(100, s.manualPct * 5)} tone={s.manualPct > 5 ? "danger" : "success"} />
              </Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

function TxRow({ id }: { id: string }) {
  const locale = useLocale();
  const { data } = useData<Transaction>("transactions", { id }, 10000);
  const t = data?.items[0];
  if (!t) return null;
  return (
    <tr>
      <Td>
        <Link href={`/app/transactions/${t.id}`} className="font-mono text-xs text-primary">
          {t.ticketNo}
        </Link>
      </Td>
      <Td className="num">{fmtKg(t.netKg, locale)}</Td>
      <Td className="num">{fmtKg(t.tareKg, locale)}</Td>
      <Td>
        <Badge>{t.state}</Badge>
      </Td>
    </tr>
  );
}

function SideBySide({ ids }: { ids: string[] }) {
  const L = useL();
  return (
    <Card>
      <CardHeader title={L("شواهد کنار هم", "Side-by-side evidence")} subtitle={L("تصاویر hash‌دار توزین‌ها برای مقایسه چشمی", "Hashed weighing photos for visual comparison")} />
      <div className="grid gap-4 p-3 lg:grid-cols-2">
        {ids.map((id) => (
          <TxEvidence key={id} id={id} />
        ))}
      </div>
    </Card>
  );
}

function TxEvidence({ id }: { id: string }) {
  const locale = useLocale();
  const { data } = useView<VisitDetail>("tx", { id }, 10000);
  if (!data) return <Skeleton className="h-48" />;
  const tx = data.transactions.find((t) => t.id === id);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-mono text-xs">{tx?.ticketNo}</span>
        <Kv k="net" v={fmtKg(tx?.netKg, locale)} />
      </div>
      <EvidenceGallery evidence={data.evidence.filter((e) => e.transactionId === id || e.stage.startsWith("SCALE")).slice(0, 4)} plate={data.vehicle.plate} color={data.vehicle.color} cols={2} />
    </div>
  );
}
