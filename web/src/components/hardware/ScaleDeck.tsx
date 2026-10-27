"use client";
import type { Plate } from "@/domain/types";
import { TruckArt } from "./Truck";

/** Top view of the weighbridge: 8 load cells, 4 IR position zones, optional ROI mask and truck. */
export function ScaleDeckTop({
  occupied,
  beams = [false, false, false, false],
  positionOk,
  offsetPct = 0,
  loaded,
  color,
  cellHeat,
  showCells = true,
  className,
}: {
  occupied: boolean;
  beams?: [boolean, boolean, boolean, boolean] | boolean[];
  positionOk?: boolean;
  offsetPct?: number;
  loaded?: boolean;
  color?: string;
  plate?: Plate;
  cellHeat?: number[];
  showCells?: boolean;
  className?: string;
}) {
  const deckX = 60;
  const deckW = 480;
  const zones = [deckX + 10, deckX + 150, deckX + 330, deckX + deckW - 30];
  const cellPos = [0, 1, 2, 3].flatMap((i) => [
    { x: deckX + 20 + i * 146, y: 46 },
    { x: deckX + 20 + i * 146, y: 154 },
  ]);
  const heat = (v: number) => (v > 8 ? "#ef4444" : v > 4 ? "#f59f00" : "#22c55e");
  return (
    <svg viewBox="0 0 600 200" className={className} role="img" aria-label="scale deck top view">
      <rect x="0" y="0" width="600" height="200" fill="var(--surface-2)" rx="10" />
      {/* approach ramps */}
      <rect x="8" y="40" width={deckX - 8} height="120" fill="#adb5bd" opacity="0.4" />
      <rect x={deckX + deckW} y="40" width={600 - deckX - deckW - 8} height="120" fill="#adb5bd" opacity="0.4" />
      {/* deck */}
      <rect x={deckX} y="36" width={deckW} height="128" fill="#868e96" stroke="#495057" strokeWidth="3" />
      {[1, 2, 3].map((i) => (
        <line key={i} x1={deckX + (deckW / 4) * i} y1="36" x2={deckX + (deckW / 4) * i} y2="164" stroke="#5c636a" strokeWidth="2" />
      ))}
      <rect x={deckX} y="36" width={deckW} height="128" fill="none" stroke="#ffd43b" strokeWidth="3" strokeDasharray="12 8" />
      {/* ROI mask */}
      {occupied && positionOk != null && <rect x={deckX} y="36" width={deckW} height="128" fill={positionOk ? "#22c55e" : "#ef4444"} opacity="0.16" />}
      {/* truck */}
      {occupied && (
        <g transform={`translate(${deckX - 20 + (offsetPct / 100) * deckW} 30) scale(1.32 0.88)`}>
          <TruckArt view="top" color={color} loaded={loaded} />
        </g>
      )}
      {/* load cells */}
      {showCells &&
        cellPos.map((c, i) => (
          <g key={i}>
            <circle cx={c.x} cy={c.y} r="9" fill={cellHeat ? heat(cellHeat[i] ?? 0) : "#343a40"} stroke="#fff" strokeWidth="2" />
            <text x={c.x} y={c.y + 3.5} textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700">
              {i + 1}
            </text>
          </g>
        ))}
      {/* IR zones */}
      {zones.map((x, i) => {
        const on = beams[i];
        const col = !occupied ? "#adb5bd" : on ? "#22c55e" : "#ef4444";
        return (
          <g key={i}>
            <line x1={x} y1="24" x2={x} y2="176" stroke={col} strokeWidth="2.5" strokeDasharray="5 4" />
            <rect x={x - 7} y="12" width="14" height="12" rx="2" fill="#212529" />
            <rect x={x - 7} y="176" width="14" height="12" rx="2" fill="#212529" />
            <circle cx={x} cy="18" r="3" fill={col} />
          </g>
        );
      })}
    </svg>
  );
}
