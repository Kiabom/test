# مشخصات محصول مستقل: سامانه توزین، کنترل تردد و پایش تولید معدن
**نسخه:** 1.0 (Evidence-Based Reference PRD)  |  **تاریخ:** 2026-10-25  |  **زبان:** فارسی + English technical terminology
**موضوع تحلیل اصلی:** STAIN PESA+  |  **دامنه راهکار پیشنهادی:** Smart Mining Weighbridge, Gate Control & Operations Intelligence
**مهم:** این سند کد/برند/متن/طرح اختصاصی رقبا را بازتولید نمی‌کند و قابلیت‌های مبتنی بر شواهد را از تصمیم‌های طراحی مستقل جدا می‌کند.

## ۱. خلاصه اجرایی (حداکثر ۱۵ خط)
1. STAIN PESA+ ثبت ورود و خروج، وضعیت راننده/خودرو/حمل‌کننده، عکس، وزن و ارتباط کالا با سفارش را صریحاً پشتیبانی می‌کند [تأییدشده؛ S01].
2. STAIN برای PESA+ شناسایی خودکار پلاک، UHF RFID، پایش انفرادی لودسل و LiDAR را در منابع عمومی مشاهده‌شده اثبات نکرده است [نامشخص؛ S01,S02].
3. TruckFlow و Weighman 8 برای اتوماسیون پیشرفته باسکول و کنترل تردد مستندات جزئی‌تری دارند [تأییدشده؛ S14,S17].
4. SmarTower سخت‌افزار کیوسک، RFID UHF، دوربین و سنسور موقعیت را روشن می‌کند [تأییدشده؛ S15].
5. DataBridge MS/ES قابلیت ضدتقلب، توزین چندگانه و چندسایتی را با تفاوت سطح لایسنس مستند می‌کند [تأییدشده؛ S25,S26].
6. POWERCELL PDX و Rice Lake iQUBE² نقطه مرجع پایش سلامت سخت‌افزاری باسکول هستند، نه خودِ پلتفرم لجستیک [تأییدشده؛ S27,S29].
7. Loadscan MPS/MyScanner سنجش LiDAR حجمی و نماهای سه‌بعدی را فراهم می‌کند؛ خروجی حجمی معادل وزن تأییدشده نیست [تأییدشده؛ S30,S31].
8. Trimble/LOADRITE، Wenco، Hexagon، Modular و Cat، ماژول FMS/KPI را الهام می‌دهند و جایگزین نرم‌افزار حقوقی باسکول نیستند [تأییدشده؛ S35,S37,S39,S40,S41].
9. محصول پیشنهادی باید از ورود خودرو تا خروج، یک شناسه Visit/Trip، خط زمانی مدارک و شواهد وزنی داشته باشد [پیشنهادی].
10. MVP اولویت P0: گیت، تراکنش، باسکول، مجوز، تصاویر، داشبورد، هشدارهای بحرانی و Audit Trail است [پیشنهادی].
11. امکانات پیشرفته LiDAR و FMS باید Plug-in مستقل و دارای منشأ/کیفیت داده باشند [پیشنهادی].
12. سلامت لودسل بدون دسترسی به داده‌های تشخیصی مبدل/لودسل قابل استنتاج قابل اتکا نیست [محدودیت فنی؛ S27,S29].
13. هیچ آستانه عددی ایمنی یا دقت مدل AI بدون تحلیل سایت و الزامات مترولوژی در سند قطعی نشده است [پیشنهادی].

## ۲. منابع، روش و دامنه خزش
### ۲.۱ قرارداد صحت
- **[تأییدشده]** متن صریح منابع تولیدکننده/سند قابل‌خواندن؛ **[استنباطی]** برداشت محدود از تصویر یا الگوی مشاهده‌شده؛ **[پیشنهادی]** الزام طراحی ما، نه ادعای رقبا.
- علامت ماتریس **د[Sxx]** = «دارد، تأییدشده»؛ **؟** = «نامشخص/عدم تأیید»، نه «ندارد». «ندارد» صرفاً برای نفی صریحِ یک نسخه کاربرد دارد؛ هیچ عدم ذکر به نبودن تبدیل نشده است.
- دامنه خزش: صفحه اصلی PESA+، نسخه ایتالیایی، منوی MILL+، MES، ماژول‌های نزدیک، صنایع و فهرست مراجع؛ وب عمومی و چند PDF/تصویر رقبا. **خزش کامل sitemap/robot و تمام لینک‌های دامنه ممکن نشد**؛ بنابراین ادعای پوشش ۱۰۰٪ نداریم.
- پایگاه اصلی داده‌های کتابخانه‌ای/فایل‌های پیوست: در پیام ورودی فایلی واقعاً ضمیمه نشده است. ورودی `{{فایل‌ها}}` خالی تلقی شد.
### ۲.۲ فهرست URL و فایل شواهد دیده‌شده
|کد|عنوان/لینک دقیق|نوع/دامنه راستی‌آزمایی|
|---|---|---|
|S01|[STAIN PESA+ | صفحه محصول](https://www.stain.it/en/modules/pesa-gestione-ingresso-uscita-automezzi-e-ufficio-pesa/)|HTML؛ اصلی؛ توضیحات و تصویر فراخوان خودرو|
|S02|[STAIN PESA+ | ایتالیایی](https://www.stain.it/it/moduli/pesa-gestione-ingresso-uscita-automezzi-e-ufficio-pesa/)|HTML؛ کنترل تطبیق با زبان اصلی|
|S03|[STAIN MILL+](https://www.stain.it/en/products/mill-suite-for-metal/)|HTML؛ ماژول استاندارد/سفارشی|
|S04|[STAIN MES | معماری](https://www.stain.it/en/about-us/our-software-mes/)|HTML؛ PLC، ERP، محیط‌های چندسایتی؛ سطح سویت|
|S05|[STAIN | Scrap sampling](https://www.stain.it/en/modules/scrap-sampling-and-area-management/)|HTML؛ کنترل سفارش، نمونه‌گیری، اتصال ERP؛ ماژول جداگانه|
|S06|[STAIN | Plant logistics](https://www.stain.it/en/modules/plant-identification-and-logistics/)|HTML؛ موجودی/بسته‌بندی و ترازو در ماژول جداگانه|
|S07|[STAIN | Steel mills](https://www.stain.it/en/industries/metal/steel-mills/)|HTML؛ صنعت، ماژول‌ها و موارد مرجع|
|S08|[STAIN | MILL+ brochure](https://www.stain.it/uploads/PagineWE/metal_web1.pdf)|PDF [indexed; direct fetch timeout]؛ متن بازیابی‌شده از نمایه؛ شماره صفحه تأیید نشد|
|S09|[STAIN | نمایش فراخوان خودرو](https://www.stain.it/uploads/FasceImmagine/fascia22.jpg)|Image؛ تابلوی تصویری A تا E، صف و فراخوان|
|S10|[STAIN | تصویر باسکول](https://www.stain.it/uploads/FasceImmagine/fascia-pesa1.jpg)|Image؛ خودروی ورودی؛ تصویر UI نرم‌افزار نیست|
|S11|[STAIN | refs](https://www.stain.it/en/references/)|HTML؛ فهرست مشتریان؛ نه اثبات استفاده هرکدام از PESA+|
|S12|[STAIN | MTZ maintenance](https://www.stain.it/en/modules/run-to-failure-predictive-maintenance/)|HTML؛ نگهداری عمومی؛ نباید به پایش کالیبراسیون PESA تعمیم داده شود|
|S13|[STAIN | LGT department logistics](https://www.stain.it/en/modules/lgt-department-logistics/)|HTML؛ برچسب و نقل‌وانتقال ERP در ماژول دیگر|
|S14|[Avery | Weighman 8](https://www.averyweigh-tronix.com/en/product/weighman-8-weighbridge-software)|HTML؛ RFID/ANPR، چندسایتی، stored tare، گزارش|
|S15|[Avery | SmarTower](https://www.averyweigh-tronix.com/en/product/smartower-unmanned-weighbridge-system/)|HTML؛ UHF RFID، دوربین، سنسور موقعیت، راهبند اختیاری|
|S16|[Avery | Vehicle Image Capture](https://www.averyweigh-tronix.com/en-gb/wp-content/uploads/sites/2/2023/07/Weighman8_Vehicle_Image_Capture_spec_100164.pdf)|PDF [indexed; redirected]؛ دوربین موقعیت، دوربین بالای بار؛ تصویر اصل PDF مشاهده نشد|
|S17|[PRECIA MOLEN | TRUCKFLOW datasheet](https://us.preciamolen.com/wp-content/uploads/sites/22/2019/07/09-15-01-1-FT-TRUCKFLOW-V00.09.pdf)|PDF 2 pages [text inspected; screenshot blocked]؛ ص ۱: UI/معماری؛ ص ۲: weighing, RBAC, multi-site|
|S18|[PRECIA MOLEN | TRUCKFLOW UI تصویر](https://be-fr.preciamolen.com/wp-content/uploads/sites/12/2017/07/%C3%A9cran-1024x613.png)|Image [web indexed]؛ اسکرین‌شات نسخه قدیمی؛ UI فعلی ممکن است متفاوت باشد|
|S19|[PRECIA MOLEN | Truckflow brochure](https://www.preciamolen.com/wp-content/uploads/2022/10/DC10041-1-014_interactif.pdf)|PDF [indexed; open 404]؛ ERP، قرارداد، ردیابی، دسترسی؛ صفحه ۲۳ طبق متن نمایه|
|S20|[Dariel | WBX article](https://it-online.co.za/2019/05/24/wbx-automates-weighbridge-process/)|News؛ WBX، یکپارچه‌سازی ERP، ضدتقلب|
|S21|[Dariel | WBX product modules](https://easterncapeindustrialnews.co.za/software-suite-takes-the-weight-off-logistics-operations/)|News؛ CaseX/SPX/AccessX/WBX|
|S22|[Dariel | Coal case](https://www.dariel.co.za/coal-logistics-services-optimisation/)|Official case؛ رهگیری حمل زغال/طراحی و یکپارچه‌سازی؛ لزوماً همان WBX نیست|
|S23|[Endel Digital | WeighMAST](https://endel.digital/weighmast-weighbridge-software/)|HTML؛ ANPR، RFID، PDF/XLS/CSV/XML، RS232/LAN، ERP|
|S24|[METTLER TOLEDO | DataBridge](https://www.mt.com/in/en/home/products/Transport_and_Logistics_Solutions/weighbridge-and-rail-scale-systems/weighbridge-systems/databridge-software-61046589001.html)|HTML؛ SS/MS/ES/AP؛ عدم یکسان بودن امکانات هر نسخه|
|S25|[METTLER TOLEDO | DataBridge brochure](https://www.mt.com/dam/product_organizations/industry/transport-and-logistics/vehicle/databridge-downloads/DataBridge_Brochure-EN-PB-B-VEH-20250203-00193661.pdf)|PDF 6 pages [screenshots inspected]؛ ص ۳: تصویر UI؛ ص ۴: ماتریس بسته‌ها؛ صفحات ۱مبنا|
|S26|[METTLER TOLEDO | DataBridge datasheet](https://www.mt.com/dam/product_organizations/industry/transport-and-logistics/vehicle/databridge-downloads/DataBridge_Datasheet-EN-DS-B-VEH-20250110-00191484.pdf)|PDF 5 pages [text inspected]؛ ص ۲-۴: ضدتقلب، برنامه، پروتکل‌های خروجی|
|S27|[METTLER TOLEDO | POWERCELL PDX](https://www.mt.com/us/en/home/products/Transport_and_Logistics_Solutions/truck-and-rail-scale-systems/truck-scale-systems/powercell-pdx-load-cells-42904891002.html)|HTML؛ تشخیص وضعیت لودسل، شبکه دیجیتال|
|S28|[METTLER TOLEDO | VSK 901](https://www.mt.com/ca/en/home/products/Transport_and_Logistics_Solutions/truck-and-rail-scale-systems/software-upgrades-and-systems/vsk9-series-truck-scale-kiosk-31125888.html)|HTML؛ کیوسک RFID/BLE/NFC؛ به معنی قابلیت PESA نیست|
|S29|[Rice Lake | iQUBE²](https://www.ricelake.com/products/iqube2-digital-diagnostic-junction-box?part=54224)|HTML؛ رانش، نویز، عدم‌تقارن بار، RS232/485، هشدار|
|S30|[Loadscan | MyScanner](https://www.loadscan.com/myscanner/)|HTML؛ داشبورد ابری، تاریخچه، پروفایل سه‌بعدی|
|S31|[Loadscan | MPS](https://www.loadscan.com/mine-payload-scanner/)|HTML؛ اسکن خالی/پر، RFID، LiDAR حجمی|
|S32|[Loadscan | LVS](https://www.loadscan.com/load-volume-scanner/)|HTML؛ لیزر و 3D؛ تفاوت حجم از وزن|
|S33|[Loadscan | API](https://www.loadscan.com/loadscan-integration-api/)|HTML؛ REST JSON برای MyScanner؛ MPS SQL/LAN در برخی پیکربندی‌ها|
|S34|[Loadscan | MyScanner dashboard update](https://www.loadscan.com/myscanner-dashboard-update/)|HTML؛ هشدار و تعداد/حجم در ۵ روز، فیلتر وضعیت|
|S35|[Trimble LOADRITE | InsightHQ](https://www.goloadrite.com/insighthq)|HTML؛ تولید، زمان چرخه، محل بارگیری، توقف|
|S36|[Trimble | LR360 release](https://www.prnewswire.com/news-releases/trimble-introduces-loadrite-360-loadout-management-system-for-quarries-300071668.html)|press release؛ ترازو لودر، ارتباط و گزارش بارگیری|
|S37|[Wenco | Fleet Performance](https://www.hitachi.com/en-us/press/wenco-mine-performance-suite-6-reimagines-dispatching-analytics-and-total-mine-performance/)|official press release؛ KPI بار مفید، انتظار، بارگیری جام به جام، هدف شیفت|
|S38|[Wenco | dispatch](https://www.wencomine.com/our-solutions/dispatching)|HTML؛ بهینه‌سازی اعزام/سوخت|
|S39|[Hexagon | mine operations](https://hexagon.com/products/mine-operations)|HTML؛ FMS/عملکرد؛ بدون مستند ریز برای توزین|
|S40|[Komatsu Modular | DISPATCH](https://www.komatsu.com/en-us/technology/smart-mining/loading-and-haulage/dispatch)|HTML؛ اعزام، سوخت، blend، digital twin|
|S41|[Caterpillar | MineStar Fleet](https://www.cat.com/en_US/by-industry/mining/surface-mining/surface-technology/fleet.html)|HTML؛ چرخه، payload، مواد، اعزام|
|S42|[TruckFlow screenshot indexed](https://cdn.techjockey.com/web/assets/images/techjockey/products/screenshots/21235_truckflowsoftwareweight.jpg)|Image third-party؛ فرم توزین؛ بازنشر شخص ثالث، نسخه/اصالت مستقل تأیید نشده|
|S43|[STAIN | foundry context](https://www.stain.it/en/industries/metal/brass-aluminium-foundries-and-wire-mills/)|HTML؛ سویت صنعتی مرتبط|
|S44|[STAIN | distribution centers](https://www.stain.it/en/industries/metal/pipe-and-sheet-metal-distribution-centres/)|HTML؛ ایمیل گواهی، ترمینال RF در راهکار سفارشی نه PESA|
### ۲.۳ شکاف‌های خزش و دسترسی
- `https://www.stain.it/robots.txt`، `https://www.stain.it/sitemap.xml` و `https://www.stain.it/sitemap_index.xml`: درخواست انجام شد، اما ابزار واکشی قابل‌اتکا ارائه نداد؛ عدم دسترسی **به معنی نبودن فایل نیست**.
- فایل STAIN `metal_web1.pdf`: متن از نمایه جست‌وجو در دسترس بود ولی دانلود/بازکردن PDF timeout داشت؛ از آن استناد به صفحه/اسکرین‌شات نشده است [S08].
- فایل TRUCKFLOW با متن استخراج‌شده در ۲ صفحه باز شد ولی رندر تصویری صفحه‌های PDF مسدود شد؛ بخش UI صرفاً به تصویر وب منتشرشده نسبت داده شده است [S17,S18].
- فایل Precia «APPLICATIONS & PRODUCTS» در جست‌وجو متن داشت ولی در بازکردن مستقیم 404 شد؛ در ادعاهای حساس، منبع اصلی جایگزین شده است [S19].
- سند Avery Vehicle Image Capture به صفحه خانه redirect شد؛ جزئیات دوربین فقط از متن ایندکس‌شده است و باید با PDF اصلی بازتأیید شود [S16].
- نام **TraxEMT** در جست‌وجوی مستندات رسمی METTLER TOLEDO تأیید نشد؛ جایگزین قابل‌ردیابی DataBridge و POWERCELL بررسی شد، بدون یکی انگاشتن این نام‌ها.
- ویدیو/دموی قابل‌پخش و قابل‌تحلیل مرحله‌به‌مرحله برای PESA+ عمومی و معتبر در شواهد بررسی‌شده به دست نیامد؛ «جریان PESA+» به عنوان ویدیوی مشاهده‌شده ادعا نمی‌شود.

## ۳. ماتریس ویژگی‌های تأییدشده و هسته محصول
**توجه به قیاس:** ستون‌ها ناهمگون‌اند: PDX/iQUBE² سخت‌افزار تشخیصی، MPS سامانه حجمی و FMS سامانه اعزام است. «؟» بین این دسته‌ها بسیار طبیعی است. «د» برای قابلیت‌های یک محصول/ماژول و نه الزاماً همه زیرنسخه‌هاست.
|ویژگی|P|W|A|T|D|E|M|C|R|L|I|N|H|K|F|
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|شناسایی خودکار RFID **[هسته ≥۳]**|؟|د[S14]|د[S15]|د[S17]|؟|د[S23]|؟|؟|؟|د[S31]|؟|؟|؟|؟|؟|
|ANPR پلاک **[هسته ≥۳]**|؟|د[S14]|؟|د[S17]|؟|د[S23]|؟|؟|؟|؟|؟|؟|؟|؟|؟|
|ثبت شناسه/پلاک خودرو (روش نامشخص) **[هسته ≥۳]**|د[S01]|د[S14]|د[S15]|د[S17]|؟|د[S23]|د[S24]|؟|؟|د[S30]|؟|؟|؟|؟|؟|
|دوربین/عکس تراکنش **[هسته ≥۳]**|د[S01]|د[S16]|د[S15]|د[S17]|؟|د[S23]|د[S25]|؟|؟|د[S32]|؟|؟|؟|؟|؟|
|راهبند/چراغ/سنسور تردد **[هسته ≥۳]**|؟|؟|د[S15]|د[S17]|؟|د[S23]|د[S25]|؟|؟|؟|؟|؟|؟|؟|؟|
|بررسی مجوز/سند حمل و راننده **[هسته ≥۳]**|د[S01]|؟|؟|د[S19]|؟|د[S23]|؟|؟|؟|؟|؟|؟|؟|؟|؟|
|وزن خالص و ناخالص **[هسته ≥۳]**|د[S01]|د[S14]|؟|د[S17]|د[S20]|د[S23]|د[S25]|؟|؟|؟|؟|؟|؟|؟|؟|
|توزین یک/دوبار و تارای ذخیره **[هسته ≥۳]**|؟|د[S14]|؟|د[S17]|؟|؟|د[S25]|؟|؟|؟|؟|؟|؟|؟|؟|
|چند باسکول/چندسایتی **[هسته ≥۳]**|؟|د[S14]|؟|د[S17]|؟|د[S23]|د[S25]|؟|؟|د[S30]|؟|؟|؟|؟|؟|
|تطبیق سفارش/سند حمل با بار **[هسته ≥۳]**|د[S01]|؟|؟|د[S19]|د[S20]|د[S23]|؟|؟|؟|؟|؟|؟|؟|؟|؟|
|گزارش‌های تراکنش و فیلتر **[هسته ≥۳]**|د[S01]|د[S14]|؟|د[S17]|؟|د[S23]|د[S25]|؟|؟|د[S30]|د[S35]|د[S37]|؟|؟|د[S41]|
|ERP/حسابداری یا خروجی **[هسته ≥۳]**|؟|د[S14]|؟|د[S19]|د[S20]|د[S23]|د[S25]|؟|؟|د[S33]|؟|؟|؟|؟|؟|
|ردگیری لحظه‌ای ورود/خروج و زمان **[هسته ≥۳]**|د[S01]|؟|؟|د[S17]|د[S20]|د[S23]|؟|؟|؟|د[S30]|؟|؟|؟|؟|؟|
|پایش انحراف وزن/تقلب **[هسته ≥۳]**|د[S01]|د[S16]|؟|؟|د[S20]|د[S23]|د[S26]|؟|؟|؟|؟|؟|؟|؟|؟|
|سلامت تک‌لودسل/رانش/عدم‌تقارن **[متمایز]**|؟|؟|؟|؟|؟|؟|؟|د[S27]|د[S29]|؟|؟|؟|؟|؟|؟|
|پروفایل سه‌بعدی و حجم LiDAR **[متمایز]**|؟|؟|؟|؟|؟|؟|؟|؟|؟|د[S31]|؟|؟|؟|؟|؟|
|گزارش payload ناوگان و تولید شیفت **[هسته ≥۳]**|؟|؟|؟|؟|؟|؟|؟|؟|؟|؟|د[S35]|د[S37]|؟|د[S40]|د[S41]|
|اعزام و بهینه‌سازی گردش کامیون **[هسته ≥۳]**|؟|؟|؟|؟|؟|؟|؟|؟|؟|؟|؟|د[S37]|د[S39]|د[S40]|د[S41]|
|گزارش تأخیر/زمان چرخه/توقف **[هسته ≥۳]**|؟|؟|؟|؟|؟|؟|؟|؟|؟|؟|د[S35]|د[S37]|؟|د[S40]|د[S41]|
|API رسمی مستند شده **[هسته ≥۳]**|؟|؟|؟|؟|؟|د[S23]|د[S26]|؟|؟|د[S33]|؟|؟|؟|؟|؟|
|قابلیت‌های کنترل دسترسی کاربران **[هسته ≥۳]**|؟|؟|؟|د[S17]|؟|د[S23]|د[S25]|؟|؟|د[S30]|؟|؟|؟|؟|؟|
|عملیات بدون اپراتور **[هسته ≥۳]**|؟|د[S14]|د[S15]|د[S17]|؟|د[S23]|د[S25]|؟|؟|؟|؟|؟|؟|؟|؟|
**راهنمای ستون‌ها:** P = STAIN PESA+؛ W = Avery Weighman 8؛ A = Avery SmarTower؛ T = Precia TruckFlow؛ D = Dariel WBX؛ E = WeighMAST؛ M = MT DataBridge MS/ES؛ C = MT POWERCELL PDX؛ R = Rice Lake iQUBE²؛ L = Loadscan MPS/MyScanner؛ I = Trimble Loadrite؛ N = Wenco FMS؛ H = Hexagon MineOps؛ K = Modular DISPATCH؛ F = Cat MineStar Fleet.
### ۳.۱ قاعده طبقه‌بندی هسته
«هسته» صرفاً یعنی قابلیت در ≥۳ **محصول/راهکار مقایسه‌شده** با منبع مثبت دیده شده است، نه اینکه جزء حداقل قانونی و نه اینکه الزاماً در STAIN PESA+ وجود دارد. منابع هر خانه داخل کروشه هستند. در صورت نیاز به *صرفاً نرم‌افزار باسکول*، پایش لودسل و LiDAR به‌عنوان افزونه طبقه‌بندی می‌شوند.
### ۳.۲ ویژگی‌های متمایز در منابع
- [تأییدشده S09] STAIN: تابلوی صف چندستونه A–E برای فراخوان خودرو، در کنار رهگیری با برگه بارکد [S01].
- [تأییدشده S17] TruckFlow: نمایش هم‌زمان وسایل داخل سایت/خارج‌شده، تجهیزات هر zone، ترجیحات نمایش هر اپراتور و شبکه چندباسکولی.
- [تأییدشده S25,S26] DataBridge: نمودار وزن (weight curve) برای ضدتقلب و سطوح SS/MS/ES/AP؛ همه قابلیت‌ها در نسخه پایه وجود ندارند.
- [تأییدشده S27,S29] PDX و iQUBE²: سیگنال تشخیصی تک‌لودسل، zero drift، noise و unbalance. هرگونه حد قبولی باید با گواهی و سازنده تعیین شود.
- [تأییدشده S30,S31] Loadscan: اسکن خالی و پر، نمای سه‌بعدی هر بار، ارسال داده به ابر و REST API؛ **MPS در سایت تولیدکننده برای کاربرد Monitor Only / Not Legal for Trade معرفی شده است** [S31,S32].
- [تأییدشده S37,S40] Wenco/Modular: dispatch چند ماشین، صف سوخت، نسبت تحقق تولید و تحلیل بارگیری bucket-by-bucket.

## ۴. PRD مستقل
### ۴.۱ بیان مسئله/هدف/عدم‌هدف
**مسئله:** داده‌های ورود، هویت کامیون، وزن، حواله حمل، کیفیت ماده و رفت‌وآمد میان باسکول و معدن پراکنده و قابل‌مغایرت است. **هدف محصول:** یک زنجیره‌ی قابل‌ممیزی از مجوز تا خروج و KPI عملیاتی در سطح معدن ایجاد شود [پیشنهادی؛ الگوی مفهومی S01,S17,S25,S35].
**خارج از دامنه MVP:** تصمیم خودکار درباره تخلف قانونی بدون مسئول انسانی؛ تضمین دقت LiDAR/ANPR بدون تست؛ کاربرد volume estimate به‌جای باسکول دارای گواهی؛ کنترل غیرایمن راهبند از طریق رابط وب؛ تولید فاکتور رسمی بدون تأیید ERP.
### ۴.۲ نقش‌ها و سطوح عملیاتی
|Role|کاربر|Scope|
|---|---|---|
|`system_admin`|مدیر سامانه|پیکربندی سایت، حقوق و آداپتورها [پیشنهادی؛ الگوهای نقش S17,S25]|
|`site_manager`|مدیر سایت|نمایش همه تراکنش‌ها و مجوزهای سایت [پیشنهادی؛ الگوهای نقش S17,S25]|
|`scale_operator`|اپراتور باسکول|توزین، بررسی تصویر، توقف خروج [پیشنهادی؛ الگوهای نقش S17,S25]|
|`gate_guard`|حراست و دربان|کنترل ورود/خروج، بازرسی هویت [پیشنهادی؛ الگوهای نقش S17,S25]|
|`logistics`|کارشناس حمل|حواله، نوبت، برنامه حمل و بارنامه [پیشنهادی؛ الگوهای نقش S17,S25]|
|`sales`|فروش/بازرگانی|سفارش، مشتری، سقف مجاز و تطبیق [پیشنهادی؛ الگوهای نقش S17,S25]|
|`mine_dispatcher`|دیسپچر معدن|تخصیص مسیر و تجهیزات، رویداد چرخه [پیشنهادی؛ الگوهای نقش S17,S25]|
|`qc`|آزمایشگاه/کنترل کیفیت|نوع ماده، عیار، نمونه و نتیجه [پیشنهادی؛ الگوهای نقش S17,S25]|
|`maintenance`|تعمیرات و ابزار دقیق|وضعیت سلامت، گواهی کالیبراسیون [پیشنهادی؛ الگوهای نقش S17,S25]|
|`auditor`|ممیز|خواندن audit/اسناد و شواهد [پیشنهادی؛ الگوهای نقش S17,S25]|
|`driver_kiosk`|راننده/کیوسک|تأیید نوبت، مشاهده راهنمایی و چاپ رسید [پیشنهادی؛ الگوهای نقش S17,S25]|
|`api_service`|سرویس ERP|دسترسی محدود ماشینی با توکن [پیشنهادی؛ الگوهای نقش S17,S25]|
### ۴.۳ داستان‌های کاربر (User Stories) و معیار پذیرش
- **US-01**: اپراتور می‌خواهد خودرو را با پلاک یا RFID پیدا کند. **Acceptance:** ثبت یکی از دو شناسه؛ عدم تطبیق دو شناسه → ممانعت از عبور خودکار. [پیشنهادی]
- **US-02**: حراست می‌خواهد اعتبار راننده و مجوز حمل را پیش از ورود تأیید کند. **Acceptance:** مجوز منقضی نمایش BLOCK با شواهد و دلیل. [پیشنهادی]
- **US-03**: مسئول باسکول می‌خواهد وزن اول/دوم را بدون ورود دستی ثبت کند. **Acceptance:** در صورت unstable/device fault ثبت نهایی ممنوع؛ رویداد خام حفظ شود. [پیشنهادی]
- **US-04**: مسئول فروش می‌خواهد وزن خروجی از مانده حواله تجاوز نکند. **Acceptance:** کنترل مانده با قفل اتمیک و retry امن. [پیشنهادی]
- **US-05**: ممیز می‌خواهد یک اختلاف وزن را همراه عکس‌های اولیه ببیند. **Acceptance:** نمایش timeline، تصویر اصلی، raw frame hash و history اصلاح. [پیشنهادی]
- **US-06**: تعمیرات می‌خواهد خطای zero drift یا گواهی منقضی را ببیند. **Acceptance:** هشدار آستانه سایت‌محور؛ تشخیص لودسل فقط با سخت‌افزار مجهز. [پیشنهادی]
- **US-07**: مدیر سایت می‌خواهد KPI هر شیفت را دقیقاً با تعریفش بسنجد. **Acceptance:** فیلتر شیفت/ماده/مسیر؛ تعریف شاخص‌ها قابل مشاهده باشد. [پیشنهادی]
- **US-08**: مدیر معدن می‌خواهد اختلاف وزن و حجم و payload را مقایسه کند. **Acceptance:** با نبود data source یا چگالی معتبر، برچسب unavailable/estimated. [پیشنهادی]
- **US-09**: راننده می‌خواهد بعد از تأیید گیت، راهنمای مرحله بعدی را ببیند. **Acceptance:** کیوسک تنها اطلاعات لازم، زبان و مسیر نوبت را نمایش دهد. [پیشنهادی]
- **US-10**: مسئول IT می‌خواهد با قطع اینترنت عملیات سایت متوقف نشود. **Acceptance:** edge spool داده را با کلید تکرارناپذیر sync کند؛ تضاد به review برود. [پیشنهادی]
### ۴.۴ الزامات کارکردی (Functional Requirements)
|ID|الزام قابل‌آزمایش|اولویت|پشتوانه/منشأ|
|---|---|:---:|---|
|FR-01|مدیریت چندسایتی/چندگیت/چندباسکول با شناسه یکتا|P0|S17,S25|
|FR-02|ثبت Vehicle و Driver و Carrier و اعتبار اسناد و تاریخ انقضا|P0|S01|
|FR-03|ثبت ورود با شناسایی دستی یا RFID و ANPR اختیاری و confidence|P0|S14,S15,S17|
|FR-04|همبستگی RFID/ANPR/ثبت قبلی در یک VehicleVisit و تعیین تعارض|P0|پیشنهادی|
|FR-05|خواندن وزن از درایور نشان‌دهنده (indicator) با health/sequence/timestamp|P0|S24,S29|
|FR-06|شرط تثبیت وزن و حضور کامل خودرو پیش از ثبت رسمی توزین|P0|S15,S25|
|FR-07|ثبت وزن اول و دوم فارغ از ترتیب بارگیری/تخلیه|P0|S17,S25|
|FR-08|محاسبه gross و tare و net با ردیابی مبنای هر مقدار|P0|S01,S25|
|FR-09|حالت one-pass بر مبنای stored tare با سیاست انقضا|P1|S17,S25|
|FR-10|پیاده‌سازی رویدادهای بدون امکان حذف (event log) و نسخه‌های اصلاحی|P0|پیشنهادی|
|FR-11|ثبت عکس رویدادهای ورود، روی باسکول، توزین، خروج|P0|S01,S16,S17|
|FR-12|نمایش تصویر پلاک و کادر OCR؛ اعتبارسنجی دستی مورد مشکوک|P0|S14,S23|
|FR-13|حواله حمل/فروش و سفارش خرید با اعتبار زمانی و محدودیت ماده و طرف معامله|P0|S01,S05,S19|
|FR-14|تطبیق مجوز با وسیله/راننده/مسیر/ماده/مقدار و ظرفیت باقی‌مانده|P0|S01,S05|
|FR-15|قفل کردن gate خروج هنگام اختلال/مغایرت بحرانی با override ثبت‌شونده|P0|S01,S17|
|FR-16|چاپ رسید دارای شناسه و QR/Barcode با فیلدهای قابل‌تنظیم|P0|S01,S25|
|FR-17|مدیریت صف خودرو و تابلو فراخوان|P1|S01,S09|
|FR-18|فرمان کنترل چراغ و راهبند پس از دریافت نتیجه ایمنی از PLC|P0|S15,S17|
|FR-19|محاسبه مدت حضور در سایت، زمان هر مرحله و تعداد سفر|P0|S17|
|FR-20|فیلتر داده بر تاریخ/شیفت/ماده/پلاک/راننده/حمل‌کننده/وضعیت|P0|S01,S17|
|FR-21|گزارش تولید وزنی، تعداد سفر، مغایرت‌ها و مقایسه با هدف شیفت|P0|S01,S35,S37|
|FR-22|صدور XLSX/CSV/PDF با محدودیت دسترسی و ثبت audit|P1|S14,S23,S30|
|FR-23|پایش اتصال و خطای تجهیزات، وزن صفر و درخواست سرویس|P0|S27,S29|
|FR-24|مدیریت سوابق کالیبراسیون، گواهی‌ها و هشدار موعد|P0|پیشنهادی|
|FR-25|نمایش بررسی تک‌لودسل فقط در صورت پشتیبانی سخت‌افزار و API|P1|S27,S29|
|FR-26|کنترل کنترل‌شده override با تأیید دوم در موارد بحرانی|P0|پیشنهادی|
|FR-27|RBAC سایت‌محور و تفکیک عملیات/تعمیرات/ممیزی|P0|S17|
|FR-28|Audit trail امضاشده برای تغییرات مهم و تاریخچه شواهد|P0|S16|
|FR-29|API /v1 برای داده اصلی و webhook outbox با retry/idempotency|P1|S26,S33|
|FR-30|ارسال اعلان SMS/Email با سیاست‌های قابل‌پیکربندی|P1|S23,S29|
|FR-31|دریافت سفارش و حواله از ERP؛ صادرات نتیجه با شماره مرجع|P1|S04,S05,S33|
|FR-32|کار آفلاین با edge queue و همگام‌سازی پس از اتصال|P1|S04|
|FR-33|تجمیع چندسایتی و محدودسازی داده براساس tenancy|P1|S14,S25|
|FR-34|تطبیق repeat weighing/replay و تشخیص تعویض پلاک در همان سفر|P1|پیشنهادی|
|FR-35|امکان افزودن adapter ماژولار بدون تغییر منطق domain|P0|S26,S33|
|FR-36|داشبورد kiosk مستقل و عملیات راننده با کمترین داده ورودی|P1|S17,S28|
|FR-37|استفاده از zone/geofence برای تعریف ورودی/خروجی و نقاط مجاز|P1|پیشنهادی|
|FR-38|تشخیص مغایرت ظرفیت اسمی، مجوز، بارنامه و حد مجاز جاده‌ای|P0|S01|
|FR-39|مدیریت وضعیت سند: issued/active/reserved/consumed/expired/revoked|P0|پیشنهادی|
|FR-40|استرداد یا ابطال تراکنش فقط با سند اصلاح و ارجاع تراکنش پیشین|P0|پیشنهادی|
|FR-41|رابط چندزبانه و نمایش شمسی/میلادی با ذخیره UTC|P1|S17,S25|
|FR-42|رصد دقت ANPR/RFID با شمارنده نمونه‌های تصحیح‌شده|P1|پیشنهادی|
|FR-43|LiDAR optional: ثبت هندسه مرجع خالی برای هر TruckBody|P2|S31|
|FR-44|LiDAR optional: حجم، پروفایل 3D و flag scan-quality|P2|S31,S32|
|FR-45|LiDAR optional: تخمین جرم از حجم و چگالی مصوب با ثبت عدم‌قطعیت|P2|پیشنهادی|
|FR-46|Payload optional: ingest اطلاعات جام شاول/لودر و شناسه بار|P2|S35,S36|
|FR-47|Fleet optional: چرخه haul، کارکرد، بیکاری و اهداف شیفت|P2|S37,S40,S41|
|FR-48|Fleet optional: reconcile payload/scale/LiDAR براساس trip_id|P2|پیشنهادی|
|FR-49|ثبت آرشیو شواهد اصلی با hash و chain of custody|P1|پیشنهادی|
|FR-50|برنامه‌ریزی گزارش‌های زمان‌بندی‌شده و دریافت‌کنندگان نقش‌محور|P2|S30|
|FR-51|چرخه handling استثناها: create/assign/ack/resolve/close|P1|پیشنهادی|
|FR-52|کاربرد همزمان دو باسکول برای ورود/خروج با اتصال Visit واحد|P1|S17,S25|
|FR-53|مدیریت توزین محوری جدا از توزین کل و عدم جایگزینی قانونی آن بدون تأیید|P2|پیشنهادی|
|FR-54|ثبت منبع/مقصد/موقعیت بارگیری و تخلیه و دسته‌بندی grade|P1|S35,S40|
|FR-55|نقشه عملیاتی و نمای تناسب جریان مواد بر اساس زمان/مقصد|P2|S40|
|FR-56|سیاست زمان توقف و فراخوان راننده در صف و ثبت اعلان|P1|S01,S09|
|FR-57|قفل جلوگیری از اجرای وزن‌کشی در حالت گواهی منقضی طبق مقررات محلی|P0|پیشنهادی|
|FR-58|مدیریت دستی با دلیل، تأیید و snapshot در صورت قطع دوربین/RFID|P1|پیشنهادی|
|FR-59|بازپخش audit بر مبنای timeline رویداد، تصاویر و مجوزها|P1|S16,S25|
|FR-60|تشخیص نوسان غیرعادی وزن و بررسی کامل بودن موقعیت محورهای خودرو|P1|S16,S26|
### ۴.۵ الزامات غیرکارکردی (Non-Functional Requirements)
|ID|NFR/Acceptance|وضعیت|
|---|---|---|
|NFR-01|ایمنی: API قادر به دورزدن interlock سخت‌افزاری PLC نباشد؛ fail-safe gate|mandatory [پیشنهادی]|
|NFR-02|دقت اندازه‌گیری تابع indicator تأییدشده است؛ نرم‌افزار مترولوژی قانونی را ادعا نکند|mandatory [پیشنهادی]|
|NFR-03|رویدادها UTC و زمان محلی مجزا؛ NTP و سنجش clock drift|mandatory [پیشنهادی]|
|NFR-04|درخواست‌های تکراری با idempotency_key و unique index یک‌بار ثبت شوند|mandatory [پیشنهادی]|
|NFR-05|قطع شبکه مرکزی تراکنش‌های local را از بین نبرد؛ RPO/RTO پس از ارزیابی سایت|mandatory [پیشنهادی]|
|NFR-06|RBAC، SSO/OIDC اختیاری، MFA برای نقش‌های حساس، TLS و رمزنگاری at-rest|mandatory [پیشنهادی]|
|NFR-07|ممانعت از دستکاری رکورد با immutable events و پیوند hash|mandatory [پیشنهادی]|
|NFR-08|شاخص‌های latency/throughput/availability باید از SLA کارفرما تعیین شوند؛ نه فرض ثابت|tbd [پیشنهادی]|
|NFR-09|نگهداری داده/تصویر و مدت retention مطابق قرارداد و قانون ملی تنظیم شود|tbd [پیشنهادی]|
|NFR-10|مانیتورینگ observability شامل heartbeat، log ساختاریافته، trace و metric|mandatory [پیشنهادی]|
|NFR-11|پشتیبان‌گیری خودکار + آزمون restore و رمزنگاری کلیدها|mandatory [پیشنهادی]|
|NFR-12|پشتیبانی Desktop 1920x1080 و Tablet؛ Mobile read-only برای مدیر|recommended [پیشنهادی]|
|NFR-13|واحد وزن SI kg/t، حجم m³، چگالی kg/m³ با نمایش precision مستند|mandatory [پیشنهادی]|
|NFR-14|کنترل ورودی، محدودسازی فایل، دوربین RTSP و داده مخرب خارجی|mandatory [پیشنهادی]|
|NFR-15|حقوق مالکیت مستقل: لوگو، آیکون، تصاویر و متن‌های محصول مرجع استفاده نشود|mandatory [پیشنهادی]|
|NFR-16|تاب‌آوری دستگاه: watchdog، backpressure، dead-letter queue و replay|recommended [پیشنهادی]|
|NFR-17|قابلیت آزمایش شبیه‌ساز indicator/PLC/camera پیش از تحویل|mandatory [پیشنهادی]|
|NFR-18|زمان‌بندی shift قابل پیکربندی، عبور از نیمه‌شب و DST در نمایش|mandatory [پیشنهادی]|
|NFR-19|هیچ مدل ANPR/LiDAR درصد دقت تضمین‌شده بدون داده آزمون میدانی ندارد|mandatory [پیشنهادی]|
|NFR-20|قرارداد API با نسخه‌بندی و تست سازگاری schema|mandatory [پیشنهادی]|
### ۴.۶ فرض‌های صریح و معیار تحویل
- **فرض فنی:** حجم، وزن و زمان هرکدام source-of-truth خاص دارند: وزن از Indicator معتبر؛ اسناد از ERP/سامانه مجوز؛ تصویر از Camera؛ حجم از LiDAR؛ شاخص اعزام از FMS.
- **کیفیت داده:** از «وزن خوانده‌شده» تا «وزن تأییدشده» transition انجام می‌شود؛ مقادیر منفی، بدون مجوز یا خارج از tolerance به‌طور خام ذخیره و در صورت لزوم از نتیجه تجاری کنار گذاشته می‌شوند.
- **قبولی آزمایش:** اجرای سناریوهای normal/partial failure/duplicate/replay/credential expiry/camera offline/indicator unstable/clock skew و مقایسه با اوراکل تست؛ مقادیر SLA تابع قرارداد سایت هستند.

## ۵. جریان‌های کاری اصلی و ماشین حالت
### ۵.۱ ورود ← شناسایی ← وزن اول ← بارگیری ← وزن دوم ← تطبیق ← خروج (برای حمل خروجی)
- **۱. پیش‌اعلام:** سفارش/حواله معتبر از ERP یا ثبت مجاز داخلی؛ تعیین ماده، مقصد، ظرفیت باقیمانده. **خروجی:** Permit=ACTIVE، event PERMIT_RESERVED. [پیشنهادی؛ برگرفته از جریان‌های مرجع S01,S17,S25]
- **۲. ورود به محدوده:** سنسور گیت تحریک؛ عکس زمان‌دار و GateEvent ثبت؛ RFIDRead/PlateRead به Visit پیشنهاد می‌شوند. **خروجی:** Visit=ARRIVED؛ نبود confidence کافی → MANUAL_REVIEW. [پیشنهادی؛ برگرفته از جریان‌های مرجع S01,S17,S25]
- **۳. احراز انطباق:** پلاک، راننده، carrier، کارت، ظرفیت و اعتبار اسناد چک شود؛ هر اصلاح نیازمند audit. **خروجی:** Visit=AUTHORIZED یا HOLD. [پیشنهادی؛ برگرفته از جریان‌های مرجع S01,S17,S25]
- **۴. فراخوان و ورود باسکول:** صف/تابلو؛ PLC پس از interlock ایمنی چراغ/راهبند را تنظیم می‌کند. **خروجی:** Visit=ON_SCALE؛ دقت موقعیت verified. [پیشنهادی؛ برگرفته از جریان‌های مرجع S01,S17,S25]
- **۵. وزن اول (خالی برای حمل خروجی):** indicator frame و timestamp و sequence؛ وضعیت stable و positioned؛ عکس ثبت. **خروجی:** WeighEvent(FIRST) immutable. [پیشنهادی؛ برگرفته از جریان‌های مرجع S01,S17,S25]
- **۶. بارگیری:** بارگیری با Material/Grade/Origin و شناسه کامیون؛ درصورت وجود PayloadEvent به trip وصل شود. **خروجی:** Visit=LOADING سپس READY_FOR_SECOND_WEIGH. [پیشنهادی؛ برگرفته از جریان‌های مرجع S01,S17,S25]
- **۷. وزن دوم (پر):** بازشناسایی خودرو؛ سنجش وزن پایدار و شواهد تصاویر؛ تعیین Gross/Tare/Net. **خروجی:** WeighEvent(SECOND) immutable، transaction.net_kg >= 0. [پیشنهادی؛ برگرفته از جریان‌های مرجع S01,S17,S25]
- **۸. کنترل تجاری:** مقایسه ماده، مقصد، سقف وزن خودرو و مانده مجوز؛ رزرو مانده با transaction دیتابیس. **خروجی:** Permit consumed به اندازه net، نه بیشتر. [پیشنهادی؛ برگرفته از جریان‌های مرجع S01,S17,S25]
- **۹. صدور قبض/بارنامه:** شماره یکتا/QR، نام راننده، پلاک، وزن‌ها، ماده، ساعت، شناسه سند و هش. **خروجی:** Transaction=APPROVED. [پیشنهادی؛ برگرفته از جریان‌های مرجع S01,S17,S25]
- **۱۰. خروج:** PLC با state مجاز و موقعیت ایمن فرمان باز می‌دهد؛ دوربین خروج تصویر/زمان خروج را ثبت می‌کند. **خروجی:** Transaction=CLOSED؛ Visit=EXITED. [پیشنهادی؛ برگرفته از جریان‌های مرجع S01,S17,S25]
- **۱۱. تسویه و همگام‌سازی:** outbox event به ERP/گزارش/داشبورد ارسال؛ دریافت ack یا retry. **خروجی:** حسابداری مستقل از کنترل لحظه‌ای گیت باقی بماند. [پیشنهادی؛ برگرفته از جریان‌های مرجع S01,S17,S25]
### ۵.۲ واریانت‌ها و استثناها
- **ورود مواد به معدن/کارخانه:** کامیون هنگام ورود پر است؛ وزن اول Gross و وزن دوم پس از تخلیه Tare؛ فرمول با ترتیب ورود محاسبه نشود، بلکه با نوع عملیات `RECEIVE|DISPATCH` و وزن فیزیکی مشخص شود.
- **One-pass/Stored tare:** نخست اعتبار tare و تاریخ/منبع آن بررسی، سپس از وزن فعلی استفاده شود؛ علامت `tare_source=STORED` در سند درج شود [S17,S25].
- **دو باسکول متفاوت:** Scale IN و Scale OUT با همان Visit لینک می‌شوند؛ اختلاف calibration profile و timezone محفوظ است [S17,S25].
- **تعویض راننده/پلاک/کفی:** Visit وارد `HOLD` شود و با بررسی چندشاهدی مجدداً مجاز گردد [پیشنهادی].
- **اختلال دوربین یا شبکه:** تصمیم خروج امن طبق سیاست سایت؛ کنترل راهبند به لایه PLC واگذار شود، override باید ثبت و محدود شود [پیشنهادی].
- **توزین محور:** `WeighEvent(pass_type=AXLE)` جداگانه ثبت شود؛ تبدیل جمع محور به وزن تجاری فقط اگر مورد تأیید چارچوب مترولوژی سایت باشد [پیشنهادی].
### ۵.۳ ماشین حالت تراکنش
`DRAFT → ARRIVED → ID_VERIFIED → FIRST_WEIGHTED → LOADING_OR_UNLOADING → SECOND_WEIGHTED → COMPLIANCE_CHECKED → APPROVED → CLOSED`؛ شاخه‌ها: `HOLD`, `MANUAL_REVIEW`, `CANCELLED`, `CORRECTED`، بدون حذف تاریخچه [پیشنهادی].
### ۵.۴ قواعد محاسبه قابل‌تست
- `net_kg = gross_kg - tare_kg`، با الزام `gross_kg >= tare_kg >= 0` در بارهای معمول؛ هر استثنا به بررسی ویژه برود.
- `site_turnaround = departed_at - arrived_at`؛ `queue_duration = queue_called_at - queue_entered_at`؛ توقف/بارگیری و cycle از رویدادهای جداگانه محاسبه شوند.
- `permit_remaining = allowed_net_kg - sum(approved_or_reserved_net_kg)`؛ عملیات رزرو در تراکنش DB با lock/optimistic version انجام شود تا همزمانی oversell ایجاد نکند.
- `shift_tonnage_t = sum(approved net_kg)/1000` برحسب زمان رخداد سیاست شیفت؛ denominator و سیاست نسبت‌دادن به شیفت صریح و ثابت باشد.
- `volume_m3 = integral(loaded height - empty reference height) over valid truck-bed footprint` تنها برای هندسه/داده معتبر؛ `estimated_mass_kg = volume_m3 × bulk_density_kg_m3`، همراه provenance، رطوبت و عدم‌قطعیت؛ **این جرم جایگزین وزن رسمی باسکول نیست**.

## ۶. مدل داده و روابط
### ۶.۱ موجودیت‌ها و فیلدهای اصلی
**واژگان:** `UUID` شناسه، `decimal` مقدار عددی با دقت ثابت، `?` اختیاری، زمان‌ها ISO-8601 UTC در ذخیره‌سازی. همه فیلدها **پیشنهادی** هستند؛ به schema رقبا نسبت داده نمی‌شوند.
- **`Organization`:** `id: UUID`, `name: string`, `timezone: IANA`, `status: enum`.
- **`Site`:** `id: UUID`, `organization_id: UUID`, `name: string`, `code: string`, `timezone: IANA`, `configuration: JSON`.
- **`Gate`:** `id: UUID`, `site_id: UUID`, `direction: IN|OUT|BIDIRECTIONAL`, `plc_id: UUID?`, `zone_id: UUID?`, `status: enum`.
- **`Vehicle`:** `id: UUID`, `site_id: UUID?`, `plate_normalized: string`, `plate_country: string`, `rfid_tag_ids: UUID[]`, `vehicle_type: enum`, `nominal_payload_kg: decimal?`, `max_gvw_kg: decimal?`, `trailer_id: UUID?`, `inspection_expires_at: datetime?`, `carrier_id: UUID?`.
- **`Driver`:** `id: UUID`, `name: string`, `license_number_encrypted: string?`, `license_expires_at: date?`, `identity_ref: string?`, `carrier_id: UUID?`, `allowed_status: enum`.
- **`Carrier`:** `id: UUID`, `legal_name: string`, `registration_no: string?`, `license_expiry: date?`, `status: enum`.
- **`Customer`:** `id: UUID`, `name: string`, `type: CUSTOMER|SUPPLIER|BOTH`, `erp_code: string?`, `status: enum`.
- **`Material`:** `id: UUID`, `code: string`, `name: string`, `grade: string?`, `density_kg_m3: decimal?`, `density_source: string?`, `density_valid_from: datetime?`, `density_uncertainty: decimal?`, `unit: kg|t|m3`.
- **`Permit`:** `id: UUID`, `permit_no: string`, `permit_type: SALE|HAUL|PURCHASE|DISPATCH`, `customer_id: UUID?`, `vehicle_id: UUID?`, `carrier_id: UUID?`, `material_id: UUID?`, `origin_id: UUID?`, `destination_id: UUID?`, `allowed_net_kg: decimal?`, `consumed_net_kg: decimal`, `valid_from: datetime`, `expires_at: datetime`, `status: enum`, `issuer: string`, `document_hash: sha256?`.
- **`Transaction`:** `id: UUID`, `site_id: UUID`, `visit_id: UUID`, `permit_id: UUID?`, `vehicle_id: UUID`, `driver_id: UUID?`, `carrier_id: UUID?`, `customer_id: UUID?`, `material_id: UUID?`, `origin_id: UUID?`, `destination_id: UUID?`, `status: enum`, `gross_kg: decimal?`, `tare_kg: decimal?`, `net_kg: decimal?`, `gross_source: enum?`, `tare_source: enum?`, `shift_id: UUID?`, `in_at: datetime?`, `out_at: datetime?`, `created_at: datetime`, `closed_at: datetime?`, `version: int`, `is_override: boolean`.
- **`VehicleVisit`:** `id: UUID`, `site_id: UUID`, `vehicle_id: UUID?`, `gate_in_id: UUID?`, `gate_out_id: UUID?`, `arrived_at: datetime`, `departed_at: datetime?`, `state: enum`, `queue_entered_at: datetime?`, `queue_called_at: datetime?`, `trip_id: UUID?`.
- **`WeighEvent`:** `id: UUID`, `transaction_id: UUID`, `scale_id: UUID`, `sequence_no: int`, `pass_type: FIRST|SECOND|ONE_PASS|AXLE`, `weight_kg: decimal`, `stable: bool`, `stability_window_ms: int?`, `captured_at: datetime`, `raw_indicator_frame_hash: sha256`, `indicator_sequence: string?`, `position_ok: bool?`, `vehicle_present: bool?`, `operator_id: UUID?`, `evidence_ids: UUID[]`, `idempotency_key: string`.
- **`GateEvent`:** `id: UUID`, `visit_id: UUID`, `gate_id: UUID`, `event_type: ARRIVE|AUTHORIZED|OPEN|CLOSE|EXIT|DENIED`, `occurred_at: datetime`, `cause: string`, `actor_id: UUID?`, `plc_receipt: string?`, `snapshot_id: UUID?`.
- **`Camera`:** `id: UUID`, `site_id: UUID`, `gate_id: UUID?`, `scale_id: UUID?`, `camera_type: PLATE|OVERVIEW|OVERHEAD`, `stream_uri_secret_ref: string`, `status: enum`.
- **`PlateRead`:** `id: UUID`, `camera_id: UUID`, `visit_id: UUID?`, `plate_raw: string`, `plate_normalized: string`, `country: string?`, `confidence: decimal`, `bbox_xyxy: decimal[4]?`, `model_version: string`, `captured_at: datetime`, `image_evidence_id: UUID`, `review_status: enum`.
- **`RFIDReader`:** `id: UUID`, `gate_id: UUID?`, `frequency_band: LF|HF|UHF|OTHER|UNKNOWN`, `protocol: string?`, `status: enum`.
- **`RFIDRead`:** `id: UUID`, `reader_id: UUID`, `tag_hash: sha256`, `rssi: decimal?`, `seen_at: datetime`, `visit_id: UUID?`, `matching_vehicle_id: UUID?`, `read_quality: enum`.
- **`Scale`:** `id: UUID`, `site_id: UUID`, `indicator_id: UUID`, `capacity_kg: decimal`, `min_kg: decimal?`, `division_kg: decimal?`, `zero_tolerance_kg: decimal?`, `status: enum`, `last_calibration_id: UUID?`, `weigh_mode: STATIC|AXLE|OTHER`.
- **`CalibrationRecord`:** `id: UUID`, `scale_id: UUID`, `certificate_no: string`, `issuer: string`, `calibrated_at: datetime`, `valid_until: datetime`, `test_points: JSON`, `max_error: decimal?`, `certificate_hash: sha256`, `status: VALID|EXPIRED|REVOKED|UNKNOWN`.
- **`Equipment`:** `id: UUID`, `site_id: UUID`, `equipment_type: TRUCK|LOADER|SHOVEL|PLC|INDICATOR|LIDAR|SENSOR`, `serial_no: string`, `make_model: string?`, `adapter_id: string?`, `health_status: enum`.
- **`EquipmentHealthSample`:** `id: UUID`, `equipment_id: UUID`, `metric: string`, `value: decimal`, `unit: string`, `sampled_at: datetime`, `quality: enum`.
- **`Alert`:** `id: UUID`, `rule_id: string`, `site_id: UUID`, `visit_id: UUID?`, `transaction_id: UUID?`, `equipment_id: UUID?`, `severity: INFO|WARN|BLOCK|CRITICAL`, `status: OPEN|ACK|RESOLVED|CLOSED`, `triggered_at: datetime`, `threshold_snapshot: JSON`, `observed_snapshot: JSON`, `assigned_to: UUID?`, `ack_at: datetime?`, `resolution_note: string?`.
- **`Shift`:** `id: UUID`, `site_id: UUID`, `start_at: datetime`, `end_at: datetime`, `team: string?`, `target_tonnes: decimal?`, `timezone: IANA`.
- **`LidarScan`:** `id: UUID`, `scanner_equipment_id: UUID`, `visit_id: UUID`, `truck_body_profile_id: UUID?`, `kind: EMPTY|LOADED`, `captured_at: datetime`, `volume_m3: decimal?`, `point_cloud_uri: string`, `mesh_uri: string?`, `quality_score: decimal?`, `calibration_version: string?`, `material_id: UUID?`, `density_kg_m3: decimal?`, `estimated_mass_kg: decimal?`, `uncertainty: decimal?`.
- **`PayloadEvent`:** `id: UUID`, `trip_id: UUID`, `equipment_id: UUID`, `source: LOADER|SHOVEL|TRUCK`, `event_at: datetime`, `payload_kg: decimal?`, `bucket_count: int?`, `material_id: UUID?`, `source_event_id: string`, `quality: enum`.
- **`AuditEvent`:** `id: UUID`, `entity_type: string`, `entity_id: UUID`, `action: string`, `before_hash: sha256?`, `after_hash: sha256`, `actor_id: UUID`, `reason: string?`, `occurred_at: datetime`, `prev_audit_hash: sha256?`.
- **`Evidence`:** `id: UUID`, `source_type: CAMERA|DOCUMENT|INDICATOR|RFID|LIDAR`, `storage_uri: string`, `sha256: string`, `captured_at: datetime`, `retention_policy_id: UUID`, `metadata: JSON`.
- **`IntegrationOutbox`:** `id: UUID`, `event_type: string`, `entity_id: UUID`, `payload_json: JSON`, `destination: string`, `idempotency_key: string`, `status: PENDING|SENT|FAILED`, `attempts: int`, `next_retry_at: datetime?`.
### ۶.۲ قواعد کلید، رابطه و یکپارچگی
- `Organization 1:N Site 1:N Gate/Scale/Camera/Equipment/Shift`؛ `Vehicle 1:N VehicleVisit`؛ `VehicleVisit 1:N Transaction` برای عملیات چندمحموله با کنترل صریح.
- `Transaction 1:N WeighEvent`، `Transaction N:1 Permit` و `Visit 1:N GateEvent/PlateRead/RFIDRead/LidarScan`.
- `WeighEvent.raw_indicator_frame_hash` و `Evidence.sha256` نگهداری شود؛ تغییر مقادیر تجاری تنها با `CORRECTION` و reference به event قدیم.
- Unique: `(organization_id, site.code)`؛ `(site_id, normalized_plate, vehicle_type)` با سیاست پلاک موقت؛ `(scale_id, indicator_sequence, captured_at)` پس از عادی‌سازی؛ `idempotency_key` جهانی برای هر endpoint حساس.
- هر رکورد site_id مجزا برای RBAC داشته باشد؛ `PlateRead` چندتایی قابل تخصیص به یک Visit باشد؛ ANPR confidence **احتمال‌سنجی مدل** است نه صحت سنجش وزن.
- برای سنجش حجم، `TruckBodyReference` / empty reference باید نسخه‌بندی شود و با کامیون یا body شناسه یکتا داشته باشد، نه صرفاً پلاک.

## ۷. مشخصات UI/UX و تصاویر قابل‌استناد
### ۷.۱ تحلیل تصاویر و محل کاربرد
|Ref|تصویر/صفحه|مؤلفه‌های مشاهده‌شده و داده|اطمینان|
|---|---|---|---|
|IMG-01|STAIN: تابلوی فراخوان خودرو [S09]|تابلوی فیزیکی با ستون‌های A–E، سطر تعداد منتظر، ردیف فراخوان بعدی، سطر وضعیت به رنگ سبز/قرمز؛ نمونه عدد ۱/۱/۰/۰/۰. رنگ هدر آبی و زمینه سلول خاکستری.|مشاهده مستقیم تصویر؛ تأییدشده برای تابلو، نه UI اپلیکیشن|
|IMG-02|STAIN: عکس باسکول [S10]|کامیون روی مسیر باسکول با سازه و غرفه کناری؛ برای جانمایی کنترل تصویری و سنسور مفید است؛ رابط نرم‌افزاری قابل استخراج نیست.|مشاهده مستقیم، تأییدشده|
|IMG-03|Precia TruckFlow: صفحه home [S18]|نوار بالای تیره با ماژول‌های Pesage/Fichiers/Rapports/Configuration/Admin؛ ردیف دکمه‌های بزرگ کنش؛ جدول «vehicles on site» و «recently exited».|تصویر منتشرشده قدیمی؛ تأییدشده فقط همان نسخه تصویری|
|IMG-04|Precia TruckFlow: weighing form [S42]|فرم افقی تاریک/خاکستری با کنترل Incoming/Outgoing، فیلد Truck, Company, Haulier, Site, Product؛ پنل وزن در راست؛ UI احتمالاً نسخه خاص.|استنباطی/ثانویه؛ اصالت و نسخه مستقل روشن نیست|
|IMG-05|MT DataBridge: transaction desktop [S25]|PDF ص ۳ (فیزیکی): نمایش بزرگ Desktop، نوار وضعیت چندباسکول، quick-actions سمت چپ، summary وزن/ماده/مشتری میانه، ردیف دکمه‌های پرکاربرد پایین؛ رنگ آبی/فیروزه‌ای و ابزارهای وضعیت.|مشاهده screenshot PDF، تأییدشده|
|IMG-06|MT DataBridge: capability matrix [S25]|PDF ص ۴: جدول جداسازی نسخه‌های SS/MS/ES، قابلیت تردد، دوربین اختیاری، ذخیره تارا و multi-site؛ UI سیستم نیست.|مشاهده PDF، تأییدشده|
|IMG-07|Loadscan MyScanner: cloud dashboard [S30,S34]|حوزه‌های summary scans، خطا/هشدار، روند پنج‌روزه counts/volume، فیلتر status/date و 3D load profiler. چیدمان جزئی/رنگ بدون تصویر پیکسل-قابل‌تحلیل در این بررسی تعیین نمی‌شود.|متن تأییدشده؛ پیکسل/نسبت ستون نامشخص|
|IMG-08|Endel WeighMAST: صفحه بازاریابی [S23]|مارکتینگ‌پیج کارت عددی Today’s Volume و badges برای auto weighing و analytics دارد؛ نباید به‌عنوان اسکرین‌شات dashboard محصول تلقی شود.|متن تأییدشده؛ نمونه بازاریابی|
### ۷.۲ Design system مستقل (پیشنهادی؛ نه کپی UI)
- **دسترس‌پذیری:** راست‌به‌چپ فارسی، دکمه‌های بزرگ باسکول، foreground با contrast مطابق WCAG 2.2 AA؛ واحد وزن همواره کنار مقدار؛ جلوگیری از اشتباه صفرها.
- **چیدمان Desktop:** ناوبری کناری سمت راست ۲۴۰px پیشنهادی، نوار وضعیت فوقانی، محتوای مرکز با کارت/جدول، کشوی «جزئیات تراکنش» سمت چپ. اندازه‌ها صرفاً نقطه آغاز طراحی هستند.
- **پالت نمونه مستقل:** background `#F6F8FB`، سطح `#FFFFFF`، متن `#17243B`، accent `#1273A6`، success `#168568`، warning `#A86A12`، danger `#C53B43`؛ رنگ تنها کانال انتقال وضعیت نباشد.
- **فونت:** فارسی متن‌خوان مجاز پروژه؛ اعداد وزن با tabular numerals، تأکید روی `kg` و حداقل خطای قرائت انسانی. نام/رنگ/لوگوی STAIN یا سایر برندها کپی نمی‌شوند.
- **نمای 1920×1080 اپراتور:** ۳ منطقه پایدار: (۱) Weight & Scale status و دکمه ثبت، (۲) اطلاعات هویت/مجوز، (۳) تصاویر و فید رویداد. پیشنهاد مستقل مبتنی بر شناخت جریان، نه ادعای UI PESA.
### ۷.۳ فهرست صفحات پیشنهادی با اجزا و داده‌ها
- **UI-01 / Overview/KPI:** کارت وزن خالص امروز، تعداد کامیون، تعداد سفر، زمان ماندگاری، مجوزهای منتظر؛ نمودار ورودی/خروجی ساعتی و جدول هشدار. [پیشنهادی]
- **UI-02 / Live Gate Control:** فید دروازه، پلاک/نمره OCR، RFID، مجوز، چراغ/راهبند READONLY + کنش تأیید مجاز. [پیشنهادی]
- **UI-03 / Weighing Console:** وزن زنده indicator، واحد/پایداری، scale status، فرم خودرو/نوع بار/حواله، دو تصویر، دکمه Capture/Reject. [پیشنهادی]
- **UI-04 / Queue & Call Board:** صف ورود، ETA نامشخص تا داده واقعی، گروه‌های صف، دکمه فراخوان، نمای تابلو بزرگ. [پیشنهادی]
- **UI-05 / Transactions:** جدول فیلترشونده، وزن اول/دوم، خالص، وضعیت، لینک عکس و چاپ قبض. [پیشنهادی]
- **UI-06 / Transaction Detail:** timeline کامل، raw weight receipt، تصاویر، تعارض OCR/RFID، مجوز، log امضا. [پیشنهادی]
- **UI-07 / Vehicles:** رجیستری پلاک، کلاس، ظرفیت، معاینه، RFID، تریلر و تاریخچه سفر. [پیشنهادی]
- **UI-08 / Drivers & Carriers:** هویت/مدارک/اعتبارنامه/شرکت و تاریخچه ورود، دسترسی ماسک‌شده. [پیشنهادی]
- **UI-09 / Permits & Orders:** حواله، بارنامه، وضعیت، مانده وزن، سقف مجاز، مشتری، اعتبار. [پیشنهادی]
- **UI-10 / Materials & Routes:** کد ماده/عیار، مبدأ، مقصد، وضعیت کیفیت/چگالی پیشنهادی. [پیشنهادی]
- **UI-11 / Production Shift:** مقدار تولید، تعداد سفر، جدول شیفت/ماده/ماشین، روند برنامه و عملکرد. [پیشنهادی]
- **UI-12 / Fleet Operations:** نقشه موقعیت (در صورت داده GPS)، زمان چرخه، صف، توقف، بهره‌برداری. [پیشنهادی]
- **UI-13 / Scale Health:** نمودار صفر، ارتباط indicator، per-cell فقط در صورت data، آخرین گواهی کالیبراسیون. [پیشنهادی]
- **UI-14 / Calibration Records:** فهرست گواهی‌ها، تاریخ صدور/اعتبار، فایل اصلی و هشدار موعد. [پیشنهادی]
- **UI-15 / Alerts Center:** Severity/status، علت، داده مشاهده‌شده/حد، مسئول، ack و resolution. [پیشنهادی]
- **UI-16 / Evidence Gallery:** عکس پلاک، نمای بدنه، بار از بالا، نوع camera و تاریخ و sha256. [پیشنهادی]
- **UI-17 / LiDAR 3D Add-on:** مدل مرجع خالی، نقشه حرارتی پروفایل، حجم، کیفیت scan و بازپخش. [پیشنهادی]
- **UI-18 / Onboard Payload Add-on:** جمع بار هر شاول/لودر و مقایسه با باسکول، اختلاف منبع. [پیشنهادی]
- **UI-19 / Reports/Exports:** فیلترهای تاریخ/شیفت/راننده/ماده/مجوز/Scale، خروجی مجاز و گزارش زمان‌بندی. [پیشنهادی]
- **UI-20 / Integrations & Devices:** adapter، device heartbeat، ارتباط ERP، queue و retry و mapping. [پیشنهادی]
- **UI-21 / Users/RBAC/Audit:** کاربران، نقش/سایت، login history، override log و export log. [پیشنهادی]
- **UI-22 / Site Configuration:** سایت، گیت، scale، shift، thresholds، سیاست آفلاین و نسخه سیاست. [پیشنهادی]
- **UI-23 / Driver Kiosk:** نمایش راهنمای ساده پلاک/نوبت/باسکول/نتیجه/رسید بدون داده شخصی غیرضروری. [پیشنهادی]
- **UI-24 / Manager Mobile:** فقط شاخص و اعلان و drill-down در نقش مجاز؛ بدون کنترل خطرناک در موبایل. [پیشنهادی]
### ۷.۴ KPI و تعریف عملیاتی
|شاخص|تعریف/صورت و مخرج|منبع|
|---|---|---|
|Production tonnes|Σ net_kg تراکنش APPROVED در شیفت / 1000|WeighEvent + Transaction [پیشنهادی؛ الگو S35,S37]|
|Trips|COUNT DISTINCT trip_id یا Visit بسته‌شده مرتبط با حمل|GateEvent/Trip [پیشنهادی؛ الگو S35]|
|Turnaround|خروج - ورود (میانه و p90 جدا از میانگین)|GateEvent [پیشنهادی؛ الگو S17]|
|Queue time|فراخوان - ورود به صف|Queue [پیشنهادی]|
|Cycle time|از آغاز یک چرخه بارگیری تا آغاز چرخه بعد، بر حسب تعریف سایت|Payload/FMS [پیشنهادی؛ الگو S35,S41]|
|Truck utilization|زمان کار مولد / زمان آماده‌به‌کار برنامه‌ریزی‌شده؛ وقفه تفکیک شود|FMS [پیشنهادی؛ الگو S37]|
|Idle ratio|زمان بیکاری ثبت‌شده / زمان دارای داده معتبر|FMS [پیشنهادی]|
|Fuel intensity|لیتر سوخت / تن حمل‌شده (فقط با تله‌متری سوخت معتبر)|FMS/ERP [پیشنهادی]|
|Overload rate|شمار تراکنش‌های اضافه‌بار / کل تراکنش‌های قابل‌ارزیابی|Scale + capacity [پیشنهادی]|
|Compliance pass rate|مجوزهای بدون flag بحرانی / کل موارد بررسی‌شده|Permit/Alert [پیشنهادی]|
|Scale availability|زمان indicator+scale operational / زمان برنامه‌ریزی‌شده|Health [پیشنهادی]|
|LiDAR discrepancy|net_kg - volume_m3 × accepted density (با uncertainty)|Scale/Lidar [پیشنهادی]|

## ۸. معماری، یکپارچه‌سازی و پروتکل‌ها
### ۸.۱ معماری منطقی پیشنهادی
```text
[RFID] [ANPR/RTSP] [Loop/Position Sensors] [Scale Indicator] [LiDAR] [Onboard Payload]
   |        |               |                   |               |            |
   +--------+---------------+----[EDGE DEVICE ADAPTERS + PLC SAFETY CONTROL]----------+
                                     | events (idempotent, signed)
                               [Local Queue / Offline Store]
                                     | secure sync
                       [API Gateway / Auth / RBAC / Tenant]
                                     |
                +--------------------+-----------------------+
                |                    |                       |
          [Vehicle/Visit]      [Weigh/Permit]          [Alerts/Audit]
                |                    |                       |
                +--------------[Event Bus / Outbox]----------+
                                     |
                   [Operational DB] [Evidence Object Storage]
                                     |
                 [Web UI] [BI/Reports] [ERP Adapter] [Fleet/LiDAR Plug-ins]
```
**ایمنی:** PLC باید interlock و تجهیزات خطرناک را مستقل از UI تحت کنترل داشته باشد؛ Server صرفاً درخواست مجاز صادر کند و وضعیت قطعی اجرا را از PLC دریافت کند [پیشنهادی].
### ۸.۲ ماتریس ادغام با دستگاه‌ها و سامانه‌ها
|طرف اتصال|الگوی اتصال پیشنهادی|داده‌ها|منشأ فنی و اعتبار|
|---|---|---|---|
|Scale Indicator|RS232/RS485 یا TCP/IP با driver مخصوص مدل؛ parse/read-only در حالت پیش‌فرض|weight, stable, zero, status, sequence|وجود رابط‌های سریال/شبکه در نمونه‌ها S17,S23,S29؛ پروتکل **دستگاه مقصد نامشخص**|
|PLC/Gate/Traffic Light|Digital IO یا Modbus TCP/RTU، OPC UA در صورت پشتیبانی|interlock, beam status, gate command ack, emergency|Modbus/OPC UA فقط **گزینه پیشنهادی**؛ STAIN سویت Siemens/Profinet S04|
|RFID Reader|EPC Gen2/ISO 18000-63 برای UHF فقط پس از تأیید مدل، یا SDK سازنده|tag, reader, RSSI, timestamp|UHF در SmarTower S15؛ فرکانس دقیق/برد STAIN نامشخص|
|ANPR Camera|RTSP/ONVIF برای ویدئو + REST/SDK برای OCR|plate, confidence, image, bbox|ANPR در Weighman/WeighMAST S14,S23؛ پروتکل‌های نام‌برده پیشنهادی|
|CCTV|RTSP + ONVIF برای کشف/کنترل در صورت پشتیبانی|stream, snapshot|دوربین مستند S01,S16؛ ONVIF برای خود STAIN تأیید نشده|
|LoRa/GPS/FMS|MQTT یا REST + device data contract|trip, location, payload, engine hours|MQTT پیشنهادی؛ FMS مستند S35,S40,S41|
|LiDAR|Vendor SDK/REST/files + calibration ref|point cloud, 3D mesh, empty/loaded, volume|اصل تکنیک S31,S32؛ API MyScanner S33|
|ERP/SAP/Accounting|REST JSON / batch CSV/XML؛ outbox + ack|order, permit, approved weights, invoicing status|ERP سویت STAIN S04,S05؛ گزارش و API DataBridge S26/Loadscan S33|
|SMS/Email|Notification worker & provider adaptor|alerts, approvals, signed receipt link|WeighMAST S23؛ مسیر PESA+ نامشخص|
|Central BI|Read replica/warehouse + export|shift KPIs, trends, audit views|مرجع Wenco/Trimble S35,S37|
### ۸.۳ پیشنهاد Deployment
- **Site-Local:** mini-PC/industrial IPC با درایورها، local DB و queue + سرور اپراتور؛ در قطع اینترنت، وزن و interlock در محل ادامه می‌یابد [پیشنهادی].
- **Central Cloud/On-Prem Hybrid:** PostgreSQL عملیاتی، Object Storage برای عکس/point cloud، Message Broker، API، BI و observability؛ مشخصات سخت‌افزار/تعداد هسته/RAM به بار واقعی وابسته و عمداً جعل نشده است [پیشنهادی].
- **Multisite:** هر Site کلید و policy جدا؛ data isolation و aggregation در data mart؛ outbox دقیقاً یک‌بار در اثر تجاری (exactly-once effect) با deduplication، نه ادعای تحویل پیام دقیقا یک‌بار [پیشنهادی].
- **قرارداد سخت‌افزاری:** پیش از مناقصه خواندن دستی indicator model/firmware/baud/modbus register map، تایید PLC IO، دوربین و شبکه، UPS، دما/گردوغبار، حفاظت صاعقه و ارت الزامی است.
### ۸.۴ API مینیمال پیشنهادی
```http
POST /v1/gate-events
POST /v1/identification-events
POST /v1/weigh-events
POST /v1/transactions/{id}/approve
POST /v1/transactions/{id}/override
GET  /v1/transactions?site_id=&from=&to=&status=
GET  /v1/permits/{id}/balance
GET  /v1/scales/{id}/health
GET  /v1/alerts?severity=&status=
POST /v1/integrations/erp/orders/import
POST /v1/plugins/lidar/scans
POST /v1/plugins/payload/events
GET  /v1/reports/shift?site_id=&shift_id=
```
به درخواست‌های تغییردهنده header `Idempotency-Key`، role scope، immutable audit event و correlation-id افزوده شود [پیشنهادی].

## ۹. منطق هشدارها و شرط اقدام
**آستانه‌ها عمداً عددسازی نشده‌اند.** تمام thresholdها در `SitePolicy` با واحد، مرجع کالیبراسیون، تاریخ اجرا، امضاکننده و سطح دسترسی تعریف می‌شوند. `CRITICAL` هشدار سلامت است و بسته به تایید ابزار دقیق به BLOCK عملیاتی تبدیل می‌شود.
|ID|Condition / آستانه پویا|Severity|اقدام|اولویت|منشأ|
|---|---|---|---|---|---|
|AL-01 مجوز منقضی/باطل|`permit.status in (EXPIRED,REVOKED) or now>permit.expires_at`|BLOCK|قفل خروج/ورود بسته به سیاست، ارجاع حراست|P0|پیشنهادی|
|AL-02 مغایرت ماده|`transaction.material_id != permit.material_id`|BLOCK|متوقف‌کردن خروج و ثبت exception|P0|S05|
|AL-03 تجاوز از سقف وزن مجوز|`net_kg > permit.remaining_net_kg + configured_tolerance_kg`|BLOCK|توقف و تأیید مسئول فروش|P0|S05|
|AL-04 اضافه‌بار مجاز خودرو|`gross_kg > vehicle.max_gvw_kg`|BLOCK|توقف؛ ارزیابی حد مجاز/مقررات|P0|S01|
|AL-05 راننده/پلاک نامنطبق|`identified_vehicle != permit.vehicle_id OR driver not authorized`|BLOCK|درخواست بازرسی و تطبیق دستی|P0|S01|
|AL-06 ناهمخوانی RFID و ANPR|`rfid_vehicle_id != anpr_vehicle_id AND both reliable`|BLOCK|بازبینی عکس/کارت، عدم عبور خودکار|P0|پیشنهادی|
|AL-07 وزن ناپایدار|`stable==false OR variation_over_window>scale.stability_limit`|BLOCK|عدم ثبت WeighEvent نهایی|P0|S26|
|AL-08 موقعیت نامناسب روی باسکول|`position_ok==false OR axle_presence_incomplete`|BLOCK|راهنمای راننده، نگهداری فرمان راهبند|P0|S15,S16|
|AL-09 بازگشت صفر خارج از رواداری|`abs(zero_reading)>scale.zero_tolerance_kg`|WARN/BLOCK|توقف توزین بر اساس سیاست و درخواست تعمیرات|P0|S29|
|AL-10 عدم‌تقارن/رانش لودسل|`diagnostic_metric>manufacturer_site_limit`|CRITICAL|اعلام تعمیرات؛ نمایش فقط با سنسور سازگار|P1|S27,S29|
|AL-11 انقضای گواهی کالیبراسیون|`now>calibration.valid_until`|BLOCK|غیرفعال کردن ثبت تجاری طبق تنظیم مقررات|P0|پیشنهادی|
|AL-12 کالیبراسیون نزدیک انقضا|`valid_until - now < configured_lead_days`|WARN|ایجاد کار نگهداری و اعلان|P0|پیشنهادی|
|AL-13 عبور تکراری یا replay|`same visit+scale+pass/idempotency duplicated OR replay signal`|BLOCK|رد ثبت دوم، اطلاع ممیز|P0|پیشنهادی|
|AL-14 توقف طولانی در صف|`now - queue_entered_at > queue_wait_threshold`|WARN|اخطار سرپرست حمل و اولویت‌بندی صف|P1|پیشنهادی|
|AL-15 ماندگاری بیش از حد در سایت|`now-arrived_at > site_turnaround_threshold`|WARN|بازبینی موقعیت کامیون|P1|S17|
|AL-16 اختلال خواندن دستگاه|`device_heartbeat_missing > configured_timeout`|BLOCK|رفتار fail-safe، صف آفلاین و تیکت|P0|S04|
|AL-17 اسکن LiDAR بی‌کیفیت|`scan.quality_score < configured_min_quality`|WARN|درخواست اسکن مجدد، عدم صدور حجم قطعی|P2|S31|
|AL-18 مغایرت وزن/حجم|`abs(net_kg - estimated_mass_kg) > tolerance_model(material,uncertainty)`|WARN|بررسی چگالی/رطوبت و خطای بارگیری|P2|پیشنهادی|
|AL-19 اضافه‌بار/کم‌بار نسبت به هدف|`payload_kg outside configured_target_band`|WARN|اصلاح بارگیری؛ اطلاع دیسپچر|P2|S37|
|AL-20 افزایش حجم بار بدون تغییر وزن مطابق الگوی ریسک|`change(volume)/change(weight) unusual`|WARN|بازبینی اپراتور؛ فقط هشدار تحلیلی|P2|پیشنهادی|
### ۹.۱ سیاست‌های تکمیلی
- هشدارها باید Debounce/Hysteresis قابل تنظیم، suppression window معتبر، assignment، ack SLA و علت رفع داشته باشند؛ هشدارهای BLOCK تا بررسی و رفع واقعی خودکار محو نشوند [پیشنهادی].
- جایگاه وزن و خطای لودسل با داده خودِ indicator/diagnostic module ارزیابی شود؛ از روی یک وزن ناخالص تنها، انحراف تک‌لودسل یا خروج از کالیبراسیون **اثبات نمی‌شود** [S27,S29].
- اعتبار «گواهی کالیبراسیون» با وضعیت سخت‌افزاری یکسان نیست: ممکن است گواهی معتبر باشد ولی خطای واقعی رخ دهد، یا داده سلامت خوب باشد ولی گواهی منقضی شده باشد [تحلیل فنی؛ S27,S29].

## ۱۰. ماژول‌های افزودنی (Plug-in Contracts)
### ۱۰.۱ LiDAR Volume Plug-in [پیشنهادی؛ ایده‌های مرجع S30–S33]
**Input:** `visit_id`, `truck_body_reference_id`, `scan_kind`, `point_cloud_uri`, `scan_time`, `calibration_version`, `quality_metadata`. **Output:** `volume_m3`, `mesh_uri`, `fill_heatmap_uri`, `quality_score`, `empty_reference_used`, `estimate_uncertainty`, `estimated_mass_kg` اگر density معتبر باشد. **UI:** 3D overlay و دو اسکن کنار هم؛ warning for partial bed occlusion. **Limit:** رعایت NTEP/OIML/مراجع محلی؛ MPS حجمی نباید وزن رسمی تلقی شود.
### ۱۰.۲ Onboard Payload Plug-in [پیشنهادی؛ مرجع S35,S36]
**Input:** `equipment_id`, `trip_id`, `bucket_event_id`, `payload_kg`, `material`, `timestamp`, `source_quality`. **Output:** `sum_payload_kg`, `bucket_count`, `difference_to_scale_kg`؛ قابلیت reconciliation با مرور اختلاف دستی. داده وزن لودر جایگزین باسکول حقوقی نیست مگر گواهی خاص وجود داشته باشد.
### ۱۰.۳ Fleet/KPI Plug-in [پیشنهادی؛ مرجع S37,S39–S41]
**Input:** eventهای truck assignment/start loading/end loading/loaded haul/dump/return/fueling/idle، `equipment_id`, `GPS`, `fuel_litre` اگر قابل‌اعتماد. **Output:** زمان چرخه، idle/queue، تولید به تفکیک شاول و راننده و شیفت، بهره‌برداری، ton/hour، fuel/ton و تغییر برنامه/عملکرد؛ نمایش provenance و پوشش تله‌متری.
### ۱۰.۴ SDK توسعه و استقلال ماژول‌ها
```json
{"plugin_id":"lidar-volume","api_version":"1.0","permissions":["event:read","lidar:write"],"consumes":["visit.created","vehicle.identified"],"emits":["lidar.scan.completed","lidar.scan.flagged"],"health_endpoint":"/health","idempotency_required":true}
```
Plug-in حق تغییر مستقیم وزن رسمی، گشودن راهبند یا ویرایش Audit Event را ندارد؛ فقط رویداد امضاشده ارسال می‌کند [پیشنهادی].

## ۱۱. شکاف‌ها، ریسک‌ها و سؤال‌های باز
- **GAP-01 / STAIN API:** endpoint، schema، RBAC و API واقعی PESA+ عمومی در صفحه مرجع ارائه نشده است [S01].
- **GAP-02 / STAIN شناخت پلاک:** «ثبت پلاک» در صفحه به معنی ANPR اثبات‌شده نیست؛ نوع تجهیزات/مدل OCR نامشخص است [S01].
- **GAP-03 / STAIN RFID:** هیچ باند فرکانس/برد/نوع تگ اختصاصی PESA+ از شواهد اولیه تأیید نمی‌شود [S01].
- **GAP-04 / STAIN UI:** در صفحه PESA+ عکس تابلوی فیزیکی و باسکول دیده شد، نه تصویر واقعی تمام صفحات اپلیکیشن [S09,S10].
- **GAP-05 / STAIN Calibration:** MTZ در همان سویت وجود دارد؛ اما به معنای پایش drift و تقارن تک‌لودسل در PESA+ نیست [S03,S12].
- **GAP-06 / STAIN ERP:** اتصال کلی MES و دیگر ماژول‌ها با ERP اثبات شده؛ نقشه API اختصاصی PESA+ مشخص نیست [S04,S05].
- **GAP-07 / رقبا:** ویدیوهای محصول، داشبوردهای دارای داده واقعی، permission matrix دقیق و اتصال آفلاین تمام محصولات به اندازه کافی در دسترس نبود.
- **GAP-08 / روش‌های قانونی:** قوانین وزن‌کشی تجاری، دقت باسکول، ذخیره اسناد و وضعیت مهر/پلمب در حوزه قضایی پروژه باید اخذ شود؛ معادل‌سازی مقررات کشورهای دیگر ممنوع.
- **GAP-09 / سخت‌افزار:** مدل indicator/loadcell، خروجی سیگنال، PLC، دوربین، حسگر حضور و نوع RF برای معدن مقصد مشخص نشده است.
- **GAP-10 / ANPR AI:** بدون نمونه شب/گردوغبار، پلاک معدن، فاصله و زاویه و نرخ خطا، ادعای دقت ممنوع.
- **GAP-11 / LiDAR:** موقعیت نصب، ارتفاع، نوع کامیون/باکس، رطوبت، چگالی و occlusion باید اندازه‌گیری میدانی شوند.
- **GAP-12 / FMS:** تعریف «سفر» در باسکول خروجی با haul cycle داخل پیت یکسان نیست؛ قرارداد correlation-ID و مبدأ داده لازم است.
- **GAP-13 / گزارش:** تناژ گزارش تولید باسکول لزوماً برابر با استخراج معدن نیست؛ برداشت داخلی و خروج تجاری تفکیک شوند.
- **GAP-14 / ریسک Privacy:** دوره نگهداری تصویر رانندگان و پلاک‌ها و دسترسی برون‌سازمانی باید مطابق قوانین و قرارداد تنظیم شود.
- **GAP-15 / sitemap:** robots/sitemap موفق واکشی نشد؛ لینک‌های منابع فهرست‌شده، «تمام صفحات موجود دامنه STAIN» نیست.
### ۱۱.۱ پرسش‌های تصمیم‌ساز برای فاز طراحی اجرایی
1. باسکول چند سکوی ورودی/خروجی دارد و مدل indicator/لودسل/شکل ارتباط هرکدام چیست؟
2. روال حمل: فروش خروجی، ورود مواد اولیه، حمل داخل معدن یا همه آن‌ها؟ مبنای حقوقی توزین چیست؟
3. ERP/حواله/بارنامه توسط چه سامانه‌ای صادر و تأیید می‌شود و شناسه یکتا کدام است؟
4. شیفت‌ها، KPI رسمی و تفاوت تناژ عملیاتی/فروش چگونه تعریف شده‌اند؟
5. معماری شبکه سایت، UPS و امکان کار در قطع اینترنت چندساعته چیست؟
6. برای LiDAR و onboard payload، کدام کلاس ماشین و استاندارد دقت/گواهی مدنظر است؟
### ۱۱.۲ اولویت پیاده‌سازی و مرز نسخه‌ها
- **Phase 0:** بازدید و inventory سنسور/اسناد، آزمایش driver، ثبت KPI و معیار قبول؛ خروجی Hardware Compatibility & Data Governance.
- **Phase 1 (P0):** Vehicle/Driver/Carrier/Permit، Visit، WeighEvent، تراکنش، Gate، dashboard، audit/alert حیاتی، رسید و تست end-to-end.
- **Phase 2 (P1):** stored tare/دو باسکول، ERP، multi-site، گزارش، offline queue، سلامت و نمونه‌های ANPR/RFID، تشخیص دوباره‌کاری.
- **Phase 3 (P2):** LiDAR/3D، Payload، FMS، prediction و تحلیل عدم‌قطعیت، اتصال تله‌متری و گزارش زمان‌بندی.

## ۱۲. JSON قابل مصرف مستقیم توسط ابزار کدنویسی
**توضیح:** JSON زیر داده ساختاریافته **برای محصول پیشنهادی** است؛ هیچ فیلد/Rule آن به‌عنوان schema واقعی STAIN/رقبا معرفی نمی‌شود. `reference_sources` فقط منشأ الگوبرداری هر الزام را نگه می‌دارد. `null` یا `tbd` به معنای نیاز به تعریف در فاز مهندسی است.
```json
{
  "document": {
    "title": "Smart Mining Weighbridge PRD",
    "version": "1.0",
    "language": "fa",
    "created_at": "2026-10-25",
    "primary_reference": "STAIN PESA+",
    "nature": "independent proposed product",
    "claims_policy": "separate confirmed_vendor_features from proposed_requirements"
  },
  "product": {
    "key": "SMART_WEIGH",
    "display_name": "سامانه یکپارچه توزین و تردد معدن",
    "deployment_modes": [
      "edge-on-prem",
      "hybrid",
      "multisite"
    ],
    "tenancy": "organization/site-scoped",
    "default_locale": "fa-IR",
    "units": {
      "mass": "kg",
      "volume": "m3",
      "density": "kg/m3"
    }
  },
  "roles": [
    {
      "code": "system_admin",
      "label_fa": "مدیر سامانه",
      "summary": "پیکربندی سایت، حقوق و آداپتورها"
    },
    {
      "code": "site_manager",
      "label_fa": "مدیر سایت",
      "summary": "نمایش همه تراکنش‌ها و مجوزهای سایت"
    },
    {
      "code": "scale_operator",
      "label_fa": "اپراتور باسکول",
      "summary": "توزین، بررسی تصویر، توقف خروج"
    },
    {
      "code": "gate_guard",
      "label_fa": "حراست و دربان",
      "summary": "کنترل ورود/خروج، بازرسی هویت"
    },
    {
      "code": "logistics",
      "label_fa": "کارشناس حمل",
      "summary": "حواله، نوبت، برنامه حمل و بارنامه"
    },
    {
      "code": "sales",
      "label_fa": "فروش/بازرگانی",
      "summary": "سفارش، مشتری، سقف مجاز و تطبیق"
    },
    {
      "code": "mine_dispatcher",
      "label_fa": "دیسپچر معدن",
      "summary": "تخصیص مسیر و تجهیزات، رویداد چرخه"
    },
    {
      "code": "qc",
      "label_fa": "آزمایشگاه/کنترل کیفیت",
      "summary": "نوع ماده، عیار، نمونه و نتیجه"
    },
    {
      "code": "maintenance",
      "label_fa": "تعمیرات و ابزار دقیق",
      "summary": "وضعیت سلامت، گواهی کالیبراسیون"
    },
    {
      "code": "auditor",
      "label_fa": "ممیز",
      "summary": "خواندن audit/اسناد و شواهد"
    },
    {
      "code": "driver_kiosk",
      "label_fa": "راننده/کیوسک",
      "summary": "تأیید نوبت، مشاهده راهنمایی و چاپ رسید"
    },
    {
      "code": "api_service",
      "label_fa": "سرویس ERP",
      "summary": "دسترسی محدود ماشینی با توکن"
    }
  ],
  "requirements": {
    "functional": [
      {
        "id": "FR-01",
        "text_fa": "مدیریت چندسایتی/چندگیت/چندباسکول با شناسه یکتا",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S17",
          "S25"
        ]
      },
      {
        "id": "FR-02",
        "text_fa": "ثبت Vehicle و Driver و Carrier و اعتبار اسناد و تاریخ انقضا",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S01"
        ]
      },
      {
        "id": "FR-03",
        "text_fa": "ثبت ورود با شناسایی دستی یا RFID و ANPR اختیاری و confidence",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S14",
          "S15",
          "S17"
        ]
      },
      {
        "id": "FR-04",
        "text_fa": "همبستگی RFID/ANPR/ثبت قبلی در یک VehicleVisit و تعیین تعارض",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": []
      },
      {
        "id": "FR-05",
        "text_fa": "خواندن وزن از درایور نشان‌دهنده (indicator) با health/sequence/timestamp",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S24",
          "S29"
        ]
      },
      {
        "id": "FR-06",
        "text_fa": "شرط تثبیت وزن و حضور کامل خودرو پیش از ثبت رسمی توزین",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S15",
          "S25"
        ]
      },
      {
        "id": "FR-07",
        "text_fa": "ثبت وزن اول و دوم فارغ از ترتیب بارگیری/تخلیه",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S17",
          "S25"
        ]
      },
      {
        "id": "FR-08",
        "text_fa": "محاسبه gross و tare و net با ردیابی مبنای هر مقدار",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S01",
          "S25"
        ]
      },
      {
        "id": "FR-09",
        "text_fa": "حالت one-pass بر مبنای stored tare با سیاست انقضا",
        "priority": "P1",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S17",
          "S25"
        ]
      },
      {
        "id": "FR-10",
        "text_fa": "پیاده‌سازی رویدادهای بدون امکان حذف (event log) و نسخه‌های اصلاحی",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": []
      },
      {
        "id": "FR-11",
        "text_fa": "ثبت عکس رویدادهای ورود، روی باسکول، توزین، خروج",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S01",
          "S16",
          "S17"
        ]
      },
      {
        "id": "FR-12",
        "text_fa": "نمایش تصویر پلاک و کادر OCR؛ اعتبارسنجی دستی مورد مشکوک",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S14",
          "S23"
        ]
      },
      {
        "id": "FR-13",
        "text_fa": "حواله حمل/فروش و سفارش خرید با اعتبار زمانی و محدودیت ماده و طرف معامله",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S01",
          "S05",
          "S19"
        ]
      },
      {
        "id": "FR-14",
        "text_fa": "تطبیق مجوز با وسیله/راننده/مسیر/ماده/مقدار و ظرفیت باقی‌مانده",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S01",
          "S05"
        ]
      },
      {
        "id": "FR-15",
        "text_fa": "قفل کردن gate خروج هنگام اختلال/مغایرت بحرانی با override ثبت‌شونده",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S01",
          "S17"
        ]
      },
      {
        "id": "FR-16",
        "text_fa": "چاپ رسید دارای شناسه و QR/Barcode با فیلدهای قابل‌تنظیم",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S01",
          "S25"
        ]
      },
      {
        "id": "FR-17",
        "text_fa": "مدیریت صف خودرو و تابلو فراخوان",
        "priority": "P1",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S01",
          "S09"
        ]
      },
      {
        "id": "FR-18",
        "text_fa": "فرمان کنترل چراغ و راهبند پس از دریافت نتیجه ایمنی از PLC",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S15",
          "S17"
        ]
      },
      {
        "id": "FR-19",
        "text_fa": "محاسبه مدت حضور در سایت، زمان هر مرحله و تعداد سفر",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S17"
        ]
      },
      {
        "id": "FR-20",
        "text_fa": "فیلتر داده بر تاریخ/شیفت/ماده/پلاک/راننده/حمل‌کننده/وضعیت",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S01",
          "S17"
        ]
      },
      {
        "id": "FR-21",
        "text_fa": "گزارش تولید وزنی، تعداد سفر، مغایرت‌ها و مقایسه با هدف شیفت",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S01",
          "S35",
          "S37"
        ]
      },
      {
        "id": "FR-22",
        "text_fa": "صدور XLSX/CSV/PDF با محدودیت دسترسی و ثبت audit",
        "priority": "P1",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S14",
          "S23",
          "S30"
        ]
      },
      {
        "id": "FR-23",
        "text_fa": "پایش اتصال و خطای تجهیزات، وزن صفر و درخواست سرویس",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S27",
          "S29"
        ]
      },
      {
        "id": "FR-24",
        "text_fa": "مدیریت سوابق کالیبراسیون، گواهی‌ها و هشدار موعد",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": []
      },
      {
        "id": "FR-25",
        "text_fa": "نمایش بررسی تک‌لودسل فقط در صورت پشتیبانی سخت‌افزار و API",
        "priority": "P1",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S27",
          "S29"
        ]
      },
      {
        "id": "FR-26",
        "text_fa": "کنترل کنترل‌شده override با تأیید دوم در موارد بحرانی",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": []
      },
      {
        "id": "FR-27",
        "text_fa": "RBAC سایت‌محور و تفکیک عملیات/تعمیرات/ممیزی",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S17"
        ]
      },
      {
        "id": "FR-28",
        "text_fa": "Audit trail امضاشده برای تغییرات مهم و تاریخچه شواهد",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S16"
        ]
      },
      {
        "id": "FR-29",
        "text_fa": "API /v1 برای داده اصلی و webhook outbox با retry/idempotency",
        "priority": "P1",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S26",
          "S33"
        ]
      },
      {
        "id": "FR-30",
        "text_fa": "ارسال اعلان SMS/Email با سیاست‌های قابل‌پیکربندی",
        "priority": "P1",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S23",
          "S29"
        ]
      },
      {
        "id": "FR-31",
        "text_fa": "دریافت سفارش و حواله از ERP؛ صادرات نتیجه با شماره مرجع",
        "priority": "P1",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S04",
          "S05",
          "S33"
        ]
      },
      {
        "id": "FR-32",
        "text_fa": "کار آفلاین با edge queue و همگام‌سازی پس از اتصال",
        "priority": "P1",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S04"
        ]
      },
      {
        "id": "FR-33",
        "text_fa": "تجمیع چندسایتی و محدودسازی داده براساس tenancy",
        "priority": "P1",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S14",
          "S25"
        ]
      },
      {
        "id": "FR-34",
        "text_fa": "تطبیق repeat weighing/replay و تشخیص تعویض پلاک در همان سفر",
        "priority": "P1",
        "confidence": "پیشنهادی",
        "reference_sources": []
      },
      {
        "id": "FR-35",
        "text_fa": "امکان افزودن adapter ماژولار بدون تغییر منطق domain",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S26",
          "S33"
        ]
      },
      {
        "id": "FR-36",
        "text_fa": "داشبورد kiosk مستقل و عملیات راننده با کمترین داده ورودی",
        "priority": "P1",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S17",
          "S28"
        ]
      },
      {
        "id": "FR-37",
        "text_fa": "استفاده از zone/geofence برای تعریف ورودی/خروجی و نقاط مجاز",
        "priority": "P1",
        "confidence": "پیشنهادی",
        "reference_sources": []
      },
      {
        "id": "FR-38",
        "text_fa": "تشخیص مغایرت ظرفیت اسمی، مجوز، بارنامه و حد مجاز جاده‌ای",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S01"
        ]
      },
      {
        "id": "FR-39",
        "text_fa": "مدیریت وضعیت سند: issued/active/reserved/consumed/expired/revoked",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": []
      },
      {
        "id": "FR-40",
        "text_fa": "استرداد یا ابطال تراکنش فقط با سند اصلاح و ارجاع تراکنش پیشین",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": []
      },
      {
        "id": "FR-41",
        "text_fa": "رابط چندزبانه و نمایش شمسی/میلادی با ذخیره UTC",
        "priority": "P1",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S17",
          "S25"
        ]
      },
      {
        "id": "FR-42",
        "text_fa": "رصد دقت ANPR/RFID با شمارنده نمونه‌های تصحیح‌شده",
        "priority": "P1",
        "confidence": "پیشنهادی",
        "reference_sources": []
      },
      {
        "id": "FR-43",
        "text_fa": "LiDAR optional: ثبت هندسه مرجع خالی برای هر TruckBody",
        "priority": "P2",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S31"
        ]
      },
      {
        "id": "FR-44",
        "text_fa": "LiDAR optional: حجم، پروفایل 3D و flag scan-quality",
        "priority": "P2",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S31",
          "S32"
        ]
      },
      {
        "id": "FR-45",
        "text_fa": "LiDAR optional: تخمین جرم از حجم و چگالی مصوب با ثبت عدم‌قطعیت",
        "priority": "P2",
        "confidence": "پیشنهادی",
        "reference_sources": []
      },
      {
        "id": "FR-46",
        "text_fa": "Payload optional: ingest اطلاعات جام شاول/لودر و شناسه بار",
        "priority": "P2",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S35",
          "S36"
        ]
      },
      {
        "id": "FR-47",
        "text_fa": "Fleet optional: چرخه haul، کارکرد، بیکاری و اهداف شیفت",
        "priority": "P2",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S37",
          "S40",
          "S41"
        ]
      },
      {
        "id": "FR-48",
        "text_fa": "Fleet optional: reconcile payload/scale/LiDAR براساس trip_id",
        "priority": "P2",
        "confidence": "پیشنهادی",
        "reference_sources": []
      },
      {
        "id": "FR-49",
        "text_fa": "ثبت آرشیو شواهد اصلی با hash و chain of custody",
        "priority": "P1",
        "confidence": "پیشنهادی",
        "reference_sources": []
      },
      {
        "id": "FR-50",
        "text_fa": "برنامه‌ریزی گزارش‌های زمان‌بندی‌شده و دریافت‌کنندگان نقش‌محور",
        "priority": "P2",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S30"
        ]
      },
      {
        "id": "FR-51",
        "text_fa": "چرخه handling استثناها: create/assign/ack/resolve/close",
        "priority": "P1",
        "confidence": "پیشنهادی",
        "reference_sources": []
      },
      {
        "id": "FR-52",
        "text_fa": "کاربرد همزمان دو باسکول برای ورود/خروج با اتصال Visit واحد",
        "priority": "P1",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S17",
          "S25"
        ]
      },
      {
        "id": "FR-53",
        "text_fa": "مدیریت توزین محوری جدا از توزین کل و عدم جایگزینی قانونی آن بدون تأیید",
        "priority": "P2",
        "confidence": "پیشنهادی",
        "reference_sources": []
      },
      {
        "id": "FR-54",
        "text_fa": "ثبت منبع/مقصد/موقعیت بارگیری و تخلیه و دسته‌بندی grade",
        "priority": "P1",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S35",
          "S40"
        ]
      },
      {
        "id": "FR-55",
        "text_fa": "نقشه عملیاتی و نمای تناسب جریان مواد بر اساس زمان/مقصد",
        "priority": "P2",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S40"
        ]
      },
      {
        "id": "FR-56",
        "text_fa": "سیاست زمان توقف و فراخوان راننده در صف و ثبت اعلان",
        "priority": "P1",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S01",
          "S09"
        ]
      },
      {
        "id": "FR-57",
        "text_fa": "قفل جلوگیری از اجرای وزن‌کشی در حالت گواهی منقضی طبق مقررات محلی",
        "priority": "P0",
        "confidence": "پیشنهادی",
        "reference_sources": []
      },
      {
        "id": "FR-58",
        "text_fa": "مدیریت دستی با دلیل، تأیید و snapshot در صورت قطع دوربین/RFID",
        "priority": "P1",
        "confidence": "پیشنهادی",
        "reference_sources": []
      },
      {
        "id": "FR-59",
        "text_fa": "بازپخش audit بر مبنای timeline رویداد، تصاویر و مجوزها",
        "priority": "P1",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S16",
          "S25"
        ]
      },
      {
        "id": "FR-60",
        "text_fa": "تشخیص نوسان غیرعادی وزن و بررسی کامل بودن موقعیت محورهای خودرو",
        "priority": "P1",
        "confidence": "پیشنهادی",
        "reference_sources": [
          "S16",
          "S26"
        ]
      }
    ],
    "nonfunctional": [
      {
        "id": "NFR-01",
        "text_fa": "ایمنی: API قادر به دورزدن interlock سخت‌افزاری PLC نباشد؛ fail-safe gate",
        "status": "mandatory",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-02",
        "text_fa": "دقت اندازه‌گیری تابع indicator تأییدشده است؛ نرم‌افزار مترولوژی قانونی را ادعا نکند",
        "status": "mandatory",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-03",
        "text_fa": "رویدادها UTC و زمان محلی مجزا؛ NTP و سنجش clock drift",
        "status": "mandatory",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-04",
        "text_fa": "درخواست‌های تکراری با idempotency_key و unique index یک‌بار ثبت شوند",
        "status": "mandatory",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-05",
        "text_fa": "قطع شبکه مرکزی تراکنش‌های local را از بین نبرد؛ RPO/RTO پس از ارزیابی سایت",
        "status": "mandatory",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-06",
        "text_fa": "RBAC، SSO/OIDC اختیاری، MFA برای نقش‌های حساس، TLS و رمزنگاری at-rest",
        "status": "mandatory",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-07",
        "text_fa": "ممانعت از دستکاری رکورد با immutable events و پیوند hash",
        "status": "mandatory",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-08",
        "text_fa": "شاخص‌های latency/throughput/availability باید از SLA کارفرما تعیین شوند؛ نه فرض ثابت",
        "status": "tbd",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-09",
        "text_fa": "نگهداری داده/تصویر و مدت retention مطابق قرارداد و قانون ملی تنظیم شود",
        "status": "tbd",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-10",
        "text_fa": "مانیتورینگ observability شامل heartbeat، log ساختاریافته، trace و metric",
        "status": "mandatory",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-11",
        "text_fa": "پشتیبان‌گیری خودکار + آزمون restore و رمزنگاری کلیدها",
        "status": "mandatory",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-12",
        "text_fa": "پشتیبانی Desktop 1920x1080 و Tablet؛ Mobile read-only برای مدیر",
        "status": "recommended",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-13",
        "text_fa": "واحد وزن SI kg/t، حجم m³، چگالی kg/m³ با نمایش precision مستند",
        "status": "mandatory",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-14",
        "text_fa": "کنترل ورودی، محدودسازی فایل، دوربین RTSP و داده مخرب خارجی",
        "status": "mandatory",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-15",
        "text_fa": "حقوق مالکیت مستقل: لوگو، آیکون، تصاویر و متن‌های محصول مرجع استفاده نشود",
        "status": "mandatory",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-16",
        "text_fa": "تاب‌آوری دستگاه: watchdog، backpressure، dead-letter queue و replay",
        "status": "recommended",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-17",
        "text_fa": "قابلیت آزمایش شبیه‌ساز indicator/PLC/camera پیش از تحویل",
        "status": "mandatory",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-18",
        "text_fa": "زمان‌بندی shift قابل پیکربندی، عبور از نیمه‌شب و DST در نمایش",
        "status": "mandatory",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-19",
        "text_fa": "هیچ مدل ANPR/LiDAR درصد دقت تضمین‌شده بدون داده آزمون میدانی ندارد",
        "status": "mandatory",
        "confidence": "پیشنهادی"
      },
      {
        "id": "NFR-20",
        "text_fa": "قرارداد API با نسخه‌بندی و تست سازگاری schema",
        "status": "mandatory",
        "confidence": "پیشنهادی"
      }
    ]
  },
  "data_model": {
    "entity_definitions": [
      {
        "name": "Organization",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "timezone",
            "type": "IANA"
          },
          {
            "name": "status",
            "type": "enum"
          }
        ]
      },
      {
        "name": "Site",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "organization_id",
            "type": "UUID"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "code",
            "type": "string"
          },
          {
            "name": "timezone",
            "type": "IANA"
          },
          {
            "name": "configuration",
            "type": "JSON"
          }
        ]
      },
      {
        "name": "Gate",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "site_id",
            "type": "UUID"
          },
          {
            "name": "direction",
            "type": "IN|OUT|BIDIRECTIONAL"
          },
          {
            "name": "plc_id",
            "type": "UUID?"
          },
          {
            "name": "zone_id",
            "type": "UUID?"
          },
          {
            "name": "status",
            "type": "enum"
          }
        ]
      },
      {
        "name": "Vehicle",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "site_id",
            "type": "UUID?"
          },
          {
            "name": "plate_normalized",
            "type": "string"
          },
          {
            "name": "plate_country",
            "type": "string"
          },
          {
            "name": "rfid_tag_ids",
            "type": "UUID[]"
          },
          {
            "name": "vehicle_type",
            "type": "enum"
          },
          {
            "name": "nominal_payload_kg",
            "type": "decimal?"
          },
          {
            "name": "max_gvw_kg",
            "type": "decimal?"
          },
          {
            "name": "trailer_id",
            "type": "UUID?"
          },
          {
            "name": "inspection_expires_at",
            "type": "datetime?"
          },
          {
            "name": "carrier_id",
            "type": "UUID?"
          }
        ]
      },
      {
        "name": "Driver",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "license_number_encrypted",
            "type": "string?"
          },
          {
            "name": "license_expires_at",
            "type": "date?"
          },
          {
            "name": "identity_ref",
            "type": "string?"
          },
          {
            "name": "carrier_id",
            "type": "UUID?"
          },
          {
            "name": "allowed_status",
            "type": "enum"
          }
        ]
      },
      {
        "name": "Carrier",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "legal_name",
            "type": "string"
          },
          {
            "name": "registration_no",
            "type": "string?"
          },
          {
            "name": "license_expiry",
            "type": "date?"
          },
          {
            "name": "status",
            "type": "enum"
          }
        ]
      },
      {
        "name": "Customer",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "type",
            "type": "CUSTOMER|SUPPLIER|BOTH"
          },
          {
            "name": "erp_code",
            "type": "string?"
          },
          {
            "name": "status",
            "type": "enum"
          }
        ]
      },
      {
        "name": "Material",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "code",
            "type": "string"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "grade",
            "type": "string?"
          },
          {
            "name": "density_kg_m3",
            "type": "decimal?"
          },
          {
            "name": "density_source",
            "type": "string?"
          },
          {
            "name": "density_valid_from",
            "type": "datetime?"
          },
          {
            "name": "density_uncertainty",
            "type": "decimal?"
          },
          {
            "name": "unit",
            "type": "kg|t|m3"
          }
        ]
      },
      {
        "name": "Permit",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "permit_no",
            "type": "string"
          },
          {
            "name": "permit_type",
            "type": "SALE|HAUL|PURCHASE|DISPATCH"
          },
          {
            "name": "customer_id",
            "type": "UUID?"
          },
          {
            "name": "vehicle_id",
            "type": "UUID?"
          },
          {
            "name": "carrier_id",
            "type": "UUID?"
          },
          {
            "name": "material_id",
            "type": "UUID?"
          },
          {
            "name": "origin_id",
            "type": "UUID?"
          },
          {
            "name": "destination_id",
            "type": "UUID?"
          },
          {
            "name": "allowed_net_kg",
            "type": "decimal?"
          },
          {
            "name": "consumed_net_kg",
            "type": "decimal"
          },
          {
            "name": "valid_from",
            "type": "datetime"
          },
          {
            "name": "expires_at",
            "type": "datetime"
          },
          {
            "name": "status",
            "type": "enum"
          },
          {
            "name": "issuer",
            "type": "string"
          },
          {
            "name": "document_hash",
            "type": "sha256?"
          }
        ]
      },
      {
        "name": "Transaction",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "site_id",
            "type": "UUID"
          },
          {
            "name": "visit_id",
            "type": "UUID"
          },
          {
            "name": "permit_id",
            "type": "UUID?"
          },
          {
            "name": "vehicle_id",
            "type": "UUID"
          },
          {
            "name": "driver_id",
            "type": "UUID?"
          },
          {
            "name": "carrier_id",
            "type": "UUID?"
          },
          {
            "name": "customer_id",
            "type": "UUID?"
          },
          {
            "name": "material_id",
            "type": "UUID?"
          },
          {
            "name": "origin_id",
            "type": "UUID?"
          },
          {
            "name": "destination_id",
            "type": "UUID?"
          },
          {
            "name": "status",
            "type": "enum"
          },
          {
            "name": "gross_kg",
            "type": "decimal?"
          },
          {
            "name": "tare_kg",
            "type": "decimal?"
          },
          {
            "name": "net_kg",
            "type": "decimal?"
          },
          {
            "name": "gross_source",
            "type": "enum?"
          },
          {
            "name": "tare_source",
            "type": "enum?"
          },
          {
            "name": "shift_id",
            "type": "UUID?"
          },
          {
            "name": "in_at",
            "type": "datetime?"
          },
          {
            "name": "out_at",
            "type": "datetime?"
          },
          {
            "name": "created_at",
            "type": "datetime"
          },
          {
            "name": "closed_at",
            "type": "datetime?"
          },
          {
            "name": "version",
            "type": "int"
          },
          {
            "name": "is_override",
            "type": "boolean"
          }
        ]
      },
      {
        "name": "VehicleVisit",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "site_id",
            "type": "UUID"
          },
          {
            "name": "vehicle_id",
            "type": "UUID?"
          },
          {
            "name": "gate_in_id",
            "type": "UUID?"
          },
          {
            "name": "gate_out_id",
            "type": "UUID?"
          },
          {
            "name": "arrived_at",
            "type": "datetime"
          },
          {
            "name": "departed_at",
            "type": "datetime?"
          },
          {
            "name": "state",
            "type": "enum"
          },
          {
            "name": "queue_entered_at",
            "type": "datetime?"
          },
          {
            "name": "queue_called_at",
            "type": "datetime?"
          },
          {
            "name": "trip_id",
            "type": "UUID?"
          }
        ]
      },
      {
        "name": "WeighEvent",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "transaction_id",
            "type": "UUID"
          },
          {
            "name": "scale_id",
            "type": "UUID"
          },
          {
            "name": "sequence_no",
            "type": "int"
          },
          {
            "name": "pass_type",
            "type": "FIRST|SECOND|ONE_PASS|AXLE"
          },
          {
            "name": "weight_kg",
            "type": "decimal"
          },
          {
            "name": "stable",
            "type": "bool"
          },
          {
            "name": "stability_window_ms",
            "type": "int?"
          },
          {
            "name": "captured_at",
            "type": "datetime"
          },
          {
            "name": "raw_indicator_frame_hash",
            "type": "sha256"
          },
          {
            "name": "indicator_sequence",
            "type": "string?"
          },
          {
            "name": "position_ok",
            "type": "bool?"
          },
          {
            "name": "vehicle_present",
            "type": "bool?"
          },
          {
            "name": "operator_id",
            "type": "UUID?"
          },
          {
            "name": "evidence_ids",
            "type": "UUID[]"
          },
          {
            "name": "idempotency_key",
            "type": "string"
          }
        ]
      },
      {
        "name": "GateEvent",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "visit_id",
            "type": "UUID"
          },
          {
            "name": "gate_id",
            "type": "UUID"
          },
          {
            "name": "event_type",
            "type": "ARRIVE|AUTHORIZED|OPEN|CLOSE|EXIT|DENIED"
          },
          {
            "name": "occurred_at",
            "type": "datetime"
          },
          {
            "name": "cause",
            "type": "string"
          },
          {
            "name": "actor_id",
            "type": "UUID?"
          },
          {
            "name": "plc_receipt",
            "type": "string?"
          },
          {
            "name": "snapshot_id",
            "type": "UUID?"
          }
        ]
      },
      {
        "name": "Camera",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "site_id",
            "type": "UUID"
          },
          {
            "name": "gate_id",
            "type": "UUID?"
          },
          {
            "name": "scale_id",
            "type": "UUID?"
          },
          {
            "name": "camera_type",
            "type": "PLATE|OVERVIEW|OVERHEAD"
          },
          {
            "name": "stream_uri_secret_ref",
            "type": "string"
          },
          {
            "name": "status",
            "type": "enum"
          }
        ]
      },
      {
        "name": "PlateRead",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "camera_id",
            "type": "UUID"
          },
          {
            "name": "visit_id",
            "type": "UUID?"
          },
          {
            "name": "plate_raw",
            "type": "string"
          },
          {
            "name": "plate_normalized",
            "type": "string"
          },
          {
            "name": "country",
            "type": "string?"
          },
          {
            "name": "confidence",
            "type": "decimal"
          },
          {
            "name": "bbox_xyxy",
            "type": "decimal[4]?"
          },
          {
            "name": "model_version",
            "type": "string"
          },
          {
            "name": "captured_at",
            "type": "datetime"
          },
          {
            "name": "image_evidence_id",
            "type": "UUID"
          },
          {
            "name": "review_status",
            "type": "enum"
          }
        ]
      },
      {
        "name": "RFIDReader",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "gate_id",
            "type": "UUID?"
          },
          {
            "name": "frequency_band",
            "type": "LF|HF|UHF|OTHER|UNKNOWN"
          },
          {
            "name": "protocol",
            "type": "string?"
          },
          {
            "name": "status",
            "type": "enum"
          }
        ]
      },
      {
        "name": "RFIDRead",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "reader_id",
            "type": "UUID"
          },
          {
            "name": "tag_hash",
            "type": "sha256"
          },
          {
            "name": "rssi",
            "type": "decimal?"
          },
          {
            "name": "seen_at",
            "type": "datetime"
          },
          {
            "name": "visit_id",
            "type": "UUID?"
          },
          {
            "name": "matching_vehicle_id",
            "type": "UUID?"
          },
          {
            "name": "read_quality",
            "type": "enum"
          }
        ]
      },
      {
        "name": "Scale",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "site_id",
            "type": "UUID"
          },
          {
            "name": "indicator_id",
            "type": "UUID"
          },
          {
            "name": "capacity_kg",
            "type": "decimal"
          },
          {
            "name": "min_kg",
            "type": "decimal?"
          },
          {
            "name": "division_kg",
            "type": "decimal?"
          },
          {
            "name": "zero_tolerance_kg",
            "type": "decimal?"
          },
          {
            "name": "status",
            "type": "enum"
          },
          {
            "name": "last_calibration_id",
            "type": "UUID?"
          },
          {
            "name": "weigh_mode",
            "type": "STATIC|AXLE|OTHER"
          }
        ]
      },
      {
        "name": "CalibrationRecord",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "scale_id",
            "type": "UUID"
          },
          {
            "name": "certificate_no",
            "type": "string"
          },
          {
            "name": "issuer",
            "type": "string"
          },
          {
            "name": "calibrated_at",
            "type": "datetime"
          },
          {
            "name": "valid_until",
            "type": "datetime"
          },
          {
            "name": "test_points",
            "type": "JSON"
          },
          {
            "name": "max_error",
            "type": "decimal?"
          },
          {
            "name": "certificate_hash",
            "type": "sha256"
          },
          {
            "name": "status",
            "type": "VALID|EXPIRED|REVOKED|UNKNOWN"
          }
        ]
      },
      {
        "name": "Equipment",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "site_id",
            "type": "UUID"
          },
          {
            "name": "equipment_type",
            "type": "TRUCK|LOADER|SHOVEL|PLC|INDICATOR|LIDAR|SENSOR"
          },
          {
            "name": "serial_no",
            "type": "string"
          },
          {
            "name": "make_model",
            "type": "string?"
          },
          {
            "name": "adapter_id",
            "type": "string?"
          },
          {
            "name": "health_status",
            "type": "enum"
          }
        ]
      },
      {
        "name": "EquipmentHealthSample",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "equipment_id",
            "type": "UUID"
          },
          {
            "name": "metric",
            "type": "string"
          },
          {
            "name": "value",
            "type": "decimal"
          },
          {
            "name": "unit",
            "type": "string"
          },
          {
            "name": "sampled_at",
            "type": "datetime"
          },
          {
            "name": "quality",
            "type": "enum"
          }
        ]
      },
      {
        "name": "Alert",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "rule_id",
            "type": "string"
          },
          {
            "name": "site_id",
            "type": "UUID"
          },
          {
            "name": "visit_id",
            "type": "UUID?"
          },
          {
            "name": "transaction_id",
            "type": "UUID?"
          },
          {
            "name": "equipment_id",
            "type": "UUID?"
          },
          {
            "name": "severity",
            "type": "INFO|WARN|BLOCK|CRITICAL"
          },
          {
            "name": "status",
            "type": "OPEN|ACK|RESOLVED|CLOSED"
          },
          {
            "name": "triggered_at",
            "type": "datetime"
          },
          {
            "name": "threshold_snapshot",
            "type": "JSON"
          },
          {
            "name": "observed_snapshot",
            "type": "JSON"
          },
          {
            "name": "assigned_to",
            "type": "UUID?"
          },
          {
            "name": "ack_at",
            "type": "datetime?"
          },
          {
            "name": "resolution_note",
            "type": "string?"
          }
        ]
      },
      {
        "name": "Shift",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "site_id",
            "type": "UUID"
          },
          {
            "name": "start_at",
            "type": "datetime"
          },
          {
            "name": "end_at",
            "type": "datetime"
          },
          {
            "name": "team",
            "type": "string?"
          },
          {
            "name": "target_tonnes",
            "type": "decimal?"
          },
          {
            "name": "timezone",
            "type": "IANA"
          }
        ]
      },
      {
        "name": "LidarScan",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "scanner_equipment_id",
            "type": "UUID"
          },
          {
            "name": "visit_id",
            "type": "UUID"
          },
          {
            "name": "truck_body_profile_id",
            "type": "UUID?"
          },
          {
            "name": "kind",
            "type": "EMPTY|LOADED"
          },
          {
            "name": "captured_at",
            "type": "datetime"
          },
          {
            "name": "volume_m3",
            "type": "decimal?"
          },
          {
            "name": "point_cloud_uri",
            "type": "string"
          },
          {
            "name": "mesh_uri",
            "type": "string?"
          },
          {
            "name": "quality_score",
            "type": "decimal?"
          },
          {
            "name": "calibration_version",
            "type": "string?"
          },
          {
            "name": "material_id",
            "type": "UUID?"
          },
          {
            "name": "density_kg_m3",
            "type": "decimal?"
          },
          {
            "name": "estimated_mass_kg",
            "type": "decimal?"
          },
          {
            "name": "uncertainty",
            "type": "decimal?"
          }
        ]
      },
      {
        "name": "PayloadEvent",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "trip_id",
            "type": "UUID"
          },
          {
            "name": "equipment_id",
            "type": "UUID"
          },
          {
            "name": "source",
            "type": "LOADER|SHOVEL|TRUCK"
          },
          {
            "name": "event_at",
            "type": "datetime"
          },
          {
            "name": "payload_kg",
            "type": "decimal?"
          },
          {
            "name": "bucket_count",
            "type": "int?"
          },
          {
            "name": "material_id",
            "type": "UUID?"
          },
          {
            "name": "source_event_id",
            "type": "string"
          },
          {
            "name": "quality",
            "type": "enum"
          }
        ]
      },
      {
        "name": "AuditEvent",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "entity_type",
            "type": "string"
          },
          {
            "name": "entity_id",
            "type": "UUID"
          },
          {
            "name": "action",
            "type": "string"
          },
          {
            "name": "before_hash",
            "type": "sha256?"
          },
          {
            "name": "after_hash",
            "type": "sha256"
          },
          {
            "name": "actor_id",
            "type": "UUID"
          },
          {
            "name": "reason",
            "type": "string?"
          },
          {
            "name": "occurred_at",
            "type": "datetime"
          },
          {
            "name": "prev_audit_hash",
            "type": "sha256?"
          }
        ]
      },
      {
        "name": "Evidence",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "source_type",
            "type": "CAMERA|DOCUMENT|INDICATOR|RFID|LIDAR"
          },
          {
            "name": "storage_uri",
            "type": "string"
          },
          {
            "name": "sha256",
            "type": "string"
          },
          {
            "name": "captured_at",
            "type": "datetime"
          },
          {
            "name": "retention_policy_id",
            "type": "UUID"
          },
          {
            "name": "metadata",
            "type": "JSON"
          }
        ]
      },
      {
        "name": "IntegrationOutbox",
        "fields": [
          {
            "name": "id",
            "type": "UUID"
          },
          {
            "name": "event_type",
            "type": "string"
          },
          {
            "name": "entity_id",
            "type": "UUID"
          },
          {
            "name": "payload_json",
            "type": "JSON"
          },
          {
            "name": "destination",
            "type": "string"
          },
          {
            "name": "idempotency_key",
            "type": "string"
          },
          {
            "name": "status",
            "type": "PENDING|SENT|FAILED"
          },
          {
            "name": "attempts",
            "type": "int"
          },
          {
            "name": "next_retry_at",
            "type": "datetime?"
          }
        ]
      }
    ],
    "primary_key": "UUID",
    "timestamps": "ISO-8601 UTC",
    "mass_storage": "decimal kg",
    "audit_immutable": true
  },
  "alerts": [
    {
      "id": "AL-01",
      "name_fa": "مجوز منقضی/باطل",
      "condition_expression": "permit.status in (EXPIRED,REVOKED) or now>permit.expires_at",
      "threshold_type": "site_configured_or_document_defined",
      "severity": "BLOCK",
      "action_fa": "قفل خروج/ورود بسته به سیاست، ارجاع حراست",
      "priority": "P0",
      "confidence": "پیشنهادی",
      "reference_sources": []
    },
    {
      "id": "AL-02",
      "name_fa": "مغایرت ماده",
      "condition_expression": "transaction.material_id != permit.material_id",
      "threshold_type": "site_configured_or_document_defined",
      "severity": "BLOCK",
      "action_fa": "متوقف‌کردن خروج و ثبت exception",
      "priority": "P0",
      "confidence": "پیشنهادی",
      "reference_sources": [
        "S05"
      ]
    },
    {
      "id": "AL-03",
      "name_fa": "تجاوز از سقف وزن مجوز",
      "condition_expression": "net_kg > permit.remaining_net_kg + configured_tolerance_kg",
      "threshold_type": "site_configured_or_document_defined",
      "severity": "BLOCK",
      "action_fa": "توقف و تأیید مسئول فروش",
      "priority": "P0",
      "confidence": "پیشنهادی",
      "reference_sources": [
        "S05"
      ]
    },
    {
      "id": "AL-04",
      "name_fa": "اضافه‌بار مجاز خودرو",
      "condition_expression": "gross_kg > vehicle.max_gvw_kg",
      "threshold_type": "site_configured_or_document_defined",
      "severity": "BLOCK",
      "action_fa": "توقف؛ ارزیابی حد مجاز/مقررات",
      "priority": "P0",
      "confidence": "پیشنهادی",
      "reference_sources": [
        "S01"
      ]
    },
    {
      "id": "AL-05",
      "name_fa": "راننده/پلاک نامنطبق",
      "condition_expression": "identified_vehicle != permit.vehicle_id OR driver not authorized",
      "threshold_type": "site_configured_or_document_defined",
      "severity": "BLOCK",
      "action_fa": "درخواست بازرسی و تطبیق دستی",
      "priority": "P0",
      "confidence": "پیشنهادی",
      "reference_sources": [
        "S01"
      ]
    },
    {
      "id": "AL-06",
      "name_fa": "ناهمخوانی RFID و ANPR",
      "condition_expression": "rfid_vehicle_id != anpr_vehicle_id AND both reliable",
      "threshold_type": "site_configured_or_document_defined",
      "severity": "BLOCK",
      "action_fa": "بازبینی عکس/کارت، عدم عبور خودکار",
      "priority": "P0",
      "confidence": "پیشنهادی",
      "reference_sources": []
    },
    {
      "id": "AL-07",
      "name_fa": "وزن ناپایدار",
      "condition_expression": "stable==false OR variation_over_window>scale.stability_limit",
      "threshold_type": "site_configured_or_document_defined",
      "severity": "BLOCK",
      "action_fa": "عدم ثبت WeighEvent نهایی",
      "priority": "P0",
      "confidence": "پیشنهادی",
      "reference_sources": [
        "S26"
      ]
    },
    {
      "id": "AL-08",
      "name_fa": "موقعیت نامناسب روی باسکول",
      "condition_expression": "position_ok==false OR axle_presence_incomplete",
      "threshold_type": "site_configured_or_document_defined",
      "severity": "BLOCK",
      "action_fa": "راهنمای راننده، نگهداری فرمان راهبند",
      "priority": "P0",
      "confidence": "پیشنهادی",
      "reference_sources": [
        "S15",
        "S16"
      ]
    },
    {
      "id": "AL-09",
      "name_fa": "بازگشت صفر خارج از رواداری",
      "condition_expression": "abs(zero_reading)>scale.zero_tolerance_kg",
      "threshold_type": "site_configured_or_document_defined",
      "severity": "WARN/BLOCK",
      "action_fa": "توقف توزین بر اساس سیاست و درخواست تعمیرات",
      "priority": "P0",
      "confidence": "پیشنهادی",
      "reference_sources": [
        "S29"
      ]
    },
    {
      "id": "AL-10",
      "name_fa": "عدم‌تقارن/رانش لودسل",
      "condition_expression": "diagnostic_metric>manufacturer_site_limit",
      "threshold_type": "site_configured_or_document_defined",
      "severity": "CRITICAL",
      "action_fa": "اعلام تعمیرات؛ نمایش فقط با سنسور سازگار",
      "priority": "P1",
      "confidence": "پیشنهادی",
      "reference_sources": [
        "S27",
        "S29"
      ]
    },
    {
      "id": "AL-11",
      "name_fa": "انقضای گواهی کالیبراسیون",
      "condition_expression": "now>calibration.valid_until",
      "threshold_type": "site_configured_or_document_defined",
      "severity": "BLOCK",
      "action_fa": "غیرفعال کردن ثبت تجاری طبق تنظیم مقررات",
      "priority": "P0",
      "confidence": "پیشنهادی",
      "reference_sources": []
    },
    {
      "id": "AL-12",
      "name_fa": "کالیبراسیون نزدیک انقضا",
      "condition_expression": "valid_until - now < configured_lead_days",
      "threshold_type": "site_configured_or_document_defined",
      "severity": "WARN",
      "action_fa": "ایجاد کار نگهداری و اعلان",
      "priority": "P0",
      "confidence": "پیشنهادی",
      "reference_sources": []
    },
    {
      "id": "AL-13",
      "name_fa": "عبور تکراری یا replay",
      "condition_expression": "same visit+scale+pass/idempotency duplicated OR replay signal",
      "threshold_type": "site_configured_or_document_defined",
      "severity": "BLOCK",
      "action_fa": "رد ثبت دوم، اطلاع ممیز",
      "priority": "P0",
      "confidence": "پیشنهادی",
      "reference_sources": []
    },
    {
      "id": "AL-14",
      "name_fa": "توقف طولانی در صف",
      "condition_expression": "now - queue_entered_at > queue_wait_threshold",
      "threshold_type": "site_configured_or_document_defined",
      "severity": "WARN",
      "action_fa": "اخطار سرپرست حمل و اولویت‌بندی صف",
      "priority": "P1",
      "confidence": "پیشنهادی",
      "reference_sources": []
    },
    {
      "id": "AL-15",
      "name_fa": "ماندگاری بیش از حد در سایت",
      "condition_expression": "now-arrived_at > site_turnaround_threshold",
      "threshold_type": "site_configured_or_document_defined",
      "severity": "WARN",
      "action_fa": "بازبینی موقعیت کامیون",
      "priority": "P1",
      "confidence": "پیشنهادی",
      "reference_sources": [
        "S17"
      ]
    },
    {
      "id": "AL-16",
      "name_fa": "اختلال خواندن دستگاه",
      "condition_expression": "device_heartbeat_missing > configured_timeout",
      "threshold_type": "site_configured_or_document_defined",
      "severity": "BLOCK",
      "action_fa": "رفتار fail-safe، صف آفلاین و تیکت",
      "priority": "P0",
      "confidence": "پیشنهادی",
      "reference_sources": [
        "S04"
      ]
    },
    {
      "id": "AL-17",
      "name_fa": "اسکن LiDAR بی‌کیفیت",
      "condition_expression": "scan.quality_score < configured_min_quality",
      "threshold_type": "site_configured_or_document_defined",
      "severity": "WARN",
      "action_fa": "درخواست اسکن مجدد، عدم صدور حجم قطعی",
      "priority": "P2",
      "confidence": "پیشنهادی",
      "reference_sources": [
        "S31"
      ]
    },
    {
      "id": "AL-18",
      "name_fa": "مغایرت وزن/حجم",
      "condition_expression": "abs(net_kg - estimated_mass_kg) > tolerance_model(material,uncertainty)",
      "threshold_type": "site_configured_or_document_defined",
      "severity": "WARN",
      "action_fa": "بررسی چگالی/رطوبت و خطای بارگیری",
      "priority": "P2",
      "confidence": "پیشنهادی",
      "reference_sources": []
    },
    {
      "id": "AL-19",
      "name_fa": "اضافه‌بار/کم‌بار نسبت به هدف",
      "condition_expression": "payload_kg outside configured_target_band",
      "threshold_type": "site_configured_or_document_defined",
      "severity": "WARN",
      "action_fa": "اصلاح بارگیری؛ اطلاع دیسپچر",
      "priority": "P2",
      "confidence": "پیشنهادی",
      "reference_sources": [
        "S37"
      ]
    },
    {
      "id": "AL-20",
      "name_fa": "افزایش حجم بار بدون تغییر وزن مطابق الگوی ریسک",
      "condition_expression": "change(volume)/change(weight) unusual",
      "threshold_type": "site_configured_or_document_defined",
      "severity": "WARN",
      "action_fa": "بازبینی اپراتور؛ فقط هشدار تحلیلی",
      "priority": "P2",
      "confidence": "پیشنهادی",
      "reference_sources": []
    }
  ],
  "ui_pages": [
    {
      "id": "UI-01",
      "name": "Overview/KPI",
      "components_fa": "کارت وزن خالص امروز، تعداد کامیون، تعداد سفر، زمان ماندگاری، مجوزهای منتظر؛ نمودار ورودی/خروجی ساعتی و جدول هشدار"
    },
    {
      "id": "UI-02",
      "name": "Live Gate Control",
      "components_fa": "فید دروازه، پلاک/نمره OCR، RFID، مجوز، چراغ/راهبند READONLY + کنش تأیید مجاز"
    },
    {
      "id": "UI-03",
      "name": "Weighing Console",
      "components_fa": "وزن زنده indicator، واحد/پایداری، scale status، فرم خودرو/نوع بار/حواله، دو تصویر، دکمه Capture/Reject"
    },
    {
      "id": "UI-04",
      "name": "Queue & Call Board",
      "components_fa": "صف ورود، ETA نامشخص تا داده واقعی، گروه‌های صف، دکمه فراخوان، نمای تابلو بزرگ"
    },
    {
      "id": "UI-05",
      "name": "Transactions",
      "components_fa": "جدول فیلترشونده، وزن اول/دوم، خالص، وضعیت، لینک عکس و چاپ قبض"
    },
    {
      "id": "UI-06",
      "name": "Transaction Detail",
      "components_fa": "timeline کامل، raw weight receipt، تصاویر، تعارض OCR/RFID، مجوز، log امضا"
    },
    {
      "id": "UI-07",
      "name": "Vehicles",
      "components_fa": "رجیستری پلاک، کلاس، ظرفیت، معاینه، RFID، تریلر و تاریخچه سفر"
    },
    {
      "id": "UI-08",
      "name": "Drivers & Carriers",
      "components_fa": "هویت/مدارک/اعتبارنامه/شرکت و تاریخچه ورود، دسترسی ماسک‌شده"
    },
    {
      "id": "UI-09",
      "name": "Permits & Orders",
      "components_fa": "حواله، بارنامه، وضعیت، مانده وزن، سقف مجاز، مشتری، اعتبار"
    },
    {
      "id": "UI-10",
      "name": "Materials & Routes",
      "components_fa": "کد ماده/عیار، مبدأ، مقصد، وضعیت کیفیت/چگالی پیشنهادی"
    },
    {
      "id": "UI-11",
      "name": "Production Shift",
      "components_fa": "مقدار تولید، تعداد سفر، جدول شیفت/ماده/ماشین، روند برنامه و عملکرد"
    },
    {
      "id": "UI-12",
      "name": "Fleet Operations",
      "components_fa": "نقشه موقعیت (در صورت داده GPS)، زمان چرخه، صف، توقف، بهره‌برداری"
    },
    {
      "id": "UI-13",
      "name": "Scale Health",
      "components_fa": "نمودار صفر، ارتباط indicator، per-cell فقط در صورت data، آخرین گواهی کالیبراسیون"
    },
    {
      "id": "UI-14",
      "name": "Calibration Records",
      "components_fa": "فهرست گواهی‌ها، تاریخ صدور/اعتبار، فایل اصلی و هشدار موعد"
    },
    {
      "id": "UI-15",
      "name": "Alerts Center",
      "components_fa": "Severity/status، علت، داده مشاهده‌شده/حد، مسئول، ack و resolution"
    },
    {
      "id": "UI-16",
      "name": "Evidence Gallery",
      "components_fa": "عکس پلاک، نمای بدنه، بار از بالا، نوع camera و تاریخ و sha256"
    },
    {
      "id": "UI-17",
      "name": "LiDAR 3D Add-on",
      "components_fa": "مدل مرجع خالی، نقشه حرارتی پروفایل، حجم، کیفیت scan و بازپخش"
    },
    {
      "id": "UI-18",
      "name": "Onboard Payload Add-on",
      "components_fa": "جمع بار هر شاول/لودر و مقایسه با باسکول، اختلاف منبع"
    },
    {
      "id": "UI-19",
      "name": "Reports/Exports",
      "components_fa": "فیلترهای تاریخ/شیفت/راننده/ماده/مجوز/Scale، خروجی مجاز و گزارش زمان‌بندی"
    },
    {
      "id": "UI-20",
      "name": "Integrations & Devices",
      "components_fa": "adapter، device heartbeat، ارتباط ERP، queue و retry و mapping"
    },
    {
      "id": "UI-21",
      "name": "Users/RBAC/Audit",
      "components_fa": "کاربران، نقش/سایت، login history، override log و export log"
    },
    {
      "id": "UI-22",
      "name": "Site Configuration",
      "components_fa": "سایت، گیت، scale، shift، thresholds، سیاست آفلاین و نسخه سیاست"
    },
    {
      "id": "UI-23",
      "name": "Driver Kiosk",
      "components_fa": "نمایش راهنمای ساده پلاک/نوبت/باسکول/نتیجه/رسید بدون داده شخصی غیرضروری"
    },
    {
      "id": "UI-24",
      "name": "Manager Mobile",
      "components_fa": "فقط شاخص و اعلان و drill-down در نقش مجاز؛ بدون کنترل خطرناک در موبایل"
    }
  ],
  "workflow": {
    "states": [
      "DRAFT",
      "ARRIVED",
      "ID_VERIFIED",
      "FIRST_WEIGHTED",
      "LOADING_OR_UNLOADING",
      "SECOND_WEIGHTED",
      "COMPLIANCE_CHECKED",
      "APPROVED",
      "CLOSED",
      "HOLD",
      "MANUAL_REVIEW",
      "CANCELLED",
      "CORRECTED"
    ],
    "critical_gates": [
      "valid_permit",
      "identity_match",
      "stable_weight",
      "position_ok",
      "calibration_valid",
      "weight_capacity_compliant"
    ],
    "operations": [
      "RECEIVE",
      "DISPATCH"
    ]
  },
  "plugins": [
    {
      "id": "lidar-volume",
      "requires": [
        "visit_id",
        "truck_body_reference_id",
        "scan_kind",
        "point_cloud_uri"
      ],
      "emits": [
        "volume_m3",
        "quality_score",
        "estimated_mass_kg"
      ]
    },
    {
      "id": "onboard-payload",
      "requires": [
        "equipment_id",
        "trip_id",
        "payload_kg",
        "event_at"
      ],
      "emits": [
        "payload.reconciled"
      ]
    },
    {
      "id": "fleet-kpi",
      "requires": [
        "trip_id",
        "equipment_id",
        "cycle_events"
      ],
      "emits": [
        "shift.production",
        "fleet.cycle",
        "fleet.utilization"
      ]
    }
  ],
  "source_index": {
    "S01": {
      "name": "STAIN PESA+ | صفحه محصول",
      "url": "https://www.stain.it/en/modules/pesa-gestione-ingresso-uscita-automezzi-e-ufficio-pesa/",
      "type": "HTML"
    },
    "S02": {
      "name": "STAIN PESA+ | ایتالیایی",
      "url": "https://www.stain.it/it/moduli/pesa-gestione-ingresso-uscita-automezzi-e-ufficio-pesa/",
      "type": "HTML"
    },
    "S03": {
      "name": "STAIN MILL+",
      "url": "https://www.stain.it/en/products/mill-suite-for-metal/",
      "type": "HTML"
    },
    "S04": {
      "name": "STAIN MES | معماری",
      "url": "https://www.stain.it/en/about-us/our-software-mes/",
      "type": "HTML"
    },
    "S05": {
      "name": "STAIN | Scrap sampling",
      "url": "https://www.stain.it/en/modules/scrap-sampling-and-area-management/",
      "type": "HTML"
    },
    "S06": {
      "name": "STAIN | Plant logistics",
      "url": "https://www.stain.it/en/modules/plant-identification-and-logistics/",
      "type": "HTML"
    },
    "S07": {
      "name": "STAIN | Steel mills",
      "url": "https://www.stain.it/en/industries/metal/steel-mills/",
      "type": "HTML"
    },
    "S08": {
      "name": "STAIN | MILL+ brochure",
      "url": "https://www.stain.it/uploads/PagineWE/metal_web1.pdf",
      "type": "PDF [indexed; direct fetch timeout]"
    },
    "S09": {
      "name": "STAIN | نمایش فراخوان خودرو",
      "url": "https://www.stain.it/uploads/FasceImmagine/fascia22.jpg",
      "type": "Image"
    },
    "S10": {
      "name": "STAIN | تصویر باسکول",
      "url": "https://www.stain.it/uploads/FasceImmagine/fascia-pesa1.jpg",
      "type": "Image"
    },
    "S11": {
      "name": "STAIN | refs",
      "url": "https://www.stain.it/en/references/",
      "type": "HTML"
    },
    "S12": {
      "name": "STAIN | MTZ maintenance",
      "url": "https://www.stain.it/en/modules/run-to-failure-predictive-maintenance/",
      "type": "HTML"
    },
    "S13": {
      "name": "STAIN | LGT department logistics",
      "url": "https://www.stain.it/en/modules/lgt-department-logistics/",
      "type": "HTML"
    },
    "S14": {
      "name": "Avery | Weighman 8",
      "url": "https://www.averyweigh-tronix.com/en/product/weighman-8-weighbridge-software",
      "type": "HTML"
    },
    "S15": {
      "name": "Avery | SmarTower",
      "url": "https://www.averyweigh-tronix.com/en/product/smartower-unmanned-weighbridge-system/",
      "type": "HTML"
    },
    "S16": {
      "name": "Avery | Vehicle Image Capture",
      "url": "https://www.averyweigh-tronix.com/en-gb/wp-content/uploads/sites/2/2023/07/Weighman8_Vehicle_Image_Capture_spec_100164.pdf",
      "type": "PDF [indexed; redirected]"
    },
    "S17": {
      "name": "PRECIA MOLEN | TRUCKFLOW datasheet",
      "url": "https://us.preciamolen.com/wp-content/uploads/sites/22/2019/07/09-15-01-1-FT-TRUCKFLOW-V00.09.pdf",
      "type": "PDF 2 pages [text inspected; screenshot blocked]"
    },
    "S18": {
      "name": "PRECIA MOLEN | TRUCKFLOW UI تصویر",
      "url": "https://be-fr.preciamolen.com/wp-content/uploads/sites/12/2017/07/%C3%A9cran-1024x613.png",
      "type": "Image [web indexed]"
    },
    "S19": {
      "name": "PRECIA MOLEN | Truckflow brochure",
      "url": "https://www.preciamolen.com/wp-content/uploads/2022/10/DC10041-1-014_interactif.pdf",
      "type": "PDF [indexed; open 404]"
    },
    "S20": {
      "name": "Dariel | WBX article",
      "url": "https://it-online.co.za/2019/05/24/wbx-automates-weighbridge-process/",
      "type": "News"
    },
    "S21": {
      "name": "Dariel | WBX product modules",
      "url": "https://easterncapeindustrialnews.co.za/software-suite-takes-the-weight-off-logistics-operations/",
      "type": "News"
    },
    "S22": {
      "name": "Dariel | Coal case",
      "url": "https://www.dariel.co.za/coal-logistics-services-optimisation/",
      "type": "Official case"
    },
    "S23": {
      "name": "Endel Digital | WeighMAST",
      "url": "https://endel.digital/weighmast-weighbridge-software/",
      "type": "HTML"
    },
    "S24": {
      "name": "METTLER TOLEDO | DataBridge",
      "url": "https://www.mt.com/in/en/home/products/Transport_and_Logistics_Solutions/weighbridge-and-rail-scale-systems/weighbridge-systems/databridge-software-61046589001.html",
      "type": "HTML"
    },
    "S25": {
      "name": "METTLER TOLEDO | DataBridge brochure",
      "url": "https://www.mt.com/dam/product_organizations/industry/transport-and-logistics/vehicle/databridge-downloads/DataBridge_Brochure-EN-PB-B-VEH-20250203-00193661.pdf",
      "type": "PDF 6 pages [screenshots inspected]"
    },
    "S26": {
      "name": "METTLER TOLEDO | DataBridge datasheet",
      "url": "https://www.mt.com/dam/product_organizations/industry/transport-and-logistics/vehicle/databridge-downloads/DataBridge_Datasheet-EN-DS-B-VEH-20250110-00191484.pdf",
      "type": "PDF 5 pages [text inspected]"
    },
    "S27": {
      "name": "METTLER TOLEDO | POWERCELL PDX",
      "url": "https://www.mt.com/us/en/home/products/Transport_and_Logistics_Solutions/truck-and-rail-scale-systems/truck-scale-systems/powercell-pdx-load-cells-42904891002.html",
      "type": "HTML"
    },
    "S28": {
      "name": "METTLER TOLEDO | VSK 901",
      "url": "https://www.mt.com/ca/en/home/products/Transport_and_Logistics_Solutions/truck-and-rail-scale-systems/software-upgrades-and-systems/vsk9-series-truck-scale-kiosk-31125888.html",
      "type": "HTML"
    },
    "S29": {
      "name": "Rice Lake | iQUBE²",
      "url": "https://www.ricelake.com/products/iqube2-digital-diagnostic-junction-box?part=54224",
      "type": "HTML"
    },
    "S30": {
      "name": "Loadscan | MyScanner",
      "url": "https://www.loadscan.com/myscanner/",
      "type": "HTML"
    },
    "S31": {
      "name": "Loadscan | MPS",
      "url": "https://www.loadscan.com/mine-payload-scanner/",
      "type": "HTML"
    },
    "S32": {
      "name": "Loadscan | LVS",
      "url": "https://www.loadscan.com/load-volume-scanner/",
      "type": "HTML"
    },
    "S33": {
      "name": "Loadscan | API",
      "url": "https://www.loadscan.com/loadscan-integration-api/",
      "type": "HTML"
    },
    "S34": {
      "name": "Loadscan | MyScanner dashboard update",
      "url": "https://www.loadscan.com/myscanner-dashboard-update/",
      "type": "HTML"
    },
    "S35": {
      "name": "Trimble LOADRITE | InsightHQ",
      "url": "https://www.goloadrite.com/insighthq",
      "type": "HTML"
    },
    "S36": {
      "name": "Trimble | LR360 release",
      "url": "https://www.prnewswire.com/news-releases/trimble-introduces-loadrite-360-loadout-management-system-for-quarries-300071668.html",
      "type": "press release"
    },
    "S37": {
      "name": "Wenco | Fleet Performance",
      "url": "https://www.hitachi.com/en-us/press/wenco-mine-performance-suite-6-reimagines-dispatching-analytics-and-total-mine-performance/",
      "type": "official press release"
    },
    "S38": {
      "name": "Wenco | dispatch",
      "url": "https://www.wencomine.com/our-solutions/dispatching",
      "type": "HTML"
    },
    "S39": {
      "name": "Hexagon | mine operations",
      "url": "https://hexagon.com/products/mine-operations",
      "type": "HTML"
    },
    "S40": {
      "name": "Komatsu Modular | DISPATCH",
      "url": "https://www.komatsu.com/en-us/technology/smart-mining/loading-and-haulage/dispatch",
      "type": "HTML"
    },
    "S41": {
      "name": "Caterpillar | MineStar Fleet",
      "url": "https://www.cat.com/en_US/by-industry/mining/surface-mining/surface-technology/fleet.html",
      "type": "HTML"
    },
    "S42": {
      "name": "TruckFlow screenshot indexed",
      "url": "https://cdn.techjockey.com/web/assets/images/techjockey/products/screenshots/21235_truckflowsoftwareweight.jpg",
      "type": "Image third-party"
    },
    "S43": {
      "name": "STAIN | foundry context",
      "url": "https://www.stain.it/en/industries/metal/brass-aluminium-foundries-and-wire-mills/",
      "type": "HTML"
    },
    "S44": {
      "name": "STAIN | distribution centers",
      "url": "https://www.stain.it/en/industries/metal/pipe-and-sheet-metal-distribution-centres/",
      "type": "HTML"
    }
  },
  "open_questions": [
    "indicator_models",
    "legal_metrology_jurisdiction",
    "ERP_contract",
    "shift_definition",
    "network_offline_policy",
    "lidar_vehicle_profiles"
  ]
}
```
