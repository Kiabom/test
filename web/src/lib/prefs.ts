"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "fa" | "en";
export type Theme = "light" | "dark";

interface Prefs {
  locale: Locale;
  theme: Theme;
  userId: string;
  collapsed: boolean;
  latinDigits: boolean;
  setLocale: (l: Locale) => void;
  setTheme: (t: Theme) => void;
  setUser: (u: string) => void;
  toggleCollapsed: () => void;
  setLatinDigits: (b: boolean) => void;
}

export const usePrefs = create<Prefs>()(
  persist(
    (set) => ({
      locale: "fa",
      theme: "light",
      userId: "U-ADMIN",
      collapsed: false,
      latinDigits: false,
      setLocale: (locale) => set({ locale }),
      setTheme: (theme) => set({ theme }),
      setUser: (userId) => set({ userId }),
      toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),
      setLatinDigits: (latinDigits) => set({ latinDigits }),
    }),
    { name: "tozin-prefs" },
  ),
);

/** Bilingual inline strings: L("فارسی", "English"). */
export function useL() {
  const locale = usePrefs((s) => s.locale);
  return (fa: string, en: string) => (locale === "fa" ? fa : en);
}

export function useLocale() {
  return usePrefs((s) => s.locale);
}
