import type { Plate } from "@/domain/types";
import { toFaDigits } from "@/domain/plate";

const SIZES = { xs: 84, sm: 116, md: 160, lg: 230, xl: 360, xxl: 620 } as const;

/** Plate artwork in a 520×114 coordinate system — embeddable inside other SVG scenes. */
export function PlateArt({ plate, x = 0, y = 0, width = 520 }: { plate: Plate; x?: number; y?: number; width?: number }) {
  const k = width / 520;
  const font = "Vazirmatn Variable, sans-serif";
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} style={{ direction: "ltr" }}>
      <rect x="2" y="2" width="516" height="110" rx="12" fill="#f8f9fa" stroke="#212529" strokeWidth="5" />
      <rect x="6" y="6" width="58" height="102" rx="8" fill="#1d4ed8" />
      <rect x="18" y="16" width="34" height="8" fill="#22c55e" />
      <rect x="18" y="24" width="34" height="8" fill="#ffffff" />
      <rect x="18" y="32" width="34" height="8" fill="#ef4444" />
      <text x="132" y="86" textAnchor="middle" fontSize="72" fontWeight="800" fill="#111" fontFamily={font}>{toFaDigits(plate.d2)}</text>
      <text x="215" y="84" textAnchor="middle" fontSize="62" fontWeight="800" fill="#111" fontFamily={font}>{plate.letter}</text>
      <text x="320" y="86" textAnchor="middle" fontSize="72" fontWeight="800" fill="#111" fontFamily={font}>{toFaDigits(plate.d3)}</text>
      <line x1="404" y1="8" x2="404" y2="106" stroke="#212529" strokeWidth="4" />
      <text x="460" y="40" textAnchor="middle" fontSize="24" fontWeight="700" fill="#111" fontFamily={font}>ایران</text>
      <text x="460" y="96" textAnchor="middle" fontSize="54" fontWeight="800" fill="#111" fontFamily={font}>{toFaDigits(plate.region)}</text>
    </g>
  );
}

/** Iranian licence plate drawn in SVG (original artwork, not a photo). */
export function IranPlate({ plate, size = "md", className, highlight }: { plate: Plate | null | undefined; size?: keyof typeof SIZES; className?: string; highlight?: boolean }) {
  const w = SIZES[size];
  const h = w * 0.22;
  if (!plate) {
    return (
      <svg width={w} height={h} viewBox="0 0 520 114" className={className} role="img" aria-label="plate unknown">
        <rect x="2" y="2" width="516" height="110" rx="12" fill="#f1f3f5" stroke="#adb5bd" strokeWidth="3" strokeDasharray="10 8" />
        <text x="260" y="72" textAnchor="middle" fontSize="44" fill="#868e96" fontFamily="Vazirmatn Variable, sans-serif">؟؟ ؟ ؟؟؟</text>
      </svg>
    );
  }
  return (
    <svg width={w} height={h} viewBox="0 0 520 114" className={className} role="img" aria-label={`plate ${plate.d2} ${plate.letter} ${plate.d3} ${plate.region}`} style={{ direction: "ltr" }}>
      <defs>
        <linearGradient id="plate-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e9ecef" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="516" height="110" rx="12" fill="url(#plate-shine)" stroke={highlight ? "#22c55e" : "#212529"} strokeWidth={highlight ? 6 : 4} />
      {/* blue band with flag */}
      <rect x="6" y="6" width="58" height="102" rx="8" fill="#1d4ed8" />
      <rect x="18" y="16" width="34" height="8" fill="#22c55e" />
      <rect x="18" y="24" width="34" height="8" fill="#ffffff" />
      <rect x="18" y="32" width="34" height="8" fill="#ef4444" />
      <text x="35" y="70" textAnchor="middle" fontSize="15" fill="#fff" fontWeight="700" fontFamily="Arial, sans-serif">I.R.</text>
      <text x="35" y="92" textAnchor="middle" fontSize="15" fill="#fff" fontWeight="700" fontFamily="Arial, sans-serif">IRAN</text>
      {/* main characters */}
      <text x="132" y="86" textAnchor="middle" fontSize="70" fontWeight="800" fill="#111" fontFamily="Vazirmatn Variable, sans-serif">{toFaDigits(plate.d2)}</text>
      <text x="215" y="84" textAnchor="middle" fontSize="62" fontWeight="800" fill="#111" fontFamily="Vazirmatn Variable, sans-serif">{plate.letter}</text>
      <text x="320" y="86" textAnchor="middle" fontSize="70" fontWeight="800" fill="#111" fontFamily="Vazirmatn Variable, sans-serif">{toFaDigits(plate.d3)}</text>
      {/* region box */}
      <line x1="404" y1="8" x2="404" y2="106" stroke="#212529" strokeWidth="4" />
      <text x="460" y="40" textAnchor="middle" fontSize="24" fontWeight="700" fill="#111" fontFamily="Vazirmatn Variable, sans-serif">ایران</text>
      <text x="460" y="96" textAnchor="middle" fontSize="54" fontWeight="800" fill="#111" fontFamily="Vazirmatn Variable, sans-serif">{toFaDigits(plate.region)}</text>
    </svg>
  );
}
