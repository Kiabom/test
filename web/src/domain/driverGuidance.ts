import type { LaneLive, Visit } from "./types";

export type GuidanceTone = "go" | "wait" | "stop" | "idle";
export interface Guidance {
  code: string;
  fa: string;
  en: string;
  tone: GuidanceTone;
  light: "RED" | "YELLOW" | "GREEN" | "OFF";
}

const g = (code: string, fa: string, en: string, tone: GuidanceTone, light: Guidance["light"]): Guidance => ({ code, fa, en, tone, light });

/**
 * Single source of truth for driver instructions — used by the outdoor display, the kiosk
 * and the mobile driver portal so all three always say the same thing.
 */
export function guidanceFor(visit: Visit | undefined, lane?: LaneLive, extra?: { loadPoint?: string; queuePos?: number }): Guidance {
  if (lane && lane.kind === "SCALE") {
    if (lane.locked) return g("SCALE_LOCKED", "⛔ باسکول از سرویس خارج است — به باسکول دیگر مراجعه کنید", "⛔ Scale out of service — use the other scale", "stop", "RED");
    if (!lane.visitId || !visit) return g("SCALE_FREE", "باسکول آزاد — منتظر خودرو بعدی", "Scale free — waiting for next truck", "idle", "GREEN");
    if (visit.state === "HOLD") return g("HOLD", "⏸ لطفاً منتظر بمانید — با اپراتور تماس بگیرید", "⏸ Please wait — contact the operator", "stop", "RED");
    switch (lane.phase) {
      case "APPROACH":
        return g("APPROACH", "آهسته جلو بیایید و روی باسکول بایستید", "Drive forward slowly onto the scale", "wait", "YELLOW");
      case "POSITION_BAD":
        return g("POSITION_BAD", "⛔ چرخ عقب خارج از باسکول است — کمی جلو بروید", "⛔ Rear wheels off the deck — move forward a little", "stop", "RED");
      case "SETTLING":
        return g("WEIGHING", "توقف کامل — ترمز دستی — در حال توزین…", "Stop completely — handbrake on — weighing…", "wait", "RED");
      case "STABLE":
        return g("STABLE", "وزن پایدار شد — منتظر ثبت اپراتور", "Weight stable — waiting for operator", "wait", "RED");
      case "CAPTURED":
        if (visit.state === "LOADING" || visit.state === "ON_SCALE_1")
          return g("CAPTURED_FIRST", `✓ وزن ثبت شد — به محل بارگیری ${extra?.loadPoint ?? ""} بروید`, `✓ Weight recorded — proceed to loading point ${extra?.loadPoint ?? ""}`, "go", "GREEN");
        return g("CAPTURED_SECOND", "✓ وزن دوم ثبت شد — به دروازه خروج بروید", "✓ Second weight recorded — proceed to the exit gate", "go", "GREEN");
      case "LEAVING":
        return g("LEAVING", "✓ باسکول را ترک کنید", "✓ Please leave the scale", "go", "GREEN");
    }
  }
  if (lane && (lane.kind === "GATE_IN" || lane.kind === "GATE_OUT")) {
    if (!lane.visitId || !visit) return g("GATE_FREE", lane.kind === "GATE_IN" ? "دروازه ورود — لطفاً جلوی راهبند توقف کنید" : "دروازه خروج — QR مجوز خروج را آماده کنید", lane.kind === "GATE_IN" ? "Entry gate — stop at the barrier" : "Exit gate — have your exit QR ready", "idle", "RED");
    if (lane.decision === "PASS" && (lane.barrier === "OPEN" || lane.barrier === "OPENING"))
      return lane.kind === "GATE_IN"
        ? g("GATE_PASS", "✓ ورود مجاز — به صف باسکول بروید", "✓ Entry approved — proceed to the scale queue", "go", "GREEN")
        : g("GATE_EXIT", "✓ خروج مجاز — سفر بخیر", "✓ Exit approved — safe travels", "go", "GREEN");
    if (lane.decision === "BLOCK") return g("GATE_DENY", "⛔ عبور مجاز نیست — به اتاق حراست مراجعه کنید", "⛔ Not authorised — report to security", "stop", "RED");
    if (lane.decision === "HOLD" || lane.decision === "REVIEW") return g("GATE_HOLD", "⏸ در حال بررسی توسط حراست — لطفاً منتظر بمانید", "⏸ Security review in progress — please wait", "stop", "RED");
    return g("GATE_IDENTIFY", "در حال شناسایی پلاک و کارت… توقف کنید", "Identifying plate and tag… please stop", "wait", "YELLOW");
  }
  // portal / generic — by visit state
  if (!visit) return g("NONE", "سفر فعالی یافت نشد", "No active trip", "idle", "OFF");
  switch (visit.state) {
    case "EXPECTED":
      return g("EXPECTED", "نوبت شما رزرو شده — در زمان اسلات به دروازه مراجعه کنید", "Slot booked — come to the gate at your slot time", "idle", "OFF");
    case "ARRIVED":
    case "IDENTIFIED":
      return g("AT_GATE", "در دروازه ورود — منتظر تأیید باشید", "At the entry gate — waiting for approval", "wait", "YELLOW");
    case "IN_SITE":
      if (visit.transactionIds.length && visit.prevState === "LOADING")
        return g("TO_SCALE_2", "به باسکول خروجی بروید", "Proceed to the outbound scale", "go", "GREEN");
      return g("IN_QUEUE", `در صف باسکول — نفر ${extra?.queuePos ?? "?"} — منتظر فراخوان بمانید`, `In scale queue — position ${extra?.queuePos ?? "?"} — wait for call`, "wait", "YELLOW");
    case "ON_SCALE_1":
    case "ON_SCALE_2":
      if (!visit.laneCode)
        return g("AWAIT_DOCS", "✓ توزین انجام شد — منتظر صدور تیکت و مجوز خروج بمانید", "✓ Weighing done — waiting for ticket and exit permit", "wait", "YELLOW");
      return g("ON_SCALE", "روی باسکول — توقف کامل — در حال توزین", "On the scale — stop completely — weighing", "wait", "RED");
    case "LOADING":
      return g("LOADING", `در حال بارگیری ${extra?.loadPoint ? "در " + extra.loadPoint : ""} — سپس به باسکول خروجی بروید`, `Loading ${extra?.loadPoint ? "at " + extra.loadPoint : ""} — then go to the outbound scale`, "go", "GREEN");
    case "READY_TO_EXIT":
      return g("READY_EXIT", "✓ مجوز خروج آماده است — QR را در دروازه خروج نشان دهید", "✓ Exit permit ready — show the QR at the exit gate", "go", "GREEN");
    case "EXITED":
      return g("EXITED", "✓ خروج ثبت شد — سفر بخیر", "✓ Exit recorded — safe travels", "go", "GREEN");
    case "HOLD":
      return g("HOLD", "⏸ سفر شما متوقف شده — با اپراتور تماس بگیرید", "⏸ Your trip is on hold — contact the operator", "stop", "RED");
    case "REJECTED":
    case "CANCELLED":
      return g("REJECTED", "⛔ ورود رد شد — به اتاق حراست مراجعه کنید", "⛔ Entry rejected — report to security", "stop", "RED");
  }
}
