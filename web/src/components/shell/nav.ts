import {
  Activity,
  AlertTriangle,
  BarChart3,
  Boxes,
  Cable,
  Camera,
  ClipboardCheck,
  Cpu,
  FileText,
  Gauge,
  HardDrive,
  LayoutDashboard,
  ListOrdered,
  Map,
  MonitorPlay,
  Mountain,
  Receipt,
  ScanLine,
  ScanQrCode,
  Scale,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Truck,
  Users,
  Wallet,
  Wrench,
  type LucideIcon,
  BellRing,
  FlaskConical,
  Box,
  DoorOpen,
} from "lucide-react";

export interface NavItem {
  href: string;
  fa: string;
  en: string;
  icon: LucideIcon;
  badge?: "alerts" | "queue" | "holds";
}
export interface NavGroup {
  fa: string;
  en: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    fa: "عملیات",
    en: "Operations",
    items: [
      { href: "/app", fa: "داشبورد", en: "Dashboard", icon: LayoutDashboard },
      { href: "/app/live", fa: "اتاق کنترل زنده", en: "Live control room", icon: MonitorPlay },
      { href: "/app/gate", fa: "دروازه / حراست", en: "Gate / security", icon: DoorOpen, badge: "holds" },
      { href: "/app/weighing", fa: "ایستگاه توزین", en: "Weighing station", icon: Scale },
      { href: "/app/scan", fa: "مرکز اسکن", en: "Scan center", icon: ScanLine },
      { href: "/app/queue", fa: "صف و نوبت", en: "Queue & booking", icon: ListOrdered, badge: "queue" },
    ],
  },
  {
    fa: "اسناد",
    en: "Documents",
    items: [
      { href: "/app/transactions", fa: "تراکنش‌ها و تیکت‌ها", en: "Transactions & tickets", icon: Receipt },
      { href: "/app/exit-permits", fa: "مجوزهای خروج", en: "Exit permits", icon: ClipboardCheck },
      { href: "/app/guard", fa: "اسکن حراست (موبایل)", en: "Guard scanner (mobile)", icon: ScanQrCode },
      { href: "/app/permits", fa: "حواله‌ها و قراردادها", en: "Permits & contracts", icon: FileText },
    ],
  },
  {
    fa: "کنترل",
    en: "Control",
    items: [
      { href: "/app/alerts", fa: "مرکز هشدار", en: "Alerts center", icon: AlertTriangle, badge: "alerts" },
      { href: "/app/fraud", fa: "بازبینی تقلب", en: "Fraud review", icon: ShieldAlert },
      { href: "/app/audit", fa: "ردپای ممیزی", en: "Audit trail", icon: ShieldCheck },
    ],
  },
  {
    fa: "تولید معدنی",
    en: "Mine production",
    items: [
      { href: "/app/modules/lidar", fa: "حجم‌سنجی LiDAR", en: "LiDAR volume", icon: Box },
      { href: "/app/modules/payload", fa: "Payload لودر/شاول", en: "Loader payload", icon: Mountain },
      { href: "/app/modules/fleet", fa: "KPI ناوگان", en: "Fleet KPIs", icon: Activity },
    ],
  },
  {
    fa: "نگهداری",
    en: "Maintenance",
    items: [
      { href: "/app/devices", fa: "تجهیزات و سلامت", en: "Devices & health", icon: Wrench },
      { href: "/app/hardware", fa: "کاتالوگ سخت‌افزار", en: "Hardware catalog", icon: Camera },
      { href: "/app/site-map", fa: "نقشه سایت", en: "Site map", icon: Map },
    ],
  },
  {
    fa: "مدیریت",
    en: "Management",
    items: [
      { href: "/app/reports", fa: "گزارش‌ها", en: "Reports", icon: BarChart3 },
      { href: "/app/billing", fa: "صورت‌حساب", en: "Billing", icon: Wallet },
      { href: "/app/masters", fa: "اطلاعات پایه", en: "Master data", icon: Boxes },
      { href: "/app/integrations", fa: "یکپارچه‌سازی ERP", en: "Integrations", icon: Cable },
      { href: "/app/notifications", fa: "پیامک و اعلان‌ها", en: "SMS & notifications", icon: BellRing },
      { href: "/app/admin", fa: "مدیریت سامانه", en: "Administration", icon: Settings },
      { href: "/app/simulator", fa: "کنسول شبیه‌ساز", en: "Simulator console", icon: Cpu },
    ],
  },
];

export const DISPLAY_LINKS = [
  { href: "/display/B", fa: "مانیتور راننده — باسکول ۱", en: "Driver display — scale 1", icon: MonitorPlay },
  { href: "/display/queue", fa: "تابلو فراخوان صف", en: "Queue call board", icon: ListOrdered },
  { href: "/kiosk/B", fa: "کیوسک راننده", en: "Driver kiosk", icon: HardDrive },
  { href: "/d", fa: "پورتال موبایل راننده", en: "Driver mobile portal", icon: Smartphone },
  { href: "/wallboard", fa: "Wallboard", en: "Wallboard", icon: Gauge },
  { href: "/", fa: "سایت معرفی", en: "Marketing site", icon: Truck },
];

export const EXTRA_ICONS = { Users, FlaskConical };
