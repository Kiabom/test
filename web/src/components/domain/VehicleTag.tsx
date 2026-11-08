"use client";
import { Nfc } from "lucide-react";
import { useEffect, useState } from "react";
import { cx } from "@/components/ui";
import { normalizePlate } from "@/domain/plate";
import type { Plate, Vehicle } from "@/domain/types";

type Index = { byPlate: Map<string, Vehicle>; byId: Map<string, Vehicle> };
let cache: Promise<Index> | null = null;
let cacheAt = 0;

/** Vehicle registry shared by every tag on the page (one request, refreshed every few seconds). */
function loadIndex(): Promise<Index> {
  if (!cache || Date.now() - cacheAt > 5_000) {
    cacheAt = Date.now();
    cache = fetch("/api/data/masters")
      .then((r) => r.json())
      .then((m: { vehicles: Vehicle[] }) => ({ byPlate: new Map(m.vehicles.map((v) => [v.plateNormalized, v])), byId: new Map(m.vehicles.map((v) => [v.id, v])) }));
  }
  return cache;
}
function useVehicle(plate?: Plate | null, id?: string) {
  const [v, setV] = useState<Vehicle | undefined>();
  const key = plate ? normalizePlate(plate) : undefined;
  useEffect(() => {
    let live = true;
    loadIndex().then((ix) => live && setV((id && ix.byId.get(id)) || (key ? ix.byPlate.get(key) : undefined)));
    return () => {
      live = false;
    };
  }, [key, id]);
  return v;
}

/** Short form of an EPC: the last two groups, e.g. E280-…-8512-F00 → 8512-F00. */
export const shortTag = (epc?: string) => (epc ? epc.split("-").slice(-2).join("-") : "—");

const SIZE = {
  xs: "text-[11px] px-1.5 py-0.5 gap-1",
  sm: "text-xs px-2 py-1 gap-1.5",
  md: "text-sm px-2.5 py-1 gap-1.5",
  lg: "text-lg px-3 py-1.5 gap-2",
  xl: "text-3xl px-4 py-2 gap-3",
  xxl: "text-6xl px-6 py-3 gap-4",
} as const;

/**
 * Vehicle identity on site = its RFID tag (trucks are identified by tag, not plate).
 * Accepts the vehicle's plate or id and looks the tag up in the registry.
 */
export function VehicleTag({ plate, vehicleId, epc, size = "sm", className, highlight }: { plate?: Plate | null; vehicleId?: string; epc?: string; size?: keyof typeof SIZE; className?: string; highlight?: boolean }) {
  const v = useVehicle(plate, vehicleId);
  const tag = epc ?? v?.rfidEpc;
  return (
    <span
      dir="ltr"
      title={tag ? `RFID ${tag}` : undefined}
      className={cx("inline-flex items-center whitespace-nowrap rounded-md border font-mono font-semibold", highlight ? "border-success bg-success/10 text-success" : "border-border bg-surface-2 text-text", SIZE[size], className)}
    >
      <Nfc className={cx("shrink-0 opacity-60", size === "xxl" ? "size-12" : size === "xl" ? "size-7" : size === "lg" ? "size-5" : "size-3.5")} />
      <span>{v ? v.id : "—"}</span>
      <span className="opacity-60">·</span>
      <span>{shortTag(tag)}</span>
    </span>
  );
}
