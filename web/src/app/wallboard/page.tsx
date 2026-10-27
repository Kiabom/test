"use client";
import { IranPlate } from "@/components/domain/IranPlate";
import { cx } from "@/components/ui";
import { fmtNum, fmtTime } from "@/lib/format";
import { useLive, useMasters, useNow, useView } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import type { DashboardData } from "@/server/views";

/** Read-only full-screen control-room wallboard. */
export default function Wallboard() {
  const L = useL();
  const locale = useLocale();
  const live = useLive();
  const masters = useMasters();
  const now = useNow(1000);
  const { data } = useView<DashboardData>("dashboard", { range: "today" }, 5000);
  const k = data?.kpis;
  const tiles = [
    [L("خروجی امروز", "Outbound today"), k?.outboundT, "t"],
    [L("ورودی امروز", "Inbound today"), k?.inboundT, "t"],
    [L("سفرهای کامل", "Trips"), k?.tripsCompleted, ""],
    [L("داخل سایت", "On site"), live?.activeIds.length, ""],
    [L("صف باسکول‌ها", "Scale queues"), (live?.queues.B.length ?? 0) + (live?.queues.C.length ?? 0), ""],
    [L("هشدار باز", "Open alerts"), live?.openAlerts, ""],
  ] as const;
  return (
    <div className="min-h-screen bg-[#05070d] p-6 text-white" data-theme="dark">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-black">{L("Wallboard — سایت مرکزی معدن", "Wallboard — central mine site")}</h1>
        <div className="led text-4xl text-sky-300">{fmtTime(now, "en", true)}</div>
      </div>
      <div className="grid grid-cols-3 gap-4 xl:grid-cols-6">
        {tiles.map(([label, value, unit], i) => (
          <div key={i} className={cx("rounded-2xl border border-zinc-800 bg-zinc-900 p-5", label === L("هشدار باز", "Open alerts") && (live?.criticalAlerts ?? 0) > 0 && "border-red-600 bg-red-950")}>
            <div className="text-lg text-zinc-400">{label}</div>
            <div className="num mt-2 text-6xl font-black">
              {value != null ? fmtNum(value as number, locale, { maximumFractionDigits: 0 }) : "—"} <span className="text-2xl text-zinc-500">{unit}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-4">
        {live?.lanes.filter((l) => l.code !== "D").map((l) => {
          const v = l.visitId ? live.visits[l.visitId] : undefined;
          return (
            <div key={l.code} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="flex items-center justify-between text-xl text-zinc-400">
                <span>Lane {l.code}</span>
                <span className={cx("size-4 rounded-full", l.light === "GREEN" ? "bg-emerald-400" : l.light === "YELLOW" ? "bg-amber-400" : "bg-red-500")} />
              </div>
              <div className="mt-3 flex h-14 items-center">{v ? <IranPlate plate={v.plate} size="md" /> : <span className="text-zinc-600">—</span>}</div>
              {l.kind === "SCALE" && <div className="led mt-3 text-5xl" style={{ color: l.stable ? "#22ff88" : "#ffb000" }}>{fmtNum(l.weightKg, "en")} kg</div>}
            </div>
          );
        })}
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="mb-3 text-xl text-zinc-400">{L("آخرین محموله‌ها", "Latest loads")}</div>
          {data?.recent.slice(0, 7).map((t) => (
            <div key={t.id} className="flex items-center justify-between border-b border-zinc-800 py-2 text-xl">
              <IranPlate plate={t.plate} size="sm" />
              <span>{locale === "fa" ? masters?.materials.find((m) => m.id === t.materialId)?.name : masters?.materials.find((m) => m.id === t.materialId)?.nameEn}</span>
              <span className="num font-bold">{fmtNum(t.netKg, locale)} kg</span>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="mb-3 text-xl text-zinc-400">{L("هشدارها", "Alerts")}</div>
          {live?.latestAlerts.map((a) => (
            <div key={a.id} className={cx("mb-2 rounded-xl px-4 py-3 text-xl", a.severity === "CRITICAL" ? "bg-red-900" : a.severity === "HIGH" ? "bg-red-950" : "bg-amber-950")}>
              {locale === "fa" ? a.title : a.titleEn}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
