// Usage: node e2e/shot.mjs <path> <out.png> [width] [height] [locale] [theme]
import { createRequire } from "module";
const require = createRequire(import.meta.url);
let pw;
try { pw = require("playwright"); } catch { pw = require("/opt/node-tools/node_modules/playwright"); }
const [, , path = "/app", out = "shot.png", w = "1440", h = "900", locale = "fa", theme = "light"] = process.argv;
const browser = await pw.chromium.launch();
const ctx = await browser.newContext({ viewport: { width: Number(w), height: Number(h) }, deviceScaleFactor: 1 });
await ctx.addInitScript(([l, t]) => localStorage.setItem("tozin-prefs", JSON.stringify({ state: { locale: l, theme: t, userId: "U-ADMIN", collapsed: false, latinDigits: false }, version: 0 })), [locale, theme]);
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto("http://localhost:3000" + path, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(Number(process.env.WAIT ?? 3500));
await page.screenshot({ path: out, fullPage: process.env.FULL === "1" });
console.log(JSON.stringify({ path, errors: errors.slice(0, 5) }));
await browser.close();
