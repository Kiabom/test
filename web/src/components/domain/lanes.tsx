"use client";
import { DoorOpen, Scale, ScanLine } from "lucide-react";
import type { LaneLive } from "@/domain/types";
import { guidanceFor } from "@/domain/driverGuidance";
import { cx, StatusPill } from "@/components/ui";
import { CameraFeed } from "@/components/hardware/CameraFeed";
import { lbl, DECISION_CODE, VISIT_STATE } from "@/i18n/labels";
import { useL, useLocale } from "@/lib/prefs";
import type { LiveData, VisitBrief } from "@/server/views";
import { BarrierIcon, TrafficLight, WeightDisplay } from "./indicators";
import { IranPlate } from "./IranPlate";

export const laneName = (code: string, L: (a: string, b: string) => string) =>
  ({ A: L("لاین A — دروازه ورود", "Lane A — entry gate"), B: L("لاین B — باسکول ۱", "Lane B — scale 1"), C: L("لاین C — باسکول ۲", "Lane C — scale 2"), D: L("لاین D — گنتری LiDAR", "Lane D — LiDAR gantry"), E: L("لاین E — دروازه خروج", "Lane E — exit gate") })[code] ?? code;

export function decisionStatus(d?: string) {
  return (d === "PASS" ? "PASS" : d === "REVIEW" ? "REVIEW" : d === "HOLD" ? "HOLD" : d === "BLOCK" ? "BLOCK" : "UNKNOWN") as "PASS" | "REVIEW" | "HOLD" | "BLOCK" | "UNKNOWN";
}

export function LaneCard({ lane, live, dark }: { lane: LaneLive; live: LiveData; dark?: boolean }) {
  const L = useL();
  const locale = useLocale();
  const v: VisitBrief | undefined = lane.visitId ? live.visits[lane.visitId] : undefined;
  const isScale = lane.kind === "SCALE";
  const ageMs = lane.lastReadingAt ? new Date(live.now).getTime() - new Date(lane.lastReadingAt).getTime() : undefined;
  const g = guidanceFor(v ? ({ state: v.state, laneCode: v.laneCode, transactionIds: v.txIds, prevState: v.prevState } as never) : undefined, lane);
  const loaded = v ? (lane.code === "A" ? v.operation === "RECEIVE" : lane.code === "B" ? (v.state === "ON_SCALE_1" ? v.operation === "RECEIVE" : v.operation !== "RECEIVE") : v.operation !== "RECEIVE") : false;
  const camId = { A: "CAM-A-FRONT", B: "CAM-B-FRONT", C: "CAM-C-FRONT", D: "CAM-D-TOP", E: "CAM-E-FRONT" }[lane.code];
  const camDev = live.devices.find((x) => x.id === camId);
  return (
    <div className={cx("flex flex-col overflow-hidden rounded-xl border", dark ? "border-white/10 bg-[#121d30] text-white" : "border-border bg-surface")}>
      <div className={cx("flex items-center justify-between gap-2 px-3 py-2 text-sm font-semibold", dark ? "bg-white/5" : "bg-surface-2")}>
        <span className="flex items-center gap-2">
          {isScale ? <Scale className="size-4" /> : lane.kind === "SCAN" ? <ScanLine className="size-4" /> : <DoorOpen className="size-4" />}
          {laneName(lane.code, L)}
        </span>
        {lane.locked ? <StatusPill status="BLOCK" label={L("قفل", "Locked")} /> : isScale && lane.indicatorOnline === false ? <StatusPill status="OFFLINE" /> : lane.decision ? <StatusPill status={decisionStatus(lane.decision)} /> : null}
      </div>
      <div className="relative">
        <CameraFeed view={!v ? "empty" : lane.code === "D" ? "top" : "front"} plate={v?.plate} color={v?.vehicleColor} loaded={loaded} seed={(v?.queueNo ?? 1) * 97 + lane.code.charCodeAt(0)} label={camId} at={live.now} confidence={v?.identity.anpr?.confidence} offline={camDev?.status === "OFFLINE"} compact />
        {camDev?.status === "DEGRADED" && <span className="absolute bottom-1 start-1 rounded bg-amber-500 px-1.5 text-[10px] font-bold text-black">{L("کیفیت تصویر پایین", "Degraded")}</span>}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-center justify-between gap-2">
          {v ? <IranPlate plate={v.plate} size="sm" /> : <span className={cx("text-xs", dark ? "text-white/50" : "text-muted")}>{L("لاین آزاد", "Lane free")}</span>}
          <div className="flex items-center gap-2">
            <BarrierIcon state={lane.barrier} ack={lane.barrierAck} width={64} />
            <TrafficLight state={lane.light} size={12} horizontal />
          </div>
        </div>
        {isScale && <WeightDisplay kg={lane.weightKg} stable={lane.stable} motion={lane.motion} zero={lane.zero} online={lane.indicatorOnline} ageMs={ageMs} variant="led" size="sm" />}
        {v && (
          <div className={cx("text-xs", dark ? "text-white/70" : "text-muted")}>
            {lbl(VISIT_STATE, v.state, locale)}
            {v.identity.rfid && <span className="ms-2 font-mono ltr">RFID ✓</span>}
            {lane.trace && lane.decision !== "PASS" && <span className="ms-2 text-danger">{lbl(DECISION_CODE, lane.trace.find((t) => t.result === "FAIL" || t.result === "UNKNOWN")?.code, locale)}</span>}
          </div>
        )}
        <div className={cx("mt-auto rounded-lg px-2 py-1.5 text-xs font-medium", g.tone === "go" ? "bg-success/15 text-success" : g.tone === "stop" ? "bg-danger/15 text-danger" : g.tone === "wait" ? "bg-warning/15 text-warning" : dark ? "bg-white/5 text-white/60" : "bg-surface-2 text-muted")}>
          📺 {locale === "fa" ? g.fa : g.en}
        </div>
      </div>
    </div>
  );
}
