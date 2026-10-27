"use client";
import { Camera, CameraOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";
import { useL } from "@/lib/prefs";

/** Phone/laptop camera scanner for QR codes and Code128 barcodes (lazy-loads @zxing/browser). */
export function QrScanner({ onResult, active, onToggle }: { onResult: (text: string) => void; active: boolean; onToggle: (v: boolean) => void }) {
  const L = useL();
  const video = useRef<HTMLVideoElement>(null);
  const [err, setErr] = useState<string | null>(null);
  const last = useRef<{ t: string; at: number }>({ t: "", at: 0 });

  useEffect(() => {
    if (!active) return;
    let stop: (() => void) | undefined;
    let cancelled = false;
    (async () => {
      try {
        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        const reader = new BrowserMultiFormatReader();
        const controls = await reader.decodeFromConstraints({ video: { facingMode: { ideal: "environment" } } }, video.current!, (res) => {
          if (!res) return;
          const t = res.getText();
          const now = Date.now();
          if (t === last.current.t && now - last.current.at < 4000) return;
          last.current = { t, at: now };
          navigator.vibrate?.(80);
          onResult(t);
        });
        if (cancelled) controls.stop();
        stop = () => controls.stop();
        setErr(null);
      } catch (e) {
        setErr((e as Error).message || "camera error");
        onToggle(false);
      }
    })();
    return () => {
      cancelled = true;
      stop?.();
    };
  }, [active, onResult, onToggle]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-black">
        <video ref={video} className="size-full object-cover" muted playsInline />
        {!active && (
          <div className="absolute inset-0 grid place-items-center text-center text-white/70">
            <div>
              <CameraOff className="mx-auto mb-2 size-10" />
              <div className="text-sm">{L("دوربین خاموش است", "Camera is off")}</div>
            </div>
          </div>
        )}
        {active && (
          <div className="pointer-events-none absolute inset-[18%] rounded-2xl border-4 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]">
            <div className="absolute inset-x-0 top-1/2 h-0.5 animate-pulse bg-red-500" />
          </div>
        )}
      </div>
      <Button size="lg" variant={active ? "secondary" : "primary"} onClick={() => onToggle(!active)}>
        {active ? <CameraOff className="size-5" /> : <Camera className="size-5" />}
        {active ? L("خاموش کردن دوربین", "Stop camera") : L("روشن کردن دوربین و اسکن", "Start camera & scan")}
      </Button>
      {err && <div className="rounded-lg bg-warning/10 p-2 text-xs text-warning">{L("دسترسی به دوربین ممکن نشد (نیازمند HTTPS یا اجازه مرورگر). از ورود دستی کد استفاده کنید.", "Camera unavailable (needs HTTPS or browser permission). Use manual code entry.")} ({err})</div>}
    </div>
  );
}
