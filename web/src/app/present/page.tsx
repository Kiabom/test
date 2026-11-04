"use client";
import { ChevronLeft, ChevronRight, Expand, GalleryHorizontalEnd, StickyNote } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SLIDES, type SlideCtx, type Track } from "@/components/present/slides";
import { cx } from "@/components/ui";
import { useView } from "@/lib/live";
import { useL, useLocale, usePrefs } from "@/lib/prefs";
import { queryParam } from "@/lib/query";
import type { ShowcaseRefs } from "@/server/store";

const W = 1920;
const H = 1080;

/**
 * Full-screen slides. Keys: → / ← (direction follows the language), Space / PageDown, PageUp,
 * F full screen, N speaker notes. `?track=driver|owner`, `?slide=n`, `?print=1` (all slides for PDF),
 * `?chrome=0` (no controls, for screenshots).
 */
export default function PresentPage() {
  const L = useL();
  const locale = useLocale();
  const setLocale = usePrefs((s) => s.setLocale);
  const { data: refs } = useView<ShowcaseRefs>("showcase", {}, 60_000);
  const [track, setTrack] = useState<Track | "all">(() => (["driver", "owner"].includes(queryParam("track") ?? "") ? (queryParam("track") as Track) : "all"));
  const print = queryParam("print") === "1";
  const chrome = queryParam("chrome") !== "0";
  const slides = useMemo(() => SLIDES.filter((s) => track === "all" || s.tracks.includes(track)), [track]);
  const [i, setI] = useState(() => {
    const n = Number(queryParam("slide") ?? (typeof window !== "undefined" ? window.location.hash.slice(1) : "") ?? 1);
    return Number.isFinite(n) && n >= 1 ? n - 1 : 0;
  });
  const [notes, setNotes] = useState(false);
  const [scale, setScale] = useState(0.5);
  const idx = Math.min(i, slides.length - 1);
  const go = useCallback((d: number) => setI((x) => Math.max(0, Math.min(slides.length - 1, Math.min(x, slides.length - 1) + d))), [slides.length]);

  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / W, window.innerHeight / H));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  useEffect(() => {
    if (!print) history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${idx + 1}`);
  }, [idx, print]);
  useEffect(() => {
    const rtl = locale === "fa";
    const onKey = (e: KeyboardEvent) => {
      if (["PageDown", " ", "ArrowDown"].includes(e.key) || e.key === (rtl ? "ArrowLeft" : "ArrowRight")) {
        e.preventDefault();
        go(1);
      } else if (["PageUp", "ArrowUp"].includes(e.key) || e.key === (rtl ? "ArrowRight" : "ArrowLeft")) {
        e.preventDefault();
        go(-1);
      } else if (e.key === "f" || e.key === "F") {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen?.();
      } else if (e.key === "n" || e.key === "N") setNotes((x) => !x);
      else if (e.key === "Home") setI(0);
      else if (e.key === "End") setI(slides.length - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, locale, slides.length]);

  const ctx: SlideCtx = { L, locale, refs, eager: print };

  if (print) {
    return (
      <div className="bg-white">
        <style>{`@page { size: ${W}px ${H}px; margin: 0 } html, body { background: #fff !important }`}</style>
        {slides.map((s) => (
          <div key={s.id} className="overflow-hidden" style={{ width: W, height: H, breakAfter: "page" }} data-slide={s.id}>
            {s.render(ctx)}
          </div>
        ))}
      </div>
    );
  }

  const s = slides[idx];
  return (
    <div className="fixed inset-0 overflow-hidden bg-black" data-count={slides.length}>
      <div className="absolute top-1/2" style={{ left: "50%", width: W, height: H, transform: `translate(-50%, -50%) scale(${scale})` }}>
        <div className="h-full w-full overflow-hidden" data-slide={s.id}>
          {s.render(ctx)}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-white/10">
        <div className="h-full bg-sky-400 transition-all" style={{ width: `${((idx + 1) / slides.length) * 100}%` }} />
      </div>
      {chrome && (
        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-3 opacity-30 transition hover:opacity-100">
          <div className="flex items-center gap-1 rounded-xl bg-black/70 p-1 text-xs text-white">
            {(["all", "driver", "owner"] as const).map((t) => (
              <button key={t} onClick={() => { setTrack(t); setI(0); }} className={cx("rounded-lg px-3 py-1.5", track === t && "bg-sky-500")}>
                {t === "all" ? L("کامل", "Full") : t === "driver" ? L("مسیر راننده", "Driver") : L("مسیر معدن‌دار", "Owner")}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-black/70 p-1 text-white">
            <button onClick={() => go(-1)} className="rounded-lg p-2 hover:bg-white/10" aria-label="previous">
              {locale === "fa" ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
            </button>
            <span className="num px-2 text-sm">
              {idx + 1} / {slides.length}
            </span>
            <button onClick={() => go(1)} className="rounded-lg p-2 hover:bg-white/10" aria-label="next">
              {locale === "fa" ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
            </button>
            <button onClick={() => setNotes((x) => !x)} className={cx("rounded-lg p-2 hover:bg-white/10", notes && "bg-white/20")} title={L("یادداشت سخنران (N)", "Speaker notes (N)")}>
              <StickyNote className="size-5" />
            </button>
            <button onClick={() => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.())} className="rounded-lg p-2 hover:bg-white/10" title={L("تمام‌صفحه (F)", "Full screen (F)")}>
              <Expand className="size-5" />
            </button>
            <button className="rounded-lg px-2 py-1 text-xs hover:bg-white/10" onClick={() => setLocale(locale === "fa" ? "en" : "fa")}>
              {locale === "fa" ? "EN" : "فا"}
            </button>
            <Link href="/showcase" className="rounded-lg p-2 hover:bg-white/10" title={L("ویترین", "Showcase")}>
              <GalleryHorizontalEnd className="size-5" />
            </Link>
          </div>
        </div>
      )}
      {notes && (
        <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-black/85 p-5 text-lg leading-8 text-white shadow-2xl">
          <div className="mb-1 text-sm text-sky-300">
            {L("یادداشت سخنران", "Speaker notes")} · {L(...s.title)}
          </div>
          {L(...s.notes)}
        </div>
      )}
    </div>
  );
}
