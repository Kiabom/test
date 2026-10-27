import { appendAudit, sha256 } from "@/domain/audit";
import { normalizePlate, randomPlate } from "@/domain/plate";
import { defaultRules, SLA_MINUTES } from "@/domain/rules";
import { indicatorFrame } from "@/domain/weighing";
import type * as T from "@/domain/types";
import { chance, gauss, int, mulberry32, pick, range, type Rand } from "./rng";
import { evidenceHash, shiftOf, siteHour, type DB } from "./store";

const DAY = 86_400_000;
const MIN = 60_000;

const FIRST_NAMES = ["علی", "محمد", "حسین", "رضا", "مهدی", "حسن", "امیر", "سعید", "مجید", "جواد", "کاظم", "یوسف", "ناصر", "بهروز", "فرهاد", "داوود", "اکبر", "مرتضی", "عباس", "قاسم"];
const FIRST_EN = ["Ali", "Mohammad", "Hossein", "Reza", "Mahdi", "Hassan", "Amir", "Saeed", "Majid", "Javad", "Kazem", "Yousef", "Naser", "Behrouz", "Farhad", "Davood", "Akbar", "Morteza", "Abbas", "Ghasem"];
const LAST_NAMES = ["رضایی", "احمدی", "کریمی", "حسینی", "موسوی", "محمدی", "جعفری", "صادقی", "رحیمی", "کاظمی", "نوری", "قاسمی", "زارعی", "طاهری", "مرادی", "باقری", "شریفی", "عباسی", "یزدانی", "سلطانی"];
const LAST_EN = ["Rezaei", "Ahmadi", "Karimi", "Hosseini", "Mousavi", "Mohammadi", "Jafari", "Sadeghi", "Rahimi", "Kazemi", "Nouri", "Ghasemi", "Zarei", "Taheri", "Moradi", "Bagheri", "Sharifi", "Abbasi", "Yazdani", "Soltani"];
const TRUCK_COLORS = ["#d9480f", "#1971c2", "#2f9e44", "#e8590c", "#f08c00", "#5f3dc4", "#c92a2a", "#495057", "#0b7285", "#e67700"];
const HOUR_WEIGHTS = [0.3, 0.2, 0.2, 0.2, 0.3, 0.6, 1.2, 1.8, 2.2, 2.3, 2.1, 1.7, 1.2, 1.3, 1.6, 2.0, 2.1, 1.9, 1.4, 1.0, 0.8, 0.6, 0.5, 0.4];

export const USERS: T.User[] = [
  { id: "U-ADMIN", name: "مهندس صدری", nameEn: "Eng. Sadri", role: "system_admin" },
  { id: "U-MGR", name: "مهندس فرهمند", nameEn: "Eng. Farahmand", role: "site_manager" },
  { id: "U-OP1", name: "سارا امینی", nameEn: "Sara Amini", role: "scale_operator" },
  { id: "U-OP2", name: "کامران نیک‌نام", nameEn: "Kamran Niknam", role: "scale_operator" },
  { id: "U-GD1", name: "جمشید پاکزاد", nameEn: "Jamshid Pakzad", role: "gate_guard" },
  { id: "U-GD2", name: "بهرام شجاعی", nameEn: "Bahram Shojaei", role: "gate_guard" },
  { id: "U-LOG", name: "نرگس توکلی", nameEn: "Narges Tavakoli", role: "logistics" },
  { id: "U-SAL", name: "پیمان رستمی", nameEn: "Peyman Rostami", role: "sales" },
  { id: "U-QC", name: "دکتر لیلا مختاری", nameEn: "Dr. Leila Mokhtari", role: "qc" },
  { id: "U-MNT", name: "مهندس اکبری", nameEn: "Eng. Akbari", role: "maintenance" },
  { id: "U-AUD", name: "مریم وحیدی", nameEn: "Maryam Vahidi", role: "auditor" },
  { id: "U-FLT", name: "مهندس کیانی", nameEn: "Eng. Kiani", role: "fleet_manager" },
  { id: "U-FIN", name: "حمید ملکی", nameEn: "Hamid Maleki", role: "finance" },
];

function masters(r: Rand, now: number) {
  const iso = (t: number) => new Date(t).toISOString();
  const sites: T.Site[] = [
    { id: "S1", code: "S1", name: "سایت مرکزی معدن سنگ آهن", nameEn: "Central Iron Ore Mine", timezone: "Asia/Tehran", branch: "معدن" },
    { id: "S2", code: "S2", name: "کارخانه فرآوری", nameEn: "Processing Plant", timezone: "Asia/Tehran", branch: "کارخانه" },
  ];
  const lanes: T.Lane[] = [
    { id: "L-A", siteId: "S1", code: "A", name: "دروازه ورود", nameEn: "Entry gate", kind: "GATE_IN" },
    { id: "L-B", siteId: "S1", code: "B", name: "باسکول ۱ (ورودی)", nameEn: "Scale 1 (inbound)", kind: "SCALE", scaleId: "SC-1" },
    { id: "L-C", siteId: "S1", code: "C", name: "باسکول ۲ (خروجی)", nameEn: "Scale 2 (outbound)", kind: "SCALE", scaleId: "SC-2" },
    { id: "L-D", siteId: "S1", code: "D", name: "اسکنر LiDAR", nameEn: "LiDAR gantry", kind: "SCAN" },
    { id: "L-E", siteId: "S1", code: "E", name: "دروازه خروج", nameEn: "Exit gate", kind: "GATE_OUT" },
  ];
  const scales: T.Scale[] = [
    { id: "SC-1", siteId: "S1", laneId: "L-B", name: "باسکول ۱", nameEn: "Scale 1", capacityKg: 80000, divisionKg: 20, lengthM: 18, loadCells: 8, indicatorModel: "Indicator-X9 (RS-232)", legalForTrade: true, diagnosticsSupported: true, status: "READY", calibrationId: "CAL-1" },
    { id: "SC-2", siteId: "S1", laneId: "L-C", name: "باسکول ۲", nameEn: "Scale 2", capacityKg: 80000, divisionKg: 20, lengthM: 18, loadCells: 8, indicatorModel: "Indicator-X9 (TCP/IP)", legalForTrade: true, diagnosticsSupported: false, status: "READY", calibrationId: "CAL-2" },
  ];
  const hb = iso(now);
  const dev = (id: string, laneId: string | undefined, type: T.DeviceType, name: string, model: string, protocol: string, ip: string, position?: T.Device["position"]): T.Device => ({
    id, siteId: "S1", laneId, type, name, model, protocol, ip, firmware: `v${int(r, 1, 4)}.${int(r, 0, 9)}.${int(r, 0, 20)}`, status: "ONLINE", lastHeartbeatAt: hb, position,
  });
  const devices: T.Device[] = [
    dev("CAM-A-FRONT", "L-A", "CAMERA_ANPR", "ANPR جلو — دروازه ورود", "IR ANPR Cam IP67", "RTSP/ONVIF", "10.10.1.11", "FRONT"),
    dev("CAM-A-REAR", "L-A", "CAMERA_ANPR", "ANPR عقب — دروازه ورود", "IR ANPR Cam IP67", "RTSP/ONVIF", "10.10.1.12", "REAR"),
    dev("CAM-A-OVR", "L-A", "CAMERA_OVERVIEW", "دوربین نما — دروازه ورود", "4MP Bullet", "RTSP", "10.10.1.13", "OVERVIEW"),
    dev("CAM-A-LIC", "L-A", "CAMERA_LICENSE", "دوربین مدارک راننده", "Doc Cam", "USB/HTTP", "10.10.1.14"),
    dev("UVSS-A", "L-A", "UVSS", "اسکنر زیر خودرو — ورود", "Line-scan UVSS", "GigE Vision", "10.10.1.15", "UNDER"),
    dev("RFID-A", "L-A", "RFID_READER", "ریدر RFID — ورود", "UHF EPC Gen2 Reader", "TCP/LLRP", "10.10.1.16"),
    dev("BAR-A", "L-A", "BARRIER", "راهبند ورود", "Boom Barrier 6m", "PLC DO", "—"),
    dev("TL-A", "L-A", "TRAFFIC_LIGHT", "چراغ ورود", "LED Traffic Light", "PLC DO", "—"),
    dev("LED-A", "L-A", "LED_DISPLAY", "تابلو راننده — ورود", "Outdoor LED P10", "HTTP", "10.10.1.17"),
    dev("IND-1", "L-B", "INDICATOR", "نمایشگر وزن باسکول ۱", "Indicator-X9", "RS-232 9600 8N1", "COM3"),
    dev("JB-1", "L-B", "JUNCTION_BOX", "جعبه تقسیم دیجیتال باسکول ۱", "Digital JB 8ch", "RS-485", "—"),
    dev("CAM-B-FRONT", "L-B", "CAMERA_ANPR", "دوربین جلو باسکول ۱", "IR ANPR Cam", "RTSP", "10.10.2.11", "FRONT"),
    dev("CAM-B-REAR", "L-B", "CAMERA_ANPR", "دوربین عقب باسکول ۱", "IR ANPR Cam", "RTSP", "10.10.2.12", "REAR"),
    dev("CAM-B-TOP", "L-B", "CAMERA_TOP", "دوربین بالا باسکول ۱", "Overhead 4K", "RTSP", "10.10.2.13", "TOP"),
    dev("CAM-B-SIDE", "L-B", "CAMERA_SIDE", "دوربین جانبی باسکول ۱", "Side 4MP", "RTSP", "10.10.2.14", "SIDE"),
    dev("POS-B", "L-B", "POSITION_SENSOR", "سنسورهای IR موقعیت باسکول ۱", "IR Beam x4", "PLC DI", "—"),
    dev("BAR-B", "L-B", "BARRIER", "راهبند باسکول ۱", "Boom Barrier 4m", "PLC DO", "—"),
    dev("TL-B", "L-B", "TRAFFIC_LIGHT", "چراغ باسکول ۱", "LED Traffic Light", "PLC DO", "—"),
    dev("LED-B", "L-B", "LED_DISPLAY", "مانیتور بزرگ راننده باسکول ۱", "55\" Outdoor Display", "HTTP", "10.10.2.15"),
    dev("KIOSK-B", "L-B", "KIOSK", "کیوسک راننده باسکول ۱", "Touch Kiosk 15\"", "HTTP", "10.10.2.16"),
    dev("PRN-B", "L-B", "PRINTER", "چاپگر رسید باسکول ۱", "Thermal 80mm", "USB/ESC-POS", "—"),
    dev("ICM-B", "L-B", "INTERCOM", "اینترکام باسکول ۱", "SIP Intercom", "SIP", "10.10.2.17"),
    dev("IND-2", "L-C", "INDICATOR", "نمایشگر وزن باسکول ۲", "Indicator-X9", "TCP/IP :4001", "10.10.3.10"),
    dev("CAM-C-FRONT", "L-C", "CAMERA_ANPR", "دوربین جلو باسکول ۲", "IR ANPR Cam", "RTSP", "10.10.3.11", "FRONT"),
    dev("CAM-C-REAR", "L-C", "CAMERA_ANPR", "دوربین عقب باسکول ۲", "IR ANPR Cam", "RTSP", "10.10.3.12", "REAR"),
    dev("CAM-C-TOP", "L-C", "CAMERA_TOP", "دوربین بالا باسکول ۲", "Overhead 4K", "RTSP", "10.10.3.13", "TOP"),
    dev("CAM-C-SIDE", "L-C", "CAMERA_SIDE", "دوربین جانبی باسکول ۲", "Side 4MP", "RTSP", "10.10.3.14", "SIDE"),
    dev("POS-C", "L-C", "POSITION_SENSOR", "سنسورهای IR موقعیت باسکول ۲", "IR Beam x4", "PLC DI", "—"),
    dev("BAR-C", "L-C", "BARRIER", "راهبند باسکول ۲", "Boom Barrier 4m", "PLC DO", "—"),
    dev("TL-C", "L-C", "TRAFFIC_LIGHT", "چراغ باسکول ۲", "LED Traffic Light", "PLC DO", "—"),
    dev("LED-C", "L-C", "LED_DISPLAY", "مانیتور بزرگ راننده باسکول ۲", "55\" Outdoor Display", "HTTP", "10.10.3.15"),
    dev("KIOSK-C", "L-C", "KIOSK", "کیوسک راننده باسکول ۲", "Touch Kiosk 15\"", "HTTP", "10.10.3.16"),
    dev("PRN-C", "L-C", "PRINTER", "چاپگر رسید باسکول ۲", "Thermal 80mm", "USB/ESC-POS", "—"),
    dev("LIDAR-D", "L-D", "LIDAR", "اسکنر LiDAR گنتری", "3D LiDAR x2 + 2D side x2", "Ethernet/UDP", "10.10.4.10", "TOP"),
    dev("CAM-D-TOP", "L-D", "CAMERA_TOP", "دوربین بالای گنتری", "Overhead 4K", "RTSP", "10.10.4.11", "TOP"),
    dev("CAM-E-FRONT", "L-E", "CAMERA_ANPR", "ANPR — دروازه خروج", "IR ANPR Cam IP67", "RTSP/ONVIF", "10.10.5.11", "FRONT"),
    dev("UVSS-E", "L-E", "UVSS", "اسکنر زیر خودرو — خروج", "Line-scan UVSS", "GigE Vision", "10.10.5.12", "UNDER"),
    dev("RFID-E", "L-E", "RFID_READER", "ریدر RFID — خروج", "UHF EPC Gen2 Reader", "TCP/LLRP", "10.10.5.13"),
    dev("BAR-E", "L-E", "BARRIER", "راهبند خروج", "Boom Barrier 6m", "PLC DO", "—"),
    dev("TL-E", "L-E", "TRAFFIC_LIGHT", "چراغ خروج", "LED Traffic Light", "PLC DO", "—"),
    dev("SIREN-E", "L-E", "SIREN", "آژیر و فلاشر خروج", "Siren/Beacon", "PLC DO", "—"),
    dev("LED-E", "L-E", "LED_DISPLAY", "تابلو راننده — خروج", "Outdoor LED P10", "HTTP", "10.10.5.14"),
    dev("QB-1", undefined, "QUEUE_BOARD", "تابلو فراخوان پارکینگ", "LED Multi-line", "HTTP", "10.10.0.20"),
    dev("PLC-1", undefined, "PLC", "PLC کنترل لاین‌ها", "Safety PLC + I/O", "Modbus TCP", "10.10.0.5"),
    dev("EDGE-1", undefined, "EDGE_GATEWAY", "Edge Gateway سایت", "Fanless IPC + UPS", "HTTPS/mTLS", "10.10.0.2"),
  ];
  const materials: T.Material[] = [
    { id: "M-FEL", code: "FE-LUMP", name: "سنگ آهن دانه‌بندی", nameEn: "Iron ore lump", grade: "Fe 62%", densityKgM3: 2400, pricePerTon: 4_200_000, color: "#8c2f1b", requiresQc: false, internalOnly: false },
    { id: "M-FEC", code: "FE-CON", name: "کنسانتره آهن", nameEn: "Iron concentrate", grade: "Fe 67%", densityKgM3: 2200, pricePerTon: 6_800_000, color: "#343a40", requiresQc: false, internalOnly: false },
    { id: "M-PEL", code: "PELLET", name: "گندله", nameEn: "Pellet", grade: "Fe 65%", densityKgM3: 2100, pricePerTon: 8_500_000, color: "#5c4033", requiresQc: false, internalOnly: false },
    { id: "M-WST", code: "WASTE", name: "باطله", nameEn: "Waste rock", grade: "—", densityKgM3: 1800, pricePerTon: 0, color: "#868e96", requiresQc: false, internalOnly: true },
    { id: "M-LIM", code: "LIME", name: "سنگ آهک", nameEn: "Limestone", grade: "CaO 52%", densityKgM3: 1600, pricePerTon: 1_100_000, color: "#ced4da", requiresQc: false, internalOnly: false },
    { id: "M-SND", code: "SAND", name: "شن و ماسه", nameEn: "Sand & gravel", grade: "0-25mm", densityKgM3: 1550, pricePerTon: 650_000, color: "#e9c46a", requiresQc: false, internalOnly: false },
    { id: "M-COL", code: "COAL", name: "زغال‌سنگ", nameEn: "Coal", grade: "Coking", densityKgM3: 850, pricePerTon: 5_400_000, color: "#212529", requiresQc: false, internalOnly: false },
    { id: "M-CUS", code: "CU-SUL", name: "مس سولفیدی", nameEn: "Copper sulphide", grade: "Cu 0.8%", densityKgM3: 2000, pricePerTon: 3_900_000, color: "#2a9d8f", requiresQc: true, internalOnly: false },
  ];
  const customers: T.Customer[] = [
    { id: "C-01", name: "فولاد کاوه (نمونه)", nameEn: "Kaveh Steel (demo)", type: "CUSTOMER", erpCode: "CUS-1001", city: "اهواز", creditLimit: 9e10 },
    { id: "C-02", name: "ذوب‌آهن البرز (نمونه)", nameEn: "Alborz Smelting (demo)", type: "CUSTOMER", erpCode: "CUS-1002", city: "کرج", creditLimit: 7e10 },
    { id: "C-03", name: "فولاد زاگرس (نمونه)", nameEn: "Zagros Steel (demo)", type: "CUSTOMER", erpCode: "CUS-1003", city: "کرمانشاه", creditLimit: 5e10 },
    { id: "C-04", name: "سیمان کوهستان (نمونه)", nameEn: "Kouhestan Cement (demo)", type: "CUSTOMER", erpCode: "CUS-1004", city: "اصفهان", creditLimit: 2e10 },
    { id: "C-05", name: "کنسانتره پارس (نمونه)", nameEn: "Pars Concentrate (demo)", type: "CUSTOMER", erpCode: "CUS-1005", city: "شیراز", creditLimit: 4e10 },
    { id: "C-06", name: "بازرگانی آریا (نمونه)", nameEn: "Aria Trading (demo)", type: "CUSTOMER", erpCode: "CUS-1006", city: "تهران", creditLimit: 3e10 },
    { id: "C-07", name: "ریخته‌گری شرق (نمونه)", nameEn: "East Foundry (demo)", type: "CUSTOMER", erpCode: "CUS-1007", city: "مشهد", creditLimit: 2e10 },
    { id: "C-08", name: "تأمین مواد دماوند (نمونه)", nameEn: "Damavand Supply (demo)", type: "SUPPLIER", erpCode: "SUP-2001", city: "تهران", creditLimit: 0 },
  ];
  const carriers: T.Carrier[] = [
    { id: "CR-1", name: "ترابر کویر", nameEn: "Kavir Haulage", regNo: "TR-4410", phone: "021-6612****", status: "ACTIVE" },
    { id: "CR-2", name: "حمل و نقل سپهر", nameEn: "Sepehr Transport", regNo: "TR-4411", phone: "021-6613****", status: "ACTIVE" },
    { id: "CR-3", name: "باربری آسیا", nameEn: "Asia Freight", regNo: "TR-4412", phone: "031-3345****", status: "ACTIVE" },
    { id: "CR-4", name: "ترانزیت البرز", nameEn: "Alborz Transit", regNo: "TR-4413", phone: "026-3420****", status: "ACTIVE" },
    { id: "CR-5", name: "حمل جاده‌ای امید", nameEn: "Omid Road Haul", regNo: "TR-4414", phone: "051-3870****", status: "ACTIVE" },
    { id: "CR-6", name: "ناوگان داخلی معدن", nameEn: "Mine internal fleet", regNo: "INT-01", phone: "داخلی ۲۲۰", status: "ACTIVE" },
  ];
  const locations: T.Location[] = [
    { id: "LOC-PN", name: "پیت شمالی", nameEn: "North pit", type: "PIT" },
    { id: "LOC-PS", name: "پیت جنوبی", nameEn: "South pit", type: "PIT" },
    { id: "LOC-SP1", name: "دپو ۱", nameEn: "Stockpile 1", type: "STOCKPILE" },
    { id: "LOC-SP2", name: "دپو ۲", nameEn: "Stockpile 2", type: "STOCKPILE" },
    { id: "LOC-CR", name: "سنگ‌شکن اولیه", nameEn: "Primary crusher", type: "CRUSHER" },
    { id: "LOC-PL", name: "کارخانه فرآوری", nameEn: "Processing plant", type: "PLANT" },
    { id: "LOC-DMP", name: "دامپ باطله", nameEn: "Waste dump", type: "DUMP" },
    { id: "LOC-EXT", name: "مقصد مشتری", nameEn: "Customer site", type: "EXTERNAL" },
  ];
  const shifts: T.Shift[] = [
    { id: "SH-A", siteId: "S1", code: "A", name: "شیفت صبح", nameEn: "Morning", startHour: 6, endHour: 14, targetTons: 1100 },
    { id: "SH-B", siteId: "S1", code: "B", name: "شیفت عصر", nameEn: "Evening", startHour: 14, endHour: 22, targetTons: 1000 },
    { id: "SH-C", siteId: "S1", code: "C", name: "شیفت شب", nameEn: "Night", startHour: 22, endHour: 6, targetTons: 350 },
  ];
  const equipment: T.Equipment[] = [
    { id: "EQ-L1", code: "L-01", type: "LOADER", name: "لودر L-01", nameEn: "Loader L-01", status: "WORKING", ratedBucketKg: 7000 },
    { id: "EQ-L2", code: "L-02", type: "LOADER", name: "لودر L-02", nameEn: "Loader L-02", status: "WORKING", ratedBucketKg: 7000 },
    { id: "EQ-L3", code: "L-03", type: "LOADER", name: "لودر L-03", nameEn: "Loader L-03", status: "IDLE", ratedBucketKg: 6000 },
    { id: "EQ-S1", code: "SH-01", type: "SHOVEL", name: "شاول SH-01", nameEn: "Shovel SH-01", status: "WORKING", ratedBucketKg: 18000 },
    { id: "EQ-E1", code: "EX-01", type: "EXCAVATOR", name: "بیل مکانیکی EX-01", nameEn: "Excavator EX-01", status: "DOWN", ratedBucketKg: 9000 },
  ];

  // drivers
  const drivers: T.Driver[] = [];
  for (let i = 0; i < 56; i++) {
    const fi = int(r, 0, FIRST_NAMES.length - 1);
    const li = int(r, 0, LAST_NAMES.length - 1);
    drivers.push({
      id: `D-${String(i + 1).padStart(3, "0")}`,
      name: `${FIRST_NAMES[fi]} ${LAST_NAMES[li]}`,
      nameEn: `${FIRST_EN[fi]} ${LAST_EN[li]}`,
      nationalIdMasked: `00${int(r, 10, 99)}****${int(r, 10, 99)}`,
      licenseNo: `${int(r, 1000, 9999)}${int(r, 1000, 9999)}`,
      licenseUntil: iso(now + int(r, -20, 900) * DAY),
      phone: `0912***${int(r, 1000, 9999)}`,
      carrierId: i < 48 ? `CR-${(i % 5) + 1}` : "CR-6",
      status: i === 13 ? "BLOCKED" : "ACTIVE",
    });
  }
  // vehicles
  const vehicles: T.Vehicle[] = [];
  const usedPlates = new Set<string>();
  for (let i = 0; i < 60; i++) {
    let plate = randomPlate(r);
    while (usedPlates.has(normalizePlate(plate))) plate = randomPlate(r);
    usedPlates.add(normalizePlate(plate));
    const internal = i >= 52;
    const type: T.VehicleType = i < 46 ? "TRAILER" : "TIPPER";
    const baseTare = type === "TRAILER" ? 16500 : 11200;
    const tare = Math.round((baseTare + gauss(r, 0, 500)) / 20) * 20;
    vehicles.push({
      id: `VH-${String(i + 1).padStart(3, "0")}`,
      plate,
      plateNormalized: normalizePlate(plate),
      rfidEpc: `E280-1160-6000-${int(r, 1000, 9999)}-${int(r, 1000, 9999).toString(16).toUpperCase()}-${int(r, 1000, 9999).toString(16).toUpperCase()}`,
      type,
      axles: type === "TRAILER" ? 6 : 3,
      ratedPayloadKg: type === "TRAILER" ? 32000 : 18000,
      maxGvwKg: type === "TRAILER" ? 50000 : 32000,
      storedTareKg: tare,
      tareValidUntil: iso(now + int(r, -10, 60) * DAY),
      carrierId: internal ? "CR-6" : `CR-${(i % 5) + 1}`,
      trailerPlate: type === "TRAILER" ? `${int(r, 10, 99)}-${int(r, 100, 999)}` : undefined,
      insuranceUntil: iso(now + (i === 7 || i === 21 ? -int(r, 2, 30) : int(r, 20, 300)) * DAY),
      inspectionUntil: iso(now + int(r, 5, 200) * DAY),
      status: i === 5 || i === 33 || i === 40 ? "BLOCKED" : "ACTIVE",
      internal,
      color: pick(r, TRUCK_COLORS),
    });
  }
  return { sites, lanes, scales, devices, materials, customers, carriers, locations, shifts, equipment, drivers, vehicles };
}

export function buildSeed(): DB {
  const r = mulberry32(20261027);
  const now = Date.now();
  const iso = (t: number) => new Date(t).toISOString();
  const m = masters(r, now);

  const d: DB = {
    ...m,
    users: USERS,
    contracts: [],
    permits: [],
    ledger: [],
    bookings: [],
    visits: [],
    transactions: [],
    weighEvents: [],
    evidence: [],
    plateReads: [],
    rfidReads: [],
    gateEvents: [],
    exitPermits: [],
    lidarScans: [],
    uvssScans: [],
    payloadEvents: [],
    fleetCycles: [],
    rules: defaultRules(),
    alerts: [],
    fraudCases: [],
    calibrations: [],
    loadCells: [],
    audit: [],
    outbox: [],
    live: {
      lanes: [],
      queueB: [],
      queueC: [],
      queueGateIn: [],
      queueGateOut: [],
      log: [],
      speed: 1,
      mode: "AUTO",
      wanOnline: true,
      nextArrivalAt: now + 3000,
      pendingScenarios: [],
      closedDays: [],
    },
    revision: 1,
    counters: {},
  };
  const id = (p: string) => {
    d.counters[p] = (d.counters[p] ?? 0) + 1;
    return `${p}-${String(d.counters[p]).padStart(6, "0")}`;
  };
  const auditAt = (at: number, action: string, entityType: string, entityId: string, actorId = "system", data?: Record<string, unknown>) =>
    appendAudit(d.audit, { id: id("AU"), at: iso(at), actorId, actorType: actorId === "system" ? "SYSTEM" : actorId.startsWith("U-") ? "HUMAN" : "DEVICE", action, entityType, entityId, data });

  // contracts & permits
  const sellable = d.materials.filter((x) => !x.internalOnly && x.id !== "M-CUS");
  for (let i = 0; i < 6; i++) {
    const mat = sellable[i % sellable.length];
    d.contracts.push({
      id: `CT-${i + 1}`,
      no: `CNT-1405-${String(100 + i)}`,
      customerId: d.customers[i].id,
      materialId: mat.id,
      totalKg: int(r, 8, 50) * 1_000_000,
      deliveredKg: 0,
      validFrom: iso(now - 120 * DAY),
      validTo: iso(now + int(r, 60, 240) * DAY),
      pricePerTon: mat.pricePerTon,
    });
  }
  const permitTypes: T.PermitType[] = ["SALE", "SALE", "SALE", "HAUL", "SALE", "HAUL", "SALE", "SALE", "SALE", "HAUL", "SALE", "SALE", "SALE", "SALE", "HAUL", "SALE", "SALE", "SALE", "PURCHASE", "PURCHASE", "TRANSFER", "TRANSFER", "SALE", "SALE"];
  permitTypes.forEach((type, i) => {
    const contract = type === "SALE" || type === "HAUL" ? d.contracts[i % d.contracts.length] : undefined;
    const material =
      type === "PURCHASE" ? d.materials.find((x) => x.id === (i % 2 ? "M-LIM" : "M-CUS"))! : type === "TRANSFER" ? d.materials.find((x) => x.id === "M-WST")! : d.materials.find((x) => x.id === contract!.materialId)!;
    const validTo = i === 4 || i === 15 ? now - int(r, 1, 6) * DAY : now + int(r, 10, 90) * DAY;
    d.permits.push({
      id: `PM-${String(i + 1).padStart(3, "0")}`,
      permitNo: `${type === "PURCHASE" ? "PO" : type === "TRANSFER" ? "TR" : type === "HAUL" ? "HV" : "SO"}-1405-${String(1000 + i * 7)}`,
      type,
      customerId: type === "PURCHASE" ? "C-08" : type === "TRANSFER" ? "C-01" : contract!.customerId,
      materialId: material.id,
      contractId: contract?.id,
      originId: type === "PURCHASE" ? "LOC-EXT" : type === "TRANSFER" ? "LOC-PN" : pick(r, ["LOC-SP1", "LOC-SP2", "LOC-CR"]),
      destinationId: type === "PURCHASE" ? "LOC-PL" : type === "TRANSFER" ? "LOC-DMP" : "LOC-EXT",
      allowedKg: 0,
      reservedKg: 0,
      consumedKg: 0,
      maxTrips: undefined,
      tripsUsed: 0,
      allowedVehicleIds: [],
      carrierId: undefined,
      validFrom: iso(now - int(r, 20, 60) * DAY),
      validTo: iso(validTo),
      status: validTo < now ? "EXPIRED" : i === 9 ? "SUSPENDED" : "ACTIVE",
      issuer: type === "PURCHASE" ? "واحد خرید" : "واحد فروش",
      documentHash: sha256(`permit-${i}`),
    });
  });

  // calibrations & load cells
  d.calibrations.push(
    { id: "CAL-1", scaleId: "SC-1", certificateNo: "CAL-1405-0711", issuer: "آزمایشگاه مرجع اوزان (نمونه)", calibratedAt: iso(now - 150 * DAY), validUntil: iso(now + 215 * DAY), testPoints: [0, 10000, 20000, 40000, 60000, 80000].map((ref) => ({ refKg: ref, readKg: ref + int(r, -1, 1) * 20, errorKg: 0 })).map((p) => ({ ...p, errorKg: p.readKg - p.refKg })), maxErrorKg: 20, documentHash: sha256("cal-1") },
    { id: "CAL-2", scaleId: "SC-2", certificateNo: "CAL-1404-1290", issuer: "آزمایشگاه مرجع اوزان (نمونه)", calibratedAt: iso(now - 345 * DAY), validUntil: iso(now + 20 * DAY), testPoints: [0, 10000, 20000, 40000, 60000, 80000].map((ref) => ({ refKg: ref, readKg: ref + int(r, -2, 2) * 20, errorKg: 0 })).map((p) => ({ ...p, errorKg: p.readKg - p.refKg })), maxErrorKg: 40, documentHash: sha256("cal-2") },
    { id: "CAL-0", scaleId: "SC-1", certificateNo: "CAL-1404-0533", issuer: "آزمایشگاه مرجع اوزان (نمونه)", calibratedAt: iso(now - 515 * DAY), validUntil: iso(now - 150 * DAY), testPoints: [], maxErrorKg: 20, documentHash: sha256("cal-0") },
  );
  for (const sc of d.scales) {
    for (let c = 1; c <= sc.loadCells; c++) {
      const bad = sc.id === "SC-1" && c === 6;
      const history = Array.from({ length: 30 }, (_, k) => Math.round((bad ? k * 1.3 : 0) + gauss(r, 0, 3)));
      d.loadCells.push({
        scaleId: sc.id,
        cellNo: c,
        zeroKg: Math.round(gauss(r, 0, 4)),
        driftKg: history[history.length - 1],
        noiseKg: Math.round(range(r, 2, bad ? 14 : 6)),
        temperatureC: Math.round(range(r, 18, 34)),
        voltage: Number(range(r, 9.8, 10.1).toFixed(2)),
        loadSharePct: Number((12.5 + gauss(r, 0, bad ? 2.4 : 0.6)).toFixed(1)),
        status: bad ? "WARN" : "OK",
        history,
      });
    }
  }

  // history
  const external = d.vehicles.filter((v) => !v.internal && v.status === "ACTIVE");
  const internalV = d.vehicles.filter((v) => v.internal);
  const salePermits = d.permits.filter((p) => p.type === "SALE" || p.type === "HAUL");
  const buyPermits = d.permits.filter((p) => p.type === "PURCHASE");
  const trPermits = d.permits.filter((p) => p.type === "TRANSFER");
  const dayCounter: Record<string, number> = {};

  const start = now - 6 * DAY - (now % DAY);
  const hourW = HOUR_WEIGHTS.reduce((a, b) => a + b, 0);
  const visitTimes: number[] = [];
  for (let day = start; day < now; day += DAY) {
    const count = int(r, 78, 96);
    for (let k = 0; k < count; k++) {
      let x = r() * hourW;
      let h = 0;
      while (x > HOUR_WEIGHTS[h]) {
        x -= HOUR_WEIGHTS[h];
        h++;
      }
      // hour h in site-local time → UTC
      const t = day + (h - 3.5) * 3600_000 + r() * 3600_000;
      if (t < now - 70 * MIN && t > start) visitTimes.push(t);
    }
  }
  visitTimes.sort((a, b) => a - b);

  for (const t0 of visitTimes) {
    const roll = r();
    const operation: T.Operation = roll < 0.85 ? "DISPATCH" : roll < 0.95 ? "RECEIVE" : "INTERNAL";
    const vehicle = operation === "INTERNAL" ? pick(r, internalV) : pick(r, external);
    const permitPool = operation === "DISPATCH" ? salePermits : operation === "RECEIVE" ? buyPermits : trPermits;
    const permit = pick(r, permitPool);
    const material = d.materials.find((x) => x.id === permit.materialId)!;
    const driver = d.drivers.find((x) => x.carrierId === vehicle.carrierId && x.status === "ACTIVE") ?? d.drivers[0];
    const vid = id("VS");
    const operator = pick(r, ["U-OP1", "U-OP2"]);
    const guard = pick(r, ["U-GD1", "U-GD2"]);
    const tEnter = t0 + int(r, 1, 3) * MIN;
    const tCall = tEnter + int(r, 2, 16) * MIN;
    const tW1 = tCall + int(r, 1, 2) * MIN;
    const tLoadEnd = tW1 + int(r, 14, 34) * MIN;
    const tW2 = tLoadEnd + int(r, 2, 8) * MIN;
    const tExit = tW2 + int(r, 4, 14) * MIN;
    const tare = Math.round(((vehicle.storedTareKg ?? 16000) + gauss(r, 0, 120)) / 20) * 20;
    const maxNet = vehicle.ratedPayloadKg;
    const net = Math.round(range(r, maxNet * 0.72, maxNet * 1.02) / 20) * 20;
    const gross = tare + net;
    const firstKg = operation === "RECEIVE" ? gross : tare;
    const secondKg = operation === "RECEIVE" ? tare : gross;
    const conf1 = Number(Math.min(0.995, range(r, 0.8, 1)).toFixed(3));
    const shiftCode = shiftOf(new Date(t0));
    const localDay = new Date(t0 + 210 * MIN).toISOString().slice(2, 10).replace(/-/g, "");
    dayCounter[localDay] = (dayCounter[localDay] ?? 0) + 1;
    const ticketNo = `S1-${localDay}-${String(dayCounter[localDay]).padStart(4, "0")}`;
    const txId = id("TX");
    const voided = chance(r, 0.01);
    const overweight = gross > vehicle.maxGvwKg;
    const hold: string[] = [];
    if (overweight) hold.push("R14");
    if (conf1 < 0.85) hold.push("R06");

    // evidence
    const ev = (kind: T.EvidenceKind, stage: T.Evidence["stage"], at: number, loaded: boolean, cameraId?: string) => {
      const seed = int(r, 1, 1e9);
      const e: T.Evidence = { id: id("EV"), kind, cameraId, visitId: vid, transactionId: stage.startsWith("SCALE") ? txId : undefined, stage, capturedAt: iso(at), sha256: evidenceHash(seed, kind, iso(at)), seed, loaded };
      d.evidence.push(e);
      return e.id;
    };
    const loadedIn = operation === "RECEIVE";
    ev("CAM_FRONT", "GATE_IN", t0, loadedIn, "CAM-A-FRONT");
    ev("CAM_REAR", "GATE_IN", t0, loadedIn, "CAM-A-REAR");
    ev("CAM_OVERVIEW", "GATE_IN", t0, loadedIn, "CAM-A-OVR");
    ev("LICENSE_PHOTO", "GATE_IN", t0, loadedIn, "CAM-A-LIC");
    const e1 = [ev("CAM_FRONT", "SCALE_1", tW1, loadedIn, "CAM-B-FRONT"), ev("CAM_REAR", "SCALE_1", tW1, loadedIn, "CAM-B-REAR"), ev("CAM_TOP", "SCALE_1", tW1, loadedIn, "CAM-B-TOP"), ev("CAM_SIDE", "SCALE_1", tW1, loadedIn, "CAM-B-SIDE")];
    const e2 = [ev("CAM_FRONT", "SCALE_2", tW2, !loadedIn, "CAM-C-FRONT"), ev("CAM_REAR", "SCALE_2", tW2, !loadedIn, "CAM-C-REAR"), ev("CAM_TOP", "SCALE_2", tW2, !loadedIn, "CAM-C-TOP"), ev("CAM_SIDE", "SCALE_2", tW2, !loadedIn, "CAM-C-SIDE")];
    ev("CAM_FRONT", "GATE_OUT", tExit, !loadedIn, "CAM-E-FRONT");

    // reads
    const pr1 = id("PR");
    d.plateReads.push({ id: pr1, cameraId: "CAM-A-FRONT", visitId: vid, plateRaw: vehicle.plateNormalized, plateNormalized: vehicle.plateNormalized, confidence: conf1, bbox: [0.42, 0.62, 0.16, 0.06], modelVersion: "anpr-ir-2.4.1", capturedAt: iso(t0), review: conf1 < 0.85 ? "CONFIRMED" : "AUTO" });
    const rf1 = id("RF");
    d.rfidReads.push({ id: rf1, readerId: "RFID-A", epc: vehicle.rfidEpc!, rssi: Number(range(r, -68, -42).toFixed(1)), antenna: int(r, 1, 2), readAt: iso(t0), vehicleId: vehicle.id });
    d.plateReads.push({ id: id("PR"), cameraId: "CAM-E-FRONT", visitId: vid, plateRaw: vehicle.plateNormalized, plateNormalized: vehicle.plateNormalized, confidence: Number(range(r, 0.86, 0.995).toFixed(3)), bbox: [0.42, 0.62, 0.16, 0.06], modelVersion: "anpr-ir-2.4.1", capturedAt: iso(tExit), review: "AUTO" });

    // weigh events
    const w1: T.WeighEvent = { id: id("WE"), transactionId: txId, scaleId: "SC-1", seq: 1, pass: "FIRST", weightKg: firstKg, stable: true, fresh: true, ageMs: int(r, 200, 1800), positionOk: true, captureMethod: "SENSOR", rawFrame: indicatorFrame(firstKg, true), rawHash: sha256(`${firstKg}|${tW1}`), capturedAt: iso(tW1), operatorId: operator, evidenceIds: e1 };
    const manual = chance(r, 0.015);
    const w2: T.WeighEvent = { id: id("WE"), transactionId: txId, scaleId: chance(r, 0.15) ? "SC-1" : "SC-2", seq: 2, pass: "SECOND", weightKg: secondKg, stable: true, fresh: true, ageMs: int(r, 200, 1800), positionOk: true, captureMethod: manual ? "MANUAL" : "SENSOR", manualReason: manual ? "قطع موقت ارتباط indicator" : undefined, secondSigner: manual ? "U-MGR" : undefined, rawFrame: indicatorFrame(secondKg, true), rawHash: sha256(`${secondKg}|${tW2}`), capturedAt: iso(tW2), operatorId: operator, evidenceIds: e2 };
    d.weighEvents.push(w1, w2);

    const deduction = chance(r, 0.08) ? int(r, 1, 6) * 50 : 0;
    const status: T.TxState = voided ? "VOIDED" : "APPROVED";
    const tx: T.Transaction = {
      id: txId,
      ticketNo,
      verifyCode: sha256(txId).slice(0, 10).toUpperCase(),
      visitId: vid,
      siteId: "S1",
      vehicleId: vehicle.id,
      driverId: driver.id,
      carrierId: vehicle.carrierId,
      customerId: permit.customerId,
      materialId: material.id,
      permitId: permit.id,
      originId: permit.originId,
      destinationId: permit.destinationId,
      operation,
      state: status,
      firstWeighId: w1.id,
      secondWeighId: w2.id,
      extraWeighIds: [],
      grossKg: gross,
      tareKg: tare,
      netKg: net,
      deductionKg: deduction,
      deductionReason: deduction ? "رطوبت/ضایعات مجاز" : undefined,
      billableKg: net - deduction,
      tareSource: "MEASURED",
      holdReasons: hold,
      version: voided ? 2 : 1,
      revisions: voided ? [{ version: 2, at: iso(tExit + 30 * MIN), by: "U-MGR", reason: "ابطال به درخواست مشتری — صدور مجدد", changes: { state: ["APPROVED", "VOIDED"] } }] : [],
      printCount: chance(r, 0.1) ? 2 : 1,
      createdBy: operator,
      approvedBy: hold.length ? "U-MGR" : operator,
      createdAt: iso(tW1),
      approvedAt: iso(tW2 + 2 * MIN),
      erpStatus: operation === "INTERNAL" ? "N/A" : chance(r, 0.03) ? "FAILED" : "SENT",
      lidarScanIds: [],
      qcStatus: material.requiresQc ? "APPROVED" : "NOT_REQUIRED",
      shiftCode: shiftOf(new Date(tW1)),
    };

    // lidar & payload
    if (operation !== "RECEIVE" && chance(r, 0.7)) {
      const seed = int(r, 1, 1e9);
      const vol = (net / material.densityKgM3) * range(r, 0.94, 1.07);
      const ls: T.LidarScan = { id: id("LS"), visitId: vid, vehicleId: vehicle.id, transactionId: txId, kind: "LOADED", volumeM3: Number(vol.toFixed(2)), quality: Number(range(r, 0.82, 0.99).toFixed(2)), offCenterPct: Number(Math.abs(gauss(r, 0, 6)).toFixed(1)), peakHeightM: Number(range(r, 3.6, 4.3).toFixed(2)), carrybackM3: 0, covered: chance(r, 0.6), capturedAt: iso(tLoadEnd + MIN), seed };
      d.lidarScans.push(ls);
      tx.lidarScanIds.push(ls.id);
      tx.volumeM3 = ls.volumeM3;
      tx.estimatedMassKg = Math.round(ls.volumeM3 * material.densityKgM3);
    }
    if (operation !== "RECEIVE" && chance(r, 0.6)) {
      const eq = pick(r, d.equipment.filter((e) => e.type !== "EXCAVATOR"));
      const target = net;
      const payload = Math.round(target * range(r, 0.93, 1.07));
      const n = Math.max(2, Math.round(payload / eq.ratedBucketKg));
      const buckets = Array.from({ length: n }, () => payload / n).map((b) => Math.round(b * range(r, 0.9, 1.1)));
      d.payloadEvents.push({ id: id("PE"), equipmentId: eq.id, visitId: vid, vehicleId: vehicle.id, buckets, payloadKg: buckets.reduce((a, b) => a + b, 0), targetKg: target, at: iso(tLoadEnd) });
      tx.payloadKg = buckets.reduce((a, b) => a + b, 0);
    }
    // uvss
    const uv: T.UvssScan = { id: id("UV"), visitId: vid, vehicleId: vehicle.id, capturedAt: iso(t0), referenceMatchPct: Number(range(r, 91, 99.5).toFixed(1)), status: "CLEAR", anomalies: [], seed: int(r, 1, 1e9) };
    d.uvssScans.push(uv);

    // gate events
    const ge = (laneCode: T.Lane["code"], type: T.GateEventType, at: number, extra: Partial<T.GateEvent> = {}) => d.gateEvents.push({ id: id("GE"), visitId: vid, laneCode, type, at: iso(at), ...extra });
    ge("A", "ARRIVE", t0);
    ge("A", "DECISION", t0 + 20_000, { decision: "PASS", trace: [{ step: "SAFETY", result: "OK" }, { step: "IDENTITY", result: "OK", code: "MATCH" }, { step: "DOCUMENTS", result: "OK" }, { step: "PERMIT", result: "OK" }, { step: "ALERTS", result: "OK" }], actorId: conf1 < 0.85 ? guard : undefined });
    ge("A", "OPEN_REQUEST", t0 + 22_000);
    ge("A", "OPEN_CONFIRMED", t0 + 24_000);
    ge("E", "DECISION", tExit - 30_000, { decision: "PASS", actorId: guard });
    ge("E", "OPEN_REQUEST", tExit - 28_000);
    ge("E", "OPEN_CONFIRMED", tExit - 26_000);
    ge("E", "EXIT", tExit);

    const ep: T.ExitPermit = { id: id("EP"), serial: `EX-${ticketNo.slice(3)}`, visitId: vid, transactionIds: [txId], token: sha256(`ep-${vid}`).slice(0, 24), status: "CONSUMED", empty: false, approvedBy: operator, approvedAt: iso(tW2 + 3 * MIN), consumedAt: iso(tExit - 30_000), consumedBy: guard, scans: [{ at: iso(tExit - 30_000), by: guard, result: "ACCEPTED" }] };
    d.exitPermits.push(ep);

    const visit: T.Visit = {
      id: vid,
      siteId: "S1",
      vehicleId: vehicle.id,
      driverId: driver.id,
      permitId: permit.id,
      state: "EXITED",
      arrivedAt: iso(t0),
      enteredAt: iso(tEnter),
      exitedAt: iso(tExit),
      queueNo: int(r, 1, 60),
      queueJoinedAt: iso(tEnter),
      calledAt: iso(tCall),
      driverToken: sha256(`drv-${vid}`).slice(0, 16),
      identity: { anpr: { plate: vehicle.plateNormalized, confidence: conf1, readId: pr1 }, rfid: { epc: vehicle.rfidEpc!, rssi: -55, readId: rf1 }, match: "MATCH" },
      transactionIds: [txId],
      exitPermitId: ep.id,
      shiftCode,
      internal: operation === "INTERNAL",
      operation,
      holdReasons: [],
      uvssScanId: uv.id,
    };
    d.visits.push(visit);
    d.transactions.push(tx);

    if (!voided) {
      permit.consumedKg += net;
      permit.tripsUsed += 1;
      d.ledger.push({ id: id("PL"), permitId: permit.id, transactionId: txId, kind: "COMMIT", kg: net, at: tx.approvedAt!, by: operator });
    }

    // audit
    auditAt(t0, "visit.arrived", "Visit", vid, "RFID-A", { plate: vehicle.plateNormalized });
    auditAt(t0 + 20_000, "gate.decision", "Visit", vid, conf1 < 0.85 ? guard : "system", { decision: "PASS" });
    auditAt(tW1, "weigh.captured", "WeighEvent", w1.id, operator, { kg: firstKg, pass: "FIRST" });
    auditAt(tW2, "weigh.captured", "WeighEvent", w2.id, operator, { kg: secondKg, pass: "SECOND", method: w2.captureMethod });
    auditAt(tW2 + 2 * MIN, "tx.approved", "Transaction", txId, tx.approvedBy, { netKg: net, ticketNo });
    auditAt(tW2 + 3 * MIN, "exit.issued", "ExitPermit", ep.id, operator);
    auditAt(tExit - 30_000, "exit.consumed", "ExitPermit", ep.id, guard);
    if (voided) auditAt(tExit + 30 * MIN, "tx.voided", "Transaction", txId, "U-MGR", { reason: "customer request" });

    // outbox
    if (operation !== "INTERNAL") {
      d.outbox.push({ id: id("OB"), channel: "ERP", topic: "weigh-ticket.approved", entityId: txId, body: JSON.stringify({ ticketNo, netKg: net, customer: permit.customerId, material: material.code }), status: tx.erpStatus === "FAILED" ? (chance(r, 0.3) ? "DEAD" : "FAILED") : "SENT", attempts: tx.erpStatus === "FAILED" ? int(r, 2, 5) : 1, idempotencyKey: `ERP:weigh-ticket.approved:${txId}`, lastError: tx.erpStatus === "FAILED" ? "HTTP 503 — ERP gateway unavailable" : undefined, createdAt: iso(tW2 + 2 * MIN) });
    }
    if (t0 > now - DAY) {
      d.outbox.push({ id: id("OB"), channel: "SMS", topic: "driver.link", entityId: vid, recipient: driver.phone, body: `راننده گرامی، نوبت شما ثبت شد. وضعیت سفر: /d/${visit.driverToken}`, status: "SENT", attempts: 1, idempotencyKey: `SMS:driver.link:${vid}`, createdAt: iso(tEnter) });
    }

    // historical alerts
    if (overweight || conf1 < 0.85) {
      const code = overweight ? "R14" : "R06";
      const rule = d.rules.find((x) => x.code === code)!;
      d.alerts.push({ id: id("AL"), ruleCode: code, severity: rule.severity, status: "RESOLVED", title: rule.name, titleEn: rule.nameEn, visitId: vid, transactionId: txId, laneCode: overweight ? "C" : "A", openedAt: iso(overweight ? tW2 : t0), ackBy: overweight ? "U-MGR" : guard, ackAt: iso((overweight ? tW2 : t0) + 2 * MIN), resolvedAt: iso((overweight ? tW2 : t0) + 9 * MIN), resolution: overweight ? "تخلیه مازاد و توزین مجدد" : "پلاک توسط نگهبان تأیید شد", slaDueAt: iso((overweight ? tW2 : t0) + SLA_MINUTES[rule.severity] * MIN), evidenceIds: [] });
    }
  }

  // finalize permits: allowed = consumed + remaining
  d.permits.forEach((p, i) => {
    const remainingT = i === 2 || i === 11 ? int(r, 20, 45) : int(r, 300, 3000);
    p.allowedKg = Math.ceil((p.consumedKg + remainingT * 1000) / 1000) * 1000;
    if (i === 20) p.maxTrips = p.tripsUsed + 40;
  });
  d.contracts.forEach((c) => {
    c.deliveredKg = d.permits.filter((p) => p.contractId === c.id).reduce((s, p) => s + p.consumedKg, 0);
    c.totalKg = Math.max(c.totalKg, Math.ceil((c.deliveredKg * 1.4) / 1e6) * 1e6);
  });

  // device / misc alerts (history + open)
  const devAlert = (code: string, status: T.AlertStatus, minsAgo: number, deviceId: string, laneCode?: T.Lane["code"], detail?: string) => {
    const rule = d.rules.find((x) => x.code === code)!;
    const at = now - minsAgo * MIN;
    d.alerts.push({ id: id("AL"), ruleCode: code, severity: rule.severity, status, title: rule.name, titleEn: rule.nameEn, deviceId, laneCode, detail, openedAt: iso(at), ackBy: status !== "OPEN" ? "U-MNT" : undefined, ackAt: status !== "OPEN" ? iso(at + 4 * MIN) : undefined, resolvedAt: status === "RESOLVED" ? iso(at + 30 * MIN) : undefined, resolution: status === "RESOLVED" ? "اتصال برقرار شد" : undefined, slaDueAt: iso(at + SLA_MINUTES[rule.severity] * MIN), evidenceIds: [] });
  };
  devAlert("R04", "RESOLVED", 60 * 30, "IND-2", "C", "قطع ارتباط TCP به مدت ۴ دقیقه");
  devAlert("R24", "RESOLVED", 60 * 50, "CAM-B-TOP", "B", "فریم کهنه ۹ ثانیه");
  devAlert("R28", "ACK", 60 * 5, "JB-1", "B", "لودسل شماره ۶: نویز بالاتر از پایه");
  devAlert("R27", "OPEN", 90, "JB-1", "B", "رانش صفر لودسل ۶ رو به افزایش");
  devAlert("R26", "OPEN", 45, "IND-2", "C", "گواهی SC-2 کمتر از ۳۰ روز اعتبار دارد");
  devAlert("R37", "RESOLVED", 60 * 70, "EDGE-1", undefined, "قطع WAN ۲۲ دقیقه — همگام‌سازی کامل شد");

  // fraud cases
  const someTx = (n: number) => d.transactions.slice(-200).filter((_, i) => i % 37 === n).slice(0, 3).map((t) => t.id);
  const fv = d.transactions[d.transactions.length - 50];
  d.fraudCases.push(
    { id: "FC-1", kind: "TARE_OUTLIER", title: "تارای غیرعادی — ۸۴۰ کیلوگرم کمتر از میانه ۱۰ توزین اخیر", titleEn: "Tare 840 kg below median of last 10", transactionIds: someTx(1), vehicleId: fv?.vehicleId, score: 0.78, status: "NEW", notes: "", data: [16420, 16480, 16380, 16460, 16500, 16440, 16410, 16470, 16450, 15620], openedAt: iso(now - 3 * 3600_000) },
    { id: "FC-2", kind: "REPEAT_NET", title: "خالص یکسان ۲۸٬۴۰۰ کیلوگرم در ۳ سفر یک روز", titleEn: "Identical net 28,400 kg on 3 trips in one day", transactionIds: someTx(2), score: 0.64, status: "REVIEWING", notes: "در حال بررسی با واحد بارگیری", data: [28400, 28400, 28400], openedAt: iso(now - 26 * 3600_000) },
    { id: "FC-3", kind: "IMPOSSIBLE_TRIP", title: "یک پلاک در دروازه ورود و باسکول ۲ با فاصله ۳ دقیقه", titleEn: "Same plate at gate and scale 2 within 3 min", transactionIds: someTx(3), score: 0.86, status: "NEW", notes: "", data: [3, 8], openedAt: iso(now - 5 * 3600_000) },
    { id: "FC-4", kind: "MANUAL_RATE", title: "نرخ ثبت دستی اپراتور ۱۴٪ (پایه ۲٪)", titleEn: "Operator manual entry rate 14% (baseline 2%)", transactionIds: someTx(4), operatorId: "U-OP2", score: 0.55, status: "FALSE_POSITIVE", notes: "قطعی indicator باسکول ۲ در آن روز — تأیید تعمیرات", data: [2, 3, 2, 14, 2, 1, 2], openedAt: iso(now - 72 * 3600_000) },
  );

  // fleet cycles for internal tippers (today's shifts)
  const shiftStart = now - 8 * 3600_000;
  for (const v of internalV) {
    let t = shiftStart + int(r, 0, 20) * MIN;
    while (t < now - 40 * MIN) {
      const c: T.FleetCycle = { id: id("FC"), vehicleId: v.id, shiftCode: shiftOf(new Date(t)), start: iso(t), loadMin: Number(range(r, 3, 7).toFixed(1)), haulMin: Number(range(r, 8, 14).toFixed(1)), queueMin: Number(Math.max(0, gauss(r, 4, 3)).toFixed(1)), dumpMin: Number(range(r, 1.5, 3).toFixed(1)), returnMin: Number(range(r, 6, 11).toFixed(1)), payloadKg: Math.round(range(r, 15500, 19500)), equipmentId: pick(r, ["EQ-L1", "EQ-L2", "EQ-S1"]) };
      d.fleetCycles.push(c);
      t += (c.loadMin + c.haulMin + c.queueMin + c.dumpMin + c.returnMin) * MIN;
    }
  }

  // bookings today
  const active = d.permits.filter((p) => p.status === "ACTIVE" && p.type !== "TRANSFER");
  const slot0 = Math.ceil(now / (30 * MIN)) * 30 * MIN;
  for (let i = 0; i < 18; i++) {
    const v = external[(i * 3) % external.length];
    d.bookings.push({ id: id("BK"), permitId: active[i % active.length].id, vehicleId: v.id, driverId: d.drivers.find((x) => x.carrierId === v.carrierId)!.id, slotStart: iso(slot0 + Math.floor(i / 2) * 30 * MIN), slotEnd: iso(slot0 + (Math.floor(i / 2) + 1) * 30 * MIN), status: "BOOKED" });
  }

  // sanity: hour helper used to keep tree-shaking honest
  void siteHour;
  return d;
}
