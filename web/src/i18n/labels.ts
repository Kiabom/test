import type { Locale } from "@/lib/prefs";

type Dict = Record<string, [string, string]>;

export const VISIT_STATE: Dict = {
  EXPECTED: ["رزرو شده", "Expected"],
  ARRIVED: ["رسیده به دروازه", "At gate"],
  IDENTIFIED: ["شناسایی شده", "Identified"],
  IN_SITE: ["داخل سایت / صف", "In site / queue"],
  ON_SCALE_1: ["روی باسکول (وزن اول)", "On scale (1st)"],
  LOADING: ["بارگیری / تخلیه", "Loading / unloading"],
  ON_SCALE_2: ["روی باسکول (وزن دوم)", "On scale (2nd)"],
  READY_TO_EXIT: ["آماده خروج", "Ready to exit"],
  EXITED: ["خارج شده", "Exited"],
  HOLD: ["متوقف", "On hold"],
  REJECTED: ["رد شده", "Rejected"],
  CANCELLED: ["لغو شده", "Cancelled"],
};

export const TX_STATE: Dict = {
  DRAFT: ["پیش‌نویس", "Draft"],
  FIRST_CAPTURED: ["وزن اول ثبت شد", "1st captured"],
  SECOND_CAPTURED: ["وزن دوم ثبت شد", "2nd captured"],
  RECONCILED: ["آماده تأیید", "Reconciled"],
  APPROVED: ["تأیید شده", "Approved"],
  EXCEPTION: ["استثنا", "Exception"],
  VOIDED: ["ابطال شده", "Voided"],
};

export const DECISION: Dict = {
  PASS: ["مجاز", "Pass"],
  REVIEW: ["نیاز به بازبینی", "Review"],
  HOLD: ["توقف", "Hold"],
  BLOCK: ["مسدود", "Blocked"],
};

export const DECISION_CODE: Dict = {
  OK: ["همه کنترل‌ها موفق", "All checks passed"],
  EMERGENCY_STOP: ["توقف اضطراری", "Emergency stop"],
  INTERLOCK_FAULT: ["خطای interlock", "Interlock fault"],
  LANE_NOT_CLEAR: ["لاین خالی نیست", "Lane not clear"],
  IDENTITY_MISMATCH: ["مغایرت پلاک و RFID", "Plate / RFID mismatch"],
  UNKNOWN_VEHICLE: ["خودرو ناشناس", "Unknown vehicle"],
  LOW_ANPR_CONFIDENCE: ["اطمینان پایین پلاک‌خوان", "Low ANPR confidence"],
  BLACKLIST: ["خودرو/راننده مسدود", "Blacklisted"],
  ANTI_PASSBACK: ["ورود مجدد بدون خروج", "Anti-passback"],
  DOCUMENT_EXPIRED: ["مدارک منقضی", "Documents expired"],
  PERMIT_MISSING: ["حواله ندارد", "No permit"],
  PERMIT_NOT_ACTIVE: ["حواله غیرفعال", "Permit not active"],
  PERMIT_NOT_STARTED: ["حواله هنوز شروع نشده", "Permit not started"],
  PERMIT_EXPIRED: ["حواله منقضی", "Permit expired"],
  PERMIT_UNKNOWN: ["وضعیت حواله نامشخص", "Permit unknown"],
  VEHICLE_NOT_ALLOWED: ["خودرو در حواله مجاز نیست", "Vehicle not allowed"],
  MATERIAL_MISMATCH: ["مغایرت ماده", "Material mismatch"],
  QUOTA_EXHAUSTED: ["سهمیه تمام شده", "Quota exhausted"],
  TRIPS_EXHAUSTED: ["سقف سفر تمام شده", "Trips exhausted"],
  TX_NOT_APPROVED: ["تراکنش تأیید نشده", "Transaction not approved"],
  NO_EXIT_PERMIT: ["مجوز خروج ندارد", "No exit permit"],
  EVIDENCE_INCOMPLETE: ["شواهد ناقص", "Evidence incomplete"],
  UVSS_SUSPECT: ["ناهنجاری زیر خودرو", "Under-vehicle anomaly"],
  OPEN_CRITICAL_ALERT: ["هشدار بحرانی باز", "Open critical alert"],
  WEIGHT_UNKNOWN: ["وزن نامشخص", "Weight unknown"],
  GUARD_APPROVED: ["تأیید نگهبان", "Guard approved"],
  R14: ["اضافه‌بار", "Overweight"],
  R12: ["اضافه‌برداشت حواله", "Permit overdraw"],
  R15: ["وزن خالص منفی", "Negative net"],
  R16: ["تارای غیرعادی", "Tare outlier"],
  R40: ["قرنطینه — منتظر آزمایشگاه", "QC quarantine"],
  R06: ["اطمینان پایین ANPR", "Low ANPR confidence"],
  ORDER_ANOMALY: ["ترتیب وزن غیرعادی", "Weigh order anomaly"],
};

export const STEP: Dict = {
  SAFETY: ["ایمنی", "Safety"],
  IDENTITY: ["هویت", "Identity"],
  DOCUMENTS: ["مدارک", "Documents"],
  PERMIT: ["حواله", "Permit"],
  WEIGHT: ["وزن", "Weight"],
  EXIT_PERMIT: ["مجوز خروج", "Exit permit"],
  EVIDENCE: ["شواهد", "Evidence"],
  ALERTS: ["هشدارها", "Alerts"],
};

export const CAPTURE_BLOCK: Dict = {
  INDICATOR_OFFLINE: ["نمایشگر وزن (indicator) آفلاین است", "Indicator offline"],
  UNSTABLE: ["وزن هنوز پایدار نیست", "Weight not stable yet"],
  STALE: ["خوانش وزن کهنه است (بیش از ۱۲ ثانیه)", "Reading is stale (> 12 s)"],
  POSITION: ["خودرو کامل روی باسکول نیست — چرخ خارج از ناحیه", "Vehicle not fully on the deck"],
  SCALE_LOCKED: ["باسکول قفل است", "Scale locked"],
  CALIBRATION_EXPIRED: ["گواهی کالیبراسیون منقضی — توزین تجاری قفل", "Calibration expired — legal weighing locked"],
  IDENTITY: ["هویت خودرو تأیید نشده", "Vehicle identity not resolved"],
  OVER_CAPACITY: ["وزن بیش از ظرفیت باسکول", "Over scale capacity"],
  EMPTY_DECK: ["خودرویی روی باسکول نیست", "No vehicle on the deck"],
  NO_VEHICLE_ON_SCALE: ["خودرویی روی باسکول نیست", "No vehicle on the scale"],
};

export const OPERATION: Dict = {
  DISPATCH: ["ارسال (فروش)", "Dispatch"],
  RECEIVE: ["دریافت (خرید)", "Receive"],
  TRANSFER: ["انتقال", "Transfer"],
  INTERNAL: ["داخلی", "Internal"],
};

export const SEVERITY: Dict = {
  CRITICAL: ["بحرانی", "Critical"],
  HIGH: ["بالا", "High"],
  WARNING: ["هشدار", "Warning"],
  INFO: ["اطلاع", "Info"],
};

export const ALERT_STATUS: Dict = {
  OPEN: ["باز", "Open"],
  ACK: ["دیده شد", "Acknowledged"],
  INVESTIGATING: ["در حال بررسی", "Investigating"],
  RESOLVED: ["حل شد", "Resolved"],
  DISMISSED: ["مثبت کاذب", "Dismissed"],
};

export const PERMIT_TYPE: Dict = {
  SALE: ["حواله فروش", "Sales order"],
  HAUL: ["مجوز حمل", "Haul permit"],
  PURCHASE: ["سفارش خرید", "Purchase order"],
  TRANSFER: ["انتقال داخلی", "Transfer"],
};

export const PERMIT_STATUS: Dict = {
  ISSUED: ["صادر شده", "Issued"],
  ACTIVE: ["فعال", "Active"],
  SUSPENDED: ["معلق", "Suspended"],
  EXPIRED: ["منقضی", "Expired"],
  REVOKED: ["باطل", "Revoked"],
  CONSUMED: ["مصرف شده", "Consumed"],
};

export const DEVICE_TYPE: Dict = {
  INDICATOR: ["نمایشگر وزن", "Weight indicator"],
  CAMERA_ANPR: ["دوربین پلاک‌خوان", "ANPR camera"],
  CAMERA_OVERVIEW: ["دوربین نما", "Overview camera"],
  CAMERA_TOP: ["دوربین بالا", "Top camera"],
  CAMERA_SIDE: ["دوربین جانبی", "Side camera"],
  CAMERA_LICENSE: ["دوربین مدارک", "Document camera"],
  UVSS: ["اسکنر زیر خودرو", "Under-vehicle scanner"],
  LIDAR: ["اسکنر LiDAR", "LiDAR scanner"],
  RFID_READER: ["ریدر RFID", "RFID reader"],
  PLC: ["PLC", "PLC"],
  BARRIER: ["راهبند", "Barrier"],
  TRAFFIC_LIGHT: ["چراغ راهنما", "Traffic light"],
  POSITION_SENSOR: ["سنسور موقعیت", "Position sensor"],
  LED_DISPLAY: ["مانیتور/تابلو راننده", "Driver display"],
  QUEUE_BOARD: ["تابلو فراخوان", "Queue board"],
  KIOSK: ["کیوسک", "Kiosk"],
  PRINTER: ["چاپگر", "Printer"],
  EDGE_GATEWAY: ["Edge Gateway", "Edge gateway"],
  INTERCOM: ["اینترکام", "Intercom"],
  SIREN: ["آژیر", "Siren"],
  JUNCTION_BOX: ["جعبه تقسیم لودسل", "Junction box"],
};

export const VEHICLE_TYPE: Dict = {
  TRAILER: ["تریلی کمپرسی", "Tipper trailer"],
  TIPPER: ["کامیون ۱۰ چرخ", "10-wheel tipper"],
  HAUL_TRUCK: ["دامپتراک معدنی", "Haul truck"],
};

export const EVIDENCE_KIND: Dict = {
  CAM_FRONT: ["جلو", "Front"],
  CAM_REAR: ["عقب", "Rear"],
  CAM_TOP: ["بالا", "Top"],
  CAM_SIDE: ["جانب", "Side"],
  CAM_OVERVIEW: ["نما", "Overview"],
  UVSS: ["زیر خودرو", "Under-vehicle"],
  LICENSE_PHOTO: ["مدارک راننده", "Driver document"],
  PLATE_CROP: ["برش پلاک", "Plate crop"],
};

export const STAGE: Dict = {
  GATE_IN: ["دروازه ورود", "Entry gate"],
  SCALE_1: ["وزن اول", "1st weigh"],
  SCALE_2: ["وزن دوم", "2nd weigh"],
  GATE_OUT: ["دروازه خروج", "Exit gate"],
  SCAN: ["اسکن", "Scan"],
};

export const ERRORS: Dict = {
  FORBIDDEN: ["نقش فعلی مجوز این کار را ندارد", "Your role is not allowed to do this"],
  REASON_REQUIRED: ["ثبت دلیل الزامی است", "A reason is required"],
  SECOND_SIGNATURE_REQUIRED: ["امضای دوم (کاربر دیگر) الزامی است", "A second signer (another user) is required"],
  QUOTA_EXHAUSTED: ["سهمیه حواله کافی نیست", "Permit quota exhausted"],
  TX_NOT_READY: ["تراکنش آماده تأیید نیست", "Transaction not ready"],
  TX_NOT_APPROVED: ["تراکنش‌های این سفر تأیید نشده‌اند", "Trip transactions are not approved"],
  REPRINT_REASON_REQUIRED: ["برای چاپ مجدد دلیل لازم است", "Reprint needs a reason"],
  NOTE_REQUIRED: ["یادداشت الزامی است", "A note is required"],
  QUEUE_EMPTY: ["صف خالی است", "Queue is empty"],
  STORED_TARE_EXPIRED: ["تارای ذخیره منقضی است", "Stored tare expired"],
  NEGATIVE_NET: ["وزن خالص منفی است", "Negative net weight"],
  VISIT_NOT_AT_GATE: ["خودرو در دروازه نیست", "Vehicle is not at the gate"],
  UNKNOWN_ACTION: ["عملیات ناشناخته", "Unknown action"],
  ...CAPTURE_BLOCK,
};

export function lbl(dict: Dict, key: string | undefined, locale: Locale): string {
  if (!key) return "—";
  const v = dict[key];
  return v ? (locale === "fa" ? v[0] : v[1]) : key;
}
