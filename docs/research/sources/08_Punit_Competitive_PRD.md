# سند تحلیل رقابتی و مشخصات محصول سامانه یکپارچه توزین و تردد معدنی
**نسخه:** 0.9 (شواهد عمومی محدود) | **تاریخ ارزیابی:** ۲۵ اکتبر ۲۰۲۶ | **مرجع اصلی:** Punit Instruments | **زبان:** فارسی
**راهنمای شواهد:** «ت» = تأییدشده صریح در منبع؛ «ا» = استنباطی از تصویر؛ «پ» = پیشنهاد طراحی ما؛ «؟» = نامشخص. هیچ «؟» به معنی «ندارد» نیست. هر ارجاع `[P]` و مانند آن به فهرست URLهای بخش ۲ برمی‌گردد.
## ۱. خلاصه اجرایی
1. صفحه Punit مجموعه‌ای از چند بسته نرم‌افزاری است، نه اثبات یک محصول یکپارچه با همه امکانات. [P]
2. RFID، اتصال ANPR/CCTV/راهبند، وزن اول و دوم، ثبت تصاویر توزین، رسید، گزارش و ارتباط ERP در توصیف بسته‌ها آمده‌اند. [P]
3. درج عبارت ANPR در «Integration» به‌تنهایی دقت OCR، مدل دوربین، یا جریان تأیید پلاک را ثابت نمی‌کند. [P]
4. Punit برای بسته WhatsApp، RS232، SQL Server/Access/Oracle، ارسال PDF، ایمیل/SMS، audit و دسترسی گزارش را شرح می‌دهد. [P]
5. جزئیات فرکانس و برد RFID متعلق به Punit، کنترل واقعی PLC، پروتکل API و تشخیص سلامت لودسل در منبع اصلی مشخص نیستند. [P]
6. SmarTower مرجع مشخص‌تری برای RFID UHF، حسگر موقعیت، راهبند اختیاری و راهنمای صوتی/نمایشگر است. [T][TPDF]
7. Weighman 8 شواهدی برای فعالیت بدون اپراتور، چندسایتی، صورتحساب، ANPR و SQL Server دارد. [A]
8. تشخیص drift و عدم‌تقارن لودسل را باید از لایه سخت‌افزار دارای diagnostics گرفت؛ TraxEMT و iQUBE² مرجع‌اند. [M][R]
9. اسکن حجم واقعی و پروفایل سه‌بعدی در Loadscan LVS/MPS/MyScanner مستند است، نه در Punit. [L][LM][LC]
10. KPI چرخه، payload، صف و تولید از دامنه FMS مانند Cat MineStar الهام می‌گیرد. [C][CE]
11. معماری هدف توصیه‌شده: هسته Event-driven محلی + همگام‌سازی اختیاری + ماژول‌های الحاقی. [پ]
12. تمامی الزام‌ها و آستانه‌های فاقد شواهد فروشنده در این سند به‌وضوح «پیشنهادی» هستند. [پ]
## ۲. فهرست منابع بررسی‌شده، URLهای قابل بازیابی و محدودیت خزش
- **[P]** https://www.punitinstruments.com/weighbridge-software.html
- **[A]** https://www.averyweigh-tronix.com/en/product/weighman-8-weighbridge-software/
- **[T]** https://www.averyweigh-tronix.com/en/product/smartower-unmanned-weighbridge-system/
- **[TPDF]** https://www.averyweigh-tronix.com/en/wp-content/uploads/sites/11/2025/08/SmarTower_UK_spec.pdf
- **[W]** https://www.linkedin.com/products/endel-digital-solutions-weighmast-weighbridge-software/
- **[D]** https://easterncapeindustrialnews.co.za/software-suite-takes-the-weight-off-logistics-operations/
- **[R]** https://www.ricelake.com/products/iqube2-digital-diagnostic-junction-box?part=93243
- **[M]** https://www.mt.com/dam/ind/IND_PDF/2024/IND780-downloads/others/IND560PDX-and-IND780_MAN_30137756_R00_TraxEMT_AppGuide_EN.pdf
- **[L]** https://www.loadscan.com/load-volume-scanner/
- **[LM]** https://www.loadscan.com/mine-payload-scanner/
- **[LC]** https://www.loadscan.com/myscanner/
- **[LA]** https://www.loadscan.com/myscanner/alerts/
- **[LX]** https://www.loadscan.com/service-agreement/
- **[LE]** https://www.loadscan.com/myscanner-dashboard-update/
- **[C]** https://www.cat.com/en_US/by-industry/mining/surface-mining/surface-technology/fleet.html
- **[CE]** https://www.cat.com/en_US/by-industry/mining/surface-mining/surface-technology/edge-western-states.html
- `https://www.punitinstruments.com/robots.txt` — درخواست انجام شد، دسترسی/بازیابی ناموفق؛ `sitemap.xml` همین دامنه نیز قابل بازیابی نبود. **خزش کامل و اثبات پوشش تمام URLها انجام نشده است.**
- صفحه Punit بخش‌های «Weighbridge Entry»، «Mechanical»، «Whatsapp»، «Cctv»، «Rfid» و «Chemical Batching» را در همان URL نشان می‌دهد. تصاویر از لینک‌های واسط `5.imimg.com` متصل به صفحه‌اند؛ بروشورهای پشت دکمه «Product Brochure» به‌طور مستقل بازیابی نشدند. [P]
- منابع مقایسه‌ای Precia Molen TruckFlow، Trimble LOADRITE InsightHQ/LR360، Wenco، Hexagon MineOps و Modular Mining DISPATCH در این دور منابع فنی کافی و مستقلاً راستی‌آزمایی‌شده ندارند؛ **تمام خانه‌های این شرکت‌ها «نامشخص»** است. ادعای فقدان محصول مجاز نیست.
- WBX / Dariel: مقاله صنعتی مستقل [D]؛ WeighMAST: صفحه معرفی LinkedIn [W] (سطح اتکا پایین‌تر از سند رسمی فنی).
### ۲.۱ ریزشواهد Punit به تفکیک بسته
| بسته | نکات صریح و قابل اتکا | سطح |
|---|---|---|
| Entry | گزارش سفرهای کامل/ناقص؛ چندکاربره؛ چاپ رسید پنج حالت، چاپ عکس و چاپ فاکتور؛ احراز هویت چاپ مجدد | ت [P] |
| Mechanical | یک باسکول؛ حالت تک/دوبار توزین؛ API ادعا نشده؛ امکان Integration با RFID/ANPR/CCTV/ERP/راهبند در جدول مشخصات | ت [P] |
| WhatsApp | ارسال PDF، SMS، ایمیل؛ RS232 و چند COM؛ SQL Server/Access/Oracle؛ audit تغییرات؛ تارا دستی/ثبت‌شده؛ backup؛ Export CSV/Excel/Text؛ اتصال ERP به سفارش مشتری | ت [P] |
| CCTV | ثبت عکس با شماره قبض، تاریخ/زمان، نوبت وزن اول/دوم؛ مشاهده تاریخی تصاویر؛ دوربین‌های IP و تا چهار دوربین (طبق توصیف بسته) | ت [P] |
| RFID | شناسایی وسیله و وزن‌گیری؛ گزارش کامیون/تاریخ؛ فرکانس/برد/آنتن نامشخص | ت [P] |
### ۲.۲ تحلیل تصویر UI و رسانه
- **تصویر P-UI-01**، نرم‌افزار «Weighment Entry - RFID»، لینک مستقیم: https://5.imimg.com/data5/SELLER/Default/2025/8/540119614/KQ/YZ/LL/1505882/rfid-weighbridge-software-1000x1000.png ؛ مشاهده: عنوان آبی، پنل وزن دیجیتال، Gross/Tare/Net، شماره قبض، زمان دو نوبت، کارت و کامیون و محصول، دکمه First/Second و نوار وضعیت COM؛ **تأیید دیداری/استنباطی**. متن تصویر برخی مقادیر تاریخی است و شاهد عملکرد امروز یا دقت نیست.
- **تصویر P-UI-02**، https://5.imimg.com/data5/SELLER/Default/2024/9/454300350/XK/CO/AH/1505882/whatsapp-weighbridge-software-125x125.png ؛ دو قاب دوربین در سمت راست و فرم ورود در چپ؛ نسخه ۱۲۵ پیکسلی و برای قرائت جزییات ناکافی؛ **استنباطی**.
- **تصویر P-UI-03**، https://5.imimg.com/data5/SELLER/Default/2024/9/454295360/RZ/KU/UO/1505882/weighbridge-software-125x125.png ؛ فرم قدیمی ورود وزن و فیلدهای انتخاب؛ رزولوشن ناکافی؛ **استنباطی**.
- **تصویر T-01**، بروشور SmarTower صفحه ۱ [TPDF]: کابین بلند فلزی با نمایشگر/ترمینال راننده؛ این عکس نمای سخت‌افزار است نه تصویر نرم‌افزار.
- **MyScanner** [LC][LE]: متن رسمی ساختار Dashboard هشدار/فعالیت اسکنر، Measurements، 3D Profiler، نمودار روند و سابقه را تأیید می‌کند؛ **چیدمان پیکسلی یا پالت دقیق** از آن استنتاج نشده است.
- **ویدیوها:** ویدیوی عملیاتی قابل بازبینی و تایم‌کددار از Punit در این بررسی در دسترس نبود؛ فلوهای بخش ۵ طراحی پیشنهادی هستند، نه رونویسی نمایش محصول.
## ۳. ماتریس رقابتی و ویژگی‌های هسته
**معنا:** `دارد[منبع]` = تأیید صریح؛ `نامشخص` = هیچ مدرک قاطع بررسی‌شده؛ `ندارد` فقط با سند نفی صریح مجاز است و در جدول حاضر استفاده نشده. تعریف «هسته» صرفاً ≥۳ محصول مستقل با سند است.
| ویژگی | Punit | Weighman8 | SmarTower | WeighMAST | Dariel WBX | RiceLake iQUBE2 | MT TraxEMT | Loadscan LVS/MPS | MyScanner | Cat MineStar | Precia TruckFlow | Trimble Loadrite | Wenco | Hexagon MineOps | Modular DISPATCH | ≥۳ شاهد؟ |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RFID | دارد[P] | دارد[A] | دارد[T] | دارد[W] | نامشخص | نامشخص | نامشخص | دارد[L] | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | **هسته** |
| ANPR | دارد[P] | دارد[A] | دارد[TPDF] | دارد[W] | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | **هسته** |
| CCTV/عکس وزن | دارد[P] | دارد[A] | دارد[T] | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | **هسته** |
| راهبند/کنترل دسترسی | دارد[P] | دارد[A] | دارد[T] | دارد[W] | دارد[D] | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | **هسته** |
| وزن اول/دوم | دارد[P] | دارد[A] | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | خیر |
| تارای ثبت‌شده | دارد[P] | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | خیر |
| فاکتور/ERP | دارد[P] | دارد[A] | دارد[TPDF] | نامشخص | دارد[D] | نامشخص | نامشخص | دارد[LX] | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | **هسته** |
| گزارش تحلیلی | دارد[P] | دارد[A] | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | دارد[LC] | دارد[C] | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | **هسته** |
| گزارش/هشدار زمان‌بندی‌شده | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | دارد[LA] | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | خیر |
| دستگاه بدون اپراتور | دارد[P] | دارد[A] | دارد[T] | دارد[W] | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | **هسته** |
| Audit trail | دارد[P] | دارد[A] | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | خیر |
| پایش سلول وزن/Drift | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | دارد[R] | دارد[M] | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | خیر |
| پروفایل حجم سه‌بعدی | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | دارد[L] | دارد[LC] | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | خیر |
| KPI چرخه/بار مفید | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | دارد[C] | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | خیر |
| ارسال WhatsApp/SMS | دارد[P] | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | خیر |
| پایش چندسایتی | نامشخص | دارد[A] | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | خیر |
| ثبت زمان ورود/خروج | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | دارد[LM] | نامشخص | دارد[C] | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | خیر |
| مجوز/سفارش فروش | نامشخص | نامشخص | نامشخص | نامشخص | دارد[D] | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | خیر |
| کنترل موقعیت روی باسکول | نامشخص | نامشخص | دارد[T] | دارد[W] | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | نامشخص | خیر |
**احتیاط:** مقایسه میان Punit (نرم‌افزار باسکول)، iQUBE² (الکترونیک تشخیص خطا)، Loadscan (اسکنر حجم) و MineStar (FMS) مقایسه محصولات هم‌رده نیست. قابلیت مستند یک محصول، به معنای عملکرد مستقل تمام چرخه در همان محصول نیست.
### تفاوت‌های برجسته
- Punit: قبض تصویری، ارسال WhatsApp و انعطاف اتصال چند COM و پایگاه داده [P].
- SmarTower: UHF RFID + راهنمای صوتی و نمایشگر + حسگرهای موقعیت + راهبند اختیاری [TPDF، صفحه ۱].
- Rice Lake/MT: diagnostics در سطح سخت‌افزار برای شرایط نامتقارن، drift و load cell [R][M].
- Loadscan: پروفایل سه‌بعدی هر بار و اندازه‌گیری حجم مستقل از وزن [L][LM][LC].
- Cat MineStar: چرخه، بار مفید، مسیر، انتظار، و تخصیص تجهیز در سطح معدن [C].
## ۴. PRD: مسئله، نقش‌ها و الزامات
**دامنه محصول پیشنهادی:** MineGate Weigh (نام موقت داخلی؛ بدون وابستگی برند)، سامانه ثبت و راستی‌آزمایی عبور و وزن محموله در معدن، نه جایگزین ابزار توزین قانونی. **اولویت‌بندی طراحی ما است.**
### نقش‌ها و داستان‌های کاربر
- **US-01 / مدیر سامانه (Admin):** به‌عنوان مدیر سامانه (Admin) می‌خواهم فقط اطلاعات و اقدام‌های مرتبط با نقش خود را ببینم و نتیجه در تاریخچه غیرقابل‌حذف ثبت شود. [پ]
- **US-02 / اپراتور باسکول (Scale Operator):** به‌عنوان اپراتور باسکول (Scale Operator) می‌خواهم فقط اطلاعات و اقدام‌های مرتبط با نقش خود را ببینم و نتیجه در تاریخچه غیرقابل‌حذف ثبت شود. [پ]
- **US-03 / نگهبان دروازه (Gate Officer):** به‌عنوان نگهبان دروازه (Gate Officer) می‌خواهم فقط اطلاعات و اقدام‌های مرتبط با نقش خود را ببینم و نتیجه در تاریخچه غیرقابل‌حذف ثبت شود. [پ]
- **US-04 / سرپرست شیفت (Shift Supervisor):** به‌عنوان سرپرست شیفت (Shift Supervisor) می‌خواهم فقط اطلاعات و اقدام‌های مرتبط با نقش خود را ببینم و نتیجه در تاریخچه غیرقابل‌حذف ثبت شود. [پ]
- **US-05 / مدیر تولید (Production Manager):** به‌عنوان مدیر تولید (Production Manager) می‌خواهم فقط اطلاعات و اقدام‌های مرتبط با نقش خود را ببینم و نتیجه در تاریخچه غیرقابل‌حذف ثبت شود. [پ]
- **US-06 / مالی/فروش (Commercial):** به‌عنوان مالی/فروش (Commercial) می‌خواهم فقط اطلاعات و اقدام‌های مرتبط با نقش خود را ببینم و نتیجه در تاریخچه غیرقابل‌حذف ثبت شود. [پ]
- **US-07 / کارشناس تعمیرات و کالیبراسیون (Maintenance):** به‌عنوان کارشناس تعمیرات و کالیبراسیون (Maintenance) می‌خواهم فقط اطلاعات و اقدام‌های مرتبط با نقش خود را ببینم و نتیجه در تاریخچه غیرقابل‌حذف ثبت شود. [پ]
- **US-08 / ممیز (Auditor):** به‌عنوان ممیز (Auditor) می‌خواهم فقط اطلاعات و اقدام‌های مرتبط با نقش خود را ببینم و نتیجه در تاریخچه غیرقابل‌حذف ثبت شود. [پ]
- **US-09 / راننده در کیوسک (Driver/Kiosk):** به‌عنوان راننده در کیوسک (Driver/Kiosk) می‌خواهم فقط اطلاعات و اقدام‌های مرتبط با نقش خود را ببینم و نتیجه در تاریخچه غیرقابل‌حذف ثبت شود. [پ]
- **US-10 / سرویس یکپارچه‌سازی (Service Account):** به‌عنوان سرویس یکپارچه‌سازی (Service Account) می‌خواهم فقط اطلاعات و اقدام‌های مرتبط با نقش خود را ببینم و نتیجه در تاریخچه غیرقابل‌حذف ثبت شود. [پ]
### الزامات کارکردی (FR)
| کد | الزام و معیار پذیرش خلاصه | اولویت | مبنا | وضعیت |
|---|---|---|---|---|
| FR-01 | ثبت Master Data کامیون/پلاک/تگ/راننده/شرکت/ماده/سایت و جلوگیری از شناسه تکراری؛ ثبت نتیجه آزمون پذیرش برای سناریوی مثبت و منفی | P0 | P | پیشنهادی (حتی اگر قابلیت مشابه در منبع باشد) |
| FR-02 | ثبت GateEvent و تطبیق RFID، پلاک OCR و شناسه وسیله؛ حالت عدم‌قطعیت/بازبینی دستی؛ ثبت نتیجه آزمون پذیرش برای سناریوی مثبت و منفی | P0 | P,A,T | پیشنهادی (حتی اگر قابلیت مشابه در منبع باشد) |
| FR-03 | تطبیق وضعیت مجوز/سقف مجاز/سفارش و قفل ورود یا خروج هنگام عدم‌انطباق؛ ثبت نتیجه آزمون پذیرش برای سناریوی مثبت و منفی | P0 | D | پیشنهادی (حتی اگر قابلیت مشابه در منبع باشد) |
| FR-04 | دریافت وزن پایدار از indicator و ذخیره payload خام، زمان، شناسه دستگاه، کیفیت و واحد؛ ثبت نتیجه آزمون پذیرش برای سناریوی مثبت و منفی | P0 | P | پیشنهادی (حتی اگر قابلیت مشابه در منبع باشد) |
| FR-05 | حفظ وزن اول/دوم، محاسبه ناخالص/تارا/خالص مستقل از ترتیب باسکول، و جلوگیری از اشتباه در وضعیت؛ ثبت نتیجه آزمون پذیرش برای سناریوی مثبت و منفی | P0 | P | پیشنهادی (حتی اگر قابلیت مشابه در منبع باشد) |
| FR-06 | ثبت عکس وزن اول و دوم و اتصال تغییرناپذیر به رخداد؛ ثبت نتیجه آزمون پذیرش برای سناریوی مثبت و منفی | P0 | P,T | پیشنهادی (حتی اگر قابلیت مشابه در منبع باشد) |
| FR-07 | صدور قبض دارای شماره یکتا/QR و نسخه‌گذاری چاپ مجدد؛ ثبت نتیجه آزمون پذیرش برای سناریوی مثبت و منفی | P0 | P | پیشنهادی (حتی اگر قابلیت مشابه در منبع باشد) |
| FR-08 | تأیید حضور کامل وسیله و وزن پایدار پیش از ثبت؛ ثبت نتیجه آزمون پذیرش برای سناریوی مثبت و منفی | P0 | TPDF | پیشنهادی (حتی اگر قابلیت مشابه در منبع باشد) |
| FR-09 | ثبت ورود/خروج، turnaround و صف با زمان مرجع قابل رهگیری؛ ثبت نتیجه آزمون پذیرش برای سناریوی مثبت و منفی | P0 | LM | پیشنهادی (حتی اگر قابلیت مشابه در منبع باشد) |
| FR-10 | صف اپراتوری رویدادهای باز، ناقص و مشکوک همراه دلیل و تأیید دو مرحله‌ای؛ ثبت نتیجه آزمون پذیرش برای سناریوی مثبت و منفی | P0 | P | پیشنهادی (حتی اگر قابلیت مشابه در منبع باشد) |
| FR-11 | کنترل چراغ/راهبند با PLC/IO و interlock ایمنی مستقل از UI؛ ثبت نتیجه آزمون پذیرش برای سناریوی مثبت و منفی | P1 | T | پیشنهادی (حتی اگر قابلیت مشابه در منبع باشد) |
| FR-12 | محاسبه تولید، تعداد سفر، شیفت، توزیع مواد، بهره‌برداری مبتنی بر Event؛ ثبت نتیجه آزمون پذیرش برای سناریوی مثبت و منفی | P1 | C,CE | پیشنهادی (حتی اگر قابلیت مشابه در منبع باشد) |
| FR-13 | اتصال ERP و انتقال کنترل‌شده قبض/تحویل/سفارش، با retry و reconciliation؛ ثبت نتیجه آزمون پذیرش برای سناریوی مثبت و منفی | P1 | P,A | پیشنهادی (حتی اگر قابلیت مشابه در منبع باشد) |
| FR-14 | اخطار سخت‌افزار توزین، drift، unbalanced، انقضای CalibrationRecord؛ ثبت نتیجه آزمون پذیرش برای سناریوی مثبت و منفی | P1 | R,M | پیشنهادی (حتی اگر قابلیت مشابه در منبع باشد) |
| FR-15 | ارسال ایمیل/SMS/WhatsApp و گزارش PDF/Excel/CSV با مجوز دسترسی؛ ثبت نتیجه آزمون پذیرش برای سناریوی مثبت و منفی | P1 | P | پیشنهادی (حتی اگر قابلیت مشابه در منبع باشد) |
| FR-16 | مدیریت کاربر، RBAC، AuditEvent append-only، سیاست اصلاح به‌جای حذف؛ ثبت نتیجه آزمون پذیرش برای سناریوی مثبت و منفی | P0 | P,A | پیشنهادی (حتی اگر قابلیت مشابه در منبع باشد) |
| FR-17 | تعریف چند باسکول، چند سایت، تنظیم جهت تردد و routing؛ ثبت نتیجه آزمون پذیرش برای سناریوی مثبت و منفی | P1 | A,TPDF | پیشنهادی (حتی اگر قابلیت مشابه در منبع باشد) |
| FR-18 | صف آفلاین و sync مقاوم به تکرار با conflict resolution؛ ثبت نتیجه آزمون پذیرش برای سناریوی مثبت و منفی | P1 | پ | پیشنهادی (حتی اگر قابلیت مشابه در منبع باشد) |
| FR-19 | افزونه LiDAR: اسکن خالی/پر، حجم تفاضلی، مشخصه بار و density با uncertainty؛ ثبت نتیجه آزمون پذیرش برای سناریوی مثبت و منفی | P2 | L,LM | پیشنهادی (حتی اگر قابلیت مشابه در منبع باشد) |
| FR-20 | افزونه PayloadEvent از شاول/لودر و FMS و تطبیق بار مفید با باسکول؛ ثبت نتیجه آزمون پذیرش برای سناریوی مثبت و منفی | P2 | C | پیشنهادی (حتی اگر قابلیت مشابه در منبع باشد) |
| FR-21 | سامانه پیکربندی آستانه هشدار و گردش کار acknowledge/resolve؛ ثبت نتیجه آزمون پذیرش برای سناریوی مثبت و منفی | P1 | R,LC | پیشنهادی (حتی اگر قابلیت مشابه در منبع باشد) |
| FR-22 | API و webhook نسخه‌دار با idempotency key و service account؛ ثبت نتیجه آزمون پذیرش برای سناریوی مثبت و منفی | P1 | LX | پیشنهادی (حتی اگر قابلیت مشابه در منبع باشد) |
| FR-23 | عملیات توزین یک‌مرحله‌ای با تارا ثبت‌شده و پرچم ریسک؛ ثبت نتیجه آزمون پذیرش برای سناریوی مثبت و منفی | P1 | P | پیشنهادی (حتی اگر قابلیت مشابه در منبع باشد) |
| FR-24 | تعریف و گزارش قیود حجمی و وزنی بر مبنای قرارداد/حواله؛ ثبت نتیجه آزمون پذیرش برای سناریوی مثبت و منفی | P1 | پ | پیشنهادی (حتی اگر قابلیت مشابه در منبع باشد) |
### الزامات غیرکارکردی (NFR) — همه پیشنهادی
- **NFR-01** زمان پاسخ UI و latency سنجش باید در آزمایش میدانی با SLA کارفرما تعیین و اندازه‌گیری شود؛ عدد ثابت بدون داده تعیین نمی‌شود.
- **NFR-02** در دسترس بودن سایت، RTO و RPO و retention تصویر با کارفرما قراردادی شوند.
- **NFR-03** تمام زمان‌ها UTC ذخیره و با timezone سایت نمایش داده شوند؛ clock sync در edge و server مانیتور شود.
- **NFR-04** TLS، encryption-at-rest، secret management و دسترسی least privilege اعمال شوند.
- **NFR-05** رخداد تراکنش بدون حذف فیزیکی و با شناسه version، دلیل اصلاح و امضای نقش مجاز نگهداری شود.
- **NFR-06** پروتکل وزن‌خوانی raw frame و parsing version در لاگ ثبت و از عملگرهای قانونی کالیبراسیون جدا بماند.
- **NFR-07** بازپخش امن رویدادها، تضمین at-least-once delivery همراه پردازش idempotent.
- **NFR-08** حفظ دسترس‌پذیری کنترل ایمنی PLC حتی هنگام خرابی سرور یا شبکه؛ حالت امن تجهیزات توسط HAZOP تعیین شود.
- **NFR-09** پشتیبانی فارسی RTL و انگلیسی، جلالی در نمایش، اعداد/واحد استاندارد در داده.
- **NFR-10** قابلیت تست با simulator تجهیزات و test harness برای failure scenarios.
- **NFR-11** ثبت نسخه مدل ANPR و confidence؛ بازبینی دستی پلاک‌های کم‌اطمینان.
- **NFR-12** هیچ مقدار حجمی تبدیل‌شده به جرم به عنوان وزن قانونی یا اندازه‌گیری تأییدشده معرفی نشود.
## ۵. جریان‌های کاری اصلی، حالت‌ها و استثناها
- **۱. اعلام سفر/پیش‌ثبت:** ERP/مجوز، خودرو، راننده، ماده، مبدأ، مقصد، بازه اعتبار → TripPlan یا Transaction با وضعیت EXPECTED. [پ؛ الگوهای مستند P، T، D]
- **۲. ورود:** GateEvent ورودی با timestamp؛ RFIDRead و PlateRead خام؛ match چندمنبعی؛ اگر تعارض → REVIEW_REQUIRED و راهبند در حالت ایمن. [پ؛ الگوهای مستند P، T، D]
- **۳. کنترل مجوز:** بررسی امضا/اعتبار/سهمیه/نوع ماده/مبدأ/مقصد/راننده/پلاک؛ رزرو مقدار مجاز با قفل تراکنشی. [پ؛ الگوهای مستند P، T، D]
- **۴. استقرار روی باسکول:** سنسورهای موقعیت، چراغ، انتظار stable weight و نبود خودرو هم‌پوشان؛ ثبت عکس و weighEvent-1. [پ؛ الگوهای مستند P، T، D]
- **۵. بارگیری یا تخلیه:** ثبت بارگیری، LoadPoint، تجهیز لودر/شاول و گواهی مواد در صورت وجود. [پ؛ الگوهای مستند P، T، D]
- **۶. توزین دوم:** تشخیص مجدد RFID/ANPR؛ احراز تطابق کامیون، ثبت عکس و weighEvent-2؛ حل Gross/Tare. [پ؛ الگوهای مستند P، T، D]
- **۷. تطبیق و صدور سند:** Net = Gross − Tare؛ threshold سفارش/مجوز، overweight و اختلاف تارا؛ ثبت Approval در صورت استثنا؛ صدور ticket. [پ؛ الگوهای مستند P، T، D]
- **۸. خروج:** انجام کنترل نهایی دروازه؛ GateEvent خروج؛ release رزرو مجوز، ثبت نهایی در ERP و محاسبه زمان حضور. [پ؛ الگوهای مستند P، T، D]
**State machine پیشنهادی:** `EXPECTED → AT_GATE → AUTHORIZED → FIRST_WEIGHED → LOADING/UNLOADING → SECOND_WEIGHED → VALIDATED → RELEASED → EXITED`؛ شاخه‌های `REVIEW_REQUIRED`, `BLOCKED`, `CANCELLED`, `INCOMPLETE`. امکان وزن ناخالص اول یا تارا اول به جهت ورود/خروج ماده وابسته است، نه فرض ثابت.
**سناریوهای شکست:** قطع RS232، وزن ناپایدار، تگ/پلاک نامنطبق، وزن منفی، دو تردد همزمان، دو درخواست ثبت تکراری، انقضای مجوز، قطع ERP، قطع شبکه، تاریخ کالیبراسیون سپری‌شده؛ ثبت event و جلوگیری از خروج خودکار تا حل/تأیید مجاز. [پ]
## ۶. مدل داده، کلیدها و قواعد یکپارچگی
**همه فیلدهای زیر پیشنهادی‌اند.** وزن بر حسب kg و حجم m³ در لایه ذخیره؛ مقدارهای قانونی تابع مشخصات ابزار و مجوز بهره‌برداری است. داده‌های شناسایی شخصی باید طبق سیاست نگهداری محدود شوند.
- **Vehicle** — `id:uuid PK`; `plate:string`; `plate_country:string`; `rfid_tag_ids:uuid[]`; `vehicle_class:string`; `max_gross_kg:decimal?`; `active:boolean`.
- **Driver** — `id:uuid PK`; `name:string`; `license_ref:string?`; `carrier_id:uuid FK`; `active:boolean`.
- **Carrier** — `id:uuid PK`; `legal_name:string`; `tax_ref:string?`.
- **Customer** — `id:uuid PK`; `legal_name:string`; `category:buyer|supplier`.
- **Material** — `id:uuid PK`; `code:string`; `name:string`; `grade:string?`; `density_kg_m3:decimal?`; `density_source:string?`.
- **Permit** — `id:uuid PK`; `permit_no:string`; `permit_type:string`; `valid_from:datetime`; `valid_to:datetime`; `allowed_net_kg:decimal?`; `remaining_net_kg:decimal?`; `material_id:uuid`; `origin_id:uuid?`; `destination_id:uuid?`; `status:enum`.
- **Transaction** — `id:uuid PK`; `ticket_no:string unique`; `vehicle_id:uuid`; `driver_id:uuid?`; `carrier_id:uuid?`; `customer_id:uuid?`; `material_id:uuid`; `permit_id:uuid?`; `site_id:uuid`; `gross_kg:decimal?`; `tare_kg:decimal?`; `net_kg:decimal?`; `state:enum`; `started_at:datetime`; `completed_at:datetime?`; `shift_id:uuid?`; `origin:string?`; `destination:string?`; `version:int`.
- **WeighEvent** — `id:uuid PK`; `transaction_id:uuid`; `scale_id:uuid`; `stage:first|second|single`; `weight_kg:decimal`; `stable:boolean`; `raw_frame_hash:string`; `measured_at:datetime`; `operator_id:uuid?`; `image_ids:uuid[]`; `idempotency_key:string unique`.
- **GateEvent** — `id:uuid PK`; `transaction_id:uuid?`; `gate_id:uuid`; `direction:in|out`; `timestamp:datetime`; `decision:enum`; `reason_codes:string[]`.
- **CameraPlateRead** — `id:uuid PK`; `camera_id:uuid`; `plate_text:string`; `confidence:decimal?`; `frame_uri:string`; `model_version:string?`; `captured_at:datetime`; `gate_event_id:uuid?`.
- **RFIDRead** — `id:uuid PK`; `reader_id:uuid`; `tag_epc:string`; `rssi:decimal?`; `captured_at:datetime`; `gate_event_id:uuid?`.
- **Scale** — `id:uuid PK`; `site_id:uuid`; `indicator_model:string`; `serial_number:string`; `protocol_profile_id:uuid`; `capacity_kg:decimal?`; `status:enum`; `calibration_due_at:datetime?`.
- **CalibrationRecord** — `id:uuid PK`; `scale_id:uuid`; `certificate_uri:string`; `calibrated_at:datetime`; `expires_at:datetime`; `authority:string?`; `result:pass|fail`; `recorded_by:uuid`.
- **Alert** — `id:uuid PK`; `code:string`; `severity:enum`; `entity_type:string`; `entity_id:uuid`; `opened_at:datetime`; `ack_by:uuid?`; `resolved_at:datetime?`; `threshold_snapshot:json`; `evidence_uri:string?`.
- **Shift** — `id:uuid PK`; `site_id:uuid`; `start_at:datetime`; `end_at:datetime`; `supervisor_id:uuid?`.
- **Equipment** — `id:uuid PK`; `asset_code:string`; `type:truck|loader|shovel|scale|scanner`; `site_id:uuid`; `status:enum`.
- **LidarScan** — `id:uuid PK`; `transaction_id:uuid?`; `vehicle_id:uuid`; `scanner_id:uuid`; `scan_type:empty|loaded`; `volume_m3:decimal?`; `profile_uri:string?`; `quality_score:decimal?`; `scanned_at:datetime`.
- **PayloadEvent** — `id:uuid PK`; `equipment_id:uuid`; `transaction_id:uuid?`; `source_system:string`; `payload_kg:decimal?`; `material_id:uuid?`; `timestamp:datetime`; `confidence:decimal?`.
- **AuditEvent** — `id:uuid PK`; `actor_id:uuid?`; `action:string`; `entity_type:string`; `entity_id:uuid`; `before_hash:string?`; `after_hash:string`; `reason:string?`; `at:datetime`.
- **Site** — `id:uuid PK`; `name:string`; `timezone:string`; `location:string?`.
- **Device** — `id:uuid PK`; `site_id:uuid`; `type:string`; `protocol:string`; `endpoint:string`; `health_status:enum`.
**قیود:** FK معتبر، UNIQUE(site_id,ticket_no) در صورت شماره‌گذاری سایت‌محور، مقدار وزن ≥۰، `net_kg = gross_kg - tare_kg` و `net_kg >=0` (جز استثنای ثبت اختلاف منفی بدون ترخیص)، عدم overwrite رویداد وزن؛ جلوگیری از دو Transaction فعال برای یک Vehicle در یک سایت مگر override ثبت‌شده. [پ]
## ۷. مشخصات UI/UX قابل پیاده‌سازی
- **داشبورد مدیریتی:** کارت تولید امروز/شیفت، تن خالص، سفر، تراکنش باز، متوسط turnaround، هشدار بحرانی؛ نمودار روند ساعتی، Top carriers، سایت/باسکول، جدول آخرین رویدادها. الگوی الهام [P][A][LC][C]؛ ترکیب و طراحی نهایی **پیشنهادی**.
- **کنسول زنده باسکول:** ستون اول خوانش وزن پایدار/اتصال indicator؛ وسط فرم Vehicle/Driver/Permit/Material و First/Second؛ راست قاب دوربین/پلاک و سنسور موقعیت؛ پایین timeline وقایع. الگوی الهام [P] / P-UI-01؛ ترکیب و طراحی نهایی **پیشنهادی**.
- **دروازه و صف:** جدول وسایل ورودی، RFID+ANPR confidence، چراغ/راهبند، صف و علت توقف. الگوی الهام [T][W]؛ ترکیب و طراحی نهایی **پیشنهادی**.
- **جزئیات تراکنش:** timeline ورود/وزن اول/بارگیری/وزن دوم/خروج؛ نمایش دو عکس، محاسبات، مجوز، تغییرات و مدارک. الگوی الهام [P]؛ ترکیب و طراحی نهایی **پیشنهادی**.
- **مجوزها و حواله‌ها:** وضعیت اعتبار، سقف، مقدار مصرف‌شده، باقی‌مانده، مغایرت‌ها و مسیر تأیید. الگوی الهام [D]؛ ترکیب و طراحی نهایی **پیشنهادی**.
- **تاریخچه و گزارش‌ها:** فیلتر سایت، شیفت، زمان، ماده، راننده، شرکت، پلاک، مجوز، وضعیت؛ CSV/XLSX/PDF. الگوی الهام [P][A][LC]؛ ترکیب و طراحی نهایی **پیشنهادی**.
- **سلامت باسکول:** نمای لودسل‌ها، drift، noise، balance، روزهای مانده تا سررسید و خاموشی تجهیزات. الگوی الهام [R][M]؛ ترکیب و طراحی نهایی **پیشنهادی**.
- **اسکن LiDAR:** نمای 3D profile خالی/پر، حجم، کیفیت اسکن، مقایسه وزن/حجم. الگوی الهام [L][LC]؛ ترکیب و طراحی نهایی **پیشنهادی**.
- **ناوگان:** چرخه حمل، مقدار بار، زمان انتظار، utilization، موقعیت تجهیزات در صورت اتصال GPS/FMS. الگوی الهام [C][CE]؛ ترکیب و طراحی نهایی **پیشنهادی**.
- **تنظیمات و ممیزی:** RBAC، پروفایل پروتکل، اتصال ERP، Rule Engine، آستانه، گزارش تغییرات و لاگ API. الگوی الهام [P][A]؛ ترکیب و طراحی نهایی **پیشنهادی**.
**Design System پیشنهادی (بدون اقتباس بصری مستقیم):** RTL، sidebar راست با دسته‌های عملیات/تولید/امنیت/نگهداری/تنظیمات؛ header با فیلتر سایت و شیفت، پس‌زمینه خنثی، فونت فارسی خوانا و قابلیت Night Mode؛ رنگ‌های وضعیت با متن/آیکن همراه شوند (سبز=تأیید، کهربایی=اخطار، قرمز=توقف). منبع P-UI-01 فقط شاهد الگوی فرم تراکنش کنار وزن زنده است؛ رنگ‌ها و چیدمان جدید پیشنهاد خودمان است.
**معادلات KPI:** `net_kg=gross_kg−tare_kg`؛ `turnaround=exit_at−entry_at`؛ `trip_count=count(EXITED valid transactions)`؛ `shift_production_kg=sum(valid net_kg tagged to shift)`؛ `avg_cycle=sum(valid cycle durations)/N`؛ `utilization=productive_time/available_time` (تعریف productive/available لازم)؛ `fuel_intensity=fuel_liters/tons` فقط با داده سوخت معتبر. [پ؛ ایده KPI از C][CE]
## ۸. یکپارچه‌سازی و معماری
```text
RFID / ANPR / Cameras / Position Sensors / Indicator / PLC
             | protocol adapters (Edge Gateway)
             v
    Device Events + Quality Flags  --> Local Durable Queue
             |                                  |
             v                                  v
   Transaction State Machine             Sync / Retry Worker
             |                                  |
    PostgreSQL + Object Storage <------ API / Message Bus
             |                                  |
       Web UI / Reports              ERP / Accounting / FMS
             +------ Plugins: LiDAR / Payload / Maintenance
```
- **مستند در Punit:** RS232 وزن‌خوان، چند COM، LAN، SQL Server/Access/Oracle، SAP/ERP به سفارش مشتری، export CSV/Excel/Text؛ نوع و نسخه واقعی API ارائه نشده. [P]
- **مستند در SmarTower:** تجهیزات LAN/UHF RFID، حسگر موقعیت و راهبند اختیاری. [TPDF]
- **مستند در Rice Lake:** رابط‌های Ethernet TCP/IP، RS232/485 و دیگر options برای iQUBE²؛ این مشخصات متعلق به iQUBE² است و قابل تعمیم به Punit نیست. [R]
- **پیشنهادی:** Adapter SDK برای serial TCP/IP، REST/OpenAPI، webhook، MQTT، OPC UA و Modbus TCP (در صورت سازگاری تجهیز)، timeouts، CRC/parser، watchdog، store-and-forward. هیچ‌کدام برای Punit به‌جز RS232 تأیید نشده.
- **استقرار پیشنهادی:** edge صنعتی در سایت + DB محلی + ذخیره عکس؛ مرکز چندسایتی اختیاری برای گزارش، نه مسیر حیاتی بازکردن راهبند؛ full offline transaction با reconciliation و حفظ ترتیب رخدادها. [پ]
## ۹. منطق هشدارها؛ آستانه‌های قابل پیکربندی
| کد | شرط | آستانه | اقدام | مرجع قابلیت / وضعیت |
|---|---|---|---|---|
| AL-01 RFID/ANPR conflict | `tag_vehicle_id != plate_vehicle_id` | `match_confidence_threshold` | Block + Review | —؛ منطق **پیشنهادی** |
| AL-02 Permit expired | `now > permit.valid_to OR permit.status != active` | `none` | Block dispatch | —؛ منطق **پیشنهادی** |
| AL-03 Overweight | `gross_kg > permitted_gross_kg` | `vehicle/site/legal config` | Block + Supervisor | —؛ منطق **پیشنهادی** |
| AL-04 Permit capacity | `net_kg > permit.remaining_net_kg` | `tolerance_kg configured` | Block + ERP approval | —؛ منطق **پیشنهادی** |
| AL-05 Negative net | `gross_kg < tare_kg` | `zero` | Review + Stop | —؛ منطق **پیشنهادی** |
| AL-06 Unexpected tare change | `abs(tare_kg - previous_tare_kg) > delta` | `per vehicle class` | Hold | [P]؛ منطق **پیشنهادی** |
| AL-07 Unstable scale | `stable != true during acquisition timeout` | `timeout configured` | Disallow capture | —؛ منطق **پیشنهادی** |
| AL-08 Partial positioning | `position_sensors != fully_occupied` | `sensor set configured` | Stop capture/barrier | [TPDF]؛ منطق **پیشنهادی** |
| AL-09 Calibration overdue | `now > calibration.expires_at` | `none` | Flag and block as site policy | —؛ منطق **پیشنهادی** |
| AL-10 Load cell diagnostics | `drift/noise/unbalance exceeds vendor diagnostic flag` | `vendor qualified config` | Maintenance alert + block policy | [R][M]؛ منطق **پیشنهادی** |
| AL-11 Duplicate ticket | `same idempotency key or transaction conflict` | `uniqueness` | Reject write | —؛ منطق **پیشنهادی** |
| AL-12 Anomalous dwell | `now-entry_at > expected window` | `site/material profile` | Notify supervisor | —؛ منطق **پیشنهادی** |
| AL-13 LiDAR mismatch | `abs(weight-derived mass - scale net) > tolerance` | `density + uncertainty range` | Flag, never auto-correct weight | [L][LC]؛ منطق **پیشنهادی** |
| AL-14 ERP delivery failed | `unsent event retry exhausted` | `retry/backoff policy` | Queue + reconciliation | —؛ منطق **پیشنهادی** |
| AL-15 Camera unavailable | `no frame on capture` | `health timeout` | Mark evidence missing + hold policy | [P]؛ منطق **پیشنهادی** |
| AL-16 Queue overload | `queue_count or wait_minutes > capacity profile` | `shift baseline` | Ops alert | —؛ منطق **پیشنهادی** |
**کالیبراسیون:** drift/تقارن، کنترل تشخیصی پیوسته است و جایگزین کالیبراسیون قانونی با وزنه مرجع نیست؛ توصیه به توقف استفاده حقوقی از ابزار بدون گواهی معتبر تابع مقررات محلی و سیاست بهره‌برداری است. [R][M]
## ۱۰. ماژول‌های افزودنی (Plug-in)
**۱) LiDAR/Volume:** `LidarScan` از کامیون خالی و پر → هم‌مرجع‌سازی پروفیل‌ها → حجم بار `V_loaded−V_empty` با کنترل geometry → `estimated_mass=volume×bulk_density` با بازه عدم‌قطعیت؛ نمایش حجم واقعی جدا از جرم باسکول. روش Loadscan مرجع قابلیت اسکن و 3D profile است، فرمول پیاده‌سازی پیشنهادی است. [L][LM][LC]
**۲) Onboard payload:** خواندن payload کامیون یا شاول از واسط دارای مجوز؛ matching با trip/vehicle/time window؛ محاسبه اختلاف با net weighbridge و خطا/نرخ تکمیل؛ بدون ادعای دقت مستقل از سخت‌افزار. [C]
**۳) Fleet KPI:** منابع trip events، dispatch، GPS، equipment status و fuel meter؛ KPI چرخه، انتظار، idle، utilization، تولید شیفت، fuel intensity؛ شیفت و timezone معیار تفکیک باشند. [C][CE]
**قرارداد افزونه (پیشنهادی):** `manifest(id,version,required_events,permissions,config_schema)`؛ subscribe روی `weigh_event.completed`/`gate_event.created`؛ انبار مستقل داده، retry/idempotency، UI route و RBAC مجزا؛ هسته بدون افزونه عمل می‌کند.
## ۱۱. شکاف‌ها و سؤال‌های باز
1. بازیابی ناموفق robots.txt و sitemap.xml؛ بنابراین فهرست کامل URLهای دامنه اثبات نشده.
2. دکمه‌های Product Brochure و فیلم‌ها برای استخراج کامل بررسی نشدند؛ سند PDF رسمی Punit در دسترس نبود.
3. فرکانس، استاندارد تگ، برد، نحوه ضدتداخل و چیدمان آنتن RFID در Punit مشخص نیست.
4. ANPR: کشور/نوع پلاک، معیار accuracy، confidence و پوشش شبانه Punit نامشخص.
5. مدل لودسل/indicator و داده‌های داخلی تشخیص drift در Punit نامشخص.
6. متن تجاری Punit عبارت Cloud را کنار Windows/COM و LAN قرار داده؛ توپولوژی واقعی هر SKU روشن نیست.
7. مدل مجوز و قواعد انبار/فروش/خرید در Punit منبع شفاف ندارد.
8. شماره نسخه نرم‌افزار، دمو عملیاتی، schemas/API و قراردادهای پشتیبانی Punit نامشخص.
9. گواهی کالیبراسیون و وضعیت قانونی توزین توسط نرم‌افزار مستقل از تأیید ابزار مشخص نیست.
10. بازه سنجش LiDAR، سرعت مجاز عبور، عدم‌قطعیت جرم بر اساس چگالی و scanner calibration نیاز به طراحی فنی و آزمون دارند.
11. برای شرکت‌های مقایسه‌ای بدون منبع کافی، خانه‌های ماتریس عمداً نامشخص مانده.
12. تصاویر ۱۲۵ پیکسلی برخی صفحات امکان خواندن دقیق فیلد و رنگ را نمی‌دهند.
**سؤال‌های تصمیم‌ساز:** ظرفیت/تعداد باسکول و مدل indicator چیست؟ استانداردهای حقوقی توزین و مقررات حمل کدام‌اند؟ قالب پلاک ایران/کشور هدف؟ سطح مجاز توقف در زمان قطعی شبکه؟ API موجود ERP و PLC؟ تعریف شیفت و مرز ثبت تولید؟ سند معتبر calibrations؟ چرخه کاری یک‌بار/دوبار وزن و محموله‌های ورودی/خروجی؟
## ۱۲. JSON ساختاریافته قابل استفاده برای AI coder
```json
{
  "document_version": "0.9",
  "language": "fa-IR",
  "evidence_policy": {
    "confirmed": "explicit public source",
    "inferred": "visible screenshot",
    "proposed": "our design; not vendor claim",
    "unknown": "not established; never interpret as absent"
  },
  "project": {
    "code_name": "MineGate Weigh",
    "scope": "weighbridge_gate_permit_reporting",
    "architecture": "edge-first event-driven modular",
    "source_refs": {
      "P": "https://www.punitinstruments.com/weighbridge-software.html",
      "A": "https://www.averyweigh-tronix.com/en/product/weighman-8-weighbridge-software/",
      "T": "https://www.averyweigh-tronix.com/en/product/smartower-unmanned-weighbridge-system/",
      "TPDF": "https://www.averyweigh-tronix.com/en/wp-content/uploads/sites/11/2025/08/SmarTower_UK_spec.pdf",
      "W": "https://www.linkedin.com/products/endel-digital-solutions-weighmast-weighbridge-software/",
      "D": "https://easterncapeindustrialnews.co.za/software-suite-takes-the-weight-off-logistics-operations/",
      "R": "https://www.ricelake.com/products/iqube2-digital-diagnostic-junction-box?part=93243",
      "M": "https://www.mt.com/dam/ind/IND_PDF/2024/IND780-downloads/others/IND560PDX-and-IND780_MAN_30137756_R00_TraxEMT_AppGuide_EN.pdf",
      "L": "https://www.loadscan.com/load-volume-scanner/",
      "LM": "https://www.loadscan.com/mine-payload-scanner/",
      "LC": "https://www.loadscan.com/myscanner/",
      "LA": "https://www.loadscan.com/myscanner/alerts/",
      "LX": "https://www.loadscan.com/service-agreement/",
      "LE": "https://www.loadscan.com/myscanner-dashboard-update/",
      "C": "https://www.cat.com/en_US/by-industry/mining/surface-mining/surface-technology/fleet.html",
      "CE": "https://www.cat.com/en_US/by-industry/mining/surface-mining/surface-technology/edge-western-states.html"
    }
  },
  "roles": [
    {
      "name": "مدیر سامانه (Admin)",
      "id": "ROLE-01"
    },
    {
      "name": "اپراتور باسکول (Scale Operator)",
      "id": "ROLE-02"
    },
    {
      "name": "نگهبان دروازه (Gate Officer)",
      "id": "ROLE-03"
    },
    {
      "name": "سرپرست شیفت (Shift Supervisor)",
      "id": "ROLE-04"
    },
    {
      "name": "مدیر تولید (Production Manager)",
      "id": "ROLE-05"
    },
    {
      "name": "مالی/فروش (Commercial)",
      "id": "ROLE-06"
    },
    {
      "name": "کارشناس تعمیرات و کالیبراسیون (Maintenance)",
      "id": "ROLE-07"
    },
    {
      "name": "ممیز (Auditor)",
      "id": "ROLE-08"
    },
    {
      "name": "راننده در کیوسک (Driver/Kiosk)",
      "id": "ROLE-09"
    },
    {
      "name": "سرویس یکپارچه‌سازی (Service Account)",
      "id": "ROLE-10"
    }
  ],
  "requirements": [
    {
      "id": "FR-01",
      "description_fa": "ثبت Master Data کامیون/پلاک/تگ/راننده/شرکت/ماده/سایت و جلوگیری از شناسه تکراری",
      "priority": "P0",
      "status": "proposed",
      "inspiration_sources": [
        "https://www.punitinstruments.com/weighbridge-software.html"
      ]
    },
    {
      "id": "FR-02",
      "description_fa": "ثبت GateEvent و تطبیق RFID، پلاک OCR و شناسه وسیله؛ حالت عدم‌قطعیت/بازبینی دستی",
      "priority": "P0",
      "status": "proposed",
      "inspiration_sources": [
        "https://www.punitinstruments.com/weighbridge-software.html",
        "https://www.averyweigh-tronix.com/en/product/weighman-8-weighbridge-software/",
        "https://www.averyweigh-tronix.com/en/product/smartower-unmanned-weighbridge-system/"
      ]
    },
    {
      "id": "FR-03",
      "description_fa": "تطبیق وضعیت مجوز/سقف مجاز/سفارش و قفل ورود یا خروج هنگام عدم‌انطباق",
      "priority": "P0",
      "status": "proposed",
      "inspiration_sources": [
        "https://easterncapeindustrialnews.co.za/software-suite-takes-the-weight-off-logistics-operations/"
      ]
    },
    {
      "id": "FR-04",
      "description_fa": "دریافت وزن پایدار از indicator و ذخیره payload خام، زمان، شناسه دستگاه، کیفیت و واحد",
      "priority": "P0",
      "status": "proposed",
      "inspiration_sources": [
        "https://www.punitinstruments.com/weighbridge-software.html"
      ]
    },
    {
      "id": "FR-05",
      "description_fa": "حفظ وزن اول/دوم، محاسبه ناخالص/تارا/خالص مستقل از ترتیب باسکول، و جلوگیری از اشتباه در وضعیت",
      "priority": "P0",
      "status": "proposed",
      "inspiration_sources": [
        "https://www.punitinstruments.com/weighbridge-software.html"
      ]
    },
    {
      "id": "FR-06",
      "description_fa": "ثبت عکس وزن اول و دوم و اتصال تغییرناپذیر به رخداد",
      "priority": "P0",
      "status": "proposed",
      "inspiration_sources": [
        "https://www.punitinstruments.com/weighbridge-software.html",
        "https://www.averyweigh-tronix.com/en/product/smartower-unmanned-weighbridge-system/"
      ]
    },
    {
      "id": "FR-07",
      "description_fa": "صدور قبض دارای شماره یکتا/QR و نسخه‌گذاری چاپ مجدد",
      "priority": "P0",
      "status": "proposed",
      "inspiration_sources": [
        "https://www.punitinstruments.com/weighbridge-software.html"
      ]
    },
    {
      "id": "FR-08",
      "description_fa": "تأیید حضور کامل وسیله و وزن پایدار پیش از ثبت",
      "priority": "P0",
      "status": "proposed",
      "inspiration_sources": [
        "https://www.averyweigh-tronix.com/en/wp-content/uploads/sites/11/2025/08/SmarTower_UK_spec.pdf"
      ]
    },
    {
      "id": "FR-09",
      "description_fa": "ثبت ورود/خروج، turnaround و صف با زمان مرجع قابل رهگیری",
      "priority": "P0",
      "status": "proposed",
      "inspiration_sources": [
        "https://www.loadscan.com/mine-payload-scanner/"
      ]
    },
    {
      "id": "FR-10",
      "description_fa": "صف اپراتوری رویدادهای باز، ناقص و مشکوک همراه دلیل و تأیید دو مرحله‌ای",
      "priority": "P0",
      "status": "proposed",
      "inspiration_sources": [
        "https://www.punitinstruments.com/weighbridge-software.html"
      ]
    },
    {
      "id": "FR-11",
      "description_fa": "کنترل چراغ/راهبند با PLC/IO و interlock ایمنی مستقل از UI",
      "priority": "P1",
      "status": "proposed",
      "inspiration_sources": [
        "https://www.averyweigh-tronix.com/en/product/smartower-unmanned-weighbridge-system/"
      ]
    },
    {
      "id": "FR-12",
      "description_fa": "محاسبه تولید، تعداد سفر، شیفت، توزیع مواد، بهره‌برداری مبتنی بر Event",
      "priority": "P1",
      "status": "proposed",
      "inspiration_sources": [
        "https://www.cat.com/en_US/by-industry/mining/surface-mining/surface-technology/fleet.html",
        "https://www.cat.com/en_US/by-industry/mining/surface-mining/surface-technology/edge-western-states.html"
      ]
    },
    {
      "id": "FR-13",
      "description_fa": "اتصال ERP و انتقال کنترل‌شده قبض/تحویل/سفارش، با retry و reconciliation",
      "priority": "P1",
      "status": "proposed",
      "inspiration_sources": [
        "https://www.punitinstruments.com/weighbridge-software.html",
        "https://www.averyweigh-tronix.com/en/product/weighman-8-weighbridge-software/"
      ]
    },
    {
      "id": "FR-14",
      "description_fa": "اخطار سخت‌افزار توزین، drift، unbalanced، انقضای CalibrationRecord",
      "priority": "P1",
      "status": "proposed",
      "inspiration_sources": [
        "https://www.ricelake.com/products/iqube2-digital-diagnostic-junction-box?part=93243",
        "https://www.mt.com/dam/ind/IND_PDF/2024/IND780-downloads/others/IND560PDX-and-IND780_MAN_30137756_R00_TraxEMT_AppGuide_EN.pdf"
      ]
    },
    {
      "id": "FR-15",
      "description_fa": "ارسال ایمیل/SMS/WhatsApp و گزارش PDF/Excel/CSV با مجوز دسترسی",
      "priority": "P1",
      "status": "proposed",
      "inspiration_sources": [
        "https://www.punitinstruments.com/weighbridge-software.html"
      ]
    },
    {
      "id": "FR-16",
      "description_fa": "مدیریت کاربر، RBAC، AuditEvent append-only، سیاست اصلاح به‌جای حذف",
      "priority": "P0",
      "status": "proposed",
      "inspiration_sources": [
        "https://www.punitinstruments.com/weighbridge-software.html",
        "https://www.averyweigh-tronix.com/en/product/weighman-8-weighbridge-software/"
      ]
    },
    {
      "id": "FR-17",
      "description_fa": "تعریف چند باسکول، چند سایت، تنظیم جهت تردد و routing",
      "priority": "P1",
      "status": "proposed",
      "inspiration_sources": [
        "https://www.averyweigh-tronix.com/en/product/weighman-8-weighbridge-software/",
        "https://www.averyweigh-tronix.com/en/wp-content/uploads/sites/11/2025/08/SmarTower_UK_spec.pdf"
      ]
    },
    {
      "id": "FR-18",
      "description_fa": "صف آفلاین و sync مقاوم به تکرار با conflict resolution",
      "priority": "P1",
      "status": "proposed",
      "inspiration_sources": []
    },
    {
      "id": "FR-19",
      "description_fa": "افزونه LiDAR: اسکن خالی/پر، حجم تفاضلی، مشخصه بار و density با uncertainty",
      "priority": "P2",
      "status": "proposed",
      "inspiration_sources": [
        "https://www.loadscan.com/load-volume-scanner/",
        "https://www.loadscan.com/mine-payload-scanner/"
      ]
    },
    {
      "id": "FR-20",
      "description_fa": "افزونه PayloadEvent از شاول/لودر و FMS و تطبیق بار مفید با باسکول",
      "priority": "P2",
      "status": "proposed",
      "inspiration_sources": [
        "https://www.cat.com/en_US/by-industry/mining/surface-mining/surface-technology/fleet.html"
      ]
    },
    {
      "id": "FR-21",
      "description_fa": "سامانه پیکربندی آستانه هشدار و گردش کار acknowledge/resolve",
      "priority": "P1",
      "status": "proposed",
      "inspiration_sources": [
        "https://www.ricelake.com/products/iqube2-digital-diagnostic-junction-box?part=93243",
        "https://www.loadscan.com/myscanner/"
      ]
    },
    {
      "id": "FR-22",
      "description_fa": "API و webhook نسخه‌دار با idempotency key و service account",
      "priority": "P1",
      "status": "proposed",
      "inspiration_sources": [
        "https://www.loadscan.com/service-agreement/"
      ]
    },
    {
      "id": "FR-23",
      "description_fa": "عملیات توزین یک‌مرحله‌ای با تارا ثبت‌شده و پرچم ریسک",
      "priority": "P1",
      "status": "proposed",
      "inspiration_sources": [
        "https://www.punitinstruments.com/weighbridge-software.html"
      ]
    },
    {
      "id": "FR-24",
      "description_fa": "تعریف و گزارش قیود حجمی و وزنی بر مبنای قرارداد/حواله",
      "priority": "P1",
      "status": "proposed",
      "inspiration_sources": []
    }
  ],
  "nonfunctional": [
    {
      "id": "NFR-01",
      "description_fa": "زمان پاسخ UI و latency سنجش باید در آزمایش میدانی با SLA کارفرما تعیین و اندازه‌گیری شود؛ عدد ثابت بدون داده تعیین نمی‌شود.",
      "status": "proposed"
    },
    {
      "id": "NFR-02",
      "description_fa": "در دسترس بودن سایت، RTO و RPO و retention تصویر با کارفرما قراردادی شوند.",
      "status": "proposed"
    },
    {
      "id": "NFR-03",
      "description_fa": "تمام زمان‌ها UTC ذخیره و با timezone سایت نمایش داده شوند؛ clock sync در edge و server مانیتور شود.",
      "status": "proposed"
    },
    {
      "id": "NFR-04",
      "description_fa": "TLS، encryption-at-rest، secret management و دسترسی least privilege اعمال شوند.",
      "status": "proposed"
    },
    {
      "id": "NFR-05",
      "description_fa": "رخداد تراکنش بدون حذف فیزیکی و با شناسه version، دلیل اصلاح و امضای نقش مجاز نگهداری شود.",
      "status": "proposed"
    },
    {
      "id": "NFR-06",
      "description_fa": "پروتکل وزن‌خوانی raw frame و parsing version در لاگ ثبت و از عملگرهای قانونی کالیبراسیون جدا بماند.",
      "status": "proposed"
    },
    {
      "id": "NFR-07",
      "description_fa": "بازپخش امن رویدادها، تضمین at-least-once delivery همراه پردازش idempotent.",
      "status": "proposed"
    },
    {
      "id": "NFR-08",
      "description_fa": "حفظ دسترس‌پذیری کنترل ایمنی PLC حتی هنگام خرابی سرور یا شبکه؛ حالت امن تجهیزات توسط HAZOP تعیین شود.",
      "status": "proposed"
    },
    {
      "id": "NFR-09",
      "description_fa": "پشتیبانی فارسی RTL و انگلیسی، جلالی در نمایش، اعداد/واحد استاندارد در داده.",
      "status": "proposed"
    },
    {
      "id": "NFR-10",
      "description_fa": "قابلیت تست با simulator تجهیزات و test harness برای failure scenarios.",
      "status": "proposed"
    },
    {
      "id": "NFR-11",
      "description_fa": "ثبت نسخه مدل ANPR و confidence؛ بازبینی دستی پلاک‌های کم‌اطمینان.",
      "status": "proposed"
    },
    {
      "id": "NFR-12",
      "description_fa": "هیچ مقدار حجمی تبدیل‌شده به جرم به عنوان وزن قانونی یا اندازه‌گیری تأییدشده معرفی نشود.",
      "status": "proposed"
    }
  ],
  "entities": {
    "Vehicle": [
      {
        "declaration": "id:uuid PK"
      },
      {
        "declaration": "plate:string"
      },
      {
        "declaration": "plate_country:string"
      },
      {
        "declaration": "rfid_tag_ids:uuid[]"
      },
      {
        "declaration": "vehicle_class:string"
      },
      {
        "declaration": "max_gross_kg:decimal?"
      },
      {
        "declaration": "active:boolean"
      }
    ],
    "Driver": [
      {
        "declaration": "id:uuid PK"
      },
      {
        "declaration": "name:string"
      },
      {
        "declaration": "license_ref:string?"
      },
      {
        "declaration": "carrier_id:uuid FK"
      },
      {
        "declaration": "active:boolean"
      }
    ],
    "Carrier": [
      {
        "declaration": "id:uuid PK"
      },
      {
        "declaration": "legal_name:string"
      },
      {
        "declaration": "tax_ref:string?"
      }
    ],
    "Customer": [
      {
        "declaration": "id:uuid PK"
      },
      {
        "declaration": "legal_name:string"
      },
      {
        "declaration": "category:buyer|supplier"
      }
    ],
    "Material": [
      {
        "declaration": "id:uuid PK"
      },
      {
        "declaration": "code:string"
      },
      {
        "declaration": "name:string"
      },
      {
        "declaration": "grade:string?"
      },
      {
        "declaration": "density_kg_m3:decimal?"
      },
      {
        "declaration": "density_source:string?"
      }
    ],
    "Permit": [
      {
        "declaration": "id:uuid PK"
      },
      {
        "declaration": "permit_no:string"
      },
      {
        "declaration": "permit_type:string"
      },
      {
        "declaration": "valid_from:datetime"
      },
      {
        "declaration": "valid_to:datetime"
      },
      {
        "declaration": "allowed_net_kg:decimal?"
      },
      {
        "declaration": "remaining_net_kg:decimal?"
      },
      {
        "declaration": "material_id:uuid"
      },
      {
        "declaration": "origin_id:uuid?"
      },
      {
        "declaration": "destination_id:uuid?"
      },
      {
        "declaration": "status:enum"
      }
    ],
    "Transaction": [
      {
        "declaration": "id:uuid PK"
      },
      {
        "declaration": "ticket_no:string unique"
      },
      {
        "declaration": "vehicle_id:uuid"
      },
      {
        "declaration": "driver_id:uuid?"
      },
      {
        "declaration": "carrier_id:uuid?"
      },
      {
        "declaration": "customer_id:uuid?"
      },
      {
        "declaration": "material_id:uuid"
      },
      {
        "declaration": "permit_id:uuid?"
      },
      {
        "declaration": "site_id:uuid"
      },
      {
        "declaration": "gross_kg:decimal?"
      },
      {
        "declaration": "tare_kg:decimal?"
      },
      {
        "declaration": "net_kg:decimal?"
      },
      {
        "declaration": "state:enum"
      },
      {
        "declaration": "started_at:datetime"
      },
      {
        "declaration": "completed_at:datetime?"
      },
      {
        "declaration": "shift_id:uuid?"
      },
      {
        "declaration": "origin:string?"
      },
      {
        "declaration": "destination:string?"
      },
      {
        "declaration": "version:int"
      }
    ],
    "WeighEvent": [
      {
        "declaration": "id:uuid PK"
      },
      {
        "declaration": "transaction_id:uuid"
      },
      {
        "declaration": "scale_id:uuid"
      },
      {
        "declaration": "stage:first|second|single"
      },
      {
        "declaration": "weight_kg:decimal"
      },
      {
        "declaration": "stable:boolean"
      },
      {
        "declaration": "raw_frame_hash:string"
      },
      {
        "declaration": "measured_at:datetime"
      },
      {
        "declaration": "operator_id:uuid?"
      },
      {
        "declaration": "image_ids:uuid[]"
      },
      {
        "declaration": "idempotency_key:string unique"
      }
    ],
    "GateEvent": [
      {
        "declaration": "id:uuid PK"
      },
      {
        "declaration": "transaction_id:uuid?"
      },
      {
        "declaration": "gate_id:uuid"
      },
      {
        "declaration": "direction:in|out"
      },
      {
        "declaration": "timestamp:datetime"
      },
      {
        "declaration": "decision:enum"
      },
      {
        "declaration": "reason_codes:string[]"
      }
    ],
    "CameraPlateRead": [
      {
        "declaration": "id:uuid PK"
      },
      {
        "declaration": "camera_id:uuid"
      },
      {
        "declaration": "plate_text:string"
      },
      {
        "declaration": "confidence:decimal?"
      },
      {
        "declaration": "frame_uri:string"
      },
      {
        "declaration": "model_version:string?"
      },
      {
        "declaration": "captured_at:datetime"
      },
      {
        "declaration": "gate_event_id:uuid?"
      }
    ],
    "RFIDRead": [
      {
        "declaration": "id:uuid PK"
      },
      {
        "declaration": "reader_id:uuid"
      },
      {
        "declaration": "tag_epc:string"
      },
      {
        "declaration": "rssi:decimal?"
      },
      {
        "declaration": "captured_at:datetime"
      },
      {
        "declaration": "gate_event_id:uuid?"
      }
    ],
    "Scale": [
      {
        "declaration": "id:uuid PK"
      },
      {
        "declaration": "site_id:uuid"
      },
      {
        "declaration": "indicator_model:string"
      },
      {
        "declaration": "serial_number:string"
      },
      {
        "declaration": "protocol_profile_id:uuid"
      },
      {
        "declaration": "capacity_kg:decimal?"
      },
      {
        "declaration": "status:enum"
      },
      {
        "declaration": "calibration_due_at:datetime?"
      }
    ],
    "CalibrationRecord": [
      {
        "declaration": "id:uuid PK"
      },
      {
        "declaration": "scale_id:uuid"
      },
      {
        "declaration": "certificate_uri:string"
      },
      {
        "declaration": "calibrated_at:datetime"
      },
      {
        "declaration": "expires_at:datetime"
      },
      {
        "declaration": "authority:string?"
      },
      {
        "declaration": "result:pass|fail"
      },
      {
        "declaration": "recorded_by:uuid"
      }
    ],
    "Alert": [
      {
        "declaration": "id:uuid PK"
      },
      {
        "declaration": "code:string"
      },
      {
        "declaration": "severity:enum"
      },
      {
        "declaration": "entity_type:string"
      },
      {
        "declaration": "entity_id:uuid"
      },
      {
        "declaration": "opened_at:datetime"
      },
      {
        "declaration": "ack_by:uuid?"
      },
      {
        "declaration": "resolved_at:datetime?"
      },
      {
        "declaration": "threshold_snapshot:json"
      },
      {
        "declaration": "evidence_uri:string?"
      }
    ],
    "Shift": [
      {
        "declaration": "id:uuid PK"
      },
      {
        "declaration": "site_id:uuid"
      },
      {
        "declaration": "start_at:datetime"
      },
      {
        "declaration": "end_at:datetime"
      },
      {
        "declaration": "supervisor_id:uuid?"
      }
    ],
    "Equipment": [
      {
        "declaration": "id:uuid PK"
      },
      {
        "declaration": "asset_code:string"
      },
      {
        "declaration": "type:truck|loader|shovel|scale|scanner"
      },
      {
        "declaration": "site_id:uuid"
      },
      {
        "declaration": "status:enum"
      }
    ],
    "LidarScan": [
      {
        "declaration": "id:uuid PK"
      },
      {
        "declaration": "transaction_id:uuid?"
      },
      {
        "declaration": "vehicle_id:uuid"
      },
      {
        "declaration": "scanner_id:uuid"
      },
      {
        "declaration": "scan_type:empty|loaded"
      },
      {
        "declaration": "volume_m3:decimal?"
      },
      {
        "declaration": "profile_uri:string?"
      },
      {
        "declaration": "quality_score:decimal?"
      },
      {
        "declaration": "scanned_at:datetime"
      }
    ],
    "PayloadEvent": [
      {
        "declaration": "id:uuid PK"
      },
      {
        "declaration": "equipment_id:uuid"
      },
      {
        "declaration": "transaction_id:uuid?"
      },
      {
        "declaration": "source_system:string"
      },
      {
        "declaration": "payload_kg:decimal?"
      },
      {
        "declaration": "material_id:uuid?"
      },
      {
        "declaration": "timestamp:datetime"
      },
      {
        "declaration": "confidence:decimal?"
      }
    ],
    "AuditEvent": [
      {
        "declaration": "id:uuid PK"
      },
      {
        "declaration": "actor_id:uuid?"
      },
      {
        "declaration": "action:string"
      },
      {
        "declaration": "entity_type:string"
      },
      {
        "declaration": "entity_id:uuid"
      },
      {
        "declaration": "before_hash:string?"
      },
      {
        "declaration": "after_hash:string"
      },
      {
        "declaration": "reason:string?"
      },
      {
        "declaration": "at:datetime"
      }
    ],
    "Site": [
      {
        "declaration": "id:uuid PK"
      },
      {
        "declaration": "name:string"
      },
      {
        "declaration": "timezone:string"
      },
      {
        "declaration": "location:string?"
      }
    ],
    "Device": [
      {
        "declaration": "id:uuid PK"
      },
      {
        "declaration": "site_id:uuid"
      },
      {
        "declaration": "type:string"
      },
      {
        "declaration": "protocol:string"
      },
      {
        "declaration": "endpoint:string"
      },
      {
        "declaration": "health_status:enum"
      }
    ]
  },
  "alert_rules": [
    {
      "id": "AL-01",
      "name": "RFID/ANPR conflict",
      "condition": "tag_vehicle_id != plate_vehicle_id",
      "threshold": "match_confidence_threshold",
      "action": "Block + Review",
      "status": "proposed"
    },
    {
      "id": "AL-02",
      "name": "Permit expired",
      "condition": "now > permit.valid_to OR permit.status != active",
      "threshold": "none",
      "action": "Block dispatch",
      "status": "proposed"
    },
    {
      "id": "AL-03",
      "name": "Overweight",
      "condition": "gross_kg > permitted_gross_kg",
      "threshold": "vehicle/site/legal config",
      "action": "Block + Supervisor",
      "status": "proposed"
    },
    {
      "id": "AL-04",
      "name": "Permit capacity",
      "condition": "net_kg > permit.remaining_net_kg",
      "threshold": "tolerance_kg configured",
      "action": "Block + ERP approval",
      "status": "proposed"
    },
    {
      "id": "AL-05",
      "name": "Negative net",
      "condition": "gross_kg < tare_kg",
      "threshold": "zero",
      "action": "Review + Stop",
      "status": "proposed"
    },
    {
      "id": "AL-06",
      "name": "Unexpected tare change",
      "condition": "abs(tare_kg - previous_tare_kg) > delta",
      "threshold": "per vehicle class",
      "action": "Hold",
      "status": "proposed"
    },
    {
      "id": "AL-07",
      "name": "Unstable scale",
      "condition": "stable != true during acquisition timeout",
      "threshold": "timeout configured",
      "action": "Disallow capture",
      "status": "proposed"
    },
    {
      "id": "AL-08",
      "name": "Partial positioning",
      "condition": "position_sensors != fully_occupied",
      "threshold": "sensor set configured",
      "action": "Stop capture/barrier",
      "status": "proposed"
    },
    {
      "id": "AL-09",
      "name": "Calibration overdue",
      "condition": "now > calibration.expires_at",
      "threshold": "none",
      "action": "Flag and block as site policy",
      "status": "proposed"
    },
    {
      "id": "AL-10",
      "name": "Load cell diagnostics",
      "condition": "drift/noise/unbalance exceeds vendor diagnostic flag",
      "threshold": "vendor qualified config",
      "action": "Maintenance alert + block policy",
      "status": "proposed"
    },
    {
      "id": "AL-11",
      "name": "Duplicate ticket",
      "condition": "same idempotency key or transaction conflict",
      "threshold": "uniqueness",
      "action": "Reject write",
      "status": "proposed"
    },
    {
      "id": "AL-12",
      "name": "Anomalous dwell",
      "condition": "now-entry_at > expected window",
      "threshold": "site/material profile",
      "action": "Notify supervisor",
      "status": "proposed"
    },
    {
      "id": "AL-13",
      "name": "LiDAR mismatch",
      "condition": "abs(weight-derived mass - scale net) > tolerance",
      "threshold": "density + uncertainty range",
      "action": "Flag, never auto-correct weight",
      "status": "proposed"
    },
    {
      "id": "AL-14",
      "name": "ERP delivery failed",
      "condition": "unsent event retry exhausted",
      "threshold": "retry/backoff policy",
      "action": "Queue + reconciliation",
      "status": "proposed"
    },
    {
      "id": "AL-15",
      "name": "Camera unavailable",
      "condition": "no frame on capture",
      "threshold": "health timeout",
      "action": "Mark evidence missing + hold policy",
      "status": "proposed"
    },
    {
      "id": "AL-16",
      "name": "Queue overload",
      "condition": "queue_count or wait_minutes > capacity profile",
      "threshold": "shift baseline",
      "action": "Ops alert",
      "status": "proposed"
    }
  ],
  "transaction_states": [
    "EXPECTED",
    "AT_GATE",
    "AUTHORIZED",
    "FIRST_WEIGHED",
    "LOADING",
    "SECOND_WEIGHED",
    "VALIDATED",
    "RELEASED",
    "EXITED",
    "REVIEW_REQUIRED",
    "BLOCKED",
    "CANCELLED",
    "INCOMPLETE"
  ],
  "plugins": [
    "LIDAR_VOLUME",
    "ONBOARD_PAYLOAD",
    "FLEET_KPI"
  ],
  "assumptions": [
    "all thresholds configurable",
    "not a legal-for-trade replacement",
    "verify vendor protocols before implementation"
  ]
}
```

---
**ممیزی نهایی:** هیچ «عدم ذکر» به معنای «فاقد قابلیت» نیست؛ وضعیت ویژگی شرکت‌ها جدا از طراحی پیشنهادی است؛ تحقق کامل خزش، بررسی همه بروشورها و بررسی ویدیوها ادعا نشده است.