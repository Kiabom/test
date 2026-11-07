// Client-safe copy of the site's user accounts (mirrors server/seed USERS).
import type { User } from "@/domain/types";

export const USERS_LIST: User[] = [
  { id: "U-ADMIN", name: "مهدی صدری", nameEn: "Mahdi Sadri", role: "system_admin", personnelNo: "140101" },
  { id: "U-MGR", name: "علیرضا فرهمند", nameEn: "Alireza Farahmand", role: "site_manager", personnelNo: "140102" },
  { id: "U-OP1", name: "سارا امینی", nameEn: "Sara Amini", role: "scale_operator", personnelNo: "140215" },
  { id: "U-OP2", name: "کامران نیک‌نام", nameEn: "Kamran Niknam", role: "scale_operator", personnelNo: "140216" },
  { id: "U-GD1", name: "جمشید پاکزاد", nameEn: "Jamshid Pakzad", role: "gate_guard", personnelNo: "140331" },
  { id: "U-GD2", name: "بهرام شجاعی", nameEn: "Bahram Shojaei", role: "gate_guard", personnelNo: "140332" },
  { id: "U-LOG", name: "نرگس توکلی", nameEn: "Narges Tavakoli", role: "logistics", personnelNo: "140408" },
  { id: "U-SAL", name: "پیمان رستمی", nameEn: "Peyman Rostami", role: "sales", personnelNo: "140412" },
  { id: "U-QC", name: "لیلا مختاری", nameEn: "Leila Mokhtari", role: "qc", personnelNo: "140520" },
  { id: "U-MNT", name: "رضا اکبری", nameEn: "Reza Akbari", role: "maintenance", personnelNo: "140544" },
  { id: "U-AUD", name: "مریم وحیدی", nameEn: "Maryam Vahidi", role: "auditor", personnelNo: "140603" },
  { id: "U-FLT", name: "امید کیانی", nameEn: "Omid Kiani", role: "fleet_manager", personnelNo: "140417" },
  { id: "U-FIN", name: "حمید ملکی", nameEn: "Hamid Maleki", role: "finance", personnelNo: "140610" },
];

export const userName = (id: string | undefined, locale: "fa" | "en") => {
  if (!id) return "—";
  if (id === "system") return locale === "fa" ? "سامانه" : "System";
  const u = USERS_LIST.find((x) => x.id === id);
  return u ? (locale === "fa" ? u.name : u.nameEn) : id;
};
