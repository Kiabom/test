"use client";
import { Map as MapIcon } from "lucide-react";
import { useState } from "react";
import { IranPlate } from "@/components/domain/IranPlate";
import { Badge, Card, CardHeader, Drawer, Kv, PageHeader, Skeleton } from "@/components/ui";
import { DEVICE_TYPE, lbl, VISIT_STATE } from "@/i18n/labels";
import { fmtRelative } from "@/lib/format";
import { useLive, useMasters } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import type { VisitBrief } from "@/server/views";

// zone anchors on the 1000×560 map
const ZONES: Record<string, { x: number; y: number; w: number; h: number; fa: string; en: string }> = {
  road: { x: 20, y: 470, w: 960, h: 60, fa: "جاده دسترسی", en: "Access road" },
  park: { x: 40, y: 330, w: 210, h: 110, fa: "پارکینگ انتظار / صف", en: "Waiting area / queue" },
  A: { x: 280, y: 370, w: 90, h: 70, fa: "لاین A — دروازه ورود", en: "Lane A — entry" },
  B: { x: 400, y: 360, w: 170, h: 80, fa: "لاین B — باسکول ۱", en: "Lane B — scale 1" },
  yard: { x: 420, y: 70, w: 360, h: 190, fa: "محوطه بارگیری و دپو", en: "Loading yard & stockpiles" },
  D: { x: 620, y: 280, w: 90, h: 60, fa: "لاین D — LiDAR", en: "Lane D — LiDAR" },
  C: { x: 600, y: 360, w: 170, h: 80, fa: "لاین C — باسکول ۲", en: "Lane C — scale 2" },
  E: { x: 800, y: 370, w: 90, h: 70, fa: "لاین E — دروازه خروج", en: "Lane E — exit" },
  office: { x: 60, y: 60, w: 220, h: 120, fa: "اتاق کنترل / Edge / PLC", en: "Control room / Edge / PLC" },
};

function zoneOf(v: VisitBrief, queued: Set<string>) {
  if (v.laneCode) return v.laneCode;
  if (v.state === "LOADING") return "yard";
  if (queued.has(v.id)) return "park";
  if (v.state === "READY_TO_EXIT") return "E";
  if (v.state === "HOLD") return "park";
  return "park";
}

export default function SiteMap() {
  const L = useL();
  const locale = useLocale();
  const live = useLive();
  const masters = useMasters();
  const [sel, setSel] = useState<{ type: "visit" | "device"; id: string } | null>(null);
  if (!live) return <Skeleton className="h-[70vh]" />;
  const queued = new Set([...live.queues.B, ...live.queues.C, ...live.queues.gateIn, ...live.queues.gateOut]);
  const byZone: Record<string, VisitBrief[]> = {};
  for (const id of live.activeIds) {
    const v = live.visits[id];
    const z = zoneOf(v, queued);
    (byZone[z] ??= []).push(v);
  }
  const devColor = (s: string) => (s === "OFFLINE" ? "#ef4444" : s === "DEGRADED" ? "#f59f00" : "#22c55e");
  const devAt: Record<string, string> = { "L-A": "A", "L-B": "B", "L-C": "C", "L-D": "D", "L-E": "E" };
  const devices = live.devices.map((d) => ({ ...d, zone: d.laneId ? devAt[d.laneId] : "office" }));
  const selVisit = sel?.type === "visit" ? live.visits[sel.id] : undefined;
  const selDev = sel?.type === "device" ? masters?.devices.find((d) => d.id === sel.id) : undefined;
  const selDevLive = sel?.type === "device" ? live.devices.find((d) => d.id === sel.id) : undefined;
  return (
    <div>
      <PageHeader icon={<MapIcon className="size-5" />} title={L("نقشه سایت زنده", "Live site map")} subtitle={L("موقعیت کامیون‌ها و وضعیت همه تجهیزات روی چیدمان سایت (کلیک برای جزئیات)", "Truck positions and device health on the site layout (click for details)")} />
      <Card>
        <CardHeader title={L("سایت مرکزی معدن سنگ آهن", "Central iron-ore mine site")} actions={<div className="flex gap-2 text-xs"><Badge tone="success">● {L("آنلاین", "Online")}</Badge><Badge tone="warning">● {L("افت", "Degraded")}</Badge><Badge tone="danger">● {L("آفلاین", "Offline")}</Badge></div>} />
        <div className="p-3">
          <svg viewBox="0 0 1000 560" className="w-full rounded-xl bg-[#e9e2d6] dark:bg-[#1b2433]">
            <defs>
              <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#b9a98f" strokeWidth="3" />
              </pattern>
            </defs>
            {/* stockpiles */}
            {[
              [480, 120, 50],
              [600, 110, 60],
              [710, 150, 40],
            ].map(([x, y, r], i) => (
              <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.55} fill={["#8c2f1b", "#343a40", "#5c4033"][i]} opacity="0.75" />
            ))}
            <path d="M40 520 L960 520" stroke="#6b5640" strokeWidth="44" opacity="0.35" />
            <path d="M250 400 L280 400 M370 400 L400 400 M570 400 L600 400 M770 400 L800 400 M890 400 L950 470" stroke="#6b5640" strokeWidth="24" opacity="0.35" fill="none" />
            <path d="M485 360 L485 260 M665 280 L665 260" stroke="#6b5640" strokeWidth="24" opacity="0.35" fill="none" />
            {Object.entries(ZONES).map(([k, z]) => (
              <g key={k}>
                <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="10" fill={k === "B" || k === "C" ? "#868e96" : k === "yard" ? "url(#hatch)" : "#ffffff"} fillOpacity={k === "road" ? 0 : 0.55} stroke="#495057" strokeDasharray={k === "road" ? "0" : "6 4"} />
                <text x={z.x + 8} y={z.y + 18} fontSize="12" fontWeight="700" fill="#212529" fontFamily="Vazirmatn Variable, sans-serif">
                  {locale === "fa" ? z.fa : z.en}
                </text>
                {(byZone[k] ?? []).map((v, i) => {
                  const cx = z.x + 24 + (i % 6) * 30;
                  const cy = z.y + 40 + Math.floor(i / 6) * 22;
                  return (
                    <g key={v.id} onClick={() => setSel({ type: "visit", id: v.id })} className="cursor-pointer">
                      <rect x={cx - 12} y={cy - 8} width="24" height="16" rx="3" fill={v.state === "HOLD" ? "#e03131" : v.vehicleColor} stroke="#fff" strokeWidth="1.5">
                        {v.laneCode && <animate attributeName="opacity" values="1;0.55;1" dur="1.4s" repeatCount="indefinite" />}
                      </rect>
                      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700">
                        {v.queueNo}
                      </text>
                    </g>
                  );
                })}
                {devices
                  .filter((d) => d.zone === k)
                  .map((d, i) => (
                    <circle key={d.id} cx={z.x + z.w - 10 - (i % 8) * 11} cy={z.y + z.h - 10 - Math.floor(i / 8) * 11} r="4.5" fill={devColor(d.status)} stroke="#fff" onClick={() => setSel({ type: "device", id: d.id })} className="cursor-pointer" />
                  ))}
              </g>
            ))}
            {/* lane lights */}
            {live.lanes.map((l) => {
              const z = ZONES[l.code];
              return <circle key={l.code} cx={z.x + z.w - 12} cy={z.y + 14} r="7" fill={l.light === "GREEN" ? "#22c55e" : l.light === "YELLOW" ? "#facc15" : "#ef4444"} stroke="#212529" />;
            })}
          </svg>
        </div>
      </Card>
      <Drawer open={!!sel} onClose={() => setSel(null)} title={selVisit ? L("کامیون", "Truck") : L("دستگاه", "Device")}>
        {selVisit && (
          <div className="flex flex-col gap-3">
            <IranPlate plate={selVisit.plate} size="lg" />
            <Kv k={L("وضعیت", "State")} v={lbl(VISIT_STATE, selVisit.state, locale)} />
            <Kv k={L("راننده", "Driver")} v={locale === "fa" ? selVisit.driverName : selVisit.driverNameEn} />
            <Kv k={L("حواله", "Permit")} v={selVisit.permitNo} />
            <Kv k={L("رسیدن", "Arrived")} v={fmtRelative(selVisit.arrivedAt, locale)} />
          </div>
        )}
        {selDev && (
          <div className="flex flex-col gap-1">
            <Kv k={L("نام", "Name")} v={selDev.name} />
            <Kv k={L("نوع", "Type")} v={lbl(DEVICE_TYPE, selDev.type, locale)} />
            <Kv k={L("مدل", "Model")} v={selDev.model} />
            <Kv k={L("پروتکل", "Protocol")} v={selDev.protocol} />
            <Kv k="IP" v={selDev.ip} mono />
            <Kv k={L("وضعیت", "Status")} v={selDevLive?.status} />
            <Kv k="Heartbeat" v={fmtRelative(selDevLive?.lastHeartbeatAt, locale)} />
          </div>
        )}
      </Drawer>
    </div>
  );
}
