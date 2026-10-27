# فاز ۰۲ — مدل دامنه، Store ماک، ماشین حالت، موتور قوانین، شبیه‌ساز + SSE

> مرجع: `spec/DATA_MODEL.md`، `spec/ALERT_RULES.md`، `spec/MOCK_DATA.md`.

## کار
1. `src/domain/types.ts`: همه تایپ‌های DATA_MODEL.
2. `src/domain/plate.ts`: نرمال‌سازی/قالب‌بندی پلاک ایرانی، تولید پلاک تصادفی معتبر.
3. `src/domain/workflow.ts`: ماشین‌های حالت Visit/Transaction/ExitPermit/Alert/Permit با جدول انتقال‌های مجاز و تابع `transition()` که انتقال غیرمجاز را رد کند.
4. `src/domain/weighing.ts`: `resolveGrossTare(operation, first, second)`، `computeNet()` (منفی → خطا)، `captureGuard(liveReading, scale, position, identity)` → `{ allowed, reasons[] }`، quick-weigh با تارای ذخیره و انقضا.
5. `src/domain/permits.ts`: `remaining()`، `reserve()`، `commit()`، `release()` اتمیک (روی store با قفل ساده) و اعتبارسنجی (`validatePermit`).
6. `src/domain/gate.ts`: `evaluateGate(ctx)` دقیقاً طبق ALERT_RULES §۱ با `trace` مرحله‌ای.
7. `src/domain/rules.ts`: تعریف R01–R40 (کد، نام fa/en، شدت، اقدام، params، نسخه) و ارزیاب‌ها برای قوانینی که در شبیه‌ساز رخ می‌دهند.
8. `src/domain/audit.ts`: زنجیره HMAC-SHA256 (`node:crypto`، کلید دمو) + `verifyChain()`.
9. `src/domain/kpi.ts`: KPIهای داشبورد با بازگشت `null` برای داده ناکافی.
10. `src/server/rng.ts` (mulberry32)، `src/server/seed.ts` (MOCK_DATA §۱–۴: ۷ روز تاریخچه)، `src/server/store.ts` (singleton روی `globalThis`، collectionها، `revision`، Repository API).
11. `src/server/sim.ts`: tick ۱ ثانیه؛ ورود کامیون‌ها به صف؛ حرکت Visit در لاین‌ها؛ منحنی نشست وزن indicator با فریم خام؛ ANPR/RFID؛ موقعیت؛ راهبند با ACK؛ heartbeat؛ حالت خودکار/دستی؛ سرعت ×1/×5/×20؛ سناریوهای MOCK_DATA §۶؛ تولید هشدار و audit و outbox (SMS لینک راننده هنگام ورود به صف).
12. `src/server/actions.ts` + Route Handlers: `/api/state`, `/api/stream` (SSE، `dynamic='force-dynamic'`)، `/api/data/[collection]`, `/api/action` (با idempotencyKey)، `/api/verify/[code]`.
13. کلاینت: `src/lib/live.ts` — Zustand store + `useLive()` با EventSource و reconnect؛ `useCollection(name, filters)` که با تغییر `revision` دوباره fetch کند.
14. **تست‌ها (vitest):** net و ترتیب معکوس، net منفی، captureGuard، ledger حواله (هرگز منفی، commit دوبار idempotent)، مصرف یک‌بار QR، انتقال‌های غیرمجاز، evaluateGate برای MISMATCH/UNKNOWN/permit منقضی/PASS، verifyChain با تشخیص دستکاری.

## پذیرش
- `curl /api/state` snapshot معتبر؛ `curl -N /api/stream` هر ثانیه tick.
- صفحه موقت `/app/dev/live` وزن زنده باسکول‌ها و صف را نشان می‌دهد که خودبه‌خود تغییر می‌کند.
- همه تست‌ها سبز. commit: `feat(web): domain model, mock store, rules, simulator, SSE`.
