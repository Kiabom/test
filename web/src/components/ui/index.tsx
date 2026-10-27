"use client";
import { clsx } from "clsx";
import { AlertTriangle, Ban, CheckCircle2, HelpCircle, Hand, Info, Loader2, PauseCircle, Sigma, WifiOff, X } from "lucide-react";
import { useEffect, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { create } from "zustand";
import { useL } from "@/lib/prefs";

export const cx = clsx;

// ---------- Button ----------
type BtnVariant = "primary" | "secondary" | "ghost" | "danger" | "success" | "warning";
type BtnSize = "sm" | "md" | "lg" | "xl";
export function Button({ variant = "secondary", size = "md", loading, className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: BtnSize; loading?: boolean }) {
  const v: Record<BtnVariant, string> = {
    primary: "bg-primary text-primary-fg hover:brightness-110 shadow-sm",
    secondary: "bg-surface text-text border border-border hover:bg-surface-2",
    ghost: "text-text hover:bg-surface-2",
    danger: "bg-danger text-white hover:brightness-110",
    success: "bg-success text-white hover:brightness-110",
    warning: "bg-warning text-white hover:brightness-110",
  };
  const s: Record<BtnSize, string> = { sm: "h-8 px-3 text-xs gap-1.5", md: "h-10 px-4 text-sm gap-2", lg: "h-12 px-5 text-base gap-2", xl: "h-16 px-7 text-lg gap-3" };
  return (
    <button className={cx("inline-flex items-center justify-center rounded-lg font-medium transition disabled:cursor-not-allowed disabled:opacity-45", v[variant], s[size], className)} disabled={rest.disabled || loading} {...rest}>
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

// ---------- Card ----------
export function Card({ className, children, ...rest }: { className?: string; children: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx("rounded-xl border border-border bg-surface shadow-[0_1px_2px_rgb(16_42_67/.06),0_4px_12px_rgb(16_42_67/.04)]", className)} {...rest}>
      {children}
    </div>
  );
}
export function CardHeader({ title, subtitle, icon, actions, className }: { title: ReactNode; subtitle?: ReactNode; icon?: ReactNode; actions?: ReactNode; className?: string }) {
  return (
    <div className={cx("flex items-start justify-between gap-3 border-b border-border px-4 py-3", className)}>
      <div className="flex min-w-0 items-center gap-2">
        {icon && <span className="text-primary">{icon}</span>}
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{title}</div>
          {subtitle && <div className="truncate text-xs text-muted">{subtitle}</div>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

// ---------- Badges ----------
export function Badge({ children, tone = "neutral", className }: { children: ReactNode; tone?: "neutral" | "primary" | "success" | "warning" | "danger" | "info" | "offline"; className?: string }) {
  const t = {
    neutral: "bg-surface-2 text-muted border-border",
    primary: "bg-primary/10 text-primary border-primary/25",
    success: "bg-success/10 text-success border-success/25",
    warning: "bg-warning/12 text-warning border-warning/30",
    danger: "bg-danger/10 text-danger border-danger/25",
    info: "bg-info/10 text-info border-info/25",
    offline: "bg-offline/15 text-muted border-offline/30",
  }[tone];
  return <span className={cx("inline-flex items-center gap-1 whitespace-nowrap rounded-md border px-1.5 py-0.5 text-[11px] font-medium", t, className)}>{children}</span>;
}

export type Status = "PASS" | "REVIEW" | "HOLD" | "BLOCK" | "OFFLINE" | "UNKNOWN" | "ESTIMATED" | "MANUAL" | "INFO";
export function StatusPill({ status, label, size = "sm" }: { status: Status; label?: string; size?: "sm" | "md" | "lg" }) {
  const L = useL();
  const map: Record<Status, { tone: Parameters<typeof Badge>[0]["tone"]; icon: ReactNode; fa: string; en: string }> = {
    PASS: { tone: "success", icon: <CheckCircle2 className="size-3.5" />, fa: "مجاز", en: "Pass" },
    REVIEW: { tone: "warning", icon: <AlertTriangle className="size-3.5" />, fa: "نیاز به بازبینی", en: "Review" },
    HOLD: { tone: "danger", icon: <PauseCircle className="size-3.5" />, fa: "توقف", en: "Hold" },
    BLOCK: { tone: "danger", icon: <Ban className="size-3.5" />, fa: "مسدود", en: "Blocked" },
    OFFLINE: { tone: "offline", icon: <WifiOff className="size-3.5" />, fa: "آفلاین", en: "Offline" },
    UNKNOWN: { tone: "offline", icon: <HelpCircle className="size-3.5" />, fa: "نامشخص", en: "Unknown" },
    ESTIMATED: { tone: "info", icon: <Sigma className="size-3.5" />, fa: "تخمینی", en: "Estimated" },
    MANUAL: { tone: "warning", icon: <Hand className="size-3.5" />, fa: "دستی", en: "Manual" },
    INFO: { tone: "info", icon: <Info className="size-3.5" />, fa: "اطلاع", en: "Info" },
  };
  const m = map[status];
  return (
    <Badge tone={m.tone} className={cx(size === "md" && "px-2 py-1 text-xs", size === "lg" && "px-3 py-1.5 text-sm")}>
      {m.icon}
      {label ?? L(m.fa, m.en)}
    </Badge>
  );
}

// ---------- KPI ----------
export function Sparkline({ data, color = "var(--primary)", height = 28, width = 96 }: { data: number[]; color?: string; height?: number; width?: number }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const pts = data.map((v, i) => `${(i / Math.max(1, data.length - 1)) * width},${height - ((v - min) / (max - min || 1)) * (height - 2) - 1}`).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function KpiTile({ label, value, unit, hint, icon, tone = "primary", spark, className }: { label: ReactNode; value: ReactNode; unit?: string; hint?: ReactNode; icon?: ReactNode; tone?: "primary" | "success" | "warning" | "danger" | "info" | "neutral"; spark?: number[]; className?: string }) {
  const toneCls = { primary: "text-primary bg-primary/10", success: "text-success bg-success/10", warning: "text-warning bg-warning/12", danger: "text-danger bg-danger/10", info: "text-info bg-info/10", neutral: "text-muted bg-surface-2" }[tone];
  return (
    <Card className={cx("flex flex-col gap-2 p-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted">{label}</span>
        {icon && <span className={cx("grid size-8 place-items-center rounded-lg", toneCls)}>{icon}</span>}
      </div>
      <div className="flex items-end justify-between gap-2">
        <div className="flex items-baseline gap-1">
          <span className="num text-2xl font-bold tracking-tight">{value}</span>
          {unit && <span className="text-xs text-muted">{unit}</span>}
        </div>
        {spark && <Sparkline data={spark} color={`var(--${tone === "neutral" ? "muted" : tone})`} />}
      </div>
      {hint && <div className="text-[11px] text-muted">{hint}</div>}
    </Card>
  );
}

// ---------- Tabs ----------
export function Tabs<T extends string>({ tabs, value, onChange, className }: { tabs: { id: T; label: ReactNode; icon?: ReactNode; badge?: ReactNode }[]; value: T; onChange: (v: T) => void; className?: string }) {
  return (
    <div className={cx("flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface p-1", className)} role="tablist">
      {tabs.map((t) => (
        <button key={t.id} role="tab" aria-selected={value === t.id} onClick={() => onChange(t.id)} className={cx("flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition", value === t.id ? "bg-primary text-primary-fg shadow-sm" : "text-muted hover:bg-surface-2 hover:text-text")}>
          {t.icon}
          {t.label}
          {t.badge}
        </button>
      ))}
    </div>
  );
}

export function Segmented<T extends string>({ options, value, onChange, size = "sm" }: { options: { id: T; label: ReactNode }[]; value: T; onChange: (v: T) => void; size?: "sm" | "md" }) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-surface-2 p-0.5">
      {options.map((o) => (
        <button key={o.id} onClick={() => onChange(o.id)} className={cx("rounded-md font-medium transition", size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm", value === o.id ? "bg-surface text-text shadow-sm" : "text-muted hover:text-text")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ---------- Inputs ----------
export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx("h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none placeholder:text-muted/70 focus:border-primary", className)} {...rest} />;
}
export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cx("h-10 rounded-lg border border-border bg-surface px-2 text-sm outline-none focus:border-primary", className)} {...rest}>
      {children}
    </select>
  );
}
export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (b: boolean) => void; label?: ReactNode }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
      <span role="switch" aria-checked={checked} tabIndex={0} onKeyDown={(e) => (e.key === " " || e.key === "Enter") && onChange(!checked)} onClick={() => onChange(!checked)} className={cx("relative h-5 w-9 rounded-full transition", checked ? "bg-success" : "bg-offline/60")}>
        <span className={cx("absolute top-0.5 size-4 rounded-full bg-white shadow transition-all", checked ? "start-[18px]" : "start-0.5")} />
      </span>
      {label}
    </label>
  );
}
export function Field({ label, children, hint }: { label: ReactNode; children: ReactNode; hint?: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-muted">{hint}</span>}
    </label>
  );
}

// ---------- Overlay ----------
export function Dialog({ open, onClose, title, children, footer, wide }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div role="dialog" aria-modal className={cx("max-h-[90vh] w-full overflow-auto rounded-2xl border border-border bg-surface shadow-2xl", wide ? "max-w-3xl" : "max-w-md")} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="font-semibold">{title}</div>
          <button onClick={onClose} className="rounded-md p-1 text-muted hover:bg-surface-2" aria-label="close">
            <X className="size-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-border px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}

export function Drawer({ open, onClose, title, children, width = "max-w-xl" }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; width?: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/35" onClick={onClose}>
      <div className={cx("h-full w-full overflow-auto border-s border-border bg-surface shadow-2xl", width)} onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-5 py-3">
          <div className="font-semibold">{title}</div>
          <button onClick={onClose} className="rounded-md p-1 text-muted hover:bg-surface-2" aria-label="close">
            <X className="size-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/** Confirmation with mandatory reason and optional second signer (two-person rule). */
export function ConfirmDialog({ open, onClose, onConfirm, title, description, needReason = true, needSigner = false, confirmLabel, danger, users = [] }: {
  open: boolean;
  onClose: () => void;
  onConfirm: (v: { reason: string; signer: string }) => Promise<void> | void;
  title: ReactNode;
  description?: ReactNode;
  needReason?: boolean;
  needSigner?: boolean;
  confirmLabel?: ReactNode;
  danger?: boolean;
  users?: { id: string; name: string }[];
}) {
  const L = useL();
  const [reason, setReason] = useState("");
  const [signer, setSigner] = useState("");
  const [busy, setBusy] = useState(false);
  const ok = (!needReason || reason.trim().length >= 3) && (!needSigner || !!signer);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {L("انصراف", "Cancel")}
          </Button>
          <Button
            variant={danger ? "danger" : "primary"}
            disabled={!ok}
            loading={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await onConfirm({ reason: reason.trim(), signer });
                setReason("");
                setSigner("");
                onClose();
              } finally {
                setBusy(false);
              }
            }}
          >
            {confirmLabel ?? L("تأیید", "Confirm")}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {description && <div className="text-sm text-muted">{description}</div>}
        {needReason && (
          <Field label={L("دلیل (الزامی — در audit ثبت می‌شود)", "Reason (required — recorded in audit)")}>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="w-full rounded-lg border border-border bg-surface p-2 text-sm outline-none focus:border-primary" />
          </Field>
        )}
        {needSigner && (
          <Field label={L("امضای دوم (کاربر دیگر)", "Second signer (another user)")} hint={L("قانون دو نفره برای موارد بحرانی", "Two-person rule for critical actions")}>
            <Select value={signer} onChange={(e) => setSigner(e.target.value)}>
              <option value="">{L("انتخاب کنید…", "Select…")}</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </Select>
          </Field>
        )}
      </div>
    </Dialog>
  );
}

// ---------- Misc ----------
export function EmptyState({ icon, title, hint }: { icon?: ReactNode; title: ReactNode; hint?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted">
      {icon && <div className="text-muted/70">{icon}</div>}
      <div className="text-sm font-medium">{title}</div>
      {hint && <div className="text-xs">{hint}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cx("animate-pulse rounded-lg bg-surface-2", className)} />;
}

export function Progress({ value, tone = "primary", className }: { value: number; tone?: "primary" | "success" | "warning" | "danger"; className?: string }) {
  return (
    <div className={cx("h-2 w-full overflow-hidden rounded-full bg-surface-2", className)}>
      <div className={cx("h-full rounded-full transition-all", { primary: "bg-primary", success: "bg-success", warning: "bg-warning", danger: "bg-danger" }[tone])} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function PageHeader({ title, subtitle, icon, actions }: { title: ReactNode; subtitle?: ReactNode; icon?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="flex items-center gap-3">
        {icon && <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</div>}
        <div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Kv({ k, v, mono }: { k: ReactNode; v: ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-dashed border-border py-1.5 text-sm last:border-0">
      <span className="text-muted">{k}</span>
      <span className={cx("text-end font-medium", mono && "num font-mono text-xs")}>{v}</span>
    </div>
  );
}

export function Table({ head, children, className, dense }: { head: ReactNode[]; children: ReactNode; className?: string; dense?: boolean }) {
  return (
    <div className={cx("overflow-auto", className)}>
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-[1] bg-surface-2 text-xs text-muted">
          <tr>
            {head.map((h, i) => (
              <th key={i} className={cx("whitespace-nowrap px-3 text-start font-medium", dense ? "py-2" : "py-2.5")}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}
export function Td({ children, className, ...rest }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cx("whitespace-nowrap px-3 py-2", className)} {...rest}>
      {children}
    </td>
  );
}

// ---------- Toasts ----------
interface ToastItem {
  id: number;
  tone: "success" | "danger" | "info" | "warning";
  text: string;
}
const useToastStore = create<{ items: ToastItem[]; push: (t: Omit<ToastItem, "id">) => void; remove: (id: number) => void }>((set) => ({
  items: [],
  push: (t) => {
    const id = Date.now() + Math.random();
    set((s) => ({ items: [...s.items, { ...t, id }] }));
    setTimeout(() => set((s) => ({ items: s.items.filter((x) => x.id !== id) })), 4200);
  },
  remove: (id) => set((s) => ({ items: s.items.filter((x) => x.id !== id) })),
}));
export const toast = {
  success: (text: string) => useToastStore.getState().push({ tone: "success", text }),
  error: (text: string) => useToastStore.getState().push({ tone: "danger", text }),
  info: (text: string) => useToastStore.getState().push({ tone: "info", text }),
  warn: (text: string) => useToastStore.getState().push({ tone: "warning", text }),
};
export function Toaster() {
  const items = useToastStore((s) => s.items);
  const remove = useToastStore((s) => s.remove);
  return (
    <div className="pointer-events-none fixed bottom-4 start-4 z-[60] flex w-[min(92vw,380px)] flex-col gap-2">
      {items.map((t) => (
        <div key={t.id} className={cx("pointer-events-auto flex items-start gap-2 rounded-xl border px-4 py-3 text-sm shadow-lg rise", { success: "border-success/30 bg-surface text-success", danger: "border-danger/30 bg-surface text-danger", info: "border-info/30 bg-surface text-info", warning: "border-warning/30 bg-surface text-warning" }[t.tone])}>
          <span className="flex-1 text-text">{t.text}</span>
          <button onClick={() => remove(t.id)} className="text-muted">
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
