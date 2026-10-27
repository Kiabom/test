import { BRAND } from "@/config/brand";

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <rect width="48" height="48" rx="12" fill="#1273a6" />
      <path d="M10 33 h28" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 12 v14" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M14 18 h20" stroke="#ffd43b" strokeWidth="3" strokeLinecap="round" />
      <path d="M14 18 l-4 8 h8 z M34 18 l-4 8 h8 z" fill="#ffd43b" />
      <circle cx="16" cy="37" r="3" fill="#fff" />
      <circle cx="32" cy="37" r="3" fill="#fff" />
    </svg>
  );
}

export function Logo({ locale = "fa", light }: { locale?: "fa" | "en"; light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark />
      <span className={light ? "text-white" : ""}>
        <span className="block text-base font-extrabold leading-tight">{locale === "fa" ? BRAND.name : BRAND.nameEn}</span>
        <span className={"block text-[10px] leading-tight " + (light ? "text-white/60" : "text-muted")}>{locale === "fa" ? BRAND.tagline : BRAND.taglineEn}</span>
      </span>
    </span>
  );
}
