// Live hardware simulator: trucks, indicator, ANPR/RFID, position sensors, barriers, virtual operators.
import { sha256 } from "@/domain/audit";
import { misreadPlate, normalizePlate, randomPlate } from "@/domain/plate";
import { indicatorFrame } from "@/domain/weighing";
import type * as T from "@/domain/types";
import {
  admitToSite,
  applyGateDecision,
  calibrationValid,
  captureGateEvidence,
  captureWeigh,
  confirmBarrierOpen,
  consumeExitPermit,
  finalizeTx,
  findTx,
  findVehicle,
  findVisit,
  fuseIdentity,
  gateDecide,
  lane,
  registerGuest,
  releaseLane,
  requestBarrierOpen,
} from "./ops";
import { audit, bump, enqueueOutbox, log, nextId, nowIso, raiseAlert, shiftOf, token, type DB } from "./store";

const LOAD_POINTS = ["L-01", "L-02", "SH-01"];

interface VisitSim {
  targetFirstKg: number;
  targetSecondKg: number;
  loadingUntil?: number;
  heldSince?: number;
  awaitingDocsSince?: number;
  exitQrAt?: number;
  scanUntil?: number;
}
const gs = globalThis as unknown as { __tozinSimState?: Map<string, VisitSim>; __tozinLaneTargets?: Map<string, number>; __tozinSlowTick?: number };
const simState = (gs.__tozinSimState ??= new Map<string, VisitSim>());
const laneTargets = (gs.__tozinLaneTargets ??= new Map<string, number>());

const rnd = Math.random;
const between = (a: number, b: number) => a + rnd() * (b - a);
const dur = (d: DB, seconds: number) => Date.now() + (seconds * 1000) / d.live.speed;

export function initLive(d: DB) {
  if (d.live.lanes.length) return;
  const mk = (code: T.Lane["code"], kind: T.LaneKind): T.LaneLive => ({
    code,
    kind,
    barrier: "CLOSED",
    barrierAck: true,
    light: kind === "SCALE" ? "GREEN" : "RED",
    phase: "IDLE",
    ...(kind === "SCALE"
      ? { weightKg: 0, stable: true, motion: false, zero: true, lastReadingAt: nowIso(), weightHistory: Array(60).fill(0), positionOk: false, beams: [false, false, false, false] as [boolean, boolean, boolean, boolean], indicatorOnline: true, rawFrame: indicatorFrame(0, true), truckOffsetPct: 0 }
      : {}),
  });
  d.live.lanes = [mk("A", "GATE_IN"), mk("B", "SCALE"), mk("C", "SCALE"), mk("D", "SCAN"), mk("E", "GATE_OUT")];
  log(d, "info", "SIM", "Simulator started — virtual devices online");
  // warm start: a few trucks already inside the site
  for (let i = 0; i < 3; i++) {
    const v = spawnArrival(d, undefined, true);
    if (!v) continue;
    d.live.queueGateIn = d.live.queueGateIn.filter((x) => x !== v.id);
    const vh = findVehicle(d, v.vehicleId)!;
    v.identity = { anpr: { plate: vh.plateNormalized, confidence: 0.97, readId: "-" }, rfid: vh.rfidEpc ? { epc: vh.rfidEpc, rssi: -51, readId: "-" } : undefined, match: vh.rfidEpc ? "MATCH" : "PLATE_ONLY" };
    captureGateEvidence(d, v, "A");
    admitToSite(d, v);
    d.live.queueB = d.live.queueB.filter((x) => x !== v.id);
    if (i < 2) {
      // already weighed once, loading now
      const vs = simState.get(v.id)!;
      fakeFirstWeigh(d, v, vs.targetFirstKg);
      v.prevState = "ON_SCALE_1";
      v.state = "LOADING";
      vs.loadingUntil = dur(d, 15 + i * 25);
      v.loadingEquipmentId = i ? "EQ-L2" : "EQ-S1";
    } else {
      d.live.queueB.push(v.id);
    }
  }
  d.live.nextArrivalAt = Date.now() + 4000;
}

function fakeFirstWeigh(d: DB, v: T.Visit, kg: number) {
  const l = lane(d, "B");
  const prev = { visitId: l.visitId, weightKg: l.weightKg, stable: l.stable, positionOk: l.positionOk, lastReadingAt: l.lastReadingAt, rawFrame: l.rawFrame, indicatorOnline: l.indicatorOnline, phase: l.phase, phaseUntil: l.phaseUntil };
  Object.assign(l, { visitId: v.id, weightKg: kg, stable: true, positionOk: true, lastReadingAt: nowIso(), rawFrame: indicatorFrame(kg, true), indicatorOnline: true });
  v.laneCode = "B";
  try {
    captureWeigh(d, "B", "U-OP1");
  } finally {
    Object.assign(l, prev);
    v.laneCode = undefined;
  }
}

function onSiteVehicleIds(d: DB) {
  return new Set(d.visits.filter((v) => !["EXITED", "REJECTED", "CANCELLED", "EXPECTED"].includes(v.state)).map((v) => v.vehicleId));
}

export function spawnArrival(d: DB, scenario?: string, silent = false): T.Visit | undefined {
  const busy = onSiteVehicleIds(d);
  const now = new Date();
  let vehicle: T.Vehicle | undefined;
  if (scenario === "S-UNKNOWN") {
    const plate = randomPlate(rnd);
    vehicle = { id: nextId(d, "VH"), plate, plateNormalized: normalizePlate(plate), type: "TRAILER", axles: 5, ratedPayloadKg: 30000, maxGvwKg: 48000, storedTareKg: undefined, carrierId: "CR-3", insuranceUntil: new Date(Date.now() + 90 * 864e5).toISOString(), inspectionUntil: new Date(Date.now() + 90 * 864e5).toISOString(), status: "GUEST", internal: false, color: "#868e96" };
    d.vehicles.push(vehicle);
  } else {
    const pool = d.vehicles.filter(
      (v) => !v.internal && v.status === "ACTIVE" && !busy.has(v.id) && new Date(v.insuranceUntil) > now && d.drivers.some((x) => x.carrierId === v.carrierId && x.status === "ACTIVE" && new Date(x.licenseUntil) > now),
    );
    vehicle = pool[Math.floor(rnd() * pool.length)];
  }
  if (!vehicle) return;
  const driver = d.drivers.find((x) => x.carrierId === vehicle!.carrierId && x.status === "ACTIVE" && new Date(x.licenseUntil) > now) ?? d.drivers[0];
  const operation: T.Operation = scenario === "S-INBOUND" ? "RECEIVE" : !scenario && rnd() < 0.08 ? "RECEIVE" : "DISPATCH";
  let permit: T.Permit | undefined;
  if (scenario === "S-PERMIT-EXP") permit = d.permits.find((p) => p.status === "EXPIRED");
  else if (scenario === "S-OVERDRAW") {
    const base = d.permits.find((p) => p.type === "SALE" && p.status === "ACTIVE")!;
    permit = { ...base, id: nextId(d, "PM"), permitNo: `SO-DEMO-${String(d.counters.PM).slice(-3)}`, allowedKg: 6000, consumedKg: 0, reservedKg: 0, tripsUsed: 0, validFrom: new Date(Date.now() - 864e5).toISOString() };
    d.permits.push(permit);
  } else {
    const pool = d.permits.filter((p) => p.status === "ACTIVE" && new Date(p.validTo) > now && (operation === "RECEIVE" ? p.type === "PURCHASE" : p.type === "SALE" || p.type === "HAUL") && p.allowedKg - p.consumedKg > 60000);
    permit = pool[Math.floor(rnd() * pool.length)];
  }
  d.counters.queueNo = ((d.counters.queueNo ?? 0) % 99) + 1;
  const tare = vehicle.storedTareKg ? vehicle.storedTareKg + Math.round((rnd() - 0.5) * 300 / 20) * 20 : 15800;
  let net = Math.round(between(vehicle.ratedPayloadKg * 0.75, vehicle.ratedPayloadKg * 0.98) / 20) * 20;
  if (scenario === "S-OVERWEIGHT") net = Math.round((vehicle.maxGvwKg - tare + between(1800, 4200)) / 20) * 20;
  const gross = tare + net;
  const v: T.Visit = {
    id: nextId(d, "VS"),
    siteId: "S1",
    vehicleId: vehicle.id,
    driverId: driver.id,
    permitId: permit?.id,
    state: "ARRIVED",
    arrivedAt: nowIso(),
    queueNo: d.counters.queueNo,
    driverToken: token(8),
    identity: { match: "UNKNOWN" },
    transactionIds: [],
    shiftCode: shiftOf(now),
    internal: false,
    operation,
    holdReasons: [],
    scenario,
  };
  d.visits.push(v);
  simState.set(v.id, { targetFirstKg: operation === "RECEIVE" ? gross : tare, targetSecondKg: operation === "RECEIVE" ? tare : gross });
  d.live.queueGateIn.push(v.id);
  if (!silent) {
    log(d, "info", "ROAD", `Truck ${vehicle.plateNormalized} approaching entry gate${scenario ? ` [${scenario}]` : ""}`);
    audit(d, "visit.arrived", "Visit", v.id, { actorType: "DEVICE", actorId: "LOOP-A", data: { plate: vehicle.plateNormalized, scenario } });
  }
  bump(d);
  return v;
}

// ---------------- Lane processors ----------------

function processGateIn(d: DB, now: number) {
  const l = lane(d, "A");
  if (!l.visitId) {
    const next = d.live.queueGateIn.shift();
    if (!next) return;
    const v = findVisit(d, next);
    if (!v) return;
    l.visitId = v.id;
    v.laneCode = "A";
    l.phase = "ARRIVED";
    l.phaseUntil = dur(d, 2);
    l.light = "RED";
    l.decision = undefined;
    l.trace = undefined;
    d.gateEvents.push({ id: nextId(d, "GE"), visitId: v.id, laneCode: "A", type: "ARRIVE", at: nowIso() });
    bump(d);
    return;
  }
  const v = findVisit(d, l.visitId);
  if (!v) return releaseLane(d, "A");
  if ((l.phaseUntil ?? 0) > now) return;
  const vehicle = findVehicle(d, v.vehicleId)!;
  switch (l.phase) {
    case "ARRIVED": {
      // ANPR front + rear, RFID, UVSS, evidence
      const lowConf = v.scenario === "S-LOWCONF";
      const conf = lowConf ? 0.58 : Number(between(0.86, 0.995).toFixed(3));
      const plate = lowConf && rnd() < 0.5 ? normalizePlate(misreadPlate(vehicle.plate, rnd)) : vehicle.plateNormalized;
      const pr: T.PlateRead = { id: nextId(d, "PR"), cameraId: "CAM-A-FRONT", visitId: v.id, plateRaw: plate, plateNormalized: plate, confidence: conf, bbox: [0.42, 0.62, 0.16, 0.06], modelVersion: "anpr-ir-2.4.1", capturedAt: nowIso(), review: "AUTO" };
      const prRear: T.PlateRead = { ...pr, id: nextId(d, "PR"), cameraId: "CAM-A-REAR", confidence: Number(between(0.8, 0.97).toFixed(3)) };
      d.plateReads.push(pr, prRear);
      v.identity.anpr = { plate, confidence: conf, readId: pr.id };
      v.identity.anprRear = { plate, confidence: prRear.confidence, readId: prRear.id };
      if (!lowConf && vehicle.rfidEpc) {
        let epc = vehicle.rfidEpc;
        if (v.scenario === "S-MISMATCH") epc = d.vehicles.find((x) => x.id !== vehicle.id && x.rfidEpc && !x.internal)!.rfidEpc!;
        const rf: T.RfidRead = { id: nextId(d, "RF"), readerId: "RFID-A", epc, rssi: Number(between(-68, -42).toFixed(1)), antenna: 1, readAt: nowIso(), vehicleId: d.vehicles.find((x) => x.rfidEpc === epc)?.id };
        d.rfidReads.push(rf);
        v.identity.rfid = { epc, rssi: rf.rssi, readId: rf.id };
      }
      captureGateEvidence(d, v, "A");
      const uv: T.UvssScan = {
        id: nextId(d, "UV"),
        visitId: v.id,
        vehicleId: vehicle.id,
        capturedAt: nowIso(),
        referenceMatchPct: v.scenario === "S-UVSS" ? 71.4 : Number(between(91, 99.5).toFixed(1)),
        status: v.scenario === "S-UVSS" ? "SUSPECT" : "CLEAR",
        anomalies:
          v.scenario === "S-UVSS"
            ? [
                { x: 0.38, y: 0.46, w: 0.12, h: 0.1, label: "جسم خارجی بین شاسی", labelEn: "Foreign object between frame rails", score: 0.86 },
                { x: 0.7, y: 0.3, w: 0.08, h: 0.07, label: "لکه نشت روغن", labelEn: "Oil leak stain", score: 0.62 },
              ]
            : [],
        seed: Math.floor(rnd() * 1e9),
      };
      d.uvssScans.push(uv);
      v.uvssScanId = uv.id;
      log(d, "device", "ANPR-A", `plate ${plate} conf ${(conf * 100).toFixed(1)}%`);
      if (v.identity.rfid) log(d, "device", "RFID-A", `EPC ${v.identity.rfid.epc} RSSI ${v.identity.rfid.rssi} dBm`);
      log(d, "device", "UVSS-A", `under-vehicle scan match ${uv.referenceMatchPct}%`);
      v.prevState = v.state;
      v.state = "IDENTIFIED";
      l.phase = "READING";
      l.phaseUntil = dur(d, 2);
      bump(d);
      return;
    }
    case "READING": {
      fuseIdentity(d, v);
      const res = applyGateDecision(d, v, "A");
      if (v.identity.match === "MISMATCH") raiseAlert(d, "R05", { visitId: v.id, laneCode: "A", detail: `ANPR ${v.identity.anpr?.plate} ≠ RFID ${v.identity.rfid?.epc}` });
      if (v.identity.anpr && v.identity.anpr.confidence < 0.85) raiseAlert(d, "R06", { visitId: v.id, laneCode: "A", observed: `${(v.identity.anpr.confidence * 100).toFixed(0)}%`, threshold: "85%" });
      if (res.code === "UNKNOWN_VEHICLE") raiseAlert(d, "R07", { visitId: v.id, laneCode: "A", detail: v.identity.anpr?.plate });
      if (res.code === "ANTI_PASSBACK") raiseAlert(d, "R08", { visitId: v.id, laneCode: "A" });
      if (res.code.startsWith("PERMIT")) raiseAlert(d, "R11", { visitId: v.id, laneCode: "A", detail: res.code });
      if (v.uvssScanId && d.uvssScans.find((u) => u.id === v.uvssScanId)?.status === "SUSPECT") raiseAlert(d, "R35", { visitId: v.id, laneCode: "A", detail: "ناهنجاری زیر شاسی — بازرسی حراست" });
      if (res.decision === "PASS") {
        requestBarrierOpen(d, "A", v.id);
        l.phase = "OPENING";
        l.phaseUntil = dur(d, 1.2);
      } else {
        v.prevState = v.state;
        v.state = "HOLD";
        v.holdReasons = [res.code];
        simState.get(v.id)!.heldSince = now;
        l.phase = "HELD";
        l.phaseUntil = dur(d, 5);
        l.light = "RED";
      }
      bump(d);
      return;
    }
    case "OPENING":
      confirmBarrierOpen(d, "A", v.id);
      l.phase = "PASSING";
      l.phaseUntil = dur(d, 3);
      bump(d);
      return;
    case "PASSING":
      l.barrier = "CLOSED";
      l.light = "RED";
      admitToSite(d, v);
      releaseLane(d, "A", v.id);
      bump(d);
      return;
    case "HELD":
      // vehicle is moved to the inspection bay; lane frees, visit stays on HOLD for the guard
      releaseLane(d, "A", v.id);
      bump(d);
      return;
  }
}

function scaleLaneCode(d: DB, which: "B" | "C"): "B" | "C" {
  if (which === "C" && lane(d, "C").locked) return "B";
  return which;
}

function processScale(d: DB, code: "B" | "C", now: number) {
  const l = lane(d, code);
  const scaleId = code === "B" ? "SC-1" : "SC-2";
  const scale = d.scales.find((s) => s.id === scaleId)!;
  const ind = d.devices.find((x) => x.id === (code === "B" ? "IND-1" : "IND-2"))!;
  l.indicatorOnline = ind.status !== "OFFLINE";
  l.locked = !calibrationValid(d, scaleId) || scale.status === "LOCKED";
  if (l.locked && scale.status !== "LOCKED") {
    scale.status = "LOCKED";
    raiseAlert(d, "R26", { deviceId: ind.id, laneCode: code, detail: `${scale.name} — قفل توزین تجاری` });
  }

  // pick next truck
  if (!l.visitId && !l.locked && l.indicatorOnline) {
    const q = code === "B" ? d.live.queueB : d.live.queueC;
    let nextId_ = q.shift();
    if (!nextId_ && code === "B" && lane(d, "C").locked) nextId_ = d.live.queueC.shift();
    if (nextId_) {
      const v = findVisit(d, nextId_);
      if (v) {
        l.visitId = v.id;
        v.laneCode = code;
        v.calledAt = v.calledAt ?? nowIso();
        v.prevState = v.state;
        const hasFirst = v.transactionIds.some((id) => findTx(d, id)?.firstWeighId);
        v.state = hasFirst ? "ON_SCALE_2" : "ON_SCALE_1";
        const vsCall = simState.get(v.id);
        laneTargets.set(code, vsCall ? (hasFirst ? vsCall.targetSecondKg : vsCall.targetFirstKg) : 0);
        l.phase = "APPROACH";
        l.phaseUntil = dur(d, 3);
        l.light = "YELLOW";
        log(d, "info", `SCALE-${code}`, `Calling ${findVehicle(d, v.vehicleId)?.plateNormalized} (#${v.queueNo}) to ${scale.nameEn}`);
        bump(d);
      }
    }
  }

  const v = findVisit(d, l.visitId);
  const target = v ? laneTargets.get(code) ?? 0 : 0;
  let w = l.weightKg ?? 0;
  let stable = true;
  const t = (l.phaseUntil ?? now) - now;

  switch (v ? l.phase : "IDLE") {
    case "APPROACH": {
      const k = Math.min(1, Math.max(0, 1 - t / ((3000 / d.live.speed) || 1)));
      w = target * (0.15 + 0.6 * k) + (rnd() - 0.5) * 400;
      stable = false;
      l.positionOk = false;
      l.beams = [true, k > 0.5, k > 0.8, false];
      l.truckOffsetPct = -30 + 25 * k;
      if (t <= 0) {
        const bad = v!.scenario === "S-POSITION" || rnd() < 0.05;
        l.phase = bad ? "POSITION_BAD" : "SETTLING";
        l.phaseUntil = dur(d, bad ? (v!.scenario === "S-POSITION" ? 12 : 5) : v!.scenario === "S-UNSTABLE" ? 22 : 4);
        if (bad) {
          raiseAlert(d, "R03", { visitId: v!.id, laneCode: code, detail: "چرخ عقب خارج از ناحیه باسکول" });
          log(d, "warn", `POS-${code}`, "Rear IR beam clear — vehicle not fully on deck");
        }
      }
      break;
    }
    case "POSITION_BAD":
      w = target * 0.82 + (rnd() - 0.5) * 300;
      stable = false;
      l.positionOk = false;
      l.beams = [true, true, true, false];
      l.truckOffsetPct = -9;
      if (t <= 0) {
        l.phase = "SETTLING";
        l.phaseUntil = dur(d, v!.scenario === "S-UNSTABLE" ? 22 : 4);
        for (const a of d.alerts.filter((x) => x.visitId === v!.id && x.ruleCode === "R03" && x.status === "OPEN")) {
          a.status = "RESOLVED";
          a.resolvedAt = nowIso();
          a.resolution = "راننده خودرو را جابه‌جا کرد — موقعیت صحیح";
        }
      }
      break;
    case "SETTLING": {
      const amp = v!.scenario === "S-UNSTABLE" ? 260 : 900 * Math.max(0.05, t / (4000 / d.live.speed));
      w = target + amp * Math.sin(now / 180) + (rnd() - 0.5) * amp * 0.3;
      stable = false;
      l.positionOk = true;
      l.beams = [true, true, true, true];
      l.truckOffsetPct = 0;
      if (t <= 0) {
        l.phase = "STABLE";
        l.phaseUntil = dur(d, 2.5);
      }
      break;
    }
    case "STABLE":
      w = target;
      stable = true;
      l.positionOk = true;
      l.beams = [true, true, true, true];
      if (t <= 0 && l.stable && d.live.mode === "AUTO" && l.indicatorOnline) {
        try {
          captureWeigh(d, code, code === "B" ? "U-OP1" : "U-OP2");
          onCaptured(d, v!, code);
        } catch (e) {
          log(d, "warn", `SCALE-${code}`, `Auto capture blocked: ${(e as Error).message}`);
          l.phaseUntil = dur(d, 3);
        }
      }
      break;
    case "CAPTURED":
      w = target;
      stable = true;
      l.light = "GREEN";
      if (l.barrier === "CLOSED") {
        requestBarrierOpen(d, code, v!.id);
        confirmBarrierOpen(d, code, v!.id);
      }
      if (t <= 0) {
        l.phase = "LEAVING";
        l.phaseUntil = dur(d, 3);
      }
      break;
    case "LEAVING": {
      const k = Math.max(0, t / (3000 / d.live.speed));
      w = target * k * 0.8;
      stable = false;
      l.beams = [false, k > 0.6, k > 0.3, k > 0.1];
      l.truckOffsetPct = 30 * (1 - k);
      if (t <= 0) {
        l.barrier = "CLOSED";
        l.light = "GREEN";
        afterLeavingScale(d, v!, code);
        releaseLane(d, code, v!.id);
        w = 0;
      }
      break;
    }
    default: {
      // empty deck
      w = (rnd() - 0.5) * 30;
      stable = true;
      l.positionOk = false;
      l.beams = [false, false, false, false];
      l.light = l.locked ? "RED" : "GREEN";
      l.phase = "IDLE";
      if (Math.abs(w) < 20) w = 0;
    }
  }
  if (l.indicatorOnline) {
    const div = scale.divisionKg;
    const rounded = Math.round(w / div) * div;
    l.weightKg = rounded;
    l.stable = stable;
    l.motion = !stable;
    l.zero = rounded === 0;
    l.lastReadingAt = nowIso();
    l.rawFrame = indicatorFrame(rounded, stable);
    l.weightHistory = [...(l.weightHistory ?? []).slice(-59), rounded];
  }
}

function onCaptured(d: DB, v: T.Visit, code: "B" | "C") {
  void code;
  const tx = v.transactionIds.map((id) => findTx(d, id)).find((t) => t && t.state !== "VOIDED");
  if (!tx) return;
  if (tx.state === "RECONCILED" && d.live.mode === "AUTO") {
    finalizeTx(d, tx.id, "U-OP2");
  }
}

function afterLeavingScale(d: DB, v: T.Visit, code: "B" | "C") {
  const vs = simState.get(v.id);
  const tx = v.transactionIds.map((id) => findTx(d, id)).find((t) => t && t.state !== "VOIDED");
  if (!tx) {
    // left without capture (manual mode, operator did nothing) → back to queue
    v.prevState = v.state;
    v.state = "IN_SITE";
    (code === "B" ? d.live.queueB : d.live.queueC).push(v.id);
    return;
  }
  if (tx.state === "FIRST_CAPTURED") {
    v.state = "LOADING";
    v.loadingEquipmentId = ["EQ-L1", "EQ-L2", "EQ-S1"][Math.floor(rnd() * 3)];
    if (vs) vs.loadingUntil = dur(d, between(25, 45));
    log(d, "info", "YARD", `${findVehicle(d, v.vehicleId)?.plateNormalized} → ${v.operation === "RECEIVE" ? "unloading" : "loading"} at ${d.equipment.find((e) => e.id === v.loadingEquipmentId)?.code}`);
  } else if (v.state === "READY_TO_EXIT") {
    if (!d.live.queueGateOut.includes(v.id)) d.live.queueGateOut.push(v.id);
  } else if (vs) {
    vs.awaitingDocsSince = Date.now();
  }
  bump(d);
}

function processYard(d: DB, now: number) {
  for (const v of d.visits) {
    if (v.state !== "LOADING" || v.laneCode) continue;
    const vs = simState.get(v.id);
    if (!vs) continue;
    if (!vs.loadingUntil) vs.loadingUntil = dur(d, between(25, 45));
    if (vs.loadingUntil > now) continue;
    const tx = v.transactionIds.map((id) => findTx(d, id)).find((t) => t && t.state === "FIRST_CAPTURED");
    const vehicle = findVehicle(d, v.vehicleId)!;
    if (tx && v.operation !== "RECEIVE") {
      const eq = d.equipment.find((e) => e.id === v.loadingEquipmentId) ?? d.equipment[0];
      const net = vs.targetSecondKg - vs.targetFirstKg;
      const n = Math.max(2, Math.round(net / eq.ratedBucketKg));
      const buckets = Array.from({ length: n }, () => Math.round((net / n) * between(0.9, 1.1)));
      const pe: T.PayloadEvent = { id: nextId(d, "PE"), equipmentId: eq.id, visitId: v.id, vehicleId: vehicle.id, buckets, payloadKg: buckets.reduce((a, b) => a + b, 0), targetKg: net, at: nowIso() };
      d.payloadEvents.push(pe);
      tx.payloadKg = pe.payloadKg;
      // LiDAR gantry scan on the way to scale 2
      const mat = d.materials.find((m) => m.id === tx.materialId)!;
      const vol = (net / mat.densityKgM3) * between(0.95, 1.06);
      const off = v.scenario === "S-OVERWEIGHT" ? 18.5 : Math.abs((rnd() - 0.5) * 12);
      const ls: T.LidarScan = { id: nextId(d, "LS"), visitId: v.id, vehicleId: vehicle.id, transactionId: tx.id, kind: "LOADED", volumeM3: Number(vol.toFixed(2)), quality: Number(between(0.84, 0.99).toFixed(2)), offCenterPct: Number(off.toFixed(1)), peakHeightM: Number(between(3.6, 4.4).toFixed(2)), carrybackM3: 0, covered: rnd() < 0.6, capturedAt: nowIso(), seed: Math.floor(rnd() * 1e9) };
      d.lidarScans.push(ls);
      tx.lidarScanIds.push(ls.id);
      tx.volumeM3 = ls.volumeM3;
      tx.estimatedMassKg = Math.round(ls.volumeM3 * mat.densityKgM3);
      if (off > 15) raiseAlert(d, "R32", { visitId: v.id, laneCode: "D", observed: `${off.toFixed(1)}%`, threshold: "15%" });
      const dl = lane(d, "D");
      dl.visitId = v.id;
      dl.phase = "SCANNING";
      dl.phaseUntil = dur(d, 4);
      log(d, "device", "LIDAR-D", `scan ${vehicle.plateNormalized}: ${ls.volumeM3} m³, quality ${(ls.quality * 100).toFixed(0)}%`);
    }
    v.prevState = "LOADING";
    v.state = "IN_SITE";
    v.loadingEquipmentId = v.loadingEquipmentId ?? undefined;
    const target = scaleLaneCode(d, "C");
    (target === "B" ? d.live.queueB : d.live.queueC).push(v.id);
    bump(d);
  }
  const dl = lane(d, "D");
  if (dl.visitId && (dl.phaseUntil ?? 0) < now) {
    dl.visitId = undefined;
    dl.phase = "IDLE";
  }
}

function processGateOut(d: DB, now: number) {
  const l = lane(d, "E");
  if (!l.visitId) {
    const nid = d.live.queueGateOut.shift();
    if (!nid) return;
    const v = findVisit(d, nid);
    if (!v) return;
    l.visitId = v.id;
    v.laneCode = "E";
    l.phase = "ARRIVED";
    l.phaseUntil = dur(d, 2);
    l.light = "RED";
    l.decision = undefined;
    l.trace = undefined;
    d.gateEvents.push({ id: nextId(d, "GE"), visitId: v.id, laneCode: "E", type: "ARRIVE", at: nowIso() });
    bump(d);
    return;
  }
  const v = findVisit(d, l.visitId);
  if (!v) return releaseLane(d, "E");
  if ((l.phaseUntil ?? 0) > now) return;
  const vehicle = findVehicle(d, v.vehicleId)!;
  switch (l.phase) {
    case "ARRIVED": {
      const pr: T.PlateRead = { id: nextId(d, "PR"), cameraId: "CAM-E-FRONT", visitId: v.id, plateRaw: vehicle.plateNormalized, plateNormalized: vehicle.plateNormalized, confidence: Number(between(0.88, 0.99).toFixed(3)), bbox: [0.42, 0.62, 0.16, 0.06], modelVersion: "anpr-ir-2.4.1", capturedAt: nowIso(), review: "AUTO" };
      d.plateReads.push(pr);
      captureGateEvidence(d, v, "E");
      log(d, "device", "ANPR-E", `plate ${vehicle.plateNormalized} at exit — waiting for exit QR`);
      l.phase = "AWAIT_QR";
      l.phaseUntil = dur(d, 3);
      bump(d);
      return;
    }
    case "AWAIT_QR": {
      const ep = d.exitPermits.find((e) => e.id === v.exitPermitId);
      if (ep?.status === "CONSUMED") {
        l.phase = "QR_OK";
        return;
      }
      if (d.live.mode === "AUTO" && ep) consumeExitPermit(d, ep.token, "U-GD2");
      return;
    }
    case "QR_OK": {
      const res = applyGateDecision(d, v, "E", "U-GD2");
      if (res.decision === "PASS") {
        requestBarrierOpen(d, "E", v.id, "U-GD2");
        l.phase = "OPENING";
        l.phaseUntil = dur(d, 1.2);
      } else {
        if (res.code === "UVSS_SUSPECT") raiseAlert(d, "R35", { visitId: v.id, laneCode: "E" });
        v.prevState = v.state;
        v.state = "HOLD";
        v.holdReasons = [res.code];
        l.phase = "HELD_OUT";
        l.phaseUntil = dur(d, 6);
      }
      bump(d);
      return;
    }
    case "OPENING":
      confirmBarrierOpen(d, "E", v.id);
      l.phase = "PASSING";
      l.phaseUntil = dur(d, 3);
      if (v.scenario === "S-TAILGATE") {
        d.gateEvents.push({ id: nextId(d, "GE"), visitId: v.id, laneCode: "E", type: "TAILGATE", at: nowIso() });
        raiseAlert(d, "R09", { visitId: v.id, laneCode: "E", detail: "دو خودرو با یک بار باز شدن راهبند عبور کردند — آژیر فعال شد" });
        log(d, "error", "SIREN-E", "Tailgating detected — siren ON");
      }
      bump(d);
      return;
    case "PASSING":
      l.barrier = "CLOSED";
      l.light = "RED";
      v.prevState = v.state;
      v.state = "EXITED";
      v.exitedAt = nowIso();
      d.gateEvents.push({ id: nextId(d, "GE"), visitId: v.id, laneCode: "E", type: "EXIT", at: nowIso() });
      audit(d, "visit.exited", "Visit", v.id, { actorType: "DEVICE", actorId: "LOOP-E" });
      log(d, "info", "GATE-E", `${vehicle.plateNormalized} exited site`);
      releaseLane(d, "E", v.id);
      if (v.scenario === "S-QR-REUSE") {
        const ep = d.exitPermits.find((e) => e.id === v.exitPermitId);
        if (ep) setTimeout(() => consumeExitPermit(d, ep.token, "U-GD1"), 4000 / d.live.speed);
      }
      bump(d);
      return;
    case "HELD_OUT":
      releaseLane(d, "E", v.id);
      bump(d);
      return;
  }
}

/** Virtual supervisors/guards in AUTO mode so the demo never deadlocks. */
function virtualActors(d: DB, now: number) {
  if (d.live.mode !== "AUTO") return;
  for (const v of d.visits) {
    if (v.state !== "HOLD") continue;
    const vs = simState.get(v.id);
    if (!vs) continue;
    vs.heldSince = vs.heldSince ?? now;
    const age = (now - vs.heldSince) * d.live.speed;
    const reason = v.holdReasons[0];
    try {
      if (["LOW_ANPR_CONFIDENCE"].includes(reason) && age > 35_000) gateDecide(d, v.id, true, "U-GD1", "پلاک توسط نگهبان با تصویر تأیید شد");
      else if (reason === "UNKNOWN_VEHICLE" && age > 40_000) registerGuest(d, v.id, "U-GD1", "ثبت مهمان با بارنامه کاغذی");
      else if ((reason === "IDENTITY_MISMATCH" || reason?.startsWith("PERMIT") || reason === "BLACKLIST" || reason === "DOCUMENT_EXPIRED" || reason === "ANTI_PASSBACK") && age > 90_000) gateDecide(d, v.id, false, "U-GD1", "عدم تطابق — ارجاع به حراست");
      else if (["R14", "R12", "R40", "R16"].some((r) => v.holdReasons.includes(r)) && age > 45_000) {
        const tx = v.transactionIds.map((id) => findTx(d, id)).find((t) => t?.state === "EXCEPTION");
        if (tx) finalizeTx(d, tx.id, "U-OP2", { reason: v.holdReasons.includes("R14") ? "تخلیه مازاد و تأیید سرپرست" : v.holdReasons.includes("R40") ? "نتیجه آزمایشگاه: مطابق" : "تأیید سرپرست شیفت", signer: "U-MGR" });
      } else if (reason === "UVSS_SUSPECT" && age > 40_000) {
        const uv = d.uvssScans.find((u) => u.id === v.uvssScanId);
        if (uv) uv.status = "CLEARED_BY_GUARD";
        v.state = "READY_TO_EXIT";
        v.holdReasons = [];
        d.live.queueGateOut.push(v.id);
        for (const a of d.alerts.filter((x) => x.visitId === v.id && x.ruleCode === "R35" && x.status === "OPEN")) {
          a.status = "RESOLVED";
          a.resolution = "بازرسی فیزیکی: کیسه ابزار راننده — مجاز";
          a.resolvedAt = nowIso();
        }
        audit(d, "uvss.cleared", "UvssScan", uv?.id ?? "-", { actorId: "U-GD1" });
      }
    } catch (e) {
      log(d, "warn", "SIM", `virtual actor: ${(e as Error).message}`);
    }
  }
  // finalize reconciled transactions waiting for docs
  for (const tx of d.transactions) {
    if (tx.state === "RECONCILED") {
      const v = findVisit(d, tx.visitId);
      if (v && !v.laneCode) {
        try {
          finalizeTx(d, tx.id, "U-OP2");
        } catch {
          /* ignore */
        }
      }
    }
  }
}

function processOutbox(d: DB, now: number) {
  if (!d.live.wanOnline) return;
  for (const m of d.outbox) {
    if (m.status === "PENDING" && now - new Date(m.createdAt).getTime() > 1500) {
      m.attempts++;
      if (m.channel === "ERP" && rnd() < 0.04) {
        m.status = "FAILED";
        m.lastError = "HTTP 503 — ERP gateway unavailable";
        m.nextRetryAt = new Date(now + 15_000).toISOString();
        const tx = findTx(d, m.entityId);
        if (tx) tx.erpStatus = "FAILED";
      } else {
        m.status = "SENT";
        const tx = m.channel === "ERP" ? findTx(d, m.entityId) : undefined;
        if (tx) tx.erpStatus = "SENT";
      }
    } else if (m.status === "FAILED" && m.nextRetryAt && new Date(m.nextRetryAt).getTime() < now && m.attempts < 5) {
      m.attempts++;
      if (rnd() < 0.6) {
        m.status = "SENT";
        m.lastError = undefined;
        const tx = findTx(d, m.entityId);
        if (tx) tx.erpStatus = "SENT";
      } else {
        m.nextRetryAt = new Date(now + 15_000 * m.attempts).toISOString();
        if (m.attempts >= 5) m.status = "DEAD";
      }
    }
  }
}

function slowChecks(d: DB, now: number) {
  // heartbeats
  for (const dev of d.devices) {
    if (dev.status !== "OFFLINE") dev.lastHeartbeatAt = nowIso();
  }
  if (rnd() < 0.02) {
    const cams = d.devices.filter((x) => x.type.startsWith("CAMERA") && x.status === "ONLINE");
    const c = cams[Math.floor(rnd() * cams.length)];
    if (c) {
      c.status = "DEGRADED";
      log(d, "warn", c.id, "frame rate degraded (dust on lens?)");
      setTimeout(() => {
        if (c.status === "DEGRADED") c.status = "ONLINE";
      }, 30_000);
    }
  }
  // long stay
  const limit = (d.rules.find((r) => r.code === "R29")?.params.limitMin ?? 120) * 60000;
  for (const v of d.visits) {
    if (["EXITED", "REJECTED", "CANCELLED", "EXPECTED"].includes(v.state)) continue;
    if (now - new Date(v.arrivedAt).getTime() > limit) raiseAlert(d, "R29", { visitId: v.id });
  }
  const maxQ = d.rules.find((r) => r.code === "R30")?.params.maxQueue ?? 8;
  if (d.live.queueB.length > maxQ) raiseAlert(d, "R30", { laneCode: "B", observed: String(d.live.queueB.length), threshold: String(maxQ) });
  // WAN recovery
  if (!d.live.wanOnline && d.live.wanOfflineUntil && now > d.live.wanOfflineUntil) {
    d.live.wanOnline = true;
    d.live.wanOfflineUntil = undefined;
    const pending = d.outbox.filter((m) => m.status === "PENDING").length;
    log(d, "info", "EDGE-1", `WAN restored — syncing ${pending} queued events (idempotent replay)`);
    audit(d, "edge.sync", "Device", "EDGE-1", { actorType: "DEVICE", actorId: "EDGE-1", data: { pending } });
  }
  // QC lab auto-approves pending samples in AUTO mode
  if (d.live.mode === "AUTO") {
    for (const tx of d.transactions) {
      if (tx.qcStatus === "PENDING" && now - new Date(tx.createdAt).getTime() > 60_000 / d.live.speed) tx.qcStatus = "APPROVED";
    }
  }
}

export function tick(d: DB) {
  const now = Date.now();
  initLive(d);
  if (now >= d.live.nextArrivalAt) {
    const onSite = d.visits.filter((v) => !["EXITED", "REJECTED", "CANCELLED", "EXPECTED"].includes(v.state)).length;
    if (onSite < 11 || d.live.pendingScenarios.length) spawnArrival(d, d.live.pendingScenarios.shift());
    d.live.nextArrivalAt = now + between(40, 75) * 1000 / d.live.speed;
  }
  processGateIn(d, now);
  processScale(d, "B", now);
  processScale(d, "C", now);
  processYard(d, now);
  processGateOut(d, now);
  virtualActors(d, now);
  processOutbox(d, now);
  if (now - (gs.__tozinSlowTick ?? 0) > 5000) {
    gs.__tozinSlowTick = now;
    slowChecks(d, now);
  }
}

export function startSimulation(get: () => DB) {
  initLive(get());
  return setInterval(() => {
    try {
      tick(get());
    } catch (e) {
      console.error("[sim]", e);
    }
  }, 1000);
}

// ---------------- Scenario control ----------------

export function runScenario(d: DB, code: string, actorId: string) {
  audit(d, "sim.scenario", "Simulator", code, { actorId });
  log(d, "info", "SIM", `Scenario ${code} triggered`);
  switch (code) {
    case "S-OFFLINE":
      d.live.wanOnline = false;
      d.live.wanOfflineUntil = Date.now() + 60_000;
      raiseAlert(d, "R37", { deviceId: "EDGE-1", detail: "قطع WAN — صف محلی فعال" });
      log(d, "warn", "EDGE-1", "WAN link down — local queue engaged; gates keep operating with cached permits");
      break;
    case "S-CAL-EXP": {
      const cal = d.calibrations.find((c) => c.id === "CAL-2")!;
      cal.validUntil = new Date(Date.now() - 3600_000).toISOString();
      break;
    }
    case "S-CAL-RESTORE": {
      const cal = d.calibrations.find((c) => c.id === "CAL-2")!;
      cal.validUntil = new Date(Date.now() + 365 * 864e5).toISOString();
      d.scales.find((s) => s.id === "SC-2")!.status = "READY";
      break;
    }
    case "S-INDICATOR-DOWN": {
      const ind = d.devices.find((x) => x.id === "IND-1")!;
      ind.status = "OFFLINE";
      raiseAlert(d, "R04", { deviceId: ind.id, laneCode: "B", detail: "عدم دریافت فریم از RS-232" });
      setTimeout(() => {
        ind.status = "ONLINE";
        log(d, "info", "IND-1", "indicator link restored");
      }, 40_000);
      break;
    }
    default:
      d.live.pendingScenarios.push(code);
      d.live.nextArrivalAt = Date.now();
  }
  bump(d);
}

export function hashForDemo(s: string) {
  return sha256(s);
}

export function enqueueDemoSms(d: DB, visitId: string) {
  const v = findVisit(d, visitId);
  if (!v) return;
  const dr = d.drivers.find((x) => x.id === v.driverId);
  enqueueOutbox(d, "SMS", "driver.call", `${visitId}-${Date.now()}`, `راننده گرامی، نوبت شما (${v.queueNo}) فرا رسید. لطفاً به باسکول مراجعه کنید.`, dr?.phone);
}
