"use client";
import { ClipboardCheck, PenLine, QrCode } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { origin, Qr } from "@/components/domain/codes";
import { VehicleTag } from "@/components/domain/VehicleTag";
import { Badge, Button, Card, ConfirmDialog, Dialog, Field, Input, Kv, PageHeader, Segmented, Select, Skeleton, StatusPill, Table, Td, toast } from "@/components/ui";
import { shortTag } from "@/components/domain/VehicleTag";
import { can } from "@/domain/rbac";
import { usePrefs } from "@/lib/prefs";
import { USERS_LIST } from "@/lib/users";
import type { ExitPermit, Visit } from "@/domain/types";
import { ERRORS, lbl } from "@/i18n/labels";
import { fmtDateTime, fmtNum } from "@/lib/format";
import { act, ActionError, useData, useMasters } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import { userName } from "@/lib/users";

export default function ExitPermitsPage() {
  const L = useL();
  const locale = useLocale();
  const masters = useMasters();
  const [filter, setFilter] = useState<"" | "APPROVED" | "CONSUMED" | "CANCELLED">("");
  const { data } = useData<ExitPermit>("exitPermits", { limit: 300, ...(filter ? { status: filter } : {}) }, 3000);
  const { data: visits } = useData<Visit>("visits", { limit: 1500 }, 15_000);
  const [open, setOpen] = useState<ExitPermit | null>(null);
  const [cancel, setCancel] = useState<ExitPermit | null>(null);
  const [manual, setManual] = useState(false);
  const role = USERS_LIST.find((u) => u.id === usePrefs.getState().userId)?.role;
  const canIssue = !!role && can(role, "exit.issue");
  const nm = (x?: { name: string; nameEn: string }) => (x ? (locale === "fa" ? x.name : x.nameEn) : "—");
  const drv = (e: ExitPermit) => masters?.drivers.find((x) => x.id === (e.driverId ?? visits?.items.find((v) => v.id === e.visitId)?.driverId));
  const veh = (visitId: string) => masters?.vehicles.find((v) => v.id === visits?.items.find((x) => x.id === visitId)?.vehicleId);
  return (
    <div>
      <PageHeader
        icon={<ClipboardCheck className="size-5" />}
        title={L("مجوزهای خروج", "Exit permits")}
        subtitle={L("سریال محلی + توکن QR یک‌بارمصرف؛ پس از اسکن حراست مصرف می‌شود و هرگز برگشت‌پذیر نیست", "Local serial + one-time QR token; consumed on guard scan and never reversible")}
        actions={
          <>
            <Segmented options={[{ id: "", label: L("همه", "All") }, { id: "APPROVED", label: L("فعال", "Active") }, { id: "CONSUMED", label: L("مصرف‌شده", "Consumed") }, { id: "CANCELLED", label: L("ابطال", "Cancelled") }]} value={filter} onChange={setFilter} />
            {canIssue && (
              <Button size="sm" onClick={() => setManual(true)}>
                <PenLine className="size-4" /> {L("صدور دستی مجوز خروج", "Manual exit permit")}
              </Button>
            )}
            <Link href="/app/guard">
              <Button variant="primary" size="sm">
                <QrCode className="size-4" /> {L("اسکن حراست", "Guard scanner")}
              </Button>
            </Link>
          </>
        }
      />
      <Card>
        {!data ? (
          <Skeleton className="m-4 h-96" />
        ) : (
          <Table head={[L("سریال", "Serial"), L("تگ خودرو", "Vehicle tag"), L("راننده (تگ)", "Driver (tag)"), L("نوع", "Type"), L("تراکنش‌ها", "Transactions"), L("صادرکننده", "Issued by"), L("صدور", "Issued"), L("مصرف", "Consumed"), L("اسکن‌ها", "Scans"), L("وضعیت", "Status"), ""]}>
            {data.items.map((e) => (
              <tr key={e.id} className="hover:bg-surface-2">
                <Td className="font-mono text-xs ltr">{e.serial}</Td>
                <Td>{(e.vehicleId || veh(e.visitId)) && <VehicleTag vehicleId={e.vehicleId ?? veh(e.visitId)!.id} size="xs" />}</Td>
                <Td className="text-xs">
                  {nm(drv(e))}
                  <div className="font-mono text-[10px] text-muted ltr">{shortTag(drv(e)?.rfidTag)}</div>
                </Td>
                <Td className="text-xs">
                  {e.manual ? <Badge tone="warning">{L("دستی", "Manual")}</Badge> : <Badge>{L("عادی", "Normal")}</Badge>}
                  {e.manual && <div className="mt-1 max-w-40 truncate text-[11px] text-muted" title={e.reason}>{e.reason}</div>}
                </Td>
                <Td className="text-xs">
                  {e.transactionIds.map((t) => (
                    <Link key={t} href={`/app/transactions/${t}`} className="me-1 text-primary">
                      {t}
                    </Link>
                  ))}
                  {e.empty && <Badge>{L("خالی", "Empty")}</Badge>}
                </Td>
                <Td>{userName(e.approvedBy, locale)}</Td>
                <Td className="num text-xs">{fmtDateTime(e.approvedAt, locale)}</Td>
                <Td className="num text-xs">{fmtDateTime(e.consumedAt, locale)}</Td>
                <Td className="num">
                  {fmtNum(e.scans.length, locale)} {e.scans.some((s) => s.result !== "ACCEPTED") && <Badge tone="danger">{L("اسکن رد شده", "Rejected scan")}</Badge>}
                </Td>
                <Td>
                  <StatusPill status={e.status === "APPROVED" ? "REVIEW" : e.status === "CONSUMED" ? "PASS" : "BLOCK"} label={e.status === "APPROVED" ? L("فعال", "Active") : e.status === "CONSUMED" ? L("مصرف‌شده", "Consumed") : L("ابطال", "Cancelled")} />
                </Td>
                <Td>
                  <Button size="sm" variant="ghost" onClick={() => setOpen(e)}>
                    QR
                  </Button>
                  {e.status === "APPROVED" && (
                    <Button size="sm" variant="ghost" className="text-danger" onClick={() => setCancel(e)}>
                      {L("ابطال", "Cancel")}
                    </Button>
                  )}
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
      <Dialog open={!!open} onClose={() => setOpen(null)} title={open?.serial ?? ""}>
        {open && (
          <div className="flex flex-col items-center gap-3">
            <Qr value={`${origin()}/x/${open.token}`} size={220} />
            <div className="font-mono text-xs text-muted ltr">token: {open.token}</div>
            <Kv k={L("وضعیت", "Status")} v={open.status} />
            <div className="w-full text-xs">
              {open.scans.map((s, i) => (
                <div key={i} className="flex justify-between border-b border-dashed border-border py-1">
                  <span>{fmtDateTime(s.at, locale)}</span>
                  <span>{userName(s.by, locale)}</span>
                  <Badge tone={s.result === "ACCEPTED" ? "success" : "danger"}>{s.result}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </Dialog>
      <ConfirmDialog
        open={!!cancel}
        onClose={() => setCancel(null)}
        danger
        title={L("ابطال مجوز خروج", "Cancel exit permit")}
        onConfirm={async ({ reason }) => {
          try {
            await act("exit.cancel", { id: cancel!.id, reason });
            toast.success(L("ابطال شد", "Cancelled"));
          } catch (e) {
            toast.error(e instanceof ActionError ? lbl(ERRORS, e.code, locale) : String(e));
          }
        }}
      />
      {manual && <ManualExitDialog onClose={() => setManual(false)} />}
    </div>
  );
}

function ManualExitDialog({ onClose }: { onClose: () => void }) {
  const L = useL();
  const locale = useLocale();
  const masters = useMasters();
  const [q, setQ] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [empty, setEmpty] = useState<"loaded" | "empty">("empty");
  const [hours, setHours] = useState("4");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const nm = (x?: { name: string; nameEn: string }) => (x ? (locale === "fa" ? x.name : x.nameEn) : "—");
  const vehicles = (masters?.vehicles ?? []).filter((v) => v.status !== "GUEST" && (!q.trim() || v.id.includes(q.trim().toUpperCase()) || (v.rfidEpc ?? "").includes(q.trim().toUpperCase())));
  const vehicle = masters?.vehicles.find((v) => v.id === vehicleId);
  const allowed = new Set(vehicle?.authorizedDriverIds ?? []);
  const drivers = [...(masters?.drivers ?? [])].filter((x) => x.status === "ACTIVE").sort((a, b) => Number(allowed.has(b.id)) - Number(allowed.has(a.id)));
  const notAllowed = !!driverId && !!vehicle && !allowed.has(driverId);
  const submit = async () => {
    setBusy(true);
    try {
      const ep = await act<ExitPermit>("exit.manual", { vehicleId, driverId, reason, hours: Number(hours), empty: empty === "empty" });
      toast.success(L(`مجوز خروج ${ep.serial} صادر شد`, `Exit permit ${ep.serial} issued`));
      onClose();
    } catch (e) {
      toast.error(e instanceof ActionError ? lbl(ERRORS, e.code, locale) : String(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog
      open
      onClose={onClose}
      title={L("صدور دستی مجوز خروج", "Manual exit permit")}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {L("انصراف", "Cancel")}
          </Button>
          <Button variant="primary" loading={busy} disabled={!vehicleId || !driverId || !reason.trim()} onClick={submit}>
            {L("صدور مجوز", "Issue permit")}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <Field label={L("خودرو (کد یا تگ)", "Vehicle (code or tag)")}>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L("جست‌وجو…", "Search…")} className="ltr" dir="ltr" />
          <Select value={vehicleId} onChange={(e) => (setVehicleId(e.target.value), setDriverId(""))} className="mt-1 w-full">
            <option value="">{L("انتخاب خودرو…", "Choose a vehicle…")}</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.id} · {shortTag(v.rfidEpc)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label={L("راننده (تگ کارت)", "Driver (card tag)")}>
          <Select value={driverId} onChange={(e) => setDriverId(e.target.value)} className="w-full" disabled={!vehicleId}>
            <option value="">{L("انتخاب راننده…", "Choose a driver…")}</option>
            {drivers.map((x) => (
              <option key={x.id} value={x.id}>
                {allowed.has(x.id) ? "✓ " : ""}
                {nm(x)} · {shortTag(x.rfidTag)}
              </option>
            ))}
          </Select>
        </Field>
        {notAllowed && <div className="rounded-lg bg-warning/12 px-3 py-2 text-xs text-warning">{L("این راننده در فهرست راننده‌های مجاز این خودرو نیست؛ دلیل را دقیق بنویسید.", "This driver is not authorized for the vehicle; state the reason clearly.")}</div>}
        <div className="grid grid-cols-2 gap-3">
          <Field label={L("وضعیت بار", "Load")}>
            <Segmented options={[{ id: "empty", label: L("خالی", "Empty") }, { id: "loaded", label: L("با بار", "Loaded") }]} value={empty} onChange={setEmpty} />
          </Field>
          <Field label={L("اعتبار", "Valid for")}>
            <Select value={hours} onChange={(e) => setHours(e.target.value)} className="w-full">
              <option value="1">{L("۱ ساعت", "1 hour")}</option>
              <option value="4">{L("۴ ساعت", "4 hours")}</option>
              <option value="24">{L("۲۴ ساعت", "24 hours")}</option>
            </Select>
          </Field>
        </div>
        <Field label={L("دلیل صدور دستی", "Reason")}>
          <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder={L("مثلاً: انتقال به تعمیرگاه، خروج اضطراری", "e.g. to workshop, emergency exit")} />
        </Field>
      </div>
    </Dialog>
  );
}
