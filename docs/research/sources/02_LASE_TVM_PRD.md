# سند مشخصات محصول (PRD) — سامانه یکپارچه توزین، تردد و حجم‌سنجی معدنی

**نسخه:** 1.0 (Research-backed design draft)  
**تاریخ بررسی:** 2026-10-25  
**منبع اصلی:** LASE TVM — https://www.lase-tvm.com/de  
**وضعیت:** مشخصات پیشنهادی سامانه جدید، نه مستندات داخلی هیچ فروشنده  
**محدودیت:** خزش کامل فنی اثبات نشد؛ robots.txt و sitemap.xml در ابزار وب قابل دسترسی نبودند؛ ویدئوها frame-by-frame بازبینی نشده‌اند. نداشتن شواهد به معنی فقدان قابلیت نیست. هیچ تصویر/کد/متن/برندی برای تقلید مستقیم مجاز نیست.

## ۱. خلاصه اجرایی

1. LASE TVM اندازه‌گیری حجم بار با LiDAR/اسکنر لیزری را به صورت ایستا و حین حرکت ارائه می‌کند [L1-L4].
2. مدل S یک اسکنر سه‌بعدی برای اندازه‌گیری ایستا دارد؛ مدل M یک اسکنر دوبعدی پروفایل و یک اسکنر دوبعدی tracking دارد [L2-L3].
3. مقایسه کامیون خالی و پر مبنای حجم خالص است [L2-L3].
4. برای S و M خطای معمول حدود ±۲٪ در دیتاشیت عنوان شده؛ این ادعا معیار پذیرش تضمین‌شده پروژه ما نیست [L2-L3].
5. RFID، OCR پلاک، دوربین مستند‌سازی، چراغ راهنما و web portal گزینه‌های قابل افزودن LASE هستند [L1-L3].
6. امکان اتصال به ERP و داده باسکول بیان شده ولی پروتکل و schema منتشر نشده [L1].
7. Avery Weighman 8 و TruckFlow الگوهای مرتبط مدیریت تراکنش باسکول هستند [A1,P1-P3].
8. SmarTower یک الگوی عملی برای سخت‌افزار باسکول بدون اپراتور است [A2].
9. Loadscan نمونه مناسب اسکن حجمی + مدیریت ابری + API + گزارش زمان‌بندی‌شده است [D1-D3].
10. Cat MineStar منبع کاربردی برای چرخه حمل، payload و KPI تولید است [C1-C2].
11. ویژگی‌های مجوز حمل، تشخیص اعتبار کالیبراسیون و کنترل انحراف وزن/حجم در این PRD مستقل و «پیشنهادی» هستند.
12. معماری پیشنهادی: Edge gateway مستقل، تراکنش‌محور، event log، ماژول‌های سخت‌افزاری plug-in و هسته مرکزی چندسایتی.

## ۲. فهرست منابع بررسی‌شده و دامنه خزش

کد ارجاع در تمام جداول به URL زیر اشاره می‌کند؛ وجود کد به معنای دسترسی مستند است، نه تأیید همه ویژگی‌های محصول.

- **[L1]** https://www.lase-tvm.com/de
- **[L2]** https://cdn.sanity.io/files/n3ttoe8y/production/e79a9ee63f1abef204f4c95b10b3f34986fe9ff5.pdf
- **[L3]** https://cdn.sanity.io/files/n3ttoe8y/production/4df9d3ff2c138652f9bb1946d121264591353bdb.pdf
- **[L4]** https://cdn.sanity.io/files/n3ttoe8y/production/a224d92f5cc7f46ec03507c854e02e6f3b728498.pdf
- **[L5]** https://lase-solutions.com/products/bulk-material/lasetvm
- **[L6]** https://lase-solutions.com/de/fallstudien
- **[L7]** https://cdn.sanity.io/files/n3ttoe8y/production/aafa30f97e9ebeb68d021e86ae0f0b0454970b63.pdf
- **[L8]** https://cdn.sanity.io/files/n3ttoe8y/production/5d53ad472698c561a38dcc0c416523ab8c5598d9.pdf
- **[A1]** https://www.averyweigh-tronix.com/en/product/weighman-8-weighbridge-software/
- **[A2]** https://www.averyweigh-tronix.com/en/product/smartower-unmanned-weighbridge-system/
- **[P1]** https://us.preciamolen.com/wp-content/uploads/sites/22/2019/07/09-15-01-1-FT-TRUCKFLOW-V00.09.pdf
- **[P2]** https://www.preciamolen.com/wp-content/uploads/2022/10/DC10041-1-014_interactif.pdf
- **[P3]** https://www.directindustry.com/prod/precia-molen/product-7658-2537247.html
- **[D1]** https://www.loadscan.com/load-volume-scanner/
- **[D2]** https://www.loadscan.com/myscanner/
- **[D3]** https://www.loadscan.com/service-agreement/
- **[C1]** https://www.cat.com/en_US/by-industry/mining/surface-mining/surface-technology/fleet.html
- **[C2]** https://www.cat.com/en_US/news/machine-press-releases/new-cat-minestar-reporting-integrates-minestar-and-other-vendor-data-into-a-single--unified-interface.html
- **[I1]** https://www.miningweekly.com/article/dwyka-mining-services-proudly-represents-incredible-bulk-handling-with-lase-industrielles-tvm-3d-m-2024-04-26
- **[I2]** https://www.pressebox.com/pressrelease/lase-gmbh/LASE-provides-volume-measurement-system-for-dump-trucks-at-the-construction-of-the-M11-motorway-project-in-Russia/boxid/856417

**صفحات لینک‌شده قابل‌ردیابی از دامنه اصلی:** `/de`، نسخه‌های زبانی EN/ESP/PT در منو، PDFهای مستقیم [L2,L3,L4]، ویدئوهای معرفی مرتبط، صفحه اصلی محصولات [L5]، صفحات مطالعات موردی [L6] و مطالعه‌های [L7,L8]. منوهای سایت مادر همچنین دسته‌های Systems / Bulkhandling / Sensors / Downloads / Case Studies / Support را آشکار می‌کنند [L5,L6]. پیوندهای تصاویر سایت اصلی روی CDN `static.wixstatic.com` قرار دارند. **فهرست همه URLهای موجود در کل سایت قابل اثبات نیست.**

**شکاف خزش:** `https://www.lase-tvm.com/robots.txt` و `https://www.lase-tvm.com/sitemap.xml` در محیط بررسی در دسترس نبودند؛ صفحات پشت فرم و محتوای ویدئوها به طور کامل بررسی نشده‌اند. بررسی مراجع Dariel WBX، WeighMAST، TraxEMT، POWERCELL، iQUBE²، Trimble، Wenco، Hexagon و Modular DISPATCH در این نسخه تکمیل نشد؛ وضعیت آن‌ها عمداً «نامشخص» است.

### تفکیک مستندات LASE و استنباط

| مدل | حسگر/روش صریح | عملیات | مستند | اطمینان |
|---|---|---|---|---|
| TVM-3D-S | یک 3D scanner بالای ناحیه | توقف خودرو، اسکن خالی و پر، تفاضل | L2 ص ۱–۲ | تأییدشده |
| TVM-3D-M | دو 2D scanner؛ یکی پروفایل، یکی tracking | عبور بدون توقف، تفاضل پروفایل | L3 ص ۱–۲ | تأییدشده |
| TVM-3D-LOG | چهار 2D scanner؛ دو بالایی و دو جانبی؛ یکی وظیفه tracking دارد | اندازه‌گیری گرده‌بینه در حرکت | L4 ص ۱–۲ | تأییدشده |
| TVM web portal | مشاهده برخط و کنترل فرآیند | جزئیات نرم‌افزار/مجوز کاربری منتشر نشده | L1,L2 | تأییدشده در سطح وجود؛ جزئیات نامشخص |
| مطالعه Tharisa | ساخت baseline از حدود ۲۰۰۰ اسکن CAT777 و integration | مطالعه موردی پیاده‌سازی واقعی | L7 ص ۱ | تأییدشده |

### بررسی شواهد تصویری

| تصویر/مستند | صفحه و اجزای قابل تشخیص | چیدمان، رنگ، کاربرد | اطمینان |
|---|---|---|---|
| [L2] ص۱ | شماتیک کامیون زیر سازه + پنجره point cloud | کامیون سبز/سازه سبز و محدوده اسکن قرمز؛ **رندر فنی، نه UI** | تأییدشده |
| [L3] ص۲ | سه مرحله کامیون خالی → کامیون پر → خروجی حجمی نمونه | دو تصویر بالایی و نتیجه پایین؛ point cloud سبز؛ **نمودار توضیحی، نه dashboard** | تأییدشده |
| [I1] تصویر داشبورد همراه خبر | نوار جانبی، نقشه، جدول/نمودار اندازه‌گیری و فیلتر تاریخ | پس‌زمینه روشن، ناوبری تیره؛ جزئیات متن تصویر بدون دسترسی به فایل اصلی تضمین نمی‌شود | استنباطی از تصویر |
| [I2] تصویر رابط FEST | جدول رخداد، وضعیت چراغ، تصاویر دوربین، انتخاب پلاک و دکمه عملیات | UI صنعتی متراکم، پنل‌های جدا و نمایش دوربین پایین صفحه | استنباطی از تصویر |

**ویدئوها:** پیوند رسمی معرفی محصولات از [L1] شناسایی شد، اما فریم‌ها و گردش کار داخل آن‌ها را به عنوان «مشاهده‌شده» گزارش نمی‌کنیم. جریان‌های بخش ۵ طراحی پیشنهادی و مبتنی بر مستندات متنی هستند.

## ۳. ماتریس مقایسه و ویژگی‌های هسته

**کد:** `دارد [مرجع]` = تأیید صریح در منبع؛ `؟` = نامشخص و نه «ندارد». به‌دلیل پرهیز از جعل، خانه «ندارد» تنها وقتی به کار می‌رود که منبع صریحاً نبودن قابلیت را اعلام کند. ستون LASE به مجموعه محصولات/گزینه‌های آن اشاره می‌کند نه یک پیکربندی استاندارد. ستون MineStar فقط خانواده Fleet/Reporting است.

| قابلیت | LASE | Weighman8 | SmarTower | TruckFlow | Loadscan | MineStar | هسته (حداقل ۳ محصول مستند) |
|---|---|---|---|---|---|---|---|
| RFID identification | دارد [L1] | دارد [A1] | دارد [A2] | دارد [P1] | دارد [D1] | ؟ | بله |
| ANPR/OCR plate identification | دارد [L1] | دارد [A1] | ؟ | دارد [P3] | ؟ | ؟ | بله |
| camera image evidence | دارد [L2] | دارد [A1] | دارد [A2] | دارد [P3] | دارد [D1] | ؟ | بله |
| traffic lights/barrier control | دارد [L1] | دارد [A1] | دارد [A2] | دارد [P1] | ؟ | ؟ | بله |
| driver terminals | ؟ | دارد [A1] | دارد [A2] | دارد [P1] | دارد [D1] | ؟ | بله |
| full/empty 3D scan and volume | دارد [L3] | ؟ | ؟ | ؟ | دارد [D1] | ؟ | خیر/نامشخص |
| in-motion volume scan | دارد [L3] | ؟ | ؟ | ؟ | دارد [D1] | ؟ | خیر/نامشخص |
| weighbridge management | ؟ | دارد [A1] | دارد [A2] | دارد [P2] | ؟ | ؟ | بله |
| stored tare | ؟ | دارد [A1] | ؟ | ؟ | ؟ | ؟ | خیر/نامشخص |
| multi-site deployment | ؟ | دارد [A1] | دارد [A2] | دارد [P3] | ؟ | ؟ | بله |
| ERP or back-office integration | دارد [L1] | دارد [A1] | دارد [A2] | دارد [P2] | دارد [D3] | ؟ | بله |
| web portal / remote operations | دارد [L1] | دارد [A1] | دارد [A2] | ؟ | دارد [D2] | ؟ | بله |
| reports / analytics | دارد [L1] | دارد [A1] | ؟ | دارد [P3] | دارد [D2] | دارد [C2] | بله |
| dashboard errors and warnings | ؟ | ؟ | ؟ | ؟ | دارد [D2] | ؟ | خیر/نامشخص |
| audit trail | دارد [L1] | دارد [A1] | ؟ | ؟ | ؟ | ؟ | خیر/نامشخص |
| invoicing | ؟ | دارد [A1] | ؟ | دارد [P2] | ؟ | ؟ | خیر/نامشخص |
| shift/fleet cycle and payload KPIs | ؟ | ؟ | ؟ | ؟ | ؟ | دارد [C1] | خیر/نامشخص |
| fuel / delays fleet productivity | ؟ | ؟ | ؟ | ؟ | ؟ | دارد [C1] | خیر/نامشخص |
| calibration certificate expiry alerts | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | خیر/نامشخص |
| permit reconciliation and loading authorization | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | خیر/نامشخص |
| specific Modbus/OPC-UA/MQTT interface | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | خیر/نامشخص |

**ویژگی‌های هسته (قاعده شواهد ≥۳ ستون):** RFID، ANPR، مستندات تصویری، چراغ/راهبند، ترمینال راننده، مدیریت باسکول، چندسایتی، ERP، portal، گزارش‌ها. واژه «هسته» مبتنی بر فراوانی *شواهد مثبت* در این نمونه محدود است، نه فراوانی بازار.

**متمایزکننده‌ها:** اسکن LiDAR خالی/پر [L2,L3,D1]؛ خطا و هشدار اسکنر + نمودار تاریخچه و API در MyScanner [D2,D3]؛ کالیبراسیون ساخت baseline در Tharisa [L7]؛ سامانه‌ توزین بدون اپراتور با سنسور موقعیت و voice guidance [A2]؛ اطلاعات چرخه، مسیر و payload در MineStar [C1]. «پایش سلامت گواهی کالیبراسیون» و «کنترل حواله قبل از خروج» برای محصول پیشنهادی تعریف شده و به LASE نسبت داده نشده‌اند.

## ۴. PRD کامل

### نقش‌های کاربری و سطح دسترسی پیشنهادی

- **Gate Operator:** ثبت/بازبینی پلاک، وضعیت راهبند، مشاهده علت hold؛ بدون تغییر وزن ثبت‌شده.
- **Weighbridge Operator:** آغاز/ثبت دو توزین، بررسی پایداری و عکس، ثبت تفسیر و override محدود با دلیل.
- **Dispatch Controller:** تخصیص سفارش، مسیر، بار و تأیید مجوز حمل.
- **Mine Shift Supervisor:** پایش سفر، تولید، صف، گزارش شیفت و استثناها.
- **Commercial / Sales:** ثبت سفارش، سهمیه حواله، صورت‌حساب و تطبیق ERP.
- **Metrology / Maintenance:** سرویس، سنسور، ثبت گواهی کالیبراسیون و تشخیص خطا.
- **Auditor:** دسترسی فقط‌خواندنی به رخدادها، عکس‌ها، raw data و audit trail.
- **System Administrator:** کاربران، تجهیزات، کانکتورها، سیاست‌ها و دسترسی بین‌سایتی.

### داستان‌های کاربر

- به عنوان اپراتور دروازه می‌خواهم RFID و ANPR با هم تطبیق داده شوند تا ورود ناوگان غیراصیل متوقف شود.
- به عنوان مسئول باسکول می‌خواهم وزن پایدار ثبت و به رویداد تصویر پیوند شود تا اختلافات تراکنشی رسیدگی شوند.
- به عنوان مسئول فروش می‌خواهم وزن خالص با مقدار باقی‌مانده حواله تطبیق شود تا خروج بیش از سهمیه اتفاق نیفتد.
- به عنوان مسئول تعمیرات می‌خواهم قبل از انقضای گواهی کالیبراسیون هشدار بگیرم تا نتیجه وزن فاقد اعتبار عملیاتی نشود.
- به عنوان سرپرست شیفت می‌خواهم تعداد سفر و تناژ را به تفکیک معدن، ماده و پیمانکار مشاهده کنم.
- به عنوان ممیز می‌خواهم ثبت تغییرات غیرقابل‌حذف و نسخه معتبر خروجی را بازیابی کنم.

### الزامات عملکردی (همه این‌ها **پیشنهادی** برای محصول جدیدند)

| کد | حوزه | الزام | اولویت |
|---|---|---|---|
| FR-01 | identification | ثبت ورود خودرو با پلاک، RFID، زمان و محل دروازه | P0 |
| FR-02 | identification | ادغام رخدادهای ANPR و RFID و تشخیص مغایرت هویت | P0 |
| FR-03 | identification | کنترل چراغ و راهبند فقط پس از تأیید شرایط ایمنی و مجوز | P0 |
| FR-04 | identification | ثبت تصویر، کیفیت تشخیص و بازبینی انسانی پلاک | P0 |
| FR-05 | weighing | دریافت مقدار پایدار وزن از نمایشگر باسکول و ثبت خام | P0 |
| FR-06 | weighing | پشتیبانی توزین دو مرحله‌ای، جهت‌های مختلف بارگیری و تارای ذخیره‌شده با کنترل اعتبار | P0 |
| FR-07 | weighing | محاسبه وزن خالص و ثبت تمام تغییرات و استثناها | P0 |
| FR-08 | weighing | تطبیق هر رخداد با باسکول و خودرو و جلوگیری از وزن تکراری | P0 |
| FR-09 | permits | ثبت حواله حمل/فروش/خرید، وضعیت، سقف، تاریخ و سهمیه | P0 |
| FR-10 | permits | قفل خروج در صورت فقدان مجوز معتبر یا تخطی از ظرفیت مگر override مجاز | P0 |
| FR-11 | permits | به‌روزرسانی مصرف سهمیه اتمیک و صدور سند پس از نهایی‌سازی | P0 |
| FR-12 | logistics | ماشین حالت تردد از ورود تا خروج با timestamp و شناسه رخداد | P0 |
| FR-13 | logistics | اندازه‌گیری صف، مدت حضور، سفر و زمان چرخه با تعریف رخداد | P1 |
| FR-14 | calibration | تقویم کالیبراسیون، گواهی‌ها، اعتبار و وضعیت سرویس | P0 |
| FR-15 | calibration | پایش وضعیت خطای اندیکاتور و داده سنسورها فقط در صورت پشتیبانی سخت‌افزار | P1 |
| FR-16 | volumetrics | ثبت اسکن خالی و پر و تطبیق هندسی با شناسه خودرو | P1 |
| FR-17 | volumetrics | بازسازی سطح سه‌بعدی و محاسبه اختلاف حجم با عدم‌قطعیت و کیفیت اسکن | P1 |
| FR-18 | volumetrics | تخمین جرم از چگالی با نمایش صریح برچسب تخمینی و عدم استفاده برای جایگزینی وزن قانونی | P1 |
| FR-19 | fleet | دریافت payload و چرخه ماشین‌آلات از کانکتورهای اختیاری | P2 |
| FR-20 | fleet | تجمیع تولید و سفر به شیفت، ماده، مسیر، ماشین و پیمانکار | P1 |
| FR-21 | reports | داشبورد زنده عملیات، KPI، هشدارها، فیلتر سایت/شیفت/ماده | P0 |
| FR-22 | reports | خروجی CSV/XLSX/PDF و زمان‌بندی گزارش با مجوز دسترسی | P1 |
| FR-23 | integration | کانکتورهای نسخه‌دار ERP/PLC/indicator و وب‌هوک | P1 |
| FR-24 | integration | صف محلی رخداد و همگام‌سازی مقاوم در برابر قطع شبکه با idempotency | P0 |
| FR-25 | security | RBAC، ثبت audit trail غیرقابل بازنویسی و تأیید دو نفره برای override پرریسک | P0 |
| FR-26 | security | تشخیص مغایرت تصویر، پلاک، RFID و حمله تکرار رخداد | P0 |
| FR-27 | security | مدیریت چند سایت و تفکیک tenant / site داده‌ها | P1 |

### الزامات غیرکارکردی (پیشنهادی)

- **NFR-01:** کنترل راهبند fail-safe؛ بدون وابستگی مستقیم به پاسخ سرور مرکزی
- **NFR-02:** تمام timestampها ذخیره UTC با timezone سایت و ساعت دستگاه ثبت شود
- **NFR-03:** هر رخداد شامل device_id، event_id یکتا، monotonic_sequence و source_quality
- **NFR-04:** اندازه‌گیری قانونی فقط با ابزار تأییدشده و رویه قانونی محلی؛ LiDAR سنجه مکمل است
- **NFR-05:** انتقال TLS، هویت دستگاه، رمزنگاری داده حساس و حداقل‌سازی PII
- **NFR-06:** پشتیبان‌گیری، بازیابی، ذخیره‌سازی شواهد قابل راستی‌آزمایی و retention policy
- **NFR-07:** API schema و قرارداد JSON نسخه‌دار؛ قابلیت تست قرارداد برای کانکتورها
- **NFR-08:** آستانه‌ها، latency، availability و خطای اندازه‌گیری باید در FAT/SAT تعیین و آزموده شوند
- **NFR-09:** در رابط فارسی، پشتیبانی RTL و اعداد/واحدهای استاندارد و دسترس‌پذیری صفحه
- **NFR-10:** پایش سلامت دستگاه و heartbeats و جداسازی خطای کانکتور از خطای ابزار


**ملاک پذیرش پیشنهادی برای MVP:** هر تراکنش دارای یک vehicle، یک مجوز (یا علت استثنا)، رویداد دروازه، دو رویداد وزن در حالت دو مرحله‌ای، وضعیت پایدار وزن، عکس‌های موجود، زمان‌ها و audit trail باشد. قطع شبکه مرکزی نباید به فقدان رخداد یا باز شدن خودکار راهبند منجر شود. حدهای عملکردی باید از طریق تست سایت و قرارداد تعیین شوند؛ هیچ SLA عددی بدون آزمون فرض نشده است.

## ۵. جریان‌های کاری و ماشین حالت

**ماشین حالت:** `EXPECTED → GATE_IN_PENDING → IDENTIFIED → ENTRY_APPROVED → FIRST_WEIGHED → LOADING → SECOND_WEIGHED → VALIDATING → EXIT_APPROVED → CLOSED`؛ شاخه‌های `ON_HOLD`, `REJECTED`, `CANCELLED` با علت و actor ثبت می‌شوند.

1. **پیش از ورود:** کاربر حواله/سفارش را ثبت یا از ERP دریافت می‌کند؛ شناسه خودرو، راننده، ماده، مبدأ و مقصد کنترل می‌شود.
2. **تشخیص نزدیک دروازه:** دوربین ANPR و RFID رویداد مستقل با زمان و quality ایجاد می‌کنند؛ موتور تطبیق identity واحد و confidence را ایجاد می‌کند؛ ابهام → بررسی اپراتور.
3. **کنترل تردد:** اعتبار مجوز، ظرفیت، blacklist، شرایط ایمنی و وضعیت راهبند بررسی می‌شود؛ gateway محلی فرمان مجاز را به PLC می‌دهد.
4. **توزین اول:** سنسور موقعیت کامل‌بودن خودرو و indicator حالت stable را تأیید می‌کنند؛ وزن خام، نوع رخداد و تصویر ثبت می‌شود؛ بار خالی یا پر بودن از workflow معلوم است نه از مقدار وزن به‌تنهایی.
5. **بارگیری/تخلیه:** ثبت زمان شروع/پایان، معدن/انبار، ماده و واحد بارگیر؛ در صورت وجود، payload event تجهیزات متصل می‌شود.
6. **توزین دوم:** همان کنترل‌های پایداری، موقعیت، identity و ثبت شواهد اجرا می‌شود؛ gross و tare با توجه به جهت فرآیند تعیین می‌شود؛ `net_kg = gross_kg - tare_kg` و net منفی به بررسی می‌رود.
7. **اسکن اختیاری LiDAR:** اسکن empty و loaded با vehicle profile و geometry هم‌تراز می‌شوند؛ حجم اختلاف، کیفیت و عدم‌قطعیت ثبت می‌شود؛ داده حجمی یک **مشاهده مستقل** است.
8. **تطبیق مجوز:** وزن خالص با سهمیه باقی‌مانده و سقف وزن قانونی/سیاست سایت سنجیده می‌شود؛ تخصیص سهمیه به صورت اتمیک صورت می‌گیرد.
9. **پیش از خروج:** در صورت عبور از همه کنترل‌ها، قبض و رویداد finalization صادر می‌شود؛ راهبند خروج باز و رخداد خروج ثبت می‌شود؛ در غیر این‌صورت hold و ارجاع به مسئول مربوط.
10. **پس از خروج:** همگام‌سازی ERP، آرشیو عکس‌ها، ساخت گزارش شیفت و رسیدگی به استثناها.

### فرمول‌ها و کیفیت سنجش

- `net_mass_kg = gross_mass_kg - tare_mass_kg`؛ **gross** و **tare** باید از دو اندازه‌گیری معتبر با یکسان‌سازی واحد حاصل شوند.
- `turnaround_seconds = gate_exit_at - gate_entry_at` با کنارگذاری تراکنش‌های ناقص.
- `volume_m3 = integral_over_truck_bed(max(0, loaded_surface_z - empty_surface_z) dA)` با دستگاه مختصات هم‌راستا و ارزیابی خطای اسکن؛ این فرمول، **طرح محاسباتی پیشنهادی** است نه الگوریتم اختصاصی LASE.
- `estimated_mass_kg = volume_m3 * density_kg_m3`؛ وابسته به تعریف چگالی توده‌ای، رطوبت، عدم‌قطعیت و جنس ماده؛ هرگز جانشین خودکار وزن گواهی‌شده نباشد.
- `fleet_tonnage = sum(valid net_mass_kg)`؛ تعریف سفر و شیفت و جلوگیری از شمارش دوگانه باید مشخص شود.

## ۶. مدل داده پیشنهادی

تمام شناسه‌ها UUID یا شناسه پایدار مشابه هستند؛ ارتباطات با foreign key، داده‌های خام immutable و فایل‌های حجیم در object storage نگهداری می‌شوند. فیلدها پایه هستند، نه schema کامل تولیدی.

| موجودیت | فیلدها |
|---|---|
| `Vehicle` | `id`, `plate_normalized`, `plate_country`, `vehicle_type`, `axle_count`, `capacity_kg`, `rfid_tag_ids`, `carrier_id`, `active` |
| `Driver` | `id`, `name`, `license_id`, `carrier_id`, `active` |
| `Carrier` | `id`, `legal_name`, `tax_id`, `contact` |
| `Customer` | `id`, `name`, `customer_type`, `erp_code` |
| `Material` | `id`, `name`, `grade`, `unit`, `density_kg_m3`, `density_reference`, `density_uncertainty` |
| `Permit` | `id`, `permit_no`, `permit_type`, `vehicle_id`, `carrier_id`, `customer_id`, `material_id`, `origin_id`, `destination_id`, `valid_from`, `valid_until`, `authorized_kg`, `remaining_kg`, `status`, `external_ref` |
| `Transaction` | `id`, `site_id`, `vehicle_id`, `driver_id`, `carrier_id`, `material_id`, `permit_id`, `origin_id`, `destination_id`, `status`, `entry_at`, `first_weigh_at`, `loaded_at`, `second_weigh_at`, `exit_at`, `gross_kg`, `tare_kg`, `net_kg`, `volume_m3`, `created_at`, `finalized_at` |
| `WeighEvent` | `id`, `transaction_id`, `scale_id`, `kind`, `weight_kg`, `stable`, `raw_message_ref`, `captured_at`, `photo_ids`, `operator_id`, `indicator_status` |
| `GateEvent` | `id`, `transaction_id`, `gate_id`, `event_type`, `occurred_at`, `barrier_state`, `traffic_light_state` |
| `CameraPlateRead` | `id`, `camera_id`, `transaction_id`, `plate_raw`, `plate_normalized`, `confidence`, `captured_at`, `image_uri`, `review_status` |
| `RFIDRead` | `id`, `reader_id`, `transaction_id`, `tag_uid`, `antenna_id`, `rssi`, `captured_at` |
| `Scale` | `id`, `site_id`, `indicator_model`, `serial`, `protocol_profile`, `max_capacity_kg`, `division_kg`, `status`, `calibration_due_at` |
| `CalibrationRecord` | `id`, `scale_id`, `certificate_id`, `certificate_uri`, `issued_at`, `expires_at`, `result`, `issuer`, `test_points` |
| `Alert` | `id`, `site_id`, `transaction_id`, `rule_id`, `severity`, `threshold`, `observed_value`, `occurred_at`, `status`, `acknowledged_by`, `resolved_at` |
| `Shift` | `id`, `site_id`, `start_at`, `end_at`, `shift_name`, `supervisor_id` |
| `Equipment` | `id`, `site_id`, `equipment_type`, `fleet_id`, `telematics_source`, `status` |
| `LidarScan` | `id`, `transaction_id`, `scanner_id`, `scan_type`, `pointcloud_uri`, `surface_model_uri`, `volume_m3`, `quality_score`, `uncertainty_m3`, `captured_at`, `empty_scan_id` |
| `PayloadEvent` | `id`, `equipment_id`, `transaction_id`, `payload_kg`, `source_system`, `quality`, `occurred_at` |
| `Site` | `id`, `name`, `timezone`, `location_code` |
| `Device` | `id`, `site_id`, `type`, `protocol`, `firmware`, `last_seen_at`, `health_status` |
| `AuditLog` | `id`, `actor_id`, `action`, `entity_type`, `entity_id`, `before_hash`, `after_hash`, `timestamp`, `reason`, `correlation_id` |

**روابط کلیدی:** `Vehicle 1:N Transaction`؛ `Transaction 1:N WeighEvent/GateEvent/LidarScan/Alert`؛ `Permit 1:N Transaction` با budget اتمیک؛ `Scale 1:N CalibrationRecord`؛ `Equipment 1:N PayloadEvent`؛ `RFIDRead`/`CameraPlateRead` ممکن است پیش از ایجاد تراکنش orphan باشند و پس از بازبینی به آن پیوند بخورند.

**قیود ضروری:** uniqueness منطقی یک تراکنش باز برای هر `vehicle_id`/site مگر workflow چندسفره با override مستند؛ raw weight immutable؛ audit snapshot؛ محدودسازی داده‌های راننده؛ ثبت واحد kg و m³ به‌صورت explicit؛ نگهداری اندازه‌گیری اصلاح‌شده به شکل نسخه جدید، نه UPDATE تخریبی.

## ۷. مشخصات UI/UX مستقل (پیشنهادی، نه کپی رابط LASE)

**الگو:** رابط فارسی RTL، نوار بالایی وضعیت سایت/شیفت/اتصال، navigation جانبی، کارت‌های KPI، جدول/نقشه/گالری شواهد. مقایسه بصری به تصویر داشبورد در [I1] و رابط صنعتی [I2] متکی است؛ نسبت‌دادن صفحه‌های زیر به LASE **ممنوع** است.

| صفحه | اجزا و داده‌ها | تعامل/وضعیت |
|---|---|---|
| Operations Overview | تناژ امروز، سفرها، خودرو داخل سایت، صف، هشدار باز، باسکول فعال، بار میانگین، نمودار ساعتی | فیلتر سایت، شیفت، پیمانکار، ماده؛ drilldown |
| Gate Live | تصویر زنده، پلاک خوانده‌شده، RFID، اعتبار مجوز، وضعیت راهبند، چراغ و حسگر موقعیت | قبول/رد با دلیل، بررسی دستی، audit |
| Weigh Station | وزن live و stable، شماره تراکنش، عکس‌های قبل/بعد، وزن اول/دوم، راننده و ماده | ثبت رویداد غیرقابل‌تغییر، تکرار اندازه‌گیری کنترل‌شده |
| Transactions | جدول قابل فیلتر: شناسه، پلاک، driver، material، gross/tare/net، permit، times، status | مشاهده جزییات و export |
| Transaction Detail | timeline ورود تا خروج، مدارک حمل، event log، عکس و داده اسکن، سابقه اصلاح | compare evidence |
| Permit & Dispatch | سفارش‌ها، سهمیه، مصرف‌شده، باقیمانده، تاریخ اعتبار، مسیر، مجوز | create/approve/revoke مطابق نقش |
| LiDAR 3D Studio | empty/loaded point clouds، تفاوت سطح، volume، کیفیت اسکن | rotate/zoom، cross-section، compare |
| Fleet & Production | سفر/شیفت، cycle time، time utilization، payload و گزارش تولید | compare routes/equipment |
| Calibration & Health | وضعیت indicator، status سنسور، تاریخ گواهی، drift اگر instrument پشتیبانی کند | ثبت کالیبراسیون، schedule، جلوگیری از finalization |
| Alerts Center | severity، علت، مقدار مشاهده/آستانه، time، owner | acknowledge/escalate/resolve |
| Reports | تراکنش، تناژ، محموله، پیمانکار، شیفت، اختلاف جرم/حجم، خطا | CSV/XLSX/PDF, schedule |
| Integrations & Devices | کانکتورهای ERP/indicator/ANPR/RFID/PLC، heartbeat و queue depth | test connection, reconnect, map fields |
| Administration & Audit | کاربران، نقش‌ها، سیاست‌ها، رخداد تغییرات و سایت‌ها | RBAC و export ممیزی |

**قواعد رنگ/چیدمان پیشنهادی:** سطح اصلی خاکستری خنثی/سفید، متن تیره، سرمه‌ای برای منو، آبی برای کنش‌های اطلاعاتی، سبز صرفاً تأیید ایمنی/مجوز، نارنجی نیازمند بازبینی و قرمز block. رنگ تنها حامل وضعیت نباشد: متن و آیکون وضعیت نیز ارائه شوند. عدم تقلید از palette و لوگوی سازنده.

**KPI و تعریف دقیق:** `Tonnage = Σ net_kg/1000`، `Trips = count(closed unique transactions)`، `Avg Turnaround = avg(exit-entry)`، `Avg Payload = avg(valid net_kg)`، `Throughput per hour = count(closed)/operating_hours`؛ معیارهایی چون idle، utilization و fuel فقط با telematics و تعریف دقیق availability مخرج محاسبه شوند؛ مقادیر بدون سنسور نباید صفر نمایش داده شوند، بلکه N/A باشند.

## ۸. یکپارچه‌سازی و پروتکل‌ها

| اتصال | منبع شواهد قابلیت کلی | طراحی پیشنهادی فنی | سطح اطمینان |
|---|---|---|---|
| باسکول / weight indicator | L1 امکان اتصال داده؛ A2 دستگاه digitizer | Device-adapter برای RS232/485 یا TCP/IP، parse profile مختص مدل | اصل اتصال تأیید، پروتکل پیشنهادی |
| RFID | L1,L2,A2,D1 | Reader-adapter با tag id، reader، rssi، timestamp؛ **فرکانس LASE اعلام نشده** | وجود تأیید؛ مشخصات نامشخص |
| ANPR | L1,A1,P3 | OCR-adapter، normalize locale-aware، confidence، image hash | وجود تأیید؛ الگوریتم پیشنهادی |
| PLC/راهبند/چراغ | A2,P1 | command/ack با interlock، حالت fail-safe؛ Modbus TCP/RTU یا OPC UA به شرط پشتیبانی تجهیز | طراحی پیشنهادی |
| LiDAR | L2,L3,L4,D1 | stream/file pipeline و coordinate calibration؛ تبدیل point cloud به surface و volume | مبنای اندازه‌گیری تأیید؛ API نامشخص |
| ERP و حسابداری | L1,A1,A2,P2,D3 | REST API + outbox + reconciliation + webhooks + mapping و idempotency | قابلیت تأیید؛ قرارداد API پیشنهادی |
| Notification | D2 برای گزارش ایمیلی | Email/SMS/پیام‌رسان با consent و delivery logs | اصل ایمیل Loadscan تأیید؛ طراحی دیگر پیشنهادی |
| MQTT | منبع محصول خاص احراز نشده | telemetry غیرکنترلی، QoS متناسب، identity و ACL | پیشنهادی |

**معماری پیشنهادی:** `Camera/RFID/Indicator/LiDAR/PLC → Edge Device Adapters → Local Event Store + Rules/Interlock → Sync/Message Queue → Central API → Relational DB + Object Storage → Dashboard/ERP`. تصمیمات ایمنی نزدیک دستگاه و event collection به‌صورت آفلاین در Edge بمانند؛ reconciliation با شناسه رخداد یکتا و outbox انجام شود. بسته‌های deployment: یک ایستگاه، چند باسکول در یک سایت، چندسایتی با لایه مرکزی و جداسازی مالکیت داده. افزونه‌ها با versioned interface `initialize`, `health`, `consume_event`, `emit_event`, `get_config_schema` پیاده‌سازی شوند؛ هیچ‌یک از این نام‌ها API شرکت LASE نیست.

## ۹. منطق هشدارها (تماماً سیاست پیشنهادی)

**تمام آستانه‌های عددی نامشخص باید با داده سایت و FAT/SAT تنظیم شوند.** به‌ویژه zero drift، confidence OCR، آستانه اختلاف جرم/حجم، زمان صف و quality LiDAR را نباید با اعداد ساختگی مقداردهی کرد.

| کد | شرط/پایه ارزیابی | اقدام خودکار | شدت |
|---|---|---|---|
| AL-01 | `permit.valid_until < now or permit.status != ACTIVE` | `BLOCK_EXIT` | critical |
| AL-02 | `transaction.gross_kg > min(vehicle.capacity_kg,permit.authorized_kg) when values exist` | `HOLD_REVIEW` | critical |
| AL-03 | `normalized_ANPR_plate != vehicle.plate_normalized matched_by_RFID` | `HOLD_REVIEW` | high |
| AL-04 | `scale.calibration_due_at < now or certificate.result != PASS` | `DISABLE_AUTOMATIC_FINALIZATION` | critical |
| AL-05 | `indicator.stable != true` | `RETRY_AND_DO_NOT_CAPTURE` | high |
| AL-06 | `abs(current_zero-reference_zero) > config.zero_tolerance_kg` | `FLAG_SCALE` | high |
| AL-07 | `position_sensor != fully_on_scale` | `BLOCK_CAPTURE` | high |
| AL-08 | `active_transactions_for_vehicle > 1` | `HOLD_REVIEW` | high |
| AL-09 | `empty_scan.vehicle_id != loaded_scan.vehicle_id` | `REJECT_VOLUME_PAIR` | high |
| AL-10 | `abs(net_kg - volume_m3*density_kg_m3) > config.mass_volume_tolerance_kg` | `REVIEW` | medium |
| AL-11 | `scan.quality_score < config.min_scan_quality` | `REPEAT_SCAN` | medium |
| AL-12 | `now - device.last_seen_at > config.heartbeat_timeout_s` | `DEGRADED_MODE` | high |
| AL-13 | `exit_at-entry_at > config.turnaround_threshold_s` | `NOTIFY` | medium |
| AL-14 | `payload_kg > config.nominal_payload_kg` | `REVIEW` | high |

**سیاست escalation:** رخداد بحرانی مانع نهایی‌شدن/باز شدن خروج است مگر مجوز ویژه با امضای دوم، ثبت دلیل و قابلیت ممیزی. خرابی سنسور به معنای آن نیست که خودرو واقعاً تخلف کرده؛ وضعیت `UNKNOWN` باید از `FAIL` جدا باشد. اخطار کالیبراسیون باید بر مبنای سوابق قانونی معتبر و سیاست منطقه فعالیت تعیین شود.

## ۱۰. ماژول‌های افزودنی (Plug-ins)

1. **LiDAR & Volume:** ورودی `empty_scan`,`loaded_scan`,`vehicle_geometry`؛ خروجی `net_volume_m3`,`quality`,`pointcloud_uri`,`uncertainty`؛ در صورت mismatch یا occlusion، auto-approval ممنوع. LASE/Loadscan زمینه معتبر اثبات امکان این دسته‌اند [L2,L3,D1].
2. **Onboard Payload:** دریافت payload_event از سامانه لودر/شاول/کامیون با mapping equipment، timezone و کیفیت سنجش؛ مقایسه با وزن باسکول بدون جایگزینی سند معتبر. نیاز به قرارداد API سازنده دارد؛ Cat MineStar شواهد در سطح کاربرد پایش payload ارائه می‌کند [C1].
3. **Fleet KPI:** تبدیل eventهای ورود/خروج/بارگیری به چرخه حمل؛ idle/availability/utilization و fuel تنها با تجهیزات داده‌ده پشتیبانی می‌شود؛ ضد double-counting و change-of-shift allocation الزامی است [C1,C2].
4. **Commercial & Permit Engine:** مجوز حمل، حواله فروش/خرید، سقف تناژ، expiry و ERP settlement؛ طرح مستقل پیشنهادی برای نیاز معدن.

## ۱۱. شکاف‌ها، محدودیت شواهد و پرسش‌های باز

- **خزش:** فایل sitemap و robots در محیط تحقیق قابل دسترسی نبودند؛ فهرست URLها فقط مسیرهای مشاهده‌شده است؛ PDFها و محتوای ویدئویی همه مجموعه سایت exhaustively بررسی نشدند.
- **RFID:** فرکانس، range، standard و سازندگان Reader/Tag در LASE منتشر نشده‌اند. فرکانس UHF مستند مربوط به **Avery SmarTower** [A2] است و نمی‌توان آن را به LASE منتقل کرد.
- **LiDAR:** FPS، وضوح نقطه‌ای، field of view، کالیبراسیون هندسی و الگوریتم volume محاسبه‌شده از فرمول اختصاصی LASE قابل استخراج نیست.
- **باسکول:** نوع indicator، پروتکل raw framing، تابع stability، نرخ نمونه، قانونی بودن تراکنش و health لودسل برای LASE نامشخص است.
- **خودرو/مجوز:** schema فروش، سهمیه حواله، carrier contract، وزن مجاز محوری و anti-fraud داخلی LASE نامشخص‌اند.
- **UI:** dashboard و نشانی URL مستقیم web portal قابل login، نقش‌های عملیاتی و رفتار responsive LASE تأیید نشده‌اند؛ تصویر صنعتی [I2] محصول/پیاده‌سازی مرتبط تاریخی است و معادل UI فعلی LASE نیست.
- **کالیبراسیون:** قابلیت گواهی، health load cell، zero drift و off-center loading در منابع بررسی‌شده LASE اثبات نشده است.
- **معماری:** نرم‌افزار ابری/محلی، پروتکل‌های Modbus/OPC-UA/MQTT/RS232 و schema API برای LASE مشخص نیستند.
- **مقایسه‌کننده‌ها:** Dariel WBX، WeighMAST، TraxEMT، POWERCELL، Rice Lake iQUBE²، Trimble InsightHQ/LR360، Wenco، Hexagon و Modular DISPATCH از لحاظ جزئیات این نسخه **بررسی‌نشده** محسوب می‌شوند؛ هیچ وضعیت «ندارد» برای آن‌ها ادعا نمی‌شود.
- **سؤال‌های تعیین‌کننده اجرا:** (۱) قانونی یا صرفاً عملیاتی بودن توزین؟ (۲) مدل indicator و PLC؟ (۳) یک دروازه یا چند مسیر؟ (۴) انتخاب RFID فرکانس/برد بر اساس site survey؟ (۵) دقت لازم اسکن حجمی و استاندارد پذیرش؟ (۶) محدودیت افشای اطلاعات راننده و نگهداری تصاویر؟ (۷) API سیستم سفارش/ERP؟ (۸) مفاهیم رسمی سفر، شیفت، ماده و عملکرد ناوگان؟

## ۱۲. JSON ساختاریافته (PRD، مدل داده، هشدارها)

JSON زیر syntax-valid بوده، intended implementation spec است. ویژگی‌های محصول جدید با `evidence_status: proposed` مشخص‌اند و از ادعای محصول مرجع تفکیک می‌شوند.

```json
{
  "document_version": "1.0",
  "language": "fa",
  "evidence_status": "proposed",
  "source_registry": {
    "L1": "https://www.lase-tvm.com/de",
    "L2": "https://cdn.sanity.io/files/n3ttoe8y/production/e79a9ee63f1abef204f4c95b10b3f34986fe9ff5.pdf",
    "L3": "https://cdn.sanity.io/files/n3ttoe8y/production/4df9d3ff2c138652f9bb1946d121264591353bdb.pdf",
    "L4": "https://cdn.sanity.io/files/n3ttoe8y/production/a224d92f5cc7f46ec03507c854e02e6f3b728498.pdf",
    "L5": "https://lase-solutions.com/products/bulk-material/lasetvm",
    "L6": "https://lase-solutions.com/de/fallstudien",
    "L7": "https://cdn.sanity.io/files/n3ttoe8y/production/aafa30f97e9ebeb68d021e86ae0f0b0454970b63.pdf",
    "L8": "https://cdn.sanity.io/files/n3ttoe8y/production/5d53ad472698c561a38dcc0c416523ab8c5598d9.pdf",
    "A1": "https://www.averyweigh-tronix.com/en/product/weighman-8-weighbridge-software/",
    "A2": "https://www.averyweigh-tronix.com/en/product/smartower-unmanned-weighbridge-system/",
    "P1": "https://us.preciamolen.com/wp-content/uploads/sites/22/2019/07/09-15-01-1-FT-TRUCKFLOW-V00.09.pdf",
    "P2": "https://www.preciamolen.com/wp-content/uploads/2022/10/DC10041-1-014_interactif.pdf",
    "P3": "https://www.directindustry.com/prod/precia-molen/product-7658-2537247.html",
    "D1": "https://www.loadscan.com/load-volume-scanner/",
    "D2": "https://www.loadscan.com/myscanner/",
    "D3": "https://www.loadscan.com/service-agreement/",
    "C1": "https://www.cat.com/en_US/by-industry/mining/surface-mining/surface-technology/fleet.html",
    "C2": "https://www.cat.com/en_US/news/machine-press-releases/new-cat-minestar-reporting-integrates-minestar-and-other-vendor-data-into-a-single--unified-interface.html",
    "I1": "https://www.miningweekly.com/article/dwyka-mining-services-proudly-represents-incredible-bulk-handling-with-lase-industrielles-tvm-3d-m-2024-04-26",
    "I2": "https://www.pressebox.com/pressrelease/lase-gmbh/LASE-provides-volume-measurement-system-for-dump-trucks-at-the-construction-of-the-M11-motorway-project-in-Russia/boxid/856417"
  },
  "roles": [
    "gate_operator",
    "weighbridge_operator",
    "dispatch_controller",
    "shift_supervisor",
    "commercial",
    "maintenance",
    "auditor",
    "admin"
  ],
  "modules": [
    {
      "id": "identification",
      "title_fa": "شناسایی و کنترل تردد"
    },
    {
      "id": "weighing",
      "title_fa": "مدیریت باسکول"
    },
    {
      "id": "permits",
      "title_fa": "مجوزها و حواله‌ها"
    },
    {
      "id": "logistics",
      "title_fa": "تردد و عملیات حمل"
    },
    {
      "id": "calibration",
      "title_fa": "سلامت و کالیبراسیون"
    },
    {
      "id": "volumetrics",
      "title_fa": "LiDAR و اندازه‌گیری حجم"
    },
    {
      "id": "fleet",
      "title_fa": "تولید و ناوگان"
    },
    {
      "id": "reports",
      "title_fa": "گزارش و داشبورد"
    },
    {
      "id": "integration",
      "title_fa": "یکپارچه‌سازی"
    },
    {
      "id": "security",
      "title_fa": "امنیت و حسابرسی"
    }
  ],
  "functional_requirements": [
    {
      "id": "FR-01",
      "module": "identification",
      "description_fa": "ثبت ورود خودرو با پلاک، RFID، زمان و محل دروازه",
      "priority": "P0",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-02",
      "module": "identification",
      "description_fa": "ادغام رخدادهای ANPR و RFID و تشخیص مغایرت هویت",
      "priority": "P0",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-03",
      "module": "identification",
      "description_fa": "کنترل چراغ و راهبند فقط پس از تأیید شرایط ایمنی و مجوز",
      "priority": "P0",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-04",
      "module": "identification",
      "description_fa": "ثبت تصویر، کیفیت تشخیص و بازبینی انسانی پلاک",
      "priority": "P0",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-05",
      "module": "weighing",
      "description_fa": "دریافت مقدار پایدار وزن از نمایشگر باسکول و ثبت خام",
      "priority": "P0",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-06",
      "module": "weighing",
      "description_fa": "پشتیبانی توزین دو مرحله‌ای، جهت‌های مختلف بارگیری و تارای ذخیره‌شده با کنترل اعتبار",
      "priority": "P0",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-07",
      "module": "weighing",
      "description_fa": "محاسبه وزن خالص و ثبت تمام تغییرات و استثناها",
      "priority": "P0",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-08",
      "module": "weighing",
      "description_fa": "تطبیق هر رخداد با باسکول و خودرو و جلوگیری از وزن تکراری",
      "priority": "P0",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-09",
      "module": "permits",
      "description_fa": "ثبت حواله حمل/فروش/خرید، وضعیت، سقف، تاریخ و سهمیه",
      "priority": "P0",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-10",
      "module": "permits",
      "description_fa": "قفل خروج در صورت فقدان مجوز معتبر یا تخطی از ظرفیت مگر override مجاز",
      "priority": "P0",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-11",
      "module": "permits",
      "description_fa": "به‌روزرسانی مصرف سهمیه اتمیک و صدور سند پس از نهایی‌سازی",
      "priority": "P0",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-12",
      "module": "logistics",
      "description_fa": "ماشین حالت تردد از ورود تا خروج با timestamp و شناسه رخداد",
      "priority": "P0",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-13",
      "module": "logistics",
      "description_fa": "اندازه‌گیری صف، مدت حضور، سفر و زمان چرخه با تعریف رخداد",
      "priority": "P1",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-14",
      "module": "calibration",
      "description_fa": "تقویم کالیبراسیون، گواهی‌ها، اعتبار و وضعیت سرویس",
      "priority": "P0",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-15",
      "module": "calibration",
      "description_fa": "پایش وضعیت خطای اندیکاتور و داده سنسورها فقط در صورت پشتیبانی سخت‌افزار",
      "priority": "P1",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-16",
      "module": "volumetrics",
      "description_fa": "ثبت اسکن خالی و پر و تطبیق هندسی با شناسه خودرو",
      "priority": "P1",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-17",
      "module": "volumetrics",
      "description_fa": "بازسازی سطح سه‌بعدی و محاسبه اختلاف حجم با عدم‌قطعیت و کیفیت اسکن",
      "priority": "P1",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-18",
      "module": "volumetrics",
      "description_fa": "تخمین جرم از چگالی با نمایش صریح برچسب تخمینی و عدم استفاده برای جایگزینی وزن قانونی",
      "priority": "P1",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-19",
      "module": "fleet",
      "description_fa": "دریافت payload و چرخه ماشین‌آلات از کانکتورهای اختیاری",
      "priority": "P2",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-20",
      "module": "fleet",
      "description_fa": "تجمیع تولید و سفر به شیفت، ماده، مسیر، ماشین و پیمانکار",
      "priority": "P1",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-21",
      "module": "reports",
      "description_fa": "داشبورد زنده عملیات، KPI، هشدارها، فیلتر سایت/شیفت/ماده",
      "priority": "P0",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-22",
      "module": "reports",
      "description_fa": "خروجی CSV/XLSX/PDF و زمان‌بندی گزارش با مجوز دسترسی",
      "priority": "P1",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-23",
      "module": "integration",
      "description_fa": "کانکتورهای نسخه‌دار ERP/PLC/indicator و وب‌هوک",
      "priority": "P1",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-24",
      "module": "integration",
      "description_fa": "صف محلی رخداد و همگام‌سازی مقاوم در برابر قطع شبکه با idempotency",
      "priority": "P0",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-25",
      "module": "security",
      "description_fa": "RBAC، ثبت audit trail غیرقابل بازنویسی و تأیید دو نفره برای override پرریسک",
      "priority": "P0",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-26",
      "module": "security",
      "description_fa": "تشخیص مغایرت تصویر، پلاک، RFID و حمله تکرار رخداد",
      "priority": "P0",
      "evidence_status": "proposed"
    },
    {
      "id": "FR-27",
      "module": "security",
      "description_fa": "مدیریت چند سایت و تفکیک tenant / site داده‌ها",
      "priority": "P1",
      "evidence_status": "proposed"
    }
  ],
  "nonfunctional_requirements": [
    {
      "id": "NFR-01",
      "description_fa": "کنترل راهبند fail-safe؛ بدون وابستگی مستقیم به پاسخ سرور مرکزی",
      "evidence_status": "proposed"
    },
    {
      "id": "NFR-02",
      "description_fa": "تمام timestampها ذخیره UTC با timezone سایت و ساعت دستگاه ثبت شود",
      "evidence_status": "proposed"
    },
    {
      "id": "NFR-03",
      "description_fa": "هر رخداد شامل device_id، event_id یکتا، monotonic_sequence و source_quality",
      "evidence_status": "proposed"
    },
    {
      "id": "NFR-04",
      "description_fa": "اندازه‌گیری قانونی فقط با ابزار تأییدشده و رویه قانونی محلی؛ LiDAR سنجه مکمل است",
      "evidence_status": "proposed"
    },
    {
      "id": "NFR-05",
      "description_fa": "انتقال TLS، هویت دستگاه، رمزنگاری داده حساس و حداقل‌سازی PII",
      "evidence_status": "proposed"
    },
    {
      "id": "NFR-06",
      "description_fa": "پشتیبان‌گیری، بازیابی، ذخیره‌سازی شواهد قابل راستی‌آزمایی و retention policy",
      "evidence_status": "proposed"
    },
    {
      "id": "NFR-07",
      "description_fa": "API schema و قرارداد JSON نسخه‌دار؛ قابلیت تست قرارداد برای کانکتورها",
      "evidence_status": "proposed"
    },
    {
      "id": "NFR-08",
      "description_fa": "آستانه‌ها، latency، availability و خطای اندازه‌گیری باید در FAT/SAT تعیین و آزموده شوند",
      "evidence_status": "proposed"
    },
    {
      "id": "NFR-09",
      "description_fa": "در رابط فارسی، پشتیبانی RTL و اعداد/واحدهای استاندارد و دسترس‌پذیری صفحه",
      "evidence_status": "proposed"
    },
    {
      "id": "NFR-10",
      "description_fa": "پایش سلامت دستگاه و heartbeats و جداسازی خطای کانکتور از خطای ابزار",
      "evidence_status": "proposed"
    }
  ],
  "entities": {
    "Vehicle": {
      "fields": [
        {
          "name": "id",
          "type": "to_be_defined"
        },
        {
          "name": "plate_normalized",
          "type": "to_be_defined"
        },
        {
          "name": "plate_country",
          "type": "to_be_defined"
        },
        {
          "name": "vehicle_type",
          "type": "to_be_defined"
        },
        {
          "name": "axle_count",
          "type": "to_be_defined"
        },
        {
          "name": "capacity_kg",
          "type": "to_be_defined"
        },
        {
          "name": "rfid_tag_ids",
          "type": "to_be_defined"
        },
        {
          "name": "carrier_id",
          "type": "to_be_defined"
        },
        {
          "name": "active",
          "type": "to_be_defined"
        }
      ]
    },
    "Driver": {
      "fields": [
        {
          "name": "id",
          "type": "to_be_defined"
        },
        {
          "name": "name",
          "type": "to_be_defined"
        },
        {
          "name": "license_id",
          "type": "to_be_defined"
        },
        {
          "name": "carrier_id",
          "type": "to_be_defined"
        },
        {
          "name": "active",
          "type": "to_be_defined"
        }
      ]
    },
    "Carrier": {
      "fields": [
        {
          "name": "id",
          "type": "to_be_defined"
        },
        {
          "name": "legal_name",
          "type": "to_be_defined"
        },
        {
          "name": "tax_id",
          "type": "to_be_defined"
        },
        {
          "name": "contact",
          "type": "to_be_defined"
        }
      ]
    },
    "Customer": {
      "fields": [
        {
          "name": "id",
          "type": "to_be_defined"
        },
        {
          "name": "name",
          "type": "to_be_defined"
        },
        {
          "name": "customer_type",
          "type": "to_be_defined"
        },
        {
          "name": "erp_code",
          "type": "to_be_defined"
        }
      ]
    },
    "Material": {
      "fields": [
        {
          "name": "id",
          "type": "to_be_defined"
        },
        {
          "name": "name",
          "type": "to_be_defined"
        },
        {
          "name": "grade",
          "type": "to_be_defined"
        },
        {
          "name": "unit",
          "type": "to_be_defined"
        },
        {
          "name": "density_kg_m3",
          "type": "to_be_defined"
        },
        {
          "name": "density_reference",
          "type": "to_be_defined"
        },
        {
          "name": "density_uncertainty",
          "type": "to_be_defined"
        }
      ]
    },
    "Permit": {
      "fields": [
        {
          "name": "id",
          "type": "to_be_defined"
        },
        {
          "name": "permit_no",
          "type": "to_be_defined"
        },
        {
          "name": "permit_type",
          "type": "to_be_defined"
        },
        {
          "name": "vehicle_id",
          "type": "to_be_defined"
        },
        {
          "name": "carrier_id",
          "type": "to_be_defined"
        },
        {
          "name": "customer_id",
          "type": "to_be_defined"
        },
        {
          "name": "material_id",
          "type": "to_be_defined"
        },
        {
          "name": "origin_id",
          "type": "to_be_defined"
        },
        {
          "name": "destination_id",
          "type": "to_be_defined"
        },
        {
          "name": "valid_from",
          "type": "to_be_defined"
        },
        {
          "name": "valid_until",
          "type": "to_be_defined"
        },
        {
          "name": "authorized_kg",
          "type": "to_be_defined"
        },
        {
          "name": "remaining_kg",
          "type": "to_be_defined"
        },
        {
          "name": "status",
          "type": "to_be_defined"
        },
        {
          "name": "external_ref",
          "type": "to_be_defined"
        }
      ]
    },
    "Transaction": {
      "fields": [
        {
          "name": "id",
          "type": "to_be_defined"
        },
        {
          "name": "site_id",
          "type": "to_be_defined"
        },
        {
          "name": "vehicle_id",
          "type": "to_be_defined"
        },
        {
          "name": "driver_id",
          "type": "to_be_defined"
        },
        {
          "name": "carrier_id",
          "type": "to_be_defined"
        },
        {
          "name": "material_id",
          "type": "to_be_defined"
        },
        {
          "name": "permit_id",
          "type": "to_be_defined"
        },
        {
          "name": "origin_id",
          "type": "to_be_defined"
        },
        {
          "name": "destination_id",
          "type": "to_be_defined"
        },
        {
          "name": "status",
          "type": "to_be_defined"
        },
        {
          "name": "entry_at",
          "type": "to_be_defined"
        },
        {
          "name": "first_weigh_at",
          "type": "to_be_defined"
        },
        {
          "name": "loaded_at",
          "type": "to_be_defined"
        },
        {
          "name": "second_weigh_at",
          "type": "to_be_defined"
        },
        {
          "name": "exit_at",
          "type": "to_be_defined"
        },
        {
          "name": "gross_kg",
          "type": "to_be_defined"
        },
        {
          "name": "tare_kg",
          "type": "to_be_defined"
        },
        {
          "name": "net_kg",
          "type": "to_be_defined"
        },
        {
          "name": "volume_m3",
          "type": "to_be_defined"
        },
        {
          "name": "created_at",
          "type": "to_be_defined"
        },
        {
          "name": "finalized_at",
          "type": "to_be_defined"
        }
      ]
    },
    "WeighEvent": {
      "fields": [
        {
          "name": "id",
          "type": "to_be_defined"
        },
        {
          "name": "transaction_id",
          "type": "to_be_defined"
        },
        {
          "name": "scale_id",
          "type": "to_be_defined"
        },
        {
          "name": "kind",
          "type": "to_be_defined"
        },
        {
          "name": "weight_kg",
          "type": "to_be_defined"
        },
        {
          "name": "stable",
          "type": "to_be_defined"
        },
        {
          "name": "raw_message_ref",
          "type": "to_be_defined"
        },
        {
          "name": "captured_at",
          "type": "to_be_defined"
        },
        {
          "name": "photo_ids",
          "type": "to_be_defined"
        },
        {
          "name": "operator_id",
          "type": "to_be_defined"
        },
        {
          "name": "indicator_status",
          "type": "to_be_defined"
        }
      ]
    },
    "GateEvent": {
      "fields": [
        {
          "name": "id",
          "type": "to_be_defined"
        },
        {
          "name": "transaction_id",
          "type": "to_be_defined"
        },
        {
          "name": "gate_id",
          "type": "to_be_defined"
        },
        {
          "name": "event_type",
          "type": "to_be_defined"
        },
        {
          "name": "occurred_at",
          "type": "to_be_defined"
        },
        {
          "name": "barrier_state",
          "type": "to_be_defined"
        },
        {
          "name": "traffic_light_state",
          "type": "to_be_defined"
        }
      ]
    },
    "CameraPlateRead": {
      "fields": [
        {
          "name": "id",
          "type": "to_be_defined"
        },
        {
          "name": "camera_id",
          "type": "to_be_defined"
        },
        {
          "name": "transaction_id",
          "type": "to_be_defined"
        },
        {
          "name": "plate_raw",
          "type": "to_be_defined"
        },
        {
          "name": "plate_normalized",
          "type": "to_be_defined"
        },
        {
          "name": "confidence",
          "type": "to_be_defined"
        },
        {
          "name": "captured_at",
          "type": "to_be_defined"
        },
        {
          "name": "image_uri",
          "type": "to_be_defined"
        },
        {
          "name": "review_status",
          "type": "to_be_defined"
        }
      ]
    },
    "RFIDRead": {
      "fields": [
        {
          "name": "id",
          "type": "to_be_defined"
        },
        {
          "name": "reader_id",
          "type": "to_be_defined"
        },
        {
          "name": "transaction_id",
          "type": "to_be_defined"
        },
        {
          "name": "tag_uid",
          "type": "to_be_defined"
        },
        {
          "name": "antenna_id",
          "type": "to_be_defined"
        },
        {
          "name": "rssi",
          "type": "to_be_defined"
        },
        {
          "name": "captured_at",
          "type": "to_be_defined"
        }
      ]
    },
    "Scale": {
      "fields": [
        {
          "name": "id",
          "type": "to_be_defined"
        },
        {
          "name": "site_id",
          "type": "to_be_defined"
        },
        {
          "name": "indicator_model",
          "type": "to_be_defined"
        },
        {
          "name": "serial",
          "type": "to_be_defined"
        },
        {
          "name": "protocol_profile",
          "type": "to_be_defined"
        },
        {
          "name": "max_capacity_kg",
          "type": "to_be_defined"
        },
        {
          "name": "division_kg",
          "type": "to_be_defined"
        },
        {
          "name": "status",
          "type": "to_be_defined"
        },
        {
          "name": "calibration_due_at",
          "type": "to_be_defined"
        }
      ]
    },
    "CalibrationRecord": {
      "fields": [
        {
          "name": "id",
          "type": "to_be_defined"
        },
        {
          "name": "scale_id",
          "type": "to_be_defined"
        },
        {
          "name": "certificate_id",
          "type": "to_be_defined"
        },
        {
          "name": "certificate_uri",
          "type": "to_be_defined"
        },
        {
          "name": "issued_at",
          "type": "to_be_defined"
        },
        {
          "name": "expires_at",
          "type": "to_be_defined"
        },
        {
          "name": "result",
          "type": "to_be_defined"
        },
        {
          "name": "issuer",
          "type": "to_be_defined"
        },
        {
          "name": "test_points",
          "type": "to_be_defined"
        }
      ]
    },
    "Alert": {
      "fields": [
        {
          "name": "id",
          "type": "to_be_defined"
        },
        {
          "name": "site_id",
          "type": "to_be_defined"
        },
        {
          "name": "transaction_id",
          "type": "to_be_defined"
        },
        {
          "name": "rule_id",
          "type": "to_be_defined"
        },
        {
          "name": "severity",
          "type": "to_be_defined"
        },
        {
          "name": "threshold",
          "type": "to_be_defined"
        },
        {
          "name": "observed_value",
          "type": "to_be_defined"
        },
        {
          "name": "occurred_at",
          "type": "to_be_defined"
        },
        {
          "name": "status",
          "type": "to_be_defined"
        },
        {
          "name": "acknowledged_by",
          "type": "to_be_defined"
        },
        {
          "name": "resolved_at",
          "type": "to_be_defined"
        }
      ]
    },
    "Shift": {
      "fields": [
        {
          "name": "id",
          "type": "to_be_defined"
        },
        {
          "name": "site_id",
          "type": "to_be_defined"
        },
        {
          "name": "start_at",
          "type": "to_be_defined"
        },
        {
          "name": "end_at",
          "type": "to_be_defined"
        },
        {
          "name": "shift_name",
          "type": "to_be_defined"
        },
        {
          "name": "supervisor_id",
          "type": "to_be_defined"
        }
      ]
    },
    "Equipment": {
      "fields": [
        {
          "name": "id",
          "type": "to_be_defined"
        },
        {
          "name": "site_id",
          "type": "to_be_defined"
        },
        {
          "name": "equipment_type",
          "type": "to_be_defined"
        },
        {
          "name": "fleet_id",
          "type": "to_be_defined"
        },
        {
          "name": "telematics_source",
          "type": "to_be_defined"
        },
        {
          "name": "status",
          "type": "to_be_defined"
        }
      ]
    },
    "LidarScan": {
      "fields": [
        {
          "name": "id",
          "type": "to_be_defined"
        },
        {
          "name": "transaction_id",
          "type": "to_be_defined"
        },
        {
          "name": "scanner_id",
          "type": "to_be_defined"
        },
        {
          "name": "scan_type",
          "type": "to_be_defined"
        },
        {
          "name": "pointcloud_uri",
          "type": "to_be_defined"
        },
        {
          "name": "surface_model_uri",
          "type": "to_be_defined"
        },
        {
          "name": "volume_m3",
          "type": "to_be_defined"
        },
        {
          "name": "quality_score",
          "type": "to_be_defined"
        },
        {
          "name": "uncertainty_m3",
          "type": "to_be_defined"
        },
        {
          "name": "captured_at",
          "type": "to_be_defined"
        },
        {
          "name": "empty_scan_id",
          "type": "to_be_defined"
        }
      ]
    },
    "PayloadEvent": {
      "fields": [
        {
          "name": "id",
          "type": "to_be_defined"
        },
        {
          "name": "equipment_id",
          "type": "to_be_defined"
        },
        {
          "name": "transaction_id",
          "type": "to_be_defined"
        },
        {
          "name": "payload_kg",
          "type": "to_be_defined"
        },
        {
          "name": "source_system",
          "type": "to_be_defined"
        },
        {
          "name": "quality",
          "type": "to_be_defined"
        },
        {
          "name": "occurred_at",
          "type": "to_be_defined"
        }
      ]
    },
    "Site": {
      "fields": [
        {
          "name": "id",
          "type": "to_be_defined"
        },
        {
          "name": "name",
          "type": "to_be_defined"
        },
        {
          "name": "timezone",
          "type": "to_be_defined"
        },
        {
          "name": "location_code",
          "type": "to_be_defined"
        }
      ]
    },
    "Device": {
      "fields": [
        {
          "name": "id",
          "type": "to_be_defined"
        },
        {
          "name": "site_id",
          "type": "to_be_defined"
        },
        {
          "name": "type",
          "type": "to_be_defined"
        },
        {
          "name": "protocol",
          "type": "to_be_defined"
        },
        {
          "name": "firmware",
          "type": "to_be_defined"
        },
        {
          "name": "last_seen_at",
          "type": "to_be_defined"
        },
        {
          "name": "health_status",
          "type": "to_be_defined"
        }
      ]
    },
    "AuditLog": {
      "fields": [
        {
          "name": "id",
          "type": "to_be_defined"
        },
        {
          "name": "actor_id",
          "type": "to_be_defined"
        },
        {
          "name": "action",
          "type": "to_be_defined"
        },
        {
          "name": "entity_type",
          "type": "to_be_defined"
        },
        {
          "name": "entity_id",
          "type": "to_be_defined"
        },
        {
          "name": "before_hash",
          "type": "to_be_defined"
        },
        {
          "name": "after_hash",
          "type": "to_be_defined"
        },
        {
          "name": "timestamp",
          "type": "to_be_defined"
        },
        {
          "name": "reason",
          "type": "to_be_defined"
        },
        {
          "name": "correlation_id",
          "type": "to_be_defined"
        }
      ]
    }
  },
  "alert_rules": [
    {
      "id": "AL-01",
      "code": "expired_permit",
      "condition_expression": "permit.valid_until < now or permit.status != ACTIVE",
      "action": "BLOCK_EXIT",
      "severity": "critical",
      "thresholds": "site_configurable_or_device_based",
      "evidence_status": "proposed"
    },
    {
      "id": "AL-02",
      "code": "overweight",
      "condition_expression": "transaction.gross_kg > min(vehicle.capacity_kg,permit.authorized_kg) when values exist",
      "action": "HOLD_REVIEW",
      "severity": "critical",
      "thresholds": "site_configurable_or_device_based",
      "evidence_status": "proposed"
    },
    {
      "id": "AL-03",
      "code": "identity_conflict",
      "condition_expression": "normalized_ANPR_plate != vehicle.plate_normalized matched_by_RFID",
      "action": "HOLD_REVIEW",
      "severity": "high",
      "thresholds": "site_configurable_or_device_based",
      "evidence_status": "proposed"
    },
    {
      "id": "AL-04",
      "code": "invalid_calibration",
      "condition_expression": "scale.calibration_due_at < now or certificate.result != PASS",
      "action": "DISABLE_AUTOMATIC_FINALIZATION",
      "severity": "critical",
      "thresholds": "site_configurable_or_device_based",
      "evidence_status": "proposed"
    },
    {
      "id": "AL-05",
      "code": "unstable_scale",
      "condition_expression": "indicator.stable != true",
      "action": "RETRY_AND_DO_NOT_CAPTURE",
      "severity": "high",
      "thresholds": "site_configurable_or_device_based",
      "evidence_status": "proposed"
    },
    {
      "id": "AL-06",
      "code": "zero_drift",
      "condition_expression": "abs(current_zero-reference_zero) > config.zero_tolerance_kg",
      "action": "FLAG_SCALE",
      "severity": "high",
      "thresholds": "site_configurable_or_device_based",
      "evidence_status": "proposed"
    },
    {
      "id": "AL-07",
      "code": "bad_position",
      "condition_expression": "position_sensor != fully_on_scale",
      "action": "BLOCK_CAPTURE",
      "severity": "high",
      "thresholds": "site_configurable_or_device_based",
      "evidence_status": "proposed"
    },
    {
      "id": "AL-08",
      "code": "multiple_open_transactions",
      "condition_expression": "active_transactions_for_vehicle > 1",
      "action": "HOLD_REVIEW",
      "severity": "high",
      "thresholds": "site_configurable_or_device_based",
      "evidence_status": "proposed"
    },
    {
      "id": "AL-09",
      "code": "scan_mismatch",
      "condition_expression": "empty_scan.vehicle_id != loaded_scan.vehicle_id",
      "action": "REJECT_VOLUME_PAIR",
      "severity": "high",
      "thresholds": "site_configurable_or_device_based",
      "evidence_status": "proposed"
    },
    {
      "id": "AL-10",
      "code": "volume_mass_outlier",
      "condition_expression": "abs(net_kg - volume_m3*density_kg_m3) > config.mass_volume_tolerance_kg",
      "action": "REVIEW",
      "severity": "medium",
      "thresholds": "site_configurable_or_device_based",
      "evidence_status": "proposed"
    },
    {
      "id": "AL-11",
      "code": "scan_quality",
      "condition_expression": "scan.quality_score < config.min_scan_quality",
      "action": "REPEAT_SCAN",
      "severity": "medium",
      "thresholds": "site_configurable_or_device_based",
      "evidence_status": "proposed"
    },
    {
      "id": "AL-12",
      "code": "no_heartbeat",
      "condition_expression": "now - device.last_seen_at > config.heartbeat_timeout_s",
      "action": "DEGRADED_MODE",
      "severity": "high",
      "thresholds": "site_configurable_or_device_based",
      "evidence_status": "proposed"
    },
    {
      "id": "AL-13",
      "code": "long_turnaround",
      "condition_expression": "exit_at-entry_at > config.turnaround_threshold_s",
      "action": "NOTIFY",
      "severity": "medium",
      "thresholds": "site_configurable_or_device_based",
      "evidence_status": "proposed"
    },
    {
      "id": "AL-14",
      "code": "overload_ratio",
      "condition_expression": "payload_kg > config.nominal_payload_kg",
      "action": "REVIEW",
      "severity": "high",
      "thresholds": "site_configurable_or_device_based",
      "evidence_status": "proposed"
    }
  ],
  "workflow_states": [
    "EXPECTED",
    "GATE_IN_PENDING",
    "IDENTIFIED",
    "ENTRY_APPROVED",
    "FIRST_WEIGHED",
    "LOADING",
    "SECOND_WEIGHED",
    "VALIDATING",
    "EXIT_APPROVED",
    "CLOSED",
    "ON_HOLD",
    "REJECTED",
    "CANCELLED"
  ],
  "plugin_contract": [
    "initialize",
    "health",
    "consume_event",
    "emit_event",
    "get_config_schema"
  ],
  "open_decisions": [
    "indicator protocol",
    "RFID specifications",
    "ERP schema",
    "legal metrology",
    "scanner specifications",
    "FAT/SAT acceptance thresholds"
  ]
}
```
