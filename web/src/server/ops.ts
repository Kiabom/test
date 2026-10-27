// Core operations shared by the simulator's virtual actors and the HTTP actions.
import { sha256 } from "@/domain/audit";
import { evaluateGate, resolveIdentity, type GateContext } from "@/domain/gate";
import { PermitLedger, remainingKg, validatePermit } from "@/domain/permits";
import { assertTransition } from "@/domain/workflow";
import { EXIT_PERMIT_TRANSITIONS, TX_TRANSITIONS } from "@/domain/workflow";
import { captureGuard, computeBillable, grossOverLimit, indicatorFrame, NegativeNetError, resolveGrossTare, storedTareUsable, computeNet } from "@/domain/weighing";
import type * as T from "@/domain/types";
import { audit, bump, enqueueOutbox, evidenceHash, log, nextId, nowIso, raiseAlert, shiftOf, token, type DB } from "./store";

export class OpError extends Error {
  constructor(public code: string, message?: string) {
    super(message ?? code);
  }
}

export const findVisit = (d: DB, id?: string) => d.visits.find((v) => v.id === id);
export const findTx = (d: DB, id?: string) => d.transactions.find((t) => t.id === id);
export const findVehicle = (d: DB, id?: string) => d.vehicles.find((v) => v.id === id);
export const findPermit = (d: DB, id?: string) => d.permits.find((p) => p.id === id);
export const lane = (d: DB, code: T.Lane["code"]) => d.live.lanes.find((l) => l.code === code)!;

export function ledger(d: DB) {
  return new PermitLedger(new Map(d.permits.map((p) => [p.id, p])), d.ledger, () => nextId(d, "PL"), nowIso);
}

export function calibrationValid(d: DB, scaleId: string, now = new Date()): boolean {
  const sc = d.scales.find((s) => s.id === scaleId);
  const cal = d.calibrations.find((c) => c.id === sc?.calibrationId);
  return !!cal && new Date(cal.validUntil) > now;
}

export function minConfidence(d: DB) {
  return d.rules.find((r) => r.code === "R06")?.params.minConfidence ?? 0.85;
}

export function freshMs(d: DB) {
  return d.rules.find((r) => r.code === "R02")?.params.freshMs ?? 12000;
}

function addEvidence(d: DB, visit: T.Visit, kind: T.EvidenceKind, stage: T.Evidence["stage"], cameraId: string, loaded: boolean, txId?: string): string {
  const seed = Math.floor(Math.random() * 1e9);
  const at = nowIso();
  const e: T.Evidence = { id: nextId(d, "EV"), kind, cameraId, visitId: visit.id, transactionId: txId, stage, capturedAt: at, sha256: evidenceHash(seed, kind, at), seed, loaded };
  d.evidence.push(e);
  return e.id;
}

export function captureGateEvidence(d: DB, visit: T.Visit, laneCode: "A" | "E") {
  const loaded = laneCode === "A" ? visit.operation === "RECEIVE" : visit.operation !== "RECEIVE";
  if (laneCode === "A") {
    addEvidence(d, visit, "CAM_FRONT", "GATE_IN", "CAM-A-FRONT", loaded);
    addEvidence(d, visit, "CAM_REAR", "GATE_IN", "CAM-A-REAR", loaded);
    addEvidence(d, visit, "CAM_OVERVIEW", "GATE_IN", "CAM-A-OVR", loaded);
    addEvidence(d, visit, "LICENSE_PHOTO", "GATE_IN", "CAM-A-LIC", loaded);
  } else {
    addEvidence(d, visit, "CAM_FRONT", "GATE_OUT", "CAM-E-FRONT", loaded);
  }
}

// ---------------- Gate ----------------

export function gateContextFor(d: DB, visit: T.Visit, direction: "IN" | "OUT"): GateContext {
  const now = new Date();
  const vehicle = findVehicle(d, visit.vehicleId)!;
  const driver = d.drivers.find((x) => x.id === visit.driverId);
  const permit = findPermit(d, visit.permitId);
  const docsExpired = new Date(vehicle.insuranceUntil) < now || (driver ? new Date(driver.licenseUntil) < now : false);
  const others = d.visits.filter((v) => v.id !== visit.id && v.vehicleId === visit.vehicleId && !["EXITED", "REJECTED", "CANCELLED", "EXPECTED"].includes(v.state));
  const txs = visit.transactionIds.map((id) => findTx(d, id)).filter(Boolean) as T.Transaction[];
  const ep = d.exitPermits.find((e) => e.id === visit.exitPermitId);
  const uv = d.uvssScans.find((u) => u.id === visit.uvssScanId);
  const openCritical = d.alerts.filter((a) => a.visitId === visit.id && a.severity === "CRITICAL" && (a.status === "OPEN" || a.status === "ACK" || a.status === "INVESTIGATING")).length;
  return {
    direction,
    safety: { emergencyStop: false, laneClear: true, interlockFault: false },
    identity: visit.identity.match,
    lowConfidence: !!visit.identity.anpr && visit.identity.anpr.confidence < minConfidence(d) && !visit.identity.rfid,
    vehicleBlocked: vehicle.status === "BLOCKED",
    driverBlocked: driver?.status === "BLOCKED",
    documentsExpired: docsExpired,
    hasOpenVisit: others.length > 0,
    permit: direction === "IN" ? (visit.internal && !permit ? { ok: true } : validatePermit(permit, { vehicle, now })) : { ok: true },
    allTransactionsApproved: direction === "OUT" ? txs.length > 0 && txs.every((t) => t.state === "APPROVED" || t.state === "VOIDED") && txs.some((t) => t.state === "APPROVED") : undefined,
    exitPermitApproved: direction === "OUT" ? ep?.status === "CONSUMED" || ep?.status === "APPROVED" : undefined,
    evidenceComplete: direction === "OUT" ? d.evidence.filter((e) => e.visitId === visit.id).length >= 3 : undefined,
    uvssSuspect: direction === "OUT" ? uv?.status === "SUSPECT" || uv?.status === "ESCALATED" : undefined,
    openCriticalAlerts: openCritical,
  };
}

/** Identity fusion from the latest reads stored on the visit. */
export function fuseIdentity(d: DB, visit: T.Visit) {
  const registry = d.vehicles.filter((v) => v.status !== "GUEST");
  const anprVehicle = visit.identity.anpr ? registry.find((v) => v.plateNormalized === visit.identity.anpr!.plate) : undefined;
  const rfidVehicle = visit.identity.rfid ? registry.find((v) => v.rfidEpc === visit.identity.rfid!.epc) : undefined;
  visit.identity.match = resolveIdentity({ anprVehicleId: anprVehicle?.id, anprConfidence: visit.identity.anpr?.confidence, rfidVehicleId: rfidVehicle?.id, minConfidence: minConfidence(d) });
}

export function applyGateDecision(d: DB, visit: T.Visit, laneCode: "A" | "E", actorId?: string) {
  const res = evaluateGate(gateContextFor(d, visit, laneCode === "A" ? "IN" : "OUT"));
  const l = lane(d, laneCode);
  l.decision = res.decision;
  l.trace = res.trace;
  d.gateEvents.push({ id: nextId(d, "GE"), visitId: visit.id, laneCode, type: "DECISION", decision: res.decision, trace: res.trace, reason: res.code, actorId, at: nowIso() });
  audit(d, "gate.decision", "Visit", visit.id, { actorId: actorId ?? "system", data: { decision: res.decision, code: res.code, lane: laneCode } });
  log(d, res.decision === "PASS" ? "info" : "warn", `GATE-${laneCode}`, `${visit.identity.anpr?.plate ?? "?"} → ${res.decision} (${res.code})`);
  return res;
}

export function requestBarrierOpen(d: DB, laneCode: T.Lane["code"], visitId?: string, actorId?: string) {
  const l = lane(d, laneCode);
  l.barrier = "OPENING";
  l.barrierAck = false;
  d.gateEvents.push({ id: nextId(d, "GE"), visitId, laneCode, type: "OPEN_REQUEST", actorId, at: nowIso() });
  log(d, "device", `PLC`, `OPEN_REQUEST lane ${laneCode}`);
}

export function confirmBarrierOpen(d: DB, laneCode: T.Lane["code"], visitId?: string) {
  const l = lane(d, laneCode);
  l.barrier = "OPEN";
  l.barrierAck = true;
  l.light = "GREEN";
  d.gateEvents.push({ id: nextId(d, "GE"), visitId, laneCode, type: "OPEN_CONFIRMED", at: nowIso() });
  log(d, "device", `PLC`, `ACK OPEN_CONFIRMED lane ${laneCode}`);
}

export function admitToSite(d: DB, visit: T.Visit, actorId?: string) {
  visit.prevState = visit.state;
  visit.state = "IN_SITE";
  visit.enteredAt = visit.enteredAt ?? nowIso();
  visit.queueJoinedAt = nowIso();
  visit.holdReasons = [];
  if (!d.live.queueB.includes(visit.id)) d.live.queueB.push(visit.id);
  const driver = d.drivers.find((x) => x.id === visit.driverId);
  enqueueOutbox(d, "SMS", "driver.link", visit.id, `راننده گرامی، نوبت شما ${visit.queueNo} ثبت شد. وضعیت سفر و دستورالعمل‌ها: /d/${visit.driverToken}`, driver?.phone);
  audit(d, "visit.admitted", "Visit", visit.id, { actorId: actorId ?? "system" });
  bump(d);
}

/** Guard decision from the gate screen. */
export function gateDecide(d: DB, visitId: string, approve: boolean, actorId: string, reason?: string) {
  const visit = findVisit(d, visitId);
  if (!visit) throw new OpError("VISIT_NOT_FOUND");
  if (!["HOLD", "ARRIVED", "IDENTIFIED"].includes(visit.state)) throw new OpError("VISIT_NOT_AT_GATE");
  if (!approve) {
    visit.prevState = visit.state;
    visit.state = "REJECTED";
    visit.exitedAt = nowIso();
    d.gateEvents.push({ id: nextId(d, "GE"), visitId, laneCode: "A", type: "DENY", reason, actorId, at: nowIso() });
    audit(d, "gate.rejected", "Visit", visitId, { actorId, reason });
    releaseLane(d, "A", visitId);
    bump(d);
    return visit;
  }
  if (visit.identity.match === "MISMATCH" && !reason) throw new OpError("REASON_REQUIRED");
  if (visit.identity.anpr && visit.identity.anpr.confidence < minConfidence(d)) {
    const pr = d.plateReads.find((p) => p.id === visit.identity.anpr!.readId);
    if (pr) pr.review = "CONFIRMED";
  }
  if (visit.identity.match === "UNKNOWN" || visit.identity.match === "MISMATCH") visit.identity.match = "PLATE_ONLY";
  d.gateEvents.push({ id: nextId(d, "GE"), visitId, laneCode: "A", type: "DECISION", decision: "PASS", reason: reason ?? "GUARD_APPROVED", actorId, at: nowIso() });
  audit(d, "gate.approved", "Visit", visitId, { actorId, reason });
  for (const a of d.alerts.filter((x) => x.visitId === visitId && x.status === "OPEN" && ["R05", "R06", "R07"].includes(x.ruleCode))) {
    a.status = "RESOLVED";
    a.resolvedAt = nowIso();
    a.ackBy = actorId;
    a.resolution = reason ?? "تأیید نگهبان";
  }
  releaseLane(d, "A", visitId);
  requestBarrierOpen(d, "A", visitId, actorId);
  confirmBarrierOpen(d, "A", visitId);
  setTimeout(() => {
    const l = lane(d, "A");
    if (!l.visitId) {
      l.barrier = "CLOSED";
      l.light = "RED";
    }
  }, 3000);
  admitToSite(d, visit, actorId);
  return visit;
}

export function registerGuest(d: DB, visitId: string, actorId: string, reason: string) {
  const visit = findVisit(d, visitId);
  if (!visit) throw new OpError("VISIT_NOT_FOUND");
  const v = findVehicle(d, visit.vehicleId)!;
  v.status = "GUEST";
  audit(d, "vehicle.guest_registered", "Vehicle", v.id, { actorId, reason });
  return gateDecide(d, visitId, true, actorId, reason || "ثبت مهمان");
}

export function releaseLane(d: DB, code: T.Lane["code"], visitId?: string) {
  const l = lane(d, code);
  if (!visitId || l.visitId === visitId) {
    l.visitId = undefined;
    l.phase = "IDLE";
    l.decision = undefined;
    l.trace = undefined;
  }
  const v = findVisit(d, visitId);
  if (v && v.laneCode === code) v.laneCode = undefined;
}

// ---------------- Weighing ----------------

export function captureWeigh(
  d: DB,
  laneCode: "B" | "C",
  actorId: string,
  opts: { manual?: { kg: number; reason: string; signer: string }; useStoredTare?: boolean; extra?: boolean } = {},
): T.WeighEvent {
  const l = lane(d, laneCode);
  const visit = findVisit(d, l.visitId);
  if (!visit) throw new OpError("NO_VEHICLE_ON_SCALE");
  const scaleId = laneCode === "B" ? "SC-1" : "SC-2";
  const scale = d.scales.find((s) => s.id === scaleId)!;
  const vehicle = findVehicle(d, visit.vehicleId)!;
  const ageMs = l.lastReadingAt ? Date.now() - new Date(l.lastReadingAt).getTime() : Infinity;
  if (!opts.manual) {
    const guard = captureGuard({
      reading: { weightKg: l.weightKg ?? 0, stable: !!l.stable, ageMs, online: !!l.indicatorOnline },
      scale,
      positionOk: !!l.positionOk,
      identityResolved: visit.identity.match !== "UNKNOWN" || vehicle.status === "GUEST",
      calibrationValid: calibrationValid(d, scaleId),
      freshMs: freshMs(d),
    });
    if (!guard.allowed) throw new OpError(guard.reasons[0], guard.reasons.join(","));
  } else if (!opts.manual.reason || !opts.manual.signer || opts.manual.signer === actorId) {
    raiseAlert(d, "R39", { visitId: visit.id, laneCode, detail: "وزن دستی بدون امضای دوم معتبر" });
    throw new OpError("SECOND_SIGNATURE_REQUIRED");
  }

  let tx = visit.transactionIds.map((id) => findTx(d, id)).find((t) => t && t.state !== "VOIDED" && t.state !== "APPROVED");
  const isFirst = !tx;
  const weightKg = opts.manual ? Math.round(opts.manual.kg) : Math.round(l.weightKg ?? 0);
  const at = nowIso();
  const loaded = isFirst ? visit.operation === "RECEIVE" : visit.operation !== "RECEIVE";
  const stage: T.Evidence["stage"] = isFirst ? "SCALE_1" : "SCALE_2";
  const cams = laneCode === "B" ? ["CAM-B-FRONT", "CAM-B-REAR", "CAM-B-TOP", "CAM-B-SIDE"] : ["CAM-C-FRONT", "CAM-C-REAR", "CAM-C-TOP", "CAM-C-SIDE"];

  if (!tx) {
    const permit = findPermit(d, visit.permitId);
    const day = new Date(Date.now() + 210 * 60000).toISOString().slice(2, 10).replace(/-/g, "");
    d.counters["ticket-" + day] = (d.counters["ticket-" + day] ?? d.transactions.filter((t) => t.ticketNo.includes(day)).length) + 1;
    const txId = nextId(d, "TX");
    tx = {
      id: txId,
      ticketNo: `S1-${day}-${String(d.counters["ticket-" + day]).padStart(4, "0")}`,
      verifyCode: sha256(txId + Math.random()).slice(0, 10).toUpperCase(),
      visitId: visit.id,
      siteId: "S1",
      vehicleId: vehicle.id,
      driverId: visit.driverId,
      carrierId: vehicle.carrierId,
      customerId: permit?.customerId,
      materialId: permit?.materialId ?? "M-WST",
      permitId: permit?.id,
      originId: permit?.originId ?? "LOC-PN",
      destinationId: permit?.destinationId ?? "LOC-DMP",
      operation: visit.operation,
      state: "DRAFT",
      extraWeighIds: [],
      deductionKg: 0,
      holdReasons: [],
      version: 1,
      revisions: [],
      printCount: 0,
      createdBy: actorId,
      createdAt: at,
      erpStatus: visit.operation === "INTERNAL" ? "N/A" : "PENDING",
      lidarScanIds: [],
      qcStatus: d.materials.find((m) => m.id === permit?.materialId)?.requiresQc ? "PENDING" : "NOT_REQUIRED",
      shiftCode: shiftOf(new Date()),
    };
    d.transactions.push(tx);
    visit.transactionIds.push(tx.id);
  }
  const evidenceIds = cams.map((c, i) => addEvidence(d, visit, (["CAM_FRONT", "CAM_REAR", "CAM_TOP", "CAM_SIDE"] as const)[i], stage, c, loaded, tx!.id));
  const pass: T.WeighEvent["pass"] = opts.extra ? "EXTRA" : isFirst ? "FIRST" : "SECOND";
  const we: T.WeighEvent = {
    id: nextId(d, "WE"),
    transactionId: tx.id,
    scaleId,
    seq: d.weighEvents.filter((w) => w.transactionId === tx!.id).length + 1,
    pass,
    weightKg,
    stable: opts.manual ? false : !!l.stable,
    fresh: opts.manual ? false : ageMs <= freshMs(d),
    ageMs: Number.isFinite(ageMs) ? Math.round(ageMs) : -1,
    positionOk: !!l.positionOk,
    captureMethod: opts.manual ? "MANUAL" : "SENSOR",
    manualReason: opts.manual?.reason,
    secondSigner: opts.manual?.signer,
    rawFrame: opts.manual ? "MANUAL" : l.rawFrame ?? indicatorFrame(weightKg, true),
    rawHash: sha256(`${l.rawFrame}|${at}|${scaleId}`),
    capturedAt: at,
    operatorId: actorId,
    evidenceIds,
  };
  d.weighEvents.push(we);
  audit(d, "weigh.captured", "WeighEvent", we.id, { actorId, actorType: actorId === "system" ? "SYSTEM" : "HUMAN", data: { kg: weightKg, pass, scaleId, method: we.captureMethod, ticketNo: tx.ticketNo } });
  log(d, "info", `SCALE-${laneCode}`, `${pass} ${weightKg.toLocaleString("en")} kg captured · ${tx.ticketNo}${opts.manual ? " (MANUAL)" : ""}`);

  if (opts.extra) {
    tx.extraWeighIds.push(we.id);
  } else if (isFirst) {
    assertTransition(TX_TRANSITIONS, tx.state, "FIRST_CAPTURED");
    tx.state = "FIRST_CAPTURED";
    tx.firstWeighId = we.id;
    // one-pass with stored tare (quick weigh)
    if (opts.useStoredTare) {
      if (!storedTareUsable(vehicle, new Date())) {
        raiseAlert(d, "R17", { visitId: visit.id, transactionId: tx.id, laneCode });
        throw new OpError("STORED_TARE_EXPIRED");
      }
      const st: T.WeighEvent = { ...we, id: nextId(d, "WE"), seq: we.seq + 1, pass: "ONE_PASS", weightKg: vehicle.storedTareKg!, captureMethod: "STORED", rawFrame: "STORED_TARE", evidenceIds: [] };
      d.weighEvents.push(st);
      tx.tareSource = "STORED";
      completeSecond(d, visit, tx, we, st, actorId, laneCode);
    } else {
      visit.prevState = visit.state;
      visit.state = "LOADING";
    }
  } else {
    const first = d.weighEvents.find((w) => w.id === tx!.firstWeighId)!;
    completeSecond(d, visit, tx, first, we, actorId, laneCode);
  }
  l.phase = "CAPTURED";
  l.phaseUntil = Date.now() + 3000 / d.live.speed;
  bump(d);
  return we;
}

function completeSecond(d: DB, visit: T.Visit, tx: T.Transaction, first: T.WeighEvent, second: T.WeighEvent, actorId: string, laneCode: T.Lane["code"]) {
  assertTransition(TX_TRANSITIONS, tx.state, "SECOND_CAPTURED");
  tx.state = "SECOND_CAPTURED";
  tx.secondWeighId = second.id;
  tx.tareSource = tx.tareSource ?? "MEASURED";
  const vehicle = findVehicle(d, visit.vehicleId)!;
  const scale = d.scales.find((s) => s.id === second.scaleId)!;
  const { grossKg, tareKg, orderAnomaly } = resolveGrossTare(tx.operation, first.weightKg, second.weightKg);
  tx.grossKg = grossKg;
  tx.tareKg = tareKg;
  tx.holdReasons = [];
  try {
    tx.netKg = computeNet(grossKg, tareKg);
  } catch (e) {
    if (e instanceof NegativeNetError) tx.holdReasons.push("R15");
  }
  if (orderAnomaly) tx.holdReasons.push("ORDER_ANOMALY");
  tx.billableKg = tx.netKg != null ? computeBillable(tx.netKg, tx.deductionKg) : undefined;
  const over = grossOverLimit(grossKg, [vehicle.maxGvwKg, scale.capacityKg]);
  if (over.over) {
    tx.holdReasons.push("R14");
    raiseAlert(d, "R14", { visitId: visit.id, transactionId: tx.id, laneCode, observed: `${grossKg} kg`, threshold: `${over.limitKg} kg` });
  }
  const permit = findPermit(d, tx.permitId);
  const tol = d.rules.find((r) => r.code === "R12")?.params.toleranceKg ?? 0;
  if (permit && tx.netKg != null && tx.netKg > remainingKg(permit) + tol) {
    tx.holdReasons.push("R12");
    raiseAlert(d, "R12", { visitId: visit.id, transactionId: tx.id, laneCode, observed: `${tx.netKg} kg`, threshold: `${remainingKg(permit)} kg` });
  }
  if (tx.qcStatus === "PENDING") {
    tx.holdReasons.push("R40");
    raiseAlert(d, "R40", { visitId: visit.id, transactionId: tx.id, laneCode });
  }
  if (tx.netKg == null) raiseAlert(d, "R15", { visitId: visit.id, transactionId: tx.id, laneCode, observed: `${grossKg} < ${tareKg}` });
  // tare outlier vs vehicle history
  const tares = d.transactions.filter((t) => t.vehicleId === vehicle.id && t.state === "APPROVED" && t.tareKg).slice(-10).map((t) => t.tareKg!);
  if (tares.length >= 5) {
    const med = [...tares].sort((a, b) => a - b)[Math.floor(tares.length / 2)];
    const lim = d.rules.find((r) => r.code === "R16")?.params.limitKg ?? 600;
    if (Math.abs(tareKg - med) > lim) {
      tx.holdReasons.push("R16");
      raiseAlert(d, "R16", { visitId: visit.id, transactionId: tx.id, laneCode, observed: `${tareKg} kg`, threshold: `median ${med} ± ${lim}` });
    }
  }
  if (tx.holdReasons.some((h) => ["R14", "R12", "R15", "R40"].includes(h))) {
    assertTransition(TX_TRANSITIONS, tx.state, "EXCEPTION");
    tx.state = "EXCEPTION";
    visit.prevState = "ON_SCALE_2";
    visit.state = "HOLD";
    visit.holdReasons = [...tx.holdReasons];
  } else {
    tx.state = "RECONCILED";
  }
  audit(d, "tx.second_captured", "Transaction", tx.id, { actorId, data: { grossKg, tareKg, netKg: tx.netKg, holds: tx.holdReasons } });
}

export function setDeduction(d: DB, txId: string, kg: number, reason: string, actorId: string) {
  const tx = findTx(d, txId);
  if (!tx) throw new OpError("TX_NOT_FOUND");
  if (tx.state === "APPROVED" || tx.state === "VOIDED") throw new OpError("TX_LOCKED");
  tx.deductionKg = Math.max(0, Math.round(kg));
  tx.deductionReason = reason;
  if (tx.netKg != null) tx.billableKg = computeBillable(tx.netKg, tx.deductionKg);
  audit(d, "tx.deduction", "Transaction", tx.id, { actorId, reason, data: { kg } });
  bump(d);
}

/** Approve a transaction: commit permit quota atomically, push ERP & driver notifications, issue exit permit. */
export function finalizeTx(d: DB, txId: string, actorId: string, override?: { reason: string; signer: string }) {
  const tx = findTx(d, txId);
  if (!tx) throw new OpError("TX_NOT_FOUND");
  const visit = findVisit(d, tx.visitId)!;
  if (tx.state === "APPROVED") return tx;
  if (tx.state !== "RECONCILED" && tx.state !== "EXCEPTION") throw new OpError("TX_NOT_READY");
  if (tx.state === "EXCEPTION") {
    if (!override?.reason || !override.signer || override.signer === actorId) {
      raiseAlert(d, "R39", { visitId: visit.id, transactionId: tx.id, detail: "تأیید استثنا بدون امضای دوم" });
      throw new OpError("SECOND_SIGNATURE_REQUIRED");
    }
    if (tx.netKg == null) throw new OpError("NEGATIVE_NET");
    tx.revisions.push({ version: tx.version + 1, at: nowIso(), by: actorId, reason: `Override: ${override.reason} (امضای دوم: ${override.signer})`, changes: { holdReasons: [tx.holdReasons.join(","), "OVERRIDDEN"] } });
    tx.version++;
  }
  if (tx.permitId && tx.netKg != null) {
    try {
      ledger(d).commit(tx.permitId, tx.id, tx.netKg, actorId, override ? 1e12 : d.rules.find((r) => r.code === "R12")?.params.toleranceKg ?? 0);
    } catch {
      throw new OpError("QUOTA_EXHAUSTED");
    }
  }
  if (tx.qcStatus === "PENDING") tx.qcStatus = override ? "APPROVED" : "PENDING";
  tx.state = "APPROVED";
  tx.approvedBy = override?.signer ?? actorId;
  tx.approvedAt = nowIso();
  const driver = d.drivers.find((x) => x.id === tx.driverId);
  const mat = d.materials.find((m) => m.id === tx.materialId);
  if (tx.operation !== "INTERNAL") enqueueOutbox(d, "ERP", "weigh-ticket.approved", tx.id, JSON.stringify({ ticketNo: tx.ticketNo, netKg: tx.netKg, billableKg: tx.billableKg, material: mat?.code, customer: tx.customerId }));
  enqueueOutbox(d, "WHATSAPP", "ticket.issued", tx.id, `رسید توزین ${tx.ticketNo} — ${mat?.name} — خالص ${tx.netKg?.toLocaleString("en")} kg — مشاهده: /verify/${tx.verifyCode}`, driver?.phone);
  for (const a of d.alerts.filter((x) => x.transactionId === tx.id && (x.status === "OPEN" || x.status === "ACK"))) {
    a.status = "RESOLVED";
    a.resolvedAt = nowIso();
    a.resolution = override ? `Override: ${override.reason}` : "تأیید تراکنش";
  }
  audit(d, "tx.approved", "Transaction", tx.id, { actorId, reason: override?.reason, data: { netKg: tx.netKg, ticketNo: tx.ticketNo, override: !!override } });
  log(d, "info", "DOCS", `Ticket ${tx.ticketNo} approved · net ${tx.netKg?.toLocaleString("en")} kg`);
  if (visit.state === "HOLD") {
    visit.state = visit.prevState ?? "ON_SCALE_2";
    visit.holdReasons = [];
  }
  issueExitPermit(d, visit.id, actorId);
  bump(d);
  return tx;
}

export function issueExitPermit(d: DB, visitId: string, actorId: string, empty = false) {
  const visit = findVisit(d, visitId);
  if (!visit) throw new OpError("VISIT_NOT_FOUND");
  const txs = visit.transactionIds.map((id) => findTx(d, id)!).filter((t) => t.state !== "VOIDED");
  if (!empty && (!txs.length || txs.some((t) => t.state !== "APPROVED"))) throw new OpError("TX_NOT_APPROVED");
  const existing = d.exitPermits.find((e) => e.id === visit.exitPermitId && e.status === "APPROVED");
  if (existing) return existing;
  const ep: T.ExitPermit = {
    id: nextId(d, "EP"),
    serial: `EX-${(txs[0]?.ticketNo ?? "EMPTY-" + visit.id).replace(/^S1-/, "")}`,
    visitId,
    transactionIds: txs.map((t) => t.id),
    token: token(12),
    status: "APPROVED",
    empty,
    approvedBy: actorId,
    approvedAt: nowIso(),
    scans: [],
  };
  d.exitPermits.push(ep);
  visit.exitPermitId = ep.id;
  visit.prevState = visit.state;
  visit.state = "READY_TO_EXIT";
  if (!visit.laneCode && !d.live.queueGateOut.includes(visit.id)) d.live.queueGateOut.push(visit.id);
  const driver = d.drivers.find((x) => x.id === visit.driverId);
  enqueueOutbox(d, "SMS", "exit.permit", ep.id, `مجوز خروج ${ep.serial} صادر شد. QR را در دروازه خروج نشان دهید: /d/${visit.driverToken}`, driver?.phone);
  audit(d, "exit.issued", "ExitPermit", ep.id, { actorId, data: { serial: ep.serial, empty } });
  bump(d);
  return ep;
}

export type ScanResult =
  | { ok: true; kind: "EXIT_PERMIT"; permit: T.ExitPermit; visit: T.Visit }
  | { ok: false; kind: "EXIT_PERMIT"; reason: "USED" | "CANCELLED" | "INVALID"; permit?: T.ExitPermit; visit?: T.Visit; usedAt?: string; usedBy?: string }
  | { ok: true; kind: "TICKET"; tx: T.Transaction }
  | { ok: false; kind: "TICKET"; reason: "VOIDED" | "NOT_APPROVED"; tx: T.Transaction }
  | { ok: true; kind: "PERMIT"; permit: T.Permit }
  | { ok: false; kind: "PERMIT"; reason: string; permit: T.Permit }
  | { ok: false; kind: "UNKNOWN"; reason: "INVALID" };

/** Parses any scanned payload (URL or raw code) and resolves what it is. */
export function parseScan(d: DB, raw: string): { kind: "EXIT_PERMIT" | "TICKET" | "PERMIT" | "UNKNOWN"; value: string } {
  const s = raw.trim();
  const m = s.match(/(?:\/x\/|exit:)([a-f0-9]{24})/i) ?? s.match(/^([a-f0-9]{24})$/i);
  if (m) return { kind: "EXIT_PERMIT", value: m[1].toLowerCase() };
  const serial = d.exitPermits.find((e) => e.serial.toUpperCase() === s.toUpperCase());
  if (serial) return { kind: "EXIT_PERMIT", value: serial.token };
  const v = s.match(/\/verify\/([A-Z0-9]{8,12})/i) ?? s.match(/^([A-F0-9]{10})$/i);
  if (v) return { kind: "TICKET", value: v[1].toUpperCase() };
  const tk = d.transactions.find((t) => t.ticketNo.toUpperCase() === s.toUpperCase());
  if (tk) return { kind: "TICKET", value: tk.verifyCode };
  const pm = d.permits.find((p) => p.permitNo.toUpperCase() === s.toUpperCase());
  if (pm) return { kind: "PERMIT", value: pm.id };
  return { kind: "UNKNOWN", value: s };
}

/** Atomic one-time consumption of an exit permit token. A second scan is rejected and raises R36. */
export function consumeExitPermit(d: DB, tokenValue: string, actorId: string): ScanResult {
  const ep = d.exitPermits.find((e) => e.token === tokenValue);
  if (!ep) return { ok: false, kind: "EXIT_PERMIT", reason: "INVALID" };
  const visit = findVisit(d, ep.visitId)!;
  if (ep.status === "CONSUMED") {
    ep.scans.push({ at: nowIso(), by: actorId, result: "REJECTED_USED" });
    raiseAlert(d, "R36", { visitId: visit.id, laneCode: "E", detail: `${ep.serial} — اسکن مجدد`, observed: ep.consumedAt });
    audit(d, "exit.rejected_reuse", "ExitPermit", ep.id, { actorId });
    bump(d);
    return { ok: false, kind: "EXIT_PERMIT", reason: "USED", permit: ep, visit, usedAt: ep.consumedAt, usedBy: ep.consumedBy };
  }
  if (ep.status !== "APPROVED") {
    ep.scans.push({ at: nowIso(), by: actorId, result: "REJECTED_CANCELLED" });
    bump(d);
    return { ok: false, kind: "EXIT_PERMIT", reason: "CANCELLED", permit: ep, visit };
  }
  assertTransition(EXIT_PERMIT_TRANSITIONS, ep.status, "CONSUMED");
  ep.status = "CONSUMED";
  ep.consumedAt = nowIso();
  ep.consumedBy = actorId;
  ep.scans.push({ at: ep.consumedAt, by: actorId, result: "ACCEPTED" });
  audit(d, "exit.consumed", "ExitPermit", ep.id, { actorId, data: { serial: ep.serial } });
  log(d, "info", "GATE-E", `Exit QR ${ep.serial} accepted by ${actorId}`);
  // bring the vehicle to the exit lane if it is not there yet
  const l = lane(d, "E");
  if (!l.visitId) {
    d.live.queueGateOut = d.live.queueGateOut.filter((x) => x !== visit.id);
    l.visitId = visit.id;
    visit.laneCode = "E";
    l.phase = "QR_OK";
    l.phaseUntil = Date.now() + 1000 / d.live.speed;
  } else if (l.visitId === visit.id) {
    l.phase = "QR_OK";
    l.phaseUntil = Date.now() + 1000 / d.live.speed;
  }
  bump(d);
  return { ok: true, kind: "EXIT_PERMIT", permit: ep, visit };
}

export function scanAny(d: DB, raw: string, actorId: string): ScanResult {
  const p = parseScan(d, raw);
  if (p.kind === "EXIT_PERMIT") return consumeExitPermit(d, p.value, actorId);
  if (p.kind === "TICKET") {
    const tx = d.transactions.find((t) => t.verifyCode === p.value);
    if (!tx) return { ok: false, kind: "UNKNOWN", reason: "INVALID" };
    audit(d, "ticket.verified", "Transaction", tx.id, { actorId });
    if (tx.state === "VOIDED") return { ok: false, kind: "TICKET", reason: "VOIDED", tx };
    if (tx.state !== "APPROVED") return { ok: false, kind: "TICKET", reason: "NOT_APPROVED", tx };
    return { ok: true, kind: "TICKET", tx };
  }
  if (p.kind === "PERMIT") {
    const permit = findPermit(d, p.value)!;
    const res = permit.status === "ACTIVE" && new Date(permit.validTo) > new Date() ? null : permit.status !== "ACTIVE" ? `PERMIT_${permit.status}` : "PERMIT_EXPIRED";
    return res ? { ok: false, kind: "PERMIT", reason: res, permit } : { ok: true, kind: "PERMIT", permit };
  }
  return { ok: false, kind: "UNKNOWN", reason: "INVALID" };
}

export function voidTx(d: DB, txId: string, actorId: string, reason: string, signer: string) {
  const tx = findTx(d, txId);
  if (!tx) throw new OpError("TX_NOT_FOUND");
  if (!reason) throw new OpError("REASON_REQUIRED");
  if (!signer || signer === actorId) throw new OpError("SECOND_SIGNATURE_REQUIRED");
  assertTransition(TX_TRANSITIONS, tx.state, "VOIDED");
  const prev = tx.state;
  tx.state = "VOIDED";
  tx.version++;
  tx.revisions.push({ version: tx.version, at: nowIso(), by: actorId, reason: `${reason} (امضای دوم: ${signer})`, changes: { state: [prev, "VOIDED"] } });
  if (tx.permitId) ledger(d).release(tx.permitId, tx.id, actorId);
  enqueueOutbox(d, "ERP", "weigh-ticket.reversed", tx.id, JSON.stringify({ ticketNo: tx.ticketNo, reversal: true }));
  audit(d, "tx.voided", "Transaction", tx.id, { actorId, reason, data: { signer } });
  bump(d);
  return tx;
}

export function printTx(d: DB, txId: string, actorId: string, reason?: string) {
  const tx = findTx(d, txId);
  if (!tx) throw new OpError("TX_NOT_FOUND");
  if (tx.printCount > 0 && !reason) throw new OpError("REPRINT_REASON_REQUIRED");
  tx.printCount++;
  audit(d, tx.printCount > 1 ? "ticket.reprinted" : "ticket.printed", "Transaction", tx.id, { actorId, reason, data: { printCount: tx.printCount } });
  bump(d);
  return tx;
}

export function ackAlert(d: DB, alertId: string, status: T.AlertStatus, actorId: string, note?: string) {
  const a = d.alerts.find((x) => x.id === alertId);
  if (!a) throw new OpError("ALERT_NOT_FOUND");
  if (status === "RESOLVED" || status === "DISMISSED") {
    if (!note) throw new OpError("NOTE_REQUIRED");
    a.resolvedAt = nowIso();
    a.resolution = note;
  }
  if (status === "ACK" || status === "INVESTIGATING") {
    a.ackBy = actorId;
    a.ackAt = a.ackAt ?? nowIso();
    a.assignee = a.assignee ?? actorId;
  }
  a.status = status;
  audit(d, `alert.${status.toLowerCase()}`, "Alert", a.id, { actorId, reason: note });
  bump(d);
  return a;
}
