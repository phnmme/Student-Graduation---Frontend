"use client";

import { AlertTriangle, KeyRound } from "lucide-react";

interface ConfirmPanelProps {
  variant: "reset" | "delete";
  email: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmPanel({
  variant,
  email,
  loading,
  onCancel,
  onConfirm,
}: ConfirmPanelProps) {
  const isDelete = variant === "delete";

  const colors = isDelete
    ? {
        wrap: "bg-red-50 border-red-200",
        icon: "text-red-600",
        confirmBtn:
          "bg-red-500 hover:bg-red-600 text-white border-red-500",
        label: "ยืนยันการลบบัญชี?",
        description: "บัญชีนี้จะถูกลบถาวร ไม่สามารถกู้คืนได้",
        confirmLabel: "ลบบัญชี",
        confirmingLabel: "กำลังลบ...",
      }
    : {
        wrap: "bg-sky-50 border-sky-200",
        icon: "text-sky-600",
        confirmBtn:
          "bg-sky-500 hover:bg-sky-600 text-white border-sky-500",
        label: "ยืนยันการรีเซ็ตรหัสผ่าน?",
        description: "ระบบจะสร้างรหัสผ่านชั่วคราวสำหรับ",
        confirmLabel: "ยืนยัน",
        confirmingLabel: "กำลังสร้าง...",
      };

  return (
    <div className={`border rounded-xl p-4 space-y-3 ${colors.wrap}`}>
      <div
        className={`text-sm font-semibold flex items-center gap-2 ${colors.icon}`}
      >
        {isDelete ? <AlertTriangle size={14} /> : <KeyRound size={14} />}
        {colors.label}
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">
        {colors.description}{" "}
        <span className="text-gray-700 font-medium">{email}</span>
      </p>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 text-xs bg-white hover:bg-gray-50 text-gray-500 border border-gray-200 py-2 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
        >
          ยกเลิก
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`flex-1 text-xs border py-2 rounded-lg transition-colors font-semibold disabled:opacity-50 cursor-pointer ${colors.confirmBtn}`}
        >
          {loading ? colors.confirmingLabel : colors.confirmLabel}
        </button>
      </div>
    </div>
  );
}
