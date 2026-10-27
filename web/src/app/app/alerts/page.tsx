"use client";
import { AlertTriangle, Settings2, Timer } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Button, Card, ConfirmDialog, cx, Input, PageHeader, Segmented, Select, Skeleton, Switch, Table, Tabs, Td, toast } from "@/components/ui";
import type { Alert, AlertRule, Transaction } from "@/domain/types";
import { ALERT_STATUS, ERRORS, lbl, SEVERITY } from "@/i18n/labels";
import { fmtDateTime, fmtDuration, fmtNum } from "@/lib/format";
import { act, ActionError, useData, useMasters, useNow } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import { sevTone } from "@/lib/status";
import { userName } from "@/lib/users";

const ISO_RE = /^\d{4}-\d{2}-\d{2}T/;

export default function AlertsPage() {
  const L = useL();
  const locale = useLocale();
  const now = useNow(1000);
  const masters = useMasters();
  const [tab, setTab] = useState<"alerts" | "rules">("alerts");
  const [status, setStatus] = useState<"open" | "all" | "closed">("open");
  const [sev, setSev] = useState("");
  const [dlg, setDlg] = useState<{ id: string; status: "RESOLVED" | "DISMISSED" } | null>(null);
  const { data } = useData<Alert>("alerts", { limit: 500 }, 2000);
  const { data: txs } = useData<Transaction>("transactions", { limit: 3000 }, 60000);
  const [shadow, setShadow] = useState<Record<string, number>>({});
  const rows = useMemo(() => {
    let r = data?.items ?? [];
    if (status === "open") r = r.filter((a) => ["OPEN", "ACK", "INVESTIGATING"].includes(a.status));
    if (status === "closed") r = r.filter((a) => ["RESOLVED", "DISMISSED"].includes(a.status));
    if (sev) r = r.filter((a) => a.severity === sev);
    return r;
  }, [data, status, sev]);
  const run = async (type: string, payload: Record<string, unknown>, ok: string) => {
    try {
      await act(type, payload);
      toast.success(ok);
    } catch (e) {
      toast.error(e instanceof ActionError ? lbl(ERRORS, e.code, locale) : String(e));
    }
  };
  const shadowTest = (r: AlertRule) => {
    // replay the rule against 7 days of history (only rules with a numeric threshold on stored data)
    const items = txs?.items ?? [];
    let n = 0;
    if (r.code === "R16") {
      const byV = new Map<string, number[]>();
      for (const t of items.slice().reverse()) {
        if (t.tareKg == null) continue;
        const arr = byV.get(t.vehicleId) ?? [];
        if (arr.length >= 5) {
          const med = [...arr].sort((a, b) => a - b)[Math.floor(arr.length / 2)];
          if (Math.abs(t.tareKg - med) > (r.params.limitKg ?? 600)) n++;
        }
        arr.push(t.tareKg);
        byV.set(t.vehicleId, arr.slice(-(r.params.n ?? 10)));
      }
    } else if (r.code === "R14") n = items.filter((t) => t.holdReasons.includes("R14")).length;
    else if (r.code === "R22") n = items.filter((t) => { const h = (new Date(t.createdAt).getUTCHours() + 3.5) % 24; return h >= (r.params.fromHour ?? 0) && h < (r.params.toHour ?? 5); }).length;
    else if (r.code === "R31") n = items.filter((t) => t.volumeM3 && t.netKg && t.estimatedMassKg && Math.abs(t.estimatedMassKg - t.netKg) / t.netKg > (r.params.tolPct ?? 12) / 100).length;
    else if (r.code === "R34") n = items.filter((t) => t.payloadKg && t.netKg && Math.abs(t.payloadKg - t.netKg) / t.netKg > (r.params.tolPct ?? 8) / 100).length;
    else n = (data?.items ?? []).filter((a) => a.ruleCode === r.code).length;
    setShadow((s) => ({ ...s, [r.code]: n }));
  };
  return (
    <div>
      <PageHeader icon={<AlertTriangle className="size-5" />} title={L("مرکز هشدار", "Alerts center")} subtitle={L("چرخه OPEN → ACK → INVESTIGATING → RESOLVED/DISMISSED با SLA؛ هشدار بحرانی خودکار بسته نمی‌شود", "OPEN → ACK → INVESTIGATING → RESOLVED/DISMISSED with SLA; critical alerts never auto-close")} actions={<Tabs tabs={[{ id: "alerts", label: L("هشدارها", "Alerts") }, { id: "rules", label: L("قوانین (R01–R40)", "Rules (R01–R40)"), icon: <Settings2 className="size-4" /> }]} value={tab} onChange={setTab} />} />
      {tab === "alerts" ? (
        <>
          <div className="mb-3 flex flex-wrap gap-2">
            <Segmented options={[{ id: "open", label: L("باز", "Open") }, { id: "closed", label: L("بسته", "Closed") }, { id: "all", label: L("همه", "All") }]} value={status} onChange={setStatus} />
            <Select value={sev} onChange={(e) => setSev(e.target.value)}>
              <option value="">{L("همه شدت‌ها", "All severities")}</option>
              {Object.keys(SEVERITY).map((s) => (
                <option key={s} value={s}>
                  {lbl(SEVERITY, s, locale)}
                </option>
              ))}
            </Select>
          </div>
          <Card>
            {!data ? (
              <Skeleton className="m-4 h-96" />
            ) : (
              <Table head={[L("شدت", "Severity"), L("قانون", "Rule"), L("عنوان", "Title"), L("جزئیات", "Detail"), L("مشاهده/آستانه", "Observed/threshold"), L("لاین", "Lane"), L("زمان", "Opened"), "SLA", L("وضعیت", "Status"), L("مسئول", "Owner"), ""]}>
                {rows.map((a) => {
                  const left = new Date(a.slaDueAt).getTime() - now;
                  const open = ["OPEN", "ACK", "INVESTIGATING"].includes(a.status);
                  return (
                    <tr key={a.id} className="hover:bg-surface-2">
                      <Td>
                        <Badge tone={sevTone(a.severity)}>{lbl(SEVERITY, a.severity, locale)}</Badge>
                      </Td>
                      <Td className="font-mono text-xs">{a.ruleCode}</Td>
                      <Td>{locale === "fa" ? a.title : a.titleEn}</Td>
                      <Td className="max-w-56 truncate text-xs text-muted">{a.detail ?? (a.transactionId ? <Link className="text-primary" href={`/app/transactions/${a.transactionId}`}>{a.transactionId}</Link> : a.deviceId ?? "—")}</Td>
                      <Td className="font-mono text-[11px] ltr">{a.observed ? `${ISO_RE.test(a.observed) ? fmtDateTime(a.observed, locale) : a.observed} / ${a.threshold ?? "—"}` : "—"}</Td>
                      <Td>{a.laneCode ?? "—"}</Td>
                      <Td className="num text-xs">{fmtDateTime(a.openedAt, locale)}</Td>
                      <Td className={cx("num text-xs", open && left < 0 && "font-bold text-danger")}>
                        {open ? (
                          <span className="flex items-center gap-1">
                            <Timer className="size-3.5" />
                            {left < 0 ? L("گذشته ", "overdue ") : ""}
                            {fmtDuration(Math.abs(left), locale)}
                          </span>
                        ) : (
                          "—"
                        )}
                      </Td>
                      <Td>
                        <Badge tone={a.status === "OPEN" ? "danger" : a.status === "RESOLVED" ? "success" : a.status === "DISMISSED" ? "neutral" : "warning"}>{lbl(ALERT_STATUS, a.status, locale)}</Badge>
                      </Td>
                      <Td className="text-xs">{userName(a.assignee ?? a.ackBy, locale)}</Td>
                      <Td>
                        {open && (
                          <div className="flex gap-1">
                            {a.status === "OPEN" && (
                              <Button size="sm" onClick={() => run("alert.status", { id: a.id, status: "ACK" }, L("دیده شد", "Acknowledged"))}>
                                ACK
                              </Button>
                            )}
                            {a.status !== "INVESTIGATING" && (
                              <Button size="sm" variant="ghost" onClick={() => run("alert.status", { id: a.id, status: "INVESTIGATING" }, L("در حال بررسی", "Investigating"))}>
                                {L("بررسی", "Investigate")}
                              </Button>
                            )}
                            <Button size="sm" variant="success" onClick={() => setDlg({ id: a.id, status: "RESOLVED" })}>
                              {L("حل", "Resolve")}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setDlg({ id: a.id, status: "DISMISSED" })}>
                              {L("کاذب", "False +")}
                            </Button>
                          </div>
                        )}
                        {!open && a.resolution && <span className="text-xs text-muted">{a.resolution}</span>}
                      </Td>
                    </tr>
                  );
                })}
              </Table>
            )}
          </Card>
        </>
      ) : (
        <Card>
          <Table head={[L("کد", "Code"), L("نام", "Name"), L("شرط", "Condition"), L("شدت", "Severity"), L("اقدام", "Action"), L("پارامترها", "Parameters"), L("نسخه", "Ver"), L("منبع", "Source"), L("فعال", "On"), L("تست سایه ۷ روز", "7-day shadow test")]}>
            {masters?.rules.map((r) => (
              <tr key={r.code}>
                <Td className="font-mono text-xs">{r.code}</Td>
                <Td>{locale === "fa" ? r.name : r.nameEn}</Td>
                <Td className="font-mono text-[11px] text-muted ltr">{r.condition}</Td>
                <Td>
                  <Badge tone={sevTone(r.severity)}>{lbl(SEVERITY, r.severity, locale)}</Badge>
                </Td>
                <Td className="text-xs">{r.action}</Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(r.params).map(([k, v]) => (
                      <label key={k} className="flex items-center gap-1 text-[11px]">
                        <span className="font-mono text-muted">{k}</span>
                        <Input
                          type="number"
                          defaultValue={v}
                          className="h-7 w-20 px-1 text-xs"
                          onBlur={(e) => {
                            if (Number(e.target.value) !== v) run("alert.rule", { code: r.code, params: { [k]: Number(e.target.value) } }, L("قانون به‌روزرسانی شد (نسخه جدید)", "Rule updated (new version)"));
                          }}
                        />
                      </label>
                    ))}
                  </div>
                </Td>
                <Td className="num">v{r.version}</Td>
                <Td className="text-[11px] text-muted">{r.source}</Td>
                <Td>
                  <Switch checked={r.enabled} onChange={(b) => run("alert.rule", { code: r.code, enabled: b }, b ? L("فعال شد", "Enabled") : L("غیرفعال شد", "Disabled"))} />
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => shadowTest(r)}>
                      {L("اجرا", "Run")}
                    </Button>
                    {shadow[r.code] != null && <Badge tone="info">{fmtNum(shadow[r.code], locale)} {L("مورد", "hits")}</Badge>}
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
      )}
      <ConfirmDialog open={!!dlg} onClose={() => setDlg(null)} title={dlg?.status === "RESOLVED" ? L("حل هشدار", "Resolve alert") : L("ثبت به‌عنوان مثبت کاذب", "Mark as false positive")} onConfirm={({ reason }) => run("alert.status", { id: dlg!.id, status: dlg!.status, note: reason }, L("ثبت شد", "Saved"))} />
    </div>
  );
}
