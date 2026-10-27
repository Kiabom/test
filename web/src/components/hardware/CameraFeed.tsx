"use client";
import { useId } from "react";
import { cx } from "@/components/ui";
import type { Plate } from "@/domain/types";
import { fmtTime } from "@/lib/format";
import { useLocale } from "@/lib/prefs";
import { TruckArt } from "./Truck";

export type CamView = "front" | "rear" | "side" | "top" | "overview" | "license" | "empty";

function prng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Simulated CCTV/ANPR frame: original SVG scene + grain + scanlines + overlays.
 * Deterministic for a given seed so evidence thumbnails never change.
 */
export function CameraFeed({
  view,
  plate,
  loaded,
  color,
  seed = 1,
  label,
  at,
  confidence,
  showBox = true,
  night,
  offline,
  roi,
  covered,
  className,
  compact,
  rec = true,
}: {
  view: CamView;
  plate?: Plate;
  loaded?: boolean;
  color?: string;
  seed?: number;
  label?: string;
  at?: string | number;
  confidence?: number;
  showBox?: boolean;
  night?: boolean;
  offline?: boolean;
  roi?: "ok" | "bad";
  covered?: boolean;
  className?: string;
  compact?: boolean;
  rec?: boolean;
}) {
  const locale = useLocale();
  const uid = useId().replace(/[:]/g, "");
  const r = prng(seed);
  const dx = (r() - 0.5) * 30;
  const dust = r() * 0.25 + 0.05;
  const isNight = night ?? false;
  const boxColor = confidence == null ? "#22c55e" : confidence >= 0.85 ? "#22c55e" : confidence >= 0.6 ? "#facc15" : "#ef4444";

  return (
    <div className={cx("scanlines relative overflow-hidden rounded-lg bg-black", className)} style={{ aspectRatio: "16 / 10" }}>
      {offline ? (
        <div className="absolute inset-0 grid place-items-center bg-[repeating-linear-gradient(45deg,#111_0_10px,#1a1a1a_10px_20px)]">
          <div className="text-center font-mono text-sm text-zinc-400">
            <div className="text-lg font-bold text-red-400">NO SIGNAL</div>
            <div>{label}</div>
            {at && <div className="text-xs">last frame {fmtTime(at, "en", true)}</div>}
          </div>
        </div>
      ) : (
        <svg viewBox="0 0 400 250" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" style={{ filter: isNight ? "grayscale(1) brightness(1.15) contrast(1.2)" : undefined }}>
          <defs>
            <linearGradient id={`sky${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={isNight ? "#0b1020" : "#9ec5e8"} />
              <stop offset="1" stopColor={isNight ? "#1b2235" : "#dfe9f2"} />
            </linearGradient>
            <linearGradient id={`gnd${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#b08b67" />
              <stop offset="1" stopColor="#8a6a4d" />
            </linearGradient>
            <filter id={`grain${uid}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed % 100} />
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncA type="linear" slope={0.18 + dust} />
              </feComponentTransfer>
              <feBlend in="SourceGraphic" mode="multiply" />
            </filter>
            <radialGradient id={`vig${uid}`} cx="0.5" cy="0.5" r="0.75">
              <stop offset="0.6" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor="#000" stopOpacity="0.55" />
            </radialGradient>
          </defs>
          {view === "top" || view === "license" ? null : (
            <>
              <rect width="400" height="150" fill={`url(#sky${uid})`} />
              <rect y="150" width="400" height="100" fill={`url(#gnd${uid})`} />
              <rect x="0" y="146" width="400" height="6" fill="#6b5640" opacity="0.5" />
            </>
          )}

          {view === "front" && (
            <g>
              <rect x="30" y="40" width="10" height="130" fill="#495057" />
              <rect x="360" y="40" width="10" height="130" fill="#495057" />
              <rect x="30" y="34" width="340" height="12" fill="#ffd43b" stroke="#495057" />
              <g transform={`translate(${110 + dx} 34) scale(0.95)`}>
                <TruckArt view="front" color={color} plate={plate} loaded={loaded} />
              </g>
              {showBox && plate && <rect x={110 + dx + 66 * 0.95 - 4} y={34 + 135 * 0.95 - 4} width={68 * 0.95 + 8} height={15 * 0.95 + 8} fill="none" stroke={boxColor} strokeWidth="2.5" />}
              {showBox && plate && confidence != null && (
                <g>
                  <rect x={110 + dx + 66 * 0.95 - 4} y={34 + 135 * 0.95 - 22} width="74" height="16" fill={boxColor} />
                  <text x={110 + dx + 66 * 0.95} y={34 + 135 * 0.95 - 10} fontSize="11" fontFamily="monospace" fill="#000" fontWeight="700">
                    ANPR {Math.round(confidence * 100)}%
                  </text>
                </g>
              )}
            </g>
          )}
          {view === "rear" && (
            <g>
              <g transform={`translate(${110 + dx} 24) scale(0.95)`}>
                <TruckArt view="rear" plate={plate} loaded={loaded} covered={covered} />
              </g>
              {showBox && plate && <rect x={110 + dx + 66 * 0.95 - 4} y={24 + 160 * 0.95 - 4} width={68 * 0.95 + 8} height={15 * 0.95 + 8} fill="none" stroke={boxColor} strokeWidth="2.5" />}
            </g>
          )}
          {view === "side" && (
            <g>
              <rect x="0" y="176" width="400" height="16" fill="#868e96" />
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <rect key={i} x={10 + i * 50} y="190" width="6" height="8" fill="#495057" />
              ))}
              <g transform={`translate(${dx} 48)`}>
                <TruckArt view="side" color={color} loaded={loaded} covered={covered} />
              </g>
              {showBox && <text x="12" y="240" fontSize="11" fontFamily="monospace" fill="#fff">AXLES: 6 · DETECTED</text>}
            </g>
          )}
          {view === "overview" && (
            <g>
              <polygon points="0,250 140,150 260,150 400,250" fill="#9c8063" />
              <rect x="300" y="60" width="8" height="100" fill="#495057" />
              <rect x="292" y="56" width="24" height="44" rx="3" fill="#212529" />
              <circle cx="304" cy="66" r="5" fill="#ff3b3b" />
              <circle cx="304" cy="78" r="5" fill="#333" />
              <circle cx="304" cy="90" r="5" fill="#333" />
              <g transform={`translate(${60 + dx} 74) scale(0.72) skewY(4)`}>
                <TruckArt view="side" color={color} loaded={loaded} covered={covered} />
              </g>
            </g>
          )}
          {view === "top" && (
            <g>
              <rect width="400" height="250" fill="#5c5f66" />
              <rect x="30" y="70" width="340" height="110" fill="#7a7f87" stroke="#ffd43b" strokeWidth="4" strokeDasharray="14 8" />
              <g transform={`translate(${12 + dx * 0.6 + (roi === "bad" ? -36 : 0)} 55)`}>
                <TruckArt view="top" color={color} loaded={loaded} covered={covered} />
              </g>
              {roi && <rect x="30" y="70" width="340" height="110" fill={roi === "ok" ? "#22c55e" : "#ef4444"} opacity="0.18" />}
              {roi === "bad" && (
                <g>
                  <rect x="4" y="74" width="40" height="102" fill="none" stroke="#ef4444" strokeWidth="3" />
                  <text x="50" y="200" fontSize="12" fontFamily="monospace" fill="#ffb4b4" fontWeight="700">
                    WHEEL OUT OF ROI
                  </text>
                </g>
              )}
              {roi === "ok" && (
                <text x="36" y="200" fontSize="12" fontFamily="monospace" fill="#b2f2bb" fontWeight="700">
                  ROI OK · ALL AXLES ON DECK
                </text>
              )}
            </g>
          )}
          {view === "license" && (
            <g>
              <rect width="400" height="250" fill="#3b3f45" />
              <rect x="70" y="40" width="260" height="165" rx="12" fill="#e7f5ff" stroke="#74c0fc" strokeWidth="3" />
              <rect x="90" y="62" width="70" height="88" rx="6" fill="#adb5bd" />
              <circle cx="125" cy="92" r="18" fill="#868e96" />
              <rect x="103" y="114" width="44" height="30" rx="14" fill="#868e96" />
              {[0, 1, 2, 3, 4].map((i) => (
                <rect key={i} x="176" y={66 + i * 18} width={130 - i * 12} height="8" rx="3" fill="#a5b4c3" />
              ))}
              <rect x="90" y="160" width="216" height="26" rx="4" fill="#212529" opacity="0.85" />
              <text x="198" y="178" fontSize="12" textAnchor="middle" fill="#fff" fontFamily="monospace">
                ID ****  MASKED (privacy)
              </text>
            </g>
          )}
          {view === "empty" && <text x="200" y="130" textAnchor="middle" fontSize="13" fill="#495057" fontFamily="monospace">LANE CLEAR</text>}
          <rect width="400" height="250" filter={`url(#grain${uid})`} opacity="0.55" fill="#888" style={{ mixBlendMode: "overlay" }} />
          <rect width="400" height="250" fill={`url(#vig${uid})`} />
        </svg>
      )}
      {!offline && (
        <div className={cx("pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between font-mono text-white/90 ltr", compact ? "p-1 text-[9px]" : "p-2 text-[11px]")}>
          <span className="rounded bg-black/50 px-1.5 py-0.5">{label ?? "CAM"}</span>
          <span className="flex items-center gap-1.5 rounded bg-black/50 px-1.5 py-0.5">
            {rec && <span className="animate-blink text-red-500">●</span>}
            {rec && "REC"} {at != null && fmtTime(at, locale === "fa" ? "en" : "en", true)}
          </span>
        </div>
      )}
    </div>
  );
}
