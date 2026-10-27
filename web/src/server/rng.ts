export type Rand = () => number;

export function mulberry32(seed: number): Rand {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const pick = <T,>(r: Rand, xs: readonly T[]): T => xs[Math.floor(r() * xs.length)];
export const int = (r: Rand, min: number, max: number) => Math.floor(min + r() * (max - min + 1));
export const range = (r: Rand, min: number, max: number) => min + r() * (max - min);
export const chance = (r: Rand, p: number) => r() < p;
export function gauss(r: Rand, mean = 0, sd = 1): number {
  const u = 1 - r();
  const v = r();
  return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
