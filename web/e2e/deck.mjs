// Exports the in-app slide deck (/present) as one PNG per slide and a PDF, from the staged scene.
// Usage (server running): node e2e/deck.mjs [--base=http://localhost:3000] [--track=driver|owner] [--locale=fa|en]
import { createRequire } from "module";
import { execFileSync } from "child_process";
import { mkdirSync, rmSync } from "fs";
const require = createRequire(import.meta.url);
let pw;
try {
  pw = require("playwright");
} catch {
  pw = require("/opt/node-tools/node_modules/playwright");
}
const arg = (k, d) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split("=")[1] ?? d;
const BASE = arg("base", "http://localhost:3000");
const TRACK = arg("track", "all");
const LOCALE = arg("locale", "fa");
const OUT = new URL("../../docs/presentation/", import.meta.url).pathname;
const DIR = `${OUT}slides-${LOCALE}${TRACK === "all" ? "" : `-${TRACK}`}/`;

await fetch(`${BASE}/api/action`, { method: "POST", headers: { "Content-Type": "application/json", "x-demo-user": "U-ADMIN" }, body: JSON.stringify({ type: "sim.reset", payload: {} }) });
await new Promise((r) => setTimeout(r, 1500));
rmSync(DIR, { recursive: true, force: true });
mkdirSync(DIR, { recursive: true });

const browser = await pw.chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
await ctx.addInitScript(([l]) => {
  localStorage.setItem("tozin-prefs", JSON.stringify({ state: { locale: l, theme: "light", userId: "U-ADMIN", collapsed: false, latinDigits: false }, version: 0 }));
  localStorage.setItem("tozin-basemap", "none");
}, [LOCALE]);
const page = await ctx.newPage();
const q = TRACK === "all" ? "" : `track=${TRACK}&`;
await page.goto(`${BASE}/present?${q}slide=1&chrome=0`, { waitUntil: "domcontentloaded" });
await page.waitForSelector("[data-count]");
const count = Number(await page.getAttribute("[data-count]", "data-count"));
const files = [];
for (let n = 1; n <= count; n++) {
  await page.goto(`${BASE}/present?${q}slide=${n}&chrome=0`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(6500); // embedded pages (iframes) load and render
  const f = `${DIR}slide-${String(n).padStart(2, "0")}.png`;
  await page.screenshot({ path: f });
  files.push(f);
  console.log("  🖼", n, "/", count);
}
await browser.close();

const pdf = `${OUT}TozinNegar-slides-${LOCALE}${TRACK === "all" ? "" : `-${TRACK}`}.pdf`;
execFileSync("python3", ["-I", "-c", "import sys\nfrom PIL import Image\nims=[Image.open(f).convert('RGB') for f in sys.argv[2:]]\nims[0].save(sys.argv[1], save_all=True, append_images=ims[1:], resolution=144)", pdf, ...files]);
console.log("PDF:", pdf);
