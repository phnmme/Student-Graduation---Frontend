"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { StudentsYearPage } from "@/components/students";

type Props = {
  params: Promise<{ year: string }>;
};

export default function StudentYearPage({ params }: Props) {
  const { year } = use(params);
  const router = useRouter();
  const yearNum = parseInt(year);

  if (isNaN(yearNum)) {
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-bluez-tone-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">ปีการศึกษาไม่ถูกต้อง</p>
          <button
            onClick={() => router.push("/students")}
            className="px-4 py-2 bg-bluez-tone-3 text-white rounded-lg"
          >
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center overflow-hidden pt-26 min-h-screen bg-iptm-white md:px-10">
      <StudentsYearPage year={yearNum} />
    </div>
  );
}
