# مدل داده و ماشین‌های حالت

قرارداد کلی: شناسه‌ها رشته یکتا (UUID یا prefix+شماره در دمو)، زمان‌ها ISO-8601 UTC، جرم `kg` (عدد صحیح/Decimal)، حجم `m3`، چگالی `kg/m3`. رکوردهای خام (WeighEvent، PlateRead، RfidRead، Evidence، GateEvent، AuditEvent) **append-only** هستند. همه موجودیت‌های عملیاتی `siteId` دارند.

> پیاده‌سازی مرجع: `web/src/domain/types.ts`. لایه دسترسی: `web/src/server/store.ts` (درون‌حافظه‌ای، قابل تعویض با Postgres از طریق Repository).

## ۱. موجودیت‌های پایه

```ts
type ID = string; type ISO = string;

interface Site { id; code; name; nameEn; timezone: 'Asia/Tehran'; branch: string }
interface Lane { id; siteId; code: 'A'|'B'|'C'|'D'|'E'; name; kind: 'GATE_IN'|'SCALE'|'GATE_OUT'|'SCAN'; scaleId?: ID }
interface Scale { id; siteId; laneId; name; capacityKg; divisionKg; indicatorModel; legalForTrade: boolean;
  status: 'READY'|'BUSY'|'HOLD'|'LOCKED'|'OFFLINE'; calibrationId?: ID }
interface Device { id; siteId; laneId?; type: DeviceType; name; model; protocol; ip; firmware;
  status: 'ONLINE'|'DEGRADED'|'OFFLINE'; lastHeartbeatAt: ISO; position?: 'FRONT'|'REAR'|'TOP'|'SIDE'|'UNDER'|'OVERVIEW' }
type DeviceType = 'INDICATOR'|'CAMERA_ANPR'|'CAMERA_OVERVIEW'|'CAMERA_TOP'|'CAMERA_SIDE'|'UVSS'|'LIDAR'|'RFID_READER'
  |'PLC'|'BARRIER'|'TRAFFIC_LIGHT'|'POSITION_SENSOR'|'LED_DISPLAY'|'KIOSK'|'PRINTER'|'EDGE_GATEWAY'|'INTERCOM'

interface Plate { d2: string; letter: string; d3: string; region: string }   // ۱۲ ب ۳۴۵ ایران ۶۷
// plateNormalized = `${d2}${letter}${d3}-${region}`

interface Vehicle { id; plate: Plate; plateNormalized; rfidEpc?; type: 'TRAILER'|'TIPPER'|'HAUL_TRUCK'|'PICKUP';
  axles; ratedPayloadKg; maxGvwKg; storedTareKg?; tareValidUntil?: ISO; carrierId; trailerPlate?;
  insuranceUntil: ISO; inspectionUntil: ISO; status: 'ACTIVE'|'BLOCKED'|'GUEST'; internal: boolean; color }
interface Driver { id; name; nationalIdMasked; licenseNo; licenseUntil: ISO; phone; carrierId; status: 'ACTIVE'|'BLOCKED' }
interface Carrier { id; name; regNo; phone; status }
interface Customer { id; name; type: 'CUSTOMER'|'SUPPLIER'|'BOTH'; erpCode; city; creditLimit }
interface Material { id; code; name; nameEn; grade; densityKgM3; pricePerTon; color; requiresQc: boolean }
interface Location { id; name; type: 'PIT'|'STOCKPILE'|'CRUSHER'|'PLANT'|'EXTERNAL'|'DUMP' }
interface Shift { id; siteId; code: 'A'|'B'|'C'; name; startHour; endHour; targetTons }   // C عبوری از نیمه‌شب
interface User { id; name; role: RoleCode; siteIds: ID[] }
interface Equipment { id; code; type: 'LOADER'|'SHOVEL'|'EXCAVATOR'|'HAUL_TRUCK'; name; status }
```

## ۲. تجاری: قرارداد، حواله، رزرو نوبت

```ts
interface Contract { id; no; customerId; materialId; totalKg; deliveredKg; validFrom; validTo; pricePerTon }
interface Permit {            // حواله فروش / مجوز حمل / سفارش خرید
  id; permitNo; type: 'SALE'|'HAUL'|'PURCHASE'|'TRANSFER'; customerId; materialId; contractId?;
  originId; destinationId; allowedKg; reservedKg; consumedKg; maxTrips?; tripsUsed;
  allowedVehicleIds: ID[];    // خالی = همه خودروهای حمل‌کننده
  carrierId?; validFrom; validTo; status: 'ISSUED'|'ACTIVE'|'SUSPENDED'|'EXPIRED'|'REVOKED'|'CONSUMED';
  issuer; documentHash }
interface PermitLedgerEntry { id; permitId; transactionId; kind: 'RESERVE'|'COMMIT'|'RELEASE'; kg; at; by }
// remainingKg = allowedKg − consumedKg − reservedKg  (مصرف اتمیک؛ هرگز منفی)
interface Booking { id; permitId; vehicleId; driverId; slotStart; slotEnd; status: 'BOOKED'|'ARRIVED'|'MISSED'|'CANCELLED' }
```

## ۳. عملیات: Visit، تراکنش، وزن، شواهد

```ts
interface Visit {
  id; siteId; vehicleId; driverId; bookingId?; state: VisitState;
  arrivedAt; enteredAt?; exitedAt?; queueNo; queueJoinedAt?; calledAt?; laneId?;
  driverToken;                 // لینک موبایل راننده /d/{token}
  identity: { anpr?: { plate: string; confidence: number; readId }, rfid?: { epc; rssi; readId },
              match: 'MATCH'|'MISMATCH'|'PLATE_ONLY'|'RFID_ONLY'|'UNKNOWN' };
  transactionIds: ID[]; exitPermitId?; shiftId; internal: boolean; holdReasons: string[] }

interface Transaction {
  id; ticketNo;                // سریال غیرتکراری: {siteCode}-{yymmdd}-{seq}
  visitId; siteId; vehicleId; driverId; carrierId; customerId?; materialId; permitId?;
  originId; destinationId; operation: 'DISPATCH'|'RECEIVE'|'TRANSFER'|'INTERNAL';
  state: TxState; firstWeighId?; secondWeighId?; extraWeighIds: ID[];
  grossKg?; tareKg?; netKg?; deductionKg: number; billableKg?;   // billable = net − deduction
  tareSource?: 'MEASURED'|'STORED'; holdReasons: string[];
  version: number; revisions: Revision[]; printCount: number;
  createdBy; approvedBy?; createdAt; approvedAt?; erpStatus: 'PENDING'|'SENT'|'FAILED'|'N/A';
  volumeM3?: number; estimatedMassKg?: number; payloadKg?: number;  // همیشه تخمینی و جدا
  lidarScanIds: ID[]; uvssScanId?; qcStatus?: 'NOT_REQUIRED'|'PENDING'|'APPROVED'|'QUARANTINE' }
interface Revision { version; at; by; reason; changes: Record<string, [old, new]> }

interface WeighEvent {
  id; transactionId; scaleId; seq; pass: 'FIRST'|'SECOND'|'EXTRA'|'ONE_PASS';
  weightKg; stable: boolean; fresh: boolean; ageMs; positionOk: boolean;
  captureMethod: 'SENSOR'|'MANUAL'; manualReason?; secondSigner?;
  rawFrame: string;            // مثل "ST,GS,+0034520kg"
  rawHash; capturedAt; operatorId; evidenceIds: ID[] }

interface Evidence { id; kind: 'CAM_FRONT'|'CAM_REAR'|'CAM_TOP'|'CAM_SIDE'|'CAM_OVERVIEW'|'UVSS'|'LICENSE_PHOTO'|'PLATE_CROP'|'DOCUMENT';
  cameraId?; visitId; transactionId?; stage: 'GATE_IN'|'SCALE_1'|'SCALE_2'|'GATE_OUT'|'SCAN';
  capturedAt; sha256; seed: number /* برای رندر SVG قطعی */; meta? }
interface PlateRead { id; cameraId; visitId?; plateRaw; plateNormalized; confidence; bbox: [x,y,w,h]; modelVersion; capturedAt; review: 'AUTO'|'CONFIRMED'|'CORRECTED' }
interface RfidRead { id; readerId; epc; rssi; antenna; readAt; vehicleId? }
interface GateEvent { id; visitId?; laneId; type: 'ARRIVE'|'DECISION'|'OPEN_REQUEST'|'OPEN_CONFIRMED'|'OPEN_FAILED'|'CLOSE'|'EXIT'|'DENY'|'ANTI_PASSBACK'|'TAILGATE'|'UNCOMMANDED_OPEN';
  decision?: Decision; trace?: DecisionStep[]; actorId?; at }
type Decision = 'PASS'|'REVIEW'|'HOLD'|'BLOCK'
interface DecisionStep { step: 'SAFETY'|'IDENTITY'|'PERMIT'|'SCALE'|'ALERTS'|'EVIDENCE'; result: 'OK'|'FAIL'|'UNKNOWN'; detail }

interface ExitPermit { id; serial; visitId; transactionIds: ID[]; token /* غیرقابل حدس */;
  status: 'DRAFT'|'APPROVED'|'CONSUMED'|'CANCELLED'; empty: boolean; approvedBy?; approvedAt?;
  consumedAt?; consumedBy?; scans: { at; by; result: 'ACCEPTED'|'REJECTED_USED'|'REJECTED_INVALID'|'REJECTED_CANCELLED' }[] }
```

## ۴. اسکن و تولید

```ts
interface LidarScan { id; visitId; vehicleId; kind: 'EMPTY'|'LOADED'; volumeM3; quality: number /*0..1*/;
  offCenterPct; peakHeightM; carrybackM3; capturedAt; seed; densityKgM3?; estimatedMassKg? }
interface UvssScan { id; visitId; capturedAt; referenceMatchPct; status: 'CLEAR'|'SUSPECT';
  anomalies: { x; y; w; h; label: string; score: number }[]; seed }
interface PayloadEvent { id; equipmentId; visitId?; vehicleId; buckets: number[]; payloadKg; targetKg; at }
interface FleetCycle { id; vehicleId; shiftId; start; end?; loadMin; haulMin; queueMin; dumpMin; returnMin; payloadKg? }
```

## ۵. کنترل، نگهداری، audit، یکپارچه‌سازی

```ts
interface AlertRule { id; code; name; nameEn; severity: Severity; action: 'BLOCK_CAPTURE'|'HOLD_EXIT'|'HOLD_ENTRY'|'REVIEW'|'NOTIFY'|'LOCK_LEGAL'|'MAINTENANCE';
  enabled: boolean; params: Record<string, number|string>; version; source: string }
type Severity = 'INFO'|'WARNING'|'HIGH'|'CRITICAL'
interface Alert { id; ruleCode; severity; status: 'OPEN'|'ACK'|'INVESTIGATING'|'RESOLVED'|'DISMISSED';
  title; detail; observed?; threshold?; visitId?; transactionId?; deviceId?; laneId?;
  openedAt; ackBy?; ackAt?; assignee?; slaDueAt; resolvedAt?; resolution?; evidenceIds: ID[] }
interface FraudCase { id; kind; title; transactionIds: ID[]; score; status: 'NEW'|'REVIEWING'|'CONFIRMED'|'FALSE_POSITIVE'; notes }
interface CalibrationRecord { id; scaleId; certificateNo; issuer; calibratedAt; validUntil;
  testPoints: { refKg; readKg; errorKg }[]; maxErrorKg; status: 'VALID'|'EXPIRING'|'EXPIRED'|'REVOKED'; documentHash }
interface LoadCellSample { scaleId; cellNo; at; zeroKg; driftKg; noiseKg; temperatureC; voltage; status: 'OK'|'WARN'|'FAULT'|'UNSUPPORTED' }
interface AuditEvent { id; seq; at; actorId; actorType: 'HUMAN'|'DEVICE'|'SYSTEM'; action; entityType; entityId; reason?;
  before?; after?; prevHash; hash /* HMAC-SHA256(prevHash + payload) */ }
interface OutboxMessage { id; channel: 'ERP'|'WEBHOOK'|'SMS'|'WHATSAPP'|'EMAIL'; topic; entityId; recipient?; body;
  status: 'PENDING'|'SENT'|'FAILED'|'DEAD'; attempts; nextRetryAt?; idempotencyKey; lastError?; createdAt }
```

## ۶. ماشین‌های حالت

```
Visit:        EXPECTED → ARRIVED → IDENTIFIED → IN_SITE → ON_SCALE_1 → LOADING → ON_SCALE_2 → READY_TO_EXIT → EXITED
                 شاخه‌ها: HOLD (از هر حالت، با دلیل) · REJECTED · CANCELLED
Transaction:  DRAFT → FIRST_CAPTURED → SECOND_CAPTURED → RECONCILED → APPROVED
                 شاخه‌ها: EXCEPTION (← هر حالت) · VOIDED (فقط با سند اصلاح) · REVISED (نسخه جدید)
ExitPermit:   DRAFT → APPROVED → CONSUMED        (CANCELLED؛ هرگز un-consume)
Alert:        OPEN → ACK → INVESTIGATING → RESOLVED | DISMISSED   (CRITICAL خودکار بسته نمی‌شود)
Permit:       ISSUED → ACTIVE → CONSUMED | EXPIRED | REVOKED | SUSPENDED
```
انتقال‌ها فقط از طریق `domain/workflow.ts` و هر انتقال یک AuditEvent می‌سازد.

## ۷. قواعد محاسبه
- `gross/tare` بر اساس `operation`: DISPATCH (خالی وارد، پر خارج) → وزن اول = tare، دوم = gross؛ RECEIVE → اول gross، دوم tare. اگر ترتیب برعکس شد، بر اساس مقدار بزرگ‌تر **فقط با flag** و REVIEW.
- `netKg = grossKg − tareKg`؛ اگر منفی → EXCEPTION («NEGATIVE_NET»)؛ `abs()` ممنوع.
- `billableKg = netKg − deductionKg` (کسر مجاز با دلیل).
- Quick-weigh: `tareKg = vehicle.storedTareKg` فقط اگر `tareValidUntil > now`، با `tareSource='STORED'` و flag ریسک.
- `remainingKg(permit) = allowedKg − consumedKg − reservedKg`؛ commit در یک عمل اتمیک همراه APPROVED.
- `turnaroundMin = (exitedAt − arrivedAt)/60000`؛ Visit باز = «ناقص».
- `queueWaitMin = (calledAt − queueJoinedAt)/60000`؛ بدون queueJoinedAt → N/A.
- `estimatedMassKg = volumeM3 × densityKgM3` (برچسب تخمینی)؛ `volumeCrossCheckPct = 100×|ρV − net|/net` (net=0 → N/A).
- `payloadVariancePct = 100×(payload − net)/net`.
- `shiftTons = Σ netKg(APPROVED, DISPATCH)/1000`؛ سه جمع جدا: `sales_dispatched_t`، `site_dispatch_t`، `mine_moved_t` (داخلی).
- KPI بدون داده معتبر → `null` و نمایش N/A.
