"use client";

import { StudentApi } from "@/types/studentsList";
import { Briefcase, GraduationCap, IdCard } from "lucide-react";

type Props = {
  student: StudentApi;
};

export default function StudentCard({ student }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="absolute top-0 left-0 h-[3px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />

      <div className="flex flex-col h-full justify-between gap-4">
        <div>
          {/* Name */}
          <h3 className="font-semibold text-gray-900 text-base line-clamp-1 group-hover:text-blue-600 transition-colors">
            {student.firstNameTh} {student.lastNameTh}
          </h3>

          {/* Occupation */}
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <Briefcase size={14} className="text-gray-400 shrink-0" />
            <span className="font-medium line-clamp-1">
              {student.jobField || "ไม่ระบุตำแหน่งงาน"}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <IdCard size={13} className="text-gray-400" />
            <span>{student.studentCode}</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md">
            <GraduationCap size={13} className="text-gray-400" />
            <span>ปี {student.gradYear ?? "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
