# مشخصات مستقل محصول: سامانه یکپارچه باسکول، کنترل تردد و هوشمندی حمل معدنی

**نسخه:** 1.0 — 2026-10-25  |  **مرجع اولیه:** [WeighHub](https://weighhub.com/)  |  **وضعیت:** طراحی مهندسی مستند، نه تأیید اجرایی تجهیزات  
**هدف:** ورودی مستقل برای تیم توسعه/AI کدنویس؛ بدون بازتولید لوگو، متن، رابط اختصاصی، کد یا دارایی بصری رقبا.

**راهنمای صحت:** «تأییدشده» یعنی منبع موردنظر به صراحت همین ویژگی را ذکر کرده است؛ «استنباطی» یعنی صرفاً از تصویر/قرینه استخراج شده؛ «پیشنهادی» یعنی requirement محصول ماست و **به رقیب نسبت داده نمی‌شود**. «نامشخص» به معنی نبود قابلیت نیست. در ماتریس `✓[Snn]`=دارد/تأییدشده، `؟`=نامشخص، `✕`=فاقد قابلیتِ صریحاً تأییدشده (در این ارزیابی مدرک کافی برای درج ✕ نبود). همه ارجاعات `[Snn]` در بخش ۲ با URL مستقیم آمده‌اند.

## 1. خلاصه اجرایی

1. WeighHub هستهٔ ثبت توزین و تردد است و قابلیت‌های دامنهٔ «کنترل تردد + تراکنش + ممیزی» را به‌روشنی مستند کرده است [S01][S02].
2. اتصال وزن در آن از indicator با RS-232 از طریق Windows agent یا ESP32 انجام می‌شود؛ دستگاه دارای هویت مستقل است [S03].
3. فرآیند شامل دروازه، توزین دوگانه، بلیت وزن، موجودی، گزارش و مجوز خروج QR یک‌بارمصرف است [S01].
4. یک API عمومی، مدل دقیق دیتابیس، RFID/ANPR خودکار یا اسکن LiDAR در اسناد بررسی‌شدهٔ WeighHub احراز نشده‌اند؛ آن‌ها را «نامشخص» تلقی کنید.
5. WeighHub به‌صراحت خود را کالیبره‌کنندهٔ باسکول معرفی نمی‌کند؛ پایش سلامت لودسل باید از OEM/indicator افزوده شود [S06][S23][S26].
6. SmarTower، TruckFlow و WeighMAST مرجع طراحی RFID/ANPR/حسگر موقعیت/راهبند هستند [S14][S16][S22].
7. Loadscan مرجع مستقل حجم، LiDAR، پروفایل سه‌بعدی و اتصال API است [S27][S28][S30].
8. Wenco، DISPATCH، MineStar و LOADRITE مرجع KPI شیفت، چرخه حمل و بار مفید آنبورد هستند [S32][S34][S38][S39].
9. محصول پیشنهادی از ابتدا باید Evidence-first، Event-driven و Adapter-based ساخته شود تا وزن قانونی با حجم تخمینی یا payload آنبورد اشتباه نشود.
10. پیشنهاد عرضه: **P0 باسکول/مجوز/گزارش**، **P1 اتوماسیون دروازه/ANPR/RFID/سلامت**، **P2 LiDAR و FMS**.
11. این گزارش «خزش کامل قطعی» نیست: sitemap، robots، دمو و بعضی تصاویر/PDFها محدودیت دسترسی داشتند؛ شکاف‌ها ثبت شده‌اند.

## 2. فهرست منابع و میزان بررسی

### 2.1 دفتر شواهد قابل ردیابی

| کد | سازمان/محصول | URL سند | آنچه بررسی شد |
|---|---|---|---|
| S01 | WeighHub — محصول، روال ورود تا خروج | [https://weighhub.com/en/features](https://weighhub.com/en/features) | صفحه وب؛ بخش Stop 0 تا Add-ons |
| S02 | WeighHub — کنترل‌ها و کشف مغایرت | [https://weighhub.com/en/controls](https://weighhub.com/en/controls) | صفحه وب؛ Controls 01–10 |
| S03 | WeighHub — اتصال به نشان‌دهنده | [https://weighhub.com/en/connect](https://weighhub.com/en/connect) | صفحه وب؛ Windows agent / ESP32 |
| S04 | WeighHub — نسخه‌ها و محدودیت‌های ماژول | [https://weighhub.com/en/pricing](https://weighhub.com/en/pricing) | جدول Basic / Professional / Enterprise |
| S05 | WeighHub — نمای اصلی | [https://weighhub.com/en](https://weighhub.com/en) | صفحه وب و برچسب‌های تصاویر |
| S06 | WeighHub — شرایط و مسئولیت کالیبراسیون | [https://weighhub.com/en/terms](https://weighhub.com/en/terms) | مواد ۳، ۱۰، ۱۲، ۱۷ |
| S07 | WeighHub — معانی و فرآیند | [https://weighhub.com/en/glossary](https://weighhub.com/en/glossary) | صفحه Glossary |
| S08 | WeighHub — فهرست مقالات | [https://weighhub.com/en/articles](https://weighhub.com/en/articles) | صفحه Articles |
| S09 | WeighHub — تقلب در توزین | [https://weighhub.com/en/articles/prevent-weighbridge-fraud](https://weighhub.com/en/articles/prevent-weighbridge-fraud) | مقاله؛ مثال یک چرخ خارج باسکول |
| S10 | WeighHub — کالیبراسیون | [https://weighhub.com/en/articles/weighbridge-calibration](https://weighhub.com/en/articles/weighbridge-calibration) | مقاله؛ راهنمای آموزشی، نه ادعای ماژول |
| S11 | WeighHub — درباره شرکت | [https://weighhub.com/en/about](https://weighhub.com/en/about) | صفحه About |
| S12 | WeighHub — درخواست استعلام | [https://weighhub.com/en/request](https://weighhub.com/en/request) | فرم و گام‌های راه‌اندازی |
| S13 | Avery Weigh-Tronix — Weighman 8 | [https://www.averyweigh-tronix.com/en/product/weighman-8-weighbridge-software/](https://www.averyweigh-tronix.com/en/product/weighman-8-weighbridge-software/) | صفحه محصول رسمی؛ ANPR/RFID/ترمینال/گزارش |
| S14 | Avery Weigh-Tronix — SmarTower | [https://www.averyweigh-tronix.com/en/product/smartower-unmanned-weighbridge-system/](https://www.averyweigh-tronix.com/en/product/smartower-unmanned-weighbridge-system/) | صفحه محصول رسمی؛ RFID UHF، سنسور موقعیت، دوربین |
| S15 | Avery Weigh-Tronix — بروشور SmarTower | [https://www.averyweigh-tronix.com/en-ie/wp-content/uploads/sites/6/2021/11/smartower_uws_brochure.pdf](https://www.averyweigh-tronix.com/en-ie/wp-content/uploads/sites/6/2021/11/smartower_uws_brochure.pdf) | نتیجه جست‌وجو؛ دریافت مستقیم ۴۰۴، مستقل تأیید نشد |
| S16 | PRECIA MOLEN — TruckFlow بروشور فنی | [https://us.preciamolen.com/wp-content/uploads/sites/22/2019/07/09-15-01-1-FT-TRUCKFLOW-V00.09.pdf](https://us.preciamolen.com/wp-content/uploads/sites/22/2019/07/09-15-01-1-FT-TRUCKFLOW-V00.09.pdf) | PDF دوصفحه‌ای؛ P1/P2، متن استخراج‌شده؛ رندر ناموفق |
| S17 | PRECIA MOLEN — TruckFlow مشخصات تکمیلی | [https://www.directindustry.com/prod/precia-molen/product-7658-2537247.html](https://www.directindustry.com/prod/precia-molen/product-7658-2537247.html) | فهرست‌کننده صنعتی؛ ویژگی‌های تکمیلی؛ ثانویه |
| S18 | Dariel — WBX معرفی تاریخی | [https://it-online.co.za/2019/05/24/wbx-automates-weighbridge-process/](https://it-online.co.za/2019/05/24/wbx-automates-weighbridge-process/) | منبع ثانویه ۲۰۱۹؛ ERP، ورود و خروج |
| S19 | Dariel — WBX در معدن زغال‌سنگ | [https://www.miningweekly.com/article/weighbridge-solution-installed-at-mpumalanga-coal-mine-2014-05-23/page%3A2](https://www.miningweekly.com/article/weighbridge-solution-installed-at-mpumalanga-coal-mine-2014-05-23/page%3A2) | منبع ثانویه ۲۰۱۴؛ RFID/ANPR/traffic light |
| S20 | Endel Digital — WeighMAST بروشور | [https://5.imimg.com/data5/SELLER/Doc/2022/5/NL/GN/IU/108975308/weighbridge-data-sms-and-email-system.pdf](https://5.imimg.com/data5/SELLER/Doc/2022/5/NL/GN/IU/108975308/weighbridge-data-sms-and-email-system.pdf) | PDF شش صفحه؛ ص۳ قابلیت‌ها، ص۴ اسکرین‌شات‌ها؛ هر دو بصری بررسی شد |
| S21 | Endel Digital — وب‌سایت سازنده | [https://endel.digital/](https://endel.digital/) | صفحه رسمی محصول و ادغام PLC/SCADA |
| S22 | Endel Digital — WeighMAST Unmanned | [https://www.linkedin.com/products/endel-digital-solutions-weighmast-weighbridge-software/](https://www.linkedin.com/products/endel-digital-solutions-weighmast-weighbridge-software/) | صفحه محصول برند در LinkedIn؛ مراحل RFID/ANPR/position/camera |
| S23 | METTLER TOLEDO — POWERCELL PDX | [https://www.mt.com/in/en/home/products/Transport_and_Logistics_Solutions/truck-and-rail-scale-systems/truck-scale-systems/powercell-pdx-load-cells-42904891002.html](https://www.mt.com/in/en/home/products/Transport_and_Logistics_Solutions/truck-and-rail-scale-systems/truck-scale-systems/powercell-pdx-load-cells-42904891002.html) | صفحه رسمی؛ تشخیص سلامت تک‌لودسل |
| S24 | METTLER TOLEDO — TraxEMT/IND780 | [https://www.mt.com/ca/en/home/library/datasheets/industrial-scales/terminals/ind780-pdf.html](https://www.mt.com/ca/en/home/library/datasheets/industrial-scales/terminals/ind780-pdf.html) | فهرست رسمی راهنما؛ اثبات وجود راهنمای TraxEMT |
| S25 | METTLER TOLEDO — TraxEMT شرح قابلیت | [https://www.mt.com/dam/mt_ext_files/Editorial/Generic/0/OEM_SI_brochure_full_range_Editorial-Generic_1153724549187_files/br_oemsystemintegrationen060704lr1153724549187.pdf](https://www.mt.com/dam/mt_ext_files/Editorial/Generic/0/OEM_SI_brochure_full_range_Editorial-Generic_1153724549187_files/br_oemsystemintegrationen060704lr1153724549187.pdf) | PDF رسمی؛ از نتیجه جست‌وجو، اسکرین‌شات تأیید نشد |
| S26 | Rice Lake — iQUBE² | [https://www.ricelake.com/products/iqube2-digital-diagnostic-junction-box?part=93243](https://www.ricelake.com/products/iqube2-digital-diagnostic-junction-box?part=93243) | صفحه رسمی؛ diagnostic/zero/drift/unbalance/interfaces |
| S27 | Loadscan — MyScanner | [https://www.loadscan.com/myscanner/](https://www.loadscan.com/myscanner/) | صفحه رسمی؛ cloud، KPI، 3D، خروجی و هشدار |
| S28 | Loadscan — MPS | [https://www.loadscan.com/mine-payload-scanner/](https://www.loadscan.com/mine-payload-scanner/) | صفحه رسمی؛ اسکن خالی و پر، RFID، 3D |
| S29 | Loadscan — LVS | [https://www.loadscan.com/load-volume-scanner/](https://www.loadscan.com/load-volume-scanner/) | صفحه رسمی؛ لیزر و حجم مستقل از چگالی |
| S30 | Loadscan — API | [https://www.loadscan.com/loadscan-integration-api/](https://www.loadscan.com/loadscan-integration-api/) | صفحه رسمی؛ REST/JSON و LAN SQL |
| S31 | Loadscan — LoadVision | [https://www.loadscan.com/myscanner/loadvision/](https://www.loadscan.com/myscanner/loadvision/) | صفحه رسمی؛ ویدیو، عکس اسکن خالی/پر |
| S32 | LOADRITE — InsightHQ / LR360 | [https://www.halomec.com/uploads/4/5/2/1/45211295/trimble_loadrite_lr360_brochure.pdf](https://www.halomec.com/uploads/4/5/2/1/45211295/trimble_loadrite_lr360_brochure.pdf) | PDF بروشور توزیع‌کننده؛ گزارش لودر، TPH و ارتباط باسکول |
| S33 | LOADRITE — LR360 یکپارچگی لودر و باسکول | [https://sitechnw.com/products/loadrite-360-loadout-management-system/](https://sitechnw.com/products/loadrite-360-loadout-management-system/) | نمایندگی؛ شرح عملیات |
| S34 | Wenco — Fleet Management | [https://www.wencomine.com/our-solutions/mining-fleet-management](https://www.wencomine.com/our-solutions/mining-fleet-management) | رسمی؛ drag/drop، real-time dashboards، cycle/payload |
| S35 | Wenco/Hitachi — داشبورد KPI | [https://www.hitachi.com/en-us/press/wenco-mine-performance-suite-6-reimagines-dispatching-analytics-and-total-mine-performance/](https://www.hitachi.com/en-us/press/wenco-mine-performance-suite-6-reimagines-dispatching-analytics-and-total-mine-performance/) | خبر رسمی ۲۰۱۸؛ bucket-by-bucket و hourly KPI |
| S36 | Hexagon — MineOperate OP Pro | [https://hexagon.com/company/newsroom/press-releases/2022/hexagon-awarded-significant-fleet-management-project](https://hexagon.com/company/newsroom/press-releases/2022/hexagon-awarded-significant-fleet-management-project) | رسمی؛ workflow، haulage، blending |
| S37 | Hexagon — مطالعه موردی معدن | [https://hexagon.com/-/media/project/one-web/master-site/products/hxgn-mineoperate-op-pro-hp/case_study_01_mineoperate_op_pro_lp.pdf](https://hexagon.com/-/media/project/one-web/master-site/products/hxgn-mineoperate-op-pro-hp/case_study_01_mineoperate_op_pro_lp.pdf) | PDF رسمی؛ منبع متنی، رندر بررسی نشده |
| S38 | Modular / Komatsu — DISPATCH | [https://www.komatsu.com/en-us/technology/smart-mining/loading-and-haulage/dispatch](https://www.komatsu.com/en-us/technology/smart-mining/loading-and-haulage/dispatch) | صفحه رسمی؛ dispatch/queue/fuel/blending/digital twin |
| S39 | Caterpillar — MineStar Fleet | [https://www.cat.com/en_US/by-industry/mining/surface-mining/surface-technology/fleet.html](https://www.cat.com/en_US/by-industry/mining/surface-mining/surface-technology/fleet.html) | رسمی؛ payload، cycle time، routing، shift/fuel |
| S40 | Caterpillar — Terrain for Loading | [https://www.cat.com/en_GB/products/new/technology/terrain/terrain/1000030252.html](https://www.cat.com/en_GB/products/new/technology/terrain/terrain/1000030252.html) | رسمی؛ payload bucket، material tracking |
| S41 | WeighHub — نمایش دمو | [https://demo.weighhub.com/](https://demo.weighhub.com/) | بازشدن دمو ناموفق؛ بدون بررسی تعاملی |
| S42 | WeighHub — robots | [https://weighhub.com/robots.txt](https://weighhub.com/robots.txt) | غیرقابل بازیابی |
| S43 | WeighHub — sitemap | [https://weighhub.com/sitemap.xml](https://weighhub.com/sitemap.xml) | غیرقابل بازیابی |
| S44 | WeighHub — privacy | [https://weighhub.com/en/privacy](https://weighhub.com/en/privacy) | غیرقابل بازیابی |
| S45 | WeighHub — Dashboard image | [https://weighhub.com/site/shots/dashboard.png](https://weighhub.com/site/shots/dashboard.png) | ارجاع HTML موجود، خود تصویر مسدود |
| S46 | WeighHub — Gate image | [https://weighhub.com/site/shots/gate-log.png](https://weighhub.com/site/shots/gate-log.png) | ارجاع HTML موجود، خود تصویر مسدود |
| S47 | WeighHub — Weighing image | [https://weighhub.com/site/shots/weighing-new.png](https://weighhub.com/site/shots/weighing-new.png) | ارجاع HTML موجود، خود تصویر مسدود |
| S48 | WeighHub — Reports image | [https://weighhub.com/site/shots/reports.png](https://weighhub.com/site/shots/reports.png) | ارجاع HTML موجود، خود تصویر مسدود |
| S49 | TruckFlow — نمای رابط کاربری - ثالث | [https://cdn.techjockey.com/web/assets/images/techjockey/products/screenshots/21235_truckflowsoftwareweight.jpg](https://cdn.techjockey.com/web/assets/images/techjockey/products/screenshots/21235_truckflowsoftwareweight.jpg) | نتیجه تصویر ثالث؛ مشاهده‌شده، نه سند مستقل کارکرد |
[S01]: https://weighhub.com/en/features
[S02]: https://weighhub.com/en/controls
[S03]: https://weighhub.com/en/connect
[S04]: https://weighhub.com/en/pricing
[S05]: https://weighhub.com/en
[S06]: https://weighhub.com/en/terms
[S07]: https://weighhub.com/en/glossary
[S08]: https://weighhub.com/en/articles
[S09]: https://weighhub.com/en/articles/prevent-weighbridge-fraud
[S10]: https://weighhub.com/en/articles/weighbridge-calibration
[S11]: https://weighhub.com/en/about
[S12]: https://weighhub.com/en/request
[S13]: https://www.averyweigh-tronix.com/en/product/weighman-8-weighbridge-software/
[S14]: https://www.averyweigh-tronix.com/en/product/smartower-unmanned-weighbridge-system/
[S15]: https://www.averyweigh-tronix.com/en-ie/wp-content/uploads/sites/6/2021/11/smartower_uws_brochure.pdf
[S16]: https://us.preciamolen.com/wp-content/uploads/sites/22/2019/07/09-15-01-1-FT-TRUCKFLOW-V00.09.pdf
[S17]: https://www.directindustry.com/prod/precia-molen/product-7658-2537247.html
[S18]: https://it-online.co.za/2019/05/24/wbx-automates-weighbridge-process/
[S19]: https://www.miningweekly.com/article/weighbridge-solution-installed-at-mpumalanga-coal-mine-2014-05-23/page%3A2
[S20]: https://5.imimg.com/data5/SELLER/Doc/2022/5/NL/GN/IU/108975308/weighbridge-data-sms-and-email-system.pdf
[S21]: https://endel.digital/
[S22]: https://www.linkedin.com/products/endel-digital-solutions-weighmast-weighbridge-software/
[S23]: https://www.mt.com/in/en/home/products/Transport_and_Logistics_Solutions/truck-and-rail-scale-systems/truck-scale-systems/powercell-pdx-load-cells-42904891002.html
[S24]: https://www.mt.com/ca/en/home/library/datasheets/industrial-scales/terminals/ind780-pdf.html
[S25]: https://www.mt.com/dam/mt_ext_files/Editorial/Generic/0/OEM_SI_brochure_full_range_Editorial-Generic_1153724549187_files/br_oemsystemintegrationen060704lr1153724549187.pdf
[S26]: https://www.ricelake.com/products/iqube2-digital-diagnostic-junction-box?part=93243
[S27]: https://www.loadscan.com/myscanner/
[S28]: https://www.loadscan.com/mine-payload-scanner/
[S29]: https://www.loadscan.com/load-volume-scanner/
[S30]: https://www.loadscan.com/loadscan-integration-api/
[S31]: https://www.loadscan.com/myscanner/loadvision/
[S32]: https://www.halomec.com/uploads/4/5/2/1/45211295/trimble_loadrite_lr360_brochure.pdf
[S33]: https://sitechnw.com/products/loadrite-360-loadout-management-system/
[S34]: https://www.wencomine.com/our-solutions/mining-fleet-management
[S35]: https://www.hitachi.com/en-us/press/wenco-mine-performance-suite-6-reimagines-dispatching-analytics-and-total-mine-performance/
[S36]: https://hexagon.com/company/newsroom/press-releases/2022/hexagon-awarded-significant-fleet-management-project
[S37]: https://hexagon.com/-/media/project/one-web/master-site/products/hxgn-mineoperate-op-pro-hp/case_study_01_mineoperate_op_pro_lp.pdf
[S38]: https://www.komatsu.com/en-us/technology/smart-mining/loading-and-haulage/dispatch
[S39]: https://www.cat.com/en_US/by-industry/mining/surface-mining/surface-technology/fleet.html
[S40]: https://www.cat.com/en_GB/products/new/technology/terrain/terrain/1000030252.html
[S41]: https://demo.weighhub.com/
[S42]: https://weighhub.com/robots.txt
[S43]: https://weighhub.com/sitemap.xml
[S44]: https://weighhub.com/en/privacy
[S45]: https://weighhub.com/site/shots/dashboard.png
[S46]: https://weighhub.com/site/shots/gate-log.png
[S47]: https://weighhub.com/site/shots/weighing-new.png
[S48]: https://weighhub.com/site/shots/reports.png
[S49]: https://cdn.techjockey.com/web/assets/images/techjockey/products/screenshots/21235_truckflowsoftwareweight.jpg

### 2.2 دامنه، پوشش خزش و محدودیت‌های دسترسی

- **بازیابی‌شده و خوانده‌شده:** صفحات اصلی انگلیسی WeighHub، features، controls، connect، pricing، about، request، articles، glossary، terms، دو مقالهٔ نمونه؛ مستندات رسمی/بازنشر برخی شرکت‌های مقایسه‌ای [S01][S02][S03][S04][S06][S16][S20][S34][S39].
- **شناسایی شده ولی غیرقابل بررسی کامل:** دمو read-only در `https://demo.weighhub.com/` [S41]؛ `robots.txt` [S42] و `sitemap.xml` [S43]؛ صفحه privacy [S44]؛ چهار عکس اصلی UI در آدرس‌های [S45][S46][S47][S48]. بنابر این نمی‌توان ادعای استخراج «همه URLهای دامنه» کرد.
- **PDF:** بروشور TruckFlow دو صفحه به‌صورت متنی استخراج شد [S16]؛ رندر تصاویر PDF از ابزار وب به خطای Redirect انجامید. بروشور WeighMAST شش صفحه استخراج شد و **اسکرین‌شات صفحهٔ ۳ و جدول قابلیت‌های صفحهٔ ۲ (شماره صفحه ۰-مبنا: 3 و 2)** به‌صورت بصری مشاهده شدند [S20]. لینک بروشور SmarTower در بازکردن مستقیم 404 شد [S15]. راهنمای iQUBE² PDF با خطای 403 مواجه بود؛ صفحه رسمی وب [S26] مبناست.
- **ویدیو:** ارجاع رسمی Wenco به ویدیو وجود دارد [S34] اما خود ویدیوها فریم‌به‌فریم قابل بررسی نبودند. جریان ویدیو **بازسازی نشده**؛ فرآیندها فقط از متن رسمی استخراج شده‌اند.
- **درجهٔ پوشش:** WeighHub بالا برای صفحات محصول و متوسط برای UI؛ رقبا گزینشی/ویژگی‌محور (نه خزش کامل همه دامنه‌ها). تاریخ مستندات قدیمی WBX و بخشی از بروشورهای صنعتی در استناد لحاظ شود.

### 2.3 شواهد مستقیم WeighHub (دسته‌های A تا L)

| محور | مشاهدات صریح | سطح | سند |
|---|---|---|---|
| A | ورود خودرو با پلاک، راننده، عکس زندهٔ گواهینامه؛ خروج با اسکن QR و ثبت Visit | تأییدشده | [S01][S02] |
| A | دوربین عکسبرداری خودرو در زمان وزن، وابسته به سطح اشتراک؛ **ANPR/RFID احراز نشده** | تأییدشده / نامشخص برای ANPR | [S01][S04] |
| B | tare/gross با دو مرحله و امکان معکوس کردن ترتیب؛ multi-material؛ quick weigh با تارا و شماره مجوز | تأییدشده | [S01] |
| C | مشتری، ماده، پلاک، راننده، وزن‌ها، نام ایجادکننده/تأییدکننده، زمان و source method | تأییدشده | [S01][S02] |
| D | خروج: Permit با شماره سریالی محلی و QR token یک‌بارمصرف؛ قرارداد و سهمیه در Enterprise | تأییدشده | [S01][S04] |
| D | انطباق عددی خودکار با حواله فروش و محدودیت حمل: در مدارک دیده نشد | نامشخص | [S01][S04] |
| E | داخل سایت + مدت اقامت؛ زمان ورود/خروج و گزارش رفت‌وآمد | تأییدشده | [S01] |
| F | کنترل fresh/stable و Fraud Review؛ اینها **معادل calibration monitoring نیستند** | تأییدشده / تفکیک فنی | [S02][S06] |
| G | LiDAR، اسکن حجمی، چگالی: شواهدی در صفحات محصول پیدا نشد | نامشخص | [S01][S04] |
| H | dashboard توزین، operator performance، تفکیک شعب؛ **KPI کلاسیک کامیون معدنی/FMS در اسناد دیده نشد** | تأییدشده / نامشخص | [S01] |
| I | گزارش روزانه، صورت‌حساب مشتری، فیلتر، CSV/PDF، ایمیل زمان‌بندی‌شده، Android/PWA | تأییدشده | [S01][S04] |
| J | RS-232، Windows 10/11 COM Agent، ESP32 Wi-Fi؛ حسابداری به‌عنوان add-on | تأییدشده | [S01][S03] |
| J | Modbus/OPC UA/MQTT و API عمومی: در مدارک پیدا نشد | نامشخص | [S01][S03] |
| K | نقش‌ها، قفل دستگاه، audit HMAC chain، reprint counter، anomaly rules | تأییدشده | [S02] |
| L | Cloud per tenant/subdomain با DB مستقل؛ nightly backup؛ local quick-weigh queue؛ چندشعبه‌ای Enterprise | تأییدشده | [S01][S02][S03][S04][S06] |

**ظرافت اجرایی:** در WeighHub شرط fresh بودن روی صفحهٔ وب «کمتر از ۱۲ ثانیه» است [S02] ولی عامل ویندوز بعد از ۳ ثانیه سکوت نشان‌دهنده، reading محلی را stale می‌کند [S03]؛ این دو آستانه در لایه‌های متفاوت‌اند و نباید یکی فرض شوند. فرکانس ارسال نمونه حدود یک reading/ثانیه گزارش شده [S01]. تعریف ساعت و منطقه زمانی هم‌زمان با deployment باید از تنظیم Cairo-specific مرجع مستقل شود.

## 3. ماتریس مقایسه ویژگی‌ها و هسته

**کلید شرکت‌ها:** `WH` WeighHub (نرم‌افزار)، `AW` Weighman 8، `ST` SmarTower (سخت‌افزار+نرم‌افزار)، `PM` TruckFlow، `DB` Dariel WBX (شواهد تاریخی)، `WM` WeighMAST، `MT` POWERCELL/TraxEMT (لایه لودسل)، `RL` iQUBE² (لایه الکترونیک)، `LS` Loadscan، `TL` LOADRITE، `WE` Wenco، `HX` Hexagon MineOperate، `MO` Modular DISPATCH، `CA` Cat MineStar. مقایسهٔ لایه‌های سخت‌افزار و نرم‌افزار صرفاً برای انتخاب معماری کل محصول است؛ علامت `؟` در سامانه‌های FMS برای امکانات باسکول طبیعی است.

**تعریف هسته:** ویژگی با دست‌کم ۳ ستون **تأییدشده با لینک در این ماتریس**؛ «هسته» شمارش محصولات بازاریافته است، نه نشانهٔ لزوم قراردادی یا قابلیت همسان در همه نسخه‌ها. برای `S15` (PDF غیرقابل بازشدن) فقط قابلیت‌هایی استفاده شده‌اند که در نتیجهٔ متنی جست‌وجو هم معرفی شدند؛ در تصمیم فنی بازبینی مجدد لازم است.

| رسته | ویژگی | هسته ≥۳ | WH | AW | ST | PM | DB | WM | MT | RL | LS | TL | WE | HX | MO | CA |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A | ثبت تردد ورود/خروج | **هسته** | ✓[S01] | ؟ | ؟ | ✓[S16] | ✓[S18] | ✓[S20] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |
| A | RFID شناسایی | **هسته** | ؟ | ✓[S13] | ✓[S14] | ؟ | ✓[S19] | ✓[S22] | ؟ | ؟ | ✓[S28] | ؟ | ؟ | ؟ | ؟ | ؟ |
| A | UHF RFID (صرفاً نوع، نه باند دقیق) | خاص/کم‌یاب | ؟ | ؟ | ✓[S14] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |
| A | ANPR / خواندن پلاک | **هسته** | ؟ | ✓[S13] | ؟ | ✓[S17] | ✓[S19] | ✓[S22] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |
| A | دوربین/عکس مرتبط با وزن | **هسته** | ✓[S01] | ؟ | ✓[S14] | ✓[S16] | ؟ | ✓[S20] | ؟ | ؟ | ✓[S31] | ؟ | ؟ | ؟ | ؟ | ؟ |
| A | راهبند/چراغ ترافیک | **هسته** | ؟ | ؟ | ✓[S14] | ✓[S16] | ✓[S19] | ✓[S22] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |
| A | سنسور جایگیری وسیله | خاص/کم‌یاب | ؟ | ؟ | ✓[S14] | ؟ | ؟ | ✓[S22] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |
| A | ترمینال خودخدمت راننده | خاص/کم‌یاب | ؟ | ✓[S13] | ؟ | ✓[S16] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |
| B | وزن اول/دوم و خالص | خاص/کم‌یاب | ✓[S01] | ؟ | ؟ | ✓[S16] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |
| B | تارای ذخیره‌شده یا توزین سریع | خاص/کم‌یاب | ✓[S01] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |
| B | چند باسکول/چند ایستگاه | **هسته** | ✓[S01] | ✓[S13] | ؟ | ✓[S16] | ؟ | ✓[S20] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |
| B | ثبت چند ماده در یک سفر | خاص/کم‌یاب | ✓[S01] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |
| B | مستندسازی عکس قبل/بعد | خاص/کم‌یاب | ؟ | ؟ | ؟ | ✓[S16] | ؟ | ؟ | ؟ | ؟ | ✓[S31] | ؟ | ؟ | ؟ | ؟ | ؟ |
| C | شناسه راننده/وسیله/ماده/شرکت | **هسته** | ✓[S01] | ؟ | ؟ | ✓[S16] | ؟ | ✓[S20] | ؟ | ؟ | ✓[S27] | ؟ | ؟ | ؟ | ؟ | ؟ |
| C | ثبت time / truck ID / operator / product برای حجم | خاص/کم‌یاب | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ✓[S27] | ؟ | ؟ | ؟ | ؟ | ؟ |
| D | مجوز خروج با QR یک‌بارمصرف | خاص/کم‌یاب | ✓[S01] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |
| D | قرارداد/سهمیه مشتری | خاص/کم‌یاب | ✓[S01] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |
| D | تطبیق وزن با مجوز حمل به‌صورت کامل | خاص/کم‌یاب | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |
| E | زمان حضور / turnaround | خاص/کم‌یاب | ✓[S01] | ؟ | ؟ | ✓[S16] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |
| E | عملکرد ساعتی تولید/جابه‌جایی | **هسته** | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ✓[S27] | ؟ | ✓[S35] | ؟ | ؟ | ✓[S39] |
| F | تشخیص drift/zero و خرابی لودسل | خاص/کم‌یاب | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ✓[S23] | ✓[S26] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |
| F | گواهی کالیبراسیون و تاریخ انقضا | خاص/کم‌یاب | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |
| F | نظارت سلامت/تشخیص خطا | **هسته** | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ✓[S25] | ✓[S26] | ✓[S27] | ؟ | ؟ | ؟ | ؟ | ؟ |
| G | پروفایل سه‌بعدی و اندازه‌گیری حجم | خاص/کم‌یاب | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ✓[S27] | ؟ | ؟ | ؟ | ؟ | ؟ |
| G | اسکن مرجع خالی و اسکن پر | خاص/کم‌یاب | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ✓[S28] | ؟ | ؟ | ؟ | ؟ | ؟ |
| H | گزارش KPI ناوگان و شیفت | **هسته** | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ✓[S32] | ✓[S34] | ✓[S36] | ✓[S38] | ✓[S39] |
| H | payload آنبورد / لودر / شاول | **هسته** | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ✓[S32] | ✓[S34] | ؟ | ؟ | ✓[S40] |
| H | مسیر/تخصیص کامیون و shovel | **هسته** | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ✓[S34] | ✓[S36] | ✓[S38] | ✓[S39] |
| H | زمان چرخه/انتظار/بیکاری | **هسته** | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ✓[S34] | ؟ | ✓[S38] | ✓[S39] |
| I | داشبورد عملیاتی | **هسته** | ✓[S01] | ؟ | ؟ | ؟ | ؟ | ✓[S20] | ؟ | ؟ | ✓[S27] | ✓[S32] | ✓[S34] | ؟ | ؟ | ✓[S39] |
| I | خروجی فایل و گزارش | **هسته** | ✓[S01] | ✓[S13] | ؟ | ✓[S16] | ؟ | ✓[S20] | ؟ | ؟ | ✓[S27] | ✓[S32] | ✓[S34] | ؟ | ؟ | ؟ |
| I | ارسال برنامه‌ریزی‌شده گزارش | خاص/کم‌یاب | ✓[S01] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ✓[S27] | ؟ | ؟ | ؟ | ؟ | ؟ |
| I | موبایل/وب ریموت | **هسته** | ✓[S01] | ؟ | ؟ | ✓[S17] | ؟ | ✓[S20] | ؟ | ؟ | ✓[S27] | ✓[S32] | ✓[S34] | ؟ | ؟ | ؟ |
| J | ERP / امور مالی / تبادل فایل | **هسته** | ؟ | ✓[S13] | ✓[S14] | ✓[S16] | ✓[S18] | ✓[S20] | ؟ | ؟ | ✓[S30] | ؟ | ؟ | ؟ | ؟ | ؟ |
| J | API مستند REST/JSON | خاص/کم‌یاب | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ✓[S30] | ؟ | ؟ | ؟ | ؟ | ؟ |
| J | RS-232 / serial scale | **هسته** | ✓[S03] | ؟ | ؟ | ✓[S16] | ؟ | ؟ | ✓[S24] | ✓[S26] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |
| J | PLC / SCADA و کنترل محیط | خاص/کم‌یاب | ؟ | ؟ | ؟ | ✓[S16] | ؟ | ✓[S21] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |
| K | نقش‌های کاربری | **هسته** | ✓[S02] | ؟ | ؟ | ✓[S16] | ؟ | ✓[S20] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |
| K | حسابرسی و تاریخچه تغییرات | خاص/کم‌یاب | ✓[S02] | ؟ | ؟ | ؟ | ؟ | ✓[S20] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |
| K | تقلب/مغایرت وزن | **هسته** | ✓[S02] | ؟ | ؟ | ✓[S16] | ؟ | ✓[S20] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |
| L | چندسایتی / تجمیع | **هسته** | ✓[S01] | ✓[S13] | ؟ | ✓[S16] | ؟ | ✓[S20] | ؟ | ؟ | ✓[S27] | ؟ | ✓[S34] | ✓[S36] | ؟ | ؟ |
| L | Cloud / مرورگر | **هسته** | ✓[S06] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ✓[S27] | ✓[S32] | ✓[S34] | ؟ | ؟ | ؟ |
| L | آفلاین و همگام‌سازی صف محلی | خاص/کم‌یاب | ✓[S03] | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ | ؟ |

### 3.1 ویژگی‌های مشترک «هسته»

هسته‌ها در ماتریس با ۳+ شاهد تأیید شده‌اند: **شناسه وسیله و محموله، RFID، ANPR، راهبند/دوربین در سامانه‌های اتوماسیون، دو توزین و خالص، چند باسکول، داده مشتری/ماده/راننده، داشبورد، گزارش، سطوح دسترسی، چندسایتی، KPI حمل در FMS**. این‌ها دو زیربخش مکمل «هستهٔ باسکول/دروازه» و «هستهٔ تحلیلی معدن» دارند؛ برای P0 همهٔ قابلیت‌های FMS اجباری نیستند.

### 3.2 تمایزهای مستند

- **WeighHub:** QR خروج یک‌بارمصرف، حسابرسی زنجیره HMAC، public QR validation، offline idempotent quick weighing و بانک اطلاعاتی تفکیک‌شدهٔ tenant [S01][S02][S03].
- **PRECIA MOLEN TruckFlow:** ویندوز WPF، SQL Server، تعاریف فیلدهای سفارشی، کنترل راهبند/چراغ، عکس قبل/بعد، JSON/CSV export، نمایش تجهیزات روی صفحه دوم [S16، ص ۱–۲].
- **Avery SmarTower:** UHF reader، guidance صوتی/بصری، سنسور موقعیت و تصویربرداری IP در مجموعهٔ unmanned [S14].
- **Rice Lake و METTLER TOLEDO:** پایش مستقل لودسل، zero drift/noise/unbalance و عیب‌یابی واقعی نشان‌دهنده — نه صرفاً پایش گزارش وزن [S23][S25][S26].
- **Loadscan:** 3D profiler، Empty baseline و Loaded scan، دسترسی ابری، API و افزونه تصاویر/ویدیو [S27][S28][S29][S30][S31].
- **Wenco / DISPATCH / MineStar:** چرخه حمل، تخصیص شاول-کامیون، جلوگیری از مسیر اشتباه، انتظار و بهره‌برداری ناوگان [S34][S38][S39].

## 4. PRD (Product Requirements Document)

### 4.1 مرز محصول و نقش‌ها

**ماژول‌های محصول:** `Core Registry`، `Gate Control`، `Identity Fusion`، `Weighing Engine`، `Permit & Order`، `Ticket & Verification`، `Evidence/Audit`، `Device Gateway`، `Reports/BI`، `Alerts` و افزونه‌های `Calibration Diagnostics`، `Volume/LiDAR`، `Onboard Payload`، `Mine Fleet KPI`. «مجوز فروش» با «مجوز خروج» یک موجودیت یکسان نیست: Sales/Transport Permit یک مجوز کسب‌وکار است؛ ExitPermit یک authorization سندی برای عبور گیت.

| نقش | توانایی اصلی | محدودیت حیاتی | الهام مستند |
|---|---|---|---|
| مالک سامانه / ستاد | تنظیم سیاست، شعب، گزارش تجمیعی | فاقد دستکاری خوانش خام | [S01][S02] |
| مدیر معدن / شیفت | نظارت تولید، KPI، تأیید استثنا | مجوز ویژه برای override | [S01][S34] |
| اپراتور باسکول | ایجاد Session، capture، صدور سند مجاز | cannot write live weight | [S02][S03] |
| نگهبان دروازه | ورود/خروج، scan QR، تأیید تصویر | عدم دسترسی به گزارش مالی | [S01][S02] |
| کارشناس بازرگانی | مجوز، سهمیه، حواله، صورتحساب | عدم مدیریت calibration | [S01] / بخش جدید پیشنهادی |
| مسئول کالیبراسیون و نگهداری | certificate, diagnostics, service ticket | نمی‌تواند بلیت را اصلاح کند | [S23][S26] / نقش پیشنهادی |
| مدیر ناوگان | کامیون/لودر/شاول، cycle و payload | تغییر وزن قانونی ممنوع | [S34][S39] |
| حسابرس / ناظر | read-only، trail، evidence، anomalies | بدون حذف یا تأیید | [S02] |
| مسئول فناوری / یکپارچه‌سازی | adapter, heartbeat, PLC, API keys | تفکیک دسترسی credential و business data | پیشنهادی |

### 4.2 User stories و معیار پذیرش

| شناسه | داستان کاربر | Acceptance Criteria |
|---|---|---|
| US-01 | به‌عنوان نگهبان می‌خواهم وسیله را شناسایی و ورودش را ثبت کنم | Visit یکتا؛ زمان سرور، پلاک و evidence الزامی با سیاست سایت |
| US-02 | به‌عنوان اپراتور می‌خواهم وزن پایدار را فقط از indicator ثبت کنم | قرائت قدیمی/ناپایدار رد شود؛ raw event و DeviceID نگهداری شود |
| US-03 | به‌عنوان مسئول حمل می‌خواهم خالصِ مجاز با سفارش تطبیق داده شود | وزن خالص و سقف مجوز قابل مشاهده؛ violation مسیر تأیید استثنا دارد |
| US-04 | به‌عنوان نگهبان می‌خواهم فقط QR معتبر موجب باز شدن گیت شود | مصرف QR تراکنشی؛ scan دوم پاسخ refused؛ event ورود/خروج ثبت شود |
| US-05 | به‌عنوان حسابرس می‌خواهم نسخه قبلی سند و دلیل اصلاح را ببینم | همه نسخه‌ها، before/after، reason، actor و زمان حفظ شود |
| US-06 | به‌عنوان مدیر می‌خواهم بدانم چه کسی چه باری و چه زمانی وارد/خارج کرده است | drill-down KPI→سفر→تراکنش→سند→تصویر |
| US-07 | به‌عنوان تعمیرکار می‌خواهم خطای لودسل و انقضای گواهی را ببینم | با diagnostic_supported=false «ناموجود» نشان دهد نه «سالم» |
| US-08 | به‌عنوان مدیر تولید می‌خواهم بار مفید باسکول، لودر و LiDAR را مقایسه کنم | مقادیر جدا با واحد، خطا/عدم‌قطعیت و provenance نگهداری شوند |
| US-09 | به‌عنوان مدیر شعب می‌خواهم در قطعی اینترنت کار را ایمن ادامه دهم | رخداد در صف محلی، dedup در sync و ممنوعیت عبور غیرمجاز |
| US-10 | به‌عنوان مدیر ارشد می‌خواهم تولید/تعداد سفر/مدت چرخه را در هر شیفت ببینم | تنها Trips دارای event کامل محاسبه شوند؛ missing data آشکار است |

### 4.3 الزامات کارکردی (شماره‌دار و قابل تحویل)

| شناسه | اولویت | Requirement | منشأ قابلیت/قاعده |
|---|---|---|---|
| FR-01 | P0 | مدیریت سایت، شیفت، خط توزین و Zone؛ شناسه یکتا و منطقه زمانی مستقل | [S01] / تأییدشده برای مرجع |
| FR-02 | P0 | ثبت Vehicle/Driver/Carrier/Customer/Material و اعتبارسنجی تکرار پلاک | [S01] / تأییدشده برای مرجع |
| FR-03 | P0 | ثبت GateEvent ورود و خروج با کاربر، ساعت سرور و شناسه Visit | [S01] / تأییدشده برای مرجع |
| FR-04 | P0 | خواندن استریم وزن از دستگاه تأییدشده با آداپتور پروتکل و device key | [S03] / تأییدشده برای مرجع |
| FR-05 | P0 | عدم ثبت قرائت که stable نباشد یا age از آستانه قابل‌پیکربندی بیشتر باشد | [S02] / تأییدشده برای مرجع |
| FR-06 | P0 | دو توزین با ترتیب Tare→Gross یا Gross→Tare و Net=Gross−Tare | [S01] / تأییدشده برای مرجع |
| FR-07 | P0 | ذخیره واحد و resolution و source و quality برای هر WeighEvent و عدم ویرایش خام | [S02] / تأییدشده برای مرجع |
| FR-08 | P0 | پشتیبانی از توزین یک‌مرحله‌ای بر پایه تارا با تاریخ اعتبار و برچسب استثنا | [S01] / تأییدشده برای مرجع |
| FR-09 | P0 | رابط ثبت تراکنش با جست‌وجوی پلاک، راننده، مقصد، ماده، مجوز و باسکول | [S01] / تأییدشده برای مرجع |
| FR-10 | P0 | سریال سند غیرتکراری و ماشین وضعیت Draft/Pending/Approved/Voided | [S01] / تأییدشده برای مرجع |
| FR-11 | P0 | چاپ/نمایش Ticket با QR راستی‌آزمایی، منبع وزن و نام ثبت‌کننده | [S01] / تأییدشده برای مرجع |
| FR-12 | P0 | ثبت اصلاح، ابطال و چاپ مجدد در AuditLog تغییرناپذیر منطقی | [S02] / تأییدشده برای مرجع |
| FR-13 | P0 | مجوز خروج متصل به Visit و فهرست تراکنش‌های approved؛ مصرف QR اتمیک | [S01] / تأییدشده برای مرجع |
| FR-14 | P0 | کنترل جواز، سقف وزن، تاریخ اعتبار، شرکت حمل و مسیر پیش از آزادسازی خروج | **پیشنهادی** |
| FR-15 | P0 | RBAC حداقل: admin, supervisor, operator, guard, finance, auditor | [S02] / تأییدشده برای مرجع |
| FR-16 | P0 | داشبورد KPI: تناژ ورودی/خروجی، سفر، زمان اقامت، درصف، هشدار، دستگاه آفلاین | **پیشنهادی** |
| FR-17 | P0 | فیلتر گزارش در سطح شعبه، شیفت، راننده، شرکت حمل، ماده، خودرو، زمان و خروجی CSV/PDF | [S01] / تأییدشده برای مرجع |
| FR-18 | P0 | هشدار تکرار توزین، net منفی، تارا غیرعادی، کار در ساعات غیرمجاز | [S02] / تأییدشده برای مرجع |
| FR-19 | P0 | پایداری event offline با idempotency key و بازپخش قابل ردیابی پس از اتصال | [S03] / تأییدشده برای مرجع |
| FR-20 | P0 | زنجیره رویدادها و event_timestamp/received_timestamp برای بررسی تأخیر | **پیشنهادی** |
| FR-21 | P1 | RFID Reader Adapter با تنظیم مدل، فرکانس، پروتکل، EPC، کیفیت خوانش و whitelist | [S14] / تأییدشده برای مرجع |
| FR-22 | P1 | ANPR inference و OCR با confidence، تصویر، plate canonicalization و review | [S22] / تأییدشده برای مرجع |
| FR-23 | P1 | تطبیق RFID+ANPR+Vehicle و مسیر رسیدگی به mismatch با override دوامضایی | **پیشنهادی** |
| FR-24 | P1 | کنترل راهبند، چراغ و حسگر حضور/جایگیری با fail-safe interlock | [S16] / تأییدشده برای مرجع |
| FR-25 | P1 | ثبت تصاویر دوربین قبل/حین/بعد وزن با checksum و retention | [S16] / تأییدشده برای مرجع |
| FR-26 | P1 | صف ورود/خروج و زمان انتظار بر اساس Event و GateLane | [S16] / تأییدشده برای مرجع |
| FR-27 | P1 | مدیریت قرارداد، سهمیه، سفارش فروش/خرید، بارنامه و باقی‌مانده مجوز | **پیشنهادی** |
| FR-28 | P1 | تطبیق چندماده‌ای، چندباسکولی، ورود پر/خالی، برگشتی و استثنا | [S01] / تأییدشده برای مرجع |
| FR-29 | P1 | API REST/JSON با webhook امضاشده برای ERP و پیام‌رسان | [S30] / تأییدشده برای مرجع |
| FR-30 | P1 | مانیتورینگ heartbeat و سلامت سنسور/لودسل با پشتیبانی status از OEM | [S26] / تأییدشده برای مرجع |
| FR-31 | P1 | ثبت سوابق کالیبراسیون و انقضا و جلوگیری از صدور سند تجاری در حالت Lockout | **پیشنهادی** |
| FR-32 | P1 | اعلان‌های قاعده‌مند داخلی، ایمیل و SMS از صف پایدار | [S01] / تأییدشده برای مرجع |
| FR-33 | P1 | گزارش روزانه، شیفتی، هفتگی، ماهانه و زمان‌بندی دانلود/ارسال | [S01] / تأییدشده برای مرجع |
| FR-34 | P1 | تطبیق باسکول با موجودی، تناژ دستور حمل و صورت‌حساب | [S01] / تأییدشده برای مرجع |
| FR-35 | P2 | ماژول LiDAR: Empty baseline + Loaded scan + geometry + volume + point cloud | [S28] / تأییدشده برای مرجع |
| FR-36 | P2 | محاسبه جرم تخمینی از volume×bulk_density با uncertainty و بدون جایگزینی وزن قانونی | **پیشنهادی** |
| FR-37 | P2 | اتصال payload لودر/شاول/Onboard با Equipment و TripID | [S32] / تأییدشده برای مرجع |
| FR-38 | P2 | KPI ناوگان شیفت: cycle, wait, idle, utilization, fuel, payload compliance | [S34] / تأییدشده برای مرجع |
| FR-39 | P2 | تطبیق درشت‌مقیاس Weighbridge vs Lidar vs Onboard در سطح سفر/شیفت | **پیشنهادی** |
| FR-40 | P2 | چندسایتی، تنظیم سیاست‌های سایت و تجمیع ستادی بدون افشای داده سایت دیگر | [S01] / تأییدشده برای مرجع |
| FR-41 | P1 | قواعد تشخیص بارگذاری نامتقارن و چرخ خارج سکو تنها در صورت وجود سنسور/دوربین کافی | **پیشنهادی** |
| FR-42 | P1 | ثبت درخواست Override با دلیل، امضای دوم، snapshot و AuditHash | **پیشنهادی** |
| FR-43 | P0 | تست بازتولیدپذیر برای مقادیر وزن، حالت خروج و قفل‌های مجوز | **پیشنهادی** |
| FR-44 | P1 | گزارش سلامت و dashboard وضعیت دستگاه‌ها، link latency و offline queue depth | **پیشنهادی** |

### 4.4 الزامات غیرکارکردی

| شناسه | حوزه | NFR قابل ممیزی | مبنا |
|---|---|---|---|
| NFR-01 | حسابرسی | تمام تغییرات حساس append-only و هش زنجیره‌ای/HMAC مستقل از دیتابیس؛ تست تشخیص تغییر/حذف | [S02] |
| NFR-02 | امنیت | TLS در انتقال، رمزنگاری ذخیره، مدیریت اسرار، حداقل سطح دسترسی و بازبینی دوره‌ای | پیشنهادی |
| NFR-03 | زمان | ذخیره UTC، نمایش timezone سایت، هماهنگی NTP و تمایز زمان دریافت/وقوع | پیشنهادی |
| NFR-04 | دوام | حداقل once-delivery با deduplication server-side؛ خروجی exactly-once business effect | [S03] |
| NFR-05 | کارکرد آفلاین | پروتکل تخلیه queue و برخورد رکورد conflict؛ ممنوعیت صدور مجوز نهایی در ابهام | [S03] |
| NFR-06 | کارایی | زمان تعامل، تأخیر دریافت وزن، throughput و SLA تنها پس از تست سایت در SRS عددگذاری شود | پیشنهادی |
| NFR-07 | Availability | fail-closed برای کنترل راهبند، حالت کاهش قابلیت و runbook قطع شبکه/برق | پیشنهادی |
| NFR-08 | مقیاس‌پذیری | tenant_id/site_id در همه کلیدهای دسترسی؛ جداسازی چندسایتی در تمام queryها | [S01] |
| NFR-09 | تست‌پذیری | Simulator برای indicator، RFID، ANPR، PLC و LiDAR؛ integration tests | پیشنهادی |
| NFR-10 | قانونی | اعتبارسنجی metrology/legal trade use با مرجع ذیصلاح، عدم ادعای گواهی نرم‌افزار | [S06] |
| NFR-11 | داده | Backup/restore آزمایش‌شده، retention per evidence type، export و deletion policy | [S02] |
| NFR-12 | حریم خصوصی | کنترل دسترسی تصویر کارت/راننده، redaction در UI و مسیر درخواست دسترسی | [S01] |
| NFR-13 | UX | فارسی RTL پیش‌فرض، اعداد محلی/لاتین قابل تنظیم، با نمایش واحد در همه مقادیر | پیشنهادی |
| NFR-14 | Observability | Structured logs, traces, metrics, device heartbeats و correlation IDs | پیشنهادی |
| NFR-15 | یکپارچه‌سازی | Adapter versioning و contract tests؛ پروتکل صرفاً پس از تأیید OEM فعال شود | پیشنهادی |
| NFR-16 | غیرقابل‌حذف بودن رونوشت | هر خروجی PDF/QR نسخه و hash و وضعیت سند داشته باشد؛ ابطال معادل حذف نیست | [S02] |

### 4.5 مرز فازها و تعریف Done

- **P0 / MVP:** FR-01 تا FR-20 و FR-43؛ شبیه‌ساز indicator، event store، Ticket و exit permit، گزارش کلیدی، APIهای داخلی؛ پذیرش در محیط Test بدون فرمان واقعی به راهبند.
- **P1 / Pilot صنعتی:** RFID، ANPR، positioning، PLC/barrier control، عکس زمان وزن، ثبت calibration، ERP adapter، rule engine؛ اجرای HAZOP/Fail-safe و test site mandatory.
- **P2 / Mining intelligence:** LiDAR، payload-onboard و داشبورد چرخه حمل؛ اتصال به سامانه FMS خارجی یا ساخت افزونه محدود؛ ساخت dispatch optimizer در MVP توصیه نمی‌شود.
- **Definition of Done:** schema migrations، مستند OpenAPI، Unit/Integration/Hardware-in-the-loop tests، performance benchmark با دادهٔ سایت، backup restoration، cyber-security review، لاگ حسابرسی و runbook استقرار/rollback. **اعداد SLA و آستانه‌ها بدون داده عملیاتی ساختگی تعیین نشده‌اند.**

## 5. جریان‌های کاری اصلی

### 5.1 سناریوی پایه (ورود خالی، خروج بارگیری‌شده)

1. `PRE_REGISTERED`: بخش بازرگانی Vehicle + Driver + Carrier + Customer، سفارش فروش/مجوز حمل و سهمیه را ایجاد می‌کند. اعتبارسنجی تاریخ و سقف مجوز **پیشنهادی** است [S01].
2. `AT_GATE_IN`: دوربین ANPR و RFID (اگر نصب باشد) چند مشاهدهٔ زمان‌دار ثبت می‌کنند؛ confidence پایین به بازبینی انسانی می‌رود؛ نگهبان Visit را با پلاک/راننده ایجاد می‌کند. WeighHub بخش ثبت دستی و عکس زنده را مستند کرده، ANPR/RFID از رقبا الهام است [S01][S14][S22].
3. `GATE_AUTHORIZED`: مجوز ورود + عدم وجود visit باز تکراری + شرایط ایمنی/راه‌بند بررسی می‌شود؛ دستور بازشدن barrier پس از تأیید PLC feedback ارسال می‌شود (پیشنهادی).
4. `ON_SCALE_1`: سنسور جایگیری/حضور فعال؛ سیستم انتظار حرکت نکردن وسیله را دارد؛ `DeviceGateway` frame نشان‌دهنده را parser می‌کند و `stable=true` و `fresh=true` را تأیید می‌کند [S03][S14].
5. `TARE_CAPTURED`: وزن اول به‌صورت immutable WeighEvent نوشته، Transaction `PENDING_SECOND` می‌شود؛ reference تصویر و scale ID/actor/time حفظ می‌شود [S01].
6. `LOADING`: dispatch/load zone، ماده، مبدأ و مقصد، تجهیزات بارگیری و optional PayloadEvent ثبت می‌شوند (جزء الحاقی FMS [S34]).
7. `ON_SCALE_2`: ورود دوم و capture وزن بار؛ سنسور و تصویر مجدداً کنترل می‌شود. اگر کامیون هنگام ورود پر بوده، ترتیب Gross→Tare مجاز است [S01].
8. `NET_COMPUTED`: `net_kg = gross_kg - tare_kg`، تبدیل تنها برای display صورت می‌گیرد. اگر gross/tare یا ماده و خودرو با رکورد سفر ناسازگار شد، سند به Exception Review می‌رود.
9. `PERMIT_RECONCILED`: سند حمل، سفارش، سهمیه، حداکثر وزن مجاز، تاریخ و مسیر بررسی می‌شود؛ اختلاف به supervisor ارجاع می‌شود (توسعه پیشنهادی بر پایهٔ تراکنش‌ها).
10. `TICKET_FINALIZED`: مجوزدهنده تعیین‌شده بلیت را تأیید می‌کند؛ نسخه PDF و QR قابل‌اعتبارسنجی صادر می‌شود؛ اصلاح به‌جای overwrite یک Revision/AuditEvent تازه می‌سازد [S01][S02].
11. `EXIT_PERMIT_APPROVED`: ExitPermit به visit و Ticketهای final گره می‌خورد، approval ثبت و token غیرقابل حدس تولید می‌شود [S01].
12. `AT_GATE_OUT`: scan اختصاصی token، شرایط ایمنی و اعتبارسنجی مجدد؛ در یک تراکنش DB، token consumed شده، GateEvent خروج ایجاد و Visit بسته می‌شود. دوباره‌خوانی token رد می‌شود [S01][S02].
13. `POST_PROCESSING`: موجودی و KPI شیفت از Ticketهای نهایی به‌روزرسانی، رویداد به ERP/outbox ارسال و هشدارها ارزیابی می‌شوند [S01][S30].

### 5.2 حالات جایگزین و استثنایی

| حالت | رفتار الزامی | منبع/وضعیت |
|---|---|---|
| ورود پُر و خروج خالی | ثبت Gross نخست، Tare دوم، محاسبه Net مشابه | تأییدشده [S01] |
| چند ماده در یک Visit | چند Transaction و یک ExitPermit مشترک همان خودرو؛ کنترل مجوز هر ماده | تأییدشده در مرجع [S01] |
| خودرو خروجی بدون کالا | Empty ExitPermit و ثبت خروج | تأییدشده [S01] |
| وزن سریع با تارا | تاریخ اعتبار تارا + provenance + flag ریسک | بخشی تأییدشده [S01]؛ اعتبار تارا پیشنهادی |
| قطع اینترنت | local queue در gateway، UUID idempotency و reconcile پس از بازیابی | مبنای تأییدشده [S03]؛ سیاست کنترل راهبند پیشنهادی |
| توقف خودرو نامناسب | منع capture با position sensor و گزارش علت | تأییدشده در SmarTower [S14] |
| پلاک مبهم یا RFID متناقض | HOLD، screenshot، human review و second approval | پیشنهادی |
| calibration out-of-date | بلوکه‌کردن legal ticket، ثبت MaintenanceOverride با سیاست مجاز | پیشنهادی؛ وظیفه calibration به دارنده باسکول [S06] |

### 5.3 ماشین وضعیت (نمای پیشنهادی، نه کپی محصول)

```text
Visit: PRE_REGISTERED -> ARRIVED -> IN_SITE -> READY_TO_EXIT -> EXITED
                              |              |                    |
                           REJECTED       HELD                 EXIT_DENIED
Transaction: DRAFT -> FIRST_CAPTURED -> SECOND_CAPTURED -> RECONCILED -> APPROVED
                   |                 |                      |          |
                  VOIDED           EXCEPTION <-------------+        REVISED
ExitPermit: DRAFT -> APPROVED -> CONSUMED
                       |             ^
                    CANCELLED    never unconsume
```

### 5.4 قواعد محاسباتی قابل تست

- `net_kg = gross_kg - tare_kg` (واحد ذخیره: kg؛ rounding صرفاً موقع نمایش، مطابق درجه نمایش نشان‌دهنده/قواعد قانونی سایت).
- `site_turnaround_seconds = gate_out.occurred_at - gate_in.occurred_at`؛ در visit باز = `now - gate_in` و «ناقص» علامت‌گذاری شود.
- `queue_wait_seconds = scale_entry - queue_join`؛ اگر queue_join ثبت نشده، **نامشخص** و صفر تلقی نشود.
- `shift_tonnage_t = sum(net_kg of APPROVED eligible outbound transactions)/1000`؛ تعریف inbound/outbound و موارد استثنا باید در policy تثبیت شود.
- `trip_count = count(distinct completed_trip_id)`؛ تعداد WeighEvent جایگزین تعداد سفر نیست.
- `cycle_time = t(next_cycle_start) - t(cycle_start)` فقط با مرزبندی رسمی رویدادهای mine dispatch.
- `volume_m3 = volume_loaded_scan - volume_empty_reference` با اعمال مدل هندسی اسکنر (پیشنهادی، سازوکار مرجع از [S28]).
- `estimated_mass_kg = volume_m3 × bulk_density_kg_m3` و انتشار بازه عدم‌قطعیت، **نه وزن تأییدشده قانونی**. در معدن چگالی توده‌ای با چگالی مادهٔ جامد تفاوت دارد.
- `payload_variance_pct = 100 × (payload_estimate_kg - scale_net_kg)/scale_net_kg` فقط برای `scale_net_kg>0` و Trip مطابقت‌داده‌شده.

## 6. مدل داده (مستقل و قابل تبدیل به DB schema)

**قواعد سراسری:** تمام شناسه‌های داخلی UUID، تمام جرم‌ها در kg به‌صورت decimal (نه float برای ارزش حقوقی)، تمام زمان‌ها ISO 8601/UTC، هر entity حساس دارای `created_at`, `updated_at`, `created_by`, `tenant_id` در صورت اقتضا. استثناها/فیلدهای nullable بر اساس DDL نسخه اول تثبیت می‌شوند؛ دادهٔ حجمی PointCloud در Object Storage و metadata در DB.

| موجودیت | فیلدهای پیشنهادی | ارتباط اصلی |
|---|---|---|
| `Tenant` | `id, legal_name, slug, settings_json, created_at` | Tenant 1:N Site |
| `Site` | `id, tenant_id, name, timezone, geofence, active` | Site 1:N Scale/GateLane/Shift |
| `GateLane` | `id, site_id, direction, barrier_controller_id, sensors, status` | Site 1:N GateLane |
| `Vehicle` | `id, tenant_id, plate_raw, plate_normalized, plate_country, rfid_tag_id, carrier_id, vehicle_type, axles, max_gvw_kg, tare_policy, status` | Carrier 1:N Vehicle; Vehicle 1:N Visit |
| `Driver` | `id, tenant_id, full_name, national_id_encrypted, license_no_encrypted, license_expiry, photo_ref, carrier_id, status` | Carrier 1:N Driver; Driver 1:N Visit |
| `Carrier` | `id, tenant_id, name, contract_ref, contact, status` | Carrier 1:N Driver/Vehicle |
| `Customer` | `id, tenant_id, party_type, legal_name, tax_code, credit_limit, status` | Customer 1:N Transaction/Permit |
| `Material` | `id, tenant_id, material_code, name, class_or_grade, density_kg_m3_nullable, density_method, density_uncertainty, unit, hazardous_flag` | Material 1:N Transaction |
| `Permit` | `id, site_id, type, permit_number, external_order_ref, customer_id, carrier_id, vehicle_id, material_id, origin_id, destination_id, valid_from, valid_to, allocated_qty_kg, used_qty_kg, max_trip_kg, state, approval_id` | Permit 1:N Transaction (با کنترل سهمیه) |
| `Visit` | `id, site_id, vehicle_id, driver_id, lane_in_id, entered_at, lane_out_id, exited_at, state, exit_permit_id` | Visit 1:N Transaction; Visit 1:1 ExitPermit |
| `Transaction` | `id, site_id, visit_id, ticket_number, customer_id, material_id, permit_id, transaction_type, direction, weigh_mode, gross_kg, tare_kg, net_kg, state, created_by, approved_by, created_at, approved_at, source_method, current_revision` | Transaction 1:N WeighEvent |
| `WeighEvent` | `id, transaction_id, scale_id, sequence_no, captured_at, device_timestamp, received_at, weight_kg, stable, device_status, unit, graduation_kg, source, source_device_id, raw_frame_hash, evidence_photo_ids, operator_id` | Scale 1:N WeighEvent |
| `GateEvent` | `id, visit_id, lane_id, occurred_at, event_type, actor_id, plate_read_id, rfid_read_id, barrier_event_id, snapshot_id, reason` | Visit 1:N GateEvent |
| `Camera` | `id, site_id, location_code, direction, vendor, endpoint_secret_ref, model, health_state, privacy_policy` | Camera 1:N PlateRead |
| `PlateRead` | `id, camera_id, visit_id, occurred_at, plate_text, normalized, ocr_confidence, detection_confidence, image_ref, reviewed_by, review_status` | GateEvent/Visit optional |
| `RFIDRead` | `id, reader_id, lane_id, visit_id, epc, read_at, rssi_nullable, antenna_id, tag_binding_match, raw_message_hash` | GateEvent/Visit optional |
| `RFIDTag` | `id, tenant_id, epc, vehicle_id_nullable, driver_id_nullable, tag_type, valid_from, valid_to, status` | Vehicle 1:N Tag |
| `Scale` | `id, site_id, indicator_model, serial_number, adapter_name, device_token_key_ref, max_capacity_kg, min_capacity_kg, division_kg, protocol, health, calibration_status, last_seen_at` | Scale 1:N CalibrationRecord/HealthEvent |
| `CalibrationRecord` | `id, scale_id, certificate_no, calibration_at, expiry_at, certificate_file_ref, issuer, test_results_json, verification_scope, approved_by, status` | Scale 1:N CalibrationRecord |
| `LoadCellHealthEvent` | `id, scale_id, cell_channel, occurred_at, zero_offset, drift_indicator, imbalance, temperature, diagnostic_code, raw_payload_ref` | Scale 1:N LoadCellHealthEvent |
| `Alert` | `id, site_id, code, severity, rule_version, entity_type, entity_id, triggered_at, evidence_json, status, acknowledged_by, acknowledged_at, resolution` | Site 1:N Alert |
| `AlertRule` | `id, site_id_nullable, code, version, enabled, threshold_json, required_capabilities, severity, action_policy` | AlertRule emits Alert |
| `Shift` | `id, site_id, label, start_at, end_at, timezone, production_target_kg` | Shift 1:N Trip/production aggregate |
| `Equipment` | `id, site_id, asset_type, fleet_no, model, capacity_kg, telemetry_adapter_id, state` | Equipment 1:N PayloadEvent |
| `LidarScan` | `id, site_id, vehicle_id, visit_id, scanner_id, mode, reference_scan_id_nullable, occurred_at, volume_m3, pointcloud_uri, mesh_uri, quality_score, confidence_metadata_json, calibration_ref` | Visit 1:N LidarScan |
| `PayloadEvent` | `id, equipment_id, vehicle_id, trip_id, occurred_at, source_system, measured_kg, bucket_count, operator_id, uncertainty_kg_nullable` | Trip 1:N PayloadEvent |
| `Trip` | `id, site_id, visit_id_nullable, vehicle_id, load_location, dump_location, load_start_at, depart_at, arrive_at, unload_at, cycle_seconds_nullable, shift_id` | Vehicle 1:N Trip |
| `IntegrationEndpoint` | `id, tenant_id, type, adapter_name, version, auth_secret_ref, config_json, enabled, last_success_at` | Tenant 1:N IntegrationEndpoint |
| `AuditEvent` | `id, tenant_id, site_id, occurred_at, actor_type, actor_id, action, entity_type, entity_id, before_json, after_json, reason, prev_hash, record_hmac, correlation_id` | Entity 1:N AuditEvent (polymorphic) |
| `EvidenceAsset` | `id, tenant_id, mime_type, source, storage_uri, sha256, created_at, retention_policy, access_class` | multiple entities by join table |
| `ExitPermit` | `id, site_id, visit_id, serial, qr_token_hash, status, approved_by, approved_at, consumed_by, consumed_at, transaction_ids, cancel_reason` | Visit 1:1 ExitPermit; N:M Transaction via join |
| `DeliveryEvent` | `id, integration_id, entity_type, entity_id, delivery_id, idempotency_key, state, attempt_count, last_attempt_at, last_error` | IntegrationEndpoint 1:N DeliveryEvent |

### 6.1 Constraints و Indexها

- `UNIQUE(site_id, ticket_number)`، `UNIQUE(site_id, permit_number, permit_type)`، `UNIQUE(exit_permit.qr_token_hash)`، `UNIQUE(integration_id,idempotency_key)`؛ سریال هر سایت با تراکنش اتمیک و عدم استفاده مجدد صادر شود.
- Index ترکیبی روی `(site_id, occurred_at)`, `(vehicle_id, entered_at)`, `(shift_id, equipment_id)`, `(state, updated_at)`, `(scale_id, captured_at)`.
- یک Vehicle نمی‌تواند در یک سایت هم‌زمان بیش از یک Visit فعال داشته باشد مگر Override ثبت‌شده برای مورد خاص؛ در DB partial unique index پیشنهاد می‌شود.
- عدم overwrite در `WeighEvent`, `GateEvent`, `RFIDRead`, `PlateRead`, `AuditEvent`, `PayloadEvent`؛ دادهٔ اصلاحی با CorrectionEvent/Transaction Revision ثبت شود.
- `raw_frame_hash` و `evidence.sha256` برای اثبات عدم تغییر فایل است، نه تضمین صحت فیزیکی سنسور.
- `Permit.used_qty_kg` از ledger تراکنش‌های معتبر بازسازی‌پذیر باشد؛ به‌روزرسانی مصرف سهمیه اتمیک با تأیید سند صورت گیرد.
- جدول اتصال `ExitPermitTransaction` و `TransactionRevision` و `EvidenceLink` در پیاده‌سازی واقعی اضافه شود؛ `Transaction` واحد اقتصادی است و `WeighEvent` یک خوانش اندازه‌گیری.

### 6.2 مثال رویداد (ساختار پیشنهادی)

```json
{"event_type":"weight.captured","event_id":"uuid","occurred_at":"2026-10-25T10:00:00Z","site_id":"uuid","transaction_id":"uuid","scale_id":"uuid","weight_kg":"18340.0","stable":true,"source":"INDICATOR","device_status":"ONLINE","reading_age_ms":800,"correlation_id":"uuid"}
```

*مقادیر عددی نمونهٔ بالا صرفاً دادهٔ ساختگی تست برای نمایش schema هستند؛ دادهٔ عملیاتی یا شاهدی از شرکت‌ها محسوب نمی‌شوند.*

## 7. مشخصات UI/UX و مرور تصاویر

### 7.1 نقشهٔ اطلاعات (Information Architecture)

| ID صفحه / مسیر پیشنهادی | اجزا و اطلاعات | نقش‌ها | مبنای تصویری/متنی |
|---|---|---|---|
| UI-01 `/dashboard` | کارت inbound t, outbound t, net t, trips, pending, on-site، نمودار ساعتی، هشدارها و آخرین رخدادها | Manager, Auditor | برچسب تصویر داشبورد WeighHub [S01][S45]؛ UI پیشنهادی |
| UI-02 `/gate/overview` | ورود با پلاک/راننده؛ تصویر مدرک، فید دوربین، لیست inside-now، اقامت؛ دکمه scan/approve | Guard | توضیحات GateLog [S01][S46] |
| UI-03 `/weighing/new` | live digital weight، stable/age، وضعیت device، صف خودروها، capture tare/gross، نوع ماده، مجوز، تصویر | Operator | توضیحات تصویر WeighHub [S01][S47] |
| UI-04 `/tickets` | فیلتر کامل و جدول سند؛ status، net، vehicle، material، method، print count، PDF/CSV | Operator/Finance | [S01] |
| UI-05 `/tickets/:id` | تاریخچه، weight events، تصویر، QR، correction timeline، نسخه‌ها و هش اثر | Manager/Auditor | [S01][S02] |
| UI-06 `/permits` | لیست حواله فروش، مجوز حمل، مانده سهمیه، تاریخ انقضا، status | Commercial | بخش عمده پیشنهادی؛ quotas در [S01] |
| UI-07 `/exit-permits` | صورت بلیت‌های خودرو، approval، serial/QR، scan status و رد scan مجدد | Manager/Guard | [S01][S02] |
| UI-08 `/fleet/trips` | Trip ID، شروع و پایان، تعداد سفر، turnaround، مبدا/مقصد، material، vehicle، equipment | Fleet Manager | FMS sources [S34][S38][S39] |
| UI-09 `/analytics/shift` | تولید واقعی/هدف، تناژ شیفت، payload compliance، cycle hist، idle/waiting، fuel | Mine Manager | [S34][S35][S39] |
| UI-10 `/scales/health` | جدول Scale آنلاین/آفلاین، آخرین وزن، drift/imbalance diagnostics، certificate expiry | Maintenance | [S03][S23][S26] |
| UI-11 `/lidar/scans` | 3D scan viewer، empty/loaded overlay، m³، confidence، پوسته بار، عکس رویداد | Survey/Manager | [S27][S28][S29][S30][S31] |
| UI-12 `/reports` | فیلتر تاریخ/ماده/سایت/مشتری/Vehicle و template selector، خروجی، scheduled exports | Manager/Finance | [S01][S48]؛ WeighMAST صفحه ۴ [S20] |
| UI-13 `/alerts` | شدت، شرط، evidence preview، acknowledge، owner، due date، history | Supervisor | [S02][S27] |
| UI-14 `/admin/devices` | scale/indicator adapters، camera، RFID، PLC، heartbeat، firmware، status | Admin/IT | [S03][S14][S26] |
| UI-15 `/audit` | actor/action/entity/date filters و before-after، verification chain | Auditor | [S02]؛ تصویر WeighMAST [S20 ص۴] |
| UI-16 `/settings/registries` | تعریف master records، material، vehicle، driver، carrier، density و permit types | Admin | [S01][S16][S20] |
| UI-17 `/wallboard` | تمام صفحه، read-only، KPI لحظه‌ای، صف، آخرین محموله‌ها، رنگ وضعیت | Manager/Control room | [S01] |
| UI-18 `/integrations` | API keys، webhook delivery، retry، ERP mappings و test payload | IT | پیشنهاد؛ [S30] الگوی API |

### 7.2 ارزیابی واقعی شواهد تصویری (عدم جعل)

| تصویر / سند | آنچه *واقعاً* در دسترس بود | اجزای قابل گزارش | وضعیت اطمینان |
|---|---|---|---|
| WeighHub Dashboard `[S45]` | خود PNG باز نشد؛ فقط alt text و توضیح رسمی محصول | inbound/outbound امروز، pending ticket، feed، risk، branch/operator breakdown از متن [S01] | ویژگی داده **تأییدشده**؛ هندسه صفحه/پالت **نامشخص** |
| WeighHub Gate `[S46]` | PNG باز نشد؛ کپشن‌های صفحه | فرم پلاک/راننده، ثبت عکس زنده، Inside now، مدت اقامت | محتوای متن **تأییدشده**؛ چیدمان **نامشخص** |
| WeighHub Weighing `[S47]` | PNG باز نشد؛ توضیح رسمی | فیلد وسیله، auto fill راننده، وزن زنده، stable flag، capture button | محتوای متن **تأییدشده**؛ طراحی بصری **نامشخص** |
| WeighHub Reports `[S48]` | PNG باز نشد؛ توضیح رسمی | From/To، customer، material، operation، measurement، export PDF، Daily Close | محتوای متن **تأییدشده**؛ طراحی بصری **نامشخص** |
| TruckFlow تصویر روی TechJockey `[S49]` | نتیجهٔ تصویر مشاهده شد؛ منبع ثالث | نوار بالای مشکی/تیره، دکمه‌های آیکونی، تب Incoming/Outgoing، فرم Company/Haulier/Site/Product و panel وزن در راست | **استنباطی از تصویر**؛ screenshot ثالث و احتمال قدیمی بودن |
| WeighMAST بروشور PDF ص۴ `[S20]` | صفحه بصری بررسی شد | هدر فیروزه‌ای/آبی روشن با ۴ دکمه Transaction/Data Setup/Reports/Settings؛ فرم گزارش با date range، mode/status/type، master fields و custom fields؛ دکمه Filter | **تأییدشده بصری** فقط برای نسخه نشان‌داده‌شده در بروشور |
| WeighMAST بروشور PDF ص۴ `[S20]` | در همان صفحه پایین تصویرهای کوچک | Camera Management، Driver Management، Audit Report با فیلتر table/operation/user/date و grid گزارش | **تأییدشده بصری** در حد وضوح کاتالوگ |
| WeighMAST بروشور PDF ص۳ `[S20]` | صفحه قابلیت‌های گرافیکی مشاهده شد | گروه‌های Transaction, Security, Receipt, Reports, Data Setup, Centralized Deployment, Flexibility, UI | **تأییدشده** برای متن بروشور، نه screenshot اجرایی |
| TruckFlow بروشور `[S16]` | متن صفحه ۱/۲ استخراج شد؛ PDF screenshot ابزار مسدود | خود سند به Home page و Weighing screen، Vehicles on site، Peripherals اشاره دارد | **متن تأییدشده**؛ جزئیات دیداری تصویر *نامشخص* |

### 7.3 سیستم طراحی مستقل پیشنهادی (عدم کپی از رقبا)

- **هویت بصری محصول ما — پیشنهادی:** زمینه روشن `#F6F8FB`، سرمه‌ای صنعتی `#172B4D`، آبی عملکردی `#2166D1`، خاکستری داده `#64748B`؛ سبز `#168567` فقط success، کهربایی `#A96800` warning، قرمز `#BF3B42` critical. این مقادیر برای محصول ما طراحی شده‌اند و نسبت داده‌شده به هیچ شرکت نیستند.
- **Desktop:** ناوبری سمت راست RTL (عرض قابل تنظیم)، نوار Context بالای صفحه (Site / Shift / Lane)، KPI row، سپس grid دو ستونی 65/35 برای تراکنش‌ها و هشدارها؛ جدول audit/transactions تمام عرض. **Mobile:** single column، bottom navigation برای Gate/Weigh/Alerts، اقدام اصلی ثابت و بزرگ.
- **توزین:** وزن با فونت درشت و نمایش `kg`، indicator status واضح، timestamp age، رنگ به‌تنهایی ملاک وضعیت نیست؛ disabled capture با پیام دلیل، تصویر خودرو کنار رویداد و دکمه ثبت تنها بعد از interlock.
- **صفحه احراز هویت:** نمایش ANPR confidence و RFID matched، اگر اختلاف، دو evidence preview و انتخاب مدیر؛ ذخیره raw image و canonical plate جدا از نتیجهٔ OCR.
- **داشبورد:** KPIهای «ورودی/خروجی تن»، «تعداد سفر»، «کامیون حاضر»، «صف متوسط»، «turnaround P50/P90»، «تولید هدف/واقعی»، «بار مفید متوسط»، «نرخ اضافه‌بار»، «ترازوهای خارج سرویس»، «هشدارهای باز». فیلتر متقاطع site/date/shift/material/carrier/vehicle.
- **نمودارها:** خطی برای تولید ساعتی، bar برای رانندگان/پیمانکاران، stacked bar برای مخلوط مواد، histogram/boxplot زمان چرخه، timeline برای یک سفر، health matrix برای load cell، و 3D viewer مستقل برای LiDAR.
- **Wireframe پیشنهادی `/weighing/new`:** Context → Identity strip (Vehicle, RFID, Plate, Driver) → Permission pill → Scale live-weight + status → Tare/Gross capture panel → Camera evidence → Review+Finalize → Audit trace.
- **Accessibility:** WCAG target باید در فرایند طراحی تعیین شود؛ contrast، keyboard focus، feedback متنی، اندازه لمس مناسب و نمایش واحد در تمام نمودارها ضروری‌اند.

## 8. یکپارچه‌سازی‌ها و پروتکل‌های سخت‌افزاری

### 8.1 معماری مفهومی پیشنهادی

```text
[Scale Indicator]---RS232/RS485/ETH---[Site Edge Gateway]----HTTPS/mTLS----[API/Identity]
[RFID Reader]-----SDK/TCP/Serial-----/      |                                  |
[ANPR Camera]-----ONVIF/RTSP/SDK----/   [Local Event Queue]                   [Visit+Weigh Core]
[Position Sensor]-PLC/DI/MODBUS---/          |                                  |
[Barrier/Light]---PLC DO/IO <--------------[Safety Interlock]            [Permit Engine]
[LiDAR Scanner]---Vendor Adapter----[Scan Processor + Object Storage]       |
[Loader/Shovel]---OEM API/FMS------[Payload/Trips Stream]-------[Event Bus/Rules]
                                                                         |
                                                 [Audit Store] [Reports] [ERP Outbox]
```

**تمام پروتکل‌های غیر از RS-232 تأییدشده WeighHub، API Loadscan و موارد مستند سازندگان، گزینهٔ معماری پیشنهادی‌اند؛ قبل از طراحی درایور باید datasheet دستگاه واقعی و مجوز دسترسی OEM دریافت شود.**

### 8.2 جدول Device Adapter و تضمین‌ها

| زیرسامانه | ورودی/رابط پیشنهادی | خروجی قرارداد نرم‌افزاری | وضعیت شاهد / دام |
|---|---|---|---|
| Indicator | RS-232/USB-COM؛ RS-485 یا Ethernet فقط در صورت پشتیبانی OEM | `weight, unit, stable, zero, timestamp, diagnostic` | WeighHub RS-232 [S03]؛ هیچ استاندارد framing عمومی فرض نشود |
| UHF RFID | EPC Gen2/ISO 18000-63 **فقط پیشنهاد فنی**؛ USB/Serial/TCP توسط reader | `tag_id, antenna, rssi, read_at` | SmarTower صرفاً UHF را تأیید می‌کند [S14]؛ باند MHz و برد دقیق نامشخص |
| ANPR | دوربین IP با stream در RTSP/ONVIF **در صورت پشتیبانی**، OCR edge | `plate, confidence, image_uri, model_version` | ANPR در TruckFlow/WeighMAST/Weighman [S13][S17][S22] |
| Photo evidence | RTSP/HTTP snapshot/SDK براساس دوربین | `image_uri, sha256, time, camera_id` | [S01][S16][S31] |
| Position sensor | Digital input / PLC / Modbus TCP/RTU در صورت تجهیز | `presence, all_wheels_on_deck, fault` | سنسور جایگیری [S14][S22]؛ استنتاج wheel-position از یک حسگر تضمین‌شده نیست |
| Barrier/light | فرمان PLC با feedback و safety relay مستقل | `open_request, interlock_ok, barrier_state` | مانیتور تجهیزات TruckFlow [S16] |
| Load-cell diagnostics | OEM digital cells/junction box proprietary health API | `cell_id, drift, zero, overload, noise, imbalance` | [S23][S26]؛ RS-232 وزن به‌تنهایی health را نمی‌دهد |
| LiDAR | Vendor SDK / point cloud / serial/ethernet gateway | `scan_id, mode, volume_m3, mesh, quality` | Loadscan empty+loaded [S28] |
| Onboard payload | OEM CAN/telematics/FMS connector (مجوزمحور) | `equipment_id, trip_id, payload_kg, quality` | LOADRITE [S32], Cat [S40] |
| ERP/Accounting | REST/JSON, SFTP, message broker; adapter اختصاصی | `order, permit, shipment, invoice, stock_movement` | نمونه Loadscan REST JSON [S30], TruckFlow CSV/JSON [S16] |
| Alarm delivery | email/SMS/messenger via approved gateway | `alert_id, recipient, delivery_state` | ایمیل و اعلان WeighHub [S01]؛ پیام‌رسان دلخواه پیشنهادی |

### 8.3 APIهای پیشنهادی برای AI کدنویس

| Method | Route | کارکرد | Guard |
|---|---|---|---|
| `POST` | `/v1/visits` | ثبت ورود | `site:gate:write` |
| `POST` | `/v1/identity/resolve` | تجمیع ANPR/RFID | `site:identity:review` |
| `POST` | `/v1/weigh-events/capture` | capture توسط gatewayِ دارای device auth | `device:scale:capture` |
| `POST` | `/v1/transactions/{id}/finalize` | تایید دو وزن و خالص | `weigh:approve` |
| `POST` | `/v1/permits/{id}/reconcile` | validate مجوز و quota | `permit:read` |
| `POST` | `/v1/exit-permits` | صدور خروج | `exit:approve` |
| `POST` | `/v1/exit-permits/consume` | مصرف token یک‌بارمصرف اتمیک | `gate:scan` |
| `GET` | `/v1/tickets/{id}/verify` | راستی‌آزمایی با داده حداقلی | token محدودشده، rate-limit |
| `GET` | `/v1/reports/shift` | KPI شیفت با فیلتر | `report:read` |
| `GET` | `/v1/scales/{id}/health` | وضعیت health/certificate | `maintenance:read` |
| `POST` | `/v1/integrations/events` | gateway external events با idempotency | `integration:push` |
| `GET` | `/v1/lidar/scans/{id}` | اسکن و متادیتا | `lidar:read` |

- رویدادها با schema_version و correlation_id و idempotency_key منتقل شوند؛ خطاهای دستگاه و کدهای status به 4xx/5xx HTTP تقلیل داده نشوند (دامنهٔ صنعتی مستقل).
- فرمان عبور باید **پس از تأیید واقعی سلامت PLC/راهبند/مسیر** صادر شود؛ برنامهٔ وب نباید safety PLC یا interlock hardwired را دور بزند.
- برای بستن حسابداری: Transaction نه در زمان وزن خام، بلکه پس از Approved+Permit Reconciled رخداد خروج مالی تولید کند؛ با برگشت سند، رویداد reversal صادر شود.

## 9. منطق هشدارها و شرط–آستانه–اقدام

**قانون مهم:** آستانه‌های آماری (مثل مدین تارا یا deviation چگالی) به دادهٔ واقعی و تأیید سایت وابسته‌اند. مقادیر ثابت قراردادی اختراع نشده‌اند؛ هر rule دارای `rule_version`، `threshold_json`, `required_capabilities`, `severity`, `action_policy` است. بازهٔ `freshness=12s` تنها برای محصول مرجع در [S02] صریح است، نه لزوماً مقدار مطلوب محصول ما.

| شناسه | شرط فعال‌سازی | آستانه یا روش تعیین | اقدام | استناد/وضعیت |
|---|---|---|---|---|

| AL-01 `unstable_weight` | قرائت stable نیست یا از freshness_ms بیشتر قدیمی است | freshness_ms=config؛ مقدار WeighHub=12000ms [S02] | `BLOCK_CAPTURE` | [S02]، شاهد اصل ایده |
| AL-02 `scale_offline` | عدم دریافت قرائت از دستگاه طی مدت heartbeat_timeout | timeout از OEM/شبکه و SRS | `BLOCK_CAPTURE+NOTIFY` | [S03]، شاهد اصل ایده |
| AL-03 `over_gvw` | gross_kg > min(vehicle.max_gvw, scale.max_capacity) | پارامتر سایت و ظرفیت معتبر | `BLOCK_APPROVAL+NOTIFY` | پیشنهادی |
| AL-04 `negative_net` | gross_kg - tare_kg < 0 | ۰ کیلوگرم | `REVIEW+BLOCK_APPROVAL` | [S02]، شاهد اصل ایده |
| AL-05 `tare_outlier` | abs(tare - median(last_n verified tares)) > dynamic_limit | n و limit نیازمند baseline و آزمون | `REVIEW` | [S02]، شاهد اصل ایده |
| AL-06 `duplicate_plate_trip` | فاصله دو سفر/وزن غیرممکن برای یک پلاک | min_turnaround_minutes=config | `REVIEW` | [S02]، شاهد اصل ایده |
| AL-07 `plate_rfid_mismatch` | RFID و ANPR به دو vehicle_id متفاوت اشاره کنند | min_confidence_plate=config | `HOLD_BARRIER+REVIEW` | پیشنهادی |
| AL-08 `vehicle_mispositioned` | سنسور حضور یا wheel-zone اعلام جایگیری نامعتبر دهد | کالیبراسیون geometry هر مسیر | `BLOCK_CAPTURE` | [S14]، شاهد اصل ایده |
| AL-09 `permit_expired` | now > permit.valid_to یا state != approved | ۱ رخداد | `HOLD_EXIT` | پیشنهادی |
| AL-10 `permit_quantity` | used_kg+this_net_kg > permit.allowed_kg | تلرانس قرارداد=config | `HOLD_EXIT+REVIEW` | پیشنهادی |
| AL-11 `permit_reuse` | QR already consumed یا وضعیت cancel | ۰ تکرار مجاز | `HOLD_BARRIER+SECURITY` | [S02]، شاهد اصل ایده |
| AL-12 `calibration_expired` | now > calibration.expiry_at یا گواهی نامعتبر | تاریخ گواهی؛ بدون حد ساختگی | `LOCK_LEGAL_WEIGH` | پیشنهادی |
| AL-13 `loadcell_drift` | diagnostic zero/drift/imbalance از indicator/OEM | OEM threshold؛ بدون دسترسی فقط Unknown | `MAINTENANCE_REVIEW` | [S26]، شاهد اصل ایده |
| AL-14 `unusual_density` | تفاوت جرم باسکول و volume×rho فراتر از عدم‌قطعیت ترکیبی | k*sigma؛ پس از اعتبارسنجی چگالی | `REVIEW_ONLY` | پیشنهادی |
| AL-15 `shift_output_lag` | actual_shift_output < target_profile_at_time | منحنی هدف تولید توسط کارفرما | `NOTIFY_SUPERVISOR` | [S35]، شاهد اصل ایده |
| AL-16 `manual_entry_risk` | نرخ توزین دستی اپراتور بالاتر از الگوی خودش/شیفت | baseline آماری و threshold config | `REVIEW` | [S02]، شاهد اصل ایده |
| AL-17 `photo_missing` | توزین نهایی بدون تصویر لازم در سایت مجهز | required_count با سیاست محلی | `BLOCK_OR_EXCEPTION` | پیشنهادی |
| AL-18 `offline_queue_age` | رخداد sync نشده > max_queue_age یا بیش از retry_budget | وابسته به سطح خدمت سایت | `NOTIFY_IT` | پیشنهادی |
| AL-19 `scale_capacity_exceeded` | weight_kg > scale.max_capacity_kg | مقدار nameplate ثبت شده | `BLOCK_CAPTURE+MAINTENANCE` | پیشنهادی |
| AL-20 `repeat_identical_net` | مقادیر خالص برابر پرتکرار برای یک مشتری/وسیله | count/window بر مبنای داده | `REVIEW` | [S02]، شاهد اصل ایده |

**Severity levels:** `INFO`, `WARNING`, `HIGH`, `CRITICAL`. هر اعلان `acknowledge`, `resolve`, `false_positive` و `escalate` دارد. حادثهٔ Critical می‌تواند **فقط در کنترل اتوماتیک دارای safety validation و سیاست مصوب** مانع گیت شود؛ failure شبکه به‌تنهایی نباید باعث بازشدن راهبند شود. برای رخداد امنیتی تصویر/قرائت/شماره سریال و raw evidence حفظ شود.

## 10. افزونه‌های قابل نصب (Plug-ins)

| افزونه | ورودی و وابستگی | خروجی و UI | خط‌مشی استقلال و کیفیت |
|---|---|---|---|
| `LidarVolumePlugin` | `Visit/Vehicle`, خالی baseline، LiDAR loaded cloud، geometry config | `LidarScan`، پروفایل 3D، حجم m³، نمودار اختلاف با وزن | اسکن Empty باید به هویت همان بستر/تریلر وصل شود؛ تناژ براساس density تنها estimated است [S28][S29] |
| `OnboardPayloadPlugin` | API/OEM telemetry، Loader/Shovel scale، Equipment، TripID | `PayloadEvent`، bucket-by-bucket، بار مفید و اختلاف با باسکول | payload لودر جایگزین تراکنش قانونی نیست؛ هر payload باید timestamp+equipment داشته باشد [S32][S40] |
| `MineKPIPlugin` | Trip/Equipment/Shift، موقعیت/dispatch status و payload/tonnage | production, trips, cycle, waiting, idle, utilization, fuel dashboard | KPI با denominator و uptime policy دقیق؛ در نبود telematics مقادیر مجهول بمانند [S34][S38][S39] |
| `RFIDANPRPlugin` | RFID/ANPR readers + cameras + Vehicle master | تطبیق هویت، confidence، override workflow | بدون ID ترکیبی automatic barrier release مجاز نیست [S14][S22] |
| `CalibrationPlugin` | Scale, certificate, OEM diagnostics | load-cell heatmap، drift alerts، expiry calendar | `diagnostic_supported=false` به‌وضوح نمایش داده شود [S23][S26] |
| `AccountingPlugin` | approved Ticket, Customer, rates, cost center | حساب مشتری، فاکتور، سند اصلاحی و مانده | معماری financial ledger مستقل و reconciliation با ERP [S01][S20] |

### 10.1 قرارداد افزونهٔ پیشنهادی

```json
{"plugin_id":"lidar.volume.v1","version":"1.0.0","requires":["visits.read","vehicles.read","evidence.write"],"provides":["lidar_scans.create","volume_reports.read"],"subscribes":["visit.entered","weighing.finalized"],"publishes":["lidar.scan.completed","lidar.quality.failed"],"configuration_schema":"JSON Schema URI","health_endpoint":"/health"}
```

Plugin نباید به شکل مستقیم رکورد raw وزن را اصلاح کند؛ فقط رویداد جدید و derived insight ایجاد کند. قابلیت نصب و حذف باید با feature flag، migrations برگشت‌پذیر و sandbox integration test همراه باشد.

## 11. شکاف‌ها، محدودیت‌ها و سؤال‌های باز (برای SRS و خرید تجهیزات)

### 11.1 شکاف سند و بررسی

1. **سایت اصلی WeighHub:** دسترسی به sitemap/robots و دمو read-only و اسکرین‌شات‌های PNG ممکن نبود [S41][S42][S43][S44][S45][S46][S47][S48]؛ لذا «خزش کامل» ادعا نمی‌شود.
2. **Visual UX:** رنگ، فاصله‌گذاری، grid و ریزتعامل‌های WeighHub با توصیف رسمی جایگزین شده‌اند، نه مشاهده مستقیم. برای بازطراحی دقیق باید تصاویر با مجوز و دسترسی مستقیم بررسی شوند.
3. **PDF و ویدیو:** PDF TruckFlow در این محیط به‌صورت متنی اما نه رندر موفق، و PDF SmarTower 404؛ ویدیوهای Wenco/Loadscan به‌صورت frame-by-frame دیده نشدند [S15][S16][S34].
4. **RFID:** فرکانس عددی، برد خوانش، پروتکل، کلاس آنتن و وضعیت خواندن در سکوی فلزی برای هر محصول/سایت مشخص نیست. UHF برای SmarTower تأیید شده، 865–868/902–928 MHz را بدون بررسی قوانین منطقه وارد مشخصات الزامی نکرده‌ایم [S14].
5. **ANPR:** دقت OCR روی پلاک‌های کشور هدف، شب، غبار، نوع کامیون، زاویه و فاصله در مراجع سنجیده نشده است؛ تست اختصاصی الزامی است.
6. **کالیبراسیون:** تاریخ گواهی، تحمل قانونی، روش traceability، OIML/NTEP/استاندارد ملی و سلسله تأیید مرکز آزمون نیازمند تعیین کشور و پروژه است؛ WeighHub مسئولیت را به دارنده دستگاه واگذار می‌کند [S06].
7. **ناوگان معدن:** Cat/Wenco/Modular سیستم کامل dispatch هستند؛ اتصال دادهٔ سفر و payload به باسکول و CRM/ERP در این سند طراحی پیشنهادی است و «یکپارچگی آماده» ادعا نشده.
8. **حجم:** چگالی توده‌ای به رطوبت، دانه‌بندی، تخلخل و نوع ماده وابسته است؛ بدون تعیین method و uncertainty، volume→weight صرفاً تخمین است [S28][S29].
9. **حفاظت و ایمنی:** Gate fail-safe، دوربین حریم خصوصی، HSE و interlock تحت الزامات سایت باید توسط تیم برق/اتوماسیون تأیید شود.
10. **ادعاهای ناواضح:** «ندارد» فقط وقتی صریحاً شرکت نفی کرده مجاز است؛ فقدان ذکر RFID/ANPR/LiDAR در WeighHub به `نامشخص` طبقه‌بندی شد، نه فاقد.

### 11.2 سؤال‌های تعیین‌کننده برای اجرای واقعی

| اولویت | سؤال صنعتی دقیق | اثر روی طراحی |
|---|---|---|
| حیاتی | سازنده/مدل indicator، نوع و فرمت frame serial، تعداد لودسل‌ها و دسترسی به health diagnostics چیست؟ | Device adapter/diagnostics |
| حیاتی | خودروهای جاده‌ای، دامپتراک معدنی یا هر دو؟ سقف قانونی و حداکثر ظرفیت چند تن و چند محور؟ | مدل وسیله/کنترل وزن/قوانین |
| حیاتی | آیا در سایت دو باسکول فیزیکی ورود و خروج وجود دارد یا یک باسکول دوطرفه؟ | lane-state machine و هماهنگی صف |
| حیاتی | صدور حواله/مجوز از ERP موجود انجام می‌شود یا باید در محصول صادر شود؟ | Permit engine و ERP ownership |
| حیاتی | هنگام قطعی اینترنت/برق، طبق SOP چه کسی حق خروج دارد و ثبت آفلاین چگونه مجاز است؟ | Offline safety و audit |
| بالا | قالب پلاک کشور، نحوه نصب camera و illumination و مقدار گرافیک/گردوغبار چیست؟ | dataset/ANPR pipeline |
| بالا | فاصله/سرعت خودرو از آنتن RFID و تأیید نوع تگ چیست؟ | RF design و خوانایی |
| بالا | آیا سیگنال health مستقل از نشان‌دهنده وزن موجود است؟ | CalibrationPlugin امکان واقعی |
| بالا | منبع دادهٔ loader payload چیست و چگونه vehicle/trip_id تطبیق می‌خورد؟ | FMS correlation |
| بالا | LiDAR در مسیر جاده نصب می‌شود یا محل‌های متعدد؟ empty baseline چگونه مدیریت شود؟ | Scan geometry/throughput |
| بالا | نوع ماده، رطوبت، grade، bulk density و روش نمونه‌برداری آن چیست؟ | Volume mass uncertainty |
| بالا | حجم تراکنش در ساعت، شیفت، سایت، تعداد همزمانی و سیاست نگهداری فیلم چقدر است؟ | sizing و performance SLO |

---
**یادداشت حقوقی و صحت:** این سند طراحی عملکرد مستقل با استفاده از اطلاعات عمومی محصول است. خواندن صفحات عمومی معادل دسترسی به code base، مدل اختصاصی داده، رفتار اجرایی دمو یا پروتکل محرمانهٔ دستگاه‌ها نیست. هرجا «پیشنهادی» درج شده تعهد فنی محصول هدف است و پیش از قرارداد و استقرار باید به SRS قابل‌تست و مستندات خرید تجهیز تبدیل شود.

## 12. JSON ساختاریافته: FR/NFR + Data Model + Alerts

**قابلیت استفاده:** بلوک زیر JSON معتبر است؛ عناصر `source` به دفتر شواهد بخش ۲ اشاره دارند. شناسه‌های اختصاری پیشنهادی هستند، نه API یا DB واقعی رقبا.


```json
{
  "spec_name": "MineGate Weighing and Production Intelligence (working title; original brand TBD)",
  "version": "1.0.0",
  "date": "2026-10-25",
  "language": "fa-IR",
  "scope": "Original implementation based on documented public capabilities; no vendor code/logo/design copying",
  "confidence_legend": {
    "confirmed": "Documented for cited reference",
    "proposed": "Target system requirement not a claim about source product",
    "unknown": "No sufficient public evidence"
  },
  "phases": {
    "P0": "Core weighbridge, gate log, exit QR, reports, audit",
    "P1": "RFID, ANPR, interlocks, ERP, calibration records",
    "P2": "LiDAR volume, onboard payload, mine KPI"
  },
  "product_requirements": {
    "roles": [
      {
        "id": "admin",
        "label": "مالک سامانه / ستاد",
        "can": [
          "site_configuration",
          "tenant_reporting",
          "rbac"
        ],
        "cannot": [
          "overwrite_raw_weight"
        ]
      },
      {
        "id": "mine_supervisor",
        "label": "مدیر معدن/شیفت",
        "can": [
          "production_kpi",
          "approval_with_policy"
        ],
        "cannot": [
          "alter_raw_sensor_readings"
        ]
      },
      {
        "id": "scale_operator",
        "label": "اپراتور باسکول",
        "can": [
          "create_visit",
          "capture_stable_weight",
          "issue_ticket"
        ],
        "cannot": [
          "write_live_weight_feed"
        ]
      },
      {
        "id": "gate_guard",
        "label": "نگهبان دروازه",
        "can": [
          "register_gate_event",
          "validate_exit_permit"
        ],
        "cannot": [
          "financial_reporting"
        ]
      },
      {
        "id": "commercial",
        "label": "کارشناس بازرگانی",
        "can": [
          "manage_orders",
          "manage_permits",
          "review_quota"
        ],
        "cannot": [
          "modify_calibration_record"
        ]
      },
      {
        "id": "calibration_manager",
        "label": "مسئول کالیبراسیون",
        "can": [
          "add_calibration_certificate",
          "review_loadcell_diagnostics"
        ],
        "cannot": [
          "rewrite_ticket"
        ]
      },
      {
        "id": "fleet_manager",
        "label": "مدیر ناوگان",
        "can": [
          "view_trips",
          "review_cycle_payload"
        ],
        "cannot": [
          "modify_legal_weight"
        ]
      },
      {
        "id": "auditor",
        "label": "حسابرس",
        "can": [
          "read_audit",
          "review_evidence"
        ],
        "cannot": [
          "approve_or_delete_evidence"
        ]
      },
      {
        "id": "integrations_admin",
        "label": "مدیر فناوری/یکپارچه‌سازی",
        "can": [
          "configure_adapters",
          "monitor_devices"
        ],
        "cannot": [
          "bulk_modify_business_data"
        ]
      }
    ],
    "user_stories": [
      {
        "id": "US-01",
        "actor": "gate_guard",
        "goal": "شناسایی خودرو و ثبت ورود",
        "acceptance": "Visit یکتا و زمان، پلاک و مدرک ورود مطابق سیاست سایت"
      },
      {
        "id": "US-02",
        "actor": "scale_operator",
        "goal": "ثبت وزن از indicator پایدار",
        "acceptance": "رد قرائت قدیمی/ناپایدار و نگهداری source device و raw event"
      },
      {
        "id": "US-03",
        "actor": "commercial",
        "goal": "تطبیق بار و حواله",
        "acceptance": "کنترل سقف مجاز و حالت exception approval"
      },
      {
        "id": "US-04",
        "actor": "gate_guard",
        "goal": "خروج با QR معتبر",
        "acceptance": "token یکبارمصرف و refuse scan دوم با ثبت GateEvent"
      },
      {
        "id": "US-05",
        "actor": "auditor",
        "goal": "ردیابی تغییر سند",
        "acceptance": "پایداری before/after, reason, actor و زمان"
      },
      {
        "id": "US-06",
        "actor": "mine_supervisor",
        "goal": "ردگیری چه‌کسی چه‌باری را آورده",
        "acceptance": "drill-down KPI, trip, transaction, ticket, images"
      },
      {
        "id": "US-07",
        "actor": "calibration_manager",
        "goal": "پایش تشخیص خطای لودسل/گواهی",
        "acceptance": "در absence of OEM diagnostic نمایش Unknown نه Healthy"
      },
      {
        "id": "US-08",
        "actor": "fleet_manager",
        "goal": "مقایسه جرمی/حجمی منابع متفاوت",
        "acceptance": "جدا ماندن مقدار، منبع، واحد و uncertainty"
      },
      {
        "id": "US-09",
        "actor": "admin",
        "goal": "تداوم محدود حین قطعی",
        "acceptance": "local queue با idempotency و fail-safe exit"
      },
      {
        "id": "US-10",
        "actor": "mine_supervisor",
        "goal": "پایش شیفت و تعداد سفر و چرخه",
        "acceptance": "KPI روی رویداد کامل و missing flags"
      }
    ],
    "modules": [
      {
        "name": "core_weighbridge",
        "phase": "P0"
      },
      {
        "name": "gate_and_identity",
        "phase": "P1"
      },
      {
        "name": "calibration_diagnostics",
        "phase": "P1"
      },
      {
        "name": "lidar_volume",
        "phase": "P2"
      },
      {
        "name": "onboard_payload",
        "phase": "P2"
      },
      {
        "name": "mine_fleet_kpi",
        "phase": "P2"
      }
    ]
  },
  "requirements": {
    "functional": [
      {
        "id": "FR-01",
        "priority": "P0",
        "requirement": "مدیریت سایت، شیفت، خط توزین و Zone؛ شناسه یکتا و منطقه زمانی مستقل",
        "evidence": "S01",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-02",
        "priority": "P0",
        "requirement": "ثبت Vehicle/Driver/Carrier/Customer/Material و اعتبارسنجی تکرار پلاک",
        "evidence": "S01",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-03",
        "priority": "P0",
        "requirement": "ثبت GateEvent ورود و خروج با کاربر، ساعت سرور و شناسه Visit",
        "evidence": "S01",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-04",
        "priority": "P0",
        "requirement": "خواندن استریم وزن از دستگاه تأییدشده با آداپتور پروتکل و device key",
        "evidence": "S03",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-05",
        "priority": "P0",
        "requirement": "عدم ثبت قرائت که stable نباشد یا age از آستانه قابل‌پیکربندی بیشتر باشد",
        "evidence": "S02",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-06",
        "priority": "P0",
        "requirement": "دو توزین با ترتیب Tare→Gross یا Gross→Tare و Net=Gross−Tare",
        "evidence": "S01",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-07",
        "priority": "P0",
        "requirement": "ذخیره واحد و resolution و source و quality برای هر WeighEvent و عدم ویرایش خام",
        "evidence": "S02",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-08",
        "priority": "P0",
        "requirement": "پشتیبانی از توزین یک‌مرحله‌ای بر پایه تارا با تاریخ اعتبار و برچسب استثنا",
        "evidence": "S01",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-09",
        "priority": "P0",
        "requirement": "رابط ثبت تراکنش با جست‌وجوی پلاک، راننده، مقصد، ماده، مجوز و باسکول",
        "evidence": "S01",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-10",
        "priority": "P0",
        "requirement": "سریال سند غیرتکراری و ماشین وضعیت Draft/Pending/Approved/Voided",
        "evidence": "S01",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-11",
        "priority": "P0",
        "requirement": "چاپ/نمایش Ticket با QR راستی‌آزمایی، منبع وزن و نام ثبت‌کننده",
        "evidence": "S01",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-12",
        "priority": "P0",
        "requirement": "ثبت اصلاح، ابطال و چاپ مجدد در AuditLog تغییرناپذیر منطقی",
        "evidence": "S02",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-13",
        "priority": "P0",
        "requirement": "مجوز خروج متصل به Visit و فهرست تراکنش‌های approved؛ مصرف QR اتمیک",
        "evidence": "S01",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-14",
        "priority": "P0",
        "requirement": "کنترل جواز، سقف وزن، تاریخ اعتبار، شرکت حمل و مسیر پیش از آزادسازی خروج",
        "evidence": "PROPOSED",
        "confidence": "پیشنهادی"
      },
      {
        "id": "FR-15",
        "priority": "P0",
        "requirement": "RBAC حداقل: admin, supervisor, operator, guard, finance, auditor",
        "evidence": "S02",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-16",
        "priority": "P0",
        "requirement": "داشبورد KPI: تناژ ورودی/خروجی، سفر، زمان اقامت، درصف، هشدار، دستگاه آفلاین",
        "evidence": "PROPOSED",
        "confidence": "پیشنهادی"
      },
      {
        "id": "FR-17",
        "priority": "P0",
        "requirement": "فیلتر گزارش در سطح شعبه، شیفت، راننده، شرکت حمل، ماده، خودرو، زمان و خروجی CSV/PDF",
        "evidence": "S01",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-18",
        "priority": "P0",
        "requirement": "هشدار تکرار توزین، net منفی، تارا غیرعادی، کار در ساعات غیرمجاز",
        "evidence": "S02",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-19",
        "priority": "P0",
        "requirement": "پایداری event offline با idempotency key و بازپخش قابل ردیابی پس از اتصال",
        "evidence": "S03",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-20",
        "priority": "P0",
        "requirement": "زنجیره رویدادها و event_timestamp/received_timestamp برای بررسی تأخیر",
        "evidence": "PROPOSED",
        "confidence": "پیشنهادی"
      },
      {
        "id": "FR-21",
        "priority": "P1",
        "requirement": "RFID Reader Adapter با تنظیم مدل، فرکانس، پروتکل، EPC، کیفیت خوانش و whitelist",
        "evidence": "S14",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-22",
        "priority": "P1",
        "requirement": "ANPR inference و OCR با confidence، تصویر، plate canonicalization و review",
        "evidence": "S22",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-23",
        "priority": "P1",
        "requirement": "تطبیق RFID+ANPR+Vehicle و مسیر رسیدگی به mismatch با override دوامضایی",
        "evidence": "PROPOSED",
        "confidence": "پیشنهادی"
      },
      {
        "id": "FR-24",
        "priority": "P1",
        "requirement": "کنترل راهبند، چراغ و حسگر حضور/جایگیری با fail-safe interlock",
        "evidence": "S16",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-25",
        "priority": "P1",
        "requirement": "ثبت تصاویر دوربین قبل/حین/بعد وزن با checksum و retention",
        "evidence": "S16",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-26",
        "priority": "P1",
        "requirement": "صف ورود/خروج و زمان انتظار بر اساس Event و GateLane",
        "evidence": "S16",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-27",
        "priority": "P1",
        "requirement": "مدیریت قرارداد، سهمیه، سفارش فروش/خرید، بارنامه و باقی‌مانده مجوز",
        "evidence": "PROPOSED",
        "confidence": "پیشنهادی"
      },
      {
        "id": "FR-28",
        "priority": "P1",
        "requirement": "تطبیق چندماده‌ای، چندباسکولی، ورود پر/خالی، برگشتی و استثنا",
        "evidence": "S01",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-29",
        "priority": "P1",
        "requirement": "API REST/JSON با webhook امضاشده برای ERP و پیام‌رسان",
        "evidence": "S30",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-30",
        "priority": "P1",
        "requirement": "مانیتورینگ heartbeat و سلامت سنسور/لودسل با پشتیبانی status از OEM",
        "evidence": "S26",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-31",
        "priority": "P1",
        "requirement": "ثبت سوابق کالیبراسیون و انقضا و جلوگیری از صدور سند تجاری در حالت Lockout",
        "evidence": "PROPOSED",
        "confidence": "پیشنهادی"
      },
      {
        "id": "FR-32",
        "priority": "P1",
        "requirement": "اعلان‌های قاعده‌مند داخلی، ایمیل و SMS از صف پایدار",
        "evidence": "S01",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-33",
        "priority": "P1",
        "requirement": "گزارش روزانه، شیفتی، هفتگی، ماهانه و زمان‌بندی دانلود/ارسال",
        "evidence": "S01",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-34",
        "priority": "P1",
        "requirement": "تطبیق باسکول با موجودی، تناژ دستور حمل و صورت‌حساب",
        "evidence": "S01",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-35",
        "priority": "P2",
        "requirement": "ماژول LiDAR: Empty baseline + Loaded scan + geometry + volume + point cloud",
        "evidence": "S28",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-36",
        "priority": "P2",
        "requirement": "محاسبه جرم تخمینی از volume×bulk_density با uncertainty و بدون جایگزینی وزن قانونی",
        "evidence": "PROPOSED",
        "confidence": "پیشنهادی"
      },
      {
        "id": "FR-37",
        "priority": "P2",
        "requirement": "اتصال payload لودر/شاول/Onboard با Equipment و TripID",
        "evidence": "S32",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-38",
        "priority": "P2",
        "requirement": "KPI ناوگان شیفت: cycle, wait, idle, utilization, fuel, payload compliance",
        "evidence": "S34",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-39",
        "priority": "P2",
        "requirement": "تطبیق درشت‌مقیاس Weighbridge vs Lidar vs Onboard در سطح سفر/شیفت",
        "evidence": "PROPOSED",
        "confidence": "پیشنهادی"
      },
      {
        "id": "FR-40",
        "priority": "P2",
        "requirement": "چندسایتی، تنظیم سیاست‌های سایت و تجمیع ستادی بدون افشای داده سایت دیگر",
        "evidence": "S01",
        "confidence": "تأییدشده برای مرجع، پیشنهادی برای پیاده‌سازی ما"
      },
      {
        "id": "FR-41",
        "priority": "P1",
        "requirement": "قواعد تشخیص بارگذاری نامتقارن و چرخ خارج سکو تنها در صورت وجود سنسور/دوربین کافی",
        "evidence": "PROPOSED",
        "confidence": "پیشنهادی"
      },
      {
        "id": "FR-42",
        "priority": "P1",
        "requirement": "ثبت درخواست Override با دلیل، امضای دوم، snapshot و AuditHash",
        "evidence": "PROPOSED",
        "confidence": "پیشنهادی"
      },
      {
        "id": "FR-43",
        "priority": "P0",
        "requirement": "تست بازتولیدپذیر برای مقادیر وزن، حالت خروج و قفل‌های مجوز",
        "evidence": "PROPOSED",
        "confidence": "پیشنهادی"
      },
      {
        "id": "FR-44",
        "priority": "P1",
        "requirement": "گزارش سلامت و dashboard وضعیت دستگاه‌ها، link latency و offline queue depth",
        "evidence": "PROPOSED",
        "confidence": "پیشنهادی"
      }
    ],
    "nonfunctional": [
      {
        "id": "NFR-01",
        "dimension": "حسابرسی",
        "requirement": "تمام تغییرات حساس append-only و هش زنجیره‌ای/HMAC مستقل از دیتابیس؛ تست تشخیص تغییر/حذف",
        "evidence": "S02"
      },
      {
        "id": "NFR-02",
        "dimension": "امنیت",
        "requirement": "TLS در انتقال، رمزنگاری ذخیره، مدیریت اسرار، حداقل سطح دسترسی و بازبینی دوره‌ای",
        "evidence": "PROPOSED"
      },
      {
        "id": "NFR-03",
        "dimension": "زمان",
        "requirement": "ذخیره UTC، نمایش timezone سایت، هماهنگی NTP و تمایز زمان دریافت/وقوع",
        "evidence": "PROPOSED"
      },
      {
        "id": "NFR-04",
        "dimension": "دوام",
        "requirement": "حداقل once-delivery با deduplication server-side؛ خروجی exactly-once business effect",
        "evidence": "S03"
      },
      {
        "id": "NFR-05",
        "dimension": "کارکرد آفلاین",
        "requirement": "پروتکل تخلیه queue و برخورد رکورد conflict؛ ممنوعیت صدور مجوز نهایی در ابهام",
        "evidence": "S03"
      },
      {
        "id": "NFR-06",
        "dimension": "کارایی",
        "requirement": "زمان تعامل، تأخیر دریافت وزن، throughput و SLA تنها پس از تست سایت در SRS عددگذاری شود",
        "evidence": "PROPOSED"
      },
      {
        "id": "NFR-07",
        "dimension": "Availability",
        "requirement": "fail-closed برای کنترل راهبند، حالت کاهش قابلیت و runbook قطع شبکه/برق",
        "evidence": "PROPOSED"
      },
      {
        "id": "NFR-08",
        "dimension": "مقیاس‌پذیری",
        "requirement": "tenant_id/site_id در همه کلیدهای دسترسی؛ جداسازی چندسایتی در تمام queryها",
        "evidence": "S01"
      },
      {
        "id": "NFR-09",
        "dimension": "تست‌پذیری",
        "requirement": "Simulator برای indicator، RFID، ANPR، PLC و LiDAR؛ integration tests",
        "evidence": "PROPOSED"
      },
      {
        "id": "NFR-10",
        "dimension": "قانونی",
        "requirement": "اعتبارسنجی metrology/legal trade use با مرجع ذیصلاح، عدم ادعای گواهی نرم‌افزار",
        "evidence": "S06"
      },
      {
        "id": "NFR-11",
        "dimension": "داده",
        "requirement": "Backup/restore آزمایش‌شده، retention per evidence type، export و deletion policy",
        "evidence": "S02"
      },
      {
        "id": "NFR-12",
        "dimension": "حریم خصوصی",
        "requirement": "کنترل دسترسی تصویر کارت/راننده، redaction در UI و مسیر درخواست دسترسی",
        "evidence": "S01"
      },
      {
        "id": "NFR-13",
        "dimension": "UX",
        "requirement": "فارسی RTL پیش‌فرض، اعداد محلی/لاتین قابل تنظیم، با نمایش واحد در همه مقادیر",
        "evidence": "PROPOSED"
      },
      {
        "id": "NFR-14",
        "dimension": "Observability",
        "requirement": "Structured logs, traces, metrics, device heartbeats و correlation IDs",
        "evidence": "PROPOSED"
      },
      {
        "id": "NFR-15",
        "dimension": "یکپارچه‌سازی",
        "requirement": "Adapter versioning و contract tests؛ پروتکل صرفاً پس از تأیید OEM فعال شود",
        "evidence": "PROPOSED"
      },
      {
        "id": "NFR-16",
        "dimension": "غیرقابل‌حذف بودن رونوشت",
        "requirement": "هر خروجی PDF/QR نسخه و hash و وضعیت سند داشته باشد؛ ابطال معادل حذف نیست",
        "evidence": "S02"
      }
    ]
  },
  "data_model": {
    "entities": [
      {
        "name": "Tenant",
        "fields": [
          "id",
          "legal_name",
          "slug",
          "settings_json",
          "created_at"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "Site",
        "fields": [
          "id",
          "tenant_id",
          "name",
          "timezone",
          "geofence",
          "active"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "GateLane",
        "fields": [
          "id",
          "site_id",
          "direction",
          "barrier_controller_id",
          "sensors",
          "status"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "Vehicle",
        "fields": [
          "id",
          "tenant_id",
          "plate_raw",
          "plate_normalized",
          "plate_country",
          "rfid_tag_id",
          "carrier_id",
          "vehicle_type",
          "axles",
          "max_gvw_kg",
          "tare_policy",
          "status"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "Driver",
        "fields": [
          "id",
          "tenant_id",
          "full_name",
          "national_id_encrypted",
          "license_no_encrypted",
          "license_expiry",
          "photo_ref",
          "carrier_id",
          "status"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "Carrier",
        "fields": [
          "id",
          "tenant_id",
          "name",
          "contract_ref",
          "contact",
          "status"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "Customer",
        "fields": [
          "id",
          "tenant_id",
          "party_type",
          "legal_name",
          "tax_code",
          "credit_limit",
          "status"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "Material",
        "fields": [
          "id",
          "tenant_id",
          "material_code",
          "name",
          "class_or_grade",
          "density_kg_m3_nullable",
          "density_method",
          "density_uncertainty",
          "unit",
          "hazardous_flag"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "Permit",
        "fields": [
          "id",
          "site_id",
          "type",
          "permit_number",
          "external_order_ref",
          "customer_id",
          "carrier_id",
          "vehicle_id",
          "material_id",
          "origin_id",
          "destination_id",
          "valid_from",
          "valid_to",
          "allocated_qty_kg",
          "used_qty_kg",
          "max_trip_kg",
          "state",
          "approval_id"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "Visit",
        "fields": [
          "id",
          "site_id",
          "vehicle_id",
          "driver_id",
          "lane_in_id",
          "entered_at",
          "lane_out_id",
          "exited_at",
          "state",
          "exit_permit_id"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "Transaction",
        "fields": [
          "id",
          "site_id",
          "visit_id",
          "ticket_number",
          "customer_id",
          "material_id",
          "permit_id",
          "transaction_type",
          "direction",
          "weigh_mode",
          "gross_kg",
          "tare_kg",
          "net_kg",
          "state",
          "created_by",
          "approved_by",
          "created_at",
          "approved_at",
          "source_method",
          "current_revision"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "WeighEvent",
        "fields": [
          "id",
          "transaction_id",
          "scale_id",
          "sequence_no",
          "captured_at",
          "device_timestamp",
          "received_at",
          "weight_kg",
          "stable",
          "device_status",
          "unit",
          "graduation_kg",
          "source",
          "source_device_id",
          "raw_frame_hash",
          "evidence_photo_ids",
          "operator_id"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "GateEvent",
        "fields": [
          "id",
          "visit_id",
          "lane_id",
          "occurred_at",
          "event_type",
          "actor_id",
          "plate_read_id",
          "rfid_read_id",
          "barrier_event_id",
          "snapshot_id",
          "reason"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "Camera",
        "fields": [
          "id",
          "site_id",
          "location_code",
          "direction",
          "vendor",
          "endpoint_secret_ref",
          "model",
          "health_state",
          "privacy_policy"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "PlateRead",
        "fields": [
          "id",
          "camera_id",
          "visit_id",
          "occurred_at",
          "plate_text",
          "normalized",
          "ocr_confidence",
          "detection_confidence",
          "image_ref",
          "reviewed_by",
          "review_status"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "RFIDRead",
        "fields": [
          "id",
          "reader_id",
          "lane_id",
          "visit_id",
          "epc",
          "read_at",
          "rssi_nullable",
          "antenna_id",
          "tag_binding_match",
          "raw_message_hash"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "RFIDTag",
        "fields": [
          "id",
          "tenant_id",
          "epc",
          "vehicle_id_nullable",
          "driver_id_nullable",
          "tag_type",
          "valid_from",
          "valid_to",
          "status"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "Scale",
        "fields": [
          "id",
          "site_id",
          "indicator_model",
          "serial_number",
          "adapter_name",
          "device_token_key_ref",
          "max_capacity_kg",
          "min_capacity_kg",
          "division_kg",
          "protocol",
          "health",
          "calibration_status",
          "last_seen_at"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "CalibrationRecord",
        "fields": [
          "id",
          "scale_id",
          "certificate_no",
          "calibration_at",
          "expiry_at",
          "certificate_file_ref",
          "issuer",
          "test_results_json",
          "verification_scope",
          "approved_by",
          "status"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "LoadCellHealthEvent",
        "fields": [
          "id",
          "scale_id",
          "cell_channel",
          "occurred_at",
          "zero_offset",
          "drift_indicator",
          "imbalance",
          "temperature",
          "diagnostic_code",
          "raw_payload_ref"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "Alert",
        "fields": [
          "id",
          "site_id",
          "code",
          "severity",
          "rule_version",
          "entity_type",
          "entity_id",
          "triggered_at",
          "evidence_json",
          "status",
          "acknowledged_by",
          "acknowledged_at",
          "resolution"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "AlertRule",
        "fields": [
          "id",
          "site_id_nullable",
          "code",
          "version",
          "enabled",
          "threshold_json",
          "required_capabilities",
          "severity",
          "action_policy"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "Shift",
        "fields": [
          "id",
          "site_id",
          "label",
          "start_at",
          "end_at",
          "timezone",
          "production_target_kg"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "Equipment",
        "fields": [
          "id",
          "site_id",
          "asset_type",
          "fleet_no",
          "model",
          "capacity_kg",
          "telemetry_adapter_id",
          "state"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "LidarScan",
        "fields": [
          "id",
          "site_id",
          "vehicle_id",
          "visit_id",
          "scanner_id",
          "mode",
          "reference_scan_id_nullable",
          "occurred_at",
          "volume_m3",
          "pointcloud_uri",
          "mesh_uri",
          "quality_score",
          "confidence_metadata_json",
          "calibration_ref"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "PayloadEvent",
        "fields": [
          "id",
          "equipment_id",
          "vehicle_id",
          "trip_id",
          "occurred_at",
          "source_system",
          "measured_kg",
          "bucket_count",
          "operator_id",
          "uncertainty_kg_nullable"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "Trip",
        "fields": [
          "id",
          "site_id",
          "visit_id_nullable",
          "vehicle_id",
          "load_location",
          "dump_location",
          "load_start_at",
          "depart_at",
          "arrive_at",
          "unload_at",
          "cycle_seconds_nullable",
          "shift_id"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "IntegrationEndpoint",
        "fields": [
          "id",
          "tenant_id",
          "type",
          "adapter_name",
          "version",
          "auth_secret_ref",
          "config_json",
          "enabled",
          "last_success_at"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "AuditEvent",
        "fields": [
          "id",
          "tenant_id",
          "site_id",
          "occurred_at",
          "actor_type",
          "actor_id",
          "action",
          "entity_type",
          "entity_id",
          "before_json",
          "after_json",
          "reason",
          "prev_hash",
          "record_hmac",
          "correlation_id"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "EvidenceAsset",
        "fields": [
          "id",
          "tenant_id",
          "mime_type",
          "source",
          "storage_uri",
          "sha256",
          "created_at",
          "retention_policy",
          "access_class"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "ExitPermit",
        "fields": [
          "id",
          "site_id",
          "visit_id",
          "serial",
          "qr_token_hash",
          "status",
          "approved_by",
          "approved_at",
          "consumed_by",
          "consumed_at",
          "transaction_ids",
          "cancel_reason"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      },
      {
        "name": "DeliveryEvent",
        "fields": [
          "id",
          "integration_id",
          "entity_type",
          "entity_id",
          "delivery_id",
          "idempotency_key",
          "state",
          "attempt_count",
          "last_attempt_at",
          "last_error"
        ],
        "required_common": [
          "id"
        ],
        "notes": "هر رکورد اجرایی دارای tenant/site و audit metadata بر اساس حوزه است؛ نوع و nullable در DDL نهایی تثبیت می‌شود."
      }
    ],
    "rules": [
      "mass precision decimal kg",
      "timestamps UTC ISO 8601",
      "append-only raw sensor data",
      "idempotency unique per integration",
      "tenant/site scoped authorization",
      "immutable evidence with sha256"
    ]
  },
  "alert_rules": [
    {
      "id": "AL-01",
      "code": "unstable_weight",
      "condition": "قرائت stable نیست یا از freshness_ms بیشتر قدیمی است",
      "threshold": "freshness_ms=config؛ مقدار WeighHub=12000ms [S02]",
      "action": "BLOCK_CAPTURE",
      "evidence_objects": [
        "scale",
        "reading"
      ],
      "source": "S02"
    },
    {
      "id": "AL-02",
      "code": "scale_offline",
      "condition": "عدم دریافت قرائت از دستگاه طی مدت heartbeat_timeout",
      "threshold": "timeout از OEM/شبکه و SRS",
      "action": "BLOCK_CAPTURE+NOTIFY",
      "evidence_objects": [
        "scale"
      ],
      "source": "S03"
    },
    {
      "id": "AL-03",
      "code": "over_gvw",
      "condition": "gross_kg > min(vehicle.max_gvw, scale.max_capacity)",
      "threshold": "پارامتر سایت و ظرفیت معتبر",
      "action": "BLOCK_APPROVAL+NOTIFY",
      "evidence_objects": [
        "transaction",
        "vehicle"
      ],
      "source": "PROPOSED"
    },
    {
      "id": "AL-04",
      "code": "negative_net",
      "condition": "gross_kg - tare_kg < 0",
      "threshold": "۰ کیلوگرم",
      "action": "REVIEW+BLOCK_APPROVAL",
      "evidence_objects": [
        "transaction"
      ],
      "source": "S02"
    },
    {
      "id": "AL-05",
      "code": "tare_outlier",
      "condition": "abs(tare - median(last_n verified tares)) > dynamic_limit",
      "threshold": "n و limit نیازمند baseline و آزمون",
      "action": "REVIEW",
      "evidence_objects": [
        "vehicle",
        "transaction"
      ],
      "source": "S02"
    },
    {
      "id": "AL-06",
      "code": "duplicate_plate_trip",
      "condition": "فاصله دو سفر/وزن غیرممکن برای یک پلاک",
      "threshold": "min_turnaround_minutes=config",
      "action": "REVIEW",
      "evidence_objects": [
        "vehicle",
        "visit"
      ],
      "source": "S02"
    },
    {
      "id": "AL-07",
      "code": "plate_rfid_mismatch",
      "condition": "RFID و ANPR به دو vehicle_id متفاوت اشاره کنند",
      "threshold": "min_confidence_plate=config",
      "action": "HOLD_BARRIER+REVIEW",
      "evidence_objects": [
        "plate_read",
        "rfid_read"
      ],
      "source": "PROPOSED"
    },
    {
      "id": "AL-08",
      "code": "vehicle_mispositioned",
      "condition": "سنسور حضور یا wheel-zone اعلام جایگیری نامعتبر دهد",
      "threshold": "کالیبراسیون geometry هر مسیر",
      "action": "BLOCK_CAPTURE",
      "evidence_objects": [
        "sensors",
        "vehicle"
      ],
      "source": "S14"
    },
    {
      "id": "AL-09",
      "code": "permit_expired",
      "condition": "now > permit.valid_to یا state != approved",
      "threshold": "۱ رخداد",
      "action": "HOLD_EXIT",
      "evidence_objects": [
        "permit"
      ],
      "source": "PROPOSED"
    },
    {
      "id": "AL-10",
      "code": "permit_quantity",
      "condition": "used_kg+this_net_kg > permit.allowed_kg",
      "threshold": "تلرانس قرارداد=config",
      "action": "HOLD_EXIT+REVIEW",
      "evidence_objects": [
        "permit",
        "transaction"
      ],
      "source": "PROPOSED"
    },
    {
      "id": "AL-11",
      "code": "permit_reuse",
      "condition": "QR already consumed یا وضعیت cancel",
      "threshold": "۰ تکرار مجاز",
      "action": "HOLD_BARRIER+SECURITY",
      "evidence_objects": [
        "exit_permit"
      ],
      "source": "S02"
    },
    {
      "id": "AL-12",
      "code": "calibration_expired",
      "condition": "now > calibration.expiry_at یا گواهی نامعتبر",
      "threshold": "تاریخ گواهی؛ بدون حد ساختگی",
      "action": "LOCK_LEGAL_WEIGH",
      "evidence_objects": [
        "scale",
        "calibration"
      ],
      "source": "PROPOSED"
    },
    {
      "id": "AL-13",
      "code": "loadcell_drift",
      "condition": "diagnostic zero/drift/imbalance از indicator/OEM",
      "threshold": "OEM threshold؛ بدون دسترسی فقط Unknown",
      "action": "MAINTENANCE_REVIEW",
      "evidence_objects": [
        "loadcell",
        "scale"
      ],
      "source": "S26"
    },
    {
      "id": "AL-14",
      "code": "unusual_density",
      "condition": "تفاوت جرم باسکول و volume×rho فراتر از عدم‌قطعیت ترکیبی",
      "threshold": "k*sigma؛ پس از اعتبارسنجی چگالی",
      "action": "REVIEW_ONLY",
      "evidence_objects": [
        "lidar",
        "transaction"
      ],
      "source": "PROPOSED"
    },
    {
      "id": "AL-15",
      "code": "shift_output_lag",
      "condition": "actual_shift_output < target_profile_at_time",
      "threshold": "منحنی هدف تولید توسط کارفرما",
      "action": "NOTIFY_SUPERVISOR",
      "evidence_objects": [
        "shift"
      ],
      "source": "S35"
    },
    {
      "id": "AL-16",
      "code": "manual_entry_risk",
      "condition": "نرخ توزین دستی اپراتور بالاتر از الگوی خودش/شیفت",
      "threshold": "baseline آماری و threshold config",
      "action": "REVIEW",
      "evidence_objects": [
        "operator"
      ],
      "source": "S02"
    },
    {
      "id": "AL-17",
      "code": "photo_missing",
      "condition": "توزین نهایی بدون تصویر لازم در سایت مجهز",
      "threshold": "required_count با سیاست محلی",
      "action": "BLOCK_OR_EXCEPTION",
      "evidence_objects": [
        "transaction",
        "camera"
      ],
      "source": "PROPOSED"
    },
    {
      "id": "AL-18",
      "code": "offline_queue_age",
      "condition": "رخداد sync نشده > max_queue_age یا بیش از retry_budget",
      "threshold": "وابسته به سطح خدمت سایت",
      "action": "NOTIFY_IT",
      "evidence_objects": [
        "gateway"
      ],
      "source": "PROPOSED"
    },
    {
      "id": "AL-19",
      "code": "scale_capacity_exceeded",
      "condition": "weight_kg > scale.max_capacity_kg",
      "threshold": "مقدار nameplate ثبت شده",
      "action": "BLOCK_CAPTURE+MAINTENANCE",
      "evidence_objects": [
        "scale",
        "weigh_event"
      ],
      "source": "PROPOSED"
    },
    {
      "id": "AL-20",
      "code": "repeat_identical_net",
      "condition": "مقادیر خالص برابر پرتکرار برای یک مشتری/وسیله",
      "threshold": "count/window بر مبنای داده",
      "action": "REVIEW",
      "evidence_objects": [
        "transaction"
      ],
      "source": "S02"
    }
  ],
  "sources": {
    "S01": "https://weighhub.com/en/features",
    "S02": "https://weighhub.com/en/controls",
    "S03": "https://weighhub.com/en/connect",
    "S04": "https://weighhub.com/en/pricing",
    "S05": "https://weighhub.com/en",
    "S06": "https://weighhub.com/en/terms",
    "S07": "https://weighhub.com/en/glossary",
    "S08": "https://weighhub.com/en/articles",
    "S09": "https://weighhub.com/en/articles/prevent-weighbridge-fraud",
    "S10": "https://weighhub.com/en/articles/weighbridge-calibration",
    "S11": "https://weighhub.com/en/about",
    "S12": "https://weighhub.com/en/request",
    "S13": "https://www.averyweigh-tronix.com/en/product/weighman-8-weighbridge-software/",
    "S14": "https://www.averyweigh-tronix.com/en/product/smartower-unmanned-weighbridge-system/",
    "S15": "https://www.averyweigh-tronix.com/en-ie/wp-content/uploads/sites/6/2021/11/smartower_uws_brochure.pdf",
    "S16": "https://us.preciamolen.com/wp-content/uploads/sites/22/2019/07/09-15-01-1-FT-TRUCKFLOW-V00.09.pdf",
    "S17": "https://www.directindustry.com/prod/precia-molen/product-7658-2537247.html",
    "S18": "https://it-online.co.za/2019/05/24/wbx-automates-weighbridge-process/",
    "S19": "https://www.miningweekly.com/article/weighbridge-solution-installed-at-mpumalanga-coal-mine-2014-05-23/page%3A2",
    "S20": "https://5.imimg.com/data5/SELLER/Doc/2022/5/NL/GN/IU/108975308/weighbridge-data-sms-and-email-system.pdf",
    "S21": "https://endel.digital/",
    "S22": "https://www.linkedin.com/products/endel-digital-solutions-weighmast-weighbridge-software/",
    "S23": "https://www.mt.com/in/en/home/products/Transport_and_Logistics_Solutions/truck-and-rail-scale-systems/truck-scale-systems/powercell-pdx-load-cells-42904891002.html",
    "S24": "https://www.mt.com/ca/en/home/library/datasheets/industrial-scales/terminals/ind780-pdf.html",
    "S25": "https://www.mt.com/dam/mt_ext_files/Editorial/Generic/0/OEM_SI_brochure_full_range_Editorial-Generic_1153724549187_files/br_oemsystemintegrationen060704lr1153724549187.pdf",
    "S26": "https://www.ricelake.com/products/iqube2-digital-diagnostic-junction-box?part=93243",
    "S27": "https://www.loadscan.com/myscanner/",
    "S28": "https://www.loadscan.com/mine-payload-scanner/",
    "S29": "https://www.loadscan.com/load-volume-scanner/",
    "S30": "https://www.loadscan.com/loadscan-integration-api/",
    "S31": "https://www.loadscan.com/myscanner/loadvision/",
    "S32": "https://www.halomec.com/uploads/4/5/2/1/45211295/trimble_loadrite_lr360_brochure.pdf",
    "S33": "https://sitechnw.com/products/loadrite-360-loadout-management-system/",
    "S34": "https://www.wencomine.com/our-solutions/mining-fleet-management",
    "S35": "https://www.hitachi.com/en-us/press/wenco-mine-performance-suite-6-reimagines-dispatching-analytics-and-total-mine-performance/",
    "S36": "https://hexagon.com/company/newsroom/press-releases/2022/hexagon-awarded-significant-fleet-management-project",
    "S37": "https://hexagon.com/-/media/project/one-web/master-site/products/hxgn-mineoperate-op-pro-hp/case_study_01_mineoperate_op_pro_lp.pdf",
    "S38": "https://www.komatsu.com/en-us/technology/smart-mining/loading-and-haulage/dispatch",
    "S39": "https://www.cat.com/en_US/by-industry/mining/surface-mining/surface-technology/fleet.html",
    "S40": "https://www.cat.com/en_GB/products/new/technology/terrain/terrain/1000030252.html",
    "S41": "https://demo.weighhub.com/",
    "S49": "https://cdn.techjockey.com/web/assets/images/techjockey/products/screenshots/21235_truckflowsoftwareweight.jpg"
  },
  "known_gaps": [
    "Main demo inaccessible",
    "Images on WeighHub not visual-inspected",
    "RFID bands/range unknown",
    "Vendor-specific protocols unknown",
    "Legal metrology jurisdiction unknown",
    "no complete video inspection"
  ]
}
```