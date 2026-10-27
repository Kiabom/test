"use client";
import { cx } from "@/components/ui";
import { fmtNum } from "@/lib/format";
import { useL, useLocale } from "@/lib/prefs";

/** Weight readout — "led" mimics a seven-segment indicator, "modern" is the operator UI style. */
export function WeightDisplay({ kg, stable, motion, zero, online = true, ageMs, variant = "modern", size = "lg", color, live = true, className }: {
  kg: number | null | undefined;
  stable?: boolean;
  motion?: boolean;
  zero?: boolean;
  online?: boolean;
  ageMs?: number;
  variant?: "modern" | "led" | "classic";
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
  live?: boolean;
  className?: string;
}) {
  const L = useL();
  const locale = useLocale();
  const fresh = ageMs != null && ageMs < 12000;
  const txt = kg == null || !online ? "------" : Math.round(kg).toLocaleString("en-US");
  const fs = { sm: "text-3xl", md: "text-5xl", lg: "text-7xl", xl: "text-[9rem] leading-none" }[size];
  if (variant === "led" || variant === "classic") {
    const c = color ?? (variant === "classic" ? "#ffd43b" : !online ? "#555" : stable ? "#22ff88" : "#ff3b3b");
    return (
      <div className={cx("rounded-xl border-4 border-zinc-700 bg-[#050505] px-5 py-3 shadow-inner", className)}>
        <div className="flex items-center justify-between gap-3 text-[10px] font-bold tracking-wider text-zinc-500 ltr">
          <span className={cx(stable && online && "text-emerald-400")}>● STABLE</span>
          <span className={cx(motion && online && "text-red-400")}>● MOTION</span>
          <span className={cx(zero && online && "text-amber-300")}>● ZERO</span>
          <span className={cx(online ? "text-sky-400" : "text-red-500")}>{online ? "● LINK" : "○ NO LINK"}</span>
        </div>
        <div className={cx("led text-end", fs)} style={{ color: c }}>
          {txt}
          <span className="ms-2 text-[0.35em] text-zinc-400">kg</span>
        </div>
      </div>
    );
  }
  return (
    <div className={cx("relative rounded-2xl border-2 bg-surface px-5 py-4", live ? "border-dashed border-primary/40" : "border-solid border-wn", className)}>
      <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
        {live ? (
          <span className="inline-flex items-center gap-1 font-semibold text-primary">
            <span className="relative flex size-2">
              <span className="ping-soft absolute inline-flex size-full rounded-full bg-primary" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            {L("زنده", "LIVE")}
          </span>
        ) : (
          <span className="font-semibold text-wn">🔒 {L("ثبت‌شده", "Recorded")}</span>
        )}
        {online ? (
          <>
            <span className={cx("rounded px-1.5 py-0.5 font-bold", stable ? "bg-success/12 text-success" : "bg-danger/10 text-danger")}>{stable ? "STABLE" : "MOTION"}</span>
            {zero && <span className="rounded bg-warning/12 px-1.5 py-0.5 font-bold text-warning">ZERO</span>}
            {ageMs != null && <span className={cx("rounded px-1.5 py-0.5 font-bold", fresh ? "bg-info/10 text-info" : "bg-danger/10 text-danger")}>{fresh ? "FRESH" : "STALE"} {fmtNum(ageMs / 1000, locale, { maximumFractionDigits: 1 })}s</span>}
          </>
        ) : (
          <span className="rounded bg-offline/20 px-1.5 py-0.5 font-bold text-muted">{L("indicator آفلاین — آخرین مقدار", "Indicator offline — last value")}</span>
        )}
      </div>
      <div className={cx("num font-black tracking-tight", fs, !online && "text-muted", online && !stable && "text-danger/90")} aria-live="polite">
        {txt}
        <span className="ms-2 text-[0.3em] font-semibold text-muted">kg</span>
      </div>
    </div>
  );
}

export function TrafficLight({ state, size = 22, horizontal }: { state: "RED" | "YELLOW" | "GREEN" | "OFF" | undefined; size?: number; horizontal?: boolean }) {
  const lamp = (c: string, on: boolean) => (
    <span className="rounded-full border border-black/40" style={{ width: size, height: size, background: on ? c : "#1f2933", boxShadow: on ? `0 0 ${size * 0.8}px ${c}` : "inset 0 0 4px #000" }} />
  );
  return (
    <span className={cx("inline-flex gap-1.5 rounded-lg bg-zinc-900 p-1.5", horizontal ? "flex-row" : "flex-col")} aria-label={`light ${state}`}>
      {lamp("#ff3b3b", state === "RED")}
      {lamp("#ffb000", state === "YELLOW")}
      {lamp("#22ff88", state === "GREEN")}
    </span>
  );
}

export function BarrierIcon({ state, ack, width = 120 }: { state: "CLOSED" | "OPENING" | "OPEN" | "CLOSING" | "FAULT" | undefined; ack?: boolean; width?: number }) {
  const angle = state === "OPEN" ? -80 : state === "OPENING" || state === "CLOSING" ? -40 : 0;
  return (
    <svg width={width} height={width * 0.5} viewBox="0 0 120 60" aria-label={`barrier ${state}`}>
      <rect x="4" y="22" width="16" height="36" rx="2" fill="#495057" />
      <rect x="2" y="54" width="20" height="5" fill="#343a40" />
      <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: "12px 28px", transition: "transform .8s ease" }}>
        <rect x="12" y="25" width="104" height="7" rx="3" fill="#fff" stroke="#343a40" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={22 + i * 20} y="25" width="10" height="7" fill="#e03131" />
        ))}
      </g>
      <circle cx="12" cy="28" r="4" fill={state === "FAULT" ? "#e03131" : ack ? "#2f9e44" : "#f59f00"} />
    </svg>
  );
}

export function LiveDot({ on = true, tone = "success" }: { on?: boolean; tone?: "success" | "danger" | "warning" }) {
  const c = { success: "bg-success", danger: "bg-danger", warning: "bg-warning" }[tone];
  return (
    <span className="relative inline-flex size-2.5">
      {on && <span className={cx("ping-soft absolute inline-flex size-full rounded-full", c)} />}
      <span className={cx("relative inline-flex size-2.5 rounded-full", on ? c : "bg-offline")} />
    </span>
  );
}
