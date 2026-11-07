"use client";
import { clockNow } from "@/domain/clock";
import { Bell, ChevronsLeft, Lock, ChevronsRight, ExternalLink, Languages, LogOut, Menu, Moon, Search, Sun, Wifi, WifiOff, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { cx } from "@/components/ui";
import { BRAND, SITE } from "@/config/brand";
import { canSee, homeFor } from "@/domain/access";
import { ROLES } from "@/domain/rbac";
import { USERS_LIST } from "@/lib/users";
import { fmtDate, fmtNum, fmtTime } from "@/lib/format";
import { useLive, useLiveConnection, useLiveStore, useNow } from "@/lib/live";
import { useL, usePrefs } from "@/lib/prefs";
import { Logo, LogoMark } from "./Logo";
import { DISPLAY_LINKS, NAV } from "./nav";
import { PresenterPanel } from "./PresenterPanel";

function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  const collapsed = usePrefs((s) => s.collapsed);
  const locale = usePrefs((s) => s.locale);
  const live = useLive();
  const userId = usePrefs((s) => s.userId);
  const role = USERS_LIST.find((u) => u.id === userId)?.role;
  const nav = NAV.map((g) => ({ ...g, items: g.items.filter((it) => canSee(role, it.href)) })).filter((g) => g.items.length > 0);
  const displays = DISPLAY_LINKS.filter((it) => canSee(role, it.href));
  const holds = live ? live.activeIds.filter((id) => live.visits[id]?.state === "HOLD").length : 0;
  const queue = live ? live.queues.B.length + live.queues.C.length : 0;
  return (
    <nav className="flex flex-col gap-4 px-2 py-3">
      {nav.map((g) => (
        <div key={g.en}>
          {!collapsed && <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-white/40">{locale === "fa" ? g.fa : g.en}</div>}
          <ul className="flex flex-col gap-0.5">
            {g.items.map((it) => {
              const active = it.href === "/app" ? path === "/app" : path.startsWith(it.href);
              const badge = it.badge === "alerts" ? live?.openAlerts : it.badge === "holds" ? holds : it.badge === "queue" ? queue : 0;
              return (
                <li key={it.href}>
                  <Link href={it.href} onClick={onNavigate} title={locale === "fa" ? it.fa : it.en} className={cx("group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition", active ? "bg-white/12 text-white" : "text-white/70 hover:bg-white/6 hover:text-white")}>
                    <it.icon className={cx("size-[18px] shrink-0", active ? "text-sky-300" : "text-white/60 group-hover:text-white")} />
                    {!collapsed && <span className="flex-1 truncate">{locale === "fa" ? it.fa : it.en}</span>}
                    {!collapsed && !!badge && <span className={cx("rounded-full px-1.5 text-[10px] font-bold num", it.badge === "alerts" || it.badge === "holds" ? "bg-red-500 text-white" : "bg-sky-500/80 text-white")}>{fmtNum(badge, locale)}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      {!collapsed && displays.length > 0 && (
        <div>
          <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-white/40">{locale === "fa" ? "نمایشگرها و راننده" : "Displays & driver"}</div>
          <ul className="flex flex-col gap-0.5">
            {displays.map((it) => (
              <li key={it.href}>
                <a href={it.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/6 hover:text-white">
                  <it.icon className="size-[18px] text-white/60" />
                  <span className="flex-1 truncate">{locale === "fa" ? it.fa : it.en}</span>
                  <ExternalLink className="size-3 text-white/40" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  const L = useL();
  const router = useRouter();
  const { locale, theme, userId, setLocale, setTheme } = usePrefs();
  const live = useLive();
  const connected = useLiveStore((s) => s.connected);
  const now = useNow(1000);
  const [q, setQ] = useState("");
  const h = new Date(now + (210 + new Date(clockNow()).getTimezoneOffset()) * 60000).getHours();
  const shift = h >= 6 && h < 14 ? "A" : h >= 14 && h < 22 ? "B" : "C";
  const shiftName = { A: L("شیفت صبح A", "Morning shift A"), B: L("شیفت عصر B", "Evening shift B"), C: L("شیفت شب C", "Night shift C") }[shift];
  const user = USERS_LIST.find((u) => u.id === userId) ?? USERS_LIST[0];
  return (
    <header className="sticky top-0 z-30 flex h-14 print:hidden items-center gap-2 border-b border-border bg-surface/90 px-3 backdrop-blur md:px-5">
      <button className="rounded-lg p-2 hover:bg-surface-2 lg:hidden" onClick={onMenu} aria-label="menu">
        <Menu className="size-5" />
      </button>
      <div className="hidden items-center gap-2 md:flex">
        <select className="h-9 rounded-lg border border-border bg-surface px-2 text-sm" defaultValue="S1" aria-label="site">
          <option value="S1">{L(SITE.name, SITE.nameEn)}</option>
          <option value="S2">{L(SITE.plant, SITE.plantEn)}</option>
        </select>
        <span className="hidden rounded-lg bg-surface-2 px-2.5 py-1.5 text-xs font-medium xl:inline">
          {shiftName} · <span className="num">{fmtTime(now, locale, true)}</span>
        </span>
      </div>
      {canSee(user.role, "/app/transactions") && (
      <form
        className="relative ms-auto hidden max-w-xs flex-1 sm:block md:ms-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) router.push(`/app/transactions?q=${encodeURIComponent(q.trim())}`);
        }}
      >
        <Search className="pointer-events-none absolute start-2.5 top-2.5 size-4 text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L("جست‌وجوی پلاک، تیکت، حواله…", "Search plate, ticket, permit…")} className="h-9 w-full rounded-lg border border-border bg-surface-2 ps-8 pe-2 text-sm outline-none focus:border-primary" />
      </form>
      )}
      <div className="ms-auto flex items-center gap-1.5">
        <span className={cx("hidden items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium sm:inline-flex", live?.wanOnline && connected ? "bg-success/10 text-success" : "bg-danger/10 text-danger")} title={L("وضعیت اتصال Edge و صف همگام‌سازی", "Edge link & sync queue")}>
          {live?.wanOnline && connected ? <Wifi className="size-4" /> : <WifiOff className="size-4" />}
          {live?.wanOnline && connected ? L("آنلاین", "Online") : L("آفلاین", "Offline")}
          {!!live?.syncQueue && <span className="num">· {fmtNum(live.syncQueue, locale)}</span>}
        </span>
        {canSee(user.role, "/app/alerts") && (
        <Link href="/app/alerts" className="relative rounded-lg p-2 hover:bg-surface-2" aria-label="alerts">
          <Bell className="size-5" />
          {!!live?.openAlerts && <span className={cx("absolute -top-0.5 -end-0.5 min-w-4 rounded-full px-1 text-center text-[10px] font-bold text-white num", live.criticalAlerts ? "bg-danger" : "bg-warning")}>{fmtNum(live.openAlerts, locale)}</span>}
        </Link>
        )}
        <button className="rounded-lg p-2 hover:bg-surface-2" onClick={() => setLocale(locale === "fa" ? "en" : "fa")} aria-label="language" title="fa / en">
          <Languages className="size-5" />
        </button>
        <button className="rounded-lg p-2 hover:bg-surface-2" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="theme">
          {theme === "light" ? <Moon className="size-5" /> : <Sun className="size-5" />}
        </button>
        <div className="flex items-center gap-2 rounded-lg border border-border px-2 py-1" aria-label={L("کاربر", "User")}>
          <span className="grid size-7 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">{(locale === "fa" ? user.name : user.nameEn).slice(0, 1)}</span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-xs font-semibold">{locale === "fa" ? user.name : user.nameEn}</span>
            <span className="text-[10px] text-muted">
              {(() => {
                const r = ROLES.find((x) => x.code === user.role);
                return locale === "fa" ? r?.name : r?.nameEn;
              })()}{" "}
              · <span className="num">{fmtNum(Number(user.personnelNo), locale, { useGrouping: false })}</span>
            </span>
          </span>
        </div>
        <Link href="/" className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-text" aria-label={L("خروج", "Sign out")} title={L("خروج", "Sign out")}>
          <LogOut className="size-5 rtl:rotate-180" />
        </Link>
      </div>
    </header>
  );
}

/** Letterhead that appears only on paper / PDF: system, site, who printed it and when. */
function PrintHeader() {
  const L = useL();
  const locale = usePrefs((s) => s.locale);
  const userId = usePrefs((s) => s.userId);
  const user = USERS_LIST.find((u) => u.id === userId);
  const now = useNow(60_000);
  return (
    <div className="print-header mb-4 hidden items-center justify-between border-b-2 border-black pb-2 text-[10pt] text-black print:flex">
      <div className="flex items-center gap-2">
        <LogoMark size={28} />
        <div>
          <div className="font-bold">{locale === "fa" ? BRAND.name : BRAND.nameEn}</div>
          <div className="text-[9pt]">{locale === "fa" ? `${SITE.name} · ${SITE.place}` : `${SITE.nameEn} · ${SITE.placeEn}`}</div>
        </div>
      </div>
      <div className="text-end text-[9pt] leading-5">
        <div>
          {L("تاریخ چاپ", "Printed")}: <span className="num">{fmtDate(now, locale)} {fmtTime(now, locale)}</span>
        </div>
        {user && (
          <div>
            {L("چاپ‌کننده", "Printed by")}: {locale === "fa" ? user.name : user.nameEn} <span className="num">({fmtNum(Number(user.personnelNo), locale, { useGrouping: false })})</span>
          </div>
        )}
      </div>
    </div>
  );
}

function PageGuard({ children }: { children: ReactNode }) {
  const L = useL();
  const path = usePathname();
  const userId = usePrefs((s) => s.userId);
  const role = USERS_LIST.find((u) => u.id === userId)?.role;
  if (canSee(role, path)) return <>{children}</>;
  return (
    <div className="mx-auto mt-16 flex max-w-md flex-col items-center gap-3 text-center" data-testid="no-access">
      <span className="grid size-12 place-items-center rounded-full bg-danger/10 text-danger">
        <Lock className="size-6" />
      </span>
      <div className="text-lg font-bold">{L("به این بخش دسترسی ندارید", "You don't have access to this section")}</div>
      <p className="text-sm text-muted">{L("دسترسی هر کاربر بر اساس نقش او تعیین می‌شود. در صورت نیاز با مدیر سامانه تماس بگیرید.", "Access is set by your role. Contact the system administrator if you need it.")}</p>
      <Link href={homeFor(role)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
        {L("بازگشت به صفحه اصلی", "Back to my home page")}
      </Link>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  useLiveConnection();
  const L = useL();
  const collapsed = usePrefs((s) => s.collapsed);
  const toggle = usePrefs((s) => s.toggleCollapsed);
  const locale = usePrefs((s) => s.locale);
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex min-h-screen">
      <aside className={cx("sticky top-0 hidden h-screen shrink-0 flex-col bg-shell text-white transition-all lg:flex print:!hidden", collapsed ? "w-[72px]" : "w-64")}>
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-3">
          <Link href="/app">{collapsed ? <LogoMark /> : <Logo locale={locale} light />}</Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SideNav />
        </div>
        <button onClick={toggle} className="flex items-center justify-center gap-2 border-t border-white/10 py-2.5 text-xs text-white/60 hover:text-white">
          {collapsed === (locale === "fa") ? <ChevronsLeft className="size-4" /> : <ChevronsRight className="size-4" />}
          {!collapsed && L("جمع کردن", "Collapse")}
        </button>
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)}>
          <aside className="h-full w-72 overflow-y-auto bg-shell text-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-14 items-center justify-between border-b border-white/10 px-3">
              <Logo locale={locale} light />
              <button onClick={() => setMobileOpen(false)} aria-label="close">
                <X className="size-5" />
              </button>
            </div>
            <SideNav onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main className="app-main flex-1 p-3 md:p-5 print:p-0">
          <PrintHeader />
          <PageGuard>{children}</PageGuard>
        </main>
        <footer className="flex justify-between gap-2 border-t print:hidden border-border px-5 py-2 text-[11px] text-muted">
          <span>{locale === "fa" ? `${SITE.name} · ${SITE.place}` : `${SITE.nameEn} · ${SITE.placeEn}`}</span>
          <span className="ltr">{BRAND.nameEn} {BRAND.version}</span>
        </footer>
        <PresenterPanel />
      </div>
    </div>
  );
}
