"use client";
import { ArrowLeft, Radio, ScanLine, ShieldCheck, WifiOff } from "lucide-react";
import Link from "next/link";
import { ConnectDiagram, ControlsGrid, DriverSection, FaqSection, JourneySection, LaptopMock, PhoneMock, PricingTable, RequestForm, ScanSection, SectionTitle } from "@/components/marketing/Sections";
import { Button, Card } from "@/components/ui";
import { useL } from "@/lib/prefs";

export default function Home() {
  const L = useL();
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-bg to-bg">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
          <div className="rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">● {L("سامانه هوشمند توزین و تردد معدن", "Smart mine weighbridge & gate system")}</span>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight md:text-5xl">{L("از دروازه تا رسید — هر کیلوگرم ثبت، هر خروج کنترل‌شده", "From gate to receipt — every kilogram recorded, every exit controlled")}</h1>
            <p className="mt-5 text-lg leading-8 text-muted">{L("پلاک‌خوان و RFID، توزین دوگانه پایدار، اسکن بالا و زیر خودرو، مانیتور و لینک موبایل راننده، مجوز خروج QR یک‌بارمصرف و زنجیره ممیزی — در یک سامانه.", "ANPR & RFID, stable two-pass weighing, overhead & under-vehicle scans, driver display & mobile link, one-time QR exit permits and an audit chain — in one system.")}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/app">
                <Button size="lg" variant="primary">
                  {L("ورود به دمو زنده", "Open the live demo")} <ArrowLeft className="size-4 ltr:rotate-180" />
                </Button>
              </Link>
              <Link href="#request">
                <Button size="lg">{L("درخواست مشاوره", "Request consultation")}</Button>
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                [<ShieldCheck key="a" className="size-5" />, L("QR یک‌بارمصرف", "One-time QR")],
                [<Radio key="b" className="size-5" />, "ANPR + RFID"],
                [<ScanLine key="c" className="size-5" />, L("اسکن ۴ زاویه", "4-angle scan")],
                [<WifiOff key="d" className="size-5" />, L("کار آفلاین", "Works offline")],
              ].map(([i, t]) => (
                <div key={String(t)} className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold">
                  <span className="text-primary">{i}</span>
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <LaptopMock />
            <div className="absolute -bottom-6 end-0 hidden md:block">
              <PhoneMock />
            </div>
          </div>
        </div>
      </section>
      <JourneySection />
      <ScanSection />
      <section className="py-16" id="controls">
        <SectionTitle kicker={L("کنترل‌های ضدتقلب", "Anti-fraud controls")} title={L("۱۰ کنترل که دستکاری را سخت می‌کند", "10 controls that make tampering hard")} />
        <ControlsGrid />
      </section>
      <DriverSection />
      <section className="bg-surface py-16" id="connect">
        <SectionTitle kicker={L("اتصال سخت‌افزار", "Hardware connectivity")} title={L("مستقل از برند تجهیزات", "Vendor-independent")} sub={L("آداپتور جدا برای هر دستگاه؛ PLC مالک ایمنی است و قطع شبکه هرگز راهبند را باز نمی‌کند.", "A separate adapter per device; the PLC owns safety and a network outage never opens a barrier.")} />
        <ConnectDiagram />
      </section>
      <section className="py-16">
        <SectionTitle kicker={L("ماژول‌های معدنی", "Mining modules")} title={L("فراتر از باسکول", "Beyond the weighbridge")} />
        <div className="mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-4">
          {[
            [L("حجم‌سنجی LiDAR", "LiDAR volumetrics"), L("اسکن خالی/پر، حجم، carryback، بار خارج از مرکز", "Empty/loaded scans, volume, carryback, off-centre load"), "/app/modules/lidar"],
            [L("Payload لودر/شاول", "Loader/shovel payload"), L("سطل‌به‌سطل، هدف/واقعی و تطبیق با باسکول", "Bucket-by-bucket, target vs actual, scale reconciliation"), "/app/modules/payload"],
            [L("KPI ناوگان", "Fleet KPIs"), L("زمان چرخه، صف، بیکاری و هدف شیفت", "Cycle time, queue, idle and shift targets"), "/app/modules/fleet"],
            [L("سلامت و کالیبراسیون", "Health & calibration"), L("رانش لودسل، گواهی‌ها و قفل توزین تجاری", "Load-cell drift, certificates and legal-weighing lock"), "/app/devices"],
          ].map(([t, d, h]) => (
            <Link key={h} href={h}>
              <Card className="h-full p-5 transition hover:border-primary hover:shadow-lg">
                <div className="font-bold">{t}</div>
                <div className="mt-2 text-sm text-muted">{d}</div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
      <section className="bg-surface py-16" id="pricing">
        <SectionTitle kicker={L("قیمت‌گذاری", "Pricing")} title={L("سه سطح، متناسب با اندازه سایت", "Three tiers sized to your site")} />
        <div className="px-4">
          <PricingTable />
        </div>
      </section>
      <section className="py-16">
        <SectionTitle title={L("پرسش‌های پرتکرار", "FAQ")} />
        <div className="px-4">
          <FaqSection />
        </div>
      </section>
      <section className="px-4 pb-10">
        <RequestForm />
      </section>
    </>
  );
}
