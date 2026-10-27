"use client";
import { Box } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Bars } from "@/components/charts";
import { IranPlate } from "@/components/domain/IranPlate";
import { LidarGantrySvg } from "@/components/hardware/Devices";
import { HeightMap, type CloudMode } from "@/components/hardware/heap";
import { Badge, Card, CardHeader, cx, KpiTile, Kv, PageHeader, Segmented, Skeleton, StatusPill, Table, Td } from "@/components/ui";
import type { LidarScan, Transaction } from "@/domain/types";
import { fmtDateTime, fmtKg, fmtNum, fmtPct } from "@/lib/format";
import { useData, useMasters } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";

const PointCloudViewer = dynamic(() => import("@/components/hardware/PointCloud"), { ssr: false, loading: () => <Skeleton className="h-[360px]" /> });

export default function LidarModulePage() {
  const L = useL();
  const locale = useLocale();
  const masters = useMasters();
  const { data } = useData<LidarScan>("lidarScans", { limit: 400, kind: "LOADED" }, 4000);
  const { data: txs } = useData<Transaction>("transactions", { limit: 3000 }, 15000);
  const [sel, setSel] = useState<string>();
  const [mode, setMode] = useState<CloudMode>("loaded");
  const txById = useMemo(() => new Map((txs?.items ?? []).map((t) => [t.id, t])), [txs]);
  const rows = useMemo(
    () =>
      (data?.items ?? []).map((s) => {
        const tx = s.transactionId ? txById.get(s.transactionId) : undefined;
        const mat = masters?.materials.find((m) => m.id === tx?.materialId);
        // signed deviation so the histogram shows under- vs over-estimation
        const dev = tx?.netKg && mat ? (100 * (s.volumeM3 * mat.densityKgM3 - tx.netKg)) / tx.netKg : null;
        return { s, tx, mat, dev, estKg: mat ? s.volumeM3 * mat.densityKgM3 : null };
      }),
    [data, txById, masters],
  );
  const cur = rows.find((r) => r.s.id === sel) ?? rows[0];
  const devs = rows.map((r) => r.dev).filter((x): x is number => x != null);
  const hist = [-30, -20, -12, -6, 0, 6, 12, 20, 30].map((b, i, a) => ({ b: i === 0 ? `<${b}` : `${a[i - 1]}…${b}`, n: devs.filter((d) => (i === 0 ? d < b : d >= a[i - 1] && d < b)).length }));
  const veh = masters?.vehicles.find((v) => v.id === cur?.s.vehicleId);
  return (
    <div>
      <PageHeader icon={<Box className="size-5" />} title={L("حجم‌سنجی LiDAR", "LiDAR volumetrics")} subtitle={L("اسکن سه‌بعدی بالای بار در لاین D؛ حجم و جرم همیشه «تخمینی» و فقط برای کنترل کیفیت — وزن قانونی از باسکول", "3D overhead scan at lane D; volume and mass are always “estimated” and only for QC — the legal weight comes from the scale")} />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
        <KpiTile label={L("اسکن بار", "Loaded scans")} value={fmtNum(rows.length, locale)} />
        <KpiTile label={L("میانگین حجم", "Avg volume")} value={fmtNum(rows.reduce((a, r) => a + r.s.volumeM3, 0) / (rows.length || 1), locale, { maximumFractionDigits: 1 })} unit="m³" tone="info" />
        <KpiTile label={L("با روکش", "Tarp covered")} value={fmtPct((100 * rows.filter((r) => r.s.covered).length) / (rows.length || 1), locale)} tone="success" />
        <KpiTile label={L("بار خارج از مرکز >۱۰٪", "Off-centre >10%")} value={fmtNum(rows.filter((r) => r.s.offCenterPct > 10).length, locale)} tone="warning" />
        <KpiTile label={L("مغایرت حجم/وزن >۱۲٪", "Vol/weight gap >12%")} value={fmtNum(devs.filter((d) => Math.abs(d) > 12).length, locale)} tone="danger" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader
            title={L("ابر نقاط سه‌بعدی", "3D point cloud")}
            subtitle={cur ? `${cur.s.id} · ${fmtDateTime(cur.s.capturedAt, locale)}` : undefined}
            actions={<Segmented options={[{ id: "loaded", label: L("پر", "Loaded") }, { id: "empty", label: L("خالی", "Empty") }, { id: "diff", label: L("تفاضل", "Diff") }]} value={mode} onChange={setMode} />}
          />
          <div className="p-3">{cur ? <PointCloudViewer seed={cur.s.seed} mode={mode} offCenter={cur.s.offCenterPct} /> : <Skeleton className="h-[360px]" />}</div>
          {cur && (
            <div className="grid gap-4 p-3 pt-0 md:grid-cols-[1fr_220px]">
              <div>
                <div className="mb-1 text-xs text-muted">{L("نقشه ارتفاع بار (نمای بالا)", "Load height map (top view)")}</div>
                <HeightMap seed={cur.s.seed} offCenter={cur.s.offCenterPct} className="w-full" />
              </div>
              <div className="flex flex-col gap-1 text-sm">
                {veh && <IranPlate plate={veh.plate} size="sm" />}
                <Kv k={L("حجم", "Volume")} v={<span className="num font-bold">{cur.s.volumeM3} m³</span>} />
                <Kv k={L("جرم تخمینی", "Est. mass")} v={<StatusPill status="ESTIMATED" label={fmtKg(cur.estKg, locale)} />} />
                <Kv k={L("وزن باسکول", "Scale net")} v={fmtKg(cur.tx?.netKg, locale)} />
                <Kv k={L("انحراف", "Deviation")} v={cur.dev == null ? "N/A" : <span className={cx("num font-bold", Math.abs(cur.dev) > 12 && "text-danger")}>{cur.dev > 0 ? "+" : ""}{cur.dev.toFixed(1)}%</span>} />
                <Kv k={L("بیشینه ارتفاع", "Peak height")} v={`${cur.s.peakHeightM} m`} />
                <Kv k={L("خارج از مرکز", "Off-centre")} v={`${cur.s.offCenterPct}%`} />
                <Kv k={L("روکش", "Tarp")} v={cur.s.covered ? "✓" : <Badge tone="warning">{L("ندارد", "No")}</Badge>} />
                <Kv k={L("کیفیت اسکن", "Scan quality")} v={fmtPct(cur.s.quality * 100, locale)} />
              </div>
            </div>
          )}
        </Card>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title={L("گنتری اسکنر — لاین D", "Scanner gantry — lane D")} />
            <div className="p-3">
              <LidarGantrySvg scanning truck={{ color: veh?.color, loaded: true, covered: cur?.s.covered }} className="w-full" />
            </div>
          </Card>
          <Card>
            <CardHeader title={L("توزیع انحراف حجم×چگالی از وزن", "Volume×density vs weight deviation")} subtitle={L("R31: بیش از ±۱۲٪ = بازبینی", "R31: beyond ±12% = review")} />
            <div className="p-3">
              <Bars data={hist} x="b" series={[{ key: "n", name: L("تعداد", "Count"), color: "#0891b2" }]} height={200} unit="%" />
            </div>
          </Card>
        </div>
      </div>
      <Card className="mt-4">
        <CardHeader title={L("اسکن‌ها", "Scans")} />
        {!data ? (
          <Skeleton className="m-4 h-64" />
        ) : (
          <Table head={[L("زمان", "Time"), L("تیکت", "Ticket"), L("ماده", "Material"), L("حجم m³", "Vol m³"), L("جرم تخمینی", "Est. mass"), L("خالص باسکول", "Scale net"), L("انحراف", "Dev."), L("خارج از مرکز", "Off-ctr"), L("روکش", "Tarp")]} dense>
            {rows.slice(0, 80).map((r) => (
              <tr key={r.s.id} onClick={() => setSel(r.s.id)} className={cx("cursor-pointer hover:bg-surface-2", cur?.s.id === r.s.id && "bg-primary/5")}>
                <Td className="num text-xs">{fmtDateTime(r.s.capturedAt, locale)}</Td>
                <Td>{r.tx ? <Link href={`/app/transactions/${r.tx.id}`} className="font-mono text-xs text-primary">{r.tx.ticketNo}</Link> : "—"}</Td>
                <Td className="text-xs">{r.mat ? (locale === "fa" ? r.mat.name : r.mat.nameEn) : "—"}</Td>
                <Td className="num">{r.s.volumeM3}</Td>
                <Td className="num text-muted">~{fmtKg(r.estKg, locale)}</Td>
                <Td className="num">{fmtKg(r.tx?.netKg, locale)}</Td>
                <Td className={cx("num", r.dev != null && Math.abs(r.dev) > 12 && "font-bold text-danger")}>{r.dev == null ? "N/A" : `${r.dev > 0 ? "+" : ""}${r.dev.toFixed(1)}%`}</Td>
                <Td className={cx("num", r.s.offCenterPct > 10 && "text-warning")}>{r.s.offCenterPct}%</Td>
                <Td>{r.s.covered ? "✓" : "—"}</Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
