"use client";

interface StatsBarProps {
  total: number;
  admin: number;
  noProfile: number;
  loading: boolean;
}

const STATS = [
  { key: "total" as const, label: "ผู้ใช้ทั้งหมด", color: "text-gray-800" },
  { key: "admin" as const, label: "Admin", color: "text-violet-600" },
  { key: "noProfile" as const, label: "ไม่มีโปรไฟล์", color: "text-amber-500" },
];

export function StatsBar({ total, admin, noProfile, loading }: StatsBarProps) {
  const values = { total, admin, noProfile };

  return (
    <div className="grid grid-cols-3 gap-3">
      {STATS.map((s) => (
        <div
          key={s.label}
          className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-center shadow-sm"
        >
          <div className={`text-2xl font-bold tabular-nums ${s.color}`}>
            {loading ? <span className="opacity-30">—</span> : values[s.key]}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
