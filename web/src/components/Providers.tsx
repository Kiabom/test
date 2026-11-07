"use client";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui";
import { usePrefs } from "@/lib/prefs";

/**
 * Preferences (locale, theme, demo user) live in localStorage and the UI is driven by a live
 * simulator clock, so the app renders on the client only to avoid hydration mismatches.
 */
export function Providers({ children, forceTheme }: { children: ReactNode; forceTheme?: "light" | "dark" }) {
  const locale = usePrefs((s) => s.locale);
  const theme = usePrefs((s) => s.theme);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const el = document.documentElement;
    el.lang = locale;
    el.dir = locale === "fa" ? "rtl" : "ltr";
    el.dataset.theme = forceTheme ?? theme;
  }, [locale, theme, forceTheme]);
  // paper is always printed in the light theme
  useEffect(() => {
    const el = document.documentElement;
    const before = () => (el.dataset.theme = "light");
    const after = () => (el.dataset.theme = forceTheme ?? usePrefs.getState().theme);
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, [forceTheme]);
  if (!mounted)
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
