/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { GraduationStatusItem } from "@/types/staticType";

interface GraduationStatusChartProps {
  data: GraduationStatusItem[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const onTime = payload.find((p: any) => p.dataKey === "onTime")?.value ?? 0;
    const late = payload.find((p: any) => p.dataKey === "late")?.value ?? 0;
    const total = onTime + late;
    return (
      <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
          ปีที่จบ {label}
        </p>
        <p className="text-sm text-emerald-600">
          จบตรงเวลา:{" "}
          <span className="font-bold">
            {onTime} คน ({total ? ((onTime / total) * 100).toFixed(1) : 0}%)
          </span>
        </p>
        <p className="text-sm text-rose-500">
          จบช้า:{" "}
          <span className="font-bold">
            {late} คน ({total ? ((late / total) * 100).toFixed(1) : 0}%)
          </span>
        </p>
        <p className="mt-1 border-t border-gray-100 pt-1 text-xs text-gray-400">
          รวม {total} คน
        </p>
      </div>
    );
  }
  return null;
};

export function GraduationStatusChart({ data }: GraduationStatusChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    year: item.year.toString(),
  }));

  const totalOnTime = data.reduce((s, d) => s + d.onTime, 0);
  const totalLate = data.reduce((s, d) => s + d.late, 0);
  const total = totalOnTime + totalLate;
  const onTimePercent = total ? ((totalOnTime / total) * 100).toFixed(1) : "0";

  return (
    <div className="w-full rounded-2xl border border-iptm-dark-gray/10 p-6 shadow-md">
      <div className="mb-6">
        <div className="mb-1 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
          <p className="text-xs font-semibold uppercase tracking-widest text-iptm-dark-gray">
            Graduation Timeline
          </p>
        </div>
        <h2 className="text-lg font-bold text-iptm-black">
          สถิติการจบการศึกษาตามกำหนด
        </h2>
        <p className="mt-0.5 text-sm text-iptm-dark-gray">
          แนวโน้มนิสิตที่จบตรงเวลา (3 ปี) และจบช้ากว่ากำหนดในแต่ละปี
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-emerald-700">
            จบตรงเวลา {onTimePercent}% ({totalOnTime} คน)
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-400" />
          <span className="text-xs font-medium text-rose-700">
            จบช้า {total ? (100 - parseFloat(onTimePercent)).toFixed(1) : 0}% (
            {totalLate} คน)
          </span>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
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
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span className="text-xs text-gray-500">
                  {value === "onTime" ? "จบตรงเวลา" : "จบช้ากว่ากำหนด"}
                </span>
              )}
            />
            <Line
              type="monotone"
              dataKey="onTime"
              stroke="#10B981"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#10B981" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="late"
              stroke="#F43F5E"
              strokeWidth={2.5}
              strokeDasharray="5 4"
              dot={{ r: 4, fill: "#F43F5E" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
