"use client";
import { ExternalLink, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Dialog, Segmented, toast } from "@/components/ui";
import { can } from "@/domain/rbac";
import { act } from "@/lib/live";
import { useLive } from "@/lib/live";
import { useL, usePrefs } from "@/lib/prefs";
import { USERS_LIST } from "@/lib/users";

/**
 * Presenter controls, kept out of the normal UI. Ctrl+Shift+K opens it for accounts with the
 * sim.control permission (system admin): hold/continuous flow, reset, and the product-tour pages.
 */
export function PresenterPanel() {
  const L = useL();
  const live = useLive();
  const userId = usePrefs((s) => s.userId);
  const role = USERS_LIST.find((u) => u.id === userId)?.role;
  const allowed = !!role && can(role, "sim.control");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!allowed) return;
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === "KeyK") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [allowed]);

  if (!allowed) return null;
  const run = async (type: string, payload: Record<string, unknown>, ok: string) => {
    setBusy(true);
    try {
      await act(type, payload);
      toast.success(ok);
    } finally {
      setBusy(false);
    }
  };
  const close = () => setOpen(false);
  return (
    <Dialog open={open} onClose={close} title={L("کنترل ارائه", "Presenter controls")}>
      <div className="flex flex-col gap-5" data-testid="presenter-panel">
        <div>
          <div className="mb-2 text-xs font-medium text-muted">{L("جریان تردد", "Traffic flow")}</div>
          <Segmented
            size="md"
            options={[
              { id: "PRESENTATION", label: L("ثابت", "Hold") },
              { id: "LIVE", label: L("جریان پیوسته", "Continuous") },
            ]}
            value={live?.scene ?? "PRESENTATION"}
            onChange={(sc) => run("sim.scene", { scene: sc }, sc === "LIVE" ? L("جریان پیوسته روشن شد", "Continuous flow on") : L("وضعیت ثابت شد", "Held"))}
          />
        </div>
        <Button variant="secondary" loading={busy} onClick={() => run("sim.reset", {}, L("وضعیت سایت بازنشانی شد", "Site state reset"))}>
          <RotateCcw className="size-4" /> {L("بازنشانی وضعیت سایت", "Reset site state")}
        </Button>
        <div className="grid gap-1 text-sm">
          {[
            ["/app/console", L("کنسول سرویس و سناریوها", "Service console & scenarios"), false],
            ["/showcase", L("معرفی محصول", "Product tour"), true],
            ["/present", L("اسلایدها", "Slides"), true],
          ].map(([href, label, ext]) =>
            ext ? (
              <a key={href as string} href={href as string} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-surface-2">
                {label} <ExternalLink className="size-3.5 text-muted" />
              </a>
            ) : (
              <Link key={href as string} href={href as string} onClick={close} className="rounded-lg px-3 py-2 hover:bg-surface-2">
                {label}
              </Link>
            ),
          )}
        </div>
        <div className="text-[11px] text-muted">Ctrl + Shift + K</div>
      </div>
    </Dialog>
  );
}
