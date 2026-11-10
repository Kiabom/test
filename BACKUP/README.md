# How it was built

**فناپ توزین — سامانه توزین و کنترل تردد معدن سنگ آهن جلال‌آباد (زرند، کرمان)**

نمونه کامل یک سامانه سازمانی برای باسکول، دروازه، صف، تیکت، مجوز خروج QR، گزارش‌گیری و پایش ناوگان.
همه سخت‌افزار (indicator، RFID، راهبند، PLC) در سرور شبیه‌سازی می‌شود؛ رابط کاربری هیچ متن «دمو» ندارد.
روز کاری قفل‌شده: **۱۴۰۳/۰۴/۱۷ ساعت ۱۰:۳۰** — هر بار با همان داده و لاگ‌ها باز می‌شود.

ساختار این پوشه:

| مسیر | محتوا |
|---|---|
| `BACKUP/README.md` | همین راهنما |
| `BACKUP/docs/plans/` | آخرین فایل برنامه کار |
| `BACKUP/CHANGELOG.md` | فهرست همه تغییرات (commitها) |
| `BACKUP/artifacts/` | اسلاید PPTX/PDF، نمونه PDF گزارش‌ها، تصاویر صفحه‌ها |
| `web/` | کد کامل برنامه (Next.js) |
| `docs/` | پژوهش، مشخصات، پرامپت‌ها، سناریوی ارائه |
| فایل دانلودی `fanap-tozin-backup-*.zip` | همه موارد بالا + `project.bundle` (کل تاریخچه git) |

بازیابی از bundle: `git clone project.bundle fanap-tozin && cd fanap-tozin && git checkout claude/keen-hawking-l869rg`

## Built with
- Next.js 15 (App Router) · React 19 · TypeScript 5.9
- Tailwind CSS 4 · فونت Vazirmatn · راست‌به‌چپ کامل فارسی + انگلیسی
- zustand 5 (تنظیمات و وضعیت زنده) · Server-Sent Events برای به‌روزرسانی
- recharts 2 (نمودار) · Leaflet 1.9 (نقشه) · date-fns-jalali (تاریخ شمسی)
- Vitest 3 (۵۲ تست واحد) · Playwright (تست مرورگر و تولید PDF/تصویر) · pptxgenjs (اسلاید)
- داده درون‌حافظه با seed قطعی (`web/src/server/seed.ts`)؛ بدون پایگاه داده خارجی

### امکانات اصلی (تا این نسخه)
- ورود با نام کاربری؛ دسترسی هر نقش فقط به صفحه‌های خودش
- شناسایی خودرو و راننده با **تگ RFID** (پلاک‌خوان، دوربین، LiDAR و UVSS «در دست توسعه»)
- تعریف راننده مجاز هر خودرو؛ دروازه راننده غیرمجاز را نگه می‌دارد
- **حواله / دستور حمل با مسیر کامل** (مبدأ ← مقصد، ماده، خودروهای مجاز) و **تخصیص مسیر و بار به خودروها**
- عملیات: فروش، خرید، انتقال به کارخانه، جابه‌جایی درون معدن (پیت ← دپو)
- دپوها (در دست توسعه): موجودی، ورود و برداشت
- گزارش‌ساز با بازه شمسی و فیلتر ویژگی‌ها + سند چاپی/PDF
- **KPI ناوگان**: عملکرد تک‌تک خودروها و رانندگان، میانگین وزن خالی و پر، ضریب بارگیری، کارنامه
- مجوز خروج دستی، ثبت خودرو مهمان بدون فیلد اجباری
- ویرایش اطلاعات پایه در `web/data/master-overrides.json` ذخیره و بعد از راه‌اندازی مجدد حفظ می‌شود

## Instructions
```bash
cd web
npm install
npm run build && npm start        # http://localhost:3000
# یا برای توسعه: npm run dev
npm test                          # تست‌های واحد
npm run lint && npm run typecheck
node e2e/run.mjs                  # تست مرورگر (سرور باید روشن باشد)
```
- **ورود:** نام کاربری = نام خانوادگی لاتین، رمز = هر چیزی با ۴ حرف یا بیشتر.
  `sadri` مدیر سامانه · `farahmand` مدیر سایت · `amini` اپراتور باسکول · `pakzad` نگهبان · …
- هر نقش فقط صفحه‌های مجاز خودش را می‌بیند (`web/src/domain/access.ts`).
- **کنترل ارائه (فقط مدیر):** `Ctrl+Shift+K` → ثابت / جریان پیوسته، بازنشانی، کنسول سرویس.
- **گزارش و PDF:** صفحه گزارش‌ها → بازه شمسی + فیلترها → «چاپ / PDF» → در پنجره چاپ «ذخیره به‌صورت PDF».
- **شناسایی خودرو با تگ RFID** است، نه پلاک. تعریف راننده مجاز هر خودرو: مدیریت سامانه → «راننده و خودرو (RFID)».

## To change it ✅
| می‌خواهید… | فایل |
|---|---|
| نام برند، نام معدن، نسخه | `web/src/config/brand.ts` |
| کاربران، نام، شماره پرسنلی | `web/src/lib/users.ts` |
| نقش‌ها و مجوزها | `web/src/domain/rbac.ts` |
| دسترسی صفحه‌ها به نقش‌ها | `web/src/domain/access.ts` |
| منو و برچسب «در دست توسعه» | `web/src/components/shell/nav.ts` (فیلد `dev`) و `DEV_PAGES` در `web/src/components/ui/index.tsx` |
| مشتری، ماده، خودرو، راننده، شیفت | `web/src/server/seed.ts` |
| تاریخ روز کاری قفل‌شده | `CLOCK_ANCHOR` در `web/src/domain/clock.ts` |
| قواعد هشدار و دروازه | `web/src/domain/rules.ts` و `web/src/domain/gate.ts` |
| قالب گزارش‌ها و ستون‌ها | `web/src/components/reports/reportModel.ts` |
| فیلترها و بازه تاریخ | `web/src/domain/reportFilter.ts` و `web/src/components/ui/DateRange.tsx` |
| سند چاپی گزارش | `web/src/app/print/report/page.tsx` |
| شهرها و مسیرهای نقشه | `web/src/domain/geo.ts` |
| متن‌های فارسی وضعیت‌ها | `web/src/i18n/labels.ts` |

بعد از هر تغییر: `npm run lint && npm run typecheck && npm test && npm run build`.

| حواله و تخصیص مسیر خودرو | صفحه «حواله‌ها» یا `web/src/components/permits/PermitTools.tsx` |
| محاسبه KPI خودرو/راننده | `fleetPerf` در `web/src/server/views.ts` و `web/src/app/app/modules/fleet/page.tsx` |
| بازگشت داده‌های پایه به حالت اولیه | فایل `web/data/master-overrides.json` را پاک کنید |

## Never touch ❌
- **زنجیره هش ردپای ممیزی** (`web/src/domain/audit.ts`، `appendAudit`) — تغییرش همه سوابق را نامعتبر می‌کند.
- **قطعی بودن seed:** عدد `mulberry32(20261027)` و ترتیب فراخوانی‌های تصادفی در `seed.ts` — جابه‌جایی‌شان داده و لاگ‌های قفل‌شده را عوض می‌کند.
- **ساعت سامانه:** همه جا `clockNow()` به جای `Date.now()`؛ و `frozenAt` در حالت قفل — وگرنه گانت و نقشه دوباره حرکت می‌کنند.
- **قواعد توزین قانونی:** وزن پایدار، خوانش تازه، تارای منفی (هرگز قدر مطلق)، امضای دوم برای وزن دستی (`web/src/domain/weighing.ts`).
- **بررسی مجوز سمت سرور** در `web/src/server/actions.ts` (`PERMS`) — مخفی کردن دکمه کافی نیست.
- **راهبند فقط «درخواست» می‌دهد**؛ تأیید باز شدن با PLC است.
- **هیچ رمز، توکن یا کلید** داخل مخزن قرار ندهید. نام شرکت واقعی و لوگوی واقعی استفاده نکنید.
- تشخیص هویت در دروازه بر اساس **RFID** است (`gateContextFor` در `web/src/server/ops.ts`)؛ مغایرت پلاک نباید ورود را ببندد.
- فهرست کلمات ممنوع در `web/e2e/run.mjs` (`BANNED`) — جلوی برگشتن متن‌های «دمو/نمایشی» را می‌گیرد.
