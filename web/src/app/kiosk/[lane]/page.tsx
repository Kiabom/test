"use client";
import { CheckCircle2, Phone, Printer, QrCode, Volume2, VolumeX } from "lucide-react";
import { use, useEffect, useRef, useState } from "react";
import { IranPlate } from "@/components/domain/IranPlate";
import { TrafficLight } from "@/components/domain/indicators";
import { cx } from "@/components/ui";
import { guidanceFor } from "@/domain/driverGuidance";
import { fmtNum } from "@/lib/format";
import { act, useLive } from "@/lib/live";
import { useL, useLocale, usePrefs } from "@/lib/prefs";

/** Touch kiosk at cab height: huge buttons, voice guidance, receipt printing, intercom. */
export default function Kiosk({ params }: { params: Promise<{ lane: string }> }) {
  const { lane: code } = use(params);
  const L = useL();
  const locale = useLocale();
  const setLocale = usePrefs((s) => s.setLocale);
  const live = useLive();
  const [muted, setMuted] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const lane = live?.lanes.find((l) => l.code === code.toUpperCase());
  const v = lane?.visitId ? live?.visits[lane.visitId] : undefined;
  const g = guidanceFor(v ? ({ state: v.state, laneCode: v.laneCode, transactionIds: v.txIds, prevState: v.prevState } as never) : undefined, lane);
  const lastSpoken = useRef("");
  const text = locale === "fa" ? g.fa : g.en;

  useEffect(() => {
    if (muted || typeof window === "undefined" || !("speechSynthesis" in window) || text === lastSpoken.current) return;
    lastSpoken.current = text;
    const u = new SpeechSynthesisUtterance(text.replace(/[⛔✓⏸]/g, ""));
    u.lang = locale === "fa" ? "fa-IR" : "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }, [text, muted, locale]);

  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(null), 3500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#0b2545] to-[#13315c] p-6 text-white" data-theme="dark">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">{L("کیوسک راننده", "Driver kiosk")} · {code.toUpperCase()}</div>
        <div className="flex gap-2">
          <button className="rounded-xl bg-white/10 px-4 py-3 text-lg" onClick={() => setLocale(locale === "fa" ? "en" : "fa")}>
            {locale === "fa" ? "English" : "فارسی"}
          </button>
          <button className="rounded-xl bg-white/10 px-4 py-3" onClick={() => setMuted((m) => !m)} aria-label="mute">
            {muted ? <VolumeX className="size-7" /> : <Volume2 className="size-7" />}
          </button>
        </div>
      </div>
      <div className="mt-6 flex flex-1 flex-col items-center gap-6">
        {v ? <IranPlate plate={v.plate} size="xl" /> : <div className="text-3xl text-white/50">{L("لطفاً کارت یا QR خود را اسکن کنید", "Please scan your card or QR")}</div>}
        <div className={cx("flex w-full max-w-3xl items-center gap-5 rounded-3xl p-6", g.tone === "go" ? "bg-emerald-600" : g.tone === "stop" ? "bg-red-600" : g.tone === "wait" ? "bg-amber-500 text-black" : "bg-white/10")}>
          <TrafficLight state={g.light} size={26} />
          <div className="text-3xl font-black leading-snug">{text}</div>
        </div>
        {lane?.kind === "SCALE" && (
          <div className="led text-8xl" style={{ color: lane.stable ? "var(--led-green)" : "var(--led-amber)" }}>
            {fmtNum(lane.weightKg, "en")} kg
          </div>
        )}
        <div className="grid w-full max-w-3xl grid-cols-2 gap-4">
          <button className="flex min-h-28 items-center justify-center gap-3 rounded-3xl bg-white text-2xl font-bold text-[#0b2545] active:scale-95" onClick={() => flash(v ? L("هویت شما تأیید شد ✓", "Identity confirmed ✓") : L("کارتی شناسایی نشد", "No card detected"))}>
            <QrCode className="size-9" /> {L("اسکن QR / کارت", "Scan QR / card")}
          </button>
          <button className="flex min-h-28 items-center justify-center gap-3 rounded-3xl bg-white text-2xl font-bold text-[#0b2545] active:scale-95" disabled={!v} onClick={() => flash(L("پلاک تأیید شد ✓", "Plate confirmed ✓"))}>
            <CheckCircle2 className="size-9" /> {L("تأیید پلاک و حواله", "Confirm plate & permit")}
          </button>
          <button
            className="flex min-h-28 items-center justify-center gap-3 rounded-3xl bg-white text-2xl font-bold text-[#0b2545] active:scale-95 disabled:opacity-40"
            disabled={!v?.txIds.length}
            onClick={async () => {
              const txId = v!.txIds.at(-1)!;
              await act("kiosk.print", { txId });
              window.open(`/print/ticket/${txId}?tpl=thermal`, "_blank");
              flash(L("رسید در حال چاپ است…", "Printing your receipt…"));
            }}
          >
            <Printer className="size-9" /> {L("چاپ رسید", "Print receipt")}
          </button>
          <button
            className="flex min-h-28 items-center justify-center gap-3 rounded-3xl bg-amber-400 text-2xl font-bold text-black active:scale-95"
            onClick={async () => {
              await act("driver.callOperator", { token: v?.driverToken ?? "", lane: code.toUpperCase() });
              flash(L("اپراتور در حال پاسخگویی است…", "Connecting to the operator…"));
            }}
          >
            <Phone className="size-9" /> {L("تماس با اپراتور (اینترکام)", "Call operator (intercom)")}
          </button>
        </div>
        {msg && <div className="rise rounded-2xl bg-white/15 px-6 py-4 text-2xl">{msg}</div>}
      </div>
    </div>
  );
}
