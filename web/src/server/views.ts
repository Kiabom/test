import { clockNow, clockOffset } from "@/domain/clock";
// Read models assembled on the server so clients don't need to download the whole store.
import { guidanceFor } from "@/domain/driverGuidance";
import { LANE_STATION, LOADER_STATION, type StationKey } from "@/domain/geo";
import { JOURNEY_STEPS, journeyIndex, type StepId } from "@/domain/journey";
import { outboundTrip, routeFor } from "@/domain/trips";
import { computeKpis } from "@/domain/kpi";
import { maskPlate } from "@/domain/plate";
import { remainingKg } from "@/domain/permits";
import { SEVERITY_ORDER } from "@/domain/rules";
import type * as T from "@/domain/types";
import { findPermit, findTx, findVehicle, findVisit } from "./ops";
import { sceneNow, shiftOf, siteHour, siteMidnightUtc, type DB } from "./store";

export const TERMINAL: T.VisitState[] = ["EXITED", "REJECTED", "CANCELLED", "EXPECTED"];

export interface VisitBrief {
  id: string;
  plate: T.Plate;
  plateNormalized: string;
  vehicleId: string;
  vehicleType: T.VehicleType;
  vehicleColor: string;
  vehicleStatus: T.Vehicle["status"];
  driverName: string;
  driverNameEn: string;
  carrierName: string;
  state: T.VisitState;
  prevState?: T.VisitState;
  queueNo: number;
  laneCode?: T.Lane["code"];
  operation: T.Operation;
  permitNo?: string;
  materialId?: string;
  holdReasons: string[];
  scenario?: string;
  arrivedAt: string;
  queueJoinedAt?: string;
  calledAt?: string;
  driverToken: string;
  identity: T.Visit["identity"];
  txIds: string[];
  exitPermitId?: string;
  loadingEquipmentId?: string;
  uvssScanId?: string;
}

export function visitBrief(d: DB, v: T.Visit): VisitBrief {
  const vh = findVehicle(d, v.vehicleId)!;
  const dr = d.drivers.find((x) => x.id === v.driverId);
  const cr = d.carriers.find((x) => x.id === vh.carrierId);
  const pm = findPermit(d, v.permitId);
  return {
    id: v.id,
    plate: vh.plate,
    plateNormalized: vh.plateNormalized,
    vehicleId: vh.id,
    vehicleType: vh.type,
    vehicleColor: vh.color,
    vehicleStatus: vh.status,
    driverName: dr?.name ?? "—",
    driverNameEn: dr?.nameEn ?? "—",
    carrierName: cr?.name ?? "—",
    state: v.state,
    prevState: v.prevState,
    queueNo: v.queueNo,
    laneCode: v.laneCode,
    operation: v.operation,
    permitNo: pm?.permitNo,
    materialId: pm?.materialId,
    holdReasons: v.holdReasons,
    scenario: v.scenario,
    arrivedAt: v.arrivedAt,
    queueJoinedAt: v.queueJoinedAt,
    calledAt: v.calledAt,
    driverToken: v.driverToken,
    identity: v.identity,
    txIds: v.transactionIds,
    exitPermitId: v.exitPermitId,
    loadingEquipmentId: v.loadingEquipmentId,
    uvssScanId: v.uvssScanId,
  };
}

export function liveSnapshot(d: DB) {
  const active = d.visits.filter((v) => !TERMINAL.includes(v.state));
  const recentExited = d.visits.filter((v) => v.state === "EXITED" || v.state === "REJECTED").slice(-8).reverse();
  const openAlerts = d.alerts.filter((a) => a.status === "OPEN" || a.status === "ACK" || a.status === "INVESTIGATING");
  return {
    now: new Date(sceneNow(d)).toISOString(),
    clockOffset: clockOffset(),
    frozenAt: d.live.scene === "PRESENTATION" ? (d.live.frozenAt ?? null) : null,
    revision: d.revision,
    speed: d.live.speed,
    mode: d.live.mode,
    scene: d.live.scene,
    wanOnline: d.live.wanOnline,
    syncQueue: d.outbox.filter((m) => m.status === "PENDING").length,
    lanes: d.live.lanes,
    queues: { gateIn: d.live.queueGateIn, B: d.live.queueB, C: d.live.queueC, gateOut: d.live.queueGateOut },
    visits: Object.fromEntries([...active, ...recentExited].map((v) => [v.id, visitBrief(d, v)])),
    activeIds: active.map((v) => v.id),
    recentExitedIds: recentExited.map((v) => v.id),
    log: d.live.log.slice(-80),
    openAlerts: openAlerts.length,
    criticalAlerts: openAlerts.filter((a) => a.severity === "CRITICAL").length,
    latestAlerts: openAlerts.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || b.openedAt.localeCompare(a.openedAt)).slice(0, 6),
    devices: d.devices.map((x) => ({ id: x.id, type: x.type, status: x.status, laneId: x.laneId, lastHeartbeatAt: x.lastHeartbeatAt })),
    scales: d.scales.map((s) => ({ id: s.id, status: s.status })),
  };
}
export type LiveData = ReturnType<typeof liveSnapshot>;

// One serialized snapshot per revision, shared by every open tab. Refreshed at most every 5 s
// when nothing changed (heartbeat ages, live weight on a staged scale).
const snapCache = globalThis as unknown as { __tozinSnap?: { db: DB; rev: number; at: number; json: string } };
export function liveSnapshotJson(d: DB): { rev: number; json: string } {
  const c = snapCache.__tozinSnap;
  const now = clockNow();
  const maxAge = d.live.scene === "LIVE" ? 1000 : 5000;
  if (!c || c.db !== d || c.rev !== d.revision || now - c.at >= maxAge) {
    snapCache.__tozinSnap = { db: d, rev: d.revision, at: now, json: JSON.stringify(liveSnapshot(d)) };
  }
  return snapCache.__tozinSnap!;
}

export function dashboard(d: DB, range: "today" | "7d" = "today") {
  const from = range === "today" ? siteMidnightUtc() : new Date(siteMidnightUtc().getTime() - 6 * 864e5);
  const fromIso = from.toISOString();
  const txs = d.transactions.filter((t) => (t.approvedAt ?? t.createdAt) >= fromIso);
  const visits = d.visits.filter((v) => v.arrivedAt >= fromIso || !TERMINAL.includes(v.state));
  const kpis = computeKpis(txs, visits);
  const approved = txs.filter((t) => t.state === "APPROVED");

  const hourly = Array.from({ length: 24 }, (_, h) => ({ hour: h, outT: 0, inT: 0, trucksIn: 0, trucksOut: 0 }));
  if (range === "today") {
    for (const t of approved) {
      const h = siteHour(t.approvedAt!);
      if (t.operation === "RECEIVE") hourly[h].inT += (t.netKg ?? 0) / 1000;
      else hourly[h].outT += (t.netKg ?? 0) / 1000;
    }
    for (const v of visits) {
      hourly[siteHour(v.arrivedAt)].trucksIn++;
      if (v.exitedAt) hourly[siteHour(v.exitedAt)].trucksOut++;
    }
  }
  const daily: { day: string; outT: number; inT: number; trips: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const s = new Date(siteMidnightUtc().getTime() - i * 864e5).toISOString();
    const e = new Date(siteMidnightUtc().getTime() - (i - 1) * 864e5).toISOString();
    const dt = d.transactions.filter((t) => t.state === "APPROVED" && t.approvedAt! >= s && t.approvedAt! < e);
    daily.push({ day: s, outT: dt.filter((t) => t.operation !== "RECEIVE").reduce((a, t) => a + (t.netKg ?? 0), 0) / 1000, inT: dt.filter((t) => t.operation === "RECEIVE").reduce((a, t) => a + (t.netKg ?? 0), 0) / 1000, trips: dt.length });
  }
  const matMap = new Map<string, number>();
  for (const t of approved) matMap.set(t.materialId, (matMap.get(t.materialId) ?? 0) + (t.netKg ?? 0) / 1000);
  const materialMix = [...matMap.entries()].map(([id, tons]) => ({ id, tons })).sort((a, b) => b.tons - a.tons);

  const shiftTotals = d.shifts.map((s) => {
    const tons = approved.filter((t) => t.shiftCode === s.code && t.operation !== "RECEIVE").reduce((a, t) => a + (t.netKg ?? 0), 0) / 1000;
    return { code: s.code, name: s.name, nameEn: s.nameEn, target: s.targetTons, tons };
  });
  const byCarrier = d.carriers.map((c) => ({ id: c.id, name: c.name, nameEn: c.nameEn, trips: approved.filter((t) => t.carrierId === c.id).length, tons: approved.filter((t) => t.carrierId === c.id).reduce((a, t) => a + (t.netKg ?? 0), 0) / 1000 })).filter((x) => x.trips).sort((a, b) => b.tons - a.tons);
  const byOperator = d.users.filter((u) => u.role === "scale_operator").map((u) => {
    const mine = d.weighEvents.filter((w) => w.operatorId === u.id && w.capturedAt >= fromIso);
    return { id: u.id, name: u.name, nameEn: u.nameEn, captures: mine.length, manual: mine.filter((w) => w.captureMethod === "MANUAL").length };
  });
  const byCustomer = d.customers.map((c) => ({ id: c.id, name: c.name, nameEn: c.nameEn, tons: approved.filter((t) => t.customerId === c.id).reduce((a, t) => a + (t.netKg ?? 0), 0) / 1000 })).filter((x) => x.tons).sort((a, b) => b.tons - a.tons).slice(0, 6);

  const recent = d.transactions.filter((t) => t.state !== "DRAFT").slice(-12).reverse().map((t) => {
    const vh = findVehicle(d, t.vehicleId)!;
    const ev = d.evidence.find((e) => e.transactionId === t.id && e.kind === "CAM_FRONT");
    return { id: t.id, ticketNo: t.ticketNo, plate: vh.plate, materialId: t.materialId, netKg: t.netKg, state: t.state, at: t.approvedAt ?? t.createdAt, operation: t.operation, evidenceSeed: ev?.seed ?? 1, vehicleColor: vh.color, holdReasons: t.holdReasons };
  });

  const funnel = {
    arrived: visits.length,
    entered: visits.filter((v) => v.enteredAt).length,
    firstWeighed: visits.filter((v) => v.transactionIds.some((id) => findTx(d, id)?.firstWeighId)).length,
    secondWeighed: visits.filter((v) => v.transactionIds.some((id) => findTx(d, id)?.secondWeighId)).length,
    exited: visits.filter((v) => v.state === "EXITED").length,
  };
  const scalesReady = d.scales.filter((s) => s.status !== "LOCKED" && d.devices.find((x) => x.laneId === s.laneId && x.type === "INDICATOR")?.status !== "OFFLINE").length;
  const fraudOpen = d.fraudCases.filter((f) => f.status === "NEW" || f.status === "REVIEWING");
  const unmatchedRfid = d.visits.filter((v) => v.arrivedAt >= fromIso && v.identity.match === "MISMATCH").length;
  const manualShare = (() => {
    const w = d.weighEvents.filter((x) => x.capturedAt >= fromIso);
    return w.length ? (w.filter((x) => x.captureMethod === "MANUAL").length / w.length) * 100 : null;
  })();
  const coveragePct = (() => {
    const t = approved.length;
    if (!t) return null;
    const withPhotos = approved.filter((x) => d.evidence.some((e) => e.transactionId === x.id)).length;
    return (withPhotos / t) * 100;
  })();
  return {
    range,
    from: fromIso,
    currentShift: shiftOf(new Date(sceneNow(d))),
    kpis: { ...kpis, scalesReady, scalesTotal: d.scales.length, openAlerts: d.alerts.filter((a) => a.status === "OPEN" || a.status === "ACK").length, unmatchedRfid, manualSharePct: manualShare, coveragePct },
    hourly,
    daily,
    materialMix,
    shiftTotals,
    byCarrier,
    byOperator,
    byCustomer,
    recent,
    funnel,
    risk: fraudOpen.map((f) => ({ id: f.id, title: f.title, titleEn: f.titleEn, score: f.score, kind: f.kind })),
    branches: [
      { id: "S1", name: d.sites[0].name, nameEn: d.sites[0].nameEn, tons: approved.reduce((a, t) => a + (t.netKg ?? 0), 0) / 1000, trips: approved.length },
      { id: "S2", name: d.sites[1].name, nameEn: d.sites[1].nameEn, tons: Math.round((approved.reduce((a, t) => a + (t.netKg ?? 0), 0) / 1000) * 0.42), trips: Math.round(approved.length * 0.4) },
    ],
  };
}
export type DashboardData = ReturnType<typeof dashboard>;

export function visitDetail(d: DB, visitId: string) {
  const v = findVisit(d, visitId);
  if (!v) return null;
  const txs = v.transactionIds.map((id) => findTx(d, id)!).filter(Boolean);
  const txIds = new Set(txs.map((t) => t.id));
  const ep = d.exitPermits.find((e) => e.id === v.exitPermitId);
  const entityIds = new Set([v.id, ...txIds, ...(ep ? [ep.id] : []), ...d.weighEvents.filter((w) => txIds.has(w.transactionId)).map((w) => w.id)]);
  return {
    visit: v,
    brief: visitBrief(d, v),
    vehicle: findVehicle(d, v.vehicleId)!,
    driver: d.drivers.find((x) => x.id === v.driverId),
    carrier: d.carriers.find((x) => x.id === findVehicle(d, v.vehicleId)?.carrierId),
    permit: findPermit(d, v.permitId),
    permitRemainingKg: findPermit(d, v.permitId) ? remainingKg(findPermit(d, v.permitId)!) : null,
    transactions: txs,
    weighEvents: d.weighEvents.filter((w) => txIds.has(w.transactionId)),
    evidence: d.evidence.filter((e) => e.visitId === v.id),
    gateEvents: d.gateEvents.filter((g) => g.visitId === v.id),
    plateReads: d.plateReads.filter((p) => p.visitId === v.id),
    rfidReads: d.rfidReads.filter((r) => v.identity.rfid?.readId === r.id),
    lidarScans: d.lidarScans.filter((l) => l.visitId === v.id),
    uvss: d.uvssScans.find((u) => u.id === v.uvssScanId),
    payload: d.payloadEvents.filter((p) => p.visitId === v.id),
    exitPermit: ep,
    alerts: d.alerts.filter((a) => a.visitId === v.id),
    audit: d.audit.filter((a) => entityIds.has(a.entityId)),
    outbox: d.outbox.filter((m) => entityIds.has(m.entityId) || m.entityId.startsWith(v.id)),
  };
}
export type VisitDetail = NonNullable<ReturnType<typeof visitDetail>>;

export function driverView(d: DB, tokenValue: string) {
  const v = d.visits.find((x) => x.driverToken === tokenValue);
  if (!v) return null;
  const det = visitDetail(d, v.id)!;
  const laneLive = v.laneCode ? d.live.lanes.find((l) => l.code === v.laneCode) : undefined;
  const queue = v.transactionIds.length ? d.live.queueC : d.live.queueB;
  const pos = queue.indexOf(v.id);
  const eq = d.equipment.find((e) => e.id === v.loadingEquipmentId);
  const guidance = guidanceFor(v, laneLive?.kind === "SCALE" ? laneLive : undefined, { loadPoint: eq?.code, queuePos: pos >= 0 ? pos + 1 : undefined });
  const txs = det.transactions.filter((t) => t.state !== "VOIDED");
  const firstWeighed = txs.some((t) => !!t.firstWeighId);
  const approved = txs.find((t) => t.state === "APPROVED");
  const index = journeyIndex(v, { firstWeighed, hasTicket: !!approved });
  const weighAt = (pass: string) => det.weighEvents.find((w) => w.pass === pass)?.capturedAt;
  const vehicle = det.vehicle;
  const route = routeFor(v.operation, det.permit?.customerId, vehicle.carrierId);
  const trip = v.exitedAt && route ? outboundTrip(v.id, v.exitedAt, route, sceneNow(d)) : null;
  const times: Partial<Record<StepId, string>> = {
    BOOK: d.bookings.find((b) => b.id === v.bookingId)?.slotStart,
    GATE_IN: v.enteredAt ?? (index > 1 ? v.arrivedAt : undefined),
    QUEUE: v.calledAt ?? (index > 2 ? v.queueJoinedAt : undefined),
    SCALE_1: weighAt("FIRST"),
    LOAD: det.payload.at(-1)?.at,
    LIDAR: det.lidarScans.at(-1)?.capturedAt,
    SCALE_2: weighAt("SECOND") ?? weighAt("ONE_PASS"),
    TICKET: approved?.approvedAt,
    EXIT: v.exitedAt,
    DELIVER: trip?.delivered ? trip.events.find((e) => e.kind === "DELIVERED")?.at : undefined,
  };
  return {
    ...det,
    journey: { index, firstWeighed, hasTicket: !!approved, times, steps: JOURNEY_STEPS.length },
    trip,
    loadingEquipmentCode: eq?.code,
    laneLive,
    queuePos: pos >= 0 ? pos + 1 : null,
    etaMin: pos >= 0 ? (pos + 1) * 4 : null,
    guidance,
    material: d.materials.find((m) => m.id === det.permit?.materialId),
    destination: d.locations.find((l) => l.id === det.permit?.destinationId),
    freeSlots: [...new Set(d.bookings.filter((b) => b.status === "BOOKED").map((b) => b.slotStart))].slice(0, 6),
  };
}
export type DriverView = NonNullable<ReturnType<typeof driverView>>;

export function verifyView(d: DB, code: string) {
  const tx = d.transactions.find((t) => t.verifyCode === code.toUpperCase());
  if (tx) {
    const vh = findVehicle(d, tx.vehicleId)!;
    return { kind: "TICKET" as const, status: tx.state === "APPROVED" ? "VALID" : tx.state === "VOIDED" ? "VOIDED" : "PENDING", ticketNo: tx.ticketNo, plateMasked: maskPlate(vh.plate), materialId: tx.materialId, netKg: tx.netKg, approvedAt: tx.approvedAt, version: tx.version, printCount: tx.printCount };
  }
  const ep = d.exitPermits.find((e) => e.token === code.toLowerCase() || e.serial.toUpperCase() === code.toUpperCase());
  if (ep) {
    const v = findVisit(d, ep.visitId)!;
    const vh = findVehicle(d, v.vehicleId)!;
    return { kind: "EXIT_PERMIT" as const, status: ep.status === "APPROVED" ? "VALID" : ep.status === "CONSUMED" ? "USED" : "CANCELLED", ticketNo: ep.serial, plateMasked: maskPlate(vh.plate), materialId: undefined, netKg: undefined, approvedAt: ep.approvedAt, consumedAt: ep.consumedAt, version: 1, printCount: 0 };
  }
  return null;
}

// ---------------- Fleet & events map ----------------
export interface MapSiteTruck {
  id: string;
  plate: T.Plate;
  plateNormalized: string;
  driver: string;
  driverEn: string;
  state: T.VisitState;
  step: number;
  station: StationKey;
  slot: number;
  hold: boolean;
  laneCode?: string;
  token: string;
  ticketNo?: string;
  operation: T.Operation;
}
export interface MapRoadTruck {
  id: string;
  kind: "OUT" | "IN";
  plate: T.Plate;
  plateNormalized: string;
  driver: string;
  driverEn: string;
  customer?: string;
  customerEn?: string;
  /** OUT: exit time; IN: slot start. */
  t: string;
  /** OUT: customer id for the route; IN: carrier id. */
  routeKey: string;
  token?: string;
  ticketNo?: string;
  netKg?: number;
}
export interface MapFleetTruck {
  id: string;
  plate: T.Plate;
  plateNormalized: string;
  loop: "HAUL" | "DUMP";
  cycleMin: number;
  offsetMin: number;
}
export interface MapAlert {
  id: string;
  ruleCode: string;
  severity: T.Severity;
  title: string;
  titleEn: string;
  station: StationKey;
  openedAt: string;
  visitId?: string;
}

export function mapView(d: DB) {
  const now = sceneNow(d);
  const active = d.visits.filter((v) => !TERMINAL.includes(v.state));
  const qB = d.live.queueB;
  const qC = d.live.queueC;
  const slots: Record<string, number> = {};
  const site: MapSiteTruck[] = active.map((v) => {
    const vh = findVehicle(d, v.vehicleId)!;
    const dr = d.drivers.find((x) => x.id === v.driverId);
    const txs = v.transactionIds.map((id) => findTx(d, id)).filter(Boolean) as T.Transaction[];
    const firstWeighed = txs.some((t) => !!t.firstWeighId);
    let station: StationKey;
    if (v.laneCode) station = LANE_STATION[v.laneCode];
    else if (v.state === "LOADING") station = v.operation === "RECEIVE" ? "unload" : LOADER_STATION[v.loadingEquipmentId ?? ""] ?? "L-01";
    else if (qB.includes(v.id)) station = "parking";
    else if (qC.includes(v.id)) station = "D";
    else if (v.state === "READY_TO_EXIT") station = "E";
    else if (v.state === "HOLD") station = firstWeighed ? "C" : "A";
    else if (v.state === "ARRIVED" || v.state === "IDENTIFIED") station = "approach";
    else station = firstWeighed ? "D" : "parking";
    const slot = v.laneCode ? 0 : (slots[station] = (slots[station] ?? 0) + 1);
    return {
      id: v.id,
      plate: vh.plate,
      plateNormalized: vh.plateNormalized,
      driver: dr?.name ?? "—",
      driverEn: dr?.nameEn ?? "—",
      state: v.state,
      step: journeyIndex(v, { firstWeighed, hasTicket: txs.some((t) => t.state === "APPROVED") }),
      station,
      slot,
      hold: v.state === "HOLD",
      laneCode: v.laneCode,
      token: v.driverToken,
      ticketNo: txs.at(-1)?.ticketNo,
      operation: v.operation,
    };
  });

  // road: trucks that left in the last 24 h (the client computes where they are now)
  const since = new Date(now - 24 * 3600_000).toISOString();
  const road: MapRoadTruck[] = [];
  for (let i = d.visits.length - 1; i >= 0; i--) {
    const v = d.visits[i];
    if (v.state !== "EXITED" || !v.exitedAt) continue;
    if (v.exitedAt < since) {
      if (v.arrivedAt < since) break;
      continue;
    }
    const tx = v.transactionIds.map((id) => findTx(d, id)).find((t) => t?.state === "APPROVED");
    const vh = findVehicle(d, v.vehicleId)!;
    const custId = tx?.customerId ?? findPermit(d, v.permitId)?.customerId;
    const routeKey = v.operation === "RECEIVE" ? `CARRIER:${vh.carrierId}` : custId;
    if (!routeKey) continue;
    const dr = d.drivers.find((x) => x.id === v.driverId);
    const cu = d.customers.find((c) => c.id === custId);
    road.push({ id: v.id, kind: "OUT", plate: vh.plate, plateNormalized: vh.plateNormalized, driver: dr?.name ?? "—", driverEn: dr?.nameEn ?? "—", customer: cu?.name, customerEn: cu?.nameEn, t: v.exitedAt, routeKey, token: v.driverToken, ticketNo: tx?.ticketNo, netKg: tx?.netKg });
  }
  // inbound: booked trucks driving towards their slot
  for (const b of d.bookings) {
    if (b.status !== "BOOKED") continue;
    const vh = findVehicle(d, b.vehicleId);
    if (!vh || new Date(b.slotStart).getTime() < now) continue;
    const dr = d.drivers.find((x) => x.id === b.driverId);
    road.push({ id: b.id, kind: "IN", plate: vh.plate, plateNormalized: vh.plateNormalized, driver: dr?.name ?? "—", driverEn: dr?.nameEn ?? "—", t: b.slotStart, routeKey: vh.carrierId });
  }

  // the mine's own trucks cycle between the shovel and the crusher / dump
  const fleet: MapFleetTruck[] = d.vehicles
    .filter((v) => v.internal && v.status === "ACTIVE")
    .map((v, i) => {
      const cyc = d.fleetCycles.filter((c) => c.vehicleId === v.id).slice(-6);
      const cycleMin = cyc.length ? cyc.reduce((a, c) => a + c.loadMin + c.haulMin + c.queueMin + c.dumpMin + c.returnMin, 0) / cyc.length : 60;
      return { id: v.id, plate: v.plate, plateNormalized: v.plateNormalized, loop: i % 3 === 2 ? "DUMP" : "HAUL", cycleMin: Math.round(cycleMin * 10) / 10, offsetMin: (i * 7.3) % cycleMin };
    });

  const equipment = d.equipment.map((e) => ({ id: e.id, code: e.code, name: e.name, nameEn: e.nameEn, type: e.type, status: e.status, station: LOADER_STATION[e.id] ?? "SH-01" }));
  const alerts: MapAlert[] = d.alerts
    .filter((a) => ["OPEN", "ACK", "INVESTIGATING"].includes(a.status))
    .map((a) => {
      const st: StationKey = a.laneCode ? LANE_STATION[a.laneCode] : a.visitId ? site.find((s) => s.id === a.visitId)?.station ?? "control" : "control";
      return { id: a.id, ruleCode: a.ruleCode, severity: a.severity, title: a.title, titleEn: a.titleEn, station: st, openedAt: a.openedAt, visitId: a.visitId };
    });
  return { now: new Date(now).toISOString(), scene: d.live.scene, site, road, fleet, equipment, alerts };
}
export type MapData = ReturnType<typeof mapView>;

// ---------------- Owner's process view ----------------
const LANE_STEP: Record<string, StepId> = { A: "GATE_IN", B: "SCALE_1", C: "SCALE_2", D: "LIDAR", E: "EXIT" };
const RULE_STEP: Record<string, StepId> = {
  R05: "GATE_IN", R06: "GATE_IN", R07: "GATE_IN", R08: "GATE_IN", R11: "GATE_IN", R35: "GATE_IN",
  R29: "QUEUE", R30: "QUEUE", R32: "LIDAR", R31: "LIDAR", R34: "LOAD",
  R12: "SCALE_2", R14: "SCALE_2", R15: "SCALE_2", R16: "SCALE_2", R40: "SCALE_2", R39: "TICKET",
  R36: "EXIT", R09: "EXIT",
};

export function processView(d: DB) {
  const now = sceneNow(d);
  const from = siteMidnightUtc().toISOString();
  const minutes = (a?: string, b?: string) => (a && b ? (new Date(b).getTime() - new Date(a).getTime()) / 60_000 : null);
  const avg = (xs: (number | null)[]) => {
    const v = xs.filter((x): x is number => x != null && x >= 0 && x < 24 * 60);
    return v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10 : null;
  };
  const today = d.visits.filter((v) => v.arrivedAt >= from);
  const weighs = new Map<string, { first?: string; second?: string }>();
  for (const w of d.weighEvents) {
    if (w.capturedAt < from) continue;
    const e = weighs.get(w.transactionId) ?? {};
    if (w.pass === "FIRST") e.first = w.capturedAt;
    if (w.pass === "SECOND" || w.pass === "ONE_PASS") e.second = w.capturedAt;
    weighs.set(w.transactionId, e);
  }
  const rows = today.map((v) => {
    const tx = v.transactionIds.map((id) => findTx(d, id)).find((t) => t && t.state !== "VOIDED");
    const w = tx ? weighs.get(tx.id) ?? {} : {};
    return { v, tx, first: w.first, second: w.second };
  });

  // trucks at each step right now (on site + on the road + booked)
  const current: Record<StepId, number> = { BOOK: 0, GATE_IN: 0, QUEUE: 0, SCALE_1: 0, LOAD: 0, LIDAR: 0, SCALE_2: 0, TICKET: 0, EXIT: 0, DELIVER: 0 };
  for (const v of d.visits) {
    if (TERMINAL.includes(v.state)) continue;
    const txs = v.transactionIds.map((id) => findTx(d, id)).filter(Boolean) as T.Transaction[];
    current[JOURNEY_STEPS[journeyIndex(v, { firstWeighed: txs.some((t) => !!t.firstWeighId), hasTicket: txs.some((t) => t.state === "APPROVED") })].id]++;
  }
  if (d.live.lanes.find((l) => l.code === "D")?.visitId) current.LIDAR++;
  current.BOOK = d.bookings.filter((b) => b.status === "BOOKED" && b.slotStart >= from).length;
  let delivered = 0;
  for (const r of rows) {
    if (!r.v.exitedAt) continue;
    const route = routeFor(r.v.operation, r.tx?.customerId, findVehicle(d, r.v.vehicleId)!.carrierId);
    if (!route) continue;
    const trip = outboundTrip(r.v.id, r.v.exitedAt, route, now);
    if (trip.delivered) delivered++;
    else current.DELIVER++;
  }

  const durations: Partial<Record<StepId, number | null>> = {
    GATE_IN: avg(rows.map((r) => minutes(r.v.arrivedAt, r.v.enteredAt))),
    QUEUE: avg(rows.map((r) => minutes(r.v.enteredAt, r.first))),
    LOAD: avg(rows.map((r) => minutes(r.first, r.second))),
    TICKET: avg(rows.map((r) => minutes(r.second, r.tx?.approvedAt))),
    EXIT: avg(rows.map((r) => minutes(r.tx?.approvedAt, r.v.exitedAt))),
  };
  const exceptions: Record<StepId, number> = { BOOK: 0, GATE_IN: 0, QUEUE: 0, SCALE_1: 0, LOAD: 0, LIDAR: 0, SCALE_2: 0, TICKET: 0, EXIT: 0, DELIVER: 0 };
  for (const a of d.alerts) {
    if (a.openedAt < from) continue;
    const step = RULE_STEP[a.ruleCode] ?? (a.laneCode ? LANE_STEP[a.laneCode] : undefined);
    if (step) exceptions[step]++;
  }
  const rejected = today.filter((v) => v.state === "REJECTED").length;
  exceptions.GATE_IN = Math.max(exceptions.GATE_IN, rejected);
  const longest = (Object.entries(durations) as [StepId, number | null][]).filter(([, m]) => m != null).sort((a, b) => b[1]! - a[1]!)[0];
  const funnel = [
    { key: "ARRIVED", fa: "رسیده به دروازه", en: "Arrived", count: today.length },
    { key: "ENTERED", fa: "وارد سایت", en: "Entered", count: today.filter((v) => !!v.enteredAt).length },
    { key: "WEIGHED", fa: "توزین کامل", en: "Fully weighed", count: rows.filter((r) => !!r.second).length },
    { key: "TICKET", fa: "تیکت تأییدشده", en: "Approved ticket", count: rows.filter((r) => r.tx?.state === "APPROVED").length },
    { key: "EXITED", fa: "خارج‌شده", en: "Exited", count: today.filter((v) => v.state === "EXITED").length },
    { key: "DELIVERED", fa: "تحویل‌شده", en: "Delivered", count: delivered },
  ];
  return {
    scene: d.live.scene,
    steps: JOURNEY_STEPS.map((s) => ({ id: s.id, now: current[s.id], avgMin: durations[s.id] ?? null, exceptions: exceptions[s.id] })),
    funnel,
    bottleneck: longest ? { step: longest[0], avgMin: longest[1]! } : null,
    rejected,
    netTonsToday: Math.round(rows.reduce((a, r) => a + (r.tx?.state === "APPROVED" ? r.tx.netKg ?? 0 : 0), 0) / 100) / 10,
  };
}
export type ProcessData = ReturnType<typeof processView>;

// ---------------- Stockpiles ----------------
export interface StockMove {
  at: string;
  txId: string;
  ticketNo: string;
  vehicleId: string;
  originId: string;
  destinationId: string;
  stockpileId: string;
  dir: "IN" | "OUT";
  t: number;
}
export interface StockpileView {
  id: string;
  name: string;
  nameEn: string;
  materialId?: string;
  capacityT: number;
  openingT: number;
  balanceT: number;
  todayIn: number;
  todayOut: number;
  days: { day: string; inT: number; outT: number }[];
}

/**
 * Stockpile balances from weighed tickets: a ticket whose destination is the stockpile adds its net
 * tonnage, one whose origin is the stockpile removes it. Balance = opening + Σin − Σout.
 */
export function stockpilesView(d: DB, from?: string, to?: string) {
  const now = sceneNow(d);
  const piles = d.locations.filter((l) => l.type === "STOCKPILE");
  const ids = new Set(piles.map((p) => p.id));
  const moves: StockMove[] = [];
  for (const t of d.transactions) {
    if (t.state !== "APPROVED" || !t.netKg) continue;
    const at = t.approvedAt ?? t.createdAt;
    if (new Date(at).getTime() > now) continue;
    const base = { at, txId: t.id, ticketNo: t.ticketNo, vehicleId: t.vehicleId, originId: t.originId, destinationId: t.destinationId, t: t.netKg / 1000 };
    if (ids.has(t.destinationId)) moves.push({ ...base, stockpileId: t.destinationId, dir: "IN" });
    if (ids.has(t.originId)) moves.push({ ...base, stockpileId: t.originId, dir: "OUT" });
  }
  const dayStart = siteMidnightUtc(new Date(now)).getTime();
  const dayKey = (ms: number) => new Date(ms + 210 * 60_000).toISOString().slice(0, 10);
  const views: StockpileView[] = piles.map((p) => {
    const mine = moves.filter((m) => m.stockpileId === p.id);
    const sum = (list: StockMove[], dir: "IN" | "OUT") => list.filter((m) => m.dir === dir).reduce((a, m) => a + m.t, 0);
    const today = mine.filter((m) => new Date(m.at).getTime() >= dayStart);
    const days = Array.from({ length: 7 }, (_, i) => {
      const s = dayStart - (6 - i) * 864e5;
      const list = mine.filter((m) => {
        const x = new Date(m.at).getTime();
        return x >= s && x < s + 864e5;
      });
      return { day: dayKey(s), inT: +sum(list, "IN").toFixed(1), outT: +sum(list, "OUT").toFixed(1) };
    });
    const opening = p.openingT ?? 0;
    return { id: p.id, name: p.name, nameEn: p.nameEn, materialId: p.materialId, capacityT: p.capacityT ?? 0, openingT: opening, balanceT: +(opening + sum(mine, "IN") - sum(mine, "OUT")).toFixed(1), todayIn: +sum(today, "IN").toFixed(1), todayOut: +sum(today, "OUT").toFixed(1), days };
  });
  const inRange = moves.filter((m) => (!from || m.at >= from) && (!to || m.at < to)).sort((a, b) => b.at.localeCompare(a.at));
  return { stockpiles: views, moves: inRange.slice(0, 2000) };
}
export type StockpilesData = ReturnType<typeof stockpilesView>;

// ---------------- Fleet performance (per vehicle / per driver) ----------------
export interface PerfRow {
  id: string;
  trips: number;
  tons: number;
  avgTare: number;
  avgGross: number;
  avgNet: number;
  tareStd: number;
  tareDev?: number;
  loadFactor?: number;
  overloads: number;
  underloads: number;
  holds: number;
  manual: number;
  avgSiteMin?: number;
  avgWaitMin?: number;
  tripsPerDay: number;
  lastAt?: string;
  vehiclesUsed?: number;
  unauthorized?: number;
}
export interface PerfTrip {
  at: string;
  txId: string;
  ticketNo: string;
  vehicleId: string;
  driverId: string;
  tare: number;
  gross: number;
  net: number;
  originId: string;
  destinationId: string;
  siteMin?: number;
  overload: boolean;
  hold: boolean;
}

/**
 * Per-vehicle and per-driver KPIs from approved tickets in a period: tare (empty) and gross (loaded)
 * averages, load factor, overloads, tare drift vs stored tare, time on site and exceptions.
 */
export function fleetPerf(d: DB, from: string, to: string, detail?: { vehicleId?: string; driverId?: string }) {
  const now = new Date(sceneNow(d)).toISOString();
  const end = to < now ? to : now;
  const txs = d.transactions.filter((t) => t.state === "APPROVED" && t.tareKg && t.grossKg && (t.approvedAt ?? t.createdAt) >= from && (t.approvedAt ?? t.createdAt) < end);
  const visitOf = new Map(d.visits.map((v) => [v.id, v]));
  const manual = new Set(d.weighEvents.filter((w) => w.captureMethod === "MANUAL").map((w) => w.transactionId));
  const firstWeighAt = new Map(d.weighEvents.map((w) => [w.id, w.capturedAt]));
  const vehicles = new Map(d.vehicles.map((v) => [v.id, v]));
  const mins = (a?: string, b?: string) => (a && b ? (new Date(b).getTime() - new Date(a).getTime()) / 60_000 : undefined);
  const trips: PerfTrip[] = txs.map((t) => {
    const v = visitOf.get(t.visitId);
    const veh = vehicles.get(t.vehicleId);
    return {
      at: t.approvedAt ?? t.createdAt,
      txId: t.id,
      ticketNo: t.ticketNo,
      vehicleId: t.vehicleId,
      driverId: t.driverId,
      tare: t.tareKg!,
      gross: t.grossKg!,
      net: t.netKg ?? t.grossKg! - t.tareKg!,
      originId: t.originId,
      destinationId: t.destinationId,
      siteMin: mins(v?.arrivedAt, v?.exitedAt),
      overload: !!veh && t.grossKg! > veh.maxGvwKg,
      hold: t.holdReasons.length > 0 || t.revisions.some((r) => !!r.reason),
    };
  });
  const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
  const std = (xs: number[]) => {
    const m = avg(xs);
    return xs.length > 1 ? Math.sqrt(avg(xs.map((x) => (x - m) ** 2))) : 0;
  };
  const dayKey = (iso: string) => new Date(new Date(iso).getTime() + 210 * 60_000).toISOString().slice(0, 10);
  const rowOf = (id: string, list: PerfTrip[], kind: "vehicle" | "driver"): PerfRow => {
    const veh = kind === "vehicle" ? vehicles.get(id) : undefined;
    const tares = list.map((x) => x.tare);
    const site = list.map((x) => x.siteMin).filter((x): x is number => x != null && x > 0);
    const waits = list
      .map((x) => {
        const t = txs.find((y) => y.id === x.txId)!;
        const v = visitOf.get(t.visitId);
        return mins(v?.arrivedAt, t.firstWeighId ? firstWeighAt.get(t.firstWeighId) : undefined);
      })
      .filter((x): x is number => x != null && x >= 0);
    const days = new Set(list.map((x) => dayKey(x.at))).size || 1;
    const avgNet = avg(list.map((x) => x.net));
    return {
      id,
      trips: list.length,
      tons: +(list.reduce((a, x) => a + x.net, 0) / 1000).toFixed(2),
      avgTare: Math.round(avg(tares)),
      avgGross: Math.round(avg(list.map((x) => x.gross))),
      avgNet: Math.round(avgNet),
      tareStd: Math.round(std(tares)),
      tareDev: veh?.storedTareKg ? Math.round(avg(tares) - veh.storedTareKg) : undefined,
      loadFactor: veh?.ratedPayloadKg ? +(avgNet / veh.ratedPayloadKg).toFixed(3) : undefined,
      overloads: list.filter((x) => x.overload).length,
      underloads: veh?.ratedPayloadKg ? list.filter((x) => x.net < veh.ratedPayloadKg * 0.75).length : 0,
      holds: list.filter((x) => x.hold).length,
      manual: list.filter((x) => manual.has(x.txId)).length,
      avgSiteMin: site.length ? Math.round(avg(site)) : undefined,
      avgWaitMin: waits.length ? Math.round(avg(waits)) : undefined,
      tripsPerDay: +(list.length / days).toFixed(1),
      lastAt: list.map((x) => x.at).sort().at(-1),
      vehiclesUsed: kind === "driver" ? new Set(list.map((x) => x.vehicleId)).size : undefined,
      unauthorized:
        kind === "driver"
          ? d.alerts.filter((a) => a.ruleCode === "R41" && a.openedAt >= from && a.openedAt < end && visitOf.get(a.visitId ?? "")?.driverId === id).length
          : undefined,
    };
  };
  const group = (key: "vehicleId" | "driverId") => {
    const m = new Map<string, PerfTrip[]>();
    for (const t of trips) m.set(t[key], [...(m.get(t[key]) ?? []), t]);
    return m;
  };
  const byVeh = group("vehicleId");
  const byDrv = group("driverId");
  const vehicleRows = [...byVeh.entries()].map(([id, l]) => rowOf(id, l, "vehicle")).sort((a, b) => b.tons - a.tons);
  const driverRows = [...byDrv.entries()].filter(([id]) => id).map(([id, l]) => rowOf(id, l, "driver")).sort((a, b) => b.tons - a.tons);
  const dayMap = new Map<string, PerfTrip[]>();
  for (const t of trips) dayMap.set(dayKey(t.at), [...(dayMap.get(dayKey(t.at)) ?? []), t]);
  const daily = [...dayMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([day, l]) => ({ day, trips: l.length, avgTare: Math.round(avg(l.map((x) => x.tare))), avgGross: Math.round(avg(l.map((x) => x.gross))), avgNet: Math.round(avg(l.map((x) => x.net))) }));
  const lf = vehicleRows.filter((r) => r.loadFactor != null);
  const site = trips.map((x) => x.siteMin).filter((x): x is number => x != null && x > 0);
  const summary = {
    trips: trips.length,
    tons: +(trips.reduce((a, x) => a + x.net, 0) / 1000).toFixed(1),
    avgTare: Math.round(avg(trips.map((x) => x.tare))),
    avgGross: Math.round(avg(trips.map((x) => x.gross))),
    avgNet: Math.round(avg(trips.map((x) => x.net))),
    loadFactor: lf.length ? +(lf.reduce((a, r) => a + (r.loadFactor ?? 0) * r.trips, 0) / lf.reduce((a, r) => a + r.trips, 0)).toFixed(3) : 0,
    overloads: trips.filter((x) => x.overload).length,
    avgSiteMin: site.length ? Math.round(avg(site)) : 0,
    vehicles: vehicleRows.length,
    drivers: driverRows.length,
  };
  const detailTrips = detail?.vehicleId ? byVeh.get(detail.vehicleId) : detail?.driverId ? byDrv.get(detail.driverId) : undefined;
  return { summary, daily, vehicles: vehicleRows, drivers: driverRows, trips: detailTrips?.sort((a, b) => a.at.localeCompare(b.at)) };
}
export type FleetPerfData = ReturnType<typeof fleetPerf>;
