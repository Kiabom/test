"use client";
import { ClipboardCheck, QrCode } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { origin, Qr } from "@/components/domain/codes";
import { IranPlate } from "@/components/domain/IranPlate";
import { Badge, Button, Card, ConfirmDialog, Dialog, Kv, PageHeader, Segmented, Skeleton, StatusPill, Table, Td, toast } from "@/components/ui";
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
  const { data: visits } = useData<Visit>("visits", { limit: 1500 }, 6000);
  const [open, setOpen] = useState<ExitPermit | null>(null);
  const [cancel, setCancel] = useState<ExitPermit | null>(null);
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
          <Table head={[L("سریال", "Serial"), L("پلاک", "Plate"), L("تراکنش‌ها", "Transactions"), L("صادرکننده", "Issued by"), L("صدور", "Issued"), L("مصرف", "Consumed"), L("اسکن‌ها", "Scans"), L("وضعیت", "Status"), ""]}>
            {data.items.map((e) => (
              <tr key={e.id} className="hover:bg-surface-2">
                <Td className="font-mono text-xs ltr">{e.serial}</Td>
                <Td>{veh(e.visitId) && <IranPlate plate={veh(e.visitId)!.plate} size="xs" />}</Td>
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
    </div>
  );
}
