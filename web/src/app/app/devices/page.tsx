"use client";
import { CalendarClock, Cloud, CloudOff, Cpu, FileBadge2, HeartPulse, Lock, Plus, Radio, Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import { Lines } from "@/components/charts";
import { LiveDot } from "@/components/domain/indicators";
import { DeviceArt } from "@/components/hardware/Devices";
import { Badge, Button, Card, CardHeader, cx, Dialog, Field, Input, Kv, PageHeader, Progress, Select, Skeleton, Table, Tabs, Td, toast } from "@/components/ui";
import type { CalibrationRecord, Device, LoadCellSample, OutboxMessage } from "@/domain/types";
import { DEVICE_TYPE, ERRORS, lbl } from "@/i18n/labels";
import { fmtDate, fmtNum, fmtRelative, shortHash } from "@/lib/format";
import { act, ActionError, useData, useLive, useMasters, useNow } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";

type Tab = "registry" | "health" | "calibration" | "edge";
const statusTone = (s: string) => (s === "ONLINE" ? "success" : s === "DEGRADED" ? "warning" : "offline") as "success" | "warning" | "offline";

export default function DevicesPage() {
  const L = useL();
  const locale = useLocale();
  const now = useNow(2000);
  const live = useLive();
  const masters = useMasters();
  const [tab, setTab] = useState<Tab>("registry");
  const [type, setType] = useState("");
  const [calDlg, setCalDlg] = useState<string | null>(null);
  const [cert, setCert] = useState("");
  const { data: cells } = useData<LoadCellSample>("loadCells", { limit: 100 }, 5000);
  const { data: outbox } = useData<OutboxMessage>("outbox", { limit: 300 }, 3000);
  const devices = useMemo(() => {
    const st = new Map(live?.devices.map((d) => [d.id, d]) ?? []);
    return (masters?.devices ?? []).map((d) => ({ ...d, status: (st.get(d.id)?.status ?? d.status) as Device["status"], lastHeartbeatAt: st.get(d.id)?.lastHeartbeatAt ?? d.lastHeartbeatAt }));
  }, [masters, live]);
  const online = devices.filter((d) => d.status === "ONLINE").length;
  const run = async (t: string, p: Record<string, unknown>, ok: string) => {
    try {
      await act(t, p);
      toast.success(ok);
    } catch (e) {
      toast.error(e instanceof ActionError ? lbl(ERRORS, e.code, locale) : String(e));
    }
  };
  const testRead = (d: Device) => {
    if (d.status === "OFFLINE") return toast.error(L(`${d.name}: بدون پاسخ (timeout 3s)`, `${d.name}: no response (3 s timeout)`));
    const lane = live?.lanes.find((l) => masters?.lanes.find((x) => x.id === d.laneId)?.code === l.code);
    const msg: Partial<Record<Device["type"], string>> = {
      INDICATOR: lane?.rawFrame ?? "ST,GS,+0000000kg",
      CAMERA_ANPR: `frame 1920×1080 @25fps · ANPR v4.2 · ${Math.round(40 + Math.random() * 20)} ms`,
      RFID_READER: `EPC E280-1160-6000-02${Math.floor(Math.random() * 90 + 10)} · RSSI -${Math.floor(48 + Math.random() * 12)} dBm`,
      PLC: "DI 0b0110 · DO 0b0001 · interlock OK",
      LIDAR: `frame 288k pts · 10 Hz · ${(Math.random() * 0.3 + 0.1).toFixed(2)}% dropped`,
      UVSS: "line-scan 4096 px · 30 km/h max · lamp OK",
      PRINTER: "paper OK · head 41°C",
    };
    toast.info(`${d.name}: ${msg[d.type] ?? "ACK 200 OK"}`);
  };
  const cals = masters?.calibrations ?? [];
  const scaleCal = (scaleId: string) => cals.filter((c) => c.scaleId === scaleId).sort((a, b) => b.validUntil.localeCompare(a.validUntil))[0];
  return (
    <div>
      <PageHeader
        icon={<Wrench className="size-5" />}
        title={L("تجهیزات و سلامت", "Devices & health")}
        subtitle={L("رجیستری دستگاه، heartbeat، سلامت لودسل، کالیبراسیون و قفل legal، و Edge محلی", "Device registry, heartbeats, load-cell health, calibration & legal lock, and the local edge")}
        actions={<Badge tone={online === devices.length ? "success" : "warning"}>{fmtNum(online, locale)}/{fmtNum(devices.length, locale)} {L("آنلاین", "online")}</Badge>}
      />
      <Tabs
        className="mb-3"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "registry", label: L("رجیستری دستگاه‌ها", "Device registry"), icon: <Cpu className="size-4" /> },
          { id: "health", label: L("سلامت باسکول و لودسل", "Scale & load-cell health"), icon: <HeartPulse className="size-4" /> },
          { id: "calibration", label: L("کالیبراسیون", "Calibration"), icon: <FileBadge2 className="size-4" /> },
          { id: "edge", label: L("Edge و همگام‌سازی", "Edge & sync"), icon: <Radio className="size-4" /> },
        ]}
      />
      {!masters ? (
        <Skeleton className="h-96" />
      ) : tab === "registry" ? (
        <Card>
          <CardHeader
            title={L("دستگاه‌ها", "Devices")}
            actions={
              <Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">{L("همه انواع", "All types")}</option>
                {[...new Set(devices.map((d) => d.type))].map((t) => (
                  <option key={t} value={t}>
                    {lbl(DEVICE_TYPE, t, locale)}
                  </option>
                ))}
              </Select>
            }
          />
          <Table head={["", L("شناسه", "ID"), L("نام", "Name"), L("نوع", "Type"), L("لاین", "Lane"), L("مدل", "Model"), L("پروتکل", "Protocol"), "IP", L("فریم‌ور", "Firmware"), "Heartbeat", L("وضعیت", "Status"), ""]} dense>
            {devices.filter((d) => !type || d.type === type).map((d) => (
              <tr key={d.id} className="hover:bg-surface-2">
                <Td>
                  <DeviceArt type={d.type} status={d.status} className="h-9 w-12" />
                </Td>
                <Td className="font-mono text-xs">{d.id}</Td>
                <Td className="text-sm">{d.name}</Td>
                <Td className="text-xs">{lbl(DEVICE_TYPE, d.type, locale)}</Td>
                <Td>{masters.lanes.find((l) => l.id === d.laneId)?.code ?? "—"}</Td>
                <Td className="text-xs">{d.model}</Td>
                <Td className="font-mono text-[11px]">{d.protocol}</Td>
                <Td className="font-mono text-[11px] ltr">{d.ip}</Td>
                <Td className="font-mono text-[11px]">{d.firmware}</Td>
                <Td className={cx("num text-xs", now - new Date(d.lastHeartbeatAt).getTime() > 60000 && "text-danger")}>{fmtRelative(d.lastHeartbeatAt, locale, now)}</Td>
                <Td>
                  <span className="flex items-center gap-1.5">
                    <LiveDot on={d.status !== "OFFLINE"} tone={d.status === "ONLINE" ? "success" : d.status === "DEGRADED" ? "warning" : "danger"} />
                    <Badge tone={statusTone(d.status)}>{d.status}</Badge>
                  </span>
                </Td>
                <Td>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => testRead(d)}>
                      {L("تست", "Test")}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => run("device.toggle", { id: d.id }, L("وضعیت تغییر کرد (شبیه‌ساز)", "Toggled (simulator)"))}>
                      {d.status === "OFFLINE" ? L("روشن", "On") : L("خاموش", "Off")}
                    </Button>
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
      ) : tab === "health" ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {masters.scales.map((s) => {
            const sc = (cells?.items ?? []).filter((c) => c.scaleId === s.id).sort((a, b) => a.cellNo - b.cellNo);
            const cal = scaleCal(s.id);
            const days = cal ? Math.round((new Date(cal.validUntil).getTime() - now) / 864e5) : -1;
            return (
              <Card key={s.id}>
                <CardHeader
                  title={locale === "fa" ? s.name : s.nameEn}
                  subtitle={`${s.indicatorModel} · ${fmtNum(s.capacityKg / 1000, locale)} t · ${s.loadCells} ${L("لودسل", "cells")}`}
                  actions={
                    <div className="flex gap-1">
                      {live?.scales.find((x) => x.id === s.id)?.status === "LOCKED" && (
                        <Badge tone="danger">
                          <Lock className="size-3" /> {L("قفل legal", "Legal lock")}
                        </Badge>
                      )}
                      <Badge tone={days < 0 ? "danger" : days < 30 ? "warning" : "success"}>{days < 0 ? L("گواهی منقضی", "Cert expired") : L(`${fmtNum(days, locale)} روز تا انقضا`, `${days} days left`)}</Badge>
                    </div>
                  }
                />
                {!s.diagnosticsSupported ? (
                  <div className="m-4 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted">
                    {L("این indicator تشخیص سلامت تک‌تک لودسل‌ها را پشتیبانی نمی‌کند — داده N/A است (نه صفر).", "This indicator doesn't expose per-cell diagnostics — data is N/A (not zero).")}
                    <div className="mt-2">
                      <Badge tone="offline">N/A</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="mb-2 text-xs text-muted">{L("نقشه حرارتی سهم بار / انحراف — نمای بالای باسکول", "Load-share / drift heatmap — top view of the deck")}</div>
                    <div className="relative rounded-xl border-2 border-dashed border-border bg-surface-2 p-3">
                      <div className="grid grid-cols-4 gap-2">
                        {[0, 1].map((row) =>
                          sc.filter((_, i) => i % 2 === row).map((c) => (
                            <div key={c.cellNo} className={cx("rounded-lg p-2 text-center text-xs", c.status === "OK" ? "bg-success/15" : c.status === "WARN" ? "bg-warning/25 ring-2 ring-warning" : "bg-danger/25 ring-2 ring-danger")}>
                              <div className="font-bold">LC{c.cellNo}</div>
                              <div className="num">{fmtNum(c.loadSharePct, locale, { maximumFractionDigits: 1 })}%</div>
                              <div className={cx("num text-[10px]", Math.abs(c.driftKg) > 15 && "font-bold text-danger")}>Δ {c.driftKg} kg</div>
                            </div>
                          )),
                        )}
                      </div>
                    </div>
                    <div className="mt-3">
                      <Lines
                        height={160}
                        data={(sc[0]?.history ?? []).map((_, i) => Object.fromEntries([["d", i - (sc[0]?.history.length ?? 0) + 1], ...sc.map((c) => [`c${c.cellNo}`, c.history[i]])]))}
                        x="d"
                        series={sc.map((c, i) => ({ key: `c${c.cellNo}`, name: `LC${c.cellNo}`, color: c.status === "OK" ? ["#1273a6", "#168567", "#0891b2", "#64748b", "#7c3aed", "#94a3b8", "#0f766e", "#334155"][i % 8] : "#b42335", dashed: c.status === "OK" }))}
                        unit="kg"
                      />
                      <div className="text-[11px] text-muted">{L("drift صفر هر لودسل در ۳۰ روز — آستانه هشدار R29: ±۱۵ kg", "Per-cell zero drift over 30 days — R29 threshold ±15 kg")}</div>
                    </div>
                    <Table head={[L("لودسل", "Cell"), L("صفر", "Zero"), "Drift", L("نویز", "Noise"), "°C", "V", L("وضعیت", "Status")]} dense>
                      {sc.map((c) => (
                        <tr key={c.cellNo}>
                          <Td>LC{c.cellNo}</Td>
                          <Td className="num">{c.zeroKg}</Td>
                          <Td className="num">{c.driftKg}</Td>
                          <Td className="num">{c.noiseKg}</Td>
                          <Td className="num">{c.temperatureC}</Td>
                          <Td className="num">{c.voltage}</Td>
                          <Td>
                            <Badge tone={c.status === "OK" ? "success" : c.status === "WARN" ? "warning" : "danger"}>{c.status}</Badge>
                          </Td>
                        </tr>
                      ))}
                    </Table>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : tab === "calibration" ? (
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            {masters.scales.map((s) => {
              const cal = scaleCal(s.id);
              const total = cal ? new Date(cal.validUntil).getTime() - new Date(cal.calibratedAt).getTime() : 1;
              const left = cal ? new Date(cal.validUntil).getTime() - now : 0;
              const days = Math.round(left / 864e5);
              return (
                <Card key={s.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold">
                      <CalendarClock className="size-5 text-primary" /> {locale === "fa" ? s.name : s.nameEn}
                    </div>
                    <Button size="sm" variant="primary" onClick={() => { setCalDlg(s.id); setCert(""); }}>
                      <Plus className="size-4" /> {L("ثبت گواهی جدید", "Add certificate")}
                    </Button>
                  </div>
                  {cal ? (
                    <>
                      <div className="mt-3 flex items-end justify-between">
                        <div>
                          <div className="font-mono text-sm">{cal.certificateNo}</div>
                          <div className="text-xs text-muted">{cal.issuer}</div>
                        </div>
                        <div className={cx("num text-3xl font-black", days < 0 ? "text-danger" : days < 30 ? "text-warning" : "text-success")}>
                          {fmtNum(days, locale)} <span className="text-sm font-normal">{L("روز", "days")}</span>
                        </div>
                      </div>
                      <Progress className="mt-2" value={Math.max(0, (left / total) * 100)} tone={days < 0 ? "danger" : days < 30 ? "warning" : "success"} />
                      <div className="mt-2 grid grid-cols-2 gap-x-4 text-xs">
                        <Kv k={L("تاریخ کالیبراسیون", "Calibrated")} v={fmtDate(cal.calibratedAt, locale)} />
                        <Kv k={L("اعتبار تا", "Valid until")} v={fmtDate(cal.validUntil, locale)} />
                        <Kv k={L("حداکثر خطا", "Max error")} v={`±${cal.maxErrorKg} kg`} />
                        <Kv k={L("hash سند", "Doc hash")} v={shortHash(cal.documentHash)} mono />
                      </div>
                      <Table head={[L("وزنه مرجع", "Reference"), L("قرائت", "Reading"), L("خطا", "Error")]} dense>
                        {cal.testPoints.map((t) => (
                          <tr key={t.refKg}>
                            <Td className="num">{fmtNum(t.refKg, locale)}</Td>
                            <Td className="num">{fmtNum(t.readKg, locale)}</Td>
                            <Td className={cx("num", Math.abs(t.errorKg) > cal.maxErrorKg && "text-danger")}>{t.errorKg > 0 ? "+" : ""}{t.errorKg}</Td>
                          </tr>
                        ))}
                      </Table>
                      {days < 0 && <div className="mt-2 rounded-lg bg-danger/10 p-2 text-xs text-danger">{L("گواهی منقضی است: توزین تجاری روی این باسکول قفل است (R11/کنترل ۰۲).", "Certificate expired: legal-for-trade weighing on this scale is locked (R11 / control 02).")}</div>}
                    </>
                  ) : (
                    <div className="mt-3 text-sm text-danger">{L("گواهی ثبت نشده", "No certificate")}</div>
                  )}
                </Card>
              );
            })}
          </div>
          <Card>
            <CardHeader title={L("تاریخچه گواهی‌ها", "Certificate history")} />
            <Table head={[L("باسکول", "Scale"), L("شماره گواهی", "Certificate"), L("صادرکننده", "Issuer"), L("تاریخ", "Date"), L("اعتبار تا", "Valid until"), "hash"]} dense>
              {[...cals].sort((a: CalibrationRecord, b: CalibrationRecord) => b.calibratedAt.localeCompare(a.calibratedAt)).map((c) => (
                <tr key={c.id}>
                  <Td>{c.scaleId}</Td>
                  <Td className="font-mono text-xs">{c.certificateNo}</Td>
                  <Td className="text-xs">{c.issuer}</Td>
                  <Td className="num text-xs">{fmtDate(c.calibratedAt, locale)}</Td>
                  <Td className={cx("num text-xs", new Date(c.validUntil).getTime() < now && "text-danger")}>{fmtDate(c.validUntil, locale)}</Td>
                  <Td className="font-mono text-[10px]">{shortHash(c.documentHash)}</Td>
                </tr>
              ))}
            </Table>
          </Card>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className={cx("grid size-14 place-items-center rounded-2xl", live?.wanOnline ? "bg-success/15 text-success" : "bg-danger/15 text-danger")}>{live?.wanOnline ? <Cloud className="size-7" /> : <CloudOff className="size-7" />}</div>
              <div>
                <div className="font-bold">{live?.wanOnline ? L("اتصال WAN برقرار", "WAN online") : L("WAN قطع — Edge در حالت آفلاین", "WAN down — edge running offline")}</div>
                <div className="text-xs text-muted">EDGE-01 · Ubuntu 22.04 · Docker · {L("بافر ماندگار SQLite", "durable SQLite buffer")}</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-surface-2 p-3 text-center">
                <div className="text-xs text-muted">{L("صف همگام‌سازی", "Sync queue")}</div>
                <div className="num text-3xl font-black">{fmtNum(live?.syncQueue ?? 0, locale)}</div>
              </div>
              <div className="rounded-xl bg-surface-2 p-3 text-center">
                <div className="text-xs text-muted">{L("ناموفق / dead-letter", "Failed / dead-letter")}</div>
                <div className="num text-3xl font-black text-danger">{fmtNum((outbox?.items ?? []).filter((m) => m.status === "FAILED" || m.status === "DEAD").length, locale)}</div>
              </div>
            </div>
            <Button className="mt-4 w-full" variant={live?.wanOnline ? "danger" : "success"} onClick={() => run("sim.scenario", { code: live?.wanOnline ? "S-OFFLINE" : "S-ONLINE" }, L("سناریو اجرا شد", "Scenario started"))}>
              {live?.wanOnline ? L("شبیه‌سازی قطع WAN", "Simulate WAN outage") : L("وصل کردن WAN", "Restore WAN")}
            </Button>
            <div className="mt-3 text-[11px] text-muted">{L("در قطعی، توزین و دروازه محلی ادامه می‌دهند؛ رویدادها با کلید idempotency بعداً بدون تکرار ارسال می‌شوند. راهبند هرگز به‌خاطر قطع شبکه باز نمی‌شود.", "During an outage, weighing and gates keep working locally; events are sent later without duplicates using idempotency keys. Barriers never open because of a network failure.")}</div>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader title={L("سرویس‌های Edge", "Edge services")} />
            <Table head={[L("سرویس", "Service"), L("وظیفه", "Role"), L("وضعیت", "Status"), L("تأخیر", "Latency")]} dense>
              {[
                ["indicator-agent", L("خواندن RS-232/TCP، تشخیص پایداری، فریم خام", "RS-232/TCP read, stability, raw frame")],
                ["anpr-worker", L("پلاک‌خوانی و ارسال read با confidence", "ANPR reads with confidence")],
                ["rfid-bridge", L("خواندن EPC و RSSI از ریدر UHF", "EPC & RSSI from UHF reader")],
                ["plc-gateway", L("درخواست باز شدن و دریافت ACK از PLC", "Open request & PLC ACK")],
                ["evidence-store", L("ذخیره تصویر و SHA-256", "Image store & SHA-256")],
                ["sync-outbox", L("ارسال idempotent به سرور مرکزی/ERP", "Idempotent sync to HQ/ERP")],
                ["display-driver", L("پیام مانیتور راننده و تابلو LED", "Driver display & LED board")],
              ].map(([n, r], i) => (
                <tr key={n}>
                  <Td className="font-mono text-xs">{n}</Td>
                  <Td className="text-xs">{r}</Td>
                  <Td>
                    <Badge tone={n === "sync-outbox" && !live?.wanOnline ? "warning" : "success"}>{n === "sync-outbox" && !live?.wanOnline ? "BUFFERING" : "RUNNING"}</Badge>
                  </Td>
                  <Td className="num text-xs">{8 + i * 3} ms</Td>
                </tr>
              ))}
            </Table>
          </Card>
        </div>
      )}
      <Dialog
        open={!!calDlg}
        onClose={() => setCalDlg(null)}
        title={L("ثبت گواهی کالیبراسیون", "Add calibration certificate")}
        footer={
          <Button
            variant="primary"
            onClick={async () => {
              await run("calibration.add", { scaleId: calDlg, certificateNo: cert || undefined }, L("گواهی ثبت شد؛ قفل legal برداشته شد", "Certificate saved; legal lock lifted"));
              setCalDlg(null);
            }}
          >
            {L("ثبت", "Save")}
          </Button>
        }
      >
        <div className="flex flex-col gap-3">
          <Field label={L("شماره گواهی", "Certificate no.")} hint={L("خالی = شماره نمونه", "Empty = sample number")}>
            <Input value={cert} onChange={(e) => setCert(e.target.value)} className="font-mono ltr" />
          </Field>
          <div className="rounded-lg bg-surface-2 p-3 text-xs text-muted">{L("نقاط آزمون ۰ تا ۸۰ تن با خطای صفر ثبت می‌شود و اعتبار یک‌ساله است (نمونه).", "Test points 0–80 t are recorded with zero error and one-year validity (sample).")}</div>
        </div>
      </Dialog>
    </div>
  );
}
