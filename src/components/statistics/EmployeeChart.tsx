/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { EmploymentSectorItem } from "@/types/staticType";

interface SectorComparisonChartProps {
  data: EmploymentSectorItem[];
}

const SECTOR_CONFIG = [
  { key: "private", label: "ภาคเอกชน", color: "#3B82F6" },
  { key: "government", label: "ภาครัฐ", color: "#F59E0B" },
  { key: "stateEnterprise", label: "รัฐวิสาหกิจ", color: "#8B5CF6" },
  { key: "selfEmployed", label: "ผู้ประกอบการ", color: "#10B981" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((s: number, p: any) => s + (p.value ?? 0), 0);
    return (
      <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
          ปีที่จบ {label}
        </p>
        {[...payload].reverse().map((entry: any) => {
          const cfg = SECTOR_CONFIG.find((s) => s.key === entry.dataKey);
          return (
            <p
              key={entry.dataKey}
              className="text-sm"
              style={{ color: cfg?.color }}
            >
              {cfg?.label}:{" "}
              <span className="font-bold">
                {entry.value} คน{" "}
                <span className="font-normal text-gray-400">
                  ({total ? ((entry.value / total) * 100).toFixed(1) : 0}%)
                </span>
              </span>
            </p>
          );
        })}
        <p className="mt-1 border-t border-gray-100 pt-1 text-xs text-gray-400">
          รวม {total} คน
        </p>
      </div>
    );
  }
  return null;
};

export function SectorComparisonChart({ data }: SectorComparisonChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    year: item.year.toString(),
  }));

  const totals = SECTOR_CONFIG.map((cfg) => ({
    ...cfg,
    total: data.reduce(
      (s, d) => s + (d[cfg.key as keyof EmploymentSectorItem] as number),
      0
    ),
  }));
  const grandTotal = totals.reduce((s, t) => s + t.total, 0);

  return (
    <div className="w-full rounded-2xl border border-iptm-dark-gray/10 p-6 shadow-md">
      <div className="mb-6">
        <div className="mb-1 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <p className="text-xs font-semibold uppercase tracking-widest text-iptm-dark-gray">
            Employment Sector
          </p>
        </div>
        <h2 className="text-lg font-bold text-iptm-black">
          สถิติการทำงานแยกตามภาคส่วน
        </h2>
        <p className="mt-0.5 text-sm text-iptm-dark-gray">
          สัดส่วนบัณฑิตในภาคเอกชน ภาครัฐ รัฐวิสาหกิจ และผู้ประกอบการ
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {totals.map((t) => (
          <div
            key={t.key}
            className="flex items-center gap-2 rounded-full border px-3 py-1.5"
            style={{
              borderColor: t.color + "33",
              backgroundColor: t.color + "0f",
            }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: t.color }}
            />
            <span className="text-xs font-medium" style={{ color: t.color }}>
              {t.label}{" "}
              {grandTotal ? ((t.total / grandTotal) * 100).toFixed(1) : 0}%
            </span>
          </div>
        ))}
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
            barSize={36}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="year"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
            <Legend
              formatter={(value) => {
                const cfg = SECTOR_CONFIG.find((s) => s.key === value);
                return (
                  <span className="text-xs text-gray-500">
                    {cfg?.label ?? value}
                  </span>
                );
              }}
            />
            <Bar
              dataKey="private"
              stackId="a"
              fill="#3B82F6"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="government"
              stackId="a"
              fill="#F59E0B"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="stateEnterprise"
              stackId="a"
              fill="#8B5CF6"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="selfEmployed"
              stackId="a"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
