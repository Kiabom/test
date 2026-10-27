"use client";
import { use } from "react";
import { origin, Qr } from "@/components/domain/codes";
import { IranPlate } from "@/components/domain/IranPlate";
import { TrafficLight } from "@/components/domain/indicators";
import { laneName } from "@/components/domain/lanes";
import { cx } from "@/components/ui";
import { guidanceFor } from "@/domain/driverGuidance";
import { fmtTime } from "@/lib/format";
import { useLive, useNow } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";

/** Big outdoor driver display (LED style, 1920×1080, readable from distance). */
export default function DriverDisplay({ params }: { params: Promise<{ lane: string }> }) {
  const { lane: code } = use(params);
  const L = useL();
  const locale = useLocale();
  const live = useLive();
  const now = useNow(1000);
  const lane = live?.lanes.find((l) => l.code === code.toUpperCase());
  const v = lane?.visitId ? live?.visits[lane.visitId] : undefined;
  const g = guidanceFor(v ? ({ state: v.state, laneCode: v.laneCode, transactionIds: v.txIds, prevState: v.prevState } as never) : undefined, lane, { loadPoint: v?.loadingEquipmentId ? { "EQ-L1": "L-01", "EQ-L2": "L-02", "EQ-S1": "SH-01", "EQ-L3": "L-03" }[v.loadingEquipmentId] : "L-02" });
  const color = g.tone === "go" ? "var(--led-green)" : g.tone === "stop" ? "var(--led-red)" : g.tone === "wait" ? "var(--led-amber)" : "#7dd3fc";
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#020202] text-white" data-theme="dark">
      <div className="flex items-center justify-between border-b border-zinc-800 px-10 py-4">
        <div className="text-2xl font-bold text-zinc-400">{lane ? laneName(lane.code, L) : code}</div>
        <div className="led text-4xl text-sky-300">{fmtTime(now, "en", true)}</div>
      </div>
      <div className="grid flex-1 grid-cols-[260px_1fr_320px] items-center gap-10 px-10">
        <div className="flex justify-center">
          <TrafficLight state={g.light} size={140} />
        </div>
        <div className="flex flex-col items-center gap-8 text-center">
          {v ? <IranPlate plate={v.plate} size="xxl" /> : <div className="dotmatrix text-6xl text-zinc-600">— — —</div>}
          <div className={cx("dotmatrix font-black leading-tight", (locale === "fa" ? g.fa : g.en).length > 40 ? "text-6xl" : "text-7xl")} style={{ color }}>
            {locale === "fa" ? g.fa : g.en}
          </div>
          {lane?.kind === "SCALE" && (
            <div className="led text-[9rem] leading-none" style={{ color: lane.stable ? "var(--led-green)" : "var(--led-amber)" }}>
              {Math.round(lane.weightKg ?? 0).toLocaleString("en-US")}
              <span className="ms-4 text-5xl text-zinc-500">kg</span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center gap-4">
          {v && (
            <>
              <div className="text-center">
                <div className="text-xl text-zinc-400">{L("نوبت", "Queue no")}</div>
                <div className="led text-8xl text-amber-300">{v.queueNo}</div>
              </div>
              <div className="rounded-2xl bg-white p-3">
                <Qr value={`${origin()}/d/${v.driverToken}`} size={200} />
              </div>
              <div className="text-center text-lg text-zinc-400">{L("وضعیت سفر روی گوشی", "Trip status on your phone")}</div>
            </>
          )}
        </div>
      </div>
      <div className="marquee overflow-hidden border-t border-zinc-800 py-3 text-3xl text-amber-300">
        <span className="dotmatrix">
          {L("⚠ سرعت مجاز در محوطه ۱۰ کیلومتر · هنگام توزین موتور را خاموش و ترمز دستی را بکشید · استفاده از کلاه و جلیقه ایمنی الزامی است · رسید را از کیوسک دریافت کنید", "⚠ Yard speed limit 10 km/h · Engine off and handbrake on while weighing · Helmet and vest mandatory · Collect your receipt from the kiosk")}
        </span>
      </div>
    </div>
  );
}
