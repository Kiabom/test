"use client";
import { BellRing, CalendarClock, ListOrdered, MonitorPlay } from "lucide-react";
import Link from "next/link";
import { IranPlate } from "@/components/domain/IranPlate";
import { Badge, Button, Card, CardHeader, cx, PageHeader, Skeleton, Table, Td, toast } from "@/components/ui";
import type { Booking } from "@/domain/types";
import { ERRORS, lbl, VISIT_STATE } from "@/i18n/labels";
import { fmtDuration, fmtTime } from "@/lib/format";
import { act, ActionError, useData, useLive, useMasters } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import type { VisitBrief } from "@/server/views";

export default function QueuePage() {
  const L = useL();
  const locale = useLocale();
  const live = useLive();
  const masters = useMasters();
  const { data: bookings } = useData<Booking>("bookings", { limit: 40, order: "asc" }, 10000);
  if (!live) return <Skeleton className="h-96" />;
  const vs = (ids: string[]) => ids.map((id) => live.visits[id]).filter(Boolean) as VisitBrief[];
  const active = live.activeIds.map((id) => live.visits[id]);
  const columns: { id: string; title: string; items: VisitBrief[]; tone: string }[] = [
    { id: "wait", title: L("در صف باسکول", "Waiting for scale"), items: vs([...live.queues.B, ...live.queues.C]), tone: "border-warning" },
    { id: "gate", title: L("در دروازه / بررسی", "At gate / review"), items: active.filter((v) => ["ARRIVED", "IDENTIFIED", "HOLD"].includes(v.state)), tone: "border-info" },
    { id: "scale", title: L("روی باسکول", "On scale"), items: active.filter((v) => (v.state === "ON_SCALE_1" || v.state === "ON_SCALE_2") && v.laneCode), tone: "border-primary" },
    { id: "load", title: L("بارگیری / تخلیه", "Loading / unloading"), items: active.filter((v) => v.state === "LOADING"), tone: "border-success" },
    { id: "exit", title: L("آماده خروج", "Ready to exit"), items: active.filter((v) => v.state === "READY_TO_EXIT" || (v.state === "ON_SCALE_2" && !v.laneCode)), tone: "border-wn" },
  ];
  const call = async (lane: "B" | "C") => {
    try {
      await act("queue.callNext", { lane });
      toast.success(L("نفر بعد فراخوانده شد و پیامک ارسال شد", "Next driver called and SMS sent"));
    } catch (e) {
      toast.error(e instanceof ActionError ? lbl(ERRORS, e.code, locale) : String(e));
    }
  };
  return (
    <div>
      <PageHeader
        icon={<ListOrdered className="size-5" />}
        title={L("صف و نوبت‌دهی", "Queue & booking")}
        subtitle={L("مسیر هر کامیون در مراحل سایت + فراخوان با پیامک و تابلو", "Each truck's position across site stages + call by SMS and board")}
        actions={
          <>
            <Button variant="primary" onClick={() => call("B")}>
              <BellRing className="size-4" /> {L("فراخوان نفر بعد — باسکول ۱", "Call next — scale 1")}
            </Button>
            <Button onClick={() => call("C")}>{L("فراخوان — باسکول ۲", "Call — scale 2")}</Button>
            <Link href="/display/queue" target="_blank">
              <Button variant="ghost">
                <MonitorPlay className="size-4" /> {L("تابلو فراخوان", "Call board")}
              </Button>
            </Link>
          </>
        }
      />
      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
        {columns.map((c) => (
          <div key={c.id} className={cx("rounded-xl border-t-4 bg-surface-2 p-2", c.tone)}>
            <div className="mb-2 flex items-center justify-between px-1 text-sm font-semibold">
              {c.title}
              <Badge>{c.items.length}</Badge>
            </div>
            <div className="flex min-h-40 flex-col gap-2">
              {c.items.map((v) => (
                <Card key={v.id} className="p-2.5">
                  <div className="flex items-center justify-between">
                    <IranPlate plate={v.plate} size="sm" />
                    <span className="num text-xs font-bold">#{v.queueNo}</span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted">
                    <span>{lbl(VISIT_STATE, v.state, locale)}</span>
                    <span className="num">{fmtDuration(new Date(live.now).getTime() - new Date(v.queueJoinedAt ?? v.arrivedAt).getTime(), locale)}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-muted ltr">{v.permitNo}</span>
                    <Link href={`/d/${v.driverToken}`} target="_blank" className="text-primary">
                      {L("لینک راننده", "Driver link")}
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Card className="mt-4">
        <CardHeader title={L("رزرو اسلات‌های امروز", "Today's slot bookings")} icon={<CalendarClock className="size-4" />} subtitle={L("زمان‌بندی نوبت حمل برای کاهش صف (ظرفیت ۲ خودرو در هر ۳۰ دقیقه)", "Haul slot scheduling to cut queues (2 trucks per 30 min)")} />
        <Table head={[L("اسلات", "Slot"), L("پلاک", "Plate"), L("راننده", "Driver"), L("حواله", "Permit"), L("وضعیت", "Status")]}>
          {bookings?.items.map((b) => {
            const v = masters?.vehicles.find((x) => x.id === b.vehicleId);
            const d = masters?.drivers.find((x) => x.id === b.driverId);
            return (
              <tr key={b.id}>
                <Td className="num">
                  {fmtTime(b.slotStart, locale)}–{fmtTime(b.slotEnd, locale)}
                </Td>
                <Td>{v && <IranPlate plate={v.plate} size="xs" />}</Td>
                <Td>{locale === "fa" ? d?.name : d?.nameEn}</Td>
                <Td className="font-mono text-xs ltr">{masters?.permits.find((p) => p.id === b.permitId)?.permitNo}</Td>
                <Td>
                  <Badge tone="info">{b.status}</Badge>
                </Td>
              </tr>
            );
          })}
        </Table>
      </Card>
    </div>
  );
}
