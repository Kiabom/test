"use client";
import { Cpu, Play, RotateCcw, Terminal } from "lucide-react";
import { useState } from "react";
import { LiveDot } from "@/components/domain/indicators";
import { Badge, Button, Card, CardHeader, ConfirmDialog, cx, PageHeader, Segmented, toast } from "@/components/ui";
import { DEVICE_TYPE, ERRORS, lbl } from "@/i18n/labels";
import { fmtNum, fmtTime } from "@/lib/format";
import { act, ActionError, useLive, useMasters } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";

/** Scenario catalog — mirrors docs/prompts/spec/MOCK_DATA.md */
const SCENARIOS: { code: string; fa: string; en: string; dfa: string; den: string; tone: "success" | "warning" | "danger" | "info" }[] = [
  { code: "S-NORMAL", fa: "سفر عادی فروش", en: "Normal sales trip", dfa: "ورود → توزین خالی → بارگیری → توزین پر → تیکت → QR خروج", den: "Entry → tare → loading → gross → ticket → exit QR", tone: "success" },
  { code: "S-INBOUND", fa: "ورود کامیون پر (خرید)", en: "Inbound loaded (purchase)", dfa: "Gross→Tare؛ تخلیه در سایت", den: "Gross→Tare; unloads on site", tone: "success" },
  { code: "S-MISMATCH", fa: "مغایرت پلاک و RFID", en: "Plate/RFID mismatch", dfa: "تگ RFID متعلق به خودرو دیگری است → HOLD", den: "RFID tag belongs to another vehicle → HOLD", tone: "danger" },
  { code: "S-LOWCONF", fa: "اطمینان پایین ANPR", en: "Low ANPR confidence", dfa: "پلاک کثیف/گردوخاک → بازبینی دستی", den: "Dirty plate/dust → manual review", tone: "warning" },
  { code: "S-UNKNOWN", fa: "خودروی ناشناس", en: "Unknown vehicle", dfa: "پلاک در سامانه نیست → ثبت مهمان یا رد", den: "Plate not registered → guest or reject", tone: "warning" },
  { code: "S-OVERWEIGHT", fa: "اضافه‌بار", en: "Overweight", dfa: "ناخالص بیش از GVW مجاز + بار خارج از مرکز", den: "Gross above max GVW + off-centre load", tone: "danger" },
  { code: "S-UNSTABLE", fa: "وزن ناپایدار", en: "Unstable weight", dfa: "نوسان طولانی indicator → ثبت ممکن نیست", den: "Long indicator motion → capture blocked", tone: "warning" },
  { code: "S-POSITION", fa: "چرخ خارج از باسکول", en: "Wheel off the deck", dfa: "پرتو IR قطع/ROI → توقف تا اصلاح موقعیت", den: "IR beam/ROI → wait until repositioned", tone: "warning" },
  { code: "S-PERMIT-EXP", fa: "حواله منقضی", en: "Expired permit", dfa: "حواله تاریخ گذشته → رد در دروازه", den: "Expired permit → rejected at the gate", tone: "danger" },
  { code: "S-OVERDRAW", fa: "برداشت بیش از سهمیه", en: "Quota overdraw", dfa: "خالص بیش از مانده حواله → HOLD خروج", den: "Net above permit balance → exit hold", tone: "danger" },
  { code: "S-QR-REUSE", fa: "استفاده مجدد QR خروج", en: "Exit QR reuse", dfa: "اسکن دوم یک مجوز مصرف‌شده → رد و هشدار امنیتی", den: "Second scan of a consumed permit → reject + security alert", tone: "danger" },
  { code: "S-TAILGATE", fa: "تعقیب (Tailgating)", en: "Tailgating", dfa: "دو خودرو با یک بار باز شدن راهبند", den: "Two vehicles through one barrier opening", tone: "danger" },
  { code: "S-UVSS", fa: "مورد مشکوک زیر خودرو", en: "UVSS suspect", dfa: "اسکن زیر خودرو شیء ناشناس → بازرسی حراست", den: "Under-vehicle scan finds an object → guard inspection", tone: "danger" },
  { code: "S-OFFLINE", fa: "قطع WAN", en: "WAN outage", dfa: "Edge آفلاین ادامه می‌دهد؛ صف همگام‌سازی پر می‌شود", den: "Edge keeps working offline; sync queue grows", tone: "info" },
  { code: "S-CAL-EXP", fa: "انقضای گواهی کالیبراسیون", en: "Calibration expired", dfa: "باسکول ۲ قفل legal می‌شود", den: "Scale 2 goes into legal lock", tone: "danger" },
  { code: "S-CAL-RESTORE", fa: "تمدید گواهی", en: "Restore calibration", dfa: "گواهی تمدید و قفل برداشته می‌شود", den: "Certificate renewed and lock lifted", tone: "success" },
  { code: "S-INDICATOR-DOWN", fa: "قطع indicator", en: "Indicator down", dfa: "فریم RS-232 قطع → فقط وزن دستی با دو امضا", den: "No RS-232 frames → manual weight with two signatures only", tone: "danger" },
];

export default function SimulatorPage() {
  const L = useL();
  const locale = useLocale();
  const live = useLive();
  const masters = useMasters();
  const [reset, setReset] = useState(false);
  const run = async (type: string, payload: Record<string, unknown>, ok: string) => {
    try {
      await act(type, payload);
      toast.success(ok);
    } catch (e) {
      toast.error(e instanceof ActionError ? lbl(ERRORS, e.code, locale) : String(e));
    }
  };
  const devStatus = new Map(live?.devices.map((d) => [d.id, d.status]) ?? []);
  const keyDevices = (masters?.devices ?? []).filter((d) => ["INDICATOR", "CAMERA_ANPR", "RFID_READER", "PLC", "LIDAR", "UVSS", "PRINTER", "LED_DISPLAY"].includes(d.type)).slice(0, 18);
  return (
    <div>
      <PageHeader
        icon={<Cpu className="size-5" />}
        title={L("کنسول شبیه‌ساز", "Simulator console")}
        subtitle={L("همه سخت‌افزارها شبیه‌سازی‌اند؛ هیچ فرمان واقعی به PLC ارسال نمی‌شود. سناریوها روی کامیون بعدی اعمال می‌شوند.", "All hardware is simulated; no real PLC command is ever sent. Scenarios apply to the next arriving truck.")}
        actions={
          <Button variant="danger" onClick={() => setReset(true)}>
            <RotateCcw className="size-4" /> {L("بازنشانی داده", "Reset data")}
          </Button>
        }
      />
      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="mb-2 text-sm font-semibold">{L("سرعت شبیه‌سازی", "Simulation speed")}</div>
          <div className="flex items-center gap-3">
            <input type="range" min={1} max={20} value={live?.speed ?? 1} onChange={(e) => run("sim.speed", { speed: Number(e.target.value) }, L("سرعت تغییر کرد", "Speed changed"))} className="flex-1 accent-[var(--primary)]" />
            <span className="num w-12 text-center text-2xl font-black">{fmtNum(live?.speed ?? 1, locale)}×</span>
          </div>
          <div className="mt-2 flex gap-1">
            {[1, 2, 5, 10].map((s) => (
              <Button key={s} size="sm" variant={live?.speed === s ? "primary" : "ghost"} onClick={() => run("sim.speed", { speed: s }, `${s}×`)}>
                {s}×
              </Button>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <div className="mb-2 text-sm font-semibold">{L("حالت", "Mode")}</div>
          <Segmented
            size="md"
            options={[
              { id: "AUTO", label: L("خودکار (بازیگران مجازی)", "Auto (virtual actors)") },
              { id: "MANUAL", label: L("دستی (شما تصمیم می‌گیرید)", "Manual (you decide)") },
            ]}
            value={live?.mode ?? "AUTO"}
            onChange={(m) => run("sim.mode", { mode: m }, m)}
          />
          <div className="mt-2 text-xs text-muted">{L("در حالت دستی، توقف‌ها و مغایرت‌ها منتظر تصمیم اپراتور/حراست می‌مانند و توزین با دکمه Capture انجام می‌شود.", "In manual mode holds and mismatches wait for an operator/guard decision and weighing needs the Capture button.")}</div>
        </Card>
        <Card className="p-4">
          <div className="mb-2 text-sm font-semibold">{L("وضعیت", "Status")}</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="flex items-center gap-2">
              <LiveDot on={!!live} /> SSE
            </span>
            <span className="flex items-center gap-2">
              <LiveDot on={live?.wanOnline} tone={live?.wanOnline ? "success" : "danger"} /> WAN
            </span>
            <span>
              {L("داخل سایت", "On site")}: <b className="num">{fmtNum(live?.activeIds.length ?? 0, locale)}</b>
            </span>
            <span>
              {L("هشدار باز", "Open alerts")}: <b className="num">{fmtNum(live?.openAlerts ?? 0, locale)}</b>
            </span>
            <span>
              {L("صف همگام‌سازی", "Sync queue")}: <b className="num">{fmtNum(live?.syncQueue ?? 0, locale)}</b>
            </span>
            <span>
              rev <b className="num">{live?.revision ?? 0}</b>
            </span>
          </div>
        </Card>
      </div>
      <Card className="mb-4">
        <CardHeader title={L("سناریوها", "Scenarios")} subtitle={L("برای دیدن نتیجه، اتاق کنترل یا مانیتور راننده را در زبانه دیگر باز کنید", "Open the control room or driver display in another tab to watch the result")} />
        <div className="grid gap-3 p-3 sm:grid-cols-2 xl:grid-cols-4">
          {SCENARIOS.map((s) => (
            <div key={s.code} className={cx("flex flex-col gap-2 rounded-xl border p-3", s.tone === "danger" ? "border-danger/30" : s.tone === "warning" ? "border-warning/30" : s.tone === "success" ? "border-success/30" : "border-info/30")}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-muted">{s.code}</span>
                <Badge tone={s.tone}>{s.tone === "danger" ? L("کنترل", "Control") : s.tone === "warning" ? L("بازبینی", "Review") : s.tone === "success" ? L("عادی", "Normal") : L("سیستم", "System")}</Badge>
              </div>
              <div className="font-semibold">{L(s.fa, s.en)}</div>
              <div className="flex-1 text-xs text-muted">{L(s.dfa, s.den)}</div>
              <Button size="sm" variant="primary" onClick={() => run("sim.scenario", { code: s.code }, L(`سناریو ${s.code} اجرا شد`, `Scenario ${s.code} started`))}>
                <Play className="size-3.5" /> {L("اجرا", "Run")}
              </Button>
            </div>
          ))}
        </div>
      </Card>
      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <Card>
          <CardHeader title={L("قطع/وصل دستگاه‌ها", "Toggle devices")} />
          <div className="grid gap-2 p-3 sm:grid-cols-2">
            {keyDevices.map((d) => {
              const st = devStatus.get(d.id) ?? d.status;
              return (
                <button key={d.id} onClick={() => run("device.toggle", { id: d.id }, `${d.id} ${st === "OFFLINE" ? "ON" : "OFF"}`)} className="flex items-center justify-between gap-2 rounded-lg border border-border p-2 text-start text-sm hover:bg-surface-2">
                  <span>
                    <span className="font-mono text-xs text-muted">{d.id}</span> {lbl(DEVICE_TYPE, d.type, locale)}
                  </span>
                  <Badge tone={st === "ONLINE" ? "success" : st === "DEGRADED" ? "warning" : "offline"}>{st}</Badge>
                </button>
              );
            })}
          </div>
        </Card>
        <Card className="bg-slate-950 text-slate-200">
          <CardHeader title={<span className="flex items-center gap-2 text-slate-100"><Terminal className="size-4" /> {L("لاگ خام رویدادها", "Raw event log")}</span>} className="border-slate-800" />
          <div className="h-[420px] overflow-auto p-3 font-mono text-[11px] leading-5" dir="ltr">
            {[...(live?.log ?? [])].reverse().map((l, i) => (
              <div key={i} className={cx(l.level === "error" ? "text-red-400" : l.level === "warn" ? "text-amber-300" : l.level === "device" ? "text-sky-300" : "text-slate-300")}>
                <span className="text-slate-500">{fmtTime(l.at, "en", true)}</span> <span className="text-slate-400">[{l.source}]</span> {l.text}
              </div>
            ))}
          </div>
        </Card>
      </div>
      <ConfirmDialog open={reset} onClose={() => setReset(false)} needReason={false} danger title={L("بازنشانی همه داده‌ها؟", "Reset all data?")} description={L("پایگاه داده درون‌حافظه‌ای با seed قطعی از نو ساخته می‌شود.", "The in-memory database is rebuilt from the deterministic seed.")} onConfirm={() => run("sim.reset", {}, L("داده بازنشانی شد", "Data reset"))} />
    </div>
  );
}
