"use client";
import { ArrowLeft, Cable, Check, Cpu, Database, Monitor, Router, ShieldCheck, Smartphone, Wifi } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { IranPlate } from "@/components/domain/IranPlate";
import { TrafficLight, WeightDisplay } from "@/components/domain/indicators";
import { CameraFeed } from "@/components/hardware/CameraFeed";
import { DeviceArt, GatePortalSvg, LidarGantrySvg, UvssImage } from "@/components/hardware/Devices";
import { ScaleDeckTop } from "@/components/hardware/ScaleDeck";
import { Button, Card, cx, Field, Input, toast } from "@/components/ui";
import { guidanceFor } from "@/domain/driverGuidance";
import { act, useLive } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import { CONTROLS, FAQ, PLANS, STOPS } from "./content";

export function LaptopMock() {
  const live = useLive();
  const lane = live?.lanes.find((l) => l.code === "B");
  const v = lane?.visitId ? live?.visits[lane.visitId] : undefined;
  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      <div className="rounded-t-2xl border-[10px] border-zinc-800 bg-zinc-800 shadow-2xl">
        <div className="overflow-hidden rounded-md bg-[#0b1220] p-3 text-white">
          <div className="mb-2 flex items-center justify-between text-[10px] text-white/60">
            <span>● ● ●</span>
            <span>tozinnegar · /app/weighing</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-3 flex flex-col gap-2">
              <WeightDisplay variant="led" kg={lane?.weightKg ?? 0} stable={lane?.stable} motion={lane?.motion} zero={lane?.zero} online={lane?.indicatorOnline ?? true} size="md" />
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-2">
                {v ? <IranPlate plate={v.plate} size="sm" /> : <span className="text-xs text-white/50">—</span>}
                <TrafficLight state={lane?.light ?? "GREEN"} size={10} horizontal />
              </div>
            </div>
            <div className="col-span-2 flex flex-col gap-2">
              <CameraFeed view={v ? "front" : "empty"} plate={v?.plate} color={v?.vehicleColor} seed={9} label="CAM-B" at={live?.now} compact confidence={v?.identity.anpr?.confidence} />
              <div className="rounded-lg bg-white/5 p-1">
                <ScaleDeckTop occupied={!!v} beams={lane?.beams} positionOk={lane?.positionOk} offsetPct={lane?.truckOffsetPct} color={v?.vehicleColor} showCells={false} className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto h-4 w-[110%] -translate-x-[4.5%] rounded-b-2xl bg-gradient-to-b from-zinc-700 to-zinc-900" />
    </div>
  );
}

export function PhoneMock() {
  const L = useL();
  const locale = useLocale();
  const live = useLive();
  const v = live ? live.activeIds.map((id) => live.visits[id]).find((x) => x.laneCode === "B" || x.state === "LOADING") : undefined;
  const lane = v?.laneCode ? live?.lanes.find((l) => l.code === v.laneCode) : undefined;
  const g = guidanceFor(v ? ({ state: v.state, laneCode: v.laneCode, transactionIds: v.txIds, prevState: v.prevState } as never) : undefined, lane);
  return (
    <div className="w-[220px] rounded-[2.2rem] border-[8px] border-zinc-900 bg-zinc-900 shadow-2xl">
      <div className="overflow-hidden rounded-[1.6rem] bg-bg">
        <div className="mx-auto mt-1 h-4 w-20 rounded-full bg-zinc-900" />
        <div className="flex flex-col gap-2 p-3">
          {v ? <IranPlate plate={v.plate} size="md" className="mx-auto" /> : <div className="h-8" />}
          <div className={cx("rounded-xl p-3 text-xs font-bold text-white", g.tone === "go" ? "bg-success" : g.tone === "stop" ? "bg-danger" : g.tone === "wait" ? "bg-warning" : "bg-shell")}>{locale === "fa" ? g.fa : g.en}</div>
          <div className="rounded-xl bg-surface p-2 text-[10px]">
            {[L("دروازه", "Gate"), L("باسکول ۱", "Scale 1"), L("بارگیری", "Loading"), L("باسکول ۲", "Scale 2"), L("خروج", "Exit")].map((s, i) => (
              <div key={s} className="flex items-center gap-2 py-0.5">
                <span className={cx("size-3 rounded-full", i < 2 ? "bg-success" : i === 2 ? "bg-primary" : "bg-surface-2")} />
                {s}
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-white p-2">
            <div className="grid grid-cols-9 gap-[2px]">
              {Array.from({ length: 81 }).map((_, i) => (
                <span key={i} className={cx("aspect-square", (i * 7 + (i % 5)) % 3 === 0 ? "bg-black" : "bg-white")} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SectionTitle({ kicker, title, sub }: { kicker?: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      {kicker && <div className="mb-2 text-sm font-semibold text-primary">{kicker}</div>}
      <h2 className="text-3xl font-black tracking-tight md:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-muted">{sub}</p>}
    </div>
  );
}

export function JourneySection({ detailed }: { detailed?: boolean }) {
  const L = useL();
  const locale = useLocale();
  const [active, setActive] = useState(1);
  const s = STOPS[active];
  return (
    <section className="py-16" id="journey">
      <SectionTitle kicker={L("سفر کامیون", "The truck journey")} title={L("از دروازه تا رسید، در ۸ ایستگاه", "From gate to receipt in 8 stops")} sub={L("هر ایستگاه شواهد، قواعد و کنترل خودش را دارد — و همه در یک زنجیره قابل ممیزی ثبت می‌شوند.", "Every stop has its own evidence, rules and controls — all recorded in one auditable chain.")} />
      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto pb-3">
        {STOPS.map((st, i) => (
          <button key={st.n} onClick={() => setActive(i)} className={cx("flex min-w-[130px] flex-1 flex-col items-center gap-2 rounded-2xl border p-3 text-center transition", active === i ? "border-primary bg-primary text-white shadow-lg" : "border-border bg-surface hover:border-primary/50")}>
            <span className={cx("grid size-10 place-items-center rounded-full text-sm font-black", active === i ? "bg-white/20" : "bg-primary/10 text-primary")}>
              <st.icon className="size-5" />
            </span>
            <span className="text-xs font-bold">
              {locale === "fa" ? `ایستگاه ${st.n}` : `Stop ${st.n}`}
            </span>
            <span className="text-xs">{locale === "fa" ? st.fa : st.en}</span>
          </button>
        ))}
      </div>
      <Card className="mx-auto mt-4 grid max-w-6xl gap-6 p-6 md:grid-cols-2">
        <div>
          <div className="text-sm font-semibold text-primary">{locale === "fa" ? `ایستگاه ${s.n}` : `Stop ${s.n}`}</div>
          <h3 className="mt-1 text-2xl font-black">{locale === "fa" ? s.fa : s.en}</h3>
          <p className="mt-3 leading-7 text-muted">{locale === "fa" ? s.dfa : s.den}</p>
          <ul className="mt-4 flex flex-col gap-2">
            {s.bullets.map(([a, b]) => (
              <li key={a} className="flex items-center gap-2 text-sm">
                <Check className="size-4 text-success" />
                {locale === "fa" ? a : b}
              </li>
            ))}
          </ul>
          <Link href={s.href} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
            {L("مشاهده در دمو زنده", "See it in the live demo")} <ArrowLeft className="size-4 ltr:rotate-180" />
          </Link>
        </div>
        <div className="rounded-xl bg-surface-2 p-3">
          <StopVisual n={s.n} />
        </div>
      </Card>
      {detailed && (
        <div className="mx-auto mt-10 grid max-w-6xl gap-4 md:grid-cols-2">
          {STOPS.map((st) => (
            <Card key={st.n} className="grid grid-cols-[1fr_1.1fr] gap-4 p-4">
              <div>
                <div className="text-xs font-semibold text-primary">{locale === "fa" ? `ایستگاه ${st.n}` : `Stop ${st.n}`}</div>
                <div className="font-bold">{locale === "fa" ? st.fa : st.en}</div>
                <p className="mt-2 text-xs leading-6 text-muted">{locale === "fa" ? st.dfa : st.den}</p>
              </div>
              <div className="rounded-lg bg-surface-2 p-2">
                <StopVisual n={st.n} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

export function StopVisual({ n }: { n: number }) {
  const live = useLive();
  const plate = { d2: "47", letter: "ق", d3: "582", region: "67" };
  switch (n) {
    case 0:
      return (
        <div className="grid grid-cols-2 gap-2">
          <PhoneMock />
          <div className="flex flex-col justify-center gap-2 text-xs">
            {["SO-1405-1042 · 1,240 t", "PO-1405-1133 · 380 t", "HV-1405-1021 · 640 t"].map((x, i) => (
              <div key={x} className="rounded-lg bg-surface p-2 font-mono ltr">
                {x}
                <div className="mt-1 h-1.5 rounded bg-surface-2">
                  <div className="h-1.5 rounded bg-primary" style={{ width: `${40 + i * 20}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case 1:
      return <GatePortalSvg className="w-full" truck={{ color: "#1971c2" }} labels={{ anprFront: "ANPR", rfid: "RFID", uvss: "UVSS" }} />;
    case 2:
      return (
        <div className="rounded-lg bg-black p-3">
          <div className="grid grid-cols-3 gap-2 text-center font-mono text-amber-300">
            {["A", "B", "C"].map((c, i) => (
              <div key={c} className="rounded border border-zinc-700 p-2">
                <div className="text-xs text-zinc-400">LANE {c}</div>
                <div className="led text-xl">#{12 + i * 3}</div>
              </div>
            ))}
          </div>
        </div>
      );
    case 3:
    case 5:
      return (
        <div className="flex flex-col gap-2">
          <WeightDisplay variant="led" kg={n === 3 ? 16480 : 44620} stable size="sm" online />
          <ScaleDeckTop occupied beams={[true, true, true, true]} positionOk loaded={n === 5} color="#d9480f" className="w-full" />
        </div>
      );
    case 4:
      return <LidarGantrySvg className="w-full" truck={{ color: "#d9480f", loaded: true }} />;
    case 6:
      return (
        <div className="mx-auto w-48 rounded bg-white p-3 text-[10px] text-black shadow">
          <div className="border-b border-black pb-1 text-center font-bold">S1-261027-0042</div>
          <div className="my-2 flex justify-center">
            <IranPlate plate={plate} size="sm" />
          </div>
          <div className="text-center text-lg font-black">28,140 kg</div>
          <div className="mt-2 h-8 bg-[repeating-linear-gradient(90deg,#000_0_2px,#fff_2px_4px,#000_4px_5px,#fff_5px_8px)]" />
        </div>
      );
    case 7:
      return (
        <div className="grid grid-cols-2 items-center gap-2">
          <PhoneMock />
          <div className="rounded-xl bg-success p-3 text-center text-white">
            <ShieldCheck className="mx-auto size-8" />
            <div className="mt-1 font-black">VALID</div>
            <div className="text-[10px]">EX-261027-0042</div>
          </div>
        </div>
      );
    default:
      return <CameraFeed view="front" seed={3} plate={plate} at={live?.now} />;
  }
}

export function ScanSection() {
  const L = useL();
  const live = useLive();
  const items = [
    { t: L("اسکن دروازه", "Gate portal scan"), d: L("ANPR جلو و عقب، RFID و دوربین نما در یک دکل", "Front & rear ANPR, RFID and overview cam on one gantry"), v: <GatePortalSvg className="w-full" truck={{ color: "#2f9e44" }} /> },
    { t: L("اسکن بالای بار", "Overhead load scan"), d: L("LiDAR سه‌بعدی: حجم، قله، بار خارج از مرکز، روکش", "3D LiDAR: volume, peak, off-centre load, tarp"), v: <LidarGantrySvg className="w-full" truck={{ color: "#e8590c", loaded: true }} /> },
    { t: L("اسکن زیر خودرو", "Under-vehicle scan"), d: L("تصویر line-scan شاسی و مقایسه با مرجع خودرو", "Chassis line-scan compared to the vehicle reference"), v: <UvssImage anomalies={[{ x: 0.4, y: 0.45, w: 0.1, h: 0.1, label: "", score: 0.84 }]} className="w-full rounded-lg" /> },
    { t: L("موقعیت روی باسکول", "Position on the deck"), d: L("ماسک ROI تصویری + پرتوهای IR برای همه محورها", "Vision ROI mask + IR beams for every axle"), v: <CameraFeed view="top" seed={21} color="#1971c2" loaded roi="bad" label="CAM-TOP · ROI" at={live?.now} /> },
  ];
  return (
    <section className="bg-surface py-16" id="scan">
      <SectionTitle kicker={L("مرکز اسکن", "Scan center")} title={L("هر کامیون از ۴ زاویه اسکن می‌شود", "Every truck is scanned from 4 angles")} sub={L("دروازه، بالای بار، زیر خودرو و موقعیت چرخ‌ها — همه به تراکنش گره می‌خورند.", "Gate, overhead load, under-vehicle and wheel position — all tied to the transaction.")} />
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
        {items.map((it) => (
          <Card key={it.t} className="overflow-hidden">
            <div className="bg-surface-2 p-3">{it.v}</div>
            <div className="p-4">
              <div className="font-bold">{it.t}</div>
              <div className="mt-1 text-sm text-muted">{it.d}</div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function ControlsGrid() {
  const locale = useLocale();
  return (
    <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {CONTROLS.map((c) => (
        <Card key={c.n} className="p-4">
          <div className="text-2xl font-black text-primary">{c.n}</div>
          <div className="mt-1 font-bold">{locale === "fa" ? c.fa : c.en}</div>
          <div className="mt-2 text-xs leading-6 text-muted">{locale === "fa" ? c.dfa : c.den}</div>
        </Card>
      ))}
    </div>
  );
}

export function DriverSection() {
  const L = useL();
  return (
    <section className="py-16" id="driver">
      <SectionTitle kicker={L("تجربه راننده", "Driver experience")} title={L("راننده همیشه می‌داند چه کند", "Drivers always know what to do")} sub={L("مانیتور بزرگ کنار باسکول، لینک موبایل و کیوسک لمسی — یک منبع پیام برای هر سه.", "A big display by the scale, a mobile link and a touch kiosk — one message source for all three.")} />
      <div className="mx-auto grid max-w-6xl items-center gap-6 md:grid-cols-3">
        <Card className="overflow-hidden bg-black p-5 text-center text-white">
          <TrafficLight state="GREEN" size={26} horizontal />
          <div className="dotmatrix mt-4 text-2xl text-[#22ff88]">✓ {L("وزن ثبت شد — به بارگیری بروید", "Weight recorded — go to loading")}</div>
          <div className="led mt-3 text-4xl text-[#22ff88]">16,480 kg</div>
          <div className="mt-3 text-xs text-zinc-500">{L("مانیتور بیرونی ۵۵ اینچ", "55\" outdoor display")}</div>
        </Card>
        <div className="flex justify-center">
          <PhoneMock />
        </div>
        <Card className="flex flex-col items-center gap-3 p-5">
          <DeviceArt type="KIOSK" className="h-36" />
          <div className="text-sm font-semibold">{L("کیوسک: اسکن QR، چاپ رسید، اینترکام، راهنمای صوتی", "Kiosk: QR scan, receipt, intercom, voice guidance")}</div>
          <div className="flex gap-2">
            <Link href="/display/B" target="_blank" className="text-xs text-primary">
              {L("مانیتور", "Display")} ↗
            </Link>
            <Link href="/d" target="_blank" className="text-xs text-primary">
              {L("پورتال", "Portal")} ↗
            </Link>
            <Link href="/kiosk/B" target="_blank" className="text-xs text-primary">
              {L("کیوسک", "Kiosk")} ↗
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}

export function ConnectDiagram() {
  const L = useL();
  const field = [
    { t: "INDICATOR", fa: "نمایشگر وزن", en: "Indicator", p: "RS-232/485 · TCP" },
    { t: "CAMERA_ANPR", fa: "دوربین‌ها", en: "Cameras", p: "RTSP / ONVIF" },
    { t: "RFID_READER", fa: "RFID", en: "RFID", p: "LLRP / TCP" },
    { t: "PLC", fa: "PLC و راهبند", en: "PLC & barriers", p: "Modbus · DI/DO" },
    { t: "LIDAR", fa: "LiDAR", en: "LiDAR", p: "Ethernet/UDP" },
    { t: "UVSS", fa: "UVSS", en: "UVSS", p: "GigE Vision" },
  ] as const;
  return (
    <div className="mx-auto grid max-w-6xl items-center gap-4 lg:grid-cols-[1.2fr_auto_1fr_auto_1fr]">
      <Card className="p-4">
        <div className="mb-2 text-xs font-semibold text-muted">{L("شبکه میدانی (OT)", "Field network (OT)")}</div>
        <div className="grid grid-cols-3 gap-2">
          {field.map((f) => (
            <div key={f.t} className="rounded-lg bg-surface-2 p-2 text-center">
              <DeviceArt type={f.t} className="mx-auto h-12" />
              <div className="text-[11px] font-semibold">{L(f.fa, f.en)}</div>
              <div className="text-[10px] text-muted ltr">{f.p}</div>
            </div>
          ))}
        </div>
      </Card>
      <Cable className="mx-auto size-8 text-primary lg:rotate-0" />
      <Card className="p-4 text-center">
        <Router className="mx-auto size-10 text-primary" />
        <div className="mt-2 font-bold">Edge Gateway</div>
        <div className="mt-1 text-xs text-muted">{L("آداپتورهای دستگاه، interlock، صف آفلاین، Windows COM agent یا ماژول Wi-Fi", "Device adapters, interlock, offline queue, Windows COM agent or Wi-Fi module")}</div>
        <div className="mt-2 flex justify-center gap-2 text-xs">
          <span className="rounded bg-success/10 px-2 py-0.5 text-success">UPS</span>
          <span className="rounded bg-info/10 px-2 py-0.5 text-info">mTLS</span>
          <span className="rounded bg-warning/10 px-2 py-0.5 text-warning">WAL</span>
        </div>
      </Card>
      <Wifi className="mx-auto size-8 text-primary" />
      <Card className="p-4">
        <div className="flex items-center gap-2 font-bold">
          <Database className="size-5 text-primary" /> {L("هسته مرکزی", "Central core")}
        </div>
        <ul className="mt-2 flex flex-col gap-1 text-xs text-muted">
          <li className="flex items-center gap-1"><Cpu className="size-3.5" /> {L("تراکنش، حواله، قوانین، audit", "Transactions, permits, rules, audit")}</li>
          <li className="flex items-center gap-1"><Monitor className="size-3.5" /> {L("داشبورد، گزارش، wallboard", "Dashboard, reports, wallboard")}</li>
          <li className="flex items-center gap-1"><Smartphone className="size-3.5" /> {L("پورتال راننده، اسکن حراست (PWA)", "Driver portal, guard scan (PWA)")}</li>
          <li className="flex items-center gap-1"><Cable className="size-3.5" /> {L("ERP outbox، API، webhook", "ERP outbox, API, webhooks")}</li>
        </ul>
      </Card>
    </div>
  );
}

export function PricingTable() {
  const L = useL();
  const locale = useLocale();
  return (
    <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
      {PLANS.map((p) => (
        <Card key={p.id} className={cx("flex flex-col p-6", p.featured && "border-2 border-primary shadow-xl")}>
          {p.featured && <div className="mb-2 self-start rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-white">{L("پرفروش", "Most popular")}</div>}
          <div className="text-xl font-black">{locale === "fa" ? p.fa : p.en}</div>
          <div className="mt-1 text-sm text-muted">{locale === "fa" ? p.price[0] : p.price[1]}</div>
          <ul className="mt-5 flex flex-1 flex-col gap-2">
            {p.features.map(([a, b]) => (
              <li key={a} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-success" />
                {locale === "fa" ? a : b}
              </li>
            ))}
          </ul>
          <Link href="#request" className="mt-6">
            <Button className="w-full" variant={p.featured ? "primary" : "secondary"}>
              {L("درخواست مشاوره", "Request a consultation")}
            </Button>
          </Link>
        </Card>
      ))}
    </div>
  );
}

export function FaqSection() {
  const locale = useLocale();
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-2">
      {FAQ.map(([qfa, qen, afa, aen], i) => (
        <Card key={qfa} className="overflow-hidden">
          <button className="flex w-full items-center justify-between p-4 text-start font-semibold" onClick={() => setOpen(open === i ? -1 : i)}>
            {locale === "fa" ? qfa : qen}
            <span className="text-primary">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && <div className="px-4 pb-4 text-sm leading-7 text-muted">{locale === "fa" ? afa : aen}</div>}
        </Card>
      ))}
    </div>
  );
}

export function RequestForm() {
  const L = useL();
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  return (
    <Card className="mx-auto max-w-2xl p-6" id="request">
      <div className="text-xl font-black">{L("درخواست دمو و مشاوره استقرار", "Request a demo & deployment consultation")}</div>
      <div className="mt-1 text-sm text-muted">{L("تعداد باسکول، لاین‌ها و تجهیزات موجود را بگویید تا طرح پیشنهادی ارسال شود.", "Tell us your scales, lanes and existing equipment and we'll send a proposal.")}</div>
      <form
        className="mt-4 grid gap-3 md:grid-cols-2"
        onSubmit={async (e) => {
          e.preventDefault();
          await act("demo.request", { company, phone });
          toast.success(L("درخواست ثبت شد — با شما تماس می‌گیریم (نمونه)", "Request received — we'll be in touch (demo)"));
          setCompany("");
          setPhone("");
        }}
      >
        <Field label={L("نام شرکت / معدن", "Company / mine")}>
          <Input value={company} onChange={(e) => setCompany(e.target.value)} required />
        </Field>
        <Field label={L("تلفن", "Phone")}>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="ltr" />
        </Field>
        <Field label={L("تعداد باسکول", "Number of scales")}>
          <Input type="number" defaultValue={2} />
        </Field>
        <Field label={L("ماده اصلی", "Main material")}>
          <Input placeholder={L("سنگ آهن، مس، سنگ آهک…", "Iron ore, copper, limestone…")} />
        </Field>
        <Button variant="primary" size="lg" className="md:col-span-2" type="submit">
          {L("ارسال درخواست", "Send request")}
        </Button>
      </form>
    </Card>
  );
}
