"use client";
import { AlertTriangle, ChevronLeft, Cpu, ListOrdered, Map as MapIcon, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { IranPlate } from "@/components/domain/IranPlate";
import { Badge, Card, CardHeader, cx, Drawer, KpiTile, Kv, PageHeader, Skeleton } from "@/components/ui";
import { DECISION_CODE, DEVICE_TYPE, lbl, VISIT_STATE } from "@/i18n/labels";
import { fmtNum, fmtRelative } from "@/lib/format";
import { useLive, useMasters } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import type { LiveData, VisitBrief } from "@/server/views";

type StationId = "park" | "A" | "B" | "yard" | "D" | "C" | "E" | "ctrl";

/**
 * Plan of the truck route (1000 × 640 units). The road runs right → left along the bottom,
 * up past the loading yard, then left → right along the top to the exit.
 */
const STATIONS: { id: StationId; n?: number; fa: string; en: string; subFa: string; subEn: string; box: [number, number, number, number] }[] = [
  { id: "park", n: 1, fa: "پارکینگ انتظار", en: "Waiting area", subFa: "صف ورود و توزین اول", subEn: "Entry & first-weigh queue", box: [790, 440, 200, 150] },
  { id: "A", n: 2, fa: "دروازه ورود", en: "Entry gate", subFa: "لاین A · پلاک‌خوان و RFID", subEn: "Lane A · ANPR & RFID", box: [590, 440, 175, 150] },
  { id: "B", n: 3, fa: "باسکول ۱", en: "Scale 1", subFa: "لاین B · توزین اول", subEn: "Lane B · first weigh", box: [385, 440, 180, 150] },
  { id: "yard", n: 4, fa: "محوطه بارگیری و دپوها", en: "Loading yard & stockpiles", subFa: "لودرها و شاول", subEn: "Loaders & shovel", box: [20, 170, 300, 170] },
  { id: "D", n: 5, fa: "اسکنر LiDAR", en: "LiDAR scanner", subFa: "لاین D · حجم و پروفیل بار", subEn: "Lane D · load volume", box: [385, 35, 175, 150] },
  { id: "C", n: 6, fa: "باسکول ۲", en: "Scale 2", subFa: "لاین C · توزین دوم", subEn: "Lane C · second weigh", box: [585, 35, 180, 150] },
  { id: "E", n: 7, fa: "دروازه خروج", en: "Exit gate", subFa: "لاین E · مجوز خروج QR", subEn: "Lane E · QR exit permit", box: [790, 35, 180, 150] },
  { id: "ctrl", fa: "اتاق کنترل", en: "Control room", subFa: "Edge، PLC و تابلو صف", subEn: "Edge, PLC & queue board", box: [560, 275, 210, 100] },
];
const LANE_OF: Partial<Record<StationId, string>> = { A: "L-A", B: "L-B", C: "L-C", D: "L-D", E: "L-E" };

function stationOf(v: VisitBrief, live: LiveData): StationId {
  if (v.laneCode) return v.laneCode;
  if (v.state === "LOADING" || live.queues.C.includes(v.id)) return "yard";
  if (v.state === "READY_TO_EXIT" || live.queues.gateOut.includes(v.id)) return "E";
  return "park";
}
function deviceStation(laneId: string | undefined, id: string): StationId {
  const s = (Object.keys(LANE_OF) as StationId[]).find((k) => LANE_OF[k] === laneId);
  if (s) return s;
  return id === "QB-1" ? "park" : "ctrl";
}
/** Truck chips that fit in one row of a station card; the rest show as «+n» (all are listed in the side panel). */
const cap = (id: StationId) => (id === "yard" ? 10 : 3);
const lightColor = (l?: string) => (l === "GREEN" ? "#16a34a" : l === "YELLOW" ? "#eab308" : "#dc2626");

export default function SiteMap() {
  const L = useL();
  const locale = useLocale();
  const live = useLive();
  const masters = useMasters();
  const [station, setStation] = useState<StationId | null>(null);
  const [truck, setTruck] = useState<string | null>(null);

  const model = useMemo(() => {
    if (!live) return null;
    const trucks: Record<string, VisitBrief[]> = {};
    for (const id of live.activeIds) {
      const v = live.visits[id];
      (trucks[stationOf(v, live)] ??= []).push(v);
    }
    const devices: Record<string, LiveData["devices"]> = {};
    for (const d of live.devices) (devices[deviceStation(d.laneId, d.id)] ??= []).push(d);
    return { trucks, devices };
  }, [live]);

  if (!live || !model) return <Skeleton className="h-[70vh]" />;
  const nm = (fa: string, en: string) => (locale === "fa" ? fa : en);
  const held = live.activeIds.filter((id) => live.visits[id].state === "HOLD").length;
  const queued = live.queues.gateIn.length + live.queues.B.length + live.queues.C.length + live.queues.gateOut.length;
  const devOk = live.devices.filter((d) => d.status === "ONLINE").length;
  const health = (id: StationId) => {
    const list = model.devices[id] ?? [];
    const off = list.filter((d) => d.status === "OFFLINE").length;
    const deg = list.filter((d) => d.status === "DEGRADED").length;
    return { total: list.length, ok: list.length - off - deg, tone: off ? "danger" : deg ? "warning" : "success" } as const;
  };
  const laneLight = (id: StationId) => live.lanes.find((l) => l.code === id)?.light;
  const sel = STATIONS.find((s) => s.id === station);
  const selVisit = truck ? live.visits[truck] : undefined;
  const devName = (id: string) => {
    const d = masters?.devices.find((x) => x.id === id);
    return d ? d.name : id;
  };

  return (
    <div>
      <PageHeader icon={<MapIcon className="size-5" />} title={L("نقشه سایت زنده", "Live site map")} subtitle={L("مسیر کامیون از ورود تا خروج؛ روی هر ایستگاه بزنید تا کامیون‌ها و تجهیزات آن را ببینید", "The truck route from entry to exit; select a station to see its trucks and devices")} />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile label={L("کامیون داخل سایت", "Trucks on site")} value={fmtNum(live.activeIds.length, locale)} icon={<Truck className="size-5" />} />
        <KpiTile label={L("در صف", "In queue")} value={fmtNum(queued, locale)} icon={<ListOrdered className="size-5" />} tone="info" />
        <KpiTile label={L("نگه‌داشته‌شده", "On hold")} value={fmtNum(held, locale)} icon={<AlertTriangle className="size-5" />} tone={held ? "danger" : "neutral"} />
        <KpiTile label={L("دستگاه‌های سالم", "Devices healthy")} value={`${fmtNum(devOk, locale)} / ${fmtNum(live.devices.length, locale)}`} icon={<Cpu className="size-5" />} tone={devOk === live.devices.length ? "success" : "warning"} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="overflow-hidden">
          <CardHeader title={L("مسیر تردد کامیون", "Truck route")} subtitle={L("شماره‌ها ترتیب مراحل است؛ پیکان‌ها جهت حرکت را نشان می‌دهند", "Numbers give the order of steps; arrows show the direction of travel")} />
          <div className="overflow-x-auto p-3">
            <div dir="ltr" className="relative mx-auto aspect-[1000/640] min-w-[760px] rounded-xl bg-[#efe9df] dark:bg-[#18212e]">
              <svg viewBox="0 0 1000 640" className="absolute inset-0 size-full" aria-hidden>
                {/* road */}
                <path d="M1000 515 H360 V110 H1000" fill="none" stroke="#9a8c78" strokeOpacity="0.45" strokeWidth="58" strokeLinejoin="round" />
                <path d="M1000 515 H360 V110 H1000" fill="none" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="2" strokeDasharray="14 12" />
                {/* direction */}
                {[
                  [779, 515, 180],
                  [578, 515, 180],
                  [372, 515, 180],
                  [360, 400, 270],
                  [360, 230, 270],
                  [573, 110, 0],
                  [778, 110, 0],
                  [986, 110, 0],
                ].map(([x, y, r], i) => (
                  <path key={i} d="M-9 -9 L5 0 L-9 9" transform={`translate(${x} ${y}) rotate(${r})`} fill="none" stroke="#5b4b36" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                ))}
                {/* yard spur */}
                <path d="M320 255 H360" stroke="#9a8c78" strokeOpacity="0.45" strokeWidth="40" />
                {/* stockpiles */}
                {[
                  [95, 400, 46, "#8c2f1b"],
                  [190, 412, 40, "#343a40"],
                  [272, 404, 34, "#5c4033"],
                ].map(([x, y, r, c], i) => (
                  <ellipse key={i} cx={x as number} cy={y as number} rx={r as number} ry={(r as number) * 0.45} fill={c as string} opacity="0.8" />
                ))}
                <text x="990" y="625" textAnchor="end" fontSize="13" fill="#6b5a44" fontFamily="Vazirmatn Variable, sans-serif">{nm("ورودی از جاده دسترسی", "From access road")}</text>
                <text x="990" y="210" textAnchor="end" fontSize="13" fill="#6b5a44" fontFamily="Vazirmatn Variable, sans-serif">{nm("خروج به جاده اصلی", "Exit to main road")}</text>
              </svg>

              {/* stockpile labels */}
              {[
                [95, 432, "هماتیت دانه‌بندی", "Lump"],
                [190, 444, "کنسانتره", "Concentrate"],
                [272, 436, "نرمه", "Fines"],
              ].map(([x, y, fa, en]) => (
                <span key={en as string} className="absolute -translate-x-1/2 text-[10px] font-medium text-[#5b4b36] dark:text-white/70" style={{ left: `${(x as number) / 10}%`, top: `${((y as number) / 640) * 100}%` }}>
                  {nm(fa as string, en as string)}
                </span>
              ))}

              {STATIONS.map((s) => {
                const [x, y, w, h] = s.box;
                const list = model.trucks[s.id] ?? [];
                const hl = health(s.id);
                const light = laneLight(s.id);
                const active = station === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStation(active ? null : s.id)}
                    dir={locale === "fa" ? "rtl" : "ltr"}
                    className={cx(
                      "absolute flex flex-col gap-1.5 overflow-hidden rounded-xl border bg-surface/95 p-2 text-start shadow-sm transition hover:shadow-md",
                      s.id === "yard" && "bg-surface/80",
                      active ? "border-primary ring-2 ring-primary/40" : "border-border",
                    )}
                    style={{ left: `${x / 10}%`, top: `${(y / 640) * 100}%`, width: `${w / 10}%`, height: `${(h / 640) * 100}%` }}
                  >
                    <span className="flex items-start gap-1.5">
                      {s.n ? <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-white num">{fmtNum(s.n, locale)}</span> : <Cpu className="size-4 shrink-0 text-muted" />}
                      <span className="min-w-0 flex-1">
                        <span className="block text-[12px] font-bold leading-5">{nm(s.fa, s.en)}</span>
                        <span className="block text-[10px] leading-4 text-muted">{nm(s.subFa, s.subEn)}</span>
                      </span>
                      {LANE_OF[s.id] && <span className="mt-1 size-2.5 shrink-0 rounded-full ring-2 ring-surface" style={{ background: lightColor(light) }} title={L("چراغ لاین", "Lane light")} />}
                    </span>
                    {s.id !== "ctrl" && (
                      <span className="flex min-h-5 flex-wrap gap-1">
                        {list.length === 0 && <span className="text-[10px] text-muted">{L("خالی", "Empty")}</span>}
                        {list.slice(0, list.length > cap(s.id) ? cap(s.id) - 1 : cap(s.id)).map((v) => (
                          <span
                            key={v.id}
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              setTruck(v.id);
                            }}
                            className={cx("inline-flex h-5 items-center gap-0.5 rounded-md px-1.5 text-[10px] font-bold text-white num", v.state === "HOLD" ? "bg-danger" : "bg-slate-600")}
                            title={v.plateNormalized}
                          >
                            <Truck className="size-3" />
                            {fmtNum(v.queueNo, locale)}
                            {v.state === "HOLD" && "!"}
                          </span>
                        ))}
                        {list.length > cap(s.id) && <span className="inline-flex h-5 items-center rounded-md bg-surface-2 px-1.5 text-[10px] font-bold text-muted num">+{fmtNum(list.length - cap(s.id) + 1, locale)}</span>}
                      </span>
                    )}
                    {hl.total > 0 && (
                      <span className={cx("mt-auto inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold", hl.tone === "success" ? "bg-success/10 text-success" : hl.tone === "warning" ? "bg-warning/15 text-warning" : "bg-danger/10 text-danger")}>
                        {L("دستگاه‌ها", "Devices")} <span className="num">{fmtNum(hl.ok, locale)}/{fmtNum(hl.total, locale)}</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border px-4 py-3 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-flex h-5 items-center gap-0.5 rounded-md bg-slate-600 px-1.5 text-[10px] font-bold text-white">
                <Truck className="size-3" />۱۲
              </span>
              {L("کامیون (شماره نوبت)", "Truck (queue no.)")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-flex h-5 items-center rounded-md bg-danger px-1.5 text-[10px] font-bold text-white">!</span>
              {L("نگه‌داشته‌شده", "On hold")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              {["#16a34a", "#eab308", "#dc2626"].map((c) => (
                <span key={c} className="size-2.5 rounded-full" style={{ background: c }} />
              ))}
              {L("چراغ لاین: سبز / زرد / قرمز", "Lane light: green / yellow / red")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">۸/۸</span>
              {L("دستگاه‌های سالم ایستگاه", "Healthy devices at station")}
            </span>
          </div>
        </Card>

        <Card className="flex flex-col">
          {!sel ? (
            <>
              <CardHeader title={L("ایستگاه‌ها", "Stations")} subtitle={L("برای جزئیات یک ایستگاه را انتخاب کنید", "Select a station for details")} />
              <ul className="divide-y divide-border">
                {STATIONS.map((s) => {
                  const n = (model.trucks[s.id] ?? []).length;
                  const h = (model.trucks[s.id] ?? []).filter((v) => v.state === "HOLD").length;
                  const hl = health(s.id);
                  return (
                    <li key={s.id}>
                      <button type="button" onClick={() => setStation(s.id)} className="flex w-full items-center gap-3 px-4 py-2.5 text-start text-sm hover:bg-surface-2">
                        {s.n ? <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary num">{fmtNum(s.n, locale)}</span> : <Cpu className="size-5 shrink-0 text-muted" />}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{nm(s.fa, s.en)}</span>
                          <span className="block text-xs text-muted">
                            {s.id === "ctrl" ? nm(s.subFa, s.subEn) : `${fmtNum(n, locale)} ${L("کامیون", "trucks")}`}
                            {h > 0 && <span className="ms-1 text-danger">· {fmtNum(h, locale)} {L("نگه‌داشته", "held")}</span>}
                          </span>
                        </span>
                        {hl.total > 0 && <Badge tone={hl.tone}>{fmtNum(hl.ok, locale)}/{fmtNum(hl.total, locale)}</Badge>}
                        <ChevronLeft className="size-4 text-muted ltr:rotate-180" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <>
              <CardHeader
                title={
                  <span className="flex items-center gap-2">
                    {sel.n && <span className="grid size-6 place-items-center rounded-full bg-primary text-xs font-bold text-white num">{fmtNum(sel.n, locale)}</span>}
                    {nm(sel.fa, sel.en)}
                  </span>
                }
                subtitle={nm(sel.subFa, sel.subEn)}
                actions={
                  <button type="button" onClick={() => setStation(null)} className="rounded-lg px-2 py-1 text-xs text-primary hover:bg-primary/10">
                    {L("همه ایستگاه‌ها", "All stations")}
                  </button>
                }
              />
              {sel.id !== "ctrl" && (
                <div className="px-4 pb-3">
                  <div className="mb-2 text-xs font-semibold text-muted">{L("کامیون‌ها", "Trucks")}</div>
                  {(model.trucks[sel.id] ?? []).length === 0 && <div className="rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">{L("کامیونی در این ایستگاه نیست", "No trucks at this station")}</div>}
                  <div className="flex flex-col gap-1.5">
                    {(model.trucks[sel.id] ?? []).map((v) => (
                      <button key={v.id} type="button" onClick={() => setTruck(v.id)} className={cx("flex items-center gap-3 rounded-lg border px-3 py-2 text-start hover:bg-surface-2", v.state === "HOLD" ? "border-danger/40 bg-danger/5" : "border-border")}>
                        <IranPlate plate={v.plate} size="xs" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm">{nm(v.driverName, v.driverNameEn)}</span>
                          <span className={cx("block truncate text-xs", v.state === "HOLD" ? "text-danger" : "text-muted")}>
                            {v.state === "HOLD" && v.holdReasons.length ? v.holdReasons.map((r) => lbl(DECISION_CODE, r, locale)).join("، ") : lbl(VISIT_STATE, v.state, locale)}
                          </span>
                        </span>
                        <span className="text-xs text-muted num">#{fmtNum(v.queueNo, locale)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="border-t border-border px-4 py-3">
                <div className="mb-2 text-xs font-semibold text-muted">{L("تجهیزات", "Devices")}</div>
                {(model.devices[sel.id] ?? []).length === 0 && <div className="text-sm text-muted">{L("تجهیزی ثبت نشده", "No devices")}</div>}
                <ul className="flex flex-col gap-1">
                  {(model.devices[sel.id] ?? []).map((d) => (
                    <li key={d.id} className="flex items-center gap-2 text-sm">
                      <span className={cx("size-2 shrink-0 rounded-full", d.status === "ONLINE" ? "bg-success" : d.status === "DEGRADED" ? "bg-warning" : "bg-danger")} />
                      <span className="min-w-0 flex-1 truncate">{devName(d.id)}</span>
                      <span className="text-[11px] text-muted">{lbl(DEVICE_TYPE, d.type, locale)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {sel.id === "yard" && (masters?.equipment ?? []).length > 0 && (
                <div className="border-t border-border px-4 py-3">
                  <div className="mb-2 text-xs font-semibold text-muted">{L("ماشین‌آلات بارگیری", "Loading equipment")}</div>
                  <ul className="flex flex-col gap-1">
                    {masters!.equipment.map((e) => (
                      <li key={e.id} className="flex items-center justify-between text-sm">
                        <span>{nm(e.name, e.nameEn)}</span>
                        <Badge tone={e.status === "WORKING" ? "success" : e.status === "IDLE" ? "neutral" : "danger"}>{e.status === "WORKING" ? L("در حال کار", "Working") : e.status === "IDLE" ? L("آماده", "Idle") : L("خراب", "Down")}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </Card>
      </div>

      <Drawer open={!!selVisit} onClose={() => setTruck(null)} title={L("کامیون", "Truck")}>
        {selVisit && (
          <div className="flex flex-col gap-3">
            <IranPlate plate={selVisit.plate} size="lg" />
            <Kv k={L("وضعیت", "State")} v={lbl(VISIT_STATE, selVisit.state, locale)} />
            {selVisit.holdReasons.length > 0 && <Kv k={L("دلیل توقف", "Hold reason")} v={selVisit.holdReasons.map((r) => lbl(DECISION_CODE, r, locale)).join("، ")} />}
            <Kv k={L("راننده", "Driver")} v={nm(selVisit.driverName, selVisit.driverNameEn)} />
            <Kv k={L("شرکت حمل", "Carrier")} v={selVisit.carrierName} />
            <Kv k={L("حواله", "Permit")} v={selVisit.permitNo} />
            <Kv k={L("شماره نوبت", "Queue no.")} v={fmtNum(selVisit.queueNo, locale)} />
            <Kv k={L("رسیدن", "Arrived")} v={fmtRelative(selVisit.arrivedAt, locale)} />
          </div>
        )}
      </Drawer>
    </div>
  );
}
