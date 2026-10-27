"use client";
import { Printer } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, use } from "react";
import { Barcode, origin, Qr } from "@/components/domain/codes";
import { IranPlate } from "@/components/domain/IranPlate";
import { CameraFeed } from "@/components/hardware/CameraFeed";
import { LogoMark } from "@/components/shell/Logo";
import { Button, cx, Segmented, Skeleton } from "@/components/ui";
import { BRAND } from "@/config/brand";
import { lbl, OPERATION } from "@/i18n/labels";
import { fmtDateTime, fmtNum } from "@/lib/format";
import { useMasters, useView } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import { userName } from "@/lib/users";
import type { VisitDetail } from "@/server/views";
import { useRouter } from "next/navigation";

function Ticket({ id }: { id: string }) {
  const L = useL();
  const locale = useLocale();
  const sp = useSearchParams();
  const router = useRouter();
  const tpl = (sp.get("tpl") as "a5" | "thermal" | "simple") ?? "a5";
  const masters = useMasters();
  const { data } = useView<VisitDetail & { focusTxId: string }>("tx", { id }, 10000);
  if (!data) return <Skeleton className="m-10 h-96" />;
  const tx = data.transactions.find((t) => t.id === data.focusTxId)!;
  const w1 = data.weighEvents.find((w) => w.id === tx.firstWeighId);
  const w2 = data.weighEvents.find((w) => w.id === tx.secondWeighId);
  const mat = masters?.materials.find((m) => m.id === tx.materialId);
  const cus = masters?.customers.find((c) => c.id === tx.customerId);
  const loc = (x?: string) => masters?.locations.find((l) => l.id === x);
  const url = `${origin()}/verify/${tx.verifyCode}`;
  const rows: [string, string][] = [
    [L("مشتری", "Customer"), (locale === "fa" ? cus?.name : cus?.nameEn) ?? "—"],
    [L("ماده", "Material"), `${(locale === "fa" ? mat?.name : mat?.nameEn) ?? "—"} (${mat?.grade ?? ""})`],
    [L("عملیات", "Operation"), lbl(OPERATION, tx.operation, locale)],
    [L("حواله", "Permit"), data.permit?.permitNo ?? "—"],
    [L("مبدأ ← مقصد", "Origin → destination"), `${(locale === "fa" ? loc(tx.originId)?.name : loc(tx.originId)?.nameEn) ?? ""} ← ${(locale === "fa" ? loc(tx.destinationId)?.name : loc(tx.destinationId)?.nameEn) ?? ""}`],
    [L("راننده", "Driver"), (locale === "fa" ? data.driver?.name : data.driver?.nameEn) ?? "—"],
    [L("حمل‌کننده", "Carrier"), (locale === "fa" ? data.carrier?.name : data.carrier?.nameEn) ?? "—"],
    [L("وزن اول", "1st weight"), `${fmtNum(w1?.weightKg, locale)} kg · ${fmtDateTime(w1?.capturedAt, locale)} · ${w1?.scaleId ?? ""}`],
    [L("وزن دوم", "2nd weight"), `${fmtNum(w2?.weightKg, locale)} kg · ${fmtDateTime(w2?.capturedAt, locale)} · ${w2?.scaleId ?? ""}`],
    [L("ناخالص / تارا", "Gross / tare"), `${fmtNum(tx.grossKg, locale)} / ${fmtNum(tx.tareKg, locale)} kg`],
    [L("کسر مجاز", "Deduction"), `${fmtNum(tx.deductionKg, locale)} kg`],
    [L("اپراتور / تأیید", "Operator / approver"), `${userName(tx.createdBy, locale)} / ${userName(tx.approvedBy, locale)}`],
  ];
  return (
    <div className="min-h-screen bg-zinc-200 py-6 print:bg-white print:py-0">
      <div className="no-print mx-auto mb-4 flex max-w-3xl items-center justify-between px-4">
        <Segmented size="md" options={[{ id: "a5", label: "A5" }, { id: "thermal", label: L("حرارتی ۸۰mm", "Thermal 80mm") }, { id: "simple", label: L("ساده", "Simple") }]} value={tpl} onChange={(v) => router.replace(`?tpl=${v}`)} />
        <Button variant="primary" onClick={() => window.print()}>
          <Printer className="size-4" /> {L("چاپ", "Print")}
        </Button>
      </div>
      <div className={cx("mx-auto bg-white text-black shadow-xl print:shadow-none", tpl === "thermal" ? "w-[80mm] p-3 text-[11px]" : tpl === "simple" ? "w-[148mm] p-6 text-sm" : "w-[210mm] p-8 text-sm")} style={{ fontFamily: "Vazirmatn Variable, sans-serif" }}>
        <div className={cx("flex items-start justify-between border-b-2 border-black pb-3", tpl === "thermal" && "flex-col items-center gap-1 text-center")}>
          <div className="flex items-center gap-2">
            <LogoMark size={tpl === "thermal" ? 28 : 40} />
            <div>
              <div className="font-extrabold">{locale === "fa" ? BRAND.name : BRAND.nameEn}</div>
              <div className="text-[10px] text-zinc-600">{L("شرکت معدنی نمونه — سایت مرکزی", "Demo Mining Co. — central site")}</div>
            </div>
          </div>
          <div className={cx("text-end", tpl === "thermal" && "text-center")}>
            <div className="text-[10px] text-zinc-600">{L("قبض توزین", "Weighbridge ticket")}</div>
            <div className="font-mono text-lg font-bold ltr">{tx.ticketNo}</div>
            {tx.printCount > 1 && <div className="text-[10px] font-bold text-red-700">{L(`نسخه چاپ مجدد شماره ${tx.printCount}`, `REPRINT #${tx.printCount}`)}</div>}
            {tx.state === "VOIDED" && <div className="text-base font-black text-red-700">{L("ابطال شده", "VOID")}</div>}
          </div>
        </div>
        <div className={cx("my-3 flex items-center justify-between gap-3", tpl === "thermal" && "flex-col")}>
          <IranPlate plate={data.vehicle.plate} size={tpl === "thermal" ? "md" : "lg"} />
          <div className="text-center">
            <div className="text-[10px] text-zinc-600">{L("وزن خالص", "NET WEIGHT")}</div>
            <div className="num text-3xl font-black">{fmtNum(tx.netKg, locale)} kg</div>
            {tx.deductionKg > 0 && <div className="text-[10px]">{L("قابل صورت‌حساب", "Billable")}: {fmtNum(tx.billableKg, locale)} kg</div>}
          </div>
        </div>
        <table className="w-full border-collapse">
          <tbody>
            {(tpl === "simple" ? rows.slice(0, 7).concat(rows.slice(9, 10)) : rows).map(([k, v]) => (
              <tr key={k} className="border-b border-dashed border-zinc-300">
                <td className="py-1 text-zinc-600">{k}</td>
                <td className="py-1 text-end font-medium">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {tpl === "a5" && (
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {data.evidence.filter((e) => e.stage === "SCALE_1" || e.stage === "SCALE_2").slice(0, 8).map((e) => (
              <CameraFeed key={e.id} view={e.kind === "CAM_REAR" ? "rear" : e.kind === "CAM_TOP" ? "top" : e.kind === "CAM_SIDE" ? "side" : "front"} seed={e.seed} plate={data.vehicle.plate} color={data.vehicle.color} loaded={e.loaded} label={e.cameraId} at={e.capturedAt} compact rec={false} />
            ))}
          </div>
        )}
        <div className={cx("mt-4 flex items-end justify-between gap-3", tpl === "thermal" && "flex-col items-center")}>
          <div className="flex flex-col items-center">
            <Qr value={url} size={tpl === "thermal" ? 110 : 120} />
            <div className="mt-1 text-[9px] text-zinc-600">{L("اسکن برای راستی‌آزمایی آنلاین", "Scan to verify online")}</div>
          </div>
          <Barcode value={tx.ticketNo} height={tpl === "thermal" ? 36 : 46} />
          {tpl !== "thermal" && (
            <div className="text-center text-[10px] text-zinc-600">
              <div className="mb-8">{L("امضای اپراتور", "Operator signature")}</div>
              <div className="border-t border-zinc-400 px-8 pt-1">{L("امضای راننده", "Driver signature")}</div>
            </div>
          )}
        </div>
        <div className="mt-3 border-t border-zinc-300 pt-2 text-center text-[9px] text-zinc-500">
          {L("وزن از نمایشگر کالیبره (گواهی معتبر) ثبت شده است. حجم LiDAR و payload فقط اطلاعاتی‌اند.", "Weight recorded from a calibrated indicator. LiDAR volume and payload are informational only.")} · v{tx.version} · {L("نسخه نمایشی", "DEMO")}
        </div>
      </div>
    </div>
  );
}

export default function PrintTicket({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense>
      <Ticket id={id} />
    </Suspense>
  );
}
