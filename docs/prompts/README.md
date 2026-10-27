# پکیج پرامت ساخت سامانه توزین — راهنما

## ترتیب استفاده در Claude Code
1. ریپو را باز کنید (این پوشه‌ها باید در ریپو باشند: `docs/research`, `docs/prompts`).
2. پیام اول: «فایل `docs/prompts/00_MASTER_PROMPT.md` و همه فایل‌های `docs/prompts/spec/` را بخوان. قوانین را برای کل پروژه رعایت کن. هنوز کد ننویس؛ خلاصه برداشتت و هر سؤال را بگو.»
3. سپس برای هر فاز: «فاز `docs/prompts/01_PHASE_FOUNDATION.md` را اجرا کن» … تا `10`. بعد از هر فاز `cd web && npm run dev` را اجرا و خروجی را ببینید.
4. اگر اسکرین‌شات WeighHub دارید، قبل از فاز ۰۳ در `docs/reference/weighhub/` بگذارید.

## فایل‌ها
| فایل | محتوا |
|---|---|
| `00_MASTER_PROMPT.md` | نقش، چشم‌انداز، قوانین سخت، stack، ساختار، API، تعریف Done |
| `01_PHASE_FOUNDATION.md` | scaffold، Design System، RTL/i18n، shell، پلاک ایرانی |
| `02_PHASE_DOMAIN_SIM.md` | مدل داده، store، ماشین حالت، قوانین، شبیه‌ساز، SSE، تست |
| `03_PHASE_MARKETING.md` | سایت معرفی شبیه WeighHub |
| `04_PHASE_DASHBOARD_LIVE.md` | داشبورد، اتاق کنترل، نقشه سایت، wallboard |
| `05_PHASE_GATE_WEIGH_SCAN.md` | دروازه، توزین، مرکز اسکن (LiDAR/UVSS/ROI)، کاتالوگ سخت‌افزار |
| `06_PHASE_TICKETS_PERMITS_QR.md` | تیکت، چاپ، مجوز خروج QR، اسکن حراست، verify |
| `07_PHASE_DRIVER.md` | پورتال موبایل راننده، مانیتور بزرگ، کیوسک، صف |
| `08_PHASE_BACKOFFICE.md` | حواله، اطلاعات پایه، هشدار، تقلب، audit، RBAC |
| `09_PHASE_HEALTH_MODULES_REPORTS.md` | سلامت/کالیبراسیون، LiDAR/Payload/Fleet، گزارش، مالی، یکپارچه‌سازی، مدیریت، شبیه‌ساز |
| `10_PHASE_QA_POLISH.md` | تست، اسکرین‌شات، مستندات |
| `spec/*` | مشخصات مرجع (ویژگی‌ها، صفحات، داده، قوانین، سخت‌افزار، داده ساختگی، طراحی) |

## نمونه ساخته‌شده
پوشه `web/` همین ریپو نمونه‌ای است که دقیقاً با همین پرامت‌ها ساخته شده؛ می‌توانید آن را اجرا کنید یا به‌عنوان مرجع به Claude Code بدهید.
