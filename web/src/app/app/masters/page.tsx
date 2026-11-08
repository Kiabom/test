"use client";
import { clockNow } from "@/domain/clock";
import { Boxes, Pencil, Plus, UserRound } from "lucide-react";
import { MasterForm, TITLE, type MasterCol } from "@/components/masters/MasterForm";
import { useState } from "react";
import { VehicleTag } from "@/components/domain/VehicleTag";
import { Badge, Button, Card, Drawer, Input, Kv, PageHeader, Skeleton, Table, Tabs, Td } from "@/components/ui";
import type { Driver, Vehicle } from "@/domain/types";
import { DEVICE_TYPE, lbl, VEHICLE_TYPE } from "@/i18n/labels";
import { fmtDate, fmtNum } from "@/lib/format";
import { useMasters } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";

type Tab = "vehicles" | "drivers" | "carriers" | "customers" | "materials" | "locations" | "scales";

export default function MastersPage() {
  const L = useL();
  const locale = useLocale();
  const m = useMasters();
  const [tab, setTab] = useState<Tab>("vehicles");
  const [q, setQ] = useState("");
  const [form, setForm] = useState<{ col: MasterCol; item?: Record<string, unknown> } | null>(null);
  const setEditV = (v: Vehicle) => setForm({ col: "vehicles", item: v as unknown as Record<string, unknown> });
  const setEditD = (d: Driver) => setForm({ col: "drivers", item: d as unknown as Record<string, unknown> });
  const edit = (col: MasterCol, item: unknown) => setForm({ col, item: item as Record<string, unknown> });
  const now = clockNow();
  const expired = (iso?: string) => !!iso && new Date(iso).getTime() < now;
  const nm = (x: { name: string; nameEn?: string }) => (locale === "fa" ? x.name : x.nameEn ?? x.name);
  return (
    <div>
      <PageHeader icon={<Boxes className="size-5" />} title={L("اطلاعات پایه", "Master data")} subtitle={L("خودرو، راننده، حمل‌کننده، مشتری، ماده، مبدأ/مقصد و باسکول‌ها — هر تغییر در audit", "Vehicles, drivers, carriers, customers, materials, locations and scales — every change audited")} actions={
          <>
            <Input placeholder={L("جست‌وجو (نام، کد، تگ)…", "Search (name, code, tag)…")} value={q} onChange={(e) => setQ(e.target.value)} className="w-56" />
            {tab !== "scales" && (
              <Button variant="primary" size="sm" onClick={() => setForm({ col: tab as MasterCol })}>
                <Plus className="size-4" /> {L(`افزودن ${TITLE[tab as MasterCol][0]}`, `Add ${TITLE[tab as MasterCol][1]}`)}
              </Button>
            )}
          </>
        }
      />
      <Tabs
        className="mb-3"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "vehicles", label: L("خودروها", "Vehicles"), badge: m && <Badge>{m.vehicles.length}</Badge> },
          { id: "drivers", label: L("رانندگان", "Drivers"), badge: m && <Badge>{m.drivers.length}</Badge> },
          { id: "carriers", label: L("حمل‌کننده‌ها", "Carriers") },
          { id: "customers", label: L("مشتری‌ها", "Customers") },
          { id: "materials", label: L("مواد", "Materials") },
          { id: "locations", label: L("مبدأ / مقصد", "Locations") },
          { id: "scales", label: L("سایت، لاین و باسکول", "Sites, lanes & scales") },
        ]}
      />
      {!m ? (
        <Skeleton className="h-96" />
      ) : (
        <Card>
          {tab === "vehicles" && (
            <Table head={[L("تگ خودرو", "Vehicle tag"), L("نوع", "Type"), L("محور", "Axles"), "RFID EPC", L("تارای ذخیره", "Stored tare"), L("اعتبار تارا", "Tare valid"), L("حداکثر GVW", "Max GVW"), L("حمل‌کننده", "Carrier"), L("بیمه", "Insurance"), L("وضعیت", "Status"), ""]}>
              {m.vehicles.filter((v) => !q || v.id.includes(q.toUpperCase()) || v.plateNormalized.includes(q) || (v.rfidEpc ?? "").includes(q.toUpperCase())).map((v) => (
                <tr key={v.id} className="hover:bg-surface-2">
                  <Td>
                    <VehicleTag plate={v.plate} size="xs" />
                  </Td>
                  <Td>
                    {lbl(VEHICLE_TYPE, v.type, locale)} {v.internal && <Badge tone="info">{L("داخلی", "Internal")}</Badge>}
                  </Td>
                  <Td className="num">{fmtNum(v.axles, locale)}</Td>
                  <Td className="font-mono text-[11px] ltr">{v.rfidEpc ?? "—"}</Td>
                  <Td className="num">{fmtNum(v.storedTareKg, locale)}</Td>
                  <Td className={`num text-xs ${expired(v.tareValidUntil) ? "text-danger" : ""}`}>{fmtDate(v.tareValidUntil, locale)}</Td>
                  <Td className="num">{fmtNum(v.maxGvwKg, locale)}</Td>
                  <Td>{nm(m.carriers.find((c) => c.id === v.carrierId) ?? { name: "—" })}</Td>
                  <Td className={`num text-xs ${expired(v.insuranceUntil) ? "font-bold text-danger" : ""}`}>{fmtDate(v.insuranceUntil, locale)}</Td>
                  <Td>
                    <Badge tone={v.status === "ACTIVE" ? "success" : v.status === "GUEST" ? "warning" : "danger"}>{v.status}</Badge>
                  </Td>
                  <Td>
                    <Button size="sm" variant="ghost" onClick={() => setEditV(v)}>
                      <Pencil className="size-3.5" />
                    </Button>
                  </Td>
                </tr>
              ))}
            </Table>
          )}
          {tab === "drivers" && (
            <Table head={["", L("نام", "Name"), L("تگ RFID", "RFID tag"), L("کد ملی", "National ID"), L("گواهینامه", "Licence"), L("انقضا", "Expiry"), L("موبایل", "Mobile"), L("حمل‌کننده", "Carrier"), L("وضعیت", "Status"), ""]}>
              {m.drivers.filter((d) => !q || d.name.includes(q) || d.nameEn.toLowerCase().includes(q.toLowerCase()) || (d.rfidTag ?? "").includes(q.toUpperCase())).map((d) => (
                <tr key={d.id} className="hover:bg-surface-2">
                  <Td>
                    <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary">
                      <UserRound className="size-4" />
                    </span>
                  </Td>
                  <Td>{nm(d)}</Td>
                  <Td className="font-mono text-[11px] ltr">{d.rfidTag ?? "—"}</Td>
                  <Td className="font-mono text-xs ltr">{d.nationalIdMasked}</Td>
                  <Td className="font-mono text-xs ltr">{d.licenseNo}</Td>
                  <Td className={`num text-xs ${expired(d.licenseUntil) ? "font-bold text-danger" : ""}`}>{fmtDate(d.licenseUntil, locale)}</Td>
                  <Td className="font-mono text-xs ltr">{d.phone}</Td>
                  <Td>{nm(m.carriers.find((c) => c.id === d.carrierId) ?? { name: "—" })}</Td>
                  <Td>
                    <Badge tone={d.status === "ACTIVE" ? "success" : "danger"}>{d.status}</Badge>
                  </Td>
                  <Td>
                    <Button size="sm" variant="ghost" onClick={() => setEditD(d)}>
                      <Pencil className="size-3.5" />
                    </Button>
                  </Td>
                </tr>
              ))}
            </Table>
          )}
          {tab === "carriers" && (
            <Table head={[L("نام", "Name"), L("شماره ثبت", "Reg. no"), L("تلفن", "Phone"), L("خودروها", "Vehicles"), L("رانندگان", "Drivers"), L("وضعیت", "Status"), ""]}>
              {m.carriers.map((c) => (
                <tr key={c.id}>
                  <Td>{nm(c)}</Td>
                  <Td className="font-mono text-xs ltr">{c.regNo}</Td>
                  <Td className="font-mono text-xs ltr">{c.phone}</Td>
                  <Td className="num">{fmtNum(m.vehicles.filter((v) => v.carrierId === c.id).length, locale)}</Td>
                  <Td className="num">{fmtNum(m.drivers.filter((d) => d.carrierId === c.id).length, locale)}</Td>
                  <Td>
                    <Badge tone="success">{c.status}</Badge>
                  </Td>
                  <Td>
                    <EditBtn onClick={() => edit("carriers", c)} />
                  </Td>
                </tr>
              ))}
            </Table>
          )}
          {tab === "customers" && (
            <Table head={[L("نام", "Name"), L("نوع", "Type"), L("کد ERP", "ERP code"), L("شهر", "City"), L("سقف اعتبار (ریال)", "Credit limit (IRR)"), ""]}>
              {m.customers.map((c) => (
                <tr key={c.id}>
                  <Td>{nm(c)}</Td>
                  <Td>
                    <Badge tone={c.type === "SUPPLIER" ? "info" : "primary"}>{c.type}</Badge>
                  </Td>
                  <Td className="font-mono text-xs ltr">{c.erpCode}</Td>
                  <Td>{c.city}</Td>
                  <Td className="num">{fmtNum(c.creditLimit, locale)}</Td>
                  <Td>
                    <EditBtn onClick={() => edit("customers", c)} />
                  </Td>
                </tr>
              ))}
            </Table>
          )}
          {tab === "materials" && (
            <Table head={["", L("کد", "Code"), L("نام", "Name"), L("عیار/گرید", "Grade"), L("چگالی توده‌ای", "Bulk density"), L("قیمت هر تن", "Price/t"), "QC", L("فقط داخلی", "Internal only"), ""]}>
              {m.materials.map((x) => (
                <tr key={x.id}>
                  <Td>
                    <span className="inline-block size-4 rounded" style={{ background: x.color }} />
                  </Td>
                  <Td className="font-mono text-xs ltr">{x.code}</Td>
                  <Td>{nm(x)}</Td>
                  <Td>{x.grade}</Td>
                  <Td className="num">{fmtNum(x.densityKgM3, locale)} kg/m³</Td>
                  <Td className="num">{fmtNum(x.pricePerTon, locale)}</Td>
                  <Td>{x.requiresQc ? <Badge tone="warning">{L("نیازمند QC", "QC required")}</Badge> : "—"}</Td>
                  <Td>{x.internalOnly ? "✓" : "—"}</Td>
                  <Td>
                    <EditBtn onClick={() => edit("materials", x)} />
                  </Td>
                </tr>
              ))}
            </Table>
          )}
          {tab === "locations" && (
            <Table head={[L("نام", "Name"), L("نوع", "Type"), L("ظرفیت (تن)", "Capacity (t)"), L("ماده", "Material"), ""]}>
              {m.locations.map((x) => (
                <tr key={x.id}>
                  <Td>{nm(x)}</Td>
                  <Td>
                    <Badge>{({ PIT: L("پیت", "Pit"), STOCKPILE: L("دپو", "Stockpile"), CRUSHER: L("سنگ‌شکن", "Crusher"), PLANT: L("کارخانه", "Plant"), DUMP: L("دامپ باطله", "Waste dump"), EXTERNAL: L("خارج از سایت", "External") } as Record<string, string>)[x.type]}</Badge>
                  </Td>
                  <Td className="num">{x.capacityT ? fmtNum(x.capacityT, locale) : "—"}</Td>
                  <Td>{x.materialId ? nm(m.materials.find((y) => y.id === x.materialId) ?? { name: "—" }) : "—"}</Td>
                  <Td>
                    <EditBtn onClick={() => edit("locations", x)} />
                  </Td>
                </tr>
              ))}
            </Table>
          )}
          {tab === "scales" && (
            <div className="grid gap-4 p-4 md:grid-cols-2">
              {m.sites.map((s) => (
                <Card key={s.id} className="p-4">
                  <div className="font-bold">{nm(s)}</div>
                  <Kv k={L("کد", "Code")} v={s.code} />
                  <Kv k={L("منطقه زمانی", "Timezone")} v={s.timezone} />
                </Card>
              ))}
              {m.scales.map((s) => (
                <Card key={s.id} className="p-4">
                  <div className="flex items-center justify-between font-bold">
                    {nm(s)} <Badge tone={s.status === "LOCKED" ? "danger" : "success"}>{s.status}</Badge>
                  </div>
                  <Kv k={L("ظرفیت", "Capacity")} v={`${fmtNum(s.capacityKg, locale)} kg`} />
                  <Kv k={L("بخش‌پذیری", "Division")} v={`${fmtNum(s.divisionKg, locale)} kg`} />
                  <Kv k={L("طول / لودسل", "Length / cells")} v={`${s.lengthM} m / ${s.loadCells}`} />
                  <Kv k="Indicator" v={s.indicatorModel} />
                  <Kv k={L("تشخیص سلامت لودسل", "Load-cell diagnostics")} v={s.diagnosticsSupported ? L("پشتیبانی می‌شود", "Supported") : L("پشتیبانی نمی‌شود", "Not supported")} />
                </Card>
              ))}
              <Card className="p-4 md:col-span-2">
                <div className="mb-2 font-bold">{L("لاین‌ها", "Lanes")}</div>
                <div className="grid gap-2 md:grid-cols-5">
                  {m.lanes.map((l) => (
                    <div key={l.id} className="rounded-lg bg-surface-2 p-3 text-sm">
                      <div className="text-2xl font-black text-primary">{l.code}</div>
                      <div>{nm(l)}</div>
                      <div className="text-xs text-muted">{m.devices.filter((d) => d.laneId === l.id).map((d) => lbl(DEVICE_TYPE, d.type, locale)).slice(0, 4).join("، ")}…</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </Card>
      )}
      <Drawer open={!!form} onClose={() => setForm(null)} title={form ? (form.item ? L(`ویرایش ${TITLE[form.col][0]}`, `Edit ${TITLE[form.col][1]}`) : L(`افزودن ${TITLE[form.col][0]}`, `Add ${TITLE[form.col][1]}`)) : ""}>
        {form && <MasterForm key={`${form.col}-${String(form.item?.id ?? "new")}`} col={form.col} item={form.item} masters={m} onDone={() => setForm(null)} />}
      </Drawer>
    </div>
  );
}

function EditBtn({ onClick }: { onClick: () => void }) {
  return (
    <Button size="sm" variant="ghost" onClick={onClick}>
      <Pencil className="size-3.5" />
    </Button>
  );
}
