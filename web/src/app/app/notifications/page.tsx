"use client";
import { BellRing, Mail, MessageCircle, MessageSquareText, Smartphone } from "lucide-react";
import { useState } from "react";
import { Badge, Card, CardHeader, cx, PageHeader, Segmented, Skeleton, Switch, Table, Td } from "@/components/ui";
import type { OutboxMessage } from "@/domain/types";
import { fmtDateTime, fmtNum, fmtTime } from "@/lib/format";
import { useData } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";

type Ch = "SMS" | "WHATSAPP" | "EMAIL";
const ICON = { SMS: MessageSquareText, WHATSAPP: MessageCircle, EMAIL: Mail };
const TEMPLATES: { code: string; ch: Ch; fa: string; en: string; body: string }[] = [
  { code: "driver.link", ch: "SMS", fa: "لینک پورتال راننده هنگام ورود", en: "Driver portal link on entry", body: "راننده گرامی، نوبت شما {queueNo} است. وضعیت سفر: {link}" },
  { code: "queue.call", ch: "SMS", fa: "فراخوان به باسکول", en: "Call to scale", body: "پلاک {plate}: لطفاً به باسکول {lane} مراجعه کنید." },
  { code: "ticket.ready", ch: "WHATSAPP", fa: "رسید توزین با QR", en: "Weighing receipt with QR", body: "رسید {ticketNo} — خالص {netKg} kg — راستی‌آزمایی: {verifyUrl}" },
  { code: "exit.permit", ch: "SMS", fa: "مجوز خروج یک‌بارمصرف", en: "One-time exit permit", body: "مجوز خروج {serial}: {exitUrl} (فقط یک بار معتبر)" },
  { code: "permit.low", ch: "EMAIL", fa: "مانده حواله کمتر از ۱۰٪", en: "Permit balance below 10%", body: "مانده حواله {permitNo} به {remainingT} تن رسید." },
  { code: "alert.critical", ch: "SMS", fa: "هشدار بحرانی به مدیر سایت", en: "Critical alert to site manager", body: "هشدار {rule}: {title} — لاین {lane}" },
  { code: "report.daily", ch: "EMAIL", fa: "گزارش روزانه", en: "Daily report", body: "گزارش روزانه {date} پیوست است." },
];

export default function NotificationsPage() {
  const L = useL();
  const locale = useLocale();
  const [ch, setCh] = useState<Ch | "ALL">("ALL");
  const { data } = useData<OutboxMessage>("outbox", { limit: 300, channel: ch === "ALL" ? undefined : ch }, 2000);
  const items = (data?.items ?? []).filter((m) => m.channel !== "ERP" && m.channel !== "WEBHOOK");
  const [sel, setSel] = useState<string>();
  const cur = items.find((m) => m.id === sel) ?? items[0];
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => Object.fromEntries(TEMPLATES.map((t) => [t.code, true])));
  return (
    <div>
      <PageHeader icon={<BellRing className="size-5" />} title={L("پیامک و اعلان‌ها", "SMS & notifications")} subtitle={L("Outbox پیامک، واتس‌اپ و ایمیل (ماک — هیچ پیام واقعی ارسال نمی‌شود)، قالب‌ها و پیش‌نمایش روی گوشی", "SMS, WhatsApp and e-mail outbox (mock — nothing is really sent), templates and phone preview")} />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader
            title={L("پیام‌های ارسالی", "Outgoing messages")}
            actions={<Segmented options={[{ id: "ALL", label: L("همه", "All") }, { id: "SMS", label: "SMS" }, { id: "WHATSAPP", label: "WhatsApp" }, { id: "EMAIL", label: "Email" }]} value={ch} onChange={setCh} />}
          />
          {!data ? (
            <Skeleton className="m-4 h-64" />
          ) : (
            <Table head={[L("زمان", "Time"), L("کانال", "Channel"), L("گیرنده", "Recipient"), L("متن", "Body"), L("وضعیت", "Status")]} dense>
              {items.map((m) => {
                const I = ICON[m.channel as Ch] ?? MessageSquareText;
                return (
                  <tr key={m.id} onClick={() => setSel(m.id)} className={cx("cursor-pointer hover:bg-surface-2", cur?.id === m.id && "bg-primary/5")}>
                    <Td className="num text-xs">{fmtDateTime(m.createdAt, locale)}</Td>
                    <Td>
                      <span className="flex items-center gap-1 text-xs">
                        <I className="size-3.5" /> {m.channel}
                      </span>
                    </Td>
                    <Td className="font-mono text-xs ltr">{m.recipient ?? "—"}</Td>
                    <Td className="max-w-80 truncate text-xs">{m.body}</Td>
                    <Td>
                      <Badge tone={m.status === "SENT" ? "success" : m.status === "PENDING" ? "warning" : "danger"}>{m.status}</Badge>
                    </Td>
                  </tr>
                );
              })}
            </Table>
          )}
        </Card>
        <div className="flex flex-col items-center gap-3">
          <div className="text-sm font-semibold text-muted">
            <Smartphone className="me-1 inline size-4" />
            {L("پیش‌نمایش روی گوشی گیرنده", "Recipient phone preview")}
          </div>
          <div className="w-[280px] rounded-[2.5rem] border-[10px] border-slate-900 bg-slate-900 shadow-2xl">
            <div className="h-[520px] overflow-hidden rounded-[1.8rem] bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
              <div className="flex items-center justify-between px-5 pt-3 text-[11px] font-semibold text-slate-600 dark:text-slate-300" dir="ltr">
                <span>{fmtTime(Date.now(), "en")}</span>
                <span>5G ▮▮▮</span>
              </div>
              <div className="mt-3 border-b border-slate-300 px-4 pb-2 text-center text-sm font-bold text-slate-700 dark:border-slate-700 dark:text-slate-200">{cur?.channel === "WHATSAPP" ? "WhatsApp · TozinNegar" : cur?.channel === "EMAIL" ? "Mail" : "TozinNegar"}</div>
              {cur ? (
                <div className="p-3">
                  <div className={cx("max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm", cur.channel === "WHATSAPP" ? "bg-[#dcf8c6] text-slate-900" : "bg-white text-slate-900 dark:bg-slate-700 dark:text-slate-100")} dir="rtl">
                    {cur.body}
                    <div className="mt-1 text-end text-[10px] text-slate-500">{fmtTime(cur.createdAt, locale)} {cur.status === "SENT" ? "✓✓" : "…"}</div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-500">{L("پیامی انتخاب نشده", "No message selected")}</div>
              )}
            </div>
          </div>
          <div className="text-center text-[11px] text-muted">{L("سهمیه پیامک ماه: ", "Monthly SMS quota: ")}<span className="num font-bold">{fmtNum(items.filter((m) => m.channel === "SMS").length, locale)}</span> / {fmtNum(10000, locale)}</div>
        </div>
      </div>
      <Card className="mt-4">
        <CardHeader title={L("قالب‌های پیام", "Message templates")} subtitle={L("متغیرها داخل {} با داده تراکنش پر می‌شوند", "Variables in {} are filled from transaction data")} />
        <Table head={[L("کد", "Code"), L("کانال", "Channel"), L("رویداد", "Event"), L("متن", "Body"), L("فعال", "On")]}>
          {TEMPLATES.map((t) => (
            <tr key={t.code}>
              <Td className="font-mono text-xs">{t.code}</Td>
              <Td>
                <Badge>{t.ch}</Badge>
              </Td>
              <Td className="text-sm">{L(t.fa, t.en)}</Td>
              <Td className="max-w-96 text-xs text-muted">{t.body}</Td>
              <Td>
                <Switch checked={enabled[t.code]} onChange={(b) => setEnabled((e) => ({ ...e, [t.code]: b }))} />
              </Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
