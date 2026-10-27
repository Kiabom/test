import type { Decision, DecisionStep, DecisionStepName, IdentityMatch } from "./types";

export interface GateContext {
  direction: "IN" | "OUT";
  safety: { emergencyStop: boolean; laneClear: boolean; interlockFault: boolean };
  identity: IdentityMatch;
  /** ANPR read exists but below the confidence threshold and no RFID to confirm it */
  lowConfidence?: boolean;
  vehicleBlocked: boolean;
  driverBlocked: boolean;
  documentsExpired: boolean;
  hasOpenVisit: boolean; // anti-passback (IN only)
  permit: { ok: true } | { ok: false; reason: string } | "UNKNOWN";
  // OUT only
  allTransactionsApproved?: boolean;
  exitPermitApproved?: boolean;
  evidenceComplete?: boolean;
  uvssSuspect?: boolean;
  openCriticalAlerts: number;
}

export interface GateResult {
  decision: Decision;
  code: string;
  trace: DecisionStep[];
}

/**
 * Gate decision — Safety → Identity → Documents → Permit → (OUT: weight/exit permit/evidence) → Alerts.
 * PASS only *requests* a barrier opening; the PLC owns the final interlock.
 * Any UNKNOWN input yields REVIEW/HOLD, never PASS.
 */
export function evaluateGate(ctx: GateContext): GateResult {
  const trace: DecisionStep[] = [];
  const steps: DecisionStepName[] = ["SAFETY", "IDENTITY", "DOCUMENTS", "PERMIT"];
  if (ctx.direction === "OUT") steps.push("WEIGHT", "EXIT_PERMIT", "EVIDENCE");
  steps.push("ALERTS");

  const finish = (decision: Decision, code: string, failedAt: DecisionStepName, result: DecisionStep["result"] = "FAIL"): GateResult => {
    const idx = steps.indexOf(failedAt);
    trace.push({ step: failedAt, result, code });
    for (const s of steps.slice(idx + 1)) trace.push({ step: s, result: "SKIP" });
    return { decision, code, trace };
  };

  // P0 safety
  if (ctx.safety.emergencyStop) return finish("BLOCK", "EMERGENCY_STOP", "SAFETY");
  if (ctx.safety.interlockFault) return finish("BLOCK", "INTERLOCK_FAULT", "SAFETY");
  if (!ctx.safety.laneClear) return finish("HOLD", "LANE_NOT_CLEAR", "SAFETY");
  trace.push({ step: "SAFETY", result: "OK" });

  // P1 identity
  if (ctx.identity === "MISMATCH") return finish("REVIEW", "IDENTITY_MISMATCH", "IDENTITY");
  if (ctx.identity === "UNKNOWN" && ctx.lowConfidence) return finish("REVIEW", "LOW_ANPR_CONFIDENCE", "IDENTITY", "UNKNOWN");
  if (ctx.identity === "UNKNOWN") return finish("HOLD", "UNKNOWN_VEHICLE", "IDENTITY", "UNKNOWN");
  if (ctx.vehicleBlocked || ctx.driverBlocked) return finish("BLOCK", "BLACKLIST", "IDENTITY");
  if (ctx.direction === "IN" && ctx.hasOpenVisit) return finish("HOLD", "ANTI_PASSBACK", "IDENTITY");
  trace.push({ step: "IDENTITY", result: "OK", code: ctx.identity });

  if (ctx.documentsExpired) return finish("HOLD", "DOCUMENT_EXPIRED", "DOCUMENTS");
  trace.push({ step: "DOCUMENTS", result: "OK" });

  if (ctx.permit === "UNKNOWN") return finish("REVIEW", "PERMIT_UNKNOWN", "PERMIT", "UNKNOWN");
  if (!ctx.permit.ok) return finish("BLOCK", ctx.permit.reason, "PERMIT");
  trace.push({ step: "PERMIT", result: "OK" });

  if (ctx.direction === "OUT") {
    if (ctx.allTransactionsApproved === undefined) return finish("REVIEW", "WEIGHT_UNKNOWN", "WEIGHT", "UNKNOWN");
    if (!ctx.allTransactionsApproved) return finish("HOLD", "TX_NOT_APPROVED", "WEIGHT");
    trace.push({ step: "WEIGHT", result: "OK" });
    if (!ctx.exitPermitApproved) return finish("HOLD", "NO_EXIT_PERMIT", "EXIT_PERMIT");
    trace.push({ step: "EXIT_PERMIT", result: "OK" });
    if (ctx.uvssSuspect) return finish("HOLD", "UVSS_SUSPECT", "EVIDENCE");
    if (!ctx.evidenceComplete) return finish("REVIEW", "EVIDENCE_INCOMPLETE", "EVIDENCE");
    trace.push({ step: "EVIDENCE", result: "OK" });
  }

  if (ctx.openCriticalAlerts > 0) return finish("HOLD", "OPEN_CRITICAL_ALERT", "ALERTS");
  trace.push({ step: "ALERTS", result: "OK" });
  return { decision: "PASS", code: "OK", trace };
}

export function resolveIdentity(opts: {
  anprVehicleId?: string;
  anprConfidence?: number;
  rfidVehicleId?: string;
  minConfidence: number;
}): IdentityMatch {
  const plateOk = !!opts.anprVehicleId && (opts.anprConfidence ?? 0) >= opts.minConfidence;
  const rfidOk = !!opts.rfidVehicleId;
  if (plateOk && rfidOk) return opts.anprVehicleId === opts.rfidVehicleId ? "MATCH" : "MISMATCH";
  if (rfidOk && opts.anprVehicleId && opts.anprVehicleId !== opts.rfidVehicleId) return "MISMATCH";
  if (plateOk) return "PLATE_ONLY";
  if (rfidOk) return "RFID_ONLY";
  return "UNKNOWN";
}
