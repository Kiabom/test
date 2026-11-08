"use client";
import { BookOpen, CalendarClock, CheckCircle2, ChevronDown, CircleDashed, Crosshair, FileText, ListChecks, Map as MapIcon, MapPin, Phone, QrCode, Receipt, RefreshCw } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { use, useMemo, useState } from "react";
import { origin, Qr } from "@/components/domain/codes";
import { VehicleTag } from "@/components/domain/VehicleTag";
import { TrafficLight } from "@/components/domain/indicators";
import { NavButtons } from "@/components/map/NavButtons";
import { Logo } from "@/components/shell/Logo";
import { Badge, Button, Card, cx, Kv, Skeleton, Tabs, toast } from "@/components/ui";
import { CITIES, distanceKm, LANE_STATION, leg, STATIONS, type LatLng, type StationKey } from "@/domain/geo";
import { JOURNEY_STEPS, stepStation, stepTitle } from "@/domain/journey";
import { GEO_EVENT_LABEL } from "@/domain/trips";
import { lbl, VISIT_STATE } from "@/i18n/labels";
import { fmtKg, fmtNum, fmtTime } from "@/lib/format";
import { useGps } from "@/lib/gps";
import { act, useView } from "@/lib/live";
import { useL, useLocale, usePrefs } from "@/lib/prefs";
import type { DriverView } from "@/server/views";
import { queryParam } from "@/lib/query";

const DriverMap = dynamic(() => import("@/components/map/DriverMap"), { ssr: false, loading: () => <Skeleton className="h-full w-full" /> });

type Tab = "trip" | "map" | "docs";

export default function DriverPortal({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const L = useL();
  const locale = useLocale();
  const setLocale = usePrefs((s) => s.setLocale);
  const { data, error } = useView<DriverView>("driver", { id: token }, 800);
  const [tab, setTab] = useState<Tab>(() => (["trip", "map", "docs"].includes(queryParam("tab") ?? "") ? (queryParam("tab") as Tab) : "trip"));
  const [open, setOpen] = useState<number | null>(null);
  const [showQr, setShowQr] = useState(false);
  const [useGpsOn, setUseGpsOn] = useState(false);
  const gps = useGps(useGpsOn);

  const nav = useMemo(() => {
    if (!data) return null;
    const v = data.visit;
    const idx = data.journey.index;
    const station = (i: number): StationKey | "destination" => stepStation(JOURNEY_STEPS[i], v);
    const numbers: Partial<Record<StationKey, number>> = {};
    for (let i = 1; i <= 8; i++) {
      const s = station(i);
      if (s !== "destination" && numbers[s] == null) numbers[s] = JOURNEY_STEPS[i].n;
    }
    const cur = station(idx);
    const trip = data.trip;
    const destAt: LatLng = trip ? trip.path[trip.path.length - 1] : CITIES.zarand.at;
    const targetAt = cur === "destination" ? destAt : STATIONS[idx === 0 ? "approach" : cur].at;
    const label = cur === "destination" ? (locale === "fa" ? CITIES[trip?.to ?? "zarand"].fa : CITIES[trip?.to ?? "zarand"].en) : locale === "fa" ? STATIONS[idx === 0 ? "approach" : cur].fa : STATIONS[idx === 0 ? "approach" : cur].en;
    // demo position: on the lane / at the loader when there, otherwise at the previous station
    let you: LatLng;
    if (idx === 9 && trip) you = trip.pos;
    else if (v.laneCode) you = STATIONS[LANE_STATION[v.laneCode]].at;
    else if (v.state === "LOADING" && cur !== "destination") you = STATIONS[cur].at;
    else {
      const prev = idx > 1 ? station(idx - 1) : "approach";
      you = STATIONS[prev === "destination" ? "E" : prev].at;
    }
    const prevKey = idx > 1 ? station(idx - 1) : "approach";
    const path = idx === 9 && trip ? trip.path : cur !== "destination" && prevKey !== "destination" && prevKey !== cur ? leg(prevKey, cur) : undefined;
    return { idx, numbers, targetAt, label, you, path, region: idx === 9 };
  }, [data, locale]);

  if (error) return <div className="p-10 text-center text-muted">{L("لینک نامعتبر یا منقضی است", "Link invalid or expired")}</div>;
  if (!data || !nav) return <Skeleton className="m-4 h-[80vh]" />;
  const v = data.visit;
  const tx = data.transactions.filter((t) => t.state !== "VOIDED").at(-1);
  const g = data.guidance;
  const onScale = data.laneLive?.kind === "SCALE";
  const exitUrl = data.exitPermit ? `${origin()}/x/${data.exitPermit.token}` : "";
  const cur = JOURNEY_STEPS[nav.idx];
  const you = gps.pos ?? nav.you;
  const distKm = distanceKm(you, nav.targetAt);
  const held = v.state === "HOLD" || v.state === "REJECTED";

  return (
    <div className="mx-auto min-h-screen max-w-md bg-bg pb-24">
      <div className="sticky top-0 z-[600] flex items-center justify-between border-b border-border bg-surface/95 px-4 py-2 backdrop-blur">
        <Logo locale={locale} />
        <div className="flex items-center gap-3 text-xs">
          <Link href="/d/guide" className="flex items-center gap-1 text-primary">
            <BookOpen className="size-3.5" /> {L("راهنما", "Guide")}
          </Link>
          <button className="text-primary" onClick={() => setLocale(locale === "fa" ? "en" : "fa")}>
            {locale === "fa" ? "EN" : "فا"}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <Card className="flex items-center justify-between gap-3 p-3">
          <VehicleTag plate={data.vehicle.plate} size="md" />
          <div className="text-end text-xs text-muted">
            <div>{locale === "fa" ? data.driver?.name : data.driver?.nameEn}</div>
            <div>
              {L("نوبت", "Queue no")} <b className="num text-text">{fmtNum(v.queueNo, locale)}</b>
            </div>
            <Badge tone={held ? "danger" : v.state === "EXITED" ? "success" : "info"}>{lbl(VISIT_STATE, v.state, locale)}</Badge>
          </div>
        </Card>

        {/* what to do now */}
        <div className={cx("rounded-2xl p-4 text-white shadow-lg", g.tone === "go" ? "bg-success" : g.tone === "stop" ? "bg-danger" : g.tone === "wait" ? "bg-warning" : "bg-shell")}>
          <div className="mb-1 flex items-center gap-2 text-xs opacity-90">
            <span className="grid size-6 place-items-center rounded-full bg-white/25 font-black">{fmtNum(cur.n, locale)}</span>
            {L("ایستگاه", "Station")} {fmtNum(cur.n, locale)} {L("از", "of")} {fmtNum(9, locale)} · {stepTitle(cur, v.operation, locale)}
          </div>
          <div className="flex items-center gap-3">
            <TrafficLight state={g.light} size={14} />
            <div className="text-lg font-bold leading-7">{locale === "fa" ? g.fa : g.en}</div>
          </div>
          {data.queuePos != null && v.state === "IN_SITE" && (
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl bg-white/15 p-2">
                <div className="text-xs opacity-80">{L("نفر جلوتر از شما", "Ahead of you")}</div>
                <div className="num text-2xl font-black">{fmtNum(data.queuePos - 1, locale)}</div>
              </div>
              <div className="rounded-xl bg-white/15 p-2">
                <div className="text-xs opacity-80">{L("زمان تقریبی", "ETA")}</div>
                <div className="num text-2xl font-black">
                  {fmtNum(data.etaMin, locale)} {L("دقیقه", "min")}
                </div>
              </div>
            </div>
          )}
          {onScale && (
            <div className="mt-3 rounded-xl bg-black/25 p-3 text-center">
              <div className="text-xs opacity-80">{L("وزن زنده باسکول", "Live scale weight")}</div>
              <div className="led text-4xl">{fmtNum(data.laneLive?.weightKg, "en")} kg</div>
              <div className="text-xs">{data.laneLive?.stable ? "STABLE ✓" : "MOTION…"}</div>
            </div>
          )}
          {data.trip && nav.idx === 9 && (
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-white/15 p-2">
                <div className="opacity-80">{L("پیموده", "Done")}</div>
                <div className="num text-lg font-black">{fmtNum(Math.round(data.trip.progress * 100), locale)}٪</div>
              </div>
              <div className="rounded-xl bg-white/15 p-2">
                <div className="opacity-80">{L("مانده", "Left")}</div>
                <div className="num text-lg font-black">{fmtNum(Math.round(data.trip.km * (1 - data.trip.progress)), locale)} km</div>
              </div>
              <div className="rounded-xl bg-white/15 p-2">
                <div className="opacity-80">{L("رسیدن", "ETA")}</div>
                <div className="num text-lg font-black">{fmtTime(data.trip.etaAt, locale)}</div>
              </div>
            </div>
          )}
        </div>

        {/* where to go */}
        {!held && (
          <Card className="p-3">
            <div className="mb-2 flex items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-1.5 font-semibold">
                <MapPin className="size-4 text-success" /> {nav.label}
              </span>
              <span className="num text-xs text-muted">
                {distKm < 0.03 ? L("شما اینجا هستید", "You are here") : distKm < 1 ? `${fmtNum(Math.round(distKm * 1000), locale)} m` : `${fmtNum(Math.round(distKm), locale)} km`}
              </span>
            </div>
            <NavButtons at={nav.targetAt} label={nav.label} compact />
          </Card>
        )}

        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { id: "trip", label: L("سفر من", "My trip"), icon: <ListChecks className="size-4" /> },
            { id: "map", label: L("نقشه", "Map"), icon: <MapIcon className="size-4" /> },
            { id: "docs", label: L("رسید و QR", "Receipt & QR"), icon: <QrCode className="size-4" /> },
          ]}
        />

        {tab === "trip" && (
          <Card className="p-3">
            <div className="mb-3 text-xs text-muted">{L("همه مراحل سفر شما در معدن؛ روی هر مرحله بزنید تا توضیح کامل و محل آن را ببینید.", "Every step of your trip; tap a step for full instructions and its location.")}</div>
            <ol>
              {JOURNEY_STEPS.map((s, i) => {
                const done = i < nav.idx || (i === 9 && !!data.trip?.delivered);
                const now = i === nav.idx && !done;
                const expanded = open === i || (open === null && now);
                const at = data.journey.times[s.id];
                const station = stepStation(s, v);
                return (
                  <li key={s.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cx("grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold", done ? "bg-success text-white" : now ? (held ? "bg-danger text-white" : "bg-primary text-white") : "bg-surface-2 text-muted")}>
                        {done ? <CheckCircle2 className="size-4" /> : now ? <CircleDashed className="size-4 animate-spin" /> : fmtNum(s.n, locale)}
                      </div>
                      {i < JOURNEY_STEPS.length - 1 && <div className={cx("w-0.5 flex-1", done ? "bg-success" : "bg-border")} />}
                    </div>
                    <div className="min-w-0 flex-1 pb-4">
                      <button className="flex w-full items-center justify-between gap-2 text-start" onClick={() => setOpen(expanded ? -1 : i)}>
                        <span className={cx("text-sm", now ? "font-bold" : done ? "" : "text-muted")}>
                          {stepTitle(s, v.operation, locale)}
                          {now && <Badge tone={held ? "danger" : "primary"} className="ms-2">{held ? L("متوقف", "On hold") : L("الان", "Now")}</Badge>}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-muted">
                          {at && <span className="num">{fmtTime(at, locale)}</span>}
                          <ChevronDown className={cx("size-3.5 transition", expanded && "rotate-180")} />
                        </span>
                      </button>
                      {expanded && (
                        <div className="mt-2 space-y-2 rounded-xl bg-surface-2 p-3 text-xs leading-6">
                          <div>
                            <b>{L("چه کنم: ", "What to do: ")}</b>
                            {L(...s.driverDo)}
                          </div>
                          <div>
                            <b>{L("توجه: ", "Note: ")}</b>
                            {L(...s.driverNeed)}
                          </div>
                          <div className="flex items-center justify-between gap-2 pt-1">
                            <span className="flex items-center gap-1 text-muted">
                              <MapPin className="size-3.5" />
                              {station === "destination" ? (data.trip ? L(CITIES[data.trip.to].fa, CITIES[data.trip.to].en) : L("مقصد بار", "Destination")) : L(STATIONS[station].fa, STATIONS[station].en)}
                            </span>
                            <Button size="sm" variant="ghost" onClick={() => setTab("map")}>
                              <MapIcon className="size-3.5" /> {L("روی نقشه", "On map")}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>
        )}

        {tab === "map" && (
          <Card className="overflow-hidden p-2">
            <div className="h-[58vh] min-h-[360px]">
              <DriverMap locale={locale} numbers={nav.numbers} target={{ at: nav.targetAt, label: nav.label, n: cur.n }} path={nav.path} you={you} youIsGps={!!gps.pos} region={nav.region} />
            </div>
            <div className="flex flex-wrap items-center gap-2 p-2 text-xs">
              <Button size="sm" variant={useGpsOn ? "primary" : "secondary"} onClick={() => setUseGpsOn((x) => !x)}>
                <Crosshair className="size-3.5" /> {useGpsOn ? L("GPS گوشی روشن است", "Phone GPS on") : L("استفاده از GPS گوشی", "Use phone GPS")}
              </Button>
              {useGpsOn && !gps.pos && (
                <span className="text-warning">
                  {gps.error === "INSECURE"
                    ? L("GPS فقط روی HTTPS یا localhost کار می‌کند — موقعیت تقریبی از روی ایستگاه فعلی نشان داده می‌شود.", "GPS needs HTTPS or localhost — showing your approximate position from the current station.")
                    : gps.error === "DENIED"
                      ? L("اجازه موقعیت داده نشد — موقعیت تقریبی از روی ایستگاه فعلی نشان داده می‌شود.", "Location permission denied — showing your approximate position from the current station.")
                      : L("در حال گرفتن موقعیت…", "Getting your position…")}
                </span>
              )}
              {gps.pos && <span className="num text-success">±{fmtNum(Math.round(gps.accuracy ?? 0), locale)} m</span>}
            </div>
            {data.trip && nav.idx === 9 && data.trip.events.length > 0 && (
              <div className="border-t border-border p-2 text-xs">
                <div className="mb-1 font-semibold">{L("رویدادهای ثبت‌شده در جاده", "Logged road events")}</div>
                {data.trip.events.map((e) => (
                  <div key={e.id} className="flex justify-between py-0.5">
                    <span>{L(...GEO_EVENT_LABEL[e.kind])}{e.value ? ` · ${e.kind === "SPEEDING" ? `${e.value} km/h` : e.kind === "STOP" || e.kind === "GPS_LOST" ? `${e.value} ${L("دقیقه", "min")}` : `${e.value} km`}` : ""}</span>
                    <span className="num text-muted">{fmtTime(e.at, locale)}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {tab === "docs" && (
          <>
            {data.exitPermit && (
              <Card className="flex flex-col items-center gap-3 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <QrCode className="size-4" /> {L("QR مجوز خروج", "Exit permit QR")}
                </div>
                {data.exitPermit.status === "APPROVED" ? (
                  <>
                    <div className="rounded-xl bg-white p-3">
                      <Qr value={exitUrl} size={showQr ? 240 : 180} />
                    </div>
                    <div className="font-mono text-sm ltr">{data.exitPermit.serial}</div>
                    <div className="text-center text-xs text-muted">{L("این QR را در دروازه خروج به نگهبان نشان دهید. یک‌بارمصرف است.", "Show this QR to the guard at the exit gate. One-time use.")}</div>
                    <Button size="sm" variant="ghost" onClick={() => setShowQr((s) => !s)}>
                      {showQr ? L("کوچک", "Smaller") : L("بزرگ‌نمایی", "Enlarge")}
                    </Button>
                  </>
                ) : (
                  <Badge tone={data.exitPermit.status === "CONSUMED" ? "success" : "danger"}>
                    {data.exitPermit.status === "CONSUMED" ? L(`استفاده شد ${fmtTime(data.exitPermit.consumedAt, locale)}`, `Used at ${fmtTime(data.exitPermit.consumedAt, "en")}`) : data.exitPermit.status}
                  </Badge>
                )}
              </Card>
            )}
            <Card className="p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <FileText className="size-4" /> {L("حواله و بار", "Permit & load")}
              </div>
              <Kv k={L("حواله", "Permit")} v={<span className="font-mono ltr">{data.permit?.permitNo ?? "—"}</span>} />
              <Kv k={L("ماده", "Material")} v={locale === "fa" ? data.material?.name : data.material?.nameEn} />
              <Kv k={L("نقطه بارگیری", "Loading point")} v={data.loadingEquipmentCode ?? "—"} />
              <Kv k={L("مقصد", "Destination")} v={data.trip ? L(CITIES[data.trip.to].fa, CITIES[data.trip.to].en) : locale === "fa" ? data.destination?.name : data.destination?.nameEn} />
              {tx?.netKg != null && <Kv k={L("وزن خالص", "Net weight")} v={<b>{fmtKg(tx.netKg, locale)}</b>} />}
              {tx && (
                <Link href={`/print/ticket/${tx.id}?tpl=thermal`} target="_blank" className="mt-2 flex items-center gap-2 text-sm text-primary">
                  <Receipt className="size-4" /> {L("مشاهده رسید توزین", "View weighbridge receipt")} ({tx.ticketNo})
                </Link>
              )}
            </Card>
            <Card className="p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <CalendarClock className="size-4" /> {L("رزرو / تغییر نوبت سفر بعدی", "Book / change next slot")}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {data.freeSlots.map((s) => (
                  <button
                    key={s}
                    onClick={async () => {
                      await act("driver.book", { token, slot: s });
                      toast.success(L("نوبت رزرو شد", "Slot booked"));
                    }}
                    className="rounded-lg border border-border py-2 text-sm hover:border-primary"
                  >
                    <span className="num">{fmtTime(s, locale)}</span>
                  </button>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
      <div className="fixed inset-x-0 bottom-0 z-[600] mx-auto flex max-w-md gap-2 border-t border-border bg-surface p-3">
        <Button
          className="flex-1"
          size="lg"
          variant="primary"
          onClick={async () => {
            await act("driver.callOperator", { token });
            toast.success(L("درخواست تماس به اپراتور ارسال شد", "Call request sent to the operator"));
          }}
        >
          <Phone className="size-5" /> {L("تماس با اپراتور", "Call operator")}
        </Button>
        <Button size="lg" variant="secondary" onClick={() => window.location.reload()} aria-label="refresh">
          <RefreshCw className="size-5" />
        </Button>
      </div>
    </div>
  );
}
