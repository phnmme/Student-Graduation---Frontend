"use client";

import { Clock, Eye, EyeOff, Copy, Check } from "lucide-react";

interface TempPasswordCardProps {
  userId: number;
  password: string;
  visible: boolean;
  copied: boolean;
  onToggleVisible: () => void;
  onCopy: () => void;
}

export function TempPasswordCard({
  password,
  visible,
  copied,
  onToggleVisible,
  onCopy,
}: TempPasswordCardProps) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs text-amber-600">
        <Clock size={12} /> รหัสผ่านชั่วคราว — หมดอายุใน 24 ชั่วโมง
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2.5 font-mono text-sm text-gray-800 tracking-widest overflow-hidden shadow-inner">
          {visible ? password : "●".repeat(12)}
        </div>
        <button
          onClick={onToggleVisible}
          aria-label={visible ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
          className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
        <button
          onClick={onCopy}
          className="flex items-center gap-1.5 text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          {copied ? (
            <>
              <Check size={12} /> คัดลอกแล้ว
            </>
          ) : (
            <>
              <Copy size={12} /> คัดลอก
            </>
          )}
        </button>
      </div>
    </div>
  );
}
