import { verifyChain } from "@/domain/audit";
import { can, type Permission } from "@/domain/rbac";
import type * as T from "@/domain/types";
import { ackAlert, captureWeigh, finalizeTx, findTx, findVisit, gateDecide, issueExitPermit, lane, OpError, printTx, registerGuest, requestBarrierOpen, confirmBarrierOpen, scanAny, setDeduction, voidTx } from "./ops";
import { enqueueDemoSms, runScenario } from "./sim";
import { audit, bump, enqueueOutbox, log, nextId, nowIso, raiseAlert, type DB } from "./store";
import { resetDb } from "./runtime";

type Payload = Record<string, unknown>;
const str = (p: Payload, k: string) => (typeof p[k] === "string" ? (p[k] as string) : "");
const num = (p: Payload, k: string) => Number(p[k] ?? 0);

const PERMS: Record<string, Permission | null> = {
  "gate.decide": "gate.decide",
  "gate.guest": "gate.guest",
  "barrier.open": "gate.decide",
  "weigh.capture": "weigh.capture",
  "tx.deduction": "tx.finalize",
  "tx.finalize": "tx.finalize",
  "tx.void": "tx.void",
  "tx.print": "tx.print",
  "tx.notify": "tx.print",
  "exit.issue": "exit.issue",
  "exit.cancel": "exit.issue",
  scan: "exit.scan",
  "uvss.decide": "gate.decide",
  "alert.status": "alert.manage",
  "alert.rule": "admin.manage",
  "fraud.decide": "fraud.review",
  "queue.callNext": "weigh.capture",
  "permit.status": "permit.manage",
  "permit.create": "permit.manage",
  "master.update": "master.edit",
  "calibration.add": "calibration.edit",
  "qc.decide": null,
  "device.toggle": "sim.control",
  "sim.scenario": "sim.control",
  "sim.speed": "sim.control",
  "sim.mode": "sim.control",
  "sim.reset": "sim.control",
  "audit.verify": null,
  "audit.tamper": "admin.manage",
  "audit.restore": "admin.manage",
  "report.schedule": "report.read",
  "day.close": "report.read",
  "outbox.retry": "admin.manage",
  "driver.callOperator": null,
  "driver.book": null,
  "kiosk.print": null,
  "demo.request": null,
};

export function dispatch(d: DB, type: string, p: Payload, actorId: string): unknown {
  const user = d.users.find((u) => u.id === actorId);
  const perm = PERMS[type];
  if (perm === undefined) throw new OpError("UNKNOWN_ACTION");
  if (perm && (!user || !can(user.role, perm))) throw new OpError("FORBIDDEN", `نقش فعلی مجوز «${perm}» را ندارد`);

  switch (type) {
    case "gate.decide":
      return gateDecide(d, str(p, "visitId"), !!p.approve, actorId, str(p, "reason") || undefined);
    case "gate.guest":
      return registerGuest(d, str(p, "visitId"), actorId, str(p, "reason"));
    case "barrier.open": {
      const code = str(p, "lane") as T.Lane["code"];
      if (!str(p, "reason")) throw new OpError("REASON_REQUIRED");
      requestBarrierOpen(d, code, undefined, actorId);
      setTimeout(() => {
        confirmBarrierOpen(d, code);
        setTimeout(() => {
          const l = lane(d, code);
          l.barrier = "CLOSED";
          l.light = l.kind === "SCALE" ? "GREEN" : "RED";
        }, 4000);
      }, 900);
      audit(d, "barrier.manual_open", "Lane", code, { actorId, reason: str(p, "reason") });
      bump(d);
      return { ok: true };
    }
    case "weigh.capture": {
      const code = str(p, "lane") as "B" | "C";
      const mode = str(p, "mode");
      const manual = p.manual as { kg: number; reason: string; signer: string } | undefined;
      const we = captureWeigh(d, code, actorId, { manual, useStoredTare: mode === "storedTare", extra: mode === "extra" });
      return we;
    }
    case "tx.deduction":
      setDeduction(d, str(p, "txId"), num(p, "kg"), str(p, "reason"), actorId);
      return { ok: true };
    case "tx.finalize": {
      const ov = p.override as { reason: string; signer: string } | undefined;
      return finalizeTx(d, str(p, "txId"), actorId, ov);
    }
    case "tx.void":
      return voidTx(d, str(p, "txId"), actorId, str(p, "reason"), str(p, "signer"));
    case "tx.print":
      return printTx(d, str(p, "txId"), actorId, str(p, "reason") || undefined);
    case "tx.notify": {
      const tx = findTx(d, str(p, "txId"));
      if (!tx) throw new OpError("TX_NOT_FOUND");
      const ch = (str(p, "channel") || "SMS") as T.OutboxChannel;
      const dr = d.drivers.find((x) => x.id === tx.driverId);
      const m = enqueueOutbox(d, ch, `ticket.resend.${Date.now()}`, tx.id, `رسید ${tx.ticketNo} — خالص ${tx.netKg?.toLocaleString("en")} kg — /verify/${tx.verifyCode}`, ch === "EMAIL" ? "driver@example.com" : dr?.phone);
      audit(d, "ticket.sent", "Transaction", tx.id, { actorId, data: { channel: ch } });
      bump(d);
      return m;
    }
    case "exit.issue":
      return issueExitPermit(d, str(p, "visitId"), actorId, !!p.empty);
    case "exit.cancel": {
      const ep = d.exitPermits.find((e) => e.id === str(p, "id"));
      if (!ep || ep.status !== "APPROVED") throw new OpError("NOT_CANCELLABLE");
      ep.status = "CANCELLED";
      audit(d, "exit.cancelled", "ExitPermit", ep.id, { actorId, reason: str(p, "reason") });
      bump(d);
      return ep;
    }
    case "scan":
      return scanAny(d, str(p, "code"), actorId);
    case "uvss.decide": {
      const uv = d.uvssScans.find((u) => u.id === str(p, "id"));
      if (!uv) throw new OpError("NOT_FOUND");
      uv.status = p.clear ? "CLEARED_BY_GUARD" : "ESCALATED";
      const v = findVisit(d, uv.visitId);
      if (p.clear && v && v.state === "HOLD" && v.holdReasons.includes("UVSS_SUSPECT")) {
        v.state = "READY_TO_EXIT";
        v.holdReasons = [];
        d.live.queueGateOut.push(v.id);
      }
      if (!p.clear) raiseAlert(d, "R35", { visitId: uv.visitId, detail: str(p, "note") || "ارجاع به حراست" });
      for (const a of d.alerts.filter((x) => x.visitId === uv.visitId && x.ruleCode === "R35" && x.status === "OPEN" && p.clear)) {
        a.status = "RESOLVED";
        a.resolvedAt = nowIso();
        a.resolution = str(p, "note") || "تأیید سالم توسط حراست";
      }
      audit(d, p.clear ? "uvss.cleared" : "uvss.escalated", "UvssScan", uv.id, { actorId, reason: str(p, "note") });
      bump(d);
      return uv;
    }
    case "alert.status":
      return ackAlert(d, str(p, "id"), str(p, "status") as T.AlertStatus, actorId, str(p, "note") || undefined);
    case "alert.rule": {
      const r = d.rules.find((x) => x.code === str(p, "code"));
      if (!r) throw new OpError("NOT_FOUND");
      if (typeof p.enabled === "boolean") r.enabled = p.enabled;
      if (p.params && typeof p.params === "object") r.params = { ...r.params, ...(p.params as Record<string, number>) };
      r.version++;
      audit(d, "rule.updated", "AlertRule", r.code, { actorId, data: { enabled: r.enabled, params: r.params, version: r.version } });
      bump(d);
      return r;
    }
    case "fraud.decide": {
      const f = d.fraudCases.find((x) => x.id === str(p, "id"));
      if (!f) throw new OpError("NOT_FOUND");
      f.status = str(p, "status") as T.FraudCase["status"];
      f.notes = str(p, "notes");
      audit(d, "fraud.decided", "FraudCase", f.id, { actorId, reason: f.notes, data: { status: f.status } });
      bump(d);
      return f;
    }
    case "queue.callNext": {
      const q = str(p, "lane") === "C" ? d.live.queueC : d.live.queueB;
      const vid = q[0];
      if (!vid) throw new OpError("QUEUE_EMPTY");
      const v = findVisit(d, vid)!;
      v.calledAt = nowIso();
      enqueueDemoSms(d, vid);
      log(d, "info", "QUEUE", `Driver #${v.queueNo} called to scale ${str(p, "lane") || "B"}`);
      audit(d, "queue.called", "Visit", vid, { actorId });
      bump(d);
      return v;
    }
    case "permit.status": {
      const pm = d.permits.find((x) => x.id === str(p, "id"));
      if (!pm) throw new OpError("NOT_FOUND");
      pm.status = str(p, "status") as T.PermitStatus;
      audit(d, "permit.status", "Permit", pm.id, { actorId, reason: str(p, "reason"), data: { status: pm.status } });
      bump(d);
      return pm;
    }
    case "permit.create": {
      const base = d.permits.find((x) => x.type === (str(p, "type") || "SALE")) ?? d.permits[0];
      const pm: T.Permit = { ...base, id: nextId(d, "PM"), permitNo: `${str(p, "type") === "PURCHASE" ? "PO" : "SO"}-1405-${String(5000 + (d.counters.PM ?? 0))}`, type: (str(p, "type") || "SALE") as T.PermitType, customerId: str(p, "customerId") || base.customerId, materialId: str(p, "materialId") || base.materialId, allowedKg: num(p, "allowedT") * 1000 || 500_000, consumedKg: 0, reservedKg: 0, tripsUsed: 0, validFrom: nowIso(), validTo: new Date(Date.now() + (num(p, "days") || 30) * 864e5).toISOString(), status: "ACTIVE", allowedVehicleIds: [] };
      d.permits.push(pm);
      audit(d, "permit.created", "Permit", pm.id, { actorId, data: { permitNo: pm.permitNo, allowedKg: pm.allowedKg } });
      bump(d);
      return pm;
    }
    case "master.update": {
      const col = str(p, "collection") as "vehicles" | "drivers" | "carriers" | "customers" | "materials";
      const list = d[col] as { id: string }[];
      const item = list?.find((x) => x.id === str(p, "id"));
      if (!item) throw new OpError("NOT_FOUND");
      const patch = (p.patch ?? {}) as Record<string, unknown>;
      const before: Record<string, unknown> = {};
      for (const k of Object.keys(patch)) before[k] = (item as Record<string, unknown>)[k];
      Object.assign(item, patch);
      audit(d, "master.updated", col, item.id, { actorId, data: { before, after: patch } });
      bump(d);
      return item;
    }
    case "calibration.add": {
      const scaleId = str(p, "scaleId");
      const rec: T.CalibrationRecord = { id: nextId(d, "CAL"), scaleId, certificateNo: str(p, "certificateNo") || `CAL-1405-${Math.floor(Math.random() * 9000 + 1000)}`, issuer: str(p, "issuer") || "آزمایشگاه مرجع اوزان (نمونه)", calibratedAt: nowIso(), validUntil: new Date(Date.now() + 365 * 864e5).toISOString(), testPoints: [0, 20000, 40000, 60000, 80000].map((ref) => ({ refKg: ref, readKg: ref, errorKg: 0 })), maxErrorKg: 20, documentHash: Math.random().toString(16).slice(2).padEnd(64, "0") };
      d.calibrations.push(rec);
      const sc = d.scales.find((s) => s.id === scaleId);
      if (sc) {
        sc.calibrationId = rec.id;
        if (sc.status === "LOCKED") sc.status = "READY";
      }
      audit(d, "calibration.added", "Scale", scaleId, { actorId, data: { certificateNo: rec.certificateNo } });
      bump(d);
      return rec;
    }
    case "qc.decide": {
      const tx = findTx(d, str(p, "txId"));
      if (!tx) throw new OpError("NOT_FOUND");
      tx.qcStatus = p.approve ? "APPROVED" : "QUARANTINE";
      audit(d, "qc.decided", "Transaction", tx.id, { actorId, data: { qc: tx.qcStatus } });
      bump(d);
      return tx;
    }
    case "device.toggle": {
      const dev = d.devices.find((x) => x.id === str(p, "id"));
      if (!dev) throw new OpError("NOT_FOUND");
      dev.status = dev.status === "OFFLINE" ? "ONLINE" : "OFFLINE";
      if (dev.status === "OFFLINE" && dev.type === "INDICATOR") raiseAlert(d, "R04", { deviceId: dev.id, detail: "خاموش شده از کنسول شبیه‌ساز" });
      log(d, dev.status === "OFFLINE" ? "error" : "info", dev.id, `device ${dev.status}`);
      audit(d, "device.toggled", "Device", dev.id, { actorId, data: { status: dev.status } });
      bump(d);
      return dev;
    }
    case "sim.scenario":
      runScenario(d, str(p, "code"), actorId);
      return { ok: true };
    case "sim.speed":
      d.live.speed = Math.max(1, Math.min(20, num(p, "speed") || 1));
      bump(d);
      return { speed: d.live.speed };
    case "sim.mode":
      d.live.mode = str(p, "mode") === "MANUAL" ? "MANUAL" : "AUTO";
      log(d, "info", "SIM", `Mode → ${d.live.mode}`);
      bump(d);
      return { mode: d.live.mode };
    case "sim.reset":
      resetDb();
      return { ok: true };
    case "audit.verify":
      return verifyChain(d.audit);
    case "audit.tamper": {
      const target = d.audit[Math.floor(d.audit.length / 2)];
      d.live.tamperedAuditSeq = target.seq;
      d.live.tamperedOriginal = JSON.stringify(target.data ?? null);
      target.data = { ...(target.data ?? {}), kg: 99999, tampered: true };
      return { seq: target.seq };
    }
    case "audit.restore": {
      const target = d.audit.find((a) => a.seq === d.live.tamperedAuditSeq);
      if (target) target.data = JSON.parse(d.live.tamperedOriginal ?? "null") ?? undefined;
      d.live.tamperedAuditSeq = undefined;
      return { ok: true };
    }
    case "report.schedule": {
      const m = enqueueOutbox(d, "EMAIL", `report.${str(p, "template")}.${Date.now()}`, str(p, "template") || "daily", `گزارش زمان‌بندی‌شده «${str(p, "template")}» — هر روز ساعت ${str(p, "time") || "07:00"}`, str(p, "email") || "manager@example.com");
      audit(d, "report.scheduled", "Report", str(p, "template"), { actorId, data: { email: str(p, "email") } });
      bump(d);
      return m;
    }
    case "day.close": {
      const day = new Date(Date.now() + 210 * 60000).toISOString().slice(0, 10);
      if (!d.live.closedDays.includes(day)) d.live.closedDays.push(day);
      audit(d, "day.closed", "DailyClose", day, { actorId });
      bump(d);
      return { day };
    }
    case "outbox.retry": {
      const m = d.outbox.find((x) => x.id === str(p, "id"));
      if (!m) throw new OpError("NOT_FOUND");
      m.status = "PENDING";
      m.createdAt = nowIso();
      audit(d, "outbox.replayed", "Outbox", m.id, { actorId });
      bump(d);
      return m;
    }
    case "driver.callOperator": {
      const v = d.visits.find((x) => x.driverToken === str(p, "token"));
      log(d, "warn", "INTERCOM", `Driver ${v ? "#" + v.queueNo : ""} requested operator call (lane ${str(p, "lane") || v?.laneCode || "?"})`);
      bump(d);
      return { ok: true };
    }
    case "driver.book": {
      const v = d.visits.find((x) => x.driverToken === str(p, "token"));
      log(d, "info", "BOOKING", `Slot ${str(p, "slot")} booked for ${v ? "#" + v.queueNo : "driver"}`);
      return { ok: true, slot: str(p, "slot") };
    }
    case "kiosk.print":
      log(d, "device", "PRN", `Kiosk receipt printed for ${str(p, "txId")}`);
      return { ok: true };
    case "demo.request":
      log(d, "info", "WEB", `Demo request from ${str(p, "company") || "visitor"}`);
      return { ok: true };
  }
  throw new OpError("UNKNOWN_ACTION");
}
