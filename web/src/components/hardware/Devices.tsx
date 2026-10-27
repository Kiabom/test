"use client";
import type { DeviceType, Plate } from "@/domain/types";
import { TruckArt } from "./Truck";

const statusColor = (s?: string) => (s === "OFFLINE" ? "#ef4444" : s === "DEGRADED" ? "#f59f00" : "#22c55e");

function Pulse({ x, y, color = "#22c55e", label }: { x: number; y: number; color?: string; label?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="9" fill={color} opacity="0.25">
        <animate attributeName="r" values="5;14;5" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.45;0;0.45" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <circle cx={x} cy={y} r="4.5" fill={color} stroke="#fff" strokeWidth="1.5" />
      {label && (
        <text x={x} y={y - 12} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--text)" fontFamily="Vazirmatn Variable, sans-serif">
          {label}
        </text>
      )}
    </g>
  );
}

/** Entry/exit gate portal with ANPR front/rear, overview cam, RFID antenna, UVSS strip, barrier, light, LED sign. */
export function GatePortalSvg({ status = {}, truck, labels, className }: { status?: Record<string, string>; truck?: { plate?: Plate; color?: string; loaded?: boolean } | null; labels?: Record<string, string>; className?: string }) {
  const lb = labels ?? {};
  return (
    <svg viewBox="0 0 640 300" className={className} role="img" aria-label="gate portal">
      <rect width="640" height="300" fill="var(--surface-2)" rx="12" />
      <rect y="232" width="640" height="68" fill="#8a7a66" opacity="0.5" />
      <rect y="250" width="640" height="4" fill="#fff" opacity="0.6" strokeDasharray="20 10" />
      {/* UVSS strip */}
      <rect x="250" y="240" width="140" height="10" rx="2" fill="#212529" />
      <rect x="254" y="242" width="132" height="6" fill="#74c0fc" opacity="0.85">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.4s" repeatCount="indefinite" />
      </rect>
      {/* truck */}
      {truck && (
        <g transform="translate(130 112) scale(0.95)">
          <TruckArt view="side" color={truck.color} loaded={truck.loaded} />
        </g>
      )}
      {/* gantry */}
      <rect x="200" y="40" width="14" height="200" fill="#495057" />
      <rect x="430" y="40" width="14" height="200" fill="#495057" />
      <rect x="196" y="32" width="252" height="18" rx="3" fill="#343a40" />
      {/* cams */}
      <rect x="226" y="50" width="34" height="16" rx="3" fill="#212529" />
      <rect x="384" y="50" width="34" height="16" rx="3" fill="#212529" />
      <rect x="306" y="50" width="30" height="14" rx="3" fill="#212529" />
      {/* RFID panel */}
      <rect x="452" y="70" width="34" height="46" rx="4" fill="#e9ecef" stroke="#495057" strokeWidth="2" />
      <path d="M490 84 q10 9 0 18 M498 78 q16 15 0 30" stroke="#228be6" strokeWidth="2" fill="none">
        <animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite" />
      </path>
      {/* LED sign */}
      <rect x="40" y="60" width="120" height="56" rx="6" fill="#050505" stroke="#495057" strokeWidth="3" />
      <text x="100" y="94" textAnchor="middle" fontSize="16" fill="#ffb000" fontFamily="monospace" fontWeight="700">
        STOP ●
      </text>
      <rect x="96" y="116" width="8" height="120" fill="#495057" />
      {/* barrier & light */}
      <rect x="470" y="170" width="20" height="66" fill="#495057" />
      <rect x="300" y="172" width="172" height="8" rx="3" fill="#fff" stroke="#343a40" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={306 + i * 24} y="172" width="12" height="8" fill="#e03131" />
      ))}
      <rect x="506" y="120" width="22" height="58" rx="4" fill="#212529" />
      <circle cx="517" cy="134" r="6" fill="#ff3b3b" />
      <circle cx="517" cy="149" r="6" fill="#333" />
      <circle cx="517" cy="164" r="6" fill="#333" />
      <rect x="514" y="178" width="6" height="58" fill="#495057" />
      <Pulse x={243} y={58} color={statusColor(status.anprFront)} label={lb.anprFront} />
      <Pulse x={401} y={58} color={statusColor(status.anprRear)} label={lb.anprRear} />
      <Pulse x={321} y={57} color={statusColor(status.overview)} label={lb.overview} />
      <Pulse x={469} y={93} color={statusColor(status.rfid)} label={lb.rfid} />
      <Pulse x={320} y={245} color={statusColor(status.uvss)} label={lb.uvss} />
      <Pulse x={480} y={176} color={statusColor(status.barrier)} label={lb.barrier} />
      <Pulse x={100} y={60} color={statusColor(status.led)} label={lb.led} />
    </svg>
  );
}

/** LiDAR gantry with two overhead 3D scanners and side 2D scanners sweeping a loaded truck. */
export function LidarGantrySvg({ scanning = true, truck, className }: { scanning?: boolean; truck?: { color?: string; loaded?: boolean; covered?: boolean } | null; className?: string }) {
  return (
    <svg viewBox="0 0 640 300" className={className} role="img" aria-label="lidar gantry">
      <rect width="640" height="300" fill="var(--surface-2)" rx="12" />
      <rect y="236" width="640" height="64" fill="#8a7a66" opacity="0.5" />
      {truck && (
        <g transform="translate(120 116) scale(0.95)">
          <TruckArt view="side" color={truck.color} loaded={truck.loaded ?? true} covered={truck.covered} />
        </g>
      )}
      <rect x="150" y="30" width="14" height="210" fill="#495057" />
      <rect x="476" y="30" width="14" height="210" fill="#495057" />
      <rect x="146" y="22" width="348" height="16" rx="3" fill="#343a40" />
      {[250, 390].map((x) => (
        <g key={x}>
          <rect x={x - 16} y="38" width="32" height="18" rx="4" fill="#1971c2" />
          {scanning && (
            <path d={`M${x} 56 L${x - 120} 230 L${x + 120} 230 Z`} fill="#ff2d55" opacity="0.13">
              <animate attributeName="opacity" values="0.05;0.22;0.05" dur="1.1s" repeatCount="indefinite" />
            </path>
          )}
          {scanning && (
            <line x1={x} y1="56" x2={x} y2="230" stroke="#ff2d55" strokeWidth="2">
              <animateTransform attributeName="transform" type="rotate" values={`-30 ${x} 56;30 ${x} 56;-30 ${x} 56`} dur="1.6s" repeatCount="indefinite" />
            </line>
          )}
        </g>
      ))}
      <rect x="164" y="120" width="16" height="22" rx="3" fill="#1971c2" />
      <rect x="460" y="120" width="16" height="22" rx="3" fill="#1971c2" />
      <text x="320" y="290" textAnchor="middle" fontSize="11" fill="var(--muted)" fontFamily="monospace">
        2× 3D LiDAR (top) · 2× 2D profile (side) · tracking
      </text>
    </svg>
  );
}

/** Under-vehicle line-scan image (original drawing) with optional anomaly overlays. */
export function UvssImage({ anomalies = [], reference = false, className, labels = true }: { anomalies?: { x: number; y: number; w: number; h: number; label: string; score: number }[]; reference?: boolean; className?: string; labels?: boolean }) {
  return (
    <svg viewBox="0 0 800 240" className={className} role="img" aria-label="under vehicle scan">
      <defs>
        <linearGradient id={`uvl${reference ? "r" : "c"}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d0d0d" />
          <stop offset="0.5" stopColor="#262626" />
          <stop offset="1" stopColor="#0d0d0d" />
        </linearGradient>
      </defs>
      <rect width="800" height="240" fill={`url(#uvl${reference ? "r" : "c"})`} />
      {/* frame rails */}
      <rect x="30" y="80" width="740" height="16" fill="#8d8d8d" />
      <rect x="30" y="144" width="740" height="16" fill="#8d8d8d" />
      {[90, 200, 330, 470, 600, 720].map((x) => (
        <rect key={x} x={x} y="80" width="10" height="80" fill="#6f6f6f" />
      ))}
      {/* axles + wheels */}
      {[110, 170, 230, 560, 640, 720].map((x) => (
        <g key={x}>
          <rect x={x - 5} y="30" width="10" height="180" fill="#a3a3a3" />
          <rect x={x - 18} y="8" width="36" height="34" rx="6" fill="#151515" stroke="#3a3a3a" />
          <rect x={x - 18} y="198" width="36" height="34" rx="6" fill="#151515" stroke="#3a3a3a" />
        </g>
      ))}
      {/* drive shaft, tanks, exhaust */}
      <rect x="380" y="114" width="180" height="12" rx="6" fill="#b5b5b5" />
      <rect x="430" y="40" width="90" height="34" rx="14" fill="#9b9b9b" />
      <rect x="300" y="168" width="120" height="30" rx="12" fill="#7d7d7d" />
      <rect x="610" y="60" width="140" height="10" rx="5" fill="#c0c0c0" />
      <circle cx="520" cy="190" r="14" fill="#8a8a8a" />
      <circle cx="560" cy="190" r="14" fill="#8a8a8a" />
      {/* lighting stripe */}
      <rect width="800" height="240" fill="#74c0fc" opacity="0.05" />
      {!reference &&
        anomalies.map((a, i) => (
          <g key={i}>
            <rect x={a.x * 800} y={a.y * 240} width={a.w * 800} height={a.h * 240} fill={i === 0 ? "#5b4a2f" : "#2c3e2c"} opacity="0.9" />
            <rect x={a.x * 800 - 4} y={a.y * 240 - 4} width={a.w * 800 + 8} height={a.h * 240 + 8} fill="none" stroke="#ff3b3b" strokeWidth="3" />
            {labels && (
              <g>
                <rect x={a.x * 800 - 4} y={a.y * 240 - 22} width="60" height="16" fill="#ff3b3b" />
                <text x={a.x * 800} y={a.y * 240 - 10} fontSize="11" fill="#fff" fontFamily="monospace" fontWeight="700">
                  {Math.round(a.score * 100)}%
                </text>
              </g>
            )}
          </g>
        ))}
      <text x="10" y="232" fontSize="10" fill="#9ca3af" fontFamily="monospace">
        {reference ? "REFERENCE (registered baseline)" : "LIVE LINE-SCAN · 4096 px · LED"}
      </text>
    </svg>
  );
}

/** Small device illustrations used in the catalog and device registry. */
export function DeviceArt({ type, status, className }: { type: DeviceType; status?: string; className?: string }) {
  const led = statusColor(status);
  const common = { viewBox: "0 0 160 110", className, role: "img" as const, "aria-label": type };
  switch (type) {
    case "CAMERA_ANPR":
    case "CAMERA_OVERVIEW":
    case "CAMERA_TOP":
    case "CAMERA_SIDE":
    case "CAMERA_LICENSE":
      return (
        <svg {...common}>
          <rect x="70" y="58" width="8" height="40" fill="#868e96" />
          <rect x="40" y="96" width="70" height="6" rx="2" fill="#495057" />
          <g transform="rotate(-8 80 40)">
            <rect x="28" y="24" width="96" height="36" rx="8" fill="#e9ecef" stroke="#495057" strokeWidth="2" />
            <rect x="20" y="20" width="110" height="10" rx="4" fill="#adb5bd" />
            <circle cx="118" cy="42" r="12" fill="#212529" />
            <circle cx="118" cy="42" r="6" fill="#1c7ed6" />
            {type === "CAMERA_ANPR" && [0, 1, 2].map((i) => <circle key={i} cx={40 + i * 10} cy="44" r="3" fill="#e03131" opacity="0.8" />)}
          </g>
          <circle cx="146" cy="12" r="5" fill={led} />
        </svg>
      );
    case "UVSS":
      return (
        <svg {...common}>
          <rect x="10" y="62" width="140" height="22" rx="4" fill="#343a40" />
          <rect x="16" y="66" width="128" height="8" fill="#74c0fc" />
          <path d="M20 66 L80 20 L140 66" fill="#74c0fc" opacity="0.15" />
          <rect x="0" y="84" width="160" height="12" fill="#8a7a66" opacity="0.6" />
          <circle cx="146" cy="12" r="5" fill={led} />
        </svg>
      );
    case "LIDAR":
      return (
        <svg {...common}>
          <rect x="54" y="10" width="52" height="26" rx="6" fill="#1971c2" />
          <circle cx="80" cy="23" r="7" fill="#0b3d69" />
          <path d="M80 36 L30 104 L130 104 Z" fill="#ff2d55" opacity="0.18" />
          <line x1="80" y1="36" x2="80" y2="104" stroke="#ff2d55" strokeWidth="2" />
          <circle cx="146" cy="12" r="5" fill={led} />
        </svg>
      );
    case "RFID_READER":
      return (
        <svg {...common}>
          <rect x="46" y="16" width="56" height="74" rx="6" fill="#f1f3f5" stroke="#495057" strokeWidth="2" />
          <text x="74" y="58" textAnchor="middle" fontSize="12" fontWeight="700" fill="#495057">
            UHF
          </text>
          <path d="M108 38 q12 15 0 30 M118 30 q22 23 0 46" stroke="#228be6" strokeWidth="3" fill="none" />
          <circle cx="146" cy="12" r="5" fill={led} />
        </svg>
      );
    case "INDICATOR":
      return (
        <svg {...common}>
          <rect x="14" y="20" width="132" height="70" rx="8" fill="#343a40" />
          <rect x="22" y="30" width="116" height="30" rx="3" fill="#050505" />
          <text x="132" y="53" textAnchor="end" fontSize="20" fill="#ff3b3b" fontFamily="monospace" fontWeight="700">
            34520
          </text>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={26 + i * 30} y="68" width="22" height="12" rx="2" fill="#868e96" />
          ))}
          <circle cx="146" cy="12" r="5" fill={led} />
        </svg>
      );
    case "JUNCTION_BOX":
      return (
        <svg {...common}>
          <rect x="30" y="20" width="100" height="70" rx="6" fill="#adb5bd" stroke="#495057" strokeWidth="2" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <circle key={i} cx={42 + (i % 4) * 25} cy={i < 4 ? 40 : 70} r="6" fill="#212529" />
          ))}
          <circle cx="146" cy="12" r="5" fill={led} />
        </svg>
      );
    case "BARRIER":
      return (
        <svg {...common}>
          <rect x="18" y="40" width="22" height="60" fill="#495057" />
          <rect x="30" y="44" width="124" height="9" rx="4" fill="#fff" stroke="#343a40" />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={40 + i * 22} y="44" width="11" height="9" fill="#e03131" />
          ))}
          <circle cx="146" cy="12" r="5" fill={led} />
        </svg>
      );
    case "TRAFFIC_LIGHT":
      return (
        <svg {...common}>
          <rect x="62" y="8" width="36" height="78" rx="8" fill="#212529" />
          <circle cx="80" cy="24" r="9" fill="#ff3b3b" />
          <circle cx="80" cy="47" r="9" fill="#3a3a3a" />
          <circle cx="80" cy="70" r="9" fill="#22ff88" />
          <rect x="77" y="86" width="6" height="20" fill="#495057" />
        </svg>
      );
    case "POSITION_SENSOR":
      return (
        <svg {...common}>
          <rect x="16" y="40" width="16" height="30" rx="3" fill="#212529" />
          <rect x="128" y="40" width="16" height="30" rx="3" fill="#212529" />
          <line x1="32" y1="55" x2="128" y2="55" stroke="#ef4444" strokeWidth="3" strokeDasharray="6 4" />
          <circle cx="146" cy="12" r="5" fill={led} />
        </svg>
      );
    case "LED_DISPLAY":
    case "QUEUE_BOARD":
      return (
        <svg {...common}>
          <rect x="16" y="12" width="128" height="62" rx="5" fill="#050505" stroke="#495057" strokeWidth="3" />
          <text x="80" y="40" textAnchor="middle" fontSize="13" fill="#ffb000" fontFamily="monospace" fontWeight="700">
            {type === "QUEUE_BOARD" ? "NEXT ▶ B" : "STOP ●"}
          </text>
          <text x="80" y="60" textAnchor="middle" fontSize="11" fill="#22ff88" fontFamily="monospace">
            34,520 kg
          </text>
          <rect x="76" y="74" width="8" height="30" fill="#495057" />
          <circle cx="150" cy="10" r="5" fill={led} />
        </svg>
      );
    case "KIOSK":
      return (
        <svg {...common}>
          <rect x="54" y="8" width="52" height="96" rx="8" fill="#dee2e6" stroke="#495057" strokeWidth="2" />
          <rect x="60" y="16" width="40" height="30" rx="3" fill="#1c7ed6" />
          <rect x="64" y="54" width="32" height="6" rx="2" fill="#495057" />
          <rect x="64" y="66" width="32" height="10" rx="2" fill="#212529" />
          <circle cx="80" cy="88" r="5" fill="#2f9e44" />
          <circle cx="146" cy="12" r="5" fill={led} />
        </svg>
      );
    case "PRINTER":
      return (
        <svg {...common}>
          <rect x="36" y="40" width="88" height="44" rx="6" fill="#495057" />
          <rect x="50" y="14" width="60" height="34" fill="#fff" stroke="#adb5bd" />
          {[0, 1, 2].map((i) => (
            <rect key={i} x="56" y={20 + i * 8} width="48" height="3" fill="#adb5bd" />
          ))}
          <circle cx="146" cy="12" r="5" fill={led} />
        </svg>
      );
    case "PLC":
      return (
        <svg {...common}>
          <rect x="14" y="20" width="132" height="70" rx="4" fill="#ced4da" stroke="#495057" strokeWidth="2" />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <rect x={22 + i * 25} y="28" width="20" height="54" rx="2" fill="#495057" />
              <circle cx={32 + i * 25} cy="38" r="3" fill={i % 2 ? "#22c55e" : "#f59f00"} />
            </g>
          ))}
          <circle cx="150" cy="12" r="5" fill={led} />
        </svg>
      );
    case "EDGE_GATEWAY":
      return (
        <svg {...common}>
          <rect x="24" y="30" width="112" height="50" rx="6" fill="#343a40" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <rect key={i} x={32 + i * 12} y="38" width="6" height="34" fill="#495057" />
          ))}
          <circle cx="126" cy="44" r="3" fill="#22c55e" />
          <circle cx="126" cy="56" r="3" fill="#1c7ed6" />
          <circle cx="150" cy="12" r="5" fill={led} />
        </svg>
      );
    case "INTERCOM":
      return (
        <svg {...common}>
          <rect x="56" y="14" width="48" height="80" rx="8" fill="#868e96" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x="64" y={24 + i * 6} width="32" height="2" fill="#343a40" />
          ))}
          <circle cx="80" cy="70" r="10" fill="#2f9e44" />
          <circle cx="146" cy="12" r="5" fill={led} />
        </svg>
      );
    case "SIREN":
      return (
        <svg {...common}>
          <path d="M56 70 Q56 26 80 26 Q104 26 104 70 Z" fill="#f59f00" />
          <rect x="50" y="70" width="60" height="12" rx="3" fill="#343a40" />
          <circle cx="146" cy="12" r="5" fill={led} />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="30" y="20" width="100" height="70" rx="8" fill="#adb5bd" />
        </svg>
      );
  }
}
