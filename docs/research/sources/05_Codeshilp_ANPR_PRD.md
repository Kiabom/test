# مشخصات محصول مستقل سامانه هوشمند توزین، کنترل تردد و مدیریت حمل معدنی

**مبنای تحلیل:** Codeshilp / ANPR Weighbridge Software؛ مقایسه با ۱۲ خانواده محصول مکمل | **تاریخ بررسی:** ۲۰۲۶-۱۰-۲۵ | **نسخه:** 1.0 (Evidence-led PRD) | **زبان:** فارسی

> **دامنه و روش‌شناسی:** منابع عمومی قابل‌مشاهده بررسی شده‌اند؛ خزش *کامل* کل دامنه، ورود به سامانه نمایشی، کد داخلی، تمامی صفحات پشتیبانی و تماشای ویدئوهای محصول محقق نشده است. `robots.txt` و `sitemap_index.xml` در ابزار مرور وب قابل بازکردن نبودند؛ «نشدن دسترسی» به معنی «نبودن فایل» نیست. اسناد PDF تنها در صورت باز شدن و مشاهده صفحه، «بررسی تصویری‌شده» شمرده شده‌اند. هرجا «پیشنهادی» آمده، ویژگی محصول ماست، نه ادعای وجود آن در Codeshilp. **ادعاهای صفحات تبلیغاتی، حتی با برچسب تأییدشده، تنها تأییدِ اعلام فروشنده‌اند، نه تأیید عملکرد میدانی یا دقت سنجی.**

**راهنمای وضعیت:** `✔[ID]` = وجود قابلیت *صریحاً اعلام‌شده در منبع لینک‌شده*؛ `؟[ID]` = در منبع بررسی‌شده برای این محصول تأیید نشده/نامشخص؛ `ندارد` تنها در صورت سند صریح بر فقدان قابلیت مجاز است و در این مطالعه مورد اثبات‌شده‌ای یافت نشد. `هسته` تنها هنگامی استفاده شده که دست‌کم ۳ خانواده محصول مستقل حضور صریح داشته باشند. مقایسه بین خانواده‌هایی با وظایف متفاوت (نرم‌افزار باسکول، سلامت لودسل، اسکن حجمی، FMS) است؛ خانه نامشخص به‌معنای ضعف محصول نیست.

## ۱. خلاصه اجرایی

1. Codeshilp از ANPR و RFID برای شناسایی وسیله و از indicator برای خوانش وزن پشتیبانی اعلام می‌کند [C01](#C01)[C02](#C02).
2. صفحه عملیاتی واقعی/تبلیغاتی آن فرم متراکم Windows با وزن دیجیتال، اطلاعات فروش/راننده/خودرو و آرایش ۲×۲ دوربین است [C09](#C09)[C03](#C03).
3. محصول امکانات راهبند، چراغ، سنسور استقرار، اعلان صوتی، نمایشگر راننده و کنترلر IoT را در نسخه unmanned اعلام می‌کند [C02](#C02).
4. تصاویر وزن و قبض دارای شواهد تصویری است؛ کاتالوگ CCTV چهار دوربین را تصریح می‌کند [C03](#C03).
5. اتصال به ERP/SAP و Tally ادعا شده؛ صفحه سفارش‌های Tally خواندن سفارش‌های معوق و ارسال Delivery/Receipt Note را توضیح می‌دهد [C01](#C01)[C05](#C05).
6. PDF گزارش‌گیری ابری صفحات Master، Truck Summary و Pending Upload to Tally را نشان می‌دهد [C04](#C04).
7. دقت ANPR، نرخ خطا، کارایی در محیط معدن، سخت‌افزار خاص، معماری API و اثبات آزمون پذیرش منتشر نشده‌اند.
8. تشخیص رانش صفر/عدم‌تقارن لودسل برای Mettler TraxEMT و Rice Lake iQUBE² مستند است؛ برای Codeshilp تأیید نشد [M01](#M01)[R01](#R01).
9. اسکن حجم مستقل و پروفایل سه‌بعدی LiDAR در Loadscan MPS/LVS تأیید می‌شود؛ حجم همان جرم باسکول نیست [L01](#L01)[L03](#L03).
10. LOADRITE LR360 پیوند سفارش توزین و بارگیری لودر و کنترل مجدد وزن را توضیح می‌دهد [T01](#T01).
11. Wenco/Hexagon/DISPATCH/Cat، منبع الگوبرداری KPI و dispatch معدنی‌اند؛ نه جایگزین نرم‌افزار تراکنش باسکول [W01](#W01)[H01](#H01)[K01](#K01)[F01](#F01).
12. پیشنهاد طراحی: هسته تراکنش + لایه adapter تجهیزات + موتور قواعد/مجوز + دفتر رویداد + افزونه‌های Volume/Payload/FMS.
13. اجرای پایلوت باید ابتدا RFID/ANPR/دو وزن/کنترل خروج و کیفیت داده را اثبات کند، سپس قابلیت‌های افزودنی فعال شوند.

## ۲. فهرست منابع بررسی‌شده و دفتر شواهد

پیوندهای زیر شناسه‌های قابل‌ردیابی مورد استفاده در ماتریس، نیازمندی‌ها و تحلیل تصویری هستند. وضعیت دسترسی در هر ردیف ثبت است.

- <a id="C01"></a>**[C01](#C01) Codeshilp · ANPR/LPR Weighbridge Software** — صفحه محصول؛ ویژگی‌های ۱ تا ۸؛ مشاهده مستقیم. [URL](https://codeshilp.com/anpr-weighbridge-software/)
- <a id="C02"></a>**[C02](#C02) Codeshilp · Unmanned Weighbridge** — RFID HF/UHF، باریر، LED، سنسور، IoT، ضدسرقت؛ مشاهده مستقیم. [URL](https://codeshilp.com/unmanned-weighbridge-software/)
- <a id="C03"></a>**[C03](#C03) Codeshilp · CCTV Weighbridge PDF** — ۴ صفحه؛ ص۱ UI؛ ص۲ دوربین؛ ص۳ قبض؛ ص۴ قابلیت‌ها؛ مشاهده اسکرین‌شات صفحه. [URL](https://5.imimg.com/data5/SELLER/Doc/2025/1/478857094/JM/IO/EQ/88887902/cctv-weighbridge-software.pdf)
- <a id="C04"></a>**[C04](#C04) Codeshilp · Cloud Reporting PDF** — ۵ صفحه؛ ص۱ داشبورد، ص۲ مسترها، ص۳ محصولات/حمل‌کننده، ص۴ صف Tally/گزارش، ص۵ تماس؛ مشاهده اسکرین‌شات. [URL](https://codeshilp.com/wp-content/uploads/2025/03/Weighbridge-with-Cloud-Reporting.pdf)
- <a id="C05"></a>**[C05](#C05) Codeshilp · Tally Order Delivery** — تطبیق/سینک سفارش فروش و خرید با Tally؛ مشاهده مستقیم. [URL](https://codeshilp.com/order-delivery-tally-integration-with-weighbridge/)
- <a id="C06"></a>**[C06](#C06) Codeshilp · Weighbridge Software** — ویژگی‌های عمومی نرم‌افزار؛ مشاهده مستقیم. [URL](https://codeshilp.com/weighbridge-software/)
- <a id="C07"></a>**[C07](#C07) Codeshilp · Online Weighbridge Software** — کاربران، شبکه، وزن، ERP؛ مشاهده مستقیم. [URL](https://codeshilp.com/online-weighbridge-software/)
- <a id="C08"></a>**[C08](#C08) Codeshilp · Royalty Weighbridge** — حسابداری حقوق دولتی/royalty و وزن؛ ادعای صفحه. [URL](https://codeshilp.com/royalty-weighbridge-software/)
- <a id="C09"></a>**[C09](#C09) Codeshilp · ANPR UI image anpr-wb-4** — صفحه کامل ایستگاه با چهار دوربین؛ مشاهده تصویر. [URL](https://codeshilp.com/wp-content/uploads/2025/07/anpr-wb-4.png)
- <a id="C10"></a>**[C10](#C10) Codeshilp · Weighing UI image** — کادر اصلی و لاگ‌های ANPR/IoT؛ مشاهده تصویر. [URL](https://codeshilp.com/wp-content/uploads/2025/04/1-weighing-form-1024x632.png)
- <a id="C11"></a>**[C11](#C11) Codeshilp · ANPR concept image anpr-wb-1** — تصویر مفهومی خودرو و دوربین؛ *نه اسکرین‌شات نرم‌افزار*. [URL](https://codeshilp.com/wp-content/uploads/2025/07/anpr-wb-1.png)
- <a id="C12"></a>**[C12](#C12) Codeshilp · Gallery** — فهرست تصاویر گالری؛ صفحه مشاهده‌شده. [URL](https://codeshilp.com/gallery/)
- <a id="C13"></a>**[C13](#C13) Codeshilp · Main Weighbridge Product Navigation** — فهرست پیوندهای بخش‌ها؛ مشاهده مستقیم. [URL](https://codeshilp.com/site-map/)
- <a id="C14"></a>**[C14](#C14) Codeshilp · Comport Utility** — ادعای Modbus، RS232، RS485، LAN؛ مختص زیرمحصول/یوتیلیتی، نه اثبات ANPR. [URL](https://codeshilp.com/comport-utility/)
- <a id="C15"></a>**[C15](#C15) Codeshilp · Weighbridge Mobile Application** — وجود محصول موبایل؛ نه اثبات صفحات موبایل ANPR. [URL](https://codeshilp.com/weighbridge-mobile-application/)
- <a id="C16"></a>**[C16](#C16) Codeshilp · Tally Integration** — یکپارچگی حسابداری؛ مشاهده مستقیم. [URL](https://codeshilp.com/weighbridge-software-with-tally-integration/)
- <a id="A01"></a>**[A01](#A01) Avery Weigh-Tronix · Weighman 8** — ANPR/RFID، ترمینال، مدیریت چندسایت، صورتحساب، audit، SQL. [URL](https://www.averyweigh-tronix.com/en/product/weighman-8-weighbridge-software/)
- <a id="A02"></a>**[A02](#A02) Avery Weigh-Tronix · SmarTower** — RFID UHF، سنسور، دوربین، پیام صوتی، نمایشگر و راهبند. [URL](https://www.averyweigh-tronix.com/en/product/smartower-unmanned-weighbridge-system/)
- <a id="A03"></a>**[A03](#A03) Avery · Vehicle image capture datasheet [URL now redirects]** — متن آرشیوی جست‌وجو قابل بازیابی؛ لینک فعلی به صفحه اصلی ریدایرکت؛ سند قابل تأیید باز نشده. [URL](https://www.averyweigh-tronix.com/en-gb/wp-content/uploads/sites/2/2023/07/Weighman8_Vehicle_Image_Capture_spec_100164.pdf)
- <a id="P01"></a>**[P01](#P01) PRECIA MOLEN · TruckFlow official** — مدیریت چندباسکول/چندسایت، badge/ANPR، لوازم جانبی، اپ. [URL](https://www.preciamolen.com/en/products/vehicle-weighing/weighbridge/out-weighing-management-software-truckflow)
- <a id="P02"></a>**[P02](#P02) PRECIA MOLEN · Vehicle weighing** — RFID/NFC، راهبند، دوربین، چراغ، کنترل تردد. [URL](https://www.preciamolen.com/en/products/vehicle-weighing)
- <a id="P03"></a>**[P03](#P03) Precia TruckFlow old PDF [404 when opened]** — متن در فهرست جست‌وجو موجود؛ URL مستقیم 404؛ نباید به عنوان PDF بررسی‌شده شمرده شود. [URL](https://www.preciamolen.com/wp-content/uploads/2018/05/09-15-01-1-FT-TRUCKFLOW-V00.09.pdf)
- <a id="D01"></a>**[D01](#D01) Dariel · Coal Logistics Services Optimisation** — یکپارچه‌سازی حسابداری زغال، لجستیک، REST؛ مورد مطالعاتی و نه لزوماً مشخصات نسخه WBX. [URL](https://www.dariel.co.za/coal-logistics-services-optimisation/)
- <a id="D02"></a>**[D02](#D02) Mining Weekly · Dariel WBX 2014** — منبع ثانویه درباره WBX؛ تطبیق سفارش و تناژ و مدارک راننده. [URL](https://www.miningweekly.com/article/weighbridge-solution-installed-at-mpumalanga-coal-mine-2014-05-23/page%3A2)
- <a id="E01"></a>**[E01](#E01) Endel Digital · WeighMAST** — ANPR/RFID، ارتباط indicator، داشبورد، یکپارچگی، گزارش. [URL](https://endel.digital/weighmast-weighbridge-software/)
- <a id="M01"></a>**[M01](#M01) METTLER TOLEDO · TraxEMT Application Guide PDF** — ۲۹ صفحه؛ بررسی تصویر ص۴ و محتوای راهنمای پایش تقارن، zero drift، overload. [URL](https://www.mt.com/dam/ind/IND_PDF/2024/IND780-downloads/others/IND560PDX-and-IND780_MAN_30137756_R00_TraxEMT_AppGuide_EN.pdf)
- <a id="R01"></a>**[R01](#R01) Rice Lake · iQUBE²** — پایش سلول و zero/drift/noise/imbalance، ارتباطات سخت‌افزاری. [URL](https://www.ricelake.com/products/iqube2-digital-diagnostic-junction-box?part=93243)
- <a id="L01"></a>**[L01](#L01) Loadscan · Mine Payload Scanner** — اسکن خالی/پر، LiDAR، RFID، گزارش حجم و پروفایل سه‌بعدی؛ MPS NOT legal for trade. [URL](https://www.loadscan.com/mine-payload-scanner/)
- <a id="L02"></a>**[L02](#L02) Loadscan · MyScanner** — گزارش ابری، 3D، تاریخچه، هشدار قابل برنامه‌ریزی. [URL](https://www.loadscan.com/myscanner/)
- <a id="L03"></a>**[L03](#L03) Loadscan · Load Volume Scanner** — اندازه‌گیری مستقل حجم، عکس سه‌بعدی، RFID در نوع ثابت. [URL](https://www.loadscan.com/load-volume-scanner/)
- <a id="T01"></a>**[T01](#T01) LOADRITE · LR360 (product owner site)** — کار در صف بارگیری، ارتباط loader/scalehouse، سه مشاهده وزن، گزارش عملکرد. [URL](https://www.goloadrite.com/loadrite-360)
- <a id="T02"></a>**[T02](#T02) LOADRITE · InsightHQ dealer** — گزارش بهره‌وری ماشین و شیفت/روز/هفته/ماه؛ منبع توزیع‌کننده. [URL](https://www.neloadrite.com/reporting)
- <a id="W01"></a>**[W01](#W01) Wenco · Mining fleet management** — داشبورد، سیکل، بار، تخصیص و هشدار مسیر. [URL](https://www.wencomine.com/our-solutions/mining-fleet-management)
- <a id="H01"></a>**[H01](#H01) Hexagon · OP Pro official** — مدیریت چندسایتی ناوگان، بهینه‌سازی حمل و اختلاط؛ بیانیه رسمی. [URL](https://hexagon.com/about/news-media/press-releases/2022/hexagon-awarded-significant-fleet-management-project)
- <a id="H02"></a>**[H02](#H02) Hexagon · OP Pro case study PDF** — متن جست‌وجو؛ رویکرد سیکل، توقف و تولید؛ PDF مستقلاً باز نشد. [URL](https://hexagon.com/-/media/project/one-web/master-site/products/hxgn-mineoperate-op-pro-hp/case_study_01_mineoperate_op_pro_lp.pdf)
- <a id="K01"></a>**[K01](#K01) Komatsu/Modular · DISPATCH** — بهینه‌سازی truck/shovel، سوخت/صف، بستر FMS، حمل ماده. [URL](https://www.komatsu.com/en-us/technology/smart-mining/loading-and-haulage/dispatch)
- <a id="F01"></a>**[F01](#F01) Caterpillar · MineStar Fleet** — سیکل، بار، ترکیب مواد، تخصیص، سوخت و شیفت. [URL](https://www.cat.com/en_US/by-industry/mining/surface-mining/surface-technology/fleet.html)
- <a id="F02"></a>**[F02](#F02) Caterpillar · MineStar Reporting** — گزارش تولید، درجه ماده، توقف، بهره‌وری، ردیابی. [URL](https://www.cat.com/en_US/news/machine-press-releases/new-cat-minestar-reporting-integrates-minestar-and-other-vendor-data-into-a-single--unified-interface.html)

### ۲.۱ فهرست URLهای مشاهده‌شده در دامنه اصلی (محدود به صفحات مرتبط)


1. [https://codeshilp.com/anpr-weighbridge-software/](https://codeshilp.com/anpr-weighbridge-software/) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
2. [https://codeshilp.com/unmanned-weighbridge-software/](https://codeshilp.com/unmanned-weighbridge-software/) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
3. [https://codeshilp.com/cctv-weighbridge-software/](https://codeshilp.com/cctv-weighbridge-software/) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
4. [https://codeshilp.com/weighbridge-with-cloud-reporting/](https://codeshilp.com/weighbridge-with-cloud-reporting/) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
5. [https://codeshilp.com/gallery/](https://codeshilp.com/gallery/) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
6. [https://codeshilp.com/weighbridge-software/](https://codeshilp.com/weighbridge-software/) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
7. [https://codeshilp.com/sms-weighbridge-software/](https://codeshilp.com/sms-weighbridge-software/) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
8. [https://codeshilp.com/email-based-weighbridge-software/](https://codeshilp.com/email-based-weighbridge-software/) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
9. [https://codeshilp.com/weighbridge-lan-software/](https://codeshilp.com/weighbridge-lan-software/) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
10. [https://codeshilp.com/multi-weighbridge-software/](https://codeshilp.com/multi-weighbridge-software/) — ⚠️ دسترسی/خواندن مسدود یا ناموفق
11. [https://codeshilp.com/inward-outward-weighbridge-software/](https://codeshilp.com/inward-outward-weighbridge-software/) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
12. [https://codeshilp.com/whatsapp-based-weighbridge-software/](https://codeshilp.com/whatsapp-based-weighbridge-software/) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
13. [https://codeshilp.com/comport-utility/](https://codeshilp.com/comport-utility/) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
14. [https://codeshilp.com/royalty-weighbridge-software/](https://codeshilp.com/royalty-weighbridge-software/) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
15. [https://codeshilp.com/weighbridge-software-with-oracle-integration/](https://codeshilp.com/weighbridge-software-with-oracle-integration/) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
16. [https://codeshilp.com/barcode-weighbridge-software/](https://codeshilp.com/barcode-weighbridge-software/) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
17. [https://codeshilp.com/weighbridge-software-with-tally-integration/](https://codeshilp.com/weighbridge-software-with-tally-integration/) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
18. [https://codeshilp.com/order-delivery-tally-integration-with-weighbridge/](https://codeshilp.com/order-delivery-tally-integration-with-weighbridge/) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
19. [https://codeshilp.com/weighbridge-mobile-application/](https://codeshilp.com/weighbridge-mobile-application/) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
20. [https://codeshilp.com/quarry-management-software/](https://codeshilp.com/quarry-management-software/) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
21. [https://codeshilp.com/weighbridge-reporting/](https://codeshilp.com/weighbridge-reporting/) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
22. [https://codeshilp.com/weighbridge-software-to-google-sheet-integration/](https://codeshilp.com/weighbridge-software-to-google-sheet-integration/) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
23. [https://codeshilp.com/online-weighbridge-software/](https://codeshilp.com/online-weighbridge-software/) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
24. [https://codeshilp.com/site-map/](https://codeshilp.com/site-map/) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
25. [https://codeshilp.com/software-download/](https://codeshilp.com/software-download/) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
26. [https://codeshilp.com/robots.txt](https://codeshilp.com/robots.txt) — ⚠️ دسترسی/خواندن مسدود یا ناموفق
27. [https://codeshilp.com/sitemap_index.xml](https://codeshilp.com/sitemap_index.xml) — ⚠️ دسترسی/خواندن مسدود یا ناموفق
28. [https://codeshilp.com/wp-content/uploads/2025/03/Weighbridge-with-Cloud-Reporting.pdf](https://codeshilp.com/wp-content/uploads/2025/03/Weighbridge-with-Cloud-Reporting.pdf) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
29. [https://codeshilp.com/wp-content/uploads/2025/07/anpr-done-with-photos.pdf](https://codeshilp.com/wp-content/uploads/2025/07/anpr-done-with-photos.pdf) — ⚠️ دسترسی/خواندن مسدود یا ناموفق
30. [https://codeshilp.com/wp-content/uploads/2025/07/anpr-wb-4.png](https://codeshilp.com/wp-content/uploads/2025/07/anpr-wb-4.png) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
31. [https://codeshilp.com/wp-content/uploads/2025/07/anpr-wb-1.png](https://codeshilp.com/wp-content/uploads/2025/07/anpr-wb-1.png) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
32. [https://codeshilp.com/wp-content/uploads/2025/07/anpr-wb-2.png](https://codeshilp.com/wp-content/uploads/2025/07/anpr-wb-2.png) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن
33. [https://codeshilp.com/wp-content/uploads/2025/07/anpr-wb-3.png](https://codeshilp.com/wp-content/uploads/2025/07/anpr-wb-3.png) — پیوند دیده/باز شده؛ نه لزوماً ممیزی کامل تمام محتوای آن

**روابط مکمل جست‌وجوشده ولی بدون بررسی عمیق:** FAQ، بخش Shop، صفحه پشتیبانی `help.codeshilp.com`، منوهای غیرمرتبط نظیر ERP دارویی و امنیت سایبری؛ ادعای مرور کامل محتوا نمی‌شود. فایل PDF ANPR در لینک دانلود، در زمان بررسی صفحه ضدربات نشان داد. `robots` و sitemap قابل خواندن نبودند. ویدئوی رسمیِ قابل‌بازپخش و زمان‌نشان‌دار شناسایی/تحلیل نشد.

## ۳. ماتریس ویژگی و استخراج هسته

در این جدول «تأییدشده» یعنی تأیید تبلیغ/سند منبع؛ نه آزمون عملی. نام ستون به مرجع عمومی آن محصول پیوند دارد. هر خانه ـ اعم از ✔ یا ؟ ـ شناسه مرجع قابل مراجعه دارد.

| ویژگی | [Codeshilp](#C01) | [Avery](#A01) | [Precia](#P01) | [Dariel WBX](#D02) | [WeighMAST](#E01) | [Mettler TraxEMT](#M01) | [Rice Lake iQUBE²](#R01) | [Loadscan](#L01) | [LOADRITE](#T01) | [Wenco](#W01) | [Hexagon](#H01) | [Modular DISPATCH](#K01) | [Cat MineStar](#F01) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| تشخیص پلاک ANPR **(هسته)** | ✔[C01](#C01) | ✔[A01](#A01) | ✔[P01](#P01) | ؟[D02](#D02) | ✔[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ؟[L01](#L01) | ؟[T01](#T01) | ؟[W01](#W01) | ؟[H01](#H01) | ؟[K01](#K01) | ؟[F01](#F01) |
| RFID شناسایی خودرو **(هسته)** | ✔[C02](#C02) | ✔[A02](#A02) | ✔[P02](#P02) | ؟[D02](#D02) | ✔[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ✔[L01](#L01) | ؟[T01](#T01) | ؟[W01](#W01) | ؟[H01](#H01) | ؟[K01](#K01) | ؟[F01](#F01) |
| ذکر HF/UHF به‌صورت مشخص | ✔[C02](#C02) | ✔[A02](#A02) | ؟[P01](#P01) | ؟[D02](#D02) | ؟[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ؟[L01](#L01) | ؟[T01](#T01) | ؟[W01](#W01) | ؟[H01](#H01) | ؟[K01](#K01) | ؟[F01](#F01) |
| راهبند/چراغ هدایت **(هسته)** | ✔[C02](#C02) | ✔[A02](#A02) | ✔[P02](#P02) | ؟[D02](#D02) | ؟[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ؟[L01](#L01) | ؟[T01](#T01) | ؟[W01](#W01) | ؟[H01](#H01) | ؟[K01](#K01) | ؟[F01](#F01) |
| سنسور استقرار صحیح خودرو | ✔[C02](#C02) | ✔[A02](#A02) | ؟[P01](#P01) | ؟[D02](#D02) | ؟[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ؟[L01](#L01) | ؟[T01](#T01) | ؟[W01](#W01) | ؟[H01](#H01) | ؟[K01](#K01) | ؟[F01](#F01) |
| ترمینال راننده/عملیات بی‌اپراتور **(هسته)** | ✔[C02](#C02) | ✔[A01](#A01) | ✔[P01](#P01) | ؟[D02](#D02) | ✔[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ؟[L01](#L01) | ؟[T01](#T01) | ؟[W01](#W01) | ؟[H01](#H01) | ؟[K01](#K01) | ؟[F01](#F01) |
| تراکنش باسکول و وزن خودکار **(هسته)** | ✔[C01](#C01) | ✔[A01](#A01) | ✔[P01](#P01) | ✔[D02](#D02) | ✔[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ؟[L01](#L01) | ✔[T01](#T01) | ؟[W01](#W01) | ؟[H01](#H01) | ؟[K01](#K01) | ؟[F01](#F01) |
| ثبت تارای خودرو/وزن خالص **(هسته)** | ✔[C03](#C03) | ✔[A01](#A01) | ✔[P01](#P01) | ؟[D02](#D02) | ؟[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ؟[L01](#L01) | ✔[T01](#T01) | ؟[W01](#W01) | ؟[H01](#H01) | ؟[K01](#K01) | ؟[F01](#F01) |
| چند باسکول/چند ایستگاه **(هسته)** | ✔[C02](#C02) | ✔[A01](#A01) | ✔[P01](#P01) | ؟[D02](#D02) | ✔[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ؟[L01](#L01) | ؟[T01](#T01) | ؟[W01](#W01) | ؟[H01](#H01) | ؟[K01](#K01) | ؟[F01](#F01) |
| دوربین و عکس رخداد وزن **(هسته)** | ✔[C03](#C03) | ✔[A01](#A01) | ✔[P02](#P02) | ؟[D02](#D02) | ✔[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ؟[L01](#L01) | ؟[T01](#T01) | ؟[W01](#W01) | ؟[H01](#H01) | ؟[K01](#K01) | ؟[F01](#F01) |
| زمان و هویت تراکنش **(هسته)** | ✔[C01](#C01) | ✔[A01](#A01) | ✔[P01](#P01) | ✔[D02](#D02) | ✔[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ✔[L02](#L02) | ✔[T01](#T01) | ؟[W01](#W01) | ؟[H01](#H01) | ؟[K01](#K01) | ؟[F01](#F01) |
| کنترل سفارش/مجوز تجاری **(هسته)** | ✔[C05](#C05) | ؟[A01](#A01) | ؟[P01](#P01) | ✔[D02](#D02) | ؟[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ؟[L01](#L01) | ✔[T01](#T01) | ؟[W01](#W01) | ؟[H01](#H01) | ؟[K01](#K01) | ؟[F01](#F01) |
| مدیریت سهمیه یا حواله معدنی اختصاصی | ؟[C01](#C01) | ؟[A01](#A01) | ؟[P01](#P01) | ؟[D02](#D02) | ؟[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ؟[L01](#L01) | ؟[T01](#T01) | ؟[W01](#W01) | ؟[H01](#H01) | ؟[K01](#K01) | ؟[F01](#F01) |
| ارتباط ERP/حسابداری **(هسته)** | ✔[C05](#C05) | ✔[A01](#A01) | ✔[P02](#P02) | ✔[D01](#D01) | ✔[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ؟[L01](#L01) | ✔[T01](#T01) | ؟[W01](#W01) | ؟[H01](#H01) | ؟[K01](#K01) | ؟[F01](#F01) |
| داشبورد/گزارش مدیریتی **(هسته)** | ✔[C04](#C04) | ✔[A01](#A01) | ✔[P01](#P01) | ؟[D02](#D02) | ✔[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ✔[L02](#L02) | ✔[T02](#T02) | ✔[W01](#W01) | ✔[H01](#H01) | ✔[K01](#K01) | ✔[F02](#F02) |
| حسابرسی/ضدتقلب اظهارشده **(هسته)** | ✔[C01](#C01) | ✔[A01](#A01) | ؟[P01](#P01) | ✔[D02](#D02) | ✔[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ؟[L01](#L01) | ؟[T01](#T01) | ؟[W01](#W01) | ؟[H01](#H01) | ؟[K01](#K01) | ؟[F01](#F01) |
| پایش سلامت تک‌لودسل/رانش صفر | ؟[C01](#C01) | ؟[A01](#A01) | ؟[P01](#P01) | ؟[D02](#D02) | ؟[E01](#E01) | ✔[M01](#M01) | ✔[R01](#R01) | ؟[L01](#L01) | ؟[T01](#T01) | ؟[W01](#W01) | ؟[H01](#H01) | ؟[K01](#K01) | ؟[F01](#F01) |
| نظارت تاریخ انقضای گواهی کالیبراسیون | ؟[C01](#C01) | ؟[A01](#A01) | ؟[P01](#P01) | ؟[D02](#D02) | ؟[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ؟[L01](#L01) | ؟[T01](#T01) | ؟[W01](#W01) | ؟[H01](#H01) | ؟[K01](#K01) | ؟[F01](#F01) |
| اسکن LiDAR و اندازه‌گیری حجم | ؟[C01](#C01) | ؟[A01](#A01) | ؟[P01](#P01) | ؟[D02](#D02) | ؟[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ✔[L01](#L01) | ؟[T01](#T01) | ؟[W01](#W01) | ؟[H01](#H01) | ؟[K01](#K01) | ؟[F01](#F01) |
| پروفایل 3D بار | ؟[C01](#C01) | ؟[A01](#A01) | ؟[P01](#P01) | ؟[D02](#D02) | ؟[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ✔[L01](#L01) | ؟[T01](#T01) | ؟[W01](#W01) | ؟[H01](#H01) | ؟[K01](#K01) | ؟[F01](#F01) |
| ترازوی لودر/ارتباط با بارگیری | ؟[C01](#C01) | ؟[A01](#A01) | ؟[P01](#P01) | ؟[D02](#D02) | ؟[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ؟[L01](#L01) | ✔[T01](#T01) | ؟[W01](#W01) | ؟[H01](#H01) | ؟[K01](#K01) | ؟[F01](#F01) |
| KPI سیکل/تولید/شیفت ناوگان **(هسته)** | ؟[C01](#C01) | ؟[A01](#A01) | ؟[P01](#P01) | ؟[D02](#D02) | ؟[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ؟[L01](#L01) | ✔[T02](#T02) | ✔[W01](#W01) | ✔[H01](#H01) | ✔[K01](#K01) | ✔[F01](#F01) |
| بهینه‌سازی تخصیص ماشین معدنی **(هسته)** | ؟[C01](#C01) | ؟[A01](#A01) | ؟[P01](#P01) | ؟[D02](#D02) | ؟[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ؟[L01](#L01) | ؟[T01](#T01) | ✔[W01](#W01) | ✔[H01](#H01) | ✔[K01](#K01) | ✔[F01](#F01) |
| دسترسی آنلاین/موبایل **(هسته)** | ✔[C15](#C15) | ✔[A01](#A01) | ✔[P01](#P01) | ؟[D02](#D02) | ✔[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ✔[L02](#L02) | ✔[T02](#T02) | ✔[W01](#W01) | ؟[H01](#H01) | ؟[K01](#K01) | ؟[F01](#F01) |
| آفلاین/مستقل محلی اعلام‌شده | ✔[C04](#C04) | ؟[A01](#A01) | ✔[P01](#P01) | ؟[D02](#D02) | ؟[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ؟[L01](#L01) | ؟[T01](#T01) | ؟[W01](#W01) | ؟[H01](#H01) | ؟[K01](#K01) | ؟[F01](#F01) |
| خروجی یا گزارش زمان‌بندی‌شده **(هسته)** | ✔[C04](#C04) | ؟[A01](#A01) | ؟[P01](#P01) | ؟[D02](#D02) | ✔[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ✔[L02](#L02) | ؟[T01](#T01) | ؟[W01](#W01) | ؟[H01](#H01) | ؟[K01](#K01) | ؟[F01](#F01) |
| کنترل الکترونیکی تطبیق ظرفیت/اضافه‌بار **(هسته)** | ✔[C01](#C01) | ✔[A01](#A01) | ؟[P01](#P01) | ؟[D02](#D02) | ؟[E01](#E01) | ؟[M01](#M01) | ؟[R01](#R01) | ؟[L01](#L01) | ✔[T01](#T01) | ؟[W01](#W01) | ؟[H01](#H01) | ؟[K01](#K01) | ؟[F01](#F01) |

**هسته‌های مستندشده (≥۳ خانواده مستقل):** تشخیص پلاک ANPR؛ RFID شناسایی خودرو؛ راهبند/چراغ هدایت؛ ترمینال راننده/عملیات بی‌اپراتور؛ تراکنش باسکول و وزن خودکار؛ ثبت تارای خودرو/وزن خالص؛ چند باسکول/چند ایستگاه؛ دوربین و عکس رخداد وزن؛ زمان و هویت تراکنش؛ کنترل سفارش/مجوز تجاری؛ ارتباط ERP/حسابداری؛ داشبورد/گزارش مدیریتی؛ حسابرسی/ضدتقلب اظهارشده؛ KPI سیکل/تولید/شیفت ناوگان؛ بهینه‌سازی تخصیص ماشین معدنی؛ دسترسی آنلاین/موبایل؛ خروجی یا گزارش زمان‌بندی‌شده؛ کنترل الکترونیکی تطبیق ظرفیت/اضافه‌بار.

**تفاوت‌های متمایز:** قابلیت تشخیص خرابی/رانش تک‌لودسل [M01](#M01)[R01](#R01)؛ LiDAR اسکن خالی و پر و 3D [L01](#L01)؛ اتصال سفارش scalehouse به لودر [T01](#T01)؛ مدیریت صف و تخصیص پویا [K01](#K01)[W01](#W01)؛ تله ضدسرقتِ خروج بدون ذخیره رکورد [C02](#C02)؛ شواهد تصویری وزن اول/دوم [C03](#C03)؛ فهرست سفارش و مانده در Tally [C05](#C05). **هشدار:** دو منبع در یک شرکت به‌معنی دو نمونه مستقل نیست.

### ۳.۱ طبقه‌بندی A تا L و نتیجه استخراج

| گروه | شواهد محصول مبنا (Codeshilp) | استنتاج یا شکاف | پیشنهاد سامانه ما |
|---|---|---|---|
| A شناسایی/کنترل تردد | ANPR، HF/UHF RFID، راهبند، چراغ، سنسور موقعیت، PA و LED [C01](#C01)[C02](#C02) — **تأییدشده: اعلام فروشنده** | فرکانس دقیق MHz، برد متر، چرخه interlock، اینترکام: **نامشخص** | Device Registry، هویت چندحسگری، الگوی deny-by-default **پیشنهادی** |
| B وزن | دریافت خودکار، FIRST/SECOND، تارای موجود در جدول خودرو، عکس و قبض [C03](#C03)[C04](#C04) | axle weighing و وزن چندمرحله‌ای استاندارد: **نامشخص** | حالت inbound/outbound، دو باسکول، تجمیع چند رویداد **پیشنهادی** |
| C هویت تراکنش | راننده، پلاک، مشتری، supplier، product، تاریخ/ساعت، شناسه ticket [C03](#C03)[C09](#C09) | عیار و مختصات برداشت: **نامشخص** | origin، destination، grade، پیمانکار، lot/batch **پیشنهادی** |
| D مجوزها | Sales/Purchase Order و Delivery/Receipt Note در Tally [C05](#C05) | مجوز حمل معدنی، سقف سهمیه، امضای دیجیتال: **نامشخص** | Permit Engine با مصرف اتمیک مانده **پیشنهادی** |
| E زمان‌ها/تردد | entry/exit times در معرفی ANPR [C01](#C01) | استنتاج زمان صف از رکوردهای دقیق محوطه نیازمند gate sensors است | محاسبه turnaround و queue *فقط با رویداد واقعی* **پیشنهادی** |
| F سلامت/کالیبراسیون | Cloud Reporting اعلان maintenance عمومی ذکر می‌کند [C04](#C04) | تشخیص کالیبراسیون خارج از محدوده بدون آزمون مرجع امکان‌پذیر نیست؛ load cell diagnostics خاص **تأیید نشده** | جداکردن CertificateStatus و DiagnosticHealth **پیشنهادی** |
| G LiDAR/حجم | برای Codeshilp هیچ شاهد مستقیمی یافت نشد | در Loadscan MPS اسکن خالی/پر و 3D مستند است [L01](#L01) | افزونه اختیاری حجم، تأیید چگالی و عدم جایگزینی جرم تجاری **پیشنهادی** |
| H ناوگان/تولید | Codeshilp به Quarry Management اشاره می‌کند [C02](#C02) | KPI شیفت، سوخت و توزیع بار در ANPR مبنا اثبات نشد | افزونه FMS با تعاریف قابل ممیزی **پیشنهادی** |
| I داشبورد/گزارش | کارت Pending Upload، مسترها، Truck Summary و Tally Queue [C04](#C04) | تمپلیت گزارش سفارشی و mobile ANPR کامل اثبات نشد | فیلترهای سایت/شیفت/ماده/مشتری و فایل CSV/PDF **پیشنهادی** |
| J یکپارچه‌سازی | ERP/SAP/API، Tally، RS232، در Comport Utility ادعای Modbus/RS485 [C01](#C01)[C05](#C05)[C14](#C14) | OPC UA/MQTT برای ANPR **تأیید نشده** | Adapter SDK و Outbox **پیشنهادی** |
| K امنیت | Role، audit، هشدار تکرار وزن و گزارش ضدسرقت [C01](#C01)[C02](#C02) | اثبات tamper-proof، شناسایی تعویض پلاک، نوع رمزگذاری: **نامشخص** | cryptographic evidence + MFA + segregation of duties **پیشنهادی** |
| L استقرار | Windows UI، کنترلر IoT با backend، cloud reporting و اشاره به offline/online [C02](#C02)[C03](#C03)[C04](#C04) | معماری شبکه/پایگاه‌داده/HA/حجم ذخیره‌سازی: **نامشخص** | Local-first Edge Gateway و Central API **پیشنهادی** |

## ۴. PRD — مشخصات نیازمندی محصول

### ۴.۱ هدف و مرز محصول

**هدف:** ساخت سامانه چندسایتی مدیریت ورود/خروج، شناسایی خودرو، دو مرحله توزین، تطبیق مجوز، ثبت شواهد و گزارش معدن با معماری توسعه‌پذیر. **خارج از MVP:** الگوریتم تشخیص حجم اختصاصی، FMS تخصیص پویای کامیون، کنترل قانونی کالیبراسیون خودکار و استقرار خودران بدون بازدید HAZOP/PLC؛ این‌ها پروژه‌های جداگانه‌اند. کپی لوگو، رنگ سازمانی و layout پیکسلی رقبا ممنوع است.

### ۴.۲ نقش‌های کاربری و اختیارات

| نقش | هدف عملیاتی | Scope Permission پیشنهادی |
|---|---|---|
| اپراتور باسکول | ثبت/بررسی وزن و شواهد | `capture_weight,review_anpr,print_ticket` |
| نگهبان دروازه | کنترل مجوز تردد | `view_vehicle,barrier_request` |
| مدیر شیفت | مدیریت استثنا و عملکرد | `ack_alert,shift_report` |
| دیسپچر/مسئول حمل | برنامه تردد و صف | `manage_trip,view_queue` |
| واحد بازرگانی/فروش | مجوز و سقف سفارش | `manage_permit,approve_order` |
| حسابداری | صورتحساب و مغایرت ERP | `reconcile,export_invoice` |
| ناظر کالیبراسیون | گواهی/وضعیت تجهیز | `verify_calibration,view_diagnostics` |
| مدیر معدن | KPI/گزارش تولید | `analytics_read` |
| ادمین IT/OT | تجهیز، نقش و لاگ | `configure_device,rbac,audit_read` |
| راننده (کیوسک) | تأیید پلاک و دستور حرکت | `kiosk_self_service` |

### ۴.۳ داستان‌های کاربر (User Stories)

- US-01 به‌عنوان نگهبان می‌خواهم پلاک و RFID پیش از باز شدن راهبند با مجوز تطبیق داده شوند تا خودرو غیرمجاز وارد نشود.
- US-02 به‌عنوان اپراتور می‌خواهم وزن خام، ثبات، عکس و موقعیت خودرو یک‌جا نمایش داده شوند تا ثبت معتبر انجام شود.
- US-03 به‌عنوان مسئول فروش می‌خواهم هر تراکنش به حواله با مانده معتبر متصل باشد تا بیش از مجوز تحویل نشود.
- US-04 به‌عنوان ناظر کالیبراسیون می‌خواهم تاریخ گواهی و سلامت سخت‌افزار جدا نمایش داده شود تا هشدار کاذب تولید نشود.
- US-05 به‌عنوان مدیر شیفت می‌خواهم تناژ خالص و تعداد سفر بر اساس زمان نهایی تراکنش و فیلتر سایت/شیفت استخراج شوند.
- US-06 به‌عنوان مدیر بارگیری می‌خواهم سفارش باسکول به لودر برسد و payload لودر با وزن خروجی تطبیق شود.
- US-07 به‌عنوان نگهبان می‌خواهم خروج بدون وزن ثبت‌شده به‌صورت رخداد ضدتقلب ضبط و علامت‌گذاری شود.
- US-08 به‌عنوان دیسپچر می‌خواهم خودروهای منتظر و مدت ماندگاری را ببینم تا صف را مدیریت کنم.
- US-09 به‌عنوان مدیر مالی می‌خواهم وضعیت ارسال هر قبض به ERP و خطاهای همگام‌سازی روشن باشد.
- US-10 به‌عنوان کارشناس معدن می‌خواهم حجم LiDAR و جرم باسکول دو اندازه‌گیری مستقل باشند و اختلافشان ثبت شود.
- US-11 به‌عنوان مدیر سامانه می‌خواهم در زمان قطع WAN توزین در کنترلر محلی طبق سیاست ادامه یابد و بعداً با dedupe همگام شود.
- US-12 به‌عنوان حسابرس می‌خواهم هر اصلاح قبض همراه با هویت، نسخه و علت در audit غیرقابل دستکاری قابل مشاهده باشد.

### ۴.۴ الزامات کارکردی (Functional Requirements)

**توجه:** هر FR یک *نیازمندی پیشنهادی برای محصول جدید* است؛ ستون شاهد فقط منبع الهام مشابه را نشان می‌دهد، نه وجود کامل FR در آن شرکت. `P0` MVP، `P1` فاز ۲، `P2` افزونه است.

| کد | الزام قابل پیاده‌سازی | اولویت | منبع الهام |
|---|---|---|---|
| FR-01 | ثبت سایت، مسیر، باسکول و تجهیزات | P0 | [C01](#C01) |
| FR-02 | دریافت وزن زنده از indicator با Device Adapter و ثبت داده خام | P0 | [C01](#C01) |
| FR-03 | اعلام پایداری وزن، حالت zero، overload و کیفیت ارتباط | P0 | [C02](#C02) |
| FR-04 | تشخیص پلاک با confidence، snapshot و تأیید اپراتور برای موارد مبهم | P0 | [C01](#C01) |
| FR-05 | خواندن RFID و تطبیق آن با شناسه خودرو، راننده و پلاک | P0 | [C02](#C02) |
| FR-06 | ثبت رویدادهای ورود/خروج و موقعیت دروازه | P0 | [C01](#C01) |
| FR-07 | کنترل ایمن راهبند، چراغ، نمایشگر و سنسور موقعیت | P0 | [C02](#C02) |
| FR-08 | مدیریت masterهای خودرو، راننده، شرکت حمل، مشتری و ماده | P0 | [C04](#C04) |
| FR-09 | ثبت اولین وزن و جلوگیری از انتساب آن به سفر اشتباه | P0 | [C03](#C03) |
| FR-10 | ثبت دومین وزن، محاسبه خالص با جهت ورود/خروج و کنترل علامت | P0 | [C03](#C03) |
| FR-11 | تارای ذخیره‌شده با تاریخ اعتبار، منبع و مجوز استفاده | P0 | [C04](#C04) |
| FR-12 | ثبت سفارش، حواله، مجوز فروش/حمل و اعتبارسنجی مقدار | P0 | [C05](#C05) |
| FR-13 | باز کردن راهبند خروج فقط پس از گذر از قوانین و اتمام تراکنش | P0 | [C02](#C02) |
| FR-14 | ثبت تصاویر هر وزن و اتصال عکس به شناسه رویداد | P0 | [C03](#C03) |
| FR-15 | مدیریت ضدتکرار (idempotency) در خوانش، تراکنش و API | P0 | پیشنهادی/بدون شاهد معادل مستقیم |
| FR-16 | صدور قبض نسخه‌دار با اطلاعات خودرو، وزن و QR راستی‌آزمایی | P0 | [C03](#C03) |
| FR-17 | ثبت عملیات دستی فقط با دلیل، تایید سطح دوم و audit trail | P0 | [C01](#C01) |
| FR-18 | داشبورد صف، وزن لحظه‌ای، رویداد جاری و رخدادهای استثنا | P0 | [C04](#C04) |
| FR-19 | گزارش تراکنش/راننده/شرکت/ماده/شیفت و خروجی CSV/XLSX/PDF | P0 | [C04](#C04) |
| FR-20 | مدیریت نقش‌ها، مجوزهای جزءبه‌جزء و محدوده دسترسی به سایت | P0 | [C01](#C01) |
| FR-21 | گردش کار اصلاح تراکنش با نسخه قبلی و ردپای کامل | P0 | [A01](#A01) |
| FR-22 | آفلاین محلی و همگام‌سازی قابل بازیابی با سرور مرکزی | P0 | [C04](#C04) |
| FR-23 | مدیریت انقضای گواهی و وضعیت سلامت باسکول؛ تفکیک اداری و سنسوری | P0 | پیشنهادی/بدون شاهد معادل مستقیم |
| FR-24 | ارسال رویداد به ERP از صف پایدار با retry و reconciliation | P1 | [C05](#C05) |
| FR-25 | پشتیبانی دو باسکول و مسیر جفت‌شدن رویدادها بین دو ایستگاه | P1 | [P01](#P01) |
| FR-26 | پایش turnaround و طول صف با منبع timestamp مشخص | P1 | [T01](#T01) |
| FR-27 | هشدار خروج بدون ذخیره وزن، پلاک مغایر و موقعیت نامعتبر | P1 | [C02](#C02) |
| FR-28 | مدیریت مجوز/سهمیه، کسری باقیمانده و عدم مصرف مجدد | P1 | [D02](#D02) |
| FR-29 | کانال SMS/Email با الگوهای پیام و لاگ تحویل | P1 | [C01](#C01) |
| FR-30 | ثبت کالیبراسیون، سوابق تست و رسیدگی به هشدار سلامت | P1 | پیشنهادی/بدون شاهد معادل مستقیم |
| FR-31 | استفاده از تشخیص خرابی تک‌لودسل فقط در صورت خروجی پشتیبانی‌شده تجهیز | P1 | [R01](#R01) |
| FR-32 | صفحه موبایل/Responsive برای مدیر، اپراتور و ناظر | P1 | [P01](#P01) |
| FR-33 | پلاگین مستقل LiDAR برای empty reference، اسکن پر، 3D و m³ | P2 | [L01](#L01) |
| FR-34 | ثبت چگالی با بازه اعتبار و محاسبه جرم تخمینی غیرتجاری | P2 | پیشنهادی/بدون شاهد معادل مستقیم |
| FR-35 | پلاگین Payload برای لودر/شاول و تطبیق با باسکول | P2 | [T01](#T01) |
| FR-36 | پلاگین Fleet KPI، نرخ تولید، تعداد سفر، زمان چرخه، تأخیر، سوخت | P2 | [F01](#F01) |
| FR-37 | API و Webhook نسخه‌بندی‌شده برای داده مجوز، وزن، رخداد و اعلان | P1 | [C01](#C01) |
| FR-38 | تعریف شیفت عبوری از نیمه‌شب و انتساب یکتای تراکنش | P1 | پیشنهادی/بدون شاهد معادل مستقیم |
| FR-39 | گزارش مغایرت سه‌طرفه باسکول، حجم و Payload | P2 | پیشنهادی/بدون شاهد معادل مستقیم |
| FR-40 | مدیریت وضعیت دوربین، لودسل، شبکه، PLC و تأخیر heartbeat | P1 | [C02](#C02) |

### ۴.۵ الزامات غیرکارکردی (Non-functional Requirements)

| کد | الزام |
|---|---|
| NFR-01 | هر رویداد یک UUID و زمان UTC به‌همراه offset محلی داشته باشد؛ زمان تجهیز جدا ذخیره شود. |
| NFR-02 | هیچ وزن سنسور در سرور با مقدار دستی جایگزین نشود؛ دو فیلد مستقل و منشأ داده الزامی است. |
| NFR-03 | ثبت نهایی تراکنش اتمیک و تکرار امن باشد؛ unique constraint و idempotency key. |
| NFR-04 | در قطع ارتباط، کنترلر محلی به حالت fail-safe پیکربندی‌شده برود؛ باز کردن خودکار مجاز نیست. |
| NFR-05 | سازگاری با مرورگرهای مدرن، RTL فارسی و LTR برای پلاک/شماره، و WCAG 2.2 AA هدف طراحی است. |
| NFR-06 | حدود تأخیر، نرخ پردازش، SLA و ظرفیت دوربین/تجهیز با آزمون پذیرش سایت تعیین شوند [TBD]. |
| NFR-07 | ارتباطات TLS؛ نگه‌داری محرمانه رازها؛ احراز هویت MFA برای سطوح حساس. |
| NFR-08 | ثبت audit غیرقابل ویرایش عملیاتی با هش زنجیره‌ای یا مخزن WORM متناسب با تهدید. |
| NFR-09 | Retention تصاویر/پلاک و حق حذف/دسترسی مطابق مقررات محل اجرا؛ اعداد [TBD]. |
| NFR-10 | نسخه‌بندی API و Device Adapter؛ تست سازگاری با simulator تجهیزات. |
| NFR-11 | مانیتورینگ uptime، کیفیت ارتباط، queue lag، fail rate، سلامت سنسور و alarms. |
| NFR-12 | پشتیبان‌گیری دوره‌ای و تمرین بازیابی؛ RPO/RTO [TBD] برای هر سایت. |
| NFR-13 | رفع تضاد رخدادهای آفلاین با event append-only و شناسه یکتا، نه last-write-wins روی وزن. |
| NFR-14 | ارقام وزن/حجم با Decimal و واحد ذخیره شوند؛ گرد کردن تابع تأییدیه قانونی و دستگاه است. |
| NFR-15 | کنترلر PLC باید interlock سخت‌افزاری و emergency-stop مستقل از مرورگر داشته باشد. |
| NFR-16 | سوابق کالیبراسیون/گواهی فقط توسط ناظر مجاز ثبت و با سند امضاشده پیوست شوند. |

### ۴.۶ معیارهای پذیرش (Acceptance Criteria)

- **AC-01:** RFID و پلاک همخوان + مجوز معتبر + وضعیت تجهیزات مجاز → اجازه ورود؛ هر عدم‌قطعیت مؤثر → صف بررسی، نه عبور خودکار.
- **AC-02:** اگر نمونه سنسور weight unstable یا سنسور position نادرست باشد، `WeighEvent` نهایی ثبت نشود؛ فقط رویداد خام خطادار ذخیره گردد.
- **AC-03:** تراکنش دووزنی دارای `first`, `second`, زمان، عکس، `weight_source` و `gross−tare=net` باشد؛ `net` غیرمنطقی سبب HOLD شود.
- **AC-04:** دو درخواست موازی برای یک مجوز فقط به اندازه مانده واقعی آن را مصرف کنند (transaction isolation / optimistic lock).
- **AC-05:** دو بار دریافت یک پیام indicator یا ERP با کلید یکتا، فقط یک بار اثر تجاری ایجاد کند.
- **AC-06:** گواهی کالیبراسیون منقضی → خروجی «اعتبار سند منقضی»؛ تشخیص لودسل خراب تنها با خروجی دستگاه سازگار؛ این دو هرگز یک هشدار تلقی نشوند.
- **AC-07:** قطع WAN با سیاست سایت آزموده شود؛ پس از وصل، ترتیب منطقی/یکتایی شناسه‌ها و حفظ شواهد برقرار بماند.
- **AC-08:** گزارش shift پایان/آغاز در نیمه‌شب و اختلاف timezone را درست اعمال کند و reaggregation قابل اجرا باشد.
- **AC-09:** هر تغییر دستی دارای before/after، actor، reason و تایید دوم باشد و رکورد original قابل حذف فیزیکی نباشد.
- **AC-10:** تست ایمنی barier/traffic light مستقل از سیستم وب و بر پایه interlock تایید‌شده اجرا شود.

## ۵. جریان‌های کاری (Workflows)

### ۵.۱ ورود → وزن اول → بارگیری → وزن دوم → خروج

1. **Pre-authorization:** سامانه سفارش/حواله/مجوز را از ERP دریافت و با سقف اعتبار، ماده، شرکت و پلاک تطبیق می‌کند؛ نبود مجوز → `WAIT_APPROVAL`.
2. **ARRIVAL:** trigger حلقه القایی/سنسور حضور یا دوربین، `GateEvent(ARRIVAL)` با timestamp خام می‌سازد.
3. **IDENTIFY:** ANPR تصویر و confidence می‌دهد؛ RFID شناسه تگ را ارائه می‌کند؛ تطبیق چندحسگری و احتمالاً انتخاب راننده در کیوسک انجام می‌شود.
4. **AUTHORIZE_ENTRY:** موتور قواعد، وجود مجوز، وضعیت ماشین و راننده، blocked list و ظرفیت سایت را می‌سنجد؛ PLC تنها پس از گرفتن پاسخ مجاز و برقراری interlock راهبند را باز می‌کند.
5. **ON_SCALE_1:** سنسورهای استقرار کامل، حالت stable و zero/reference را تأیید می‌کنند؛ یک `WeighEvent(sequence=1)` ثبت می‌شود. چهار دوربین شواهد را ذخیره می‌کنند.
6. **CLASSIFY:** برای فروش از معدن معمولاً وزن اول تارا و وزن دوم ناخالص است؛ برای تخلیه ورودی ممکن است ترتیب برعکس باشد. جهت عملیات (`direction`) قواعد gross/tare را تعیین می‌کند؛ فرض اینکه «وزن اول همیشه ناخالص است» ممنوع.
7. **LOADING/UNLOADING:** مقصد/مبدأ، ماده، grade و محل بارگیری ثبت می‌شود. اگر ماژول لودر فعال باشد، `PayloadEvent` به تراکنش لینک می‌شود.
8. **ON_SCALE_2:** در همان باسکول یا باسکول مجاز دوم، هویت و تراکنش دوباره تأیید و وزن دوم پایدار با تصویر ثبت می‌شود؛ برای بار خروجی: `gross=max(valid loaded reading)`، `tare=empty reading` (نه انتخاب بی‌قاعده صرفاً با بیشینه بودن وزن).
9. **CALCULATE:** `net_kg = gross_kg − tare_kg`; برآورد حجمی جدا از جرم (در صورت افزونه) ثبت می‌شود.
10. **VALIDATE:** سقف مجوز، gross مجاز خودرو، ماده، مقصد، تناژ، تاریخ، جلوگیری از توزین تکراری و انقضای گواهی باسکول ارزیابی می‌شوند؛ خطا → `ON_HOLD`.
11. **COMMIT:** به‌صورت atomic شماره قبض، مانده مجوز و `Transaction(COMPLETED)` ثبت؛ عملیات API ارسال به ERP در outbox نوشته می‌شود.
12. **EXIT:** فقط پس از `COMPLETED/APPROVED` و سلامت interlock، راهبند خروج فرمان مجاز می‌گیرد؛ رویداد `EXIT` ثبت و Turnaround محاسبه می‌شود.
13. **POSTING:** چاپ/ارسال قبض و ارسال به ERP/حسابداری؛ شکست اتصال ERP تراکنش را تکرار نمی‌کند، بلکه یک پیام Outbox در وضعیت retry دارد.

**ماشین حالت پیشنهادی:** `EXPECTED → ARRIVED → VERIFIED → ENTERED → FIRST_WEIGHED → LOADING → SECOND_WEIGHED → VERIFIED_PERMIT → COMPLETED → EXITED` با شاخه‌های `HOLD`, `CANCELLED`, `MANUAL_REVIEW` و انتقال فقط توسط policy engine.

### ۵.۲ فرآیند استثنائات

- **پلاک ناخوانا:** نسخه تصویر حفظ شود؛ اپراتور با دو عامل شاهد مجاز به اصلاح شناسه است؛ رکورد `PlateRead` اولیه تغییر نمی‌کند.
- **قطع اینترنت:** کنترلر محلی وزن و تصویر را append-only ذخیره می‌کند؛ خروج طبق سیاست مصوب سایت، نه شرط بی‌قاعده sync ابری.
- **خودرو نیمه‌روی باسکول:** sensor false → بلاک ثبت؛ تصویر ثبت و پرچم incident.
- **خرابی باسکول:** event type `DEVICE_ERROR`، قفل تراکنش جدید مطابق سایت؛ تغییر باسکول تنها با trace و مجوز.
- **مجوز پایان‌یافته:** `HOLD`; سوپروایزر نمی‌تواند مانده را با تغییر وزن محاسبه‌شده دور بزند؛ اصلاح از سیستم مالک مجوز انجام شود.
- **تناقض LiDAR با باسکول:** گزارش اختلاف و مسیر نمونه‌برداری چگالی؛ جرم رسمی باسکول overwrite نشود.

## ۶. مدل داده و روابط (Canonical Data Model)

**قرارداد:** شناسه‌ها UUID، اعداد جرم kg و حجم m³ با Decimal؛ زمان ذخیره در UTC، منطقه زمانی سایت جدا؛ null به معنای «اندازه‌گیری نشده» و نه صفر است؛ `plate_normalized` رشته است؛ همه تصاویر در Object Storage با hash/evidence reference؛ کلید خارجی enforce و تغییرات historyمند باشند.

| موجودیت | فیلدهای پیشنهادی (معادل نام دیتابیس) |
|---|---|
| `Site` | `id UUID PK`, `code unique`, `name`, `timezone`, `location`, `status` |
| `Gate` | `id`, `site_id FK`, `direction IN|OUT|BOTH`, `lane_id`, `controller_id`, `status` |
| `Vehicle` | `id`, `plate_normalized`, `plate_country`, `vehicle_class`, `axle_count`, `max_gvw_kg nullable`, `default_tare_kg nullable`, `tare_valid_until nullable`, `rfid_tag_id nullable`, `active` |
| `Driver` | `id`, `name`, `license_number_hash_or_token`, `carrier_id FK nullable`, `phone_protected`, `active` |
| `Carrier` | `id`, `legal_name`, `registration_no`, `contacts`, `active` |
| `Customer` | `id`, `name`, `external_erp_id`, `role CUSTOMER|SUPPLIER|BOTH`, `active` |
| `Material` | `id`, `code`, `name`, `material_type`, `grade_label nullable`, `measurement_unit`, `default_density_kg_m3 nullable` |
| `Permit` | `id`, `kind SALE|TRANSPORT|PURCHASE|DISPATCH`, `external_ref`, `customer_id`, `carrier_id nullable`, `material_id`, `valid_from`, `valid_to`, `max_net_kg nullable`, `remaining_kg nullable`, `max_vehicle_gvw_kg nullable`, `status`, `revision` |
| `Transaction` | `id UUID`, `site_id`, `vehicle_id`, `driver_id nullable`, `carrier_id nullable`, `customer_id nullable`, `material_id`, `permit_id nullable`, `origin_id`, `destination_id`, `shift_id`, `status`, `direction INBOUND|OUTBOUND`, `gross_kg nullable`, `tare_kg nullable`, `net_kg nullable`, `first_weigh_at nullable`, `second_weigh_at nullable`, `entry_at nullable`, `exit_at nullable`, `hold_reason nullable`, `revision`, `created_at` |
| `WeighEvent` | `id`, `transaction_id`, `scale_id`, `sequence_no`, `weight_kg Decimal`, `raw_payload`, `stable_flag`, `zero_flag`, `capture_method SENSOR|MANUAL`, `captured_at_utc`, `device_at nullable`, `operator_id nullable`, `manual_override_reason nullable`, `image_refs`, `calibration_snapshot_id nullable` |
| `GateEvent` | `id`, `vehicle_id nullable`, `transaction_id nullable`, `gate_id`, `event_type ARRIVAL|BARRIER_OPEN|ENTRY|EXIT|DENY`, `timestamp_utc`, `source`, `rfid_read_id nullable`, `plate_read_id nullable`, `decision_reason` |
| `Camera` | `id`, `site_id`, `gate_id nullable`, `scale_id nullable`, `stream_ref_secret`, `position FRONT|REAR|TOP|SIDE`, `status`, `heartbeat_at` |
| `PlateRead` | `id`, `camera_id`, `observed_at`, `plate_raw`, `plate_normalized`, `confidence`, `vehicle_id nullable`, `image_uri`, `bbox`, `review_status`, `model_version` |
| `RFIDRead` | `id`, `reader_id`, `tag_epc`, `frequency_band HF|UHF|OTHER`, `observed_at`, `vehicle_id nullable`, `signal_quality nullable` |
| `Scale` | `id`, `site_id`, `indicator_model`, `driver_adapter_id`, `serial_no`, `capacity_kg`, `division_kg`, `mode STATIC|DYNAMIC`, `metrology_status`, `last_zero_check_at`, `calibration_due_at`, `health_state` |
| `CalibrationRecord` | `id`, `scale_id`, `certificate_no`, `issuer`, `performed_at`, `expires_at`, `document_uri`, `document_sha256`, `verified_by`, `certificate_status`, `test_results_json` |
| `Alert` | `id`, `rule_id`, `severity INFO|WARN|CRITICAL`, `entity_type`, `entity_id`, `opened_at`, `status OPEN|ACK|RESOLVED`, `evidence_refs`, `ack_by nullable`, `resolved_by nullable` |
| `Shift` | `id`, `site_id`, `shift_code`, `start_at_utc`, `end_at_utc`, `production_plan_kg nullable`, `timezone` |
| `Equipment` | `id`, `site_id`, `kind TRUCK|LOADER|SHOVEL|SCALE|SCANNER`, `external_fms_id nullable`, `manufacturer`, `model`, `status` |
| `LidarScan` | `id`, `transaction_id nullable`, `scanner_id`, `vehicle_id`, `scan_type EMPTY|LOADED`, `reference_scan_id nullable`, `volume_m3 nullable`, `pointcloud_uri nullable`, `profile_uri nullable`, `density_kg_m3 nullable`, `estimated_mass_kg nullable`, `quality_flag`, `captured_at`, `legal_use_flag` |
| `PayloadEvent` | `id`, `transaction_id nullable`, `equipment_id`, `truck_id nullable`, `material_id`, `payload_kg`, `bucket_count nullable`, `operator_id nullable`, `timestamp`, `sensor_source`, `confidence nullable` |
| `AuditLog` | `id`, `actor_id`, `action`, `entity_type`, `entity_id`, `before_hash`, `after_hash`, `reason nullable`, `occurred_at`, `device_id`, `correlation_id` |
| `DeviceEvent` | `id`, `device_id`, `kind HEARTBEAT|ERROR|STATUS|INPUT`, `timestamp`, `payload_json`, `quality`, `correlation_id` |
| `IntegrationOutbox` | `id`, `topic`, `aggregate_id`, `event_version`, `payload_json`, `status`, `attempt_count`, `next_retry_at`, `idempotency_key` |

### ۶.۱ کلیدها، کاردینالیتی و یکپارچگی

- `Site 1:N Scale`, `Site 1:N Gate`, `Scale 1:N WeighEvent` و `Transaction 1:N WeighEvent`؛ استاندارد دووزن الزام نیست که دقیقاً دو رویداد خام وجود داشته باشد: ممکن است retry و invalid event هم باشند.
- `Vehicle 1:N Transaction`, `Driver 1:N Transaction`, `Permit 1:N Transaction`، مجوز فقط پس از reserve/commit از مانده کسر می‌شود.
- `Transaction 1:N PlateRead/RFIDRead` با linkage از طریق `GateEvent` و `correlation_id`؛ هر خوانش خام ممکن است ابتدا بدون vehicle_id باشد.
- `Vehicle 1:N LidarScan`; `EMPTY` مرجع وابسته به نوع بدنه، بن/اتاق بار و پیکربندی است؛ استفاده از مرجع خودروی دیگر ممنوع.
- `PayloadEvent` رابطه صفر/چند با `Transaction`، چون داده‌ لودر ممکن است دیر برسد.
- Uniqueها: `scale + sequence + stable_sample_id`, `external permit ref + source`, `device message id`, `site+ticket_no+fiscal_year` در صورت الگوی شماره‌دهی انتخابی.
- ممنوعیت hard delete برای `WeighEvent`, `Transaction`, `AuditLog`, `CalibrationRecord` و Evidence؛ اصلاح با revision/superseded_by.
- فیلدهای حساس راننده باید تحت سیاست داده و حداقل‌گرایی حفاظت شوند؛ هش شماره گواهی برای جست‌وجوی مساوی و نمایش masked مناسب‌تر از تکثیر شماره کامل است.

### ۶.۲ محاسبات رسمی و مراقبت متروژیک

`net_kg = gross_kg - tare_kg` تنها وقتی مقادیر هر دو معتبر و منطبق با یک تراکنش/خودرو باشند. `volume_m3 = loaded_bin_volume - empty_bin_reference_volume` با ثبت الگوریتم و quality score. `estimated_mass_kg = volume_m3 × bulk_density_kg_m3` **تخمین فنی** است، نه وزن تجاری؛ چگالی باید منشأ، تاریخ نمونه، رطوبت/تراکم و عدم‌قطعیت داشته باشد. `turnaround_s = exit_at − entry_at` فقط اگر هر دو رویداد موجود و معتبر باشند. 

شاخص تولید شیفت پیشنهادی: `production_t = SUM(net_kg for eligible completed transactions assigned to shift) / 1000`; شاخص سفر: `COUNT(DISTINCT transaction_id)`؛ `cycle_time` از نقاط آغاز/پایان تعریف‌شده FMS و event schema معتبر استخراج می‌شود؛ سوخت فقط با سنسور/لاگ سوخت و کیفیت داده معلوم گزارش می‌شود. از عبارت «بهره‌برداری» بدون تعریف تفکیک `utilization` و `availability` استفاده نشود.

## ۷. مشخصات UI/UX و تحلیل شواهد تصویری

### ۷.۱ ممیزی تصویر به تصویر

**IMG-01 — فرم توزین چهار دوربین** ([C09](#C09) و [C03](#C03)، PDF ص۱): پنجره دسکتاپ آبی/خاکستری، نوار عنوان *Weighing Form*، ستون چپ نمایش عددی وزن با ارقام درشت زرد، Capture Weight، کنترل‌های Empty/Loaded، جدول نتیجه و timestamp؛ ستون میانی فیلدهای Sales، Vehicle، Driver، Customer، Supplier، Container/Seal، Product، Rate/Tax/Amount و دکمه Sync SAP؛ ستون راست شبکه دو در دو دوربین و ستون عمودی Save/Edit/Delete/Print؛ پایین کنترل Barrier 1/2 و Signal 1/2 و نوار لاگ اتصال ANPR/IoT. **اطمینان:** تأییدشده از تصویر؛ دکمه‌های نمایش‌داده‌شده لزوماً نشانه فعال بودن همه اتصالات در دمو نیستند. صفحه فاقد فضای KPI مدیریتی غنی است.

**IMG-02 — قبض وزن اول و دوم** ([C03](#C03)، PDF ص۳): چهار قبض نمونه با مشخصات مشتری، پلاک، نوع تراکنش، ساعت وزن اول/دوم، gross/tare/net، تصاویر قبل/بعد در دو ردیف و بعضاً محل امضا. **تأییدشده از تصویر.** وجود عکس در قبض، به‌معنای تأیید forensic integrity نیست.

**IMG-03 — داشبورد WMS Reporting** ([C04](#C04)، PDF ص۱): نوار کناری تیره با `Dashboard / Master / Transaction / Utility / Reports`، header سفید، کارت بنفش خلاصه `Pending to upload` و نمای سفید مینیمال؛ KPI ساختار ساده و تک‌کارته دارد، نه نمودار ناوگان. **تأییدشده از تصویر.**

**IMG-04 — Company/Vehicle Master** ([C04](#C04)، PDF ص۲): ناوبری Master باز؛ جدول سفید با search و page size و pagination، اطلاعات شرکت؛ جدول خودرو دارای شماره خودرو و `Tare_Wt`؛ اثبات وجود رکورد تارای ذخیره‌شده، نه الگوریتم اعتبارسنجی بازه تارا. **تأییدشده از تصویر.**

**IMG-05 — Product/Transporter Master** ([C04](#C04)، PDF ص۳): دو جدول مستقل با `Product Name`, `Unit_Name`, `Standard_Weight` و `Transporter`؛ همسانی Sidebar؛ **تأییدشده از تصویر.**

**IMG-06 — Pending Upload to Tally / Truck Wise Summary** ([C04](#C04)، PDF ص۴): جدول صف انتقال شامل Ticket، Party، Vehicle، Gross/Tare/Net و انتخاب رکورد؛ گزارش کامیون با وزن، تاریخ، شرکت حمل، کالا، source/destination و فیلدهای زمانی؛ **تأییدشده از تصویر.** مشخص نیست آیا retry خودکار و queue durable است.

**IMG-07 — ANPR concept render** ([C11](#C11)): کامیون رندرشده، موقعیت دوربین و یک پلاک خوانده‌شده در کنار لپ‌تاپ؛ **تصویر مفهومی (استنباطی)**؛ از آن نباید عرض باند، accuracy یا الگوریتم تشخیص را استنتاج کرد. تصاویر `anpr-wb-2.png` و `anpr-wb-3.png` نیز عمدتاً عکس ماشین/راه‌بندند، نه نمای قابل مهندسی UI. **تأییدشده از مشاهده.**

**IMG-08 — Avery/Precia/Loadscan/Wenco**: متن محصولات رسمی برای عناصر رابط راهنماست [A01](#A01)[P01](#P01)[L02](#L02)[W01](#W01)؛ تصویرهای دقیق هم‌مقیاسِ این محصولات در این بررسی به‌صورت صفحه‌به‌صفحه ممیزی نشده‌اند. طراحی معادل باید از نیازمندی‌های این سند پیروی کند، نه وانمودکردن به بازسازی اسکرین‌شاتِ ندیده.

### ۷.۲ طراحی مستقل پیشنهادی

**هویت بصری جدید:** رنگ زمینه `#F7F9FC`، سایدبار `#102A43`، اصلی `#1677A8`، وضعیت امن سبز `#26866D`، اخطار کهربایی `#D89D28` و بحرانی قرمز `#C84242`؛ این‌ها **پیشنهادی** و نه رنگ‌های رسمی Codeshilp هستند. از سیستم ۸px spacing، فونت فارسی خوانا، اعداد tabular، UX RTL با grid مناسب LTR برای plate/serial، وضعیت آنلاین/آفلاین واضح و keyboard shortcuts استفاده شود. وضعیت وزن از رنگ به‌تنهایی منتقل نشود.

| مسیر/صفحه پیشنهادی | اجزای صریح و رفتار |
|---|---|
| `/dashboard` نمای مدیر معدن | KPI تولید شیفت (t)، سفر، تعداد تراکنش HOLD، میانگین turnaround، صف زنده، availability باسکول، وضعیت ارسال ERP؛ نمودار تناژ ساعتی و ماده/مقصد؛ فیلتر سایت/بازه/شیفت |
| `/operations/live` اتاق کنترل | ردیف باسکول‌ها، وزن زنده، stable/zero flags، پلاک+RFID، شبکه ۲×۲ دوربین، رنگ چراغ و راهبند، رویدادهای خام و هشدارها |
| `/transactions/new` فرم توزین | شناسه خودرو/راننده، ماده، مجوز، وزن اول/دوم، gross/tare/net، عکس‌ها، ثبت دکمه Capture، Receipt preview و قفل منطقی |
| `/transactions` تاریخچه | جدول Ticket, Plate, Permit, Material, Net, FirstAt, SecondAt, Site, Operator, SyncStatus و فیلترها |
| `/transactions/:id` جزئیات | Timeline کامل از Gate→ANPR/RFID→First→Second→Permit→Exit؛ عکس/وزن/Actor/Hash و revision |
| `/gate` کنترل دروازه | صف شناسایی، confidence، مغایرت‌ها، مجوز، approve/deny، وضعیت interlock و فرمان با کنترل دسترسی |
| `/queue` مدیریت صف | زمان ورود، مدت انتظار، مرحله کنونی، مسیر مجاز، رنگ وضعیت، فیلتر حمل‌کننده |
| `/permits` مجوزها | Order/Transport permit، سقف مجاز، مصرف‌شده/مانده، تاریخ اعتبار، وضعیت تعلیق و ارتباط ERP |
| `/masters` اطلاعات پایه | Vehicle, Driver, Carrier, Customer, Material, Origin, Destination, Grade, Saved Tare |
| `/shifts` شیفت/تولید | ساعات مرزی، نرخ تولید، تعداد سفر، علت تأخیر، مشاهده تعداد رویداد داده‌ناقص |
| `/equipment/scales` باسکول‌ها | ظرفیت، indicator، last stable reading، آخرین heartbeat، وضعیت مجاز بودن سند و لاگ diagnostics |
| `/calibration` سوابق | جدول گواهی، اعتبار، issuer، فایل سند، مهلت پایان، audit؛ جدا از وضعیت خرابی سلول |
| `/alerts` هشدارها | دسته، سطح بحرانی، زمان، evidence، ack, assignee, SLA, resolution reason |
| `/reports` گزارش‌ها | templates، preview، PDF/XLSX/CSV، توزیع وزن، ماده، خودرو، شرکت، حوادث، برنامه گزارش |
| `/integrations` یکپارچه‌سازی | اتصالات ERP/PLC/scale؛ آخرین sync، خطا، outbox و dead-letter؛ مجوز تست اتصال |
| `/modules/volume` LiDAR | وضعیت اسکنر، نقشه ارتفاع/پروفایل 3D، empty reference، volume، compare mass |
| `/modules/payload` Payload | loader/shovel، truck ID، target/actual، تعداد bucket، انحراف از باسکول |
| `/modules/fleet` KPI ناوگان | نرخ تولید، تناژ کامیون، utilization، idle، wait، سفر، cycle-time distribution، fuel با داده واقعی |
| `/admin` امنیت/پیکربندی | Users/Roles/Policies, sites, adapters, rules, thresholds, feature flags, audit viewer |

**نکته طراحی:** مرکز عملیات باید first-person، فشرده و keyboard-driven باشد؛ داشبورد مدیر باید تحلیلی، نموداری و responsive باشد. نباید فرم سنگین Codeshilp را عیناً بازسازی کرد. دو سطح UX مجزا داشته باشید.

## ۸. معماری، یکپارچه‌سازی‌ها و پروتکل‌ها

```text
[ANPR IP Camera]   [RFID HF/UHF]   [Loop/Position Sensors]   [Scale Indicator]   [Lidar optional]
      |                 |                  |                      |                  |
      +-----------------+------------------+----------------------+------------------+
                                         |
                               [Local OT Edge Gateway]
                            protocol adapters + spool WAL
                                         |
                         [Deterministic Rules + Evidence Store]
                                         |
                           [Secure LAN / optional WAN Sync]
                                         |
                    +----------------[Central API]----------------+
                    |                   |                         |
            [Transaction DB]      [Outbox/EventBus]       [Object Storage]
                    |                   |                         |
             [Dashboards/UI]       [ERP/SAP/Tally]          [Images/3D]
                    |
                [Alerts & Audit]
                        [+ Optional: Payload Adapter / Mine FMS Connector]
```

| اتصال | کدام بخش تأییدشده است؟ | پیشنهاد و قرارداد قابل تست |
|---|---|---|
| indicator باسکول | Codeshilp امکان RS232/COM را اعلام کرده [C02](#C02)[C03](#C03) | `ScaleAdapter.connect/read/stability/zero/diagnostics`; RS232/RS485/Ethernet فقط مطابق مدل واقعی؛ پارس frame، checksum، ثبات، units |
| دوربین CCTV | تا چهار دوربین و auto capture [C03](#C03) | RTSP/ONVIF فقط در صورت پشتیبانی مدل؛ snapshot URI، timestamp، metadata، hash؛ انتخاب برند پس از تست |
| ANPR | پلاک خودکار [C01](#C01) | REST/gRPC/Event API پیشنهادی؛ `{plate,confidence,frameId,cameraId,time}` و time-sync |
| RFID | HF/UHF اعلام شده [C02](#C02) | انتخاب EPC Gen2 یا HF protocol با توجه به reader واقعی؛ فرکانس دقیق و فاصله [TBD] |
| PLC و barrier | کنترل‌ تجهیزات اعلام شده [C02](#C02) | اتصال Modbus TCP/RTU یا OPC UA یا دیجیتال I/O **در صورت پشتیبانی واقعی**؛ فرمان must-ack و interlock مستقل |
| MQTT | برای Codeshilp تأیید نشده | رویداد telemetry میان Edge و Broker به‌صورت QoS قابل‌پیکربندی؛ وزن حقوقی از پیام تاییدشده/معتبر |
| ERP/SAP/Tally/Accounting | API و SAP کلی [C01](#C01)؛ گردش سفارش با Tally [C05](#C05) | `POST /v1/weigh-tickets`, `GET /v1/permits`, `POST /v1/delivery-notes` با JSON Schema، idempotency و reconciliation؛ نمونه endpoint متعلق به محصول جدید است |
| SMS/Email | هشدار، اعلان و PDF تصویردار اعلام شده [C01](#C01)[C03](#C03) | Template engine + delivery logs و کنترل حفاظت اطلاعات |
| LiDAR | Loadscan MPS اسکن خودکار و حجم مستند [L01](#L01) | `ScanAdapter` ورودی pointcloud/profile/volume، reference id، کیفیت، واحد و timestamp |
| Loader/Shovel | LR360 اتصال کابین-باسکول [T01](#T01) | `PayloadConnector` با mapping vehicle/job/equipment و زمان |
| FMS | Wenco/Hexagon/DISPATCH/Cat چرخه و تخصیص [W01](#W01)[H01](#H01)[K01](#K01)[F01](#F01) | event schema جدا از `WeighEvent`: `LoadStarted/HaulStarted/DumpCompleted/DelayRecorded` |

**معیار استقرار صنعتی:** برای سیگنال‌های ایمنی از PLC/Relay مجاز با Safety Review استفاده شود؛ سرویس UI حق bypass interlock ندارد. Edge store برای استمرار محلی، sync server برای چندسایت، سیاست conflict و شماره قبض مقاوم به قطع ارتباط الزامی است. منابع Codeshilp نوع دقیق DB، QoS، schema و نرخ FPS دوربین‌ها را اثبات نمی‌کنند.

## ۹. کاتالوگ منطق هشدارها (Rule Engine)

**اهمیت:** مقادیر `[TBD]` عمداً آستانه مجهول‌اند؛ از دقت یا قانون تولیدکننده جعل نشده است. متغیرهای لودسل/صفر به استاندارد و indicator نصب‌شده متکی هستند. عبارات هر قاعده «پیشنهادی» محسوب می‌شوند حتی اگر ایده در منبع مشابه موجود باشد.

| شناسه | شرط / Trigger | شدت | اقدام سامانه | آستانه/منبع |
|---|---|---|---|---|
| AL-01 `duplicate_weigh` | OPEN first transaction on same vehicle or same stable-weight sample within configured window | WARN | hold new event + operator review | `window_seconds=TBD`؛ الهام [C01](#C01) |
| AL-02 `plate_rfid_mismatch` | normalizedPlate.vehicle_id != RFID.vehicle_id when both high confidence | CRITICAL | deny barrier + capture image | `plate_confidence=TBD`؛ الهام [C02](#C02) |
| AL-03 `low_anpr_confidence` | plate confidence below configured threshold | WARN | manual review; no auto-match | `confidence=TBD`؛ صرفاً پیشنهادی |
| AL-04 `invalid_position` | any required position sensor false during stable capture | CRITICAL | block weigh/save | `required_sensors=site config`؛ الهام [C02](#C02) |
| AL-05 `unstable_weight` | indicator stability false / oscillation beyond device rule | WARN | wait for stable event | `stable_time=TBD`؛ الهام [C02](#C02) |
| AL-06 `overweight` | gross exceeds min(vehicle certified limit, scale limit, permit limit) where known | CRITICAL | HOLD + supervisor | `limits from validated master`؛ الهام [C01](#C01) |
| AL-07 `permit_expired` | now outside permit validity or status not ACTIVE | CRITICAL | hold exit; approval | `none`؛ صرفاً پیشنهادی |
| AL-08 `permit_overdraw` | proposed net_kg > remaining authorized kg | CRITICAL | reject booking and exit | `remaining_kg>=0`؛ الهام [D02](#D02) |
| AL-09 `unrecorded_departure` | exit detected after stable loaded weigh with no committed weigh event | CRITICAL | evidence snapshot + incident ticket | `dwell_window=TBD`؛ الهام [C02](#C02) |
| AL-10 `calibration_expired` | now > calibration_record.expires_at | CRITICAL | mark scale restricted; escalation | `expiry timestamp`؛ صرفاً پیشنهادی |
| AL-11 `zero_drift` | reported digital cell/zero diagnostic exceeds device certified limits | CRITICAL | scale health lock pending QA | `vendor device limits [TBD]`؛ الهام [M01](#M01) |
| AL-12 `cell_imbalance` | per-cell imbalance diagnostic raised by compatible junction box | CRITICAL | maintenance work order | `vendor algorithm/threshold`؛ الهام [R01](#R01) |
| AL-13 `communication_lost` | missing indicator/PLC heartbeat > configured timeout | CRITICAL | local fail-safe; alert control room | `timeout=TBD`؛ صرفاً پیشنهادی |
| AL-14 `duplicate_exit` | same transaction/vehicle exits multiple times without reentry | WARN | flag anomaly | `window=TBD`؛ صرفاً پیشنهادی |
| AL-15 `turnaround_overdue` | exit_at absent and now-entry_at > configured percentile/limit | WARN | notify dispatch | `duration=TBD`؛ الهام [T01](#T01) |
| AL-16 `payload_variance` | abs(scale.net_kg-payload.payload_kg) > tolerance agreed per material | WARN | flag reconciliation | `tolerance_kg=TBD`؛ صرفاً پیشنهادی |
| AL-17 `volume_mass_variance` | abs(net_kg - volume_m3*density_kg_m3) > adaptive tolerance | WARN | technical review; never overwrite certified mass | `density/tolerance=TBD`؛ صرفاً پیشنهادی |
| AL-18 `sensor_cctv_offline` | camera/RFID/position sensor unhealthy at weighing | WARN | hold according to site policy | `grace_period=TBD`؛ صرفاً پیشنهادی |

**سیاست هشدار:** CRITICAL پیش از فرمان خروج باید توسط policy حل یا صریحاً با مجوز سطح دوم override شود؛ وضعیت‌های `OPEN/ACK/RESOLVED` تاریخچه append-only دارند؛ ایجاد مجدد هشدار با همان `ruleId+entityId+activePeriod` dedupe می‌شود؛ اعلان نباید جای interlock فیزیکی را بگیرد.

## ۱۰. افزونه‌های قابل نصب (Plug-in Contracts)

### ۱۰.۱ Volume & LiDAR Plugin

- منبع ایده: Loadscan MPS/LVS [L01](#L01)[L03](#L03) **تأییدشده برای Loadscan**؛ **وجود در Codeshilp نامشخص**.
- ورودی: هویت کامیون، `EMPTY` reference از همان bin config، اسکن `LOADED`, point cloud یا height grid، timestamp، quality status.
- خروجی: `volume_m3`, 3D profile، anomaly (`overfill`,`off-center`,`carryback`)، `reference_id` و evidence.
- API پیشنهادی: `POST /v1/lidar/scans`, `GET /v1/transactions/{id}/volume`, `POST /v1/lidar/references`.
- گیت کیفیت: عدم تطابق مرجع،انسداد دید (occlusion)، ناکافی‌بودن نقاط، سرعت غیرمجاز اسکن، تغییر اتاق بار → invalid flag نه حجم تخمینی بدون برچسب.
- **مرز قانونی:** Loadscan درباره MPS برچسب **Monitor Only / Not Legal for Trade Use** اعلام کرده [L01](#L01). تعمیم تاییدیه LVS به MPS برای فروش مبتنی بر حجم مجاز نیست؛ نیاز به گواهی خاص است.

### ۱۰.۲ Onboard Payload Plugin

- منبع ایده: LOADRITE LR360 [T01](#T01) **تأییدشده برای Loadrite**.
- ورودی: وزن پیمانه/bucket یا payload نهایی loader/shovel، jobId، truckId، material، operator و timestamps.
- خروجی: مجموع Payload، خطای بارگیری نسبت به target، صورت‌وضعیت کار لودر، خطای نسبی با وزن باسکول.
- شرط reconcile: یک job به یک Transaction با window زمانی و شناسه یکسان؛ عدم تطابق را حذف نکن، هشدار بده؛ خطای سنسور onboard باید جدا کالیبره شود.
- API پیشنهادی: `POST /v1/payload/events`, `GET /v1/transactions/{id}/reconciliation`.

### ۱۰.۳ Fleet Production & KPI Plugin

- منبع ایده: Wenco، Hexagon، Modular و Cat [W01](#W01)[H01](#H01)[K01](#K01)[F01](#F01).
- ورودی: ماشین، راننده، GPS، dispatch، shovel load/dump، fuel و Delay taxonomy؛ فقط داده واقعی نه استنتاج خام از قبض.
- KPIهای پیشنهادی: production (tonne/shift)، trips، average/p50/p95 cycle time، queuing/waiting، idle hours، utilization، payload compliance، specific fuel (L/t) **مشروط به وجود داده واقعی سوخت**، material flow و shift-vs-plan.
- API پیشنهادی: `POST /v1/fleet/events`, `GET /v1/kpis?site_id=...&shift_id=...`.
- **تفکیک:** در هسته باسکول اگر موقعیت کامیون بین بارگیری و تخلیه ثبت نشود، total cycle time واقعی نامعلوم است؛ تنها turnaround سایت قابل محاسبه خواهد بود.

### ۱۰.۴ رابط نصب‌پذیری

```typescript
interface PluginManifest {
  id: string; version: string; minCoreVersion: string;
  permissions: string[]; requiredDevices: string[];
  subscribedTopics: string[]; publishedTopics: string[];
  uiRoutes: string[]; configSchemaRef: string;
}
// Contract proposal only; no source-code copying.
```

افزونه تنها از schema ثبت‌شده استفاده می‌کند؛ بر ظرفیت قانونی باسکول، قبض نهایی و سیاست راهبند اختیار مستقیم ندارد.

## ۱۱. شکاف‌ها، محدودیت بررسی و پرسش‌های باز

### ۱۱.۱ شکاف‌های دسترسی/منبع

1. **محدودیت خزش:** بررسی sitemap.xml / robots.txt ناموفق؛ فهرست URLهای دیده‌شده موجود است ولی crawl تمامی لینک‌های داخلی، وبلاگ، FAQ، Shop و Help تضمین نمی‌شود.
2. **صفحه Cloud گزارش PDF** مشاهده و تصویربرداری شد؛ اما به backend و demo، schema واقعی و تعداد نقش‌ها دسترسی نبود.
3. **کاتالوگ ANPR** (`anpr-done-with-photos.pdf`) هنگام بازکردن صفحه محافظتی نشان داد؛ صفحات فایل خوانده/بازبینی نشده‌اند.
4. **multi-weighbridge-software** پاسخ ضدربات داشت؛ وجود امکان چند باسکول در سایر منابع فروشنده مطرح است، جزئیات عملکرد نسخه دقیق نامشخص.
5. **فایل Precia قدیمی** در نمایه جست‌وجو متن داشت ولی مستقیم 404 شد؛ برای ماتریس به صفحه رسمی در دسترس [P01](#P01) استناد شده، نه ادعای مطالعه کامل PDF.
6. **PDF Avery قدیمی** لینک هنگام open به خانه سایت ریدایرکت شد؛ برای ماتریس منبع اصلی [A01](#A01) و [A02](#A02) ملاک‌اند.
7. **ویدئو:** مسیر عملی با ویدئوی مشاهده‌شده و زمان‌نما اثبات نشد؛ بخش ۵ «سناریوی اجرایی پیشنهادی» است، نه بازنویسی دموی واقعی.
8. **رابط‌های دوربین و دستگاه:** protocol ثبت‌شده برای هر مدل و schema آدرس API خاص شرکت در منابع موجود نیست.
9. **متروژی:** ادعای تأیید قانونی برای کالیبراسیون پویا/مقایسه حجمی Codeshilp یافت نشد؛ تشخیص سلامت سنسور ≠ صدور تأییدیه کالیبراسیون.
10. **قابلیت‌های FMS:** در منابع Codeshilp به‌طور مستقیم KPI چرخه عملیات معدنی، احتراق سوخت و dispatch پویا اثبات نشده است.
11. **حق استفاده از تصویر:** لینک تصاویر برای ارجاع پژوهشی است؛ استفاده تجاری/بازنشر خودکار در محصول جدید مستلزم تعیین مجوز مالک است.

### ۱۱.۲ پرسش‌های بازِ ضروری پیش از پیاده‌سازی سایت واقعی

- مدل و برند indicator باسکول، baudrate/format/checksum و فرایند تأیید قانونی هر باسکول چیست؟
- محدوده وزن قابل‌اعتماد، capacity و maximum axle load قانونی برای هر کلاس وسیله طبق مقررات محل اجرا چیست؟
- پلاک‌های فارسی/استاندارد ملی، زاویه دوربین، نور شب، گردوغبار، راننده و تریلر چگونه مدیریت شوند؟
- مجوز از ERP یا سامانه مجوز حمل صادر می‌شود؟ SLA و مالک ایجاد/ابطال و مصرف سهمیه کیست؟
- آیا دو باسکول هم‌زمان وجود دارد و آیا کامیون می‌تواند میان مسیرها جابه‌جا شود؟
- آیا قطع WAN اجازه صدور قبض/خروج می‌دهد؟ سیاست fail-safe راهبند و مرجع قانونی کنترل چیست؟
- آیا LiDAR فقط با اهداف کنترل تولید استفاده می‌شود یا اندازه‌گیری تجاری قانونی هم مدنظر است؟
- توافق فنی برای گرفتن داده شاول/لودر/FMS وجود دارد؟ چه endpoint یا فایل و حق دسترسی ارائه می‌شود؟
- آستانه خطا و false-positive هشدار، نرخ پردازش، دوره نگهداری تصویر، RPO/RTO و مدت اعتبار calibration certificate چگونه تصویب می‌شوند؟

## ۱۲. JSON ساختاریافته برای AI Coding Agent

این بلوک تعاریف **سامانه پیشنهادی** است، نه مدل داده کشف‌شده Codeshilp. فیلد `evidence` تنها منبع الهام است. برای جلوگیری از ساخت دمو غیروابسته، پارامترهای `TBD` عمداً نیازمند تنظیم site-specific هستند.

```json
{
  "document": {
    "title": "Mining Weighbridge ANPR RFID PRD",
    "version": "1.0",
    "language": "fa-IR",
    "generated_date": "2026-10-25",
    "target_company": "Codeshilp",
    "source_registry": {
      "C01": "https://codeshilp.com/anpr-weighbridge-software/",
      "C02": "https://codeshilp.com/unmanned-weighbridge-software/",
      "C03": "https://5.imimg.com/data5/SELLER/Doc/2025/1/478857094/JM/IO/EQ/88887902/cctv-weighbridge-software.pdf",
      "C04": "https://codeshilp.com/wp-content/uploads/2025/03/Weighbridge-with-Cloud-Reporting.pdf",
      "C05": "https://codeshilp.com/order-delivery-tally-integration-with-weighbridge/",
      "C06": "https://codeshilp.com/weighbridge-software/",
      "C07": "https://codeshilp.com/online-weighbridge-software/",
      "C08": "https://codeshilp.com/royalty-weighbridge-software/",
      "C09": "https://codeshilp.com/wp-content/uploads/2025/07/anpr-wb-4.png",
      "C10": "https://codeshilp.com/wp-content/uploads/2025/04/1-weighing-form-1024x632.png",
      "C11": "https://codeshilp.com/wp-content/uploads/2025/07/anpr-wb-1.png",
      "C12": "https://codeshilp.com/gallery/",
      "C13": "https://codeshilp.com/site-map/",
      "C14": "https://codeshilp.com/comport-utility/",
      "C15": "https://codeshilp.com/weighbridge-mobile-application/",
      "C16": "https://codeshilp.com/weighbridge-software-with-tally-integration/",
      "A01": "https://www.averyweigh-tronix.com/en/product/weighman-8-weighbridge-software/",
      "A02": "https://www.averyweigh-tronix.com/en/product/smartower-unmanned-weighbridge-system/",
      "A03": "https://www.averyweigh-tronix.com/en-gb/wp-content/uploads/sites/2/2023/07/Weighman8_Vehicle_Image_Capture_spec_100164.pdf",
      "P01": "https://www.preciamolen.com/en/products/vehicle-weighing/weighbridge/out-weighing-management-software-truckflow",
      "P02": "https://www.preciamolen.com/en/products/vehicle-weighing",
      "P03": "https://www.preciamolen.com/wp-content/uploads/2018/05/09-15-01-1-FT-TRUCKFLOW-V00.09.pdf",
      "D01": "https://www.dariel.co.za/coal-logistics-services-optimisation/",
      "D02": "https://www.miningweekly.com/article/weighbridge-solution-installed-at-mpumalanga-coal-mine-2014-05-23/page%3A2",
      "E01": "https://endel.digital/weighmast-weighbridge-software/",
      "M01": "https://www.mt.com/dam/ind/IND_PDF/2024/IND780-downloads/others/IND560PDX-and-IND780_MAN_30137756_R00_TraxEMT_AppGuide_EN.pdf",
      "R01": "https://www.ricelake.com/products/iqube2-digital-diagnostic-junction-box?part=93243",
      "L01": "https://www.loadscan.com/mine-payload-scanner/",
      "L02": "https://www.loadscan.com/myscanner/",
      "L03": "https://www.loadscan.com/load-volume-scanner/",
      "T01": "https://www.goloadrite.com/loadrite-360",
      "T02": "https://www.neloadrite.com/reporting",
      "W01": "https://www.wencomine.com/our-solutions/mining-fleet-management",
      "H01": "https://hexagon.com/about/news-media/press-releases/2022/hexagon-awarded-significant-fleet-management-project",
      "H02": "https://hexagon.com/-/media/project/one-web/master-site/products/hxgn-mineoperate-op-pro-hp/case_study_01_mineoperate_op_pro_lp.pdf",
      "K01": "https://www.komatsu.com/en-us/technology/smart-mining/loading-and-haulage/dispatch",
      "F01": "https://www.cat.com/en_US/by-industry/mining/surface-mining/surface-technology/fleet.html",
      "F02": "https://www.cat.com/en_US/news/machine-press-releases/new-cat-minestar-reporting-integrates-minestar-and-other-vendor-data-into-a-single--unified-interface.html"
    },
    "evidence_policy": "vendor_claim_not_field_verified",
    "scope": "proposed new standalone product, not competitor implementation"
  },
  "prd": {
    "roles": [
      {
        "role": "اپراتور باسکول",
        "goal": "ثبت/بررسی وزن و شواهد",
        "permissions": [
          "capture_weight",
          "review_anpr",
          "print_ticket"
        ]
      },
      {
        "role": "نگهبان دروازه",
        "goal": "کنترل مجوز تردد",
        "permissions": [
          "view_vehicle",
          "barrier_request"
        ]
      },
      {
        "role": "مدیر شیفت",
        "goal": "مدیریت استثنا و عملکرد",
        "permissions": [
          "ack_alert",
          "shift_report"
        ]
      },
      {
        "role": "دیسپچر/مسئول حمل",
        "goal": "برنامه تردد و صف",
        "permissions": [
          "manage_trip",
          "view_queue"
        ]
      },
      {
        "role": "واحد بازرگانی/فروش",
        "goal": "مجوز و سقف سفارش",
        "permissions": [
          "manage_permit",
          "approve_order"
        ]
      },
      {
        "role": "حسابداری",
        "goal": "صورتحساب و مغایرت ERP",
        "permissions": [
          "reconcile",
          "export_invoice"
        ]
      },
      {
        "role": "ناظر کالیبراسیون",
        "goal": "گواهی/وضعیت تجهیز",
        "permissions": [
          "verify_calibration",
          "view_diagnostics"
        ]
      },
      {
        "role": "مدیر معدن",
        "goal": "KPI/گزارش تولید",
        "permissions": [
          "analytics_read"
        ]
      },
      {
        "role": "ادمین IT/OT",
        "goal": "تجهیز، نقش و لاگ",
        "permissions": [
          "configure_device",
          "rbac",
          "audit_read"
        ]
      },
      {
        "role": "راننده (کیوسک)",
        "goal": "تأیید پلاک و دستور حرکت",
        "permissions": [
          "kiosk_self_service"
        ]
      }
    ],
    "user_stories": [
      "US-01 به‌عنوان نگهبان می‌خواهم پلاک و RFID پیش از باز شدن راهبند با مجوز تطبیق داده شوند تا خودرو غیرمجاز وارد نشود.",
      "US-02 به‌عنوان اپراتور می‌خواهم وزن خام، ثبات، عکس و موقعیت خودرو یک‌جا نمایش داده شوند تا ثبت معتبر انجام شود.",
      "US-03 به‌عنوان مسئول فروش می‌خواهم هر تراکنش به حواله با مانده معتبر متصل باشد تا بیش از مجوز تحویل نشود.",
      "US-04 به‌عنوان ناظر کالیبراسیون می‌خواهم تاریخ گواهی و سلامت سخت‌افزار جدا نمایش داده شود تا هشدار کاذب تولید نشود.",
      "US-05 به‌عنوان مدیر شیفت می‌خواهم تناژ خالص و تعداد سفر بر اساس زمان نهایی تراکنش و فیلتر سایت/شیفت استخراج شوند.",
      "US-06 به‌عنوان مدیر بارگیری می‌خواهم سفارش باسکول به لودر برسد و payload لودر با وزن خروجی تطبیق شود.",
      "US-07 به‌عنوان نگهبان می‌خواهم خروج بدون وزن ثبت‌شده به‌صورت رخداد ضدتقلب ضبط و علامت‌گذاری شود.",
      "US-08 به‌عنوان دیسپچر می‌خواهم خودروهای منتظر و مدت ماندگاری را ببینم تا صف را مدیریت کنم.",
      "US-09 به‌عنوان مدیر مالی می‌خواهم وضعیت ارسال هر قبض به ERP و خطاهای همگام‌سازی روشن باشد.",
      "US-10 به‌عنوان کارشناس معدن می‌خواهم حجم LiDAR و جرم باسکول دو اندازه‌گیری مستقل باشند و اختلافشان ثبت شود.",
      "US-11 به‌عنوان مدیر سامانه می‌خواهم در زمان قطع WAN توزین در کنترلر محلی طبق سیاست ادامه یابد و بعداً با dedupe همگام شود.",
      "US-12 به‌عنوان حسابرس می‌خواهم هر اصلاح قبض همراه با هویت، نسخه و علت در audit غیرقابل دستکاری قابل مشاهده باشد."
    ],
    "functional_requirements": [
      {
        "id": "FR-01",
        "description_fa": "ثبت سایت، مسیر، باسکول و تجهیزات",
        "priority": "P0",
        "status": "proposed",
        "inspiration_source_id": "C01"
      },
      {
        "id": "FR-02",
        "description_fa": "دریافت وزن زنده از indicator با Device Adapter و ثبت داده خام",
        "priority": "P0",
        "status": "proposed",
        "inspiration_source_id": "C01"
      },
      {
        "id": "FR-03",
        "description_fa": "اعلام پایداری وزن، حالت zero، overload و کیفیت ارتباط",
        "priority": "P0",
        "status": "proposed",
        "inspiration_source_id": "C02"
      },
      {
        "id": "FR-04",
        "description_fa": "تشخیص پلاک با confidence، snapshot و تأیید اپراتور برای موارد مبهم",
        "priority": "P0",
        "status": "proposed",
        "inspiration_source_id": "C01"
      },
      {
        "id": "FR-05",
        "description_fa": "خواندن RFID و تطبیق آن با شناسه خودرو، راننده و پلاک",
        "priority": "P0",
        "status": "proposed",
        "inspiration_source_id": "C02"
      },
      {
        "id": "FR-06",
        "description_fa": "ثبت رویدادهای ورود/خروج و موقعیت دروازه",
        "priority": "P0",
        "status": "proposed",
        "inspiration_source_id": "C01"
      },
      {
        "id": "FR-07",
        "description_fa": "کنترل ایمن راهبند، چراغ، نمایشگر و سنسور موقعیت",
        "priority": "P0",
        "status": "proposed",
        "inspiration_source_id": "C02"
      },
      {
        "id": "FR-08",
        "description_fa": "مدیریت masterهای خودرو، راننده، شرکت حمل، مشتری و ماده",
        "priority": "P0",
        "status": "proposed",
        "inspiration_source_id": "C04"
      },
      {
        "id": "FR-09",
        "description_fa": "ثبت اولین وزن و جلوگیری از انتساب آن به سفر اشتباه",
        "priority": "P0",
        "status": "proposed",
        "inspiration_source_id": "C03"
      },
      {
        "id": "FR-10",
        "description_fa": "ثبت دومین وزن، محاسبه خالص با جهت ورود/خروج و کنترل علامت",
        "priority": "P0",
        "status": "proposed",
        "inspiration_source_id": "C03"
      },
      {
        "id": "FR-11",
        "description_fa": "تارای ذخیره‌شده با تاریخ اعتبار، منبع و مجوز استفاده",
        "priority": "P0",
        "status": "proposed",
        "inspiration_source_id": "C04"
      },
      {
        "id": "FR-12",
        "description_fa": "ثبت سفارش، حواله، مجوز فروش/حمل و اعتبارسنجی مقدار",
        "priority": "P0",
        "status": "proposed",
        "inspiration_source_id": "C05"
      },
      {
        "id": "FR-13",
        "description_fa": "باز کردن راهبند خروج فقط پس از گذر از قوانین و اتمام تراکنش",
        "priority": "P0",
        "status": "proposed",
        "inspiration_source_id": "C02"
      },
      {
        "id": "FR-14",
        "description_fa": "ثبت تصاویر هر وزن و اتصال عکس به شناسه رویداد",
        "priority": "P0",
        "status": "proposed",
        "inspiration_source_id": "C03"
      },
      {
        "id": "FR-15",
        "description_fa": "مدیریت ضدتکرار (idempotency) در خوانش، تراکنش و API",
        "priority": "P0",
        "status": "proposed",
        "inspiration_source_id": null
      },
      {
        "id": "FR-16",
        "description_fa": "صدور قبض نسخه‌دار با اطلاعات خودرو، وزن و QR راستی‌آزمایی",
        "priority": "P0",
        "status": "proposed",
        "inspiration_source_id": "C03"
      },
      {
        "id": "FR-17",
        "description_fa": "ثبت عملیات دستی فقط با دلیل، تایید سطح دوم و audit trail",
        "priority": "P0",
        "status": "proposed",
        "inspiration_source_id": "C01"
      },
      {
        "id": "FR-18",
        "description_fa": "داشبورد صف، وزن لحظه‌ای، رویداد جاری و رخدادهای استثنا",
        "priority": "P0",
        "status": "proposed",
        "inspiration_source_id": "C04"
      },
      {
        "id": "FR-19",
        "description_fa": "گزارش تراکنش/راننده/شرکت/ماده/شیفت و خروجی CSV/XLSX/PDF",
        "priority": "P0",
        "status": "proposed",
        "inspiration_source_id": "C04"
      },
      {
        "id": "FR-20",
        "description_fa": "مدیریت نقش‌ها، مجوزهای جزءبه‌جزء و محدوده دسترسی به سایت",
        "priority": "P0",
        "status": "proposed",
        "inspiration_source_id": "C01"
      },
      {
        "id": "FR-21",
        "description_fa": "گردش کار اصلاح تراکنش با نسخه قبلی و ردپای کامل",
        "priority": "P0",
        "status": "proposed",
        "inspiration_source_id": "A01"
      },
      {
        "id": "FR-22",
        "description_fa": "آفلاین محلی و همگام‌سازی قابل بازیابی با سرور مرکزی",
        "priority": "P0",
        "status": "proposed",
        "inspiration_source_id": "C04"
      },
      {
        "id": "FR-23",
        "description_fa": "مدیریت انقضای گواهی و وضعیت سلامت باسکول؛ تفکیک اداری و سنسوری",
        "priority": "P0",
        "status": "proposed",
        "inspiration_source_id": null
      },
      {
        "id": "FR-24",
        "description_fa": "ارسال رویداد به ERP از صف پایدار با retry و reconciliation",
        "priority": "P1",
        "status": "proposed",
        "inspiration_source_id": "C05"
      },
      {
        "id": "FR-25",
        "description_fa": "پشتیبانی دو باسکول و مسیر جفت‌شدن رویدادها بین دو ایستگاه",
        "priority": "P1",
        "status": "proposed",
        "inspiration_source_id": "P01"
      },
      {
        "id": "FR-26",
        "description_fa": "پایش turnaround و طول صف با منبع timestamp مشخص",
        "priority": "P1",
        "status": "proposed",
        "inspiration_source_id": "T01"
      },
      {
        "id": "FR-27",
        "description_fa": "هشدار خروج بدون ذخیره وزن، پلاک مغایر و موقعیت نامعتبر",
        "priority": "P1",
        "status": "proposed",
        "inspiration_source_id": "C02"
      },
      {
        "id": "FR-28",
        "description_fa": "مدیریت مجوز/سهمیه، کسری باقیمانده و عدم مصرف مجدد",
        "priority": "P1",
        "status": "proposed",
        "inspiration_source_id": "D02"
      },
      {
        "id": "FR-29",
        "description_fa": "کانال SMS/Email با الگوهای پیام و لاگ تحویل",
        "priority": "P1",
        "status": "proposed",
        "inspiration_source_id": "C01"
      },
      {
        "id": "FR-30",
        "description_fa": "ثبت کالیبراسیون، سوابق تست و رسیدگی به هشدار سلامت",
        "priority": "P1",
        "status": "proposed",
        "inspiration_source_id": null
      },
      {
        "id": "FR-31",
        "description_fa": "استفاده از تشخیص خرابی تک‌لودسل فقط در صورت خروجی پشتیبانی‌شده تجهیز",
        "priority": "P1",
        "status": "proposed",
        "inspiration_source_id": "R01"
      },
      {
        "id": "FR-32",
        "description_fa": "صفحه موبایل/Responsive برای مدیر، اپراتور و ناظر",
        "priority": "P1",
        "status": "proposed",
        "inspiration_source_id": "P01"
      },
      {
        "id": "FR-33",
        "description_fa": "پلاگین مستقل LiDAR برای empty reference، اسکن پر، 3D و m³",
        "priority": "P2",
        "status": "proposed",
        "inspiration_source_id": "L01"
      },
      {
        "id": "FR-34",
        "description_fa": "ثبت چگالی با بازه اعتبار و محاسبه جرم تخمینی غیرتجاری",
        "priority": "P2",
        "status": "proposed",
        "inspiration_source_id": null
      },
      {
        "id": "FR-35",
        "description_fa": "پلاگین Payload برای لودر/شاول و تطبیق با باسکول",
        "priority": "P2",
        "status": "proposed",
        "inspiration_source_id": "T01"
      },
      {
        "id": "FR-36",
        "description_fa": "پلاگین Fleet KPI، نرخ تولید، تعداد سفر، زمان چرخه، تأخیر، سوخت",
        "priority": "P2",
        "status": "proposed",
        "inspiration_source_id": "F01"
      },
      {
        "id": "FR-37",
        "description_fa": "API و Webhook نسخه‌بندی‌شده برای داده مجوز، وزن، رخداد و اعلان",
        "priority": "P1",
        "status": "proposed",
        "inspiration_source_id": "C01"
      },
      {
        "id": "FR-38",
        "description_fa": "تعریف شیفت عبوری از نیمه‌شب و انتساب یکتای تراکنش",
        "priority": "P1",
        "status": "proposed",
        "inspiration_source_id": null
      },
      {
        "id": "FR-39",
        "description_fa": "گزارش مغایرت سه‌طرفه باسکول، حجم و Payload",
        "priority": "P2",
        "status": "proposed",
        "inspiration_source_id": null
      },
      {
        "id": "FR-40",
        "description_fa": "مدیریت وضعیت دوربین، لودسل، شبکه، PLC و تأخیر heartbeat",
        "priority": "P1",
        "status": "proposed",
        "inspiration_source_id": "C02"
      }
    ],
    "nonfunctional_requirements": [
      {
        "id": "NFR-01",
        "description_fa": "هر رویداد یک UUID و زمان UTC به‌همراه offset محلی داشته باشد؛ زمان تجهیز جدا ذخیره شود.",
        "status": "proposed"
      },
      {
        "id": "NFR-02",
        "description_fa": "هیچ وزن سنسور در سرور با مقدار دستی جایگزین نشود؛ دو فیلد مستقل و منشأ داده الزامی است.",
        "status": "proposed"
      },
      {
        "id": "NFR-03",
        "description_fa": "ثبت نهایی تراکنش اتمیک و تکرار امن باشد؛ unique constraint و idempotency key.",
        "status": "proposed"
      },
      {
        "id": "NFR-04",
        "description_fa": "در قطع ارتباط، کنترلر محلی به حالت fail-safe پیکربندی‌شده برود؛ باز کردن خودکار مجاز نیست.",
        "status": "proposed"
      },
      {
        "id": "NFR-05",
        "description_fa": "سازگاری با مرورگرهای مدرن، RTL فارسی و LTR برای پلاک/شماره، و WCAG 2.2 AA هدف طراحی است.",
        "status": "proposed"
      },
      {
        "id": "NFR-06",
        "description_fa": "حدود تأخیر، نرخ پردازش، SLA و ظرفیت دوربین/تجهیز با آزمون پذیرش سایت تعیین شوند [TBD].",
        "status": "proposed"
      },
      {
        "id": "NFR-07",
        "description_fa": "ارتباطات TLS؛ نگه‌داری محرمانه رازها؛ احراز هویت MFA برای سطوح حساس.",
        "status": "proposed"
      },
      {
        "id": "NFR-08",
        "description_fa": "ثبت audit غیرقابل ویرایش عملیاتی با هش زنجیره‌ای یا مخزن WORM متناسب با تهدید.",
        "status": "proposed"
      },
      {
        "id": "NFR-09",
        "description_fa": "Retention تصاویر/پلاک و حق حذف/دسترسی مطابق مقررات محل اجرا؛ اعداد [TBD].",
        "status": "proposed"
      },
      {
        "id": "NFR-10",
        "description_fa": "نسخه‌بندی API و Device Adapter؛ تست سازگاری با simulator تجهیزات.",
        "status": "proposed"
      },
      {
        "id": "NFR-11",
        "description_fa": "مانیتورینگ uptime، کیفیت ارتباط، queue lag، fail rate، سلامت سنسور و alarms.",
        "status": "proposed"
      },
      {
        "id": "NFR-12",
        "description_fa": "پشتیبان‌گیری دوره‌ای و تمرین بازیابی؛ RPO/RTO [TBD] برای هر سایت.",
        "status": "proposed"
      },
      {
        "id": "NFR-13",
        "description_fa": "رفع تضاد رخدادهای آفلاین با event append-only و شناسه یکتا، نه last-write-wins روی وزن.",
        "status": "proposed"
      },
      {
        "id": "NFR-14",
        "description_fa": "ارقام وزن/حجم با Decimal و واحد ذخیره شوند؛ گرد کردن تابع تأییدیه قانونی و دستگاه است.",
        "status": "proposed"
      },
      {
        "id": "NFR-15",
        "description_fa": "کنترلر PLC باید interlock سخت‌افزاری و emergency-stop مستقل از مرورگر داشته باشد.",
        "status": "proposed"
      },
      {
        "id": "NFR-16",
        "description_fa": "سوابق کالیبراسیون/گواهی فقط توسط ناظر مجاز ثبت و با سند امضاشده پیوست شوند.",
        "status": "proposed"
      }
    ],
    "state_machine": {
      "initial": "EXPECTED",
      "states": [
        "EXPECTED",
        "ARRIVED",
        "VERIFIED",
        "ENTERED",
        "FIRST_WEIGHED",
        "LOADING",
        "SECOND_WEIGHED",
        "VERIFIED_PERMIT",
        "COMPLETED",
        "EXITED",
        "HOLD",
        "CANCELLED",
        "MANUAL_REVIEW"
      ],
      "terminal": [
        "EXITED",
        "CANCELLED"
      ]
    },
    "plugins": [
      "lidar-volume",
      "onboard-payload",
      "fleet-kpi"
    ]
  },
  "data_model": {
    "unit_policy": {
      "mass": "kg",
      "volume": "m3",
      "timestamp": "UTC ISO8601 with source timestamp separately",
      "quantity_type": "Decimal"
    },
    "entities": [
      {
        "name": "Site",
        "fields": [
          "id UUID PK",
          "code unique",
          "name",
          "timezone",
          "location",
          "status"
        ]
      },
      {
        "name": "Gate",
        "fields": [
          "id",
          "site_id FK",
          "direction IN|OUT|BOTH",
          "lane_id",
          "controller_id",
          "status"
        ]
      },
      {
        "name": "Vehicle",
        "fields": [
          "id",
          "plate_normalized",
          "plate_country",
          "vehicle_class",
          "axle_count",
          "max_gvw_kg nullable",
          "default_tare_kg nullable",
          "tare_valid_until nullable",
          "rfid_tag_id nullable",
          "active"
        ]
      },
      {
        "name": "Driver",
        "fields": [
          "id",
          "name",
          "license_number_hash_or_token",
          "carrier_id FK nullable",
          "phone_protected",
          "active"
        ]
      },
      {
        "name": "Carrier",
        "fields": [
          "id",
          "legal_name",
          "registration_no",
          "contacts",
          "active"
        ]
      },
      {
        "name": "Customer",
        "fields": [
          "id",
          "name",
          "external_erp_id",
          "role CUSTOMER|SUPPLIER|BOTH",
          "active"
        ]
      },
      {
        "name": "Material",
        "fields": [
          "id",
          "code",
          "name",
          "material_type",
          "grade_label nullable",
          "measurement_unit",
          "default_density_kg_m3 nullable"
        ]
      },
      {
        "name": "Permit",
        "fields": [
          "id",
          "kind SALE|TRANSPORT|PURCHASE|DISPATCH",
          "external_ref",
          "customer_id",
          "carrier_id nullable",
          "material_id",
          "valid_from",
          "valid_to",
          "max_net_kg nullable",
          "remaining_kg nullable",
          "max_vehicle_gvw_kg nullable",
          "status",
          "revision"
        ]
      },
      {
        "name": "Transaction",
        "fields": [
          "id UUID",
          "site_id",
          "vehicle_id",
          "driver_id nullable",
          "carrier_id nullable",
          "customer_id nullable",
          "material_id",
          "permit_id nullable",
          "origin_id",
          "destination_id",
          "shift_id",
          "status",
          "direction INBOUND|OUTBOUND",
          "gross_kg nullable",
          "tare_kg nullable",
          "net_kg nullable",
          "first_weigh_at nullable",
          "second_weigh_at nullable",
          "entry_at nullable",
          "exit_at nullable",
          "hold_reason nullable",
          "revision",
          "created_at"
        ]
      },
      {
        "name": "WeighEvent",
        "fields": [
          "id",
          "transaction_id",
          "scale_id",
          "sequence_no",
          "weight_kg Decimal",
          "raw_payload",
          "stable_flag",
          "zero_flag",
          "capture_method SENSOR|MANUAL",
          "captured_at_utc",
          "device_at nullable",
          "operator_id nullable",
          "manual_override_reason nullable",
          "image_refs",
          "calibration_snapshot_id nullable"
        ]
      },
      {
        "name": "GateEvent",
        "fields": [
          "id",
          "vehicle_id nullable",
          "transaction_id nullable",
          "gate_id",
          "event_type ARRIVAL|BARRIER_OPEN|ENTRY|EXIT|DENY",
          "timestamp_utc",
          "source",
          "rfid_read_id nullable",
          "plate_read_id nullable",
          "decision_reason"
        ]
      },
      {
        "name": "Camera",
        "fields": [
          "id",
          "site_id",
          "gate_id nullable",
          "scale_id nullable",
          "stream_ref_secret",
          "position FRONT|REAR|TOP|SIDE",
          "status",
          "heartbeat_at"
        ]
      },
      {
        "name": "PlateRead",
        "fields": [
          "id",
          "camera_id",
          "observed_at",
          "plate_raw",
          "plate_normalized",
          "confidence",
          "vehicle_id nullable",
          "image_uri",
          "bbox",
          "review_status",
          "model_version"
        ]
      },
      {
        "name": "RFIDRead",
        "fields": [
          "id",
          "reader_id",
          "tag_epc",
          "frequency_band HF|UHF|OTHER",
          "observed_at",
          "vehicle_id nullable",
          "signal_quality nullable"
        ]
      },
      {
        "name": "Scale",
        "fields": [
          "id",
          "site_id",
          "indicator_model",
          "driver_adapter_id",
          "serial_no",
          "capacity_kg",
          "division_kg",
          "mode STATIC|DYNAMIC",
          "metrology_status",
          "last_zero_check_at",
          "calibration_due_at",
          "health_state"
        ]
      },
      {
        "name": "CalibrationRecord",
        "fields": [
          "id",
          "scale_id",
          "certificate_no",
          "issuer",
          "performed_at",
          "expires_at",
          "document_uri",
          "document_sha256",
          "verified_by",
          "certificate_status",
          "test_results_json"
        ]
      },
      {
        "name": "Alert",
        "fields": [
          "id",
          "rule_id",
          "severity INFO|WARN|CRITICAL",
          "entity_type",
          "entity_id",
          "opened_at",
          "status OPEN|ACK|RESOLVED",
          "evidence_refs",
          "ack_by nullable",
          "resolved_by nullable"
        ]
      },
      {
        "name": "Shift",
        "fields": [
          "id",
          "site_id",
          "shift_code",
          "start_at_utc",
          "end_at_utc",
          "production_plan_kg nullable",
          "timezone"
        ]
      },
      {
        "name": "Equipment",
        "fields": [
          "id",
          "site_id",
          "kind TRUCK|LOADER|SHOVEL|SCALE|SCANNER",
          "external_fms_id nullable",
          "manufacturer",
          "model",
          "status"
        ]
      },
      {
        "name": "LidarScan",
        "fields": [
          "id",
          "transaction_id nullable",
          "scanner_id",
          "vehicle_id",
          "scan_type EMPTY|LOADED",
          "reference_scan_id nullable",
          "volume_m3 nullable",
          "pointcloud_uri nullable",
          "profile_uri nullable",
          "density_kg_m3 nullable",
          "estimated_mass_kg nullable",
          "quality_flag",
          "captured_at",
          "legal_use_flag"
        ]
      },
      {
        "name": "PayloadEvent",
        "fields": [
          "id",
          "transaction_id nullable",
          "equipment_id",
          "truck_id nullable",
          "material_id",
          "payload_kg",
          "bucket_count nullable",
          "operator_id nullable",
          "timestamp",
          "sensor_source",
          "confidence nullable"
        ]
      },
      {
        "name": "AuditLog",
        "fields": [
          "id",
          "actor_id",
          "action",
          "entity_type",
          "entity_id",
          "before_hash",
          "after_hash",
          "reason nullable",
          "occurred_at",
          "device_id",
          "correlation_id"
        ]
      },
      {
        "name": "DeviceEvent",
        "fields": [
          "id",
          "device_id",
          "kind HEARTBEAT|ERROR|STATUS|INPUT",
          "timestamp",
          "payload_json",
          "quality",
          "correlation_id"
        ]
      },
      {
        "name": "IntegrationOutbox",
        "fields": [
          "id",
          "topic",
          "aggregate_id",
          "event_version",
          "payload_json",
          "status",
          "attempt_count",
          "next_retry_at",
          "idempotency_key"
        ]
      }
    ]
  },
  "alert_rules": [
    {
      "id": "AL-01",
      "type": "duplicate_weigh",
      "condition": "OPEN first transaction on same vehicle or same stable-weight sample within configured window",
      "severity": "WARN",
      "action": "hold new event + operator review",
      "threshold_configuration": "window_seconds=TBD",
      "status": "proposed",
      "inspiration_source_id": "C01"
    },
    {
      "id": "AL-02",
      "type": "plate_rfid_mismatch",
      "condition": "normalizedPlate.vehicle_id != RFID.vehicle_id when both high confidence",
      "severity": "CRITICAL",
      "action": "deny barrier + capture image",
      "threshold_configuration": "plate_confidence=TBD",
      "status": "proposed",
      "inspiration_source_id": "C02"
    },
    {
      "id": "AL-03",
      "type": "low_anpr_confidence",
      "condition": "plate confidence below configured threshold",
      "severity": "WARN",
      "action": "manual review; no auto-match",
      "threshold_configuration": "confidence=TBD",
      "status": "proposed",
      "inspiration_source_id": null
    },
    {
      "id": "AL-04",
      "type": "invalid_position",
      "condition": "any required position sensor false during stable capture",
      "severity": "CRITICAL",
      "action": "block weigh/save",
      "threshold_configuration": "required_sensors=site config",
      "status": "proposed",
      "inspiration_source_id": "C02"
    },
    {
      "id": "AL-05",
      "type": "unstable_weight",
      "condition": "indicator stability false / oscillation beyond device rule",
      "severity": "WARN",
      "action": "wait for stable event",
      "threshold_configuration": "stable_time=TBD",
      "status": "proposed",
      "inspiration_source_id": "C02"
    },
    {
      "id": "AL-06",
      "type": "overweight",
      "condition": "gross exceeds min(vehicle certified limit, scale limit, permit limit) where known",
      "severity": "CRITICAL",
      "action": "HOLD + supervisor",
      "threshold_configuration": "limits from validated master",
      "status": "proposed",
      "inspiration_source_id": "C01"
    },
    {
      "id": "AL-07",
      "type": "permit_expired",
      "condition": "now outside permit validity or status not ACTIVE",
      "severity": "CRITICAL",
      "action": "hold exit; approval",
      "threshold_configuration": "none",
      "status": "proposed",
      "inspiration_source_id": null
    },
    {
      "id": "AL-08",
      "type": "permit_overdraw",
      "condition": "proposed net_kg > remaining authorized kg",
      "severity": "CRITICAL",
      "action": "reject booking and exit",
      "threshold_configuration": "remaining_kg>=0",
      "status": "proposed",
      "inspiration_source_id": "D02"
    },
    {
      "id": "AL-09",
      "type": "unrecorded_departure",
      "condition": "exit detected after stable loaded weigh with no committed weigh event",
      "severity": "CRITICAL",
      "action": "evidence snapshot + incident ticket",
      "threshold_configuration": "dwell_window=TBD",
      "status": "proposed",
      "inspiration_source_id": "C02"
    },
    {
      "id": "AL-10",
      "type": "calibration_expired",
      "condition": "now > calibration_record.expires_at",
      "severity": "CRITICAL",
      "action": "mark scale restricted; escalation",
      "threshold_configuration": "expiry timestamp",
      "status": "proposed",
      "inspiration_source_id": null
    },
    {
      "id": "AL-11",
      "type": "zero_drift",
      "condition": "reported digital cell/zero diagnostic exceeds device certified limits",
      "severity": "CRITICAL",
      "action": "scale health lock pending QA",
      "threshold_configuration": "vendor device limits [TBD]",
      "status": "proposed",
      "inspiration_source_id": "M01"
    },
    {
      "id": "AL-12",
      "type": "cell_imbalance",
      "condition": "per-cell imbalance diagnostic raised by compatible junction box",
      "severity": "CRITICAL",
      "action": "maintenance work order",
      "threshold_configuration": "vendor algorithm/threshold",
      "status": "proposed",
      "inspiration_source_id": "R01"
    },
    {
      "id": "AL-13",
      "type": "communication_lost",
      "condition": "missing indicator/PLC heartbeat > configured timeout",
      "severity": "CRITICAL",
      "action": "local fail-safe; alert control room",
      "threshold_configuration": "timeout=TBD",
      "status": "proposed",
      "inspiration_source_id": null
    },
    {
      "id": "AL-14",
      "type": "duplicate_exit",
      "condition": "same transaction/vehicle exits multiple times without reentry",
      "severity": "WARN",
      "action": "flag anomaly",
      "threshold_configuration": "window=TBD",
      "status": "proposed",
      "inspiration_source_id": null
    },
    {
      "id": "AL-15",
      "type": "turnaround_overdue",
      "condition": "exit_at absent and now-entry_at > configured percentile/limit",
      "severity": "WARN",
      "action": "notify dispatch",
      "threshold_configuration": "duration=TBD",
      "status": "proposed",
      "inspiration_source_id": "T01"
    },
    {
      "id": "AL-16",
      "type": "payload_variance",
      "condition": "abs(scale.net_kg-payload.payload_kg) > tolerance agreed per material",
      "severity": "WARN",
      "action": "flag reconciliation",
      "threshold_configuration": "tolerance_kg=TBD",
      "status": "proposed",
      "inspiration_source_id": null
    },
    {
      "id": "AL-17",
      "type": "volume_mass_variance",
      "condition": "abs(net_kg - volume_m3*density_kg_m3) > adaptive tolerance",
      "severity": "WARN",
      "action": "technical review; never overwrite certified mass",
      "threshold_configuration": "density/tolerance=TBD",
      "status": "proposed",
      "inspiration_source_id": null
    },
    {
      "id": "AL-18",
      "type": "sensor_cctv_offline",
      "condition": "camera/RFID/position sensor unhealthy at weighing",
      "severity": "WARN",
      "action": "hold according to site policy",
      "threshold_configuration": "grace_period=TBD",
      "status": "proposed",
      "inspiration_source_id": null
    }
  ],
  "implementation_notes": {
    "legal_metrology": "do_not_substitute_lidar_estimates_for_certified_scale_mass",
    "calibration": "certificate_expiry_not_equivalent_to_sensor_failure",
    "security": "barrier_hardware_interlocks_and_manual_override_policy_required",
    "tbd_parameters": [
      "stability_window",
      "anpr_threshold",
      "permit_limits",
      "calibration_device_limits",
      "turnaround_threshold",
      "image_retention",
      "rpo",
      "rto",
      "capacity",
      "legal_approval"
    ]
  }
}
```

---

**پایان سند.** شواهد لینک‌دار با شناسه ثابت در بخش ۲، جدول ویژگی‌ها و قسمت‌های تحلیلی قابل جست‌وجو هستند. تمامی آستانه‌ها و معیارهایی که از کاتالوگ قابل‌استخراج نبودند به‌جای مقداردهی ساختگی، TBD باقی مانده‌اند.
