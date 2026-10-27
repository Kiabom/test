import type { AlertRule, Severity } from "./types";

type R = Omit<AlertRule, "enabled" | "version"> & { enabled?: boolean };

const RULES: R[] = [
  { code: "R01", name: "وزن ناپایدار", nameEn: "Unstable weight", condition: "!stable at capture", severity: "WARNING", action: "BLOCK_CAPTURE", params: { stableWindowMs: 3000 }, source: "All" },
  { code: "R02", name: "خوانش کهنه", nameEn: "Stale reading", condition: "ageMs > freshMs", severity: "WARNING", action: "BLOCK_CAPTURE", params: { freshMs: 12000 }, source: "WeighHub" },
  { code: "R03", name: "چرخ خارج باسکول", nameEn: "Wheel off deck", condition: "positionOk = false (IR / ROI)", severity: "HIGH", action: "BLOCK_CAPTURE", params: {}, source: "Metrici, Otomatik Kantar" },
  { code: "R04", name: "indicator آفلاین", nameEn: "Indicator offline", condition: "now − heartbeat > timeout", severity: "CRITICAL", action: "BLOCK_CAPTURE", params: { timeoutS: 10 }, source: "All" },
  { code: "R05", name: "مغایرت پلاک و RFID", nameEn: "Plate / RFID mismatch", condition: "ANPR vehicle ≠ RFID vehicle", severity: "CRITICAL", action: "HOLD_ENTRY", params: { minConfidence: 0.85 }, source: "Codeshilp, STAIN" },
  { code: "R06", name: "اطمینان پایین ANPR", nameEn: "Low ANPR confidence", condition: "confidence < min", severity: "WARNING", action: "REVIEW", params: { minConfidence: 0.85 }, source: "Codeshilp" },
  { code: "R07", name: "خودرو ناشناس", nameEn: "Unknown vehicle", condition: "plate/tag not in registry", severity: "HIGH", action: "HOLD_ENTRY", params: {}, source: "STAIN" },
  { code: "R08", name: "ورود مجدد بدون خروج", nameEn: "Anti-passback", condition: "re-entry without exit", severity: "HIGH", action: "HOLD_ENTRY", params: {}, source: "Smart Traffic" },
  { code: "R09", name: "عبور دو خودرو (tailgating)", nameEn: "Tailgating", condition: "2 vehicles per opening", severity: "CRITICAL", action: "ALARM", params: {}, source: "Smart Traffic" },
  { code: "R10", name: "باز شدن راهبند بدون فرمان", nameEn: "Uncommanded barrier open", condition: "barrier open w/o OPEN_REQUEST", severity: "CRITICAL", action: "ALARM", params: {}, source: "Otomatik Kantar" },
  { code: "R11", name: "حواله منقضی/باطل", nameEn: "Permit expired / revoked", condition: "outside validity or status≠ACTIVE", severity: "CRITICAL", action: "HOLD_EXIT", params: {}, source: "All" },
  { code: "R12", name: "اضافه‌برداشت حواله", nameEn: "Permit overdraw", condition: "net > remaining + tolerance", severity: "CRITICAL", action: "HOLD_EXIT", params: { toleranceKg: 200 }, source: "WBX" },
  { code: "R13", name: "مغایرت ماده با حواله", nameEn: "Material mismatch", condition: "tx.material ≠ permit.material", severity: "CRITICAL", action: "HOLD_EXIT", params: {}, source: "Punit, STAIN" },
  { code: "R14", name: "اضافه‌بار", nameEn: "Overweight", condition: "gross > min(GVW, capacity)", severity: "CRITICAL", action: "HOLD_EXIT", params: {}, source: "All" },
  { code: "R15", name: "وزن خالص منفی", nameEn: "Negative net", condition: "gross < tare", severity: "HIGH", action: "REVIEW", params: {}, source: "WeighHub" },
  { code: "R16", name: "تارای غیرعادی", nameEn: "Tare outlier", condition: "|tare − median(N)| > limit", severity: "WARNING", action: "REVIEW", params: { n: 10, limitKg: 600 }, source: "WeighHub" },
  { code: "R17", name: "تارای ذخیره منقضی", nameEn: "Stored tare expired", condition: "tareValidUntil < now", severity: "HIGH", action: "BLOCK_CAPTURE", params: {}, source: "Punit" },
  { code: "R18", name: "توزین تکراری", nameEn: "Duplicate weighing", condition: "same rawHash / vehicle in window", severity: "HIGH", action: "REVIEW", params: { windowMin: 5 }, source: "All" },
  { code: "R19", name: "سفر غیرممکن", nameEn: "Impossible trip", condition: "same plate at 2 points too fast", severity: "HIGH", action: "REVIEW", params: { minMinutes: 8 }, source: "WeighHub, WIS" },
  { code: "R20", name: "خالص‌های یکسان تکراری", nameEn: "Repeated identical net", condition: "same net ≥ count/day", severity: "WARNING", action: "REVIEW", params: { count: 3 }, source: "WeighHub" },
  { code: "R21", name: "نرخ ثبت دستی بالا", nameEn: "High manual entry rate", condition: "operator manual share > pct", severity: "WARNING", action: "REVIEW", params: { pct: 10 }, source: "WeighHub" },
  { code: "R22", name: "کار خارج از ساعت", nameEn: "Off-hours activity", condition: "tx in restricted hours", severity: "WARNING", action: "REVIEW", params: { fromHour: 0, toHour: 5 }, source: "WeighHub" },
  { code: "R23", name: "تصویر ناقص", nameEn: "Missing evidence", condition: "required cameras missing", severity: "HIGH", action: "REVIEW", params: { requiredCams: 3 }, source: "WIS, STAIN" },
  { code: "R24", name: "فریم دوربین کهنه", nameEn: "Stale camera frame", condition: "frameAge > limit", severity: "WARNING", action: "NOTIFY", params: { limitS: 5 }, source: "Punit" },
  { code: "R25", name: "تعویض پلاک/تریلر در سفر", nameEn: "Plate / trailer swap", condition: "identity W2 ≠ W1", severity: "CRITICAL", action: "HOLD_EXIT", params: {}, source: "STAIN, Punit" },
  { code: "R26", name: "گواهی کالیبراسیون منقضی", nameEn: "Calibration expired", condition: "now > validUntil", severity: "CRITICAL", action: "LOCK_LEGAL", params: { warnDays: 30 }, source: "All" },
  { code: "R27", name: "رانش صفر", nameEn: "Zero drift", condition: "|zero| > limit (OEM)", severity: "HIGH", action: "MAINTENANCE", params: { limitKg: 40 }, source: "Mettler, Rice Lake" },
  { code: "R28", name: "عدم تعادل/نویز لودسل", nameEn: "Load-cell imbalance / noise", condition: "junction box diagnostic", severity: "HIGH", action: "MAINTENANCE", params: {}, source: "Mettler, Rice Lake" },
  { code: "R29", name: "ماندگاری طولانی", nameEn: "Long stay", condition: "now − arrivedAt > limit", severity: "WARNING", action: "NOTIFY", params: { limitMin: 120 }, source: "All" },
  { code: "R30", name: "ازدحام صف", nameEn: "Queue congestion", condition: "queue length > max", severity: "WARNING", action: "NOTIFY", params: { maxQueue: 8 }, source: "STAIN" },
  { code: "R31", name: "مغایرت حجم و وزن", nameEn: "Volume / mass mismatch", condition: "|ρV − net|/net > tol", severity: "INFO", action: "REVIEW", params: { tolPct: 12 }, source: "LASE, Loadscan" },
  { code: "R32", name: "بار خارج از مرکز", nameEn: "Off-centre load", condition: "offCenterPct > limit", severity: "WARNING", action: "NOTIFY", params: { limitPct: 15 }, source: "Otomatik Kantar" },
  { code: "R33", name: "بار باقی‌مانده (carryback)", nameEn: "Carryback", condition: "empty scan residual > limit", severity: "WARNING", action: "REVIEW", params: { limitM3: 0.5 }, source: "Otomatik Kantar" },
  { code: "R34", name: "اختلاف payload و باسکول", nameEn: "Payload vs scale variance", condition: "|payload − net|/net > tol", severity: "WARNING", action: "REVIEW", params: { tolPct: 8 }, source: "LOADRITE" },
  { code: "R35", name: "ناهنجاری زیر خودرو (UVSS)", nameEn: "Under-vehicle anomaly", condition: "anomaly score > limit", severity: "HIGH", action: "HOLD_EXIT", params: { score: 0.7 }, source: "Proposed" },
  { code: "R36", name: "استفاده مجدد QR خروج", nameEn: "Exit QR reuse", condition: "consumed token scanned again", severity: "CRITICAL", action: "ALARM", params: {}, source: "WeighHub" },
  { code: "R37", name: "صف همگام‌سازی کهنه", nameEn: "Stale sync queue", condition: "oldest outbox > maxAge", severity: "HIGH", action: "NOTIFY", params: { maxAgeMin: 30 }, source: "All" },
  { code: "R38", name: "اختلاف ساعت دستگاه", nameEn: "Device clock skew", condition: "|device − server| > limit", severity: "WARNING", action: "NOTIFY", params: { limitS: 5 }, source: "STAIN" },
  { code: "R39", name: "Override بدون امضای دوم", nameEn: "Override without 2nd signature", condition: "manual change w/o approval", severity: "CRITICAL", action: "REVIEW", params: {}, source: "All" },
  { code: "R40", name: "قرنطینه ماده (QC)", nameEn: "Material quarantine (QC)", condition: "QC result missing", severity: "HIGH", action: "HOLD_EXIT", params: {}, source: "STAIN" },
];

export function defaultRules(): AlertRule[] {
  return RULES.map((r) => ({ ...r, enabled: r.enabled ?? true, version: 1 }));
}

export const SLA_MINUTES: Record<Severity, number> = { CRITICAL: 15, HIGH: 60, WARNING: 240, INFO: 1440 };

export const SEVERITY_ORDER: Record<Severity, number> = { CRITICAL: 0, HIGH: 1, WARNING: 2, INFO: 3 };
