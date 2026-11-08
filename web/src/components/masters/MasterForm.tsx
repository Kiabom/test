"use client";
import { useState } from "react";
import { Button, Field, Input, Select, toast } from "@/components/ui";
import { ERRORS, lbl } from "@/i18n/labels";
import { act, ActionError, type Masters } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";

export type MasterCol = "vehicles" | "drivers" | "carriers" | "customers" | "materials" | "locations";
type FType = "text" | "number" | "date" | "bool" | "select" | "color";
interface FieldDef {
  k: string;
  fa: string;
  en: string;
  t: FType;
  opts?: (m: Masters | null, locale: "fa" | "en") => { v: string; l: string }[];
  ltr?: boolean;
  hint?: [string, string];
  req?: boolean;
}
const nm = (locale: "fa" | "en") => (x: { name: string; nameEn?: string }) => (locale === "fa" ? x.name : x.nameEn ?? x.name);
const status = (vals: string[], fa: string[]) => () => vals.map((v, i) => ({ v, l: fa[i] }));

export const FIELDS: Record<MasterCol, FieldDef[]> = {
  vehicles: [
    { k: "rfidEpc", fa: "تگ RFID خودرو", en: "Vehicle RFID tag", t: "text", ltr: true, hint: ["کد EPC روی شیشه یا بدنه", "EPC on the windscreen or body"] },
    { k: "plateText", fa: "پلاک (اختیاری)", en: "Plate (optional)", t: "text" },
    { k: "type", fa: "نوع", en: "Type", t: "select", opts: status(["TRAILER", "TIPPER", "HAUL_TRUCK"], ["تریلی", "کمپرسی", "دامپتراک معدنی"]) },
    { k: "axles", fa: "تعداد محور", en: "Axles", t: "number" },
    { k: "ratedPayloadKg", fa: "ظرفیت بار (kg)", en: "Rated payload (kg)", t: "number" },
    { k: "maxGvwKg", fa: "حداکثر وزن کل (kg)", en: "Max GVW (kg)", t: "number" },
    { k: "storedTareKg", fa: "تارای ذخیره (kg)", en: "Stored tare (kg)", t: "number" },
    { k: "tareValidUntil", fa: "اعتبار تارا تا", en: "Tare valid until", t: "date" },
    { k: "carrierId", fa: "شرکت حمل", en: "Carrier", t: "select", opts: (m, l) => (m?.carriers ?? []).map((c) => ({ v: c.id, l: nm(l)(c) })) },
    { k: "insuranceUntil", fa: "بیمه تا", en: "Insurance until", t: "date" },
    { k: "inspectionUntil", fa: "معاینه فنی تا", en: "Inspection until", t: "date" },
    { k: "internal", fa: "ناوگان داخلی معدن", en: "Internal fleet", t: "bool" },
    { k: "status", fa: "وضعیت", en: "Status", t: "select", opts: status(["ACTIVE", "BLOCKED"], ["فعال", "مسدود"]) },
  ],
  drivers: [
    { k: "name", fa: "نام و نام خانوادگی", en: "Full name (fa)", t: "text", req: true },
    { k: "nameEn", fa: "نام لاتین", en: "Full name (en)", t: "text", ltr: true },
    { k: "rfidTag", fa: "تگ RFID کارت راننده", en: "Driver card RFID tag", t: "text", ltr: true },
    { k: "nationalIdMasked", fa: "کد ملی", en: "National ID", t: "text", ltr: true },
    { k: "licenseNo", fa: "شماره گواهینامه", en: "Licence no.", t: "text", ltr: true },
    { k: "licenseUntil", fa: "اعتبار گواهینامه تا", en: "Licence valid until", t: "date" },
    { k: "phone", fa: "موبایل", en: "Mobile", t: "text", ltr: true },
    { k: "carrierId", fa: "شرکت حمل", en: "Carrier", t: "select", opts: (m, l) => (m?.carriers ?? []).map((c) => ({ v: c.id, l: nm(l)(c) })) },
    { k: "status", fa: "وضعیت", en: "Status", t: "select", opts: status(["ACTIVE", "BLOCKED"], ["فعال", "مسدود"]) },
  ],
  carriers: [
    { k: "name", fa: "نام شرکت", en: "Name (fa)", t: "text", req: true },
    { k: "nameEn", fa: "نام لاتین", en: "Name (en)", t: "text", ltr: true },
    { k: "regNo", fa: "شماره ثبت", en: "Reg. no", t: "text", ltr: true },
    { k: "phone", fa: "تلفن", en: "Phone", t: "text", ltr: true },
    { k: "status", fa: "وضعیت", en: "Status", t: "select", opts: status(["ACTIVE", "SUSPENDED"], ["فعال", "تعلیق"]) },
  ],
  customers: [
    { k: "name", fa: "نام", en: "Name (fa)", t: "text", req: true },
    { k: "nameEn", fa: "نام لاتین", en: "Name (en)", t: "text", ltr: true },
    { k: "type", fa: "نوع", en: "Type", t: "select", opts: status(["CUSTOMER", "SUPPLIER"], ["مشتری", "تأمین‌کننده"]) },
    { k: "city", fa: "شهر", en: "City", t: "text" },
    { k: "erpCode", fa: "کد ERP", en: "ERP code", t: "text", ltr: true },
    { k: "creditLimit", fa: "سقف اعتبار (ریال)", en: "Credit limit (IRR)", t: "number" },
  ],
  materials: [
    { k: "name", fa: "نام ماده", en: "Name (fa)", t: "text", req: true },
    { k: "nameEn", fa: "نام لاتین", en: "Name (en)", t: "text", ltr: true },
    { k: "code", fa: "کد", en: "Code", t: "text", ltr: true },
    { k: "grade", fa: "عیار / گرید", en: "Grade", t: "text" },
    { k: "densityKgM3", fa: "چگالی توده‌ای (kg/m³)", en: "Bulk density (kg/m³)", t: "number" },
    { k: "pricePerTon", fa: "قیمت هر تن (ریال)", en: "Price per t (IRR)", t: "number" },
    { k: "color", fa: "رنگ نمایش", en: "Colour", t: "color" },
    { k: "requiresQc", fa: "نیازمند آزمایشگاه (QC)", en: "QC required", t: "bool" },
    { k: "internalOnly", fa: "فقط جابه‌جایی داخلی", en: "Internal only", t: "bool" },
  ],
  locations: [
    { k: "name", fa: "نام", en: "Name (fa)", t: "text", req: true },
    { k: "nameEn", fa: "نام لاتین", en: "Name (en)", t: "text", ltr: true },
    { k: "type", fa: "نوع", en: "Type", t: "select", opts: status(["PIT", "STOCKPILE", "CRUSHER", "PLANT", "DUMP", "EXTERNAL"], ["پیت استخراج", "دپو", "سنگ‌شکن", "کارخانه فرآوری", "دامپ باطله", "خارج از سایت"]) },
    { k: "capacityT", fa: "ظرفیت (تن) — برای دپو", en: "Capacity (t) — stockpiles", t: "number" },
    { k: "openingT", fa: "موجودی اولیه (تن) — برای دپو", en: "Opening balance (t) — stockpiles", t: "number" },
    { k: "materialId", fa: "ماده دپو", en: "Stockpile material", t: "select", opts: (m, l) => [{ v: "", l: "—" }, ...(m?.materials ?? []).map((x) => ({ v: x.id, l: nm(l)(x) }))] },
  ],
};

export const TITLE: Record<MasterCol, [string, string]> = {
  vehicles: ["خودرو", "vehicle"],
  drivers: ["راننده", "driver"],
  carriers: ["حمل‌کننده", "carrier"],
  customers: ["مشتری / تأمین‌کننده", "customer / supplier"],
  materials: ["ماده", "material"],
  locations: ["مبدأ / مقصد", "location"],
};

const toInput = (t: FType, v: unknown) => (v == null ? "" : t === "date" ? String(v).slice(0, 10) : t === "bool" ? (v ? "1" : "") : String(v));

/** Create / edit form for one master-data record. Only the fields marked required must be filled. */
export function MasterForm({ col, item, masters, onDone }: { col: MasterCol; item?: Record<string, unknown>; masters: Masters | null; onDone: () => void }) {
  const L = useL();
  const locale = useLocale();
  const defs = FIELDS[col];
  const [val, setVal] = useState<Record<string, string>>(() => Object.fromEntries(defs.map((f) => [f.k, toInput(f.t, item?.[f.k] ?? (col === "vehicles" && f.k === "plateText" ? (item?.plateNormalized as string) : undefined)) || (f.t === "select" && !item ? (f.opts?.(masters, locale)[0]?.v ?? "") : "")])));
  const [busy, setBusy] = useState(false);
  const missing = defs.filter((f) => f.req && !val[f.k]?.trim());
  const submit = async () => {
    const data: Record<string, unknown> = {};
    for (const f of defs) {
      const v = val[f.k];
      if (f.t === "bool") data[f.k] = !!v;
      else if (v === "" || v == null) continue;
      else if (f.t === "number") data[f.k] = Number(v);
      else if (f.t === "date") data[f.k] = new Date(v + "T12:00:00Z").toISOString();
      else data[f.k] = v.trim();
    }
    setBusy(true);
    try {
      if (item) await act("master.update", { collection: col, id: item.id, patch: data });
      else await act("master.create", { collection: col, data });
      toast.success(item ? L("ذخیره شد (در ردپای ممیزی ثبت شد)", "Saved (audited)") : L("اضافه شد (در ردپای ممیزی ثبت شد)", "Added (audited)"));
      onDone();
    } catch (e) {
      toast.error(e instanceof ActionError ? lbl(ERRORS, e.code, locale) : String(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="flex flex-col gap-3">
      {item && <div className="font-mono text-xs text-muted">{String(item.id)}</div>}
      {defs.map((f) => (
        <Field key={f.k} label={`${L(f.fa, f.en)}${f.req ? " *" : ""}`} hint={f.hint ? L(...f.hint) : undefined}>
          {f.t === "select" ? (
            <Select value={val[f.k]} onChange={(e) => setVal({ ...val, [f.k]: e.target.value })} className="w-full">
              {f.opts!(masters, locale).map((o) => (
                <option key={o.v} value={o.v}>
                  {o.l}
                </option>
              ))}
            </Select>
          ) : f.t === "bool" ? (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!val[f.k]} onChange={(e) => setVal({ ...val, [f.k]: e.target.checked ? "1" : "" })} /> {L("بله", "Yes")}
            </label>
          ) : (
            <Input type={f.t === "number" ? "number" : f.t === "date" ? "date" : f.t === "color" ? "color" : "text"} value={val[f.k]} onChange={(e) => setVal({ ...val, [f.k]: e.target.value })} className={f.ltr ? "font-mono ltr" : undefined} dir={f.ltr ? "ltr" : undefined} />
          )}
        </Field>
      ))}
      <Button variant="primary" loading={busy} disabled={missing.length > 0} onClick={submit}>
        {item ? L("ذخیره تغییرات", "Save changes") : L("افزودن", "Add")}
      </Button>
    </div>
  );
}
