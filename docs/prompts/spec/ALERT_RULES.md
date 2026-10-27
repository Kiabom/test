# قوانین هشدار، کنترل‌های ضدتقلب و الگوریتم تصمیم گیت

> همه آستانه‌ها قابل پیکربندی‌اند (`AlertRule.params`). مقادیر زیر **نمونه دمو** هستند و در استقرار واقعی باید با داده سایت و FAT/SAT تعیین شوند.
> هر ارزیابی ذخیره می‌کند: `ruleCode`, `ruleVersion`, ورودی‌ها، آستانه، نتیجه، شواهد. داده مشکوک = اثبات تقلب نیست.

## ۱. الگوریتم تصمیم گیت (الهام WIS §5.5 + Smart Traffic §9.1)

```ts
function evaluateGate(ctx): { decision: Decision; trace: DecisionStep[] } {
  // P0 ایمنی — PLC تصمیم‌گیرنده نهایی است؛ نرم‌افزار فقط «درخواست» می‌دهد
  if (ctx.emergencyStop || !ctx.laneClear || ctx.interlockFault) return BLOCK('SAFETY')
  // P1 هویت و قانونی
  const id = resolveIdentity(ctx.anpr, ctx.rfid, registry)  // MATCH | MISMATCH | PLATE_ONLY | RFID_ONLY | UNKNOWN
  if (id === 'MISMATCH') return REVIEW('IDENTITY_MISMATCH')
  if (id === 'UNKNOWN')  return HOLD('UNKNOWN_VEHICLE')     // ثبت مهمان توسط نگهبان
  if (vehicle.status === 'BLOCKED' || driver.status === 'BLOCKED') return BLOCK('BLACKLIST')
  if (docsExpired(vehicle, driver)) return HOLD('DOCUMENT_EXPIRED')
  if (ctx.direction === 'IN' && hasOpenVisit(vehicle)) return HOLD('ANTI_PASSBACK')
  const p = validatePermit(permit, vehicle, material, direction, now)   // اعتبار زمانی، خودرو مجاز، مانده
  if (!p.ok) return BLOCK(p.reason)
  // P1 خروج: وزن معتبر + تیکت + مجوز خروج
  if (ctx.direction === 'OUT') {
    if (!allTransactionsApproved(visit)) return HOLD('TX_NOT_APPROVED')
    if (!exitPermit || exitPermit.status !== 'APPROVED') return HOLD('NO_EXIT_PERMIT')
    if (!evidenceComplete(visit)) return REVIEW('EVIDENCE_INCOMPLETE')
  }
  // هر هشدار CRITICAL حل‌نشده
  if (openCritical(visit).length) return HOLD('OPEN_CRITICAL_ALERT')
  // هر ورودی UNKNOWN → REVIEW (هرگز PASS)
  return PASS()   // ← فقط OPEN_REQUEST به PLC؛ OPEN_CONFIRMED پس از ACK ثبت می‌شود (timeout → OPEN_FAILED)
}
```

اولویت‌ها: **P0** ایمنی (PLC) · **P1** هویت/قانونی (HOLD) · **P2** کیفیت (صف بازبینی، عبور با برچسب) · **P3** عملیاتی (ادامه در Edge، نمایش backlog).

## ۲. شرط ثبت وزن (Capture Guard)
Capture فقط وقتی فعال است که: `indicator.online && stable && fresh(age < freshMs=12000) && positionOk && !scale.locked && identity resolved && weight ≤ scale.capacity`. در غیر این صورت دکمه غیرفعال + **دلیل متنی** (مثلاً «خودرو کامل روی باسکول نیست — چرخ عقب خارج از ناحیه»).

## ۳. فهرست قوانین

| کد | نام | شرط | پارامتر نمونه | شدت | اقدام | منبع |
|---|---|---|---|---|---|---|
| R01 | وزن ناپایدار | `!stable` هنگام capture | stableWindowMs=3000 | WARNING | BLOCK_CAPTURE | همه |
| R02 | خوانش کهنه | `ageMs > freshMs` | freshMs=12000 | WARNING | BLOCK_CAPTURE | WH |
| R03 | چرخ خارج باسکول | `positionOk=false` (IR یا ROI تصویری) | — | HIGH | BLOCK_CAPTURE | MET, OK, SmarTower |
| R04 | indicator آفلاین | `now − lastHeartbeat > timeout` | timeoutS=10 | CRITICAL | BLOCK_CAPTURE + NOTIFY | همه |
| R05 | مغایرت پلاک/RFID | ANPR و RFID دو خودروی متفاوت | minConfidence=0.85 | CRITICAL | HOLD_ENTRY | CS, SP |
| R06 | اطمینان پایین ANPR | `confidence < min` | minConfidence=0.85 | WARNING | REVIEW | CS |
| R07 | خودرو ناشناس | پلاک/تگ در رجیستری نیست | — | HIGH | HOLD_ENTRY (ثبت مهمان) | SP |
| R08 | anti-passback | ورود مجدد بدون خروج | — | HIGH | HOLD_ENTRY | ST |
| R09 | tailgating | دو خودرو در یک باز شدن | — | CRITICAL | ALARM + REVIEW | ST |
| R10 | باز شدن بدون فرمان | راهبند باز بدون OPEN_REQUEST | — | CRITICAL | آژیر + REVIEW | OK |
| R11 | مجوز منقضی/باطل | خارج از بازه یا status≠ACTIVE | — | CRITICAL | HOLD_EXIT | همه |
| R12 | اضافه برداشت مجوز | `net > remaining + tolerance` | toleranceKg=200 | CRITICAL | HOLD_EXIT | WBX |
| R13 | مغایرت ماده با مجوز | `tx.material ≠ permit.material` | — | CRITICAL | HOLD_EXIT | PU, SP |
| R14 | اضافه‌بار | `gross > min(vehicle.maxGvw, scale.capacity, permit limit)` | — | CRITICAL | HOLD_EXIT | همه |
| R15 | خالص منفی | `gross < tare` | — | HIGH | EXCEPTION | WH |
| R16 | تارای غیرعادی | `|tare − median(last N tares)| > limit` | N=10, limitKg=600 | WARNING | REVIEW | WH |
| R17 | تارای ذخیره منقضی | quick-weigh با `tareValidUntil < now` | — | HIGH | BLOCK | PU |
| R18 | توزین تکراری | همان rawHash یا همان خودرو در پنجره | windowMin=5 | HIGH | HOLD | همه |
| R19 | سفر غیرممکن | یک پلاک در دو لاین/سایت با فاصله ناممکن | minMinutes=8 | HIGH | REVIEW | WH, WIS |
| R20 | خالص‌های تکراری یکسان | تکرار net یکسان برای یک خودرو/مشتری | count=3/day | WARNING | REVIEW (Fraud) | WH |
| R21 | نرخ ثبت دستی بالا | سهم MANUAL اپراتور > الگو | pct=10 | WARNING | REVIEW (Fraud) | WH |
| R22 | کار خارج از ساعت | تراکنش خارج از ساعت مجاز سایت | 00:00–05:00 | WARNING | REVIEW | WH |
| R23 | تصویر ناقص | شواهد الزامی مرحله موجود نیست | requiredCams=3 | HIGH | REVIEW | WIS, SP |
| R24 | فریم دوربین کهنه | `frameAge > limit` | limitS=5 | WARNING | NOTIFY | PU |
| R25 | تعویض پلاک/تریلر در سفر | هویت وزن دوم ≠ وزن اول | — | CRITICAL | HOLD | SP, PU |
| R26 | گواهی کالیبراسیون منقضی | `now > validUntil` | warnDays=30 | CRITICAL | LOCK_LEGAL | همه |
| R27 | رانش صفر | `|zero| > limit` (فقط با پشتیبانی OEM) | limitKg=40 | HIGH | MAINTENANCE | MT, Rice Lake |
| R28 | عدم تعادل/نویز لودسل | تشخیص junction box | — | HIGH | MAINTENANCE | MT, Rice Lake |
| R29 | ماندگاری طولانی | `now − arrivedAt > limit` | limitMin=120 | WARNING | NOTIFY | همه |
| R30 | ازدحام صف | طول صف > حد لاین | maxQueue=8 | WARNING | NOTIFY | SP |
| R31 | مغایرت حجم/وزن | `|ρV − net|/net > tol` | tolPct=12 | INFO | REVIEW (هرگز overwrite) | LASE, Loadscan |
| R32 | بار خارج از مرکز (LiDAR) | `offCenterPct > limit` | limitPct=15 | WARNING | NOTIFY | OK |
| R33 | carryback | حجم باقی‌مانده در اسکن خالی | limitM3=0.5 | WARNING | REVIEW | OK |
| R34 | اختلاف payload/باسکول | `|payload − net|/net > tol` | tolPct=8 | WARNING | REVIEW | LOADRITE |
| R35 | ناهنجاری UVSS | ناهنجاری زیر شاسی نسبت به مرجع | score>0.7 | HIGH | HOLD_EXIT + حراست | پیشنهادی |
| R36 | QR مصرف‌شده | اسکن مجدد مجوز خروج | — | CRITICAL | HOLD + SECURITY | WH |
| R37 | صف sync کهنه | پیام outbox قدیمی‌تر از حد | maxAgeMin=30 | HIGH | NOTIFY_IT | همه |
| R38 | اختلاف ساعت دستگاه | `|deviceTime − serverTime| > limit` | limitS=5 | WARNING | QUARANTINE event | SP |
| R39 | Override بدون امضای دوم | تغییر دستی بدون تأیید دوم | — | CRITICAL | BLOCK_ACTION | همه |
| R40 | قرنطینه ماده | ماده نیازمند QC بدون نتیجه آزمایشگاه | — | HIGH | HOLD_EXIT | SP |

## ۴. چرخه هشدار
`OPEN → ACK → INVESTIGATING → RESOLVED | DISMISSED(false positive)`؛ SLA بر اساس شدت (CRITICAL=15m, HIGH=1h, WARNING=4h, INFO=24h)؛ ack ≠ resolve؛ CRITICAL خودکار بسته نمی‌شود؛ تجمیع (debounce) هشدارهای تکراری همان منبع در ۶۰ ثانیه؛ محدودیت ارسال پیام برای جلوگیری از «طوفان هشدار»؛ mute فقط با زمان‌دار و audit.

## ۵. کنترل‌های ضدتقلب (صفحه «Controls» سایت — الهام WeighHub Controls 01–10)
01 وزن فقط پایدار و تازه · 02 هویت دستگاه و قفل باسکول · 03 دو منبع هویت (ANPR+RFID) · 04 تشخیص موقعیت چرخ‌ها (سنسور + بینایی) · 05 شواهد تصویری با hash · 06 QR خروج یک‌بارمصرف · 07 زنجیره audit با HMAC · 08 شمارنده چاپ مجدد و نسخه‌گذاری تیکت · 09 الگوهای آماری (تارای غیرعادی، خالص تکراری، سفر غیرممکن، ثبت دستی) · 10 قفل مجوز و سهمیه اتمیک.
