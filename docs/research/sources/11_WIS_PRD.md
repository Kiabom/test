# مشخصات محصول مستقل: سامانه یکپارچه توزین، تردد و پایش تولید معدن

**عنوان انگلیسی:** Smart Mining Weighbridge & Gate Operations Platform — Evidence-based Product Specification  
**نسخه:** 1.0 | **تاریخ بررسی:** 2026-10-25 | **زبان:** فارسی | **وضعیت:** مرجع ساخت نمونه اولیه و طراحی تفصیلی؛ نه ادعای بازتولید نرم‌افزار اختصاصی فروشندگان

> **محدوده و صداقت پژوهش:** URL اصلی، صفحه [WIS Weighbridge Software](https://www.weighing-engineering.com/products/weighbridge-automation-systems/wis-weighbridge-software.html) بود. پیوست مستقلی در این درخواست قابل مشاهده نبود. بررسی وب‌سایت با جست‌وجوی ساختاریافته، پیمایش منوها، بازکردن صفحات و منابع PDF، و مشاهده تصاویر عمومی انجام شد، **نه خزش صددرصدی یا ممیزی فنی پشت لاگین**؛ `robots.txt` و `sitemap.xml` با ابزار مرورگر قابل بازیابی نبودند. هیچ ادعایی مبنی بر مشاهده اجرای زنده، کد، API داخلی یا ویدئوی فریم‌به‌فریم وجود ندارد. این شکاف‌ها در §۱۱ ثبت شده‌اند.

**قرارداد شواهد:** «**تأییدشده**» = تصریح سازنده/کاتالوگ رسمی یا سند قابل ردیابی؛ «**استنباطی**» = فقط الگوی دیداری یا تفسیرِ محدود از قرینه؛ «**پیشنهادی**» = الزام محصول ما که نباید به شرکت مرجع نسبت داده شود. در ماتریس «د[منبع]» = دارد، «؟» = نامشخص، و «ن» فقط زمانی مجاز است که نبودن ویژگی صریحاً اثبات شده باشد. **نبود اطلاعات در وب‌سایت، معادل «ندارد» نیست.** ادعاهای تأییدشده محصولات سخت‌افزاری لزوماً جزو محصول پایه WIS نیستند.

## ۱. خلاصه اجرایی (حداکثر ۱۵ خط)

1. **هسته محصول:** مدیریت رخدادهای باسکول، توزین اول/دوم، ثبت پلاک/RFID، قبض، ورود/خروج، مجوزهای حمل و حسابرسی.
2. **مرجع اصلی:** WIS روی Windows کار می‌کند و مدیریت داده وزن، وسیله، محصول، مشتری، قبض و گزارش سفارشی را مستند کرده است [S01، S02].
3. در کاتالوگ WIS، چاپ قبض دو توزین، کنترل وزن مجاز/تارای اسمی، نقش‌های سه‌گانه و ثبت تغییرات تأیید شده‌اند [S02، ص.۱–۲].
4. راهبند، چراغ، شناسایی پلاک و دوربین در راهکار **اتوماسیون شرکت** دیده می‌شوند؛ الزاماً ویژگی نسخه مستقل WIS نیستند [S03، S04].
5. **SUPER INSPECTOR** زیرمحصول وب‌محور با تصاویر جلو/عقب، نظارت توزین و اتصال ERP است [S05].
6. **TruckFlow** امکان چندباسکولی، چندسایتی، ثبت حضور خودرو، وزن‌های چندگانه و خروجی CSV/JSON را مستند کرده است [S11، ص.۱–۲].
7. **Avery SmarTower** RFID نوع UHF، حسگر جای‌گیری، راهنمای صوتی و نمایشگر راننده دارد [S08، S09].
8. تشخیص خطای لودسل و رانش صفر، از لایه ابزار دقیق تأمین می‌شود، نه از روی عدد وزن نهایی: TraxEMT و iQUBE² [S13، S14].
9. حجم‌سنجی LiDAR با اسکن خالی/پر، الگوی مستند Loadscan است؛ «پروفایل سه‌بعدی خودرو» در صفحه جداگانه Weighing Engineering آمده است [S15، S17].
10. KPI ناوگان مانند زمان چرخه، بار مفید، توقف و سوخت به داده عملیاتی مستقل از باسکول نیاز دارند؛ Wenco، DISPATCH و MineStar مرجع این لایه‌اند [S20–S23].
11. برای ساخت: **Edge-first, event-driven, offline-capable** با ماژول‌های قابل نصب/حذف و گزارش ممیزی غیرقابل‌ویرایش پیشنهاد می‌شود [پیشنهادی].
12. «مجوز معتبر»، «وزن قابل‌تأیید»، و «اجازه بازشدن راهبند» سه کنترل مستقل با نتیجه `PASS/REVIEW/BLOCK` باشند [پیشنهادی].
13. در مرحله نخست هیچ وزن تخمینی LiDAR نباید جایگزین وزن حقوقی/تجاری باسکول شود [پیشنهادی].
14. محدوده رقبا ناهمگن است؛ محصولات پایش سلامت، اسکنر و FMS را با نرم‌افزار باسکول یکی فرض نکرده‌ایم.

## ۲. منابع بررسی‌شده و فهرست URL

### ۲.۱ فهرست استنادی اصلی (شناسه ثابت برای ماتریس، PRD و JSON)

| کد | شرکت/محصول | آدرس دقیق | نوع و حدود مدرک |
|---|---|---|---|
| S01 | Weighing Engineering / WIS | https://www.weighing-engineering.com/products/weighbridge-automation-systems/wis-weighbridge-software.html | صفحه رسمی، قابلیت‌های نرم‌افزار |
| S02 | Weighing Engineering / Turn Key PDF | https://weighing-engineering.com/images/pdf/turn-key-system.pdf | PDF رسمی ۲ صفحه؛ جزئیات WIS، قبض، دسترسی، RFID و راهبند |
| S03 | Weighing Engineering / Turn Key System | https://weighing-engineering.com/products/weighbridge-automation-systems/turn-key-weighbridge-automation-system.html | صفحه رسمی؛ فهرست سخت‌افزار |
| S04 | Weighing Engineering / Mining | https://www.weighing-engineering.com/industries/building-materials-mines.html | صفحه صنعت معدن، ANPR، IP Camera، Induction Loop |
| S05 | Weighing Engineering / SUPER INSPECTOR | https://www.weighing-engineering.com/products/weighbridge-automation-systems/super-inspector-monitoring-system.html | صفحه رسمی، راهکار وب‌محور و تصاویر دوربین |
| S06 | Weighing Engineering / 3D profiler | https://www.weighing-engineering.com/products/3d-profiling-system/3d-profiling-system.html | صفحه رسمی، ۳ اسکنر لیزری و Point Cloud، جزو سامانه WIM |
| S07 | Weighing Engineering / Terminals | https://weighing-engineering.com/products/weighbridge-automation-systems/tpc-unattended-weighing-terminal.html | ترمینال TPC؛ کارت و اتصال LAN/RS-232 |
| S08 | Avery / SmarTower | https://www.averyweigh-tronix.com/en/product/smartower-unmanned-weighbridge-system/ | صفحه رسمی؛ UHF RFID، ویدئو، مانیتورینگ/ERP |
| S09 | Avery / SmarTower Specification | https://www.averyweigh-tronix.com/en/wp-content/uploads/sites/11/2025/08/SmarTower_UK_spec.pdf | PDF رسمی ۳ صفحه؛ ص.۲ پروتکل‌ها و سخت‌افزار |
| S10 | Avery / Weighman 8 | https://www.averyweigh-tronix.com/en/product/weighman-8-weighbridge-software/ | صفحه رسمی؛ ANPR، تارا، صورتحساب، SQL، چندسایت |
| S11 | Precia Molen / TruckFlow | https://us.preciamolen.com/wp-content/uploads/sites/22/2019/07/09-15-01-1-FT-TRUCKFLOW-V00.09.pdf | PDF رسمی نمایه‌شده، ۲ صفحه؛ بازیابی تصویر PDF ناموفق |
| S12 | Precia Molen / TruckFlow current | https://be.preciamolen.com/fr/produits/pesage-de-vehicules/logiciel-de-gestion-des-ponts-bascules-et-des-entrees/sorties | صفحه رسمی، چندسایت، ANPR، موبایل |
| S13 | Mettler Toledo / TraxEMT | https://www.mt.com/dam/ind/IND_PDF/2024/IND780-downloads/others/IND560PDX-and-IND780_MAN_30137756_R00_TraxEMT_AppGuide_EN.pdf | راهنمای رسمی PDF، ۲۹ صفحه؛ ص.۴ و فهرست مباحث تشخیص عیب |
| S14 | Rice Lake / iQUBE² | https://www.ricelake.com/products/iqube2-digital-diagnostic-junction-box?part=93243 | صفحه رسمی؛ diagnostics و رابط ارتباطی |
| S15 | Loadscan / LVS | https://www.loadscan.com/load-volume-scanner/ | صفحه رسمی؛ حجم واقعی و پروفایل 3D |
| S16 | Loadscan / MyScanner | https://www.loadscan.com/myscanner/ | صفحه رسمی؛ گزارش، اسکن، هشدار، cloud |
| S17 | Loadscan / empty-loaded workflow | https://www.loadscan.com/civil/ | صفحه رسمی؛ اسکن خالی مرجع و اسکن پر |
| S18 | Trimble / LOADRITE | https://news.trimble.com/2019-04-09-Doosan-Infracore-North-America-to-Offer-Trimbles-New-Generation-of-Loader-Onboard-Scales | منبع رسمی؛ KPI لودر و InsightHQ |
| S19 | Endel / WeighMAST | https://endel.digital/weighmast-weighbridge-software/ | صفحه سازنده، مدعی کنترل مجوز ERP، RFID/ANPR، گزارش؛ بدون آزمون مستقل |
| S20 | Wenco / Fleet | https://www.wencomine.com/our-solutions/mining-fleet-management | صفحه رسمی؛ عملیات ناوگان، KPI و داشبورد |
| S21 | Wenco / Reporting | https://www.wencomine.com/our-solutions/data-and-reporting | صفحه رسمی؛ ویجت KPI و اتصال داده |
| S22 | Komatsu / DISPATCH | https://www.komatsu.com/en-us/technology/smart-mining/loading-and-haulage/dispatch | صفحه رسمی؛ تخصیص کامیون، صف، fuel، blending |
| S23 | Cat / MineStar Fleet | https://www.cat.com/en_US/by-industry/mining/surface-mining/surface-technology/fleet.html | صفحه رسمی؛ چرخه، بار مفید، جابه‌جایی مواد و سوخت |
| S24 | Hexagon / OP Pro | https://hexagon.com/products/mine-operations | صفحه رسمی؛ دید لحظه‌ای و تولید/بهره‌برداری |
| S25 | Dariel / WBX | https://www.miningweekly.com/article/weighbridge-solution-installed-at-mpumalanga-coal-mine-2014-05-23/page%3A2 | گزارش رسانه صنعتی؛ ربط ERP/سفارش/هویت راننده، نه مستند رسمی فعلی |
| S26 | Dariel / AccessX+WBX | https://easterncapeindustrialnews.co.za/software-suite-takes-the-weight-off-logistics-operations/ | گزارش رسانه صنعتی؛ معماری خانواده محصول و کنترل دسترسی |
| S27 | Weighing Engineering / Main Categories | https://www.weighing-engineering.com/products/weighbridge-automation-systems.html | منوی رسمی زیرمحصولات |
| S28 | Weighing Engineering / LD5218 | https://www.weighing-engineering.com/products/weighbridge-automation-systems/ld5218-unattended-weighing-terminal.html | ترمینال بدون اپراتور، حافظه/چاپگر |
| S29 | Weighing Engineering / LD5290 | https://www.weighing-engineering.com/products/weighbridge-automation-systems/ld5290-unattended-weighing-terminal.html | ترمینال بدون اپراتور، سنسور و Ethernet اختیاری |
| S30 | Weighing Engineering / WIM | https://www.weighing-engineering.com/products/weigh-in-motion-systems-wim/low-speed-wim-systems-in-ground-axel-weigher.html | وزن محوری/گروهی در حرکت، سامانه جدا |
| S31 | Rice Lake / VIRTUi² | https://cms-prod.ricelake.com/products/virtui2-pc-based-hmi-for-iqube2/ | نمایش وضعیت سلول و هشدار موعد کالیبراسیون |
| S32 | Weighing Engineering / Rail variant | https://www.weighing-engineering.com/products/weighbridge-sectoral-applications/train-plus-static-weighbridge.html | WIS Train Plus (محصول متمایز)، ERP و داده قابل سفارشی‌سازی |
| S33 | Avery / Anti-fraud | https://www.averyweigh-tronix.com/en-in/wp-content/uploads/sites/4/2025/04/Anti_fraud_Portfolio_brochure_D2__002_.pdf | PDF رسمی؛ عدم پذیرش وزن دست‌ساز در WI، شواهد تصویری |
| S34 | Loadscan / Analytics | https://www.loadscan.com/myscanner-new-features-boost-efficiency-and-analytics/ | صفحه رسمی؛ گزارش نمودار، PDF/PowerPoint/Excel |
| S35 | Precia / TruckFlow distributor | https://www.processbd.com/PRECIA_MOLEN/Weigh_Bridge_and_Access_Control.html | بازنشر تجاری؛ عکس قبل/بعد و کنترل تردد |
| S36 | Weighing Engineering / logistics | https://www.weighing-engineering.com/industries/logistics.html | صفحه صنعت؛ مقایسه وزن نظری و واقعی |
| S37 | Loadscan / MPS | https://www.loadscan.com/new-mine-payload-scanner-launched-for-the-mining-industry/ | صفحه رسمی؛ نمونه توسعه‌یافته برای کامیون معدنی |
| S38 | Hexagon / case study | https://hexagon.com/-/media/project/one-web/master-site/products/hxgn-mineoperate-op-pro-hp/case_study_01_mineoperate_op_pro_lp.pdf | PDF مطالعه موردی قدیمی؛ شاهد کاربرد، نه تضمین عملکرد |

**نکته اعتبار:** اعداد بازاریابی فروشندگان (مثلاً افزایش تولید یا دقت) در این سند به‌عنوان KPI تضمین‌شده محصول جدید وارد نشده‌اند. تاریخ فهرست‌بندی موتور جست‌وجو لزوماً تاریخ انتشار سند نیست.

### ۲.۲ URLهای هدف اصلی که در دامنه دیده/بررسی شدند

دامنه اصلی با و بدون `www` در منابع ظاهر می‌شود. URLهای قابل شناسایی/بازشده شامل موارد زیر است؛ این **فهرست URLهای یافته‌شده** است، نه ادعای کشف تمام URLهای دامنه:

- https://www.weighing-engineering.com/
- https://www.weighing-engineering.com/company.html
- https://www.weighing-engineering.com/products.html
- https://www.weighing-engineering.com/products/weighbridge-automation-systems.html
- https://www.weighing-engineering.com/products/weighbridge-automation-systems/wis-weighbridge-software.html
- https://www.weighing-engineering.com/products/weighbridge-automation-systems/super-inspector-monitoring-system.html
- https://weighing-engineering.com/products/weighbridge-automation-systems/turn-key-weighbridge-automation-system.html
- https://weighing-engineering.com/products/weighbridge-automation-systems/tpc-unattended-weighing-terminal.html
- https://www.weighing-engineering.com/products/weighbridge-automation-systems/ld5218-unattended-weighing-terminal.html
- https://www.weighing-engineering.com/products/weighbridge-automation-systems/ld5290-unattended-weighing-terminal.html
- https://www.weighing-engineering.com/products/weighbridge-automation-systems/earthing-lighting-protection.html
- https://www.weighing-engineering.com/products/3d-profiling-system.html
- https://www.weighing-engineering.com/products/3d-profiling-system/3d-profiling-system.html
- https://www.weighing-engineering.com/products/weigh-in-motion-systems-wim.html
- https://www.weighing-engineering.com/products/weigh-in-motion-systems-wim/low-speed-wim-systems-in-ground-axel-weigher.html
- https://www.weighing-engineering.com/products/weigh-in-motion-systems-wim/portable-axle-weighing-system-porta-wim.html
- https://www.weighing-engineering.com/products/weighbridge-integrated-systems.html
- https://www.weighing-engineering.com/products/weighbridge-and-platforms-scales-project-integration.html
- https://www.weighing-engineering.com/products/weighbridge-sectoral-applications/train-plus-static-weighbridge.html
- https://www.weighing-engineering.com/industries/building-materials-mines.html
- https://www.weighing-engineering.com/industries/logistics.html
- https://www.weighing-engineering.com/industries/public-sector-hs-wim-ls-wim-systems.html
- https://weighing-engineering.com/images/pdf/turn-key-system.pdf
- https://www.weighing-engineering.com/images/pages/products/wis-weighbridge-software/wis-weighbridge-software-01.png
- https://www.weighing-engineering.com/images/pages/products/wis-weighbridge-software/wis-weighbridge-software-02.png
- https://www.weighing-engineering.com/images/pages/products/super-inspector-system/super-inspector-system-01.png

`https://www.weighing-engineering.com/robots.txt` و `https://www.weighing-engineering.com/sitemap.xml` درخواست شدند ولی محتوای قابل‌خواندن برنگشت. صفحه‌های «Blog / FAQ / API / Support / downloads کامل» در دامنه اصلی از طریق مسیر بررسی‌شده به فهرست قابل اثبات نرسیدند؛ ممکن است وجود داشته باشند.

### ۲.۳ تفکیک دقیق محصولات خانواده Weighing Engineering

| محصول | قابلیت مستند | چیزی که **نمی‌توان** نتیجه گرفت | شاهد |
|---|---|---|---|
| **WIS desktop** | ثبت وزن، محصول، مشتری، تراکنش، قبض، گزارش و نمایش شماتیک؛ سه سطح دسترسی در PDF | داشتن API مستند عمومی، LiDAR حجمی یا داشبورد FMS | [S01]، [S02، ص.۱–۲] |
| **Turn Key System** | ترکیب AWIS/WIS با RFID، راهبند، چراغ، حلقه القایی و ترمینال | نصب تمام اجزا در هر استقرار WIS | [S03] |
| **SUPER INSPECTOR** | مدیریت وب‌محور، اتصال ERP، ثبت تصاویر جلو/عقب | یکسان‌بودن UI/DB آن با نسخه WIS | [S05] |
| **3D Profiler / WIM** | ابعاد، پروفایل سه‌بعدی خودرو و خروجی Ethernet/Point Cloud | استخراج حجم خالص سنگ معدن با دو اسکن به‌صورت استاندارد WIS | [S06] |
| **LD5218/LD5290/TPC** | شناسایی کارت، صفحه/چاپگر و امکانات دستگاه در مدل‌های مشخص | فرکانس یا برد RFID همه نسخه‌ها | [S07، S28، S29] |
| **WIS Train Plus** | اتصال ERP، فیلدهای سفارشی، چند سکوی ریلی | انطباق مستقیم با ماژول باسکول جاده‌ای | [S32] |


## ۳. ماتریس ویژگی‌ها، هسته مشترک و نقاط تمایز

**قاعده تفسیر:** ستون‌ها محصولات متمایز هستند (نه کل سبد محصولات هر شرکت). به‌طور خاص، ردیف «WIM» برای WIS خالی می‌ماند، زیرا محصول WIM همان شرکت جداست؛ همچنین «صحت/کالیبراسیون» در WIS از وجود ابزار دقیق مجهز به تشخیص عیب استنتاج نمی‌شود. برای ویژگی‌های نامشخص هیچ «ندارد» بدون سند ثبت نشده است. در مورد محصولات فقط سخت‌افزاری (MT، RL) نبود قابلیت مدیریت مجوز نیز «نامشخص/خارج از دامنه» نوشته شده، نه رد قطعی.

| ویژگی | WIS | Weighman 8 | SmarTower | TruckFlow | Dariel WBX | WeighMAST | TraxEMT | iQUBE² | Loadscan | LOADRITE | Wenco | Hexagon | DISPATCH | MineStar | وضعیت هسته |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A1. RFID / کارت | د[S02] | د[S10] | د[S09] | د[S11] | ؟ | د[S19] | ؟ | ؟ | د[S15] | ؟ | ؟ | ؟ | ؟ | ؟ | **هسته** (6) |
| A2. پلاک‌خوان ANPR | ؟ | د[S10] | د[S09] | د[S12] | ؟ | د[S19] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | **هسته** (4) |
| A3. راهبند / چراغ | د[S02] | ؟ | د[S09] | د[S11] | ؟ | د[S19] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | **هسته** (4) |
| A4. حسگر جایگیری صحیح | ؟ | ؟ | د[S09] | ؟ | ؟ | د[S19] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | متمایز/محدود (2) |
| A5. ترمینال/راهنمای راننده | ؟ | د[S10] | د[S09] | د[S11] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | **هسته** (3) |
| B1. ثبت وزن و قبض | د[S01] | د[S10] | د[S09] | د[S11] | د[S25] | د[S19] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | **هسته** (6) |
| B2. توزین اول/دوم | د[S02] | ؟ | ؟ | د[S11] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | متمایز/محدود (2) |
| B3. تارای ذخیره/اسمی | د[S02] | د[S10] | ؟ | د[S11] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | **هسته** (3) |
| B4. توزین محوری/WIM | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | متمایز/محدود (0) |
| C1. مشتری/محصول/شرکت حمل | د[S01] | د[S10] | ؟ | د[S11] | د[S25] | ؟ | ؟ | ؟ | د[S16] | ؟ | ؟ | ؟ | ؟ | ؟ | **هسته** (5) |
| D1. تطبیق سفارش/مجوز | ؟ | ؟ | ؟ | ؟ | د[S25] | د[S19] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | متمایز/محدود (2) |
| D2. کنترل وزن مجاز | د[S02] | ؟ | ؟ | ؟ | ؟ | د[S19] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | متمایز/محدود (2) |
| E1. ثبت زمان حضور/عبور/رخداد | ؟ | د[S10] | ؟ | د[S11] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | د[S20] | ؟ | د[S22] | د[S23] | **هسته** (5) |
| F1. رانش صفر و سلامت لودسل | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | د[S13] | د[S14] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | متمایز/محدود (2) |
| F2. هشدار موعد کالیبراسیون | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | د[S31] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | متمایز/محدود (1) |
| G1. اسکن حجم / پروفایل 3D | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | د[S15] | ؟ | ؟ | ؟ | ؟ | ؟ | متمایز/محدود (1) |
| G2. اسکن خالی/پر | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | د[S17] | ؟ | ؟ | ؟ | ؟ | ؟ | متمایز/محدود (1) |
| H1. تولید/شیفت/زمان چرخه | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | د[S18] | د[S20] | د[S24] | د[S22] | د[S23] | **هسته** (5) |
| H2. پایش بار مفید ناوگان | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | د[S18] | د[S20] | ؟ | د[S22] | د[S23] | **هسته** (4) |
| H3. مدیریت صف/Dispatch | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | د[S20] | ؟ | د[S22] | د[S23] | **هسته** (3) |
| I1. گزارش/خروجی | د[S02] | د[S10] | د[S09] | د[S11] | ؟ | د[S19] | ؟ | ؟ | د[S16] | د[S18] | د[S21] | د[S24] | د[S22] | د[S23] | **هسته** (11) |
| I2. داشبورد cloud/mobile | ؟ | د[S10] | د[S08] | د[S12] | ؟ | د[S19] | ؟ | ؟ | د[S16] | د[S18] | د[S21] | ؟ | ؟ | ؟ | **هسته** (7) |
| J1. اتصال ERP/Back-office | ؟ | د[S10] | د[S08] | د[S11] | د[S25] | د[S19] | ؟ | ؟ | ؟ | ؟ | د[S21] | ؟ | ؟ | ؟ | **هسته** (6) |
| K1. سطوح دسترسی/Audit | د[S02] | د[S10] | د[S09] | د[S11] | ؟ | د[S19] | ؟ | ؟ | د[S16] | ؟ | ؟ | ؟ | ؟ | ؟ | **هسته** (6) |
| L1. چندسایت/چندباسکول | ؟ | د[S10] | د[S08] | د[S11] | ؟ | د[S19] | ؟ | ؟ | د[S16] | ؟ | د[S21] | ؟ | ؟ | ؟ | **هسته** (6) |
| L2. آفلاین با همگام‌سازی | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | د[S18] | ؟ | ؟ | ؟ | ؟ | متمایز/محدود (1) |
| L3. پروتکل اعلام‌شده Serial/TCP | ؟ | ؟ | د[S09] | د[S11] | ؟ | د[S19] | ؟ | د[S14] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | **هسته** (4) |

**توضیحات محدودیت انتساب:** ANPR در مستندات خانواده Weighing Engineering [S04] آمده، اما برای WIS مستقل در جدول «؟» است. محصول جداگانه WIM/3D این شرکت، ویژگی‌های [S06، S30] را دارد، ولی در ستون WIS افزوده نشده است. SmarTower در [S09] از ANPR به‌عنوان گزینه (Optional) یاد می‌کند. اعداد داخل پرانتز نشان‌دهنده **تعداد محصولات دارای شاهد صریح** هستند و به معنی تعداد نصب‌های واقعی یا سطح بلوغ نیستند. سلول «د» به معنی قابلیت مستند، و نه الزاماً پیش‌فرض یا در بسته پایه، است.

**هسته قابل اتکا (حداقل ۳ محصول شاهددار):**

A1. RFID / کارت؛ A2. پلاک‌خوان ANPR؛ A3. راهبند / چراغ؛ A5. ترمینال/راهنمای راننده؛ B1. ثبت وزن و قبض؛ B3. تارای ذخیره/اسمی؛ C1. مشتری/محصول/شرکت حمل؛ E1. ثبت زمان حضور/عبور/رخداد؛ H1. تولید/شیفت/زمان چرخه؛ H2. پایش بار مفید ناوگان؛ H3. مدیریت صف/Dispatch؛ I1. گزارش/خروجی؛ I2. داشبورد cloud/mobile؛ J1. اتصال ERP/Back-office؛ K1. سطوح دسترسی/Audit؛ L1. چندسایت/چندباسکول؛ L3. پروتکل اعلام‌شده Serial/TCP؛ و تمام موارد فوق با کد منبع سلولی قابل بازبینی‌اند.

**قابلیت‌های ویژه، خارج از هسته:** تشخیص خرابی تک‌لودسل و رانش صفر [S13، S14]؛ استخراج حجم اسکن خالی/پر با مقطع سه‌بعدی [S15–S17]؛ تطبیق مستقیم سفارش/مجوز فروش/حمل [S19، S25]؛ هشدار موعد کالیبراسیون [S31]؛ ابزار dispatch و مدل دیجیتال زنده ناوگان [S22]؛ ثبت جلو/عقب در SUPER INSPECTOR [S05]؛ پروفایل LIDAR ابعاد خودرو در WIM شرکت اصلی [S06].

**تصمیم طراحی:** هسته پیشنهادی ما شامل همه عملکردهای A/B/C/D/E/I/J/K برای عملیات حقوقی توزین است، **حتی اگر بعضی سطرها در حد ۳ محصول تأیید نشده باشند**؛ «هسته آماری بازار» با «اولویت پیاده‌سازی تجاری» یک مفهوم نیست. تشخیص سلامت F، LiDAR G و FMS H افزونه مستقل می‌مانند.

## ۴. PRD — سند نیازمندی‌های محصول

### ۴.۱ مسئله، دامنه و مرزبندی

**مسئله:** در بسیاری از معادن، داده‌های توزین، تردد، بارنامه، دوربین، مجوز حمل، تولید شیفت، سلامت باسکول و اطلاعات لودر در سامانه‌های منفک ثبت می‌شوند. خروجی مطلوب، **زنجیره شواهد یکپارچه برای هر سفر** است: `Vehicle → Identity → Permit → Gate Events → Weigh Events → Material → Dispatch → Exit → Audit`. این تعریف یک **پیشنهاد مهندسی** است و ادعای وجود این زنجیره در WIS نیست. الگوی تجمیع عملیات توزین از [S01، S02، S11] و الگوی اتصال لجستیک/تولید از [S19–S23] الهام گرفته شده است.

**دامنه Release 1 (MVP):** یک سایت با چند خط/باسکول، صفحه اپراتور لحظه‌ای، شناسایی RFID و ANPR قابل تعویض، ثبت دستی کنترل‌شده، توزین اول/دوم، حواله/مجوز، راهبند، ثبت تصویر، قبض، گزارش و Audit، قابلیت آفلاین در Edge. **افزودنی‌های Release 2:** سلامت لودسل و داشبورد تجهیزات، LiDAR خالی/پر و KPI واقعی ناوگان از داده‌های بیرونی. **خارج از Release 1:** الگوریتم بهینه‌سازی dispatch ناوگان در مقیاس معدن، نگهداری پیش‌بینانه مبتنی بر مدل آموزش‌دیده، اندازه‌گیری قانونی مبتنی بر LiDAR، ERP کامل، صدور مجوز قانونی در سامانه‌های دولتی بدون API معتبر.

### ۴.۲ نقش‌ها و مجوزهای کاربردی

| Role | مسئولیت/دسترسی مجاز | ممنوعیت یا کنترل بحرانی | پیشینه |
|---|---|---|---|
| `gate_guard` نگهبان | مشاهده ورود و خروج، ثبت وضعیت و استثنای پلاک | تغییر وزن ممنوع | پیشنهادی؛ الگوی سه نقش [S02] |
| `scale_operator` اپراتور توزین | مشاهده Weight Live، ثبت توزین مجاز، چاپ قبض | Override فقط با تأیید جدا | [S02، S11] + پیشنهادی |
| `dispatch_officer` متصدی حواله | ایجاد/اصلاح سفارش و مجوز و سهمیه | تغییر مقدار وزن ثبت‌شده ممنوع | پیشنهادی با قیاس [S19، S25] |
| `shift_supervisor` سرپرست شیفت | تأیید استثنا، تغییر وضعیت سفر، گزارش شیفت | ویرایش غیرقابل‌ردیابی ممنوع | [S02، S11] + پیشنهادی |
| `maintenance_engineer` تعمیرات/مترولوژی | وضعیت لودسل، گواهی، سرویس، Quarantine | دسترسی به اطلاعات مالی حداقلی | [S13، S14، S31] + پیشنهادی |
| `finance_logistics` مالی/فروش | کنترل حواله، بارنامه، صورت‌حساب، خروجی ERP | فرمان مستقیم به راهبند ممنوع | [S10، S19] + پیشنهادی |
| `fleet_analyst` تحلیلگر ناوگان | KPI تولید، زمان چرخه، مسیر/پیش‌بینی | اصلاح Raw Weigh Event ممنوع | [S20–S23] + پیشنهادی |
| `auditor` حسابرس | گزارش فقط‌خواندنی و دسترسی به Evidence Bundle | حذف رکورد و تغییر Rule ممنوع | [S02، S10] + پیشنهادی |
| `system_admin` مدیر سامانه | تعریف دستگاه، تنظیمات و دسترسی‌ها | اصلاح وزن/گواهی بدون فرایند کنترل‌شده ممنوع | [S02، S11] + پیشنهادی |
| `integration_service` حساب سرویس | درج رخداد امضاشده و بازیابی با Scope مشخص | رابط کاربری و Override انسانی ممنوع | پیشنهادی |

**جداسازی وظایف (SoD):** کسی که وزن را ثبت می‌کند نباید به‌تنهایی مجوز نامعتبر را تأیید و راهبند را باز کند. تمام Overrideها به دلیل، هویت، زمان، تصویر مرتبط و امضای تصمیم نیاز دارند. حذف فیزیکی رویدادهای عملیاتی از UI ممنوع؛ تصحیح فقط با رویداد جبرانی (Compensating Event).

### ۴.۳ داستان‌های کاربر (User Stories) و معیار پذیرش

- `US-01` راننده: با RFID/پلاک شناسایی شوم تا بدون ورود دوباره اطلاعات مجوز و سفر تشخیص داده شود. **AC:** RFID و پلاک متعارض ⇒ ورود به `IDENTITY_REVIEW`، عدم بازشدن خودکار راهبند [الهام: S08، S11؛ تصمیم پیشنهادی].
- `US-02` اپراتور: فقط زمانی وزن را ثبت کنم که عدد پایدار و کامیون کامل روی صفحه باسکول باشد. **AC:** نبود سیگنال `stable`, `occupied` یا `position_ok` ⇒ Capture Block و نمایش دلیل [الهام: S09، S19؛ تصمیم پیشنهادی].
- `US-03` مالی: وزن خالص و ماده را با مانده حواله مقایسه و مصرف مجوز را کنترل کنم. **AC:** مقدار مصرف‌شده بیش از مانده مجاز بعد از اعمال تلرانس ⇒ `BLOCK/REVIEW` بدون مصرف سهمیه [الهام: S19، S25؛ تصمیم پیشنهادی].
- `US-04` نگهبان: پلاک/تصویر ورود و خروج و زمان‌های حضور را در یک رکورد ببینم. **AC:** Eventها UTC ذخیره شوند و در UI با منطقه زمانی سایت نمایش داده شوند [الهام: S05، S11؛ پیشنهادی].
- `US-05` سرپرست: خودروهایی که بیش از آستانه تعیین‌شده در سایت مانده‌اند ببینم. **AC:** هشدار برای سفر باز، و بستن هشدار پس از خروج ثبت‌شده [S11؛ پیشنهادی].
- `US-06` تعمیرات: با انقضای گواهی یا هشدار لودسل، وضعیت قانونی باسکول را ببینم. **AC:** سلامت سیگنال، گواهی کالیبراسیون و اجازه استفاده تجاری سه وضعیت جدا باشند [S13، S14، S31؛ پیشنهادی].
- `US-07` حسابرس: تمام مبنای یک توزین شامل Raw Indicator، عکس‌ها، هویت، Rule Results و نسخه مجوز را بازسازی کنم. **AC:** جست‌وجو با `transaction_id` و Export با Hash فایل‌ها [S02، S33؛ پیشنهادی].
- `US-08` تحلیلگر: تولید شیفت را بر اساس ماده، باسکول، شرکت حمل و محل بارگیری مشاهده کنم. **AC:** وزن‌های ثبت‌شده تکراری محاسبه نشوند؛ Eventهای برگشتی (reversal) در گزارش اصلاحی منعکس شوند [S02، S20؛ پیشنهادی].
- `US-09` اپراتور: در قطع اینترنت تراکنش‌های سایت را ادامه بدهم. **AC:** با صف محلی، شناسه یکتا و بازپخش idempotent، رکورد دوباره ایجاد نشود [S18 برای الگوی cache/sync؛ پیشنهادی].
- `US-10` تحلیلگر حجم: پروفایل خالی و پر را کنار هم ببینم و مقدار `m³` را با وزن واقعی مقایسه کنم. **AC:** بدون مرجع خالی معتبر، Volume Status=`UNVERIFIED` [S15، S17؛ پیشنهادی].
- `US-11` مدیر تجهیزات: اختلاف بار مفید لودر و وزن خالص باسکول را برای سفر یکسان ببینم. **AC:** در صورت نامعتبر بودن تطبیق سفر، KPI اختلاف «فاقد داده کافی» نمایش داده شود [S18، S23؛ پیشنهادی].

### ۴.۴ الزامات عملکردی با شناسه ثابت

تمام الزامات زیر **برای محصول پیشنهادی** هستند. ستون «استناد/مبنای طراحی» نشان می‌دهد الگوی عملکرد در کدام محصول مستند شده است؛ وجود دقیق الزام در آن محصول را تضمین نمی‌کند. `Must` = نسخه پایه، `Should` = فاز بعدی، `Could` = افزونه.

| ID | نیازمندی قابل آزمون | اولویت | شاهد/رده |
|---|---|---|---|
| FR-01 | تعریف `Site`, `Lane`, `Gate`, `Scale` و اتصال دستگاه به مسیر ورود/خروج | Must | [S03، S11]؛ پیشنهادی |
| FR-02 | ادغام رویدادهای RFID با Tag ID، Reader ID، زمان و کیفیت خوانش | Must | [S02، S09]؛ پیشنهادی |
| FR-03 | ثبت Plate Read همراه OCR confidence، Snapshot و تطبیق با RFID | Must | [S04، S10]؛ پیشنهادی |
| FR-04 | تشخیص حضور کامل خودرو روی باسکول از حسگرهای اختصاصی و وضعیت راهبند | Must | [S09، S19]؛ پیشنهادی |
| FR-05 | نمایش وزن زنده، Stable/Motion، Zero/Tare و وضعیت اتصال ابزار | Must | [S02؛ ص.۱، S13]؛ پیشنهادی |
| FR-06 | توزین اول/دوم مستقل از جهت ورود و نوع بار، با محاسبه Gross/Tare/Net | Must | [S02، S11]؛ پیشنهادی |
| FR-07 | تعریف تارای ثبت‌شده با اعتبار زمانی و بازبینی اختلاف تارا | Must | [S02، S10]؛ پیشنهادی |
| FR-08 | پشتیبانی از چند باسکول، تغییر باسکول توزین دوم با Rule و ثبت دلیل | Must | [S02، S11]؛ پیشنهادی |
| FR-09 | تعریف `Vehicle`, `Driver`, `Carrier`, `Customer`, `Material` و ارتباط تاریخی | Must | [S01، S11]؛ پیشنهادی |
| FR-10 | دریافت/تعریف `Permit`, `SalesOrder`, `DeliveryNote` و ثبت سهمیه باقی‌مانده | Must | [S19، S25]؛ پیشنهادی |
| FR-11 | اعتبارسنجی مجوز: بازه زمانی، وسیله، راننده، ماده، مبدأ/مقصد و مانده وزنی | Must | [S19، S25]؛ پیشنهادی |
| FR-12 | ثبت Gate Entry/Exit، زمان‌ماند و بازه صف و Time-in-State | Must | [S11]؛ پیشنهادی |
| FR-13 | ذخیره عکس زمان وزن، ورود/خروج و قبل/بعد همراه Hash و برچسب دوربین | Must | [S05، S09، S11]؛ پیشنهادی |
| FR-14 | سیاست کنترلی راهبند/چراغ از روی `PERMIT+IDENTITY+WEIGHT+SAFETY` | Must | [S03، S09، S11]؛ پیشنهادی |
| FR-15 | چاپ قبض و صدور PDF/CSV/XLSX با نسخه، شمارۀ ردیابی و QR بررسی اصالت | Must | [S02، S11]؛ QR پیشنهادی |
| FR-16 | داشبورد عملیات: وزن زنده، صف، وسایل حاضر، تراکنش باز، مجوزهای مشکوک | Must | [S02، S11، S19]؛ پیشنهادی |
| FR-17 | گزارش فیلترپذیر: سفر، ماده، شرکت، وزن، تاریخ، شیفت و خط/باسکول | Must | [S02، S11]؛ پیشنهادی |
| FR-18 | RBAC و Audit Trail ثبت ورود کاربر، تغییر تنظیمات، Override و تغییر مجوز | Must | [S02، S10]؛ پیشنهادی |
| FR-19 | Event Store و Edge Queue با Sync و جلوگیری از تراکنش تکراری | Must | [S18 برای cache؛ معماری پیشنهادی] |
| FR-20 | API و Outbox یکپارچه‌سازی ERP/مالی + Idempotency و Reconciliation | Must | [S05، S19]؛ پیشنهادی |
| FR-21 | پیامک/ایمیل، الگو و Retry با قوانین دریافت هشدار | Should | [S19، S16]؛ پیشنهادی |
| FR-22 | پایش Zero Drift، سلامت لودسل، خطاهای عدم‌تقارن از سخت‌افزار پشتیبان | Should | [S13، S14]؛ پیشنهادی |
| FR-23 | مدیریت CalibrationRecord، گواهی، تاریخ سررسید و توقف استفاده تجاری | Should | [S31]؛ پیشنهادی |
| FR-24 | تشخیص تقلب: خودرو ناقص روی باسکول، تکرار وزن، تناقض هویت/عکس، تعویض تگ | Must | [S09، S19، S33]؛ پیشنهادی |
| FR-25 | ماژول اسکن خالی/پر LiDAR و نمایش Point Cloud و Volume | Could | [S15–S17]؛ پیشنهادی |
| FR-26 | تخمین وزن حجمی با Density نسخه‌بندی‌شده، نمایش عدم قطعیت و مقایسه با باسکول | Could | [S15]؛ تبدیل پیشنهادی |
| FR-27 | دریافت PayloadEvent از لودر/شاول و تطبیق با تراکنش باسکول | Could | [S18، S23]؛ پیشنهادی |
| FR-28 | ماژول KPI واقعی ناوگان: چرخه، توقف، سفر، تولید، بار مفید و سوخت | Could | [S20–S23]؛ پیشنهادی |
| FR-29 | چندسایتی و داشبورد مرکزی با تعیین مالکیت داده برای هر سایت | Should | [S10، S11، S19]؛ پیشنهادی |
| FR-30 | هشدار استاندارد با Severity، Acknowledge، Escalate، Resolve و شواهد | Must | [S14، S19]؛ پیشنهادی |
| FR-31 | حالت Manual Exception فقط با اختیار مشخص، دلیل و بدون جعل داده دستگاه | Must | [S11، S33]؛ پیشنهادی |
| FR-32 | بسته شواهد تراکنش (Evidence Bundle) با وزن خام، تصویر، رخداد، تصمیم Rule و هش | Must | [S02، S05، S33]؛ پیشنهادی |

### ۴.۵ الزامات غیرعملکردی و معیارهای تست

**تمام اعداد زیر «هدف پیشنهادی پذیرش» هستند و مشخصات ادعاشده رقبا نیستند.** عددها باید پیش از تعهد قراردادی با پیمایش شبکه، تجهیزات و بار سایت نهایی شوند.

| ID | الزام / معیار پذیرش پیشنهادی | آزمون اثبات |
|---|---|---|
| NFR-01 | هیچ رویداد تأیید وزن در قطع اینترنتِ بیرونی از بین نرود، به شرط فعال‌بودن ذخیره‌سازی محلی | شبیه‌سازی قطع WAN و Restart، کنترل شمارش Event |
| NFR-02 | هر درخواست با `idempotency_key` تکراری تنها یک تراکنش مؤثر بسازد | ارسال ۱۰۰ بار پیام تکراری، مقایسه شمار رکورد |
| NFR-03 | مسیر ذخیره WeightEvent فقط از Adapter مورد تأیید و ثبت Device Identity انجام شود | آزمون جعل Client-side Weight و بررسی رد |
| NFR-04 | نمایش وزن زنده با وضعیت اتصال و زمان آخرین داده؛ هر داده قدیمی به‌وضوح `STALE` شود | توقف Serial/TCP و بازبینی UI |
| NFR-05 | زمان پاسخ صفحه عملیاتی در شبکه LAN سالم هدف `p95 ≤ 2s` بدون بارهای سنگین | Load Test با سناریوی واقعی؛ هدف پیشنهادی |
| NFR-06 | هدف `≥ 99.5%` دسترس‌پذیری خدمات محلی در دوره توافق‌شده، بدون شمارش خاموشی برنامه‌ریزی‌شده | شاخص Monitoring و گزارش توقف؛ هدف پیشنهادی |
| NFR-07 | تمام زمان‌ها ISO 8601 با UTC و شناسه منطقه زمانی IANA سایت؛ نمایش به تقویم/زبان UI | تست عبور از نیمه‌شب و DST |
| NFR-08 | نقش‌ها Default Deny، MFA برای مدیران، TLS داخلی در صورت امکان و رمزنگاری در حالت سکون | Security Review، PenTest، RBAC Regression |
| NFR-09 | Audit Event فقط افزایشی، پیوند Hash یا WORM برای شواهد حساس | تست تغییر غیرمجاز و صحت‌سنجی Hash |
| NFR-10 | همه مسیرهای `Gate Open` fail-safe با اینترلاک سخت‌افزاری و E-Stop مستقل | FAT/SAT مطابق طراحی ایمنی پروژه؛ سامانه نرم‌افزاری جایگزین Safety PLC نیست |
| NFR-11 | فهرست تراکنش و گزارش ماهانه قابل جست‌وجو با صفحه‌بندی و ایندکس | Query Plan و Load Test در حجم داده تأییدشده |
| NFR-12 | نسخه‌بندی API، Schema و Device Driver؛ راه‌اندازی افزونه بدون تغییر رکوردهای تاریخی | Compatibility Test و Migration Test |
| NFR-13 | فایل تصویر و Point Cloud در Object Storage با Lifecycle و Retention قابل تنظیم | آزمون Backup/Restore و Access Policy |
| NFR-14 | هر یکپارچه‌سازی خارجی دارای Retry+DLQ، ثبت Failure و امکان Reconciliation | قطع ERP و ارسال مجدد در شرایط مختلف |
| NFR-15 | UTF-8، فارسی RTL و انگلیسی LTR، تاریخ شمسی فقط لایه نمایش و واحد وزن SI | آزمون کاربری و Localisation |
| NFR-16 | عملکرد تصمیم‌گیری محلی Gate مستقل از اینترنت عمومی؛ Ruleهای حقوقی وابسته به ERP طبق سیاست Offline سایت | قطع ارتباط ERP و مشاهده `HOLD` در Permitهای نامعتبر/نامشخص |

**نکته استاندارد و مقررات:** معیارهای قانونی تأیید ترازو، تلرانس وزن، اعتبار گواهی، ارزش اثباتی پلاک و مجوزهای حمل باید بر اساس حوزه قضایی، نوع کاربرد تجاری و آزمون مرجع صلاحیت‌دار تعریف شوند؛ برای این پروژه هیچ حد یا مقرره ایرانی بدون متن رسمی به‌عنوان حقیقت اعلام نشده است `[Unverified]`.

## ۵. جریان‌های کاری اصلی (Workflow & State Machine)

### ۵.۱ حالت‌های تراکنش

`CREATED → GATE_IDENTIFIED → ENTRY_AUTHORIZED → SITE_ENTERED → FIRST_WEIGHT_CAPTURED → LOADING_OR_UNLOADING → SECOND_WEIGHT_CAPTURED → PERMIT_VALIDATED → EXIT_AUTHORIZED → EXITED → CLOSED`

حالت‌های جانبی: `IDENTITY_REVIEW`, `HOLD`, `OVERRIDE_PENDING`, `ABORTED`, `REVERSED`, `SYNC_PENDING`, `SYNC_ERROR`. تغییر State فقط با رخداد ثبت‌شده و Guard معتبر انجام شود؛ `CLOSED` دوباره به `WEIGHING` نمی‌رود مگر تراکنش اصلاحی مرتبط ایجاد شود. این نمودار پیشنهادی است.

### ۵.۲ مسیر خروج ماده معدنی از معدن (Out-bound)

1. **Pre-advice:** مالی/فروش `SalesOrder` و `Permit` با ماده، سقف مقدار، مبدأ، مقصد، مشتری/حمل‌کننده، تاریخ اعتبار و وسایل مجاز بارگذاری کند؛ نسخه مجوز ذخیره شود (`FR-10,11`) [الگو: S19، S25].
2. **ورود در گیت:** Sensor حضور ⇒ تصویر دوربین ⇒ ANPR/OCR و RFID ⇒ `IdentityResolver`؛ Confidence و ناسازگاری‌ها حفظ شوند، نه اینکه فقط متن نهایی پلاک ذخیره شود (`FR-02,03`).
3. **کنترل مجوز اولیه:** بررسی فعال‌بودن سفارش، راننده، خودرو و محدودیت ورود. اگر ERP قطع و سیاست سایت «Fail Closed» باشد، ورود در `HOLD` بماند؛ برای شرایط اضطراری روند تأیید دستی جدا شود (`FR-11,14`).
4. **ورود به باسکول ۱:** چراغ قرمز تا رسیدن به حالت آزاد؛ Sensorها تأیید کنند کل خودرو روی صفحه است؛ Weight Adapter برچسب‌های `stable`,`motion`,`overload`,`zero` را گزارش کند (`FR-04,05`).
5. **ثبت وزن اول (تارای خالی):** اگر نوع سفر `OUTBOUND_LOADING` و خودرو خالی تأیید شده، `tare_kg = first_weight_kg` ثبت شود. تصویر همزمان و وضعیت خام اتصال ضمیمه گردد. استفاده از تارای ذخیره‌ای باید Rule مستقل داشته باشد (`FR-06,07,13`).
6. **بارگیری:** کامیون به محل بارگیری حرکت کند. اگر Loader/Onboard Payload موجود بود PayloadEventها به سفر ملحق شوند؛ عدم وجود آن مانع فرایند MVP نیست (`FR-27`).
7. **توزین دوم (وزن ناخالص):** با امکان استفاده از باسکول دوم [S02]، مجدداً کنترل هویت، Sensor، Stable Weight و تصویر انجام شود. `gross_kg = second_weight_kg` و `net_kg = gross_kg - tare_kg`؛ اگر منفی/نامعتبر باشد `HOLD`، نه `abs()` یا تصحیح خودکار.
8. **تطبیق مجوز و محدودیت‌ها:** مقایسه `net_kg` با `remaining_qty_kg` و `gross_kg` با `vehicle_legal_gvw_kg`؛ اختلاف پلاک/Tag، مغایرت ماده/مقصد و انقضای مجوز نیز بررسی شود. مصرف سهمیه فقط در تراکنش پایگاه داده اتمیک انجام شود (`FR-11,24`).
9. **صدور سند:** قبض با شناسه یکتا، شماره باسکول/سریال دستگاه، Gross/Tare/Net، زمان‌ها، طرف‌های تجاری، مجوز و وضعیت Rule ایجاد شود؛ نسخه PDF/چاپ و Outbox ERP تولید شود (`FR-15,20`).
10. **خروج:** تنها پس از ثبت `EXIT_AUTHORIZED` راهبند فرمان بگیرد؛ با Sensor خروج، `GateEvent` و `SITE_EXITED_AT` ثبت و زمان حضور محاسبه شود؛ شکست بازشدن راهبند با «مجوز خروج صادر شده» یکی نیست (`FR-12,14`).
11. **بستن سفر و حسابرسی:** `CLOSED` پس از تأیید خروج و ثبت سند نهایی؛ صورت‌حساب/ERP می‌تواند با Retry بعدی همگام شود، با برچسب `ERP_SYNC_PENDING` (`FR-19,20,32`).

### ۵.۳ مسیر ورود ماده/تخلیه (Inbound)

در ورود بار به معدن، کامیون ابتدا **باردار** وارد می‌شود: `first_weight = gross_kg`، پس از تخلیه `second_weight = tare_kg`. بنابراین نباید فرض شود «وزن اول همیشه تارا است». `net_kg = gross_kg - tare_kg` در هر دو حالت صحیح است **پس از شناسایی قطعی** نقش وزن اول و دوم. داده مقصد یا بارنامه جهت تشخیص/اعتبارسنجی به‌کار می‌رود و جنس ماده باید مستقل بررسی شود [S02، S11؛ منطق پیشنهادی].

### ۵.۴ شاخه‌های استثنا و رفتار الزامی

| وضعیت | تشخیص | رفتار پیشنهادی |
|---|---|---|
| پلاک با RFID ناسازگار | Match conflict | `IDENTITY_REVIEW`، ذخیره هر دو داده خام و تصویر، Override فقط Supervisor |
| خودرو نصفه روی باسکول | Position sensor false | ثبت وزن ممنوع؛ چراغ قرمز و پیام راننده |
| وزن ناپایدار | Motion / unstable indicator flag | Capture ممنوع؛ عدم میانگین‌گیری دستی برای دورزدن سیگنال |
| قطع لینک باسکول | Device offline/stale | Halt capture؛ امکان انتقال به باسکول دیگر پس از ثبت علت |
| انقضای گواهی | تاریخ/وضعیت Certified Scale | `SCALE_NOT_CERTIFIED` و منع وزن تجاری طبق سیاست مقررات |
| مجوز تکراری/اتمام مانده | Reservation collision | قفل اتمیک سهمیه؛ Replay بدون دوباره‌مصرف |
| خطای ERP | HTTP timeout, 5xx | Outbox Retry، جداکردن نتیجه محلی و وضعیت Sync |
| ورود بی‌خروج در پایان شیفت | Open site visit | انتقال به شیفت بعد و هشدار زمان ماند؛ هرگز خروج مصنوعی نساز |
| اسکن خالی نامعتبر | Mismatched body geometry | حجم `UNVERIFIED`، حفظ وزن رسمی باسکول |

### ۵.۵ الگوریتم تصمیم در گیت — مرز کنترل نرم‌افزار و سخت‌افزار

```text
Identity = resolve(RFID, Plate, VehicleRegistry)
Safety = position_ok AND lane_clear AND barrier_interlocks_ok
ScaleResult = stable AND indicator_online AND scale_status_allows_trade_use
PermitResult = validate(permit, vehicle, material, direction, date, remaining_qty)

if emergency_stop or not Safety:  GATE = BLOCK
elif Identity == CONFLICT:        GATE = REVIEW
elif PermitResult == BLOCK:       GATE = BLOCK
elif transaction_requires_weight and not ScaleResult: GATE = HOLD
elif unresolved_alert_severity == CRITICAL: GATE = HOLD
else:                             GATE = PASS

# در اجرای واقعی، هر Command باید توسط PLC/Controller با interlock مستقل تأیید شود.
```

برای خروجی واقعی فرمان راهبند از `Action Gateway` به کنترلر صنعتی ارسال و بازخورد `OPEN_CONFIRMED/FAILED` با timeout و retry کنترل‌شده ثبت شود. Reset ایمنی و توقف اضطراری خارج از کنترل صرفاً نرم‌افزاری قرار گیرد. 

## ۶. مدل داده و قرارداد داده (Data Model)

### ۶.۱ قرارداد کلی

- **پایگاه داده عملیاتی پیشنهادی:** PostgreSQL یا SQL Server؛ **تصمیم پیشنهادی** و نه ادعای تکنولوژی داخلی WIS. Weighman 8 استفاده از Microsoft SQL Server را اعلام می‌کند [S10] و TruckFlow در بروشور قدیمی C#.NET/WPF و SQL Server را توصیف می‌کند [S11].
- **کلیدها:** شناسه‌های `UUID`، `site_id` و `tenant_id` برای تفکیک مالکیت؛ `external_id` برای ارتباط ERP؛ `idempotency_key` و `source_event_id` برای جلوگیری از تکرار.
- **زمان و واحد:** `*_at` با UTC ISO-8601، `*_kg` جرم برحسب کیلوگرم، `*_m3` حجم مترمکعب، `density_kg_m3` چگالی حجمی توده. نمایش تن صرفاً `kg/1000` با گردکردن UI؛ ذخیره تا دقت مؤثر تاییدشده ابزار، نه دقت جعلی.
- **اعتبار تاریخی:** فیلدهای مهم کارت، پلاک، مجوز، مشتری، دستگاه و چگالی Snapshot/Version داشته باشند تا ویرایش اطلاعات مرجع گذشته را عوض نکند.
- **شواهد:** URL عکس/ابرنقاط تنها Pointer است؛ فایل، اندازه، Hash SHA-256، Source Camera، زمان و Retention Policy در Object Storage ثبت شود.
- **زنجیره تکرارنشدنی:** رویداد اولیه (`raw`) تغییرناپذیر؛ تصحیح با رویداد جدا، `supersedes_event_id` و دلیل به‌جای UPDATE خام.

### ۶.۲ جداول اصلی و ستون‌های محوری

تمام این مدل **پیشنهادی** است. موجودیت‌ها از داده‌های WIS/TruckFlow (وسیله، محصول، مشتری، توزین، عبور) و دیگر راهکارها الهام گرفته شده‌اند [S01، S02، S11، S16، S20].

| Entity | فیلدهای پایه (نام فنی : نوع پیشنهادی) | قیود و رابطه |
|---|---|---|
| `Site` | `id:uuid`, `name:text`, `timezone:text`, `is_active:boolean`, `policy_version:text` | چند باسکول، چند گیت؛ کلید Tenant |
| `Lane` | `id:uuid`, `site_id:uuid`, `direction:enum`, `gate_id:uuid`, `scale_id:uuid?` | تعریف ورودی/خروجی/دوطرفه |
| `Vehicle` | `id:uuid`, `plate_normalized:text`, `plate_raw:text`, `country_code:text?`, `type:enum`, `legal_gvw_kg:decimal?`, `nominal_tare_kg:decimal?`, `rfid_tag_id:uuid?`, `active:boolean` | یکتایی پلاک در قلمرو مقررات و بازه اعتبار؛ تارا نسخه‌بندی شود |
| `Driver` | `id:uuid`, `full_name:text`, `identity_ref:text?`, `license_ref:text?`, `valid_from:date?`, `valid_to:date?`, `carrier_id:uuid?` | داده هویتی با حداقل‌گرایی، رمزنگاری و RBAC |
| `Carrier` | `id:uuid`, `legal_name:text`, `tax_ref:text?`, `contact_ref:text?`, `active:boolean` | رابطه با خودرو/راننده و قرارداد |
| `Customer` | `id:uuid`, `legal_name:text`, `account_ref:text?`, `erp_ref:text?`, `type:enum` | خریدار/تأمین‌کننده، نقش در Transaction Snapshot |
| `Material` | `id:uuid`, `code:text`, `name:text`, `category:text`, `grade:decimal?`, `grade_unit:text?`, `density_kg_m3:decimal?`, `density_method:text?` | عیار/چگالی تنها در صورت وجود اندازه‌گیری معتبر |
| `Permit` | `id:uuid`, `permit_no:text`, `permit_type:enum`, `sales_order_no:text?`, `material_id:uuid`, `customer_id:uuid?`, `source_location_id:uuid?`, `destination_location_id:uuid?`, `valid_from:timestamptz`, `valid_to:timestamptz`, `max_qty_kg:decimal?`, `consumed_qty_kg:decimal`, `status:enum`, `version:int` | کنترل همزمانی مصرف مجوز با Lock/Atomic CAS؛ وجود مدرک حمل به‌صورت attachment |
| `Transaction` | `id:uuid`, `site_id:uuid`, `direction:enum`, `status:enum`, `vehicle_id:uuid`, `driver_id:uuid?`, `carrier_id:uuid?`, `customer_id:uuid?`, `material_id:uuid?`, `permit_id:uuid?`, `gross_kg:decimal?`, `tare_kg:decimal?`, `net_kg:decimal?`, `started_at:timestamptz`, `closed_at:timestamptz?`, `shift_id:uuid?`, `revision:int` | Aggregate Root؛ حفظ نسخه داده‌های تاریخی؛ یک وضعیت و State Transition هر بار |
| `WeighEvent` | `id:uuid`, `transaction_id:uuid`, `scale_id:uuid`, `step:enum(FIRST,SECOND,EXTRA)`, `role:enum(GROSS,TARE,REFERENCE)`, `raw_weight_kg:decimal`, `stable:boolean`, `position_ok:boolean`, `device_status:jsonb`, `captured_at:timestamptz`, `adapter_version:text`, `operator_id:uuid?`, `evidence_refs:uuid[]` | Append-only، شناسه یکتای پیام خام؛ ثبت وضعیت دستگاه پیش از Capture |
| `GateEvent` | `id:uuid`, `transaction_id:uuid?`, `gate_id:uuid`, `lane_id:uuid`, `kind:enum(ARRIVAL,ENTRY,EXIT,OPEN_COMMAND,OPEN_ACK)`, `happened_at:timestamptz`, `source_id:text`, `decision:text?` | Arrival/Exit زمان فیزیکی مستقل از فرمان نرم‌افزار |
| `Camera` | `id:uuid`, `site_id:uuid`, `lane_id:uuid?`, `purpose:enum(ANPR,FRONT,REAR,TOP)`, `endpoint_ref:text`, `calibration_id:uuid?`, `status:enum` | ذخیره Secret در Vault نه ستون آشکار |
| `PlateRead` | `id:uuid`, `camera_id:uuid`, `raw_text:text`, `normalized_text:text`, `confidence:decimal?`, `snapshot_id:uuid`, `detected_at:timestamptz`, `vehicle_candidate_id:uuid?`, `review_status:enum` | ورودی AI احتمال‌دار، نه اثبات قطعی هویت |
| `RFIDRead` | `id:uuid`, `reader_id:uuid`, `tag_epc:text`, `signal_quality:decimal?`, `detected_at:timestamptz`, `vehicle_candidate_id:uuid?` | EPC شناسه سخت‌افزار؛ جلوگیری از تکرار خوانش در پنجره زمانی |
| `Scale` | `id:uuid`, `site_id:uuid`, `serial_no:text`, `indicator_model:text`, `adapter_id:text`, `capacity_kg:decimal?`, `resolution_kg:decimal?`, `calibration_status:enum`, `operational_status:enum`, `last_seen_at:timestamptz?` | گواهی مستقل از telemetry؛ capacity از Data Sheet/گواهی حقیقی |
| `CalibrationRecord` | `id:uuid`, `scale_id:uuid`, `certificate_no:text`, `issuer:text`, `performed_at:date`, `due_at:date?`, `result:enum`, `attachment_id:uuid?`, `verified_by:uuid?` | تعریف `due_at` از ضوابط و گواهی واقعی؛ expiration سنجش سامانه‌ای است |
| `LoadCellHealth` | `id:uuid`, `scale_id:uuid`, `channel_no:int`, `metric_code:text`, `value:decimal`, `unit:text`, `sampled_at:timestamptz`, `device_flag:text?` | فقط با سخت‌افزار دارای تشخیص سلامت؛ [S13، S14] |
| `Alert` | `id:uuid`, `rule_id:text`, `site_id:uuid`, `entity_type:text`, `entity_id:uuid`, `severity:enum`, `status:enum`, `detected_at:timestamptz`, `ack_at:timestamptz?`, `resolved_at:timestamptz?`, `evidence:jsonb`, `assigned_to:uuid?` | ثبت وضعیت اقدام و Escalation |
| `Shift` | `id:uuid`, `site_id:uuid`, `name:text`, `starts_at:timestamptz`, `ends_at:timestamptz`, `crew_id:uuid?` | برای شیفت عبوری از نیمه‌شب زمان مطلق لازم است |
| `Equipment` | `id:uuid`, `site_id:uuid`, `type:enum(TRUCK,LOADER,SHOVEL,EXCAVATOR)`, `asset_no:text`, `telemetry_source:text?`, `fuel_unit:text?` | وسایل تولید با Vehicle تجاری قابل اتصال‌اند |
| `LidarScan` | `id:uuid`, `transaction_id:uuid?`, `vehicle_id:uuid`, `scan_role:enum(EMPTY,LOADED)`, `scanner_id:uuid`, `reference_scan_id:uuid?`, `pointcloud_asset_id:uuid`, `volume_m3:decimal?`, `quality:enum`, `algorithm_version:text`, `scanned_at:timestamptz` | هندسه خودرو/اتاق بار، Orientation و Alignment معتبر الزامی |
| `PayloadEvent` | `id:uuid`, `equipment_id:uuid`, `vehicle_id:uuid?`, `transaction_id:uuid?`, `payload_kg:decimal?`, `bucket_weight_kg:decimal?`, `event_at:timestamptz`, `source_quality:enum`, `correlation_method:text?` | مستقل از WeighEvent حقوقی؛ ممکن است سفر Match نشود |

**موجودیت‌های پشتیبان ضروری:** `Order`, `DeliveryNote`, `Location`, `Gate`, `Reader`, `DeviceConnection`, `DeviceCommand`, `PositionSensorEvent`, `AuditLog`, `MediaAsset`, `User`, `Role`, `Permission`, `PolicyVersion`, `AlertRule`, `IntegrationOutbox`, `ExternalSyncRecord`, `PermitReservation`, `OperationalStatusEvent`, `FuelEvent`, `ManualOverride`, `DensitySample`. این جداول برای پوشش ردیابی و KPI مطرح شده‌اند، نه اینکه در WIS اثبات شده باشند.

### ۶.۳ فرمول‌ها، قیود و محاسبات شاخص‌ها

**۱) توزین تجاری:**

```text
outbound_loading:  tare_kg = first_weight_kg;  gross_kg = second_weight_kg
inbound_unloading: gross_kg = first_weight_kg;  tare_kg  = second_weight_kg
net_kg = gross_kg - tare_kg
check: gross_kg >= tare_kg >= 0
```

دقت نمایش باید با ظرفیت تفکیک/گواهی دستگاه هماهنگ باشد؛ `decimal` به‌تنهایی دقت مترولوژیک نمی‌سازد. توزین چندمرحله‌ای یا هر نوع وزن سوم باید با معنای صریح `EXTRA` و Rule مجزا، نه جمع خودکار، ذخیره شود.

**۲) مدت حضور و صف:**

```text
site_turnaround_min = (last_EXIT.timestamp - first_ENTRY.timestamp) / 60
queue_wait_min = (SCALE_ENTER.timestamp - QUEUE_JOIN.timestamp) / 60
# زمان تنها در صورتی محاسبه شود که هر دو رخداد معتبر و به یک visit مرتبط باشند.
```

**۳) تولید شیفت از تراکنش‌ها:**

```text
shift_production_t = sum(t.net_kg where t.direction == OUTBOUND
                         and t.status == CLOSED
                         and t.material_id == chosen_material
                         and not t.reversed
                         and t.accounting_shift_id == shift.id) / 1000
trip_count = count(DISTINCT t.id for same eligible transactions)
```

برای جابه‌جایی داخلی معدن، «تولید معدن» لزوماً معادل «تناژ فروش خروجی باسکول» نیست. باید KPIهای `mine_moved_t`, `site_dispatch_t`, `sales_dispatched_t` مجزا بمانند.

**۴) KPI ناوگان با شرط دسترس‌پذیری داده:**

```text
cycle_time = empty_travel + queue_at_loader + loading + loaded_travel + queue_at_dump + dumping
utilization_pct = operating_time / available_time * 100  # فقط با تعریف وضعیت‌ها
payload_compliance_pct = 100 * trips_in_target_band / trips_with_valid_payload
fuel_intensity_l_per_t = total_fuel_l / valid_production_t
```

زمان‌ها و سوخت از FMS/Telematics یا Sensor مستقل می‌آیند [S20–S23]؛ اگر فقط داده باسکول وجود دارد، `utilization` و `fuel_intensity` نباید عدد صفر یا مقدار حدسی تولید کنند؛ خروجی `N/A (insufficient data)` باشد.

**۵) حجم و جرم حجمی:**

```text
loaded_volume_m3 = integrate(loaded_truck_bed_surface - aligned_empty_bed_surface)
estimated_mass_kg = loaded_volume_m3 * measured_bulk_density_kg_m3
crosscheck_pct = 100 * abs(estimated_mass_kg - legal_net_kg) / legal_net_kg
```

این رابطه بر مبنای چگالی **توده در شرایط واقعی رطوبت/دانه‌بندی** است، نه چگالی ذرات سنگ. عدم قطعیت چگالی، نقاط کور سطح و مرجع خالی روی خطا اثر دارند؛ اگر `legal_net_kg = 0`، نسبت اختلاف تعریف نمی‌شود. گزارش وزن حجمی را به‌روشنی `ESTIMATE` معرفی کند؛ روش دو اسکن در Loadscan مستند است [S17] ولی الگوریتم پیشنهادی ما مستقل است.

### ۶.۴ قیود کیفیت داده و حسابرسی

- `UNIQUE(source_device_id, source_event_id)`، `UNIQUE(site_id, transaction_public_no)` و `UNIQUE(idempotency_key, command_type)`.
- کلید خارجی `WeighEvent.transaction_id` و `PlateRead.snapshot_id` الزامی، مگر در رویداد خام بی‌سرپرست در Buffer که در جدول staging بماند.
- مصرف سهمیه مجوز با Transactional Lock؛ مقدار `consumed_qty_kg` فقط پس از تثبیت Net و تصویب Rule افزایش یابد و با `PermitReservation` از دوباره‌مصرف محافظت شود.
- وضعیت `REVERSED` رویداد اصلاحی با مبلغ/وزن برگشتی حسابداری تولید کند؛ Original همچنان قابل رؤیت باشد.
- تشخیص پلاک با AI نباید به‌صورت بی‌قید جایگزین شناسه قانونی شود؛ نتیجه و تصویر خام همراه با `model_version` حفظ گردد.
- هر رویداد `actor_type=HUMAN|DEVICE|SYSTEM`، `actor_id`, `trace_id`, `occurred_at`, `received_at`, `schema_version` داشته باشد.

## ۷. مشخصات UI/UX مستقل، تحلیل تصاویر و صفحات

### ۷.۱ تصاویر **واقعاً مشاهده‌شده** و استخراج الگوی قابل اقتباس

| تصویر / URL مستقیم | تشخیص صفحه و اجزای قابل مشاهده | نتیجه طراحی و سطح اطمینان |
|---|---|---|
| [WIS UI-01](https://www.weighing-engineering.com/images/pages/products/wis-weighbridge-software/wis-weighbridge-software-01.png) | پنل عملیات Windows: پس‌زمینه تیره مرکزی، نمایشگر دیجیتال آبی `Weight-kg`، برچسب RFID، حالت `Local Semi-Auto`، وضعیت Motion/Tare/Zero، دو جفت چراغ قرمز/سبز، کامیون شماتیک روی باسکول، کلیدهای `W`, `1st`, `2nd`, `2nd & 1st`, `3rd`, `Reprint` و کنترل چراغ‌ها | **تأییدشده از تصویر** برای وجود کنترل/چیدمان؛ معنای دقیق `W` یا توزین سوم **استنباطی/نیازمند تست** [S01، تصویر] |
| [WIS UI-02](https://www.weighing-engineering.com/images/pages/products/wis-weighbridge-software/wis-weighbridge-software-02.png) | رابط کوچک آبی روشن با دو چراغ، شکل کامیون زیر قیف بار، دیجیتال وزن، دکمه‌های مرحله وزن؛ متن ریز به‌علت وضوح پایین قابل اعتماد نیست | **استنباطی**: نمای عملیاتی دیگر؛ نباید از متن ناخوانای تصویر فیلد بسازیم [S01، تصویر] |
| [SUPER INSPECTOR UI-01](https://www.weighing-engineering.com/images/pages/products/super-inspector-system/super-inspector-system-01.png) | پنل مرورگری: ستون دوربین عکس کامیون، چراغ وضعیت کنار پنجره، نمایشگر وزن قرمزرنگ پایین، فرم سمت راست شامل Truck No، Trailer، Product، Customer، Destination، Origin، Order، Weight1/2، Time1/2، Comments؛ دکمه‌های پایین برای عملیات توزین | **تأییدشده از تصویر** برای اقلام دیده‌شده؛ اینکه تمام مقادیر در نسخه استاندارد الزامی‌اند ثابت نشده است [S05، تصویر] |
| [TruckFlow screenshot](https://be-fr.preciamolen.com/wp-content/uploads/sites/12/2017/07/%C3%A9cran-1024x613.png) | نوار ابزار بالایی با وزن، فایل‌ها، گزارش، تنظیمات و اداره پایگاه داده؛ جداول خودروهای حاضر و تازه خارج‌شده؛ جدول زمان آغاز/مدت/ماده/شرکت حمل؛ نمایش وضعیت محل/تجهیزات | **تأییدشده بصری** از تصویر منتشرشده فروشنده؛ چیدمان نسخه قدیمی، نه UI تضمینی نسخه ۲۰۲۶ [S12، S11] |
| [Avery SmarTower specification, page 2](https://www.averyweigh-tronix.com/en/wp-content/uploads/sites/11/2025/08/SmarTower_UK_spec.pdf) | تصویر برج مستقل با RFID/آژیر/نمایشگر/دوربین/چاپگر و دیاگرام جانمایی راهبند و حسگرهای موقعیت؛ تصویر کوچک UI تحت عنوان Weighing Intelligence | **تأییدشده** برای Topology تجهیزات و حضور تصویر UI؛ جزئیات متن در Screenshot کوچک به‌دقت قابل استخراج نیست [S09، ص.۲] |
| [Loadscan overview](https://www.loadscan.com/load-volume-scanner/) | نمایش رنگی سطح سه‌بعدی بار روی کامپیوتر، اسکنر بالاسری و مسیر عبور کامیون؛ الگوی اسکن/تحلیل حجمی | **تأییدشده برای مفهوم تجهیز**؛ صفحه/چیدمان UI جزئی در عکس تبلیغاتی احراز نشده [S15] |

**تصاویر مرجع صرفاً برای مشاهده الگوی عملکرد و ترکیب اطلاعات هستند.** در محصول نهایی نباید گرافیک کامیون، لوگو، کپی دکمه‌ها، رنگ دقیق برند، Assetهای تصویری یا محتوای اختصاصی را بازتولید کرد.

### ۷.۲ طراحی بصری پیشنهادی (Design System)

- **هویت مستقل:** اپلیکیشن وب واکنش‌گرا (RTL/FA)، نام‌گذاری و برند خودمان، طراحی مدرن و صنعتی. نمونه رنگ پیشنهادی (نه استخراج برند رقبا): زمینه `#0B1220`، سطح کارت `#162236`، اصلی `#2D91B8`، متن روشن `#F4F7FA`، هشدار `#F1B54B`، خطا `#EA6065` و موفق `#30B58C`؛ برای محیط اپراتوری روشنایی بالا Light Mode نیز ارائه شود.
- **چیدمان Desktop:** Navigation Sidebar سمت راست برای RTL؛ Header شامل سایت/شیفت/وضعیت اتصالات؛ بدنه Grid شامل وزن زنده و عملیات در اولویت، ستون هویت و تصویر، پایین جدول آخرین رخداد. هیچ کار عملیاتی حساس پشت نمودارهای تزئینی پنهان نشود.
- **وضعیت‌ها:** رنگ تنها کانال اطلاع‌رسانی نباشد؛ همواره برچسب `Stable`, `Disconnected`, `Calibration Expired`, `Permit Held`, `Exit Allowed` و Icon/متن کنار رنگ وجود داشته باشد.
- **موبایل:** فقط صفحات مرور و تأییدهای مجاز؛ فرمان مستقیم گیت روی موبایل به‌صورت پیش‌فرض غیرفعال و در صورت الزام با RBAC/MFA + Audit فعال شود.
- **تعامل:** کلیدهای پرکاربرد صفحه عملیات بزرگ، با Confirmation برای Override/Open Gate؛ وقتی سامانه در `AUTO` است کنترل دستی با اخطار واضح فعال شود.

### ۷.۳ صفحات و Wireframe محتوایی برای AI کدنویس

| Route پیشنهادی | کاربران | ترتیب اجزا (بالا به پایین) | داده/API اصلی |
|---|---|---|---|
| `/operations/live` | اپراتور، سرپرست | انتخاب Site/Lane → کارت وزن Live بزرگ + Stable/Zero/Scale Online → کارت خودرو/پلاک/RFID → عکس‌های جلو/عقب → مراحل `1st/2nd` و قبض → چراغ/Barrier با وضعیت ACK → صف/استثناها | `GET /scales/:id/live`, `GET /transactions/open`, `POST /weigh-events` |
| `/dashboard` | مدیریت | KPIهای تولید شیفت، سفرها، Net Total، زمان ماند Median، تعداد خودرو حاضر، وضعیت راهبند/باسکول → Trend ساعتی → Top material/carrier → جدول هشدار | `/analytics/shift`, `/alerts`, `/site-presence` |
| `/gate` | نگهبان | تصویر آخرین ورود، Plate OCR و RFID، وضعیت Permit/Driver، نتایج Rule، گزینه Escalate؛ History تردد | `/gate-events`, `/identity/resolve` |
| `/transactions` | مالی/اپراتور | فیلتر تاریخ/شیفت/پلاک/ماده/حواله/باسکول/Status؛ Data Grid و Export | `/transactions` |
| `/transactions/:id` | حسابرس و ذی‌نفعان | Timeline مرحله‌ای + Gross/Tare/Net + شواهد دوربین + Rule Results + مجوز و نسخه + Outbox Status + Download Evidence Bundle | `/transactions/:id/evidence` |
| `/permits` | مالی/فروش | مجوز فعال/منقضی/مصرف‌شده، سفارش، مانده سهمیه، تاریخچه رزرو، فرم ثبت/تأیید | `/permits`, `/permit-reservations` |
| `/vehicles` | مالی/عملیات | رجیستری پلاک، Tag، نوع وسیله، مالک، Driver Link، تاراهای معتبر و تاریخچه | `/vehicles`, `/rfid-tags` |
| `/yard-queue` | سرپرست | خودروهای در سایت، موقعیت منطقی، زمان ورود، Time-in-State، اولویت/حواله، هشدار توقف | `/site-presence`, `/queue-events` |
| `/equipment/scale-health` | تعمیرات | لیست باسکول و Link، وضعیت لودسل‌ها (در صورت پشتیبانی)، Graph رانش صفر، فهرست گواهی‌ها، تاریخ سررسید | `/scale-health`, `/calibrations` |
| `/reports` | مدیران | سازنده گزارش، فیلتر/گروه‌بندی، Trend، Export و Schedule Email | `/reports/templates`, `/reports/jobs` |
| `/integrations` | مدیر سیستم | وضعیت Device Adapter، ERP Sync، Outbox/DLQ، API Keys/Scopes، تاریخچه Webhook | `/integrations/status`, `/outbox` |
| `/admin/rules` | مدیر | Rule Builder، Version، Shadow Test، محدودیت Override و Publish با تأیید | `/rules`, `/rules/test` |
| `/admin/audit` | حسابرس | Advanced Search رخداد، تغییرات Config، Login، نقش، Export Hash Chain | `/audit` |
| `/plugins/lidar` | تحلیلگر حجم | زوج اسکن خالی/پر، 3D Viewer، حجم، Quality، چگالی و Comparison به وزن باسکول | `/lidar-scans`, `/volume-reconciliation` |
| `/plugins/fleet` | مدیر معدن | KPI شیفت/ماشین/لودر، سفر، چرخه، میزان بیکاری، سوخت، Production Trend | `/fleet/kpis`, `/payload-events` |

### ۷.۴ کارت‌ها، فیلترها و داده نمایشی

**کارت‌های بالای داشبورد**: `Net Dispatched (t)`, `Trips`, `Vehicles On Site`, `Open Transactions`, `Median Turnaround (min)`, `Weight Capture Errors`, `Scales Available/Total`, `Critical Alerts`. با فعال شدن افزونه FMS: `Avg Cycle Time`, `Utilization %`, `Fuel per Ton`, `Payload Compliance %`. پیش از وجود داده معتبر FMS، این کارت‌ها **نمایش `N/A` دارند**. مبنای وجود مفهومی آنالیتیکس در رقبا [S02، S11، S20–S23] است؛ چیدمان و فرمول‌ها پیشنهادی‌اند.

**نمودارها:** ۱) تناژ به تفکیک ساعت/شیفت/ماده، ۲) تعداد ورود و خروج ساعتی، ۳) میانگین/صدک زمان ماند، ۴) تغییرات توزین خالص بر حسب وسیله، ۵) سهم وضعیت `BLOCK/REVIEW/PASS`، ۶) استفاده از باسکول‌ها، ۷) در فاز FMS، آبشاری زمان چرخه و خط زمانی ماشین. **فیلتر مشترک:** زمان، سایت، شیفت، باسکول، گیت، جهت، وضعیت، پلاک، RFID، راننده، شرکت حمل، مشتری، محصول/ماده، مجوز و مبدأ/مقصد.

**تفاوت UI عملیات با UI مدیریت:** صفحه وزن زنده باید Latency کم، داده بزرگ، دکمه‌های واضح و تاییدهای امن داشته باشد؛ صفحه مدیریتی باید تحلیل روند/فیلتر و Drill-down داشته باشد. گذاشتن همه KPIهای Fleet در صفحه اپراتور، خطای UX است.

### ۷.۵ تصویر و ویدئو — مرز واقعی بررسی

فیلم `https://www.youtube.com/watch?v=K1E_JC7707A` از صفحه رسمی SmarTower شناسایی شد [S08] اما لینک ویدئو با ابزار فعلی باز نشد؛ بنابراین **هیچ جریان کاری به‌عنوان مشاهده مستقیم ویدئو** گزارش نمی‌شود. جریان §۵ بازسازی تحلیلی از اسناد و UIهای ایستا است، نه رونویسی ویدئو. PDF دوصفحه‌ای TruckFlow متن نمایه‌شده معتبر داشت [S11] اما در مرحله Screenshot دسترسی به تصویر صفحه ناموفق بود؛ UI آن عمدتاً با تصویر رسمی وب و شرح کاتالوگ تحلیل شده است.


## ۸. یکپارچه‌سازی‌ها، پروتکل‌ها و معماری استقرار

### ۸.۱ معماری مرجع اجرایی — **پیشنهادی**، نه معماری داخلی WIS

```text
 [RFID] [ANPR/IP Camera] [Position Sensors] [Scale Indicator] [PLC/Barrier]
    │          │               │                 │              │
    └──────────┴───────────────┴─────────────────┴──────────────┘
                           │  Isolated OT network
                    ┌──────▼───────────┐
                    │ Edge Device Agents│◄──── LiDAR / Loader scale plugin
                    │ Protocol Adapters │
                    └──────┬───────────┘
                           │ canonical telemetry / commands
                 ┌─────────▼────────────┐
                 │ Site Edge Services   │
                 │ Identity Correlation │
                 │ Weigh State Machine  │
                 │ Permit Policy Engine │
                 │ Command Interlocks   │
                 │ Local Event Log/DB   │
                 └─────────┬────────────┘
                           │ durable outbox, idempotent sync
                   ┌───────▼───────────┐
                   │ Central Platform  │
                   │ API + Postgres     │
                   │ Object Storage    │
                   │ Reports + Audit   │
                   │ Multi-site KPI    │
                   └───────┬───────────┘
                           │ REST/events via integration gateway
                 ┌─────────▼─────────────────┐
                 │ ERP / Sales / FMS / SMS   │
                 │ Accounting / BI / LIMS   │
                 └───────────────────────────┘
```

- **نقطه کنترل:** دستور گیت فقط از `GateControlService` محلی عبور می‌کند؛ API مرکزی مجاز به بازکردن مستقیم رله نیست. PLC ایمنی، E-Stop و راهکار Fail-safe باید مستقل از نرم‌افزار طراحی و آزمون شوند. واژه «Fail-safe» باید طبق ارزیابی خطر محل به حالت فیزیکی مناسب تفسیر شود: باز/بسته‌ماندن راهبند برای نفرات، خودرو و آتش‌نشانی حکم یکسان ندارد.
- **تفکیک OT/IT:** شبکه دوربین/تجهیزات باسکول VLAN یا Segmentation مستقل؛ دسترسی دستگاه‌ها به پایگاه داده محدود، حساب سرویس حداقل‌اختیار، مدیریت اسرار در Vault و لاگ فرمان‌های خطرناک.
- **تک‌سایتی/چندسایتی:** مالکیت عملیات وزن و Gate روی Edge محلی؛ تحلیـل، تطبیق و مدیریت مستر دیتا در مرکز. در قطعی WAN، رخدادها با `occurred_at`, `received_at`, `source_seq` حفظ و سپس با ترتیب علّی همگام شوند.
- **حالت Offline:** ذخیره شواهد و تداوم تصمیم‌های محلی مجاز؛ مجوز ناشناخته، منقضی یا فاقد Rule Cache معتبر به‌صورت پیش‌فرض `HOLD`. مجوزی که بارگیری آن به ERP وابسته است بدون سازوکار رزرو سهمیه برخط یا توکن سهمیه پیش‌صادرشده نمی‌تواند ایمن به‌صورت آفلاین مصرف شود.
- **تجهیزات موردنیاز:** سرور/IPC صنعتی متناسب با بار، UPS، سوئیچ و فیبر/اترنت صنعتی، Indicator دارای رابط داده، Reader، دوربین با نور و جانمایی مناسب، حسگر موقعیت، راهبند/PLC، چاپگر و Storage. **CPU/GPU، توان دوربین، برد RFID و ظرفیت نهایی از RFP و Site Survey تعیین می‌شود؛ در منابع برای طراحی ما اندازه‌گذاری ثابت وجود ندارد.**

### ۸.۲ ماتریس اتصال سخت‌افزاری (Compatibility Contract)

| Adapter پیشنهادی | ورودی/خروجی و قرارداد نمونه | منبع و وضعیت استناد | رفتار خطا/تست پذیرش |
|---|---|---|---|
| `scale.serial` | Serial RS-232/RS-485، رشته وزن و Stable/Zero در پروتکل مخصوص سازنده؛ وزن و واحد + raw frame | **پیشنهادی**؛ شواهد Serial برای ترمینال WIS [S07]، WeighMAST [S19]، iQUBE² [S14]، اما **نه پروتکل عمومی تضمین‌شده WIS** | Timeout، CRC در صورت تعریف سازنده، کنترل واحد، ACK و حفظ Frame |
| `scale.tcp` | TCP socket/Ethernet در صورت پشتیبانی Indicator، Session/Heartbeat | **پیشنهادی**؛ شواهد Ethernet در [S09، S11، S14] | قطع اتصال؛ جلوگیری از ثبت وزن Stale |
| `reader.rfid` | EPC/UID، Reader ID، Antenna، RSSI اختیاری، Timestamp؛ SDK/TCP/Serial سازنده | **تأییدشده برای قابلیت RFID** در [S02، S09، S19]؛ فرکانس UHF به SmarTower [S09] محدود است | Debounce، Anti-collision، اختلاف انتساب Tag/Vehicle |
| `camera.anpr` | تصویر/پلاک/Confidence/Bounding box/Version؛ RTSP/HTTP/SDK با قرارداد مخصوص محصول | **پیشنهادی**؛ امکان ANPR در [S04، S10، S12] | OCR بدون Threshold به هویت قطعی تبدیل نشود؛ عکس خام باقی بماند |
| `camera.evidence` | Snapshot جلو، عقب، بالا؛ Camera ID، Photo Hash، Timestamp | تصویر جلو/عقب برای SUPER INSPECTOR [S05] و دوربین‌ها برای [S09] **تأییدشده**؛ انتخاب ONVIF/RTSP **پیشنهادی** | Capture failure مانع ثبت بسته شواهد کامل یا نیازمند Supervisor |
| `plc.gate` | فرمان `OPEN/CLOSE`, `correlation_id`; پاسخ ACK و Limit Switch؛ Digital IO/Modbus TCP/OPC UA بسته به PLC | **پیشنهادی**؛ وجود چراغ/مانع در [S03، S09، S11] تأیید است، **پروتکل Modbus یا OPC UA در این محصولات تأیید نشده** | Timeout، Safety Interlock، فرمان غیرتکراری، Loop Feedback |
| `sensor.position` | Front/Rear Presence، `position_ok`, `beam_blocked`, Loop state | نوع Through-beam برای SmarTower [S09] **تأییدشده**؛ Schema **پیشنهادی** | عدم بازشدن با وضعیت Unknown؛ ثبت خطای سنسور |
| `terminal.driver` | RFID کارت/تگ، دستور متنی، چاپ قبض، اینترکام اختیاری | ترمینال و چاپگر در [S07–S09، S28، S29] **تأییدشده**؛ اینترکام بسته به پیکربندی **نامشخص** | دکمه اضطراری/دستی مستقل، گزارش قطع ارتباط |
| `lidar.scan` | اسکن خالی/پر، شناسه وسیله، Point Cloud/Surface/Volume/Quality | Workflow حجمی Loadscan [S15–S17] **تأییدشده**؛ فرمت و SDK ما **پیشنهادی** | Quality Gate، ابطال اسکن ناقص |
| `loader.payload` | `equipment_id`, `vehicle_id?`, `payload_kg`, event time, quality | مانیتور بار مفید در [S18، S23] **تأییدشده**؛ Endpoint مشخص **نامشخص** | Unmatched event در صف تطبیق باقی بماند |

**توضیح پروتکل‌ها:** `MQTT` برای تلِمتری Edge، `OPC UA` برای PLC و تجهیزات صنعتی، `Modbus TCP/RTU` برای رجیسترهای معتبر، `REST/HTTPS` و `Webhook` برای ERP، و `SFTP/CSV` برای تبادل دسته‌ای، همگی **گزینه طراحی ما** هستند. ادعای اینکه هر فروشنده فوق به‌طور پیش‌فرض تمام این پروتکل‌ها را دارد، فاقد سند است. انتخاب واقعی هر Driver باید بر اساس Manual مدل دقیق، Firmware، پورت‌های فعال و آزمون FAT انجام شود.

### ۸.۳ API عمومی مستقل (پیشنهادی)

| متد و مسیر | قرارداد عملیاتی | Idempotency/سطح مجوز |
|---|---|---|
| `GET /api/v1/sites/{siteId}/scales/{scaleId}/status` | Latest State، Timestamp، `stable/zero/online`، Health Flags | `scale_operator`, `maintenance_engineer` |
| `POST /api/v1/identity/resolve` | Plate/RFID/Snapshot -> Candidate Vehicle و اختلافات | Device signed event؛ `integration_service` |
| `POST /api/v1/transactions` | Create/Resume سفر بر اساس `site+vehicle+direction` | Header `Idempotency-Key`، برگرداندن Transaction ID |
| `POST /api/v1/transactions/{id}/weigh` | ثبت رخداد وزنی **فقط از Edge Authorized Adapter** | `source_event_id` و Raw Weight attestation |
| `POST /api/v1/transactions/{id}/evaluate` | ارزیابی مجوز/جرم/شواهد/امنیت؛ خروجی Rule Trace | Read/evaluate؛ نباید خودسرانه گیت را باز کند |
| `POST /api/v1/gates/{gateId}/release-request` | درخواست کنترل‌شده آزادسازی با Policy Revision | Role و Step-up Auth، Local Gate Interlock و ACK |
| `GET /api/v1/transactions/{id}/evidence` | بسته قبض، تصویر و وقایع با Hash و Signature | `auditor/finance` و Scope به Site |
| `POST /api/v1/permits/import` | وارد کردن Batch سفارش/حواله دارای Revision | ERP Connector + Dedup و Signature |
| `POST /api/v1/plugins/lidar/scans` | ثبت اشاره‌گر فایل/کیفیت/Volume | فقط افزونه فعال و Scanner مجاز |
| `POST /api/v1/plugins/payload/events` | ثبت PayloadEvent و Link اختیاری سفر | فقط افزونه فعال و Adapter مجاز |

**JSON envelope رویدادها:** `{event_id, event_type, schema_version, site_id, source_device_id, source_seq, occurred_at, received_at, correlation_id, payload, signature_ref}`. برای `WEIGHT_CAPTURED` علاوه بر جرم/واحد، حتماً `stable`, `position_ok`, `indicator_id`, `calibration_ref`, `raw_frame_hash` ذخیره شود. `event_id` بیرونی بدون تأیید منبع فقط شناسه ورود به staging است.

### ۸.۴ سناریوهای یکپارچه‌سازی و محدودیت ادعای ERP

1. **ERP/فروش:** دریافت `SalesOrder/Permit/Customer/Material/Quota` → ذخیره Snapshot و Version → رزرو ظرفیت مجوز → اتمام توزین → انتشار `ShipmentWeighed` → شناسه رسید ERP؛ مغایرت با `RECONCILE_PENDING` به مالی نمایش داده شود. وجود اتصال ERP در بعضی محصولات [S05، S08، S10، S11، S19، S25] تأیید است؛ این Endpointها و الگوریتم تفصیلی پیشنهادی‌اند.
2. **حسابداری/فاکتور:** خالص تأییدشده و نرخ قراردادی وارد ماژول مالی شوند؛ **سیستم باسکول نباید بدون نرخ/واحد/مالیات/وضعیت قرارداد معتبر، قیمت یا فاکتور حقوقی را جعل کند**. اصلاحات با سند برگشت و نسخه انجام شود.
3. **LIMS/عیار:** نمونه، Batch، ماده و گرید با `lot_id` پیوند خورند؛ مقدار `grade` در صورت نبود نمونه/آزمایشگاه خالی بماند و روی قبض به‌عنوان حقیقت آزمایش‌شده درج نشود.
4. **اعلان‌ها:** SMS/Email با Template و Queue؛ هشدار بحرانی ابتدا UI/صدا/مسیر Escalation محلی و سپس کانال خارجی. پیام‌رسان‌ها با Provider جداگانه و ترجیح/سیاست سازمانی تعریف شوند.
5. **BI:** مدل Data Warehouse اختصاصی `FactWeighTransaction`, `FactGateEvent`, `FactPayload`, `DimSite`, `DimShift`, `DimMaterial` با کنترل حذف دوباره‌شماری سفر/توزین؛ نیازمند Versioned Material/Shift Mapping.

## ۹. منطق هشدارها و Rule Engine

**همه آستانه‌ها در جدول زیر پیشنهادی و قابل تنظیم بر اساس سایت/مدل دستگاه/مجوز/گواهی‌اند.** هیچ مقدار عددی به‌عنوان آستانه فنی سازندگان ادعا نمی‌شود؛ حتی `confidence` مورد قبول ANPR یا انحراف تارا باید از داده اعتبارسنجی واقعی به دست آید. رویدادهایی با اطلاعات ناقص در سیاست ایمنی `UNKNOWN → REVIEW/HOLD` هستند، نه PASS.

| Rule | شرط دقیق رویداد/وضعیت | آستانه/تنظیم لازم | خروجی و اقدام | شواهد / سطح |
|---|---|---|---|---|
| `AL-01` وزن ناپایدار | `scale.stable=false` هنگام Capture | Flag سازنده، بدون آستانه ساختگی | BLOCK وزن و نمایش Stale/Stable؛ ثبت Raw | [S02، S13]؛ پیاده‌سازی پیشنهادی |
| `AL-02` توقف یا وضعیت نامعتبر خودرو | `position_ok != true` یا Presence Sensors متناقض | همه سنسورهای ایمنی طبق Design Spec | BLOCK وزن/گیت، هدایت خودرو به موضع درست | [S09، S19]؛ پیشنهادی |
| `AL-03` RFID با پلاک ناسازگار | `rfid.vehicle_id != plate.vehicle_id` با هر دو شناسه معتبر | Matching Policy نسخه‌بندی‌شده | HOLD، گرفتن عکس، تصدیق انسانی | [S09، S10]؛ پیشنهادی |
| `AL-04` پلاک با اطمینان پایین | `plate.confidence < min_plate_confidence` یا تصویر ناخوانا | `min_plate_confidence` از داده محلی | REVIEW، تکرار تصویر/تصحیح کنترل‌شده | [S04، S10]؛ پیشنهادی |
| `AL-05` مجوز نامعتبر | `now` خارج بازه معتبر، Status مسدود یا مجوز یافت نشد | تاریخ و قواعد مصوب قرارداد/سازمان | BLOCK خروج بار، ارجاع به فروش/حمل | [S19، S25]؛ پیشنهادی |
| `AL-06` سهمیه ناکافی | `requested_net_kg > remaining_permit_kg` | `max_qty/consumed/reserved` نسخه معتبر | BLOCK تایید بار/ارسال ERP | [S19]؛ پیشنهادی |
| `AL-07` اضافه‌بار | `gross_kg > legal_gvw_kg` یا وزن بیشتر از Capacity باسکول | GVW قانونیِ پلاک/محور و Capacity گواهی | BLOCK گیت، درخواست اصلاح بار | [S02، S19]؛ پیشنهادی |
| `AL-08` اختلاف غیرمعمول تارا | `abs(measured_tare - nominal_tare) > tare_tolerance_kg` | `tare_tolerance_kg` ویژه کلاس کامیون و تجربیات تأییدشده | REVIEW، توزین مجدد/بازرسی | [S02، S10]؛ پیشنهادی |
| `AL-09` توزین تکراری یا سفر باز موازی | `same_vehicle` با Transaction همزمان فعال یا وزن بدون مرحله معتبر | قاعده تداخل Site/Lane/Direction | BLOCK ثبت دوم، پیوند به سفر فعال یا ارجاع | [S02]؛ پیشنهادی |
| `AL-10` گیت بدون ACK | فرمان رله صادر شده ولی ACK/Limit Switch نرسیده | `gate_ack_timeout_s` از FAT/SAT | CRITICAL، Stop و بازبینی فیزیکی | [S09]؛ پیشنهادی |
| `AL-11` ارتباط دستگاه قطع | `now-last_seen > device_stale_limit_s` | اختصاصی دستگاه و نرخ Telemetry | UNKNOWN، منع Capture/Command، هشدار تعمیرات | [S13، S14]؛ پیشنهادی |
| `AL-12` گواهی کالیبراسیون منقضی | `now > calibration.due_at` یا `result=FAIL` | سررسید مستند و سیاست حقوقی | Quarantine باسکول برای توزین قانونی تا رفع مشکل | [S31]؛ پیشنهادی |
| `AL-13` رانش صفر | `abs(zero_drift)>zero_drift_limit` در حالت بدون بار و با تأیید Indicator | تلرانس مدل/آزمایش و استاندارد معتبر | WARNING/HOLD، ارجاع به مترولوژی | [S13]؛ پیشنهادی |
| `AL-14` خطای لودسل/توزیع بار | دستگاه Diagnostic Flag یا Symmetry/Corner خطادار | Diagnostic Threshold سازنده | CRITICAL/MAINTENANCE؛ Evidence و کارتابل سرویس | [S13، S14]؛ پیشنهادی |
| `AL-15` توقف بیش‌ازحد خودرو | `site_exit_at - site_entry_at > turnaround_limit` یا Queue Age زیاد | حد تنظیمی شیفت/مسیر/ماده | WARNING مدیر شیفت، علت تاخیر | [S11، S20]؛ پیشنهادی |
| `AL-16` فقدان شواهد تصویر | `required_camera_asset` موجود نیست/Hash mismatch | Required Image Policy | HOLD/REVIEW، تکرار Capture و بررسی دوربین | [S05، S09]؛ پیشنهادی |
| `AL-17` مغایرت ERP | `outbox_delivery_failed` یا اختلاف Revision/Quantity | SLA Retry و عمر DLQ | WARNING؛ حفظ رکورد، Reconciliation | [S05، S11]؛ پیشنهادی |
| `AL-18` اسکن LiDAR با کیفیت پایین | Scan Quality Fail یا جفت خالی/پر ناسازگار | Quality Score و هندسه معتبر دستگاه | رد Volume تخمینی، بدون دستکاری وزن قانونی | [S15–S17]؛ پیشنهادی |
| `AL-19` اختلاف وزن حجمی و باسکول | `abs(estimated_mass-net)/net > volume_crosscheck_limit` مشروط به `net>0` | حد مشتق از عدم قطعیت حجم و چگالی | REVIEW، برچسب Estimated، بازرسی بار/چگالی | [S15–S17]؛ پیشنهادی |
| `AL-20` اختلاف Payload و باسکول | `abs(sum(matched_payload)-net)>payload_tolerance_kg` | خطای تلفیقی حسگر و روش Match | WARNING تحلیل بارگیری، نه تغییر وزن رسمی | [S18، S23]؛ پیشنهادی |
| `AL-21` درخواست Override پرخطر | درخواست Gate Open/وزن دستی بدون مجوز/دلیل یا MFA | Policy Role/2-Person approval | BLOCK؛ ایجاد Security Alert با Actor و Trace | [S02، S33]؛ پیشنهادی |
| `AL-22` رویداد تکراری یا خارج از ترتیب | `source_event_id` تکراری، `source_seq` پس‌رونده یا Clock Drift | Window سازگاری Time Sync + Adapter | Quarantine، عدم دوباره‌شماری، Reconcile | [S02، S18]؛ پیشنهادی |
| `AL-23` قطع هماهنگی WAN | `sync_backlog_age > max_outbox_age` | Offline Operating Policy مصوب | هشدار وضعیت Offline؛ Hold مجوزهای نامطمئن | [S18]؛ پیشنهادی |
| `AL-24` احتمال تعویض پلاک/تگ | `plate` یا `tag` میان دو دوربین/سایت در فاصله زمانی ناممکن، یا Snapshot mismatch | هندسه سایت، حد زمانی مسیر و قواعد اعتبارسنجی | Security REVIEW + Evidence، بدون محکوم‌سازی خودکار | [S10، S33]؛ پیشنهادی |

**قانون اقدام:** هر Rule نتیجه `{PASS, REVIEW, BLOCK, UNKNOWN}`، نسخه قاعده، Source Revision، فهرست دلایل و شواهد تولید کند. `ACKNOWLEDGED` فقط یعنی اپراتور هشدار را دیده است و **معادل برطرف شدن BLOCK نیست**. `RESOLVED` باید پس از رخداد اصلاحی/تأیید مسئول ذی‌صلاح ثبت شود. برای False Positive، Rule در حالت Shadow Test با داده تاریخی آزمون و سپس با نسخه منتشر شود.

```text
function evaluate_exit(transaction, live_devices, policy):
    if not safety_interlocks_clear(live_devices): return BLOCK("SAFETY_INTERLOCK")
    if not scale_data_trusted(transaction): return BLOCK("WEIGHT_NOT_TRUSTED")
    if not verified_vehicle_identity(transaction): return REVIEW("IDENTITY_CONFLICT")
    if not valid_permit_and_atomic_quota(transaction): return BLOCK("PERMIT_OR_QUOTA")
    if not required_evidence_valid(transaction): return REVIEW("EVIDENCE_INCOMPLETE")
    return PASS("EXIT_ELIGIBLE")
# PASS فقط «درخواست مجوز آزادسازی» را مجاز می‌کند؛ فرمان واقعی راهبند تابع PLC/ایمنی است.
```

## ۱۰. ماژول‌های افزونه (Plug-ins) و مسیر توسعه

### ۱۰.۱ قرارداد افزونه عمومی

هر افزونه **نسخه، قرارداد رخداد، مهاجرت DB، Scope مجوز، health-check، تنظیمات و سازگاری** دارد. چرخه: `INSTALLED → CONFIGURED → TESTED → ENABLED → DEGRADED/DISABLED`. افزونه حق تغییر `WeighEvent` اصلی یا بازکردن مستقیم Gate ندارد و صرفاً Event/Recommendation ثبت می‌کند. هر افزونه باید در نبود تجهیز فعال نباشد و KPIهای آن در UI به‌صورت `N/A` نمایش داده شوند؛ نه صفرِ ساختگی.

| افزونه | ورودی | پردازش و خروجی | محدودیت فنی و منبع |
|---|---|---|---|
| **LiDAR Volume** | اسکن اتاق بار خالی/پر، هندسه مرجع خودرو، Point Cloud، Calibration و GNSS/Encoder در صورت نیاز | Registration دو اسکن، تفریق سطوح، ماسک سطح بار، Integration حجمی، نمایش رنگی اختلاف، درصد کیفیت، تخمین جرم از Density؛ خروجی `VolumeMeasurement` و `LidarScan` | حجم‌سنجی واقعی Loadscan و جفت اسکن خالی/پر [S15–S17] تأیید؛ Pipeline فنی پیشنهادی، نیازمند خطایابی متروژیک |
| **On-board Payload** | وزن جام لودر/شاول، Cycle ID، شناسه کامیون، زمان بارگیری | تجمیع Bucket Loads به Truck Load با Confidence، مقایسه با Net باسکول، توصیه Optimal Pass Count | Loader scales و InsightHQ [S18]، و Fleet Payload [S23]؛ تطبیق رخداد پیشنهادی |
| **Fleet KPI / FMS** | Dispatch, GPS/GNSS, Loader events, Telematics, Fuel, Status Timeline | سفر، چرخه، تأخیر صف، صف بارگیری/تخلیه، Availability/Utilization/Fuel per Ton، به تفکیک شیفت/ناوگان | KPI و FMS در [S20–S24] تأیید؛ اتصال و فرمول‌بندی مخصوص قرارداد پروژه |
| **Axle Compliance** | Axle Loads از تجهیز قانونی WIM/Static Axle Scale | گزارش بار محوری/گروه محور، اضافه‌بار مجاز در تنظیمات | شرکت مرجع محصول WIM **جداگانه** دارد [S30]؛ قابلیت WIS فرض نشده |
| **Dispatch Permit Scheduler** | ظرفیت باسکول، بازه خروج مجوز، پارکینگ/نوبت و ETA | Slot/Queue ETA و سقف رزرو ساعتی | الگوی FMS/TruckFlow [S11، S22]؛ Scheduling پیشنهادی |

### ۱۰.۲ تعریف KPI با محدودیت داده

| شاخص | تعریف محاسباتی | حداقل داده لازم و ملاحظه |
|---|---|---|
| `Net Production (t)` | مجموع `net_kg/1000` برای سفرهای نهایی‌شده با `material_role=PRODUCTION` و Site/Shift | از وزن **خالص**، بدون تکرار رویدادهای توزین اول/دوم؛ تولید استخراجی و فروش/ارسال یکی نیستند مگر نگاشت فرآیند تصویب شود |
| `Trips` | شمار `Transaction.id` نهایی دارای بار معتبر، نه شمار WeightEvent | Status و جهت؛ سفرهای لغوشده حذف/تفکیک شوند |
| `Turnaround (min)` | `(exit_at-entry_at)/60s` به‌ازای خودروهای با ورود و خروج کامل | GateEvent معتبر؛ برای رکورد ناقص `N/A` |
| `Cycle Time (min)` | `dump_end_at - prior_dump_end_at` یا مدل چرخه مصوب (مثلاً بارگیری تا بارگیری بعد) | نیازمند GPS/FMS و تعریف دقیق مرز چرخه؛ از توزین به‌تنهایی محاسبه‌پذیر نیست |
| `Utilization (%)` | `productive_operating_time / scheduled_available_time × 100` | Time State/Shift، سیاست تعریف Productive vs Idle؛ در نبود آن `N/A` |
| `Fuel per Ton` | `fuel_consumed_l / hauled_material_t` | کالیبراسیون اندازه‌گیری سوخت، مرز زمانی مشترک و Mass matched |
| `Payload Compliance (%)` | تعداد سفرهای داخل بازه مجاز بار/کل سفرهای واجد شرایط × 100 | حدود بار مجاز، ظرفیت وسیله و جفت‌سازی Load Events |
| `Queue Time` | زمان `queue_entered` تا `service_started` | رخداد صف مستقل؛ Entry/Exit Site به‌جای صف استفاده نشود |
| `Volume/Weight Deviation (%)` | `100 × abs(ρ_bulk V - net) / net` | Net مثبت، اسکن معتبر، چگالی حجمی اندازه‌گیری‌شده و Uncertainty |

### ۱۰.۳ فازبندی و تست پذیرش پیشنهادی

- **فاز ۱ — عملیات حقوقی توزین:** FR-01 تا FR-20، FR-24، FR-30 تا FR-32 و NFRهای امنیت/ایمنی/آفلاین؛ سناریوهای FAT سنسور، RFID، OCR conflict، ثبت وزن، مجوز و گیت.
- **فاز ۲ — نگهداشت و تحلیل:** FR-21 تا FR-23 و FR-29؛ وابسته به سازگاری Indicator/لودسل؛ گزارش خودکار و چندسایتی.
- **فاز ۳ — LiDAR/FMS:** FR-25 تا FR-28؛ فقط پس از نمونه‌برداری معتبر و قرارداد Mapping ماشین/سفر/شیفت، با ارزیابی خطا و ROI بر داده واقعی سایت.

## ۱۱. شکاف‌ها، دامنه راستی‌آزمایی و سؤال‌های باز

### ۱۱.۱ شکاف شواهد رقبا و دسترسی

| موضوع | وضعیت | اثر بر تصمیم ساخت |
|---|---|---|
| `robots.txt` و `sitemap.xml` دامنه اصلی | **بازیابی ناموفق** در مرور ابزار؛ خزش ۱۰۰٪ اثبات نشده | نبود Feature در سایت قابل تعبیر به نبود Feature در محصول نیست |
| دسترسی حساب آزمایشی، Manual داخلی، Endpointها، SDK واقعی WIS | **در دسترس نبود** | پروتکل‌های Backend، Schema دقیق و مجوزهای داخلی **[Unverified]** |
| فایل‌ها/عکس‌های پیوست به همین درخواست | **پیوست مستقل مشاهده نشد** | تحلیل فقط روی دارایی عمومی انجام شد |
| ویدئو SmarTower و ویدئوهای سایر محصولات | صفحه/لینک شناسایی شد، اما اجرای فریم‌به‌فریم حاصل نشد | جریان‌های کاری §۵ **طراحی پیشنهادی** هستند، نه مشاهده مستقیم ویدئو |
| PDF TruckFlow | متن نمایه‌شده خوانده شد؛ Screenshot PDF قابل بازیابی نبود | جزئیات UI از عکس وب رسمی و متن PDF؛ متن ریز PDF تأیید بصری نشد |
| Dariel WBX | منابع رسانه صنعتی قدیمی، نه مستند رسمی تازه | ویژگی‌ها با «محدود/کم‌اطمینان» تفسیر؛ برای خرید باید تأیید رسمی شود |
| مدل سخت‌افزار در استقرار واقعی WIS | ناشناخته؛ کاتالوگ محصولات متعدد را معرفی می‌کند | امکان اتصال ANPR/RFID/PLC موردی است؛ Deployment BOM لازم |
| RFID WIS: فرکانس، پروتکل EPC، برد واقعی، آنتن و Tag | **نامشخص**؛ SmarTower UHF قابل تعمیم نیست | Reader/Tag باید بر اساس فلز، آلودگی و نرخ ورود طراحی شود |
| Accuracy، Reliability، GNSS/Point Cloud و API LiDAR | برای محل فعلی اندازه‌گیری نشده | تصمیم خرید LiDAR بدون Error Budget و آزمایش میدانی نامعتبر است |
| اعتبار حقوقی قبض، توزین محور و گواهی در ایران | نیازمند بررسی مقررات و سازمان صادرکننده در محل قرارداد | پیش از Go-live نقشه انطباق حقوقی و گواهی‌های معتبر تدوین شود |
| Limits مربوط به Latency, Camera FPS, Resolution, Queue & Storage | اسناد عمومی اجازه Dimensioning دقیق نمی‌دهند | Site Survey، Acceptance Load، Sizing و آزمون گذردهی لازم است |
| Licensing/قیمت/شرایط API محصولات مقایسه‌ای | بدون قرارداد و استعلام مستقیم تأیید نمی‌شود | در PRD مقدار مالی و تضمین API درج نشده |

### ۱۱.۲ سؤال‌های فنی موردنیاز در RFP و بازدید معدن

1. چند سایت، چند باسکول، چند Lane، کدام جهت حرکت و کدام ظرفیت بیشینه در ساعت/شیفت؟ وضعیت وزن خالی اول است یا پر؟ آیا پیمانکاران از سایت مشترک استفاده می‌کنند؟
2. مدل و Firmware نمایشگر باسکول چیست؟ پورت‌های RS-232/485، Ethernet یا پروتکل خروجی دارند؟ کدام وضعیت‌های Stable/Zero/Overload/Cell Health قابل خواندن‌اند؟ کدام Certificate و موعد دارند؟
3. موقعیت نصب ANPR (روز/شب/گردوغبار/برف/باران)، سرعت عبور، پلاک انواع کامیون، نور مادون‌قرمز و میدان دید، Privacy/Retention تصاویر چگونه است؟
4. RFID باید Card باشد یا UHF EPC Tag؟ محدوده خوانش، مشکل Cross-read خط موازی، Tag فلزی و Tag روی کشنده/تریلر چگونه کنترل می‌شود؟
5. چه مجوزی مرجع نهایی Gate است: حواله فروش، بارنامه، سفارش ERP، سهمیه بارگیری یا مجوز حمل؟ مسئول صدور/لغو و قواعد تناژ/بازه اعتبار کیست؟
6. وزن مجاز بر اساس GVW کل، بار محور، ظرفیت مجوز، ظرفیت ناوگان یا مجموعه‌ای از آنها محاسبه شود؟ در مغایرت معیار اولویت چیست؟
7. در قطعی WAN/ERP، نگهبان اجازه خروج بار دارد؟ چه مجوزهای ازپیش‌تأییدشده‌ای می‌توانند آفلاین مصرف شوند و چه کسی حق Override دارد؟
8. آیا LiDAR برای **حجم فله بار کامیون** است یا ارتفاع/ابعاد خودرو و تشخیص بار نامتقارن؟ آیا مرجع Empty Truck موجود و ثابت است؟ چگالی توده به‌ازای ماده/رطوبت چگونه اندازه‌گیری می‌شود؟
9. برای KPI واقعی FMS داده‌های GPS/Dispatch، بارگیری/تخلیه، سوخت و شیفت در کدام سیستم هستند؟ API یا خروجی قابل اتکا دارند؟
10. تعداد کاربران، محل نصب Edge، نیاز Cybersecurity و قرارداد مالکیت و نگهداشت داده‌ها، SLA، Backup، سیاست Audit و اتصال به ERP دقیقاً چیست؟

### ۱۱.۳ مرزبندی قطعیت و اولویت تصمیم

**تأییدشده از منابع عمومی:** WIS مدیریت توزین و قبض/گزارش [S01، S02]؛ Turn Key/Terminalهای خانواده با RFID، Gate و دوربین [S03–S07]؛ چندباسکول/حضور خودرو در TruckFlow [S11]؛ سلامت لودسل TraxEMT/iQUBE² [S13، S14]؛ اسکن حجمی Loadscan [S15–S17]؛ KPI ناوگان در FMSهای مستقل [S20–S24].

**استنباطی:** چیدمان دقیق کنترل‌ها و رفتار بعضی کلیدهای تصویر قدیمی؛ سازوکار بعضی فیلدها بر اساس Screenshot و نه دستورالعمل User Manual. موارد استنباطی هیچ‌گاه به‌عنوان Business Rule قطعی اعمال نشده‌اند.

**پیشنهادی برای محصول خودمان:** معماری Edge-first، Schema، API، UI، قوانین مجوز، Thresholds، Alert Engine، FMS Mapping، DevOps و استقرار. صحت عملی آن‌ها نیازمند Site Survey، تأیید ذی‌نفع، Integration Test و FAT/SAT است.

**نتیجه معماری:** برای شروع توسعه، ابتدا قرارداد سخت‌افزاری واقعی و قواعد حقوقی توزین را قطعی کنید؛ سپس هسته تراکنش/هویت/مجوز/گیت و Audit را بسازید. افزونه حجم و FMS را مستقل و با Evidence/Version مشخص به همان `Transaction` متصل کنید. این طراحی از الگوهای مستند رقبا بهره می‌گیرد، اما محصول جدید و کد آن مستقل است.


## ۱۲. JSON ساختاریافته (بخش‌های PRD، مدل داده و Rule Engine)

این بلوک برای ورود مستقیم به AI کدنویس است. تمام اجزای کدنویسی و Thresholdها **پیشنهادی** هستند؛ کلید `evidence` به جدول منابع §۲ اشاره می‌کند. ویرایش شناسه‌ها و قراردادها باید با Versioning انجام شود.

```json
{
  "schema_version": "1.0.0",
  "document_type": "Independent Smart Mining Weighbridge Product Specification",
  "language": "fa-IR",
  "research_date": "2026-10-25",
  "usage_note": "Specification for independent implementation; competitor evidence is illustrative, not license to copy branding/source/assets.",
  "evidence_legend": {
    "تأییدشده": "Explicit on referenced vendor document",
    "استنباطی": "Based on screenshot or indirect context",
    "پیشنهادی": "Our proposed implementation, not necessarily present in any competitor"
  },
  "prd": {
    "vision": "یکپارچگی وزن حقوقی، هویت، تردد، مجوز، شواهد و تولید در یک زنجیره ممیزی‌پذیر",
    "release_scope": {
      "MVP": [
        "scale capture",
        "RFID and ANPR events",
        "gate interlocks",
        "permit evaluation",
        "dual weigh",
        "transaction/ticket",
        "audit",
        "edge store-and-forward",
        "reports"
      ],
      "phase_2": [
        "scale diagnostics when supported",
        "calibration workflows",
        "ERP reconciliation",
        "multi-site reporting"
      ],
      "optional_plugins": [
        "lidar_volume",
        "onboard_payload",
        "fleet_kpi",
        "axle_weighing"
      ]
    },
    "personas": [
      {
        "code": "gate_guard",
        "name_fa": "نگهبان",
        "allowed_scope": "مشاهده ورود و خروج، ثبت وضعیت و استثنای پلاک",
        "restrictions": "تغییر وزن ممنوع",
        "confidence": "پیشنهادی",
        "evidence": [
          "S02"
        ]
      },
      {
        "code": "scale_operator",
        "name_fa": "اپراتور توزین",
        "allowed_scope": "مشاهده Weight Live، ثبت توزین مجاز، چاپ قبض",
        "restrictions": "Override فقط با تأیید جدا",
        "confidence": "پیشنهادی",
        "evidence": [
          "S02",
          "S11"
        ]
      },
      {
        "code": "dispatch_officer",
        "name_fa": "متصدی حواله",
        "allowed_scope": "ایجاد/اصلاح سفارش و مجوز و سهمیه",
        "restrictions": "تغییر مقدار وزن ثبت‌شده ممنوع",
        "confidence": "پیشنهادی",
        "evidence": [
          "S19",
          "S25"
        ]
      },
      {
        "code": "shift_supervisor",
        "name_fa": "سرپرست شیفت",
        "allowed_scope": "تأیید استثنا، تغییر وضعیت سفر، گزارش شیفت",
        "restrictions": "ویرایش غیرقابل‌ردیابی ممنوع",
        "confidence": "پیشنهادی",
        "evidence": [
          "S02",
          "S11"
        ]
      },
      {
        "code": "maintenance_engineer",
        "name_fa": "تعمیرات/مترولوژی",
        "allowed_scope": "وضعیت لودسل، گواهی، سرویس، Quarantine",
        "restrictions": "دسترسی به اطلاعات مالی حداقلی",
        "confidence": "پیشنهادی",
        "evidence": [
          "S13",
          "S14",
          "S31"
        ]
      },
      {
        "code": "finance_logistics",
        "name_fa": "مالی/فروش",
        "allowed_scope": "کنترل حواله، بارنامه، صورت‌حساب، خروجی ERP",
        "restrictions": "فرمان مستقیم به راهبند ممنوع",
        "confidence": "پیشنهادی",
        "evidence": [
          "S10",
          "S19"
        ]
      },
      {
        "code": "fleet_analyst",
        "name_fa": "تحلیلگر ناوگان",
        "allowed_scope": "KPI تولید، زمان چرخه، مسیر/پیش‌بینی",
        "restrictions": "اصلاح Raw Weigh Event ممنوع",
        "confidence": "پیشنهادی",
        "evidence": [
          "S20",
          "S23",
          "S21",
          "S22"
        ]
      },
      {
        "code": "auditor",
        "name_fa": "حسابرس",
        "allowed_scope": "گزارش فقط‌خواندنی و دسترسی به Evidence Bundle",
        "restrictions": "حذف رکورد و تغییر Rule ممنوع",
        "confidence": "پیشنهادی",
        "evidence": [
          "S02",
          "S10"
        ]
      },
      {
        "code": "system_admin",
        "name_fa": "مدیر سامانه",
        "allowed_scope": "تعریف دستگاه، تنظیمات و دسترسی‌ها",
        "restrictions": "اصلاح وزن/گواهی بدون فرایند کنترل‌شده ممنوع",
        "confidence": "پیشنهادی",
        "evidence": [
          "S02",
          "S11"
        ]
      },
      {
        "code": "integration_service",
        "name_fa": "حساب سرویس",
        "allowed_scope": "درج رخداد امضاشده و بازیابی با Scope مشخص",
        "restrictions": "رابط کاربری و Override انسانی ممنوع",
        "confidence": "پیشنهادی",
        "evidence": []
      }
    ],
    "user_stories": [
      {
        "id": "US-01",
        "persona": "راننده",
        "story": "با RFID/پلاک شناسایی شوم تا بدون ورود دوباره اطلاعات مجوز و سفر تشخیص داده شود.",
        "acceptance_criteria": "RFID و پلاک متعارض ⇒ ورود به `IDENTITY_REVIEW`، عدم بازشدن خودکار راهبند",
        "evidence": [
          "S08",
          "S11"
        ],
        "confidence": "پیشنهادی"
      },
      {
        "id": "US-02",
        "persona": "اپراتور",
        "story": "فقط زمانی وزن را ثبت کنم که عدد پایدار و کامیون کامل روی صفحه باسکول باشد.",
        "acceptance_criteria": "نبود سیگنال `stable`, `occupied` یا `position_ok` ⇒ Capture Block و نمایش دلیل",
        "evidence": [
          "S09",
          "S19"
        ],
        "confidence": "پیشنهادی"
      },
      {
        "id": "US-03",
        "persona": "مالی",
        "story": "وزن خالص و ماده را با مانده حواله مقایسه و مصرف مجوز را کنترل کنم.",
        "acceptance_criteria": "مقدار مصرف‌شده بیش از مانده مجاز بعد از اعمال تلرانس ⇒ `BLOCK/REVIEW` بدون مصرف سهمیه",
        "evidence": [
          "S19",
          "S25"
        ],
        "confidence": "پیشنهادی"
      },
      {
        "id": "US-04",
        "persona": "نگهبان",
        "story": "پلاک/تصویر ورود و خروج و زمان‌های حضور را در یک رکورد ببینم.",
        "acceptance_criteria": "Eventها UTC ذخیره شوند و در UI با منطقه زمانی سایت نمایش داده شوند",
        "evidence": [
          "S05",
          "S11"
        ],
        "confidence": "پیشنهادی"
      },
      {
        "id": "US-05",
        "persona": "سرپرست",
        "story": "خودروهایی که بیش از آستانه تعیین‌شده در سایت مانده‌اند ببینم.",
        "acceptance_criteria": "هشدار برای سفر باز، و بستن هشدار پس از خروج ثبت‌شده",
        "evidence": [
          "S11"
        ],
        "confidence": "پیشنهادی"
      },
      {
        "id": "US-06",
        "persona": "تعمیرات",
        "story": "با انقضای گواهی یا هشدار لودسل، وضعیت قانونی باسکول را ببینم.",
        "acceptance_criteria": "سلامت سیگنال، گواهی کالیبراسیون و اجازه استفاده تجاری سه وضعیت جدا باشند",
        "evidence": [
          "S13",
          "S14",
          "S31"
        ],
        "confidence": "پیشنهادی"
      },
      {
        "id": "US-07",
        "persona": "حسابرس",
        "story": "تمام مبنای یک توزین شامل Raw Indicator، عکس‌ها، هویت، Rule Results و نسخه مجوز را بازسازی کنم.",
        "acceptance_criteria": "جست‌وجو با `transaction_id` و Export با Hash فایل‌ها",
        "evidence": [
          "S02",
          "S33"
        ],
        "confidence": "پیشنهادی"
      },
      {
        "id": "US-08",
        "persona": "تحلیلگر",
        "story": "تولید شیفت را بر اساس ماده، باسکول، شرکت حمل و محل بارگیری مشاهده کنم.",
        "acceptance_criteria": "وزن‌های ثبت‌شده تکراری محاسبه نشوند؛ Eventهای برگشتی (reversal) در گزارش اصلاحی منعکس شوند",
        "evidence": [
          "S02",
          "S20"
        ],
        "confidence": "پیشنهادی"
      },
      {
        "id": "US-09",
        "persona": "اپراتور",
        "story": "در قطع اینترنت تراکنش‌های سایت را ادامه بدهم.",
        "acceptance_criteria": "با صف محلی، شناسه یکتا و بازپخش idempotent، رکورد دوباره ایجاد نشود",
        "evidence": [
          "S18"
        ],
        "confidence": "پیشنهادی"
      },
      {
        "id": "US-10",
        "persona": "تحلیلگر حجم",
        "story": "پروفایل خالی و پر را کنار هم ببینم و مقدار `m³` را با وزن واقعی مقایسه کنم.",
        "acceptance_criteria": "بدون مرجع خالی معتبر، Volume Status=`UNVERIFIED`",
        "evidence": [
          "S15",
          "S17"
        ],
        "confidence": "پیشنهادی"
      },
      {
        "id": "US-11",
        "persona": "مدیر تجهیزات",
        "story": "اختلاف بار مفید لودر و وزن خالص باسکول را برای سفر یکسان ببینم.",
        "acceptance_criteria": "در صورت نامعتبر بودن تطبیق سفر، KPI اختلاف «فاقد داده کافی» نمایش داده شود",
        "evidence": [
          "S18",
          "S23"
        ],
        "confidence": "پیشنهادی"
      }
    ],
    "functional_requirements": [
      {
        "id": "FR-01",
        "requirement": "تعریف `Site`, `Lane`, `Gate`, `Scale` و اتصال دستگاه به مسیر ورود/خروج",
        "priority": "Must",
        "confidence": "پیشنهادی",
        "evidence": [
          "S03",
          "S11"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-02",
        "requirement": "ادغام رویدادهای RFID با Tag ID، Reader ID، زمان و کیفیت خوانش",
        "priority": "Must",
        "confidence": "پیشنهادی",
        "evidence": [
          "S02",
          "S09"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-03",
        "requirement": "ثبت Plate Read همراه OCR confidence، Snapshot و تطبیق با RFID",
        "priority": "Must",
        "confidence": "پیشنهادی",
        "evidence": [
          "S04",
          "S10"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-04",
        "requirement": "تشخیص حضور کامل خودرو روی باسکول از حسگرهای اختصاصی و وضعیت راهبند",
        "priority": "Must",
        "confidence": "پیشنهادی",
        "evidence": [
          "S09",
          "S19"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-05",
        "requirement": "نمایش وزن زنده، Stable/Motion، Zero/Tare و وضعیت اتصال ابزار",
        "priority": "Must",
        "confidence": "پیشنهادی",
        "evidence": [
          "S02",
          "S13"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-06",
        "requirement": "توزین اول/دوم مستقل از جهت ورود و نوع بار، با محاسبه Gross/Tare/Net",
        "priority": "Must",
        "confidence": "پیشنهادی",
        "evidence": [
          "S02",
          "S11"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-07",
        "requirement": "تعریف تارای ثبت‌شده با اعتبار زمانی و بازبینی اختلاف تارا",
        "priority": "Must",
        "confidence": "پیشنهادی",
        "evidence": [
          "S02",
          "S10"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-08",
        "requirement": "پشتیبانی از چند باسکول، تغییر باسکول توزین دوم با Rule و ثبت دلیل",
        "priority": "Must",
        "confidence": "پیشنهادی",
        "evidence": [
          "S02",
          "S11"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-09",
        "requirement": "تعریف `Vehicle`, `Driver`, `Carrier`, `Customer`, `Material` و ارتباط تاریخی",
        "priority": "Must",
        "confidence": "پیشنهادی",
        "evidence": [
          "S01",
          "S11"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-10",
        "requirement": "دریافت/تعریف `Permit`, `SalesOrder`, `DeliveryNote` و ثبت سهمیه باقی‌مانده",
        "priority": "Must",
        "confidence": "پیشنهادی",
        "evidence": [
          "S19",
          "S25"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-11",
        "requirement": "اعتبارسنجی مجوز: بازه زمانی، وسیله، راننده، ماده، مبدأ/مقصد و مانده وزنی",
        "priority": "Must",
        "confidence": "پیشنهادی",
        "evidence": [
          "S19",
          "S25"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-12",
        "requirement": "ثبت Gate Entry/Exit، زمان‌ماند و بازه صف و Time-in-State",
        "priority": "Must",
        "confidence": "پیشنهادی",
        "evidence": [
          "S11"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-13",
        "requirement": "ذخیره عکس زمان وزن، ورود/خروج و قبل/بعد همراه Hash و برچسب دوربین",
        "priority": "Must",
        "confidence": "پیشنهادی",
        "evidence": [
          "S05",
          "S09",
          "S11"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-14",
        "requirement": "سیاست کنترلی راهبند/چراغ از روی `PERMIT+IDENTITY+WEIGHT+SAFETY`",
        "priority": "Must",
        "confidence": "پیشنهادی",
        "evidence": [
          "S03",
          "S09",
          "S11"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-15",
        "requirement": "چاپ قبض و صدور PDF/CSV/XLSX با نسخه، شمارۀ ردیابی و QR بررسی اصالت",
        "priority": "Must",
        "confidence": "پیشنهادی",
        "evidence": [
          "S02",
          "S11"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-16",
        "requirement": "داشبورد عملیات: وزن زنده، صف، وسایل حاضر، تراکنش باز، مجوزهای مشکوک",
        "priority": "Must",
        "confidence": "پیشنهادی",
        "evidence": [
          "S02",
          "S11",
          "S19"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-17",
        "requirement": "گزارش فیلترپذیر: سفر، ماده، شرکت، وزن، تاریخ، شیفت و خط/باسکول",
        "priority": "Must",
        "confidence": "پیشنهادی",
        "evidence": [
          "S02",
          "S11"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-18",
        "requirement": "RBAC و Audit Trail ثبت ورود کاربر، تغییر تنظیمات، Override و تغییر مجوز",
        "priority": "Must",
        "confidence": "پیشنهادی",
        "evidence": [
          "S02",
          "S10"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-19",
        "requirement": "Event Store و Edge Queue با Sync و جلوگیری از تراکنش تکراری",
        "priority": "Must",
        "confidence": "پیشنهادی",
        "evidence": [
          "S18"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-20",
        "requirement": "API و Outbox یکپارچه‌سازی ERP/مالی + Idempotency و Reconciliation",
        "priority": "Must",
        "confidence": "پیشنهادی",
        "evidence": [
          "S05",
          "S19"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-21",
        "requirement": "پیامک/ایمیل، الگو و Retry با قوانین دریافت هشدار",
        "priority": "Should",
        "confidence": "پیشنهادی",
        "evidence": [
          "S19",
          "S16"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-22",
        "requirement": "پایش Zero Drift، سلامت لودسل، خطاهای عدم‌تقارن از سخت‌افزار پشتیبان",
        "priority": "Should",
        "confidence": "پیشنهادی",
        "evidence": [
          "S13",
          "S14"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-23",
        "requirement": "مدیریت CalibrationRecord، گواهی، تاریخ سررسید و توقف استفاده تجاری",
        "priority": "Should",
        "confidence": "پیشنهادی",
        "evidence": [
          "S31"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-24",
        "requirement": "تشخیص تقلب: خودرو ناقص روی باسکول، تکرار وزن، تناقض هویت/عکس، تعویض تگ",
        "priority": "Must",
        "confidence": "پیشنهادی",
        "evidence": [
          "S09",
          "S19",
          "S33"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-25",
        "requirement": "ماژول اسکن خالی/پر LiDAR و نمایش Point Cloud و Volume",
        "priority": "Could",
        "confidence": "پیشنهادی",
        "evidence": [
          "S15",
          "S17",
          "S16"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-26",
        "requirement": "تخمین وزن حجمی با Density نسخه‌بندی‌شده، نمایش عدم قطعیت و مقایسه با باسکول",
        "priority": "Could",
        "confidence": "پیشنهادی",
        "evidence": [
          "S15"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-27",
        "requirement": "دریافت PayloadEvent از لودر/شاول و تطبیق با تراکنش باسکول",
        "priority": "Could",
        "confidence": "پیشنهادی",
        "evidence": [
          "S18",
          "S23"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-28",
        "requirement": "ماژول KPI واقعی ناوگان: چرخه، توقف، سفر، تولید، بار مفید و سوخت",
        "priority": "Could",
        "confidence": "پیشنهادی",
        "evidence": [
          "S20",
          "S23",
          "S21",
          "S22"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-29",
        "requirement": "چندسایتی و داشبورد مرکزی با تعیین مالکیت داده برای هر سایت",
        "priority": "Should",
        "confidence": "پیشنهادی",
        "evidence": [
          "S10",
          "S11",
          "S19"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-30",
        "requirement": "هشدار استاندارد با Severity، Acknowledge، Escalate، Resolve و شواهد",
        "priority": "Must",
        "confidence": "پیشنهادی",
        "evidence": [
          "S14",
          "S19"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-31",
        "requirement": "حالت Manual Exception فقط با اختیار مشخص، دلیل و بدون جعل داده دستگاه",
        "priority": "Must",
        "confidence": "پیشنهادی",
        "evidence": [
          "S11",
          "S33"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      },
      {
        "id": "FR-32",
        "requirement": "بسته شواهد تراکنش (Evidence Bundle) با وزن خام، تصویر، رخداد، تصمیم Rule و هش",
        "priority": "Must",
        "confidence": "پیشنهادی",
        "evidence": [
          "S02",
          "S05",
          "S33"
        ],
        "verification": "آزمون پذیرش مبتنی بر رفتار توصیف‌شده؛ جزئیات در FAT/SAT پروژه قطعی شود"
      }
    ],
    "non_functional_requirements": [
      {
        "id": "NFR-01",
        "requirement": "هیچ رویداد تأیید وزن در قطع اینترنتِ بیرونی از بین نرود، به شرط فعال‌بودن ذخیره‌سازی محلی",
        "verification": "شبیه‌سازی قطع WAN و Restart، کنترل شمارش Event",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-02",
        "requirement": "هر درخواست با `idempotency_key` تکراری تنها یک تراکنش مؤثر بسازد",
        "verification": "ارسال ۱۰۰ بار پیام تکراری، مقایسه شمار رکورد",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-03",
        "requirement": "مسیر ذخیره WeightEvent فقط از Adapter مورد تأیید و ثبت Device Identity انجام شود",
        "verification": "آزمون جعل Client-side Weight و بررسی رد",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-04",
        "requirement": "نمایش وزن زنده با وضعیت اتصال و زمان آخرین داده؛ هر داده قدیمی به‌وضوح `STALE` شود",
        "verification": "توقف Serial/TCP و بازبینی UI",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-05",
        "requirement": "زمان پاسخ صفحه عملیاتی در شبکه LAN سالم هدف `p95 ≤ 2s` بدون بارهای سنگین",
        "verification": "Load Test با سناریوی واقعی؛ هدف پیشنهادی",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-06",
        "requirement": "هدف `≥ 99.5%` دسترس‌پذیری خدمات محلی در دوره توافق‌شده، بدون شمارش خاموشی برنامه‌ریزی‌شده",
        "verification": "شاخص Monitoring و گزارش توقف؛ هدف پیشنهادی",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-07",
        "requirement": "تمام زمان‌ها ISO 8601 با UTC و شناسه منطقه زمانی IANA سایت؛ نمایش به تقویم/زبان UI",
        "verification": "تست عبور از نیمه‌شب و DST",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-08",
        "requirement": "نقش‌ها Default Deny، MFA برای مدیران، TLS داخلی در صورت امکان و رمزنگاری در حالت سکون",
        "verification": "Security Review، PenTest، RBAC Regression",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-09",
        "requirement": "Audit Event فقط افزایشی، پیوند Hash یا WORM برای شواهد حساس",
        "verification": "تست تغییر غیرمجاز و صحت‌سنجی Hash",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-10",
        "requirement": "همه مسیرهای `Gate Open` fail-safe با اینترلاک سخت‌افزاری و E-Stop مستقل",
        "verification": "FAT/SAT مطابق طراحی ایمنی پروژه؛ سامانه نرم‌افزاری جایگزین Safety PLC نیست",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-11",
        "requirement": "فهرست تراکنش و گزارش ماهانه قابل جست‌وجو با صفحه‌بندی و ایندکس",
        "verification": "Query Plan و Load Test در حجم داده تأییدشده",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-12",
        "requirement": "نسخه‌بندی API، Schema و Device Driver؛ راه‌اندازی افزونه بدون تغییر رکوردهای تاریخی",
        "verification": "Compatibility Test و Migration Test",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-13",
        "requirement": "فایل تصویر و Point Cloud در Object Storage با Lifecycle و Retention قابل تنظیم",
        "verification": "آزمون Backup/Restore و Access Policy",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-14",
        "requirement": "هر یکپارچه‌سازی خارجی دارای Retry+DLQ، ثبت Failure و امکان Reconciliation",
        "verification": "قطع ERP و ارسال مجدد در شرایط مختلف",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-15",
        "requirement": "UTF-8، فارسی RTL و انگلیسی LTR، تاریخ شمسی فقط لایه نمایش و واحد وزن SI",
        "verification": "آزمون کاربری و Localisation",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-16",
        "requirement": "عملکرد تصمیم‌گیری محلی Gate مستقل از اینترنت عمومی؛ Ruleهای حقوقی وابسته به ERP طبق سیاست Offline سایت",
        "verification": "قطع ارتباط ERP و مشاهده `HOLD` در Permitهای نامعتبر/نامشخص",
        "confidence": "پیشنهادی"
      }
    ],
    "transaction_state_machine": {
      "states": [
        "CREATED",
        "GATE_IDENTIFIED",
        "ENTRY_AUTHORIZED",
        "SITE_ENTERED",
        "FIRST_WEIGHT_CAPTURED",
        "LOADING_OR_UNLOADING",
        "SECOND_WEIGHT_CAPTURED",
        "PERMIT_VALIDATED",
        "EXIT_AUTHORIZED",
        "EXITED",
        "CLOSED"
      ],
      "exception_states": [
        "IDENTITY_REVIEW",
        "HOLD",
        "OVERRIDE_PENDING",
        "ABORTED",
        "REVERSED",
        "SYNC_PENDING",
        "SYNC_ERROR"
      ],
      "transitions": [
        {
          "from": "CREATED",
          "to": "GATE_IDENTIFIED",
          "guard": "at least one nonambiguous identity evidence"
        },
        {
          "from": "GATE_IDENTIFIED",
          "to": "ENTRY_AUTHORIZED",
          "guard": "identity, entry permit, and interlocks pass"
        },
        {
          "from": "ENTRY_AUTHORIZED",
          "to": "SITE_ENTERED",
          "guard": "physical gate sensor confirms crossing"
        },
        {
          "from": "SITE_ENTERED",
          "to": "FIRST_WEIGHT_CAPTURED",
          "guard": "scale stable; correct positioning; device trusted"
        },
        {
          "from": "FIRST_WEIGHT_CAPTURED",
          "to": "LOADING_OR_UNLOADING",
          "guard": "service-area transition detected or logged"
        },
        {
          "from": "LOADING_OR_UNLOADING",
          "to": "SECOND_WEIGHT_CAPTURED",
          "guard": "stable second scale capture with identity correlation"
        },
        {
          "from": "SECOND_WEIGHT_CAPTURED",
          "to": "PERMIT_VALIDATED",
          "guard": "gross>=tare, permit valid, atomic quota reserved"
        },
        {
          "from": "PERMIT_VALIDATED",
          "to": "EXIT_AUTHORIZED",
          "guard": "safety, evidence and policy result PASS"
        },
        {
          "from": "EXIT_AUTHORIZED",
          "to": "EXITED",
          "guard": "physical sensor reports exit; gate command/ack recorded"
        },
        {
          "from": "EXITED",
          "to": "CLOSED",
          "guard": "receipt finalized and local transaction persisted"
        }
      ]
    },
    "api_contracts": [
      {
        "method": "GET",
        "path": "/api/v1/sites/{siteId}/scales/{scaleId}/status",
        "auth": "scale.read",
        "idempotent": true
      },
      {
        "method": "POST",
        "path": "/api/v1/identity/resolve",
        "auth": "identity.resolve",
        "idempotent": true
      },
      {
        "method": "POST",
        "path": "/api/v1/transactions",
        "auth": "transaction.create",
        "idempotency_key_required": true
      },
      {
        "method": "POST",
        "path": "/api/v1/transactions/{id}/weigh",
        "auth": "device.scale.capture",
        "idempotency_key_required": true,
        "device_attestation_required": true
      },
      {
        "method": "POST",
        "path": "/api/v1/transactions/{id}/evaluate",
        "auth": "transaction.evaluate",
        "idempotent": true
      },
      {
        "method": "POST",
        "path": "/api/v1/gates/{gateId}/release-request",
        "auth": "gate.release",
        "idempotency_key_required": true,
        "local_plc_interlock_required": true
      },
      {
        "method": "GET",
        "path": "/api/v1/transactions/{id}/evidence",
        "auth": "audit.read",
        "idempotent": true
      },
      {
        "method": "POST",
        "path": "/api/v1/permits/import",
        "auth": "integration.permit.write",
        "idempotency_key_required": true
      },
      {
        "method": "POST",
        "path": "/api/v1/plugins/lidar/scans",
        "auth": "plugin.lidar.write",
        "idempotency_key_required": true
      },
      {
        "method": "POST",
        "path": "/api/v1/plugins/payload/events",
        "auth": "plugin.payload.write",
        "idempotency_key_required": true
      }
    ],
    "acceptance_requirements": {
      "site_fat": [
        "stable/unstable scale capture",
        "full/partial vehicle positioning",
        "camera capture",
        "rfid/plate agreement and conflict",
        "entry and exit gate ack",
        "duplex weighing"
      ],
      "software_sat": [
        "permit expiry",
        "quota atomic lock",
        "offline edge sync",
        "audit tamper test",
        "ERP outbox reconciliation",
        "role restrictions",
        "calibration quarantine"
      ]
    },
    "confidence": "پیشنهادی"
  },
  "data_model": {
    "storage_units": {
      "mass": "kg",
      "volume": "m3",
      "density": "kg/m3",
      "timestamps": "UTC ISO-8601"
    },
    "data_governance": {
      "append_only_entities": [
        "WeighEvent",
        "GateEvent",
        "PlateRead",
        "RFIDRead",
        "AuditLog"
      ],
      "soft_change": "compensating event and revision; no raw overwrite",
      "media_hash": "sha256",
      "confidence": "پیشنهادی"
    },
    "entities": [
      {
        "name": "Site",
        "fields": [
          {
            "name": "id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "name",
            "type": "text",
            "required": true
          },
          {
            "name": "timezone",
            "type": "text",
            "required": true
          },
          {
            "name": "is_active",
            "type": "boolean",
            "required": true
          },
          {
            "name": "policy_version",
            "type": "text",
            "required": true
          }
        ],
        "constraints_and_relations": "چند باسکول، چند گیت؛ کلید Tenant",
        "confidence": "پیشنهادی"
      },
      {
        "name": "Lane",
        "fields": [
          {
            "name": "id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "site_id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "direction",
            "type": "enum",
            "required": true
          },
          {
            "name": "gate_id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "scale_id",
            "type": "uuid",
            "required": false
          }
        ],
        "constraints_and_relations": "تعریف ورودی/خروجی/دوطرفه",
        "confidence": "پیشنهادی"
      },
      {
        "name": "Vehicle",
        "fields": [
          {
            "name": "id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "plate_normalized",
            "type": "text",
            "required": true
          },
          {
            "name": "plate_raw",
            "type": "text",
            "required": true
          },
          {
            "name": "country_code",
            "type": "text",
            "required": false
          },
          {
            "name": "type",
            "type": "enum",
            "required": true
          },
          {
            "name": "legal_gvw_kg",
            "type": "decimal",
            "required": false
          },
          {
            "name": "nominal_tare_kg",
            "type": "decimal",
            "required": false
          },
          {
            "name": "rfid_tag_id",
            "type": "uuid",
            "required": false
          },
          {
            "name": "active",
            "type": "boolean",
            "required": true
          }
        ],
        "constraints_and_relations": "یکتایی پلاک در قلمرو مقررات و بازه اعتبار؛ تارا نسخه‌بندی شود",
        "confidence": "پیشنهادی"
      },
      {
        "name": "Driver",
        "fields": [
          {
            "name": "id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "full_name",
            "type": "text",
            "required": true
          },
          {
            "name": "identity_ref",
            "type": "text",
            "required": false
          },
          {
            "name": "license_ref",
            "type": "text",
            "required": false
          },
          {
            "name": "valid_from",
            "type": "date",
            "required": false
          },
          {
            "name": "valid_to",
            "type": "date",
            "required": false
          },
          {
            "name": "carrier_id",
            "type": "uuid",
            "required": false
          }
        ],
        "constraints_and_relations": "داده هویتی با حداقل‌گرایی، رمزنگاری و RBAC",
        "confidence": "پیشنهادی"
      },
      {
        "name": "Carrier",
        "fields": [
          {
            "name": "id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "legal_name",
            "type": "text",
            "required": true
          },
          {
            "name": "tax_ref",
            "type": "text",
            "required": false
          },
          {
            "name": "contact_ref",
            "type": "text",
            "required": false
          },
          {
            "name": "active",
            "type": "boolean",
            "required": true
          }
        ],
        "constraints_and_relations": "رابطه با خودرو/راننده و قرارداد",
        "confidence": "پیشنهادی"
      },
      {
        "name": "Customer",
        "fields": [
          {
            "name": "id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "legal_name",
            "type": "text",
            "required": true
          },
          {
            "name": "account_ref",
            "type": "text",
            "required": false
          },
          {
            "name": "erp_ref",
            "type": "text",
            "required": false
          },
          {
            "name": "type",
            "type": "enum",
            "required": true
          }
        ],
        "constraints_and_relations": "خریدار/تأمین‌کننده، نقش در Transaction Snapshot",
        "confidence": "پیشنهادی"
      },
      {
        "name": "Material",
        "fields": [
          {
            "name": "id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "code",
            "type": "text",
            "required": true
          },
          {
            "name": "name",
            "type": "text",
            "required": true
          },
          {
            "name": "category",
            "type": "text",
            "required": true
          },
          {
            "name": "grade",
            "type": "decimal",
            "required": false
          },
          {
            "name": "grade_unit",
            "type": "text",
            "required": false
          },
          {
            "name": "density_kg_m3",
            "type": "decimal",
            "required": false
          },
          {
            "name": "density_method",
            "type": "text",
            "required": false
          }
        ],
        "constraints_and_relations": "عیار/چگالی تنها در صورت وجود اندازه‌گیری معتبر",
        "confidence": "پیشنهادی"
      },
      {
        "name": "Permit",
        "fields": [
          {
            "name": "id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "permit_no",
            "type": "text",
            "required": true
          },
          {
            "name": "permit_type",
            "type": "enum",
            "required": true
          },
          {
            "name": "sales_order_no",
            "type": "text",
            "required": false
          },
          {
            "name": "material_id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "customer_id",
            "type": "uuid",
            "required": false
          },
          {
            "name": "source_location_id",
            "type": "uuid",
            "required": false
          },
          {
            "name": "destination_location_id",
            "type": "uuid",
            "required": false
          },
          {
            "name": "valid_from",
            "type": "timestamptz",
            "required": true
          },
          {
            "name": "valid_to",
            "type": "timestamptz",
            "required": true
          },
          {
            "name": "max_qty_kg",
            "type": "decimal",
            "required": false
          },
          {
            "name": "consumed_qty_kg",
            "type": "decimal",
            "required": true
          },
          {
            "name": "status",
            "type": "enum",
            "required": true
          },
          {
            "name": "version",
            "type": "int",
            "required": true
          }
        ],
        "constraints_and_relations": "کنترل همزمانی مصرف مجوز با Lock/Atomic CAS؛ وجود مدرک حمل به‌صورت attachment",
        "confidence": "پیشنهادی"
      },
      {
        "name": "Transaction",
        "fields": [
          {
            "name": "id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "site_id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "direction",
            "type": "enum",
            "required": true
          },
          {
            "name": "status",
            "type": "enum",
            "required": true
          },
          {
            "name": "vehicle_id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "driver_id",
            "type": "uuid",
            "required": false
          },
          {
            "name": "carrier_id",
            "type": "uuid",
            "required": false
          },
          {
            "name": "customer_id",
            "type": "uuid",
            "required": false
          },
          {
            "name": "material_id",
            "type": "uuid",
            "required": false
          },
          {
            "name": "permit_id",
            "type": "uuid",
            "required": false
          },
          {
            "name": "gross_kg",
            "type": "decimal",
            "required": false
          },
          {
            "name": "tare_kg",
            "type": "decimal",
            "required": false
          },
          {
            "name": "net_kg",
            "type": "decimal",
            "required": false
          },
          {
            "name": "started_at",
            "type": "timestamptz",
            "required": true
          },
          {
            "name": "closed_at",
            "type": "timestamptz",
            "required": false
          },
          {
            "name": "shift_id",
            "type": "uuid",
            "required": false
          },
          {
            "name": "revision",
            "type": "int",
            "required": true
          }
        ],
        "constraints_and_relations": "Aggregate Root؛ حفظ نسخه داده‌های تاریخی؛ یک وضعیت و State Transition هر بار",
        "confidence": "پیشنهادی"
      },
      {
        "name": "WeighEvent",
        "fields": [
          {
            "name": "id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "transaction_id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "scale_id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "step",
            "type": "enum(FIRST,SECOND,EXTRA)",
            "required": true
          },
          {
            "name": "role",
            "type": "enum(GROSS,TARE,REFERENCE)",
            "required": true
          },
          {
            "name": "raw_weight_kg",
            "type": "decimal",
            "required": true
          },
          {
            "name": "stable",
            "type": "boolean",
            "required": true
          },
          {
            "name": "position_ok",
            "type": "boolean",
            "required": true
          },
          {
            "name": "device_status",
            "type": "jsonb",
            "required": true
          },
          {
            "name": "captured_at",
            "type": "timestamptz",
            "required": true
          },
          {
            "name": "adapter_version",
            "type": "text",
            "required": true
          },
          {
            "name": "operator_id",
            "type": "uuid",
            "required": false
          },
          {
            "name": "evidence_refs",
            "type": "uuid[]",
            "required": true
          }
        ],
        "constraints_and_relations": "Append-only، شناسه یکتای پیام خام؛ ثبت وضعیت دستگاه پیش از Capture",
        "confidence": "پیشنهادی"
      },
      {
        "name": "GateEvent",
        "fields": [
          {
            "name": "id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "transaction_id",
            "type": "uuid",
            "required": false
          },
          {
            "name": "gate_id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "lane_id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "kind",
            "type": "enum(ARRIVAL,ENTRY,EXIT,OPEN_COMMAND,OPEN_ACK)",
            "required": true
          },
          {
            "name": "happened_at",
            "type": "timestamptz",
            "required": true
          },
          {
            "name": "source_id",
            "type": "text",
            "required": true
          },
          {
            "name": "decision",
            "type": "text",
            "required": false
          }
        ],
        "constraints_and_relations": "Arrival/Exit زمان فیزیکی مستقل از فرمان نرم‌افزار",
        "confidence": "پیشنهادی"
      },
      {
        "name": "Camera",
        "fields": [
          {
            "name": "id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "site_id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "lane_id",
            "type": "uuid",
            "required": false
          },
          {
            "name": "purpose",
            "type": "enum(ANPR,FRONT,REAR,TOP)",
            "required": true
          },
          {
            "name": "endpoint_ref",
            "type": "text",
            "required": true
          },
          {
            "name": "calibration_id",
            "type": "uuid",
            "required": false
          },
          {
            "name": "status",
            "type": "enum",
            "required": true
          }
        ],
        "constraints_and_relations": "ذخیره Secret در Vault نه ستون آشکار",
        "confidence": "پیشنهادی"
      },
      {
        "name": "PlateRead",
        "fields": [
          {
            "name": "id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "camera_id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "raw_text",
            "type": "text",
            "required": true
          },
          {
            "name": "normalized_text",
            "type": "text",
            "required": true
          },
          {
            "name": "confidence",
            "type": "decimal",
            "required": false
          },
          {
            "name": "snapshot_id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "detected_at",
            "type": "timestamptz",
            "required": true
          },
          {
            "name": "vehicle_candidate_id",
            "type": "uuid",
            "required": false
          },
          {
            "name": "review_status",
            "type": "enum",
            "required": true
          }
        ],
        "constraints_and_relations": "ورودی AI احتمال‌دار، نه اثبات قطعی هویت",
        "confidence": "پیشنهادی"
      },
      {
        "name": "RFIDRead",
        "fields": [
          {
            "name": "id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "reader_id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "tag_epc",
            "type": "text",
            "required": true
          },
          {
            "name": "signal_quality",
            "type": "decimal",
            "required": false
          },
          {
            "name": "detected_at",
            "type": "timestamptz",
            "required": true
          },
          {
            "name": "vehicle_candidate_id",
            "type": "uuid",
            "required": false
          }
        ],
        "constraints_and_relations": "EPC شناسه سخت‌افزار؛ جلوگیری از تکرار خوانش در پنجره زمانی",
        "confidence": "پیشنهادی"
      },
      {
        "name": "Scale",
        "fields": [
          {
            "name": "id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "site_id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "serial_no",
            "type": "text",
            "required": true
          },
          {
            "name": "indicator_model",
            "type": "text",
            "required": true
          },
          {
            "name": "adapter_id",
            "type": "text",
            "required": true
          },
          {
            "name": "capacity_kg",
            "type": "decimal",
            "required": false
          },
          {
            "name": "resolution_kg",
            "type": "decimal",
            "required": false
          },
          {
            "name": "calibration_status",
            "type": "enum",
            "required": true
          },
          {
            "name": "operational_status",
            "type": "enum",
            "required": true
          },
          {
            "name": "last_seen_at",
            "type": "timestamptz",
            "required": false
          }
        ],
        "constraints_and_relations": "گواهی مستقل از telemetry؛ capacity از Data Sheet/گواهی حقیقی",
        "confidence": "پیشنهادی"
      },
      {
        "name": "CalibrationRecord",
        "fields": [
          {
            "name": "id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "scale_id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "certificate_no",
            "type": "text",
            "required": true
          },
          {
            "name": "issuer",
            "type": "text",
            "required": true
          },
          {
            "name": "performed_at",
            "type": "date",
            "required": true
          },
          {
            "name": "due_at",
            "type": "date",
            "required": false
          },
          {
            "name": "result",
            "type": "enum",
            "required": true
          },
          {
            "name": "attachment_id",
            "type": "uuid",
            "required": false
          },
          {
            "name": "verified_by",
            "type": "uuid",
            "required": false
          }
        ],
        "constraints_and_relations": "تعریف `due_at` از ضوابط و گواهی واقعی؛ expiration سنجش سامانه‌ای است",
        "confidence": "پیشنهادی"
      },
      {
        "name": "LoadCellHealth",
        "fields": [
          {
            "name": "id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "scale_id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "channel_no",
            "type": "int",
            "required": true
          },
          {
            "name": "metric_code",
            "type": "text",
            "required": true
          },
          {
            "name": "value",
            "type": "decimal",
            "required": true
          },
          {
            "name": "unit",
            "type": "text",
            "required": true
          },
          {
            "name": "sampled_at",
            "type": "timestamptz",
            "required": true
          },
          {
            "name": "device_flag",
            "type": "text",
            "required": false
          }
        ],
        "constraints_and_relations": "فقط با سخت‌افزار دارای تشخیص سلامت؛ [S13، S14]",
        "confidence": "پیشنهادی"
      },
      {
        "name": "Alert",
        "fields": [
          {
            "name": "id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "rule_id",
            "type": "text",
            "required": true
          },
          {
            "name": "site_id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "entity_type",
            "type": "text",
            "required": true
          },
          {
            "name": "entity_id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "severity",
            "type": "enum",
            "required": true
          },
          {
            "name": "status",
            "type": "enum",
            "required": true
          },
          {
            "name": "detected_at",
            "type": "timestamptz",
            "required": true
          },
          {
            "name": "ack_at",
            "type": "timestamptz",
            "required": false
          },
          {
            "name": "resolved_at",
            "type": "timestamptz",
            "required": false
          },
          {
            "name": "evidence",
            "type": "jsonb",
            "required": true
          },
          {
            "name": "assigned_to",
            "type": "uuid",
            "required": false
          }
        ],
        "constraints_and_relations": "ثبت وضعیت اقدام و Escalation",
        "confidence": "پیشنهادی"
      },
      {
        "name": "Shift",
        "fields": [
          {
            "name": "id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "site_id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "name",
            "type": "text",
            "required": true
          },
          {
            "name": "starts_at",
            "type": "timestamptz",
            "required": true
          },
          {
            "name": "ends_at",
            "type": "timestamptz",
            "required": true
          },
          {
            "name": "crew_id",
            "type": "uuid",
            "required": false
          }
        ],
        "constraints_and_relations": "برای شیفت عبوری از نیمه‌شب زمان مطلق لازم است",
        "confidence": "پیشنهادی"
      },
      {
        "name": "Equipment",
        "fields": [
          {
            "name": "id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "site_id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "type",
            "type": "enum(TRUCK,LOADER,SHOVEL,EXCAVATOR)",
            "required": true
          },
          {
            "name": "asset_no",
            "type": "text",
            "required": true
          },
          {
            "name": "telemetry_source",
            "type": "text",
            "required": false
          },
          {
            "name": "fuel_unit",
            "type": "text",
            "required": false
          }
        ],
        "constraints_and_relations": "وسایل تولید با Vehicle تجاری قابل اتصال‌اند",
        "confidence": "پیشنهادی"
      },
      {
        "name": "LidarScan",
        "fields": [
          {
            "name": "id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "transaction_id",
            "type": "uuid",
            "required": false
          },
          {
            "name": "vehicle_id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "scan_role",
            "type": "enum(EMPTY,LOADED)",
            "required": true
          },
          {
            "name": "scanner_id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "reference_scan_id",
            "type": "uuid",
            "required": false
          },
          {
            "name": "pointcloud_asset_id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "volume_m3",
            "type": "decimal",
            "required": false
          },
          {
            "name": "quality",
            "type": "enum",
            "required": true
          },
          {
            "name": "algorithm_version",
            "type": "text",
            "required": true
          },
          {
            "name": "scanned_at",
            "type": "timestamptz",
            "required": true
          }
        ],
        "constraints_and_relations": "هندسه خودرو/اتاق بار، Orientation و Alignment معتبر الزامی",
        "confidence": "پیشنهادی"
      },
      {
        "name": "PayloadEvent",
        "fields": [
          {
            "name": "id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "equipment_id",
            "type": "uuid",
            "required": true
          },
          {
            "name": "vehicle_id",
            "type": "uuid",
            "required": false
          },
          {
            "name": "transaction_id",
            "type": "uuid",
            "required": false
          },
          {
            "name": "payload_kg",
            "type": "decimal",
            "required": false
          },
          {
            "name": "bucket_weight_kg",
            "type": "decimal",
            "required": false
          },
          {
            "name": "event_at",
            "type": "timestamptz",
            "required": true
          },
          {
            "name": "source_quality",
            "type": "enum",
            "required": true
          },
          {
            "name": "correlation_method",
            "type": "text",
            "required": false
          }
        ],
        "constraints_and_relations": "مستقل از WeighEvent حقوقی؛ ممکن است سفر Match نشود",
        "confidence": "پیشنهادی"
      }
    ],
    "supplementary_entities": [
      "Order",
      "DeliveryNote",
      "Location",
      "Gate",
      "Reader",
      "DeviceConnection",
      "DeviceCommand",
      "PositionSensorEvent",
      "AuditLog",
      "MediaAsset",
      "User",
      "Role",
      "Permission",
      "PolicyVersion",
      "AlertRule",
      "IntegrationOutbox",
      "ExternalSyncRecord",
      "PermitReservation",
      "OperationalStatusEvent",
      "FuelEvent",
      "ManualOverride",
      "DensitySample"
    ],
    "relations": [
      {
        "from": "Lane.site_id",
        "to": "Site.id",
        "cardinality": "many_to_one"
      },
      {
        "from": "Vehicle.rfid_tag_id",
        "to": "RFID tag registry id",
        "cardinality": "optional_one_to_one"
      },
      {
        "from": "Driver.carrier_id",
        "to": "Carrier.id",
        "cardinality": "optional_many_to_one"
      },
      {
        "from": "Permit.material_id",
        "to": "Material.id",
        "cardinality": "many_to_one"
      },
      {
        "from": "Transaction.vehicle_id",
        "to": "Vehicle.id",
        "cardinality": "many_to_one"
      },
      {
        "from": "Transaction.permit_id",
        "to": "Permit.id",
        "cardinality": "optional_many_to_one"
      },
      {
        "from": "Transaction.shift_id",
        "to": "Shift.id",
        "cardinality": "optional_many_to_one"
      },
      {
        "from": "WeighEvent.transaction_id",
        "to": "Transaction.id",
        "cardinality": "many_to_one"
      },
      {
        "from": "WeighEvent.scale_id",
        "to": "Scale.id",
        "cardinality": "many_to_one"
      },
      {
        "from": "GateEvent.transaction_id",
        "to": "Transaction.id",
        "cardinality": "optional_many_to_one"
      },
      {
        "from": "PlateRead.camera_id",
        "to": "Camera.id",
        "cardinality": "many_to_one"
      },
      {
        "from": "CalibrationRecord.scale_id",
        "to": "Scale.id",
        "cardinality": "many_to_one"
      },
      {
        "from": "LoadCellHealth.scale_id",
        "to": "Scale.id",
        "cardinality": "many_to_one"
      },
      {
        "from": "LidarScan.transaction_id",
        "to": "Transaction.id",
        "cardinality": "optional_many_to_one"
      },
      {
        "from": "PayloadEvent.equipment_id",
        "to": "Equipment.id",
        "cardinality": "many_to_one"
      },
      {
        "from": "PayloadEvent.transaction_id",
        "to": "Transaction.id",
        "cardinality": "optional_many_to_one"
      }
    ],
    "invariants": [
      "mass_net_kg = gross_kg - tare_kg, provided both valid",
      "never use abs(gross - tare) to mask invalid sequence",
      "zero/negative net is exception; block unsupported business event",
      "single authoritative legal weight originates from trusted certified scale adapter",
      "uncertainty of volume/density must not be represented as certified scale weight",
      "quota must be reserved/consumed atomically with idempotency key",
      "unique(site_id, transaction_public_no)",
      "unique(source_device_id, source_event_id)",
      "closed transaction immutable except linked compensating event",
      "plate OCR confidence alone not sufficient for legal identity",
      "disable unavailable plugin KPI instead of emitting false 0"
    ],
    "confidence": "پیشنهادی"
  },
  "alert_rules": [
    {
      "id": "AL-01",
      "title": "وزن ناپایدار",
      "condition": "`scale.stable=false` هنگام Capture",
      "threshold": {
        "mode": "site_configurable_or_device_flag",
        "specification": "Flag سازنده، بدون آستانه ساختگی"
      },
      "action": "BLOCK وزن و نمایش Stale/Stable؛ ثبت Raw",
      "severity": "POLICY_DEPENDENT",
      "confidence": "پیشنهادی",
      "evidence": [
        "S02",
        "S13"
      ],
      "default_unknown_result": "REVIEW_OR_HOLD"
    },
    {
      "id": "AL-02",
      "title": "توقف یا وضعیت نامعتبر خودرو",
      "condition": "`position_ok != true` یا Presence Sensors متناقض",
      "threshold": {
        "mode": "site_configurable_or_device_flag",
        "specification": "همه سنسورهای ایمنی طبق Design Spec"
      },
      "action": "BLOCK وزن/گیت، هدایت خودرو به موضع درست",
      "severity": "POLICY_DEPENDENT",
      "confidence": "پیشنهادی",
      "evidence": [
        "S09",
        "S19"
      ],
      "default_unknown_result": "REVIEW_OR_HOLD"
    },
    {
      "id": "AL-03",
      "title": "RFID با پلاک ناسازگار",
      "condition": "`rfid.vehicle_id != plate.vehicle_id` با هر دو شناسه معتبر",
      "threshold": {
        "mode": "site_configurable_or_device_flag",
        "specification": "Matching Policy نسخه‌بندی‌شده"
      },
      "action": "HOLD، گرفتن عکس، تصدیق انسانی",
      "severity": "POLICY_DEPENDENT",
      "confidence": "پیشنهادی",
      "evidence": [
        "S09",
        "S10"
      ],
      "default_unknown_result": "REVIEW_OR_HOLD"
    },
    {
      "id": "AL-04",
      "title": "پلاک با اطمینان پایین",
      "condition": "`plate.confidence < min_plate_confidence` یا تصویر ناخوانا",
      "threshold": {
        "mode": "site_configurable_or_device_flag",
        "specification": "`min_plate_confidence` از داده محلی"
      },
      "action": "REVIEW، تکرار تصویر/تصحیح کنترل‌شده",
      "severity": "POLICY_DEPENDENT",
      "confidence": "پیشنهادی",
      "evidence": [
        "S04",
        "S10"
      ],
      "default_unknown_result": "REVIEW_OR_HOLD"
    },
    {
      "id": "AL-05",
      "title": "مجوز نامعتبر",
      "condition": "`now` خارج بازه معتبر، Status مسدود یا مجوز یافت نشد",
      "threshold": {
        "mode": "site_configurable_or_device_flag",
        "specification": "تاریخ و قواعد مصوب قرارداد/سازمان"
      },
      "action": "BLOCK خروج بار، ارجاع به فروش/حمل",
      "severity": "POLICY_DEPENDENT",
      "confidence": "پیشنهادی",
      "evidence": [
        "S19",
        "S25"
      ],
      "default_unknown_result": "REVIEW_OR_HOLD"
    },
    {
      "id": "AL-06",
      "title": "سهمیه ناکافی",
      "condition": "`requested_net_kg > remaining_permit_kg`",
      "threshold": {
        "mode": "site_configurable_or_device_flag",
        "specification": "`max_qty/consumed/reserved` نسخه معتبر"
      },
      "action": "BLOCK تایید بار/ارسال ERP",
      "severity": "POLICY_DEPENDENT",
      "confidence": "پیشنهادی",
      "evidence": [
        "S19"
      ],
      "default_unknown_result": "REVIEW_OR_HOLD"
    },
    {
      "id": "AL-07",
      "title": "اضافه‌بار",
      "condition": "`gross_kg > legal_gvw_kg` یا وزن بیشتر از Capacity باسکول",
      "threshold": {
        "mode": "site_configurable_or_device_flag",
        "specification": "GVW قانونیِ پلاک/محور و Capacity گواهی"
      },
      "action": "BLOCK گیت، درخواست اصلاح بار",
      "severity": "POLICY_DEPENDENT",
      "confidence": "پیشنهادی",
      "evidence": [
        "S02",
        "S19"
      ],
      "default_unknown_result": "REVIEW_OR_HOLD"
    },
    {
      "id": "AL-08",
      "title": "اختلاف غیرمعمول تارا",
      "condition": "`abs(measured_tare - nominal_tare) > tare_tolerance_kg`",
      "threshold": {
        "mode": "site_configurable_or_device_flag",
        "specification": "`tare_tolerance_kg` ویژه کلاس کامیون و تجربیات تأییدشده"
      },
      "action": "REVIEW، توزین مجدد/بازرسی",
      "severity": "POLICY_DEPENDENT",
      "confidence": "پیشنهادی",
      "evidence": [
        "S02",
        "S10"
      ],
      "default_unknown_result": "REVIEW_OR_HOLD"
    },
    {
      "id": "AL-09",
      "title": "توزین تکراری یا سفر باز موازی",
      "condition": "`same_vehicle` با Transaction همزمان فعال یا وزن بدون مرحله معتبر",
      "threshold": {
        "mode": "site_configurable_or_device_flag",
        "specification": "قاعده تداخل Site/Lane/Direction"
      },
      "action": "BLOCK ثبت دوم، پیوند به سفر فعال یا ارجاع",
      "severity": "POLICY_DEPENDENT",
      "confidence": "پیشنهادی",
      "evidence": [
        "S02"
      ],
      "default_unknown_result": "REVIEW_OR_HOLD"
    },
    {
      "id": "AL-10",
      "title": "گیت بدون ACK",
      "condition": "فرمان رله صادر شده ولی ACK/Limit Switch نرسیده",
      "threshold": {
        "mode": "site_configurable_or_device_flag",
        "specification": "`gate_ack_timeout_s` از FAT/SAT"
      },
      "action": "CRITICAL، Stop و بازبینی فیزیکی",
      "severity": "CRITICAL",
      "confidence": "پیشنهادی",
      "evidence": [
        "S09"
      ],
      "default_unknown_result": "REVIEW_OR_HOLD"
    },
    {
      "id": "AL-11",
      "title": "ارتباط دستگاه قطع",
      "condition": "`now-last_seen > device_stale_limit_s`",
      "threshold": {
        "mode": "site_configurable_or_device_flag",
        "specification": "اختصاصی دستگاه و نرخ Telemetry"
      },
      "action": "UNKNOWN، منع Capture/Command، هشدار تعمیرات",
      "severity": "POLICY_DEPENDENT",
      "confidence": "پیشنهادی",
      "evidence": [
        "S13",
        "S14"
      ],
      "default_unknown_result": "REVIEW_OR_HOLD"
    },
    {
      "id": "AL-12",
      "title": "گواهی کالیبراسیون منقضی",
      "condition": "`now > calibration.due_at` یا `result=FAIL`",
      "threshold": {
        "mode": "site_configurable_or_device_flag",
        "specification": "سررسید مستند و سیاست حقوقی"
      },
      "action": "Quarantine باسکول برای توزین قانونی تا رفع مشکل",
      "severity": "POLICY_DEPENDENT",
      "confidence": "پیشنهادی",
      "evidence": [
        "S31"
      ],
      "default_unknown_result": "REVIEW_OR_HOLD"
    },
    {
      "id": "AL-13",
      "title": "رانش صفر",
      "condition": "`abs(zero_drift)>zero_drift_limit` در حالت بدون بار و با تأیید Indicator",
      "threshold": {
        "mode": "site_configurable_or_device_flag",
        "specification": "تلرانس مدل/آزمایش و استاندارد معتبر"
      },
      "action": "WARNING/HOLD، ارجاع به مترولوژی",
      "severity": "WARNING",
      "confidence": "پیشنهادی",
      "evidence": [
        "S13"
      ],
      "default_unknown_result": "REVIEW_OR_HOLD"
    },
    {
      "id": "AL-14",
      "title": "خطای لودسل/توزیع بار",
      "condition": "دستگاه Diagnostic Flag یا Symmetry/Corner خطادار",
      "threshold": {
        "mode": "site_configurable_or_device_flag",
        "specification": "Diagnostic Threshold سازنده"
      },
      "action": "CRITICAL/MAINTENANCE؛ Evidence و کارتابل سرویس",
      "severity": "CRITICAL",
      "confidence": "پیشنهادی",
      "evidence": [
        "S13",
        "S14"
      ],
      "default_unknown_result": "REVIEW_OR_HOLD"
    },
    {
      "id": "AL-15",
      "title": "توقف بیش‌ازحد خودرو",
      "condition": "`site_exit_at - site_entry_at > turnaround_limit` یا Queue Age زیاد",
      "threshold": {
        "mode": "site_configurable_or_device_flag",
        "specification": "حد تنظیمی شیفت/مسیر/ماده"
      },
      "action": "WARNING مدیر شیفت، علت تاخیر",
      "severity": "WARNING",
      "confidence": "پیشنهادی",
      "evidence": [
        "S11",
        "S20"
      ],
      "default_unknown_result": "REVIEW_OR_HOLD"
    },
    {
      "id": "AL-16",
      "title": "فقدان شواهد تصویر",
      "condition": "`required_camera_asset` موجود نیست/Hash mismatch",
      "threshold": {
        "mode": "site_configurable_or_device_flag",
        "specification": "Required Image Policy"
      },
      "action": "HOLD/REVIEW، تکرار Capture و بررسی دوربین",
      "severity": "POLICY_DEPENDENT",
      "confidence": "پیشنهادی",
      "evidence": [
        "S05",
        "S09"
      ],
      "default_unknown_result": "REVIEW_OR_HOLD"
    },
    {
      "id": "AL-17",
      "title": "مغایرت ERP",
      "condition": "`outbox_delivery_failed` یا اختلاف Revision/Quantity",
      "threshold": {
        "mode": "site_configurable_or_device_flag",
        "specification": "SLA Retry و عمر DLQ"
      },
      "action": "WARNING؛ حفظ رکورد، Reconciliation",
      "severity": "WARNING",
      "confidence": "پیشنهادی",
      "evidence": [
        "S05",
        "S11"
      ],
      "default_unknown_result": "REVIEW_OR_HOLD"
    },
    {
      "id": "AL-18",
      "title": "اسکن LiDAR با کیفیت پایین",
      "condition": "Scan Quality Fail یا جفت خالی/پر ناسازگار",
      "threshold": {
        "mode": "site_configurable_or_device_flag",
        "specification": "Quality Score و هندسه معتبر دستگاه"
      },
      "action": "رد Volume تخمینی، بدون دستکاری وزن قانونی",
      "severity": "POLICY_DEPENDENT",
      "confidence": "پیشنهادی",
      "evidence": [
        "S15",
        "S17",
        "S16"
      ],
      "default_unknown_result": "REVIEW_OR_HOLD"
    },
    {
      "id": "AL-19",
      "title": "اختلاف وزن حجمی و باسکول",
      "condition": "`abs(estimated_mass-net)/net > volume_crosscheck_limit` مشروط به `net>0`",
      "threshold": {
        "mode": "site_configurable_or_device_flag",
        "specification": "حد مشتق از عدم قطعیت حجم و چگالی"
      },
      "action": "REVIEW، برچسب Estimated، بازرسی بار/چگالی",
      "severity": "POLICY_DEPENDENT",
      "confidence": "پیشنهادی",
      "evidence": [
        "S15",
        "S17",
        "S16"
      ],
      "default_unknown_result": "REVIEW_OR_HOLD"
    },
    {
      "id": "AL-20",
      "title": "اختلاف Payload و باسکول",
      "condition": "`abs(sum(matched_payload)-net)>payload_tolerance_kg`",
      "threshold": {
        "mode": "site_configurable_or_device_flag",
        "specification": "خطای تلفیقی حسگر و روش Match"
      },
      "action": "WARNING تحلیل بارگیری، نه تغییر وزن رسمی",
      "severity": "WARNING",
      "confidence": "پیشنهادی",
      "evidence": [
        "S18",
        "S23"
      ],
      "default_unknown_result": "REVIEW_OR_HOLD"
    },
    {
      "id": "AL-21",
      "title": "درخواست Override پرخطر",
      "condition": "درخواست Gate Open/وزن دستی بدون مجوز/دلیل یا MFA",
      "threshold": {
        "mode": "site_configurable_or_device_flag",
        "specification": "Policy Role/2-Person approval"
      },
      "action": "BLOCK؛ ایجاد Security Alert با Actor و Trace",
      "severity": "POLICY_DEPENDENT",
      "confidence": "پیشنهادی",
      "evidence": [
        "S02",
        "S33"
      ],
      "default_unknown_result": "REVIEW_OR_HOLD"
    },
    {
      "id": "AL-22",
      "title": "رویداد تکراری یا خارج از ترتیب",
      "condition": "`source_event_id` تکراری، `source_seq` پس‌رونده یا Clock Drift",
      "threshold": {
        "mode": "site_configurable_or_device_flag",
        "specification": "Window سازگاری Time Sync + Adapter"
      },
      "action": "Quarantine، عدم دوباره‌شماری، Reconcile",
      "severity": "POLICY_DEPENDENT",
      "confidence": "پیشنهادی",
      "evidence": [
        "S02",
        "S18"
      ],
      "default_unknown_result": "REVIEW_OR_HOLD"
    },
    {
      "id": "AL-23",
      "title": "قطع هماهنگی WAN",
      "condition": "`sync_backlog_age > max_outbox_age`",
      "threshold": {
        "mode": "site_configurable_or_device_flag",
        "specification": "Offline Operating Policy مصوب"
      },
      "action": "هشدار وضعیت Offline؛ Hold مجوزهای نامطمئن",
      "severity": "POLICY_DEPENDENT",
      "confidence": "پیشنهادی",
      "evidence": [
        "S18"
      ],
      "default_unknown_result": "REVIEW_OR_HOLD"
    },
    {
      "id": "AL-24",
      "title": "احتمال تعویض پلاک/تگ",
      "condition": "`plate` یا `tag` میان دو دوربین/سایت در فاصله زمانی ناممکن، یا Snapshot mismatch",
      "threshold": {
        "mode": "site_configurable_or_device_flag",
        "specification": "هندسه سایت، حد زمانی مسیر و قواعد اعتبارسنجی"
      },
      "action": "Security REVIEW + Evidence، بدون محکوم‌سازی خودکار",
      "severity": "POLICY_DEPENDENT",
      "confidence": "پیشنهادی",
      "evidence": [
        "S10",
        "S33"
      ],
      "default_unknown_result": "REVIEW_OR_HOLD"
    }
  ],
  "alert_engine": {
    "results": [
      "PASS",
      "REVIEW",
      "BLOCK",
      "UNKNOWN"
    ],
    "workflow": [
      "NEW",
      "ACKNOWLEDGED",
      "ESCALATED",
      "RESOLVED",
      "CLOSED"
    ],
    "ack_is_not_resolution": true,
    "gate_safety_override_allowed": false,
    "thresholds": "All configured per site, device, risk assessment and legally verified certificate; no invented vendor defaults",
    "policy_revision_required": true,
    "confidence": "پیشنهادی"
  },
  "source_index": {
    "S01": {
      "product": "Weighing Engineering / WIS",
      "url": "https://www.weighing-engineering.com/products/weighbridge-automation-systems/wis-weighbridge-software.html",
      "scope": "صفحه رسمی، قابلیت‌های نرم‌افزار"
    },
    "S02": {
      "product": "Weighing Engineering / Turn Key PDF",
      "url": "https://weighing-engineering.com/images/pdf/turn-key-system.pdf",
      "scope": "PDF رسمی ۲ صفحه؛ جزئیات WIS، قبض، دسترسی، RFID و راهبند"
    },
    "S03": {
      "product": "Weighing Engineering / Turn Key System",
      "url": "https://weighing-engineering.com/products/weighbridge-automation-systems/turn-key-weighbridge-automation-system.html",
      "scope": "صفحه رسمی؛ فهرست سخت‌افزار"
    },
    "S04": {
      "product": "Weighing Engineering / Mining",
      "url": "https://www.weighing-engineering.com/industries/building-materials-mines.html",
      "scope": "صفحه صنعت معدن، ANPR، IP Camera، Induction Loop"
    },
    "S05": {
      "product": "Weighing Engineering / SUPER INSPECTOR",
      "url": "https://www.weighing-engineering.com/products/weighbridge-automation-systems/super-inspector-monitoring-system.html",
      "scope": "صفحه رسمی، راهکار وب‌محور و تصاویر دوربین"
    },
    "S06": {
      "product": "Weighing Engineering / 3D profiler",
      "url": "https://www.weighing-engineering.com/products/3d-profiling-system/3d-profiling-system.html",
      "scope": "صفحه رسمی، ۳ اسکنر لیزری و Point Cloud، جزو سامانه WIM"
    },
    "S07": {
      "product": "Weighing Engineering / Terminals",
      "url": "https://weighing-engineering.com/products/weighbridge-automation-systems/tpc-unattended-weighing-terminal.html",
      "scope": "ترمینال TPC؛ کارت و اتصال LAN/RS-232"
    },
    "S08": {
      "product": "Avery / SmarTower",
      "url": "https://www.averyweigh-tronix.com/en/product/smartower-unmanned-weighbridge-system/",
      "scope": "صفحه رسمی؛ UHF RFID، ویدئو، مانیتورینگ/ERP"
    },
    "S09": {
      "product": "Avery / SmarTower Specification",
      "url": "https://www.averyweigh-tronix.com/en/wp-content/uploads/sites/11/2025/08/SmarTower_UK_spec.pdf",
      "scope": "PDF رسمی ۳ صفحه؛ ص.۲ پروتکل‌ها و سخت‌افزار"
    },
    "S10": {
      "product": "Avery / Weighman 8",
      "url": "https://www.averyweigh-tronix.com/en/product/weighman-8-weighbridge-software/",
      "scope": "صفحه رسمی؛ ANPR، تارا، صورتحساب، SQL، چندسایت"
    },
    "S11": {
      "product": "Precia Molen / TruckFlow",
      "url": "https://us.preciamolen.com/wp-content/uploads/sites/22/2019/07/09-15-01-1-FT-TRUCKFLOW-V00.09.pdf",
      "scope": "PDF رسمی نمایه‌شده، ۲ صفحه؛ بازیابی تصویر PDF ناموفق"
    },
    "S12": {
      "product": "Precia Molen / TruckFlow current",
      "url": "https://be.preciamolen.com/fr/produits/pesage-de-vehicules/logiciel-de-gestion-des-ponts-bascules-et-des-entrees/sorties",
      "scope": "صفحه رسمی، چندسایت، ANPR، موبایل"
    },
    "S13": {
      "product": "Mettler Toledo / TraxEMT",
      "url": "https://www.mt.com/dam/ind/IND_PDF/2024/IND780-downloads/others/IND560PDX-and-IND780_MAN_30137756_R00_TraxEMT_AppGuide_EN.pdf",
      "scope": "راهنمای رسمی PDF، ۲۹ صفحه؛ ص.۴ و فهرست مباحث تشخیص عیب"
    },
    "S14": {
      "product": "Rice Lake / iQUBE²",
      "url": "https://www.ricelake.com/products/iqube2-digital-diagnostic-junction-box?part=93243",
      "scope": "صفحه رسمی؛ diagnostics و رابط ارتباطی"
    },
    "S15": {
      "product": "Loadscan / LVS",
      "url": "https://www.loadscan.com/load-volume-scanner/",
      "scope": "صفحه رسمی؛ حجم واقعی و پروفایل 3D"
    },
    "S16": {
      "product": "Loadscan / MyScanner",
      "url": "https://www.loadscan.com/myscanner/",
      "scope": "صفحه رسمی؛ گزارش، اسکن، هشدار، cloud"
    },
    "S17": {
      "product": "Loadscan / empty-loaded workflow",
      "url": "https://www.loadscan.com/civil/",
      "scope": "صفحه رسمی؛ اسکن خالی مرجع و اسکن پر"
    },
    "S18": {
      "product": "Trimble / LOADRITE",
      "url": "https://news.trimble.com/2019-04-09-Doosan-Infracore-North-America-to-Offer-Trimbles-New-Generation-of-Loader-Onboard-Scales",
      "scope": "منبع رسمی؛ KPI لودر و InsightHQ"
    },
    "S19": {
      "product": "Endel / WeighMAST",
      "url": "https://endel.digital/weighmast-weighbridge-software/",
      "scope": "صفحه سازنده، مدعی کنترل مجوز ERP، RFID/ANPR، گزارش؛ بدون آزمون مستقل"
    },
    "S20": {
      "product": "Wenco / Fleet",
      "url": "https://www.wencomine.com/our-solutions/mining-fleet-management",
      "scope": "صفحه رسمی؛ عملیات ناوگان، KPI و داشبورد"
    },
    "S21": {
      "product": "Wenco / Reporting",
      "url": "https://www.wencomine.com/our-solutions/data-and-reporting",
      "scope": "صفحه رسمی؛ ویجت KPI و اتصال داده"
    },
    "S22": {
      "product": "Komatsu / DISPATCH",
      "url": "https://www.komatsu.com/en-us/technology/smart-mining/loading-and-haulage/dispatch",
      "scope": "صفحه رسمی؛ تخصیص کامیون، صف، fuel، blending"
    },
    "S23": {
      "product": "Cat / MineStar Fleet",
      "url": "https://www.cat.com/en_US/by-industry/mining/surface-mining/surface-technology/fleet.html",
      "scope": "صفحه رسمی؛ چرخه، بار مفید، جابه‌جایی مواد و سوخت"
    },
    "S24": {
      "product": "Hexagon / OP Pro",
      "url": "https://hexagon.com/products/mine-operations",
      "scope": "صفحه رسمی؛ دید لحظه‌ای و تولید/بهره‌برداری"
    },
    "S25": {
      "product": "Dariel / WBX",
      "url": "https://www.miningweekly.com/article/weighbridge-solution-installed-at-mpumalanga-coal-mine-2014-05-23/page%3A2",
      "scope": "گزارش رسانه صنعتی؛ ربط ERP/سفارش/هویت راننده، نه مستند رسمی فعلی"
    },
    "S26": {
      "product": "Dariel / AccessX+WBX",
      "url": "https://easterncapeindustrialnews.co.za/software-suite-takes-the-weight-off-logistics-operations/",
      "scope": "گزارش رسانه صنعتی؛ معماری خانواده محصول و کنترل دسترسی"
    },
    "S27": {
      "product": "Weighing Engineering / Main Categories",
      "url": "https://www.weighing-engineering.com/products/weighbridge-automation-systems.html",
      "scope": "منوی رسمی زیرمحصولات"
    },
    "S28": {
      "product": "Weighing Engineering / LD5218",
      "url": "https://www.weighing-engineering.com/products/weighbridge-automation-systems/ld5218-unattended-weighing-terminal.html",
      "scope": "ترمینال بدون اپراتور، حافظه/چاپگر"
    },
    "S29": {
      "product": "Weighing Engineering / LD5290",
      "url": "https://www.weighing-engineering.com/products/weighbridge-automation-systems/ld5290-unattended-weighing-terminal.html",
      "scope": "ترمینال بدون اپراتور، سنسور و Ethernet اختیاری"
    },
    "S30": {
      "product": "Weighing Engineering / WIM",
      "url": "https://www.weighing-engineering.com/products/weigh-in-motion-systems-wim/low-speed-wim-systems-in-ground-axel-weigher.html",
      "scope": "وزن محوری/گروهی در حرکت، سامانه جدا"
    },
    "S31": {
      "product": "Rice Lake / VIRTUi²",
      "url": "https://cms-prod.ricelake.com/products/virtui2-pc-based-hmi-for-iqube2/",
      "scope": "نمایش وضعیت سلول و هشدار موعد کالیبراسیون"
    },
    "S32": {
      "product": "Weighing Engineering / Rail variant",
      "url": "https://www.weighing-engineering.com/products/weighbridge-sectoral-applications/train-plus-static-weighbridge.html",
      "scope": "WIS Train Plus (محصول متمایز)، ERP و داده قابل سفارشی‌سازی"
    },
    "S33": {
      "product": "Avery / Anti-fraud",
      "url": "https://www.averyweigh-tronix.com/en-in/wp-content/uploads/sites/4/2025/04/Anti_fraud_Portfolio_brochure_D2__002_.pdf",
      "scope": "PDF رسمی؛ عدم پذیرش وزن دست‌ساز در WI، شواهد تصویری"
    },
    "S34": {
      "product": "Loadscan / Analytics",
      "url": "https://www.loadscan.com/myscanner-new-features-boost-efficiency-and-analytics/",
      "scope": "صفحه رسمی؛ گزارش نمودار، PDF/PowerPoint/Excel"
    },
    "S35": {
      "product": "Precia / TruckFlow distributor",
      "url": "https://www.processbd.com/PRECIA_MOLEN/Weigh_Bridge_and_Access_Control.html",
      "scope": "بازنشر تجاری؛ عکس قبل/بعد و کنترل تردد"
    },
    "S36": {
      "product": "Weighing Engineering / logistics",
      "url": "https://www.weighing-engineering.com/industries/logistics.html",
      "scope": "صفحه صنعت؛ مقایسه وزن نظری و واقعی"
    },
    "S37": {
      "product": "Loadscan / MPS",
      "url": "https://www.loadscan.com/new-mine-payload-scanner-launched-for-the-mining-industry/",
      "scope": "صفحه رسمی؛ نمونه توسعه‌یافته برای کامیون معدنی"
    },
    "S38": {
      "product": "Hexagon / case study",
      "url": "https://hexagon.com/-/media/project/one-web/master-site/products/hxgn-mineoperate-op-pro-hp/case_study_01_mineoperate_op_pro_lp.pdf",
      "scope": "PDF مطالعه موردی قدیمی؛ شاهد کاربرد، نه تضمین عملکرد"
    }
  }
}
```
