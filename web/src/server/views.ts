// Read models assembled on the server so clients don't need to download the whole store.
import { guidanceFor } from "@/domain/driverGuidance";
import { computeKpis } from "@/domain/kpi";
import { maskPlate } from "@/domain/plate";
import { remainingKg } from "@/domain/permits";
import { SEVERITY_ORDER } from "@/domain/rules";
import type * as T from "@/domain/types";
import { findPermit, findTx, findVehicle, findVisit } from "./ops";
import { shiftOf, siteHour, siteMidnightUtc, type DB } from "./store";

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
    now: new Date().toISOString(),
    revision: d.revision,
    speed: d.live.speed,
    mode: d.live.mode,
    wanOnline: d.live.wanOnline,
    syncQueue: d.outbox.filter((m) => m.status === "PENDING" || m.status === "FAILED").length,
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
    currentShift: shiftOf(new Date()),
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
  return {
    ...det,
    laneLive,
    queuePos: pos >= 0 ? pos + 1 : null,
    etaMin: pos >= 0 ? (pos + 1) * 4 : null,
    guidance,
    material: d.materials.find((m) => m.id === det.permit?.materialId),
    destination: d.locations.find((l) => l.id === det.permit?.destinationId),
    freeSlots: d.bookings.filter((b) => b.status === "BOOKED").slice(0, 6).map((b) => b.slotStart),
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
