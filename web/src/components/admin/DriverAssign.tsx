"use client";
import { Pencil, Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { VehicleTag } from "@/components/domain/VehicleTag";
import { Badge, Button, Card, CardHeader, Dialog, Field, Input, Select, Table, Td, toast } from "@/components/ui";
import type { Driver, Vehicle } from "@/domain/types";
import { ERRORS, lbl } from "@/i18n/labels";
import { fmtNum } from "@/lib/format";
import { act, ActionError, useMasters } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";

/** Authorized drivers per vehicle (vehicle plate/tag ↔ driver card tag). The entry gate checks this list. */
export function DriverAssign() {
  const L = useL();
  const locale = useLocale();
  const m = useMasters();
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<Vehicle | null>(null);
  const [tagEdit, setTagEdit] = useState<Driver | null>(null);
  const drivers = useMemo(() => m?.drivers ?? [], [m]);
  const carrierName = (id: string) => {
    const c = m?.carriers.find((x) => x.id === id);
    return c ? (locale === "fa" ? c.name : c.nameEn) : id;
  };
  const vehicles = useMemo(() => {
    const s = q.trim().toUpperCase();
    return (m?.vehicles ?? [])
      .filter((v) => v.status !== "GUEST")
      .filter((v) => !s || v.id.toUpperCase().includes(s) || v.plateNormalized.toUpperCase().includes(s) || (v.rfidEpc ?? "").toUpperCase().includes(s) || v.authorizedDriverIds.some((id) => (drivers.find((x) => x.id === id)?.rfidTag ?? "").toUpperCase().includes(s)));
  }, [m, q, drivers]);
  const fail = (e: unknown) => toast.error(e instanceof ActionError ? lbl(ERRORS, e.code, locale) : String(e));

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader
          title={L("راننده‌های مجاز هر خودرو", "Authorized drivers per vehicle")}
          subtitle={L("دروازه ورود تگ کارت راننده را با این فهرست مقایسه می‌کند؛ راننده خارج از فهرست در دروازه نگه داشته می‌شود.", "The entry gate checks the driver card tag against this list; any other driver is held at the gate.")}
          actions={
            <div className="relative">
              <Search className="pointer-events-none absolute start-2.5 top-3 size-4 text-muted" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L("کد خودرو یا تگ…", "Vehicle code or tag…")} className="h-10 w-56 ps-8" />
            </div>
          }
        />
        <Table head={[L("خودرو", "Vehicle"), L("تگ کامل", "Full tag"), L("شرکت حمل", "Carrier"), L("راننده‌های مجاز", "Authorized drivers"), ""]}>
          {vehicles.map((v) => (
            <tr key={v.id}>
              <Td>
                <VehicleTag plate={v.plate} size="xs" />
              </Td>
              <Td className="font-mono text-[11px] ltr">{v.rfidEpc ?? "—"}</Td>
              <Td className="text-xs">{carrierName(v.carrierId)}</Td>
              <Td>
                <div className="flex flex-wrap items-center gap-1">
                  <Badge tone={v.authorizedDriverIds.length ? "primary" : "warning"}>{fmtNum(v.authorizedDriverIds.length, locale)}</Badge>
                  {v.authorizedDriverIds.map((id) => {
                    const dr = drivers.find((x) => x.id === id);
                    return (
                      <span key={id} className="rounded-md bg-surface-2 px-2 py-0.5 text-xs">
                        {dr ? (locale === "fa" ? dr.name : dr.nameEn) : id}
                      </span>
                    );
                  })}
                </div>
              </Td>
              <Td>
                <Button size="sm" variant="ghost" onClick={() => setEdit(v)}>
                  <Pencil className="size-3.5" /> {L("ویرایش", "Edit")}
                </Button>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card>
        <CardHeader title={L("تگ کارت رانندگان", "Driver card tags")} subtitle={L("هر راننده یک تگ RFID یکتا دارد", "Each driver has one unique RFID tag")} />
        <Table head={[L("راننده", "Driver"), L("گواهینامه", "License"), L("شرکت حمل", "Carrier"), L("تگ RFID", "RFID tag"), L("خودروهای مجاز", "Vehicles"), ""]}>
          {drivers.map((dr) => (
            <tr key={dr.id}>
              <Td>
                {locale === "fa" ? dr.name : dr.nameEn}
                {dr.status === "BLOCKED" && <Badge tone="danger" className="ms-2">{L("مسدود", "Blocked")}</Badge>}
              </Td>
              <Td className="font-mono text-xs">{dr.licenseNo}</Td>
              <Td className="text-xs">{carrierName(dr.carrierId)}</Td>
              <Td className="font-mono text-[11px] ltr">{dr.rfidTag ?? "—"}</Td>
              <Td className="num text-xs">{fmtNum((m?.vehicles ?? []).filter((v) => v.authorizedDriverIds.includes(dr.id)).length, locale)}</Td>
              <Td>
                <Button size="sm" variant="ghost" onClick={() => setTagEdit(dr)}>
                  <Pencil className="size-3.5" /> {L("تگ", "Tag")}
                </Button>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      {edit && <VehicleDrivers vehicle={edit} drivers={drivers} onClose={() => setEdit(null)} onFail={fail} />}
      {tagEdit && <DriverTag driver={tagEdit} onClose={() => setTagEdit(null)} onFail={fail} />}
    </div>
  );
}

function VehicleDrivers({ vehicle, drivers, onClose, onFail }: { vehicle: Vehicle; drivers: Driver[]; onClose: () => void; onFail: (e: unknown) => void }) {
  const L = useL();
  const locale = useLocale();
  const [ids, setIds] = useState<string[]>(vehicle.authorizedDriverIds);
  const [pick, setPick] = useState("");
  const [busy, setBusy] = useState(false);
  const available = drivers.filter((x) => !ids.includes(x.id) && x.status === "ACTIVE");
  const save = async () => {
    setBusy(true);
    try {
      await act("vehicle.drivers.set", { vehicleId: vehicle.id, driverIds: ids });
      toast.success(L("راننده‌های مجاز ذخیره شد", "Authorized drivers saved"));
      onClose();
    } catch (e) {
      onFail(e);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog
      open
      onClose={onClose}
      title={L("راننده‌های مجاز خودرو", "Authorized drivers")}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {L("انصراف", "Cancel")}
          </Button>
          <Button variant="primary" loading={busy} onClick={save}>
            {L("ذخیره", "Save")}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <VehicleTag plate={vehicle.plate} size="sm" />
          <span className="font-mono text-[11px] text-muted ltr">{vehicle.rfidEpc}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {ids.length === 0 && <div className="rounded-lg bg-warning/10 px-3 py-2 text-sm text-warning">{L("هیچ راننده‌ای تعریف نشده؛ این خودرو در دروازه نگه داشته می‌شود.", "No driver defined; this vehicle will be held at the gate.")}</div>}
          {ids.map((id) => {
            const dr = drivers.find((x) => x.id === id);
            return (
              <div key={id} className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm">
                <span>
                  {dr ? (locale === "fa" ? dr.name : dr.nameEn) : id}
                  <span className="ms-2 font-mono text-[11px] text-muted ltr">{dr?.rfidTag ?? "—"}</span>
                </span>
                <button className="rounded p-1 text-muted hover:bg-danger/10 hover:text-danger" onClick={() => setIds(ids.filter((x) => x !== id))} aria-label={L("حذف", "Remove")}>
                  <X className="size-4" />
                </button>
              </div>
            );
          })}
        </div>
        <Field label={L("افزودن راننده", "Add driver")}>
          <div className="flex gap-2">
            <Select value={pick} onChange={(e) => setPick(e.target.value)} className="flex-1">
              <option value="">{L("انتخاب راننده…", "Choose a driver…")}</option>
              {available.map((x) => (
                <option key={x.id} value={x.id}>
                  {(locale === "fa" ? x.name : x.nameEn) + " — " + x.licenseNo}
                </option>
              ))}
            </Select>
            <Button
              variant="secondary"
              disabled={!pick}
              onClick={() => {
                setIds([...ids, pick]);
                setPick("");
              }}
            >
              <Plus className="size-4" /> {L("افزودن", "Add")}
            </Button>
          </div>
        </Field>
      </div>
    </Dialog>
  );
}

function DriverTag({ driver, onClose, onFail }: { driver: Driver; onClose: () => void; onFail: (e: unknown) => void }) {
  const L = useL();
  const locale = useLocale();
  const [tag, setTag] = useState(driver.rfidTag ?? "");
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    try {
      await act("driver.tag.set", { driverId: driver.id, rfidTag: tag });
      toast.success(L("تگ راننده ذخیره شد", "Driver tag saved"));
      onClose();
    } catch (e) {
      onFail(e);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog
      open
      onClose={onClose}
      title={locale === "fa" ? `تگ کارت — ${driver.name}` : `Card tag — ${driver.nameEn}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {L("انصراف", "Cancel")}
          </Button>
          <Button variant="primary" loading={busy} onClick={save}>
            {L("ذخیره", "Save")}
          </Button>
        </>
      }
    >
      <Field label={L("تگ RFID (EPC)", "RFID tag (EPC)")} hint={L("کارت را روی ریدر رومیزی بگذارید یا کد را وارد کنید", "Place the card on the desk reader or type the code")}>
        <Input value={tag} onChange={(e) => setTag(e.target.value)} className="font-mono ltr" dir="ltr" />
      </Field>
    </Dialog>
  );
}
