"use client";
import { CheckCircle2, CircleDashed, Fingerprint, Radio, ScanLine, XCircle, HelpCircle, MinusCircle } from "lucide-react";
import { useState } from "react";
import type { DecisionStep, Evidence, Plate, Visit } from "@/domain/types";
import { visitProgress, VISIT_STEPS } from "@/domain/workflow";
import { Badge, Card, CardHeader, cx, Dialog, Kv } from "@/components/ui";
import { CameraFeed, type CamView } from "@/components/hardware/CameraFeed";
import { EVIDENCE_KIND, lbl, STAGE, STEP, DECISION_CODE, VISIT_STATE } from "@/i18n/labels";
import { fmtDateTime, fmtPct, fmtTime, shortHash } from "@/lib/format";
import { useL, useLocale } from "@/lib/prefs";
import { IranPlate } from "./IranPlate";

export function IdentityFusionCard({ identity, plate, vehicleStatus, driverName, carrierName, compact }: { identity: Visit["identity"]; plate: Plate; vehicleStatus?: string; driverName?: string; carrierName?: string; compact?: boolean }) {
  const L = useL();
  const locale = useLocale();
  const tone = identity.match === "MATCH" ? "success" : identity.match === "MISMATCH" ? "danger" : identity.match === "UNKNOWN" ? "warning" : "info";
  const matchLabel = { MATCH: L("تطابق کامل ANPR + RFID", "ANPR + RFID match"), MISMATCH: L("مغایرت پلاک و RFID", "Plate / RFID mismatch"), PLATE_ONLY: L("فقط پلاک (تأییدشده)", "Plate only (confirmed)"), RFID_ONLY: L("فقط RFID", "RFID only"), UNKNOWN: L("هویت نامشخص", "Unknown identity") }[identity.match];
  return (
    <Card>
      <CardHeader title={L("تطبیق هویت (Identity Fusion)", "Identity fusion")} icon={<Fingerprint className="size-4" />} actions={<Badge tone={tone}>{matchLabel}</Badge>} />
      <div className={cx("grid gap-3 p-4", compact ? "" : "md:grid-cols-2")}>
        <div className="rounded-lg border border-border p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted">
            <ScanLine className="size-4" /> ANPR
          </div>
          <IranPlate plate={plate} size="md" highlight={identity.match === "MATCH"} />
          <div className="mt-2 text-xs text-muted">
            {L("خوانده‌شده", "Read")}: <span className="font-mono ltr">{identity.anpr?.plate ?? "—"}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs">
            {L("اطمینان", "Confidence")}:
            <span className={cx("num font-bold", (identity.anpr?.confidence ?? 0) >= 0.85 ? "text-success" : "text-danger")}>{identity.anpr ? fmtPct(identity.anpr.confidence * 100, locale) : "—"}</span>
            {identity.anprRear && <span className="text-muted">· {L("عقب", "rear")} {fmtPct(identity.anprRear.confidence * 100, locale)}</span>}
          </div>
        </div>
        <div className="rounded-lg border border-border p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted">
            <Radio className="size-4" /> RFID UHF
          </div>
          {identity.rfid ? (
            <>
              <div className="num break-all font-mono text-sm">{identity.rfid.epc}</div>
              <div className="mt-1 text-xs text-muted">RSSI {identity.rfid.rssi} dBm</div>
            </>
          ) : (
            <div className="text-sm text-muted">{L("تگی خوانده نشد", "No tag read")}</div>
          )}
          {driverName && <Kv k={L("راننده", "Driver")} v={driverName} />}
          {carrierName && <Kv k={L("حمل‌کننده", "Carrier")} v={carrierName} />}
          {vehicleStatus && vehicleStatus !== "ACTIVE" && <Badge tone={vehicleStatus === "GUEST" ? "warning" : "danger"}>{vehicleStatus === "GUEST" ? L("خودرو مهمان", "Guest vehicle") : L("خودرو مسدود", "Blocked vehicle")}</Badge>}
        </div>
      </div>
    </Card>
  );
}

export function GateDecisionTrace({ trace, decision }: { trace?: DecisionStep[]; decision?: string }) {
  const L = useL();
  const locale = useLocale();
  if (!trace?.length) return <div className="text-sm text-muted">{L("هنوز تصمیمی گرفته نشده", "No decision yet")}</div>;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {trace.map((s, i) => {
        const Icon = s.result === "OK" ? CheckCircle2 : s.result === "FAIL" ? XCircle : s.result === "UNKNOWN" ? HelpCircle : MinusCircle;
        return (
          <div key={i} className={cx("flex items-center gap-1 rounded-lg border px-2 py-1 text-xs", s.result === "OK" ? "border-success/30 bg-success/8 text-success" : s.result === "FAIL" ? "border-danger/30 bg-danger/8 text-danger" : s.result === "UNKNOWN" ? "border-warning/30 bg-warning/10 text-warning" : "border-border text-muted")}>
            <Icon className="size-3.5" />
            {lbl(STEP, s.step, locale)}
            {s.code && s.result !== "OK" && <span className="font-semibold">· {lbl(DECISION_CODE, s.code, locale)}</span>}
          </div>
        );
      })}
      {decision && <span className="ms-1 text-xs font-bold">→ {decision}</span>}
    </div>
  );
}

export function VisitTimeline({ visit, events }: { visit: Pick<Visit, "state" | "prevState">; events?: Partial<Record<(typeof VISIT_STEPS)[number], string | undefined>> }) {
  const locale = useLocale();
  const idx = visitProgress(visit.state, visit.prevState);
  return (
    <ol className="flex w-full items-start overflow-x-auto pb-1">
      {VISIT_STEPS.map((s, i) => {
        const done = i < idx || visit.state === "EXITED";
        const cur = i === idx && visit.state !== "EXITED";
        const hold = cur && visit.state === "HOLD";
        return (
          <li key={s} className="flex min-w-[92px] flex-1 flex-col items-center text-center">
            <div className="flex w-full items-center">
              <div className={cx("h-0.5 flex-1", i === 0 ? "opacity-0" : done || cur ? "bg-primary" : "bg-border")} />
              <div className={cx("grid size-7 shrink-0 place-items-center rounded-full border-2 text-xs", done ? "border-primary bg-primary text-white" : hold ? "border-danger bg-danger/10 text-danger" : cur ? "border-primary bg-primary/10 text-primary" : "border-border text-muted")}>
                {done ? <CheckCircle2 className="size-4" /> : hold ? "!" : cur ? <CircleDashed className="size-4 animate-spin" /> : i + 1}
              </div>
              <div className={cx("h-0.5 flex-1", i === VISIT_STEPS.length - 1 ? "opacity-0" : done ? "bg-primary" : "bg-border")} />
            </div>
            <div className={cx("mt-1 text-[11px] leading-tight", cur ? "font-bold" : "text-muted")}>{lbl(VISIT_STATE, s, locale)}</div>
            {events?.[s] && <div className="num text-[10px] text-muted">{fmtTime(events[s], locale)}</div>}
          </li>
        );
      })}
    </ol>
  );
}

const kindToView: Record<string, CamView> = { CAM_FRONT: "front", CAM_REAR: "rear", CAM_TOP: "top", CAM_SIDE: "side", CAM_OVERVIEW: "overview", LICENSE_PHOTO: "license", UVSS: "top", PLATE_CROP: "front" };

export function EvidenceGallery({ evidence, plate, color, cols = 4 }: { evidence: Evidence[]; plate?: Plate; color?: string; cols?: number }) {
  const L = useL();
  const locale = useLocale();
  const [open, setOpen] = useState<Evidence | null>(null);
  if (!evidence.length) return <div className="py-6 text-center text-sm text-muted">{L("شاهدی ثبت نشده", "No evidence")}</div>;
  return (
    <>
      <div className={cx("grid gap-2", cols === 4 ? "grid-cols-2 md:grid-cols-4" : cols === 5 ? "grid-cols-2 md:grid-cols-5" : "grid-cols-2 md:grid-cols-3")}>
        {evidence.map((e) => (
          <button key={e.id} onClick={() => setOpen(e)} className="group text-start">
            <CameraFeed view={kindToView[e.kind]} seed={e.seed} plate={plate} color={color} loaded={e.loaded} label={e.cameraId} at={e.capturedAt} compact rec={false} showBox={e.kind === "CAM_FRONT"} className="ring-primary transition group-hover:ring-2" />
            <div className="mt-1 flex items-center justify-between text-[10px] text-muted">
              <span>
                {lbl(STAGE, e.stage, locale)} · {lbl(EVIDENCE_KIND, e.kind, locale)}
              </span>
              <span className="font-mono ltr">{shortHash(e.sha256)}</span>
            </div>
          </button>
        ))}
      </div>
      <Dialog open={!!open} onClose={() => setOpen(null)} title={open ? `${open.cameraId} · ${lbl(STAGE, open.stage, locale)}` : ""} wide>
        {open && (
          <div className="flex flex-col gap-3">
            <CameraFeed view={kindToView[open.kind]} seed={open.seed} plate={plate} color={color} loaded={open.loaded} label={open.cameraId} at={open.capturedAt} rec={false} />
            <Kv k={L("زمان ثبت", "Captured at")} v={fmtDateTime(open.capturedAt, locale)} />
            <Kv k="SHA-256" v={<span className="break-all font-mono text-[11px] ltr">{open.sha256}</span>} />
            <Kv k={L("شناسه شاهد", "Evidence ID")} v={open.id} mono />
          </div>
        )}
      </Dialog>
    </>
  );
}
