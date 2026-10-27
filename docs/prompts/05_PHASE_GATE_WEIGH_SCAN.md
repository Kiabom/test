# فاز ۰۵ — دروازه، ایستگاه توزین، مرکز اسکن، کاتالوگ سخت‌افزار

> مرجع: `spec/SCREENS.md` (۳، ۴، ۵، ۲۴)، `spec/HARDWARE_MOCKUPS.md`، `spec/ALERT_RULES.md` §۱–۲.

## کار
1. **SVG سخت‌افزار** (`components/hardware/`): `GatePortalSvg` (دکل با ANPR جلو/عقب، نما، آنتن RFID با موج، UVSS کف، راهبند، چراغ — نقاط فعال چشمک‌زن)، `LidarGantrySvg` (سازه با مخروط اسکن)، `UvssUnitSvg`، `IndicatorSvg` (نمایشگر قرمز)، `KioskSvg`، `LedDisplaySvg`، `PrinterSvg`، `RfidReaderSvg`، `PlcSvg`، `EdgeGatewaySvg`، `IntercomSvg`، `SirenSvg`.
2. `IdentityFusionCard`، `GateDecisionTrace`، `VisitTimeline`، `EvidenceGallery` (ثامبنیل‌های CameraFeed با sha256 کوتاه و بزرگ‌نمایی).
3. `/app/gate`: تب ورود/خروج؛ انتخاب Visit فعال لاین (از شبیه‌ساز) یا جست‌وجو؛ چیدمان SCREENS §۳؛ کنش‌ها `gate.decide` (تأیید/رد با دلیل)، `gate.registerGuest`، اصلاح پلاک با دلیل (PlateRead اصلی تغییر نمی‌کند)؛ وضعیت راهبند با ACK؛ «داخل سایت اکنون».
4. `/app/weighing`: انتخاب باسکول؛ چیدمان SCREENS §۴؛ وزن زنده بزرگ + نمودار ۶۰ ثانیه؛ `ScaleDeckTop` زنده؛ دکمه‌های capture با `captureGuard` و نمایش دلیل غیرفعال بودن؛ میان‌بر F5؛ وزن دستی با دیالوگ دو امضا؛ quick-weigh؛ EXTRA؛ کسر مجاز؛ نهایی‌سازی (ارزیابی قوانین، commit حواله)؛ پیش‌نمایش تیکت؛ «صدور مجوز خروج». Toggle «نمای کلاسیک» (فرم یک‌صفحه‌ای با وزن هفت‌قطعه‌ای زرد، ۲×۲ دوربین، Barrier/Signal 1/2، دکمه‌های 1st/2nd/3rd/Reprint).
5. `/app/scan` با ۵ تب طبق SCREENS §۵:
   - دروازه: `GatePortalSvg` + فیدها + نتایج OCR + شمارش محور.
   - بالای بار: `PointCloudViewer` با three/R3F — تولید point cloud قطعی از seed (کف کمپرسی + کپه بار با نویز)؛ رنگ بر اساس ارتفاع؛ toggle خالی/پر/اختلاف؛ heatmap دوبعدی؛ معیارها (حجم، کیفیت، خارج از مرکز، قله، carryback، روکش) و جرم تخمینی با برچسب «تخمینی» و مقایسه با وزن باسکول.
   - زیر خودرو: `UvssImage` — تصویر SVG بلند شاسی (قاب، محورها، چرخ‌ها، گاردان، مخزن، اگزوز) + تصویر مرجع + اسلایدر مقایسه + کادرهای ناهنجاری با score؛ دکمه «تأیید سالم» / «ارجاع به حراست» (هشدار R35).
   - موقعیت روی باسکول: CameraFeed بالا با ROI + وضعیت پرتوها + تاریخچه.
   - تاریخچه اسکن‌ها.
6. `/app/hardware`: کاتالوگ همه تجهیزات HARDWARE_MOCKUPS §۲ با SVG، محل نصب، داده خروجی، وضعیت زنده از store.

## پذیرش
- سناریو S-NORMAL در حالت دستی از دروازه تا نهایی‌سازی وزن دوم با UI قابل انجام است.
- S-POSITION دکمه capture را با دلیل غیرفعال می‌کند؛ S-UVSS در تب زیر خودرو ناهنجاری نشان می‌دهد.
- commit: `feat(web): gate, weighing station, scan center, hardware catalog`.
