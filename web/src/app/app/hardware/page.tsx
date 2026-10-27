"use client";
import { Camera } from "lucide-react";
import { useMemo, useState } from "react";
import { DeviceArt, GatePortalSvg, LidarGantrySvg, UvssImage } from "@/components/hardware/Devices";
import { CameraFeed } from "@/components/hardware/CameraFeed";
import { ScaleDeckTop } from "@/components/hardware/ScaleDeck";
import { TruckSvg } from "@/components/hardware/Truck";
import { Badge, Card, CardHeader, cx, PageHeader, Segmented, Skeleton } from "@/components/ui";
import type { DeviceType } from "@/domain/types";
import { DEVICE_TYPE, lbl } from "@/i18n/labels";
import { fmtRelative } from "@/lib/format";
import { useLive, useMasters } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";

const OUTPUTS: Partial<Record<DeviceType, [string, string]>> = {
  INDICATOR: ["فریم وزن ~1Hz: `ST,GS,+0034520kg`", "Weight frame ~1 Hz: `ST,GS,+0034520kg`"],
  CAMERA_ANPR: ["پلاک + اطمینان + کادر + تصویر با sha256", "Plate + confidence + bbox + image sha256"],
  CAMERA_TOP: ["تصویر بالای بار + ماسک ROI موقعیت", "Overhead image + ROI positioning mask"],
  CAMERA_SIDE: ["شمارش محور و لاستیک", "Axle & tyre count"],
  CAMERA_OVERVIEW: ["نمای کلی لاین برای شواهد", "Lane overview for evidence"],
  CAMERA_LICENSE: ["عکس مدارک راننده (ماسک‌شده)", "Driver document photo (masked)"],
  UVSS: ["تصویر line-scan شاسی + ناهنجاری‌ها", "Chassis line-scan + anomalies"],
  LIDAR: ["ابر نقاط، حجم m³، کیفیت، خارج از مرکز", "Point cloud, m³, quality, off-centre"],
  RFID_READER: ["EPC + RSSI + آنتن", "EPC + RSSI + antenna"],
  POSITION_SENSOR: ["وضعیت ۴ پرتو IR", "4 IR beam states"],
  BARRIER: ["OPEN_REQUEST → ACK → OPEN_CONFIRMED", "OPEN_REQUEST → ACK → OPEN_CONFIRMED"],
  TRAFFIC_LIGHT: ["قرمز/زرد/سبز", "Red / amber / green"],
  LED_DISPLAY: ["دستورالعمل راننده + وزن + QR", "Driver instruction + weight + QR"],
  QUEUE_BOARD: ["نفر بعد هر لاین", "Next truck per lane"],
  KIOSK: ["اسکن QR، تأیید، چاپ، اینترکام", "QR scan, confirm, print, intercom"],
  PRINTER: ["رسید حرارتی ۸۰mm با QR", "80 mm thermal receipt with QR"],
  PLC: ["Interlock ایمنی، I/O", "Safety interlock, I/O"],
  EDGE_GATEWAY: ["صف آفلاین، همگام‌سازی idempotent", "Offline queue, idempotent sync"],
  INTERCOM: ["تماس صوتی SIP", "SIP voice call"],
  SIREN: ["آژیر tailgating / باز شدن غیرمجاز", "Tailgating / uncommanded-open siren"],
  JUNCTION_BOX: ["drift / noise / تعادل هر لودسل", "Per-cell drift / noise / balance"],
};

export default function HardwarePage() {
  const L = useL();
  const locale = useLocale();
  const masters = useMasters();
  const live = useLive();
  const [lane, setLane] = useState<string>("all");
  const devices = useMemo(() => (masters?.devices ?? []).filter((d) => lane === "all" || d.laneId === lane || (lane === "site" && !d.laneId)), [masters, lane]);
  return (
    <div>
      <PageHeader icon={<Camera className="size-5" />} title={L("کاتالوگ سخت‌افزار و ماکاپ تجهیزات", "Hardware catalog & equipment mockups")} subtitle={L("همه تجهیزات شبیه‌سازی‌شده با ماکاپ اختصاصی، محل نصب، خروجی داده و وضعیت زنده", "Every simulated device with original mockup, location, data output and live status")} />
      <div className="mb-4 grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title={L("دکل دروازه (ANPR جلو/عقب، RFID، UVSS، راهبند، تابلو)", "Gate portal (ANPR F/R, RFID, UVSS, barrier, sign)")} />
          <div className="p-3">
            <GatePortalSvg className="w-full" truck={{ color: "#1971c2", loaded: false }} labels={{ anprFront: "ANPR", anprRear: "ANPR", rfid: "RFID", uvss: "UVSS", barrier: L("راهبند", "Barrier"), led: "LED" }} />
          </div>
        </Card>
        <Card>
          <CardHeader title={L("گنتری LiDAR — اسکن بالای بار", "LiDAR gantry — overhead load scan")} />
          <div className="p-3">
            <LidarGantrySvg className="w-full" truck={{ color: "#d9480f", loaded: true }} />
          </div>
        </Card>
        <Card>
          <CardHeader title={L("باسکول ۱۸ متری — ۸ لودسل + ۴ پرتو IR", "18 m weighbridge — 8 load cells + 4 IR beams")} />
          <div className="p-3">
            <ScaleDeckTop occupied beams={[true, true, true, true]} positionOk color="#2f9e44" loaded className="w-full" />
          </div>
        </Card>
        <Card>
          <CardHeader title={L("UVSS — تصویر زیر شاسی", "UVSS — under-chassis image")} />
          <div className="p-3">
            <UvssImage anomalies={[{ x: 0.38, y: 0.46, w: 0.12, h: 0.1, label: "", score: 0.86 }]} className="w-full rounded-lg" />
          </div>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader title={L("نماهای کامیون و فید دوربین‌ها", "Truck views and camera feeds")} />
          <div className="grid grid-cols-2 gap-3 p-3 md:grid-cols-4">
            <TruckSvg view="side" width={260} loaded color="#e8590c" />
            <TruckSvg view="top" width={260} loaded color="#1971c2" />
            <CameraFeed view="front" seed={5} plate={{ d2: "12", letter: "ب", d3: "345", region: "67" }} color="#c92a2a" label="CAM-ANPR" confidence={0.96} at={live?.now} />
            <CameraFeed view="top" seed={6} color="#2f9e44" loaded label="CAM-TOP · ROI" roi="ok" at={live?.now} />
          </div>
        </Card>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">{L("فهرست تجهیزات سایت", "Site device list")}</h2>
        <Segmented options={[{ id: "all", label: L("همه", "All") }, { id: "L-A", label: "A" }, { id: "L-B", label: "B" }, { id: "L-C", label: "C" }, { id: "L-D", label: "D" }, { id: "L-E", label: "E" }, { id: "site", label: L("سایت", "Site") }]} value={lane} onChange={setLane} />
      </div>
      {!masters ? (
        <Skeleton className="h-96" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {devices.map((d) => {
            const st = live?.devices.find((x) => x.id === d.id);
            return (
              <Card key={d.id} className="flex flex-col p-3">
                <div className="rounded-lg bg-surface-2 p-2">
                  <DeviceArt type={d.type} status={st?.status} className="mx-auto h-24 w-full" />
                </div>
                <div className="mt-2 flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold">{d.name}</div>
                    <div className="text-xs text-muted">{lbl(DEVICE_TYPE, d.type, locale)} · {d.model}</div>
                  </div>
                  <Badge tone={st?.status === "OFFLINE" ? "danger" : st?.status === "DEGRADED" ? "warning" : "success"}>{st?.status}</Badge>
                </div>
                <div className="mt-2 text-[11px] text-muted">
                  <div>
                    {L("محل", "Location")}: {d.laneId ? `Lane ${d.laneId.slice(2)}` : L("سایت", "Site")} {d.position && `· ${d.position}`}
                  </div>
                  <div className="ltr text-start">
                    {d.protocol} · {d.ip} · fw {d.firmware}
                  </div>
                  {OUTPUTS[d.type] && <div className={cx("mt-1 rounded bg-surface-2 p-1.5 text-text")}>{locale === "fa" ? OUTPUTS[d.type]![0] : OUTPUTS[d.type]![1]}</div>}
                  <div className="mt-1">Heartbeat: {fmtRelative(st?.lastHeartbeatAt, locale)}</div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
