"use client";
import { Languages, Lock, Moon, Sun, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Field, Input } from "@/components/ui";
import { LogoMark } from "@/components/shell/Logo";
import { BRAND, SITE } from "@/config/brand";
import { homeFor } from "@/domain/access";
import { ROLES } from "@/domain/rbac";
import { USERS_LIST } from "@/lib/users";
import { fmtNum } from "@/lib/format";
import { useL, usePrefs } from "@/lib/prefs";

/** Username for each account: the family name in Latin letters, e.g. U-ADMIN → "sadri". */
const loginOf = (nameEn: string) => nameEn.replace(/^(Eng\.|Dr\.)\s*/, "").split(" ").pop()!.toLowerCase();


export default function LoginPage() {
  const L = useL();
  const router = useRouter();
  const { locale, theme, userId, setLocale, setTheme, setUser } = usePrefs();
  const current = USERS_LIST.find((u) => u.id === userId) ?? USERS_LIST[0];
  const [username, setUsername] = useState(loginOf(current.nameEn));
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const signIn = (e: React.FormEvent) => {
    e.preventDefault();
    const u = USERS_LIST.find((x) => loginOf(x.nameEn) === username.trim().toLowerCase());
    if (!u) return setError(L("نام کاربری پیدا نشد.", "Unknown username."));
    if (password.length < 4) return setError(L("رمز عبور را وارد کنید.", "Enter your password."));
    setBusy(true);
    setUser(u.id);
    router.push(homeFor(u.role));
  };

  return (
    <div className="grid min-h-screen bg-bg lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <section className="relative hidden flex-col justify-between bg-shell p-10 text-white lg:flex">
        <div className="flex items-center gap-3">
          <LogoMark size={40} />
          <div>
            <div className="text-lg font-extrabold">{locale === "fa" ? BRAND.name : BRAND.nameEn}</div>
            <div className="text-xs text-white/60">{locale === "fa" ? BRAND.tagline : BRAND.taglineEn}</div>
          </div>
        </div>
        <div className="max-w-md">
          <div className="text-xs font-semibold text-white/50">{L("سایت", "Site")}</div>
          <div className="mt-1 text-3xl font-black leading-snug">{locale === "fa" ? SITE.name : SITE.nameEn}</div>
          <div className="mt-1 text-sm text-white/60">{locale === "fa" ? SITE.place : SITE.placeEn}</div>
        </div>
        <div className="text-[11px] text-white/40">
          {BRAND.nameEn} {BRAND.version}
        </div>
      </section>

      <section className="flex flex-col">
        <div className="flex justify-end gap-1 p-4">
          <button className="rounded-lg p-2 text-muted hover:bg-surface-2" onClick={() => setLocale(locale === "fa" ? "en" : "fa")} aria-label="language">
            <Languages className="size-5" />
          </button>
          <button className="rounded-lg p-2 text-muted hover:bg-surface-2" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="theme">
            {theme === "light" ? <Moon className="size-5" /> : <Sun className="size-5" />}
          </button>
        </div>
        <div className="flex flex-1 items-center justify-center px-4 pb-16">
          <div className="w-full max-w-sm">
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-2">
                <LogoMark size={36} />
                <span className="text-lg font-extrabold">{locale === "fa" ? BRAND.name : BRAND.nameEn}</span>
              </div>
              <div className="mt-2 text-sm text-muted">{locale === "fa" ? SITE.name : SITE.nameEn}</div>
            </div>
            <h1 className="text-2xl font-black">{L("ورود به سامانه", "Sign in")}</h1>
            <p className="mt-1 text-sm text-muted">{L("با نام کاربری سازمانی وارد شوید.", "Use your company account.")}</p>
            <form onSubmit={signIn} className="mt-6 flex flex-col gap-4">
              <Field label={L("نام کاربری", "Username")}>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-3 size-4 text-muted" />
                  <Input value={username} onChange={(e) => (setUsername(e.target.value), setError(""))} className="pl-9" autoComplete="username" dir="ltr" />
                </div>
              </Field>
              <Field label={L("رمز عبور", "Password")}>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-3 size-4 text-muted" />
                  <Input type="password" value={password} onChange={(e) => (setPassword(e.target.value), setError(""))} className="pl-9" autoComplete="current-password" dir="ltr" />
                </div>
              </Field>
              {error && <div className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</div>}
              <Button variant="primary" size="lg" loading={busy}>
                {L("ورود", "Sign in")}
              </Button>
            </form>
            <div className="mt-8">
              <div className="mb-2 text-xs font-medium text-muted">{L("حساب‌های این سایت", "Accounts on this site")}</div>
              <div className="max-h-56 overflow-y-auto rounded-lg border border-border">
                {USERS_LIST.map((u) => {
                  const r = ROLES.find((x) => x.code === u.role);
                  const login = loginOf(u.nameEn);
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => (setUsername(login), setPassword("••••••"), setError(""))}
                      className="flex w-full items-center justify-between gap-2 border-b border-border px-3 py-2 text-start text-sm last:border-0 hover:bg-surface-2"
                    >
                      <span>
                        {locale === "fa" ? u.name : u.nameEn}
                        <span className="ms-2 text-xs text-muted">{locale === "fa" ? r?.name : r?.nameEn}</span>
                        <span className="ms-2 text-xs text-muted num">#{fmtNum(Number(u.personnelNo), locale, { useGrouping: false })}</span>
                      </span>
                      <span className="font-mono text-xs text-muted">{login}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
