"use client";
import Link from "next/link";
import { CircleMarker, Popup } from "react-leaflet";
import { IranPlate } from "@/components/domain/IranPlate";
import type { LatLng, StationKey } from "@/domain/geo";
import type { Plate } from "@/domain/types";
import { BaseMap, BasemapSwitch, FitTo, Marker, Polyline, SiteLayers, Tooltip, eventIcon, stationIcon, truckIcon, useBasemap } from "./MapKit";

export interface FleetMarker {
  id: string;
  kind: "SITE" | "OUT" | "IN" | "DELIVERED" | "FLEET" | "EQUIP";
  at: LatLng;
  heading?: number;
  color: string;
  ring?: string;
  label?: string;
  title: string;
  lines: string[];
  plate?: Plate;
  links?: { href: string; label: string }[];
}
export interface FleetEvent {
  id: string;
  at: LatLng;
  tone: "danger" | "warning" | "info" | "success";
  glyph: string;
  title: string;
  lines: string[];
}

export default function FleetMap({
  locale,
  markers,
  events,
  routes,
  cities,
  numbers,
  focus,
  selected,
  onSelect,
}: {
  locale: "fa" | "en";
  markers: FleetMarker[];
  events: FleetEvent[];
  routes: { id: string; path: LatLng[]; color: string }[];
  cities: { id: string; at: LatLng; label: string }[];
  numbers?: Partial<Record<StationKey, number>>;
  focus: { key: string; bounds: LatLng[]; maxZoom?: number };
  selected?: string;
  onSelect: (id: string) => void;
}) {
  const [basemap, setBasemap] = useBasemap("osm");
  return (
    <div className="relative h-full w-full">
      <BaseMap center={focus.bounds[0] ?? [32.05, 55.15]} zoom={14} basemap={basemap} className="h-full w-full overflow-hidden rounded-xl">
        <SiteLayers locale={locale} numbers={numbers} />
        {routes.map((r) => (
          <Polyline key={r.id} positions={r.path} pathOptions={{ color: r.color, weight: 3, opacity: 0.45 }} />
        ))}
        {cities.map((c) => (
          <CircleMarker key={c.id} center={c.at} radius={4} pathOptions={{ color: "#334155", fillColor: "#fff", fillOpacity: 1, weight: 2 }}>
            <Tooltip permanent direction="right" offset={[6, 0]} className="map-label">
              {c.label}
            </Tooltip>
          </CircleMarker>
        ))}
        {events.map((e) => (
          <Marker key={e.id} position={e.at} icon={eventIcon(e.tone, e.glyph)} zIndexOffset={300}>
            <Popup>
              <div dir={locale === "fa" ? "rtl" : "ltr"} className="text-xs leading-5">
                <div className="font-bold">{e.title}</div>
                {e.lines.map((l, i) => (
                  <div key={i}>{l}</div>
                ))}
              </div>
            </Popup>
          </Marker>
        ))}
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={m.at}
            icon={m.kind === "EQUIP" ? stationIcon(m.label ?? "L", "muted") : truckIcon(m.color, m.heading ?? 0, selected === m.id ? "#111827" : m.ring, m.kind === "DELIVERED" ? 18 : m.kind === "FLEET" ? 20 : 26)}
            zIndexOffset={selected === m.id ? 1000 : m.kind === "SITE" ? 400 : 200}
            eventHandlers={{ click: () => onSelect(m.id) }}
          >
            <Popup>
              <div dir={locale === "fa" ? "rtl" : "ltr"} className="flex min-w-48 flex-col gap-1 text-xs leading-5">
                {m.plate && <IranPlate plate={m.plate} size="sm" />}
                <div className="font-bold">{m.title}</div>
                {m.lines.map((l, i) => (
                  <div key={i}>{l}</div>
                ))}
                {m.links && (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {m.links.map((l) => (
                      <Link key={l.href} href={l.href} className="font-semibold text-[#1273a6]">
                        {l.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        <FitTo bounds={focus.bounds} trigger={focus.key} maxZoom={focus.maxZoom ?? 16} />
      </BaseMap>
      <BasemapSwitch value={basemap} onChange={setBasemap} locale={locale} />
    </div>
  );
}
