# Design System — «توزین‌نگار» (TozinNegar)

> هویت بصری اختصاصی ما. از رنگ، لوگو، آیکون و متن WeighHub یا هیچ رقیبی کپی نمی‌شود؛ فقط **الگوی تعامل** الهام گرفته شده.

## ۱. اصول
1. **دو سطح UX:** (الف) اپراتوری — فشرده، کیبوردمحور، first-person، دکمه‌های بزرگ لمسی (قابل استفاده با دستکش، حداقل 44px)؛ (ب) مدیریتی — تحلیلی، نموداری، ریسپانسیو.
2. **رنگ هرگز تنها حامل وضعیت نیست:** همیشه متن + آیکون (✓ ⚠ ⛔ ⏸).
3. **وزن و پلاک LTR** درون صفحه RTL، با ارقام tabular (`font-variant-numeric: tabular-nums`).
4. **زنده ≠ پذیرفته‌شده:** وزن زنده با قاب خط‌چین و برچسب «زنده»، وزن ثبت‌شده با قاب توپر و آیکون قفل.
5. **N/A ≠ 0:** داده ناموجود با «—» و tooltip «داده موجود نیست». دستگاه آفلاین = خاکستری + «آخرین مقدار: ۲ دقیقه پیش».
6. **فریم دوربین کهنه** هرگز زنده جلوه نکند: نشان «CAMERA OFFLINE / آخرین فریم ۱۴:۰۲:۱۱».
7. کنترل‌های حساس (Override، باز کردن دستی راهبند، ابطال) → دیالوگ تأیید + دلیل اجباری (+ امضای دوم برای موارد بحرانی).

## ۲. توکن‌ها (CSS variables در `globals.css`)

| توکن | روشن | تیره (اتاق کنترل / شب) | کاربرد |
|---|---|---|---|
| `--bg` | `#F5F7FA` | `#0B1220` | پس‌زمینه صفحه |
| `--surface` | `#FFFFFF` | `#162236` | کارت/پنل |
| `--surface-2` | `#EEF2F7` | `#1C2B42` | پنل فرعی، هدر جدول |
| `--border` | `#DFE6EC` | `#26364F` | خطوط |
| `--text` | `#172B3A` | `#F4F7FA` | متن اصلی |
| `--muted` | `#64748B` | `#94A3B8` | متن ثانویه |
| `--shell` | `#102A43` | `#070D18` | سایدبار و هدر سایت |
| `--primary` | `#1273A6` | `#2D91B8` | کنش اصلی، لینک |
| `--primary-fg` | `#FFFFFF` | `#FFFFFF` | |
| `--success` | `#168567` | `#30B58C` | مجاز، پایدار، PASS |
| `--warning` | `#B7791F` | `#F1B54B` | بازبینی، انتظار، REVIEW |
| `--danger` | `#B42335` | `#EA6065` | مسدود، HOLD، BLOCK |
| `--info` | `#2563EB` | `#60A5FA` | اطلاع |
| `--offline` | `#94A3B8` | `#475569` | دستگاه آفلاین / نامشخص |
| `--led-bg` | `#050505` | `#050505` | مانیتور LED راننده |
| `--led-amber` | `#FFB000` | `#FFB000` | متن LED |
| `--led-green` | `#22FF88` | `#22FF88` | |
| `--led-red` | `#FF3B3B` | `#FF3B3B` | |
| `--weight-first` | `#2563EB` | | وزن اول (الهام نمای موبایل) |
| `--weight-second` | `#7C3AED` | | وزن دوم |
| `--weight-net` | `#102A43` | | وزن خالص |

شعاع: `--radius: 12px` (کارت)، `8px` (کنترل). سایه: نرم و کم (`0 1px 2px rgb(16 42 67 / .06), 0 4px 12px rgb(16 42 67 / .04)`). فاصله‌گذاری: سیستم 4/8px.

## ۳. تایپوگرافی
- فونت: **Vazirmatn Variable** (`@fontsource-variable/vazirmatn`) برای فارسی و لاتین؛ اعداد وزن: `font-mono` با `JetBrains Mono` اختیاری یا `ui-monospace`.
- مقیاس: 12 / 14 (بدنه) / 16 / 20 / 24 / 32 / 48 / 96 (وزن زنده) / 160+ (مانیتور راننده).
- اعداد: در زبان فارسی ارقام فارسی (Intl `fa-IR`)، با گزینه «ارقام لاتین» در تنظیمات. وزن‌ها همیشه با واحد (`kg` یا `t`).

## ۴. چیدمان
- **Shell اپ:** سایدبار راست (RTL) 256px قابل جمع شدن به 72px، گروه‌بندی: «عملیات» (داشبورد، اتاق کنترل، دروازه، توزین، مرکز اسکن، صف)، «اسناد» (تراکنش‌ها، مجوز خروج، اسکن حراست، حواله‌ها)، «کنترل» (هشدارها، بازبینی تقلب، audit)، «تولید» (LiDAR، Payload، ناوگان)، «نگهداری» (تجهیزات و سلامت، کالیبراسیون، کاتالوگ سخت‌افزار، نقشه سایت)، «مدیریت» (گزارش، صورت‌حساب، اطلاعات پایه، یکپارچه‌سازی، اعلان‌ها، مدیریت، شبیه‌ساز).
- **Topbar:** انتخاب سایت/شعبه، شیفت جاری (با زمان باقی‌مانده)، جست‌وجوی سراسری پلاک/تیکت، وضعیت اتصال (Online / Offline + عمق صف sync)، زنگ هشدار با شمارنده، سوییچ زبان fa/en، سوییچ تم روشن/تیره، کاربر و نقش.
- **موبایل:** تک‌ستونه، bottom navigation (دروازه / اسکن / هشدار / بیشتر)، کنش اصلی ثابت پایین. **هیچ فرمان راهبند از موبایل بدون RBAC+تأیید.**
- **صفحات نمایشگر** (`/display/*`, `/wallboard`, `/kiosk/*`): تمام‌صفحه، بدون shell، تم تیره، قابل خواندن از ۱۵ متری.

## ۵. کامپوننت‌های پایه (`src/components/ui`)
Button (primary/secondary/ghost/danger, size sm/md/lg/xl) · Card (+Header/Title/Body) · Badge/StatusPill (pass/review/hold/block/offline/info) · KPI Tile (عدد، واحد، روند، sparkline، `lastUpdatedAt`) · Tabs · Table (sticky header، ردیف قابل کلیک، نشان raw/estimated/manual) · Dialog/ConfirmDialog (دلیل اجباری) · Drawer · Tooltip · EmptyState · Skeleton · Toast · SegmentedControl · Switch · Select · Input · DateRange.

## ۶. کامپوننت‌های دامنه (`src/components/domain`)
- `IranPlate` — پلاک ایرانی SVG (نوار آبی پرچم + «I.R. IRAN»، دو رقم، حرف، سه رقم، کادر «ایران» + کد استان)؛ اندازه sm/md/lg؛ حالت «خوانده‌شده با confidence».
- `WeightDisplay` — نمایش وزن (حالت هفت‌قطعه‌ای/LED یا مدرن)، نشانگرهای STABLE / MOTION / ZERO / FRESH، سن خوانش، واحد.
- `TrafficLight` — قرمز/زرد/سبز عمودی یا افقی.
- `BarrierIcon` — راهبند باز/بسته/در حال حرکت/خطا با ACK.
- `CameraFeed` — صحنه SVG + نویز + اسکن‌لاین + timestamp + نام دوربین + کادر تشخیص + REC ●، حالت offline.
- `TruckSvg` — کامیون (side/top/front/rear/under، empty/loaded، رنگ قابل تنظیم).
- `ScaleDeckTop` — نمای بالای باسکول با zoneهای چرخ، سنسورهای IR جلو/عقب، ماسک ROI سبز/قرمز.
- `IdentityFusionCard` — ANPR (پلاک + confidence + برش تصویر) + RFID (EPC + RSSI) + نتیجه تطبیق.
- `GateDecisionTrace` — نمایش مرحله‌به‌مرحله Safety→Identity→Permit→Scale→Alerts→نتیجه.
- `VisitTimeline` — ورود → وزن ۱ → بارگیری → وزن ۲ → تیکت → خروج با زمان و مدت هر مرحله.
- `EvidenceGallery` — تصاویر با برچسب دوربین، زمان، sha256 کوتاه.
- `TicketView` — قالب A5/حرارتی با QR + بارکد + عکس.
- `QrScanner` — دوربین گوشی (@zxing/browser) + ورود دستی کد.
- `PointCloudViewer` — three.js، رنگ بر اساس ارتفاع، مقایسه خالی/پر.
- `UvssImage` — تصویر شاسی line-scan با کادر ناهنجاری و مقایسه با مرجع.
- `LedBoard` — متن LED (فونت dot-matrix با CSS).

## ۷. وضعیت‌ها و برچسب‌ها
| وضعیت | رنگ | آیکون | متن fa | متن en |
|---|---|---|---|---|
| PASS | success | CheckCircle | مجاز | Pass |
| REVIEW | warning | AlertTriangle | نیاز به بازبینی | Review |
| HOLD | danger | PauseCircle | توقف | Hold |
| BLOCK | danger | Ban | مسدود | Blocked |
| OFFLINE | offline | WifiOff | آفلاین | Offline |
| UNKNOWN | offline | HelpCircle | نامشخص | Unknown |
| ESTIMATED | info | Sigma | تخمینی | Estimated |
| MANUAL | warning | Hand | دستی | Manual |

## ۸. دسترس‌پذیری
کنتراست AA، focus ring واضح (`outline: 2px solid var(--primary)`)، همه کنش‌ها با کیبورد، میان‌بر F5 = Capture در ایستگاه توزین، Esc = بستن دیالوگ، `aria-live="polite"` برای تغییر وزن/وضعیت، `prefers-reduced-motion`.
