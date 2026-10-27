"use client";
import { Box, Crosshair, DoorOpen, History, ScanLine, Sigma } from "lucide-react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { IranPlate } from "@/components/domain/IranPlate";
import { CameraFeed } from "@/components/hardware/CameraFeed";
import { GatePortalSvg, LidarGantrySvg, UvssImage } from "@/components/hardware/Devices";
import { HeightMap } from "@/components/hardware/heap";
import { ScaleDeckTop } from "@/components/hardware/ScaleDeck";
import { Badge, Button, Card, CardHeader, Kv, PageHeader, Segmented, Skeleton, StatusPill, Table, Tabs, Td, toast } from "@/components/ui";
import type { LidarScan, UvssScan, Vehicle } from "@/domain/types";
import { volumeCrossCheckPct } from "@/domain/kpi";
import { fmtDateTime, fmtKg, fmtNum, fmtPct, fmtTime } from "@/lib/format";
import { act, useData, useLive, useMasters } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import type { CloudMode } from "@/components/hardware/heap";

const PointCloudViewer = dynamic(() => import("@/components/hardware/PointCloud"), { ssr: false, loading: () => <Skeleton className="h-[360px]" /> });

type TabId = "gate" | "lidar" | "uvss" | "position" | "history";

function ScanInner() {
  const L = useL();
  const locale = useLocale();
  const sp = useSearchParams();
  const [tab, setTab] = useState<TabId>((sp.get("tab") as TabId) || "gate");
  const live = useLive();
  const masters = useMasters();
  const { data: lidar } = useData<LidarScan>("lidarScans", { limit: 60 });
  const { data: uvss } = useData<UvssScan>("uvssScans", { limit: 60 });
  const { data: txs } = useData<{ id: string; netKg?: number; materialId: string; lidarScanIds: string[]; ticketNo: string }>("transactions", { limit: 300 });
  const [lidarSel, setLidarSel] = useState<string | undefined>();
  const [uvSel, setUvSel] = useState<string | undefined>();
  const [mode, setMode] = useState<CloudMode>("loaded");
  const [cmp, setCmp] = useState(50);
  const veh = (id?: string) => masters?.vehicles.find((v) => v.id === id) as Vehicle | undefined;
  const laneA = live?.lanes.find((l) => l.code === "A");
  const visA = laneA?.visitId ? live?.visits[laneA.visitId] : undefined;
  const laneB = live?.lanes.find((l) => l.code === "B");
  const visB = laneB?.visitId ? live?.visits[laneB.visitId] : undefined;
  const laneD = live?.lanes.find((l) => l.code === "D");
  const visD = laneD?.visitId ? live?.visits[laneD.visitId] : undefined;
  const devStatus = (id: string) => live?.devices.find((x) => x.id === id)?.status ?? "ONLINE";

  const scan = useMemo(() => lidar?.items.find((x) => x.id === lidarSel) ?? lidar?.items[0], [lidar, lidarSel]);
  const scanTx = txs?.items.find((t) => scan && t.lidarScanIds.includes(scan.id));
  const scanMat = masters?.materials.find((m) => m.id === scanTx?.materialId);
  const uv = useMemo(() => uvss?.items.find((x) => x.id === uvSel) ?? uvss?.items.find((x) => x.status === "SUSPECT") ?? uvss?.items[0], [uvss, uvSel]);

  return (
    <div>
      <PageHeader icon={<ScanLine className="size-5" />} title={L("مرکز اسکن", "Scan center")} subtitle={L("اسکن دروازه، بالای بار (LiDAR سه‌بعدی)، زیر خودرو (UVSS) و موقعیت چرخ‌ها روی باسکول", "Gate portal, overhead load (3D LiDAR), under-vehicle (UVSS) and wheel position on the deck")} />
      <Tabs
        className="mb-4"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "gate", label: L("اسکن دروازه", "Gate portal"), icon: <DoorOpen className="size-4" /> },
          { id: "lidar", label: L("بالای بار (LiDAR)", "Overhead (LiDAR)"), icon: <Box className="size-4" /> },
          { id: "uvss", label: L("زیر خودرو (UVSS)", "Under-vehicle (UVSS)"), icon: <ScanLine className="size-4" /> },
          { id: "position", label: L("موقعیت روی باسکول", "Position on deck"), icon: <Crosshair className="size-4" /> },
          { id: "history", label: L("تاریخچه اسکن‌ها", "Scan history"), icon: <History className="size-4" /> },
        ]}
      />

      {tab === "gate" && (
        <div className="grid gap-4 xl:grid-cols-5">
          <Card className="xl:col-span-3">
            <CardHeader title={L("دکل دروازه ورود — نقاط فعال", "Entry gate portal — live sensors")} subtitle={L("نقطه سبز = آنلاین · نارنجی = افت کیفیت · قرمز = آفلاین", "Green = online · amber = degraded · red = offline")} />
            <div className="p-3">
              <GatePortalSvg
                className="w-full"
                truck={visA ? { color: visA.vehicleColor, loaded: visA.operation === "RECEIVE" } : null}
                status={{ anprFront: devStatus("CAM-A-FRONT"), anprRear: devStatus("CAM-A-REAR"), overview: devStatus("CAM-A-OVR"), rfid: devStatus("RFID-A"), uvss: devStatus("UVSS-A"), barrier: devStatus("BAR-A"), led: devStatus("LED-A") }}
                labels={{ anprFront: L("ANPR جلو", "ANPR F"), anprRear: L("ANPR عقب", "ANPR R"), overview: L("نما", "Overview"), rfid: "RFID", uvss: "UVSS", barrier: L("راهبند", "Barrier"), led: L("تابلو", "Sign") }}
              />
            </div>
          </Card>
          <Card className="xl:col-span-2">
            <CardHeader title={L("نتایج خوانش", "Read results")} />
            <div className="flex flex-col gap-3 p-4">
              {visA ? (
                <>
                  <IranPlate plate={visA.plate} size="lg" highlight={visA.identity.match === "MATCH"} />
                  <Kv k={L("پلاک کشنده (جلو)", "Tractor plate (front)")} v={<span className="font-mono ltr">{visA.identity.anpr?.plate ?? "…"}</span>} />
                  <Kv k={L("اطمینان جلو / عقب", "Confidence F / R")} v={`${visA.identity.anpr ? fmtPct(visA.identity.anpr.confidence * 100, locale) : "—"} / ${visA.identity.anprRear ? fmtPct(visA.identity.anprRear.confidence * 100, locale) : "—"}`} />
                  <Kv k="RFID EPC" v={<span className="font-mono text-xs ltr">{visA.identity.rfid?.epc ?? "—"}</span>} />
                  <Kv k={L("شمارش محور (دوربین جانبی)", "Axle count (side cam)")} v={visA.vehicleType === "TRAILER" ? "6" : "3"} />
                  <Kv k={L("شماره کانتینر / پلمب (OCR)", "Container / seal (OCR)")} v={<span className="font-mono ltr">{visA.vehicleType === "TRAILER" ? "N/A (bulk)" : "—"}</span>} />
                  <Kv k={L("نتیجه تطبیق", "Match")} v={<Badge tone={visA.identity.match === "MATCH" ? "success" : visA.identity.match === "MISMATCH" ? "danger" : "warning"}>{visA.identity.match}</Badge>} />
                </>
              ) : (
                <div className="py-8 text-center text-sm text-muted">{L("دکل خالی است — منتظر خودرو", "Portal is clear — waiting for a truck")}</div>
              )}
            </div>
          </Card>
          <Card className="xl:col-span-5">
            <CardHeader title={L("فیدهای دکل", "Portal feeds")} />
            <div className="grid grid-cols-2 gap-2 p-3 md:grid-cols-4">
              <CameraFeed view={visA ? "front" : "empty"} plate={visA?.plate} color={visA?.vehicleColor} seed={41} label="CAM-A-FRONT" at={live?.now} confidence={visA?.identity.anpr?.confidence} />
              <CameraFeed view={visA ? "rear" : "empty"} plate={visA?.plate} seed={42} label="CAM-A-REAR" at={live?.now} confidence={visA?.identity.anprRear?.confidence} />
              <CameraFeed view={visA ? "overview" : "empty"} color={visA?.vehicleColor} seed={43} label="CAM-A-OVR" at={live?.now} />
              <CameraFeed view={visA ? "side" : "empty"} color={visA?.vehicleColor} seed={44} label="CAM-A-SIDE (axles)" at={live?.now} />
            </div>
          </Card>
        </div>
      )}

      {tab === "lidar" && (
        <div className="grid gap-4 xl:grid-cols-5">
          <div className="flex flex-col gap-4 xl:col-span-3">
            <Card>
              <CardHeader
                title={L("ابر نقاط سه‌بعدی بار", "3D load point cloud")}
                subtitle={scan ? `${veh(scan.vehicleId)?.plateNormalized ?? ""} · ${fmtDateTime(scan.capturedAt, locale)}` : undefined}
                actions={<Segmented options={[{ id: "loaded", label: L("پر", "Loaded") }, { id: "empty", label: L("خالی (مرجع)", "Empty (ref)") }]} value={mode} onChange={setMode} />}
              />
              <div className="p-3">{scan ? <PointCloudViewer seed={scan.seed} mode={mode} offCenter={scan.offCenterPct} /> : <Skeleton className="h-[360px]" />}</div>
            </Card>
            <Card>
              <CardHeader title={L("نقشه ارتفاع (نمای بالا)", "Height map (top view)")} subtitle={L("آبی = کم، قرمز = قله بار؛ خطوط چین = محورهای مرکز", "Blue = low, red = peak; dashed = centre lines")} />
              <div className="p-3">{scan && <HeightMap seed={scan.seed} offCenter={scan.offCenterPct} className="w-full rounded-lg" />}</div>
            </Card>
          </div>
          <div className="flex flex-col gap-4 xl:col-span-2">
            <Card>
              <CardHeader title={L("گنتری LiDAR — لاین D", "LiDAR gantry — lane D")} actions={visD ? <Badge tone="info">{L("در حال اسکن", "Scanning")}</Badge> : <Badge>{L("آماده", "Idle")}</Badge>} />
              <div className="p-3">
                <LidarGantrySvg className="w-full" scanning={!!visD} truck={visD ? { color: visD.vehicleColor, loaded: true } : { loaded: true, color: "#868e96" }} />
              </div>
            </Card>
            {scan && (
              <Card>
                <CardHeader title={L("نتیجه اندازه‌گیری حجمی", "Volumetric result")} actions={<StatusPill status="ESTIMATED" />} />
                <div className="p-4">
                  <Kv k={L("حجم خالص بار", "Net load volume")} v={`${fmtNum(scan.volumeM3, locale)} m³`} />
                  <Kv k={L("کیفیت اسکن", "Scan quality")} v={fmtPct(scan.quality * 100, locale)} />
                  <Kv k={L("انحراف از مرکز", "Off-centre")} v={<span className={scan.offCenterPct > 15 ? "text-danger" : ""}>{fmtPct(scan.offCenterPct, locale)}</span>} />
                  <Kv k={L("ارتفاع قله", "Peak height")} v={`${fmtNum(scan.peakHeightM, locale)} m`} />
                  <Kv k={L("روکش (تارپ)", "Tarp cover")} v={scan.covered ? L("پوشیده ✓", "Covered ✓") : L("باز ⚠", "Open ⚠")} />
                  <Kv k="Carryback" v={`${fmtNum(scan.carrybackM3, locale)} m³`} />
                  {scanMat && <Kv k={L("چگالی ماده (مصوب)", "Bulk density")} v={`${fmtNum(scanMat.densityKgM3, locale)} kg/m³`} />}
                  {scanMat && <Kv k={L("جرم تخمینی = حجم × چگالی", "Estimated mass = V × ρ")} v={<span className="flex items-center gap-1"><Sigma className="size-3.5" />{fmtKg(scan.volumeM3 * scanMat.densityKgM3, locale)}</span>} />}
                  {scanTx?.netKg != null && scanMat && (
                    <>
                      <Kv k={L("وزن قانونی باسکول", "Legal scale net")} v={<strong>{fmtKg(scanTx.netKg, locale)}</strong>} />
                      <Kv k={L("اختلاف حجم/وزن", "Volume vs mass gap")} v={fmtPct(volumeCrossCheckPct(scanTx.netKg, scan.volumeM3, scanMat.densityKgM3), locale)} />
                    </>
                  )}
                  <div className="mt-3 rounded-lg bg-info/8 p-2.5 text-[11px] text-info">{L("حجم و جرم تخمینی هرگز جایگزین وزن قانونی باسکول نمی‌شوند؛ فقط برای کنترل کیفیت و مغایرت‌یابی استفاده می‌شوند.", "Volume and estimated mass never replace the legal scale weight; they are only used for QC and reconciliation.")}</div>
                </div>
              </Card>
            )}
            <Card>
              <CardHeader title={L("اسکن‌های اخیر", "Recent scans")} />
              <ul className="max-h-64 divide-y divide-border overflow-auto">
                {lidar?.items.slice(0, 25).map((s) => (
                  <li key={s.id}>
                    <button onClick={() => setLidarSel(s.id)} className="flex w-full items-center justify-between gap-2 px-3 py-2 text-start text-xs hover:bg-surface-2">
                      {veh(s.vehicleId) && <IranPlate plate={veh(s.vehicleId)!.plate} size="xs" />}
                      <span className="num">{fmtNum(s.volumeM3, locale)} m³</span>
                      <span className="num text-muted">{fmtTime(s.capturedAt, locale)}</span>
                      {s.offCenterPct > 15 && <Badge tone="warning">{L("خارج از مرکز", "Off-centre")}</Badge>}
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}

      {tab === "uvss" && uv && (
        <div className="grid gap-4 xl:grid-cols-4">
          <div className="flex flex-col gap-4 xl:col-span-3">
            <Card>
              <CardHeader
                title={L("تصویر زیر خودرو — مقایسه با مرجع", "Under-vehicle image vs reference")}
                subtitle={`${veh(uv.vehicleId)?.plateNormalized ?? ""} · ${fmtDateTime(uv.capturedAt, locale)}`}
                actions={<StatusPill status={uv.status === "SUSPECT" || uv.status === "ESCALATED" ? "HOLD" : "PASS"} label={`${L("تطابق", "match")} ${fmtNum(uv.referenceMatchPct, locale)}%`} />}
              />
              <div className="p-3">
                <div className="relative overflow-hidden rounded-lg">
                  <UvssImage reference className="block w-full" />
                  <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - cmp}% 0 0)` }}>
                    <UvssImage anomalies={uv.anomalies} className="block w-full" />
                  </div>
                  <div className="absolute inset-y-0 w-0.5 bg-sky-400" style={{ left: `${cmp}%` }} />
                </div>
                <input type="range" min={0} max={100} value={cmp} onChange={(e) => setCmp(Number(e.target.value))} className="mt-3 w-full" aria-label="compare" />
                <div className="flex justify-between text-[11px] text-muted ltr">
                  <span>◀ LIVE</span>
                  <span>REFERENCE ▶</span>
                </div>
              </div>
            </Card>
            <div className="grid gap-3 md:grid-cols-2">
              <Card>
                <CardHeader title={L("تصویر زنده", "Live scan")} />
                <div className="p-3">
                  <UvssImage anomalies={uv.anomalies} className="w-full rounded" />
                </div>
              </Card>
              <Card>
                <CardHeader title={L("تصویر مرجع ثبت‌شده خودرو", "Registered reference")} />
                <div className="p-3">
                  <UvssImage reference className="w-full rounded" />
                </div>
              </Card>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader title={L("ناهنجاری‌ها", "Anomalies")} />
              <div className="flex flex-col gap-2 p-4">
                {uv.anomalies.length ? (
                  uv.anomalies.map((a, i) => (
                    <div key={i} className="rounded-lg border border-danger/30 bg-danger/5 p-2.5 text-sm">
                      <div className="font-medium text-danger">{locale === "fa" ? a.label : a.labelEn}</div>
                      <div className="num text-xs text-muted">score {fmtNum(a.score * 100, locale)}%</div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-success">✓ {L("ناهنجاری یافت نشد", "No anomaly found")}</div>
                )}
                {uv.status === "SUSPECT" && (
                  <div className="mt-2 flex flex-col gap-2">
                    <Button variant="success" onClick={async () => { await act("uvss.decide", { id: uv.id, clear: true, note: "بازرسی فیزیکی انجام شد — مجاز" }); toast.success(L("تأیید شد", "Cleared")); }}>
                      {L("تأیید سالم پس از بازرسی", "Clear after inspection")}
                    </Button>
                    <Button variant="danger" onClick={async () => { await act("uvss.decide", { id: uv.id, clear: false, note: "ارجاع به حراست" }); toast.warn(L("ارجاع شد", "Escalated")); }}>
                      {L("ارجاع به حراست", "Escalate to security")}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
            <Card>
              <CardHeader title={L("اسکن‌های اخیر", "Recent scans")} />
              <ul className="max-h-80 divide-y divide-border overflow-auto">
                {uvss?.items.slice(0, 30).map((s) => (
                  <li key={s.id}>
                    <button onClick={() => setUvSel(s.id)} className="flex w-full items-center justify-between gap-2 px-3 py-2 text-start text-xs hover:bg-surface-2">
                      {veh(s.vehicleId) && <IranPlate plate={veh(s.vehicleId)!.plate} size="xs" />}
                      <span className="num">{fmtNum(s.referenceMatchPct, locale)}%</span>
                      <Badge tone={s.status === "CLEAR" || s.status === "CLEARED_BY_GUARD" ? "success" : "danger"}>{s.status}</Badge>
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}

      {tab === "position" && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader title={L("دوربین بالای باسکول ۱ با ماسک ROI", "Scale 1 overhead camera with ROI mask")} subtitle={L("تشخیص موقعیت تصویری — مکمل سنسورهای IR", "Vision-based positioning — complements IR beams")} />
            <div className="p-3">
              <CameraFeed view={visB ? "top" : "empty"} color={visB?.vehicleColor} loaded={visB ? visB.operation === "RECEIVE" : false} seed={77} label="CAM-B-TOP · ROI" at={live?.now} roi={visB ? (laneB?.positionOk ? "ok" : "bad") : undefined} />
            </div>
          </Card>
          <Card>
            <CardHeader title={L("سنسورهای IR و لودسل‌ها", "IR beams and load cells")} actions={visB ? <StatusPill status={laneB?.positionOk ? "PASS" : "HOLD"} label={laneB?.positionOk ? L("همه محورها روی باسکول", "All axles on deck") : L("چرخ خارج از ناحیه", "Wheel off deck")} /> : null} />
            <div className="p-3">
              <ScaleDeckTop occupied={!!visB} beams={laneB?.beams} positionOk={laneB?.positionOk} offsetPct={laneB?.truckOffsetPct} color={visB?.vehicleColor} className="w-full" />
              <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                {(laneB?.beams ?? [false, false, false, false]).map((b, i) => (
                  <div key={i} className={`rounded-lg p-2 ${!visB ? "bg-surface-2 text-muted" : b ? "bg-success/12 text-success" : "bg-danger/10 text-danger"}`}>
                    IR-{i + 1} {visB ? (b ? "✓" : "✗") : "—"}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-muted">{L("تا وقتی همه نواحی تأیید نشوند، دکمه ثبت وزن غیرفعال است و مانیتور راننده پیام «کمی جلو بروید» را نشان می‌دهد.", "Until every zone is confirmed, capture stays disabled and the driver display shows “move forward a little”.")}</p>
            </div>
          </Card>
        </div>
      )}

      {tab === "history" && (
        <Card>
          <CardHeader title={L("تاریخچه اسکن‌ها", "Scan history")} />
          <Table head={[L("نوع", "Type"), L("پلاک", "Plate"), L("زمان", "Time"), L("نتیجه", "Result"), L("کیفیت/تطابق", "Quality/match")]}>
            {[...(lidar?.items ?? []).slice(0, 20).map((s) => ({ t: "LiDAR", v: s.vehicleId, at: s.capturedAt, res: `${fmtNum(s.volumeM3, locale)} m³`, q: fmtPct(s.quality * 100, locale), bad: s.offCenterPct > 15 })), ...(uvss?.items ?? []).slice(0, 20).map((s) => ({ t: "UVSS", v: s.vehicleId, at: s.capturedAt, res: s.status, q: `${fmtNum(s.referenceMatchPct, locale)}%`, bad: s.status === "SUSPECT" }))]
              .sort((a, b) => b.at.localeCompare(a.at))
              .map((r, i) => (
                <tr key={i}>
                  <Td>
                    <Badge tone={r.t === "LiDAR" ? "info" : "primary"}>{r.t}</Badge>
                  </Td>
                  <Td>{veh(r.v) && <IranPlate plate={veh(r.v)!.plate} size="xs" />}</Td>
                  <Td className="num">{fmtDateTime(r.at, locale)}</Td>
                  <Td className={r.bad ? "text-danger" : ""}>{r.res}</Td>
                  <Td className="num">{r.q}</Td>
                </tr>
              ))}
          </Table>
        </Card>
      )}
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <ScanInner />
    </Suspense>
  );
}
