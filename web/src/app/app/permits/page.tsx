"use client";
import { FilePlus2, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { Lines } from "@/components/charts";
import { Badge, Button, Card, CardHeader, ConfirmDialog, Dialog, Drawer, Field, Input, Kv, PageHeader, Progress, Select, Skeleton, Table, Tabs, Td, toast } from "@/components/ui";
import { remainingKg, usagePct } from "@/domain/permits";
import type { PermitLedgerEntry, Transaction } from "@/domain/types";
import { ERRORS, lbl, PERMIT_STATUS, PERMIT_TYPE } from "@/i18n/labels";
import { fmtDate, fmtDateTime, fmtKg, fmtNum, fmtPct } from "@/lib/format";
import { act, ActionError, useData, useMasters } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import { userName } from "@/lib/users";

export default function PermitsPage() {
  const L = useL();
  const locale = useLocale();
  const masters = useMasters();
  const [tab, setTab] = useState<"permits" | "contracts">("permits");
  const [sel, setSel] = useState<string | null>(null);
  const [type, setType] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const [statusDlg, setStatusDlg] = useState<null | "SUSPENDED" | "ACTIVE" | "REVOKED">(null);
  const [form, setForm] = useState({ type: "SALE", customerId: "C-01", materialId: "M-FEC", allowedT: "1000", days: "30" });
  const { data: ledger } = useData<PermitLedgerEntry>("ledger", sel ? { permitId: sel, limit: 500, order: "asc" } : { limit: 1 }, 4000);
  const { data: txs } = useData<Transaction>("transactions", sel ? { permitId: sel, limit: 50 } : { limit: 1 }, 4000);
  const permits = useMemo(() => (masters?.permits ?? []).filter((p) => !type || p.type === type).slice().reverse(), [masters, type]);
  const p = masters?.permits.find((x) => x.id === sel);
  const cus = (id: string) => masters?.customers.find((c) => c.id === id);
  const mat = (id: string) => masters?.materials.find((m) => m.id === id);
  const series = useMemo(() => {
    let acc = 0;
    return (ledger?.items ?? []).map((e) => {
      acc += e.kind === "RELEASE" ? -e.kg : e.kind === "COMMIT" ? e.kg : 0;
      return { at: fmtDate(e.at, locale), t: Math.round(acc / 1000) };
    });
  }, [ledger, locale]);
  const run = async (t: string, payload: Record<string, unknown>, ok: string) => {
    try {
      await act(t, payload);
      toast.success(ok);
    } catch (e) {
      toast.error(e instanceof ActionError ? lbl(ERRORS, e.code, locale) : String(e));
    }
  };
  return (
    <div>
      <PageHeader
        icon={<FileText className="size-5" />}
        title={L("حواله‌ها، مجوزهای حمل و قراردادها", "Permits, haul permits & contracts")}
        subtitle={L("سهمیه با دفتر کل RESERVE/COMMIT/RELEASE به‌صورت اتمیک مصرف می‌شود و هرگز منفی نمی‌شود", "Quota is consumed atomically via a RESERVE/COMMIT/RELEASE ledger and never goes negative")}
        actions={
          <Button variant="primary" onClick={() => setNewOpen(true)}>
            <FilePlus2 className="size-4" /> {L("صدور حواله جدید", "Issue permit")}
          </Button>
        }
      />
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Tabs tabs={[{ id: "permits", label: L("حواله‌ها", "Permits") }, { id: "contracts", label: L("قراردادها", "Contracts") }]} value={tab} onChange={setTab} />
        {tab === "permits" && (
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">{L("همه انواع", "All types")}</option>
            {Object.keys(PERMIT_TYPE).map((t) => (
              <option key={t} value={t}>
                {lbl(PERMIT_TYPE, t, locale)}
              </option>
            ))}
          </Select>
        )}
      </div>
      {!masters ? (
        <Skeleton className="h-96" />
      ) : tab === "permits" ? (
        <Card>
          <Table head={[L("شماره", "No"), L("نوع", "Type"), L("مشتری/تأمین‌کننده", "Customer/supplier"), L("ماده", "Material"), L("مصرف / مجاز", "Used / allowed"), L("پیشرفت", "Progress"), L("مانده", "Remaining"), L("سفر", "Trips"), L("اعتبار تا", "Valid to"), L("وضعیت", "Status")]}>
            {permits.map((pm) => {
              const u = usagePct(pm);
              const expiringDays = (new Date(pm.validTo).getTime() - Date.now()) / 864e5;
              return (
                <tr key={pm.id} className="cursor-pointer hover:bg-surface-2" onClick={() => setSel(pm.id)}>
                  <Td className="font-mono text-xs ltr">{pm.permitNo}</Td>
                  <Td>{lbl(PERMIT_TYPE, pm.type, locale)}</Td>
                  <Td className="max-w-44 truncate">{locale === "fa" ? cus(pm.customerId)?.name : cus(pm.customerId)?.nameEn}</Td>
                  <Td>{locale === "fa" ? mat(pm.materialId)?.name : mat(pm.materialId)?.nameEn}</Td>
                  <Td className="num text-xs">
                    {fmtNum(pm.consumedKg / 1000, locale, { maximumFractionDigits: 0 })} / {fmtNum(pm.allowedKg / 1000, locale, { maximumFractionDigits: 0 })} t
                  </Td>
                  <Td className="w-40">
                    <div className="flex h-2 overflow-hidden rounded-full bg-surface-2">
                      <div className="bg-primary" style={{ width: `${u.consumed}%` }} />
                      <div className="bg-warning" style={{ width: `${u.reserved}%` }} />
                    </div>
                  </Td>
                  <Td className={`num ${u.remaining < 10 ? "font-bold text-danger" : ""}`}>{fmtKg(remainingKg(pm), locale, "t")}</Td>
                  <Td className="num">
                    {fmtNum(pm.tripsUsed, locale)}
                    {pm.maxTrips ? ` / ${fmtNum(pm.maxTrips, locale)}` : ""}
                  </Td>
                  <Td className={`num text-xs ${expiringDays < 7 ? "text-warning" : ""}`}>{fmtDate(pm.validTo, locale)}</Td>
                  <Td>
                    <Badge tone={pm.status === "ACTIVE" ? "success" : pm.status === "SUSPENDED" ? "warning" : pm.status === "CONSUMED" ? "info" : "danger"}>{lbl(PERMIT_STATUS, pm.status, locale)}</Badge>
                  </Td>
                </tr>
              );
            })}
          </Table>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {masters.contracts.map((c) => {
            const pct = (c.deliveredKg / c.totalKg) * 100;
            return (
              <Card key={c.id} className="p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm ltr">{c.no}</span>
                  <Badge tone="info">{locale === "fa" ? mat(c.materialId)?.name : mat(c.materialId)?.nameEn}</Badge>
                </div>
                <div className="mt-1 font-semibold">{locale === "fa" ? cus(c.customerId)?.name : cus(c.customerId)?.nameEn}</div>
                <Progress value={pct} tone={pct > 90 ? "warning" : "primary"} className="mt-3" />
                <div className="mt-1 flex justify-between text-xs text-muted">
                  <span className="num">
                    {fmtNum(c.deliveredKg / 1000, locale, { maximumFractionDigits: 0 })} / {fmtNum(c.totalKg / 1000, locale)} t
                  </span>
                  <span>{fmtPct(pct, locale)}</span>
                </div>
                <Kv k={L("نرخ هر تن", "Price per t")} v={`${fmtNum(c.pricePerTon, locale)} ${L("ریال", "IRR")}`} />
                <Kv k={L("اعتبار", "Valid")} v={`${fmtDate(c.validFrom, locale)} — ${fmtDate(c.validTo, locale)}`} />
              </Card>
            );
          })}
        </div>
      )}

      <Drawer open={!!p} onClose={() => setSel(null)} title={p?.permitNo ?? ""} width="max-w-2xl">
        {p && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                [L("مصرف‌شده", "Consumed"), p.consumedKg, "text-primary"],
                [L("رزرو", "Reserved"), p.reservedKg, "text-warning"],
                [L("مانده", "Remaining"), remainingKg(p), "text-success"],
              ].map(([a, b, c]) => (
                <div key={String(a)} className="rounded-lg bg-surface-2 p-3">
                  <div className="text-xs text-muted">{a}</div>
                  <div className={`num text-lg font-black ${c}`}>{fmtKg(b as number, locale, "t")}</div>
                </div>
              ))}
            </div>
            <Card>
              <CardHeader title={L("مصرف تجمعی در زمان", "Cumulative consumption")} />
              <div className="p-2">
                <Lines data={series} x="at" unit="t" height={180} series={[{ key: "t", name: L("مصرف (تن)", "Consumed (t)"), color: "var(--primary)" }]} />
              </div>
            </Card>
            <div>
              <Kv k={L("نوع", "Type")} v={lbl(PERMIT_TYPE, p.type, locale)} />
              <Kv k={L("صادرکننده", "Issuer")} v={p.issuer} />
              <Kv k={L("خودروهای مجاز", "Allowed vehicles")} v={p.allowedVehicleIds.length ? p.allowedVehicleIds.length : L("همه خودروهای حمل‌کننده", "Any carrier vehicle")} />
              <Kv k={L("hash سند", "Document hash")} v={<span className="font-mono text-[10px] ltr">{p.documentHash.slice(0, 24)}…</span>} />
            </div>
            <div className="flex gap-2">
              {p.status === "ACTIVE" && <Button variant="warning" onClick={() => setStatusDlg("SUSPENDED")}>{L("تعلیق", "Suspend")}</Button>}
              {p.status === "SUSPENDED" && <Button variant="success" onClick={() => setStatusDlg("ACTIVE")}>{L("فعال‌سازی", "Activate")}</Button>}
              {p.status !== "REVOKED" && <Button variant="danger" onClick={() => setStatusDlg("REVOKED")}>{L("ابطال", "Revoke")}</Button>}
            </div>
            <Card>
              <CardHeader title={L("دفتر کل سهمیه (ledger)", "Quota ledger")} />
              <Table dense head={[L("نوع", "Kind"), L("مقدار", "Kg"), L("تراکنش", "Tx"), L("کاربر", "By"), L("زمان", "At")]}>
                {(ledger?.items ?? []).slice(-30).reverse().map((e) => (
                  <tr key={e.id}>
                    <Td>
                      <Badge tone={e.kind === "COMMIT" ? "primary" : e.kind === "RELEASE" ? "warning" : "info"}>{e.kind}</Badge>
                    </Td>
                    <Td className="num">{fmtNum(e.kg, locale)}</Td>
                    <Td className="text-xs">{e.transactionId}</Td>
                    <Td>{userName(e.by, locale)}</Td>
                    <Td className="num text-xs">{fmtDateTime(e.at, locale)}</Td>
                  </tr>
                ))}
              </Table>
            </Card>
            <div className="text-xs text-muted">
              {L("تراکنش‌های مرتبط", "Related transactions")}: {fmtNum(txs?.total ?? 0, locale)}
            </div>
          </div>
        )}
      </Drawer>

      <Dialog
        open={newOpen}
        onClose={() => setNewOpen(false)}
        title={L("صدور حواله جدید", "Issue new permit")}
        footer={
          <Button variant="primary" onClick={async () => { await run("permit.create", form, L("حواله صادر شد", "Permit issued")); setNewOpen(false); }}>
            {L("صدور", "Issue")}
          </Button>
        }
      >
        <div className="grid gap-3">
          <Field label={L("نوع", "Type")}>
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {Object.keys(PERMIT_TYPE).map((t) => (
                <option key={t} value={t}>
                  {lbl(PERMIT_TYPE, t, locale)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={L("مشتری", "Customer")}>
            <Select value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })}>
              {masters?.customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {locale === "fa" ? c.name : c.nameEn}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={L("ماده", "Material")}>
            <Select value={form.materialId} onChange={(e) => setForm({ ...form, materialId: e.target.value })}>
              {masters?.materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {locale === "fa" ? m.name : m.nameEn}
                </option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={L("سهمیه (تن)", "Quota (t)")}>
              <Input type="number" value={form.allowedT} onChange={(e) => setForm({ ...form, allowedT: e.target.value })} />
            </Field>
            <Field label={L("اعتبار (روز)", "Validity (days)")}>
              <Input type="number" value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })} />
            </Field>
          </div>
        </div>
      </Dialog>
      <ConfirmDialog open={!!statusDlg} onClose={() => setStatusDlg(null)} danger={statusDlg === "REVOKED"} title={L("تغییر وضعیت حواله", "Change permit status")} onConfirm={({ reason }) => run("permit.status", { id: p!.id, status: statusDlg, reason }, L("وضعیت تغییر کرد", "Status changed"))} />
    </div>
  );
}
