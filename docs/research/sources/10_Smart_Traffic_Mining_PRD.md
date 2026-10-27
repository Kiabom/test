# مشخصات مستقل محصول: سامانه یکپارچه تردد، توزین و تولید معدنی

**نسخه:** 1.0 — **تاریخ بررسی:** ۲۰۲۶-۱۰-۲۵  
**دامنه اصلی:** https://traffic.cozuca.com/smart-traffic  
**نوع سند:** Product Requirements Document (PRD) + Competitive Evidence Matrix + Implementation Contract  
**هدف:** طراحی یک محصول مستقل با هویت بصری و کد اختصاصی؛ نه بازتولید دارایی‌های مالکیتی شرکت‌های دیگر.

> **روش‌شناسی و حدود شواهد:** منابع عمومی و مستنداتی که در بخش ۲ آمده مرور شده‌اند. اسکرین‌شات داخلی Cozuca در دسترس نبود؛ لینک «Open Smart Traffic» به صفحه احراز هویت می‌رود. `robots.txt` و `sitemap.xml` با ابزار تحقیق قابل بازیابی نبودند. بنابراین «خزش کامل تأییدشده» انجام نشده و نباید چنین ادعایی کرد. پیوست مستقل از کاربر در این درخواست دریافت نشد. اطلاعات داخلی یا پشت ورود، API خصوصی، و قابلیت‌های دارای پروفایل سخت‌افزاری ناشناخته **[Unverified]** هستند. ارزیابی شرکت‌ها صرفاً بر داده‌های مستند و عمومی زیر متکی است.

**برچسب‌های اعتبار:** `[ت] تأییدشده` = منبع صریح؛ `[ا] استنباطی` = نتیجه محتاطانه از تصویر یا قرینه، نه تضمین سازنده؛ `[پ] پیشنهادی` = قابلیت مدنظر محصول ما که نسبت دادن آن به هیچ سازنده‌ای مجاز نیست. `؟` در ماتریس = **نامشخص، نه «ندارد»**؛ `×` = نبودِ صریحاً مستند. قابلیت یک *جزء* از اکوسیستم سازنده به معنی وجود آن در *تمام محصولات آن سازنده* نیست.

---

## ۱. خلاصه اجرایی

1. Cozuca Smart Traffic راهکار مبتنی بر سایت برای عبور خودرو، RFID UHF، ANPR، راهبند، رسید توزین QR، ثبت تصویر، ضدتقلب و گزارش لحظه‌ای معرفی می‌کند. [ت، S01]
2. تصمیم‌های بازکردن دروازه و ذخیره تراکنش در سرور محلی انجام می‌شوند؛ داده‌ها هنگام بازگشت ارتباط با ابر همگام‌سازی می‌شوند. [ت، S01]
3. صفحه داخلی اپلیکیشن Cozuca پشت ورود است؛ ادعای شکل دقیق داشبورد آن مجاز نیست. [ت، S03]
4. Avery و Precia نمونه‌های مناسب برای هسته عملیات باسکول، ثبت تراکنش و گردش خروج/ورود هستند. [ت، S04، S06]
5. WeighMAST و WBX مراجع مهمی برای اتصال ERP، فرایند کنترل ورودی و کنترل تطبیق بار به سفارش هستند. [ت، S08، S09]
6. METTLER TOLEDO و Rice Lake مراجع سخت‌افزاری تشخیص سلامت لودسل هستند و لزوماً محصول صدور حواله محسوب نمی‌شوند. [ت، S10–S12]
7. Loadscan مرجع معتبر اسکن حجم و مقایسه پروفایل سه‌بعدی کامیون خالی/پر است. [ت، S13، S14]
8. LOADRITE LR360 اتصال دوطرفه باسکول و لودر و مقایسه بار هدف با بار واقعی را نشان می‌دهد. [ت، S16]
9. Wenco، Hexagon، DISPATCH و Cat MineStar مراجع KPI، ردیابی چرخه حمل و مدیریت ناوگان‌اند؛ نه شاهد وجود RFID/باسکول در ماژول FMS. [ت، S18–S23]
10. **هسته MVP پیشنهادی:** هویت خودرو، مجوز، رویداد تردد، دو توزین، شواهد تصویر، چاپ رسید، ممیزی، هشدار و گزارش شیفت. [پ]
11. **افزونه‌ها:** LiDAR، سلامت لودسل سطح بالا، ترازوی جام لودر/شاول، تولید و KPI ناوگان، ERP پیشرفته. [پ]
12. وزن خالص بر اساس دو رویداد معتبر و جهت عملیات محاسبه می‌شود؛ حجم × چگالی جایگزین خودکار وزن تجاری نیست. [پ]
13. سامانه باید در قطع اینترنت قابل استفاده، امن در کنترل راهبند و در وقایع غیرعادی دارای گردش تأیید انسانی باشد. [پ]
14. رنگ، چیدمان و متن UI جدید باید مستقل از برندهای مرجع طراحی شوند. [پ]
15. خروجی این سند قرارداد داده و پذیرش کافی برای آغاز توسعه MVP فراهم می‌کند؛ پروتکل دقیق تجهیزات و الزامات مترولوژی پیش از پیاده‌سازی میدانی تعیین می‌شوند. [پ]

---

## ۲. فهرست منابع بررسی‌شده و لاگ دسترسی

### ۲.۱. منابع مستند (کلید ارجاع)

| کد | محصول/مالک | منبع اصلی و وضعیت | استفاده در تحلیل |
|---|---|---|---|
| S01 | Cozuca | [Smart Traffic — صفحه رسمی](https://traffic.cozuca.com/smart-traffic)؛ HTML عمومی، قابل خواندن | UHF، ANPR، کنترل راهبند، شواهد، آفلاین، شیفت و نقش‌ها |
| S02 | Cozuca | [صفحه خانه/معماری SaaS](https://traffic.cozuca.com/)؛ HTML عمومی | چندمستاجری، JWT، محدودسازی تلاش ورود، همگام‌سازی |
| S03 | Cozuca | [درگاه Open Smart Traffic](https://traffic.cozuca.com/api/smart-traffic/open) ← [Login](https://traffic.cozuca.com/login) | مستند بودن مانع احراز هویت؛ UI داخلی بررسی نشده |
| S04 | Avery | [Weighman 8 — صفحه رسمی](https://www.averyweigh-tronix.com/en/product/weighman-8-weighbridge-software/) | RFID/ANPR، تارای ذخیره، قبض، حسابداری، گزارش، ضدتقلب و SQL |
| S05 | Avery | [Driver-operated unmanned system](https://www.averyweigh-tronix.com/weighbridge-unmanned-system/)؛ [بروشور ماژول تصویر](https://www.averyweigh-tronix.com/en-gb/wp-content/uploads/sites/2/2023/07/Weighman8_Vehicle_Image_Capture_spec_100164.pdf)؛ [Avery SmarTower، معرفی رسمی](https://www.averyweigh-tronix.com/en/)؛ متن PDF در نتیجه جست‌وجو، بازیابی فایل اخیر به ریدایرکت ناموفق برخورد | ترمینال راننده، اینترکام، حسگر موقعیت، دوربین و شواهد؛ صفحه ۱ بروشور تصویری |
| S06 | Precia Molen | [TruckFlow — بروشور رسمی PDF، دو صفحه](https://us.preciamolen.com/wp-content/uploads/sites/22/2019/07/09-15-01-1-FT-TRUCKFLOW-V00.09.pdf)؛ متن بازیابی شد، رندر اسکرین‌شات به علت redirect ناموفق بود | مدیریت چندباسکول، اسامی فیلدهای صفحه اصلی، تصویر قبل/بعد، دروازه و SQL Server |
| S07 | Precia Molen | [Weighbridges — بروشور](https://www.preciamolen.com/wp-content/uploads/2018/10/Weighbridges-min-1.pdf)؛ متن بازیابی از جست‌وجو، بدون ممیزی تصویری صفحات | مدولار بودن TruckFlow، ورود/خروج، داده ERP |
| S08 | Dariel/WBX | [WBX automates weighbridge — IT-Online](https://it-online.co.za/2019/05/24/wbx-automates-weighbridge-process/)؛ [کاربرد در معدن — Engineering News](https://www.engineeringnews.co.za/article/weighbridge-solution-installed-at-mpumalanga-coal-mine-2014-05-23)؛ منبع ثانویه | کنترل دسترسی، دوربین، برنامه‌ریزی، تطبیق سفارش و وزن |
| S09 | Endel/WeighMAST | [بروشور معرفی WeighMAST، PDF ۹ صفحه](https://5.imimg.com/data5/SELLER/Doc/2022/5/OD/VL/OH/108975308/erp-integration-with-weighbridge-software.pdf)؛ صفحه‌های ۴–۷ PDF (شمارش از ۱) | RFID/ANPR، چندباسکول، اعلان SMS/Email، ERP، SaaS و private cloud |
| S10 | METTLER TOLEDO | [DataBridge و DataMaster](https://www.mt.com/us/en/home/products/Transport_and_Logistics_Solutions/truck-and-rail-scale-systems/truck-scale-software-solutions.html) | نرم‌افزار تراکنش و مدیریت سلامت چندسایتی |
| S11 | METTLER TOLEDO | [POWERCELL PDX — صفحه رسمی](https://www.mt.com/in/en/home/products/Transport_and_Logistics_Solutions/truck-and-rail-scale-systems/truck-scale-systems/powercell-pdx-load-cells-42904891002.html)؛ [نمونه TraxEMT در کاتالوگ](https://www.mt.com/dam/product_organizations/industry/IndustrialTerminals/IND560x_BR_EN_A4.pdf) | خروجی لودسل منفرد، عیب‌یابی و وضعیت سخت‌افزار؛ نه تأیید خودکار گواهی کالیبراسیون |
| S12 | Rice Lake | [iQUBE² — صفحه رسمی](https://www.ricelake.com/products/iqube2-digital-diagnostic-junction-box?part=93243)؛ [VIRTUlink](https://www.ricelake.com/products/virtulink-scale-monitoring-and-diagnostics-system) | Zero return، drift، noise، عدم تعادل، وضعیت سنسور و ارتباط ابر |
| S13 | Loadscan | [LVS — فناوری اندازه‌گیری](https://www.loadscan.com/technology/)؛ [LVS product](https://www.loadscan.com/load-volume-scanner/) | اسکن خالی/پر، مدل حجمی، RFID، حرکت کامیون |
| S14 | Loadscan | [MyScanner — امکانات و صفحه Measurements](https://www.loadscan.com/myscanner/)؛ [خدمات و API](https://www.loadscan.com/service-agreement/) | داشبورد، سابقه، 3D Profiler، زمان/مسیر/شناسه/محصول و API |
| S15 | Loadscan | [MyScanner Dashboard Update](https://www.loadscan.com/myscanner-dashboard-update/)؛ [MPS](https://www.loadscan.com/new-mine-payload-scanner-launched-for-the-mining-industry/) | روند پنج‌روزه، هشدارهای اسکنر، استفاده معدنی |
| S16 | Trimble LOADRITE | [بروشور LR360، PDF ۴ صفحه، تصاویر صفحات ۲ و ۳](https://www.sitechsolutions.com/wp-content/uploads/2015/06/022482-3219-Trimble_360-Brochure-EN-UK_WEB.pdf) | لیست سفارش بارگیری در کابین، هدف وزن، همکاری لودر و باسکول |
| S17 | LOADRITE/InsightHQ | [ساختار ماژول‌های InsightHQ در نماینده محصول](https://www.whitmoreinc.com/insighthq)؛ منبع ثانویه | ماژول Equipment/Product/Site/Loadout/DIY/Data |
| S18 | Wenco | [Fleet Management رسمی](https://www.wencomine.com/our-solutions/mining-fleet-management)؛ [Data & Reporting](https://www.wencomine.com/our-solutions/data-and-reporting) | تولید، زمان چرخه، وضعیت ماشین و داشبورد |
| S19 | Wenco | [Wenco Suite 6](https://www.wencomine.com/news/wenco-mine-performance-suite-6-reimagines-dispatching-analytics-total-mine-performance) | compliance بار مفید، صف/انتظار، KPI ساعتی |
| S20 | Hexagon | [Hexagon OP Pro](https://hexagon.com/products/op-pro)؛ [Machine Guidance](https://hexagon.com/products/hexagon-op-pro-machine-guidance) | ردگیری ناوگان، چرخه تولید، اتصال سیستم وزن ثالث |
| S21 | Komatsu / Modular | [DISPATCH — صفحه رسمی](https://www.komatsu.com/en-us/technology/smart-mining/loading-and-haulage/dispatch) | تخصیص کامیون، صف، ترکیب مواد، سوخت، نقشه زنده |
| S22 | Komatsu / Modular | [API integration — وبلاگ رسمی](https://www.komatsu.com/en-us/blog/2024/intelligent-mining-leveraging-apis-to-integrate-mining-technologies) | API موقعیت، وضعیت، چرخه، تله‌متری و payload |
| S23 | Caterpillar | [MineStar Fleet](https://www.cat.com/en_US/by-industry/mining/surface-mining/surface-technology/fleet.html)؛ [MineStar Reporting](https://www.cat.com/minestar-reporting) | سیکل، بار مفید، انتظار، گزارش قابل سفارشی‌سازی و ایمیل |
| S24 | تصاویر نمونه عمومی | [Wenco Fleet Control — تصویر در بروشور رسمی](https://www.wencomine.com/digital-brochures/wencomine-fleet-management-system)؛ [Wenco KPI & charts](https://www.wencomine.com/our-solutions/data-and-reporting) | الگوی بصری کنترل ناوگان؛ نه نقشه UI Cozuca |
| S25 | تصاویر نمونه عمومی | [TruckFlow UI — تصویر صفحه وزن‌کشی در Techjockey](https://www.techjockey.com/detail/truckflow)؛ منبع ثانویه | چیدمان فرم و نمایش وزن؛ با برچسب `[ا]` |
| S26 | سایر زمینه صنعتی | [Automated Weighing — Agg-Net](https://www.agg-net.com/resources/articles/weighing/automated-weighing)؛ [Nortech vehicle access](https://www.nortechcontrol.com/solutions/vehicle/weighbridges-bulk-materials/) | معماری سخت‌افزار و ضرورت کنترل موقعیت/تداخل شناسه؛ ارقام برد RFID متعلق به Cozuca نیستند |

### ۲.۲. URLهای مرتبط در دامنه اصلی و نتیجه پیمایش

| نشانی دقیق / مسیر | نتیجه | سطح دسترسی |
|---|---|---|
| `https://traffic.cozuca.com/` | هوم‌پیج و قابلیت‌های زیربنایی SaaS | عمومی |
| `https://traffic.cozuca.com/smart-traffic` | معرفی محصول، FAQ در این صفحه ندارد | عمومی |
| `https://traffic.cozuca.com/smart-traffic?utm_source=chatgpt.com` | همان صفحه معرفی با پارامتر رهگیری | عمومی |
| `https://traffic.cozuca.com/api/smart-traffic/open` | هدایت به صفحه ورود | محافظت‌شده |
| `https://traffic.cozuca.com/login` | Username/Phone، Password، ورود یکپارچه | عمومی (فقط فرم ورود) |
| `https://traffic.cozuca.com/robots.txt` | خطای دسترسی در ابزار بررسی | **شکاف** |
| `https://traffic.cozuca.com/sitemap.xml` | خطای دسترسی در ابزار بررسی | **شکاف** |
| `https://traffic.cozuca.com/spa` | لینک منوی عمومی؛ محصول نامرتبط و خارج از دامنه تحلیل فنی | عمومی |
| سایر لینک‌های هوم‌پیج (rental, garage, dental, aquago, livestock, liquor, privacy) | در منوی صفحه مشاهده شدند، اما برای ویژگی‌های اختصاصی ترافیک مبنا نیستند | فقط شناسایی لینک؛ خزش کامل ادعا نمی‌شود |

**گپ خزش:** لیست کامل تمام URLهای واقعی دامنه و فایل‌های بدون لینک قابل شناسایی نیست؛ به‌جای ساختن لاگ مصنوعی، فقط لینک‌های واقعاً قابل مشاهده و مسیرهای بررسی‌شده ثبت شده‌اند. **صفحات داخلی Cozuca و ویدئوی جریان کار واقعی** قابل دسترسی یا مشاهده نشدند؛ جریان بخش ۵، طراحی پیشنهادی است نه رونویسی از ویدئوی شرکت.

---


## ۳. ماتریس ویژگی‌ها و شناسایی هسته مشترک

**راهنما:** `✓Sxx` = تأییدشده با منبع کددار بخش ۲؛ `؟` = درباره همین محصول شواهد عمومی قابل اتکا پیدا نشد؛ `×Sxx` = نبود صریحاً مستند. ردیف‌های چندستونی به‌معنای یکپارچگی ذاتی کل محصولات نیستند. ستون «هسته» فقط وقتی `≥۳` محصول **در همین ماتریس** ویژگی مشترک مستند دارند، مقدار **هسته** می‌گیرد؛ این تعریف آماری، ضرورت فنی یا اولویت MVP نیست.

| گروه | ویژگی | Cozuca | Avery | Precia | Dariel | WeighMAST | Mettler | Rice Lake | Loadscan | LOADRITE | Wenco | Hexagon | DISPATCH | MineStar | تعداد ✓ | رده |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---:|---|
| A | شناسایی RFID | ✓S01 | ✓S04 | ✓S06 | ؟ | ✓S09 | ؟ | ؟ | ✓S13 | ؟ | ؟ | ؟ | ؟ | ؟ | 5 | **هسته** |
| A | تشخیص پلاک ANPR | ✓S01 | ✓S04 | ✓S06 | ؟ | ✓S09 | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | 4 | **هسته** |
| A | تطبیق متقابل RFID و پلاک | ✓S01 | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | 1 | خاص/نامشخص |
| A | راهبند/چراغ/کنترل دروازه | ✓S01 | ✓S05 | ✓S06 | ✓S08 | ✓S09 | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | 5 | **هسته** |
| A | ترمینال تعاملی راننده/اینترکام | ؟ | ✓S05 | ✓S06 | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | 2 | خاص/نامشخص |
| A | ثبت عکس یا CCTV به ازای تراکنش | ✓S01 | ✓S05 | ✓S06 | ✓S08 | ✓S09 | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | 5 | **هسته** |
| B | ثبت وزن ورودی/خروجی (first/second) | ؟ | ✓S04 | ✓S06 | ✓S08 | ✓S09 | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | 4 | **هسته** |
| B | تارای ذخیره‌شده | ؟ | ✓S04 | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | 1 | خاص/نامشخص |
| B | توزین محوری | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | 0 | خاص/نامشخص |
| B | چندباسکول/چند سکو | ؟ | ✓S04 | ✓S06 | ؟ | ✓S09 | ؟ | ✓S12 | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | 4 | **هسته** |
| C | شناسنامه خودرو و نوع ماده/محصول | ✓S01 | ✓S04 | ✓S06 | ✓S08 | ✓S09 | ؟ | ؟ | ✓S14 | ✓S16 | ✓S18 | ؟ | ✓S21 | ✓S23 | 10 | **هسته** |
| C | زمان و سابقه تردد/اندازه‌گیری | ✓S01 | ✓S04 | ✓S06 | ✓S08 | ✓S09 | ؟ | ؟ | ✓S14 | ✓S16 | ✓S18 | ✓S20 | ✓S21 | ✓S23 | 11 | **هسته** |
| D | تطبیق سفارش/قرارداد با مقدار بار | ؟ | ؟ | ؟ | ✓S08 | ؟ | ؟ | ؟ | ؟ | ✓S16 | ؟ | ؟ | ؟ | ؟ | 2 | خاص/نامشخص |
| D | قبض توزین/رسید/صورتحساب | ✓S01 | ✓S04 | ✓S06 | ؟ | ✓S09 | ؟ | ؟ | ✓S14 | ؟ | ؟ | ؟ | ؟ | ؟ | 5 | **هسته** |
| D | QR قبض توزین | ✓S01 | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | 1 | خاص/نامشخص |
| E | گزارش تردد و عملیات روز/شیفت | ✓S01 | ✓S04 | ✓S06 | ✓S08 | ✓S09 | ؟ | ؟ | ✓S14 | ✓S16 | ✓S18 | ✓S20 | ✓S21 | ✓S23 | 11 | **هسته** |
| E | زمان انتظار و صف ناوگان | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ✓S16 | ✓S19 | ✓S20 | ✓S21 | ✓S23 | 5 | **هسته** |
| F | عیب‌یابی لودسل منفرد | ؟ | ؟ | ؟ | ؟ | ؟ | ✓S11 | ✓S12 | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | 2 | خاص/نامشخص |
| F | رانش صفر/عدم‌تعادل/نویز | ؟ | ؟ | ؟ | ؟ | ؟ | ✓S11 | ✓S12 | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | 2 | خاص/نامشخص |
| F | اعتبار گواهی کالیبراسیون خودکار | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | 0 | خاص/نامشخص |
| G | LiDAR یا اسکن حجم سه‌بعدی | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ✓S13 | ؟ | ؟ | ؟ | ؟ | ؟ | 1 | خاص/نامشخص |
| G | پروفایل خالی در برابر پر | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ✓S13 | ؟ | ؟ | ؟ | ؟ | ؟ | 1 | خاص/نامشخص |
| G | حجم × چگالی برای تخمین جرم | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | 0 | خاص/نامشخص |
| H | پایش وزن بار مفید ماشین/لودر | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ✓S16 | ✓S19 | ✓S20 | ✓S22 | ✓S23 | 5 | **هسته** |
| H | KPI چرخه حمل/تولید/بهره‌برداری | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ✓S16 | ✓S18 | ✓S20 | ✓S21 | ✓S23 | 5 | **هسته** |
| H | تبادل دستور بارگیری با کابین لودر | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ✓S16 | ؟ | ؟ | ؟ | ؟ | 1 | خاص/نامشخص |
| I | داشبورد مدیریتی/گزارش سفارشی | ✓S01 | ✓S04 | ✓S06 | ؟ | ✓S09 | ؟ | ؟ | ✓S14 | ✓S17 | ✓S18 | ✓S20 | ✓S21 | ✓S23 | 10 | **هسته** |
| I | خروجی یا API داده به سامانه دیگر | ؟ | ✓S04 | ✓S07 | ؟ | ✓S09 | ؟ | ؟ | ✓S14 | ✓S16 | ✓S18 | ✓S20 | ✓S22 | ✓S23 | 9 | **هسته** |
| I | گزارش زمان‌بندی‌شده یا اعلان ایمیلی | ؟ | ؟ | ؟ | ؟ | ✓S09 | ؟ | ✓S12 | ✓S14 | ؟ | ؟ | ؟ | ؟ | ✓S23 | 4 | **هسته** |
| J | یکپارچه‌سازی با ERP/حسابداری | ؟ | ✓S04 | ✓S07 | ✓S08 | ✓S09 | ؟ | ؟ | ✓S14 | ✓S16 | ✓S18 | ؟ | ؟ | ؟ | 7 | **هسته** |
| J | Modbus یا سریال/اترنت مستند | ✓S01 | ؟ | ؟ | ؟ | ؟ | ✓S11 | ✓S12 | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | 3 | **هسته** |
| K | ردپای حسابرسی یا تأیید لغو | ✓S01 | ✓S04 | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | 2 | خاص/نامشخص |
| K | ضدتقلب پلاک/وزن/موقعیت | ✓S01 | ✓S05 | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | 2 | خاص/نامشخص |
| L | استقرار آفلاین با Sync بعدی | ✓S01 | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | 1 | خاص/نامشخص |
| L | استقرار ابری/دسترسی تحت وب | ✓S01 | ؟ | ؟ | ؟ | ✓S09 | ✓S10 | ✓S12 | ✓S14 | ✓S17 | ✓S18 | ؟ | ؟ | ✓S23 | 8 | **هسته** |
| L | پشتیبانی از چند سایت یا چند مستاجر | ✓S01 | ؟ | ✓S06 | ؟ | ✓S09 | ✓S10 | ؟ | ✓S14 | ✓S17 | ؟ | ؟ | ؟ | ✓S23 | 7 | **هسته** |
| L | اعلان Push در حالت اپ بسته | ×S01 | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | 0 | خاص/نامشخص |

### ۳.۱. ویژگی‌های هسته با تأیید حداقل سه مرجع

شناسایی RFID، تشخیص پلاک ANPR، راهبند/چراغ/کنترل دروازه، ثبت عکس یا CCTV به ازای تراکنش، ثبت وزن ورودی/خروجی (first/second)، چندباسکول/چند سکو، شناسنامه خودرو و نوع ماده/محصول، زمان و سابقه تردد/اندازه‌گیری، قبض توزین/رسید/صورتحساب، گزارش تردد و عملیات روز/شیفت، زمان انتظار و صف ناوگان، پایش وزن بار مفید ماشین/لودر، KPI چرخه حمل/تولید/بهره‌برداری، داشبورد مدیریتی/گزارش سفارشی، خروجی یا API داده به سامانه دیگر، گزارش زمان‌بندی‌شده یا اعلان ایمیلی، یکپارچه‌سازی با ERP/حسابداری، Modbus یا سریال/اترنت مستند، استقرار ابری/دسترسی تحت وب، پشتیبانی از چند سایت یا چند مستاجر.

### ۳.۲. قابلیت‌های ویژه و تفاوت‌ها

| محصول | تمایز مشاهده‌شده | نوع/محدودیت |
|---|---|---|
| Cozuca | ضدِ عبور مجدد (anti-passback)، تطبیق RFID↔ANPR، مقایسه فرمان راهبند و بازخورد بازو، کلیپ NVR برای رخداد پرریسک؛ هشدار در حالت بسته‌بودن اپ هنوز عرضه نشده | [ت؛ S01] |
| Avery | تارای ذخیره‌شده، ماژول دوربین نمای بالا/موقعیت، ترمینال راننده و ردپای کاربر | [ت؛ S04، S05] |
| Precia | اپراتور فقط فیلدهای مرتبط را می‌بیند؛ صفحه «خودروهای داخل محوطه» و «تازه خارج‌شده»؛ کنترل راهبند و دو‌رنگ چراغ | [ت؛ S06] |
| Dariel/WBX | زنجیره برنامه‌ریزی→دسترسی→انبار/کیفیت→اجرای بارگیری و تطبیق سفارش/تناژ | [ت؛ S08؛ منبع ثانویه] |
| WeighMAST | ابری خصوصی یا SaaS، برگه قابل شخصی‌سازی، پیامک/ایمیل و RFID/ANPR | [ت؛ S09] |
| METTLER TOLEDO | عیب‌یابی شبکه لودسل و مشاهده سیگنال هر سلول؛ به‌روزرسانی وضعیت باسکول در راهکار DataMaster | [ت؛ S10، S11] |
| Rice Lake | شبیه‌سازی موقت لودسل آسیب‌دیده (Cell Emulation) با کنترل سازنده؛ Drift و Noise و Zero Reference | [ت؛ S12؛ **جایگزین تأیید کالیبراسیون نیست**] |
| Loadscan | مدل سه‌بعدی بار، پروفایل خالی/پر، شناسایی RFID اسکنر، پروفایلر تحت وب | [ت؛ S13–S15] |
| LOADRITE LR360 | فهرست اولویت‌دار سفارش‌های لودر در کابین و بازگردانی وزن کار به باسکول/نرم‌افزار فروش | [ت؛ S16] |
| Wenco | داشبوردهای KPI لحظه‌ای، تحلیل سطح شاول/دامپ، بار مفید و تطابق با برنامه شیفت | [ت؛ S18، S19] |
| Hexagon OP Pro | چرخه خودکار تولید و یکپارچه‌سازی با سیستم وزن تجهیز ثالث | [ت؛ S20] |
| Modular DISPATCH | تخصیص پویا، مدیریت سوخت و صف، twin زنده، API‌ اختصاصی تجهیزات و بار مفید | [ت؛ S21، S22] |
| Cat MineStar | یکپارچه‌کردن داده Fleet/Health/Terrain در ابزار Reporting و گزارش ایمیلی | [ت؛ S23] |

**تفسیر مهندسی:** برای محصول ما، داشتن «دوربین و وزن و API» بدون *یک شناسه تراکنش واحد* ارزش ممیزی اندکی دارد. پیوند قابل اعتماد میان Vehicle / Permit / GateEvent / WeighEvent / CameraEvidence / LidarScan باید هسته معماری باشد. [پ]

---
## ۴. PRD: نقش‌ها، داستان‌های کاربر، الزامات

### ۴.۱. مخاطبان، دامنه و وضعیت انتشار

**مأموریت محصول [پ]:** یک سیستم یکپارچه حمل و توزین برای معادن روباز، معادن مصالح، دپوها، کارخانه فرآوری و خروج محموله که بتواند هویت، مجوز، جرم، حجم، عکس و زمان را در یک «پرونده سفر» غیرقابل دستکاری جمع کند. فاز نخست باسکول جاده‌ای ایستا است، نه باسکول حین حرکت، نه سیستم مستقل توزین قانونی با سخت‌افزار uncertified، و نه جایگزین کامل DISPATCH. منابع الهام: S01، S04، S06، S13، S16، S18.

**فازها:** `MVP` عملیاتی واجب؛ `P1` بلوغ سازمانی؛ `P2` پلاگین حجمی و ناوگان. این اولویت‌بندی [پ] است و هیچ اشاره‌ای به roadmap رسمی تولیدکنندگان ندارد.

### ۴.۲. نقش‌های کاربری و اصل حداقل اختیار

| شناسه نقش | نقش | دامنه اختیارات پیشنهادشده |
|---|---|---|
| `platform_admin` | مدیر کل پلتفرم | ساخت Tenant/Site، تنظیم امنیت و نسخه پلاگین، بدون دسترسی پیش‌فرض به محتوای تجاری مستاجر |
| `site_admin` | مدیر سایت | تعریف گیت/باسکول/شیفت/مقررات، کاربران و تأییدات |
| `director` | مدیر تولید یا مدیر معدن | داشبورد تجمیعی و رخدادهای پرریسک، گزارش و مجوز تأیید خاص |
| `gate_guard` | نگهبان/اپراتور گیت | بررسی خودرو/راننده، شواهد دوربین و وقایع راهبند، ثبت استثنا |
| `weigh_operator` | اپراتور باسکول | مشاهده وزن زنده، ثبت وزن پایدار، صدور قبض و گزارش مغایرت |
| `yard_operator` | اپراتور بارگیری/انبار | ثبت ماده، مبدأ و مقصد و تحویل به لودر/شاول |
| `sales_accountant` | فروش/حسابداری | حواله، اعتبارسنجی سفارش، صورتحساب و رسید |
| `maintenance` | نت و کالیبراسیون | مشاهده دستگاه و پارامتر تشخیص خطا، اسناد کالیبراسیون، قرنطینه باسکول |
| `fleet_dispatcher` | دیسپچر ناوگان | پیگیری چرخه و تجهیزات در افزونه FMS |
| `auditor` | ممیز مستقل | دسترسی فقط‌خواندنی به رخدادها، تأییدیه‌ها و تاریخچه تغییرات |
| `driver` | راننده/پیمانکار حمل | تأیید هویت، دستورالعمل مسیر، مشاهده رسید و مجوز اختصاصی |

### ۴.۳. داستان‌های کاربر (User Stories) و سناریوهای پذیرش

1. **نگهبان:** «می‌خواهم پیش از بازشدن راهبند، پلاک و تگ و وضعیت مجوز را روی یک کارت ببینم.» **پذیرش:** mismatch / blacklist با علت و دکمه ارجاع، نه بازشدن خودکار.
2. **اپراتور باسکول:** «می‌خواهم وزن زنده و Stable را ببینم، یک وزن معتبر را ثبت کنم و تصویر ماشین همان لحظه ضمیمه شود.» **پذیرش:** ثبت raw، Stable، time، device ID و snapshot با Transaction ID مشترک.
3. **کارشناس فروش:** «می‌خواهم قبل از خروج از سقف حواله، مقدار مجاز باقی‌مانده و تراز سفارش مطلع شوم.» **پذیرش:** رزرو سهمیه اتمیک و اجرای ممنوعیت خروج در exception.
4. **حسابدار:** «می‌خواهم قبض QR را به تراکنش اصلی و کد ERP برسانم.» **پذیرش:** رسید قابل راستی‌آزمایی و جلوگیری از فاکتور duplicate.
5. **مدیر معدن:** «می‌خواهم تناژ خالص، سفر، خودروهای داخل، استثناها و تأخیر شیفت را ببینم.» **پذیرش:** drilldown از KPI به سفرهای تشکیل‌دهنده و تعریف متریک.
6. **مدیر نت:** «می‌خواهم هشدار خرابی سلول را از سررسید گواهی کالیبراسیون جدا ببینم.» **پذیرش:** منشأ و مدارک تعمیر/کالیبراسیون قابل مشاهده باشد.
7. **اپراتور بارگیری:** «می‌خواهم در لیست انتظار، پلاک، ماده، محل تخلیه و وزن هدف را ببینم.» **پذیرش:** بارگیری به سفر مشخص تخصیص یابد.
8. **مدیر ناوگان:** «می‌خواهم از رویدادهای سفر، زمان چرخه و انتظار را با وزن واقعی باسکول تطبیق بدهم.» **پذیرش:** در صورت نبود داده FMS، خروجی unknown و نه عدد حدسی باشد.
9. **ممیز:** «می‌خواهم تمام اصلاح وزن، لغو قبض و بازشدن دستی راهبند را با بازیابی شواهد ببینم.» **پذیرش:** سابقه append-only و شناسه شخص تأییدکننده داشته باشد.
10. **مدیر سیستم:** «می‌خواهم یک ماژول جدید LiDAR اضافه کنم بدون اینکه توزین پایه را بازنویسی کنم.» **پذیرش:** فعال‌سازی plugin با capability contract نسخه‌دار انجام شود.

تمام این داستان‌ها **[پیشنهادی]** هستند؛ مبتنی بر الگوهای S01، S04، S06، S13، S16، S18.

### ۴.۴. الزامات کارکردی (Functional Requirements)

| کد | ماژول | فاز | شرح الزام [پ] | معیار پذیرش اصلی | منبع الهام |
|---|---|---|---|---|---|
| `FR-01` | `identity` | MVP | ثبت و نگهداری شناسه یکتای Tenant/Site/Gate/Lane و جداسازی کامل داده‌های سایت | عدم بازگرداندن رکورد سایت دیگر در API و گزارش | S01,S02 |
| `FR-02` | `identity` | MVP | CRUD خودرو، پلاک نرمال‌شده، شماره شاسی اختیاری، راننده، حامل و اعتبار شناسه‌ها | پلاک تکراری فعال به‌صورت کنترل‌شده رد یا وارد چرخه رفع تداخل شود | S01,S04 |
| `FR-03` | `identity` | MVP | دریافت رویداد RFID از adapter همراه قدرت سیگنال، Reader ID، زمان و Tag ID | تکرار خوانش در بازه dedup موجب دو ورود نشود | S01 |
| `FR-04` | `identity` | MVP | دریافت ANPR با تصویر خام، رشته اصلی، رشته نرمال‌شده و Confidence | در Confidence زیر حد تنظیمی ورود خودکار متوقف و بررسی دستی درخواست شود | S01 |
| `FR-05` | `identity` | MVP | تطبیق RFID و پلاک با یک Vehicle؛ ثبت مغایرت و شواهد | عدم تطابق فعال، هرگز سکوتی overwrite نشود | S01 |
| `FR-06` | `access` | MVP | اعتبارسنجی blacklist، anti-passback، زمان‌بندی/اجازه ورود، درگاه و مجوز | ورود غیرمجاز باید مسدود و علت ذخیره شود | S01 |
| `FR-07` | `access` | MVP | اجرای درخواست بازشدن راهبند از PLC/Relay با تایید حالت بازو و حضور خودرو | هر فرمان دارای correlation_id، timeout و نتیجه state باشد | S01 |
| `FR-08` | `access` | MVP | ثبت GateEvent ورود، خروج، عبور ناموفق و عبور بدون دستور | دروازه بدون دستور منجر به Alert مستقل شود | S01 |
| `FR-09` | `access` | MVP | استریم یا تصویر لحظه‌ای دوربین و امکان ثبت snapshot از نما و بستر بار | تصاویر با Event ID و زمان واقعی ذخیره و قابل بازیابی باشند | S01,S05 |
| `FR-10` | `weighing` | MVP | دریافت وزن و وضعیت پایدار از درایور Indicator؛ جداسازی raw reading از Accepted Weight | فقط وزن Stable با سلامت Device مجاز به ثبت نهایی باشد | S04,S06 |
| `FR-11` | `weighing` | MVP | پیاده‌سازی وزن اول و دوم با ترتیب وابسته به نوع عملیات ورودی/خروجی | Inbound: gross سپس tare؛ Outbound: tare سپس gross؛ تناقض‌ها Hold شود | S04,S06 |
| `FR-12` | `weighing` | MVP | محاسبه Net = Gross - Tare و منع ثبت Net منفی جز در مسیر استثنای ممیزی‌شده | حساب عددی decimal و واحد یکسان؛ Gross و Tare قابل ردگیری باشند | S04 |
| `FR-13` | `weighing` | P1 | استفاده از تاییدشده‌ترین تارای ذخیره‌شده با تاریخ اعتبار و منبع | تارای منقضی هرگز بی‌هشدار به فروش منتقل نشود | S04 |
| `FR-14` | `weighing` | MVP | ثبت دو باسکول مستقل و یک تراکنش واحد با WeighEventهای چندگانه | خطای دوباره‌کاری و ترتیب نامعتبر با state machine رد شود | S06,S09 |
| `FR-15` | `weighing` | P2 | توزین محوری/چندمرحله‌ای با adapter و مجوز مترولوژی جداگانه | هر محور و نوع گواهی ذخیره شود؛ با gross ثابت اشتباه نشود | طراحی پیشنهادی |
| `FR-16` | `weighing` | MVP | صدور قبض شماره‌دار با QR اشاره‌کننده به verification endpoint | QR نتیجه احراز اعتبار قبض را بدون افشای نامحدود PII نشان دهد | S01 |
| `FR-17` | `weighing` | MVP | لغو یا اصلاح تراکنش فقط با علت، نقش مجاز و تأیید دو سطحی اختیاری | نسخه قبلی و شخص تأییدکننده حذف نشوند | S01,S04 |
| `FR-18` | `permits` | MVP | مدیریت مجوز فروش/حمل، سفارش، حامل، مشتری، ماده، مبدأ/مقصد، بازه اعتبار و سهمیه | استفاده از مجوز منقضی در خروج خودکار مسدود شود | S08 |
| `FR-19` | `permits` | MVP | رزرو/مصرف اتمیک سهمیه وزن در تراکنش و بازگردانی کنترل‌شده هنگام ابطال | دو گیت موازی نتوانند سهمیه واحد را دوبار خرج کنند | S08 |
| `FR-20` | `permits` | MVP | کنترل خودکار Net در برابر سقف بار وسیله، سقف مجوز و تلورانس قرارداد | فراتر از آستانه، خروج Hold و درخواست Approval باشد | S01 |
| `FR-21` | `permits` | P1 | اتصال وضعیت قبض به سفارش ERP، سند حسابداری/فاکتور و شماره بارنامه | همسان‌سازی idempotent بدون صدور فاکتور تکراری | S04,S09 |
| `FR-22` | `times` | MVP | ثبت timestamp معتبر ورود، صف، وزن ۱، شروع/پایان بارگیری، وزن ۲ و خروج | turnaround قابل محاسبه؛ زمان‌های ناقص با null باقی بمانند | S01,S06 |
| `FR-23` | `times` | MVP | گزارش زمان انتظار، ماندگاری، شمارش سفر و الگوی ساعتی بر پایه رخداد واقعی | مرز شیفت و timezone در نتایج تکرارپذیر باشد | S01,S18 |
| `FR-24` | `health` | MVP | ثبت دارایی باسکول، LastCalibration، گواهی، DueDate و وضعیت بهره‌برداری | گواهی منقضی مطابق سیاست site باعث هشدار یا توقف شود | طراحی پیشنهادی |
| `FR-25` | `health` | P1 | اتصال health adapter برای drift/zero/noise/loadcell balance در صورت دسترسی اندیکاتور | فقط پارامترهایی که دستگاه واقعاً صادر می‌کند قابل نمایش باشند | S11,S12 |
| `FR-26` | `health` | MVP | درج هشدار دخالت در صفر یا تغییر غیرمعمول توالی وزن و موقعیت | هر detection همراه rule_version و evidence ثبت شود | S01 |
| `FR-27` | `health` | MVP | نمایش واضح اینکه Diagnostic Warning معادل «باسکول خارج از کالیبراسیون» نیست | برچسب CalibrationInvalid فقط با مدرک معتبر یا policy rule صادر شود | S11,S12 |
| `FR-28` | `reports` | MVP | گزارش سفر، خالص بار، توزین‌ها، تردد، ماده، مشتری، شیفت، گیت و باسکول | فیلتر سایت/زمان و جست‌وجوی پلاک درست کار کند | S01,S04 |
| `FR-29` | `reports` | MVP | صدور CSV/XLSX/PDF، چاپ قبض و فیلترهای ذخیره‌شده | قالب عدد/واحد و permission در فایل خروجی حفظ شود | S04,S06 |
| `FR-30` | `reports` | P1 | زمان‌بندی ایمیل/پیامک گزارش و هشدار با opt-in و ثبت تحویل | ارسال تکراری در retry با کلید یکتا مهار شود | S09,S14 |
| `FR-31` | `reporting` | MVP | داشبورد Role-specific با KPI: تعداد سفر، تناژ خالص، خودروهای داخل، وضعیت باسکول، هشدار | برای هر KPI تعریف، واحد، دامنه و بازه بازسازی‌پذیر وجود داشته باشد | S01,S18 |
| `FR-32` | `integrations` | MVP | کانکتور ERP از طریق API و صف outbox با retry، نسخه‌بندی و idempotency | در قطع ERP هیچ رویداد نهایی محلی از دست نرود | S09,S14 |
| `FR-33` | `integrations` | MVP | Device adapter قابل جایگزینی برای سریال، TCP، Modbus و REST بر اساس قابلیت واقعی تجهیز | نبود درایور با mock simulator مشخص شود و وزن واقعی جعل نگردد | S01,S12 |
| `FR-34` | `integrations` | P1 | کنترل PLC و سنسور حضور از gateway صنعتی مستقل با interlock فیزیکی | برنامه وب به‌تنهایی مسئول ایمنی راهبند نیست | S01,S05 |
| `FR-35` | `security` | MVP | RBAC با Scope سایت/نقش/عملیات و ثبت actor برای همه mutationها | یک نگهبان نتواند کالیبراسیون یا سفارش را تغییر دهد | S01,S04 |
| `FR-36` | `security` | MVP | Audit log فقط‌افزودنی برای تغییر وضعیت تراکنش، مجوز، وزن دستی و فرمان راهبند | حذف رکورد تجاری باعث حذف سابقه لاگ نشود | S04 |
| `FR-37` | `security` | MVP | کنترل ضد عبور پشت‌سرهم، ثبت ورود/خروج بدون جفت و شناسایی تکرار پلاک/رسید | Tailgating به صورت anomaly و امکان review ثبت شود | S01 |
| `FR-38` | `architecture` | MVP | Gateway/Edge محلی برای اجرای تصمیم دسترسی حتی بدون اینترنت و Sync پس از اتصال | سناریوی قطع WAN با ثبت معتبر Gate/Weigh در LAN پاس شود | S01 |
| `FR-39` | `architecture` | MVP | همگام‌سازی eventها با sequence، event_id و reconciliation بدون دوباره‌کاری | پردازش مجدد batch نباید تراکنش duplicate بسازد | S01,S02 |
| `FR-40` | `architecture` | MVP | نسخه‌بندی و فعال/غیرفعال‌سازی ماژول اختیاری بر حسب سایت | خاموش‌کردن LiDAR نباید هسته توزین را مختل کند | S07 |
| `FR-41` | `lidar` | P2 | اتصال اسکنر با LidarScan empty/full profile، حجم و اسناد کالیبراسیون اسکنر | اسکن مرجع خالی به همان vehicle/trailer variant و تاریخ پیوند بخورد | S13,S14 |
| `FR-42` | `lidar` | P2 | حجم بار = تفاضل پروفایل پر و خالی و برآورد جرم با چگالی ماده و عدم‌قطعیت | mass_estimated از mass_scale در UI و DB جدا بماند | S13 |
| `FR-43` | `fleet` | P2 | ثبت رویدادهای payload هر جام لودر/شاول و تخصیص به سفر/وسیله | تنظیم اتصال match در صورت شناسه مشترک یا زمان/مکان امکان‌پذیر باشد | S16,S20 |
| `FR-44` | `fleet` | P2 | محاسبه cycle time، waiting، idle، utilization و KPI تولید در محدوده شیفت | تعریف هر مخرج و منبع مشاهده در Data Dictionary ثبت شود | S18,S21 |
| `FR-45` | `fleet` | P2 | ورود داده FMS شامل تجهیزات، وضعیت، مقصد، مسیر و مواد با API adapter | تعارض بین داده باسکول و payload به‌صورت reconciliation event ثبت شود | S22,S23 |
| `FR-46` | `ui` | MVP | نمایش فارسی RTL، تاریخ شمسی در UI اختیاری و ذخیره UTC در Backend | تغییر زبان/تقویم روی ذخیره timestamp و واحد اثر نگذارد | طراحی پیشنهادی |
| `FR-47` | `ui` | MVP | حالت اضطراری بررسی دستی با ثبت علت، شاهد و امضای کاربر | Manual override فقط با نقش، scope و TTL مشخص مجاز باشد | S01 |
| `FR-48` | `quality` | MVP | ثبت Source & Confidence هر داده (operator, scale, ANPR, RFID, LiDAR, ERP) | ردیف‌های گزارش بتوانند سند منشأ را به‌صورت breadcrumb بازیابی کنند | طراحی پیشنهادی |
| `FR-49` | `security` | P1 | قابلیت تکمیل چک‌لیست ایمنی شیفت و حضور مکانی مبتنی بر مجوز کاربر | GPS attendance و چک‌لیست با حریم خصوصی و consent کنترل شوند | S01 |
| `FR-50` | `access` | P1 | ارسال اعلان لحظه‌ای درون برنامه به نقش مرتبط؛ اعلان Push بسته‌بودن اپ در طرح ما جدا توسعه یابد | نوع کانال و وضعیت delivery در Alert ثبت شود | S01 |

### ۴.۵. الزامات غیرکارکردی (Non-Functional Requirements)

| کد | محور | الزام [پ] | آزمون پذیرش |
|---|---|---|---|
| `NFR-01` | `availability` | استقلال عملیات سایت از WAN؛ در قطع Cloud، ثبت محلی و تصمیم گیت طبق policy ادامه یابد | آزمون قطع اینترنت؛ fail-safe کنترل راهبند و recovery |
| `NFR-02` | `integrity` | رخدادهای پذیرفته‌شده append-only، idempotent و قابل پیگیری با UUID | تکرار یک event_id فقط یک رکورد مؤثر ایجاد کند |
| `NFR-03` | `latency` | تاخیر تصمیم گیت و ثبت وزن در شبکه محلی با SLO توافق‌شده سایت اندازه‌گیری شود؛ مقدار ثابت ساختگی تعریف نشود | p95 آزمون میدانی بعد از تعیین تجهیزات و شبکه |
| `NFR-04` | `security` | HTTPS/TLS، رمزنگاری داده حساس، secret vault، least privilege، احراز هویت چندمرحله‌ای مدیر | آزمون نفوذ، بازبینی access control |
| `NFR-05` | `audit` | مهر زمانی قابل اتکا، کنترل تغییر و سیاست نگهداری متناسب قرارداد/قانون | اجرای replay و خروجی auditor با chain integrity |
| `NFR-06` | `safety` | ایمنی الکترو-مکانیکی راهبند باید مستقل از web app و متناسب با PLC/interlock باشد | با سقوط API فرمان ناایمن یا بازشدن بی‌مجوز رخ ندهد |
| `NFR-07` | `metrology` | وزن معامله‌ای فقط از مسیر و ابزار دارای تأییدیه مترولوژی و استاندارد محلی ثبت شود | آزمون sign-off با مرجع صلاحیت‌دار و مستندات دستگاه |
| `NFR-08` | `privacy` | حداقل‌سازی PII راننده، RBAC رسانه تصویری و Retention قابل تنظیم | کنترل دسترسی تصویر، حذف طبق policy، ثبت export |
| `NFR-09` | `time` | ثبت timestamp به UTC و نگهداری zone site و quality clock؛ همگام‌سازی NTP در صورت دسترسی | گزارش شب/تعویض شیفت و DST قابل بازتولید باشد |
| `NFR-10` | `observability` | متریک سلامت هر adapter، lag صف outbox، drop frame و خطاهای integration | داشبورد عملیات IT و هشدار monitor |
| `NFR-11` | `interoperability` | Schema Version/Capability Negotiation و contract test برای تجهیزات | تعویض مارک Indicator بدون تغییر domain logic |
| `NFR-12` | `scalability` | سایت‌ها و laneها isolation در دیتابیس/سرویس داشته باشند؛ ظرفیت بر پایه بار واقعی dimension شود | load test با نرخ تراکنش واقعی سایت |
| `NFR-13` | `ux` | اپراتور بتواند مورد استثنا را با حداقل ورود دستی و status واضح رسیدگی کند | آزمون کاربری با اپراتور واقعی و سناریوهای خطا |
| `NFR-14` | `reliability` | پشتیبان‌گیری، بازیابی و reconciliation پیش‌بینی شود؛ RPO/RTO قرارداد پروژه تعیین شود | restore drill و آزمون قطع برق |
| `NFR-15` | `deployment` | امکان نصب بسته Edge صنعتی با مدیریت نسخه و rollback | بازگشت نسخه بدون corruption داده |
| `NFR-16` | `units` | مقادیر وزن decimal با واحد پایه kg، حجم m³، چگالی kg/m³ و سیاست rounding متمرکز | تست caseهای اعشاری و واحد تبدیل |
| `NFR-17` | `compatibility` | RTL وب دسکتاپ و نمای ساده موبایل؛ offline سایت به معنای offline تمام گوشی‌ها نیست | آزمون با قطع Wi-Fi و اینترنت جداگانه |
| `NFR-18` | `governance` | مدل‌های ANPR دارای version، dataset/provenance و ارزیابی در پلاک و محیط واقعی باشند | گزارش precision/recall میدانی و human fallback بدون ادعای نرخ مجهول |

### ۴.۶. آزمون‌های انتهابه‌انتها ضروری

`AT-01` کامیون خروجی با تارای اول و ناخالص دوم → محاسبه خالص و قبض؛ `AT-02` کامیون ورودی با ناخالص اول و تارای دوم؛ `AT-03` تگ خودرو A و پلاک B → Hold؛ `AT-04` دو درخواست هم‌زمان به یک سهمیه مجوز → فقط یکی موفق؛ `AT-05` قطع اینترنت ابر و ادامه خوانش محلی → همگام‌سازی idempotent؛ `AT-06` وزن ناپایدار → منع ثبت؛ `AT-07` انقضای گواهی → اعمال policy؛ `AT-08` لغو قبض → تاریخچه با approval؛ `AT-09` فقدان اسکن خالی معتبر → حجم نامعتبر، نه صفر؛ `AT-10` خروج بدون ورود → anomaly؛ `AT-11` کاربر بدون مجوز → منع export تصاویر؛ `AT-12` اختلاف mass_estimated و mass_scale → هشدار، بدون دستکاری وزن.

---

## ۵. جریان‌های کاری اصلی: حالت عادی و موارد استثنا

### ۵.۱. خروج بار از معدن — خودرو خالی وارد می‌شود

1. **Pre-registration:** سفارش فروش، حواله حمل، خودرو، راننده و شرکت حمل از سیستم داخلی یا ERP دریافت می‌شود. در صورت فقدان مجوز، حالت `HOLD_PRECHECK` ایجاد می‌شود. [پ؛ مشابه قابلیت تطبیق سفارش S08]
2. **Approach at entry:** لوپ حضور/دوربین تشخیص عبور فعال می‌شود؛ RFIDRead و CameraPlateRead با `correlation_id` ثبت می‌شوند. [ت الگوی بازار S01؛ پیاده‌سازی ما پ]
3. **Identity fusion:** تطبیق تگ، پلاک، اطلاعات راننده و blacklist؛ نتایج `matched`, `unmatched`, `low_confidence`؛ مورد مشکوک به نگهبان ارجاع می‌شود.
4. **Gate authorization:** `Permit` و anti-passback و ظرفیت مسیر کنترل؛ درخواست بازشدن راهبند صادر و فیدبک PLC ثبت می‌شود. بدون تأیید وضعیت، ورود «موفق» فرض نمی‌شود.
5. **Entry event:** زمان ورود و عکس نمای کلی و بستر بار ضمیمه می‌شود؛ `Transaction.status=ON_SITE` و `GateEvent` ثبت می‌شوند.
6. **First weigh = TARE:** پس از تشخیص قرارگیری کامل خودرو و Stable بودن وزن، وزن تارا همراه Scale ID و CameraEvidence ذخیره می‌شود. مقدار tare_reference صرفاً ابزار کنترل اختلاف است.
7. **Loading:** اپراتور انبار/لودر با مجوز ماده، مبدأ، مقصد، target payload و زمان شروع/پایان بارگیری را ثبت می‌کند؛ ماژول LR360‌گونه در فاز افزونه می‌تواند بار هر جام را دریافت کند. [الگوی S16]
8. **Second weigh = GROSS:** پس از بازگشت کامیون، وزن ناخالص پایدار و تصویر بستر بار گرفته می‌شود. محاسبه `net_kg = gross_kg - tare_kg` با Decimal انجام می‌شود.
9. **Permit reconciliation:** سقف فنی ماشین، وزن باقی‌مانده حواله، مجوز حمل، مشتری، ماده، کیفیت داده و مغایرت‌های تصویر/حجم کنترل می‌شود. اگر شکست خورد `HELD_FOR_APPROVAL` و خروج خودکار ممنوع است.
10. **Commit & evidence:** رزرو سهمیه مجوز و پایان تراکنش در transaction پایگاه داده به‌صورت اتمیک/قابل بازیابی ثبت می‌شود؛ QR قبض و در صورت نیاز رویداد ERP در outbox ایجاد می‌شود.
11. **Exit gate:** با تأیید وزن و مجوز، فرمان راهبند و فیدبک واقعی؛ سپس `exited_at` ثبت می‌شود. زمان ماندگاری `exited_at - entered_at` محاسبه می‌شود.
12. **Audit and reporting:** تمام رویدادها به داشبورد شیفت اضافه می‌شوند؛ در قطع WAN، داده‌ها روی سرور سایت باقی می‌مانند تا همگام شوند.

### ۵.۲. ورود محموله به معدن/کارخانه — کامیون پر وارد می‌شود

1. ورود و تأیید هویت و مجوز دریافت طبق مراحل ۲–۵ بالا.
2. **First weigh = GROSS** پیش از تخلیه؛ ثبت عکس بار و مواد اظهارشده.
3. تخلیه در دپو/کارخانه با ثبت زمان، محل و تحویل‌گیرنده.
4. **Second weigh = TARE** پس از تخلیه؛ در صورت باقی‌ماندن بار، هشدار مغایرت تارا.
5. محاسبه خالص و تخصیص به receipt/stock intake؛ تطبیق با سفارش خرید و مجوز ورود.
6. رسید، گزارش ورودی و خروج پس از گذر موفق از تمام کنترل‌ها.

### ۵.۳. ماشین داخلی بدون خروج از سایت

جریان چندسفری: هر بارگیری و تخلیه `Cycle` یا `Transaction` مستقل با `parent_operation_id` اختیاری است. اگر واحد باسکول در هر دور وجود نداشته باشد، وزن payload on-board نباید با **وزن قانونی باسکول** یکسان نمایش داده شود. `measurement_source` و `quality_flag` الزامی هستند. [پ؛ مرجع FMS: S18–S23]

### ۵.۴. ماشین حالت تراکنش (State Machine)

`DRAFT → APPROACHING → ID_VERIFIED → ON_SITE → WEIGHED_FIRST → AT_LOADING/UNLOADING → WEIGHED_SECOND → VALIDATING → APPROVED → EXITED → CLOSED`.

انشعابات مجاز: `APPROACHING → REJECTED`، هر state فعال → `HELD_FOR_APPROVAL` در صورت anomaly، `HELD_FOR_APPROVAL → prior_valid_state` فقط با approval و audit، و `CLOSED → VOID_REQUESTED → VOIDED` بدون حذف تاریخچه. **غیرمجاز:** ثبت `EXITED` قبل از تأیید `WEIGHED_SECOND` در جریان دو‌توزینی، یا ثبت دو تراکنش فعال برای یک Vehicle در یک site مگر استثنای ثبت‌شده.

---

## ۶. مدل داده (Data Model) و قیود همبستگی

**تعریف [پ]:** `UUID` برای هویت سیستم؛ `timestamptz` برای زمان UTC با time zone نگهداری‌شده در Site؛ `decimal` برای اندازه‌گیری؛ `json` فقط برای داده خام دستگاه و metadata، نه فیلدهای تجاری اصلی. تمام داده‌های tenant-scoped شامل `site_id` و ترجیحاً `tenant_id` مشتق‌شده/محافظت‌شده‌اند؛ حذف cascade برای رکوردهای حسابرسی و تراکنش ممنوع است. این اسکیمای پیشنهادی برگرفته از فرآیندهاست، نه ساختار پایگاه داده داخلی رقبا.

| موجودیت | فیلدهای پیشنهادی (نام: نوع) |
|---|---|
| **`Tenant`** | `id:uuid PK`, `name:string`, `status:enum`, `created_at:timestamptz` |
| **`Site`** | `id:uuid PK`, `tenant_id:uuid FK`, `code:string unique_per_tenant`, `name:string`, `timezone:iana_string`, `geo_boundary:geometry?`, `policy_version:string` |
| **`User`** | `id:uuid PK`, `tenant_id:uuid FK`, `site_ids:uuid[]`, `role_ids:uuid[]`, `username:string`, `status:enum`, `mfa_enabled:boolean` |
| **`Vehicle`** | `id:uuid PK`, `site_id:uuid FK`, `plate_raw:string`, `plate_normalized:string`, `vin:string?`, `fleet_no:string?`, `vehicle_type:enum`, `axle_count:int?`, `max_gvw_kg:decimal?`, `tare_reference_kg:decimal?`, `tare_valid_until:timestamptz?`, `active:boolean` |
| **`Driver`** | `id:uuid PK`, `site_id:uuid FK`, `full_name:string`, `license_hash:string?`, `license_expiry:date?`, `contact_encrypted:string?`, `active:boolean` |
| **`Carrier`** | `id:uuid PK`, `site_id:uuid FK`, `legal_name:string`, `registration_code:string?`, `account_ref:string?`, `status:enum` |
| **`Customer`** | `id:uuid PK`, `site_id:uuid FK`, `name:string`, `customer_type:enum`, `erp_code:string?`, `billing_status:enum` |
| **`Material`** | `id:uuid PK`, `site_id:uuid FK`, `code:string`, `name:string`, `grade:string?`, `density_kg_m3:decimal?`, `density_source:string?`, `density_valid_from:date?`, `category:enum` |
| **`Permit`** | `id:uuid PK`, `site_id:uuid FK`, `permit_number:string`, `type:enum`, `vehicle_id:uuid? FK`, `carrier_id:uuid? FK`, `customer_id:uuid? FK`, `material_id:uuid FK`, `origin:string`, `destination:string`, `valid_from:timestamptz`, `valid_to:timestamptz`, `max_weight_kg:decimal?`, `quota_remaining_kg:decimal?`, `sales_order_ref:string?`, `status:enum`, `version:int` |
| **`Transaction`** | `id:uuid PK`, `site_id:uuid FK`, `trip_number:string`, `vehicle_id:uuid FK`, `driver_id:uuid? FK`, `carrier_id:uuid? FK`, `customer_id:uuid? FK`, `material_id:uuid? FK`, `permit_id:uuid? FK`, `direction:enum(inbound,outbound,internal)`, `status:enum`, `gross_kg:decimal?`, `tare_kg:decimal?`, `net_kg:decimal?`, `estimated_mass_kg:decimal?`, `volume_m3:decimal?`, `entered_at:timestamptz?`, `first_weighed_at:timestamptz?`, `loaded_at:timestamptz?`, `second_weighed_at:timestamptz?`, `exited_at:timestamptz?`, `version:int` |
| **`WeighEvent`** | `id:uuid PK`, `site_id:uuid FK`, `transaction_id:uuid FK`, `scale_id:uuid FK`, `sequence:int`, `kind:enum(first,second,reweigh,axle)`, `measurement_role:enum(gross,tare,unknown)`, `weight_kg:decimal`, `stable:boolean`, `indicator_raw:string?`, `captured_at:timestamptz`, `accepted_at:timestamptz?`, `source:enum(indicator,manual)`, `operator_id:uuid?`, `reason:string?`, `device_status:json`, `calibration_record_id:uuid? FK` |
| **`GateEvent`** | `id:uuid PK`, `site_id:uuid FK`, `transaction_id:uuid? FK`, `gate_id:string`, `lane_id:string`, `direction:enum(in,out)`, `detected_at:timestamptz`, `command_at:timestamptz?`, `feedback_at:timestamptz?`, `barrier_command:enum?`, `arm_state:enum?`, `vehicle_presence:boolean?`, `decision:enum`, `policy_version:string` |
| **`CameraPlateRead`** | `id:uuid PK`, `site_id:uuid FK`, `transaction_id:uuid? FK`, `gate_event_id:uuid? FK`, `camera_id:string`, `plate_raw:string`, `plate_normalized:string`, `confidence:decimal?`, `image_uri:string`, `video_uri:string?`, `read_at:timestamptz`, `model_version:string?` |
| **`RFIDRead`** | `id:uuid PK`, `site_id:uuid FK`, `gate_event_id:uuid? FK`, `reader_id:string`, `tag_uid:string`, `vehicle_id:uuid? FK`, `rssi_dbm:decimal?`, `antenna_id:string?`, `read_at:timestamptz`, `duplicate_group_id:string?` |
| **`Scale`** | `id:uuid PK`, `site_id:uuid FK`, `code:string`, `indicator_vendor:string?`, `indicator_model:string?`, `serial_no:string?`, `capacity_kg:decimal?`, `verification_division_kg:decimal?`, `protocol_profile:string?`, `enabled:boolean`, `health_state:enum` |
| **`CalibrationRecord`** | `id:uuid PK`, `site_id:uuid FK`, `scale_id:uuid FK`, `certificate_no:string`, `issuer:string`, `performed_at:date`, `valid_until:date?`, `scope:string?`, `document_uri:string?`, `verification_status:enum`, `approver_id:uuid? FK` |
| **`Alert`** | `id:uuid PK`, `site_id:uuid FK`, `transaction_id:uuid? FK`, `rule_id:string`, `rule_version:string`, `severity:enum`, `status:enum`, `observed_value:json?`, `threshold_snapshot:json?`, `evidence_ids:uuid[]`, `created_at:timestamptz`, `ack_by:uuid?`, `closed_by:uuid?`, `resolution:string?` |
| **`Shift`** | `id:uuid PK`, `site_id:uuid FK`, `name:string`, `start_at:timestamptz`, `end_at:timestamptz`, `team_id:string?`, `status:enum` |
| **`Equipment`** | `id:uuid PK`, `site_id:uuid FK`, `asset_no:string`, `type:enum(truck,loader,shovel,scale,scanner,other)`, `oem:string?`, `capacity_kg:decimal?`, `fms_id:string?`, `state:enum?` |
| **`LidarScan`** | `id:uuid PK`, `site_id:uuid FK`, `transaction_id:uuid? FK`, `vehicle_id:uuid FK`, `scanner_id:string`, `scan_type:enum(empty,loaded)`, `profile_uri:string`, `reference_empty_scan_id:uuid? FK`, `volume_m3:decimal?`, `quality:json`, `scan_at:timestamptz`, `calibration_ref:string?`, `source_version:string?` |
| **`PayloadEvent`** | `id:uuid PK`, `site_id:uuid FK`, `transaction_id:uuid? FK`, `loader_equipment_id:uuid FK`, `truck_equipment_id:uuid? FK`, `bucket_no:int?`, `payload_kg:decimal`, `event_at:timestamptz`, `material_id:uuid? FK`, `quality_flag:enum`, `source_system:string` |
| **`CameraEvidence`** | `id:uuid PK`, `site_id:uuid FK`, `transaction_id:uuid? FK`, `event_id:uuid?`, `camera_id:string`, `view_type:enum(overview,bed,plate,side)`, `uri:string`, `sha256:string`, `captured_at:timestamptz`, `retention_class:string` |
| **`Approval`** | `id:uuid PK`, `site_id:uuid FK`, `target_type:string`, `target_id:uuid`, `requested_by:uuid FK`, `approved_by:uuid? FK`, `reason:string`, `decision:enum`, `created_at:timestamptz`, `decision_at:timestamptz?` |
| **`AuditLog`** | `id:uuid PK`, `site_id:uuid FK`, `actor_id:uuid?`, `action:string`, `entity_type:string`, `entity_id:uuid`, `old_value_hash:string?`, `new_value_hash:string?`, `correlation_id:string`, `occurred_at:timestamptz`, `prev_hash:string?` |
| **`IntegrationOutbox`** | `id:uuid PK`, `site_id:uuid FK`, `topic:string`, `aggregate_id:uuid`, `payload:json`, `schema_version:string`, `sequence:int`, `idempotency_key:string`, `status:enum`, `attempt_count:int`, `next_attempt_at:timestamptz?` |
| **`DeviceHealth`** | `id:uuid PK`, `site_id:uuid FK`, `device_type:enum`, `device_id:string`, `metric_name:string`, `metric_value:decimal?`, `metric_unit:string?`, `status:enum`, `observed_at:timestamptz`, `vendor_raw:json?` |

### ۶.۱. Cardinality و Integrity

- `Tenant 1..N Site`؛ `Site 1..N Scale/Gate/Shift`؛ `Vehicle 1..N Transaction`؛ `Transaction 0..N GateEvent / 1..N WeighEvent / 0..N CameraEvidence / 0..N LidarScan`.
- `Permit 1..N Transaction` با مصرف کنترل‌شده سهمیه و `optimistic_lock(version)` یا lock تراکنشی؛ تغییر دستوری مجوز در حالت active باید Audit شود.
- `Transaction.net_kg` فقط پس از دو وزن معتبر با `source` و `stable=true` ساخته شود؛ `Check(gross_kg >= tare_kg)` برای گردش متداول و استثنا به مسیر approval جدا.
- `UNIQUE(site_id, trip_number)`، `UNIQUE(site_id, event_id)` برای idempotency؛ `UNIQUE(site_id, RFIDRead.reader_id, tag_uid, read_time_bucket)` صرفاً در جدول dedup و نه داده خام؛ readهای خام در بازه قابل تجمیع‌اند.
- `CameraEvidence.sha256` و `AuditLog.prev_hash` (اختیاری) برای کنترل تمامیت؛ استفاده از Object Storage با URI امضاشده و TTL برای عکس/ویدئو.
- افزودن `source_system`, `source_event_id`, `ingested_at`, `schema_version` به هر پیام integration برای reconciliation.
- **دقت جرم:** وزن باسکول (`mass_scale`) و جرم برآوردی از حجم (`mass_estimated`) دو کمیت با مسیر تأیید مختلف هستند. چگالی (`kg/m³`) به ماده، رطوبت، تاریخ آزمایش و منبع سنجش وابسته است.

### ۶.۲. محاسبات پیشنهادی و حدود اعتبار

```text
net_mass_kg       = gross_kg - tare_kg
turnaround_time   = exited_at - entered_at
load_volume_m3    = loaded_profile_volume_m3 - empty_profile_volume_m3
estimated_mass_kg = bulk_density_kg_per_m3 * load_volume_m3
shift_tonnage_t   = SUM(accepted_trip.net_kg) / 1000
avg_payload_kg    = SUM(accepted_trip.net_kg) / COUNT(accepted_trips)
```

**نکات ممیزی:** تفاضل حجم فقط با یک الگوی مرجع هندسی معتبر و کنترل کیفیت اسکن معنا دارد؛ چگالی توده‌ای برآورد جرم است نه جرم مجاز برای صورتحساب مبتنی بر وزن. بازه زمانی می‌تواند از نیمه‌شب عبور کند. زمان چرخه FMS فقط با داده کافی رویدادهای بارگیری، حمل، تخلیه و بازگشت قابل سنجش است؛ زمان ماندگاری در سایت با Cycle Time یکسان نیست. [پ؛ الگوهای S13، S16، S18]

---
## ۷. مشخصات UI/UX و تحلیل تصاویر عمومی

### ۷.۱. تحلیل شواهد تصویری و مرز مشاهده

**UI-REF-01 — Cozuca:** [صفحه معرفی عمومی Smart Traffic](https://traffic.cozuca.com/smart-traffic) و [فرم ورود](https://traffic.cozuca.com/login). در فرم ورود، فیلد نام کاربری/تلفن، رمز و ورودهای اجتماعی دیده می‌شود؛ صفحه معرفی حاوی معرفی قابلیت‌ها و فیلد Site Code است. **هیچ داشبورد احرازشده‌ای مشاهده نشده است.** بنابراین رنگ کارت‌های KPI، منوی داخلی، نقشه یا جدول اپلیکیشن Cozuca در این سند **قابل تأیید نیستند**. نسبت‌دادن طراحی پیشنهادی بخش بعد به UI واقعی Cozuca ممنوع است. [ت، S01–S03]

**UI-REF-02 — TruckFlow (نمونه فرم عملیاتی):** [تصویر صفحه Weighing در فهرست Techjockey](https://cdn.techjockey.com/web/assets/images/techjockey/products/screenshots/21235_truckflowsoftwareweight.jpg) (منبع ثانویه، `[ا]`). نوار سربرگ تیره با تب‌های عملکرد، فرم ستونی مشخصات حمل در چپ/میانه، دو نمایشگر عددی وزن در راست، تفکیک Incoming/Outgoing با دکمه وضعیت رنگی، ورودی‌های شرکت/حامل/محل/محصول و عملیات ثبت. **استنباط طراحی:** اطلاعات حیاتی وزن در کنار داده‌های تجاری همان تراکنش قرار دارند. رنگ/آرایش تصویری تنها مرجع تجربه کاربری است، نه الگوی کپی.

**UI-REF-03 — Precia TruckFlow (شرح رسمی صفحه):** بروشور PDF دوصفحه‌ای TruckFlow، صفحه ۱ PDF، بخش «Home page»(https://us.preciamolen.com/wp-content/uploads/sites/22/2019/07/09-15-01-1-FT-TRUCKFLOW-V00.09.pdf) اجزای `Application menus`، `Sub-menus & data`، `Vehicles on site`، `Vehicles recently out of site` و `Zones/peripherals` را صریحاً نام می‌برد. **تأیید اجزا، نه تأیید پیکسل و رنگ**؛ screenshot PDF توسط ابزار بررسی تصویری به‌علت redirect باز نشد. [ت، S06]

**UI-REF-04 — Wenco Fleet Control:** [اسکرین‌شات Fleet Control در وب‌سایت رسمی](https://assets-global.website-files.com/5fc81643ff1b2d4f89f0ee53/5fd13a3bcf804259af468a76_FMS%20Screenshot.png)، همچنین [صفحه رسمی محصول](https://www.wencomine.com/digital-brochures/wencomine-fleet-management-system). چیدمان افقی با میز عملیات متراکم در چپ، ستون لیست تجهیزات و assignments، و نقشه معدن با نقاط و لایه‌های مکانی در راست دیده می‌شود. نوار ابزار بالا، تب‌ها، اطلاعات تراکم‌یافته وضعیت عملیات و نشانه‌های رنگی وجود دارد. **درجه [ت] برای اجزای مشاهده‌شده تصویر؛ تفسیر نقش هر دکمه بدون مستند UI [ا].** [S24]

**UI-REF-05 — Wenco Dashboard:** [تصویر داشبورد رسمی](https://assets-global.website-files.com/5fc81643ff1b2d4f89f0ee53/604a4ec7909c3a6988c4fcb5_realtimedashboards-p-1080.png). نمودارهای میله‌ای چندرنگ عملکرد شاول به تفکیک زمان و وضعیت، نمودار دایره‌ای سهم وضعیت‌ها و بلوک مقدار بهره‌وری دیده می‌شود. زمینه تیره و تراکم بالا برای اتاق کنترل مناسب است؛ برای کاربران اداری روی نمایشگر موبایل باید بازطراحی ساده‌تر شود. [ت برای وجود عناصر، ا برای توصیه UX؛ S18]

**UI-REF-06 — LOADRITE LR360:** [بروشور رسمی PDF، صفحه ۲](https://www.sitechsolutions.com/wp-content/uploads/2015/06/022482-3219-Trimble_360-Brochure-EN-UK_WEB.pdf) صفحه کوچک دستگاه داخل کابین را با **لیست Truck ID، ماده، Zone و زمان انتظار** نشان می‌دهد؛ نمودار عملکرد بارگیری در کنار آن قرار دارد. [صفحه ۳ همان PDF] نمایش `Loading Accuracy` را نشان می‌دهد: مقایسه وزن هدف و وزن واقعی برای کامیون‌ها همراه اختلاف. معماری «لیست کار ساده در کابین + تحلیل در دفتر» مستند است. رنگ اصلی بروشور آبی و زرد است اما UI ما نباید از این ترکیب کپی‌شده استفاده کند. [ت؛ S16]

**UI-REF-07 — Loadscan:** [MyScanner صفحه رسمی و تصاویر معرفی](https://www.loadscan.com/myscanner/) با داشبورد خلاصه اسکنر، هشدار و خطا، نمودار تاریخی، لیست measurements و 3D Load Profiler توضیح داده شده است؛ [تصویر سخت‌افزار همراه نمایش پروفایل](https://www.loadscan.com/wp-content/uploads/2021/06/LVS-Hero_Loadscan-Range.png) نقشه رنگی سطح بار را نشان می‌دهد، اما **این تصویر تبلیغاتی نمای کامل UI نیست**. خواندن حجم، زمان، مسیر، شناسه کامیون و محصول در صفحه Measurements در متن رسمی تأیید شده است. [ت؛ S13–S15]

**UI-REF-08 — Rice Lake iQUBE²:** [صفحه محصول رسمی](https://www.ricelake.com/products/iqube2-digital-diagnostic-junction-box?part=93243) نمایش شاخص‌های سلامت سلول و Status LEDs را مستند می‌کند، اما layout نهایی داشبورد ابری از این صفحه به‌طور قابل اتکا استخراج نشد. برای UI خودمان وضعیت هر لودسل در نقشه شماتیک [پ] است، نه screenshot تأییدشده این محصول. [S12]

**منابع بصری که فیلم آن‌ها بررسی نشد:** [Wenco videos](https://www.wencomine.com/resources/videos) و [Wenco Get your mine working](https://www.wencomine.com/videos/get-your-mine-working-with-wenco). صفحه دارای توضیح/Embed ویدئو است؛ **فریم به فریم تماشا یا استخراج رفتار کاربران انجام نشده**. این بخش از روی ویدئوی واقعی گردش کار بازسازی نمی‌کند.

### ۷.۲. نظام طراحی مستقل پیشنهادی [پ]

- **قالب:** دسکتاپ RTL با ناوبری عمودی سمت راست (۲۲۴–۲۵۶ px *به‌عنوان نقطه شروع طراحی، نه اندازه اندازه‌گیری‌شده محصولات دیگر*)، نوار بالا با انتخاب Site/Shift، Search سراسری پلاک و دکمه مرکز هشدار. روی موبایل ناوبری Bottom Bar/Drawer و صفحات وظیفه‌محور.
- **پالت اختصاصی:** پس‌زمینه `#F5F7FA`، متن `#172B3A`، رنگ عملیاتی/اقدام `#146E84`، خط جدول `#DFE6EC`، هشدار توجه `#AD6500` و خطای بحرانی `#B42332`. این‌ها **پیشنهاد طراحی جدید** هستند؛ از مرجع استخراج یا کپی نشده‌اند.
- **فونت و جهت:** فونت متن فارسی مجاز و متناسب محیط؛ عدد وزن با فونت tabular و جهت LTR، برچسب و تیتر RTL. `۱۲٬۳۴۰ kg` با جداکننده مشخص؛ وزن Live و Accepted کاملاً متفاوت.
- **معنای رنگ:** سبز فقط state قابل قبول، نارنجی بررسی لازم، قرمز بلوکه/بحرانی، خاکستری «نامشخص/آفلاین». هیچ تصمیم ایمنی صرفاً وابسته به رنگ نیست؛ متن/آیکون الزامی.
- **جریان UI:** یک اقدام اصلی در هر مرحله؛ کلیک روی KPI امکان Drilldown دارد؛ تصاویر سند در تب Evidence؛ استثناها با دلیل، سطح خطر و مسئول رسیدگی نمایش داده شوند.
- **گرافیک:** نقشه گیت و باسکول به شکل پلان انتزاعی اختصاصی، نه کپی تصویر محصول رقبا؛ گراف سه‌بعدی با legend ارتفاع/واحد و نمایش کیفیت اندازه‌گیری.

### ۷.۳. فهرست صفحه‌ها و کامپوننت‌های پیشنهادی

| ID | صفحه/Route | نقش غالب | اجزای دقیق UI و داده نمایش | رفتار حیاتی |
|---|---|---|---|---|
| UI-01 | `/dashboard` | مدیر معدن | KPI cards: `Net Tonnage`, `Completed Trips`, `Vehicles On Site`, `Avg Turnaround`, `Active Alerts`, `Scale Availability`؛ نمودار شیفت/ساعت، قیف جریان، جدول آخرین تراکنش‌ها | فیلتر Site/Shift/Material، drilldown تا قبض |
| UI-02 | `/live/gates` | نگهبان | کارت هر Gate/Lane، فید دوربین/تصویر ثابت، plate candidate و confidence، RFID status، arm state، لوپ حضور، queue | بازکردن دستی فقط با مجوز و دلیل |
| UI-03 | `/live/scale/:id` | اپراتور باسکول | **Live Gross Display**، Stable/Unstable، health، تصویر نمای بالا/طرفین، کد تراکنش، دکمه Accept Weight | عدم ثبت وزن ناپایدار |
| UI-04 | `/transactions` | حسابدار/اپراتور | جدول ستون‌پذیر: Trip, Plate, Driver, Carrier, Material, Permit, Gross, Tare, Net, Entry, Exit, State | فیلتر پیشرفته، sort، CSV، کلیک سطر |
| UI-05 | `/transactions/:id` | همه با scope | Timeline رخداد، provenance، تصاویر قبل/بعد، وزن ۱/۲، حواله، کامیون و راننده، حجم، approvals، ERP sync | Trace شفاف، درخواست لغو و دلیل |
| UI-06 | `/permits` | فروش | جست‌وجوی حواله، نوع، مشتری، ماده، تاریخ اعتبار، سقف، مانده، استفاده‌شده | رزرو سهمیه و ابطال کنترل‌شده |
| UI-07 | `/vehicles` | نگهبان/مدیر | پلاک، RFIDهای مرتبط، تارای مرجع، حجم مجاز، تاریخچه سفر، وضعیت blacklist | جلوگیری از پلاک‌های همسان ناسازگار |
| UI-08 | `/drivers-and-carriers` | ادمین | راننده، شرکت، مدارک و انقضا، اتصال خودرو، Scope سایت | محدودیت نمایش داده‌های شخصی |
| UI-09 | `/yard/loading` | اپراتور محوطه | صف کارهای بارگیری، ماده و grade، مبدأ/دپو، مقصد، target mass، loader، زمان انتظار | تغییر status کار و ثبت بارگیری |
| UI-10 | `/alerts` | مدیر/نگهبان/نت | Severity، Rule ID، State، زمان، evidence، assigned_to، فیلتر باز/بسته | acknowledge، escalate، close با دلیل |
| UI-11 | `/scales/health` | نت | کارت هر باسکول، سلامت اتصال Indicator، وضعیت گواهی، **لودسل‌ها در صورت telemetry معتبر**، zero drift و نویز | Diagnostic و Calibration دو تب مجزا |
| UI-12 | `/reports/production` | مدیر/حسابدار | تناژ، سفر، ماده، گروه مشتری، شیفت و گیت؛ جدول/نمودار ساعت | Export قابل تکرار بر اساس version داده |
| UI-13 | `/reports/movements` | مدیر ناوگان | Turnaround و Queue distributions، حجم تردد ساعتی، مسیرهای مواد | مفقودبودن مرحله با Missing Data Badge |
| UI-14 | `/integrations` | ادمین فنی | Endpointها، وضعیت کانکتورها، Outbox Lag، last sync، dead-letter | replay امن و idempotent، test connection |
| UI-15 | `/settings/devices` | ادمین فنی | فهرست Gate، Camera، RFID، Scale، Modbus/TCP/Serial، Test mode | profile انتخابی دستگاه با تأیید فنی |
| UI-16 | `/audit` | ممیز | تاریخچه تغییرات بر اساس actor/Entity/Action/time، snapshot before/after و approval | فقط read و export watermark |
| UI-17 | `/plugins/lidar` | مهندس معدن | Scan list، empty reference، loaded surface 3D، Volume m³، quality و density | تعویض reference فقط با ثبت دلیل |
| UI-18 | `/plugins/fleet` | دیسپچر | Equipment status، نقشه، cycle Gantt، waiting، idle، payload trend و fuel اگر داده باشد | نمایش source و latency هر KPI |
| UI-19 | `/operator/mobile` | محوطه | جست‌وجوی پلاک، ورود بار، گرفتن عکس، تایید سند، جزئیات یک سفر | فرم تک‌ستونی مقاوم به خطا و وضعیت ارتباط |
| UI-20 | `/settings/shifts-roles` | مدیر سایت | تقویم شیفت، نقش‌ها، ماتریس مجوز، قوانین سایت و نسخ rules | rule changes فقط با Audit |

### ۷.۴. KPIها، روش محاسبه و کیفیت داده

| KPI | تعریف دقیق پیشنهادی | دامنه پیش‌نیاز | احتیاط |
|---|---|---|---|
| Production / Net Tonnes | مجموع `net_kg` تراکنش‌های `APPROVED/EXITED` مرتبط با شیفت، تقسیم بر ۱۰۰۰ | Transaction + Shift | واردشده/خارج‌شده و برگشتی مجزا |
| Trips | تعداد `Transaction.id` واجد شرایط | Transaction | eventهای چند بار خوانده‌شده یک سفر حساب نشوند |
| Turnaround | `exited_at - entered_at` برای تراکنش کامل | GateEvent | اگر ورودی/خروجی مفقود است N/A |
| Queue Time | زمان پیوستن به صف تا شروع سرویس باسکول یا بارگیری | queue sensor/event | بدون زمان صف واقعی، تخمین حدسی ممنوع |
| Avg Payload | `sum(net_kg) / accepted_trip_count` | WeighEvent | متوسط سفر وزن‌دار نه میانگین ساده سنسور |
| Hourly Flow | count سفرهای ورودی/خروجی گروه‌بندی‌شده بر ساعت محلی سایت | GateEvent | منطقه زمانی و DST کنترل شود |
| Weighbridge Availability | مدت Ready / مدت Planned Service | DeviceHealth | NoData جدا از Down |
| Overload Rate | تعداد سفر با threshold تجاوز / تعداد سفر واجد شرایط | Permit + WeighEvent | سقف از دیتای واقعی وسیله/سایت |
| Fleet Utilization | زمان کار مولد / زمان در دسترس تعریف‌شده | Equipment state | هر معدن تعریف availability متفاوت دارد |
| Fuel / tonne | Fuel consumed / net tonnes | تجهیز تله‌متری سوخت | در غیاب Fuel source مقدار N/A |
| Volume m³ | مجموع حجم اسکن‌های معتبر و unique | LidarScan | داده حجمی مستقل از تناژ قانونی |
| Estimated Density | mass_scale / scanned_volume برای نمونه‌های معتبر | WeighEvent + LidarScan | صرفاً تحلیل، نه تغییر ماده بدون تأیید |

### ۷.۵. وایرفریم مفهومی (اصل کار، بدون کپی)

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│ [محل: معدن A ▾] [شیفت: شب ▾] [از/تا]      [جست‌وجو پلاک/سفر] [هشدارها 03]      │
├──────────────────────────────────────────────────────────────────┬───────────────┤
│  تولید خالص   │ سفرهای کامل  │ ماشین داخل  │ زمان ماندگاری  │ سلامت باسکول    │  داشبورد      │
│  [metric]     │ [metric]    │ [metric]    │ [metric]       │ [Ready/Hold]   │  گیت‌ها       │
├────────────────────────────────┬─────────────────────────────────┤  توزین        │
│  روند تناژ / ساعت              │  ورودی و خروجی کامیون / ساعت   │  تراکنش‌ها    │
│  [line/area chart]            │  [stacked bars]                 │  مجوزها       │
├────────────────────────────────┴─────────────────────────────────┤  تولید        │
│ آخرین سفرها: پلاک | ماده | وزن خالص | زمان | تأیید | تصویر  │  سلامت دستگاه │
├──────────────────────────────────────────────────────────────────┤  هشدارها      │
│ هشدارهای باز: severity | event | action | assignee             │  تنظیمات      │
└──────────────────────────────────────────────────────────────────┴───────────────┘
```

---

## ۸. یکپارچه‌سازی، API و پروتکل‌های سخت‌افزاری

### ۸.۱. معماری منطقی پیشنهادی [پ]

```text
Cameras/ANPR ──────┐
UHF RFID Readers ──┤              ┌────────────────────────────┐
Position/Loops ────┤──> Edge I/O  │ Site Edge Gateway          │
Indicator/Loadcells┤   Adapters ──>│ Event Bus + Policy Engine  │
PLC/Barrier ───────┤              │ Local DB + Media Buffer    │
Lidar Scanner ─────┤              │ Device Health + Outbox     │
Loader Payload ────┘              └─────────────┬──────────────┘
                                               │ authenticated async sync
                                               ▼
                                   ┌────────────────────────────┐
                                   │ Central Site/Tenant API     │
                                   │ Transaction + Permit       │
                                   │ Reports + Alert Rules       │
                                   │ RBAC + Audit + Media Index  │
                                   └──────────┬──────┬──────────┘
                                              │      │
                                         ERP / BI   Web / Mobile UI
```

**حدود ایمنی:** سیستم وب تنها تصمیم تجاری بازکردن راهبند را اعلام می‌کند. PLC و interlock فیزیکی مسئول کنترل خطر تصادف/بسته‌شدن بازو روی وسیله هستند. فرمان معتبر بدون feedback واقعی به معنای عبور موفق نیست. در خرابی یا قطع شبکه، Fail-Safe/Fail-Secure به طراحی ایمنی سایت بستگی دارد؛ به‌صورت پیش‌فرض یک دستور سراسری باز یا بسته تحمیل نمی‌شود.

### ۸.۲. ماتریس اتصال تجهیزات — مشخصات نهایی تا زمان دریافت کاتالوگ دستگاه باز است

| اتصال | ورودی/خروجی | پروتکل‌های نمونه | شواهد محصولی | نکته قرارداد توسعه |
|---|---|---|---|---|
| UHF Reader | `tag_uid`, antenna_id, RSSI?, timestamp | SDK vendor، TCP یا Serial **پس از تأیید مدل** | Cozuca UHF؛ S01 | فرکانس منطقه‌ای، توان و برد **نامشخص برای Cozuca** |
| Camera ANPR/NVR | plate, confidence, frame, clip link | RTSP/ONVIF برای ویدئو، HTTP API/SDK سازنده برای Event | Cozuca Hikvision؛ S01 | پشتیبانی RTSP/ONVIF/HTTP برای مدل واقعی باید تست شود |
| Indicator | stable, net/gross weight stream, unit, status | RS-232/485، Ethernet/TCP، پروتکل ASCII vendor | Avery و Rice Lake؛ S05، S12 | استفاده از profile اختصاصی، نه parser عمومی فرضی |
| PLC/Barrier | open_request, arm_up/down, loops, fault | Digital IO، Modbus RTU/TCP، Relay/HTTP در حالت پشتیبانی‌شده | Cozuca صریحاً Network relay, USB, Modbus, HTTP؛ S01 | مدار fail-safe و emergency stop مستقل |
| Health of scale | cell voltage/status, zero/drift/noise | SDK یا خروجی diagnostic اندیکاتور | POWERCELL/iQUBE²؛ S11، S12 | قابلیت per-cell فقط با سخت‌افزار و مجوز مناسب |
| Lidar volume | empty/loaded mesh, scan quality, m³ | API/Export vendor (پروفایل باید مستند شود) | Loadscan MyScanner API؛ S13، S14 | فرض ذخیره point-cloud خام برای همه سازندگان مجاز نیست |
| Payload system | bucket kg, target, equipment, event | API/FMS payload interface | LOADRITE/Modular؛ S16، S22 | provenance وزن لودر با باسکول متفاوت |
| ERP/accounting | sales order, permit status, dispatch document, invoice | REST/JSON، webhooks، queue/outbox، CSV در صورت نیاز | Avery, WeighMAST؛ S04، S09 | retry/idempotency و سازگاری شناسه |
| FMS | equipment state, cycle, position, destination | API رسمی OEM/FMS، در صورت مجوز | Komatsu API؛ S22 | با GPS/Shift inferred بدون data source مشخص کار نکند |
| Notifications | in-app، SMS، email | provider adapter و صف؛ message templates | Cozuca/WeighMAST؛ S01، S09 | push در حالت بسته Cozuca فعلاً عرضه نشده |

**توضیح پروتکل‌ها:** `MQTT` و `OPC-UA` در این محصول ما [پ] گزینه‌های معماری مناسب Gateway صنعتی هستند؛ منبع عمومی Cozuca وجود native MQTT/OPC-UA را **تأیید نمی‌کند**. `Modbus` در Cozuca صریحاً برای راهبند ذکر شده؛ نباید آن را برای همه نشانگرهای وزن آن تعمیم داد. `RS-232/RS-485` در Rice Lake صریح است؛ وجود آن در مدل مشخص هر باسکول مشتری باید پیش از استقرار تأیید شود.

### ۸.۳. API پیشنهادی (نه API واقعی رقبا)

| Method | Endpoint | هدف | امنیت/تکرارپذیری |
|---|---|---|---|
| `POST` | `/api/v1/sites/{siteId}/identification-events` | ورود RFID/ANPR normalized | service auth + idempotency_key |
| `POST` | `/api/v1/sites/{siteId}/gate-decisions` | درخواست تأیید ورود/خروج | signed device + reason |
| `POST` | `/api/v1/sites/{siteId}/weigh-events` | ثبت وزن خوانده‌شده/پذیرفته‌شده | indicator adapter auth |
| `POST` | `/api/v1/sites/{siteId}/transactions` | آغاز پرونده سفر | atomic permit reservation |
| `GET` | `/api/v1/sites/{siteId}/transactions/{id}` | پرونده سفر همراه evidence | RBAC + PII filtering |
| `POST` | `/api/v1/sites/{siteId}/transactions/{id}/approve` | تصمیم استثنا | approval role + reason |
| `GET` | `/api/v1/sites/{siteId}/tickets/{id}/verify` | صحت رسید QR | token-limited public view |
| `POST` | `/api/v1/sites/{siteId}/lidar-scans` | بارگذاری metadata اسکن | capability `plugin.lidar` |
| `POST` | `/api/v1/sites/{siteId}/payload-events` | داده لودر یا شاول | capability `plugin.payload` |
| `GET` | `/api/v1/sites/{siteId}/reports/shift` | KPI و خلاصه شیفت | scope/site isolation |
| `GET` | `/api/v1/sites/{siteId}/audit` | دفتر حسابرسی | فقط auditor/site_admin |

**Event topics پیشنهادی:** `vehicle.identified.v1`، `gate.entered.v1`، `scale.weighed.v1`، `weigh.transaction.approved.v1`، `permit.quota.reserved.v1`، `transaction.exited.v1`، `alert.raised.v1`، `lidar.scanned.v1` و `fleet.payload.recorded.v1`. هر پیام باید `event_id`, `occurred_at`, `site_id`, `correlation_id`, `schema_version`, `source_system` داشته باشد.

---
## ۹. منطق هشدارها و موتور قواعد (Alert Rule Engine)

**اصل مشترک [پ]:** هیچ عدد آستانه‌ای به رقبا نسبت داده نشده است. آستانه‌های واقعی باید از `SitePolicy`، نقشه پروتکل سازنده، دقت دستگاه، مقررات حمل، مشخصات هر وسیله و قرارداد فروش اخذ شوند. هر نتیجه شامل نسخه Rule، `observed_value`, `threshold_snapshot`, `evidence_ids` و کنش ثبت‌شده است. تشخیص احتمال تقلب به معنای اثبات تقلب نیست.

| Rule ID | شدت | شرط تشخیص | آستانه/مرجع | اقدام | شواهد/الهام |
|---|---|---|---|---|---|---|
| `AL-01` | critical | RFID resolves Vehicle A but ANPR resolves Vehicle B | `identity_confidence_policy` | نگه‌داشتن راهبند/ارجاع نگهبان و مدیر | `RFIDRead,CameraPlateRead,GateEvent`؛ S01 |
| `AL-02` | critical | Vehicle یا Driver در blacklist فعال است | `blacklist_policy` | ممانعت از ورود؛ اطلاع به نگهبان | `Vehicle,GateEvent`؛ S01 |
| `AL-03` | high | درخواست ورود مجدد بدون خروج معتبر قبلی | `anti_passback_window` | Hold؛ نیاز به اصلاح ثبت خروج با ممیزی | `GateEvent,Transaction`؛ S01 |
| `AL-04` | critical | ArmUp بدون فرمان مجاز / پاسخ ناموفق فرمان | `feedback_timeout` | interlock و هشدار به نگهبان و مدیر | `GateEvent,DeviceHealth`؛ S01 |
| `AL-05` | high | دو detection خودرو روی یک فرمان عبور | `multi_vehicle_window` | بستن دسترسی جدید و بررسی ویدئو | `GateEvent,CameraEvidence`؛ S01 |
| `AL-06` | high | زمان رویداد خارج از [valid_from,valid_to] | `permit_validity` | Hold خروج و درخواست مجوز تازه | `Permit,Transaction`؛ [پ] |
| `AL-07` | critical | مجموع وزن رزرو و مصرف‌شده بیشتر از سهمیه یا cap | `quota_limit` | Hold و تأیید فروش/حسابداری | `Permit,Transaction`؛ S08 |
| `AL-08` | critical | gross_kg > مجاز وسیله یا limit قراردادی | `gross_limit_kg` | Hold و اصلاح بار یا تأیید قانونی | `WeighEvent,Vehicle`؛ S01 |
| `AL-09` | high | شاخص stable=false هنگام درخواست Commit | `indicator_stability_policy` | ممانعت از commit وزن و درخواست تکرار | `WeighEvent,Scale`؛ [پ] |
| `AL-10` | high | presence sensors یا پردازش تصویر موقعیت ناقص را نشان دهند | `position_policy` | عدم توزین تا قرارگیری کامل | `GateEvent,CameraEvidence`؛ S05 |
| `AL-11` | high | صفر غیرعادی بر اساس profile سازنده/سایت | `zero_reference_tolerance` | توقف خودکار حسب policy، ارجاع نگهداری | `DeviceHealth,Scale`؛ S12 |
| `AL-12` | high | out-of-balance/noise/drift خروجی معتبر DeviceHealth | `vendor_diagnostic_limits` | محدودیت بهره‌برداری مطابق سیاست و سرویس | `DeviceHealth,Scale`؛ S11,S12 |
| `AL-13` | high | تاریخ اعتبار گواهی گذشته یا به هشدار نزدیک شده | `certificate_due_window` | اعلان نت؛ Block در صورت الزام قانونی/سایت | `CalibrationRecord,Scale`؛ [پ] |
| `AL-14` | medium | لغو قبض بدون approval یا دفعات غیرعادی | `cancellation_policy` | ثبت immutable audit و ارجاع ممیز | `Transaction,Approval,AuditLog`؛ S01 |
| `AL-15` | medium | تفاوت تارای تازه با مرجع معتبر از حد مجاز فراتر رود | `tare_delta_tolerance` | بازسنجی، بررسی افزودن سوخت/آلودگی/بار باقیمانده | `WeighEvent,Vehicle`؛ [پ] |
| `AL-16` | medium | plate confidence < حد سایت یا نتیجه مبهم | `anpr_confidence_min` | مشاهده تصویر و ورود دستی با امضا | `CameraPlateRead`؛ S01 |
| `AL-17` | medium | heartbeat از دست رفته یا outbox lag فراتر از SLO | `heartbeat_timeout_and_lag` | اعلان IT؛ Edge mode با state مشخص | `DeviceHealth,IntegrationOutbox`؛ S01 |
| `AL-18` | medium | |scale_mass - estimated_mass| > tolerance با کیفیت scan معتبر | `volume_mass_reconciliation_limit` | علامت بررسی؛ عدم تغییر اتوماتیک وزن قانونی | `LidarScan,WeighEvent,Material`؛ [پ] |
| `AL-19` | low | اختلاف وزن آنبورد/هدف بارگیری | `payload_target_tolerance` | بازخورد به لودر و دیسپچر | `PayloadEvent,Transaction`؛ S16 |
| `AL-20` | medium | ورود موجود است اما خروج/توزین دوم در SLA تعریف‌شده رخ نداده | `trip_max_dwell_time` | بازبینی نگهبان، اعلام توقف/صف | `Transaction,GateEvent`؛ [پ] |

### ۹.۱. اولویت در عملیات راهبند

- **P0 / Safety interlock:** حادثه فیزیکی، اشغال lane، خطای وضعیت بازو → فرمان نرم‌افزار به تنهایی مجوز حرکت نیست؛ PLC/Interlock مستقل رفتار امن را تعیین می‌کند.
- **P1 / Identity & legal:** Blacklist، مغایرت شناسه، مجوز نامعتبر، وزن بالاتر از سقف قانونی → `HOLD` و مسیریابی به مسئول مجاز؛ عبور بدون ثبت مجوز استثنا نباید انجام شود.
- **P2 / Quality:** پلاک کم‌اطمینان، اختلاف تارا، اسکن مشکوک → کارتابل بررسی؛ وزن رسمی بدون تشخیص معتبر اصلاح نمی‌شود.
- **P3 / Operations:** طولانی‌شدن صف، تاخیر sync، تأخیر پاسخ ERP → در صورت امن‌بودن، کار در Edge ادامه می‌یابد و وضعیت عقب‌ماندگی آشکار می‌شود.

### ۹.۲. مدیریت تأیید، ثبت و هشدار

`raised → assigned → acknowledged → investigating → resolved / dismissed`؛ حالت `dismissed` فقط با دلیل و دسترسی و ثبت Audit. بسته‌شدن خودکار alarm بحرانی به صرف گذشت زمان ممنوع است. کنترل مجدد وضعیت پس از تعمیر یا برگشت ارتباط با rule جدا انجام شود. `frequency` و rate limit اطلاع‌رسانی به نقش، ایستگاه و ساعات شیفت وابسته باشد تا طوفان هشدار ایجاد نشود.

**تفاوت فنی مهم:** `zero_reference_change`، `load_cell_noise` و `cell_imbalance` سرنخ خرابی/نیاز به بازبینی هستند. از این سیگنال‌ها به تنهایی نمی‌توان «خروج از کالیبراسیون قانونی» را اثبات کرد. وضعیت گواهی، آخرین آزمون رسمی و تصمیم متخصص باید جدا ثبت شوند. منابع سخت‌افزار: S11، S12.

---

## ۱۰. افزونه‌ها (Plug-ins) و قرارداد توسعه

### ۱۰.۱. قابلیت‌های مشترک هر پلاگین [پ]

یک `PluginManifest` شامل `plugin_id`, `version`, `enabled_for_sites`, `required_permissions`, `events_subscribed`, `events_published`, `api_contract_version`, `device_capabilities`, `data_retention_class`, `health_check_url?` باشد. یک پلاگین حق تغییر مستقیم وزن ثبت‌شده باسکول، حذف Audit یا عبور از Scope سایت را ندارد. امکان خاموش‌شدن و replay پس از ارتقا بدون توقف هسته الزامی است.

### ۱۰.۲. `plugin.lidar_volume` — تخمین حجم و پروفایل سه‌بعدی

- **ورودی:** `vehicle_id`, `scanner_id`, `empty_reference_scan_id`, `loaded_scan_id`, `geometry_quality`, نوع بدنه/تریلر، `material_id` و `density` با منبع.
- **پردازش:** اعتبارسنجی تشابه هندسه، تطبیق پروفایل در سیستم مختصات، محاسبه سطح/حجم تفاضلی توسط SDK یا الگوریتم معتبر، ثبت عدم‌قطعیت و flagهای کیفیت. الگوی فرایند خالی/پر، RFID و Profile سه‌بعدی در Loadscan تأیید می‌شود. [ت، S13، S14]
- **خروجی:** `LidarScan`، `volume_m3`، `estimated_mass_kg`، `reference_scan_id`، URI سه‌بعدی و quality state.
- **UI:** WebGL 3D viewer با legend مقیاس رنگی، برش جانبی، histogram ارتفاع، مقایسه خالی/پر، کارت عدد حجم و نمودار اختلاف حجم در شیفت. **این طراحی [پ] است**.
- **Fail cases:** بار پوشیده، اسکن ناقص، کامیون غیرمنطبق با مرجع، سرعت خارج از بازه مجاز اسکنر، تراکم غبار/بارندگی/بخار و خروج از پوشش. نتیجه `UNTRUSTED`، نه صفر.
- **قبول نهایی:** تطبیق با مرجع کالیبره و گزارش خطا طبق استاندارد و قرارداد سایت؛ ادعای دقت ±۱٪ منتشرشده Loadscan [S13] **انتظار تضمین‌شده برای پیاده‌سازی ما نیست**.

### ۱۰.۳. `plugin.onboard_payload` — بار مفید شاول/لودر

- **ورودی:** `equipment_id`, `bucket_no`, `bucket_mass_kg`, `truck_id`, `material_id`, `load_job_id`, `timestamp`, `source_quality`.
- **کارکرد:** ثبت مجموع وزن جام‌های تخصیص‌یافته به یک کامیون، هدف وزن مجاز، نمایش اختلاف هدف/واقعی، تکمیل Job و ارسال نتیجه به فرایند باسکول. مدل کار واقعی LOADRITE LR360 با نمایش لیست داخل کابین و تبادل دوطرفه داده در S16 تأیید شده است.
- **قانون Reconciliation:** `payload_loader_mass` به‌عنوان تخمین/اندازه‌گیری مستقل ذخیره می‌شود. `gross_kg - tare_kg` از اندیکاتور معتبر مرجع تجاری ثابت است؛ تناقض هشدار می‌سازد نه overwrite.
- **وابستگی:** پروتکل واقعی ترازوی لودر/شاول و سازنده؛ عدم وجود API نباید در MVP وانمود به یکپارچگی شود.

### ۱۰.۴. `plugin.fleet_kpi` — ناوگان و تولید در شیفت

- **ورودی:** `equipment_position`, `equipment_state`, `truck_assignment`, `loading_start/end`, `dump_start/end`, `fuel_volume`, `payload`, `shift`.
- **تحلیل:** cycle time (با تفکیک loading, hauling_loaded, dumping, return_empty, queue)، Tonnes/Hour، انتظار شاول و سنگ‌شکن، بیکاری، availability، utilization، Fleet Production و Fuel/Tonne در صورت وجود منبع.
- **UI:** کارت تجهیزات همراه نقشه/نوار زمانی شیفت و جدول برنامه‌ریزی، نمودار واگرایی برنامه و تولید. مراجع عملکرد: Wenco S18–S19، Hexagon S20، DISPATCH S21–S22، MineStar S23.
- **Quality gate:** اگر فقط اطلاعات GateEvent موجود است، محاسبه CycleTime معدن **غیرممکن** است؛ `turnaround` سایت با `cycle time` ناوگان نباید اشتباه شود.

### ۱۰.۵. اولویت استقرار [پ]

| فاز | محدوده | خروجی قابل پذیرش | وابستگی عملی |
|---|---|---|---|
| صفر — بررسی میدانی | Device inventory، مدارک باسکول/کالیبراسیون، طراحی ایمنی، flow و Data Contract | صورت‌جلسه دامنه و نقشه کابل/شبکه | دسترسی به سایت و سازندگان |
| MVP | ۱ سایت و یک/چند lane باسکول، RFID/ANPR، تردد، وزن، مجوز، رسید، گزارش، Audit | سناریوهای AT-01 تا AT-08 و AT-10/11 | دوربین/اندیکاتور/PLC با پروتکل مشخص |
| P1 | ERP کامل، سلامت لودسل، گزارش زمان‌بندی و قابلیت چندسایتی عملیاتی | آزمون End-to-End sync، alert و RPO/RTO | دسترسی ERP و داده diagnostic |
| P2 | LiDAR، شاول/لودر، FMS و برنامه‌ریزی معدن | آزمون تطبیق حجم/وزن، AT-09 و AT-12 | اسکنر و API تجهیز/ناوگان |

---

## ۱۱. شکاف‌های شواهد، ریسک‌ها و سؤال‌های باز

### ۱۱.۱. شکاف‌های پژوهشی

| شکاف | وضعیت/اثر | پیشنهاد رفع |
|---|---|---|
| دسترسی به Cozuca dashboard | لاگین‌دار؛ طراحی صفحه‌ها و کنترل‌های داخلی **نامشخص** | demo با دسترسی مجاز/ویدئو از vendor؛ capture با رضایت |
| `robots.txt` و `sitemap.xml` | ابزار بررسی پاسخ معتبر نداد؛ خزش کامل ثابت نشده | خزش رسمی با دسترسی و خزنده مجاز؛ ثبت HTTP status و UTC |
| UI ویدئویی واقعی Cozuca | ویدئوی قابل مشاهده در داده‌های بررسی‌شده موجود نبود | درخواست فیلم walkthrough نقش نگهبان، وزن‌کش و مدیر |
| مستند API و اسکیمای دیتابیس Cozuca | در صفحات عمومی منتشر نشده | درخواست API Docs در صورت قرارداد؛ هیچ endpoint خصوصی حدس زده نشود |
| فرکانس دقیق و برد RFID Cozuca | **UHF و long range** تأیید؛ MHz/متر/توان reader نامشخص | مدل خوانشگر، استاندارد منطقه، تست onsite |
| پروتکل و مدل اندیکاتور هر معدن | Cozuca ذکر Weighing Indicators دارد؛ مدل/فرمت payload مشخص نیست | جدول رجیستر، نمونه dump ASCII، certificates و SDK |
| وضعیت ترازو/گواهی کالیبراسیون | لودسل diagnostics ≠ تشخیص قطعی خارج از کالیبراسیون | متخصص مترولوژی و آزمون مرجع، ثبت تاریخ اعتبار |
| پشتیبانی واقعی «وزن اول/دوم» در Cozuca | عبارت weigh tickets ذکر شده ولی ترتیب gross/tare به‌صراحت تشریح نشده | demo فرایند ورود پر و خروج خالی/برعکس |
| API و ERP اختصاصی Cozuca | HTTP برای راهبند تصریح شده؛ ERP API عمومی مشخص نیست | درخواست API واقعی و پروژه‌های پیاده‌شده |
| محدوده حکم قانونی باسکول | وابسته به کشور/استاندارد/نوع تجارت | اخذ متن مقررات و تأیید سازمان صلاحیت‌دار |
| تفاوت FMS و باسکول | داده GPS/دیسپچ در MVP تردد موجود نیست | قراردادهای داده Wenco/Komatsu/Cat/Hexagon را با OEM ارزیابی کنید |
| استناد به GUI PDF Precia | متن PDF خوانده شد؛ screenshot وب با redirect خطا داد | نسخه قابل دانلود محلی با اجازه و تصویربرداری بصری |
| منابع WBX | شواهد عمدتاً گزارش ثانویه و اطلاعات قدیمی‌تر | مستندات رسمی/دموی فعلی WBX و کاتالوگ جدید |
| نرخ دقت ادعاهای LiDAR | دقت شرکت Loadscan برای شرایط و محصولات خود آن است | آزمون acceptance مستقل با ماده، کامیون و محیط سایت |
| خطر محرمانگی تصاویر و رانندگان | قوانین حفظ داده و دوره نگهداری ناشناخته | Privacy policy و Retention مصوب مالک سایت |

### ۱۱.۲. سؤالات نهایی برای کارفرما / تیم نرم‌افزار

1. سناریوی اصلی خروج بار است یا ورود مواد، یا هر دو؟ وزن اول و دوم در چه نقاط و توسط کدام باسکول انجام می‌شود؟
2. تعداد سایت، گیت، lane و باسکول فعال و ظرفیت حداکثری تردد هر کدام چقدر است؟
3. سازنده، مدل، سال ساخت، درگاه ارتباطی و پروتکل اندیکاتور و PLC چیست؟ آیا Telemetry تک‌لودسل در دسترس است؟
4. فرایند حقوقی حواله فروش، مجوز حمل، بارنامه، سقف بار محوری و صلاحیت تأیید استثنا چگونه تعریف شده است؟
5. ساختار پلاک ملی/غیرملی، شماره ناوگان و انواع تریلر قابل پذیرش چیست؟ دقت قابل قبول ANPR در شرایط گردوغبار چگونه سنجیده می‌شود؟
6. کدام سامانه ERP یا حسابداری مالک سفارش است و چه API، مکانیزم احراز هویت و idempotency‌ای دارد؟
7. شبکه LAN/WAN، برق اضطراری، NVR موجود، زمان نگهداری ویدئو و الزامات Cybersecurity چیست؟
8. آیا خروج اجباری در قطع اینترنت باید ممکن باشد، و مرجع سیاست fail-safe کدام واحد ایمنی است؟
9. اطلاعات واقعی عیار/Grade و منشأ ماده در کدام فرایند تعیین می‌شوند؟ آیا آزمایشگاه LIMS یا انبار داده وجود دارد؟
10. برای LiDAR از کدام مدل اسکنر استفاده می‌شود؟ چه نوع خودرو و ماده، الگوریتم چگالی، مرجع خطا و استاندارد اندازه‌گیری مدنظر است؟
11. در افزونه ناوگان کدام OEM FMS یا ترازوی شاول/لودر وجود دارد؟ حق API و نرخ دریافت داده تأیید شده است؟
12. تعریف دقیق شاخص‌های شیفت، downtime، idle، waiting، cycle و fuel چه باید باشد؟ مستند Data Dictionary امضا شود.

### ۱۱.۳. تصمیم‌های اجرایی قطعی/معلق

**تأییدشده از منابع عمومی:** وجود اصل قابلیت‌های صریح S01–S26 مطابق ماتریس. **معلق:** شکل نهایی Cozuca UI، طول برد RFID و دقت ANPR، فرکانس RFID، پروتکل‌های دستگاه‌های واقعی، قرارداد ERP، استاندارد قانونی و KPI baseline. **پیشنهادی:** تمام FR/NFR، جدول موجودیت‌ها، UI جدید، API جدید، آستانه‌ها و مسیر فازبندی.

---

## ۱۲. JSON ساختاریافته بخش‌های ۴، ۶ و ۹ (Machine-Readable Contract)

**توجه:** JSON زیر مستقل از کد منبع رقباست، فقط یک قرارداد پیشنهادی برای توسعه است. `inspiration_sources` به کلیدهای همین گزارش اشاره می‌کند؛ `verification_state` در تمام نیازمندی‌های محصول `proposed` است. همه مقدارهای آستانه نمادین و قابل تنظیم‌اند؛ هیچ مقدار ساخته‌شده‌ای به شرکت‌ها نسبت داده نشده است.

```json
{
  "schema_name": "mine_weigh_traffic_product_spec",
  "schema_version": "1.0.0",
  "language": "fa-IR",
  "generated_on": "2026-10-25",
  "primary_reference": "https://traffic.cozuca.com/smart-traffic",
  "provenance": "Proposed implementation contract derived from public competitor features; not any vendor internal schema.",
  "confidence_legend": {
    "confirmed": "supported explicitly by cited public source",
    "inferred": "inferred from inspected image or indirect cue",
    "proposed": "our product design proposal",
    "unknown": "not publicly confirmed"
  },
  "product": {
    "name": "سامانه یکپارچه تردد و توزین معدنی (نام موقت)",
    "status": "proposed",
    "deployment": [
      "edge_on_prem",
      "central_cloud_optional"
    ],
    "modules": [
      "core.identity",
      "core.access",
      "core.weighing",
      "core.permits",
      "core.audit",
      "core.reports",
      "plugin.lidar_volume",
      "plugin.onboard_payload",
      "plugin.fleet_kpi"
    ]
  },
  "prd": {
    "roles": [
      {
        "id": "platform_admin",
        "title_fa": "مدیر کل پلتفرم",
        "responsibilities": "ساخت Tenant/Site، تنظیم امنیت و نسخه پلاگین، بدون دسترسی پیش‌فرض به محتوای تجاری مستاجر",
        "verification_state": "proposed"
      },
      {
        "id": "site_admin",
        "title_fa": "مدیر سایت",
        "responsibilities": "تعریف گیت/باسکول/شیفت/مقررات، کاربران و تأییدات",
        "verification_state": "proposed"
      },
      {
        "id": "director",
        "title_fa": "مدیر تولید یا مدیر معدن",
        "responsibilities": "داشبورد تجمیعی و رخدادهای پرریسک، گزارش و مجوز تأیید خاص",
        "verification_state": "proposed"
      },
      {
        "id": "gate_guard",
        "title_fa": "نگهبان/اپراتور گیت",
        "responsibilities": "بررسی خودرو/راننده، شواهد دوربین و وقایع راهبند، ثبت استثنا",
        "verification_state": "proposed"
      },
      {
        "id": "weigh_operator",
        "title_fa": "اپراتور باسکول",
        "responsibilities": "مشاهده وزن زنده، ثبت وزن پایدار، صدور قبض و گزارش مغایرت",
        "verification_state": "proposed"
      },
      {
        "id": "yard_operator",
        "title_fa": "اپراتور بارگیری/انبار",
        "responsibilities": "ثبت ماده، مبدأ و مقصد و تحویل به لودر/شاول",
        "verification_state": "proposed"
      },
      {
        "id": "sales_accountant",
        "title_fa": "فروش/حسابداری",
        "responsibilities": "حواله، اعتبارسنجی سفارش، صورتحساب و رسید",
        "verification_state": "proposed"
      },
      {
        "id": "maintenance",
        "title_fa": "نت و کالیبراسیون",
        "responsibilities": "مشاهده دستگاه و پارامتر تشخیص خطا، اسناد کالیبراسیون، قرنطینه باسکول",
        "verification_state": "proposed"
      },
      {
        "id": "fleet_dispatcher",
        "title_fa": "دیسپچر ناوگان",
        "responsibilities": "پیگیری چرخه و تجهیزات در افزونه FMS",
        "verification_state": "proposed"
      },
      {
        "id": "auditor",
        "title_fa": "ممیز مستقل",
        "responsibilities": "دسترسی فقط‌خواندنی به رخدادها، تأییدیه‌ها و تاریخچه تغییرات",
        "verification_state": "proposed"
      },
      {
        "id": "driver",
        "title_fa": "راننده/پیمانکار حمل",
        "responsibilities": "تأیید هویت، دستورالعمل مسیر، مشاهده رسید و مجوز اختصاصی",
        "verification_state": "proposed"
      }
    ],
    "user_stories": [
      {
        "id": "US-01",
        "actor": "gate_guard",
        "goal": "تطبیق پلاک/تگ/مجوز پیش از راهبند",
        "verification_state": "proposed"
      },
      {
        "id": "US-02",
        "actor": "weigh_operator",
        "goal": "ثبت وزن Stable و عکس هم‌زمان",
        "verification_state": "proposed"
      },
      {
        "id": "US-03",
        "actor": "sales_accountant",
        "goal": "کنترل مجوز و سهمیه",
        "verification_state": "proposed"
      },
      {
        "id": "US-04",
        "actor": "sales_accountant",
        "goal": "تطبیق قبض و ERP",
        "verification_state": "proposed"
      },
      {
        "id": "US-05",
        "actor": "director",
        "goal": "داشبورد سفر و تولید شیفت",
        "verification_state": "proposed"
      },
      {
        "id": "US-06",
        "actor": "maintenance",
        "goal": "تفکیک health و calibration",
        "verification_state": "proposed"
      },
      {
        "id": "US-07",
        "actor": "yard_operator",
        "goal": "لیست کارهای بارگیری",
        "verification_state": "proposed"
      },
      {
        "id": "US-08",
        "actor": "fleet_dispatcher",
        "goal": "تحلیل سیکل و payload",
        "verification_state": "proposed"
      },
      {
        "id": "US-09",
        "actor": "auditor",
        "goal": "بازرسی تاریخچه تغییر",
        "verification_state": "proposed"
      },
      {
        "id": "US-10",
        "actor": "site_admin",
        "goal": "فعال‌کردن ماژول‌ها بدون تغییر هسته",
        "verification_state": "proposed"
      }
    ],
    "functional_requirements": [
      {
        "id": "FR-01",
        "module": "identity",
        "phase": "MVP",
        "description_fa": "ثبت و نگهداری شناسه یکتای Tenant/Site/Gate/Lane و جداسازی کامل داده‌های سایت",
        "acceptance_fa": "عدم بازگرداندن رکورد سایت دیگر در API و گزارش",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01",
          "S02"
        ]
      },
      {
        "id": "FR-02",
        "module": "identity",
        "phase": "MVP",
        "description_fa": "CRUD خودرو، پلاک نرمال‌شده، شماره شاسی اختیاری، راننده، حامل و اعتبار شناسه‌ها",
        "acceptance_fa": "پلاک تکراری فعال به‌صورت کنترل‌شده رد یا وارد چرخه رفع تداخل شود",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01",
          "S04"
        ]
      },
      {
        "id": "FR-03",
        "module": "identity",
        "phase": "MVP",
        "description_fa": "دریافت رویداد RFID از adapter همراه قدرت سیگنال، Reader ID، زمان و Tag ID",
        "acceptance_fa": "تکرار خوانش در بازه dedup موجب دو ورود نشود",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01"
        ]
      },
      {
        "id": "FR-04",
        "module": "identity",
        "phase": "MVP",
        "description_fa": "دریافت ANPR با تصویر خام، رشته اصلی، رشته نرمال‌شده و Confidence",
        "acceptance_fa": "در Confidence زیر حد تنظیمی ورود خودکار متوقف و بررسی دستی درخواست شود",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01"
        ]
      },
      {
        "id": "FR-05",
        "module": "identity",
        "phase": "MVP",
        "description_fa": "تطبیق RFID و پلاک با یک Vehicle؛ ثبت مغایرت و شواهد",
        "acceptance_fa": "عدم تطابق فعال، هرگز سکوتی overwrite نشود",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01"
        ]
      },
      {
        "id": "FR-06",
        "module": "access",
        "phase": "MVP",
        "description_fa": "اعتبارسنجی blacklist، anti-passback، زمان‌بندی/اجازه ورود، درگاه و مجوز",
        "acceptance_fa": "ورود غیرمجاز باید مسدود و علت ذخیره شود",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01"
        ]
      },
      {
        "id": "FR-07",
        "module": "access",
        "phase": "MVP",
        "description_fa": "اجرای درخواست بازشدن راهبند از PLC/Relay با تایید حالت بازو و حضور خودرو",
        "acceptance_fa": "هر فرمان دارای correlation_id، timeout و نتیجه state باشد",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01"
        ]
      },
      {
        "id": "FR-08",
        "module": "access",
        "phase": "MVP",
        "description_fa": "ثبت GateEvent ورود، خروج، عبور ناموفق و عبور بدون دستور",
        "acceptance_fa": "دروازه بدون دستور منجر به Alert مستقل شود",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01"
        ]
      },
      {
        "id": "FR-09",
        "module": "access",
        "phase": "MVP",
        "description_fa": "استریم یا تصویر لحظه‌ای دوربین و امکان ثبت snapshot از نما و بستر بار",
        "acceptance_fa": "تصاویر با Event ID و زمان واقعی ذخیره و قابل بازیابی باشند",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01",
          "S05"
        ]
      },
      {
        "id": "FR-10",
        "module": "weighing",
        "phase": "MVP",
        "description_fa": "دریافت وزن و وضعیت پایدار از درایور Indicator؛ جداسازی raw reading از Accepted Weight",
        "acceptance_fa": "فقط وزن Stable با سلامت Device مجاز به ثبت نهایی باشد",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S04",
          "S06"
        ]
      },
      {
        "id": "FR-11",
        "module": "weighing",
        "phase": "MVP",
        "description_fa": "پیاده‌سازی وزن اول و دوم با ترتیب وابسته به نوع عملیات ورودی/خروجی",
        "acceptance_fa": "Inbound: gross سپس tare؛ Outbound: tare سپس gross؛ تناقض‌ها Hold شود",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S04",
          "S06"
        ]
      },
      {
        "id": "FR-12",
        "module": "weighing",
        "phase": "MVP",
        "description_fa": "محاسبه Net = Gross - Tare و منع ثبت Net منفی جز در مسیر استثنای ممیزی‌شده",
        "acceptance_fa": "حساب عددی decimal و واحد یکسان؛ Gross و Tare قابل ردگیری باشند",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S04"
        ]
      },
      {
        "id": "FR-13",
        "module": "weighing",
        "phase": "P1",
        "description_fa": "استفاده از تاییدشده‌ترین تارای ذخیره‌شده با تاریخ اعتبار و منبع",
        "acceptance_fa": "تارای منقضی هرگز بی‌هشدار به فروش منتقل نشود",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S04"
        ]
      },
      {
        "id": "FR-14",
        "module": "weighing",
        "phase": "MVP",
        "description_fa": "ثبت دو باسکول مستقل و یک تراکنش واحد با WeighEventهای چندگانه",
        "acceptance_fa": "خطای دوباره‌کاری و ترتیب نامعتبر با state machine رد شود",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S06",
          "S09"
        ]
      },
      {
        "id": "FR-15",
        "module": "weighing",
        "phase": "P2",
        "description_fa": "توزین محوری/چندمرحله‌ای با adapter و مجوز مترولوژی جداگانه",
        "acceptance_fa": "هر محور و نوع گواهی ذخیره شود؛ با gross ثابت اشتباه نشود",
        "verification_state": "proposed",
        "inspiration_sources": []
      },
      {
        "id": "FR-16",
        "module": "weighing",
        "phase": "MVP",
        "description_fa": "صدور قبض شماره‌دار با QR اشاره‌کننده به verification endpoint",
        "acceptance_fa": "QR نتیجه احراز اعتبار قبض را بدون افشای نامحدود PII نشان دهد",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01"
        ]
      },
      {
        "id": "FR-17",
        "module": "weighing",
        "phase": "MVP",
        "description_fa": "لغو یا اصلاح تراکنش فقط با علت، نقش مجاز و تأیید دو سطحی اختیاری",
        "acceptance_fa": "نسخه قبلی و شخص تأییدکننده حذف نشوند",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01",
          "S04"
        ]
      },
      {
        "id": "FR-18",
        "module": "permits",
        "phase": "MVP",
        "description_fa": "مدیریت مجوز فروش/حمل، سفارش، حامل، مشتری، ماده، مبدأ/مقصد، بازه اعتبار و سهمیه",
        "acceptance_fa": "استفاده از مجوز منقضی در خروج خودکار مسدود شود",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S08"
        ]
      },
      {
        "id": "FR-19",
        "module": "permits",
        "phase": "MVP",
        "description_fa": "رزرو/مصرف اتمیک سهمیه وزن در تراکنش و بازگردانی کنترل‌شده هنگام ابطال",
        "acceptance_fa": "دو گیت موازی نتوانند سهمیه واحد را دوبار خرج کنند",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S08"
        ]
      },
      {
        "id": "FR-20",
        "module": "permits",
        "phase": "MVP",
        "description_fa": "کنترل خودکار Net در برابر سقف بار وسیله، سقف مجوز و تلورانس قرارداد",
        "acceptance_fa": "فراتر از آستانه، خروج Hold و درخواست Approval باشد",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01"
        ]
      },
      {
        "id": "FR-21",
        "module": "permits",
        "phase": "P1",
        "description_fa": "اتصال وضعیت قبض به سفارش ERP، سند حسابداری/فاکتور و شماره بارنامه",
        "acceptance_fa": "همسان‌سازی idempotent بدون صدور فاکتور تکراری",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S04",
          "S09"
        ]
      },
      {
        "id": "FR-22",
        "module": "times",
        "phase": "MVP",
        "description_fa": "ثبت timestamp معتبر ورود، صف، وزن ۱، شروع/پایان بارگیری، وزن ۲ و خروج",
        "acceptance_fa": "turnaround قابل محاسبه؛ زمان‌های ناقص با null باقی بمانند",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01",
          "S06"
        ]
      },
      {
        "id": "FR-23",
        "module": "times",
        "phase": "MVP",
        "description_fa": "گزارش زمان انتظار، ماندگاری، شمارش سفر و الگوی ساعتی بر پایه رخداد واقعی",
        "acceptance_fa": "مرز شیفت و timezone در نتایج تکرارپذیر باشد",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01",
          "S18"
        ]
      },
      {
        "id": "FR-24",
        "module": "health",
        "phase": "MVP",
        "description_fa": "ثبت دارایی باسکول، LastCalibration، گواهی، DueDate و وضعیت بهره‌برداری",
        "acceptance_fa": "گواهی منقضی مطابق سیاست site باعث هشدار یا توقف شود",
        "verification_state": "proposed",
        "inspiration_sources": []
      },
      {
        "id": "FR-25",
        "module": "health",
        "phase": "P1",
        "description_fa": "اتصال health adapter برای drift/zero/noise/loadcell balance در صورت دسترسی اندیکاتور",
        "acceptance_fa": "فقط پارامترهایی که دستگاه واقعاً صادر می‌کند قابل نمایش باشند",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S11",
          "S12"
        ]
      },
      {
        "id": "FR-26",
        "module": "health",
        "phase": "MVP",
        "description_fa": "درج هشدار دخالت در صفر یا تغییر غیرمعمول توالی وزن و موقعیت",
        "acceptance_fa": "هر detection همراه rule_version و evidence ثبت شود",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01"
        ]
      },
      {
        "id": "FR-27",
        "module": "health",
        "phase": "MVP",
        "description_fa": "نمایش واضح اینکه Diagnostic Warning معادل «باسکول خارج از کالیبراسیون» نیست",
        "acceptance_fa": "برچسب CalibrationInvalid فقط با مدرک معتبر یا policy rule صادر شود",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S11",
          "S12"
        ]
      },
      {
        "id": "FR-28",
        "module": "reports",
        "phase": "MVP",
        "description_fa": "گزارش سفر، خالص بار، توزین‌ها، تردد، ماده، مشتری، شیفت، گیت و باسکول",
        "acceptance_fa": "فیلتر سایت/زمان و جست‌وجوی پلاک درست کار کند",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01",
          "S04"
        ]
      },
      {
        "id": "FR-29",
        "module": "reports",
        "phase": "MVP",
        "description_fa": "صدور CSV/XLSX/PDF، چاپ قبض و فیلترهای ذخیره‌شده",
        "acceptance_fa": "قالب عدد/واحد و permission در فایل خروجی حفظ شود",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S04",
          "S06"
        ]
      },
      {
        "id": "FR-30",
        "module": "reports",
        "phase": "P1",
        "description_fa": "زمان‌بندی ایمیل/پیامک گزارش و هشدار با opt-in و ثبت تحویل",
        "acceptance_fa": "ارسال تکراری در retry با کلید یکتا مهار شود",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S09",
          "S14"
        ]
      },
      {
        "id": "FR-31",
        "module": "reporting",
        "phase": "MVP",
        "description_fa": "داشبورد Role-specific با KPI: تعداد سفر، تناژ خالص، خودروهای داخل، وضعیت باسکول، هشدار",
        "acceptance_fa": "برای هر KPI تعریف، واحد، دامنه و بازه بازسازی‌پذیر وجود داشته باشد",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01",
          "S18"
        ]
      },
      {
        "id": "FR-32",
        "module": "integrations",
        "phase": "MVP",
        "description_fa": "کانکتور ERP از طریق API و صف outbox با retry، نسخه‌بندی و idempotency",
        "acceptance_fa": "در قطع ERP هیچ رویداد نهایی محلی از دست نرود",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S09",
          "S14"
        ]
      },
      {
        "id": "FR-33",
        "module": "integrations",
        "phase": "MVP",
        "description_fa": "Device adapter قابل جایگزینی برای سریال، TCP، Modbus و REST بر اساس قابلیت واقعی تجهیز",
        "acceptance_fa": "نبود درایور با mock simulator مشخص شود و وزن واقعی جعل نگردد",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01",
          "S12"
        ]
      },
      {
        "id": "FR-34",
        "module": "integrations",
        "phase": "P1",
        "description_fa": "کنترل PLC و سنسور حضور از gateway صنعتی مستقل با interlock فیزیکی",
        "acceptance_fa": "برنامه وب به‌تنهایی مسئول ایمنی راهبند نیست",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01",
          "S05"
        ]
      },
      {
        "id": "FR-35",
        "module": "security",
        "phase": "MVP",
        "description_fa": "RBAC با Scope سایت/نقش/عملیات و ثبت actor برای همه mutationها",
        "acceptance_fa": "یک نگهبان نتواند کالیبراسیون یا سفارش را تغییر دهد",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01",
          "S04"
        ]
      },
      {
        "id": "FR-36",
        "module": "security",
        "phase": "MVP",
        "description_fa": "Audit log فقط‌افزودنی برای تغییر وضعیت تراکنش، مجوز، وزن دستی و فرمان راهبند",
        "acceptance_fa": "حذف رکورد تجاری باعث حذف سابقه لاگ نشود",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S04"
        ]
      },
      {
        "id": "FR-37",
        "module": "security",
        "phase": "MVP",
        "description_fa": "کنترل ضد عبور پشت‌سرهم، ثبت ورود/خروج بدون جفت و شناسایی تکرار پلاک/رسید",
        "acceptance_fa": "Tailgating به صورت anomaly و امکان review ثبت شود",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01"
        ]
      },
      {
        "id": "FR-38",
        "module": "architecture",
        "phase": "MVP",
        "description_fa": "Gateway/Edge محلی برای اجرای تصمیم دسترسی حتی بدون اینترنت و Sync پس از اتصال",
        "acceptance_fa": "سناریوی قطع WAN با ثبت معتبر Gate/Weigh در LAN پاس شود",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01"
        ]
      },
      {
        "id": "FR-39",
        "module": "architecture",
        "phase": "MVP",
        "description_fa": "همگام‌سازی eventها با sequence، event_id و reconciliation بدون دوباره‌کاری",
        "acceptance_fa": "پردازش مجدد batch نباید تراکنش duplicate بسازد",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01",
          "S02"
        ]
      },
      {
        "id": "FR-40",
        "module": "architecture",
        "phase": "MVP",
        "description_fa": "نسخه‌بندی و فعال/غیرفعال‌سازی ماژول اختیاری بر حسب سایت",
        "acceptance_fa": "خاموش‌کردن LiDAR نباید هسته توزین را مختل کند",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S07"
        ]
      },
      {
        "id": "FR-41",
        "module": "lidar",
        "phase": "P2",
        "description_fa": "اتصال اسکنر با LidarScan empty/full profile، حجم و اسناد کالیبراسیون اسکنر",
        "acceptance_fa": "اسکن مرجع خالی به همان vehicle/trailer variant و تاریخ پیوند بخورد",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S13",
          "S14"
        ]
      },
      {
        "id": "FR-42",
        "module": "lidar",
        "phase": "P2",
        "description_fa": "حجم بار = تفاضل پروفایل پر و خالی و برآورد جرم با چگالی ماده و عدم‌قطعیت",
        "acceptance_fa": "mass_estimated از mass_scale در UI و DB جدا بماند",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S13"
        ]
      },
      {
        "id": "FR-43",
        "module": "fleet",
        "phase": "P2",
        "description_fa": "ثبت رویدادهای payload هر جام لودر/شاول و تخصیص به سفر/وسیله",
        "acceptance_fa": "تنظیم اتصال match در صورت شناسه مشترک یا زمان/مکان امکان‌پذیر باشد",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S16",
          "S20"
        ]
      },
      {
        "id": "FR-44",
        "module": "fleet",
        "phase": "P2",
        "description_fa": "محاسبه cycle time، waiting، idle، utilization و KPI تولید در محدوده شیفت",
        "acceptance_fa": "تعریف هر مخرج و منبع مشاهده در Data Dictionary ثبت شود",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S18",
          "S21"
        ]
      },
      {
        "id": "FR-45",
        "module": "fleet",
        "phase": "P2",
        "description_fa": "ورود داده FMS شامل تجهیزات، وضعیت، مقصد، مسیر و مواد با API adapter",
        "acceptance_fa": "تعارض بین داده باسکول و payload به‌صورت reconciliation event ثبت شود",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S22",
          "S23"
        ]
      },
      {
        "id": "FR-46",
        "module": "ui",
        "phase": "MVP",
        "description_fa": "نمایش فارسی RTL، تاریخ شمسی در UI اختیاری و ذخیره UTC در Backend",
        "acceptance_fa": "تغییر زبان/تقویم روی ذخیره timestamp و واحد اثر نگذارد",
        "verification_state": "proposed",
        "inspiration_sources": []
      },
      {
        "id": "FR-47",
        "module": "ui",
        "phase": "MVP",
        "description_fa": "حالت اضطراری بررسی دستی با ثبت علت، شاهد و امضای کاربر",
        "acceptance_fa": "Manual override فقط با نقش، scope و TTL مشخص مجاز باشد",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01"
        ]
      },
      {
        "id": "FR-48",
        "module": "quality",
        "phase": "MVP",
        "description_fa": "ثبت Source & Confidence هر داده (operator, scale, ANPR, RFID, LiDAR, ERP)",
        "acceptance_fa": "ردیف‌های گزارش بتوانند سند منشأ را به‌صورت breadcrumb بازیابی کنند",
        "verification_state": "proposed",
        "inspiration_sources": []
      },
      {
        "id": "FR-49",
        "module": "security",
        "phase": "P1",
        "description_fa": "قابلیت تکمیل چک‌لیست ایمنی شیفت و حضور مکانی مبتنی بر مجوز کاربر",
        "acceptance_fa": "GPS attendance و چک‌لیست با حریم خصوصی و consent کنترل شوند",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01"
        ]
      },
      {
        "id": "FR-50",
        "module": "access",
        "phase": "P1",
        "description_fa": "ارسال اعلان لحظه‌ای درون برنامه به نقش مرتبط؛ اعلان Push بسته‌بودن اپ در طرح ما جدا توسعه یابد",
        "acceptance_fa": "نوع کانال و وضعیت delivery در Alert ثبت شود",
        "verification_state": "proposed",
        "inspiration_sources": [
          "S01"
        ]
      }
    ],
    "non_functional_requirements": [
      {
        "id": "NFR-01",
        "category": "availability",
        "description_fa": "استقلال عملیات سایت از WAN؛ در قطع Cloud، ثبت محلی و تصمیم گیت طبق policy ادامه یابد",
        "test_fa": "آزمون قطع اینترنت؛ fail-safe کنترل راهبند و recovery",
        "verification_state": "proposed"
      },
      {
        "id": "NFR-02",
        "category": "integrity",
        "description_fa": "رخدادهای پذیرفته‌شده append-only، idempotent و قابل پیگیری با UUID",
        "test_fa": "تکرار یک event_id فقط یک رکورد مؤثر ایجاد کند",
        "verification_state": "proposed"
      },
      {
        "id": "NFR-03",
        "category": "latency",
        "description_fa": "تاخیر تصمیم گیت و ثبت وزن در شبکه محلی با SLO توافق‌شده سایت اندازه‌گیری شود؛ مقدار ثابت ساختگی تعریف نشود",
        "test_fa": "p95 آزمون میدانی بعد از تعیین تجهیزات و شبکه",
        "verification_state": "proposed"
      },
      {
        "id": "NFR-04",
        "category": "security",
        "description_fa": "HTTPS/TLS، رمزنگاری داده حساس، secret vault، least privilege، احراز هویت چندمرحله‌ای مدیر",
        "test_fa": "آزمون نفوذ، بازبینی access control",
        "verification_state": "proposed"
      },
      {
        "id": "NFR-05",
        "category": "audit",
        "description_fa": "مهر زمانی قابل اتکا، کنترل تغییر و سیاست نگهداری متناسب قرارداد/قانون",
        "test_fa": "اجرای replay و خروجی auditor با chain integrity",
        "verification_state": "proposed"
      },
      {
        "id": "NFR-06",
        "category": "safety",
        "description_fa": "ایمنی الکترو-مکانیکی راهبند باید مستقل از web app و متناسب با PLC/interlock باشد",
        "test_fa": "با سقوط API فرمان ناایمن یا بازشدن بی‌مجوز رخ ندهد",
        "verification_state": "proposed"
      },
      {
        "id": "NFR-07",
        "category": "metrology",
        "description_fa": "وزن معامله‌ای فقط از مسیر و ابزار دارای تأییدیه مترولوژی و استاندارد محلی ثبت شود",
        "test_fa": "آزمون sign-off با مرجع صلاحیت‌دار و مستندات دستگاه",
        "verification_state": "proposed"
      },
      {
        "id": "NFR-08",
        "category": "privacy",
        "description_fa": "حداقل‌سازی PII راننده، RBAC رسانه تصویری و Retention قابل تنظیم",
        "test_fa": "کنترل دسترسی تصویر، حذف طبق policy، ثبت export",
        "verification_state": "proposed"
      },
      {
        "id": "NFR-09",
        "category": "time",
        "description_fa": "ثبت timestamp به UTC و نگهداری zone site و quality clock؛ همگام‌سازی NTP در صورت دسترسی",
        "test_fa": "گزارش شب/تعویض شیفت و DST قابل بازتولید باشد",
        "verification_state": "proposed"
      },
      {
        "id": "NFR-10",
        "category": "observability",
        "description_fa": "متریک سلامت هر adapter، lag صف outbox، drop frame و خطاهای integration",
        "test_fa": "داشبورد عملیات IT و هشدار monitor",
        "verification_state": "proposed"
      },
      {
        "id": "NFR-11",
        "category": "interoperability",
        "description_fa": "Schema Version/Capability Negotiation و contract test برای تجهیزات",
        "test_fa": "تعویض مارک Indicator بدون تغییر domain logic",
        "verification_state": "proposed"
      },
      {
        "id": "NFR-12",
        "category": "scalability",
        "description_fa": "سایت‌ها و laneها isolation در دیتابیس/سرویس داشته باشند؛ ظرفیت بر پایه بار واقعی dimension شود",
        "test_fa": "load test با نرخ تراکنش واقعی سایت",
        "verification_state": "proposed"
      },
      {
        "id": "NFR-13",
        "category": "ux",
        "description_fa": "اپراتور بتواند مورد استثنا را با حداقل ورود دستی و status واضح رسیدگی کند",
        "test_fa": "آزمون کاربری با اپراتور واقعی و سناریوهای خطا",
        "verification_state": "proposed"
      },
      {
        "id": "NFR-14",
        "category": "reliability",
        "description_fa": "پشتیبان‌گیری، بازیابی و reconciliation پیش‌بینی شود؛ RPO/RTO قرارداد پروژه تعیین شود",
        "test_fa": "restore drill و آزمون قطع برق",
        "verification_state": "proposed"
      },
      {
        "id": "NFR-15",
        "category": "deployment",
        "description_fa": "امکان نصب بسته Edge صنعتی با مدیریت نسخه و rollback",
        "test_fa": "بازگشت نسخه بدون corruption داده",
        "verification_state": "proposed"
      },
      {
        "id": "NFR-16",
        "category": "units",
        "description_fa": "مقادیر وزن decimal با واحد پایه kg، حجم m³، چگالی kg/m³ و سیاست rounding متمرکز",
        "test_fa": "تست caseهای اعشاری و واحد تبدیل",
        "verification_state": "proposed"
      },
      {
        "id": "NFR-17",
        "category": "compatibility",
        "description_fa": "RTL وب دسکتاپ و نمای ساده موبایل؛ offline سایت به معنای offline تمام گوشی‌ها نیست",
        "test_fa": "آزمون با قطع Wi-Fi و اینترنت جداگانه",
        "verification_state": "proposed"
      },
      {
        "id": "NFR-18",
        "category": "governance",
        "description_fa": "مدل‌های ANPR دارای version، dataset/provenance و ارزیابی در پلاک و محیط واقعی باشند",
        "test_fa": "گزارش precision/recall میدانی و human fallback بدون ادعای نرخ مجهول",
        "verification_state": "proposed"
      }
    ]
  },
  "data_model": {
    "conventions": {
      "id_type": "uuid",
      "measurement_type": "decimal",
      "time_type": "timestamptz_utc",
      "mass_base_unit": "kg",
      "volume_base_unit": "m3",
      "density_base_unit": "kg_per_m3",
      "scope": "tenant_id/site_id",
      "raw_device_payload": "json",
      "delete_policy": "soft_delete_or_append_only_for_evidence"
    },
    "entities": [
      {
        "name": "Tenant",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "name",
            "type_and_constraints": "string"
          },
          {
            "name": "status",
            "type_and_constraints": "enum"
          },
          {
            "name": "created_at",
            "type_and_constraints": "timestamptz"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "Site",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "tenant_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "code",
            "type_and_constraints": "string unique_per_tenant"
          },
          {
            "name": "name",
            "type_and_constraints": "string"
          },
          {
            "name": "timezone",
            "type_and_constraints": "iana_string"
          },
          {
            "name": "geo_boundary",
            "type_and_constraints": "geometry?"
          },
          {
            "name": "policy_version",
            "type_and_constraints": "string"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "User",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "tenant_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "site_ids",
            "type_and_constraints": "uuid[]"
          },
          {
            "name": "role_ids",
            "type_and_constraints": "uuid[]"
          },
          {
            "name": "username",
            "type_and_constraints": "string"
          },
          {
            "name": "status",
            "type_and_constraints": "enum"
          },
          {
            "name": "mfa_enabled",
            "type_and_constraints": "boolean"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "Vehicle",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "site_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "plate_raw",
            "type_and_constraints": "string"
          },
          {
            "name": "plate_normalized",
            "type_and_constraints": "string"
          },
          {
            "name": "vin",
            "type_and_constraints": "string?"
          },
          {
            "name": "fleet_no",
            "type_and_constraints": "string?"
          },
          {
            "name": "vehicle_type",
            "type_and_constraints": "enum"
          },
          {
            "name": "axle_count",
            "type_and_constraints": "int?"
          },
          {
            "name": "max_gvw_kg",
            "type_and_constraints": "decimal?"
          },
          {
            "name": "tare_reference_kg",
            "type_and_constraints": "decimal?"
          },
          {
            "name": "tare_valid_until",
            "type_and_constraints": "timestamptz?"
          },
          {
            "name": "active",
            "type_and_constraints": "boolean"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "Driver",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "site_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "full_name",
            "type_and_constraints": "string"
          },
          {
            "name": "license_hash",
            "type_and_constraints": "string?"
          },
          {
            "name": "license_expiry",
            "type_and_constraints": "date?"
          },
          {
            "name": "contact_encrypted",
            "type_and_constraints": "string?"
          },
          {
            "name": "active",
            "type_and_constraints": "boolean"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "Carrier",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "site_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "legal_name",
            "type_and_constraints": "string"
          },
          {
            "name": "registration_code",
            "type_and_constraints": "string?"
          },
          {
            "name": "account_ref",
            "type_and_constraints": "string?"
          },
          {
            "name": "status",
            "type_and_constraints": "enum"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "Customer",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "site_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "name",
            "type_and_constraints": "string"
          },
          {
            "name": "customer_type",
            "type_and_constraints": "enum"
          },
          {
            "name": "erp_code",
            "type_and_constraints": "string?"
          },
          {
            "name": "billing_status",
            "type_and_constraints": "enum"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "Material",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "site_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "code",
            "type_and_constraints": "string"
          },
          {
            "name": "name",
            "type_and_constraints": "string"
          },
          {
            "name": "grade",
            "type_and_constraints": "string?"
          },
          {
            "name": "density_kg_m3",
            "type_and_constraints": "decimal?"
          },
          {
            "name": "density_source",
            "type_and_constraints": "string?"
          },
          {
            "name": "density_valid_from",
            "type_and_constraints": "date?"
          },
          {
            "name": "category",
            "type_and_constraints": "enum"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "Permit",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "site_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "permit_number",
            "type_and_constraints": "string"
          },
          {
            "name": "type",
            "type_and_constraints": "enum"
          },
          {
            "name": "vehicle_id",
            "type_and_constraints": "uuid? FK"
          },
          {
            "name": "carrier_id",
            "type_and_constraints": "uuid? FK"
          },
          {
            "name": "customer_id",
            "type_and_constraints": "uuid? FK"
          },
          {
            "name": "material_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "origin",
            "type_and_constraints": "string"
          },
          {
            "name": "destination",
            "type_and_constraints": "string"
          },
          {
            "name": "valid_from",
            "type_and_constraints": "timestamptz"
          },
          {
            "name": "valid_to",
            "type_and_constraints": "timestamptz"
          },
          {
            "name": "max_weight_kg",
            "type_and_constraints": "decimal?"
          },
          {
            "name": "quota_remaining_kg",
            "type_and_constraints": "decimal?"
          },
          {
            "name": "sales_order_ref",
            "type_and_constraints": "string?"
          },
          {
            "name": "status",
            "type_and_constraints": "enum"
          },
          {
            "name": "version",
            "type_and_constraints": "int"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "Transaction",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "site_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "trip_number",
            "type_and_constraints": "string"
          },
          {
            "name": "vehicle_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "driver_id",
            "type_and_constraints": "uuid? FK"
          },
          {
            "name": "carrier_id",
            "type_and_constraints": "uuid? FK"
          },
          {
            "name": "customer_id",
            "type_and_constraints": "uuid? FK"
          },
          {
            "name": "material_id",
            "type_and_constraints": "uuid? FK"
          },
          {
            "name": "permit_id",
            "type_and_constraints": "uuid? FK"
          },
          {
            "name": "direction",
            "type_and_constraints": "enum(inbound,outbound,internal)"
          },
          {
            "name": "status",
            "type_and_constraints": "enum"
          },
          {
            "name": "gross_kg",
            "type_and_constraints": "decimal?"
          },
          {
            "name": "tare_kg",
            "type_and_constraints": "decimal?"
          },
          {
            "name": "net_kg",
            "type_and_constraints": "decimal?"
          },
          {
            "name": "estimated_mass_kg",
            "type_and_constraints": "decimal?"
          },
          {
            "name": "volume_m3",
            "type_and_constraints": "decimal?"
          },
          {
            "name": "entered_at",
            "type_and_constraints": "timestamptz?"
          },
          {
            "name": "first_weighed_at",
            "type_and_constraints": "timestamptz?"
          },
          {
            "name": "loaded_at",
            "type_and_constraints": "timestamptz?"
          },
          {
            "name": "second_weighed_at",
            "type_and_constraints": "timestamptz?"
          },
          {
            "name": "exited_at",
            "type_and_constraints": "timestamptz?"
          },
          {
            "name": "version",
            "type_and_constraints": "int"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "WeighEvent",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "site_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "transaction_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "scale_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "sequence",
            "type_and_constraints": "int"
          },
          {
            "name": "kind",
            "type_and_constraints": "enum(first,second,reweigh,axle)"
          },
          {
            "name": "measurement_role",
            "type_and_constraints": "enum(gross,tare,unknown)"
          },
          {
            "name": "weight_kg",
            "type_and_constraints": "decimal"
          },
          {
            "name": "stable",
            "type_and_constraints": "boolean"
          },
          {
            "name": "indicator_raw",
            "type_and_constraints": "string?"
          },
          {
            "name": "captured_at",
            "type_and_constraints": "timestamptz"
          },
          {
            "name": "accepted_at",
            "type_and_constraints": "timestamptz?"
          },
          {
            "name": "source",
            "type_and_constraints": "enum(indicator,manual)"
          },
          {
            "name": "operator_id",
            "type_and_constraints": "uuid?"
          },
          {
            "name": "reason",
            "type_and_constraints": "string?"
          },
          {
            "name": "device_status",
            "type_and_constraints": "json"
          },
          {
            "name": "calibration_record_id",
            "type_and_constraints": "uuid? FK"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "GateEvent",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "site_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "transaction_id",
            "type_and_constraints": "uuid? FK"
          },
          {
            "name": "gate_id",
            "type_and_constraints": "string"
          },
          {
            "name": "lane_id",
            "type_and_constraints": "string"
          },
          {
            "name": "direction",
            "type_and_constraints": "enum(in,out)"
          },
          {
            "name": "detected_at",
            "type_and_constraints": "timestamptz"
          },
          {
            "name": "command_at",
            "type_and_constraints": "timestamptz?"
          },
          {
            "name": "feedback_at",
            "type_and_constraints": "timestamptz?"
          },
          {
            "name": "barrier_command",
            "type_and_constraints": "enum?"
          },
          {
            "name": "arm_state",
            "type_and_constraints": "enum?"
          },
          {
            "name": "vehicle_presence",
            "type_and_constraints": "boolean?"
          },
          {
            "name": "decision",
            "type_and_constraints": "enum"
          },
          {
            "name": "policy_version",
            "type_and_constraints": "string"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "CameraPlateRead",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "site_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "transaction_id",
            "type_and_constraints": "uuid? FK"
          },
          {
            "name": "gate_event_id",
            "type_and_constraints": "uuid? FK"
          },
          {
            "name": "camera_id",
            "type_and_constraints": "string"
          },
          {
            "name": "plate_raw",
            "type_and_constraints": "string"
          },
          {
            "name": "plate_normalized",
            "type_and_constraints": "string"
          },
          {
            "name": "confidence",
            "type_and_constraints": "decimal?"
          },
          {
            "name": "image_uri",
            "type_and_constraints": "string"
          },
          {
            "name": "video_uri",
            "type_and_constraints": "string?"
          },
          {
            "name": "read_at",
            "type_and_constraints": "timestamptz"
          },
          {
            "name": "model_version",
            "type_and_constraints": "string?"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "RFIDRead",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "site_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "gate_event_id",
            "type_and_constraints": "uuid? FK"
          },
          {
            "name": "reader_id",
            "type_and_constraints": "string"
          },
          {
            "name": "tag_uid",
            "type_and_constraints": "string"
          },
          {
            "name": "vehicle_id",
            "type_and_constraints": "uuid? FK"
          },
          {
            "name": "rssi_dbm",
            "type_and_constraints": "decimal?"
          },
          {
            "name": "antenna_id",
            "type_and_constraints": "string?"
          },
          {
            "name": "read_at",
            "type_and_constraints": "timestamptz"
          },
          {
            "name": "duplicate_group_id",
            "type_and_constraints": "string?"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "Scale",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "site_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "code",
            "type_and_constraints": "string"
          },
          {
            "name": "indicator_vendor",
            "type_and_constraints": "string?"
          },
          {
            "name": "indicator_model",
            "type_and_constraints": "string?"
          },
          {
            "name": "serial_no",
            "type_and_constraints": "string?"
          },
          {
            "name": "capacity_kg",
            "type_and_constraints": "decimal?"
          },
          {
            "name": "verification_division_kg",
            "type_and_constraints": "decimal?"
          },
          {
            "name": "protocol_profile",
            "type_and_constraints": "string?"
          },
          {
            "name": "enabled",
            "type_and_constraints": "boolean"
          },
          {
            "name": "health_state",
            "type_and_constraints": "enum"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "CalibrationRecord",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "site_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "scale_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "certificate_no",
            "type_and_constraints": "string"
          },
          {
            "name": "issuer",
            "type_and_constraints": "string"
          },
          {
            "name": "performed_at",
            "type_and_constraints": "date"
          },
          {
            "name": "valid_until",
            "type_and_constraints": "date?"
          },
          {
            "name": "scope",
            "type_and_constraints": "string?"
          },
          {
            "name": "document_uri",
            "type_and_constraints": "string?"
          },
          {
            "name": "verification_status",
            "type_and_constraints": "enum"
          },
          {
            "name": "approver_id",
            "type_and_constraints": "uuid? FK"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "Alert",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "site_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "transaction_id",
            "type_and_constraints": "uuid? FK"
          },
          {
            "name": "rule_id",
            "type_and_constraints": "string"
          },
          {
            "name": "rule_version",
            "type_and_constraints": "string"
          },
          {
            "name": "severity",
            "type_and_constraints": "enum"
          },
          {
            "name": "status",
            "type_and_constraints": "enum"
          },
          {
            "name": "observed_value",
            "type_and_constraints": "json?"
          },
          {
            "name": "threshold_snapshot",
            "type_and_constraints": "json?"
          },
          {
            "name": "evidence_ids",
            "type_and_constraints": "uuid[]"
          },
          {
            "name": "created_at",
            "type_and_constraints": "timestamptz"
          },
          {
            "name": "ack_by",
            "type_and_constraints": "uuid?"
          },
          {
            "name": "closed_by",
            "type_and_constraints": "uuid?"
          },
          {
            "name": "resolution",
            "type_and_constraints": "string?"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "Shift",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "site_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "name",
            "type_and_constraints": "string"
          },
          {
            "name": "start_at",
            "type_and_constraints": "timestamptz"
          },
          {
            "name": "end_at",
            "type_and_constraints": "timestamptz"
          },
          {
            "name": "team_id",
            "type_and_constraints": "string?"
          },
          {
            "name": "status",
            "type_and_constraints": "enum"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "Equipment",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "site_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "asset_no",
            "type_and_constraints": "string"
          },
          {
            "name": "type",
            "type_and_constraints": "enum(truck,loader,shovel,scale,scanner,other)"
          },
          {
            "name": "oem",
            "type_and_constraints": "string?"
          },
          {
            "name": "capacity_kg",
            "type_and_constraints": "decimal?"
          },
          {
            "name": "fms_id",
            "type_and_constraints": "string?"
          },
          {
            "name": "state",
            "type_and_constraints": "enum?"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "LidarScan",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "site_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "transaction_id",
            "type_and_constraints": "uuid? FK"
          },
          {
            "name": "vehicle_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "scanner_id",
            "type_and_constraints": "string"
          },
          {
            "name": "scan_type",
            "type_and_constraints": "enum(empty,loaded)"
          },
          {
            "name": "profile_uri",
            "type_and_constraints": "string"
          },
          {
            "name": "reference_empty_scan_id",
            "type_and_constraints": "uuid? FK"
          },
          {
            "name": "volume_m3",
            "type_and_constraints": "decimal?"
          },
          {
            "name": "quality",
            "type_and_constraints": "json"
          },
          {
            "name": "scan_at",
            "type_and_constraints": "timestamptz"
          },
          {
            "name": "calibration_ref",
            "type_and_constraints": "string?"
          },
          {
            "name": "source_version",
            "type_and_constraints": "string?"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "PayloadEvent",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "site_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "transaction_id",
            "type_and_constraints": "uuid? FK"
          },
          {
            "name": "loader_equipment_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "truck_equipment_id",
            "type_and_constraints": "uuid? FK"
          },
          {
            "name": "bucket_no",
            "type_and_constraints": "int?"
          },
          {
            "name": "payload_kg",
            "type_and_constraints": "decimal"
          },
          {
            "name": "event_at",
            "type_and_constraints": "timestamptz"
          },
          {
            "name": "material_id",
            "type_and_constraints": "uuid? FK"
          },
          {
            "name": "quality_flag",
            "type_and_constraints": "enum"
          },
          {
            "name": "source_system",
            "type_and_constraints": "string"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "CameraEvidence",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "site_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "transaction_id",
            "type_and_constraints": "uuid? FK"
          },
          {
            "name": "event_id",
            "type_and_constraints": "uuid?"
          },
          {
            "name": "camera_id",
            "type_and_constraints": "string"
          },
          {
            "name": "view_type",
            "type_and_constraints": "enum(overview,bed,plate,side)"
          },
          {
            "name": "uri",
            "type_and_constraints": "string"
          },
          {
            "name": "sha256",
            "type_and_constraints": "string"
          },
          {
            "name": "captured_at",
            "type_and_constraints": "timestamptz"
          },
          {
            "name": "retention_class",
            "type_and_constraints": "string"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "Approval",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "site_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "target_type",
            "type_and_constraints": "string"
          },
          {
            "name": "target_id",
            "type_and_constraints": "uuid"
          },
          {
            "name": "requested_by",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "approved_by",
            "type_and_constraints": "uuid? FK"
          },
          {
            "name": "reason",
            "type_and_constraints": "string"
          },
          {
            "name": "decision",
            "type_and_constraints": "enum"
          },
          {
            "name": "created_at",
            "type_and_constraints": "timestamptz"
          },
          {
            "name": "decision_at",
            "type_and_constraints": "timestamptz?"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "AuditLog",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "site_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "actor_id",
            "type_and_constraints": "uuid?"
          },
          {
            "name": "action",
            "type_and_constraints": "string"
          },
          {
            "name": "entity_type",
            "type_and_constraints": "string"
          },
          {
            "name": "entity_id",
            "type_and_constraints": "uuid"
          },
          {
            "name": "old_value_hash",
            "type_and_constraints": "string?"
          },
          {
            "name": "new_value_hash",
            "type_and_constraints": "string?"
          },
          {
            "name": "correlation_id",
            "type_and_constraints": "string"
          },
          {
            "name": "occurred_at",
            "type_and_constraints": "timestamptz"
          },
          {
            "name": "prev_hash",
            "type_and_constraints": "string?"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "IntegrationOutbox",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "site_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "topic",
            "type_and_constraints": "string"
          },
          {
            "name": "aggregate_id",
            "type_and_constraints": "uuid"
          },
          {
            "name": "payload",
            "type_and_constraints": "json"
          },
          {
            "name": "schema_version",
            "type_and_constraints": "string"
          },
          {
            "name": "sequence",
            "type_and_constraints": "int"
          },
          {
            "name": "idempotency_key",
            "type_and_constraints": "string"
          },
          {
            "name": "status",
            "type_and_constraints": "enum"
          },
          {
            "name": "attempt_count",
            "type_and_constraints": "int"
          },
          {
            "name": "next_attempt_at",
            "type_and_constraints": "timestamptz?"
          }
        ],
        "verification_state": "proposed"
      },
      {
        "name": "DeviceHealth",
        "fields": [
          {
            "name": "id",
            "type_and_constraints": "uuid PK"
          },
          {
            "name": "site_id",
            "type_and_constraints": "uuid FK"
          },
          {
            "name": "device_type",
            "type_and_constraints": "enum"
          },
          {
            "name": "device_id",
            "type_and_constraints": "string"
          },
          {
            "name": "metric_name",
            "type_and_constraints": "string"
          },
          {
            "name": "metric_value",
            "type_and_constraints": "decimal?"
          },
          {
            "name": "metric_unit",
            "type_and_constraints": "string?"
          },
          {
            "name": "status",
            "type_and_constraints": "enum"
          },
          {
            "name": "observed_at",
            "type_and_constraints": "timestamptz"
          },
          {
            "name": "vendor_raw",
            "type_and_constraints": "json?"
          }
        ],
        "verification_state": "proposed"
      }
    ],
    "relationships": [
      "Site.tenant_id -> Tenant.id",
      "Vehicle.site_id -> Site.id",
      "Transaction.vehicle_id -> Vehicle.id",
      "Transaction.permit_id -> Permit.id",
      "WeighEvent.transaction_id -> Transaction.id",
      "GateEvent.transaction_id -> Transaction.id",
      "LidarScan.transaction_id -> Transaction.id",
      "PayloadEvent.transaction_id -> Transaction.id",
      "Alert.transaction_id -> Transaction.id"
    ],
    "business_invariants": [
      "gross_kg>=tare_kg for regular completed transaction",
      "net_kg=gross_kg-tare_kg; decimal arithmetic",
      "two accepted stable weights before approval in double-weighing workflow",
      "permit quota consumption atomic and idempotent",
      "every mutation audit recorded",
      "estimated_mass_kg never silently overwrites legal scale mass",
      "gate commands must be acknowledged or timeout",
      "no data cross-site access"
    ]
  },
  "alerting": {
    "thresholds_source": "site_config_or_equipment_vendor_specs_not_hardcoded",
    "state_machine": [
      "raised",
      "assigned",
      "acknowledged",
      "investigating",
      "resolved",
      "dismissed"
    ],
    "rules": [
      {
        "id": "AL-01",
        "key": "identity_rfid_plate_mismatch",
        "severity": "critical",
        "condition": "RFID resolves Vehicle A but ANPR resolves Vehicle B",
        "threshold_key": "identity_confidence_policy",
        "action_fa": "نگه‌داشتن راهبند/ارجاع نگهبان و مدیر",
        "evidence_entities": [
          "RFIDRead",
          "CameraPlateRead",
          "GateEvent"
        ],
        "inspiration_sources": [
          "S01"
        ],
        "verification_state": "proposed"
      },
      {
        "id": "AL-02",
        "key": "blacklist_vehicle",
        "severity": "critical",
        "condition": "Vehicle یا Driver در blacklist فعال است",
        "threshold_key": "blacklist_policy",
        "action_fa": "ممانعت از ورود؛ اطلاع به نگهبان",
        "evidence_entities": [
          "Vehicle",
          "GateEvent"
        ],
        "inspiration_sources": [
          "S01"
        ],
        "verification_state": "proposed"
      },
      {
        "id": "AL-03",
        "key": "anti_passback",
        "severity": "high",
        "condition": "درخواست ورود مجدد بدون خروج معتبر قبلی",
        "threshold_key": "anti_passback_window",
        "action_fa": "Hold؛ نیاز به اصلاح ثبت خروج با ممیزی",
        "evidence_entities": [
          "GateEvent",
          "Transaction"
        ],
        "inspiration_sources": [
          "S01"
        ],
        "verification_state": "proposed"
      },
      {
        "id": "AL-04",
        "key": "unexpected_barrier_open",
        "severity": "critical",
        "condition": "ArmUp بدون فرمان مجاز / پاسخ ناموفق فرمان",
        "threshold_key": "feedback_timeout",
        "action_fa": "interlock و هشدار به نگهبان و مدیر",
        "evidence_entities": [
          "GateEvent",
          "DeviceHealth"
        ],
        "inspiration_sources": [
          "S01"
        ],
        "verification_state": "proposed"
      },
      {
        "id": "AL-05",
        "key": "possible_tailgate",
        "severity": "high",
        "condition": "دو detection خودرو روی یک فرمان عبور",
        "threshold_key": "multi_vehicle_window",
        "action_fa": "بستن دسترسی جدید و بررسی ویدئو",
        "evidence_entities": [
          "GateEvent",
          "CameraEvidence"
        ],
        "inspiration_sources": [
          "S01"
        ],
        "verification_state": "proposed"
      },
      {
        "id": "AL-06",
        "key": "permit_expired",
        "severity": "high",
        "condition": "زمان رویداد خارج از [valid_from,valid_to]",
        "threshold_key": "permit_validity",
        "action_fa": "Hold خروج و درخواست مجوز تازه",
        "evidence_entities": [
          "Permit",
          "Transaction"
        ],
        "inspiration_sources": [],
        "verification_state": "proposed"
      },
      {
        "id": "AL-07",
        "key": "permit_quota_exceeded",
        "severity": "critical",
        "condition": "مجموع وزن رزرو و مصرف‌شده بیشتر از سهمیه یا cap",
        "threshold_key": "quota_limit",
        "action_fa": "Hold و تأیید فروش/حسابداری",
        "evidence_entities": [
          "Permit",
          "Transaction"
        ],
        "inspiration_sources": [
          "S08"
        ],
        "verification_state": "proposed"
      },
      {
        "id": "AL-08",
        "key": "vehicle_overload",
        "severity": "critical",
        "condition": "gross_kg > مجاز وسیله یا limit قراردادی",
        "threshold_key": "gross_limit_kg",
        "action_fa": "Hold و اصلاح بار یا تأیید قانونی",
        "evidence_entities": [
          "WeighEvent",
          "Vehicle"
        ],
        "inspiration_sources": [
          "S01"
        ],
        "verification_state": "proposed"
      },
      {
        "id": "AL-09",
        "key": "unstable_weight",
        "severity": "high",
        "condition": "شاخص stable=false هنگام درخواست Commit",
        "threshold_key": "indicator_stability_policy",
        "action_fa": "ممانعت از commit وزن و درخواست تکرار",
        "evidence_entities": [
          "WeighEvent",
          "Scale"
        ],
        "inspiration_sources": [],
        "verification_state": "proposed"
      },
      {
        "id": "AL-10",
        "key": "partial_vehicle_position",
        "severity": "high",
        "condition": "presence sensors یا پردازش تصویر موقعیت ناقص را نشان دهند",
        "threshold_key": "position_policy",
        "action_fa": "عدم توزین تا قرارگیری کامل",
        "evidence_entities": [
          "GateEvent",
          "CameraEvidence"
        ],
        "inspiration_sources": [
          "S05"
        ],
        "verification_state": "proposed"
      },
      {
        "id": "AL-11",
        "key": "zero_shift_suspected",
        "severity": "high",
        "condition": "صفر غیرعادی بر اساس profile سازنده/سایت",
        "threshold_key": "zero_reference_tolerance",
        "action_fa": "توقف خودکار حسب policy، ارجاع نگهداری",
        "evidence_entities": [
          "DeviceHealth",
          "Scale"
        ],
        "inspiration_sources": [
          "S12"
        ],
        "verification_state": "proposed"
      },
      {
        "id": "AL-12",
        "key": "cell_balance_warning",
        "severity": "high",
        "condition": "out-of-balance/noise/drift خروجی معتبر DeviceHealth",
        "threshold_key": "vendor_diagnostic_limits",
        "action_fa": "محدودیت بهره‌برداری مطابق سیاست و سرویس",
        "evidence_entities": [
          "DeviceHealth",
          "Scale"
        ],
        "inspiration_sources": [
          "S11",
          "S12"
        ],
        "verification_state": "proposed"
      },
      {
        "id": "AL-13",
        "key": "calibration_certificate_due",
        "severity": "high",
        "condition": "تاریخ اعتبار گواهی گذشته یا به هشدار نزدیک شده",
        "threshold_key": "certificate_due_window",
        "action_fa": "اعلان نت؛ Block در صورت الزام قانونی/سایت",
        "evidence_entities": [
          "CalibrationRecord",
          "Scale"
        ],
        "inspiration_sources": [],
        "verification_state": "proposed"
      },
      {
        "id": "AL-14",
        "key": "suspicious_ticket_cancel",
        "severity": "medium",
        "condition": "لغو قبض بدون approval یا دفعات غیرعادی",
        "threshold_key": "cancellation_policy",
        "action_fa": "ثبت immutable audit و ارجاع ممیز",
        "evidence_entities": [
          "Transaction",
          "Approval",
          "AuditLog"
        ],
        "inspiration_sources": [
          "S01"
        ],
        "verification_state": "proposed"
      },
      {
        "id": "AL-15",
        "key": "unusual_tare_delta",
        "severity": "medium",
        "condition": "تفاوت تارای تازه با مرجع معتبر از حد مجاز فراتر رود",
        "threshold_key": "tare_delta_tolerance",
        "action_fa": "بازسنجی، بررسی افزودن سوخت/آلودگی/بار باقیمانده",
        "evidence_entities": [
          "WeighEvent",
          "Vehicle"
        ],
        "inspiration_sources": [],
        "verification_state": "proposed"
      },
      {
        "id": "AL-16",
        "key": "anpr_low_confidence",
        "severity": "medium",
        "condition": "plate confidence < حد سایت یا نتیجه مبهم",
        "threshold_key": "anpr_confidence_min",
        "action_fa": "مشاهده تصویر و ورود دستی با امضا",
        "evidence_entities": [
          "CameraPlateRead"
        ],
        "inspiration_sources": [
          "S01"
        ],
        "verification_state": "proposed"
      },
      {
        "id": "AL-17",
        "key": "device_or_sync_offline",
        "severity": "medium",
        "condition": "heartbeat از دست رفته یا outbox lag فراتر از SLO",
        "threshold_key": "heartbeat_timeout_and_lag",
        "action_fa": "اعلان IT؛ Edge mode با state مشخص",
        "evidence_entities": [
          "DeviceHealth",
          "IntegrationOutbox"
        ],
        "inspiration_sources": [
          "S01"
        ],
        "verification_state": "proposed"
      },
      {
        "id": "AL-18",
        "key": "lidar_weight_mismatch",
        "severity": "medium",
        "condition": "|scale_mass - estimated_mass| > tolerance با کیفیت scan معتبر",
        "threshold_key": "volume_mass_reconciliation_limit",
        "action_fa": "علامت بررسی؛ عدم تغییر اتوماتیک وزن قانونی",
        "evidence_entities": [
          "LidarScan",
          "WeighEvent",
          "Material"
        ],
        "inspiration_sources": [],
        "verification_state": "proposed"
      },
      {
        "id": "AL-19",
        "key": "payload_target_deviation",
        "severity": "low",
        "condition": "اختلاف وزن آنبورد/هدف بارگیری",
        "threshold_key": "payload_target_tolerance",
        "action_fa": "بازخورد به لودر و دیسپچر",
        "evidence_entities": [
          "PayloadEvent",
          "Transaction"
        ],
        "inspiration_sources": [
          "S16"
        ],
        "verification_state": "proposed"
      },
      {
        "id": "AL-20",
        "key": "unpaired_trip_timeout",
        "severity": "medium",
        "condition": "ورود موجود است اما خروج/توزین دوم در SLA تعریف‌شده رخ نداده",
        "threshold_key": "trip_max_dwell_time",
        "action_fa": "بازبینی نگهبان، اعلام توقف/صف",
        "evidence_entities": [
          "Transaction",
          "GateEvent"
        ],
        "inspiration_sources": [],
        "verification_state": "proposed"
      }
    ]
  },
  "api_proposal": {
    "auth": "site_scoped_service_identity_and_RBAC",
    "idempotency": "uuid_event_id_and_idempotency_key",
    "event_envelope": [
      "event_id",
      "site_id",
      "correlation_id",
      "occurred_at",
      "source_system",
      "schema_version"
    ],
    "api_version": "v1",
    "vendor_api_spec": "unknown_or_not_public"
  },
  "open_questions": [
    "hardware_protocols",
    "legal_metrology_approvals",
    "permit_schema",
    "ERP_contract",
    "driver_identity_policy",
    "RFID_band_and_range",
    "ANPR_local_accuracy",
    "LiDAR_reference_model_and_quality",
    "FMS_API_entitlements",
    "SLO_RPO_RTO_and_privacy_retention"
  ]
}
```
