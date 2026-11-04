"use client";
import { STATIONS, type StationKey } from "@/domain/geo";
import { BaseMap, BasemapSwitch, FitTo, SiteLayers, useBasemap, type Basemap } from "./MapKit";

/** The mine with numbered stations — used by the driver guide and the owner's process page. */
export default function SiteOverviewMap({ locale, numbers, initial = "osm" }: { locale: "fa" | "en"; numbers: Partial<Record<StationKey, number>>; initial?: Basemap }) {
  const [basemap, setBasemap] = useBasemap(initial);
  return (
    <div className="relative h-full w-full">
      <BaseMap center={STATIONS.B.at} zoom={15} basemap={basemap} className="h-full w-full overflow-hidden rounded-xl">
        <SiteLayers locale={locale} numbers={numbers} />
        <FitTo bounds={[STATIONS.approach.at, STATIONS["SH-01"].at, STATIONS.plant.at, STATIONS.control.at]} trigger="site" maxZoom={16} />
      </BaseMap>
      <BasemapSwitch value={basemap} onChange={setBasemap} locale={locale} />
    </div>
  );
}
