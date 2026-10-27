"use client";
import { Languages, Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Logo } from "@/components/shell/Logo";
import { Button, cx } from "@/components/ui";
import { BRAND } from "@/config/brand";
import { useL, usePrefs } from "@/lib/prefs";

export function MarketingChrome({ children }: { children: ReactNode }) {
  const L = useL();
  const { locale, theme, setLocale, setTheme } = usePrefs();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/features", fa: "امکانات", en: "Features" },
    { href: "/controls", fa: "کنترل‌ها", en: "Controls" },
    { href: "/connect", fa: "اتصال سخت‌افزار", en: "Connect" },
    { href: "/pricing", fa: "قیمت‌ها", en: "Pricing" },
  ];
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          <Link href="/">
            <Logo locale={locale} />
          </Link>
          <nav className="ms-6 hidden gap-1 md:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={cx("rounded-lg px-3 py-2 text-sm font-medium", path === l.href ? "bg-primary/10 text-primary" : "text-muted hover:text-text")}>
                {locale === "fa" ? l.fa : l.en}
              </Link>
            ))}
          </nav>
          <div className="ms-auto flex items-center gap-1">
            <button className="rounded-lg p-2 hover:bg-surface-2" onClick={() => setLocale(locale === "fa" ? "en" : "fa")} aria-label="language">
              <Languages className="size-5" />
            </button>
            <button className="rounded-lg p-2 hover:bg-surface-2" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="theme">
              {theme === "light" ? <Moon className="size-5" /> : <Sun className="size-5" />}
            </button>
            <Link href="/app" className="hidden sm:block">
              <Button variant="primary">{L("ورود به دمو زنده", "Open live demo")}</Button>
            </Link>
            <button className="rounded-lg p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="menu">
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="flex flex-col gap-1 border-t border-border p-3 md:hidden">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm">
                {locale === "fa" ? l.fa : l.en}
              </Link>
            ))}
            <Link href="/app">
              <Button variant="primary" className="w-full">
                {L("ورود به دمو زنده", "Open live demo")}
              </Button>
            </Link>
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="mt-10 bg-shell text-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-4">
          <div>
            <Logo locale={locale} light />
            <p className="mt-3 text-xs leading-6 text-white/60">{L("سامانه یکپارچه توزین، کنترل تردد، اسکن و پایش تولید معدن.", "Integrated weighing, gate control, scanning and mine production monitoring.")}</p>
          </div>
          {[
            [L("محصول", "Product"), [["/features", L("امکانات", "Features")], ["/controls", L("کنترل‌ها", "Controls")], ["/connect", L("اتصال", "Connect")], ["/pricing", L("قیمت", "Pricing")]]],
            [L("دمو", "Demo"), [["/app", L("داشبورد", "Dashboard")], ["/app/weighing", L("ایستگاه توزین", "Weighing")], ["/app/scan", L("مرکز اسکن", "Scan center")], ["/app/guard", L("اسکن حراست", "Guard scan")]]],
            [L("نمایشگرها", "Displays"), [["/display/B", L("مانیتور راننده", "Driver display")], ["/display/queue", L("تابلو فراخوان", "Call board")], ["/kiosk/B", L("کیوسک", "Kiosk")], ["/d", L("پورتال راننده", "Driver portal")]]],
          ].map(([title, items]) => (
            <div key={title as string}>
              <div className="mb-2 text-sm font-bold">{title as string}</div>
              <ul className="flex flex-col gap-1.5 text-sm text-white/70">
                {(items as string[][]).map(([h, t]) => (
                  <li key={h}>
                    <Link href={h} className="hover:text-white">
                      {t}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 py-3 text-center text-xs text-white/50">{locale === "fa" ? BRAND.demoNotice : BRAND.demoNoticeEn}</div>
      </footer>
    </div>
  );
}
