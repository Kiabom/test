"use client";
import { AlertTriangle, Globe2, Map as MapIcon, Mountain, Pause, Play, Route, Search, Truck } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { IranPlate } from "@/components/domain/IranPlate";
import type { FleetEvent, FleetMarker } from "@/components/map/FleetMap";
import { Badge, Button, Card, cx, Input, KpiTile, PageHeader, Skeleton, Tabs } from "@/components/ui";
import { CITIES, jitter, STATIONS, type LatLng, type StationKey } from "@/domain/geo";
import { JOURNEY_STEPS, stepTitle } from "@/domain/journey";
import { fleetAt, GEO_EVENT_LABEL, roadTripAt, type GeoEventKind } from "@/domain/trips";
import { lbl, SEVERITY, VISIT_STATE } from "@/i18n/labels";
import { fmtKg, fmtNum, fmtTime } from "@/lib/format";
import { useNow, useView } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import type { MapData } from "@/server/views";

const FleetMap = dynamic(() => import("@/components/map/FleetMap"), { ssr: false, loading: () => <Skeleton className="h-full w-full" /> });

type Layer = "SITE" | "OUT" | "IN" | "FLEET" | "EQUIP" | "EVENTS" | "ROUTES";
const SITE_BOUNDS: LatLng[] = [STATIONS.approach.at, STATIONS["SH-01"].at, STATIONS.plant.at, STATIONS.control.at, STATIONS.dump.at];
const NUMBERS: Partial<Record<StationKey, number>> = { A: 1, parking: 2, B: 3, D: 5, C: 6, E: 8 };
const EVENT_STYLE: Record<GeoEventKind, { tone: FleetEvent["tone"]; glyph: string }> = {
  SPEEDING: { tone: "danger", glyph: "!" },
  STOP: { tone: "warning", glyph: "■" },
  DEVIATION: { tone: "warning", glyph: "↯" },
  GPS_LOST: { tone: "info", glyph: "?" },
  DELIVERED: { tone: "success", glyph: "✓" },
  ARRIVING: { tone: "info", glyph: "→" },
};

interface ListItem {
  id: string;
  group: "SITE" | "OUT" | "IN" | "DELIVERED" | "FLEET" | "EQUIP";
  at: LatLng;
  plate?: MapData["site"][number]["plate"];
  title: string;
  sub: string;
  warn?: boolean;
}
interface EventItem {
  id: string;
  at: LatLng;
  time: string;
  tone: FleetEvent["tone"];
  glyph: string;
  title: string;
  sub: string;
}

export default function FleetMapPage() {
  const L = useL();
  const locale = useLocale();
  const { data } = useView<MapData>("map", {}, 15_000);
  const [play, setPlay] = useState(true);
  const tick = useNow(play ? 2000 : 3_600_000);
  const [layers, setLayers] = useState<Set<Layer>>(new Set(["SITE", "OUT", "IN", "FLEET", "EQUIP", "EVENTS", "ROUTES"]));
  const [focus, setFocus] = useState<{ key: string; bounds: LatLng[]; maxZoom?: number }>({ key: "site", bounds: SITE_BOUNDS });
  const [tab, setTab] = useState<"vehicles" | "events">("vehicles");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string>();

  const view = useMemo(() => {
    if (!data) return null;
    const now = tick;
    const markers: FleetMarker[] = [];
    const events: FleetEvent[] = [];
    const list: ListItem[] = [];
    const evList: EventItem[] = [];
    const routes = new Map<string, { id: string; path: LatLng[]; color: string }>();
    const cities = new Map<string, { id: string; at: LatLng; label: string }>();
    const nm = (fa: string, en: string) => (locale === "fa" ? fa : en);

    for (const s of data.site) {
      const at = s.laneCode ? STATIONS[s.station].at : jitter(STATIONS[s.station].at, s.slot);
      const color = s.hold ? "#b42335" : s.laneCode ? "#1273a6" : s.state === "LOADING" ? "#b7791f" : s.state === "READY_TO_EXIT" ? "#168567" : "#475569";
      const step = JOURNEY_STEPS[s.step];
      const title = `${fmtNum(step.n, locale)} · ${stepTitle(step, s.operation, locale)}`;
      markers.push({
        id: s.id,
        kind: "SITE",
        at,
        color,
        ring: s.hold ? "#b42335" : undefined,
        title,
        plate: s.plate,
        lines: [nm(s.driver, s.driverEn), `${lbl(VISIT_STATE, s.state, locale)} · ${nm(STATIONS[s.station].fa, STATIONS[s.station].en)}`, ...(s.ticketNo ? [s.ticketNo] : [])],
        links: [
          { href: `/d/${s.token}`, label: L("پورتال راننده", "Driver portal") },
          { href: s.laneCode === "B" || s.laneCode === "C" ? "/app/weighing" : s.laneCode === "A" || s.hold ? "/app/gate" : "/app/live", label: L("صفحه عملیات", "Operations page") },
        ],
      });
      list.push({ id: s.id, group: "SITE", at, plate: s.plate, title, sub: nm(STATIONS[s.station].fa, STATIONS[s.station].en), warn: s.hold });
    }

    for (const r of data.road) {
      const trip = roadTripAt(r, now);
      if (!trip) continue;
      const dest = CITIES[trip.to];
      if (trip.delivered && now - new Date(trip.etaAt).getTime() > 3 * 3600_000) {
        // delivered a while ago: keep only its events
      } else {
        const kind = trip.delivered ? "DELIVERED" : r.kind;
        const color = kind === "IN" ? "#7c3aed" : kind === "DELIVERED" ? "#64748b" : "#168567";
        const title = kind === "IN" ? L(`در راه معدن · از ${dest.fa}`, `Heading to the mine · from ${dest.en}`) : kind === "DELIVERED" ? L(`تحویل شد · ${dest.fa}`, `Delivered · ${dest.en}`) : L(`در جاده · به ${dest.fa}`, `On the road · to ${dest.en}`);
        const lines = [
          nm(r.driver, r.driverEn),
          ...(r.customer ? [nm(r.customer, r.customerEn ?? r.customer)] : []),
          ...(trip.delivered ? [] : [L(`${fmtNum(Math.round(trip.progress * 100), locale)}٪ مسیر · ${fmtNum(trip.speedKmh, locale)} km/h`, `${Math.round(trip.progress * 100)}% of ${trip.km} km · ${trip.speedKmh} km/h`), L(`رسیدن ${fmtTime(trip.etaAt, locale)}`, `ETA ${fmtTime(trip.etaAt, "en")}`)]),
          ...(r.ticketNo ? [`${r.ticketNo}${r.netKg ? ` · ${fmtKg(r.netKg, locale)}` : ""}`] : []),
        ];
        markers.push({ id: r.id, kind, at: trip.pos, heading: trip.heading, color, title, plate: r.plate, lines, links: r.token ? [{ href: `/d/${r.token}`, label: L("پورتال راننده", "Driver portal") }] : undefined });
        list.push({ id: r.id, group: kind, at: trip.pos, plate: r.plate, title, sub: trip.delivered ? fmtTime(trip.etaAt, locale) : L(`${fmtNum(Math.round(trip.km * (1 - trip.progress)), locale)} km مانده`, `${Math.round(trip.km * (1 - trip.progress))} km left`) });
        if (!trip.delivered) routes.set(trip.routeId + r.kind, { id: trip.routeId + r.kind, path: trip.path, color: r.kind === "IN" ? "#7c3aed" : "#168567" });
        cities.set(trip.to, { id: trip.to, at: dest.at, label: nm(dest.fa, dest.en) });
      }
      for (const e of trip.events) {
        const st = EVENT_STYLE[e.kind];
        const title = L(...GEO_EVENT_LABEL[e.kind]) + (e.value ? ` · ${e.kind === "SPEEDING" ? `${e.value} km/h` : e.kind === "DEVIATION" ? `${e.value} km` : `${e.value} ${L("دقیقه", "min")}`}` : "");
        const sub = `${r.plateNormalized} · ${nm(dest.fa, dest.en)}`;
        events.push({ id: e.id, at: e.pos, tone: st.tone, glyph: st.glyph, title, lines: [sub, fmtTime(e.at, locale)] });
        evList.push({ id: e.id, at: e.pos, time: e.at, tone: st.tone, glyph: st.glyph, title, sub });
      }
    }

    for (const f of data.fleet) {
      const { at, heading } = fleetAt(f, now);
      const title = L("کامیون داخلی معدن", "Mine haul truck");
      const sub = f.loop === "HAUL" ? L("پیت ← سنگ‌شکن", "Pit → crusher") : L("پیت ← دامپ باطله", "Pit → waste dump");
      markers.push({ id: f.id, kind: "FLEET", at, heading, color: "#d9480f", title, plate: f.plate, lines: [sub, L(`چرخه ${fmtNum(f.cycleMin, locale)} دقیقه`, `Cycle ${f.cycleMin} min`)] });
      list.push({ id: f.id, group: "FLEET", at, plate: f.plate, title, sub });
    }
    for (const [i, e] of data.equipment.entries()) {
      const at = jitter(STATIONS[e.station as StationKey].at, i + 4, 30);
      markers.push({ id: e.id, kind: "EQUIP", at, color: "#334155", label: e.code.split("-")[0], title: nm(e.name, e.nameEn), lines: [e.status] });
      list.push({ id: e.id, group: "EQUIP", at, title: nm(e.name, e.nameEn), sub: e.status, warn: e.status === "DOWN" });
    }
    for (const [i, a] of data.alerts.entries()) {
      const at = jitter(STATIONS[a.station].at, i + 8, 22);
      const tone: FleetEvent["tone"] = a.severity === "CRITICAL" || a.severity === "HIGH" ? "danger" : a.severity === "WARNING" ? "warning" : "info";
      const title = `${a.ruleCode} · ${nm(a.title, a.titleEn)}`;
      events.push({ id: a.id, at, tone, glyph: "!", title, lines: [lbl(SEVERITY, a.severity, locale), nm(STATIONS[a.station].fa, STATIONS[a.station].en), fmtTime(a.openedAt, locale)] });
      evList.push({ id: a.id, at, time: a.openedAt, tone, glyph: "!", title, sub: nm(STATIONS[a.station].fa, STATIONS[a.station].en) });
    }
    evList.sort((a, b) => b.time.localeCompare(a.time));
    return { markers, events, list, evList, routes: [...routes.values()], cities: [...cities.values()] };
  }, [data, tick, locale, L]);

  const shown = useMemo(() => {
    if (!view) return null;
    const layerOf = (k: FleetMarker["kind"]): Layer => (k === "DELIVERED" ? "OUT" : (k as Layer));
    return {
      markers: view.markers.filter((m) => layers.has(layerOf(m.kind))),
      events: layers.has("EVENTS") ? view.events : [],
      routes: layers.has("ROUTES") ? view.routes : [],
      cities: layers.has("ROUTES") || layers.has("OUT") || layers.has("IN") ? view.cities : [],
    };
  }, [view, layers]);

  const regionBounds = useMemo(() => (view ? [...SITE_BOUNDS, ...view.markers.filter((m) => m.kind === "OUT" || m.kind === "IN" || m.kind === "DELIVERED").map((m) => m.at)] : SITE_BOUNDS), [view]);
  const toggle = (l: Layer) => setLayers((s) => {
    const n = new Set(s);
    if (n.has(l)) n.delete(l);
    else n.add(l);
    return n;
  });
  const go = (id: string, at: LatLng, road: boolean) => {
    setSelected(id);
    setFocus({ key: `${id}-${Date.now()}`, bounds: [at], maxZoom: road ? 11 : 17 });
  };
  const count = (g: ListItem["group"]) => view?.list.filter((x) => x.group === g).length ?? 0;
  const roadEvents = view?.evList.filter((e) => e.glyph !== "!").length ?? 0;
  const GROUPS: { g: ListItem["group"]; fa: string; en: string; icon: React.ReactNode }[] = [
    { g: "SITE", fa: "داخل معدن", en: "On site", icon: <MapIcon className="size-4" /> },
    { g: "OUT", fa: "در جاده به مقصد", en: "On the road", icon: <Route className="size-4" /> },
    { g: "IN", fa: "در راه معدن", en: "Heading to the mine", icon: <Truck className="size-4" /> },
    { g: "DELIVERED", fa: "تحویل‌شده (۳ ساعت اخیر)", en: "Delivered (last 3 h)", icon: <Truck className="size-4" /> },
    { g: "FLEET", fa: "ناوگان داخلی", en: "Internal fleet", icon: <Mountain className="size-4" /> },
    { g: "EQUIP", fa: "لودر و شاول", en: "Loaders & shovels", icon: <Mountain className="size-4" /> },
  ];
  const LAYERS: { l: Layer; fa: string; en: string }[] = [
    { l: "SITE", fa: "داخل معدن", en: "On site" },
    { l: "OUT", fa: "در جاده", en: "On road" },
    { l: "IN", fa: "ورودی‌ها", en: "Inbound" },
    { l: "FLEET", fa: "ناوگان داخلی", en: "Internal fleet" },
    { l: "EQUIP", fa: "تجهیزات", en: "Equipment" },
    { l: "EVENTS", fa: "رویدادها", en: "Events" },
    { l: "ROUTES", fa: "مسیرها", en: "Routes" },
  ];
  const ql = q.trim();

  return (
    <div>
      <PageHeader
        icon={<Globe2 className="size-5" />}
        title={L("نقشه ناوگان و رویدادها", "Fleet & events map")}
        subtitle={L("همه کامیون‌ها داخل معدن، در جاده و در راه معدن، ناوگان داخلی، تجهیزات و هشدارها روی یک نقشه.", "Every truck on site, on the road and heading in, the internal fleet, equipment and alerts on one map.")}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant={focus.key === "site" ? "primary" : "secondary"} onClick={() => setFocus({ key: "site", bounds: SITE_BOUNDS })}>
              <MapIcon className="size-4" /> {L("سایت معدن", "Mine site")}
            </Button>
            <Button size="sm" variant={focus.key === "region" ? "primary" : "secondary"} onClick={() => setFocus({ key: "region", bounds: regionBounds, maxZoom: 8 })}>
              <Globe2 className="size-4" /> {L("کل منطقه", "Whole region")}
            </Button>
            <Button size="sm" onClick={() => setPlay((p) => !p)} title={L("حرکت کامیون‌ها روی مسیر", "Animate trucks along routes")}>
              {play ? <Pause className="size-4" /> : <Play className="size-4" />} {play ? L("توقف حرکت", "Pause") : L("پخش حرکت", "Play")}
            </Button>
          </div>
        }
      />
      <div className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-6">
        <KpiTile label={L("داخل معدن", "On site")} value={fmtNum(count("SITE"), locale)} tone="primary" />
        <KpiTile label={L("در جاده", "On the road")} value={fmtNum(count("OUT"), locale)} tone="success" />
        <KpiTile label={L("در راه معدن", "Heading in")} value={fmtNum(count("IN"), locale)} tone="info" />
        <KpiTile label={L("ناوگان داخلی", "Internal fleet")} value={fmtNum(count("FLEET"), locale)} tone="warning" />
        <KpiTile label={L("هشدار باز سایت", "Open site alerts")} value={fmtNum(data?.alerts.length ?? 0, locale)} tone="danger" />
        <KpiTile label={L("رویداد جاده (۲۴ ساعت)", "Road events (24 h)")} value={fmtNum(roadEvents, locale)} tone="neutral" />
      </div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {LAYERS.map(({ l, fa, en }) => (
          <button key={l} onClick={() => toggle(l)} className={cx("rounded-full border px-3 py-1 text-xs font-medium", layers.has(l) ? "border-primary bg-primary/10 text-primary" : "border-border text-muted")}>
            {L(fa, en)}
          </button>
        ))}
        <Link href="/app/site-map" className="ms-auto text-xs text-primary">
          {L("نمای شماتیک سایت ←", "Schematic site view →")}
        </Link>
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="h-[640px] overflow-hidden p-1.5">
          {shown ? <FleetMap locale={locale} markers={shown.markers} events={shown.events} routes={shown.routes} cities={shown.cities} numbers={NUMBERS} focus={focus} selected={selected} onSelect={setSelected} /> : <Skeleton className="h-full w-full" />}
        </Card>
        <Card className="flex h-[640px] flex-col">
          <div className="border-b border-border p-2">
            <Tabs
              value={tab}
              onChange={setTab}
              tabs={[
                { id: "vehicles", label: L("خودروها", "Vehicles"), icon: <Truck className="size-4" />, badge: <Badge>{fmtNum(view?.list.length ?? 0, locale)}</Badge> },
                { id: "events", label: L("رویدادها", "Events"), icon: <AlertTriangle className="size-4" />, badge: <Badge tone="danger">{fmtNum(view?.evList.length ?? 0, locale)}</Badge> },
              ]}
            />
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute start-2.5 top-2.5 size-4 text-muted" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L("جست‌وجوی پلاک یا عنوان…", "Search plate or title…")} className="ps-8" />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {!view ? (
              <Skeleton className="m-3 h-64" />
            ) : tab === "vehicles" ? (
              GROUPS.map(({ g, fa, en, icon }) => {
                const items = view.list.filter((x) => x.group === g && (!ql || x.title.includes(ql) || x.sub.includes(ql) || (x.plate && JSON.stringify(x.plate).includes(ql))));
                if (!items.length) return null;
                return (
                  <div key={g}>
                    <div className="sticky top-0 flex items-center gap-2 bg-surface-2 px-3 py-1.5 text-xs font-semibold text-muted">
                      {icon} {L(fa, en)} <span className="num">({fmtNum(items.length, locale)})</span>
                    </div>
                    {items.map((x) => (
                      <button key={x.id} onClick={() => go(x.id, x.at, g === "OUT" || g === "IN" || g === "DELIVERED")} className={cx("flex w-full items-center justify-between gap-2 border-b border-border px-3 py-2 text-start hover:bg-surface-2", selected === x.id && "bg-primary/5")}>
                        <div className="min-w-0">
                          <div className={cx("truncate text-xs font-semibold", x.warn && "text-danger")}>{x.title}</div>
                          <div className="truncate text-[11px] text-muted">{x.sub}</div>
                        </div>
                        {x.plate && <IranPlate plate={x.plate} size="xs" />}
                      </button>
                    ))}
                  </div>
                );
              })
            ) : (
              view.evList
                .filter((e) => !ql || e.title.includes(ql) || e.sub.includes(ql))
                .map((e) => (
                  <button key={e.id} onClick={() => go(e.id, e.at, e.glyph !== "!")} className="flex w-full items-start gap-2 border-b border-border px-3 py-2 text-start hover:bg-surface-2">
                    <span className={cx("mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold text-white", e.tone === "danger" ? "bg-danger" : e.tone === "warning" ? "bg-warning" : e.tone === "success" ? "bg-success" : "bg-info")}>{e.glyph}</span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-semibold">{e.title}</div>
                      <div className="truncate text-[11px] text-muted">{e.sub}</div>
                    </div>
                    <span className="num shrink-0 text-[11px] text-muted">{fmtTime(e.time, locale)}</span>
                  </button>
                ))
            )}
          </div>
          <div className="border-t border-border p-2 text-[11px] text-muted">
            <span className="me-3 inline-flex items-center gap-1"><span className="size-2.5 rounded-full bg-[#1273a6]" />{L("روی لاین", "On a lane")}</span>
            <span className="me-3 inline-flex items-center gap-1"><span className="size-2.5 rounded-full bg-[#b7791f]" />{L("بارگیری", "Loading")}</span>
            <span className="me-3 inline-flex items-center gap-1"><span className="size-2.5 rounded-full bg-[#b42335]" />{L("متوقف", "On hold")}</span>
            <span className="me-3 inline-flex items-center gap-1"><span className="size-2.5 rounded-full bg-[#168567]" />{L("در جاده", "On road")}</span>
            <span className="me-3 inline-flex items-center gap-1"><span className="size-2.5 rounded-full bg-[#7c3aed]" />{L("ورودی", "Inbound")}</span>
            <span className="inline-flex items-center gap-1"><span className="size-2.5 rounded-full bg-[#d9480f]" />{L("ناوگان داخلی", "Internal")}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

