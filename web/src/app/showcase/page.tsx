"use client";
import { BookOpen, Camera, DoorOpen, FileText, GalleryHorizontalEnd, Gauge, MessageSquareText, Monitor, Presentation, RotateCcw, ScanLine, ShieldCheck, Smartphone, Truck, Wrench } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { origin, Qr } from "@/components/domain/codes";
import { IranPlate } from "@/components/domain/IranPlate";
import { TrafficLight } from "@/components/domain/indicators";
import { CameraFeed } from "@/components/hardware/CameraFeed";
import { UvssImage } from "@/components/hardware/Devices";
import { HeightMap } from "@/components/hardware/heap";
import { DeviceFrame } from "@/components/present/DeviceFrame";
import { Logo } from "@/components/shell/Logo";
import { Badge, Button, Card, CardHeader, cx, Kv, Skeleton, Tabs, toast } from "@/components/ui";
import { guidanceSamples } from "@/domain/driverGuidance";
import type { LidarScan, OutboxMessage, UvssScan } from "@/domain/types";
import { fmtDate, fmtTime } from "@/lib/format";
import { act, useData, useLive, useMasters, useView } from "@/lib/live";
import { useL, useLocale, usePrefs } from "@/lib/prefs";
import type { ShowcaseRefs } from "@/server/store";

type Refs = ShowcaseRefs & { scene: string };
interface Item {
  shot: string;
  fa: string;
  en: string;
  dfa: string;
  den: string;
  href: (r: Refs) => string | undefined;
  example?: [string, string];
}
interface Group {
  id: string;
  fa: string;
  en: string;
  icon: React.ReactNode;
  items: Item[];
}

const GROUPS: Group[] = [
  {
    id: "driver",
    fa: "راننده",
    en: "Driver",
    icon: <Smartphone className="size-5" />,
    items: [
      { shot: "driver-trip-mobile", fa: "پورتال موبایل راننده", en: "Driver mobile portal", dfa: "لینک پیامکی: همه مراحل سفر، دستور الان، وزن زنده، رسید و QR خروج.", den: "SMS link: every step of the trip, the instruction right now, live weight, receipt and exit QR.", href: (r) => r.driverTokens.scale1 && `/d/${r.driverTokens.scale1}`, example: ["کامیون روی باسکول ۱", "Truck on scale 1"] },
      { shot: "driver-map-mobile", fa: "نقشه و مسیریابی GPS", en: "Map & GPS navigation", dfa: "ایستگاه بعدی روی نقشه معدن و تحویل مسیر به نشان/بلد/گوگل/Waze.", den: "Next station on the mine map and hand-off to Neshan/Balad/Google/Waze.", href: (r) => r.driverTokens.loading && `/d/${r.driverTokens.loading}?tab=map`, example: ["کامیون در حال بارگیری", "Truck being loaded"] },
      { shot: "driver-guide", fa: "راهنمای راننده", en: "Driver guide", dfa: "همه مراحل، نقشه ایستگاه‌ها، قوانین، چراغ‌ها و پرسش‌های رایج — قابل چاپ با QR.", den: "Every step, station map, rules, lights and FAQ — printable with a QR.", href: () => "/d/guide" },
      { shot: "driver-display", fa: "مانیتور بزرگ راننده", en: "Big driver display", dfa: "تابلوی بیرونی کنار باسکول: پلاک، دستور، چراغ و وزن.", den: "Outdoor screen by the scale: plate, instruction, light and weight.", href: () => "/display/B" },
      { shot: "kiosk", fa: "کیوسک لمسی", en: "Touch kiosk", dfa: "چاپ رسید، تماس با اپراتور و راهنمای صوتی.", den: "Receipt printing, operator call and voice guidance.", href: () => "/kiosk/B" },
      { shot: "queue-board", fa: "تابلو فراخوان صف", en: "Queue call board", dfa: "نوبت‌ها و فراخوان لاین‌ها برای پارکینگ انتظار.", den: "Queue and lane call-ups for the waiting area.", href: () => "/display/queue" },
    ],
  },
  {
    id: "gate",
    fa: "دروازه و حراست",
    en: "Gate & security",
    icon: <DoorOpen className="size-5" />,
    items: [
      { shot: "gate", fa: "دروازه ورود", en: "Entry gate", dfa: "پلاک‌خوان جلو/عقب، RFID، اسکن زیر خودرو و تصمیم مرحله‌ای.", den: "Front/rear ANPR, RFID, under-vehicle scan and the step-wise decision.", href: () => "/app/gate", example: ["مغایرت پلاک و RFID", "Plate/RFID mismatch"] },
      { shot: "scan-uvss", fa: "اسکن زیر خودرو (UVSS)", en: "Under-vehicle scan (UVSS)", dfa: "مقایسه با تصویر مرجع و کادر ناهنجاری.", den: "Comparison with the reference image and anomaly boxes.", href: (r) => `/app/scan?tab=uvss${r.uvssScan ? `&id=${r.uvssScan}` : ""}`, example: ["جسم مشکوک زیر شاسی", "Object under the chassis"] },
      { shot: "guard-accept-mobile", fa: "اسکن حراست با گوشی", en: "Guard phone scanner", dfa: "اسکن QR مجوز خروج، تیکت یا حواله؛ اسکن دوم رد و هشدار.", den: "Scan exit QR, ticket or permit; a second scan is rejected with an alert.", href: () => "/app/guard", example: ["کامیون منتظر QR در لاین E", "Truck waiting for QR at lane E"] },
      { shot: "exit-permits", fa: "مجوزهای خروج", en: "Exit permits", dfa: "سریال، وضعیت و تاریخچه اسکن هر مجوز.", den: "Serial, status and scan history of every permit.", href: () => "/app/exit-permits" },
    ],
  },
  {
    id: "weigh",
    fa: "توزین و اسناد",
    en: "Weighing & documents",
    icon: <ScanLine className="size-5" />,
    items: [
      { shot: "weighing", fa: "ایستگاه توزین", en: "Weighing station", dfa: "وزن زنده، پایدار/تازه، موقعیت چرخ‌ها، ۴ دوربین و ثبت با F5.", den: "Live weight, stable/fresh, wheel position, 4 cameras and capture with F5.", href: () => "/app/weighing", example: ["دو کامیون آماده ثبت (یکی اضافه‌بار)", "Two trucks ready to capture (one overloaded)"] },
      { shot: "scan-lidar", fa: "اسکن LiDAR بار", en: "LiDAR load scan", dfa: "ابر نقاط سه‌بعدی، نقشه ارتفاع، حجم و بار خارج از مرکز.", den: "3D point cloud, height map, volume and off-centre load.", href: (r) => `/app/scan?tab=lidar${r.lidarScan ? `&id=${r.lidarScan}` : ""}`, example: ["بار ۱۸٪ خارج از مرکز", "Load 18% off-centre"] },
      { shot: "payload", fa: "Payload لودر", en: "Loader payload", dfa: "نمایشگر کابین سطل‌به‌سطل و صف کار لودرها.", den: "Bucket-by-bucket cab display and loader work queue.", href: () => "/app/modules/payload" },
      { shot: "transaction-detail", fa: "جزئیات تیکت", en: "Ticket detail", dfa: "Timeline، شواهد hash‌دار، نسخه‌ها، audit و ERP.", den: "Timeline, hashed evidence, versions, audit and ERP.", href: (r) => r.recentTx && `/app/transactions/${r.recentTx}` },
      { shot: "ticket-a5", fa: "چاپ رسید", en: "Printed receipt", dfa: "قالب A5 و حرارتی با QR راستی‌آزمایی و بارکد.", den: "A5 and thermal templates with verification QR and barcode.", href: (r) => r.recentTx && `/print/ticket/${r.recentTx}` },
      { shot: "verify-mobile", fa: "راستی‌آزمایی عمومی", en: "Public verification", dfa: "اسکن QR رسید توسط تحویل‌گیرنده با حداقل داده.", den: "The receiver scans the receipt QR; minimal data shown.", href: (r) => r.recentVerify && `/verify/${r.recentVerify}` },
    ],
  },
  {
    id: "owner",
    fa: "معدن‌دار و مدیریت",
    en: "Owner & management",
    icon: <Gauge className="size-5" />,
    items: [
      { shot: "process", fa: "فرآیند و مراحل", en: "Process & steps", dfa: "۱۰ مرحله از نوبت تا تحویل با آمار امروز و گلوگاه.", den: "10 steps from booking to delivery with today's numbers and bottleneck.", href: () => "/app/process" },
      { shot: "fleet-map", fa: "نقشه ناوگان و رویدادها", en: "Fleet & events map", dfa: "همه کامیون‌ها داخل معدن و در جاده، ناوگان داخلی و رویدادها.", den: "Every truck on site and on the road, internal fleet and events.", href: () => "/app/map" },
      { shot: "dashboard", fa: "داشبورد", en: "Dashboard", dfa: "ورودی/خروجی امروز، شیفت‌ها، ریسک و feed زنده.", den: "Today's in/out, shifts, risk and live feed.", href: () => "/app" },
      { shot: "control-room-dark", fa: "اتاق کنترل زنده", en: "Live control room", dfa: "پنج لاین، دوربین‌ها، وزن زنده و لاگ دستگاه‌ها.", den: "Five lanes, cameras, live weights and device log.", href: () => "/app/live" },
      { shot: "wallboard", fa: "Wallboard", en: "Wallboard", dfa: "نمایش تلویزیونی شاخص‌ها برای سالن.", den: "TV display of KPIs for the hall.", href: () => "/wallboard" },
      { shot: "reports", fa: "گزارش‌ها", en: "Reports", dfa: "قالب‌ها، Excel/PDF، ایمیل زمان‌بندی و بستن روز.", den: "Templates, Excel/PDF, scheduled e-mail and day close.", href: () => "/app/reports" },
      { shot: "billing", fa: "صورت‌حساب", en: "Billing", dfa: "صورت‌حساب مشتری از وزن قابل محاسبه.", den: "Customer statement from billable weight.", href: () => "/app/billing" },
    ],
  },
  {
    id: "control",
    fa: "کنترل و ضدتقلب",
    en: "Control & anti-fraud",
    icon: <ShieldCheck className="size-5" />,
    items: [
      { shot: "alerts", fa: "مرکز هشدار", en: "Alerts center", dfa: "چرخه هشدار با SLA و ۴۰ قانون قابل تنظیم.", den: "Alert lifecycle with SLA and 40 configurable rules.", href: () => "/app/alerts", example: ["استفاده مجدد QR، مغایرت هویت، اضافه‌برداشت", "QR reuse, identity mismatch, overdraw"] },
      { shot: "fraud", fa: "بازبینی تقلب", en: "Fraud review", dfa: "تارای غیرعادی، سفر غیرممکن و کارنامه اپراتور.", den: "Tare outliers, impossible trips and operator scorecard.", href: () => "/app/fraud?id=FC-3", example: ["سفر غیرممکن", "Impossible trip"] },
      { shot: "audit", fa: "زنجیره ممیزی", en: "Audit chain", dfa: "زنجیره HMAC؛ هر دستکاری کشف می‌شود.", den: "HMAC chain; any tampering is detected.", href: () => "/app/audit" },
      { shot: "permits", fa: "حواله و سهمیه", en: "Permits & quota", dfa: "مصرف اتمیک سهمیه و نمودار مصرف.", den: "Atomic quota consumption and usage chart.", href: () => "/app/permits" },
    ],
  },
  {
    id: "maint",
    fa: "تجهیزات و نگهداری",
    en: "Equipment & maintenance",
    icon: <Wrench className="size-5" />,
    items: [
      { shot: "devices", fa: "تجهیزات و سلامت", en: "Devices & health", dfa: "Heartbeat، لودسل، کالیبراسیون و Edge.", den: "Heartbeats, load cells, calibration and edge.", href: () => "/app/devices" },
      { shot: "hardware", fa: "کاتالوگ سخت‌افزار", en: "Hardware catalog", dfa: "هر دستگاه و محل نصب آن.", den: "Every device and where it goes.", href: () => "/app/hardware" },
      { shot: "site-map", fa: "نمای شماتیک سایت", en: "Schematic site view", dfa: "چیدمان لاین‌ها و دستگاه‌ها با وضعیت زنده.", den: "Lane and device layout with live status.", href: () => "/app/site-map" },
      { shot: "fleet", fa: "KPI ناوگان", en: "Fleet KPIs", dfa: "گانت چرخه، هدف/واقعی شیفت و سه جمع تولید.", den: "Cycle Gantt, shift target vs actual and three production totals.", href: () => "/app/modules/fleet" },
      { shot: "simulator", fa: "کنسول سرویس", en: "Service console", dfa: "۱۷ سناریوی آزمون میدانی و قطع/وصل دستگاه.", den: "17 field-test scenarios and device toggles.", href: () => "/app/console" },
    ],
  },
];

export default function ShowcasePage() {
  const L = useL();
  const locale = useLocale();
  const setLocale = usePrefs((s) => s.setLocale);
  const live = useLive();
  const { data: refs } = useView<Refs>("showcase", {}, 30_000);
  const [tab, setTab] = useState<"sections" | "samples">("sections");
  return (
    <div className="mx-auto max-w-7xl p-4 pb-16 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Logo locale={locale} />
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={live?.scene === "LIVE" ? "success" : "primary"}>{live?.scene === "LIVE" ? L("جریان پیوسته", "Continuous flow") : L("ثابت", "Hold")}</Badge>
          <Button size="sm" onClick={async () => { await act("sim.reset"); toast.success(L("صحنه نمایش آماده شد", "Staged scene restored")); }}>
            <RotateCcw className="size-4" /> {L("بازگشت به صحنه نمایش", "Back to staged scene")}
          </Button>
          <button className="text-xs text-primary" onClick={() => setLocale(locale === "fa" ? "en" : "fa")}>
            {locale === "fa" ? "EN" : "فا"}
          </button>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-black">
            <GalleryHorizontalEnd className="size-7 text-primary" /> {L("ویترین — نمونه هر بخش", "Showcase — an example of every part")}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
            {L("هر کارت یک بخش سامانه را با تصویر و توضیح کوتاه نشان می‌دهد؛ «باز کردن نمونه» مستقیم به همان صفحه در سامانه می‌رود.", "Each card shows one part of the system with a picture and a short description; “open example” goes straight to that screen.")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/present">
            <Button variant="primary">
              <Presentation className="size-4" /> {L("ارائه کامل", "Full presentation")}
            </Button>
          </Link>
          <Link href="/present?track=driver">
            <Button>
              <Truck className="size-4" /> {L("مسیر راننده", "Driver track")}
            </Button>
          </Link>
          <Link href="/present?track=owner">
            <Button>
              <Gauge className="size-4" /> {L("مسیر معدن‌دار", "Owner track")}
            </Button>
          </Link>
        </div>
      </div>
      <Tabs
        className="mt-6"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "sections", label: L("بخش‌های سامانه", "System sections"), icon: <GalleryHorizontalEnd className="size-4" /> },
          { id: "samples", label: L("نمونه اسناد، پیام‌ها و اسکن‌ها", "Sample documents, messages & scans"), icon: <FileText className="size-4" /> },
        ]}
      />
      {tab === "sections" ? <Sections refs={refs} /> : <Samples refs={refs} />}
    </div>
  );
}

function Sections({ refs }: { refs: Refs | null }) {
  const L = useL();
  return (
    <div className="mt-6 flex flex-col gap-10">
      {GROUPS.map((g) => (
        <section key={g.id}>
          <h2 className="mb-3 flex items-center gap-2 text-xl font-bold">
            <span className="text-primary">{g.icon}</span> {L(g.fa, g.en)}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((it) => {
              const href = refs ? it.href(refs) : undefined;
              return (
                <Card key={it.shot} className="flex flex-col overflow-hidden">
                  <Thumb shot={it.shot} />
                  <div className="flex flex-1 flex-col gap-1 p-3">
                    <div className="font-bold">{L(it.fa, it.en)}</div>
                    <div className="flex-1 text-xs leading-6 text-muted">{L(it.dfa, it.den)}</div>
                    {it.example && <Badge tone="info" className="w-fit">{L("نمونه: ", "Example: ")}{L(...it.example)}</Badge>}
                    {href ? (
                      <Link href={href} target="_blank" className="mt-2">
                        <Button size="sm" variant="primary" className="w-full">
                          {L("باز کردن نمونه", "Open example")}
                        </Button>
                      </Link>
                    ) : (
                      <Skeleton className="mt-2 h-8" />
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

/** Screenshot thumbnail generated by `npm run e2e -- --shots`; an icon placeholder until then. */
function Thumb({ shot }: { shot: string }) {
  const [ok, setOk] = useState(true);
  return (
    <div className="aspect-[16/10] overflow-hidden border-b border-border bg-surface-2">
      {ok ? (
        <img src={`/showcase/${shot}.jpg`} alt="" loading="lazy" onError={() => setOk(false)} className="h-full w-full object-cover object-top" />
      ) : (
        <div className="grid h-full place-items-center text-muted">
          <Monitor className="size-10" />
        </div>
      )}
    </div>
  );
}

function Samples({ refs }: { refs: Refs | null }) {
  const L = useL();
  const locale = useLocale();
  const masters = useMasters();
  const live = useLive();
  const { data: msgs } = useData<OutboxMessage>("outbox", { limit: 40 }, 60_000);
  const { data: uv } = useData<UvssScan>("uvssScans", refs?.uvssScan ? { id: refs.uvssScan } : { limit: 1 }, 60_000);
  const { data: ls } = useData<LidarScan>("lidarScans", refs?.lidarScan ? { id: refs.lidarScan } : { limit: 1 }, 60_000);
  const laneB = live?.lanes.find((l) => l.code === "B");
  const truckB = laneB?.visitId ? live?.visits[laneB.visitId] : undefined;
  const cal = masters?.calibrations[0];
  const scale = masters?.scales.find((s) => s.id === cal?.scaleId);
  const phoneMsgs = (msgs?.items ?? []).filter((m) => m.channel === "SMS" || m.channel === "WHATSAPP").slice(0, 6);
  const samples = guidanceSamples();
  if (!refs) return <Skeleton className="mt-6 h-96" />;
  return (
    <div className="mt-6 flex flex-col gap-6">
      <Card>
        <CardHeader title={L("اسناد واقعی صحنه نمایش", "Real documents from the staged scene")} icon={<FileText className="size-4" />} subtitle={L("همین صفحه‌ها در سامانه چاپ یا به گوشی فرستاده می‌شوند", "The same pages are printed or sent to phones")} />
        <div className="grid items-start gap-6 p-4 md:grid-cols-2 xl:grid-cols-4">
          {refs.recentTx && <DeviceFrame kind="laptop" src={`/print/ticket/${refs.recentTx}`} label={L("رسید A5", "A5 receipt")} />}
          {refs.recentTx && <DeviceFrame kind="phone" src={`/print/ticket/${refs.recentTx}?tpl=thermal`} label={L("رسید حرارتی ۸۰mm", "80 mm thermal receipt")} className="h-[460px]" fit="contain" />}
          {refs.recentVerify && <DeviceFrame kind="phone" src={`/verify/${refs.recentVerify}`} label={L("راستی‌آزمایی با QR", "QR verification")} className="h-[460px]" fit="contain" />}
          {refs.exitPermitToken && (
            <div className="flex flex-col items-center gap-2">
              <Card className="flex w-64 flex-col items-center gap-2 p-4">
                <div className="text-sm font-bold">{L("مجوز خروج یک‌بارمصرف", "One-time exit permit")}</div>
                <div className="rounded-lg bg-white p-2">
                  <Qr value={`${origin()}/x/${refs.exitPermitToken}`} size={150} />
                </div>
                <div className="font-mono text-sm ltr">{refs.exitPermitSerial}</div>
                <div className="text-center text-[11px] text-muted">{L("اسکن اول: پذیرش و باز شدن راهبند — اسکن دوم: رد و هشدار R36", "First scan: accepted, barrier opens — second scan: rejected, alert R36")}</div>
              </Card>
              <div className="text-sm font-semibold text-muted">{L("کارت QR روی گوشی راننده", "QR card on the driver's phone")}</div>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader title={L("همه پیام‌های مانیتور، کیوسک و گوشی راننده", "Every message on the driver display, kiosk and phone")} icon={<Monitor className="size-4" />} subtitle={L("همان متن‌هایی که سامانه در هر وضعیت نشان می‌دهد", "Exactly what the system shows in each situation")} />
        <div className="grid gap-3 p-4 md:grid-cols-2">
          {samples.map((s) => (
            <div key={s.g.code} className="flex items-center gap-3 rounded-xl bg-black p-3">
              <TrafficLight state={s.g.light === "OFF" ? undefined : s.g.light} size={11} />
              <div className="min-w-0 flex-1">
                <div className={cx("text-sm font-bold", s.g.tone === "go" ? "text-green-400" : s.g.tone === "stop" ? "text-red-400" : s.g.tone === "wait" ? "text-amber-300" : "text-slate-200")}>{L(s.g.fa, s.g.en)}</div>
                <div className="text-[10px] text-slate-400">
                  {L(...s.where)} · <span className="font-mono">{s.g.code}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title={L("پیامک و واتس‌اپ راننده", "Driver SMS & WhatsApp")} icon={<MessageSquareText className="size-4" />} subtitle={L("متن پیام‌هایی که برای راننده فرستاده می‌شود", "Messages sent to the driver")} />
          <div className="flex flex-col gap-2 p-4">
            {phoneMsgs.map((m) => (
              <div key={m.id} className={cx("max-w-[90%] rounded-2xl px-3 py-2 text-sm shadow-sm", m.channel === "WHATSAPP" ? "self-start bg-[#dcf8c6] text-slate-900" : "self-start bg-surface-2")}>
                <div className="mb-0.5 text-[10px] text-muted">
                  {m.channel} · {fmtTime(m.createdAt, locale)}
                </div>
                {m.body}
              </div>
            ))}
            {!phoneMsgs.length && <Skeleton className="h-40" />}
          </div>
        </Card>
        <Card>
          <CardHeader title={L("دوربین‌های پلاک و شواهد", "Plate & evidence cameras")} icon={<Camera className="size-4" />} subtitle={truckB ? L("کامیون روی باسکول ۱", "Truck on scale 1") : undefined} />
          <div className="grid grid-cols-2 gap-2 p-4">
            {truckB ? (
              (["front", "rear", "top", "side"] as const).map((v, i) => <CameraFeed key={v} view={v} plate={truckB.plate} color={truckB.vehicleColor} seed={i + 3} label={`CAM-B-${v.toUpperCase()}`} confidence={0.97} />)
            ) : (
              <Skeleton className="col-span-2 h-48" />
            )}
          </div>
          {truckB && (
            <div className="flex justify-center pb-4">
              <IranPlate plate={truckB.plate} size="lg" />
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader title={L("اسکن زیر خودرو — مورد مشکوک", "Under-vehicle scan — suspect")} icon={<ScanLine className="size-4" />} />
          <div className="p-4">{uv?.items[0] ? <UvssImage anomalies={uv.items[0].anomalies.map((a) => ({ ...a, label: locale === "fa" ? a.label : a.labelEn }))} className="w-full" /> : <Skeleton className="h-40" />}</div>
        </Card>
        <Card>
          <CardHeader title={L("نقشه ارتفاع بار (LiDAR)", "Load height map (LiDAR)")} icon={<ScanLine className="size-4" />} subtitle={ls?.items[0] ? `${ls.items[0].volumeM3} m³ · ${L("خارج از مرکز", "off-centre")} ${ls.items[0].offCenterPct}%` : undefined} />
          <div className="p-4">{ls?.items[0] ? <HeightMap seed={ls.items[0].seed} offCenter={ls.items[0].offCenterPct} className="w-full" /> : <Skeleton className="h-40" />}</div>
        </Card>
        <Card>
          <CardHeader title={L("گواهی کالیبراسیون", "Calibration certificate")} icon={<BookOpen className="size-4" />} />
          {cal ? (
            <div className="p-4 text-sm">
              <div className="font-mono text-base font-bold">{cal.certificateNo}</div>
              <div className="text-xs text-muted">{cal.issuer}</div>
              <Kv k={L("باسکول", "Scale")} v={scale ? L(scale.name, scale.nameEn) : cal.scaleId} />
              <Kv k={L("تاریخ", "Date")} v={fmtDate(cal.calibratedAt, locale)} />
              <Kv k={L("اعتبار تا", "Valid until")} v={fmtDate(cal.validUntil, locale)} />
              <Kv k={L("حداکثر خطا", "Max error")} v={`±${cal.maxErrorKg} kg`} />
              <Link href="/app/devices" className="mt-2 inline-block text-xs text-primary">
                {L("همه گواهی‌ها ←", "All certificates →")}
              </Link>
            </div>
          ) : (
            <Skeleton className="m-4 h-40" />
          )}
        </Card>
      </div>
    </div>
  );
}
