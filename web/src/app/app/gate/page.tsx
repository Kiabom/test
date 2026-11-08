"use client";
import { clockNow } from "@/domain/clock";
import { Ban, CheckCircle2, DoorOpen, FileWarning, QrCode, ShieldAlert, UserPlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { VehicleTag } from "@/components/domain/VehicleTag";
import { BarrierIcon, TrafficLight } from "@/components/domain/indicators";
import { decisionStatus } from "@/components/domain/lanes";
import { EvidenceGallery, GateDecisionTrace, IdentityFusionCard, VisitTimeline } from "@/components/domain/visit";
import { CameraFeed } from "@/components/hardware/CameraFeed";
import { UvssImage } from "@/components/hardware/Devices";
import { Badge, Button, Card, CardHeader, ConfirmDialog, cx, Dialog, EmptyState, Field, Input, Kv, PageHeader, StatusPill, Tabs, toast, InDev } from "@/components/ui";
import type { Visit } from "@/domain/types";
import { remainingKg } from "@/domain/permits";
import { DECISION_CODE, ERRORS, lbl, PERMIT_STATUS, VISIT_STATE } from "@/i18n/labels";
import { fmtDate, fmtDuration, fmtKg, fmtTime } from "@/lib/format";
import { act, ActionError, useData, useLive, useView } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import { USERS_LIST } from "@/lib/users";
import type { VisitDetail } from "@/server/views";

export default function GatePage() {
  const L = useL();
  const locale = useLocale();
  const live = useLive();
  const [tab, setTab] = useState<"in" | "out">("in");
  const [selected, setSelected] = useState<string | undefined>();
  const [dlg, setDlg] = useState<null | "approve" | "reject" | "guest" | "barrier">(null);
  const [search, setSearch] = useState("");

  const laneA = live?.lanes.find((l) => l.code === "A");
  const laneE = live?.lanes.find((l) => l.code === "E");
  const held = useMemo(() => (live ? live.activeIds.map((id) => live.visits[id]).filter((v) => v && v.state === "HOLD") : []), [live]);
  const current = tab === "in" ? laneA?.visitId : laneE?.visitId;
  const visitId = selected ?? current ?? (tab === "in" ? held.find((h) => !h.txIds.length)?.id : held.find((h) => h.txIds.length)?.id);
  const { data: det } = useView<VisitDetail>("visit", visitId ? { id: visitId } : null, 1500);
  useEffect(() => setSelected(undefined), [tab]);
  const d = visitId && det?.visit.id === visitId ? det : null;
  const lane = tab === "in" ? laneA : laneE;

  const run = async (type: string, payload: Record<string, unknown>, ok: string) => {
    try {
      await act(type, payload);
      toast.success(ok);
    } catch (e) {
      toast.error(e instanceof ActionError ? lbl(ERRORS, e.code, locale) : String(e));
      throw e;
    }
  };

  const inside = live ? live.activeIds.map((id) => live.visits[id]).filter((v) => v && !["ARRIVED", "IDENTIFIED", "HOLD"].includes(v.state)) : [];
  const filtered = inside.filter((v) => !search || v.plateNormalized.includes(search) || v.driverName.includes(search));
  const evGate = d?.evidence.filter((e) => e.stage === (tab === "in" ? "GATE_IN" : "GATE_OUT")) ?? [];
  const decisionEvent = d?.gateEvents.filter((g) => g.type === "DECISION" && g.laneCode === (tab === "in" ? "A" : "E")).at(-1);

  return (
    <div>
      <PageHeader
        icon={<DoorOpen className="size-5" />}
        title={L("دروازه و حراست", "Gate & security")}
        subtitle={L("پلاک‌خوان جلو/عقب، RFID، اسکن زیر خودرو، عکس مدارک راننده و تصمیم مرحله‌ای", "Front/rear ANPR, RFID, under-vehicle scan, driver document photo and step-wise decision")}
        actions={
          <>
            <Tabs tabs={[{ id: "in", label: L("ورود (لاین A)", "Entry (lane A)") }, { id: "out", label: L("خروج (لاین E)", "Exit (lane E)") }]} value={tab} onChange={setTab} />
            <Link href="/app/guard">
              <Button variant="primary">
                <QrCode className="size-4" />
                {L("اسکن QR حراست", "Guard QR scan")}
              </Button>
            </Link>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_320px]">
        {/* cameras */}
        <div className="flex flex-col gap-3">
          <Card>
            <CardHeader title={<>{L("دوربین‌ها و اسکن زیر خودرو", "Cameras & under-vehicle scan")}<InDev /></>} />
            <div className="grid grid-cols-2 gap-2 p-3">
              <CameraFeed view={d ? "front" : "empty"} plate={d?.vehicle.plate} color={d?.vehicle.color} loaded={tab === "in" ? d?.visit.operation === "RECEIVE" : d?.visit.operation !== "RECEIVE"} seed={evGate[0]?.seed ?? 11} label={tab === "in" ? "CAM-A-FRONT" : "CAM-E-FRONT"} at={live?.now} confidence={d?.visit.identity.anpr?.confidence} compact />
              <CameraFeed view={d ? "rear" : "empty"} plate={d?.vehicle.plate} loaded={tab === "in" ? d?.visit.operation === "RECEIVE" : d?.visit.operation !== "RECEIVE"} seed={evGate[1]?.seed ?? 12} label="CAM-A-REAR" at={live?.now} confidence={d?.visit.identity.anprRear?.confidence} compact />
              <CameraFeed view={d ? "overview" : "empty"} color={d?.vehicle.color} seed={evGate[2]?.seed ?? 13} label="CAM-A-OVR" at={live?.now} compact />
              <CameraFeed view={d ? "license" : "empty"} seed={evGate[3]?.seed ?? 14} label="CAM-A-LIC" at={live?.now} compact />
            </div>
            <div className="px-3 pb-3">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-semibold">UVSS — {L("زیر خودرو", "under-vehicle")}</span>
                {d?.uvss && <StatusPill status={d.uvss.status === "SUSPECT" || d.uvss.status === "ESCALATED" ? "HOLD" : "PASS"} label={`${L("تطابق", "match")} ${d.uvss.referenceMatchPct}%`} />}
              </div>
              <div className="overflow-hidden rounded-lg">{d?.uvss ? <UvssImage anomalies={d.uvss.anomalies} /> : <div className="h-24 rounded-lg bg-surface-2" />}</div>
              {d?.uvss && d.uvss.anomalies.length > 0 && (
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="success" onClick={() => run("uvss.decide", { id: d.uvss!.id, clear: true, note: "بازرسی فیزیکی انجام شد — مجاز" }, L("UVSS تأیید شد", "UVSS cleared"))}>
                    {L("تأیید سالم", "Clear")}
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => run("uvss.decide", { id: d.uvss!.id, clear: false, note: "ارجاع به حراست" }, L("ارجاع شد", "Escalated"))}>
                    {L("ارجاع به حراست", "Escalate")}
                  </Button>
                  <Link href="/app/scan?tab=uvss" className="ms-auto text-xs text-primary">
                    {L("مرکز اسکن", "Scan center")} ←
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* identity & decision */}
        <div className="flex flex-col gap-3">
          {!d ? (
            <Card>
              <EmptyState icon={<DoorOpen className="size-10" />} title={L("خودرویی در دروازه نیست", "No vehicle at the gate")} hint={L("با رسیدن خودروی بعدی، پلاک و تگ آن اینجا نمایش داده می‌شود", "The next truck’s plate and tag appear here when it arrives")} />
            </Card>
          ) : (
            <>
              <Card className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <VehicleTag plate={d.vehicle.plate} size="lg" />
                    <div>
                      <div className="text-sm font-semibold">
                        #{d.visit.queueNo} · {lbl(VISIT_STATE, d.visit.state, locale)}
                      </div>
                      <div className="text-xs text-muted">
                        {L("رسیدن", "Arrived")} {fmtTime(d.visit.arrivedAt, locale)} {d.visit.scenario && <Badge tone="info">{d.visit.scenario}</Badge>}
                      </div>
                    </div>
                  </div>
                  {decisionEvent?.decision && <StatusPill size="lg" status={decisionStatus(decisionEvent.decision)} />}
                </div>
                <div className="mt-4">
                  <VisitTimeline visit={d.visit} events={{ ARRIVED: d.visit.arrivedAt, IN_SITE: d.visit.enteredAt, EXITED: d.visit.exitedAt }} />
                </div>
              </Card>
              <IdentityFusionCard identity={d.visit.identity} plate={d.vehicle.plate} vehicleId={d.vehicle.id} driverId={d.driver?.id} vehicleStatus={d.vehicle.status} driverName={locale === "fa" ? d.driver?.name : d.driver?.nameEn} carrierName={locale === "fa" ? d.carrier?.name : d.carrier?.nameEn} />
              <Card>
                <CardHeader title={L("تصمیم گیت (مرحله‌به‌مرحله)", "Gate decision (step by step)")} subtitle={L("ایمنی ← هویت ← مدارک ← حواله ← هشدارها؛ PASS فقط درخواست باز شدن به PLC است", "Safety → identity → documents → permit → alerts; PASS only requests the PLC to open")} />
                <div className="flex flex-col gap-3 p-4">
                  <GateDecisionTrace trace={decisionEvent?.trace ?? (lane?.visitId === d.visit.id ? lane.trace : undefined)} decision={decisionEvent?.decision} />
                  {d.visit.holdReasons.length > 0 && (
                    <div className="flex items-center gap-2 rounded-lg bg-danger/8 p-2 text-sm text-danger">
                      <FileWarning className="size-4" />
                      {d.visit.holdReasons.map((r) => lbl(DECISION_CODE, r, locale)).join(" · ")}
                    </div>
                  )}
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="rounded-lg border border-border p-3">
                      <div className="mb-1 text-xs font-semibold text-muted">{L("حواله / مجوز حمل", "Permit")}</div>
                      {d.permit ? (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm ltr">{d.permit.permitNo}</span>
                            <Badge tone={d.permit.status === "ACTIVE" ? "success" : "danger"}>{lbl(PERMIT_STATUS, d.permit.status, locale)}</Badge>
                          </div>
                          <Kv k={L("مانده", "Remaining")} v={fmtKg(remainingKg(d.permit), locale, "t")} />
                          <Kv k={L("اعتبار تا", "Valid to")} v={fmtDate(d.permit.validTo, locale)} />
                        </>
                      ) : (
                        <div className="text-sm text-muted">{L("بدون حواله", "No permit")}</div>
                      )}
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <div className="mb-1 text-xs font-semibold text-muted">{L("مدارک", "Documents")}</div>
                      <Kv k={L("بیمه خودرو", "Insurance")} v={<span className={new Date(d.vehicle.insuranceUntil) < new Date(clockNow()) ? "text-danger" : ""}>{fmtDate(d.vehicle.insuranceUntil, locale)}</span>} />
                      <Kv k={L("معاینه فنی", "Inspection")} v={fmtDate(d.vehicle.inspectionUntil, locale)} />
                      <Kv k={L("گواهینامه راننده", "Driver licence")} v={d.driver ? fmtDate(d.driver.licenseUntil, locale) : "—"} />
                    </div>
                  </div>
                </div>
              </Card>
              {tab === "out" && (
                <Card>
                  <CardHeader title={L("مجوز خروج QR", "Exit permit QR")} />
                  <div className="p-4 text-sm">
                    {d.exitPermit ? (
                      <div className="flex items-center justify-between">
                        <span className="font-mono ltr">{d.exitPermit.serial}</span>
                        <StatusPill status={d.exitPermit.status === "CONSUMED" ? "PASS" : d.exitPermit.status === "APPROVED" ? "REVIEW" : "BLOCK"} label={d.exitPermit.status === "CONSUMED" ? L("اسکن و مصرف شد", "Scanned & consumed") : d.exitPermit.status === "APPROVED" ? L("منتظر اسکن حراست", "Awaiting guard scan") : d.exitPermit.status} />
                      </div>
                    ) : (
                      <div className="text-muted">{L("مجوز خروج صادر نشده", "No exit permit issued")}</div>
                    )}
                  </div>
                </Card>
              )}
              <EvidenceGallery evidence={evGate} plate={d.vehicle.plate} color={d.vehicle.color} />
            </>
          )}
        </div>

        {/* actions */}
        <div className="flex flex-col gap-3">
          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold">{L("راهبند و چراغ", "Barrier & light")}</span>
              <TrafficLight state={lane?.light} horizontal size={14} />
            </div>
            <div className="flex items-center justify-between">
              <BarrierIcon state={lane?.barrier} ack={lane?.barrierAck} width={140} />
              <div className="text-end text-xs">
                <div className="font-semibold">{lane?.barrier}</div>
                <div className={lane?.barrierAck ? "text-success" : "text-warning"}>{lane?.barrierAck ? "PLC ACK ✓" : L("منتظر ACK", "Awaiting ACK")}</div>
              </div>
            </div>
            <Button className="mt-3 w-full" size="sm" variant="secondary" onClick={() => setDlg("barrier")}>
              {L("باز کردن دستی (با دلیل)", "Manual open (with reason)")}
            </Button>
          </Card>
          <Card className="p-4">
            <div className="mb-3 text-sm font-semibold">{L("اقدام نگهبان", "Guard action")}</div>
            <div className="flex flex-col gap-2">
              <Button size="lg" variant="success" disabled={!d || !["HOLD", "ARRIVED", "IDENTIFIED"].includes(d.visit.state)} onClick={() => setDlg("approve")}>
                <CheckCircle2 className="size-5" />
                {L("تأیید ورود", "Approve entry")}
              </Button>
              <Button size="lg" variant="danger" disabled={!d || !["HOLD", "ARRIVED", "IDENTIFIED"].includes(d.visit.state)} onClick={() => setDlg("reject")}>
                <Ban className="size-5" />
                {L("رد ورود", "Reject")}
              </Button>
              <Button size="lg" variant="warning" onClick={() => setDlg("guest")}>
                <UserPlus className="size-5" />
                {L("ثبت خودرو مهمان", "Register guest")}
              </Button>
            </div>
            <p className="mt-3 text-[11px] leading-5 text-muted">{L("هر اقدام با دلیل، هویت کاربر و زمان در ردپای ممیزی ثبت می‌شود.", "Every action is recorded with reason, user and time in the audit trail.")}</p>
          </Card>
          <Card>
            <CardHeader title={L("نیازمند بررسی", "Needs review")} icon={<ShieldAlert className="size-4" />} actions={<Badge tone={held.length ? "danger" : "neutral"}>{held.length}</Badge>} />
            <ul className="max-h-72 divide-y divide-border overflow-auto">
              {held.map((h) => (
                <li key={h.id}>
                  <button onClick={() => setSelected(h.id)} className={cx("flex w-full items-center gap-2 px-3 py-2 text-start hover:bg-surface-2", visitId === h.id && "bg-primary/5")}>
                    <VehicleTag plate={h.plate} size="xs" />
                    <span className="flex-1 truncate text-xs text-danger">{h.holdReasons.map((r) => lbl(DECISION_CODE, r, locale)).join("، ")}</span>
                  </button>
                </li>
              ))}
              {!held.length && <li className="px-3 py-4 text-center text-xs text-muted">{L("موردی نیست", "Nothing pending")}</li>}
            </ul>
          </Card>
          <GuestLog />
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader title={L("داخل سایت اکنون", "Inside now")} subtitle={L("مدت اقامت؛ قرمز = بیش از ۲ ساعت", "Dwell time; red = over 2 hours")} actions={<Input placeholder={L("جست‌وجو…", "Search…")} value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-44" />} />
        <div className="grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {filtered.map((v) => {
            const dwell = live ? new Date(live.now).getTime() - new Date(v.arrivedAt).getTime() : 0;
            return (
              <div key={v.id} className="rounded-lg border border-border p-2">
                <VehicleTag plate={v.plate} size="sm" />
                <div className="mt-1 text-[11px] text-muted">{lbl(VISIT_STATE, v.state, locale)}</div>
                <div className={cx("num text-xs font-bold", dwell > 7.2e6 ? "text-danger" : dwell > 3.6e6 ? "text-warning" : "text-success")}>{fmtDuration(dwell, locale)}</div>
              </div>
            );
          })}
        </div>
      </Card>

      <ConfirmDialog open={dlg === "approve"} onClose={() => setDlg(null)} title={L("تأیید ورود خودرو", "Approve entry")} description={d?.visit.identity.match === "MISMATCH" ? L("مغایرت پلاک و RFID — دلیل تطبیق دستی را ثبت کنید.", "Plate/RFID mismatch — record why you are overriding.") : undefined} needReason={d?.visit.identity.match === "MISMATCH" || d?.visit.identity.match === "UNKNOWN"} onConfirm={({ reason }) => run("gate.decide", { visitId: d!.visit.id, approve: true, reason }, L("ورود تأیید شد — راهبند باز شد", "Entry approved — barrier opened"))} />
      <ConfirmDialog open={dlg === "reject"} onClose={() => setDlg(null)} danger title={L("رد ورود", "Reject entry")} onConfirm={({ reason }) => run("gate.decide", { visitId: d!.visit.id, approve: false, reason }, L("ورود رد شد", "Entry rejected"))} />
      {dlg === "guest" && <GuestDialog onClose={() => setDlg(null)} laneVisitId={d && d.visit.identity.match === "UNKNOWN" ? d.visit.id : undefined} />}
      <ConfirmDialog open={dlg === "barrier"} onClose={() => setDlg(null)} title={L("باز کردن دستی راهبند", "Manual barrier open")} description={L("درخواست به PLC ارسال می‌شود؛ interlock ایمنی همچنان تصمیم نهایی را می‌گیرد.", "A request is sent to the PLC; the safety interlock still has the final say.")} needSigner users={USERS_LIST.map((u) => ({ id: u.id, name: locale === "fa" ? u.name : u.nameEn }))} onConfirm={({ reason }) => run("barrier.open", { lane: tab === "in" ? "A" : "E", reason }, L("درخواست باز شدن ارسال شد", "Open request sent"))} />
    </div>
  );
}

function GuestDialog({ onClose, laneVisitId }: { onClose: () => void; laneVisitId?: string }) {
  const L = useL();
  const locale = useLocale();
  const [f, setF] = useState({ plate: "", vehicleType: "", driverName: "", mobile: "", company: "", note: "" });
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const submit = async () => {
    setBusy(true);
    try {
      await act("gate.guestEntry", { ...f, visitId: laneVisitId });
      toast.success(L("ورود خودرو مهمان ثبت شد", "Guest entry logged"));
      onClose();
    } catch (e) {
      toast.error(e instanceof ActionError ? lbl(ERRORS, e.code, locale) : String(e));
    } finally {
      setBusy(false);
    }
  };
  const fields: [keyof typeof f, string, string][] = [
    ["plate", "پلاک", "Plate"],
    ["vehicleType", "نوع خودرو", "Vehicle type"],
    ["driverName", "نام راننده", "Driver name"],
    ["mobile", "موبایل", "Mobile"],
    ["company", "شرکت / علت مراجعه", "Company / purpose"],
    ["note", "توضیحات", "Note"],
  ];
  return (
    <Dialog
      open
      onClose={onClose}
      title={L("ثبت خودرو مهمان", "Register guest vehicle")}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {L("انصراف", "Cancel")}
          </Button>
          <Button variant="primary" loading={busy} onClick={submit}>
            {L("ثبت ورود", "Log entry")}
          </Button>
        </>
      }
    >
      <p className="mb-3 text-xs text-muted">{L("همه فیلدها اختیاری است؛ فقط ورود خودرو در لاگ دروازه و ردپای ممیزی ثبت می‌شود و توزینی انجام نمی‌شود.", "All fields are optional; only the entry is logged at the gate and in the audit trail, no weighing.")}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map(([k, fa, en]) => (
          <Field key={k} label={L(fa, en)}>
            <Input value={f[k]} onChange={set(k)} dir={k === "mobile" ? "ltr" : undefined} />
          </Field>
        ))}
      </div>
    </Dialog>
  );
}

function GuestLog() {
  const L = useL();
  const locale = useLocale();
  const { data } = useData<Visit>("visits", { scenario: "GUEST-ENTRY", limit: 30 }, 5000);
  const items = data?.items ?? [];
  return (
    <Card>
      <CardHeader title={L("تردد مهمان", "Guest entries")} icon={<UserPlus className="size-4" />} actions={<Badge>{items.length}</Badge>} />
      <ul className="max-h-60 divide-y divide-border overflow-auto text-xs">
        {items.map((v) => (
          <li key={v.id} className="flex items-center gap-2 px-3 py-2">
            <span className="num w-12 text-muted">{fmtTime(v.arrivedAt, locale)}</span>
            <span className="font-mono">{v.vehicleId}</span>
            <span className="min-w-0 flex-1 truncate">{[v.guest?.plate, v.guest?.driverName, v.guest?.company || v.guest?.note].filter(Boolean).join(" · ") || L("بدون مشخصات", "No details")}</span>
          </li>
        ))}
        {!items.length && <li className="px-3 py-4 text-center text-muted">{L("امروز ورود مهمانی ثبت نشده", "No guest entries yet")}</li>}
      </ul>
    </Card>
  );
}
