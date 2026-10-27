# سند مشخصات محصول مستقل — سامانه هوشمند توزین و کنترل تردد معدن

**نسخه:** 1.0 | **تاریخ:** 2026-10-25 | **زبان:** فارسی | **هدف:** ورودی اجرایی برای AI Coding Agent

**قاعده شواهد:** «تأییدشده» صرفاً ادعای مستند درباره همان فروشنده؛ «استنباطی» برداشت محدود از UI یا ترکیب منابع؛ «پیشنهادی» طراحی محصول ما، نه ادعای ویژگی فروشنده. «نامشخص» به معنی نبود مدرک کافی است، نه فقدان قابلیت.

## 1. خلاصه اجرایی

1. Metrici توزین خودکار را با LPR، PPD و خواندن وزن باسکول یکپارچه کرده است [M1].
2. سناریوی جدید مبتنی بر محدوده‌های تصویری مجازی می‌تواند نیاز به حسگر موقعیت خارجی را حذف کند؛ این موضوع به معنای حذف دوربین، کنترلر یا سخت‌افزار باسکول نیست [M1].
3. پروژه قدیمی‌تر Valplast از سه دوربین LPR، سه حسگر و راهبند استفاده می‌کرد [M3].
4. وزن ورودی/خروجی و بار مورد انتظار مقایسه و برای انحراف هشدار صادر می‌شود [M2,M3,M5].
5. تصاویر جلو و عقب خودرو، زمان، جهت، پلاک و وزن از داده‌های قابل ثبت است [M2].
6. راهنمای Metrici از ماژول توزین، تقویم رویداد، دسترسی و فهرست تردد پشتیبانی می‌کند [M5، ص 71–74].
7. Tenaris-Silcotub نمونه اتصال به SAP است؛ اتصال همه نسخه‌ها یا همه ERPها از آن قابل نتیجه‌گیری نیست [M4].
8. Avery برای RFID/ANPR و عملیات چندسایتی، Precia برای کنترل محیطی باسکول، Loadscan برای حجم و Rice Lake برای عیب‌یابی لودسل شواهد صریح دارند [A1,A2,P1,L1,R1].
9. مدیریت مجوز حمل، کنترل گواهی کالیبراسیون و KPI ناوگان در محصول پیشنهادی جداگانه طراحی می‌شوند.
10. پیشنهاد معماری: Edge + نرم‌افزار مرکزی + اتصال‌دهنده‌های قابل تعویض + Event/Audit Store؛ صرفاً طراحی پیشنهادی است.

## 2. فهرست منابع و محدوده بررسی

| کد | مرجع اصلی/مقایسه‌ای | URL | وضعیت |
|---|---|---|---|
| M1 | Metrici | https://metrici.ro/cases/weighing-automation | صفحه/سند شناسایی شد |
| M2 | Metrici | https://metrici.ro/metrici-news-weighing-module | صفحه/سند شناسایی شد |
| M3 | Metrici | https://www.metrici.ro/cases/valplast | صفحه/سند شناسایی شد |
| M4 | Metrici | https://metrici.ro/cases/tenaris-silcotub | صفحه/سند شناسایی شد |
| M5 | Metrici | https://www.metrici.ro/files/manuals/LPR_User_Guide_2.0_Eng.pdf | صفحه/سند شناسایی شد |
| M6 | Metrici | https://www.metrici.ro/change-log | صفحه/سند شناسایی شد |
| M7 | Metrici | https://metrici.ro/products/metrici-lprweighing | صفحه/سند شناسایی شد |
| M8 | Metrici | https://metrici.ro/downloads | صفحه/سند شناسایی شد |
| M9 | Metrici | https://metrici.ro/videos | صفحه/سند شناسایی شد |
| A1 | Avery | https://www.averyweigh-tronix.com/en/product/weighman-8-weighbridge-software/ | صفحه/سند شناسایی شد |
| A2 | Avery | https://www.averyweigh-tronix.com/en/product/smartower-unmanned-weighbridge-system/ | صفحه/سند شناسایی شد |
| P1 | Precia Molen | https://www.processbd.com/PRECIA_MOLEN/Weigh_Bridge_and_Access_Control.html | صفحه/سند شناسایی شد |
| P2 | Precia Molen | https://us.preciamolen.com/wp-content/uploads/sites/22/2019/07/09-15-01-1-FT-TRUCKFLOW-V00.09.pdf | صفحه/سند شناسایی شد |
| P3 | Precia Molen | https://www.directindustry.com/prod/precia-molen/product-7658-2537247.html | صفحه/سند شناسایی شد |
| L1 | Loadscan | https://www.loadscan.com/myscanner/ | صفحه/سند شناسایی شد |
| L2 | Loadscan | https://www.loadscan.com/load-volume-scanner/ | صفحه/سند شناسایی شد |
| L3 | Loadscan | https://www.loadscan.com/loadscan-integration-api/ | صفحه/سند شناسایی شد |
| R1 | Rice Lake | https://www.ricelake.com/products/iqube2-digital-diagnostic-junction-box?part=93243 | صفحه/سند شناسایی شد |
| C1 | Caterpillar | https://www.cat.com/en_US/by-industry/mining/surface-mining/surface-technology/fleet.html | صفحه/سند شناسایی شد |

**شکاف خزش:** robots.txt و sitemap.xml دامنه metrici.ro با ابزار بررسی در دسترس نبودند؛ بنابراین ادعای «خزش کامل تمام URLهای دامنه» مطرح نمی‌شود. صفحات منوی محصول، دانلود و ویدیو شناسایی شدند اما همه فایل‌های پیوست/ویدیوهای سایت به شکل فریم‌به‌فریم بازبینی نشده‌اند. هیچ فایل کاربر پیوست نشده است.

**فهرست مسیرهای مرتبط کشف‌شده:** `/cases/weighing-automation`، `/cases/valplast`، `/cases/tenaris-silcotub`، `/products/metrici-lprweighing`، `/metrici-news-weighing-module`، `/change-log`، `/downloads`، `/videos` و PDF راهنمای LPR. این فهرست همه URLهای دامنه نیست.

### 2.1 تحلیل دقیق شواهد تصویری

| تصویر | مرجع | صفحه/اجزا | سطح اطمینان |
|---|---|---|---|
| LPR_PPD3 | https://metrici.ro/img/weighing/metrici.LPR_PPD3.png | وب: فیلتر LOCATION/CAMERA/DIRECTION/GROUP/CLASS، جدول تردد، پیش‌نمایش کامیون، پلاک، وزن، شمارنده رویداد و Export PDF | تأییدشده از تصویر |
| LPR_PPD1 | https://metrici.ro/img/weighing/metrici.LPR_PPD1.png | نرم‌افزار دسکتاپ PPD: ویدیو RTSP، محدوده‌های شماره‌دار، سبز=Free، قرمز=Busy، جدول Last change/Elapsed/Placement، گزینه Settings و مدیریت ناحیه | تأییدشده از تصویر |
| LPR_PPD2 | https://www.metrici.ro/img/weighing/LPR_PPD%20weighing2.png | نمای چندپنجره‌ای LPR و PPD، نمایش هم‌زمان تصویر پلاک و موقعیت روی باسکول، اطلاعات استریم | تأییدشده از تصویر |
| Guide p.71 | https://www.metrici.ro/files/manuals/LPR_User_Guide_2.0_Eng.pdf#page=71 | در راهنما منوی Weighing برای تنظیم دوربین و سطح هشدار معرفی شده است | تأییدشده از PDF |

**قاعده UI:** این تصاویر مرجع ساختار و الگوی تعامل‌اند؛ رنگ، گرافیک، نشانه، متن و نام‌گذاری باید اختصاصی محصول ما باشد. نسخه‌های مختلف رابط Metrici را نباید یک طراحی واحد فرض کرد.

### 2.2 ویدیو
صفحه ویدیوهای Metrici و لینک ویدیوی Avery SmarTower شناسایی شده‌اند [M9,A2]؛ اما محتوای ویدیو فریم‌به‌فریم یا تایم‌کددار تأیید نشده است. جریان‌های بخش 5 از مستندات مکتوب استخراج شده‌اند، نه مشاهده مستقیم ویدیو.

## 3. ماتریس مقایسه و هسته محصول

**روش:** ✓[مرجع] = «دارد، تأییدشده»؛ ؟ = «نامشخص»؛ هیچ سلول «ندارد» بدون تصریح سازنده ثبت نشده است. ستون‌ها فقط برای گزینه‌هایی‌اند که در این بررسی شاهد مستقیم یافت شد.

| قابلیت | Metrici | Avery Weighman/SmarTower | Precia TruckFlow | Loadscan LVS/MyScanner | Rice Lake iQUBE² | Cat MineStar Fleet |
|---|---|---|---|---|---|---|
| ANPR / پلاک | ✓ [M1] | ✓ [A1] | ✓ [P3] | ؟ | ؟ | ؟ |
| RFID وسیله | ؟ | ✓ [A1,A2] | ✓ [P3] | ؟ | ؟ | ؟ |
| کنترل راهبند | ✓ [M1,M3] | ✓ [A1,A2] | ✓ [P1,P2] | ؟ | ؟ | ؟ |
| تشخیص موقعیت روی باسکول | ✓ [M1,M3] | ✓ [A2] | ؟ | ؟ | ؟ | ؟ |
| توزین ورود و خروج | ✓ [M2,M3] | ✓ [A1] | ✓ [P1,P2] | ؟ | ؟ | ؟ |
| ثبت تصویر خودرو | ✓ [M1,M2] | ✓ [A2] | ✓ [P1,P2] | ؟ | ؟ | ؟ |
| مقایسه بار با مقدار مورد انتظار | ✓ [M3,M5] | ؟ | ؟ | ؟ | ؟ | ؟ |
| گزارش و فیلتر تراکنش | ✓ [M1,M5] | ✓ [A1] | ✓ [P1,P2] | ✓ [L1] | ؟ | ✓ [C1] |
| چندسایتی | ✓ [M5] | ✓ [A1,A2] | ✓ [P3] | ؟ | ؟ | ✓ [C1] |
| هشدار انحراف وزن | ✓ [M2,M3] | ؟ | ؟ | ✓ [L1] | ؟ | ؟ |
| ERP/مالی | ✓ [M4] | ✓ [A1,A2] | ؟ | ✓ [L3] | ؟ | ؟ |
| کنترل سلامت لودسل | ؟ | ؟ | ؟ | ؟ | ✓ [R1] | ؟ |
| اسکن حجمی 3D | ؟ | ؟ | ؟ | ✓ [L1,L2] | ؟ | ؟ |
| زمان چرخه و بار مفید ناوگان | ؟ | ؟ | ؟ | ؟ | ؟ | ✓ [C1] |
| مجوز فروش و حمل / حواله | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |
| انطباق گواهی کالیبراسیون | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |

### 3.1 ویژگی‌های هسته (وجود شاهد در دست‌کم ۳ سامانه مقایسه‌شده)

- **ANPR / پلاک** — شاهد در 3 ستون؛ سطح اطمینان «تأییدشده» صرفاً برای منابع هر ستون.
- **کنترل راهبند** — شاهد در 3 ستون؛ سطح اطمینان «تأییدشده» صرفاً برای منابع هر ستون.
- **توزین ورود و خروج** — شاهد در 3 ستون؛ سطح اطمینان «تأییدشده» صرفاً برای منابع هر ستون.
- **ثبت تصویر خودرو** — شاهد در 3 ستون؛ سطح اطمینان «تأییدشده» صرفاً برای منابع هر ستون.
- **گزارش و فیلتر تراکنش** — شاهد در 5 ستون؛ سطح اطمینان «تأییدشده» صرفاً برای منابع هر ستون.
- **چندسایتی** — شاهد در 4 ستون؛ سطح اطمینان «تأییدشده» صرفاً برای منابع هر ستون.
- **ERP/مالی** — شاهد در 3 ستون؛ سطح اطمینان «تأییدشده» صرفاً برای منابع هر ستون.

**تمایزهای مستند:** Metrici = موقعیت‌سنجی تصویری PPD [M1]؛ Avery SmarTower = RFID UHF، فرمان صوتی، ترمینال مستقل [A2]؛ Loadscan = اسکن حجمی و پروفایل سه‌بعدی [L1,L2]؛ Rice Lake iQUBE² = تشخیص رانش/نویز/عدم‌تعادل لودسل [R1]؛ Cat MineStar = زمان چرخه، بار مفید و جابه‌جایی تخصیص ناوگان [C1]. سایر شرکت‌های درخواست‌شده شامل Dariel/WBX، WeighMAST، Mettler Toledo، Trimble Loadrite، Wenco، Hexagon و Modular Mining در این نوبت به سطح شاهد کافی برای اعلام مثبت/منفی در ماتریس نرسیدند؛ ادعایی درباره آن‌ها ثبت نشده است.

## 4. PRD — Product Requirements Document
### 4.1 نقش‌ها

| کد | نقش | اختیار اصلی |
|---|---|---|
| admin | مدیر سامانه | تنظیم سایت، یکپارچه‌سازی، دسترسی |
| operator | اپراتور باسکول | تأیید موارد استثنا و نظارت |
| gate | نگهبان | تردد و کنترل مجوز |
| logistics | برنامه‌ریز حمل | ثبت سفارش و حواله و تخصیص خودرو |
| manager | مدیر معدن | داشبورد تولید، گزارش و KPI |
| maintenance | تعمیرات/کالیبراسیون | پایش سلامت، توقف سرویس |
| auditor | حسابرس | مشاهده لاگ غیرقابل‌تغییر و شواهد |
| driver | راننده | مشاهده وضعیت در ترمینال/پیام |

### 4.2 داستان‌های کاربری (User Stories)

- **نگهبان:** می‌خواهم پلاک و مجوز با وزن و تصویر همان خودرو تطبیق شود تا خروج غیرمجاز محدود شود. [پیشنهادی]
- **اپراتور:** می‌خواهم هر توقف سیستم دلیل دقیق و شواهد داشته باشد تا امکان رفع استثنا با ثبت تأیید فراهم باشد. [پیشنهادی]
- **مدیر معدن:** می‌خواهم تناژ هر شیفت را به تفکیک ماده، بارگیر، پیمانکار و مقصد ببینم. [پیشنهادی]
- **تعمیرات:** می‌خواهم وضعیت لودسل و سررسید کالیبراسیون را قبل از اختلال متوجه شوم. [پیشنهادی]
- **حسابرس:** می‌خواهم وزن اولیه، اصلاحات، و دلیل override را با زمان و هویت شخص بررسی کنم. [پیشنهادی]
- **برنامه‌ریز:** می‌خواهم برای هر مجوز ظرفیت باقیمانده و بارهای تخصیص‌یافته را مشاهده کنم. [پیشنهادی]

### 4.3 الزامات کارکردی
| ID | الزام | اولویت | منشأ/اطمینان |
|---|---|---|---|
| FR-01 | ثبت و مدیریت خودرو، راننده، حامل و پیمانکار | P0 | پیشنهادی |
| FR-02 | تشخیص پلاک ANPR با تصویر، confidence و تأیید دستی | P0 | تأییدشده در M1,M2 |
| FR-03 | شناسایی RFID و تطبیق چندشناسه‌ای RFID/Plate | P0 | پیشنهادی؛ شاهد RFID در A1,A2 |
| FR-04 | تشخیص اشغال ناحیه و قرارگیری صحیح همه محورها | P0 | استنباطی از PPD در M1؛ کنترل کامل محور نیازمند اعتبارسنجی |
| FR-05 | خواندن شاخص باسکول همراه Stable/Zero/Overload و ثبت خام | P0 | پیشنهادی؛ وزن‌خوانی M1,M2 |
| FR-06 | ثبت وزن اول، دوم، تارا و خالص با جهت ماده | P0 | تأییدشده در M3,M5؛ توسعه فرمول و workflow پیشنهادی |
| FR-07 | صدور شناسه یکتای سفر و لینک‌کردن تمامی شواهد | P0 | پیشنهادی |
| FR-08 | تطبیق مجوز حمل، حواله، مهلت، تناژ و سقف مجاز | P0 | پیشنهادی |
| FR-09 | کنترل ایمن راهبند/چراغ با تأیید PLC و حالت fail-safe | P0 | کنترل در M1,M2؛ منطق ایمن پیشنهادی |
| FR-10 | ثبت تصویر جلو، عقب، بار و هنگام توزین | P0 | تأییدشده در M2 |
| FR-11 | توقف تراکنش در مغایرت وزن، پلاک یا مجوز | P0 | مغایرت وزن در M3؛ سایر موارد پیشنهادی |
| FR-12 | جدول تردد با جستجو و فیلتر بر اساس زمان/موقعیت/پلاک | P0 | تأییدشده در M1,M5 |
| FR-13 | ثبت ورود/خروج و turnaround و زمان صف | P1 | پیشنهادی |
| FR-14 | مدیریت چندباسکولی و چندسایتی | P1 | پیشنهادی؛ نمونه چندسایتی در A1,P3 |
| FR-15 | یکپارچه‌سازی ERP و صدور حواله و سند مالی | P1 | نمونه SAP در M4؛ جزئیات پیشنهادی |
| FR-16 | ثبت وضعیت کالیبراسیون، سلامت و خطای لودسل | P1 | پیشنهادی؛ قابلیت تشخیص در R1 |
| FR-17 | ارسال SMS/Email و webhook هشدار | P1 | SMS/email در M2 |
| FR-18 | ثبت Audit Trail و سوابق override با دلیل و تأیید دوم | P0 | پیشنهادی |
| FR-19 | دریافت اسکن خالی/پر LiDAR و محاسبه حجم | P2 | پیشنهادی؛ الگو در L2 |
| FR-20 | دریافت رویداد payload شاول/لودر و ارزیابی اختلاف | P2 | پیشنهادی؛ KPI مرتبط C1 |
| FR-21 | محاسبه KPI شیفت و تولید بر اساس تراکنش‌ها | P1 | پیشنهادی |
| FR-22 | ثبت آفلاین و sync قابل بازیابی و idempotent | P1 | پیشنهادی |
| FR-23 | جدول صدور و ردیابی بارنامه/فاکتور در صورت اتصال معتبر | P1 | پیشنهادی |
| FR-24 | خروجی CSV/Excel/PDF و گزارش زمان‌بندی‌شده | P1 | گزارش در M1؛ زمان‌بندی در L1؛ پیاده‌سازی پیشنهادی |

### 4.4 الزامات غیرکارکردی
| ID | الزام پیشنهادی |
|---|---|
| NFR-01 | هر رویداد دارای UTC timestamp، site timezone، source و correlation_id |
| NFR-02 | جلوگیری از صدور فرمان بازشدن راهبند با داده مبهم یا ارتباط قطع‌شده؛ خط‌مشی ایمنی وابسته به HAZOP |
| NFR-03 | Transport TLS، RBAC، حداقل دسترسی، encryption at rest و مدیریت اسرار |
| NFR-04 | ثبت immutable event و audit، نسخه‌گذاری رکوردهای تصحیحی، عدم ویرایش خام وزن |
| NFR-05 | همگام‌سازی آفلاین at-least-once با idempotency و conflict queue |
| NFR-06 | نمایش فارسی RTL و فیلدهای شناسه/تاریخ استاندارد با تبدیل شمسی در UI |
| NFR-07 | آستانه‌های stability/latency/availability از FAT/SAT و OEM مشخص شوند؛ هیچ SLA عددی بدون قرارداد فرض نشود |
| NFR-08 | نسخه‌بندی API، ثبت خطای adapter، retry با backoff و dead-letter queue |
| NFR-09 | آرشیو تصویر و داده طبق سیاست نگهداری و دسترسی تأییدشده کارفرما |
| NFR-10 | پشتیبانی از شبیه‌ساز دستگاه برای تست منطق بدون راهبند واقعی |
| NFR-11 | پشتیبان‌گیری، بازیابی، تست Disaster Recovery و ردیابی تغییرات تنظیمات |
| NFR-12 | تفکیک دامنه داده، کنترل تجهیزات و سیستم ایمنی؛ منع اتکا به AI به‌عنوان تنها مسیر حفاظتی |

### 4.5 معیار پذیرش بحرانی
- **AC-01:** با ورود پلاک معتبر و مجوز معتبر، رویداد وزن تنها پس از دریافت `stable=true` از driver تأییدشده و صحت ناحیه باسکول نهایی شود. [پیشنهادی]
- **AC-02:** تکرار پیام وزن یا ANPR با همان کلید idempotency تراکنش تکراری نسازد. [پیشنهادی]
- **AC-03:** در صورت مغایرت مجوز/وزن/پلاک خروج خودکار غیرفعال و تایید انسانی ثبت شود. [پیشنهادی]
- **AC-04:** تصاویر و شواهد مربوط به تراکنش به شکل ارجاع‌دار و با hash ذخیره شوند. [پیشنهادی]
- **AC-05:** نبود ارتباط با ERP باعث جعل مجوز محلی نشود؛ اجرای policy مجوزهای cache شده صریح باشد. [پیشنهادی]

## 5. جریان کاری اصلی

01. **Pre-registration:** ثبت سفارش حمل، نوع ماده، سقف، زمان اعتبار، راننده، خودرو و مجوز؛ اگر ناشناخته بود وارد صف بررسی شود. [پیشنهادی، با مبنای LPR/weight در M1,M3,M5]
02. **Approach:** دوربین و حسگر ناحیه خودرو را شناسایی کنند؛ ANPR و RFID با هم تطبیق داده شوند. [پیشنهادی، با مبنای LPR/weight در M1,M3,M5]
03. **Gate authorization:** اعتبار مجوز، بلاک‌لیست، وضعیت باسکول و اشغال مسیر بررسی؛ فرمان راهبند فقط از کنترلر ایمن. [پیشنهادی، با مبنای LPR/weight در M1,M3,M5]
04. **Scale positioning:** موقعیت تمام چرخ‌ها/محورها و پایداری خودرو بررسی شود. PPD به‌تنهایی تضمین محور نیست. [پیشنهادی، با مبنای LPR/weight در M1,M3,M5]
05. **First weighing:** وزن پایدار ثبت؛ همراه snapshot پلاک، بار، زمان، باسکول، مقدار خام و quality. [پیشنهادی، با مبنای LPR/weight در M1,M3,M5]
06. **Loading/unloading:** ورود به محل بارگیری، تخصیص ماده، تجهیزات و مقصد؛ ثبت رخدادهای shift/payload اختیاری. [پیشنهادی، با مبنای LPR/weight در M1,M3,M5]
07. **Second weighing:** تطبیق شناسه خودرو/راننده/مجوز و ثبت وزن پایدار دوم. [پیشنهادی، با مبنای LPR/weight در M1,M3,M5]
08. **Net calculation:** برای هر جریان، وزن خالص = |gross - tare| با تعیین معنادار gross/tare؛ وزن منفی یا خارج دامنه flag شود. [پیشنهادی، با مبنای LPR/weight در M1,M3,M5]
09. **Permit matching:** تطبیق وزن خالص با اعتبار، سقف مجاز، وزن مورد انتظار، مقدار باقیمانده، مسیر و بازه مجاز. [پیشنهادی، با مبنای LPR/weight در M1,M3,M5]
10. **Exit decision:** در حالت تأیید: ثبت خروج، بازشدن راهبند با acknowledgment، نهایی‌سازی ticket. در مغایرت: HOLD و human review. [پیشنهادی، با مبنای LPR/weight در M1,M3,M5]
11. **Reconciliation:** ارسال idempotent به ERP و گزارش حسابرسی؛ قطعی شبکه = sync queue، نه از دست رفتن رویداد. [پیشنهادی، با مبنای LPR/weight در M1,M3,M5]

**ماشین حالت:** `PLANNED → ARRIVED → IDENTIFIED → AUTHORIZED → ON_SCALE_1 → WEIGHED_1 → LOADING → ON_SCALE_2 → WEIGHED_2 → VERIFYING → CLEARED → EXITED → CLOSED`؛ حالت‌های استثنا `HOLD`, `REVIEW`, `CANCELLED`, `DEVICE_FAULT`. تنها transitionهای مجاز در موتور workflow تعریف شوند.

## 6. مدل داده
**تمام موجودیت‌ها و فیلدهای زیر طراحی پیشنهادی هستند؛ نام آن‌ها بیانگر اسکیمای داخلی Metrici نیست.** شناسه‌ها UUID، زمان‌ها UTC ISO-8601، وزن کیلوگرم و حجم مترمکعب؛ تبدیل نمایش تناژ در لایه UI.

| Entity | فیلدهای ضروری پیشنهادی |
|---|---|
| `Vehicle` | `id`, `plate_normalized`, `plate_country`, `trailer_plate`, `rfid_token_id`, `vehicle_type`, `axle_count`, `max_gross_kg`, `status` |
| `Driver` | `id`, `full_name`, `driver_license_ref`, `company_id`, `status` |
| `Carrier` | `id`, `legal_name`, `tax_id`, `contact_ref`, `status` |
| `Customer` | `id`, `legal_name`, `erp_id`, `customer_type` |
| `Material` | `id`, `code`, `name`, `grade`, `nominal_density_t_m3`, `density_source`, `density_valid_at` |
| `Permit` | `id`, `permit_type`, `external_ref`, `vehicle_id`, `material_id`, `customer_id`, `max_net_kg`, `remaining_kg`, `valid_from`, `valid_to`, `approval_status`, `version` |
| `Transaction` | `id`, `site_id`, `vehicle_id`, `driver_id`, `carrier_id`, `material_id`, `permit_id`, `origin_id`, `destination_id`, `shift_id`, `status`, `gross_kg`, `tare_kg`, `net_kg`, `volume_m3`, `entered_at`, `exited_at`, `created_at`, `updated_at` |
| `WeighEvent` | `id`, `transaction_id`, `scale_id`, `sequence`, `captured_at`, `weight_kg`, `stable`, `zero`, `quality_code`, `raw_payload_ref`, `image_ids`, `device_timestamp` |
| `GateEvent` | `id`, `transaction_id`, `gate_id`, `event_type`, `command_id`, `acknowledged`, `occurred_at`, `operator_id` |
| `CameraPlateRead` | `id`, `transaction_id`, `camera_id`, `plate_raw`, `plate_normalized`, `confidence`, `direction`, `image_uri`, `occurred_at` |
| `RFIDRead` | `id`, `transaction_id`, `reader_id`, `tag_token`, `rssi_optional`, `occurred_at` |
| `Scale` | `id`, `site_id`, `indicator_model`, `serial_port_ref`, `max_capacity_kg`, `min_division_kg`, `driver_type`, `calibration_status` |
| `CalibrationRecord` | `id`, `scale_id`, `certificate_id`, `performed_at`, `valid_until`, `issuer`, `document_uri`, `result`, `approved_by` |
| `Alert` | `id`, `type`, `severity`, `transaction_id`, `threshold_policy_id`, `measured_value`, `status`, `opened_at`, `acknowledged_by`, `resolution_reason` |
| `Shift` | `id`, `site_id`, `start_at`, `end_at`, `team`, `production_target_t` |
| `Equipment` | `id`, `site_id`, `equipment_type`, `fleet_code`, `telemetry_source`, `operational_status` |
| `LidarScan` | `id`, `transaction_id`, `scanner_id`, `scan_type`, `captured_at`, `pointcloud_uri`, `volume_m3`, `quality`, `reference_scan_id` |
| `PayloadEvent` | `id`, `transaction_id`, `equipment_id`, `captured_at`, `payload_kg`, `source`, `confidence_or_quality` |
| `Site` | `id`, `name`, `timezone`, `geo_area`, `status` |
| `AuditEvent` | `id`, `actor_id`, `action`, `object_type`, `object_id`, `before_hash`, `after_hash`, `occurred_at`, `reason` |
| `IntegrationOutbox` | `id`, `event_type`, `object_id`, `destination`, `retry_count`, `status`, `last_error`, `idempotency_key` |

**رابطه‌ها:** Vehicle 1→N Transaction؛ Transaction 1→N WeighEvent/GateEvent/CameraPlateRead/RFIDRead/Alert؛ Scale 1→N WeighEvent/CalibrationRecord؛ Permit 1→N Transaction؛ Equipment 1→N PayloadEvent؛ LidarScan با Transaction مرتبط است. درگاه داده telemetry خام از ledger تراکنش تفکیک شود.

**محاسبه:** `net_kg = max(gross_kg - tare_kg, 0)` فقط پس از تأیید اینکه gross ≥ tare و هر دو رویداد معتبر و هم‌تراکنش‌اند. اگر gross < tare، محاسبه خودکار ممنوع و وضعیت anomaly ثبت شود. `turnaround_s = exited_at - entered_at`. `volume_m3 = loaded_scan_m3 - empty_scan_m3` صرفاً با اسکن‌های کالیبره و هندسه مرجع یکسان؛ `estimated_mass_kg = volume_m3 * density_t_m3 * 1000` فقط با درج منبع چگالی و عدم جایگزینی توزین قانونی.

## 7. UI/UX — مشخصات قابل پیاده‌سازی

| صفحه | کامپوننت/داده | منشأ |
|---|---|---|
| 1. داشبورد مدیر | KPI cards: تناژ امروز/شیفت، سفر تکمیل‌شده، میانگین زمان چرخه، صف، مجوزهای در خطر، هشدار سلامت؛ نمودار خطی تناژ/ساعت، میله‌ای به تفکیک ماده، سایت و پیمانکار. | پیشنهادی |
| 2. مانیتورینگ زنده باسکول | دو ستون: feed دوربین/پلاک/ناحیه در 60% صفحه؛ سمت دیگر وضعیت stable/weight/plate/RFID/permit، راهبند، workflow timeline، timeline رویدادها. | الهام UI از M1/M5؛ جزئیات پیشنهادی |
| 3. سوابق تراکنش | جدول فیلترپذیر و دارای paginated server-side search، ستون شناسه، پلاک، ماده، وزن اول/دوم/خالص، زمان ورود و خروج، وضعیت، منبع وزن. | الهام UI از M1/M5؛ جزئیات پیشنهادی |
| 4. جزئیات تراکنش | header هویت خودرو/راننده/ماده/مجوز؛ snapshotها، وزن‌های timestampدار، تمام GateEvent، audit، وضعیت ERP و download evidence. | الهام UI از M1/M5؛ جزئیات پیشنهادی |
| 5. تردد زنده | جدول رویداد دوربین با location/camera/direction/class/time + preview عکس، نزدیک به الگوی مشاهده‌شده M1. | الهام UI از M1/M5؛ جزئیات پیشنهادی |
| 6. مجوزها و حواله‌ها | فهرست مجوز و مانده تناژ، تاریخ اعتبار، مشتری، ماده، خودرو، وضعیت تطبیق. | پیشنهادی |
| 7. ناوگان و KPI شیفت | cycle time، payload، trips، idle، utilization، fuel اگر telemetry معتبر باشد؛ توضیح مخرج هر KPI. | پیشنهادی |
| 8. کالیبراسیون و سلامت | لایه نمودار load-cell، zero drift، noise، asymmetric load، سررسید گواهی، acknowledgement. | پیشنهادی |
| 9. اسکن حجم/سه‌بعدی | پنل empty/loaded scan، حجم اختلافی، نمایش 3D point cloud، کیفیت و چگالی انتخابی. | پیشنهادی |
| 10. گزارش‌ساز | فیلتر شیفت/تاریخ/ماده/شرکت/باسکول و خروجی PDF/Excel/CSV؛ زمان‌بندی ایمیل. | پیشنهادی |
| 11. تنظیمات دستگاه | Camera RTSP، reader RFID، adapter وزن، PLC، digital IO، health check، test mode. | پیشنهادی |
| 12. مدیریت دسترسی و Audit | RBAC، کاربران، سایت‌ها، عملیات override، تاریخ تغییرات و تصدیق شواهد. | پیشنهادی |

**Design System پیشنهادی:** چیدمان RTL، sidebar ناوبری، topbar با انتخاب سایت/شیفت و وضعیت اتصال؛ زمینه خنثی روشن، سرمه‌ای تیره برای تیتر و نوار ناوبری، آبی برای اطلاعات، سبز برای مجاز/پایدار، کهربایی برای انتظار، قرمز برای HOLD/خطا. رنگ تنها نشانگر نباشد؛ متن و آیکون هم وجود داشته باشند. برای سیستم صنعتی حجم لمس بزرگ، تایپوگرافی واضح، دسترسی کیبورد و contrast مناسب پیش‌بینی شود. هیچ کد رنگ Metrici به‌عنوان استاندارد برند ما برداشت نشده است.

### KPIها و تعاریف
- **Shift production (t):** مجموع وزن خالص تراکنش‌های بسته‌شده متعلق به شیفت، با کنترل حذف برگشتی/ابطالی.
- **Trips:** شمارش تراکنش‌های CLOSED و غیرتکراری.
- **Average turnaround:** میانگین زمان خروج منهای ورود برای سفرهای کامل.
- **Queue time:** زمان مجوز ورود به باسکول منهای ثبت رسیدن به صف، در صورت ثبت دو زمان.
- **Payload utilization:** مجموع payload / مجموع ظرفیت اسمی در همان جامعه سفرها.
- **Availability:** مدت زمان آماده‌به‌کار دستگاه / زمان برنامه‌ریزی‌شده (نیازمند تعریف توقف‌ها).
- **Fuel per tonne:** سوخت مصرف‌شده / تناژ واقعی؛ فقط در صورت وجود telemetry معتبر.

## 8. معماری و یکپارچه‌سازی

```text
ANPR Cameras --RTSP/ONVIF*--> Edge Vision Service ----> Event Bus/Outbox
RFID Readers --vendor SDK/TCP/serial--> Identity Adapter ----> Correlation Engine
Scale Indicator --RS232/485/Ethernet*--> Scale Adapter ----> Stability Validator
PPD/Loop/Laser ----> Position Adapter ----> Workflow State Machine
PLC/Gate/Traffic Light <---- Safety Control Gateway <---- Verified Authorization
                                            |
                                   PostgreSQL / Object Store
                                            |
                                   REST API + WebSocket
                                            |
                         Web UI / ERP Integration / Analytics
LiDAR Scanner ----> Optional Volume Plugin ----> Transaction Correlation
Loader Payload ----> Optional Fleet Plugin ----> Shift KPI
```
`*` پروتکل واقعی وابسته به مدل/firmware و آزمون سازگاری است؛ این نمودار ادعای پروتکل Metrici نیست.

| اتصال | الزامات پیشنهادی | شواهد مرجع |
|---|---|---|
| باسکول | driver قابل تعویض؛ frame validation، endian/units، stable bit، timeout؛ پشتیبانی از RS-232/485 و TCP در صورت تأیید سازنده | M1 برای باریکس Barionet؛ R1 برای پورت‌های دستگاه Rice Lake |
| دوربین | RTSP برای تصویر، ONVIF در صورت پشتیبانی، timestamp alignment و تنظیم OCR confidence | M1 و راهنمای M5 |
| RFID | UHF یا HF بر اساس انتخاب سخت‌افزار؛ طول خواندن و anti-collision باید آزمایش شود | A2 فقط برای وجود UHF |
| درگاه و چراغ | PLC/DIO با acknowledgement، interlock، manual override ثبت‌شده | M1,M3,A2 |
| ERP/حسابداری | REST/JSON یا فایل/DB connector فقط با قرارداد API، outbox و مرجع شناسه سند | M4 نمونه SAP؛ A1,A2؛ L3 |
| LiDAR | API اسکن، empty/loaded correlation، کنترل کیفیت pointcloud، JSON نتیجه | L1,L2,L3 |
| پیام‌رسان | SMS/email/webhook با rate limit و ثبت delivery receipt | M2 برای SMS/email |
| MQTT/OPC-UA/Modbus | فقط adapter اختیاری؛ هیچ‌یک به‌عنوان پروتکل داخلی Metrici از شواهد فعلی احراز نشده‌اند | پیشنهادی |

**ملاحظات استقرار:** برای سایت معدن، Edge محلی با کش پایدار و سرور مرکزی راهبرد پیشنهادی است. استفاده از Cloud برای گزارش‌گیری قابل ارزیابی است؛ تا زمانی که تأخیر، ایمنی، قوانین توزین و ارتباط شبکه بررسی نشده‌اند، کنترل real-time راهبند به cloud وابسته نشود.

## 9. منطق هشدارها
**تمام آستانه‌های این بخش پیشنهادی و بدون مقدار پیش‌فرض ساختگی هستند.** وجود هشدار اختلاف وزن و ماندگاری در Metrici تأیید شده [M1,M2,M3]؛ سایر ruleها نیازمند توسعه است.

| کد | شرط | آستانه | اقدام |
|---|---|---|---|
| WEIGHT_DEVIATION | abs(net_kg-expected_kg) > max(abs_threshold_kg, expected_kg*pct_threshold/100) | آستانه قابل تنظیم بر اساس ماده/مجوز؛ default نامشخص | HOLD + SMS/Email + بررسی انسانی |
| PERMIT_INVALID | now خارج از valid_from/valid_to یا status!=approved | boolean | DENY/HOLD |
| PERMIT_OVERLIMIT | net_kg > remaining_kg + tolerance_kg | tolerance مصوب | HOLD؛ به‌روزرسانی مانده پس از تأیید |
| PLATE_RFID_MISMATCH | normalized_plate با tag-to-vehicle mapping مغایر | exact/verified match | HOLD + تصویر شواهد |
| WEIGHT_UNSTABLE | stable=false در پنجره ثبت وزن | الگوی نمونه‌برداری OEM | عدم ثبت وزن |
| PARTIAL_VEHICLE | position_valid=false یا occupancy conflict | تنظیم هندسه/حسگر | عدم ثبت وزن و چراغ انتظار |
| LOAD_CELL_DRIFT | zero_drift > OEM/site_limit | نیازمند داده سلامت driver | خارج‌کردن باسکول از سرویس در شرایط مصوب |
| CALIBRATION_EXPIRED | now > calibration.valid_until | تاریخ گواهی | اعلان، و بسته به مقررات مسدودسازی توزین رسمی |
| DUPLICATE_TRIP | same vehicle+direction در window قابل تنظیم بدون closure | پنجره مصوب | REVIEW |
| LONG_STAY | exited_at missing و elapsed > site_limit | به تفکیک نوع عملیات | هشدار صف/تردد |
| DEVICE_OFFLINE | health heartbeat older than timeout | Timeout از FAT/SAT | قطع فرمان خودکار، فعال‌سازی SOP دستی |
| VOLUME_WEIGHT_MISMATCH | abs(net_kg - density*volume_m3*1000) > configured_limit | چگالی و عدم قطعیت معتبر | صرفاً QC review؛ نه حکم قطعی تقلب |

**Alert lifecycle:** NEW → ACKNOWLEDGED → INVESTIGATING → RESOLVED/ESCALATED؛ هر تغییر همراه actor، زمان، علت و شاهد؛ mute تنها با مجوز زمانی و ثبت Audit.

## 10. معماری Plug-in

### 10.1 LiDAR / Volume [پیشنهادی بر مبنای L1,L2,L3]
- قرارداد ورودی: `scan_id`, `vehicle_id`, `transaction_id`, `scan_type`, `timestamp`, `pointcloud_uri`, `quality`.
- پردازش: کالیبراسیون هندسی → تعیین محدوده صندوق → هم‌ترازی empty/loaded → حجم اختلافی → QC → مقایسه با وزن باسکول.
- عدم‌قطعیت: چگالی، تغییر شکل بار، پوشیده‌شدن سطوح و خطای هم‌ترازی باید صریح نمایش داده شوند.
### 10.2 Onboard Payload [پیشنهادی با مرجع C1]
- adapter تله‌متری شاول/لودر/دامپتراک، اتصال event به وسیله و شیفت و reconciliation با وزن نهایی.
- خروجی: payload bias، underload/overload، تعداد پاس بارگیری، اختلاف تن بر سفر.
### 10.3 Fleet KPI [پیشنهادی با مرجع C1]
- events = loading, hauling, queueing, dumping, returning, idle؛ محاسبه cycle time و utilization با تعریف مبدأ/مقصد.
- سازوکار plugin: `manifest.json` با version, permissions, event_types, config_schema, health_endpoint؛ API رویداد و قابلیت غیرفعال‌سازی بدون تخریب هسته.

## 11. شکاف‌ها و سؤال‌های باز

1. robots.txt و sitemap.xml در ابزار وب باز نشدند؛ فهرست URLها جامع نیست.
2. جزئیات پروتکل اختصاصی Barix Barionet/Scale و firmware به‌صورت پیاده‌سازی‌پذیر مشخص نیست.
3. درصد واقعی دقت ANPR/PPD، آزمون تمام‌چرخ‌ها، نرخ false positive و شرایط گردوغبار/شب مشخص نیست.
4. فرکانس/برد RFID متعلق به ماژول توزین Metrici تأیید نشده؛ RFID در Avery SmarTower تأیید است.
5. جزئیات قیمت، license، محدودیت دوربین، SQL schema داخلی Metrici و API private نامشخص.
6. گواهی کالیبراسیون، health loadcell، فرآیند مجوز فروش/حمل و LiDAR برای Metrici ثابت نشده.
7. شماره فنی و پروتکل indicator باسکول و PLC سایت هدف باید معلوم شود.
8. رابطه پلاک کشنده و تریلر با بار و مجوز باید در سیاست هویت سایت روشن شود.
9. منشأ قانونی رکورد وزن، امکان تغییر تارا و ضرورت مهر/امضا باید با مقررات محلی تطبیق داده شود.
10. برداشت یک لینک ویدیو، جایگزین بررسی فریم‌به‌فریم ویدیو نیست.
11. برای Dariel/WBX، WeighMAST، Mettler Toledo، Trimble Loadrite، Wenco، Hexagon و Modular Mining در این نسخه ادعای مستند جزئی ثبت نشده؛ پژوهش تکمیلی لازم است.
12. حد آستانه‌های قطعی، SLO/SLA، نگهداری تصویر، ظرفیت تراکنش و RPO/RTO به‌صورت عددی تعریف نشده‌اند؛ باید از نیازسنجی کارفرما تعیین شوند.

### پرسش‌های تصمیم‌گیری پیش از اجرا
1. مدل indicator باسکول، خروجی data frame و مجوز دسترسی به آن چیست؟
2. کنترلر راهبند، نقشه I/O و مسئولیت interlock ایمنی چیست؟
3. مدارک مرجع ERP برای حواله، فروش و مجوز حمل و شناسه تراکنش چیست؟
4. کارفرما کدام حالت تارا (تارای ذخیره، دو توزین، چندمرحله‌ای) را از نظر قانونی مجاز می‌داند؟
5. نصب دوربین از کجا و با چه شرایط روشنایی، زاویه، سرعت و وضعیت گردوغبار انجام می‌شود؟
6. یک باسکول است یا چند باسکول؛ سایت‌ها چه محدودیت ارتباطی دارند؟
7. سناریوی خرابی هر حسگر و سیاست عبور اضطراری چیست؟
8. ترتیب اولویت ماژول‌ها و بودجه/زمان MVP چیست؟

## 12. JSON ساختاریافته قابل ورود به ابزار کدنویسی

```json
{
  "document_version": "1.0",
  "product": "Mine Weighing and Gate Automation",
  "language": "fa-IR",
  "evidence_policy": {
    "confirmed": "Explicit in cited source",
    "inferred": "Derived from screenshot or context",
    "proposed": "New product design; not vendor claim"
  },
  "roles": [
    {
      "id": "admin",
      "title_fa": "مدیر سامانه",
      "scope": "تنظیم سایت، یکپارچه‌سازی، دسترسی"
    },
    {
      "id": "operator",
      "title_fa": "اپراتور باسکول",
      "scope": "تأیید موارد استثنا و نظارت"
    },
    {
      "id": "gate",
      "title_fa": "نگهبان",
      "scope": "تردد و کنترل مجوز"
    },
    {
      "id": "logistics",
      "title_fa": "برنامه‌ریز حمل",
      "scope": "ثبت سفارش و حواله و تخصیص خودرو"
    },
    {
      "id": "manager",
      "title_fa": "مدیر معدن",
      "scope": "داشبورد تولید، گزارش و KPI"
    },
    {
      "id": "maintenance",
      "title_fa": "تعمیرات/کالیبراسیون",
      "scope": "پایش سلامت، توقف سرویس"
    },
    {
      "id": "auditor",
      "title_fa": "حسابرس",
      "scope": "مشاهده لاگ غیرقابل‌تغییر و شواهد"
    },
    {
      "id": "driver",
      "title_fa": "راننده",
      "scope": "مشاهده وضعیت در ترمینال/پیام"
    }
  ],
  "functional_requirements": [
    {
      "id": "FR-01",
      "description_fa": "ثبت و مدیریت خودرو، راننده، حامل و پیمانکار",
      "priority": "P0",
      "source_confidence": "پیشنهادی"
    },
    {
      "id": "FR-02",
      "description_fa": "تشخیص پلاک ANPR با تصویر، confidence و تأیید دستی",
      "priority": "P0",
      "source_confidence": "تأییدشده در M1,M2"
    },
    {
      "id": "FR-03",
      "description_fa": "شناسایی RFID و تطبیق چندشناسه‌ای RFID/Plate",
      "priority": "P0",
      "source_confidence": "پیشنهادی؛ شاهد RFID در A1,A2"
    },
    {
      "id": "FR-04",
      "description_fa": "تشخیص اشغال ناحیه و قرارگیری صحیح همه محورها",
      "priority": "P0",
      "source_confidence": "استنباطی از PPD در M1؛ کنترل کامل محور نیازمند اعتبارسنجی"
    },
    {
      "id": "FR-05",
      "description_fa": "خواندن شاخص باسکول همراه Stable/Zero/Overload و ثبت خام",
      "priority": "P0",
      "source_confidence": "پیشنهادی؛ وزن‌خوانی M1,M2"
    },
    {
      "id": "FR-06",
      "description_fa": "ثبت وزن اول، دوم، تارا و خالص با جهت ماده",
      "priority": "P0",
      "source_confidence": "تأییدشده در M3,M5؛ توسعه فرمول و workflow پیشنهادی"
    },
    {
      "id": "FR-07",
      "description_fa": "صدور شناسه یکتای سفر و لینک‌کردن تمامی شواهد",
      "priority": "P0",
      "source_confidence": "پیشنهادی"
    },
    {
      "id": "FR-08",
      "description_fa": "تطبیق مجوز حمل، حواله، مهلت، تناژ و سقف مجاز",
      "priority": "P0",
      "source_confidence": "پیشنهادی"
    },
    {
      "id": "FR-09",
      "description_fa": "کنترل ایمن راهبند/چراغ با تأیید PLC و حالت fail-safe",
      "priority": "P0",
      "source_confidence": "کنترل در M1,M2؛ منطق ایمن پیشنهادی"
    },
    {
      "id": "FR-10",
      "description_fa": "ثبت تصویر جلو، عقب، بار و هنگام توزین",
      "priority": "P0",
      "source_confidence": "تأییدشده در M2"
    },
    {
      "id": "FR-11",
      "description_fa": "توقف تراکنش در مغایرت وزن، پلاک یا مجوز",
      "priority": "P0",
      "source_confidence": "مغایرت وزن در M3؛ سایر موارد پیشنهادی"
    },
    {
      "id": "FR-12",
      "description_fa": "جدول تردد با جستجو و فیلتر بر اساس زمان/موقعیت/پلاک",
      "priority": "P0",
      "source_confidence": "تأییدشده در M1,M5"
    },
    {
      "id": "FR-13",
      "description_fa": "ثبت ورود/خروج و turnaround و زمان صف",
      "priority": "P1",
      "source_confidence": "پیشنهادی"
    },
    {
      "id": "FR-14",
      "description_fa": "مدیریت چندباسکولی و چندسایتی",
      "priority": "P1",
      "source_confidence": "پیشنهادی؛ نمونه چندسایتی در A1,P3"
    },
    {
      "id": "FR-15",
      "description_fa": "یکپارچه‌سازی ERP و صدور حواله و سند مالی",
      "priority": "P1",
      "source_confidence": "نمونه SAP در M4؛ جزئیات پیشنهادی"
    },
    {
      "id": "FR-16",
      "description_fa": "ثبت وضعیت کالیبراسیون، سلامت و خطای لودسل",
      "priority": "P1",
      "source_confidence": "پیشنهادی؛ قابلیت تشخیص در R1"
    },
    {
      "id": "FR-17",
      "description_fa": "ارسال SMS/Email و webhook هشدار",
      "priority": "P1",
      "source_confidence": "SMS/email در M2"
    },
    {
      "id": "FR-18",
      "description_fa": "ثبت Audit Trail و سوابق override با دلیل و تأیید دوم",
      "priority": "P0",
      "source_confidence": "پیشنهادی"
    },
    {
      "id": "FR-19",
      "description_fa": "دریافت اسکن خالی/پر LiDAR و محاسبه حجم",
      "priority": "P2",
      "source_confidence": "پیشنهادی؛ الگو در L2"
    },
    {
      "id": "FR-20",
      "description_fa": "دریافت رویداد payload شاول/لودر و ارزیابی اختلاف",
      "priority": "P2",
      "source_confidence": "پیشنهادی؛ KPI مرتبط C1"
    },
    {
      "id": "FR-21",
      "description_fa": "محاسبه KPI شیفت و تولید بر اساس تراکنش‌ها",
      "priority": "P1",
      "source_confidence": "پیشنهادی"
    },
    {
      "id": "FR-22",
      "description_fa": "ثبت آفلاین و sync قابل بازیابی و idempotent",
      "priority": "P1",
      "source_confidence": "پیشنهادی"
    },
    {
      "id": "FR-23",
      "description_fa": "جدول صدور و ردیابی بارنامه/فاکتور در صورت اتصال معتبر",
      "priority": "P1",
      "source_confidence": "پیشنهادی"
    },
    {
      "id": "FR-24",
      "description_fa": "خروجی CSV/Excel/PDF و گزارش زمان‌بندی‌شده",
      "priority": "P1",
      "source_confidence": "گزارش در M1؛ زمان‌بندی در L1؛ پیاده‌سازی پیشنهادی"
    }
  ],
  "nonfunctional_requirements": [
    {
      "id": "NFR-01",
      "description_fa": "هر رویداد دارای UTC timestamp، site timezone، source و correlation_id",
      "confidence": "proposed"
    },
    {
      "id": "NFR-02",
      "description_fa": "جلوگیری از صدور فرمان بازشدن راهبند با داده مبهم یا ارتباط قطع‌شده؛ خط‌مشی ایمنی وابسته به HAZOP",
      "confidence": "proposed"
    },
    {
      "id": "NFR-03",
      "description_fa": "Transport TLS، RBAC، حداقل دسترسی، encryption at rest و مدیریت اسرار",
      "confidence": "proposed"
    },
    {
      "id": "NFR-04",
      "description_fa": "ثبت immutable event و audit، نسخه‌گذاری رکوردهای تصحیحی، عدم ویرایش خام وزن",
      "confidence": "proposed"
    },
    {
      "id": "NFR-05",
      "description_fa": "همگام‌سازی آفلاین at-least-once با idempotency و conflict queue",
      "confidence": "proposed"
    },
    {
      "id": "NFR-06",
      "description_fa": "نمایش فارسی RTL و فیلدهای شناسه/تاریخ استاندارد با تبدیل شمسی در UI",
      "confidence": "proposed"
    },
    {
      "id": "NFR-07",
      "description_fa": "آستانه‌های stability/latency/availability از FAT/SAT و OEM مشخص شوند؛ هیچ SLA عددی بدون قرارداد فرض نشود",
      "confidence": "proposed"
    },
    {
      "id": "NFR-08",
      "description_fa": "نسخه‌بندی API، ثبت خطای adapter، retry با backoff و dead-letter queue",
      "confidence": "proposed"
    },
    {
      "id": "NFR-09",
      "description_fa": "آرشیو تصویر و داده طبق سیاست نگهداری و دسترسی تأییدشده کارفرما",
      "confidence": "proposed"
    },
    {
      "id": "NFR-10",
      "description_fa": "پشتیبانی از شبیه‌ساز دستگاه برای تست منطق بدون راهبند واقعی",
      "confidence": "proposed"
    },
    {
      "id": "NFR-11",
      "description_fa": "پشتیبان‌گیری، بازیابی، تست Disaster Recovery و ردیابی تغییرات تنظیمات",
      "confidence": "proposed"
    },
    {
      "id": "NFR-12",
      "description_fa": "تفکیک دامنه داده، کنترل تجهیزات و سیستم ایمنی؛ منع اتکا به AI به‌عنوان تنها مسیر حفاظتی",
      "confidence": "proposed"
    }
  ],
  "entities": [
    {
      "name": "Vehicle",
      "fields": [
        "id",
        "plate_normalized",
        "plate_country",
        "trailer_plate",
        "rfid_token_id",
        "vehicle_type",
        "axle_count",
        "max_gross_kg",
        "status"
      ],
      "confidence": "proposed"
    },
    {
      "name": "Driver",
      "fields": [
        "id",
        "full_name",
        "driver_license_ref",
        "company_id",
        "status"
      ],
      "confidence": "proposed"
    },
    {
      "name": "Carrier",
      "fields": [
        "id",
        "legal_name",
        "tax_id",
        "contact_ref",
        "status"
      ],
      "confidence": "proposed"
    },
    {
      "name": "Customer",
      "fields": [
        "id",
        "legal_name",
        "erp_id",
        "customer_type"
      ],
      "confidence": "proposed"
    },
    {
      "name": "Material",
      "fields": [
        "id",
        "code",
        "name",
        "grade",
        "nominal_density_t_m3",
        "density_source",
        "density_valid_at"
      ],
      "confidence": "proposed"
    },
    {
      "name": "Permit",
      "fields": [
        "id",
        "permit_type",
        "external_ref",
        "vehicle_id",
        "material_id",
        "customer_id",
        "max_net_kg",
        "remaining_kg",
        "valid_from",
        "valid_to",
        "approval_status",
        "version"
      ],
      "confidence": "proposed"
    },
    {
      "name": "Transaction",
      "fields": [
        "id",
        "site_id",
        "vehicle_id",
        "driver_id",
        "carrier_id",
        "material_id",
        "permit_id",
        "origin_id",
        "destination_id",
        "shift_id",
        "status",
        "gross_kg",
        "tare_kg",
        "net_kg",
        "volume_m3",
        "entered_at",
        "exited_at",
        "created_at",
        "updated_at"
      ],
      "confidence": "proposed"
    },
    {
      "name": "WeighEvent",
      "fields": [
        "id",
        "transaction_id",
        "scale_id",
        "sequence",
        "captured_at",
        "weight_kg",
        "stable",
        "zero",
        "quality_code",
        "raw_payload_ref",
        "image_ids",
        "device_timestamp"
      ],
      "confidence": "proposed"
    },
    {
      "name": "GateEvent",
      "fields": [
        "id",
        "transaction_id",
        "gate_id",
        "event_type",
        "command_id",
        "acknowledged",
        "occurred_at",
        "operator_id"
      ],
      "confidence": "proposed"
    },
    {
      "name": "CameraPlateRead",
      "fields": [
        "id",
        "transaction_id",
        "camera_id",
        "plate_raw",
        "plate_normalized",
        "confidence",
        "direction",
        "image_uri",
        "occurred_at"
      ],
      "confidence": "proposed"
    },
    {
      "name": "RFIDRead",
      "fields": [
        "id",
        "transaction_id",
        "reader_id",
        "tag_token",
        "rssi_optional",
        "occurred_at"
      ],
      "confidence": "proposed"
    },
    {
      "name": "Scale",
      "fields": [
        "id",
        "site_id",
        "indicator_model",
        "serial_port_ref",
        "max_capacity_kg",
        "min_division_kg",
        "driver_type",
        "calibration_status"
      ],
      "confidence": "proposed"
    },
    {
      "name": "CalibrationRecord",
      "fields": [
        "id",
        "scale_id",
        "certificate_id",
        "performed_at",
        "valid_until",
        "issuer",
        "document_uri",
        "result",
        "approved_by"
      ],
      "confidence": "proposed"
    },
    {
      "name": "Alert",
      "fields": [
        "id",
        "type",
        "severity",
        "transaction_id",
        "threshold_policy_id",
        "measured_value",
        "status",
        "opened_at",
        "acknowledged_by",
        "resolution_reason"
      ],
      "confidence": "proposed"
    },
    {
      "name": "Shift",
      "fields": [
        "id",
        "site_id",
        "start_at",
        "end_at",
        "team",
        "production_target_t"
      ],
      "confidence": "proposed"
    },
    {
      "name": "Equipment",
      "fields": [
        "id",
        "site_id",
        "equipment_type",
        "fleet_code",
        "telemetry_source",
        "operational_status"
      ],
      "confidence": "proposed"
    },
    {
      "name": "LidarScan",
      "fields": [
        "id",
        "transaction_id",
        "scanner_id",
        "scan_type",
        "captured_at",
        "pointcloud_uri",
        "volume_m3",
        "quality",
        "reference_scan_id"
      ],
      "confidence": "proposed"
    },
    {
      "name": "PayloadEvent",
      "fields": [
        "id",
        "transaction_id",
        "equipment_id",
        "captured_at",
        "payload_kg",
        "source",
        "confidence_or_quality"
      ],
      "confidence": "proposed"
    },
    {
      "name": "Site",
      "fields": [
        "id",
        "name",
        "timezone",
        "geo_area",
        "status"
      ],
      "confidence": "proposed"
    },
    {
      "name": "AuditEvent",
      "fields": [
        "id",
        "actor_id",
        "action",
        "object_type",
        "object_id",
        "before_hash",
        "after_hash",
        "occurred_at",
        "reason"
      ],
      "confidence": "proposed"
    },
    {
      "name": "IntegrationOutbox",
      "fields": [
        "id",
        "event_type",
        "object_id",
        "destination",
        "retry_count",
        "status",
        "last_error",
        "idempotency_key"
      ],
      "confidence": "proposed"
    }
  ],
  "alerts": [
    {
      "code": "WEIGHT_DEVIATION",
      "condition": "abs(net_kg-expected_kg) > max(abs_threshold_kg, expected_kg*pct_threshold/100)",
      "threshold": "آستانه قابل تنظیم بر اساس ماده/مجوز؛ default نامشخص",
      "action": "HOLD + SMS/Email + بررسی انسانی",
      "confidence": "proposed"
    },
    {
      "code": "PERMIT_INVALID",
      "condition": "now خارج از valid_from/valid_to یا status!=approved",
      "threshold": "boolean",
      "action": "DENY/HOLD",
      "confidence": "proposed"
    },
    {
      "code": "PERMIT_OVERLIMIT",
      "condition": "net_kg > remaining_kg + tolerance_kg",
      "threshold": "tolerance مصوب",
      "action": "HOLD؛ به‌روزرسانی مانده پس از تأیید",
      "confidence": "proposed"
    },
    {
      "code": "PLATE_RFID_MISMATCH",
      "condition": "normalized_plate با tag-to-vehicle mapping مغایر",
      "threshold": "exact/verified match",
      "action": "HOLD + تصویر شواهد",
      "confidence": "proposed"
    },
    {
      "code": "WEIGHT_UNSTABLE",
      "condition": "stable=false در پنجره ثبت وزن",
      "threshold": "الگوی نمونه‌برداری OEM",
      "action": "عدم ثبت وزن",
      "confidence": "proposed"
    },
    {
      "code": "PARTIAL_VEHICLE",
      "condition": "position_valid=false یا occupancy conflict",
      "threshold": "تنظیم هندسه/حسگر",
      "action": "عدم ثبت وزن و چراغ انتظار",
      "confidence": "proposed"
    },
    {
      "code": "LOAD_CELL_DRIFT",
      "condition": "zero_drift > OEM/site_limit",
      "threshold": "نیازمند داده سلامت driver",
      "action": "خارج‌کردن باسکول از سرویس در شرایط مصوب",
      "confidence": "proposed"
    },
    {
      "code": "CALIBRATION_EXPIRED",
      "condition": "now > calibration.valid_until",
      "threshold": "تاریخ گواهی",
      "action": "اعلان، و بسته به مقررات مسدودسازی توزین رسمی",
      "confidence": "proposed"
    },
    {
      "code": "DUPLICATE_TRIP",
      "condition": "same vehicle+direction در window قابل تنظیم بدون closure",
      "threshold": "پنجره مصوب",
      "action": "REVIEW",
      "confidence": "proposed"
    },
    {
      "code": "LONG_STAY",
      "condition": "exited_at missing و elapsed > site_limit",
      "threshold": "به تفکیک نوع عملیات",
      "action": "هشدار صف/تردد",
      "confidence": "proposed"
    },
    {
      "code": "DEVICE_OFFLINE",
      "condition": "health heartbeat older than timeout",
      "threshold": "Timeout از FAT/SAT",
      "action": "قطع فرمان خودکار، فعال‌سازی SOP دستی",
      "confidence": "proposed"
    },
    {
      "code": "VOLUME_WEIGHT_MISMATCH",
      "condition": "abs(net_kg - density*volume_m3*1000) > configured_limit",
      "threshold": "چگالی و عدم قطعیت معتبر",
      "action": "صرفاً QC review؛ نه حکم قطعی تقلب",
      "confidence": "proposed"
    }
  ],
  "workflow_states": [
    "PLANNED",
    "ARRIVED",
    "IDENTIFIED",
    "AUTHORIZED",
    "ON_SCALE_1",
    "WEIGHED_1",
    "LOADING",
    "ON_SCALE_2",
    "WEIGHED_2",
    "VERIFYING",
    "CLEARED",
    "EXITED",
    "CLOSED",
    "HOLD",
    "REVIEW",
    "CANCELLED",
    "DEVICE_FAULT"
  ],
  "integration_adapters": [
    "anpr",
    "rfid",
    "scale",
    "gate-plc",
    "erp",
    "lidar",
    "onboard-payload"
  ],
  "references": {
    "M1": "https://metrici.ro/cases/weighing-automation",
    "M2": "https://metrici.ro/metrici-news-weighing-module",
    "M3": "https://www.metrici.ro/cases/valplast",
    "M4": "https://metrici.ro/cases/tenaris-silcotub",
    "M5": "https://www.metrici.ro/files/manuals/LPR_User_Guide_2.0_Eng.pdf",
    "M6": "https://www.metrici.ro/change-log",
    "M7": "https://metrici.ro/products/metrici-lprweighing",
    "M8": "https://metrici.ro/downloads",
    "M9": "https://metrici.ro/videos",
    "A1": "https://www.averyweigh-tronix.com/en/product/weighman-8-weighbridge-software/",
    "A2": "https://www.averyweigh-tronix.com/en/product/smartower-unmanned-weighbridge-system/",
    "P1": "https://www.processbd.com/PRECIA_MOLEN/Weigh_Bridge_and_Access_Control.html",
    "P2": "https://us.preciamolen.com/wp-content/uploads/sites/22/2019/07/09-15-01-1-FT-TRUCKFLOW-V00.09.pdf",
    "P3": "https://www.directindustry.com/prod/precia-molen/product-7658-2537247.html",
    "L1": "https://www.loadscan.com/myscanner/",
    "L2": "https://www.loadscan.com/load-volume-scanner/",
    "L3": "https://www.loadscan.com/loadscan-integration-api/",
    "R1": "https://www.ricelake.com/products/iqube2-digital-diagnostic-junction-box?part=93243",
    "C1": "https://www.cat.com/en_US/by-industry/mining/surface-mining/surface-technology/fleet.html"
  }
}
```

## پیوست: معیار طراحی و ارزیابی
هیچ تصویر، کد، نشان تجاری، ساختار بانک اطلاعاتی ادعایی یا محتوای دارای مالکیت محصول مرجع عیناً بازتولید نشده است. نقل قابلیت‌های عمومی فقط با منبع صورت گرفته است. مرحله اجرایی بعدی: تدوین API contract، schema migration، mock devices، تست end-to-end، FAT/SAT و ارزیابی الزامات قانونی توزین.
