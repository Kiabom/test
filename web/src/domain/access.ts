import { can, type Permission } from "./rbac";
import type { RoleCode } from "./types";

type Rule = { prefix: string; any?: Permission[]; roles?: RoleCode[] };

/** Which pages each role may open. A page is visible when the role has any of the listed permissions. */
export const PAGE_ACCESS: Rule[] = [
  { prefix: "/app/process", roles: ["system_admin", "site_manager"] },
  { prefix: "/app/live", any: ["gate.decide", "weigh.capture"] },
  { prefix: "/app/map", any: ["report.read"] },
  { prefix: "/app/gate", any: ["gate.decide"] },
  { prefix: "/app/weighing", any: ["weigh.capture"] },
  { prefix: "/app/scan", any: ["weigh.capture"] },
  { prefix: "/app/queue", any: ["weigh.capture", "permit.manage"] },
  { prefix: "/app/transactions", any: ["tx.print", "report.read"] },
  { prefix: "/app/exit-permits", any: ["exit.issue", "exit.scan"] },
  { prefix: "/app/guard", any: ["exit.scan"] },
  { prefix: "/app/permits", any: ["permit.manage"] },
  { prefix: "/app/alerts", any: ["alert.manage"] },
  { prefix: "/app/fraud", any: ["fraud.review"] },
  { prefix: "/app/audit", any: ["audit.read"] },
  { prefix: "/app/modules", any: ["report.read"] },
  { prefix: "/app/stockpiles", any: ["report.read"] },
  { prefix: "/app/devices", any: ["calibration.edit", "admin.manage"] },
  { prefix: "/app/hardware", any: ["calibration.edit", "admin.manage"] },
  { prefix: "/app/site-map", any: ["calibration.edit", "admin.manage"] },
  { prefix: "/app/reports", any: ["report.read"] },
  { prefix: "/app/billing", any: ["billing.read"] },
  { prefix: "/app/masters", any: ["master.edit", "permit.manage"] },
  { prefix: "/app/integrations", any: ["admin.manage"] },
  { prefix: "/app/notifications", any: ["admin.manage", "alert.manage"] },
  { prefix: "/app/admin", any: ["admin.manage", "driver.assign"] },
  { prefix: "/app/console", any: ["sim.control"] },
  // driver displays, kiosk, wallboard (opened from the side menu)
  { prefix: "/d", roles: ["system_admin", "site_manager"] },
  { prefix: "/display", roles: ["system_admin", "site_manager"] },
  { prefix: "/kiosk", roles: ["system_admin", "site_manager"] },
  { prefix: "/wallboard", roles: ["system_admin", "site_manager"] },
];

export function canSee(role: RoleCode | undefined, href: string): boolean {
  if (!role) return false;
  const path = href.split("?")[0];
  const rule = PAGE_ACCESS.find((r) => path === r.prefix || path.startsWith(r.prefix + "/"));
  if (!rule) return true; // /app dashboard and anything not listed
  if (rule.roles && !rule.roles.includes(role)) return false;
  if (rule.any && !rule.any.some((p) => can(role, p))) return false;
  return true;
}

/** Landing page after sign-in. */
export const HOME_FOR_ROLE: Partial<Record<RoleCode, string>> = {
  gate_guard: "/app/guard",
  scale_operator: "/app/weighing",
  logistics: "/app/queue",
  maintenance: "/app/devices",
  auditor: "/app/audit",
  finance: "/app/billing",
  fleet_manager: "/app/map",
};
export const homeFor = (role: RoleCode | undefined) => (role && HOME_FOR_ROLE[role]) || "/app";
