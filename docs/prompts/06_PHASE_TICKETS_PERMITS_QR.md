# فاز ۰۶ — تیکت، چاپ، مجوز خروج QR، اسکن حراست، راستی‌آزمایی عمومی

> مرجع: `spec/SCREENS.md` (۶، ۷، ۸، ج)، `spec/DATA_MODEL.md` (Transaction, ExitPermit)، `spec/ALERT_RULES.md` (R36).

## کار
1. `/app/transactions`: جدول با فیلترهای SCREENS §۶، صفحه‌بندی، ستون روش وزن (SENSOR/STORED/MANUAL با رنگ)، خروجی CSV (کلاینت) و XLSX (تولید ساده CSV با پسوند یا SheetJS اختیاری) و PDF (صفحه چاپی).
2. `/app/transactions/[id]`: هدر، VisitTimeline، کارت وزن‌ها (آبی/بنفش/سرمه‌ای، کسر، billable)، EvidenceGallery، اسکن‌های LiDAR/UVSS، GateEventها با trace، تاریخچه نسخه‌ها با diff، audit با hash، QR؛ کنش‌ها: چاپ (افزایش printCount + audit؛ چاپ مجدد نیازمند دلیل)، ارسال به راننده (SMS/WhatsApp/Email ماک → outbox)، ابطال با دلیل و امضای دوم (VOIDED + release حواله)، اصلاح (نسخه جدید)، دانلود بسته شواهد JSON (همه رکوردها + hashها).
3. `/print/ticket/[id]?tpl=a5|thermal|simple`: قالب‌های چاپی با `@media print`، QR (`qrcode.react` به `/verify/{code}`)، بارکد Code128 (`jsbarcode`)، عکس‌ها (A5)، «چاپ مجدد شماره n».
4. **مجوز خروج:** `exit.issue` (فقط وقتی همه تراکنش‌های Visit APPROVED و قوانین بحرانی باز ندارند؛ «مجوز خالی» برای خودرو بدون بار) → توکن غیرقابل حدس (`crypto.randomBytes`)؛ `exit.consume` اتمیک (APPROVED→CONSUMED؛ اسکن دوم → `REJECTED_USED` + هشدار R36). `/app/exit-permits` فهرست و جزئیات (QR بزرگ، تاریخچه اسکن).
5. **`/app/guard`** (موبایل‌محور، تمام‌عرض): کامپوننت `QrScanner` با `@zxing/browser` (انتخاب دوربین پشت، مجوز دسترسی، fallback ورود دستی کد/سریال، دکمه‌های «نمونه» برای دمو)؛ تشخیص نوع کد (مجوز خروج / تیکت / حواله / برگه سفر)؛ نتیجه تمام‌صفحه سبز/قرمز طبق SCREENS §۸ با عکس کامیون، پلاک، ماده، خالص؛ دکمه «درخواست باز شدن راهبند» → GateEvent OPEN_REQUEST → ACK شبیه‌سازی؛ لرزش (`navigator.vibrate`) و صدا؛ تاریخچه اسکن‌های این نگهبان.
6. `/verify/[code]` عمومی: معتبر/نامعتبر/ابطال/مصرف‌شده با حداقل داده (پلاک ماسک‌شده مثل `۱۲ب***-۶۷`)؛ بدون shell؛ مناسب موبایل.

## پذیرش
- چرخه کامل: نهایی‌سازی → صدور مجوز خروج → اسکن QR در `/app/guard` (یا ورود دستی) → مصرف و درخواست راهبند → اسکن دوم رد + هشدار.
- QR تیکت چاپی با دوربین گوشی باز شده و `/verify` نتیجه درست می‌دهد.
- تست vitest مصرف همزمان دو اسکن (فقط یکی موفق). commit: `feat(web): tickets, printing, exit permits, guard scanner, verify`.
