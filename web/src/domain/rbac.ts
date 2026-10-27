import type { RoleCode } from "./types";

export type Permission =
  | "gate.decide"
  | "gate.guest"
  | "weigh.capture"
  | "weigh.manual"
  | "tx.finalize"
  | "tx.void"
  | "tx.print"
  | "exit.issue"
  | "exit.scan"
  | "permit.manage"
  | "master.edit"
  | "alert.manage"
  | "fraud.review"
  | "calibration.edit"
  | "report.read"
  | "billing.read"
  | "audit.read"
  | "admin.manage"
  | "sim.control";

export const ROLES: { code: RoleCode; name: string; nameEn: string }[] = [
  { code: "system_admin", name: "مدیر سامانه", nameEn: "System admin" },
  { code: "site_manager", name: "مدیر سایت", nameEn: "Site manager" },
  { code: "scale_operator", name: "اپراتور باسکول", nameEn: "Scale operator" },
  { code: "gate_guard", name: "حراست / نگهبان", nameEn: "Gate guard" },
  { code: "logistics", name: "کارشناس حمل", nameEn: "Logistics" },
  { code: "sales", name: "فروش و بازرگانی", nameEn: "Sales" },
  { code: "qc", name: "آزمایشگاه / QC", nameEn: "Quality control" },
  { code: "maintenance", name: "تعمیرات و کالیبراسیون", nameEn: "Maintenance" },
  { code: "auditor", name: "حسابرس", nameEn: "Auditor" },
  { code: "fleet_manager", name: "مدیر ناوگان", nameEn: "Fleet manager" },
  { code: "finance", name: "مالی", nameEn: "Finance" },
  { code: "driver", name: "راننده", nameEn: "Driver" },
];

export const MATRIX: Record<RoleCode, Permission[]> = {
  system_admin: ["gate.decide", "gate.guest", "weigh.capture", "weigh.manual", "tx.finalize", "tx.void", "tx.print", "exit.issue", "exit.scan", "permit.manage", "master.edit", "alert.manage", "fraud.review", "calibration.edit", "report.read", "billing.read", "audit.read", "admin.manage", "sim.control"],
  site_manager: ["gate.decide", "gate.guest", "weigh.capture", "weigh.manual", "tx.finalize", "tx.void", "tx.print", "exit.issue", "exit.scan", "permit.manage", "alert.manage", "fraud.review", "report.read", "billing.read", "audit.read", "sim.control"],
  scale_operator: ["weigh.capture", "tx.finalize", "tx.print", "exit.issue", "alert.manage", "report.read"],
  gate_guard: ["gate.decide", "gate.guest", "exit.scan", "alert.manage"],
  logistics: ["permit.manage", "report.read"],
  sales: ["permit.manage", "report.read", "billing.read"],
  qc: ["report.read", "alert.manage"],
  maintenance: ["calibration.edit", "alert.manage", "report.read"],
  auditor: ["report.read", "audit.read", "billing.read"],
  fleet_manager: ["report.read"],
  finance: ["billing.read", "report.read"],
  driver: [],
};

export function can(role: RoleCode, perm: Permission): boolean {
  return MATRIX[role]?.includes(perm) ?? false;
}

export const ALL_PERMISSIONS = MATRIX.system_admin;
