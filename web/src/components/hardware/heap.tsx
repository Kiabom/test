"use client";
// three.js-free helpers so pages can render the height map without pulling the 3D bundle
import { useMemo } from "react";

export function prng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type CloudMode = "loaded" | "empty" | "diff";

/** Height of the material heap at bed coordinates (x along length, z across width). */
export function heapHeight(x: number, z: number, seed: number, offCenter = 0) {
  const r = prng(seed);
  const cx = (r() - 0.5) * 1.2 + offCenter / 25;
  const peaks = [0, 1, 2].map(() => ({ x: (r() - 0.5) * 4.5 + cx, z: (r() - 0.5) * 0.8, h: 0.6 + r() * 0.5, s: 1.2 + r() * 0.8 }));
  let h = 0;
  for (const p of peaks) h = Math.max(h, p.h * Math.exp(-(((x - p.x) ** 2) / (2 * p.s ** 2) + ((z - p.z) ** 2) / (2 * 0.9 ** 2))));
  return h * 1.25;
}

/** 2D height map (top view) for quick inspection and reports. */
export function HeightMap({ seed, offCenter = 0, className }: { seed: number; offCenter?: number; className?: string }) {
  const cells = useMemo(() => {
    const out: { x: number; y: number; h: number }[] = [];
    for (let i = 0; i < 38; i++)
      for (let j = 0; j < 12; j++) {
        const x = -3.7 + (i / 37) * 7.4;
        const z = -1.1 + (j / 11) * 2.2;
        out.push({ x: i, y: j, h: heapHeight(x, z, seed, offCenter) });
      }
    return out;
  }, [seed, offCenter]);
  const max = Math.max(...cells.map((c) => c.h), 0.01);
  return (
    <svg viewBox="0 0 380 120" className={className}>
      {cells.map((c, i) => {
        return <rect key={i} x={c.x * 10} y={c.y * 10} width="10" height="10" fill={`hsl(${Math.round((0.66 - 0.66 * (c.h / max)) * 360)} 85% 50%)`} />;
      })}
      <line x1="190" y1="0" x2="190" y2="120" stroke="#fff" strokeDasharray="4 4" opacity="0.7" />
      <line x1="0" y1="60" x2="380" y2="60" stroke="#fff" strokeDasharray="4 4" opacity="0.7" />
    </svg>
  );
}
