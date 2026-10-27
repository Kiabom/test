import type { Plate } from "./types";

export const PLATE_LETTERS = ["ب", "ج", "د", "س", "ص", "ط", "ق", "ل", "م", "ن", "و", "ه", "ی", "ع"] as const;
export const PLATE_REGIONS = ["11", "22", "33", "44", "55", "65", "67", "82", "85", "13", "15", "25"] as const;

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export function toFaDigits(s: string | number): string {
  return String(s).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

export function toEnDigits(s: string): string {
  return s.replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)));
}

export function normalizePlate(p: Plate): string {
  return `${p.d2}${p.letter}${p.d3}-${p.region}`;
}

export function parsePlate(s: string): Plate | null {
  const m = toEnDigits(s.replace(/\s|ایران|IR/g, "")).match(/^(\d{2})([؀-ۿ])(\d{3})-?(\d{2})$/);
  if (!m) return null;
  return { d2: m[1], letter: m[2], d3: m[3], region: m[4] };
}

/** Human readable: "۱۲ ب ۳۴۵ - ۶۷" (fa) or "12 B 345 - 67" style keeps Persian letter. */
export function formatPlate(p: Plate, locale: "fa" | "en" = "fa"): string {
  const s = `${p.d2} ${p.letter} ${p.d3} - ${p.region}`;
  return locale === "fa" ? toFaDigits(s) : s;
}

export function maskPlate(p: Plate, locale: "fa" | "en" = "fa"): string {
  const s = `${p.d2}${p.letter}***-${p.region}`;
  return locale === "fa" ? toFaDigits(s) : s;
}

export function randomPlate(rand: () => number): Plate {
  const d2 = String(10 + Math.floor(rand() * 89));
  const d3 = String(100 + Math.floor(rand() * 899));
  return {
    d2,
    letter: PLATE_LETTERS[Math.floor(rand() * PLATE_LETTERS.length)],
    d3,
    region: PLATE_REGIONS[Math.floor(rand() * PLATE_REGIONS.length)],
  };
}

/** Simulates an OCR misread by altering one digit. */
export function misreadPlate(p: Plate, rand: () => number): Plate {
  const d3 = p.d3.split("");
  const i = Math.floor(rand() * 3);
  d3[i] = String((Number(d3[i]) + 3) % 10);
  return { ...p, d3: d3.join("") };
}
