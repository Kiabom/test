"use client";
import { STATIONS, type LatLng, type StationKey } from "@/domain/geo";
import { BaseMap, BasemapSwitch, FitTo, Marker, Polyline, SiteLayers, Tooltip, stationIcon, truckIcon, useBasemap, youIcon, type Basemap } from "./MapKit";

export interface DriverMapProps {
  locale: "fa" | "en";
  /** Numbered stations of this driver's trip. */
  numbers: Partial<Record<StationKey, number>>;
  target: { at: LatLng; label: string; n: number };
  /** Leg (inside the site) or road route (after the exit gate). */
  path?: LatLng[];
  /** Where the driver is: phone GPS, or the demo position. */
  you?: LatLng;
  youIsGps?: boolean;
  /** Fit the whole road route instead of the site. */
  region?: boolean;
  basemap?: Basemap;
}

export default function DriverMap({ locale, numbers, target, path, you, youIsGps, region, basemap: initial = "osm" }: DriverMapProps) {
  const [basemap, setBasemap] = useBasemap(initial);
  const bounds = region && path?.length ? path : [STATIONS.approach.at, STATIONS["SH-01"].at, STATIONS.plant.at, STATIONS.C.at, ...(you ? [you] : [])];
  return (
    <div className="relative h-full w-full">
      <BaseMap center={target.at} zoom={15} basemap={basemap} className="h-full w-full overflow-hidden rounded-xl">
        <SiteLayers locale={locale} numbers={numbers} />
        {path && path.length > 1 && <Polyline positions={path} pathOptions={{ color: "#1273a6", weight: 6, opacity: 0.85, dashArray: region ? undefined : "1 10", lineCap: "round" }} />}
        <Marker position={target.at} icon={stationIcon(target.n, "success")} zIndexOffset={500}>
          <Tooltip permanent direction="top" offset={[0, -14]}>
            {target.label}
          </Tooltip>
        </Marker>
        {you && (
          <Marker position={you} icon={youIsGps ? youIcon() : truckIcon("#2563eb", 0, "#2563eb")} zIndexOffset={600}>
            <Tooltip direction="bottom" offset={[0, 12]}>{locale === "fa" ? (youIsGps ? "موقعیت GPS شما" : "موقعیت شما (نمایشی)") : youIsGps ? "Your GPS position" : "You (demo position)"}</Tooltip>
          </Marker>
        )}
        <FitTo bounds={bounds} trigger={`${region}-${target.label}`} maxZoom={16} />
      </BaseMap>
      <BasemapSwitch value={basemap} onChange={setBasemap} locale={locale} />
    </div>
  );
}
