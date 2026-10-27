"use client";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fmtNum } from "@/lib/format";
import { useLocale } from "@/lib/prefs";

const axis = { stroke: "var(--muted)", fontSize: 11 };
const grid = { stroke: "var(--border)", strokeDasharray: "3 3" };
const tip = { contentStyle: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12, color: "var(--text)" } };

export const PALETTE = ["#1273a6", "#7c3aed", "#168567", "#b7791f", "#b42335", "#0891b2", "#64748b", "#d9480f"];

export function AreaSeries({ data, x, series, height = 240, target, unit }: { data: Record<string, unknown>[]; x: string; series: { key: string; name: string; color: string }[]; height?: number; target?: number; unit?: string }) {
  const locale = useLocale();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`g-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={s.color} stopOpacity={0.35} />
              <stop offset="1" stopColor={s.color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid {...grid} vertical={false} />
        <XAxis dataKey={x} {...axis} tickLine={false} />
        <YAxis {...axis} tickLine={false} width={44} tickFormatter={(v) => fmtNum(v, locale)} />
        <Tooltip {...tip} formatter={(v: number) => `${fmtNum(v, locale)} ${unit ?? ""}`} />
        {target != null && <ReferenceLine y={target} stroke="var(--warning)" strokeDasharray="6 4" />}
        {series.map((s) => (
          <Area key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} fill={`url(#g-${s.key})`} strokeWidth={2} isAnimationActive={false} />
        ))}
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function Bars({ data, x, series, height = 220, stacked, layout = "horizontal", unit }: { data: Record<string, unknown>[]; x: string; series: { key: string; name: string; color: string }[]; height?: number; stacked?: boolean; layout?: "horizontal" | "vertical"; unit?: string }) {
  const locale = useLocale();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout={layout} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid {...grid} vertical={layout === "vertical"} horizontal={layout === "horizontal"} />
        {layout === "horizontal" ? (
          <>
            <XAxis dataKey={x} {...axis} tickLine={false} />
            <YAxis {...axis} tickLine={false} width={44} tickFormatter={(v) => fmtNum(v, locale)} />
          </>
        ) : (
          <>
            <XAxis type="number" {...axis} tickLine={false} tickFormatter={(v) => fmtNum(v, locale)} />
            <YAxis type="category" dataKey={x} {...axis} tickLine={false} width={110} />
          </>
        )}
        <Tooltip {...tip} formatter={(v: number) => `${fmtNum(v, locale)} ${unit ?? ""}`} cursor={{ fill: "var(--surface-2)" }} />
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} stackId={stacked ? "a" : undefined} radius={stacked ? 0 : [4, 4, 0, 0]} isAnimationActive={false} />
        ))}
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Lines({ data, x, series, height = 220, unit }: { data: Record<string, unknown>[]; x: string; series: { key: string; name: string; color: string; dashed?: boolean }[]; height?: number; unit?: string }) {
  const locale = useLocale();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid {...grid} vertical={false} />
        <XAxis dataKey={x} {...axis} tickLine={false} />
        <YAxis {...axis} tickLine={false} width={44} tickFormatter={(v) => fmtNum(v, locale)} />
        <Tooltip {...tip} formatter={(v: number) => `${fmtNum(v, locale)} ${unit ?? ""}`} />
        {series.map((s) => (
          <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2} dot={false} strokeDasharray={s.dashed ? "5 4" : undefined} isAnimationActive={false} />
        ))}
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function Donut({ data, height = 220, unit }: { data: { name: string; value: number; color?: string }[]; height?: number; unit?: string }) {
  const locale = useLocale();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="85%" paddingAngle={2} isAnimationActive={false}>
          {data.map((d, i) => (
            <Cell key={d.name} fill={d.color ?? PALETTE[i % PALETTE.length]} stroke="var(--surface)" />
          ))}
        </Pie>
        <Tooltip {...tip} formatter={(v: number) => `${fmtNum(v, locale)} ${unit ?? ""}`} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function Gauge({ value, max, label, sub }: { value: number; max: number; label: string; sub?: string }) {
  const pct = Math.max(0, Math.min(1, max ? value / max : 0));
  const a = Math.PI * (1 - pct);
  const x = 60 + 48 * Math.cos(a);
  const y = 60 - 48 * Math.sin(a);
  const color = pct >= 0.9 ? "var(--success)" : pct >= 0.6 ? "var(--primary)" : "var(--warning)";
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 70" className="w-full max-w-[170px]">
        <path d="M12 60 A48 48 0 0 1 108 60" fill="none" stroke="var(--surface-2)" strokeWidth="10" strokeLinecap="round" />
        <path d={`M12 60 A48 48 0 0 1 ${x} ${y}`} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" />
        <text x="60" y="56" textAnchor="middle" fontSize="15" fontWeight="800" fill="var(--text)">
          {Math.round(pct * 100)}%
        </text>
      </svg>
      <div className="text-xs font-semibold">{label}</div>
      {sub && <div className="num text-[11px] text-muted">{sub}</div>}
    </div>
  );
}
