// The truck journey as numbered stations — one source of truth for the driver portal, the
// driver guide, the owner's process page, the slides and the map.
import { LOADER_STATION, type StationKey } from "./geo";
import type { Operation, Visit } from "./types";

export type StepId = "BOOK" | "GATE_IN" | "QUEUE" | "SCALE_1" | "LOAD" | "LIDAR" | "SCALE_2" | "TICKET" | "EXIT" | "DELIVER";

export interface JourneyStep {
  id: StepId;
  n: number;
  fa: string;
  en: string;
  /** What the driver does here. */
  driverDo: [string, string];
  /** What the driver needs / must watch for. */
  driverNeed: [string, string];
  /** What the system does and checks (owner's view). */
  ownerWhat: [string, string];
  /** Anti-fraud controls 01–10 applied at this step. */
  controls: string[];
  devices: [string, string][];
  role: [string, string];
  output: [string, string];
  place: StationKey | "destination";
  page: string;
}

const s = (x: JourneyStep) => x;

export const JOURNEY_STEPS: JourneyStep[] = [
  s({
    id: "BOOK",
    n: 0,
    fa: "نوبت و مدارک",
    en: "Booking & documents",
    driverDo: ["لینک پیامکی را باز کنید، ساعت ورود (اسلات) را رزرو کنید و مسیر تا معدن را با GPS بروید.", "Open the SMS link, book an arrival slot and navigate to the mine with GPS."],
    driverNeed: ["گواهینامه، بیمه و معاینه فنی معتبر؛ شماره حواله یا بارنامه.", "Valid licence, insurance and inspection; permit or waybill number."],
    ownerWhat: ["حواله و قرارداد از ERP یا ثبت دستی می‌آید، سهمیه رزرو می‌شود و برای راننده لینک و نوبت فرستاده می‌شود.", "Permits and contracts come from ERP or manual entry, quota is reserved and the driver gets a link and a slot."],
    controls: ["10"],
    devices: [["پیامک / پورتال راننده", "SMS / driver portal"]],
    role: ["فروش و حمل", "Sales & logistics"],
    output: ["حواله فعال، نوبت، لینک راننده", "Active permit, slot, driver link"],
    place: "approach",
    page: "/app/permits",
  }),
  s({
    id: "GATE_IN",
    n: 1,
    fa: "دروازه ورود",
    en: "Entry gate",
    driverDo: ["پشت خط توقف بایستید. وقتی چراغ سبز شد آهسته وارد شوید. اگر مانیتور «منتظر بمانید» گفت، پیاده نشوید.", "Stop at the line. Drive in slowly when the light turns green. If the display says “wait”, stay in the cab."],
    driverNeed: ["پلاک تمیز و خوانا، کارت RFID روی شیشه، گواهینامه برای عکس دوربین.", "Clean, readable plate, RFID tag on the windscreen, licence for the document camera."],
    ownerWhat: ["پلاک‌خوان جلو و عقب، RFID، اسکن زیر خودرو و عکس مدارک؛ تصمیم مرحله‌ای ایمنی ← هویت ← مدارک ← حواله. PASS فقط درخواست باز شدن است و PLC تأیید می‌کند.", "Front & rear ANPR, RFID, under-vehicle scan and document photo; step-wise decision safety → identity → documents → permit. PASS only requests the barrier; the PLC confirms."],
    controls: ["03", "05"],
    devices: [["پلاک‌خوان، RFID، UVSS، راهبند، چراغ", "ANPR, RFID, UVSS, barrier, light"]],
    role: ["حراست / نگهبان", "Gate guard"],
    output: ["Visit، عکس‌های hash‌دار، رویداد دروازه", "Visit, hashed photos, gate event"],
    place: "A",
    page: "/app/gate",
  }),
  s({
    id: "QUEUE",
    n: 2,
    fa: "پارکینگ و صف",
    en: "Parking & queue",
    driverDo: ["در پارکینگ انتظار پارک کنید و منتظر فراخوان بمانید (پیامک، تابلو صف یا همین صفحه).", "Park in the waiting area until you are called (SMS, queue board or this page)."],
    driverNeed: ["تلفن روشن؛ جای خود در صف و زمان تقریبی را روی گوشی ببینید.", "Phone on; see your place in the queue and the ETA on your phone."],
    ownerWhat: ["صف هوشمند، تابلو فراخوان، پیامک فراخوان و هشدار ماندگاری طولانی.", "Smart queue, call board, SMS call-up and long-stay alerts."],
    controls: [],
    devices: [["تابلو LED صف", "LED queue board"]],
    role: ["اپراتور باسکول", "Scale operator"],
    output: ["نوبت و زمان انتظار", "Queue position and wait time"],
    place: "parking",
    page: "/app/queue",
  }),
  s({
    id: "SCALE_1",
    n: 3,
    fa: "توزین اول",
    en: "First weighing",
    driverDo: ["آهسته روی باسکول بروید، همه چرخ‌ها داخل خط زرد، توقف کامل، ترمز دستی؛ تا پیام «وزن ثبت شد» پیاده نشوید.", "Drive slowly onto the scale, all wheels inside the yellow lines, full stop, handbrake on; stay in the cab until “weight recorded”."],
    driverNeed: ["به مانیتور بزرگ کنار باسکول نگاه کنید؛ اگر گفت «جلو بروید» موقعیت را اصلاح کنید.", "Watch the big display by the scale; if it says “move forward”, fix your position."],
    ownerWhat: ["وزن فقط از indicator، فقط پایدار و تازه‌تر از ۱۲ ثانیه، و فقط وقتی همه چرخ‌ها روی باسکول‌اند (IR + تصویر). ۴ دوربین با hash.", "Weight only from the indicator, only stable and fresher than 12 s, and only with every wheel on the deck (IR + vision). 4 hashed cameras."],
    controls: ["01", "02", "04", "05"],
    devices: [["Indicator، لودسل، پرتو IR، ۴ دوربین، مانیتور راننده", "Indicator, load cells, IR beams, 4 cameras, driver display"]],
    role: ["اپراتور باسکول", "Scale operator"],
    output: ["تارا (یا ناخالص برای ورودی) + تیکت باز", "Tare (or gross for inbound) + open ticket"],
    place: "B",
    page: "/app/weighing",
  }),
  s({
    id: "LOAD",
    n: 4,
    fa: "بارگیری",
    en: "Loading",
    driverDo: ["به نقطه بارگیری اعلام‌شده بروید، پشت لودر بایستید و بعد از بوق لودر حرکت کنید.", "Go to the announced loading point, stop behind the loader and move off after its horn."],
    driverNeed: ["کلاه ایمنی و جلیقه؛ از محدوده چرخش لودر دور بمانید.", "Helmet and vest; keep clear of the loader's swing area."],
    ownerWhat: ["Payload لودر سطل‌به‌سطل روی نمایشگر کابین (تخمینی)، صف کار لودر.", "Bucket-by-bucket loader payload on the cab display (estimated), loader work queue."],
    controls: [],
    devices: [["سیستم توزین روی بیل لودر", "On-board loader weighing"]],
    role: ["اپراتور لودر", "Loader operator"],
    output: ["Payload تخمینی", "Estimated payload"],
    place: "L-01",
    page: "/app/modules/payload",
  }),
  s({
    id: "LIDAR",
    n: 5,
    fa: "اسکن بار (LiDAR)",
    en: "Load scan (LiDAR)",
    driverDo: ["با سرعت کمتر از ۱۰ کیلومتر از زیر دروازه اسکنر رد شوید؛ روکش بار را ببندید.", "Pass under the scanner gantry below 10 km/h; fasten the tarp."],
    driverNeed: ["بار بیرون‌زده یا خارج از مرکز را اصلاح کنید.", "Fix any overhanging or off-centre load."],
    ownerWhat: ["ابر نقاط سه‌بعدی، حجم، بار خارج از مرکز و روکش؛ حجم×چگالی با وزن مقایسه می‌شود. همه «تخمینی».", "3D point cloud, volume, off-centre load and tarp; volume×density is compared with the weight. All “estimated”."],
    controls: [],
    devices: [["گنتری LiDAR", "LiDAR gantry"]],
    role: ["سامانه (خودکار)", "System (automatic)"],
    output: ["حجم و جرم تخمینی", "Volume and estimated mass"],
    place: "D",
    page: "/app/scan?tab=lidar",
  }),
  s({
    id: "SCALE_2",
    n: 6,
    fa: "توزین دوم",
    en: "Second weighing",
    driverDo: ["مثل توزین اول: آهسته، توقف کامل، ترمز دستی، تا پیام مانیتور صبر کنید.", "Same as the first weighing: slowly, full stop, handbrake, wait for the display."],
    driverNeed: ["اگر اضافه‌بار بود، مانیتور می‌گوید کجا بار را کم کنید.", "If overloaded, the display tells you where to unload the excess."],
    ownerWhat: ["ناخالص؛ خالص = ناخالص − تارا (بدون قدر مطلق). کنترل اضافه‌بار، مانده حواله، تارای غیرعادی و QC. استثنا فقط با دو امضا.", "Gross; net = gross − tare (never abs). Overload, permit balance, tare outlier and QC checks. Exceptions need two signatures."],
    controls: ["01", "04", "09", "10"],
    devices: [["Indicator، لودسل، ۴ دوربین", "Indicator, load cells, 4 cameras"]],
    role: ["اپراتور + سرپرست برای استثنا", "Operator + supervisor for exceptions"],
    output: ["خالص، کسر مجاز، وزن قابل محاسبه", "Net, deduction, billable weight"],
    place: "C",
    page: "/app/weighing",
  }),
  s({
    id: "TICKET",
    n: 7,
    fa: "رسید توزین",
    en: "Weighing receipt",
    driverDo: ["رسید با QR روی گوشی شما می‌آید (پیامک/واتس‌اپ). در صورت نیاز از کیوسک چاپ کنید.", "The receipt with a QR arrives on your phone (SMS/WhatsApp). Print it at the kiosk if needed."],
    driverNeed: ["رسید را تا تحویل بار نگه دارید.", "Keep the receipt until delivery."],
    ownerWhat: ["تیکت با سریال یکتا، QR راستی‌آزمایی، نسخه‌گذاری و شمارنده چاپ؛ سهمیه حواله به‌صورت اتمیک مصرف و برای ERP ارسال می‌شود.", "Ticket with unique serial, verification QR, versioning and reprint counter; permit quota is committed atomically and sent to ERP."],
    controls: ["08"],
    devices: [["کیوسک، چاپگر حرارتی", "Kiosk, thermal printer"]],
    role: ["اپراتور باسکول", "Scale operator"],
    output: ["تیکت تأییدشده، رکورد ERP", "Approved ticket, ERP record"],
    place: "C",
    page: "/app/transactions",
  }),
  s({
    id: "EXIT",
    n: 8,
    fa: "خروج با QR",
    en: "Exit with QR",
    driverDo: ["QR مجوز خروج را روی گوشی به نگهبان نشان دهید. بعد از سبز شدن چراغ خارج شوید.", "Show the exit-permit QR on your phone to the guard. Leave when the light turns green."],
    driverNeed: ["QR فقط یک بار معتبر است؛ آن را برای کسی نفرستید.", "The QR works only once; don't forward it."],
    ownerWhat: ["توکن یک‌بارمصرف با مصرف اتمیک؛ اسکن دوم رد و هشدار امنیتی. تصمیم خروج: تیکت تأییدشده، مجوز، شواهد، هشدار باز.", "One-time token, atomic consumption; a second scan is rejected with a security alert. Exit decision: approved ticket, permit, evidence, open alerts."],
    controls: ["06", "07"],
    devices: [["گوشی حراست، پلاک‌خوان، راهبند", "Guard phone, ANPR, barrier"]],
    role: ["حراست", "Security"],
    output: ["مجوز مصرف‌شده، رویداد خروج", "Consumed permit, exit event"],
    place: "E",
    page: "/app/guard",
  }),
  s({
    id: "DELIVER",
    n: 9,
    fa: "حمل و تحویل",
    en: "Haul & delivery",
    driverDo: ["با GPS تا مقصد بروید. توقف غیرمجاز، سرعت بالا و انحراف مسیر ثبت می‌شود. رسید را به تحویل‌گیرنده نشان دهید.", "Navigate to the destination with GPS. Unscheduled stops, speeding and route deviation are logged. Show the receipt to the receiver."],
    driverNeed: ["تحویل‌گیرنده QR رسید را برای راستی‌آزمایی اسکن می‌کند.", "The receiver scans the receipt QR to verify it."],
    ownerWhat: ["ردیابی در جاده روی نقشه، رویدادهای سرعت/توقف/انحراف، تأیید تحویل و صورت‌حساب مشتری.", "Road tracking on the map, speeding/stop/deviation events, proof of delivery and customer billing."],
    controls: [],
    devices: [["GPS گوشی راننده / ردیاب", "Driver phone GPS / tracker"]],
    role: ["مدیر ناوگان، مالی", "Fleet manager, finance"],
    output: ["تحویل، صورت‌حساب", "Delivery, invoice"],
    place: "destination",
    page: "/app/map",
  }),
];

/** Wording that changes for inbound (purchase) deliveries. */
export function stepTitle(step: JourneyStep, op: Operation | undefined, locale: "fa" | "en") {
  if (op === "RECEIVE") {
    if (step.id === "LOAD") return locale === "fa" ? "تخلیه" : "Unloading";
    if (step.id === "DELIVER") return locale === "fa" ? "بازگشت خالی" : "Empty return";
  }
  return locale === "fa" ? step.fa : step.en;
}

/** Where the driver has to be for this step. */
export function stepStation(step: JourneyStep, visit?: Pick<Visit, "operation" | "loadingEquipmentId">): StationKey | "destination" {
  if (step.id === "LOAD") return visit?.operation === "RECEIVE" ? "unload" : LOADER_STATION[visit?.loadingEquipmentId ?? ""] ?? "L-01";
  return step.place;
}

/**
 * Index of the current step for a visit. `firstWeighed` tells an IN_SITE truck that is waiting
 * for its second weighing apart from one that has just entered.
 */
export function journeyIndex(v: Pick<Visit, "state" | "prevState">, ctx: { firstWeighed?: boolean; hasTicket?: boolean } = {}): number {
  const st = v.state === "HOLD" ? v.prevState : v.state;
  switch (st) {
    case "EXPECTED":
    case "CANCELLED":
      return 0;
    case "ARRIVED":
    case "IDENTIFIED":
    case "REJECTED":
    case undefined:
      return v.state === "HOLD" && ctx.firstWeighed ? 6 : 1;
    case "IN_SITE":
      return v.prevState === "LOADING" || ctx.firstWeighed ? 6 : 2;
    case "ON_SCALE_1":
      return 3;
    case "LOADING":
      return 4;
    case "ON_SCALE_2":
      return ctx.hasTicket ? 7 : 6;
    case "READY_TO_EXIT":
      return 8;
    case "EXITED":
      return 9;
    case "HOLD":
      return 1;
  }
  return 1;
}
