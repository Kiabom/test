"use client";
import { useEffect, useRef, useState } from "react";
import { cx } from "@/components/ui";

type Kind = "phone" | "laptop" | "monitor" | "kiosk";
const SIZE: Record<Kind, [number, number]> = { phone: [390, 844], laptop: [1440, 900], monitor: [1920, 1080], kiosk: [1080, 1920] };
const BEZEL: Record<Kind, { cls: string; x: number; y: number; extra: number }> = {
  phone: { cls: "rounded-[2.4rem] border-[10px] border-slate-900 bg-slate-900", x: 20, y: 20, extra: 0 },
  laptop: { cls: "rounded-t-xl border-[10px] border-b-[14px] border-slate-800 bg-slate-800", x: 20, y: 24, extra: 12 },
  monitor: { cls: "rounded-lg border-[14px] border-black bg-black", x: 28, y: 28, extra: 32 },
  kiosk: { cls: "rounded-2xl border-[16px] border-slate-700 bg-slate-700", x: 32, y: 32, extra: 0 },
};

/**
 * A real page of the app inside a device bezel. `fit="width"` (default) scales to the available
 * width and takes its natural height; `fit="contain"` fits inside a box that already has a height
 * (slides, fixed-height cards). Uses layout size, so it also works inside the scaled slide canvas.
 */
export function DeviceFrame({ src, kind, className, label, eager, fit = "width" }: { src: string; kind: Kind; className?: string; label?: string; eager?: boolean; fit?: "width" | "contain" }) {
  const [w, h] = SIZE[kind];
  const b = BEZEL[kind];
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const labelH = label ? 28 : 0;
    const ro = new ResizeObserver(([e]) => {
      const sw = (e.contentRect.width - b.x) / w;
      const sh = fit === "contain" ? (e.contentRect.height - b.y - b.extra - labelH) / h : Infinity;
      setScale(Math.max(0.05, Math.min(sw, sh)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, h, b, fit, label]);
  const device = scale > 0 && (
    <div className="flex flex-col items-center">
      <div className={cx(b.cls, "shadow-2xl")}>
        <div className="relative overflow-hidden bg-white" style={{ width: w * scale, height: h * scale }}>
          <iframe title={label ?? src} src={src} loading={eager ? "eager" : "lazy"} className="absolute top-0 border-0" style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: "0 0", left: 0, right: "auto" }} />
        </div>
      </div>
      {kind === "laptop" && <div className="h-3 rounded-b-xl bg-slate-400" style={{ width: (w * scale + b.x) * 1.1 }} />}
      {kind === "monitor" && (
        <>
          <div className="h-6 w-10 bg-slate-700" />
          <div className="h-2 w-40 rounded-full bg-slate-600" />
        </>
      )}
      {label && <div className="mt-2 text-center text-sm font-semibold text-muted">{label}</div>}
    </div>
  );
  return fit === "contain" ? (
    <div ref={box} className={cx("relative h-full w-full", className)}>
      <div className="absolute inset-0 flex items-start justify-center">{device}</div>
    </div>
  ) : (
    <div ref={box} className={cx("flex w-full justify-center", className)}>
      {device}
    </div>
  );
}
