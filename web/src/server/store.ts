import { randomBytes } from "node:crypto";
import { appendAudit, sha256 } from "@/domain/audit";
import { SLA_MINUTES } from "@/domain/rules";
import type * as T from "@/domain/types";

export interface DB {
  sites: T.Site[];
  lanes: T.Lane[];
  scales: T.Scale[];
  devices: T.Device[];
  vehicles: T.Vehicle[];
  drivers: T.Driver[];
  carriers: T.Carrier[];
  customers: T.Customer[];
  materials: T.Material[];
  locations: T.Location[];
  shifts: T.Shift[];
  users: T.User[];
  equipment: T.Equipment[];
  contracts: T.Contract[];
  permits: T.Permit[];
  ledger: T.PermitLedgerEntry[];
  bookings: T.Booking[];
  visits: T.Visit[];
  transactions: T.Transaction[];
  weighEvents: T.WeighEvent[];
  evidence: T.Evidence[];
  plateReads: T.PlateRead[];
  rfidReads: T.RfidRead[];
  gateEvents: T.GateEvent[];
  exitPermits: T.ExitPermit[];
  lidarScans: T.LidarScan[];
  uvssScans: T.UvssScan[];
  payloadEvents: T.PayloadEvent[];
  fleetCycles: T.FleetCycle[];
  rules: T.AlertRule[];
  alerts: T.Alert[];
  fraudCases: T.FraudCase[];
  calibrations: T.CalibrationRecord[];
  loadCells: T.LoadCellSample[];
  audit: T.AuditEvent[];
  outbox: T.OutboxMessage[];
  live: {
    lanes: T.LaneLive[];
    queueB: T.ID[];
    queueC: T.ID[];
    queueGateIn: T.ID[];
    queueGateOut: T.ID[];
    log: T.LogLine[];
    speed: number;
    mode: "AUTO" | "MANUAL";
    wanOnline: boolean;
    wanOfflineUntil?: number;
    nextArrivalAt: number;
    pendingScenarios: string[];
    tamperedAuditSeq?: number;
    tamperedOriginal?: string;
    closedDays: string[];
  };
  revision: number;
  counters: Record<string, number>;
}

export type CollectionName = Exclude<keyof DB, "live" | "revision" | "counters">;

export const globalRef = globalThis as unknown as { __tozinDb?: DB; __tozinSimTimer?: ReturnType<typeof setInterval> };

export const nowIso = () => new Date().toISOString();

export function nextId(d: DB, prefix: string): string {
  d.counters[prefix] = (d.counters[prefix] ?? 0) + 1;
  return `${prefix}-${String(d.counters[prefix]).padStart(6, "0")}`;
}

export const token = (bytes = 12) => randomBytes(bytes).toString("hex");
export const shortCode = () => randomBytes(6).toString("base64url").replace(/[-_]/g, "x").slice(0, 8).toUpperCase();

export function bump(d: DB) {
  d.revision++;
}

export function byId<K extends CollectionName>(d: DB, name: K, id: string | undefined): DB[K][number] | undefined {
  if (!id) return undefined;
  return (d[name] as { id?: string }[]).find((x) => x.id === id) as DB[K][number] | undefined;
}

export function vehicleById(d: DB, id?: string) {
  return d.vehicles.find((v) => v.id === id);
}

export function log(d: DB, level: T.LogLine["level"], source: string, text: string) {
  d.live.log.push({ at: nowIso(), level, source, text });
  if (d.live.log.length > 300) d.live.log.splice(0, d.live.log.length - 300);
}

export function audit(
  d: DB,
  action: string,
  entityType: string,
  entityId: string,
  opts: { actorId?: string; actorType?: T.AuditEvent["actorType"]; reason?: string; data?: Record<string, unknown>; at?: string } = {},
) {
  return appendAudit(d.audit, {
    id: nextId(d, "AU"),
    at: opts.at ?? nowIso(),
    actorId: opts.actorId ?? "system",
    actorType: opts.actorType ?? (opts.actorId && opts.actorId !== "system" ? "HUMAN" : "SYSTEM"),
    action,
    entityType,
    entityId,
    reason: opts.reason,
    data: opts.data,
  });
}

export function raiseAlert(
  d: DB,
  ruleCode: string,
  opts: Partial<Pick<T.Alert, "visitId" | "transactionId" | "deviceId" | "laneCode" | "detail" | "observed" | "threshold" | "evidenceIds">> & { at?: string } = {},
): T.Alert | undefined {
  const rule = d.rules.find((r) => r.code === ruleCode);
  if (!rule || !rule.enabled) return;
  const at = opts.at ?? nowIso();
  // debounce: same rule + same subject still open within 60s
  const dup = d.alerts.find(
    (a) =>
      a.ruleCode === ruleCode &&
      a.status === "OPEN" &&
      a.visitId === opts.visitId &&
      a.deviceId === opts.deviceId &&
      new Date(at).getTime() - new Date(a.openedAt).getTime() < 60_000,
  );
  if (dup) return dup;
  const a: T.Alert = {
    id: nextId(d, "AL"),
    ruleCode,
    severity: rule.severity,
    status: "OPEN",
    title: rule.name,
    titleEn: rule.nameEn,
    detail: opts.detail,
    observed: opts.observed,
    threshold: opts.threshold,
    visitId: opts.visitId,
    transactionId: opts.transactionId,
    deviceId: opts.deviceId,
    laneCode: opts.laneCode,
    openedAt: at,
    slaDueAt: new Date(new Date(at).getTime() + SLA_MINUTES[rule.severity] * 60000).toISOString(),
    evidenceIds: opts.evidenceIds ?? [],
  };
  d.alerts.push(a);
  if (!opts.at) {
    log(d, rule.severity === "CRITICAL" || rule.severity === "HIGH" ? "error" : "warn", "RULES", `${ruleCode} ${rule.nameEn}${opts.detail ? " — " + opts.detail : ""}`);
    audit(d, "alert.raised", "Alert", a.id, { data: { ruleCode, visitId: opts.visitId } });
  }
  return a;
}

export function enqueueOutbox(
  d: DB,
  channel: T.OutboxChannel,
  topic: string,
  entityId: string,
  body: string,
  recipient?: string,
  at?: string,
): T.OutboxMessage {
  const key = `${channel}:${topic}:${entityId}`;
  const existing = d.outbox.find((m) => m.idempotencyKey === key);
  if (existing) return existing;
  const m: T.OutboxMessage = {
    id: nextId(d, "OB"),
    channel,
    topic,
    entityId,
    recipient,
    body,
    status: "PENDING",
    attempts: 0,
    idempotencyKey: key,
    createdAt: at ?? nowIso(),
  };
  d.outbox.push(m);
  return m;
}

export function evidenceHash(seed: number, kind: string, at: string) {
  return sha256(`${seed}|${kind}|${at}`);
}

export function siteMidnightUtc(now = new Date()): Date {
  // Asia/Tehran is UTC+03:30 (no DST)
  const offsetMs = 210 * 60000;
  const local = new Date(now.getTime() + offsetMs);
  local.setUTCHours(0, 0, 0, 0);
  return new Date(local.getTime() - offsetMs);
}

export function siteHour(iso: string | Date): number {
  const t = new Date(iso).getTime() + 210 * 60000;
  return new Date(t).getUTCHours();
}

export function shiftOf(iso: string | Date): T.Shift["code"] {
  const h = siteHour(iso);
  if (h >= 6 && h < 14) return "A";
  if (h >= 14 && h < 22) return "B";
  return "C";
}
