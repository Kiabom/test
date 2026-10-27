"use client";
import { CalendarClock, CheckCircle2, CircleDashed, FileText, MapPin, Phone, QrCode, Receipt, Truck } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { origin, Qr } from "@/components/domain/codes";
import { IranPlate } from "@/components/domain/IranPlate";
import { TrafficLight } from "@/components/domain/indicators";
import { Logo } from "@/components/shell/Logo";
import { Badge, Button, Card, cx, Kv, Skeleton, toast } from "@/components/ui";
import { visitProgress } from "@/domain/workflow";
import { lbl, VISIT_STATE } from "@/i18n/labels";
import { fmtKg, fmtNum, fmtTime } from "@/lib/format";
import { act, useView } from "@/lib/live";
import { useL, useLocale, usePrefs } from "@/lib/prefs";
import type { DriverView } from "@/server/views";

export default function DriverPortal({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const L = useL();
  const locale = useLocale();
  const setLocale = usePrefs((s) => s.setLocale);
  const { data, error } = useView<DriverView>("driver", { id: token }, 800);
  const [showQr, setShowQr] = useState(false);
  if (error) return <div className="p-10 text-center text-muted">{L("لینک نامعتبر یا منقضی است", "Link invalid or expired")}</div>;
  if (!data) return <Skeleton className="m-4 h-[80vh]" />;
  const v = data.visit;
  const tx = data.transactions.filter((t) => t.state !== "VOIDED").at(-1);
  const steps = [
    { id: "ARRIVED", fa: "دروازه", en: "Gate" },
    { id: "IN_SITE", fa: "صف", en: "Queue" },
    { id: "ON_SCALE_1", fa: "باسکول ۱", en: "Scale 1" },
    { id: "LOADING", fa: v.operation === "RECEIVE" ? "تخلیه" : "بارگیری", en: v.operation === "RECEIVE" ? "Unload" : "Load" },
    { id: "ON_SCALE_2", fa: "باسکول ۲", en: "Scale 2" },
    { id: "READY_TO_EXIT", fa: "مجوز خروج", en: "Exit permit" },
    { id: "EXITED", fa: "خروج", en: "Exit" },
  ];
  const map: Record<string, number> = { ARRIVED: 0, IDENTIFIED: 0, IN_SITE: 1, ON_SCALE_1: 2, LOADING: 3, ON_SCALE_2: 4, READY_TO_EXIT: 5, EXITED: 6 };
  const prog = v.state === "IN_SITE" && v.prevState === "LOADING" ? 4 : map[v.state === "HOLD" ? (v.prevState ?? "ARRIVED") : v.state] ?? visitProgress(v.state);
  const g = data.guidance;
  const onScale = data.laneLive?.kind === "SCALE";
  const exitUrl = data.exitPermit ? `${origin()}/x/${data.exitPermit.token}` : "";
  return (
    <div className="mx-auto min-h-screen max-w-md bg-bg pb-24">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface/95 px-4 py-2 backdrop-blur">
        <Logo locale={locale} />
        <button className="text-xs text-primary" onClick={() => setLocale(locale === "fa" ? "en" : "fa")}>
          {locale === "fa" ? "EN" : "فا"}
        </button>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <Card className="flex flex-col items-center gap-2 p-4">
          <IranPlate plate={data.vehicle.plate} size="lg" />
          <div className="text-sm text-muted">
            {locale === "fa" ? data.driver?.name : data.driver?.nameEn} · {L("نوبت", "Queue no")} <b className="num text-text">{fmtNum(v.queueNo, locale)}</b>
          </div>
          <Badge tone={v.state === "HOLD" ? "danger" : v.state === "EXITED" ? "success" : "info"}>{lbl(VISIT_STATE, v.state, locale)}</Badge>
        </Card>

        <div className={cx("rounded-2xl p-5 text-white shadow-lg", g.tone === "go" ? "bg-success" : g.tone === "stop" ? "bg-danger" : g.tone === "wait" ? "bg-warning" : "bg-shell")}>
          <div className="flex items-center gap-3">
            <TrafficLight state={g.light} size={14} />
            <div className="text-lg font-bold leading-7">{locale === "fa" ? g.fa : g.en}</div>
          </div>
          {data.queuePos != null && v.state === "IN_SITE" && (
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl bg-white/15 p-2">
                <div className="text-xs opacity-80">{L("نفر جلوتر از شما", "Ahead of you")}</div>
                <div className="num text-2xl font-black">{fmtNum(data.queuePos - 1, locale)}</div>
              </div>
              <div className="rounded-xl bg-white/15 p-2">
                <div className="text-xs opacity-80">{L("زمان تقریبی", "ETA")}</div>
                <div className="num text-2xl font-black">{fmtNum(data.etaMin, locale)} {L("دقیقه", "min")}</div>
              </div>
            </div>
          )}
          {onScale && (
            <div className="mt-3 rounded-xl bg-black/25 p-3 text-center">
              <div className="text-xs opacity-80">{L("وزن زنده باسکول", "Live scale weight")}</div>
              <div className="led text-4xl">{fmtNum(data.laneLive?.weightKg, "en")} kg</div>
              <div className="text-xs">{data.laneLive?.stable ? "STABLE ✓" : "MOTION…"}</div>
            </div>
          )}
        </div>

        <Card className="p-4">
          <ol className="flex flex-col gap-0">
            {steps.map((s, i) => (
              <li key={s.id} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div className={cx("grid size-7 place-items-center rounded-full", i < prog || v.state === "EXITED" ? "bg-success text-white" : i === prog ? "bg-primary text-white" : "bg-surface-2 text-muted")}>
                    {i < prog || v.state === "EXITED" ? <CheckCircle2 className="size-4" /> : i === prog ? <CircleDashed className="size-4 animate-spin" /> : i + 1}
                  </div>
                  {i < steps.length - 1 && <div className={cx("h-5 w-0.5", i < prog ? "bg-success" : "bg-border")} />}
                </div>
                <div className={cx("pb-5 text-sm", i === prog ? "font-bold" : "text-muted")}>{locale === "fa" ? s.fa : s.en}</div>
              </li>
            ))}
          </ol>
        </Card>

        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <FileText className="size-4" /> {L("حواله و بار", "Permit & load")}
          </div>
          <Kv k={L("حواله", "Permit")} v={<span className="font-mono ltr">{data.permit?.permitNo ?? "—"}</span>} />
          <Kv k={L("ماده", "Material")} v={locale === "fa" ? data.material?.name : data.material?.nameEn} />
          <Kv k={L("مقصد", "Destination")} v={<span className="flex items-center gap-1"><MapPin className="size-3.5" />{locale === "fa" ? data.destination?.name : data.destination?.nameEn}</span>} />
          {tx?.netKg != null && <Kv k={L("وزن خالص", "Net weight")} v={<b>{fmtKg(tx.netKg, locale)}</b>} />}
          {tx && (
            <Link href={`/print/ticket/${tx.id}?tpl=thermal`} target="_blank" className="mt-2 flex items-center gap-2 text-sm text-primary">
              <Receipt className="size-4" /> {L("مشاهده رسید توزین", "View weighbridge receipt")} ({tx.ticketNo})
            </Link>
          )}
        </Card>

        {data.exitPermit && (
          <Card className="flex flex-col items-center gap-3 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <QrCode className="size-4" /> {L("QR مجوز خروج", "Exit permit QR")}
            </div>
            {data.exitPermit.status === "APPROVED" ? (
              <>
                <div className="rounded-xl bg-white p-3">
                  <Qr value={exitUrl} size={showQr ? 240 : 180} />
                </div>
                <div className="font-mono text-sm ltr">{data.exitPermit.serial}</div>
                <div className="text-center text-xs text-muted">{L("این QR را در دروازه خروج به نگهبان نشان دهید. یک‌بارمصرف است.", "Show this QR to the guard at the exit gate. One-time use.")}</div>
                <Button size="sm" variant="ghost" onClick={() => setShowQr((s) => !s)}>
                  {showQr ? L("کوچک", "Smaller") : L("بزرگ‌نمایی", "Enlarge")}
                </Button>
              </>
            ) : (
              <Badge tone={data.exitPermit.status === "CONSUMED" ? "success" : "danger"}>{data.exitPermit.status === "CONSUMED" ? L(`استفاده شد ${fmtTime(data.exitPermit.consumedAt, locale)}`, `Used at ${fmtTime(data.exitPermit.consumedAt, "en")}`) : data.exitPermit.status}</Badge>
            )}
          </Card>
        )}

        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <CalendarClock className="size-4" /> {L("رزرو / تغییر نوبت سفر بعدی", "Book / change next slot")}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {data.freeSlots.map((s) => (
              <button key={s} onClick={async () => { await act("driver.book", { token, slot: s }); toast.success(L("نوبت رزرو شد", "Slot booked")); }} className="rounded-lg border border-border py-2 text-sm hover:border-primary">
                <span className="num">{fmtTime(s, locale)}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
      <div className="fixed inset-x-0 bottom-0 mx-auto flex max-w-md gap-2 border-t border-border bg-surface p-3">
        <Button className="flex-1" size="lg" variant="primary" onClick={async () => { await act("driver.callOperator", { token }); toast.success(L("درخواست تماس به اپراتور ارسال شد", "Call request sent to the operator")); }}>
          <Phone className="size-5" /> {L("تماس با اپراتور", "Call operator")}
        </Button>
        <Button size="lg" variant="secondary" onClick={() => window.location.reload()}>
          <Truck className="size-5" />
        </Button>
      </div>
    </div>
  );
}
