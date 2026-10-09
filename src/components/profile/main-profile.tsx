"use client";

import React, { useState } from "react";
import { ProfileHeader } from "./profile-header";
import { ProfileInfoCard } from "./profile-info-card";
import { ProfileEditForm } from "./profile-edit-form";
import { EmploymentHistoryModal } from "./employment-history-modal";
import { addEmploymentHistory, deleteEmploymentHistory, getProfile, updateProfile, type EmploymentHistoryItem } from "@/action/profileAction";
import { useRouter } from "next/navigation";

interface ProfileData {
  id: number;
  studentCode: string;
  firstNameTh: string;
  lastNameTh: string;
  phoneNumber: string | null;
  department: string;
  entryYear: number;
  gradYear: number | null;
  jobField: string | null;
  companyName: string | null;
  jobStartYear: number | null;
  continued_from_coop: boolean;
  employment_sector: string | null;
  employmentHistory?: EmploymentHistoryItem[];
}

interface Props {
  user: { id: number; email: string; profile: ProfileData } | null;
}

function initialProfile(user: Props["user"]) {
  return {
    fullName: user?.profile?.firstNameTh && user?.profile?.lastNameTh ? `${user.profile.firstNameTh} ${user.profile.lastNameTh}` : "",
    studentCode: user?.profile?.studentCode || "",
    department: user?.profile?.department || "",
    gradYear: user?.profile?.gradYear ? String(user.profile.gradYear) : "",
    jobField: user?.profile?.jobField || "",
    companyName: user?.profile?.companyName || "",
    jobStartYear: user?.profile?.jobStartYear ? String(user.profile.jobStartYear) : "",
    continuedFromCoop: user?.profile?.continued_from_coop || false,
    employmentSector: user?.profile?.employment_sector || null,
  };
}

export default function MainProfile({ user }: Props) {
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [employmentHistory, setEmploymentHistory] = useState<EmploymentHistoryItem[]>(user?.profile?.employmentHistory ?? []);
  const [profile, setProfile] = useState(() => initialProfile(user));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => {
      if (name === "continuedFromCoop") return { ...prev, continuedFromCoop: value === "true" };
      if (name === "employmentSector") return { ...prev, employmentSector: value || null };
      if (name === "jobField" && value.trim() === "") return { ...prev, jobField: value, continuedFromCoop: false, employmentSector: null };
      return { ...prev, [name]: value };
    });
    setError("");
  };

  const handleSave = async () => {
    if (!profile.fullName.trim()) return setError("กรุณากรอกชื่อ-นามสกุล");
    if (!profile.studentCode.trim()) return setError("กรุณากรอกรหัสนักศึกษา");
    const gradYearNum = Number(profile.gradYear);
    if (!Number.isInteger(gradYearNum) || gradYearNum < 2500 || gradYearNum > 2600) return setError("กรุณากรอกปีที่จบการศึกษาที่ถูกต้อง (2500-2600)");
    const jobStartYearNum = profile.jobStartYear.trim() ? Number(profile.jobStartYear) : null;
    if (jobStartYearNum !== null && (!Number.isInteger(jobStartYearNum) || jobStartYearNum < 2500 || jobStartYearNum > 2600)) return setError("กรุณากรอกปีที่เริ่มงานเป็น พ.ศ. ให้ถูกต้อง (2500-2600)");

    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      await updateProfile({
        fullname: profile.fullName.trim(),
        studentCode: profile.studentCode.trim(),
        department: profile.department.trim(),
        gradYear: gradYearNum,
        jobField: profile.jobField.trim(),
        companyName: profile.companyName.trim() || null,
        jobStartYear: jobStartYearNum,
        continuedFromCoop: profile.continuedFromCoop,
        employmentSector: profile.employmentSector,
      });
      const refreshed = await getProfile();
      setEmploymentHistory(refreshed?.data?.user?.profile?.employmentHistory ?? employmentHistory);
      setSuccess("อัปเดตโปรไฟล์สำเร็จ");
      setIsEdit(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setProfile(initialProfile(user));
    setError("");
    setSuccess("");
    setIsEdit(false);
  };

  const handleAddHistory = async (data: { jobTitle: string; companyName: string; startYear: number; description?: string }) => {
    const result = await addEmploymentHistory(data);
    if (result?.data) setEmploymentHistory((current) => [result.data as EmploymentHistoryItem, ...current].sort((a, b) => (b.startYear ?? 0) - (a.startYear ?? 0)));
    else {
      const refreshed = await import("@/action/profileAction").then((m) => m.getProfile());
      setEmploymentHistory(refreshed?.data?.user?.profile?.employmentHistory ?? []);
    }
  };

  const handleDeleteHistory = async (id: number) => {
    await deleteEmploymentHistory(id);
    setEmploymentHistory((current) => current.filter((item) => item.id !== id));
  };

  const fullName = profile.fullName || "ไม่ระบุ";
  const studentCode = profile.studentCode || "ไม่ระบุ";
  const currentJob = profile.jobField.trim() || "ยังไม่ได้ระบุตำแหน่งงาน";

  return (
    <>
      <main className="relative z-10 mt-10 w-full py-8 md:py-16">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4">
          <ProfileHeader fullName={fullName} studentId={studentCode} job={currentJob} isEdit={isEdit} onEditClick={() => setIsEdit(true)} />
          {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
          {success && <div role="status" className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}
          {!isEdit ? (
            <ProfileInfoCard profile={{ fullName, studentCode, department: profile.department || "ไม่ระบุ", gradYear: profile.gradYear || "ไม่ระบุ", jobField: currentJob, companyName: profile.companyName || "ยังไม่ได้ระบุบริษัท / องค์กร", jobStartYear: profile.jobStartYear || "ยังไม่ได้ระบุปีที่เริ่มงาน" }} employmentHistory={employmentHistory} onManageHistory={() => setHistoryOpen(true)} />
          ) : (
            <ProfileEditForm profile={{ ...profile, gradYear: profile.gradYear }} onChange={handleChange} onSave={handleSave} onCancel={handleCancel} isLoading={isLoading} />
          )}
        </div>
      </main>
      <EmploymentHistoryModal open={historyOpen} history={employmentHistory} onClose={() => setHistoryOpen(false)} onAdd={handleAddHistory} onDelete={handleDeleteHistory} />
    </>
  );
}
