"use client";
// Leaflet building blocks shared by the fleet map and the driver portal map. Client-only:
// import through next/dynamic with ssr:false.
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState, type ReactNode } from "react";
import { MapContainer, Marker, Polygon, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import { FEATURES, INTERNAL_ROADS, STATIONS, type Feature, type LatLng, type StationKey } from "@/domain/geo";

export type Basemap = "osm" | "sat" | "none";

const BASEMAP_KEY = "tozin-basemap";
/** Remembered basemap choice (per browser). */
export function useBasemap(fallback: Basemap = "osm"): [Basemap, (b: Basemap) => void] {
  const [b, setB] = useState<Basemap>(() => {
    try {
      const v = localStorage.getItem(BASEMAP_KEY);
      return v === "osm" || v === "sat" || v === "none" ? v : fallback;
    } catch {
      return fallback;
    }
  });
  const set = (x: Basemap) => {
    setB(x);
    try {
      localStorage.setItem(BASEMAP_KEY, x);
    } catch {
      /* storage blocked */
    }
  };
  return [b, set];
}

export function BasemapSwitch({ value, onChange, locale }: { value: Basemap; onChange: (b: Basemap) => void; locale: "fa" | "en" }) {
  return (
    <div className="absolute end-2 top-2 z-[500] flex overflow-hidden rounded-lg border border-border bg-surface text-[11px] shadow" dir="ltr">
      {(["osm", "sat", "none"] as Basemap[]).map((x) => (
        <button key={x} onClick={() => onChange(x)} className={value === x ? "bg-primary px-2 py-1 text-white" : "px-2 py-1"}>
          {x === "osm" ? (locale === "fa" ? "نقشه" : "Map") : x === "sat" ? (locale === "fa" ? "ماهواره" : "Satellite") : locale === "fa" ? "ساده" : "Plain"}
        </button>
      ))}
    </div>
  );
}

const TILES: Record<Exclude<Basemap, "none">, { url: string; attribution: string }> = {
  osm: { url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: "© OpenStreetMap contributors" },
  sat: { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", attribution: "Imagery © Esri" },
};

export function BaseMap({ center, zoom, basemap, children, className }: { center: LatLng; zoom: number; basemap: Basemap; children?: ReactNode; className?: string }) {
  return (
    <div dir="ltr" className={className}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom className="h-full w-full" style={{ background: basemap === "none" ? "var(--map-bg, #ece6d6)" : "#d9d9d9" }}>
        {basemap !== "none" && <TileLayer key={basemap} url={TILES[basemap].url} attribution={TILES[basemap].attribution} maxZoom={19} />}
        {children}
      </MapContainer>
    </div>
  );
}

/** Flies the map to `bounds` whenever `trigger` changes. */
export function FitTo({ bounds, trigger, maxZoom = 17 }: { bounds: LatLng[]; trigger: unknown; maxZoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (bounds.length) map.fitBounds(L.latLngBounds(bounds.map((b) => L.latLng(b[0], b[1]))), { padding: [30, 30], maxZoom });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);
  return null;
}

const FEATURE_STYLE: Record<Feature["kind"], L.PathOptions> = {
  boundary: { color: "#b7791f", weight: 2, dashArray: "8 6", fillOpacity: 0.03 },
  pit: { color: "#7c5a3a", weight: 1, fillColor: "#a9825a", fillOpacity: 0.45 },
  stockpile: { color: "#5f6b7a", weight: 1, fillColor: "#8a96a3", fillOpacity: 0.55 },
  dump: { color: "#6b5b4b", weight: 1, fillColor: "#9b8a74", fillOpacity: 0.4 },
  plant: { color: "#1273a6", weight: 1, fillColor: "#1273a6", fillOpacity: 0.25 },
  building: { color: "#334155", weight: 1, fillColor: "#475569", fillOpacity: 0.5 },
  parking: { color: "#0891b2", weight: 1, fillColor: "#0891b2", fillOpacity: 0.18 },
  scale: { color: "#168567", weight: 2, fillColor: "#168567", fillOpacity: 0.5 },
  gate: { color: "#b42335", weight: 2 },
};

/** Mine polygons, internal roads and (optionally) numbered station badges. */
export function SiteLayers({ locale, numbers, roads = true }: { locale: "fa" | "en"; numbers?: Partial<Record<StationKey, number>>; roads?: boolean }) {
  return (
    <>
      {FEATURES.map((f) => (
        <Polygon key={f.id} positions={f.ring} pathOptions={FEATURE_STYLE[f.kind]}>
          {f.kind !== "boundary" && f.kind !== "scale" && <Tooltip direction="center" permanent className="map-label">{locale === "fa" ? f.fa : f.en}</Tooltip>}
        </Polygon>
      ))}
      {roads && INTERNAL_ROADS.map((r, i) => <Polyline key={i} positions={r} pathOptions={{ color: "#8b7d6b", weight: 5, opacity: 0.55 }} />)}
      {numbers &&
        (Object.entries(numbers) as [StationKey, number][]).map(([k, n]) => (
          <Marker key={k} position={STATIONS[k].at} icon={stationIcon(n)}>
            <Tooltip direction="top" offset={[0, -14]}>{`${n} · ${locale === "fa" ? STATIONS[k].fa : STATIONS[k].en}`}</Tooltip>
          </Marker>
        ))}
    </>
  );
}

export function stationIcon(n: number | string, tone: "primary" | "success" | "warning" | "muted" = "primary") {
  const bg = { primary: "#1273a6", success: "#168567", warning: "#b7791f", muted: "#64748b" }[tone];
  return L.divIcon({
    className: "",
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    html: `<div style="width:26px;height:26px;border-radius:9999px;background:${bg};color:#fff;font:700 13px Vazirmatn,system-ui;display:grid;place-items:center;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)">${n}</div>`,
  });
}

/** Truck arrow rotated by heading; ring colour by status. */
export function truckIcon(color: string, heading = 0, ring?: string, size = 26) {
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:#fff;border:3px solid ${ring ?? color};box-shadow:0 1px 5px rgba(0,0,0,.4);display:grid;place-items:center">
      <svg viewBox="0 0 24 24" width="${size - 10}" height="${size - 10}" style="transform:rotate(${heading}deg)"><path d="M12 2 L19 20 L12 16 L5 20 Z" fill="${color}"/></svg></div>`,
  });
}

export function eventIcon(kind: "danger" | "warning" | "info" | "success", glyph: string) {
  const bg = { danger: "#b42335", warning: "#b7791f", info: "#0891b2", success: "#168567" }[kind];
  return L.divIcon({
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    html: `<div style="width:24px;height:24px;border-radius:12px 12px 12px 2px;transform:rotate(-45deg);background:${bg};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4);display:grid;place-items:center"><span style="transform:rotate(45deg);color:#fff;font:700 12px system-ui">${glyph}</span></div>`,
  });
}

export function youIcon() {
  return L.divIcon({
    className: "",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `<div style="width:22px;height:22px;border-radius:9999px;background:#2563eb;border:4px solid #fff;box-shadow:0 0 0 6px rgba(37,99,235,.25)"></div>`,
  });
}

export { Marker, Polyline, Polygon, Tooltip };
