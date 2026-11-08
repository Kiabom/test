"use client";
import { BookOpen, Smartphone } from "lucide-react";
import Link from "next/link";
import { VehicleTag } from "@/components/domain/VehicleTag";
import { Logo } from "@/components/shell/Logo";
import { Card, Skeleton } from "@/components/ui";
import { lbl, VISIT_STATE } from "@/i18n/labels";
import { useLive } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";

export default function DriverIndex() {
  const L = useL();
  const locale = useLocale();
  const live = useLive();
  return (
    <div className="mx-auto max-w-md p-4">
      <Logo locale={locale} />
      <h1 className="mt-6 flex items-center gap-2 text-lg font-bold">
        <Smartphone className="size-5" /> {L("پورتال موبایل راننده — لینک‌های نمونه", "Driver mobile portal — sample links")}
      </h1>
      <p className="mt-1 text-sm text-muted">{L("در عمل، این لینک با پیامک به گوشی راننده ارسال می‌شود. یکی از سفرهای فعال را انتخاب کنید:", "In production this link is sent to the driver's phone by SMS. Pick an active trip:")}</p>
      <Link href="/d/guide" className="mt-3 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm font-semibold text-primary">
        <BookOpen className="size-4" /> {L("راهنمای کامل راننده: همه مراحل، نقشه و مسیریابی", "Full driver guide: every step, map and navigation")}
      </Link>
      <div className="mt-4 flex flex-col gap-2">
        {!live && <Skeleton className="h-40" />}
        {live?.activeIds.map((id) => {
          const v = live.visits[id];
          return (
            <Link key={id} href={`/d/${v.driverToken}`}>
              <Card className="flex items-center justify-between gap-3 p-3 hover:border-primary">
                <VehicleTag plate={v.plate} size="sm" />
                <div className="text-end text-xs">
                  <div className="font-semibold">{locale === "fa" ? v.driverName : v.driverNameEn}</div>
                  <div className="text-muted">{lbl(VISIT_STATE, v.state, locale)}</div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
