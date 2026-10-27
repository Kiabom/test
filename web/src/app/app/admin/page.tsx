"use client";
import { Building2, Check, Clock, Flag, Settings, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";
import { PLANS } from "@/components/marketing/content";
import { Badge, Button, Card, CardHeader, cx, Kv, PageHeader, Switch, Table, Tabs, Td, toast } from "@/components/ui";
import { ALL_PERMISSIONS, can, ROLES } from "@/domain/rbac";
import { fmtNum } from "@/lib/format";
import { useMasters } from "@/lib/live";
import { usePrefs, useL, useLocale } from "@/lib/prefs";
import { USERS_LIST } from "@/lib/users";

type Tab = "users" | "rbac" | "sites" | "shifts" | "settings" | "flags";

const FLAGS: { key: string; fa: string; en: string; tier: "basic" | "pro" | "ent" }[] = [
  { key: "anpr", fa: "پلاک‌خوان ANPR", en: "ANPR", tier: "pro" },
  { key: "rfid", fa: "RFID UHF", en: "UHF RFID", tier: "pro" },
  { key: "exitQr", fa: "مجوز خروج QR", en: "QR exit permit", tier: "pro" },
  { key: "driverPortal", fa: "پورتال و مانیتور راننده", en: "Driver portal & display", tier: "pro" },
  { key: "kiosk", fa: "کیوسک لمسی", en: "Touch kiosk", tier: "pro" },
  { key: "lidar", fa: "LiDAR حجم‌سنجی", en: "LiDAR volumetrics", tier: "ent" },
  { key: "uvss", fa: "اسکن زیر خودرو (UVSS)", en: "Under-vehicle scan (UVSS)", tier: "ent" },
  { key: "payload", fa: "Payload لودر", en: "Loader payload", tier: "ent" },
  { key: "loadcell", fa: "سلامت لودسل", en: "Load-cell health", tier: "ent" },
  { key: "fleet", fa: "KPI ناوگان", en: "Fleet KPIs", tier: "ent" },
  { key: "billing", fa: "صورت‌حساب مشتری", en: "Customer billing", tier: "ent" },
  { key: "multisite", fa: "چندشعبه", en: "Multi-site", tier: "ent" },
];
const TIER_RANK = { basic: 0, pro: 1, ent: 2 } as const;

export default function AdminPage() {
  const L = useL();
  const locale = useLocale();
  const masters = useMasters();
  const setUser = usePrefs((s) => s.setUser);
  const userId = usePrefs((s) => s.userId);
  const [tab, setTab] = useState<Tab>("users");
  const [tier, setTier] = useState<"basic" | "pro" | "ent">("ent");
  const [flags, setFlags] = useState<Record<string, boolean>>(() => Object.fromEntries(FLAGS.map((f) => [f.key, true])));
  const roleName = (code: string) => {
    const r = ROLES.find((x) => x.code === code);
    return r ? (locale === "fa" ? r.name : r.nameEn) : code;
  };
  const PERM_LABEL: Record<string, [string, string]> = {
    "gate.decide": ["تصمیم دروازه", "Gate decision"],
    "gate.guest": ["ثبت مهمان", "Guest entry"],
    "weigh.capture": ["ثبت وزن", "Capture weight"],
    "weigh.manual": ["وزن دستی", "Manual weight"],
    "tx.finalize": ["نهایی‌سازی تیکت", "Finalize ticket"],
    "tx.void": ["ابطال", "Void"],
    "tx.print": ["چاپ/ارسال", "Print/send"],
    "exit.issue": ["صدور مجوز خروج", "Issue exit permit"],
    "exit.scan": ["اسکن خروج", "Exit scan"],
    "permit.manage": ["مدیریت حواله", "Manage permits"],
    "master.edit": ["اطلاعات پایه", "Master data"],
    "alert.manage": ["مدیریت هشدار", "Manage alerts"],
    "fraud.review": ["بازبینی تقلب", "Fraud review"],
    "calibration.edit": ["کالیبراسیون", "Calibration"],
    "report.read": ["گزارش", "Reports"],
    "billing.read": ["صورت‌حساب", "Billing"],
    "audit.read": ["ممیزی", "Audit"],
    "admin.manage": ["مدیریت سامانه", "Administration"],
    "sim.control": ["شبیه‌ساز", "Simulator"],
  };
  return (
    <div>
      <PageHeader icon={<Settings className="size-5" />} title={L("مدیریت سامانه", "Administration")} subtitle={L("کاربران و نقش‌ها، ماتریس دسترسی، شعب، شیفت‌ها، تنظیمات و سطح اشتراک", "Users & roles, permission matrix, sites, shifts, settings and subscription tier")} />
      <Tabs
        className="mb-3"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "users", label: L("کاربران", "Users"), icon: <Users className="size-4" /> },
          { id: "rbac", label: L("ماتریس دسترسی", "RBAC matrix"), icon: <ShieldCheck className="size-4" /> },
          { id: "sites", label: L("شعب", "Sites"), icon: <Building2 className="size-4" /> },
          { id: "shifts", label: L("شیفت‌ها", "Shifts"), icon: <Clock className="size-4" /> },
          { id: "settings", label: L("تنظیمات", "Settings"), icon: <Settings className="size-4" /> },
          { id: "flags", label: L("اشتراک و قابلیت‌ها", "Plan & features"), icon: <Flag className="size-4" /> },
        ]}
      />
      {tab === "users" && (
        <Card>
          <Table head={[L("کاربر", "User"), L("شناسه", "ID"), L("نقش", "Role"), L("دسترسی‌ها", "Permissions"), "MFA", ""]}>
            {USERS_LIST.map((u) => (
              <tr key={u.id} className={cx(u.id === userId && "bg-primary/5")}>
                <Td>
                  <span className="flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{(locale === "fa" ? u.name : u.nameEn).slice(0, 1)}</span>
                    {locale === "fa" ? u.name : u.nameEn}
                  </span>
                </Td>
                <Td className="font-mono text-xs">{u.id}</Td>
                <Td>
                  <Badge tone="primary">{roleName(u.role)}</Badge>
                </Td>
                <Td className="num text-xs">{fmtNum(ALL_PERMISSIONS.filter((p) => can(u.role, p)).length, locale)} / {fmtNum(ALL_PERMISSIONS.length, locale)}</Td>
                <Td>{["system_admin", "site_manager", "auditor", "finance"].includes(u.role) ? <Badge tone="success">TOTP</Badge> : <span className="text-xs text-muted">—</span>}</Td>
                <Td>
                  {u.id === userId ? (
                    <Badge tone="success">{L("کاربر فعلی", "Current")}</Badge>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => { setUser(u.id); toast.info(L(`اکنون با نقش «${roleName(u.role)}» کار می‌کنید`, `Now acting as “${roleName(u.role)}”`)); }}>
                      {L("ورود به‌جای این کاربر (دمو)", "Act as (demo)")}
                    </Button>
                  )}
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
      )}
      {tab === "rbac" && (
        <Card className="overflow-x-auto">
          <CardHeader title={L("ماتریس نقش × دسترسی", "Role × permission matrix")} subtitle={L("سمت سرور اعمال می‌شود؛ اقدام غیرمجاز = FORBIDDEN و ثبت در audit", "Enforced server-side; unauthorised action = FORBIDDEN and audited")} />
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="sticky start-0 bg-surface p-2 text-start">{L("نقش", "Role")}</th>
                {ALL_PERMISSIONS.map((p) => (
                  <th key={p} className="p-1 align-bottom">
                    <div className="mx-auto w-5 whitespace-nowrap text-[10px] font-medium text-muted [writing-mode:vertical-rl]">{L(...(PERM_LABEL[p] ?? [p, p]))}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROLES.map((r) => (
                <tr key={r.code} className="border-t border-border">
                  <td className="sticky start-0 bg-surface p-2 font-medium">{locale === "fa" ? r.name : r.nameEn}</td>
                  {ALL_PERMISSIONS.map((p) => (
                    <td key={p} className="p-1 text-center">
                      {can(r.code, p) ? <Check className="mx-auto size-4 text-success" /> : <span className="text-border">·</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {tab === "sites" && (
        <div className="grid gap-4 md:grid-cols-2">
          {(masters?.sites ?? []).map((s) => (
            <Card key={s.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold">{locale === "fa" ? s.name : s.nameEn}</div>
                <Badge tone={s.id === "S1" ? "success" : "info"}>{s.id === "S1" ? L("فعال (شبیه‌سازی زنده)", "Active (live sim)") : L("تجمیع ستادی", "HQ roll-up")}</Badge>
              </div>
              <Kv k={L("کد", "Code")} v={s.code} />
              <Kv k={L("شعبه", "Branch")} v={s.branch} />
              <Kv k={L("منطقه زمانی", "Timezone")} v={s.timezone} />
              <Kv k={L("لاین‌ها", "Lanes")} v={fmtNum((masters?.lanes ?? []).filter((l) => l.siteId === s.id).length, locale)} />
              <Kv k={L("باسکول‌ها", "Scales")} v={fmtNum((masters?.scales ?? []).filter((l) => l.siteId === s.id).length, locale)} />
            </Card>
          ))}
        </div>
      )}
      {tab === "shifts" && (
        <Card>
          <Table head={[L("کد", "Code"), L("نام", "Name"), L("شروع", "Start"), L("پایان", "End"), L("هدف تناژ", "Target tons"), L("انتقال Visit باز", "Carry open visits")]}>
            {(masters?.shifts ?? []).map((s) => (
              <tr key={s.id}>
                <Td className="font-bold">{s.code}</Td>
                <Td>{locale === "fa" ? s.name : s.nameEn}</Td>
                <Td className="num">{String(s.startHour).padStart(2, "0")}:00</Td>
                <Td className="num">{String(s.endHour).padStart(2, "0")}:00</Td>
                <Td className="num">{fmtNum(s.targetTons, locale)}</Td>
                <Td>
                  <Badge tone="info">{L("خودکار به شیفت بعد", "Auto to next shift")}</Badge>
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
      )}
      {tab === "settings" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4">
            <div className="mb-2 font-bold">{L("قواعد توزین", "Weighing rules")}</div>
            <Kv k={L("حداکثر سن فریم وزن", "Max weight frame age")} v="12 s" />
            <Kv k={L("پنجره پایداری", "Stability window")} v="± 1 d × 2 s" />
            <Kv k={L("اعتبار تارای ذخیره", "Stored tare validity")} v={L("۳۰ روز", "30 days")} />
            <Kv k={L("آستانه تارای غیرعادی (R16)", "Tare outlier (R16)")} v="± 600 kg / median 10" />
            <Kv k={L("خالص منفی", "Negative net")} v={L("استثنا — بدون قدر مطلق", "Exception — never abs()")} />
            <Kv k={L("وزن دستی", "Manual weight")} v={L("دلیل + امضای دوم + برچسب «دستی»", "Reason + second signer + “manual” label")} />
          </Card>
          <Card className="p-4">
            <div className="mb-2 font-bold">{L("دروازه و امنیت", "Gate & security")}</div>
            <Kv k={L("حداقل اطمینان ANPR", "Min ANPR confidence")} v="0.85" />
            <Kv k={L("تطبیق پلاک و RFID", "Plate/RFID fusion")} v={L("اجباری برای خودروهای ثبت‌شده", "Mandatory for registered vehicles")} />
            <Kv k="Anti-passback" v={L("فعال", "On")} />
            <Kv k={L("اعتبار QR خروج", "Exit QR validity")} v={L("یک‌بارمصرف، ۴ ساعت", "Single use, 4 h")} />
            <Kv k={L("باز شدن راهبند", "Barrier open")} v={L("فقط درخواست؛ تأیید ACK از PLC", "Request only; PLC ACK confirms")} />
            <Kv k={L("نگهداری تصاویر", "Image retention")} v={L("۱۸۰ روز (شواهد پرونده: نامحدود)", "180 days (case evidence: unlimited)")} />
          </Card>
          <Card className="p-4">
            <div className="mb-2 font-bold">{L("نمایش", "Display")}</div>
            <Kv k={L("زبان پیش‌فرض", "Default language")} v="فارسی (RTL)" />
            <Kv k={L("تقویم", "Calendar")} v={L("شمسی؛ ذخیره UTC", "Jalali; stored in UTC")} />
            <Kv k={L("واحد وزن", "Weight unit")} v="kg (tabular, LTR)" />
            <Kv k={L("برند", "Brand")} v="توزین‌نگار / TozinNegar" />
          </Card>
          <Card className="p-4">
            <div className="mb-2 font-bold">{L("نگهداری داده", "Data")}</div>
            <Kv k={L("پایگاه داده", "Database")} v={L("درون‌حافظه‌ای (دمو) — لایه Repository برای Postgres", "In-memory (demo) — repository layer for Postgres")} />
            <Kv k="Audit" v="HMAC-SHA256 chain, append-only" />
            <Kv k={L("پشتیبان‌گیری", "Backup")} v={L("روزانه ۰۲:۰۰ (نمونه)", "Daily 02:00 (sample)")} />
          </Card>
        </div>
      )}
      {tab === "flags" && (
        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <div className="grid gap-3">
            {PLANS.map((p) => (
              <button key={p.id} onClick={() => setTier(p.id as typeof tier)} className={cx("rounded-xl border-2 p-4 text-start transition", tier === p.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40")}>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">{locale === "fa" ? p.fa : p.en}</span>
                  {tier === p.id && <Badge tone="primary">{L("اشتراک فعلی", "Current plan")}</Badge>}
                </div>
                <ul className="mt-2 space-y-1 text-xs text-muted">
                  {p.features.map(([fa, en]) => (
                    <li key={en}>• {locale === "fa" ? fa : en}</li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
          <Card>
            <CardHeader title={L("قابلیت‌ها (feature flags)", "Feature flags")} subtitle={L("قابلیت‌های خارج از سطح اشتراک قفل‌اند", "Features above the plan tier are locked")} />
            <div className="divide-y divide-border">
              {FLAGS.map((f) => {
                const allowed = TIER_RANK[tier] >= TIER_RANK[f.tier];
                return (
                  <div key={f.key} className={cx("flex items-center justify-between px-4 py-2.5", !allowed && "opacity-50")}>
                    <span className="text-sm">
                      {L(f.fa, f.en)} <Badge className="ms-1">{f.tier === "pro" ? "Pro" : f.tier === "ent" ? "Enterprise" : "Basic"}</Badge>
                    </span>
                    <Switch checked={allowed && flags[f.key]} onChange={(b) => allowed && setFlags((x) => ({ ...x, [f.key]: b }))} />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
