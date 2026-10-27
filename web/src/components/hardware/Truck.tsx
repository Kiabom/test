import type { Plate } from "@/domain/types";
import { PlateArt } from "@/components/domain/IranPlate";

export type TruckView = "side" | "front" | "rear" | "top";

const LOAD = "#7a4a2a";
const LOAD_HI = "#9c6644";

function Wheel({ cx, cy, r = 13 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#1b1b1b" />
      <circle cx={cx} cy={cy} r={r * 0.55} fill="#6c757d" />
      <circle cx={cx} cy={cy} r={r * 0.18} fill="#212529" />
    </g>
  );
}

/** Original truck artwork as an SVG group. Coordinates: side/top 400×160, front/rear 200×200. */
export function TruckArt({ view, color = "#d9480f", loaded = false, plate, covered = false }: { view: TruckView; color?: string; loaded?: boolean; plate?: Plate; covered?: boolean }) {
  if (view === "side") {
    return (
      <g>
        {/* trailer dump body */}
        <path d="M20 52 L250 52 L242 112 L28 112 Z" fill="#adb5bd" stroke="#495057" strokeWidth="2" />
        {[60, 100, 140, 180, 220].map((x) => (
          <line key={x} x1={x} y1="54" x2={x - 2} y2="110" stroke="#868e96" strokeWidth="2" />
        ))}
        {loaded && !covered && <path d="M26 54 Q70 18 120 30 Q170 12 210 32 Q236 40 248 54 Z" fill={LOAD} stroke={LOAD_HI} strokeWidth="2" />}
        {loaded && covered && <path d="M24 54 Q130 28 250 54 Z" fill="#2b8a3e" stroke="#1b5e20" strokeWidth="2" />}
        {/* chassis */}
        <rect x="18" y="112" width="360" height="9" fill="#343a40" />
        {/* cab */}
        <path d="M268 44 L340 44 Q356 46 362 64 L374 88 L376 116 L268 116 Z" fill={color} stroke="#212529" strokeWidth="2" />
        <path d="M300 52 L338 52 Q348 54 352 66 L360 86 L300 86 Z" fill="#a5d8ff" stroke="#212529" strokeWidth="1.5" />
        <rect x="272" y="56" width="22" height="34" rx="2" fill="#a5d8ff" stroke="#212529" strokeWidth="1.5" />
        <rect x="340" y="100" width="36" height="8" fill="#ffd43b" />
        <rect x="258" y="30" width="6" height="86" fill="#495057" />
        {/* wheels */}
        <Wheel cx={60} cy={128} />
        <Wheel cx={92} cy={128} />
        <Wheel cx={124} cy={128} />
        <Wheel cx={276} cy={128} />
        <Wheel cx={308} cy={128} />
        <Wheel cx={352} cy={128} />
      </g>
    );
  }
  if (view === "top") {
    return (
      <g>
        <rect x="20" y="30" width="236" height="80" rx="4" fill="#adb5bd" stroke="#495057" strokeWidth="2" />
        {loaded && !covered && (
          <g>
            <rect x="26" y="36" width="224" height="68" rx="3" fill={LOAD} />
            <ellipse cx="138" cy="70" rx="96" ry="26" fill={LOAD_HI} opacity="0.7" />
            <ellipse cx="138" cy="70" rx="60" ry="15" fill="#b07d56" opacity="0.7" />
            <ellipse cx="138" cy="70" rx="26" ry="7" fill="#c8946b" opacity="0.8" />
          </g>
        )}
        {loaded && covered && <rect x="24" y="34" width="228" height="72" rx="3" fill="#2b8a3e" stroke="#1b5e20" />}
        <rect x="262" y="34" width="92" height="72" rx="6" fill={color} stroke="#212529" strokeWidth="2" />
        <rect x="320" y="40" width="28" height="60" rx="3" fill="#a5d8ff" opacity="0.9" />
        {[52, 84, 116, 278, 306, 342].map((x) => (
          <g key={x}>
            <rect x={x - 9} y="22" width="18" height="8" rx="2" fill="#1b1b1b" />
            <rect x={x - 9} y="110" width="18" height="8" rx="2" fill="#1b1b1b" />
          </g>
        ))}
      </g>
    );
  }
  if (view === "front") {
    return (
      <g>
        <rect x="30" y="30" width="140" height="130" rx="10" fill={color} stroke="#212529" strokeWidth="2" />
        <rect x="42" y="42" width="116" height="52" rx="6" fill="#a5d8ff" stroke="#212529" strokeWidth="1.5" />
        <line x1="100" y1="42" x2="100" y2="94" stroke="#212529" strokeWidth="1.5" />
        <rect x="50" y="104" width="100" height="26" rx="3" fill="#343a40" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x="54" y={107 + i * 4.6} width="92" height="2" fill="#868e96" />
        ))}
        <rect x="36" y="106" width="12" height="10" rx="2" fill="#fff3bf" stroke="#212529" />
        <rect x="152" y="106" width="12" height="10" rx="2" fill="#fff3bf" stroke="#212529" />
        <rect x="24" y="152" width="152" height="12" rx="3" fill="#495057" />
        {plate ? <PlateArt plate={plate} x={66} y={135} width={68} /> : <rect x="66" y="135" width="68" height="15" fill="#f8f9fa" stroke="#212529" />}
        <rect x="34" y="164" width="22" height="26" rx="4" fill="#1b1b1b" />
        <rect x="144" y="164" width="22" height="26" rx="4" fill="#1b1b1b" />
        <rect x="22" y="50" width="8" height="18" rx="2" fill="#495057" />
        <rect x="170" y="50" width="8" height="18" rx="2" fill="#495057" />
      </g>
    );
  }
  // rear
  return (
    <g>
      <path d="M26 40 L174 40 L168 150 L32 150 Z" fill="#adb5bd" stroke="#495057" strokeWidth="2" />
      {loaded && <path d="M28 42 Q100 6 172 42 Z" fill={covered ? "#2b8a3e" : LOAD} stroke={covered ? "#1b5e20" : LOAD_HI} strokeWidth="2" />}
      <rect x="34" y="52" width="132" height="90" fill="none" stroke="#868e96" strokeWidth="2" />
      <line x1="100" y1="52" x2="100" y2="142" stroke="#868e96" strokeWidth="2" />
      <rect x="24" y="150" width="152" height="10" fill="#343a40" />
      <rect x="28" y="152" width="14" height="6" fill="#e03131" />
      <rect x="158" y="152" width="14" height="6" fill="#e03131" />
      {plate ? <PlateArt plate={plate} x={66} y={160} width={68} /> : <rect x="66" y="160" width="68" height="15" fill="#f8f9fa" stroke="#212529" />}
      <rect x="30" y="160" width="26" height="30" rx="4" fill="#1b1b1b" />
      <rect x="144" y="160" width="26" height="30" rx="4" fill="#1b1b1b" />
    </g>
  );
}

export function TruckSvg({ view, width = 320, ...rest }: { view: TruckView; width?: number; color?: string; loaded?: boolean; plate?: Plate; covered?: boolean }) {
  const vb = view === "side" || view === "top" ? "0 0 400 160" : "0 0 200 200";
  const h = view === "side" || view === "top" ? width * 0.4 : width;
  return (
    <svg width={width} height={h} viewBox={vb} role="img" aria-label={`truck ${view}`}>
      <TruckArt view={view} {...rest} />
    </svg>
  );
}
