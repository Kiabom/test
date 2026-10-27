import type { Transaction, Visit } from "./types";

export function median(xs: number[]): number | null {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export function percentile(xs: number[], p: number): number | null {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const idx = Math.min(s.length - 1, Math.max(0, Math.ceil((p / 100) * s.length) - 1));
  return s[idx];
}

export function avg(xs: number[]): number | null {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
}

const minutes = (a: string, b: string) => (new Date(b).getTime() - new Date(a).getTime()) / 60000;

export function turnaroundMinutes(visits: Visit[]): number[] {
  return visits.filter((v) => v.exitedAt).map((v) => minutes(v.arrivedAt, v.exitedAt!));
}

export function queueWaitMinutes(visits: Visit[]): number[] {
  return visits.filter((v) => v.queueJoinedAt && v.calledAt).map((v) => minutes(v.queueJoinedAt!, v.calledAt!));
}

export function tons(kg: number | null | undefined): number | null {
  return kg == null ? null : kg / 1000;
}

export function sumNet(txs: Transaction[], filter: (t: Transaction) => boolean): number {
  return txs.filter((t) => t.state === "APPROVED" && t.netKg != null && filter(t)).reduce((s, t) => s + (t.netKg ?? 0), 0);
}

export interface DashboardKpis {
  outboundT: number | null;
  inboundT: number | null;
  internalT: number | null;
  netApprovedT: number | null;
  tripsCompleted: number;
  onSite: number;
  pendingTickets: number;
  turnaroundP50: number | null;
  turnaroundP90: number | null;
  queueAvg: number | null;
  overloadRatePct: number | null;
  anprReviewRatePct: number | null;
  avgPayloadT: number | null;
  holdCount: number;
}

export function computeKpis(txs: Transaction[], visits: Visit[]): DashboardKpis {
  const approved = txs.filter((t) => t.state === "APPROVED");
  const out = sumNet(txs, (t) => t.operation === "DISPATCH" || t.operation === "TRANSFER");
  const inn = sumNet(txs, (t) => t.operation === "RECEIVE");
  const internal = sumNet(txs, (t) => t.operation === "INTERNAL");
  const ta = turnaroundMinutes(visits);
  const qw = queueWaitMinutes(visits);
  const evaluable = txs.filter((t) => t.grossKg != null);
  const overloaded = evaluable.filter((t) => t.holdReasons.includes("R14"));
  const withAnpr = visits.filter((v) => v.identity.anpr);
  const reviewed = withAnpr.filter((v) => (v.identity.anpr?.confidence ?? 1) < 0.85 || v.identity.match === "MISMATCH");
  const nets = approved.filter((t) => t.operation !== "INTERNAL").map((t) => t.netKg ?? 0);
  return {
    outboundT: approved.length ? out / 1000 : null,
    inboundT: approved.length ? inn / 1000 : null,
    internalT: approved.length ? internal / 1000 : null,
    netApprovedT: approved.length ? (out + inn + internal) / 1000 : null,
    tripsCompleted: visits.filter((v) => v.state === "EXITED").length,
    onSite: visits.filter((v) => !["EXITED", "REJECTED", "CANCELLED", "EXPECTED"].includes(v.state)).length,
    pendingTickets: txs.filter((t) => ["DRAFT", "FIRST_CAPTURED", "SECOND_CAPTURED", "RECONCILED", "EXCEPTION"].includes(t.state)).length,
    turnaroundP50: median(ta),
    turnaroundP90: percentile(ta, 90),
    queueAvg: avg(qw),
    overloadRatePct: evaluable.length ? (overloaded.length / evaluable.length) * 100 : null,
    anprReviewRatePct: withAnpr.length ? (reviewed.length / withAnpr.length) * 100 : null,
    avgPayloadT: nets.length ? avg(nets)! / 1000 : null,
    holdCount: visits.filter((v) => v.state === "HOLD").length,
  };
}

export function volumeCrossCheckPct(netKg: number, volumeM3: number, densityKgM3: number): number | null {
  if (!netKg) return null;
  return (100 * Math.abs(volumeM3 * densityKgM3 - netKg)) / netKg;
}

export function payloadVariancePct(payloadKg: number, netKg: number): number | null {
  if (!netKg) return null;
  return (100 * (payloadKg - netKg)) / netKg;
}
