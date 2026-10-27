"use client";
import { MonitorPlay, Terminal } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IranPlate } from "@/components/domain/IranPlate";
import { LaneCard } from "@/components/domain/lanes";
import { CameraFeed } from "@/components/hardware/CameraFeed";
import { Badge, cx, Segmented, Skeleton, StatusPill } from "@/components/ui";
import { lbl, VISIT_STATE } from "@/i18n/labels";
import { fmtDuration, fmtTime } from "@/lib/format";
import { useLive } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";

const CAMS = [
  { id: "CAM-A-FRONT", view: "front", lane: "A" },
  { id: "CAM-A-REAR", view: "rear", lane: "A" },
  { id: "CAM-B-TOP", view: "top", lane: "B" },
  { id: "CAM-B-SIDE", view: "side", lane: "B" },
  { id: "CAM-C-FRONT", view: "front", lane: "C" },
  { id: "CAM-C-TOP", view: "top", lane: "C" },
  { id: "CAM-D-TOP", view: "top", lane: "D" },
  { id: "CAM-E-FRONT", view: "front", lane: "E" },
] as const;

export default function LivePage() {
  const L = useL();
  const locale = useLocale();
  const live = useLive();
  const [dark, setDark] = useState(true);
  const [cams, setCams] = useState<string[]>(["CAM-A-FRONT", "CAM-B-TOP", "CAM-C-FRONT", "CAM-B-SIDE"]);
  const logRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [live?.log.length]);
  if (!live) return <Skeleton className="h-[70vh]" />;
  const lanes = live.lanes.filter((l) => l.code !== "D");
  const active = live.activeIds.map((id) => live.visits[id]).filter(Boolean);
  const recent = live.recentExitedIds.map((id) => live.visits[id]).filter(Boolean);
  const base = dark ? "bg-[#0b1220] text-white -m-3 md:-m-5 p-3 md:p-5 min-h-[calc(100vh-3.5rem)]" : "";
  const card = dark ? "rounded-xl border border-white/10 bg-[#121d30]" : "rounded-xl border border-border bg-surface";
  return (
    <div className={base}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-sky-500/15 text-sky-400">
            <MonitorPlay className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{L("اتاق کنترل زنده", "Live control room")}</h1>
            <p className={cx("text-sm", dark ? "text-white/60" : "text-muted")}>{L("همه لاین‌ها، دوربین‌ها، وزن زنده و رخدادهای خام دستگاه‌ها", "All lanes, cameras, live weights and raw device events")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={live.mode === "AUTO" ? "info" : "warning"}>{live.mode === "AUTO" ? L("حالت خودکار (اپراتور مجازی)", "AUTO mode (virtual operator)") : L("حالت دستی", "MANUAL mode")}</Badge>
          <Badge tone="neutral">×{live.speed}</Badge>
          <Segmented options={[{ id: "dark", label: L("تیره", "Dark") }, { id: "light", label: L("روشن", "Light") }]} value={dark ? "dark" : "light"} onChange={(v) => setDark(v === "dark")} />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {lanes.map((l) => (
          <LaneCard key={l.code} lane={l} live={live} dark={dark} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-5">
        <div className={cx(card, "xl:col-span-3")}>
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm font-semibold">
            <span>{L("شبکه دوربین‌ها", "Camera wall")}</span>
            <div className="flex flex-wrap gap-1">
              {CAMS.map((c) => (
                <button key={c.id} onClick={() => setCams((s) => (s.includes(c.id) ? s.filter((x) => x !== c.id) : [...s.slice(-3), c.id]))} className={cx("rounded px-1.5 py-0.5 font-mono text-[10px]", cams.includes(c.id) ? "bg-sky-500 text-white" : dark ? "bg-white/10 text-white/70" : "bg-surface-2 text-muted")}>
                  {c.id}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 p-2">
            {cams.map((id) => {
              const c = CAMS.find((x) => x.id === id)!;
              const lane = live.lanes.find((l) => l.code === c.lane)!;
              const v = lane.visitId ? live.visits[lane.visitId] : undefined;
              const dev = live.devices.find((x) => x.id === id);
              return (
                <CameraFeed key={id} view={v ? c.view : "empty"} plate={v?.plate} color={v?.vehicleColor} loaded={v ? v.operation !== "RECEIVE" && v.state !== "ON_SCALE_1" : false} seed={(v?.queueNo ?? 3) * 31 + id.length} label={id} at={live.now} confidence={c.view === "front" ? v?.identity.anpr?.confidence : undefined} roi={c.view === "top" && v && lane.kind === "SCALE" ? (lane.positionOk ? "ok" : "bad") : undefined} offline={dev?.status === "OFFLINE"} />
              );
            })}
          </div>
        </div>
        <div className={cx(card, "flex flex-col xl:col-span-2")}>
          <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold">
            <Terminal className="size-4" />
            {L("لاگ خام دستگاه‌ها و قوانین", "Raw device & rules log")}
          </div>
          <div ref={logRef} className="h-[360px] overflow-auto bg-black/80 p-3 font-mono text-[11px] leading-5 ltr" dir="ltr">
            {live.log.map((l, i) => (
              <div key={i} className={cx(l.level === "error" ? "text-red-400" : l.level === "warn" ? "text-amber-300" : l.level === "device" ? "text-sky-300" : "text-emerald-300")}>
                <span className="text-zinc-500">{fmtTime(l.at, "en", true)}</span> <span className="text-zinc-400">[{l.source}]</span> {l.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <div className={card}>
          <div className="px-3 py-2 text-sm font-semibold">
            {L("خودروهای داخل سایت", "Vehicles on site")} <span className="num text-xs opacity-60">({active.length})</span>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {active.map((v) => (
                <tr key={v.id} className={cx("border-t", dark ? "border-white/10" : "border-border")}>
                  <td className="px-3 py-1.5">
                    <IranPlate plate={v.plate} size="xs" />
                  </td>
                  <td className="px-2 text-xs">
                    <Link href={`/app/transactions?visit=${v.id}`} className="hover:underline">
                      #{v.queueNo}
                    </Link>
                  </td>
                  <td className="px-2 text-xs">{lbl(VISIT_STATE, v.state, locale)}</td>
                  <td className="px-2 text-xs">{v.laneCode ? `Lane ${v.laneCode}` : "—"}</td>
                  <td className="num px-2 text-xs">{fmtDuration(new Date(live.now).getTime() - new Date(v.arrivedAt).getTime(), locale)}</td>
                  <td className="px-2">{v.state === "HOLD" && <StatusPill status="HOLD" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={card}>
          <div className="px-3 py-2 text-sm font-semibold">{L("اخیراً خارج‌شده", "Recently exited")}</div>
          <table className="w-full text-sm">
            <tbody>
              {recent.map((v) => (
                <tr key={v.id} className={cx("border-t", dark ? "border-white/10" : "border-border")}>
                  <td className="px-3 py-1.5">
                    <IranPlate plate={v.plate} size="xs" />
                  </td>
                  <td className="px-2 text-xs">{v.driverName}</td>
                  <td className="px-2 text-xs">{lbl(VISIT_STATE, v.state, locale)}</td>
                  <td className="px-2 text-xs">{v.permitNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
