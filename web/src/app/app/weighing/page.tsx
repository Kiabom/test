"use client";
import { CheckCircle2, Hand, Keyboard, LayoutGrid, Lock, Printer, Scale, Send, Timer, Zap } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Lines } from "@/components/charts";
import { IranPlate } from "@/components/domain/IranPlate";
import { BarrierIcon, TrafficLight, WeightDisplay } from "@/components/domain/indicators";
import { EvidenceGallery, VisitTimeline } from "@/components/domain/visit";
import { CameraFeed } from "@/components/hardware/CameraFeed";
import { ScaleDeckTop } from "@/components/hardware/ScaleDeck";
import { Badge, Button, Card, CardHeader, ConfirmDialog, cx, Dialog, EmptyState, Field, Input, Kv, PageHeader, Segmented, StatusPill, toast } from "@/components/ui";
import { guidanceFor } from "@/domain/driverGuidance";
import { remainingKg } from "@/domain/permits";
import { captureGuard } from "@/domain/weighing";
import { CAPTURE_BLOCK, DECISION_CODE, ERRORS, lbl, OPERATION, TX_STATE, VISIT_STATE } from "@/i18n/labels";
import { fmtKg, fmtNum, fmtTime } from "@/lib/format";
import { act, ActionError, useLive, useMasters, useView } from "@/lib/live";
import { useL, useLocale, usePrefs } from "@/lib/prefs";
import { USERS_LIST } from "@/lib/users";
import type { VisitDetail } from "@/server/views";

export default function WeighingPage() {
  const L = useL();
  const locale = useLocale();
  const userId = usePrefs((s) => s.userId);
  const live = useLive();
  const masters = useMasters();
  const [laneCode, setLaneCode] = useState<"B" | "C">("B");
  const [classic, setClassic] = useState(false);
  const [picked, setPicked] = useState<string | undefined>();
  const [dlg, setDlg] = useState<null | "manual" | "override" | "deduction" | "reprint">(null);
  const [manualKg, setManualKg] = useState("");
  const [dedKg, setDedKg] = useState("");
  const [busy, setBusy] = useState(false);

  const lane = live?.lanes.find((l) => l.code === laneCode);
  const awaiting = useMemo(() => (live ? live.activeIds.map((id) => live.visits[id]).filter((v) => v && !v.laneCode && v.txIds.length > 0 && (v.state === "ON_SCALE_2" || (v.state === "HOLD" && v.holdReasons.some((r) => r.startsWith("R"))))) : []), [live]);
  const visitId = lane?.visitId ?? picked ?? awaiting[0]?.id;
  const { data } = useView<VisitDetail>("visit", visitId ? { id: visitId } : null, 800);
  const det = data && data.visit.id === visitId ? data : null;
  const tx = det?.transactions.filter((t) => t.state !== "VOIDED").at(-1);
  const w1 = det?.weighEvents.find((w) => w.id === tx?.firstWeighId);
  const w2 = det?.weighEvents.find((w) => w.id === tx?.secondWeighId);
  const onDeck = !!lane?.visitId && lane.visitId === visitId;
  const scaleId = laneCode === "B" ? "SC-1" : "SC-2";
  const scale = masters?.scales.find((s) => s.id === scaleId);
  const cal = masters?.calibrations.find((c) => c.id === scale?.calibrationId);
  const calValid = !!cal && new Date(cal.validUntil) > new Date();
  const ageMs = lane?.lastReadingAt && live ? new Date(live.now).getTime() - new Date(lane.lastReadingAt).getTime() : undefined;
  const guard = lane
    ? captureGuard({
        reading: { weightKg: lane.weightKg ?? 0, stable: !!lane.stable, ageMs: ageMs ?? 1e9, online: !!lane.indicatorOnline },
        scale: { capacityKg: scale?.capacityKg ?? 80000, status: lane.locked ? "LOCKED" : "READY", legalForTrade: true },
        positionOk: !!lane.positionOk,
        identityResolved: !!det && (det.visit.identity.match !== "UNKNOWN" || det.vehicle.status === "GUEST"),
        calibrationValid: calValid,
      })
    : { allowed: false, reasons: [] as string[] };
  const canCapture = onDeck && guard.allowed && lane?.phase !== "CAPTURED" && lane?.phase !== "LEAVING";
  const isSecond = !!tx?.firstWeighId && !tx?.secondWeighId;
  const g = guidanceFor(det ? det.visit : undefined, lane);

  const run = useCallback(
    async (type: string, payload: Record<string, unknown>, ok: string) => {
      setBusy(true);
      try {
        await act(type, payload);
        toast.success(ok);
      } catch (e) {
        toast.error(e instanceof ActionError ? lbl(ERRORS, e.code, locale) : String(e));
      } finally {
        setBusy(false);
      }
    },
    [locale],
  );
  const capture = useCallback((mode?: string) => run("weigh.capture", { lane: laneCode, mode }, L("وزن ثبت شد", "Weight recorded")), [run, laneCode, L]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "F5") {
        e.preventDefault();
        if (canCapture) capture();
        else toast.warn(L("ثبت وزن اکنون مجاز نیست", "Capture not allowed right now"));
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [canCapture, capture, L]);

  const mat = masters?.materials.find((m) => m.id === tx?.materialId);
  const history = (lane?.weightHistory ?? []).map((v, i) => ({ t: i - 59, kg: v }));
  const camEv = (stage: "SCALE_1" | "SCALE_2") => det?.evidence.filter((e) => e.stage === stage) ?? [];
  const loadedNow = det ? (det.visit.state === "ON_SCALE_1" ? det.visit.operation === "RECEIVE" : det.visit.operation !== "RECEIVE") : false;

  return (
    <div>
      <PageHeader
        icon={<Scale className="size-5" />}
        title={L("ایستگاه توزین", "Weighing station")}
        subtitle={L("وزن فقط از indicator و فقط در حالت پایدار + تازه + موقعیت صحیح ثبت می‌شود (میان‌بر F5)", "Weight is recorded only from the indicator, only when stable + fresh + correctly positioned (F5)")}
        actions={
          <>
            <Segmented size="md" options={[{ id: "B", label: L("باسکول ۱ (B)", "Scale 1 (B)") }, { id: "C", label: L("باسکول ۲ (C)", "Scale 2 (C)") }]} value={laneCode} onChange={(v) => { setLaneCode(v); setPicked(undefined); }} />
            <Segmented size="md" options={[{ id: "modern", label: <span className="flex items-center gap-1"><LayoutGrid className="size-3.5" />{L("مدرن", "Modern")}</span> }, { id: "classic", label: <span className="flex items-center gap-1"><Keyboard className="size-3.5" />{L("کلاسیک", "Classic")}</span> }]} value={classic ? "classic" : "modern"} onChange={(v) => setClassic(v === "classic")} />
          </>
        }
      />

      {live?.mode === "AUTO" && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-info/30 bg-info/8 px-4 py-2.5 text-sm">
          <span>
            <Zap className="me-1 inline size-4 text-info" />
            {L("حالت خودکار فعال است: اپراتور مجازی پس از پایداری وزن را ثبت می‌کند. برای ثبت دستی توسط شما، حالت دستی را فعال کنید.", "AUTO mode: a virtual operator captures once stable. Switch to MANUAL to capture yourself.")}
          </span>
          <Button size="sm" variant="primary" onClick={() => run("sim.mode", { mode: "MANUAL" }, L("حالت دستی فعال شد", "Manual mode on"))}>
            {L("فعال‌سازی حالت دستی", "Switch to manual")}
          </Button>
        </div>
      )}
      {lane?.locked && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/8 px-4 py-2.5 text-sm text-danger">
          <Lock className="size-4" /> {L("گواهی کالیبراسیون این باسکول منقضی است — توزین تجاری قفل شد و خودروها به باسکول دیگر هدایت می‌شوند.", "Calibration certificate expired — legal weighing locked; trucks are routed to the other scale.")}
          <Link href="/app/devices?tab=calibration" className="ms-auto underline">
            {L("کالیبراسیون", "Calibration")}
          </Link>
        </div>
      )}

      {/* identity strip */}
      <Card className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-3 p-3">
        {det ? (
          <>
            <IranPlate plate={det.vehicle.plate} size="md" />
            <div className="text-sm">
              <div className="text-xs text-muted">RFID</div>
              {det.visit.identity.rfid ? <Badge tone="success">✓ {det.visit.identity.rfid.epc.slice(-9)}</Badge> : <Badge tone="warning">{L("بدون تگ", "No tag")}</Badge>}
            </div>
            <div className="text-sm">
              <div className="text-xs text-muted">{L("راننده", "Driver")}</div>
              <div className="font-medium">{locale === "fa" ? det.driver?.name : det.driver?.nameEn}</div>
            </div>
            <div className="text-sm">
              <div className="text-xs text-muted">{L("حمل‌کننده", "Carrier")}</div>
              <div className="font-medium">{locale === "fa" ? det.carrier?.name : det.carrier?.nameEn}</div>
            </div>
            <div className="text-sm">
              <div className="text-xs text-muted">{L("عملیات / ماده", "Operation / material")}</div>
              <div className="font-medium">
                {lbl(OPERATION, det.visit.operation, locale)} · {(locale === "fa" ? masters?.materials.find((m) => m.id === det.permit?.materialId)?.name : masters?.materials.find((m) => m.id === det.permit?.materialId)?.nameEn) ?? "—"}
              </div>
            </div>
            {det.permit && (
              <div className={cx("rounded-full border px-3 py-1 text-xs", det.permit.status === "ACTIVE" ? "border-success/30 bg-success/8 text-success" : "border-danger/30 bg-danger/8 text-danger")}>
                {det.permit.permitNo} · {L("مانده", "remaining")} {fmtKg(remainingKg(det.permit), locale, "t")}
              </div>
            )}
            <div className="ms-auto">
              <StatusPill status={det.visit.state === "HOLD" ? "HOLD" : tx?.state === "APPROVED" ? "PASS" : "REVIEW"} label={lbl(VISIT_STATE, det.visit.state, locale)} size="md" />
            </div>
          </>
        ) : (
          <div className="text-sm text-muted">{L("خودرویی روی باسکول نیست — منتظر فراخوان بعدی", "No truck on the scale — waiting for the next call")}</div>
        )}
      </Card>

      {classic ? (
        ClassicView()
      ) : (
        <div className="grid gap-4 xl:grid-cols-5">
          <div className="flex flex-col gap-4 xl:col-span-3">
            <Card className="p-4">
              <WeightDisplay kg={lane?.weightKg} stable={lane?.stable} motion={lane?.motion} zero={lane?.zero} online={lane?.indicatorOnline} ageMs={ageMs} size="xl" />
              <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-muted ltr">
                <span>RAW: {lane?.rawFrame ?? "—"}</span>
                <span>{scale?.indicatorModel}</span>
              </div>
              <div className="mt-2 h-28">
                <Lines data={history} x="t" height={110} unit="kg" series={[{ key: "kg", name: L("وزن ۶۰ ثانیه اخیر", "Last 60 s"), color: "var(--primary)" }]} />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex flex-wrap gap-2">
                <Button size="xl" variant="primary" disabled={!canCapture || busy} onClick={() => capture()} className="min-w-56 flex-1">
                  <Scale className="size-6" />
                  {isSecond ? L("ثبت وزن دوم", "Capture 2nd weight") : L("ثبت وزن اول", "Capture 1st weight")} <kbd className="rounded bg-white/20 px-1.5 text-xs">F5</kbd>
                </Button>
                <Button size="xl" variant="secondary" disabled={!canCapture || isSecond || busy} onClick={() => capture("storedTare")} title={L("یک‌مرحله‌ای با تارای ذخیره", "One-pass with stored tare")}>
                  <Timer className="size-5" />
                  {L("توزین سریع (تارای ذخیره)", "Quick weigh (stored tare)")}
                </Button>
                <Button size="xl" variant="ghost" disabled={!canCapture || !tx || busy} onClick={() => capture("extra")}>
                  {L("وزن سوم", "3rd weigh")}
                </Button>
                <Button size="xl" variant="warning" disabled={!onDeck || busy} onClick={() => setDlg("manual")}>
                  <Hand className="size-5" />
                  {L("وزن دستی", "Manual")}
                </Button>
              </div>
              {onDeck && !guard.allowed && (
                <div className="mt-3 flex flex-col gap-1 rounded-lg bg-warning/10 p-3 text-sm text-warning">
                  {guard.reasons.map((r) => (
                    <div key={r}>⛔ {lbl(CAPTURE_BLOCK, r, locale)}</div>
                  ))}
                </div>
              )}
              <div className={cx("mt-3 rounded-lg px-3 py-2 text-sm font-medium", g.tone === "go" ? "bg-success/12 text-success" : g.tone === "stop" ? "bg-danger/10 text-danger" : g.tone === "wait" ? "bg-warning/12 text-warning" : "bg-surface-2 text-muted")}>
                {L("پیام مانیتور راننده", "Driver display")}: {locale === "fa" ? g.fa : g.en}
                <Link href={`/display/${laneCode}`} target="_blank" className="ms-2 text-xs underline">
                  {L("باز کردن مانیتور", "open display")}
                </Link>
              </div>
            </Card>
            <div className="grid gap-3 md:grid-cols-3">
              <WeightCard color="var(--w1)" title={L("وزن اول", "1st weight")} kg={w1?.weightKg} at={w1?.capturedAt} method={w1?.captureMethod} />
              <WeightCard color="var(--w2)" title={L("وزن دوم", "2nd weight")} kg={w2?.weightKg} at={w2?.capturedAt} method={w2?.captureMethod} />
              <WeightCard color="var(--wn)" title={L("خالص", "Net")} kg={tx?.netKg} sub={tx ? `${L("ناخالص", "Gross")} ${fmtNum(tx.grossKg, locale)} · ${L("تارا", "Tare")} ${fmtNum(tx.tareKg, locale)}${tx.tareSource === "STORED" ? " (STORED)" : ""}` : undefined} strong />
            </div>
            {tx && (
              <Card>
                <CardHeader
                  title={`${L("تراکنش", "Transaction")} ${tx.ticketNo}`}
                  subtitle={`${lbl(TX_STATE, tx.state, locale)} · ${mat ? (locale === "fa" ? mat.name : mat.nameEn) : ""}`}
                  actions={tx.holdReasons.length ? tx.holdReasons.map((r) => <Badge key={r} tone="danger">{lbl(DECISION_CODE, r, locale)}</Badge>) : null}
                />
                <div className="grid gap-4 p-4 md:grid-cols-2">
                  <div>
                    <Kv k={L("کسر مجاز", "Deduction")} v={<button className="text-primary underline" onClick={() => setDlg("deduction")}>{fmtKg(tx.deductionKg, locale)}</button>} />
                    <Kv k={L("وزن قابل صورت‌حساب", "Billable")} v={fmtKg(tx.billableKg, locale)} />
                    <Kv k={L("حجم LiDAR (تخمینی)", "LiDAR volume (est.)")} v={tx.volumeM3 != null ? `${fmtNum(tx.volumeM3, locale)} m³` : "—"} />
                    <Kv k="Payload (تخمینی)" v={fmtKg(tx.payloadKg, locale)} />
                    <Kv k="QC" v={tx.qcStatus} />
                  </div>
                  <div className="flex flex-col gap-2">
                    {tx.state === "RECONCILED" && (
                      <Button size="lg" variant="success" loading={busy} onClick={() => run("tx.finalize", { txId: tx.id }, L("تیکت تأیید و مجوز خروج صادر شد", "Ticket approved and exit permit issued"))}>
                        <CheckCircle2 className="size-5" />
                        {L("تأیید، صدور تیکت و مجوز خروج", "Approve, issue ticket & exit permit")}
                      </Button>
                    )}
                    {tx.state === "EXCEPTION" && (
                      <Button size="lg" variant="warning" onClick={() => setDlg("override")}>
                        {L("تأیید استثنا (دو امضا)", "Approve exception (2 signatures)")}
                      </Button>
                    )}
                    {tx.state === "APPROVED" && (
                      <>
                        <Link href={`/print/ticket/${tx.id}`} target="_blank">
                          <Button className="w-full" variant="primary" onClick={() => run("tx.print", { txId: tx.id, reason: tx.printCount ? "چاپ مجدد از ایستگاه توزین" : undefined }, L("ارسال به چاپگر", "Sent to printer"))}>
                            <Printer className="size-4" />
                            {tx.printCount ? L(`چاپ مجدد (${tx.printCount})`, `Reprint (${tx.printCount})`) : L("چاپ تیکت", "Print ticket")}
                          </Button>
                        </Link>
                        <Button variant="secondary" onClick={() => run("tx.notify", { txId: tx.id, channel: "WHATSAPP" }, L("رسید برای راننده ارسال شد", "Receipt sent to driver"))}>
                          <Send className="size-4" />
                          {L("ارسال رسید به راننده", "Send receipt to driver")}
                        </Button>
                        <Link href={`/app/transactions/${tx.id}`} className="text-center text-sm text-primary underline">
                          {L("جزئیات کامل تراکنش", "Full transaction details")}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div className="flex flex-col gap-4 xl:col-span-2">
            <Card>
              <CardHeader title={L("موقعیت روی باسکول", "Position on deck")} subtitle={L("۴ پرتو IR + ماسک ROI دوربین بالا + ۸ لودسل", "4 IR beams + overhead ROI mask + 8 load cells")} actions={lane?.positionOk ? <StatusPill status="PASS" label={L("موقعیت صحیح", "Positioned")} /> : onDeck ? <StatusPill status="HOLD" label={L("موقعیت نادرست", "Not positioned")} /> : null} />
              <div className="p-3">
                <ScaleDeckTop occupied={onDeck} beams={lane?.beams} positionOk={lane?.positionOk} offsetPct={lane?.truckOffsetPct} loaded={loadedNow} color={det?.vehicle.color} className="w-full" />
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarrierIcon state={lane?.barrier} ack={lane?.barrierAck} width={90} />
                    <TrafficLight state={lane?.light} size={14} horizontal />
                  </div>
                  <span className="text-xs text-muted">{lane?.phase}</span>
                </div>
              </div>
            </Card>
            <Card>
              <CardHeader title={L("دوربین‌های باسکول", "Scale cameras")} />
              <div className="grid grid-cols-2 gap-2 p-3">
                {(["front", "rear", "top", "side"] as const).map((view, i) => (
                  <CameraFeed key={view} view={onDeck ? view : "empty"} plate={det?.vehicle.plate} color={det?.vehicle.color} loaded={loadedNow} seed={(det?.visit.queueNo ?? 1) * 13 + i} label={`CAM-${laneCode}-${view.toUpperCase()}`} at={live?.now} confidence={view === "front" ? det?.visit.identity.anpr?.confidence : undefined} roi={view === "top" && onDeck ? (lane?.positionOk ? "ok" : "bad") : undefined} compact />
                ))}
              </div>
            </Card>
            {det && (
              <Card>
                <CardHeader title={L("شواهد ثبت‌شده", "Recorded evidence")} />
                <div className="flex flex-col gap-3 p-3">
                  <EvidenceGallery evidence={[...camEv("SCALE_1"), ...camEv("SCALE_2")]} plate={det.vehicle.plate} color={det.vehicle.color} cols={4} />
                </div>
              </Card>
            )}
            {awaiting.length > 0 && (
              <Card>
                <CardHeader title={L("منتظر تأیید / صدور اسناد", "Awaiting approval / documents")} />
                <ul className="divide-y divide-border">
                  {awaiting.map((v) => (
                    <li key={v.id}>
                      <button onClick={() => setPicked(v.id)} className={cx("flex w-full items-center gap-2 px-3 py-2 text-start hover:bg-surface-2", visitId === v.id && "bg-primary/5")}>
                        <IranPlate plate={v.plate} size="xs" />
                        <span className="flex-1 text-xs">{v.state === "HOLD" ? v.holdReasons.map((r) => lbl(DECISION_CODE, r, locale)).join("، ") : L("منتظر تأیید اپراتور", "Awaiting operator")}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
          {det && (
            <Card className="p-4 xl:col-span-5">
              <VisitTimeline visit={det.visit} events={{ ARRIVED: det.visit.arrivedAt, IN_SITE: det.visit.enteredAt, ON_SCALE_1: w1?.capturedAt, ON_SCALE_2: w2?.capturedAt, EXITED: det.visit.exitedAt }} />
            </Card>
          )}
        </div>
      )}

      <Dialog open={dlg === "manual"} onClose={() => setDlg(null)} title={L("ثبت وزن دستی (خرابی indicator)", "Manual weight (indicator failure)")}>
        <ManualForm
          kg={manualKg}
          setKg={setManualKg}
          onSubmit={async (reason, signer) => {
            await run("weigh.capture", { lane: laneCode, manual: { kg: Number(manualKg), reason, signer } }, L("وزن دستی ثبت شد (برچسب MANUAL)", "Manual weight recorded (MANUAL flag)"));
            setDlg(null);
          }}
          userId={userId}
        />
      </Dialog>
      <ConfirmDialog open={dlg === "override"} onClose={() => setDlg(null)} needSigner users={USERS_LIST.filter((u) => u.id !== userId).map((u) => ({ id: u.id, name: locale === "fa" ? u.name : u.nameEn }))} title={L("تأیید استثنا با امضای دوم", "Approve exception with second signature")} description={tx?.holdReasons.map((r) => lbl(DECISION_CODE, r, locale)).join(" · ")} onConfirm={({ reason, signer }) => run("tx.finalize", { txId: tx!.id, override: { reason, signer } }, L("استثنا تأیید شد", "Exception approved"))} />
      <ConfirmDialog open={dlg === "reprint"} onClose={() => setDlg(null)} title={L("چاپ مجدد تیکت", "Reprint ticket")} onConfirm={async ({ reason }) => { await run("tx.print", { txId: tx!.id, reason }, L("چاپ مجدد ثبت شد", "Reprint logged")); window.open(`/print/ticket/${tx!.id}`, "_blank"); }} />
      <Dialog
        open={dlg === "deduction"}
        onClose={() => setDlg(null)}
        title={L("کسر مجاز (رطوبت/ضایعات)", "Authorized deduction")}
        footer={
          <Button variant="primary" onClick={async () => { await run("tx.deduction", { txId: tx!.id, kg: Number(dedKg), reason: "کسر رطوبت/ضایعات طبق قرارداد" }, L("کسر ثبت شد", "Deduction saved")); setDlg(null); }}>
            {L("ثبت", "Save")}
          </Button>
        }
      >
        <Field label={L("مقدار کسر (kg) — وزن خام تغییر نمی‌کند", "Deduction (kg) — raw weights unchanged")}>
          <Input type="number" value={dedKg} onChange={(e) => setDedKg(e.target.value)} />
        </Field>
      </Dialog>
    </div>
  );

  function ClassicView() {
    const vehicle = det?.vehicle;
    return (
      <Card className="overflow-hidden">
        <div className="bg-[#1d3557] px-4 py-2 text-sm font-bold text-white ltr">Weighment Entry — RFID / ANPR · {scale?.nameEn}</div>
        <div className="grid gap-4 p-4 lg:grid-cols-[1.1fr_1fr_1fr]">
          <div className="flex flex-col gap-3">
            <WeightDisplay variant="classic" kg={lane?.weightKg} stable={lane?.stable} motion={lane?.motion} zero={lane?.zero} online={lane?.indicatorOnline} size="lg" />
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {[
                [L("ناخالص", "Gross"), tx?.grossKg],
                [L("تارا", "Tare"), tx?.tareKg],
                [L("خالص", "Net"), tx?.netKg],
              ].map(([a, b]) => (
                <div key={String(a)} className="rounded border border-border bg-surface-2 p-2">
                  <div className="text-muted">{a}</div>
                  <div className="num text-base font-bold">{b != null ? fmtNum(b as number, locale) : "—"}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Kv k={L("زمان وزن اول", "1st time")} v={fmtTime(w1?.capturedAt, locale, true)} />
              <Kv k={L("زمان وزن دوم", "2nd time")} v={fmtTime(w2?.capturedAt, locale, true)} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {[
              [L("پلاک", "Vehicle No"), vehicle?.plateNormalized],
              [L("راننده", "Driver"), locale === "fa" ? det?.driver?.name : det?.driver?.nameEn],
              [L("مشتری / تأمین‌کننده", "Buyer / supplier"), masters?.customers.find((c) => c.id === det?.permit?.customerId)?.[locale === "fa" ? "name" : "nameEn"]],
              [L("کالا", "Product"), mat?.[locale === "fa" ? "name" : "nameEn"]],
              [L("حواله", "Order"), det?.permit?.permitNo],
              [L("تیکت", "Ticket"), tx?.ticketNo],
              [L("شماره کارت RFID", "Card No"), det?.visit.identity.rfid?.epc],
            ].map(([k, v]) => (
              <label key={String(k)} className="grid grid-cols-[110px_1fr] items-center gap-2">
                <span className="text-xs text-muted">{k}</span>
                <input readOnly value={v ?? ""} className="h-8 rounded border border-border bg-surface-2 px-2 font-mono text-xs ltr" />
              </label>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(["front", "rear", "top", "side"] as const).map((view, i) => (
              <CameraFeed key={view} view={onDeck ? view : "empty"} plate={vehicle?.plate} color={vehicle?.color} loaded={loadedNow} seed={(det?.visit.queueNo ?? 1) * 13 + i} label={`CAM ${i + 1}`} at={live?.now} compact roi={view === "top" && onDeck ? (lane?.positionOk ? "ok" : "bad") : undefined} />
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-border bg-surface-2 p-3">
          <Button variant="primary" disabled={!canCapture || isSecond} onClick={() => capture()}>1st</Button>
          <Button variant="primary" disabled={!canCapture || !isSecond} onClick={() => capture()}>2nd</Button>
          <Button disabled={!canCapture || !tx} onClick={() => capture("extra")}>3rd</Button>
          <Button disabled={!tx || tx.state !== "APPROVED"} onClick={() => setDlg("reprint")}>Reprint</Button>
          <span className="mx-2 h-6 w-px bg-border" />
          <span className="flex items-center gap-1 text-xs">Barrier 1 <BarrierIcon state={lane?.barrier} ack={lane?.barrierAck} width={60} /></span>
          <span className="flex items-center gap-1 text-xs">Signal 1 <TrafficLight state={lane?.light} size={10} horizontal /></span>
          <span className="ms-auto font-mono text-[11px] text-muted ltr">COM3 · 9600 8N1 · {lane?.indicatorOnline ? "CONNECTED" : "NO LINK"} · ANPR OK · IoT OK</span>
        </div>
      </Card>
    );
  }
}

function WeightCard({ title, kg, at, method, color, sub, strong }: { title: string; kg?: number; at?: string; method?: string; color: string; sub?: string; strong?: boolean }) {
  const locale = useLocale();
  return (
    <div className="rounded-xl p-4 text-white shadow-sm" style={{ background: color }}>
      <div className="flex items-center justify-between text-xs opacity-85">
        <span>{title}</span>
        {method && method !== "SENSOR" && <span className="rounded bg-white/25 px-1.5 font-bold">{method}</span>}
      </div>
      <div className={cx("num mt-1 font-black", strong ? "text-3xl" : "text-2xl")}>
        {kg != null ? fmtNum(kg, locale) : "—"} <span className="text-sm font-medium opacity-80">kg</span>
      </div>
      <div className="mt-1 text-[11px] opacity-80">{sub ?? (at ? fmtTime(at, locale, true) : " ")}</div>
    </div>
  );
}

function ManualForm({ kg, setKg, onSubmit, userId }: { kg: string; setKg: (v: string) => void; onSubmit: (reason: string, signer: string) => Promise<void>; userId: string }) {
  const L = useL();
  const locale = useLocale();
  const [reason, setReason] = useState("");
  const [signer, setSigner] = useState("");
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg bg-warning/10 p-3 text-xs text-warning">{L("وزن دستی با برچسب MANUAL ذخیره می‌شود، «وزن قانونی» محسوب نمی‌شود و امضای کاربر دوم الزامی است.", "Manual weights are flagged MANUAL, are not legal weights, and require a second user's signature.")}</div>
      <Field label={L("وزن (kg)", "Weight (kg)")}>
        <Input type="number" value={kg} onChange={(e) => setKg(e.target.value)} />
      </Field>
      <Field label={L("دلیل", "Reason")}>
        <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder={L("مثلاً: قطع ارتباط RS-232", "e.g. RS-232 link down")} />
      </Field>
      <Field label={L("امضای دوم", "Second signer")}>
        <select className="h-10 rounded-lg border border-border bg-surface px-2 text-sm" value={signer} onChange={(e) => setSigner(e.target.value)}>
          <option value="">—</option>
          {USERS_LIST.filter((u) => u.id !== userId).map((u) => (
            <option key={u.id} value={u.id}>
              {locale === "fa" ? u.name : u.nameEn}
            </option>
          ))}
        </select>
      </Field>
      <Button variant="warning" disabled={!kg || reason.length < 3 || !signer} onClick={() => onSubmit(reason, signer)}>
        {L("ثبت وزن دستی", "Record manual weight")}
      </Button>
    </div>
  );
}
