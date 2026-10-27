// E2E: smoke every route (fa + en, no console errors) and drive one full manual truck trip
// ending with the guard scanning the one-time exit QR twice (accept, then reject).
// Usage: node e2e/run.mjs [--base=http://localhost:3000] [--shots] [--skip-smoke] [--skip-flow]
import { createRequire } from "module";
import { mkdirSync } from "fs";
const require = createRequire(import.meta.url);
let pw;
try {
  pw = require("playwright");
} catch {
  pw = require("/opt/node-tools/node_modules/playwright");
}

const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}`));
const BASE = (arg("base")?.split("=")[1] ?? process.env.BASE ?? "http://localhost:3000").replace(/\/$/, "");
const SHOTS = !!arg("shots");
const SHOT_DIR = new URL("../../docs/screenshots/", import.meta.url).pathname;
const IGNORE = [/favicon/i, /EventSource/i, /ERR_ABORTED/i, /net::ERR_/i, /Download the React DevTools/i];

const api = async (path, init) => {
  const r = await fetch(BASE + path, init);
  return r.json();
};
const act = (type, payload = {}, user = "U-ADMIN") =>
  api("/api/action", { method: "POST", headers: { "Content-Type": "application/json", "x-demo-user": user }, body: JSON.stringify({ type, payload }) });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const STATIC = [
  "/", "/features", "/controls", "/connect", "/pricing",
  "/app", "/app/live", "/app/gate", "/app/weighing", "/app/scan", "/app/scan?tab=lidar", "/app/scan?tab=uvss", "/app/queue",
  "/app/transactions", "/app/exit-permits", "/app/guard", "/app/permits",
  "/app/alerts", "/app/fraud", "/app/audit",
  "/app/modules/lidar", "/app/modules/payload", "/app/modules/fleet",
  "/app/devices", "/app/hardware", "/app/site-map",
  "/app/reports", "/app/billing", "/app/masters", "/app/integrations", "/app/notifications", "/app/admin", "/app/simulator",
  "/display/B", "/display/C", "/display/queue", "/kiosk/B", "/d", "/wallboard",
];

async function newContext(browser, { locale = "fa", theme = "light", user = "U-ADMIN", width = 1440, height = 900 } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  await ctx.addInitScript(([l, t, u]) => {
    try {
      localStorage.setItem("tozin-prefs", JSON.stringify({ state: { locale: l, theme: t, userId: u, collapsed: false, latinDigits: false }, version: 0 }));
    } catch {
      /* storage blocked */
    }
  }, [locale, theme, user]);
  return ctx;
}

async function visit(ctx, path, wait = 2500) {
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && !IGNORE.some((re) => re.test(m.text())) && errors.push(m.text()));
  const resp = await page.goto(BASE + path, { waitUntil: "domcontentloaded", timeout: 180_000 });
  await page.waitForTimeout(wait);
  return { page, errors, status: resp?.status() ?? 0 };
}

async function dynamicRoutes() {
  const tx = (await api("/api/data/transactions?state=APPROVED&limit=1")).items[0];
  const st = await api("/api/state");
  const active = st.activeIds.map((id) => st.visits[id]).find(Boolean) ?? Object.values(st.visits)[0];
  return [`/app/transactions/${tx.id}`, `/print/ticket/${tx.id}`, `/print/ticket/${tx.id}?tpl=thermal`, `/verify/${tx.verifyCode}`, active ? `/d/${active.driverToken}` : null].filter(Boolean);
}

async function smoke(browser) {
  const routes = [...STATIC, ...(await dynamicRoutes())];
  const failures = [];
  for (const locale of ["fa", "en"]) {
    const ctx = await newContext(browser, { locale });
    for (const r of routes) {
      const { page, errors, status } = await visit(ctx, r, locale === "fa" ? 2500 : 1200);
      // Providers set <html dir> after hydration; heavy pages (three.js, big tables) can take a moment
      const want = locale === "fa" ? "rtl" : "ltr";
      await page.waitForFunction((w) => document.documentElement.dir === w, want, { timeout: 15_000 }).catch(() => {});
      const dir = await page.evaluate(() => document.documentElement.dir);
      const ok = status < 400 && errors.length === 0 && dir === want;
      console.log(`${ok ? "✓" : "✗"} [${locale}] ${r} ${status} dir=${dir}${errors.length ? " — " + errors.slice(0, 2).join(" | ") : ""}`);
      if (!ok) failures.push({ locale, r, status, dir, errors });
      await page.close();
    }
    await ctx.close();
  }
  return failures;
}

async function waitFor(fn, label, timeoutMs = 240_000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    const v = await fn();
    if (v) return v;
    await sleep(400);
  }
  throw new Error(`timeout waiting for ${label}`);
}

/** Acts as the scale operator: captures any truck that is stable on B/C and finalizes reconciled tickets. */
async function operatorTick(visitId) {
  const st = await api("/api/state");
  for (const code of ["B", "C"]) {
    const l = st.lanes.find((x) => x.code === code);
    if (l?.visitId && l.phase === "STABLE" && l.stable) await act("weigh.capture", { lane: code }, code === "B" ? "U-OP1" : "U-OP2");
  }
  const v = st.visits[visitId];
  for (const txId of v?.txIds ?? []) {
    const tx = (await api(`/api/data/transactions?id=${txId}`)).items[0];
    if (tx?.state === "RECONCILED") await act("tx.finalize", { txId }, "U-OP2");
  }
  return { st, v };
}

async function flow(browser) {
  console.log("\n— E2E S-NORMAL manual flow —");
  await act("sim.reset");
  await sleep(1500);
  await act("sim.mode", { mode: "MANUAL" });
  await act("sim.speed", { speed: 10 });
  await act("sim.scenario", { code: "S-NORMAL" });
  const visitId = await waitFor(async () => {
    const st = await api("/api/state");
    return Object.values(st.visits).find((v) => v.scenario === "S-NORMAL")?.id;
  }, "S-NORMAL arrival");
  console.log("  visit", visitId);
  const steps = new Set();
  const ready = await waitFor(async () => {
    const { v } = await operatorTick(visitId);
    if (v && !steps.has(v.state)) {
      steps.add(v.state);
      console.log("  →", v.state, v.laneCode ?? "");
    }
    if (v?.state === "HOLD" || v?.state === "REJECTED") throw new Error(`visit held: ${v.holdReasons}`);
    return v?.state === "READY_TO_EXIT" && v.exitPermitId ? v : null;
  }, "READY_TO_EXIT");
  const ep = (await api(`/api/data/exitPermits?id=${ready.exitPermitId}`)).items[0];
  console.log("  exit permit", ep.serial, ep.status);

  const ctx = await newContext(browser, { locale: "en", user: "U-GD1", width: 390, height: 844 });
  const { page, errors } = await visit(ctx, "/app/guard", 3000);
  const input = page.getByPlaceholder(/EX-/);
  const form = page.locator("form", { has: input });
  const submit = async () => {
    await input.fill(`${BASE}/x/${ep.token}`);
    await form.locator("button[type=submit]").click();
  };
  await submit();
  await page.getByText("VALID", { exact: true }).waitFor({ timeout: 15_000 });
  console.log("  ✓ first scan accepted");
  if (SHOTS) await page.screenshot({ path: SHOT_DIR + "guard-accept-mobile.png" });
  await sleep(800);
  await submit();
  await page.getByText("This QR was already used!").waitFor({ timeout: 15_000 });
  console.log("  ✓ second scan rejected (R36)");
  if (SHOTS) await page.screenshot({ path: SHOT_DIR + "guard-reject-mobile.png" });
  const alerts = await api(`/api/data/alerts?ruleCode=R36&visitId=${visitId}`);
  if (!alerts.items.length) throw new Error("R36 alert not raised");
  // in manual mode an earlier truck may be parked in exit lane E waiting for its own QR — scan it like the guard would
  const exited = await waitFor(async () => {
    const { st } = await operatorTick(visitId);
    const e = st.lanes.find((x) => x.code === "E");
    const other = e?.visitId && e.visitId !== visitId ? st.visits[e.visitId] : null;
    if (other?.exitPermitId && e.phase === "AWAIT_QR") {
      const otherEp = (await api(`/api/data/exitPermits?id=${other.exitPermitId}`)).items[0];
      if (otherEp?.status === "APPROVED") await act("scan", { code: otherEp.token }, "U-GD2");
    }
    return st.visits[visitId]?.state === "EXITED";
  }, "EXITED", 90_000);
  console.log("  ✓ vehicle exited:", exited);
  await ctx.close();
  await act("sim.mode", { mode: "AUTO" });
  await act("sim.speed", { speed: 1 });
  return errors;
}

const SHOT_LIST = [
  ["/", "home", 1440, 900, "fa"],
  ["/app", "dashboard", 1440, 900, "fa"],
  ["/app/live", "control-room-dark", 1600, 1000, "fa", "dark"],
  ["/app/gate", "gate", 1440, 900, "fa"],
  ["/app/weighing", "weighing", 1440, 900, "fa"],
  ["/app/scan", "scan-gate", 1440, 900, "fa"],
  ["/app/scan?tab=lidar", "scan-lidar", 1440, 900, "fa"],
  ["/app/scan?tab=uvss", "scan-uvss", 1440, 900, "fa"],
  ["/app/permits", "permits", 1440, 900, "fa"],
  ["/app/alerts", "alerts", 1440, 900, "fa"],
  ["/app/devices", "devices", 1440, 900, "fa"],
  ["/app/modules/payload", "payload", 1440, 900, "fa"],
  ["/app/modules/fleet", "fleet", 1440, 900, "fa"],
  ["/app/reports", "reports", 1440, 900, "en"],
  ["/app/simulator", "simulator", 1440, 900, "en"],
  ["/app/site-map", "site-map", 1440, 900, "fa"],
  ["/app/hardware", "hardware", 1440, 900, "fa"],
  ["/display/B", "driver-display", 1920, 1080, "fa"],
  ["/display/queue", "queue-board", 1920, 1080, "fa"],
  ["/kiosk/B", "kiosk", 1080, 1920, "fa"],
  ["/wallboard", "wallboard", 1920, 1080, "fa"],
  ["/d", "driver-portal-mobile", 390, 844, "fa"],
];

async function shots(browser) {
  mkdirSync(SHOT_DIR, { recursive: true });
  const dyn = await dynamicRoutes();
  const list = [...SHOT_LIST, [dyn[0], "transaction-detail", 1440, 900, "fa"], [dyn[1], "ticket-a5", 1000, 1300, "fa"], [dyn[3], "verify-mobile", 390, 844, "fa"]];
  if (dyn[4]) list.push([dyn[4], "driver-trip-mobile", 390, 844, "fa"]);
  for (const [path, name, w, h, locale, theme] of list) {
    const ctx = await newContext(browser, { locale, theme: theme ?? "light", width: w, height: h });
    const { page } = await visit(ctx, path, 4000);
    await page.screenshot({ path: `${SHOT_DIR}${name}.png` });
    console.log("  📸", name);
    await ctx.close();
  }
}

const browser = await pw.chromium.launch();
let failed = false;
try {
  if (!arg("skip-smoke")) {
    const f = await smoke(browser);
    console.log(`\nsmoke: ${f.length ? f.length + " failure(s)" : "all routes OK"}`);
    failed ||= f.length > 0;
  }
  if (!arg("skip-flow")) {
    const errs = await flow(browser);
    if (errs.length) {
      console.log("  console errors on guard page:", errs);
      failed = true;
    }
  }
  if (SHOTS) await shots(browser);
} catch (e) {
  console.error("✗", e.message);
  failed = true;
} finally {
  await browser.close();
}
process.exit(failed ? 1 : 0);
