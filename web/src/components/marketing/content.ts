import { Box, ClipboardCheck, DoorOpen, FileText, ListOrdered, Receipt, Scale, type LucideIcon } from "lucide-react";

export interface Stop {
  n: number;
  icon: LucideIcon;
  fa: string;
  en: string;
  dfa: string;
  den: string;
  bullets: [string, string][];
  href: string;
}

export const STOPS: Stop[] = [
  { n: 0, icon: FileText, fa: "پیش‌ثبت و نوبت", en: "Pre-registration & booking", dfa: "حواله، قرارداد و سهمیه از ERP یا ثبت دستی؛ رزرو اسلات زمانی و ارسال لینک به گوشی راننده.", den: "Permits, contracts and quotas from ERP or manual entry; slot booking and a link sent to the driver's phone.", bullets: [["حواله فروش/خرید/حمل با سهمیه اتمیک", "Sales/purchase/haul permits with atomic quota"], ["رزرو اسلات و ETA", "Slot booking and ETA"], ["لینک پیامکی راننده", "Driver SMS link"]], href: "/app/permits" },
  { n: 1, icon: DoorOpen, fa: "دروازه ورود", en: "Entry gate", dfa: "پلاک‌خوان جلو و عقب، RFID UHF، اسکن زیر خودرو و عکس مدارک راننده؛ تصمیم مرحله‌ای و باز شدن راهبند با تأیید PLC.", den: "Front & rear ANPR, UHF RFID, under-vehicle scan and driver document photo; step-wise decision and PLC-confirmed barrier.", bullets: [["Identity Fusion: پلاک + RFID", "Identity fusion: plate + RFID"], ["anti-passback و tailgating", "Anti-passback & tailgating"], ["ثبت مهمان برای خودرو ناشناس", "Guest registration for unknown vehicles"]], href: "/app/gate" },
  { n: 2, icon: ListOrdered, fa: "صف و داخل سایت", en: "Queue & on-site", dfa: "تابلو فراخوان، فراخوان پیامکی، مدت اقامت هر خودرو و هشدار ماندگاری طولانی.", den: "Call board, SMS call-up, dwell time per truck and long-stay alerts.", bullets: [["تابلو LED فراخوان لاین‌ها", "LED lane call board"], ["Inside-now با مدت اقامت", "Inside-now with dwell time"], ["مانیتور بزرگ راننده", "Big driver display"]], href: "/app/queue" },
  { n: 3, icon: Scale, fa: "توزین اول", en: "First weighing", dfa: "وزن فقط از indicator، فقط پایدار و تازه، و فقط وقتی همه چرخ‌ها روی باسکول‌اند (IR + بینایی ماشین).", den: "Weight only from the indicator, only stable & fresh, and only when every wheel is on the deck (IR + machine vision).", bullets: [["STABLE / FRESH < 12s", "STABLE / FRESH < 12 s"], ["ROI تصویری موقعیت", "Vision ROI positioning"], ["۴ دوربین شواهد با hash", "4 evidence cameras with hash"]], href: "/app/weighing" },
  { n: 4, icon: Box, fa: "بارگیری و اسکن LiDAR", en: "Loading & LiDAR scan", dfa: "Payload لودر سطل‌به‌سطل، اسکن سه‌بعدی بالای بار، حجم، بار خارج از مرکز و روکش — همه با برچسب «تخمینی».", den: "Bucket-by-bucket loader payload, 3D overhead scan, volume, off-centre load and tarp check — all labelled “estimated”.", bullets: [["ابر نقاط سه‌بعدی", "3D point cloud"], ["نقشه ارتفاع بار", "Load height map"], ["مقایسه حجم با وزن", "Volume vs weight check"]], href: "/app/scan?tab=lidar" },
  { n: 5, icon: Scale, fa: "توزین دوم", en: "Second weighing", dfa: "ناخالص و تارا بر اساس نوع عملیات، کسر مجاز، کنترل اضافه‌بار، سهمیه حواله و تارای غیرعادی.", den: "Gross/tare by operation type, authorised deduction, overweight, permit quota and tare-outlier checks.", bullets: [["Tare→Gross یا Gross→Tare", "Tare→Gross or Gross→Tare"], ["توزین سریع با تارای ذخیره", "Quick weigh with stored tare"], ["تأیید استثنا با دو امضا", "Two-signature exception approval"]], href: "/app/weighing" },
  { n: 6, icon: Receipt, fa: "تیکت و رسید", en: "Ticket & receipt", dfa: "سریال یکتا، QR راستی‌آزمایی، بارکد، شمارنده چاپ مجدد، نسخه‌گذاری و ارسال با پیامک/واتس‌اپ.", den: "Unique serial, verification QR, barcode, reprint counter, versioning and SMS/WhatsApp delivery.", bullets: [["قالب A5 / حرارتی", "A5 / thermal templates"], ["عکس روی رسید", "Photos on the receipt"], ["ابطال فقط با سند اصلاح", "Void only via correction"]], href: "/app/transactions" },
  { n: 7, icon: ClipboardCheck, fa: "مجوز خروج QR", en: "QR exit permit", dfa: "توکن یک‌بارمصرف روی گوشی راننده؛ حراست با دوربین گوشی اسکن می‌کند؛ اسکن دوم رد و هشدار امنیتی.", den: "One-time token on the driver's phone; guards scan with a phone camera; a second scan is rejected with a security alert.", bullets: [["اسکن آنلاین حراست", "Online guard scan"], ["مصرف اتمیک", "Atomic consumption"], ["راستی‌آزمایی عمومی", "Public verification"]], href: "/app/guard" },
];

export const CONTROLS: { n: string; fa: string; en: string; dfa: string; den: string }[] = [
  { n: "01", fa: "فقط وزن پایدار و تازه", en: "Stable & fresh weight only", dfa: "ثبت وزن ناپایدار یا قدیمی‌تر از ۱۲ ثانیه ممکن نیست.", den: "Unstable or older-than-12 s readings can't be captured." },
  { n: "02", fa: "هویت دستگاه و قفل باسکول", en: "Device identity & scale lock", dfa: "هر indicator هویت مستقل دارد؛ گواهی منقضی = قفل توزین تجاری.", den: "Each indicator has its own identity; expired certificate = legal weighing lock." },
  { n: "03", fa: "دو منبع هویت", en: "Two identity sources", dfa: "پلاک‌خوان و RFID باید یکی باشند؛ مغایرت = توقف.", den: "ANPR and RFID must agree; mismatch = hold." },
  { n: "04", fa: "همه چرخ‌ها روی باسکول", en: "All wheels on the deck", dfa: "پرتوهای IR + ماسک ROI دوربین بالا؛ یک چرخ بیرون = بدون ثبت.", den: "IR beams + overhead ROI mask; one wheel off = no capture." },
  { n: "05", fa: "شواهد تصویری با hash", en: "Hashed photo evidence", dfa: "جلو، عقب، بالا، جانب و زیر خودرو با SHA-256.", den: "Front, rear, top, side and under-vehicle with SHA-256." },
  { n: "06", fa: "QR خروج یک‌بارمصرف", en: "One-time exit QR", dfa: "توکن غیرقابل حدس، مصرف اتمیک، اسکن دوم = هشدار.", den: "Unguessable token, atomic consume, second scan = alert." },
  { n: "07", fa: "زنجیره audit با HMAC", en: "HMAC audit chain", dfa: "هر تغییر به رکورد قبلی زنجیر می‌شود؛ دستکاری فوراً کشف می‌شود.", den: "Every change is chained to the previous one; tampering is detected instantly." },
  { n: "08", fa: "نسخه و شمارنده چاپ", en: "Versions & reprint counter", dfa: "هیچ چیز حذف نمی‌شود؛ چاپ مجدد با دلیل و شماره.", den: "Nothing is deleted; reprints need a reason and are numbered." },
  { n: "09", fa: "الگوهای آماری تقلب", en: "Statistical fraud patterns", dfa: "تارای غیرعادی، خالص تکراری، سفر غیرممکن، ثبت دستی زیاد.", den: "Tare outliers, repeated nets, impossible trips, high manual rate." },
  { n: "10", fa: "قفل حواله و سهمیه", en: "Permit & quota lock", dfa: "مصرف اتمیک سهمیه؛ اضافه‌برداشت یا انقضا = توقف خروج.", den: "Atomic quota consumption; overdraw or expiry = exit hold." },
];

export const PLANS = [
  { id: "basic", fa: "پایه", en: "Basic", price: ["تماس بگیرید", "Contact us"], features: [["دروازه دستی + ثبت Visit", "Manual gate + visit log"], ["توزین دوگانه و تیکت QR", "Two-pass weighing & QR ticket"], ["اتصال indicator (RS-232/TCP)", "Indicator link (RS-232/TCP)"], ["گزارش روزانه و CSV/PDF", "Daily report & CSV/PDF"], ["۱ باسکول", "1 scale"]] },
  { id: "pro", fa: "حرفه‌ای", en: "Professional", price: ["تماس بگیرید", "Contact us"], featured: true, features: [["همه موارد پایه", "Everything in Basic"], ["ANPR + RFID + راهبند/چراغ", "ANPR + RFID + barrier/light"], ["مجوز خروج QR + اسکن حراست", "QR exit permit + guard scan"], ["پورتال راننده + مانیتور + کیوسک", "Driver portal + display + kiosk"], ["حواله و سهمیه، کنترل‌های ضدتقلب", "Permits & quotas, anti-fraud controls"], ["تا ۴ باسکول", "Up to 4 scales"]] },
  { id: "ent", fa: "سازمانی", en: "Enterprise", price: ["تماس بگیرید", "Contact us"], features: [["همه موارد حرفه‌ای", "Everything in Professional"], ["چندشعبه و تجمیع ستادی", "Multi-site & HQ roll-up"], ["LiDAR، UVSS و Payload لودر", "LiDAR, UVSS & loader payload"], ["سلامت لودسل و کالیبراسیون", "Load-cell health & calibration"], ["ERP outbox، API و webhook", "ERP outbox, API & webhooks"], ["KPI ناوگان و SLA", "Fleet KPIs & SLA"]] },
];

export const FAQ: [string, string, string, string][] = [
  ["آیا حجم LiDAR جایگزین وزن باسکول می‌شود؟", "Does LiDAR volume replace the scale weight?", "خیر. حجم و جرم تخمینی فقط برای کنترل کیفیت و مغایرت‌یابی است؛ وزن قانونی فقط از indicator کالیبره ثبت می‌شود.", "No. Volume and estimated mass are only for QC and reconciliation; the legal weight always comes from a calibrated indicator."],
  ["اگر اینترنت قطع شود چه می‌شود؟", "What if the internet goes down?", "Edge محلی ادامه می‌دهد، رویدادها را در صف ماندگار نگه می‌دارد و پس از اتصال بدون تکرار همگام می‌کند. راهبند هرگز به‌خاطر قطع شبکه باز نمی‌شود.", "The local edge keeps working, queues events durably and syncs them without duplicates later. Barriers never open because of a network failure."],
  ["آیا نرم‌افزار می‌تواند راهبند را بدون PLC باز کند؟", "Can the software open the barrier without the PLC?", "خیر. نرم‌افزار فقط درخواست می‌دهد؛ interlock سخت‌افزاری PLC تصمیم نهایی را می‌گیرد و ACK ثبت می‌شود.", "No. The software only requests; the PLC hardware interlock decides and its ACK is recorded."],
  ["راننده چطور وضعیت سفر را می‌بیند؟", "How does the driver see trip status?", "با لینک پیامکی روی گوشی، مانیتور بزرگ کنار باسکول و کیوسک لمسی — هر سه پیام یکسان نشان می‌دهند.", "Through an SMS link on the phone, the big display by the scale and the touch kiosk — all three show the same instruction."],
];
