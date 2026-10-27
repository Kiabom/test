# پرامت اصلی ساخت — سامانه هوشمند توزین و تردد معدن «توزین‌نگار»

> **نحوه استفاده:** این فایل را اول به Claude Code بدهید (یا بگویید «`docs/prompts/00_MASTER_PROMPT.md` را بخوان و قوانینش را برای کل پروژه رعایت کن»). سپس پرامت فازها را **به ترتیب** (`01` تا `10`) یکی‌یکی بدهید و بعد از هر فاز خروجی را ببینید.
> همه مشخصات جزئی در `docs/prompts/spec/` است. جمع‌بندی تحقیق در `docs/research/SYNTHESIS.md` و منابع خام در `docs/research/sources/`.

---

## نقش تو
تو یک تیم کامل محصول هستی (Product Designer + Frontend/Fullstack Engineer + Domain Expert توزین معدن). یک **نمونه کامل، قابل اجرا و نمایشی** از سامانه توزین و کنترل تردد معدن می‌سازی که **همه قابلیت‌ها حداقل در حد ماکاپ تعاملی دیده شوند** و با **داده ساختگی و شبیه‌ساز زنده** کار کنند.

## چشم‌انداز
سامانه‌ای شبیه **WeighHub** (weighhub.com): روال سفر کامیون از پیش‌ثبت تا خروج در «ایستگاه‌ها»، توزین دوگانه، تیکت با QR، مجوز خروج QR یک‌بارمصرف، کنترل‌های ضدتقلب، داشبورد، گزارش، PWA — به‌علاوه قابلیت‌های سامانه‌های دیگر:
- ANPR جلو/عقب + RFID UHF و تطبیق هویت؛ راهبند/چراغ با PLC (شبیه‌سازی)
- **مرکز اسکن:** اسکن دروازه، اسکن بالای بار (LiDAR سه‌بعدی)، **اسکن زیر خودرو (UVSS)**، تشخیص موقعیت چرخ روی باسکول (IR + بینایی)
- **مانیتور بزرگ بیرونی راننده** با دستورات، کیوسک، تابلو فراخوان صف
- **لینک موبایل راننده** (SMS) و **اسکن آنلاین رسید/مجوز/حواله توسط حراست با گوشی**
- حواله/مجوز حمل با سهمیه اتمیک، کالیبراسیون و سلامت لودسل، Payload لودر، KPI ناوگان، ERP outbox، audit زنجیره‌ای

## قوانین سخت (همیشه رعایت کن)
1. **مالکیت فکری:** هیچ لوگو، متن، اسکرین‌شات، تصویر یا کد WeighHub یا هیچ رقیبی را کپی نکن. فقط الگوی تعامل. برند ما: «توزین‌نگار / TozinNegar» (قابل تغییر در `src/config/brand.ts`).
2. **تصاویر:** همه تصاویر SVG اختصاصی (کامیون، دوربین، دکل، LiDAR، UVSS، راهبند، تابلو LED…) — `spec/HARDWARE_MOCKUPS.md`. اگر دسترسی اینترنت داری و خواستی عکس واقعی اضافه کنی، فقط CC0/آزاد از Wikimedia Commons یا Unsplash، ذخیره در `web/public/media/` و ثبت منبع در `web/public/media/CREDITS.md`.
3. **داده:** همه ساختگی، قطعی (PRNG با seed ثابت) — `spec/MOCK_DATA.md`. پلاک‌ها فرمت ایرانی. در فوتر: «نسخه نمایشی — داده‌ها ساختگی‌اند».
4. **قواعد دامنه** (`spec/DATA_MODEL.md` §۷ و `spec/ALERT_RULES.md`):
   - وزن فقط از indicator و فقط `stable && fresh && positionOk`؛ وزن خام immutable؛ اصلاح = نسخه جدید با دلیل.
   - `net = gross − tare` بر اساس نوع عملیات؛ `abs()` ممنوع؛ net منفی → EXCEPTION.
   - QR خروج یک‌بارمصرف (مصرف اتمیک)؛ سهمیه حواله اتمیک و هرگز منفی.
   - LiDAR/payload/چگالی همیشه «تخمینی»، جدا از وزن قانونی.
   - داده ناموجود = «—»/N/A، هرگز صفر. «زنده» از «آخرین مقدار» متمایز.
   - نرم‌افزار هرگز interlock را دور نمی‌زند: PASS فقط `OPEN_REQUEST`؛ `OPEN_CONFIRMED` پس از ACK شبیه‌سازی‌شده PLC.
5. **زبان:** UI فارسی RTL پیش‌فرض + انگلیسی LTR (سوییچ در topbar). تاریخ شمسی (و میلادی در en). وزن و پلاک LTR با ارقام tabular. ذخیره زمان UTC.
6. **کیفیت UI/UX:** مطابق `spec/DESIGN_SYSTEM.md` — توکن‌ها، تم روشن/تیره، رنگ همراه متن+آیکون، دکمه‌های بزرگ لمسی برای اپراتور، ریسپانسیو، دسترس‌پذیر.
7. **هیچ صفحه خالی/placeholder** — هر صفحه باید با داده و تعامل واقعی (روی store ماک) کار کند.
8. کد تمیز، TypeScript strict، کامپوننت‌های کوچک، بدون وابستگی غیرضروری.

## Stack
- **Next.js 15 (App Router) + React 19 + TypeScript 5** در پوشه `web/`
- **Tailwind CSS v4** (`@tailwindcss/postcss`) با CSS variables از Design System؛ کامپوننت‌های UI سبک shadcn را خودت بنویس (بدون CLI)
- `lucide-react` آیکون · `@fontsource-variable/vazirmatn` فونت · `date-fns` + `date-fns-jalali` تاریخ
- `recharts@2` نمودار · `three` + `@react-three/fiber` + `@react-three/drei` برای point cloud
- `qrcode.react` QR · `jsbarcode` بارکد · `@zxing/browser` اسکن QR با دوربین (+ ورود دستی کد)
- `zustand` state کلاینت (زبان، تم، کاربر/نقش دمو، snapshot زنده)
- **بک‌اند ماک داخل Next:** Route Handlers (`runtime = 'nodejs'`) + store درون‌حافظه‌ای singleton روی `globalThis` + seed قطعی + Repository interface (قابل تعویض با Postgres)
- **Real-time:** موتور شبیه‌ساز سمت سرور (tick ۱ ثانیه) + **SSE** در `/api/stream`؛ کلاینت با `EventSource`
- تست: `vitest` برای دامنه؛ Playwright برای smoke/E2E و اسکرین‌شات

## ساختار پیشنهادی
```
web/src/
  app/(marketing)/...            سایت معرفی
  app/app/...                    اپ با shell
  app/d/[token]  app/display/[lane]  app/display/queue  app/wallboard  app/kiosk/[lane]  app/verify/[code]  app/print/ticket/[id]
  app/api/state  app/api/stream  app/api/action  app/api/data/[collection]  app/api/verify/[code]
  components/ui  components/domain  components/hardware  components/charts  components/shell
  domain/        types.ts, workflow.ts (state machines), weighing.ts, permits.ts, gate.ts (decision), rules.ts, kpi.ts, plate.ts, audit.ts
  server/        store.ts, seed.ts, sim.ts, actions.ts, rng.ts
  i18n/          fa.ts, en.ts, index.ts
  lib/           format.ts (اعداد/تاریخ/وزن)، hooks (useLive, useCollection)
  config/brand.ts
```

## API داخلی
- `GET /api/state` → snapshot زنده (لاین‌ها، وزن‌ها، راهبندها، صف، KPI، رخدادهای اخیر، revision)
- `GET /api/stream` (SSE) → رویداد `tick` هر ثانیه با snapshot زنده
- `GET /api/data/:collection?filters` → visits, transactions, permits, vehicles, drivers, alerts, devices, audit, outbox, …
- `POST /api/action` با `{ type, payload, idempotencyKey }` → `gate.decide`, `gate.registerGuest`, `weigh.capture`, `tx.finalize`, `tx.void`, `tx.print`, `exit.issue`, `exit.consume`, `alert.ack|resolve|dismiss`, `queue.callNext`, `sim.scenario`, `sim.speed`, `sim.mode`, `device.toggle`, `notify.send`, …
- `GET /api/verify/:code` → حداقل داده برای راستی‌آزمایی

## تعریف «انجام شد» برای هر فاز
- `npm run typecheck`، `npm run lint`، `npm run build` بدون خطا؛ تست‌های فاز سبز
- همه صفحات فاز در fa و en باز می‌شوند، بدون خطای کنسول، با داده
- ریسپانسیو (۳۹۰px و ۱۴۴۰px)؛ صفحات نمایشگر در ۱۹۲۰×۱۰۸۰
- commit با پیام واضح

## ترتیب فازها
01 Foundation → 02 Domain & Simulator → 03 Marketing → 04 Dashboard & Live → 05 Gate/Weigh/Scan → 06 Tickets/Permits/QR → 07 Driver → 08 Backoffice → 09 Health/Modules/Reports → 10 QA & Polish
