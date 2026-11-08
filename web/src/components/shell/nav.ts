import {
  Activity,
  AlertTriangle,
  BarChart3,
  Boxes,
  Cable,
  Camera,
  ClipboardCheck,
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
  Users,
  Wallet,
  Wrench,
  type LucideIcon,
  BellRing,
  FlaskConical,
  Box,
  DoorOpen,
  Globe2,
  Workflow,
  BookOpen,
} from "lucide-react";

export interface NavItem {
  href: string;
  fa: string;
  en: string;
  icon: LucideIcon;
  badge?: "alerts" | "queue" | "holds";
  /** feature still in development: labelled «(در دست توسعه)» */
  dev?: boolean;
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
      { href: "/app/process", fa: "فرآیند و مراحل", en: "Process & steps", icon: Workflow },
      { href: "/app/live", fa: "اتاق کنترل زنده", en: "Live control room", icon: MonitorPlay, dev: true },
      { href: "/app/map", fa: "نقشه ناوگان و رویدادها", en: "Fleet & events map", icon: Globe2, dev: true },
      { href: "/app/gate", fa: "دروازه / حراست", en: "Gate / security", icon: DoorOpen, badge: "holds" },
      { href: "/app/weighing", fa: "ایستگاه توزین", en: "Weighing station", icon: Scale },
      { href: "/app/scan", fa: "مرکز اسکن", en: "Scan center", icon: ScanLine, dev: true },
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
      { href: "/app/modules/lidar", fa: "حجم‌سنجی LiDAR", en: "LiDAR volume", icon: Box, dev: true },
      { href: "/app/modules/payload", fa: "Payload لودر/شاول", en: "Loader payload", icon: Mountain, dev: true },
      { href: "/app/modules/fleet", fa: "KPI ناوگان", en: "Fleet KPIs", icon: Activity },
    ],
  },
  {
    fa: "نگهداری",
    en: "Maintenance",
    items: [
      { href: "/app/devices", fa: "تجهیزات و سلامت", en: "Devices & health", icon: Wrench },
      { href: "/app/hardware", fa: "کاتالوگ سخت‌افزار", en: "Hardware catalog", icon: Camera, dev: true },
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
      { href: "/app/integrations", fa: "یکپارچه‌سازی ERP", en: "Integrations", icon: Cable, dev: true },
      { href: "/app/notifications", fa: "پیامک و اعلان‌ها", en: "SMS & notifications", icon: BellRing },
      { href: "/app/admin", fa: "مدیریت سامانه", en: "Administration", icon: Settings },
    ],
  },
];

export const DISPLAY_LINKS = [
  { href: "/d/guide", fa: "راهنمای راننده", en: "Driver guide", icon: BookOpen },
  { href: "/display/B", fa: "مانیتور راننده — باسکول ۱", en: "Driver display — scale 1", icon: MonitorPlay },
  { href: "/display/queue", fa: "تابلو فراخوان صف", en: "Queue call board", icon: ListOrdered },
  { href: "/kiosk/B", fa: "کیوسک راننده", en: "Driver kiosk", icon: HardDrive },
  { href: "/d", fa: "پورتال موبایل راننده", en: "Driver mobile portal", icon: Smartphone },
  { href: "/wallboard", fa: "Wallboard", en: "Wallboard", icon: Gauge },
];

export const EXTRA_ICONS = { Users, FlaskConical };

/** Routes whose features are still in development. */
export const DEV_ROUTES = NAV.flatMap((g) => g.items).filter((i) => i.dev).map((i) => i.href);
export const IN_DEV = ["در دست توسعه", "In development"] as const;
