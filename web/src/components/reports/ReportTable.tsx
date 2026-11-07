"use client";
import { useMemo } from "react";
import { cx } from "@/components/ui";
import { applyFilter, type ReportFilter } from "@/domain/reportFilter";
import type { Transaction, Visit, WeighEvent } from "@/domain/types";
import { fmtNum } from "@/lib/format";
import { useData } from "@/lib/live";
import { useLocale } from "@/lib/prefs";
import type { ReportOut } from "./reportModel";

const DAY = 86_400_000;

/** Loads everything a report needs for the filter's period and applies the filter. */
export function useReportData(f: ReportFilter) {
  // tickets are stamped at creation; one day of slack catches tickets approved inside the range
  const since = new Date(new Date(f.from).getTime() - DAY).toISOString();
  const { data: tx } = useData<Transaction>("transactions", { limit: 5000, since, until: f.to }, 30_000);
  const { data: vs } = useData<Visit>("visits", { limit: 5000, since: f.from, until: f.to }, 30_000);
  const { data: we } = useData<WeighEvent>("weighEvents", { limit: 5000, captureMethod: "MANUAL", since, until: f.to }, 30_000);
  return useMemo(() => {
    if (!tx) return null;
    const manual = we?.items ?? [];
    const manualTxIds = new Set(manual.map((w) => w.transactionId));
    const txs = applyFilter(tx.items, f, { manualTxIds });
    const ids = new Set(txs.map((t) => t.visitId));
    const visits = (vs?.items ?? []).filter((v) => {
      const has = (list: string[], x?: string) => !list.length || (!!x && list.includes(x));
      const linked = txs.length ? ids.has(v.id) : false;
      return linked || (has(f.vehicles, v.vehicleId) && has(f.drivers, v.driverId) && !f.customers.length && !f.materials.length);
    });
    return { txs, visits, manualWeighs: manual };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tx, vs, we, JSON.stringify(f)]);
}

/** Renders a report (screen and paper). Numbers in Persian digits, group headings, subtotals, grand total. */
export function ReportTable({ out, print, max }: { out: ReportOut; print?: boolean; max?: number }) {
  const locale = useLocale();
  const L = (fa: string, en: string) => (locale === "fa" ? fa : en);
  const cell = (c: string | number, num?: boolean) => (typeof c === "number" ? fmtNum(c, locale, { maximumFractionDigits: 2 }) : num && c === "" ? "—" : c);
  let shown = 0;
  const limit = max ?? Infinity;
  const th = print ? "border-b-2 border-black px-1.5 py-1 text-start font-bold" : "whitespace-nowrap bg-surface-2 px-3 py-2 text-start text-xs font-medium text-muted";
  const td = print ? "border-b border-zinc-300 px-1.5 py-[3px] align-top" : "whitespace-nowrap border-t border-border px-3 py-1.5";
  if (out.rowCount === 0)
    return <div className={cx("text-center", print ? "py-6" : "py-12 text-sm text-muted")}>{L("هیچ داده‌ای با این فیلتر و بازه پیدا نشد.", "No data for this filter and period.")}</div>;
  return (
    <div className={print ? "" : "overflow-auto"}>
      <table className={cx("w-full", print ? "report-print-table border-collapse text-[8.5pt]" : "text-sm")}>
        <thead className={print ? "" : "sticky top-0 z-[1]"}>
          <tr>
            <th className={cx(th, "w-8")}>#</th>
            {out.cols.map((c) => (
              <th key={c.key} className={cx(th, c.num && "text-end")}>
                {L(c.fa, c.en)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {out.sections.map((s, si) => {
            if (shown >= limit) return null;
            return [
              s.label ? (
                <tr key={`h${si}`} className={print ? "break-after-avoid" : ""}>
                  <td colSpan={out.cols.length + 1} className={cx(print ? "border-b border-black bg-zinc-100 px-1.5 pt-2 pb-1 font-bold" : "border-t border-border bg-primary/5 px-3 py-2 text-sm font-bold text-primary")}>
                    {s.label}
                  </td>
                </tr>
              ) : null,
              ...s.rows.map((r, ri) => {
                if (shown >= limit) return null;
                shown++;
                return (
                  <tr key={`${si}-${ri}`} className={print ? "" : "hover:bg-surface-2/60"}>
                    <td className={cx(td, "text-muted num")}>{fmtNum(shown, locale)}</td>
                    {r.map((c, j) => (
                      <td key={j} className={cx(td, out.cols[j]?.num ? "num text-end" : print ? "" : "text-xs")}>
                        {cell(c, out.cols[j]?.num)}
                      </td>
                    ))}
                  </tr>
                );
              }),
              s.subtotal ? (
                <tr key={`s${si}`} className="font-semibold">
                  <td className={cx(td, print ? "border-b-black" : "bg-surface-2/60")} />
                  {s.subtotal.map((c, j) => (
                    <td key={j} className={cx(td, print ? "border-b-black" : "bg-surface-2/60", out.cols[j]?.num ? "num text-end" : "text-xs")}>
                      {cell(c)}
                    </td>
                  ))}
                </tr>
              ) : null,
            ];
          })}
        </tbody>
        {out.total && (
          <tfoot>
            <tr className="font-bold">
              <td className={cx(print ? "border-t-2 border-black px-1.5 py-1" : "border-t-2 border-border bg-surface-2 px-3 py-2")} />
              {out.total.map((c, j) => (
                <td key={j} className={cx(print ? "border-t-2 border-black px-1.5 py-1" : "border-t-2 border-border bg-surface-2 px-3 py-2", out.cols[j]?.num ? "num text-end" : "text-xs")}>
                  {cell(c)}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
      {max != null && out.rowCount > max && <div className="border-t border-border px-3 py-2 text-center text-xs text-muted">{L(`نمایش ${fmtNum(max, locale)} ردیف از ${fmtNum(out.rowCount, locale)} — همه ردیف‌ها در چاپ و خروجی Excel می‌آیند`, `Showing ${max} of ${out.rowCount} rows — print and Excel include all rows`)}</div>}
    </div>
  );
}
