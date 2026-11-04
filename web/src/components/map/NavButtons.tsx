"use client";
import { Copy, Navigation } from "lucide-react";
import { Button, toast } from "@/components/ui";
import type { LatLng } from "@/domain/geo";
import { fmtLatLng, navLinks, primaryNavUrl } from "@/lib/nav";
import { useL } from "@/lib/prefs";

/** Hands the destination to the phone's navigation app. */
export function NavButtons({ at, label, compact }: { at: LatLng; label: string; compact?: boolean }) {
  const L = useL();
  const links = navLinks(at, label);
  const ext = { target: "_blank", rel: "noreferrer" } as const;
  return (
    <div className="flex flex-col gap-2">
      <a href={primaryNavUrl(at, label)} {...ext}>
        <Button variant="success" size={compact ? "md" : "lg"} className="w-full">
          <Navigation className="size-5" /> {L("مسیریابی با GPS گوشی", "Navigate with phone GPS")}
        </Button>
      </a>
      <div className="grid grid-cols-4 gap-1.5 text-xs">
        <a href={links.geo} className="rounded-lg border border-border py-1.5 text-center hover:border-primary" title={L("اندروید: انتخاب برنامه نصب‌شده (نشان، بلد، …)", "Android: pick an installed app (Neshan, Balad, …)")}>
          {L("برنامه‌ها", "Apps")}
        </a>
        <a href={links.google} {...ext} className="rounded-lg border border-border py-1.5 text-center hover:border-primary">
          Google
        </a>
        <a href={links.waze} {...ext} className="rounded-lg border border-border py-1.5 text-center hover:border-primary">
          Waze
        </a>
        <button
          className="flex items-center justify-center gap-1 rounded-lg border border-border py-1.5 hover:border-primary"
          onClick={() => {
            navigator.clipboard?.writeText(fmtLatLng(at));
            toast.success(L("مختصات کپی شد", "Coordinates copied"));
          }}
        >
          <Copy className="size-3" /> {L("مختصات", "Coords")}
        </button>
      </div>
      {!compact && <div className="text-[11px] text-muted">{L("در اندروید، دکمه «برنامه‌ها» فهرست برنامه‌های مسیریابی نصب‌شده (مثل نشان و بلد) را باز می‌کند.", "On Android, “Apps” opens the list of installed navigation apps (such as Neshan or Balad).")}</div>}
    </div>
  );
}
