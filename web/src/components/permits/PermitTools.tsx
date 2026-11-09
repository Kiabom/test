"use client";
import { Route, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { MultiSelect } from "@/components/reports/FilterBar";
import { shortTag, VehicleTag } from "@/components/domain/VehicleTag";
import { Badge, Button, Card, CardHeader, cx, Dialog, Field, Input, Select, Table, Td, toast } from "@/components/ui";
import type { Permit, PermitType } from "@/domain/types";
import { ERRORS, lbl } from "@/i18n/labels";
import { fmtDate, fmtNum } from "@/lib/format";
import { act, ActionError, type Masters } from "@/lib/live";
import { useL, useLocale } from "@/lib/prefs";

const TYPES: { id: PermitType; fa: string; en: string; hint: [string, string] }[] = [
  { id: "SALE", fa: "فروش (ارسال به مشتری)", en: "Sale", hint: ["از دپو به خارج از سایت", "stockpile → off-site"] },
  { id: "PURCHASE", fa: "خرید (دریافت از تأمین‌کننده)", en: "Purchase", hint: ["از خارج از سایت به دپو", "off-site → stockpile"] },
  { id: "HAUL", fa: "انتقال به کارخانه فرآوری", en: "Haul to plant", hint: ["از دپو یا پیت به کارخانه", "stockpile or pit → plant"] },
  { id: "TRANSFER", fa: "جابه‌جایی درون معدن", en: "In-mine haul", hint: ["از پیت به دپو یا دامپ باطله", "pit → stockpile or waste dump"] },
];
const ALLOWED: Record<PermitType, { from: string[]; to: string[] }> = {
  SALE: { from: ["STOCKPILE", "CRUSHER"], to: ["EXTERNAL"] },
  PURCHASE: { from: ["EXTERNAL"], to: ["STOCKPILE", "PLANT"] },
  HAUL: { from: ["STOCKPILE", "PIT", "CRUSHER"], to: ["PLANT"] },
  TRANSFER: { from: ["PIT", "PLANT", "STOCKPILE"], to: ["STOCKPILE", "DUMP", "CRUSHER"] },
};

const useNm = () => {
  const locale = useLocale();
  return (x?: { name: string; nameEn?: string }) => (x ? (locale === "fa" ? x.name : x.nameEn ?? x.name) : "—");
};
export function routeText(m: Masters | null, p: Pick<Permit, "originId" | "destinationId">, locale: "fa" | "en") {
  const n = (id: string) => {
    const l = m?.locations.find((x) => x.id === id);
    return l ? (locale === "fa" ? l.name : l.nameEn) : "—";
  };
  return `${n(p.originId)} ← ${n(p.destinationId)}`;
}

/** Issue a haul order / permit with a full route, material and the vehicles allowed to run it. */
export function NewPermitDialog({ masters, onClose, presetVehicles }: { masters: Masters | null; onClose: () => void; presetVehicles?: string[] }) {
  const L = useL();
  const locale = useLocale();
  const nm = useNm();
  const [type, setType] = useState<PermitType>(presetVehicles?.length ? "TRANSFER" : "SALE");
  const locs = masters?.locations ?? [];
  const pick = (types: string[]) => locs.filter((l) => types.includes(l.type));
  const [materialId, setMaterialId] = useState("M-FEL");
  const stockOf = (mid: string) => locs.find((l) => l.type === "STOCKPILE" && l.materialId === mid)?.id;
  const defaults = (t: PermitType, mid: string) => {
    const from = pick(ALLOWED[t].from);
    const to = pick(ALLOWED[t].to);
    const sp = stockOf(mid);
    return {
      originId: t === "SALE" || t === "HAUL" ? (sp ?? from[0]?.id ?? "") : from[0]?.id ?? "",
      destinationId: t === "PURCHASE" || t === "TRANSFER" ? (mid === "M-WST" ? to.find((x) => x.type === "DUMP")?.id : sp) ?? to[0]?.id ?? "" : to[0]?.id ?? "",
    };
  };
  const [route, setRoute] = useState(() => defaults(type, materialId));
  const [customerId, setCustomerId] = useState("");
  const [allowedT, setAllowedT] = useState("2000");
  const [maxTrips, setMaxTrips] = useState("");
  const [days, setDays] = useState("30");
  const [vehicleIds, setVehicleIds] = useState<string[]>(presetVehicles ?? []);
  const [assign, setAssign] = useState(true);
  const [busy, setBusy] = useState(false);
  const customers = (masters?.customers ?? []).filter((c) => (type === "PURCHASE" ? c.type === "SUPPLIER" : c.type === "CUSTOMER"));
  const needsCustomer = type === "SALE" || type === "PURCHASE";
  const setT = (t: PermitType) => (setType(t), setRoute(defaults(t, materialId)), setCustomerId(""));
  const setM = (mid: string) => (setMaterialId(mid), setRoute(defaults(type, mid)));
  const submit = async () => {
    setBusy(true);
    try {
      const pm = await act<Permit>("permit.create", { type, materialId, ...route, customerId: needsCustomer ? customerId || customers[0]?.id : "", allowedT: Number(allowedT), maxTrips: Number(maxTrips) || 0, days: Number(days), vehicleIds, assign: assign && vehicleIds.length > 0 });
      toast.success(L(`حواله ${pm.permitNo} صادر شد${assign && vehicleIds.length ? ` و به ${vehicleIds.length} خودرو تخصیص یافت` : ""}`, `Permit ${pm.permitNo} issued`));
      onClose();
    } catch (e) {
      toast.error(e instanceof ActionError ? lbl(ERRORS, e.code, locale) : String(e));
    } finally {
      setBusy(false);
    }
  };
  const vehicleOpts = (masters?.vehicles ?? []).filter((v) => v.status !== "GUEST").map((v) => ({ id: v.id, label: `${v.id} · ${shortTag(v.rfidEpc)}`, sub: v.internal ? L("داخلی", "internal") : undefined }));
  return (
    <Dialog
      open
      wide
      onClose={onClose}
      title={L("صدور حواله / دستور حمل", "Issue permit / haul order")}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {L("انصراف", "Cancel")}
          </Button>
          <Button variant="primary" loading={busy} disabled={!route.originId || !route.destinationId || route.originId === route.destinationId} onClick={submit}>
            {L("صدور", "Issue")}
          </Button>
        </>
      }
    >
      <div className="grid gap-4">
        <div className="grid gap-2 sm:grid-cols-4">
          {TYPES.map((t) => (
            <button key={t.id} type="button" onClick={() => setT(t.id)} className={cx("rounded-xl border p-3 text-start", type === t.id ? "border-primary bg-primary/8 ring-1 ring-primary/40" : "border-border hover:bg-surface-2")}>
              <div className="text-sm font-semibold">{L(t.fa, t.en)}</div>
              <div className="mt-1 text-[11px] text-muted">{L(...t.hint)}</div>
            </button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label={L("ماده / بار", "Material / load")}>
            <Select value={materialId} onChange={(e) => setM(e.target.value)} className="w-full">
              {(masters?.materials ?? []).map((m) => (
                <option key={m.id} value={m.id}>
                  {nm(m)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={L("مبدأ", "Origin")}>
            <Select value={route.originId} onChange={(e) => setRoute({ ...route, originId: e.target.value })} className="w-full">
              {pick(ALLOWED[type].from).map((l) => (
                <option key={l.id} value={l.id}>
                  {nm(l)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={L("مقصد", "Destination")}>
            <Select value={route.destinationId} onChange={(e) => setRoute({ ...route, destinationId: e.target.value })} className="w-full">
              {pick(ALLOWED[type].to).map((l) => (
                <option key={l.id} value={l.id}>
                  {nm(l)}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-2 text-sm">
          <Route className="size-4 text-primary" />
          <span className="font-semibold">{routeText(masters, route, locale)}</span>
          <span className="text-muted">· {nm(masters?.materials.find((m) => m.id === materialId))}</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          {needsCustomer && (
            <Field label={type === "PURCHASE" ? L("تأمین‌کننده", "Supplier") : L("مشتری", "Customer")}>
              <Select value={customerId || customers[0]?.id} onChange={(e) => setCustomerId(e.target.value)} className="w-full">
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {nm(c)}
                  </option>
                ))}
              </Select>
            </Field>
          )}
          <Field label={L("سقف تناژ (تن)", "Tonnage cap (t)")}>
            <Input type="number" value={allowedT} onChange={(e) => setAllowedT(e.target.value)} />
          </Field>
          <Field label={L("حداکثر سفر (اختیاری)", "Max trips (optional)")}>
            <Input type="number" value={maxTrips} onChange={(e) => setMaxTrips(e.target.value)} />
          </Field>
          <Field label={L("اعتبار (روز)", "Validity (days)")}>
            <Input type="number" value={days} onChange={(e) => setDays(e.target.value)} />
          </Field>
        </div>
        <Field label={L("خودروهای مجاز (خالی = همه)", "Allowed vehicles (empty = any)")}>
          <div className="flex flex-wrap items-center gap-2">
            <MultiSelect label={L("انتخاب خودرو", "Choose vehicles")} options={vehicleOpts} value={vehicleIds} onChange={setVehicleIds} />
            {vehicleIds.slice(0, 8).map((id) => (
              <VehicleTag key={id} vehicleId={id} size="xs" />
            ))}
            {vehicleIds.length > 8 && <span className="text-xs text-muted">+{fmtNum(vehicleIds.length - 8, locale)}</span>}
          </div>
        </Field>
        {vehicleIds.length > 0 && (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={assign} onChange={(e) => setAssign(e.target.checked)} />
            {L("همین حواله به‌عنوان مسیر و بار فعلی این خودروها تخصیص یابد", "Also assign it as these vehicles' current route & load")}
          </label>
        )}
      </div>
    </Dialog>
  );
}

/** «تخصیص مسیر و بار»: which haul order each vehicle is currently running. */
export function AssignmentsTab({ masters }: { masters: Masters | null }) {
  const L = useL();
  const locale = useLocale();
  const nm = useNm();
  const [sel, setSel] = useState<string[]>([]);
  const [dlg, setDlg] = useState<string[] | null>(null);
  const [newFor, setNewFor] = useState<string[] | null>(null);
  const [q, setQ] = useState("");
  const vehicles = useMemo(() => (masters?.vehicles ?? []).filter((v) => v.status !== "GUEST" && (!q || v.id.includes(q.toUpperCase()) || (v.rfidEpc ?? "").includes(q.toUpperCase()))), [masters, q]);
  const permitOf = (id?: string) => masters?.permits.find((p) => p.id === id);
  const drivers = (ids: string[]) => ids.map((id) => nm(masters?.drivers.find((x) => x.id === id))).join("، ");
  return (
    <Card>
      <CardHeader
        title={L("تخصیص مسیر و بار به خودروها", "Route & load assignment")}
        subtitle={L("هر خودرو با کدام حواله (مبدأ ← مقصد و ماده) کار می‌کند؛ با خواندن تگ در دروازه همین حواله خودکار انتخاب می‌شود", "Which haul order each vehicle runs; picked automatically when its tag is read at the gate")}
        icon={<Truck className="size-4" />}
        actions={
          <div className="flex items-center gap-2">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L("کد یا تگ خودرو…", "Vehicle code or tag…")} className="h-9 w-44" />
            <Button size="sm" disabled={!sel.length} onClick={() => setDlg(sel)}>
              {L(`تخصیص به ${fmtNum(sel.length, locale)} خودرو`, `Assign ${sel.length}`)}
            </Button>
            <Button size="sm" variant="primary" disabled={!sel.length} onClick={() => setNewFor(sel)}>
              {L("حواله جدید برای انتخاب‌شده‌ها", "New permit for selected")}
            </Button>
          </div>
        }
      />
      <Table head={["", L("خودرو", "Vehicle"), L("رانندگان مجاز", "Authorized drivers"), L("حواله", "Permit"), L("مسیر (مبدأ ← مقصد)", "Route"), L("ماده", "Material"), L("مانده (تن)", "Left (t)"), L("تا", "Until"), ""]}>
        {vehicles.map((v) => {
          const pm = permitOf(v.assignment?.permitId);
          return (
            <tr key={v.id} className={cx(sel.includes(v.id) && "bg-primary/5")}>
              <Td>
                <input type="checkbox" checked={sel.includes(v.id)} onChange={(e) => setSel(e.target.checked ? [...sel, v.id] : sel.filter((x) => x !== v.id))} />
              </Td>
              <Td>
                <VehicleTag vehicleId={v.id} size="xs" />
                {v.internal && <Badge tone="info" className="ms-1">{L("داخلی", "Internal")}</Badge>}
              </Td>
              <Td className="max-w-48 truncate text-xs">{drivers(v.authorizedDriverIds)}</Td>
              {pm ? (
                <>
                  <Td className="font-mono text-xs ltr">{pm.permitNo}</Td>
                  <Td className="whitespace-nowrap text-xs font-semibold">{routeText(masters, pm, locale)}</Td>
                  <Td className="text-xs">{nm(masters?.materials.find((m) => m.id === pm.materialId))}</Td>
                  <Td className="num text-xs">{fmtNum(Math.round((pm.allowedKg - pm.consumedKg - pm.reservedKg) / 1000), locale)}</Td>
                  <Td className="num text-xs">{fmtDate(v.assignment?.until ?? pm.validTo, locale)}</Td>
                </>
              ) : (
                <Td colSpan={5} className="text-xs text-muted">
                  {L("تخصیص ندارد — در دروازه از حواله‌های فعال انتخاب می‌شود", "Not assigned — picked from active permits at the gate")}
                </Td>
              )}
              <Td className="whitespace-nowrap">
                <Button size="sm" variant="ghost" onClick={() => setDlg([v.id])}>
                  {pm ? L("تغییر", "Change") : L("تخصیص", "Assign")}
                </Button>
                {pm && (
                  <Button size="sm" variant="ghost" className="text-danger" onClick={async () => { await act("vehicle.unassign", { vehicleId: v.id }); toast.success(L("تخصیص برداشته شد", "Unassigned")); }}>
                    {L("حذف", "Remove")}
                  </Button>
                )}
              </Td>
            </tr>
          );
        })}
      </Table>
      {dlg && <AssignDialog masters={masters} vehicleIds={dlg} onClose={() => (setDlg(null), setSel([]))} onNew={() => (setNewFor(dlg), setDlg(null))} />}
      {newFor && <NewPermitDialog masters={masters} presetVehicles={newFor} onClose={() => (setNewFor(null), setSel([]))} />}
    </Card>
  );
}

function AssignDialog({ masters, vehicleIds, onClose, onNew }: { masters: Masters | null; vehicleIds: string[]; onClose: () => void; onNew: () => void }) {
  const L = useL();
  const locale = useLocale();
  const nm = useNm();
  const options = (masters?.permits ?? []).filter((p) => p.status === "ACTIVE" && (!p.allowedVehicleIds.length || vehicleIds.every((v) => p.allowedVehicleIds.includes(v))));
  const [permitId, setPermitId] = useState(options[0]?.id ?? "");
  const [until, setUntil] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const pm = options.find((p) => p.id === permitId);
  const submit = async () => {
    setBusy(true);
    try {
      await act("vehicle.assign", { vehicleIds, permitId, until: until ? new Date(until + "T23:59:00Z").toISOString() : undefined, note });
      toast.success(L("مسیر و بار تخصیص یافت", "Assigned"));
      onClose();
    } catch (e) {
      toast.error(e instanceof ActionError ? lbl(ERRORS, e.code, locale) : String(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog
      open
      onClose={onClose}
      title={L(`تخصیص مسیر و بار — ${vehicleIds.length} خودرو`, `Assign route & load — ${vehicleIds.length} vehicle(s)`)}
      footer={
        <>
          <Button variant="ghost" onClick={onNew}>
            {L("حواله جدید…", "New permit…")}
          </Button>
          <Button variant="primary" loading={busy} disabled={!permitId} onClick={submit}>
            {L("تخصیص", "Assign")}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <Field label={L("حواله / دستور حمل", "Permit / haul order")}>
          <Select value={permitId} onChange={(e) => setPermitId(e.target.value)} className="w-full">
            {options.map((p) => (
              <option key={p.id} value={p.id}>
                {p.permitNo} — {routeText(masters, p, locale)} — {nm(masters?.materials.find((m) => m.id === p.materialId))}
              </option>
            ))}
          </Select>
        </Field>
        {pm && (
          <div className="rounded-lg bg-surface-2 px-3 py-2 text-xs">
            {L("مانده", "Left")}: <b className="num">{fmtNum(Math.round((pm.allowedKg - pm.consumedKg - pm.reservedKg) / 1000), locale)}</b> {L("تن", "t")} · {L("اعتبار تا", "valid to")} <span className="num">{fmtDate(pm.validTo, locale)}</span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Field label={L("تا تاریخ (اختیاری)", "Until (optional)")}>
            <Input type="date" value={until} onChange={(e) => setUntil(e.target.value)} />
          </Field>
          <Field label={L("یادداشت", "Note")}>
            <Input value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
        </div>
      </div>
    </Dialog>
  );
}
