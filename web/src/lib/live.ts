"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { create } from "zustand";
import type * as T from "@/domain/types";
import type { LiveData } from "@/server/views";
import { usePrefs } from "./prefs";

interface LiveStore {
  data: LiveData | null;
  connected: boolean;
  lastAt: number;
  set: (d: LiveData) => void;
  setConnected: (c: boolean) => void;
}

export const useLiveStore = create<LiveStore>((set) => ({
  data: null,
  connected: false,
  lastAt: 0,
  set: (data) => set({ data, lastAt: Date.now(), connected: true }),
  setConnected: (connected) => set({ connected }),
}));

let es: EventSource | null = null;
let refs = 0;

/** Opens a single shared SSE connection for the whole tab. */
export function useLiveConnection() {
  useEffect(() => {
    refs++;
    if (!es) {
      const open = () => {
        es = new EventSource("/api/stream");
        es.addEventListener("tick", (ev) => {
          try {
            useLiveStore.getState().set(JSON.parse((ev as MessageEvent).data));
          } catch {
            /* ignore malformed frame */
          }
        });
        es.onerror = () => useLiveStore.getState().setConnected(false);
      };
      open();
    }
    return () => {
      refs--;
      if (refs <= 0 && es) {
        es.close();
        es = null;
      }
    };
  }, []);
}

export function useLive() {
  return useLiveStore((s) => s.data);
}

export function useRevision() {
  return useLiveStore((s) => s.data?.revision ?? 0);
}

/** Fetch JSON and refetch when the server revision changes (throttled). */
export function useFetch<R>(url: string | null, throttleMs = 1500): { data: R | null; loading: boolean; error: string | null; reload: () => void } {
  const revision = useRevision();
  const [data, setData] = useState<R | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const last = useRef(0);
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [nonce, setNonce] = useState(0);

  const load = useCallback(async () => {
    if (!url) return;
    last.current = Date.now();
    try {
      const r = await fetch(url, { cache: "no-store" });
      if (!r.ok) {
        setError(String(r.status));
        setData(null);
      } else {
        setData(await r.json());
        setError(null);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load, nonce]);

  useEffect(() => {
    if (!url) return;
    const since = Date.now() - last.current;
    if (since >= throttleMs) load();
    else if (!pending.current) {
      pending.current = setTimeout(() => {
        pending.current = null;
        load();
      }, throttleMs - since);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revision]);

  return { data, loading, error, reload: () => setNonce((n) => n + 1) };
}

/** Pass `null` params to skip fetching (e.g. no id selected yet). */
export function useView<R>(name: string, params: Record<string, string | undefined> | null = {}, throttleMs?: number) {
  const qs = params ? new URLSearchParams(Object.entries(params).filter(([, v]) => v != null) as [string, string][]).toString() : "";
  return useFetch<R>(params ? `/api/view/${name}${qs ? "?" + qs : ""}` : null, throttleMs);
}

export function useData<R>(collection: string, params: Record<string, string | number | undefined> = {}, throttleMs = 2500) {
  const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])).toString();
  return useFetch<{ total: number; items: R[] }>(`/api/data/${collection}${qs ? "?" + qs : ""}`, throttleMs);
}

export interface Masters {
  sites: T.Site[];
  lanes: T.Lane[];
  scales: T.Scale[];
  devices: T.Device[];
  vehicles: T.Vehicle[];
  drivers: T.Driver[];
  carriers: T.Carrier[];
  customers: T.Customer[];
  materials: T.Material[];
  locations: T.Location[];
  shifts: T.Shift[];
  users: T.User[];
  equipment: T.Equipment[];
  permits: T.Permit[];
  contracts: T.Contract[];
  rules: T.AlertRule[];
  calibrations: T.CalibrationRecord[];
}

export function useMasters() {
  return useFetch<Masters>("/api/data/masters", 4000).data;
}

export class ActionError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

export async function act<R = unknown>(type: string, payload: Record<string, unknown> = {}): Promise<R> {
  const userId = usePrefs.getState().userId;
  const r = await fetch("/api/action", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-demo-user": userId },
    body: JSON.stringify({ type, payload, idempotencyKey: `${type}-${Date.now()}-${Math.random().toString(36).slice(2)}` }),
  });
  const j = await r.json();
  if (!j.ok) throw new ActionError(j.error, j.message);
  return j.result as R;
}

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
