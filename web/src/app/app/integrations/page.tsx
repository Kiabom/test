"use client";
import { ArrowLeftRight, Cable, Copy, KeyRound, RefreshCw, Webhook } from "lucide-react";
import { useState } from "react";
import { Badge, Button, Card, CardHeader, cx, PageHeader, Segmented, Skeleton, Switch, Table, Tabs, Td, toast } from "@/components/ui";
import type { OutboxMessage } from "@/domain/types";
import { ERRORS, lbl } from "@/i18n/labels";
import { fmtDateTime, fmtNum } from "@/lib/format";
import { act, ActionError, useData, useLive } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";

type Tab = "outbox" | "webhooks" | "keys" | "mapping";
const STATUS_TONE = { PENDING: "warning", SENT: "success", FAILED: "danger", DEAD: "danger" } as const;

const MAPPING: [string, string, string][] = [
  ["ticketNo", "DocumentNo", "string"],
  ["approvedAt", "PostingDate", "datetime (UTC)"],
  ["customer.erpCode", "CustomerCode", "string"],
  ["material.code", "ItemCode", "string"],
  ["billableKg", "Quantity", "decimal (kg)"],
  ["netKg / grossKg / tareKg", "WeightNet / Gross / Tare", "decimal (kg)"],
  ["permit.permitNo", "SalesOrderNo", "string"],
  ["vehicle.plateNormalized", "VehiclePlate", "string"],
  ["verifyCode", "ExternalRef", "string"],
  ["idempotencyKey", "X-Idempotency-Key (header)", "string"],
];

export default function IntegrationsPage() {
  const L = useL();
  const locale = useLocale();
  const live = useLive();
  const [tab, setTab] = useState<Tab>("outbox");
  const [ch, setCh] = useState<"ERP" | "WEBHOOK" | "ALL">("ERP");
  const { data } = useData<OutboxMessage>("outbox", { limit: 300, channel: ch === "ALL" ? undefined : ch }, 2000);
  const [hooks, setHooks] = useState([
    { url: "https://erp.example.com/hooks/weighbridge", events: ["ticket.approved", "ticket.voided"], on: true },
    { url: "https://bi.example.com/ingest/trips", events: ["visit.exited"], on: true },
    { url: "https://security.example.com/alerts", events: ["alert.critical", "exit.qr_reuse"], on: false },
  ]);
  const [keys, setKeys] = useState([
    { name: "ERP connector", prefix: "tzn_live_8f3a", scopes: "tickets:read permits:write", created: "2026-09-02" },
    { name: "BI dashboard", prefix: "tzn_live_1c77", scopes: "reports:read", created: "2026-10-11" },
  ]);
  const [newKey, setNewKey] = useState<string | null>(null);
  const items = data?.items ?? [];
  const retry = async (id: string) => {
    try {
      await act("outbox.retry", { id });
      toast.success(L("دوباره در صف قرار گرفت (همان کلید idempotency)", "Re-queued (same idempotency key)"));
    } catch (e) {
      toast.error(e instanceof ActionError ? lbl(ERRORS, e.code, locale) : String(e));
    }
  };
  return (
    <div>
      <PageHeader icon={<Cable className="size-5" />} title={L("یکپارچه‌سازی", "Integrations")} subtitle={L("Outbox تراکنشی به ERP با تلاش مجدد و dead-letter، webhook، کلید API و نگاشت فیلد", "Transactional ERP outbox with retries and dead-letter, webhooks, API keys and field mapping")} />
      <Tabs
        className="mb-3"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "outbox", label: "Outbox", icon: <ArrowLeftRight className="size-4" />, badge: <Badge tone={live?.syncQueue ? "warning" : "success"}>{fmtNum(live?.syncQueue ?? 0, locale)}</Badge> },
          { id: "webhooks", label: "Webhooks", icon: <Webhook className="size-4" /> },
          { id: "keys", label: L("کلیدهای API", "API keys"), icon: <KeyRound className="size-4" /> },
          { id: "mapping", label: L("نگاشت ERP", "ERP mapping") },
        ]}
      />
      {tab === "outbox" && (
        <>
          <div className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            {(["PENDING", "SENT", "FAILED", "DEAD"] as const).map((s) => (
              <Card key={s} className="p-3">
                <div className="text-xs text-muted">{s}</div>
                <div className={cx("num text-2xl font-black", s === "SENT" ? "text-success" : s === "PENDING" ? "text-warning" : "text-danger")}>{fmtNum(items.filter((m) => m.status === s).length, locale)}</div>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader title={L("پیام‌ها", "Messages")} subtitle={live?.wanOnline ? L("ارسال فعال", "Delivery active") : L("WAN قطع — پیام‌ها در صف می‌مانند", "WAN down — messages are held")} actions={<Segmented options={[{ id: "ERP", label: "ERP" }, { id: "WEBHOOK", label: "Webhook" }, { id: "ALL", label: L("همه", "All") }]} value={ch} onChange={setCh} />} />
            {!data ? (
              <Skeleton className="m-4 h-64" />
            ) : (
              <Table head={[L("زمان", "Created"), L("کانال", "Channel"), L("موضوع", "Topic"), L("موجودیت", "Entity"), L("تلاش", "Attempts"), L("وضعیت", "Status"), L("خطا", "Error"), "Idempotency", ""]} dense>
                {items.map((m) => (
                  <tr key={m.id}>
                    <Td className="num text-xs">{fmtDateTime(m.createdAt, locale)}</Td>
                    <Td>
                      <Badge>{m.channel}</Badge>
                    </Td>
                    <Td className="font-mono text-xs">{m.topic}</Td>
                    <Td className="font-mono text-[11px]">{m.entityId}</Td>
                    <Td className="num">{m.attempts}</Td>
                    <Td>
                      <Badge tone={STATUS_TONE[m.status]}>{m.status}</Badge>
                    </Td>
                    <Td className="max-w-48 truncate text-xs text-danger">{m.lastError ?? ""}</Td>
                    <Td className="max-w-40 truncate font-mono text-[10px] text-muted ltr">{m.idempotencyKey}</Td>
                    <Td>
                      {(m.status === "FAILED" || m.status === "DEAD" || m.status === "SENT") && (
                        <Button size="sm" variant="ghost" onClick={() => retry(m.id)} title={m.status === "SENT" ? L("ارسال مجدد (replay)", "Replay") : L("تلاش مجدد", "Retry")}>
                          <RefreshCw className="size-3.5" />
                        </Button>
                      )}
                    </Td>
                  </tr>
                ))}
              </Table>
            )}
          </Card>
        </>
      )}
      {tab === "webhooks" && (
        <Card>
          <CardHeader title="Webhooks" subtitle={L("امضای HMAC در هدر X-Signature؛ تلاش مجدد نمایی", "HMAC signature in X-Signature header; exponential retry")} />
          <Table head={["URL", L("رویدادها", "Events"), L("فعال", "Enabled"), ""]}>
            {hooks.map((h, i) => (
              <tr key={h.url}>
                <Td className="font-mono text-xs ltr">{h.url}</Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {h.events.map((e) => (
                      <Badge key={e} tone="info">
                        {e}
                      </Badge>
                    ))}
                  </div>
                </Td>
                <Td>
                  <Switch checked={h.on} onChange={(b) => setHooks((hs) => hs.map((x, j) => (j === i ? { ...x, on: b } : x)))} />
                </Td>
                <Td>
                  <Button size="sm" variant="ghost" onClick={() => toast.info(L(`ارسال آزمایشی به ${h.url} → 200 OK (شبیه‌سازی)`, `Test delivery to ${h.url} → 200 OK (simulated)`))}>
                    {L("تست", "Test")}
                  </Button>
                </Td>
              </tr>
            ))}
          </Table>
          <div className="border-t border-border p-4">
            <div className="mb-1 text-xs font-semibold">{L("نمونه payload", "Sample payload")}</div>
            <pre className="overflow-auto rounded-lg bg-slate-950 p-3 text-[11px] leading-5 text-slate-200" dir="ltr">{`POST /hooks/weighbridge
X-Signature: sha256=7d1c…e09a
X-Idempotency-Key: ERP:ticket.approved:TX-000412

{
  "event": "ticket.approved",
  "ticketNo": "T-1405-00412",
  "netKg": 28640, "billableKg": 28540, "deductionKg": 100,
  "material": "FE-ORE-62", "customer": "C-1021",
  "permitNo": "SO-1405-0012", "plate": "12B345-67",
  "verify": "https://…/verify/7KQ2-9XHD"
}`}</pre>
          </div>
        </Card>
      )}
      {tab === "keys" && (
        <Card>
          <CardHeader
            title={L("کلیدهای API", "API keys")}
            actions={
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  const k = `tzn_live_${Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("")}`;
                  setNewKey(k);
                  setKeys((ks) => [...ks, { name: L("کلید جدید", "New key"), prefix: k.slice(0, 13), scopes: "tickets:read", created: new Date().toISOString().slice(0, 10) }]);
                }}
              >
                {L("ساخت کلید", "Create key")}
              </Button>
            }
          />
          {newKey && (
            <div className="m-4 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm">
              <div className="mb-1 font-semibold">{L("این کلید فقط یک بار نمایش داده می‌شود", "This key is shown only once")}</div>
              <div className="flex items-center gap-2">
                <code className="flex-1 truncate font-mono text-xs ltr">{newKey}</code>
                <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard?.writeText(newKey); toast.success(L("کپی شد", "Copied")); }}>
                  <Copy className="size-3.5" />
                </Button>
              </div>
            </div>
          )}
          <Table head={[L("نام", "Name"), L("پیشوند", "Prefix"), L("دسترسی", "Scopes"), L("ساخت", "Created")]}>
            {keys.map((k) => (
              <tr key={k.prefix}>
                <Td>{k.name}</Td>
                <Td className="font-mono text-xs ltr">{k.prefix}••••••••</Td>
                <Td className="font-mono text-xs">{k.scopes}</Td>
                <Td className="num text-xs">{k.created}</Td>
              </tr>
            ))}
          </Table>
        </Card>
      )}
      {tab === "mapping" && (
        <Card>
          <CardHeader title={L("نگاشت فیلد به ERP", "ERP field mapping")} subtitle={L("نمونه برای SAP/راهکاران/همکاران سیستم — قابل تنظیم", "Sample for SAP / local ERPs — configurable")} />
          <Table head={[L("فیلد سامانه", "System field"), "", L("فیلد ERP", "ERP field"), L("نوع", "Type")]}>
            {MAPPING.map(([a, b, t]) => (
              <tr key={a}>
                <Td className="font-mono text-xs">{a}</Td>
                <Td>→</Td>
                <Td className="font-mono text-xs">{b}</Td>
                <Td className="text-xs text-muted">{t}</Td>
              </tr>
            ))}
          </Table>
        </Card>
      )}
    </div>
  );
}
