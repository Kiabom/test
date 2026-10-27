# جمع‌بندی تحقیق — ۱۳ سند منبع

> این سند خلاصهٔ همه فایل‌های بررسی‌شده است و مبنای `docs/prompts/spec/*` قرار گرفته.
> «پیشنهادی» = طراحی محصول ما (نه ادعای وجود در محصول رقیب). هیچ لوگو، متن، اسکرین‌شات یا کد رقبا در محصول استفاده نمی‌شود.

## ۱. فهرست منابع

| کد | فایل | مرجع اصلی | نقش در طراحی ما |
|---|---|---|---|
| WH | `sources/01_WeighHub_Mining_Intelligence_PRD.md` | **WeighHub** | **الگوی اصلی** روال، صفحات، کنترل‌ها، QR خروج، قیمت‌گذاری |
| LASE | `sources/02_LASE_TVM_PRD.md` | LASE TVM | اسکن حجمی LiDAR (S ایستا / M در حرکت)، گنتری، point cloud |
| MET | `sources/03_Metrici_PRD.md` | Metrici LPR/PPD | تشخیص موقعیت تصویری روی باسکول (ناحیه سبز/قرمز)، هشدار انحراف وزن |
| MT | `sources/04_MettlerToledo_DataMaster_Benchmark_PRD.md` | Mettler DataMaster/DataBridge | سلامت لودسل، نقشه چیدمان، uptime، درخواست سرویس |
| CS | `sources/05_Codeshilp_ANPR_PRD.md` + `.json` | Codeshilp ANPR | فرم توزین ۴ دوربین، قبض با عکس قبل/بعد، Tally، ضدسرقت خروج بدون ثبت |
| SP | `sources/06_STAIN_PESA_PRD.md` + `.json` | STAIN PESA+ | تابلو فراخوان لاین A–E، برگه سفر بارکددار، گالری شواهد، چرخه استثنا |
| OK | `sources/07_OtomatikKantar_PRD.md` | Otomatik Kantar | کنسول زنده ۳ستونه، موقعیت‌سنجی AI، LED حیاط، نمای موبایل، بانکر و دوزینگ |
| PU | `sources/08_Punit_*.md`, `09_Punit_*.md` | Punit | کسر مجاز (billable)، ۵ قالب رسید، batch، WhatsApp، فرم هفت‌قطعه‌ای |
| ST | `sources/10_Smart_Traffic_Mining_PRD.md` | ترکیبی | anti-passback، tailgating، خودروهای داخلی، ورود کامیون پر، اولویت‌های راهبند |
| WIS | `sources/11_WIS_PRD.md` | Weighing Engineering (WIS) | الگوریتم تصمیم گیت، میز توزین تیره، زمان‌بندی نوبت، rule builder |

رقبای مقایسه‌ای پرتکرار در همه اسناد: Avery Weighman 8 / SmarTower، Precia TruckFlow، Dariel WBX، Endel WeighMAST، Mettler POWERCELL/TraxEMT، Rice Lake iQUBE²، Loadscan MyScanner/LVS، LOADRITE LR360/InsightHQ، Wenco، Hexagon، Komatsu DISPATCH، Cat MineStar.

## ۲. WeighHub — آنچه باید شبیه‌اش بسازیم (از WH بخش 2.3 و 7)

**سایت:** Home · Features (روال سفر «Stop 0 → Add-ons») · Controls (کنترل‌های 01 تا 10) · Connect (Windows COM Agent / ESP32 Wi-Fi) · Pricing (Basic / Professional / Enterprise) · Glossary · Articles · Request demo · demo فقط‌خواندنی.

**روال (Stops):**
0. پیش‌ثبت (مشتری، قرارداد، سهمیه، خودرو، راننده)
1. دروازه ورود — پلاک، راننده، **عکس زندهٔ گواهینامه**، ثبت Visit
2. داخل سایت — فهرست «Inside now» + مدت اقامت
3. توزین اول — وزن زنده، stable، **fresh < 12s**، autofill راننده
4. بارگیری/تخلیه — چند ماده در یک Visit
5. توزین دوم — ترتیب Tare→Gross یا Gross→Tare؛ Quick-weigh با تارای ذخیره + شماره مجوز
6. تیکت — سریال، QR، source method، ایجادکننده/تأییدکننده، **شمارنده چاپ مجدد**
7. مجوز خروج — سریال محلی + **توکن QR یک‌بارمصرف**؛ اسکن دوم رد می‌شود
8. Add-ons — حسابداری/صورت‌حساب، دوربین، چندشعبه

**کنترل‌ها (Controls):** وزن stable/fresh، قفل دستگاه (device identity)، زنجیره audit با HMAC، شمارنده چاپ مجدد، net منفی، تارای غیرعادی (میانه N تارای اخیر)، سفر غیرممکن یک پلاک، خالص‌های تکراری یکسان، نرخ ثبت دستی غیرعادی اپراتور، کار در ساعات غیرمجاز، Fraud Review.

**داشبورد:** ورودی/خروجی امروز (تن)، تیکت معلق، feed زنده، ریسک، تفکیک شعبه/اپراتور. **گزارش:** From/To، مشتری، ماده، نوع عملیات، Daily Close، صورت‌حساب مشتری، CSV/PDF، ایمیل زمان‌بندی‌شده. **پلتفرم:** Cloud per tenant (subdomain + DB مستقل)، backup شبانه، صف محلی quick-weigh آفلاین idempotent، Android/PWA، public QR validation، wallboard.

**نبود در WeighHub (از بقیه می‌آوریم):** ANPR/RFID خودکار، راهبند/چراغ، سنسور موقعیت، LiDAR، سلامت لودسل، KPI ناوگان، API عمومی.

## ۳. ماتریس تجمیعی ویژگی‌ها و منبع

| # | ویژگی | منابع | اولویت ما |
|---|---|---|---|
| 1 | Visit ورود/خروج با زمان سرور | WH, همه | P0 |
| 2 | ANPR با confidence، کادر پلاک، بازبینی | CS, MET, OK, PU, Avery, Precia | P0 |
| 3 | RFID UHF + تطبیق با پلاک (Identity Fusion) | CS, SP, Avery, WeighMAST | P0 |
| 4 | راهبند/چراغ با PLC و fail-safe | CS, MET, OK, WIS, SmarTower | P0 (شبیه‌سازی) |
| 5 | سنسور موقعیت + **موقعیت‌یابی تصویری (ROI)** | MET, OK, SmarTower | P0 |
| 6 | وزن stable + fresh از indicator | WH, همه | P0 |
| 7 | توزین دوگانه قابل معکوس، تارای ذخیره با انقضا | WH, PU, CS | P0 |
| 8 | Visit چندتراکنشی/چندماده، batch | WH, PU, SP | P1 |
| 9 | تیکت با QR/بارکد، نسخه، شمارنده چاپ | WH, PU, CS | P0 |
| 10 | مجوز خروج QR یک‌بارمصرف | WH | P0 |
| 11 | حواله/مجوز حمل با ledger اتمیک سهمیه | WBX, Tally(CS), پیشنهادی | P0 |
| 12 | کسر مجاز → وزن قابل صورت‌حساب | PU | P1 |
| 13 | شواهد دوربین (جلو/عقب/بالا/جانب) + sha256 | CS, SP, WIS, همه | P0 |
| 14 | **اسکن زیر خودرو UVSS** | — (پیشنهادی کاربر) | P1 |
| 15 | LiDAR حجم خالی/پر، 3D، heatmap، بار خارج از مرکز، carryback | LASE, Loadscan, OK | P2 |
| 16 | تابلو فراخوان صف لاین‌ها + LED حیاط | SP, OK | P1 |
| 17 | **مانیتور بزرگ راننده** + کیوسک + صدا | SmarTower, Mettler VSK, پیشنهادی | P1 |
| 18 | **لینک موبایل راننده** (نوبت، وضعیت، تیکت) | — (پیشنهادی کاربر) + اسلات WIS | P1 |
| 19 | **اسکن آنلاین رسید/مجوز/حواله توسط حراست** | WH public QR + پیشنهادی | P0 |
| 20 | زمان‌بندی نوبت/اسلات حمل | WIS | P1 |
| 21 | anti-passback، tailgating، راهبند بدون فرمان، آژیر | ST, OK | P1 |
| 22 | سلامت لودسل (drift/noise/imbalance) — فقط با پشتیبانی سخت‌افزار | MT, Rice Lake | P1 |
| 23 | گواهی کالیبراسیون، انقضا، قفل legal | همه (پیشنهادی) | P0 |
| 24 | چرخه هشدار با SLA، rule builder، تست سایه | SP, WIS | P1 |
| 25 | Audit زنجیره hash، نسخه اصلاحی، ابطال/برگشت | WH, WIS, همه | P0 |
| 26 | آفلاین Edge + idempotency + sync | WH, WBX, همه | P0 (شبیه‌سازی) |
| 27 | داشبورد، wallboard، KPI شیفت | WH, همه | P0 |
| 28 | گزارش‌ها، Daily Close، صورت‌حساب | WH, PU | P0 |
| 29 | ERP outbox، webhook، dead-letter | CS, همه | P1 |
| 30 | Payload لودر/شاول، صف کار لودر، نمایشگر کابین | LOADRITE, OK | P2 |
| 31 | KPI ناوگان (cycle، idle، fuel) با N/A | Wenco, Cat, DISPATCH | P2 |
| 32 | خودروهای داخلی معدن (سه جمع جدا) | ST | P2 |
| 33 | قرنطینه ماده تا تأیید آزمایشگاه | SP | P1 |
| 34 | بانکر و دوزینگ (فقط‌خواندنی) | OK | P2 |
| 35 | انطباق محوری (axle) | WIS, Mettler AxleView | P2 |
| 36 | چندشعبه/چندسایت، tenant | WH, همه | P1 |
| 37 | RBAC، تفکیک وظایف، override دوامضایی | همه | P0 |
| 38 | حالت شب اتاق کنترل، لمس با دستکش | PU, WIS | P1 |

## ۴. الگوهای ظاهری مستند (برای الهام، نه کپی)

- **فرم کلاسیک توزین (CS, PU):** ستون وزن با ارقام درشت (زرد/هفت‌قطعه‌ای)، فیلدهای فروش/خودرو/راننده در وسط، شبکه ۲×۲ دوربین در راست، کنترل Barrier 1/2 و Signal 1/2 در پایین.
- **میز WIS:** پنل تیره، نمایشگر وزن آبی، نشانگر Motion/Tare/Zero، دو جفت چراغ قرمز/سبز، کامیون نقاشی‌شده روی باسکول، دکمه‌های 1st / 2nd / 3rd / Reprint.
- **کنسول Otomatik Kantar:** سه ستون بالا (لاگ سیستم / فید دوربین ورود-خروج-بالای بار / وزن سبز درشت + پلاک + چراغ)، جدول درخواست‌های معلق پایین.
- **TruckFlow:** نوار بالای تیره، جداول «Vehicles on site» و «Recently out»، پنل تجهیزات.
- **تابلو STAIN:** ستون برای هر لاین A–E، ردیف منتظر/نفر بعد/وضعیت سبز-قرمز.
- **MyScanner / LVS:** خلاصه اسکن، خطا/هشدار، روند ۵ روزه، 3D profiler رنگی.
- **DataMaster:** فهرست سایت/دستگاه، جدول هشدار، نمای گرافیکی باسکول/لودسل.
- **Otomatik Kantar موبایل:** پلاک در عنوان، وضعیت سبز، وزن اول آبی/دوم بنفش/خالص سرمه‌ای.

## ۵. اصول غیرقابل مذاکره (از همه اسناد)

1. وزن قانونی فقط از indicator و فقط stable+fresh؛ وزن خام immutable؛ اصلاح = نسخه جدید با دلیل و تأییدکننده.
2. `net = gross − tare` بر اساس نوع عملیات (DISPATCH/RECEIVE) نه ترتیب؛ `abs()` ممنوع؛ net منفی → HOLD.
3. حجم LiDAR، payload لودر و تخمین چگالی همیشه «تخمینی» و جدا از وزن قانونی.
4. داده ناموجود = N/A (هرگز صفر)؛ «زنده» از «آخرین مقدار» متمایز؛ دستگاه آفلاین خاکستری.
5. UI هیچ‌گاه interlock سخت‌افزاری را دور نمی‌زند؛ PASS فقط «درخواست» باز شدن است؛ ACK از PLC ثبت می‌شود؛ قطع شبکه ≠ باز شدن.
6. QR خروج یک‌بارمصرف و مصرف اتمیک؛ مصرف سهمیه مجوز اتمیک.
7. همه زمان‌ها UTC در ذخیره، نمایش شمسی/میلادی با timezone سایت؛ شیفت عبوری از نیمه‌شب.
8. هیچ آستانه عددی بدون تأیید سایت «قطعی» نیست — همه قابل پیکربندی (در دمو مقادیر نمونه با برچسب «نمونه»).
