"use client";

import { ToastState } from "@/types/user";
import { Check, AlertTriangle, RefreshCw } from "lucide-react";

// ─── MetaChip ─────────────────────────────────────────────────────────────────

export function MetaChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 min-w-0">
      <div className="flex items-center gap-1 text-gray-400 text-[10px] uppercase tracking-widest mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-xs text-gray-700 font-medium truncate">{value}</div>
    </div>
  );
}

// ─── SectionLabel ─────────────────────────────────────────────────────────────

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.15em]">
        {children}
      </span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

// ─── RoleBadge ────────────────────────────────────────────────────────────────

export function RoleBadge({ role }: { role: string }) {
  if (role === "ADMIN")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] bg-violet-50 text-violet-600 border border-violet-200 px-1.5 py-0.5 rounded-md font-medium shrink-0">
        Admin
      </span>
    );
  if (role === "OWNER")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-md font-medium shrink-0">
        Owner
      </span>
    );
  return null;
}

// ─── NoProfileBadge ───────────────────────────────────────────────────────────

export function NoProfileBadge() {
  return (
    <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-md hidden sm:inline-flex items-center gap-1 shrink-0">
      ไม่มีโปรไฟล์
    </span>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full border-2 border-gray-200 border-t-gray-500 animate-spin"
    />
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

export function Toast({ toast }: { toast: ToastState }) {
  const isSuccess = toast.type === "success";
  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium shadow-lg border animate-in fade-in slide-in-from-top-3 duration-200 ${
        isSuccess
          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
          : "bg-red-50 border-red-200 text-red-700"
      }`}
    >
      {isSuccess ? <Check size={14} /> : <AlertTriangle size={14} />}
      {toast.msg}
    </div>
  );
}

// ─── RefreshButton ────────────────────────────────────────────────────────────

export function RefreshButton({
  loading,
  onClick,
}: {
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center justify-center gap-2 bg-iptm-gold hover:bg-iptm-gold/90 border border-gray-200 text-iptm-white  text-sm px-4 py-2.5 rounded-xl transition-all w-full sm:w-auto disabled:opacity-40 cursor-pointer shadow-sm"
    >
      <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
      รีเฟรช
    </button>
  );
}
