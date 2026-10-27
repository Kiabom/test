// Client-safe copy of demo users (mirrors server/seed USERS).
import type { User } from "@/domain/types";

export const USERS_LIST: User[] = [
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

export const userName = (id: string | undefined, locale: "fa" | "en") => {
  if (!id) return "—";
  if (id === "system") return locale === "fa" ? "سامانه" : "System";
  const u = USERS_LIST.find((x) => x.id === id);
  return u ? (locale === "fa" ? u.name : u.nameEn) : id;
};
