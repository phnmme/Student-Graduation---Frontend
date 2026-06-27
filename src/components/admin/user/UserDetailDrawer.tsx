"use client";

import {
  X,
  Hash,
  ShieldCheck,
  Calendar,
  Clock,
  BadgeCheck,
  Phone,
  GraduationCap,
  Building2,
  AlertTriangle,
  KeyRound,
  Trash2,
} from "lucide-react";
import type { UserDetail } from "@/action/backend/usersAction";
import { ConfirmPanel } from "./ConfirmPanel";
import { TempPasswordCard } from "./TempPasswordCard";
import { getInitial } from "@/lib/utils";
import { MetaChip, SectionLabel } from "./ui";
import { SECTOR_LABEL } from "@/types/user";

interface UserDetailDrawerProps {
  selectedId: number;
  detail: UserDetail | null;
  loading: boolean;
  tempPassMap: Record<number, string>;
  showPassMap: Record<number, boolean>;
  copiedId: number | null;
  deleteId: number | null;
  deleteLoading: boolean;
  resetId: number | null;
  resetLoading: boolean;
  onClose: () => void;
  onTogglePass: (id: number) => void;
  onCopy: (id: number) => void;
  onSetDeleteId: (id: number | null) => void;
  onSetResetId: (id: number | null) => void;
  onDelete: (id: number) => void;
  onReset: (id: number) => void;
}

export function UserDetailDrawer({
  detail,
  loading,
  tempPassMap,
  showPassMap,
  copiedId,
  deleteId,
  deleteLoading,
  resetId,
  resetLoading,
  onClose,
  onTogglePass,
  onCopy,
  onSetDeleteId,
  onSetResetId,
  onDelete,
  onReset,
}: UserDetailDrawerProps) {
  return (
    <div className="w-full lg:flex-1 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50 shrink-0">
        {loading ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-2.5 w-48 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        ) : detail ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 border border-violet-200 flex items-center justify-center text-sm font-bold text-violet-600 shrink-0">
              {getInitial(detail)}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800 leading-tight">
                {detail.profile
                  ? `${detail.profile.firstNameTh} ${detail.profile.lastNameTh}`
                  : "ไม่มีโปรไฟล์"}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{detail.email}</div>
            </div>
          </div>
        ) : null}
        <button
          onClick={onClose}
          aria-label="ปิด"
          className="text-gray-300 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer ml-auto"
        >
          <X size={15} />
        </button>
      </div>

      {/* Body */}
      {loading ? (
        <div className="p-5 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-12 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : detail ? (
        <div className="p-5 space-y-6 overflow-y-auto flex-1">
          {/* Account */}
          <section>
            <SectionLabel>ข้อมูลบัญชี</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              <MetaChip
                icon={<Hash size={10} />}
                label="User ID"
                value={`#${detail.id}`}
              />
              <MetaChip
                icon={<ShieldCheck size={10} />}
                label="Role"
                value={detail.role}
              />
              <MetaChip
                icon={<Calendar size={10} />}
                label="สมัครเมื่อ"
                value={new Date(detail.createdAt).toLocaleDateString("th-TH")}
              />
              <MetaChip
                icon={<Clock size={10} />}
                label="อัปเดตล่าสุด"
                value={new Date(detail.updatedAt).toLocaleDateString("th-TH")}
              />
              <MetaChip
                icon={<Hash size={10} />}
                label="บันทึกระบบ"
                value={`${detail._count.logs} รายการ`}
              />
              <MetaChip
                icon={<BadgeCheck size={10} />}
                label="รีวิวอาชีพ"
                value={`${detail._count.careerReviews} รายการ`}
              />
            </div>
          </section>

          {/* Profile */}
          {detail.profile ? (
            <section>
              <SectionLabel>ข้อมูลนักศึกษา</SectionLabel>
              <div className="grid grid-cols-2 gap-2">
                <MetaChip
                  icon={<Hash size={10} />}
                  label="รหัสนักศึกษา"
                  value={detail.profile.studentCode}
                />
                <MetaChip
                  icon={<Phone size={10} />}
                  label="โทรศัพท์"
                  value={detail.profile.phoneNumber ?? "—"}
                />
                <MetaChip
                  icon={<GraduationCap size={10} />}
                  label="ปีเข้า"
                  value={`${detail.profile.entryYear}`}
                />
                <MetaChip
                  icon={<GraduationCap size={10} />}
                  label="ปีจบ"
                  value={
                    detail.profile.gradYear
                      ? `${detail.profile.gradYear}`
                      : "ยังไม่จบ"
                  }
                />
                <div className="col-span-2">
                  <MetaChip
                    icon={<Building2 size={10} />}
                    label="ภาควิชา"
                    value={detail.profile.department}
                  />
                </div>
                {detail.profile.jobField && (
                  <MetaChip
                    icon={<BadgeCheck size={10} />}
                    label="สายงาน"
                    value={detail.profile.jobField}
                  />
                )}
                {detail.profile.employment_sector && (
                  <MetaChip
                    icon={<Building2 size={10} />}
                    label="ภาคการจ้างงาน"
                    value={
                      SECTOR_LABEL[detail.profile.employment_sector] ??
                      detail.profile.employment_sector
                    }
                  />
                )}
                <MetaChip
                  icon={<BadgeCheck size={10} />}
                  label="ต่อเนื่องจากสหกิจ"
                  value={detail.profile.continued_from_coop ? "ใช่" : "ไม่"}
                />
              </div>
            </section>
          ) : (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-600">
              <AlertTriangle size={14} /> ผู้ใช้นี้ยังไม่มีโปรไฟล์นักศึกษา
            </div>
          )}

          {/* Temp Password */}
          {tempPassMap[detail.id] && (
            <section>
              <SectionLabel>รหัสผ่านชั่วคราว</SectionLabel>
              <TempPasswordCard
                userId={detail.id}
                password={tempPassMap[detail.id]}
                visible={!!showPassMap[detail.id]}
                copied={copiedId === detail.id}
                onToggleVisible={() => onTogglePass(detail.id)}
                onCopy={() => onCopy(detail.id)}
              />
            </section>
          )}

          {/* Actions */}
          <section>
            <SectionLabel>การดำเนินการ</SectionLabel>
            <div className="flex flex-col gap-2">
              {resetId === detail.id ? (
                <ConfirmPanel
                  variant="reset"
                  email={detail.email}
                  loading={resetLoading}
                  onCancel={() => onSetResetId(null)}
                  onConfirm={() => onReset(detail.id)}
                />
              ) : (
                <button
                  onClick={() => onSetResetId(detail.id)}
                  className="flex items-center gap-2.5 text-sm cursor-pointer bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200 px-4 py-3 rounded-xl transition-colors font-medium"
                >
                  <KeyRound size={15} /> รีเซ็ตรหัสผ่าน
                </button>
              )}

              {deleteId === detail.id ? (
                <ConfirmPanel
                  variant="delete"
                  email={detail.email}
                  loading={deleteLoading}
                  onCancel={() => onSetDeleteId(null)}
                  onConfirm={() => onDelete(detail.id)}
                />
              ) : (
                <button
                  onClick={() => onSetDeleteId(detail.id)}
                  className="flex items-center gap-2.5 text-sm cursor-pointer bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 px-4 py-3 rounded-xl transition-colors font-medium"
                >
                  <Trash2 size={15} /> ลบบัญชีผู้ใช้นี้
                </button>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
