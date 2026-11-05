"use client";
import { SITE } from "@/config/brand";
import { AlertTriangle, BadgeCheck, BookOpen, FileCheck2, HelpCircle, MapPin, Printer, ShieldAlert } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { origin, Qr } from "@/components/domain/codes";
import { TrafficLight } from "@/components/domain/indicators";
import { NavButtons } from "@/components/map/NavButtons";
import { Logo } from "@/components/shell/Logo";
import { Button, Card, Skeleton } from "@/components/ui";
import { STATIONS, type StationKey } from "@/domain/geo";
import { JOURNEY_STEPS } from "@/domain/journey";
import { fmtNum } from "@/lib/format";
import { useL, useLocale, usePrefs } from "@/lib/prefs";

const SiteOverviewMap = dynamic(() => import("@/components/map/SiteOverviewMap"), { ssr: false, loading: () => <Skeleton className="h-full w-full" /> });

const NUMBERS: Partial<Record<StationKey, number>> = { approach: 0, A: 1, parking: 2, B: 3, "L-01": 4, "L-02": 4, "SH-01": 4, D: 5, C: 6, E: 8 };

const DOCS: [string, string][] = [
  ["گواهینامه پایه یک معتبر", "Valid class-1 driving licence"],
  ["بیمه شخص ثالث و معاینه فنی معتبر", "Valid third-party insurance and inspection"],
  ["شماره حواله یا بارنامه (در پیامک نوبت آمده است)", "Permit or waybill number (in your booking SMS)"],
  ["کارت RFID نصب‌شده روی شیشه (برای خودروهای ثبت‌شده)", "RFID tag on the windscreen (registered vehicles)"],
  ["کلاه ایمنی، جلیقه شب‌رنگ و کفش ایمنی", "Helmet, high-visibility vest and safety boots"],
  ["روکش (چادر) بار سالم", "A working load tarp"],
];
const RULES: [string, string][] = [
  ["حداکثر سرعت داخل معدن ۲۰ و زیر اسکنر ۱۰ کیلومتر بر ساعت", "Max 20 km/h on site and 10 km/h under the scanner"],
  ["روی باسکول: توقف کامل، ترمز دستی، موتور خاموش، از کابین پیاده نشوید", "On the scale: full stop, handbrake, engine off, stay in the cab"],
  ["همه چرخ‌ها داخل خط زرد باسکول؛ اگر مانیتور گفت «جلو بروید» موقعیت را اصلاح کنید", "All wheels inside the yellow lines; if the display says “move forward”, fix your position"],
  ["فقط به ایستگاه شماره‌داری بروید که گوشی یا مانیتور اعلام کرده است", "Only go to the numbered station your phone or the display announces"],
  ["از محدوده چرخش لودر و شاول دور بمانید", "Keep clear of the loader and shovel swing area"],
  ["QR خروج یک‌بارمصرف است؛ آن را برای کسی نفرستید", "The exit QR works once; never forward it"],
];
const FAQ: [string, string, string, string][] = [
  ["لینک پیامکی را ندارم یا گم کردم", "I don't have the SMS link", "در دروازه، نگهبان با پلاک شما لینک را دوباره می‌فرستد.", "At the gate the guard resends it using your plate."],
  ["مانیتور گفت «منتظر بمانید»", "The display says “please wait”", "پیاده نشوید؛ حراست در حال بررسی مدارک یا هویت است. از دکمه «تماس با اپراتور» در گوشی استفاده کنید.", "Stay in the cab; security is checking documents or identity. Use “call operator” on your phone."],
  ["وزن من اشتباه است", "My weight looks wrong", "وزن فقط وقتی ثبت می‌شود که پایدار و تازه باشد و ۴ دوربین عکس بگیرند. اعتراض را با شماره رسید به اپراتور بگویید.", "Weight is recorded only when stable and fresh, with 4 camera photos. Report it to the operator with the receipt number."],
  ["اضافه‌بار دارم", "I'm overloaded", "مانیتور و گوشی می‌گویند کجا مازاد را تخلیه کنید؛ پس از تخلیه دوباره توزین می‌شوید.", "The display and your phone say where to unload the excess; you are then weighed again."],
  ["GPS گوشی کار نمی‌کند", "Phone GPS doesn't work", "دسترسی موقعیت را برای مرورگر روشن کنید. دکمه «مسیریابی» بدون آن هم شما را به برنامه نقشه می‌برد.", "Allow location for the browser. “Navigate” still opens your map app without it."],
];
const LIGHTS: { state: "GREEN" | "YELLOW" | "RED"; fa: string; en: string }[] = [
  { state: "GREEN", fa: "سبز: حرکت کنید / عبور مجاز", en: "Green: go / passage allowed" },
  { state: "YELLOW", fa: "زرد: آهسته جلو بیایید / در حال شناسایی", en: "Yellow: move slowly / identifying" },
  { state: "RED", fa: "قرمز: توقف کامل / منتظر بمانید", en: "Red: full stop / wait" },
];
const SCREENS: [string, string, string][] = [
  ["آهسته جلو بیایید و روی باسکول بایستید", "Drive forward slowly onto the scale", "#b7791f"],
  ["⛔ چرخ عقب خارج از باسکول است — کمی جلو بروید", "⛔ Rear wheels off the deck — move forward", "#b42335"],
  ["توقف کامل — ترمز دستی — در حال توزین…", "Stop completely — handbrake on — weighing…", "#b42335"],
  ["✓ وزن ثبت شد — به محل بارگیری L-02 بروید", "✓ Weight recorded — go to loading point L-02", "#168567"],
  ["✓ مجوز خروج آماده است — QR را در دروازه خروج نشان دهید", "✓ Exit permit ready — show the QR at the exit gate", "#168567"],
];

export default function DriverGuide() {
  const L = useL();
  const locale = useLocale();
  const setLocale = usePrefs((s) => s.setLocale);
  return (
    <div className="mx-auto max-w-3xl p-4 pb-16 print:max-w-none">
      <div className="flex items-center justify-between">
        <Logo locale={locale} />
        <div className="flex items-center gap-2 print:hidden">
          <button className="text-xs text-primary" onClick={() => setLocale(locale === "fa" ? "en" : "fa")}>
            {locale === "fa" ? "EN" : "فا"}
          </button>
          <Button size="sm" onClick={() => window.print()}>
            <Printer className="size-4" /> {L("چاپ", "Print")}
          </Button>
        </div>
      </div>
      <h1 className="mt-6 flex items-center gap-2 text-2xl font-black">
        <BookOpen className="size-6 text-primary" /> {L("راهنمای راننده — همه مراحل سفر در معدن", "Driver guide — every step of a trip at the mine")}
      </h1>
      <p className="mt-2 text-sm leading-7 text-muted">
        {L(
          "هر ایستگاه در معدن یک تابلو با شماره دارد. گوشی شما (لینک پیامکی)، مانیتور بزرگ کنار باسکول و کیوسک همیشه یک پیام را نشان می‌دهند: الان کجا باشید و چه کنید.",
          "Every station on site has a numbered sign. Your phone (SMS link), the big display by the scale and the kiosk always show the same message: where to be now and what to do.",
        )}
      </p>

      <Card className="mt-4 overflow-hidden p-2">
        <div className="h-[380px]">
          <SiteOverviewMap locale={locale} numbers={NUMBERS} />
        </div>
        <div className="grid gap-3 p-2 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="text-sm">
            <div className="flex items-center gap-1.5 font-semibold">
              <MapPin className="size-4 text-success" /> {L("مسیریابی تا ورودی معدن", "Navigate to the mine entrance")}
            </div>
            <div className="text-xs text-muted">{L(`${SITE.name} · ${SITE.place}`, `${SITE.nameEn} · ${SITE.placeEn}`)}</div>
          </div>
          <div className="sm:w-80">
            <NavButtons at={STATIONS.approach.at} label={L(STATIONS.approach.fa, STATIONS.approach.en)} compact />
          </div>
        </div>
      </Card>

      <h2 className="mt-8 text-lg font-bold">{L("مراحل سفر", "Trip steps")}</h2>
      <div className="mt-3 flex flex-col gap-3">
        {JOURNEY_STEPS.map((s) => (
          <Card key={s.id} className="flex gap-3 p-4 print:break-inside-avoid">
            <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-lg font-black text-white">{fmtNum(s.n, locale)}</div>
            <div className="min-w-0 text-sm leading-7">
              <div className="font-bold">{L(s.fa, s.en)}</div>
              <div>{L(...s.driverDo)}</div>
              <div className="text-muted">{L(...s.driverNeed)}</div>
              {s.place !== "destination" && (
                <div className="mt-1 flex items-center gap-1 text-xs text-muted">
                  <MapPin className="size-3.5" />
                  {s.id === "LOAD" ? L("نقطه بارگیری اعلام‌شده (L-01، L-02 یا SH-01)", "The announced loading point (L-01, L-02 or SH-01)") : L(STATIONS[s.place].fa, STATIONS[s.place].en)}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h2 className="mb-2 flex items-center gap-2 font-bold">
            <FileCheck2 className="size-5 text-primary" /> {L("مدارک و تجهیزات لازم", "Documents & equipment")}
          </h2>
          <ul className="space-y-1.5 text-sm">
            {DOCS.map(([fa, en]) => (
              <li key={en} className="flex gap-2">
                <BadgeCheck className="mt-1 size-4 shrink-0 text-success" /> {L(fa, en)}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-4">
          <h2 className="mb-2 flex items-center gap-2 font-bold">
            <ShieldAlert className="size-5 text-danger" /> {L("قوانین ایمنی سایت", "Site safety rules")}
          </h2>
          <ul className="space-y-1.5 text-sm">
            {RULES.map(([fa, en]) => (
              <li key={en} className="flex gap-2">
                <AlertTriangle className="mt-1 size-4 shrink-0 text-warning" /> {L(fa, en)}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-4 p-4">
        <h2 className="mb-3 font-bold">{L("معنی چراغ‌ها و پیام‌های مانیتور", "What the lights and the display mean")}</h2>
        <div className="grid gap-4 md:grid-cols-[220px_1fr]">
          <div className="space-y-3">
            {LIGHTS.map((l) => (
              <div key={l.state} className="flex items-center gap-3 text-sm">
                <TrafficLight state={l.state} size={14} />
                {L(l.fa, l.en)}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {SCREENS.map(([fa, en, c]) => (
              <div key={en} className="rounded-lg bg-black px-3 py-2 font-bold" style={{ color: c === "#168567" ? "#4ade80" : c === "#b42335" ? "#f87171" : "#fbbf24" }}>
                {L(fa, en)}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="mt-4 p-4">
        <h2 className="mb-2 flex items-center gap-2 font-bold">
          <HelpCircle className="size-5 text-primary" /> {L("پرسش‌های رایج", "FAQ")}
        </h2>
        <div className="divide-y divide-border text-sm">
          {FAQ.map(([qfa, qen, afa, aen]) => (
            <div key={qen} className="py-2">
              <div className="font-semibold">{L(qfa, qen)}</div>
              <div className="text-muted">{L(afa, aen)}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-4 flex items-center gap-4 p-4 print:break-inside-avoid">
        <div className="rounded-lg bg-white p-2">
          <Qr value={`${origin()}/d/guide`} size={110} />
        </div>
        <div className="text-sm">
          <div className="font-bold">{L("این راهنما روی تابلوی دروازه", "This guide on the gate sign")}</div>
          <div className="text-muted">{L("راننده با اسکن این QR راهنما را روی گوشی باز می‌کند.", "Drivers scan this QR to open the guide on their phone.")}</div>
          <Link href="/d" className="mt-1 inline-block text-primary print:hidden">
            {L("نمونه لینک سفر راننده ←", "Sample driver trip links →")}
          </Link>
        </div>
      </Card>
    </div>
  );
}
