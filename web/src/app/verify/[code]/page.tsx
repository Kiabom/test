"use client";
import { CheckCircle2, Clock, ShieldCheck, XCircle } from "lucide-react";
import { use } from "react";
import { Logo } from "@/components/shell/Logo";
import { cx, Kv, Skeleton } from "@/components/ui";
import { fmtDateTime, fmtKg } from "@/lib/format";
import { useFetch, useMasters } from "@/lib/live";
import { useL, useLocale, usePrefs } from "@/lib/prefs";

interface V {
  kind?: "TICKET" | "EXIT_PERMIT";
  status: "VALID" | "VOIDED" | "PENDING" | "USED" | "CANCELLED" | "INVALID";
  ticketNo?: string;
  plateMasked?: string;
  materialId?: string;
  netKg?: number;
  approvedAt?: string;
  consumedAt?: string;
  version?: number;
  printCount?: number;
}

export default function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const L = useL();
  const locale = useLocale();
  const setLocale = usePrefs((s) => s.setLocale);
  const { data, loading } = useFetch<V>(`/api/verify/${code}`, 99999);
  const masters = useMasters();
  const v: V = data ?? { status: "INVALID" };
  const ok = v.status === "VALID";
  const used = v.status === "USED";
  const mat = masters?.materials.find((m) => m.id === v.materialId);
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <Logo locale={locale} />
        <button className="text-xs text-primary" onClick={() => setLocale(locale === "fa" ? "en" : "fa")}>
          {locale === "fa" ? "English" : "فارسی"}
        </button>
      </div>
      {loading ? (
        <Skeleton className="h-72" />
      ) : (
        <div className={cx("rounded-2xl p-6 text-white shadow-xl", ok ? "bg-success" : used ? "bg-warning" : "bg-danger")}>
          <div className="flex items-center gap-3">
            {ok ? <CheckCircle2 className="size-12" /> : used ? <Clock className="size-12" /> : <XCircle className="size-12" />}
            <div>
              <div className="text-2xl font-black">
                {ok ? L("سند معتبر است", "Document is valid") : used ? L("مجوز قبلاً استفاده شده", "Permit already used") : v.status === "VOIDED" ? L("سند ابطال شده", "Document voided") : v.status === "PENDING" ? L("در انتظار تأیید", "Pending approval") : L("سند نامعتبر", "Invalid document")}
              </div>
              <div className="text-sm opacity-90">{v.kind === "EXIT_PERMIT" ? L("مجوز خروج", "Exit permit") : v.kind === "TICKET" ? L("قبض توزین", "Weighbridge ticket") : L("کد", "Code")} · <span className="font-mono ltr">{code}</span></div>
            </div>
          </div>
        </div>
      )}
      {data && (
        <div className="rounded-2xl border border-border bg-surface p-4">
          <Kv k={L("شماره سند", "Document no")} v={<span className="font-mono ltr">{v.ticketNo}</span>} />
          <Kv k={L("پلاک (ماسک‌شده)", "Plate (masked)")} v={v.plateMasked} />
          {mat && <Kv k={L("ماده", "Material")} v={locale === "fa" ? mat.name : mat.nameEn} />}
          {v.netKg != null && <Kv k={L("وزن خالص", "Net weight")} v={fmtKg(v.netKg, locale)} />}
          <Kv k={L("تاریخ تأیید", "Approved")} v={fmtDateTime(v.approvedAt, locale)} />
          {v.consumedAt && <Kv k={L("زمان خروج", "Exit time")} v={fmtDateTime(v.consumedAt, locale)} />}
          {v.version != null && v.kind === "TICKET" && <Kv k={L("نسخه / چاپ", "Version / prints")} v={`v${v.version} / ${v.printCount}`} />}
        </div>
      )}
      <div className="flex items-start gap-2 rounded-xl bg-surface-2 p-3 text-xs text-muted">
        <ShieldCheck className="size-4 shrink-0" />
        {L("این صفحه فقط حداقل اطلاعات لازم برای راستی‌آزمایی را نشان می‌دهد و اطلاعات شخصی راننده را افشا نمی‌کند.", "This page only shows the minimum data needed for verification and never exposes driver personal data.")}
      </div>
    </div>
  );
}
