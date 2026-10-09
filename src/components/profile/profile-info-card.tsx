import React from "react";
import { GraduationCap, BookOpen, CalendarDays, Briefcase, UserCircle, History, Building2 } from "lucide-react";
import type { EmploymentHistoryItem } from "@/action/profileAction";

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-4 rounded-xl p-3 transition hover:bg-bluez-tone-2/20">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bluez-tone-3/10 text-bluez-tone-3">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-bluez-tone-3">{label}</p>
        <p className="font-medium text-bluez-tone-1">{value || "ไม่ระบุ"}</p>
      </div>
    </div>
  );
}

interface ProfileInfoCardProps {
  profile: { fullName: string; studentCode: string; department: string; gradYear: string; jobField: string; companyName: string; jobStartYear: string };
  employmentHistory: EmploymentHistoryItem[];
  onManageHistory: () => void;
}

export function ProfileInfoCard({ profile, employmentHistory, onManageHistory }: ProfileInfoCardProps) {
  return (
    <div className="rounded-xl border border-bluez-tone-2/60 bg-white/85 p-5 shadow-sm md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-congress-400" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-bluez-tone-3">ข้อมูลส่วนตัว</h2>
      </div>
      <div className="grid gap-1 sm:grid-cols-2">
        <InfoRow icon={<UserCircle className="h-5 w-5" />} label="ชื่อ-นามสกุล" value={profile.fullName} />
        <InfoRow icon={<GraduationCap className="h-5 w-5" />} label="รหัสนักศึกษา" value={profile.studentCode} />
        <InfoRow icon={<BookOpen className="h-5 w-5" />} label="สาขา" value={profile.department} />
        <InfoRow icon={<CalendarDays className="h-5 w-5" />} label="ปีที่จบ" value={profile.gradYear} />
        <InfoRow icon={<Briefcase className="h-5 w-5" />} label="ตำแหน่งงานปัจจุบัน" value={profile.jobField === "ไม่ระบุ" ? "" : profile.jobField} />
        <InfoRow icon={<Building2 className="h-5 w-5" />} label="บริษัท / องค์กร" value={profile.companyName} />
        <InfoRow icon={<CalendarDays className="h-5 w-5" />} label="ปีที่เริ่มงาน (พ.ศ.)" value={profile.jobStartYear} />
      </div>
      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-bluez-tone-2/60 bg-bluez-tone-2/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-bluez-tone-1">ประวัติการทำงาน</p>
          <p className="mt-1 text-sm text-slate-600">{employmentHistory.length ? `มีประวัติงาน ${employmentHistory.length} รายการ` : "เพิ่มประวัติตำแหน่งงานที่ผ่านมาได้ที่นี่"}</p>
        </div>
        <button type="button" onClick={onManageHistory} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-bluez-tone-3 px-4 py-2 text-sm font-semibold text-bluez-tone-3 transition hover:bg-bluez-tone-3 hover:text-white">
          <History className="h-4 w-4" />จัดการประวัติงาน
        </button>
      </div>
    </div>
  );
}
