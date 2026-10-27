"use client";
import { CheckCircle2, DoorOpen, Keyboard, ScanQrCode, XCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { IranPlate } from "@/components/domain/IranPlate";
import { QrScanner } from "@/components/domain/QrScanner";
import { CameraFeed } from "@/components/hardware/CameraFeed";
import { Badge, Button, Card, CardHeader, cx, Input, Kv, PageHeader, toast } from "@/components/ui";
import type { ExitPermit, Permit, Transaction } from "@/domain/types";
import { ERRORS, lbl, PERMIT_STATUS } from "@/i18n/labels";
import { fmtDateTime, fmtKg, fmtTime } from "@/lib/format";
import { act, ActionError, useData, useLive, useMasters } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import { userName } from "@/lib/users";

type ScanRes =
  | { ok: boolean; kind: "EXIT_PERMIT"; permit?: ExitPermit; visit?: { id: string; vehicleId: string }; reason?: string; usedAt?: string; usedBy?: string }
  | { ok: boolean; kind: "TICKET"; tx: Transaction; reason?: string }
  | { ok: boolean; kind: "PERMIT"; permit: Permit; reason?: string }
  | { ok: false; kind: "UNKNOWN"; reason: string };

export default function GuardPage() {
  const L = useL();
  const locale = useLocale();
  const masters = useMasters();
  const live = useLive();
  const [active, setActive] = useState(false);
  const [code, setCode] = useState("");
  const [res, setRes] = useState<ScanRes | null>(null);
  const [history, setHistory] = useState<{ at: number; code: string; ok: boolean; kind: string }[]>([]);
  const { data: eps } = useData<ExitPermit>("exitPermits", { status: "APPROVED", limit: 8 }, 3000);

  const scan = useCallback(
    async (raw: string) => {
      try {
        const r = await act<ScanRes>("scan", { code: raw });
        setRes(r);
        setHistory((h) => [{ at: Date.now(), code: raw.slice(-24), ok: r.ok, kind: r.kind }, ...h].slice(0, 12));
        if (r.ok) {
          navigator.vibrate?.([60, 40, 60]);
        } else navigator.vibrate?.(400);
      } catch (e) {
        toast.error(e instanceof ActionError ? lbl(ERRORS, e.code, locale) : String(e));
      }
    },
    [locale],
  );
  const onToggle = useCallback((v: boolean) => setActive(v), []);
  const veh = (id?: string) => masters?.vehicles.find((v) => v.id === id);
  const resVehicle = res && res.kind === "EXIT_PERMIT" ? veh(res.visit?.vehicleId) : res && res.kind === "TICKET" ? veh(res.tx.vehicleId) : undefined;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader icon={<ScanQrCode className="size-5" />} title={L("اسکن حراست", "Guard scanner")} subtitle={L("اسکن آنلاین مجوز خروج، تیکت توزین، حواله یا برگه سفر با دوربین گوشی", "Online scan of exit permits, tickets, permits or trip slips with a phone camera")} />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Card className="p-4">
            <QrScanner active={active} onToggle={onToggle} onResult={scan} />
          </Card>
          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Keyboard className="size-4" /> {L("ورود دستی کد / سریال", "Manual code / serial")}
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (code.trim()) scan(code.trim());
              }}
            >
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="EX-261027-0012 / S1-… / SO-1405-…" className="font-mono ltr" />
              <Button variant="primary" type="submit">
                {L("بررسی", "Check")}
              </Button>
            </form>
            <div className="mt-3 text-xs text-muted">{L("نمونه‌های آماده اسکن (مجوزهای خروج فعال):", "Ready-to-scan samples (active exit permits):")}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {eps?.items.map((e) => (
                <button key={e.id} onClick={() => scan(e.token)} className="rounded-lg border border-border px-2 py-1 font-mono text-[11px] hover:bg-surface-2 ltr">
                  {e.serial}
                </button>
              ))}
              {!eps?.items.length && <span className="text-xs text-muted">{L("فعلاً مجوز فعالی نیست", "No active permits right now")}</span>}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          {res ? (
            <div className={cx("rise rounded-2xl p-5 text-white shadow-lg", res.ok ? "bg-success" : "bg-danger")}>
              <div className="flex items-center gap-3">
                {res.ok ? <CheckCircle2 className="size-12" /> : <XCircle className="size-12" />}
                <div>
                  <div className="text-2xl font-black">{res.ok ? L("مجاز", "VALID") : L("غیرمجاز", "REJECTED")}</div>
                  <div className="text-sm opacity-90">
                    {res.kind === "EXIT_PERMIT" && (res.ok ? L("مجوز خروج پذیرفته و مصرف شد", "Exit permit accepted and consumed") : res.reason === "USED" ? L("این QR قبلاً استفاده شده است!", "This QR was already used!") : res.reason === "CANCELLED" ? L("مجوز ابطال شده", "Permit cancelled") : L("کد نامعتبر", "Invalid code"))}
                    {res.kind === "TICKET" && (res.ok ? L("تیکت معتبر و تأییدشده", "Valid approved ticket") : res.reason === "VOIDED" ? L("تیکت ابطال شده", "Ticket voided") : L("تیکت هنوز تأیید نشده", "Ticket not approved yet"))}
                    {res.kind === "PERMIT" && (res.ok ? L("حواله فعال", "Active permit") : L("حواله نامعتبر", "Invalid permit"))}
                    {res.kind === "UNKNOWN" && L("کد ناشناخته", "Unknown code")}
                  </div>
                </div>
              </div>
              {resVehicle && (
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/15 p-3">
                  <IranPlate plate={resVehicle.plate} size="md" />
                  <CameraFeed view="front" plate={resVehicle.plate} color={resVehicle.color} seed={resVehicle.id.length * 77} className="w-32" compact rec={false} />
                </div>
              )}
              <div className="mt-3 space-y-1 text-sm">
                {res.kind === "EXIT_PERMIT" && res.permit && (
                  <>
                    <div className="font-mono ltr">{res.permit.serial}</div>
                    {res.reason === "USED" && (
                      <div className="rounded-lg bg-black/25 p-2">
                        {L("مصرف شده در", "Consumed at")} {fmtDateTime(res.usedAt, locale)} {L("توسط", "by")} {userName(res.usedBy, locale)} — {L("هشدار امنیتی R36 ثبت شد", "security alert R36 raised")}
                      </div>
                    )}
                  </>
                )}
                {res.kind === "TICKET" && (
                  <>
                    <div className="font-mono ltr">{res.tx.ticketNo}</div>
                    <div>
                      {(locale === "fa" ? masters?.materials.find((m) => m.id === res.tx.materialId)?.name : masters?.materials.find((m) => m.id === res.tx.materialId)?.nameEn) ?? ""} · {fmtKg(res.tx.netKg, locale)}
                    </div>
                  </>
                )}
                {res.kind === "PERMIT" && (
                  <>
                    <div className="font-mono ltr">{res.permit.permitNo}</div>
                    <div>{lbl(PERMIT_STATUS, res.permit.status, locale)}</div>
                  </>
                )}
              </div>
              {res.ok && res.kind === "EXIT_PERMIT" && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/20 p-3 text-sm">
                  <DoorOpen className="size-5" /> {L("درخواست باز شدن راهبند لاین E به PLC ارسال شد", "Barrier open request sent to PLC (lane E)")}
                  <Badge tone="neutral" className="ms-auto bg-white/80 text-black">
                    {live?.lanes.find((l) => l.code === "E")?.barrier}
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <Card className="grid min-h-60 place-items-center p-8 text-center text-muted">
              <div>
                <ScanQrCode className="mx-auto mb-3 size-14 opacity-50" />
                {L("QR مجوز خروج را از گوشی راننده یا رسید چاپی اسکن کنید", "Scan the exit QR from the driver's phone or the printed receipt")}
              </div>
            </Card>
          )}
          <Card>
            <CardHeader title={L("تاریخچه اسکن این دستگاه", "Scan history on this device")} />
            <ul className="divide-y divide-border">
              {history.map((h, i) => (
                <li key={i} className="flex items-center justify-between px-4 py-2 text-xs">
                  <span className="font-mono ltr">{h.code}</span>
                  <span className="text-muted">{h.kind}</span>
                  <Badge tone={h.ok ? "success" : "danger"}>{h.ok ? "OK" : "REJECT"}</Badge>
                  <span className="num text-muted">{fmtTime(h.at, locale, true)}</span>
                </li>
              ))}
              {!history.length && <li className="px-4 py-4 text-center text-xs text-muted">—</li>}
            </ul>
          </Card>
          <Kv k={L("قوانین", "Rules")} v={L("QR یک‌بارمصرف · مصرف اتمیک · اسکن دوم = هشدار", "One-time QR · atomic consume · second scan = alert")} />
        </div>
      </div>
    </div>
  );
}
