"use client";
// Slide deck content. Each slide shows real pages of the app (in device frames) driven by the
// staged presentation scene, plus a few short points and speaker notes.
import { BadgeCheck, Clock, FileWarning, Gauge, Map as MapIcon, ShieldAlert, ShieldCheck, Truck, Users } from "lucide-react";
import type { ReactNode } from "react";
import { origin, Qr } from "@/components/domain/codes";
import { DeviceArt } from "@/components/hardware/Devices";
import { TruckSvg } from "@/components/hardware/Truck";
import { CONTROLS } from "@/components/marketing/content";
import { LogoMark } from "@/components/shell/Logo";
import { BRAND } from "@/config/brand";
import { JOURNEY_STEPS } from "@/domain/journey";
import type { DeviceType } from "@/domain/types";
import { DEVICE_TYPE, lbl } from "@/i18n/labels";
import type { ShowcaseRefs } from "@/server/store";
import { DeviceFrame } from "./DeviceFrame";

export type Track = "driver" | "owner";
export interface SlideCtx {
  L: (fa: string, en: string) => string;
  locale: "fa" | "en";
  refs: ShowcaseRefs | null;
  eager: boolean;
}
export interface Slide {
  id: string;
  tracks: Track[];
  title: [string, string];
  notes: [string, string];
  render: (c: SlideCtx) => ReactNode;
}

const BOTH: Track[] = ["driver", "owner"];

function Layout({ kicker, title, points, visual, c, dark }: { kicker?: string; title: string; points: string[]; visual: ReactNode; c: SlideCtx; dark?: boolean }) {
  return (
    <div className={dark ? "flex h-full flex-col bg-[#102A43] p-20 text-white" : "flex h-full flex-col bg-[#F5F7FA] p-20 text-[#172B3A]"}>
      {kicker && <div className={dark ? "text-2xl font-semibold text-sky-300" : "text-2xl font-semibold text-[#1273A6]"}>{kicker}</div>}
      <h2 className="mt-2 text-6xl font-black leading-[1.15]">{title}</h2>
      <div className="mt-12 grid min-h-0 flex-1 grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-16">
        <ul className="space-y-7 text-[30px] leading-[1.5]">
          {points.map((p) => (
            <li key={p} className="flex gap-4">
              <BadgeCheck className={dark ? "mt-2 size-9 shrink-0 text-sky-300" : "mt-2 size-9 shrink-0 text-[#168567]"} />
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <div className="min-h-0">{visual}</div>
      </div>
      <Footer c={c} dark={dark} />
    </div>
  );
}

function Footer({ c, dark }: { c: SlideCtx; dark?: boolean }) {
  return <div className={dark ? "mt-6 text-lg text-white/50" : "mt-6 text-lg text-[#5b6b79]"}>{c.L(`${BRAND.name} · نسخه نمایشی با داده و سخت‌افزار شبیه‌سازی‌شده`, `${BRAND.nameEn} · demo build with simulated data and hardware`)}</div>;
}

const tk = (c: SlideCtx, k: string) => c.refs?.driverTokens[k];

export const SLIDES: Slide[] = [
  {
    id: "cover",
    tracks: BOTH,
    title: [BRAND.name, BRAND.nameEn],
    notes: ["سامانه هوشمند توزین و تردد معدن: از نوبت کامیون تا تحویل بار، با کنترل ضدتقلب و دید کامل برای معدن‌دار.", "Smart mine weighbridge & gate system: from truck booking to delivery, with anti-fraud controls and full visibility for the owner."],
    render: (c) => (
      <div className="flex h-full flex-col justify-between bg-[#102A43] p-24 text-white">
        <div className="flex items-center gap-6">
          <LogoMark size={96} />
          <div className="text-3xl font-semibold text-sky-300">{c.L("سامانه هوشمند توزین و تردد معدن", "Smart mine weighbridge & gate system")}</div>
        </div>
        <div>
          <h1 className="text-[120px] font-black leading-none">{c.L(BRAND.name, BRAND.nameEn)}</h1>
          <p className="mt-8 max-w-[1200px] text-[40px] leading-[1.5] text-white/85">{c.L("از دروازه تا رسید — هر کیلوگرم ثبت، هر خروج کنترل‌شده، هر کامیون روی نقشه.", "From gate to receipt — every kilogram recorded, every exit controlled, every truck on the map.")}</p>
        </div>
        <div className="flex items-end justify-between">
          <div className="text-2xl text-white/60">{c.L("نسخه نمایشی — همه داده‌ها و دستگاه‌ها شبیه‌سازی‌شده‌اند", "Demo build — all data and devices are simulated")}</div>
          <TruckSvg view="side" width={560} color="#d9480f" loaded />
        </div>
      </div>
    ),
  },
  {
    id: "problem",
    tracks: BOTH,
    title: ["مسئله امروز معدن", "The problem today"],
    notes: ["چهار درد اصلی: تقلب وزن و سهمیه، صف و معطلی، اسناد کاغذی و نبود دید لحظه‌ای از کامیون‌ها.", "Four pains: weight and quota fraud, queues and waiting, paper documents, and no real-time view of the trucks."],
    render: (c) => (
      <div className="flex h-full flex-col bg-[#F5F7FA] p-20 text-[#172B3A]">
        <h2 className="text-6xl font-black">{c.L("مسئله امروز معدن", "The problem today")}</h2>
        <div className="mt-16 grid flex-1 grid-cols-2 gap-10">
          {[
            [ShieldAlert, "تقلب وزن و سهمیه", "Weight & quota fraud", "تارای دستکاری‌شده، تیکت تکراری، QR کپی‌شده و برداشت بیش از حواله.", "Tampered tares, duplicate tickets, copied QR codes and over-permit withdrawals."],
            [Clock, "صف و معطلی", "Queues & waiting", "راننده نمی‌داند کجا برود؛ باسکول بیکار می‌ماند و صف بیرون معدن طولانی می‌شود.", "Drivers don't know where to go; scales sit idle while the queue outside grows."],
            [FileWarning, "اسناد کاغذی", "Paper documents", "رسید و مجوز خروج کاغذی، بدون راستی‌آزمایی و بدون اتصال به ERP.", "Paper receipts and exit slips, no verification and no ERP link."],
            [MapIcon, "بی‌خبری از کامیون‌ها", "No visibility", "معدن‌دار نمی‌داند الان چه کسی داخل است، چه کسی در جاده است و چه اتفاقی افتاده.", "The owner can't see who is inside, who is on the road, or what just happened."],
          ].map(([Icon, fa, en, dfa, den]) => {
            const I = Icon as typeof ShieldAlert;
            return (
              <div key={en as string} className="flex gap-6 rounded-3xl bg-white p-10 shadow-sm">
                <I className="size-16 shrink-0 text-[#B42335]" />
                <div>
                  <div className="text-4xl font-bold">{c.L(fa as string, en as string)}</div>
                  <div className="mt-4 text-[28px] leading-[1.5] text-[#5b6b79]">{c.L(dfa as string, den as string)}</div>
                </div>
              </div>
            );
          })}
        </div>
        <Footer c={c} />
      </div>
    ),
  },
  {
    id: "journey",
    tracks: BOTH,
    title: ["یک سفر، ۱۰ ایستگاه شماره‌دار", "One trip, 10 numbered stations"],
    notes: ["راننده، مانیتور و معدن‌دار همه از یک نقشه راه مشترک استفاده می‌کنند: ۱۰ ایستگاه با شماره تابلو.", "Driver, display and owner all use one shared roadmap: 10 stations with numbered signs."],
    render: (c) => (
      <div className="flex h-full flex-col bg-[#102A43] p-20 text-white">
        <h2 className="text-6xl font-black">{c.L("یک سفر، ۱۰ ایستگاه شماره‌دار", "One trip, 10 numbered stations")}</h2>
        <p className="mt-4 text-3xl text-white/75">{c.L("گوشی راننده، مانیتور کنار باسکول و صفحه معدن‌دار همیشه یک چیز می‌گویند.", "The driver's phone, the display by the scale and the owner's screen always say the same thing.")}</p>
        <div className="mt-14 grid flex-1 grid-cols-5 gap-6">
          {JOURNEY_STEPS.map((s) => (
            <div key={s.id} className="flex flex-col rounded-3xl bg-white/10 p-6">
              <div className="grid size-16 place-items-center rounded-full bg-sky-400 text-3xl font-black text-[#102A43]">{s.n}</div>
              <div className="mt-4 text-[30px] font-bold leading-tight">{c.L(s.fa, s.en)}</div>
              <div className="mt-3 text-xl leading-[1.5] text-white/70">{c.L(...s.role)}</div>
            </div>
          ))}
        </div>
        <Footer c={c} dark />
      </div>
    ),
  },
  // ---------------- driver track ----------------
  {
    id: "sms",
    tracks: ["driver"],
    title: ["لینک پیامکی و نوبت", "SMS link & booking"],
    notes: ["راننده قبل از رسیدن لینک می‌گیرد: نوبت، ساعت ورود و همه مراحل. نیازی به نصب برنامه نیست.", "Before arriving the driver gets a link: queue number, arrival slot and every step. No app to install."],
    render: (c) => (
      <Layout
        c={c}
        kicker={c.L("مسیر راننده · ایستگاه ۰ و ۲", "Driver track · stations 0 & 2")}
        title={c.L("لینک پیامکی به جای برگه و صف", "An SMS link instead of slips and queues")}
        points={[c.L("نوبت و جای راننده در صف، با زمان تقریبی", "Queue number and position with an ETA"), c.L("همه ۱۰ مرحله سفر با توضیح کامل", "All 10 trip steps fully explained"), c.L("بدون نصب برنامه — روی هر گوشی", "No app to install — works on any phone"), c.L("تماس با اپراتور با یک دکمه", "Call the operator with one tap")]}
        visual={tk(c, "queue") ? <DeviceFrame kind="phone" src={`/d/${tk(c, "queue")}`} fit="contain" eager={c.eager} /> : null}
      />
    ),
  },
  {
    id: "gate",
    tracks: ["driver", "owner"],
    title: ["دروازه هوشمند", "Smart gate"],
    notes: ["پلاک جلو و عقب، تگ RFID، اسکن زیر خودرو و عکس مدارک. در این نمونه پلاک با RFID نمی‌خواند و کامیون متوقف شده.", "Front and rear plates, RFID tag, under-vehicle scan and document photo. In this example the plate and RFID disagree, so the truck is held."],
    render: (c) => (
      <Layout
        c={c}
        kicker={c.L("ایستگاه ۱ · دروازه ورود", "Station 1 · entry gate")}
        title={c.L("هویت با دو منبع، تصمیم مرحله‌ای", "Two identity sources, step-wise decision")}
        points={[c.L("پلاک‌خوان جلو/عقب + RFID؛ مغایرت = توقف", "Front/rear ANPR + RFID; mismatch = hold"), c.L("اسکن زیر خودرو با مقایسه تصویر مرجع", "Under-vehicle scan against a reference image"), c.L("ایمنی ← هویت ← مدارک ← حواله", "Safety → identity → documents → permit"), c.L("نرم‌افزار فقط درخواست می‌دهد؛ PLC تأیید می‌کند", "Software only requests; the PLC confirms")]}
        visual={<DeviceFrame kind="laptop" src="/app/gate" fit="contain" eager={c.eager} />}
      />
    ),
  },
  {
    id: "display",
    tracks: ["driver"],
    title: ["مانیتور بزرگ راننده", "Big driver display"],
    notes: ["کنار هر باسکول یک مانیتور بیرونی: پلاک، دستور، چراغ و وزن زنده. همان پیامی که روی گوشی راننده است.", "An outdoor display by each scale: plate, instruction, light and live weight — the same message as on the driver's phone."],
    render: (c) => (
      <Layout
        c={c}
        kicker={c.L("ایستگاه ۳ و ۶ · باسکول", "Stations 3 & 6 · scales")}
        title={c.L("راننده بدون پیاده شدن می‌داند چه کند", "The driver knows what to do without leaving the cab")}
        points={[c.L("دستورهای کوتاه: جلو بیایید، توقف، ثبت شد، بروید", "Short commands: forward, stop, recorded, go"), c.L("چراغ سبز/زرد/قرمز و وزن زنده", "Green/yellow/red light and live weight"), c.L("هشدار موقعیت چرخ‌ها", "Wheel-position warning"), c.L("کیوسک لمسی برای چاپ رسید", "Touch kiosk to print the receipt")]}
        visual={<DeviceFrame kind="monitor" src="/display/B" fit="contain" eager={c.eager} />}
        dark
      />
    ),
  },
  {
    id: "weigh",
    tracks: ["driver", "owner"],
    title: ["توزین بی‌خطا", "Error-proof weighing"],
    notes: ["وزن فقط از indicator و فقط وقتی پایدار، تازه و با همه چرخ‌ها روی باسکول. در صحنه، باسکول ۲ یک کامیون اضافه‌بار دارد که با ثبت، استثنا ایجاد می‌کند.", "Weight only from the indicator and only when stable, fresh and with every wheel on the deck. In the scene, scale 2 holds an overloaded truck that raises an exception on capture."],
    render: (c) => (
      <Layout
        c={c}
        kicker={c.L("ایستگاه ۳ و ۶ · اپراتور", "Stations 3 & 6 · operator")}
        title={c.L("وزن پایدار، تازه، همه چرخ‌ها روی باسکول", "Stable, fresh, every wheel on the deck")}
        points={[c.L("ثبت وزن ناپایدار یا قدیمی‌تر از ۱۲ ثانیه ممکن نیست", "No capture if unstable or older than 12 s"), c.L("۴ دوربین با hash برای هر توزین", "4 hashed cameras on every weighing"), c.L("خالص = ناخالص − تارا؛ اضافه‌بار و سهمیه چک می‌شود", "Net = gross − tare; overload and quota checked"), c.L("استثنا فقط با امضای دو نفر", "Exceptions need two signatures")]}
        visual={<DeviceFrame kind="laptop" src="/app/weighing" fit="contain" eager={c.eager} />}
      />
    ),
  },
  {
    id: "load",
    tracks: ["driver", "owner"],
    title: ["بارگیری و اسکن بار", "Loading & load scan"],
    notes: ["Payload لودر سطل‌به‌سطل و اسکن LiDAR بالای بار؛ هر دو تخمینی‌اند و فقط برای کنترل کیفیت، نه وزن قانونی.", "Bucket-by-bucket loader payload and an overhead LiDAR scan; both are estimates for QC only, never the legal weight."],
    render: (c) => (
      <Layout
        c={c}
        kicker={c.L("ایستگاه ۴ و ۵", "Stations 4 & 5")}
        title={c.L("حجم سه‌بعدی بار، بار خارج از مرکز، روکش", "3D load volume, off-centre load, tarp")}
        points={[c.L("ابر نقاط سه‌بعدی و نقشه ارتفاع", "3D point cloud and height map"), c.L("مقایسه حجم×چگالی با وزن باسکول", "Volume×density compared with the scale"), c.L("هشدار بار خارج از مرکز و بدون روکش", "Alerts for off-centre and uncovered loads"), c.L("نمایشگر کابین لودر برای پر کردن دقیق", "Loader cab display for accurate filling")]}
        visual={<DeviceFrame kind="laptop" src={`/app/scan?tab=lidar${c.refs?.lidarScan ? `&id=${c.refs.lidarScan}` : ""}`} fit="contain" eager={c.eager} />}
      />
    ),
  },
  {
    id: "exit",
    tracks: ["driver", "owner"],
    title: ["رسید و QR خروج یک‌بارمصرف", "Receipt & one-time exit QR"],
    notes: ["رسید و مجوز خروج روی گوشی راننده می‌آید. حراست با گوشی اسکن می‌کند؛ اسکن دوم رد می‌شود و هشدار امنیتی می‌دهد.", "The receipt and exit permit arrive on the driver's phone. Security scans with a phone; a second scan is rejected with a security alert."],
    render: (c) => (
      <Layout
        c={c}
        kicker={c.L("ایستگاه ۷ و ۸", "Stations 7 & 8")}
        title={c.L("بدون کاغذ، بدون کپی", "No paper, no copies")}
        points={[c.L("رسید با QR راستی‌آزمایی و شماره نسخه", "Receipt with verification QR and version"), c.L("QR خروج فقط یک بار معتبر است", "Exit QR is valid exactly once"), c.L("اسکن آنلاین حراست با دوربین گوشی", "Online guard scan with a phone camera"), c.L("اسکن دوم = رد + هشدار R36", "Second scan = rejected + alert R36")]}
        visual={
          <div className="grid h-full grid-cols-2 gap-8">
            {tk(c, "exit") && <DeviceFrame kind="phone" src={`/d/${tk(c, "exit")}?tab=docs`} fit="contain" label={c.L("گوشی راننده", "Driver phone")} eager={c.eager} />}
            <DeviceFrame kind="phone" src="/app/guard" fit="contain" label={c.L("گوشی حراست", "Guard phone")} eager={c.eager} />
          </div>
        }
      />
    ),
  },
  {
    id: "navigate",
    tracks: ["driver"],
    title: ["نقشه و مسیریابی تا مقصد", "Map & navigation to the destination"],
    notes: ["هر ایستگاه روی نقشه معدن است و با یک دکمه به برنامه مسیریابی گوشی (نشان، بلد، گوگل، Waze) فرستاده می‌شود. بعد از خروج، مسیر تا مشتری ردیابی می‌شود.", "Every station is on the mine map and one tap hands it to the phone's navigation app (Neshan, Balad, Google, Waze). After the exit, the route to the customer is tracked."],
    render: (c) => (
      <Layout
        c={c}
        kicker={c.L("ایستگاه ۹ · حمل و تحویل", "Station 9 · haul & delivery")}
        title={c.L("راننده همیشه می‌داند کجا برود", "The driver always knows where to go")}
        points={[c.L("ایستگاه بعدی روی نقشه معدن", "Next station on the mine map"), c.L("یک دکمه: مسیریابی با GPS گوشی", "One tap: navigate with phone GPS"), c.L("مسیر تا مشتری و زمان رسیدن", "Route to the customer and ETA"), c.L("ثبت سرعت، توقف و انحراف مسیر", "Speeding, stops and deviations logged")]}
        visual={
          <div className="grid h-full grid-cols-2 gap-8">
            {tk(c, "loading") && <DeviceFrame kind="phone" src={`/d/${tk(c, "loading")}?tab=map`} fit="contain" label={c.L("داخل معدن", "Inside the mine")} eager={c.eager} />}
            {tk(c, "exited") && <DeviceFrame kind="phone" src={`/d/${tk(c, "exited")}?tab=map`} fit="contain" label={c.L("در جاده", "On the road")} eager={c.eager} />}
          </div>
        }
      />
    ),
  },
  {
    id: "guide",
    tracks: ["driver"],
    title: ["راهنمای راننده", "Driver guide"],
    notes: ["راهنمای یک‌صفحه‌ای قابل چاپ با QR روی تابلوی دروازه: مراحل، مدارک، قوانین و معنی چراغ‌ها.", "A printable one-page guide with a QR on the gate sign: steps, documents, rules and what the lights mean."],
    render: (c) => (
      <Layout
        c={c}
        kicker={c.L("پیش از ورود", "Before arriving")}
        title={c.L("همه مراحل در یک صفحه، با QR روی تابلو", "Every step on one page, with a QR on the sign")}
        points={[c.L("نقشه ایستگاه‌های شماره‌دار", "Map of numbered stations"), c.L("مدارک و تجهیزات لازم", "Required documents and equipment"), c.L("قوانین ایمنی و معنی چراغ‌ها", "Safety rules and light meanings"), c.L("پرسش‌های رایج", "Frequently asked questions")]}
        visual={
          <div className="grid h-full grid-cols-[1fr_auto] items-center gap-10">
            <DeviceFrame kind="phone" src="/d/guide" fit="contain" eager={c.eager} />
            <div className="flex flex-col items-center gap-4 rounded-3xl bg-white p-8 shadow">
              <Qr value={`${origin()}/d/guide`} size={240} />
              <div className="text-2xl font-semibold">{c.L("QR تابلوی دروازه", "Gate sign QR")}</div>
            </div>
          </div>
        }
      />
    ),
  },
  // ---------------- owner track ----------------
  {
    id: "process",
    tracks: ["owner"],
    title: ["فرآیند از دید معدن‌دار", "The process, owner's view"],
    notes: ["همه مراحل در یک صفحه: چه کسی و چه دستگاهی، کدام کنترل، چند کامیون الان، میانگین زمان و گلوگاه امروز.", "Every step on one page: who and which device, which control, how many trucks now, average times and today's bottleneck."],
    render: (c) => (
      <Layout
        c={c}
        kicker={c.L("مسیر معدن‌دار", "Owner track")}
        title={c.L("هر مرحله شفاف، گلوگاه مشخص", "Every step clear, the bottleneck visible")}
        points={[c.L("۱۰ مرحله با مسئول، دستگاه و سند خروجی", "10 steps with owner, device and output"), c.L("کنترل‌های ضدتقلب هر مرحله", "Anti-fraud controls per step"), c.L("قیف امروز: رسیده تا تحویل‌شده", "Today's funnel: arrived to delivered"), c.L("گلوگاه با میانگین زمان", "Bottleneck by average time")]}
        visual={<DeviceFrame kind="laptop" src="/app/process" fit="contain" eager={c.eager} />}
      />
    ),
  },
  {
    id: "live",
    tracks: ["owner"],
    title: ["اتاق کنترل زنده", "Live control room"],
    notes: ["پنج لاین با دوربین، وزن زنده، پلاک و RFID، راهبند و چراغ، و لاگ خام دستگاه‌ها — برای اتاق کنترل شبانه‌روزی.", "Five lanes with cameras, live weight, plate and RFID, barrier and light, and the raw device log — for a 24/7 control room."],
    render: (c) => (
      <Layout
        c={c}
        kicker={c.L("مسیر معدن‌دار", "Owner track")}
        title={c.L("همه لاین‌ها در یک نگاه", "Every lane at a glance")}
        points={[c.L("دوربین، وزن، پلاک و RFID هر لاین", "Camera, weight, plate and RFID per lane"), c.L("وضعیت راهبند و چراغ با تأیید PLC", "Barrier and light state with PLC ACK"), c.L("لاگ خام دستگاه‌ها", "Raw device log"), c.L("حالت شب برای اتاق کنترل", "Night mode for the control room")]}
        visual={<DeviceFrame kind="monitor" src="/app/live" fit="contain" eager={c.eager} />}
        dark
      />
    ),
  },
  {
    id: "map",
    tracks: ["owner", "driver"],
    title: ["نقشه ناوگان و رویدادها", "Fleet & events map"],
    notes: ["همه کامیون‌ها روی یک نقشه: داخل معدن با ایستگاه، در جاده با درصد مسیر و زمان رسیدن، ورودی‌ها، ناوگان داخلی، و رویدادهایی مثل سرعت غیرمجاز.", "Every truck on one map: on site with its station, on the road with progress and ETA, inbound, internal fleet, and events such as speeding."],
    render: (c) => (
      <Layout
        c={c}
        kicker={c.L("مسیر معدن‌دار", "Owner track")}
        title={c.L("همه ماشین‌ها و اتفاقات روی نقشه", "Every vehicle and event on the map")}
        points={[c.L("داخل معدن، در جاده و در راه معدن", "On site, on the road and heading in"), c.L("ناوگان داخلی و لودرها", "Internal fleet and loaders"), c.L("هشدارهای سایت و رویدادهای جاده", "Site alerts and road events"), c.L("نقشه، ماهواره یا حالت بدون اینترنت", "Map, satellite or offline mode")]}
        visual={<DeviceFrame kind="laptop" src="/app/map" fit="contain" eager={c.eager} />}
      />
    ),
  },
  {
    id: "controls",
    tracks: ["owner"],
    title: ["۱۰ کنترل ضدتقلب", "10 anti-fraud controls"],
    notes: ["هر کنترل یک راه مشخص تقلب را می‌بندد؛ همه در audit زنجیره‌ای ثبت می‌شوند.", "Each control closes a specific fraud path; all are recorded in the chained audit."],
    render: (c) => (
      <div className="flex h-full flex-col bg-[#F5F7FA] p-20 text-[#172B3A]">
        <h2 className="text-6xl font-black">{c.L("۱۰ کنترل ضدتقلب", "10 anti-fraud controls")}</h2>
        <div className="mt-12 grid flex-1 grid-cols-2 gap-x-14 gap-y-6">
          {CONTROLS.map((x) => (
            <div key={x.n} className="flex gap-5">
              <span className="text-5xl font-black text-[#1273A6]">{x.n}</span>
              <div>
                <div className="text-[32px] font-bold leading-tight">{c.L(x.fa, x.en)}</div>
                <div className="mt-1 text-2xl leading-[1.45] text-[#5b6b79]">{c.L(x.dfa, x.den)}</div>
              </div>
            </div>
          ))}
        </div>
        <Footer c={c} />
      </div>
    ),
  },
  {
    id: "alerts",
    tracks: ["owner"],
    title: ["هشدار، تقلب و ممیزی", "Alerts, fraud & audit"],
    notes: ["هشدارها با SLA و مسئول؛ الگوهای آماری تقلب؛ زنجیره audit که هر دستکاری را فوراً نشان می‌دهد.", "Alerts with SLA and an owner; statistical fraud patterns; an audit chain that exposes any tampering instantly."],
    render: (c) => (
      <Layout
        c={c}
        kicker={c.L("مسیر معدن‌دار", "Owner track")}
        title={c.L("هیچ استثنایی بی‌صاحب نمی‌ماند", "No exception goes unowned")}
        points={[c.L("۴۰ قانون قابل تنظیم با تست روی داده گذشته", "40 configurable rules with a back-test"), c.L("چرخه دیده‌شد ← بررسی ← حل با SLA", "Ack → investigate → resolve with SLA"), c.L("تارای غیرعادی، سفر غیرممکن، ثبت دستی زیاد", "Tare outliers, impossible trips, high manual rate"), c.L("زنجیره HMAC: دستکاری فوراً کشف می‌شود", "HMAC chain: tampering detected instantly")]}
        visual={<DeviceFrame kind="laptop" src="/app/alerts" fit="contain" eager={c.eager} />}
      />
    ),
  },
  {
    id: "dashboard",
    tracks: ["owner"],
    title: ["داشبورد و گزارش", "Dashboard & reports"],
    notes: ["تناژ ورودی و خروجی، هدف شیفت، ریسک و گزارش‌های آماده با خروجی Excel و PDF و ارسال خودکار ایمیل.", "Inbound and outbound tonnage, shift targets, risk and ready reports with Excel/PDF export and scheduled e-mail."],
    render: (c) => (
      <Layout
        c={c}
        kicker={c.L("مسیر معدن‌دار", "Owner track")}
        title={c.L("عدد درست، همان لحظه", "The right numbers, right now")}
        points={[c.L("تناژ امروز و ۷ روز، هدف/واقعی شیفت", "Today and 7-day tonnage, shift target vs actual"), c.L("سه جمع جدا: داخلی، انتقال، فروش", "Three totals: internal, transfer, sales"), c.L("گزارش Excel/PDF و ایمیل زمان‌بندی", "Excel/PDF reports and scheduled e-mail"), c.L("صورت‌حساب مشتری و اتصال ERP", "Customer billing and ERP link")]}
        visual={<DeviceFrame kind="laptop" src="/app" fit="contain" eager={c.eager} />}
      />
    ),
  },
  {
    id: "hardware",
    tracks: ["owner"],
    title: ["سخت‌افزار و اتصال", "Hardware & connectivity"],
    notes: ["تجهیزات استاندارد بازار به Edge محلی وصل می‌شوند؛ با قطع اینترنت کار ادامه دارد و بعداً بدون تکرار همگام می‌شود.", "Standard off-the-shelf devices connect to a local edge; work continues during internet outages and syncs later without duplicates."],
    render: (c) => {
      const types: DeviceType[] = ["INDICATOR", "CAMERA_ANPR", "RFID_READER", "UVSS", "LIDAR", "PLC", "BARRIER", "TRAFFIC_LIGHT", "LED_DISPLAY", "KIOSK", "PRINTER", "EDGE_GATEWAY"];
      return (
        <div className="flex h-full flex-col bg-[#F5F7FA] p-20 text-[#172B3A]">
          <h2 className="text-6xl font-black">{c.L("سخت‌افزار و اتصال", "Hardware & connectivity")}</h2>
          <p className="mt-4 text-3xl text-[#5b6b79]">{c.L("Edge محلی در اتاق کنترل؛ قطع اینترنت = ادامه کار، همگام‌سازی بعدی بدون تکرار. راهبند هرگز بدون تأیید PLC باز نمی‌شود.", "Local edge in the control room; internet outage = keep working, sync later without duplicates. Barriers never open without the PLC.")}</p>
          <div className="mt-12 grid flex-1 grid-cols-6 gap-6">
            {types.map((t) => (
              <div key={t} className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-white p-6 shadow-sm">
                <DeviceArt type={t} status="ONLINE" className="h-28 w-36" />
                <div className="text-center text-2xl font-semibold">{lbl(DEVICE_TYPE, t, c.locale)}</div>
              </div>
            ))}
          </div>
          <Footer c={c} />
        </div>
      );
    },
  },
  {
    id: "close",
    tracks: BOTH,
    title: ["قدم بعدی", "Next steps"],
    notes: ["پیشنهاد: پایلوت روی یک باسکول و یک دروازه، سپس توسعه به همه لاین‌ها و اتصال ERP.", "Proposal: pilot on one scale and one gate, then roll out to every lane and connect ERP."],
    render: (c) => (
      <div className="flex h-full flex-col justify-between bg-[#102A43] p-24 text-white">
        <h2 className="text-7xl font-black">{c.L("قدم بعدی", "Next steps")}</h2>
        <div className="grid grid-cols-3 gap-10">
          {[
            [Users, "۱. جلسه نیازسنجی", "1. Requirements workshop", "لاین‌ها، مدارک، حواله‌ها و ERP شما", "Your lanes, documents, permits and ERP"],
            [Gauge, "۲. پایلوت", "2. Pilot", "یک دروازه و یک باسکول با داده واقعی", "One gate and one scale with real data"],
            [Truck, "۳. توسعه کامل", "3. Full roll-out", "همه لاین‌ها، LiDAR، UVSS و ناوگان", "All lanes, LiDAR, UVSS and the fleet"],
          ].map(([Icon, fa, en, dfa, den]) => {
            const I = Icon as typeof Users;
            return (
              <div key={en as string} className="rounded-3xl bg-white/10 p-10">
                <I className="size-14 text-sky-300" />
                <div className="mt-6 text-4xl font-bold">{c.L(fa as string, en as string)}</div>
                <div className="mt-3 text-[28px] text-white/75">{c.L(dfa as string, den as string)}</div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="rounded-2xl bg-white p-4">
              <Qr value={`${origin()}/showcase`} size={180} />
            </div>
            <div className="text-3xl">
              <div className="font-bold">{c.L("ویترین نمونه‌ها", "Showcase")}</div>
              <div className="text-white/70">{c.L("همه بخش‌ها با مثال آماده", "Every part with a ready example")}</div>
            </div>
          </div>
          <ShieldCheck className="size-24 text-sky-300" />
        </div>
      </div>
    ),
  },
];
