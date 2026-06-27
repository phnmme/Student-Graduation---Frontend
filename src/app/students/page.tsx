"use client";

import { useEffect, useState } from "react";
import { StudentsList } from "@/components/students";
import { getAllYear } from "@/action/studentsAction";

export default function StudentsPage() {
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllYear()
      .then((res) => setYears(res.data.years))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-bluez-tone-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-bluez-tone-5 mb-4" />
          <p className="text-bluez-tone-5">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-bluez-tone-4">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl">
            <p className="font-semibold mb-2">เกิดข้อผิดพลาด</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-iptm-white text-white rounded-lg hover:bg-bluez-tone-2 transition"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );

  return (
    <div className="relative flex items-center justify-center overflow-hidden pt-26 min-h-screen bg-iptm-white md:px-10">
      <StudentsList years={years} />
    </div>
  );
}
