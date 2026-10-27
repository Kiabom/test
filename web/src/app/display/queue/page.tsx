"use client";
import { IranPlate } from "@/components/domain/IranPlate";
import { cx } from "@/components/ui";
import { fmtTime } from "@/lib/format";
import { useLive, useNow } from "@/lib/live";
import { useL } from "@/lib/prefs";

/** Parking-lot call board — one column per lane, "next" and "waiting" rows, green/red status. */
export default function QueueBoard() {
  const L = useL();
  const live = useLive();
  const now = useNow(1000);
  const cols = [
    { code: "A", title: L("دروازه ورود", "Entry gate"), ids: live?.queues.gateIn ?? [] },
    { code: "B", title: L("باسکول ۱", "Scale 1"), ids: live?.queues.B ?? [] },
    { code: "C", title: L("باسکول ۲", "Scale 2"), ids: live?.queues.C ?? [] },
    { code: "E", title: L("دروازه خروج", "Exit gate"), ids: live?.queues.gateOut ?? [] },
  ];
  return (
    <div className="min-h-screen bg-[#05070d] p-6 text-white" data-theme="dark">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-4xl font-black text-sky-300">{L("تابلو فراخوان کامیون‌ها", "Truck call board")}</h1>
        <div className="led text-4xl text-amber-300">{fmtTime(now, "en", true)}</div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {cols.map((c) => {
          const lane = live?.lanes.find((l) => l.code === c.code);
          const onLane = lane?.visitId ? live?.visits[lane.visitId] : undefined;
          const next = c.ids[0] ? live?.visits[c.ids[0]] : undefined;
          const busy = !!onLane || lane?.locked;
          return (
            <div key={c.code} className="overflow-hidden rounded-2xl border border-zinc-800">
              <div className="bg-[#1e3a8a] px-4 py-3 text-center text-2xl font-bold">
                {c.code} · {c.title}
              </div>
              <div className={cx("px-4 py-2 text-center text-xl font-bold", busy ? "bg-red-600" : "bg-emerald-600")}>{lane?.locked ? L("خارج از سرویس", "Out of service") : busy ? L("مشغول", "Busy") : L("آزاد", "Free")}</div>
              <div className="flex min-h-28 flex-col items-center justify-center gap-2 bg-zinc-900 p-3">
                <div className="text-sm text-zinc-400">{L("روی لاین", "On lane")}</div>
                {onLane ? <IranPlate plate={onLane.plate} size="md" /> : <div className="text-zinc-600">—</div>}
              </div>
              <div className="flex min-h-36 flex-col items-center justify-center gap-2 bg-zinc-800/70 p-3">
                <div className="text-lg font-bold text-amber-300">{L("نفر بعد ▶", "NEXT ▶")}</div>
                {next ? (
                  <>
                    <IranPlate plate={next.plate} size="lg" />
                    <div className="led text-3xl text-amber-300">#{next.queueNo}</div>
                  </>
                ) : (
                  <div className="text-zinc-600">—</div>
                )}
              </div>
              <div className="flex flex-col gap-2 bg-zinc-900 p-3">
                <div className="text-sm text-zinc-400">{L("در انتظار", "Waiting")}</div>
                {c.ids.slice(1, 7).map((id) => {
                  const v = live?.visits[id];
                  return v ? (
                    <div key={id} className="flex items-center justify-between">
                      <IranPlate plate={v.plate} size="sm" />
                      <span className="led text-xl text-zinc-300">#{v.queueNo}</span>
                    </div>
                  ) : null;
                })}
                {c.ids.length <= 1 && <div className="text-center text-zinc-600">—</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
