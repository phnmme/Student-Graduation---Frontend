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
  Cell,
} from "recharts";

export interface CoopChartItem {
  year: number;
  graduates: number;
  coopEmployed: number;
}

interface CoopEmploymentChartProps {
  data: CoopChartItem[];
}

// coopEmployed เป็น subset ของ graduates → stack เป็น "ทั่วไป" + "สหกิจ"
const prepareData = (data: CoopChartItem[]) =>
  data.map((item) => ({
    year: item.year.toString(),
    สหกิจ: item.coopEmployed,
    ทั่วไป: item.graduates - item.coopEmployed,
    _total: item.graduates,
  }));

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const coop = payload.find((p: any) => p.dataKey === "สหกิจ")?.value ?? 0;
    const general =
      payload.find((p: any) => p.dataKey === "ทั่วไป")?.value ?? 0;
    const total = coop + general;
    const percent = total ? ((coop / total) * 100).toFixed(1) : "0";

    return (
      <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
          ปีที่จบ {label}
        </p>
        <p className="text-sm text-blue-500">
          บัณฑิตทั่วไป: <span className="font-bold">{general} คน</span>
        </p>
        <p className="text-sm text-emerald-600">
          ต่อเนื่องจากสหกิจ:{" "}
          <span className="font-bold">
            {coop} คน{" "}
            <span className="font-normal text-gray-400">({percent}%)</span>
          </span>
        </p>
        <p className="mt-1 border-t border-gray-100 pt-1 text-xs text-gray-400">
          รวมบัณฑิต {total} คน
        </p>
      </div>
    );
  }
  return null;
};

export function CoopEmploymentChart({ data }: CoopEmploymentChartProps) {
  const chartData = prepareData(data);

  const totalGraduates = data.reduce((s, d) => s + d.graduates, 0);
  const totalCoop = data.reduce((s, d) => s + d.coopEmployed, 0);
  const coopPercent = totalGraduates
    ? ((totalCoop / totalGraduates) * 100).toFixed(1)
    : "0";

  return (
    <div className="w-full rounded-2xl border border-iptm-dark-gray/10 p-6 shadow-md">
      <div className="mb-6">
        <div className="mb-1 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-blue-500" />
          <p className="text-xs font-semibold uppercase tracking-widest text-iptm-dark-gray">
            Coop Employment
          </p>
        </div>
        <h2 className="text-lg font-bold text-iptm-black">
          บัณฑิตที่ทำงานต่อจากสหกิจศึกษา
        </h2>
        <p className="mt-0.5 text-sm text-iptm-dark-gray">
          สัดส่วนบัณฑิตที่ได้งานต่อเนื่องจากสหกิจเทียบกับบัณฑิตทั่วไป
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-400" />
          <span className="text-xs font-medium text-blue-700">
            บัณฑิตทั่วไป {100 - parseFloat(coopPercent)}% (
            {totalGraduates - totalCoop} คน)
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-emerald-700">
            ต่อเนื่องจากสหกิจ {coopPercent}% ({totalCoop} คน)
          </span>
        </div>
      </div>

      <div className="h-[300px] w-full">
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
              formatter={(value) => (
                <span className="text-xs text-gray-500">{value}</span>
              )}
            />
            <Bar
              dataKey="ทั่วไป"
              stackId="a"
              fill="#93C5FD"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="สหกิจ"
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
