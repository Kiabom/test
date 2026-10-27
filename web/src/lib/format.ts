import { format as jFormat } from "date-fns-jalali";
import type { Locale } from "./prefs";

const TZ_OFFSET_MIN = 210; // Asia/Tehran
const toSite = (d: Date) => new Date(d.getTime() + (TZ_OFFSET_MIN + d.getTimezoneOffset()) * 60000);
const FA = "۰۱۲۳۴۵۶۷۸۹";

export const faDigits = (s: string) => s.replace(/[0-9]/g, (x) => FA[Number(x)]);
export const digits = (s: string, locale: Locale, latin = false) => (locale === "fa" && !latin ? faDigits(s) : s);

export function fmtNum(n: number | null | undefined, locale: Locale, opts: Intl.NumberFormatOptions = {}): string {
  if (n == null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", { maximumFractionDigits: 1, ...opts }).format(n);
}

export function fmtKg(kg: number | null | undefined, locale: Locale, unit: "kg" | "t" = "kg"): string {
  if (kg == null) return "—";
  return unit === "t" ? `${fmtNum(kg / 1000, locale, { maximumFractionDigits: 2 })} t` : `${fmtNum(kg, locale, { maximumFractionDigits: 0 })} kg`;
}

export function fmtT(t: number | null | undefined, locale: Locale, frac = 1): string {
  if (t == null) return "—";
  return fmtNum(t, locale, { maximumFractionDigits: frac });
}

export function fmtPct(p: number | null | undefined, locale: Locale): string {
  if (p == null) return "—";
  return `${fmtNum(p, locale, { maximumFractionDigits: 1 })}٪`.replace("٪", locale === "fa" ? "٪" : "%");
}

export function fmtTime(iso: string | number | Date | null | undefined, locale: Locale, withSec = false): string {
  if (iso == null) return "—";
  const d = toSite(new Date(iso));
  const s = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}${withSec ? ":" + String(d.getSeconds()).padStart(2, "0") : ""}`;
  return digits(s, locale);
}

export function fmtDate(iso: string | number | Date | null | undefined, locale: Locale): string {
  if (iso == null) return "—";
  const d = toSite(new Date(iso));
  if (locale === "fa") return faDigits(jFormat(d, "yyyy/MM/dd"));
  return d.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "2-digit" });
}

export function fmtDateTime(iso: string | number | Date | null | undefined, locale: Locale): string {
  if (iso == null) return "—";
  return `${fmtDate(iso, locale)} ${fmtTime(iso, locale)}`;
}

export function fmtDuration(ms: number | null | undefined, locale: Locale): string {
  if (ms == null || ms < 0) return "—";
  const m = Math.floor(ms / 60000);
  const h = Math.floor(m / 60);
  const s = h ? `${h}:${String(m % 60).padStart(2, "0")}` : locale === "fa" ? `${m} دقیقه` : `${m} min`;
  return h ? digits(s, locale) + (locale === "fa" ? " ساعت" : " h") : digits(s, locale);
}

export function fmtRelative(iso: string | number | Date | null | undefined, locale: Locale, now = Date.now()): string {
  if (iso == null) return "—";
  const diff = Math.max(0, now - new Date(iso).getTime());
  const s = Math.floor(diff / 1000);
  if (s < 5) return locale === "fa" ? "همین الان" : "just now";
  if (s < 60) return locale === "fa" ? `${faDigits(String(s))} ثانیه پیش` : `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return locale === "fa" ? `${faDigits(String(m))} دقیقه پیش` : `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return locale === "fa" ? `${faDigits(String(h))} ساعت پیش` : `${h} h ago`;
  return fmtDate(iso, locale);
}

export function shortHash(h?: string) {
  return h ? `${h.slice(0, 6)}…${h.slice(-4)}` : "—";
}

export function weekdayHour(iso: string, locale: Locale) {
  const d = toSite(new Date(iso));
  return locale === "fa" ? faDigits(jFormat(d, "MM/dd")) : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}
