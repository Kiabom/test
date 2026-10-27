"use client";
import { CheckCircle2, Download, Link2, ShieldCheck, ShieldX, Undo2, Zap } from "lucide-react";
import { useState } from "react";
import { Badge, Button, Card, CardHeader, cx, Input, PageHeader, Select, Skeleton, Table, Td, toast } from "@/components/ui";
import type { AuditEvent } from "@/domain/types";
import { ERRORS, lbl } from "@/i18n/labels";
import { downloadCsv } from "@/lib/export";
import { fmtDateTime, fmtNum, shortHash } from "@/lib/format";
import { act, ActionError, useData } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";
import { userName } from "@/lib/users";

interface VerifyResult {
  ok: boolean;
  checked?: number;
  brokenAt?: number;
  seq?: number;
}

export default function AuditPage() {
  const L = useL();
  const locale = useLocale();
  const [q, setQ] = useState("");
  const [entity, setEntity] = useState("");
  const [page, setPage] = useState(0);
  const { data } = useData<AuditEvent>("audit", { limit: 50, offset: page * 50, q: q || undefined, entityType: entity || undefined }, 2000);
  const [res, setRes] = useState<VerifyResult | null>(null);
  const [busy, setBusy] = useState(false);
  const verify = async () => {
    setBusy(true);
    try {
      const r = await act<VerifyResult>("audit.verify");
      setRes(r);
      if (r.ok) toast.success(L(`زنجیره سالم است — ${fmtNum(r.checked, locale)} رکورد بررسی شد`, `Chain intact — ${r.checked} records checked`));
      else toast.error(L(`زنجیره در رکورد #${r.seq} شکسته است`, `Chain broken at #${r.seq}`));
    } finally {
      setBusy(false);
    }
  };
  const run = async (type: string, ok: string) => {
    try {
      await act(type);
      toast.info(ok);
      setRes(null);
    } catch (e) {
      toast.error(e instanceof ActionError ? lbl(ERRORS, e.code, locale) : String(e));
    }
  };
  const rows = data?.items ?? [];
  return (
    <div>
      <PageHeader
        icon={<ShieldCheck className="size-5" />}
        title={L("ردپای ممیزی", "Audit trail")}
        subtitle={L("Append-only؛ هر رکورد با HMAC-SHA256 به رکورد قبلی زنجیر شده است (کنترل ۰۷)", "Append-only; each record is HMAC-SHA256-chained to the previous one (control 07)")}
        actions={
          <Button onClick={() => downloadCsv("audit.csv", ["seq", "at", "actor", "action", "entity", "id", "reason", "hash"], rows.map((a) => [a.seq, a.at, a.actorId, a.action, a.entityType, a.entityId, a.reason ?? "", a.hash]))}>
            <Download className="size-4" /> CSV
          </Button>
        }
      />
      <div className="mb-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className={cx("grid size-16 place-items-center rounded-2xl", !res ? "bg-surface-2 text-muted" : res.ok ? "bg-success/15 text-success" : "bg-danger/15 text-danger")}>{!res || res.ok ? <ShieldCheck className="size-8" /> : <ShieldX className="size-8" />}</div>
            <div className="flex-1">
              <div className="text-lg font-bold">{!res ? L("زنجیره هنوز بررسی نشده", "Chain not verified yet") : res.ok ? L("زنجیره سالم است", "Chain intact") : L(`دستکاری کشف شد — رکورد #${res.seq}`, `Tampering detected — record #${res.seq}`)}</div>
              <div className="text-sm text-muted">{res ? L(`${fmtNum(res.checked ?? res.brokenAt, locale)} رکورد با بازمحاسبه hash بررسی شد`, `${res.checked ?? res.brokenAt} records re-hashed`) : L("hash هر رکورد بازمحاسبه و با prevHash رکورد بعدی مقایسه می‌شود", "Each record's hash is recomputed and compared with the next record's prevHash")}</div>
            </div>
            <Button variant="primary" onClick={verify} loading={busy}>
              <CheckCircle2 className="size-4" /> {L("راستی‌آزمایی زنجیره", "Verify chain")}
            </Button>
          </div>
        </Card>
        <Card className="p-4">
          <div className="mb-2 text-sm font-bold">{L("دمو: دستکاری عمدی", "Demo: deliberate tampering")}</div>
          <div className="mb-3 text-xs text-muted">{L("یک رکورد وسط زنجیره را مستقیم در پایگاه داده تغییر می‌دهد (مثل حمله‌کننده با دسترسی DB) تا کشف آن را ببینید.", "Edits one mid-chain record directly in the DB (like an attacker with DB access) so you can watch it get detected.")}</div>
          <div className="flex gap-2">
            <Button variant="danger" size="sm" onClick={() => run("audit.tamper", L("یک رکورد دستکاری شد — حالا راستی‌آزمایی کنید", "A record was tampered — now verify"))}>
              <Zap className="size-4" /> {L("دستکاری", "Tamper")}
            </Button>
            <Button size="sm" onClick={() => run("audit.restore", L("بازگردانی شد", "Restored"))}>
              <Undo2 className="size-4" /> {L("بازگردانی", "Restore")}
            </Button>
          </div>
        </Card>
      </div>
      <Card>
        <CardHeader
          title={L("رویدادها", "Events")}
          subtitle={data ? `${fmtNum(data.total, locale)} ${L("رکورد", "records")}` : undefined}
          actions={
            <div className="flex gap-2">
              <Input placeholder={L("جست‌وجو (شناسه، اقدام…)", "Search (id, action…)")} value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} className="w-56" />
              <Select value={entity} onChange={(e) => { setEntity(e.target.value); setPage(0); }}>
                <option value="">{L("همه موجودیت‌ها", "All entities")}</option>
                {["Visit", "Transaction", "ExitPermit", "Permit", "Alert", "Device", "Scale", "AlertRule", "vehicles", "drivers", "FraudCase", "Lane"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </Select>
            </div>
          }
        />
        {!data ? (
          <Skeleton className="m-4 h-96" />
        ) : (
          <Table head={["#", L("زمان", "Time"), L("عامل", "Actor"), L("اقدام", "Action"), L("موجودیت", "Entity"), L("دلیل", "Reason"), "prevHash", "hash"]} dense>
            {rows.map((a) => (
              <tr key={a.id} className={cx(res && !res.ok && res.seq === a.seq && "bg-danger/10")}>
                <Td className="num text-xs">{a.seq}</Td>
                <Td className="num text-xs">{fmtDateTime(a.at, locale)}</Td>
                <Td className="text-xs">
                  <Badge tone={a.actorType === "HUMAN" ? "primary" : a.actorType === "DEVICE" ? "info" : "neutral"}>{a.actorType}</Badge> {a.actorType === "HUMAN" ? userName(a.actorId, locale) : a.actorId}
                </Td>
                <Td className="font-mono text-xs">{a.action}</Td>
                <Td className="font-mono text-[11px] ltr">
                  {a.entityType}:{a.entityId}
                </Td>
                <Td className="max-w-56 truncate text-xs">{a.reason ?? (a.data ? <span className="font-mono text-[10px] text-muted ltr">{JSON.stringify(a.data).slice(0, 60)}</span> : "—")}</Td>
                <Td className="font-mono text-[10px] text-muted ltr">{shortHash(a.prevHash)}</Td>
                <Td className="font-mono text-[10px] ltr">
                  <span className="inline-flex items-center gap-1">
                    <Link2 className="size-3 text-primary" />
                    {shortHash(a.hash)}
                  </span>
                </Td>
              </tr>
            ))}
          </Table>
        )}
        <div className="flex items-center justify-between p-3 text-sm">
          <Button size="sm" variant="ghost" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            {L("قبلی", "Prev")}
          </Button>
          <span className="num text-muted">{fmtNum(page + 1, locale)}</span>
          <Button size="sm" variant="ghost" disabled={!data || (page + 1) * 50 >= data.total} onClick={() => setPage((p) => p + 1)}>
            {L("بعدی", "Next")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
