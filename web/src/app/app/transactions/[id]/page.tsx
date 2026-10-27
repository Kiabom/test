"use client";
import { ArrowRight, Ban, FileJson, History, Printer, Receipt, Send, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { Barcode, origin, Qr } from "@/components/domain/codes";
import { IranPlate } from "@/components/domain/IranPlate";
import { EvidenceGallery, GateDecisionTrace, VisitTimeline } from "@/components/domain/visit";
import { UvssImage } from "@/components/hardware/Devices";
import { HeightMap } from "@/components/hardware/heap";
import { Badge, Button, Card, CardHeader, ConfirmDialog, Kv, PageHeader, Skeleton, StatusPill, Table, Td, toast } from "@/components/ui";
import { DECISION_CODE, ERRORS, lbl, OPERATION, STAGE, TX_STATE } from "@/i18n/labels";
import { downloadJson } from "@/lib/export";
import { fmtDateTime, fmtKg, fmtNum, fmtTime, shortHash } from "@/lib/format";
import { act, ActionError, useMasters, useView } from "@/lib/live";
import { useL, useLocale, usePrefs } from "@/lib/prefs";
import { txStatus } from "@/lib/status";
import { userName, USERS_LIST } from "@/lib/users";
import type { VisitDetail } from "@/server/views";

export default function TxDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const L = useL();
  const locale = useLocale();
  const userId = usePrefs((s) => s.userId);
  const masters = useMasters();
  const { data, error } = useView<VisitDetail & { focusTxId: string }>("tx", { id }, 2000);
  const [dlg, setDlg] = useState<null | "void" | "reprint">(null);
  if (error) return <div className="p-10 text-center text-muted">{L("تراکنش یافت نشد", "Transaction not found")}</div>;
  if (!data) return <Skeleton className="h-[70vh]" />;
  const tx = data.transactions.find((t) => t.id === data.focusTxId)!;
  const w1 = data.weighEvents.find((w) => w.id === tx.firstWeighId);
  const w2 = data.weighEvents.find((w) => w.id === tx.secondWeighId);
  const mat = masters?.materials.find((m) => m.id === tx.materialId);
  const cus = masters?.customers.find((c) => c.id === tx.customerId);
  const verifyUrl = `${origin()}/verify/${tx.verifyCode}`;
  const run = async (type: string, payload: Record<string, unknown>, ok: string) => {
    try {
      await act(type, payload);
      toast.success(ok);
    } catch (e) {
      toast.error(e instanceof ActionError ? lbl(ERRORS, e.code, locale) : String(e));
      throw e;
    }
  };

  return (
    <div>
      <PageHeader
        icon={<Receipt className="size-5" />}
        title={
          <span className="flex items-center gap-3">
            <span className="num font-mono">{tx.ticketNo}</span>
            <StatusPill size="md" status={txStatus(tx.state)} label={lbl(TX_STATE, tx.state, locale)} />
          </span>
        }
        subtitle={`${lbl(OPERATION, tx.operation, locale)} · ${(locale === "fa" ? mat?.name : mat?.nameEn) ?? ""} · ${(locale === "fa" ? cus?.name : cus?.nameEn) ?? ""} · v${tx.version}`}
        actions={
          <>
            <Link href="/app/transactions">
              <Button size="sm" variant="ghost">
                <ArrowRight className="size-4 ltr:rotate-180" /> {L("بازگشت", "Back")}
              </Button>
            </Link>
            {tx.state === "APPROVED" && (
              <>
                <Button size="sm" variant="primary" onClick={async () => { if (tx.printCount > 0) setDlg("reprint"); else { await run("tx.print", { txId: tx.id }, L("چاپ ثبت شد", "Print logged")); window.open(`/print/ticket/${tx.id}`, "_blank"); } }}>
                  <Printer className="size-4" /> {tx.printCount ? L(`چاپ مجدد (${tx.printCount})`, `Reprint (${tx.printCount})`) : L("چاپ", "Print")}
                </Button>
                <Button size="sm" onClick={() => run("tx.notify", { txId: tx.id, channel: "SMS" }, L("پیامک ارسال شد", "SMS sent"))}>
                  <Send className="size-4" /> SMS
                </Button>
                <Button size="sm" onClick={() => run("tx.notify", { txId: tx.id, channel: "WHATSAPP" }, L("واتس‌اپ ارسال شد", "WhatsApp sent"))}>
                  WhatsApp
                </Button>
              </>
            )}
            <Button size="sm" onClick={() => downloadJson(`evidence-${tx.ticketNo}.json`, { exportedAt: new Date().toISOString(), transaction: tx, visit: data.visit, weighEvents: data.weighEvents, evidence: data.evidence, gateEvents: data.gateEvents, plateReads: data.plateReads, lidar: data.lidarScans, uvss: data.uvss, audit: data.audit })}>
              <FileJson className="size-4" /> {L("بسته شواهد", "Evidence bundle")}
            </Button>
            {tx.state !== "VOIDED" && (
              <Button size="sm" variant="danger" onClick={() => setDlg("void")}>
                <Ban className="size-4" /> {L("ابطال", "Void")}
              </Button>
            )}
          </>
        }
      />

      <Card className="mb-4 flex flex-wrap items-center gap-6 p-4">
        <IranPlate plate={data.vehicle.plate} size="lg" />
        <Kv k={L("راننده", "Driver")} v={locale === "fa" ? data.driver?.name : data.driver?.nameEn} />
        <Kv k={L("حمل‌کننده", "Carrier")} v={locale === "fa" ? data.carrier?.name : data.carrier?.nameEn} />
        <Kv k={L("حواله", "Permit")} v={<span className="font-mono ltr">{data.permit?.permitNo ?? "—"}</span>} />
        <div className="ms-auto flex items-center gap-3">
          <Qr value={verifyUrl} size={84} />
          <div className="text-xs text-muted">
            {L("کد راستی‌آزمایی", "Verify code")}
            <div className="font-mono text-sm text-text ltr">{tx.verifyCode}</div>
            <Link href={`/verify/${tx.verifyCode}`} target="_blank" className="text-primary">
              /verify ↗
            </Link>
          </div>
        </div>
      </Card>

      <Card className="mb-4 p-4">
        <VisitTimeline visit={data.visit} events={{ ARRIVED: data.visit.arrivedAt, IN_SITE: data.visit.enteredAt, ON_SCALE_1: w1?.capturedAt, ON_SCALE_2: w2?.capturedAt, EXITED: data.visit.exitedAt }} />
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="flex flex-col gap-4 xl:col-span-2">
          <div className="grid gap-3 md:grid-cols-4">
            {[
              [L("وزن اول", "1st weight"), w1?.weightKg, "var(--w1)", w1?.captureMethod],
              [L("وزن دوم", "2nd weight"), w2?.weightKg, "var(--w2)", w2?.captureMethod],
              [L("خالص", "Net"), tx.netKg, "var(--wn)", undefined],
              [L("قابل صورت‌حساب", "Billable"), tx.billableKg, "#168567", undefined],
            ].map(([a, b, c, m]) => (
              <div key={String(a)} className="rounded-xl p-4 text-white" style={{ background: String(c) }}>
                <div className="flex justify-between text-xs opacity-85">
                  <span>{a}</span>
                  {m && m !== "SENSOR" && <span className="rounded bg-white/25 px-1 font-bold">{String(m)}</span>}
                </div>
                <div className="num mt-1 text-2xl font-black">{b != null ? fmtNum(b as number, locale) : "—"} <span className="text-xs">kg</span></div>
              </div>
            ))}
          </div>
          <Card>
            <CardHeader title={L("رویدادهای وزن (خام و تغییرناپذیر)", "Weigh events (raw, immutable)")} />
            <Table head={[L("مرحله", "Pass"), L("وزن", "Weight"), L("باسکول", "Scale"), L("روش", "Method"), L("پایدار/تازه", "Stable/fresh"), L("فریم خام", "Raw frame"), "hash", L("اپراتور", "Operator"), L("زمان", "Time")]}>
              {data.weighEvents.filter((w) => w.transactionId === tx.id).map((w) => (
                <tr key={w.id}>
                  <Td>
                    <Badge tone={w.pass === "FIRST" ? "info" : w.pass === "SECOND" ? "primary" : "neutral"}>{w.pass}</Badge>
                  </Td>
                  <Td className="num font-bold">{fmtNum(w.weightKg, locale)}</Td>
                  <Td>{w.scaleId}</Td>
                  <Td>{w.captureMethod === "MANUAL" ? <StatusPill status="MANUAL" /> : w.captureMethod}</Td>
                  <Td>
                    {w.stable ? "✓" : "✗"} / {w.fresh ? "✓" : "✗"}
                  </Td>
                  <Td className="font-mono text-xs ltr">{w.rawFrame}</Td>
                  <Td className="font-mono text-xs ltr">{shortHash(w.rawHash)}</Td>
                  <Td>{userName(w.operatorId, locale)}{w.secondSigner && ` + ${userName(w.secondSigner, locale)}`}</Td>
                  <Td className="num text-xs">{fmtTime(w.capturedAt, locale, true)}</Td>
                </tr>
              ))}
            </Table>
          </Card>
          <Card>
            <CardHeader title={L("گالری شواهد تصویری", "Evidence gallery")} subtitle={L("هر تصویر با SHA-256 و زمان ثبت", "Each image with SHA-256 and timestamp")} />
            <div className="p-3">
              <EvidenceGallery evidence={data.evidence} plate={data.vehicle.plate} color={data.vehicle.color} cols={5} />
            </div>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader title={L("اسکن بالای بار (LiDAR)", "Overhead scan (LiDAR)")} actions={<StatusPill status="ESTIMATED" />} />
              <div className="p-3">
                {data.lidarScans[0] ? (
                  <>
                    <HeightMap seed={data.lidarScans[0].seed} offCenter={data.lidarScans[0].offCenterPct} className="w-full rounded" />
                    <Kv k={L("حجم", "Volume")} v={`${fmtNum(data.lidarScans[0].volumeM3, locale)} m³`} />
                    <Kv k={L("جرم تخمینی", "Estimated mass")} v={fmtKg(tx.estimatedMassKg, locale)} />
                    <Kv k={L("خارج از مرکز", "Off-centre")} v={`${fmtNum(data.lidarScans[0].offCenterPct, locale)}%`} />
                  </>
                ) : (
                  <div className="py-6 text-center text-sm text-muted">{L("اسکن LiDAR ندارد", "No LiDAR scan")}</div>
                )}
              </div>
            </Card>
            <Card>
              <CardHeader title={L("اسکن زیر خودرو (UVSS)", "Under-vehicle scan")} actions={data.uvss && <Badge tone={data.uvss.status === "CLEAR" || data.uvss.status === "CLEARED_BY_GUARD" ? "success" : "danger"}>{data.uvss.status}</Badge>} />
              <div className="p-3">{data.uvss ? <UvssImage anomalies={data.uvss.anomalies} className="w-full rounded" /> : <div className="py-6 text-center text-sm text-muted">—</div>}</div>
            </Card>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title={L("خلاصه سند", "Document summary")} />
            <div className="p-4">
              <Kv k={L("ناخالص / تارا", "Gross / tare")} v={`${fmtNum(tx.grossKg, locale)} / ${fmtNum(tx.tareKg, locale)}`} />
              <Kv k={L("منبع تارا", "Tare source")} v={tx.tareSource} />
              <Kv k={L("کسر مجاز", "Deduction")} v={`${fmtKg(tx.deductionKg, locale)} ${tx.deductionReason ? `(${tx.deductionReason})` : ""}`} />
              <Kv k="Payload (تخمینی)" v={fmtKg(tx.payloadKg, locale)} />
              <Kv k={L("ایجادکننده", "Created by")} v={userName(tx.createdBy, locale)} />
              <Kv k={L("تأییدکننده", "Approved by")} v={userName(tx.approvedBy, locale)} />
              <Kv k={L("تأیید", "Approved")} v={fmtDateTime(tx.approvedAt, locale)} />
              <Kv k={L("تعداد چاپ", "Print count")} v={fmtNum(tx.printCount, locale)} />
              <Kv k="ERP" v={<Badge tone={tx.erpStatus === "SENT" ? "success" : tx.erpStatus === "FAILED" ? "danger" : "warning"}>{tx.erpStatus}</Badge>} />
              <Kv k="QC" v={tx.qcStatus} />
              {tx.holdReasons.length > 0 && <Kv k={L("استثناها", "Exceptions")} v={tx.holdReasons.map((r) => lbl(DECISION_CODE, r, locale)).join("، ")} />}
              <div className="mt-3 flex justify-center">
                <Barcode value={tx.ticketNo} />
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader title={L("رخدادهای گیت", "Gate events")} />
            <ul className="divide-y divide-border">
              {data.gateEvents.map((g) => (
                <li key={g.id} className="px-4 py-2 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold">
                      {g.laneCode} · {g.type}
                    </span>
                    <span className="num text-muted">{fmtTime(g.at, locale, true)}</span>
                  </div>
                  {g.trace && (
                    <div className="mt-1">
                      <GateDecisionTrace trace={g.trace} decision={g.decision} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader title={L("نسخه‌ها و اصلاحات", "Revisions")} icon={<History className="size-4" />} />
            <div className="p-4 text-sm">
              {tx.revisions.length ? (
                tx.revisions.map((r) => (
                  <div key={r.version} className="mb-2 rounded-lg border border-border p-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold">v{r.version}</span>
                      <span className="num text-muted">{fmtDateTime(r.at, locale)}</span>
                    </div>
                    <div className="text-xs">{r.reason}</div>
                    <div className="font-mono text-[11px] text-muted ltr">{Object.entries(r.changes).map(([k, [a, b]]) => `${k}: ${String(a)} → ${String(b)}`).join("; ")}</div>
                  </div>
                ))
              ) : (
                <div className="text-muted">{L("بدون اصلاح — نسخه ۱", "No revisions — v1")}</div>
              )}
            </div>
          </Card>
          <Card>
            <CardHeader title={L("زنجیره audit", "Audit chain")} icon={<ShieldCheck className="size-4" />} />
            <ul className="max-h-80 divide-y divide-border overflow-auto">
              {data.audit.map((a) => (
                <li key={a.id} className="px-4 py-2 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold">{a.action}</span>
                    <span className="num text-muted">{fmtTime(a.at, locale, true)}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>{userName(a.actorId, locale)}</span>
                    <span className="font-mono ltr">#{a.seq} {shortHash(a.hash)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader title={L("پیام‌ها و ERP", "Messages & ERP")} />
            <ul className="divide-y divide-border">
              {data.outbox.map((m) => (
                <li key={m.id} className="px-4 py-2 text-xs">
                  <div className="flex justify-between">
                    <Badge>{m.channel}</Badge>
                    <Badge tone={m.status === "SENT" ? "success" : m.status === "PENDING" ? "warning" : "danger"}>{m.status}</Badge>
                  </div>
                  <div className="mt-1 truncate text-muted">{m.body}</div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
      <div className="mt-2 text-[11px] text-muted">
        {data.evidence.length} {L("شاهد", "evidence")} · {lbl(STAGE, "GATE_IN", locale)} → {lbl(STAGE, "GATE_OUT", locale)}
      </div>
      <ConfirmDialog open={dlg === "void"} onClose={() => setDlg(null)} danger needSigner users={USERS_LIST.filter((u) => u.id !== userId).map((u) => ({ id: u.id, name: locale === "fa" ? u.name : u.nameEn }))} title={L("ابطال تراکنش (سند اصلاحی)", "Void transaction (correction document)")} description={L("تراکنش حذف نمی‌شود؛ نسخه جدید با وضعیت ابطال ثبت و سهمیه حواله برگشت داده می‌شود.", "Nothing is deleted; a new voided version is recorded and the permit quota is released.")} onConfirm={({ reason, signer }) => run("tx.void", { txId: tx.id, reason, signer }, L("ابطال ثبت شد", "Voided"))} />
      <ConfirmDialog open={dlg === "reprint"} onClose={() => setDlg(null)} title={L("دلیل چاپ مجدد", "Reprint reason")} onConfirm={async ({ reason }) => { await run("tx.print", { txId: tx.id, reason }, L("چاپ مجدد ثبت شد", "Reprint logged")); window.open(`/print/ticket/${tx.id}`, "_blank"); }} />
    </div>
  );
}
