"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  User,
  Briefcase,
  IdCard,
  Loader2,
  RotateCw,
} from "lucide-react";
import { getStudentsByYear } from "@/action/studentsAction";
import type { StudentApi } from "@/types/studentsList";
import Image from "next/image";

const PAGE_SIZE = 15;

type Props = {
  year: number;
};

export default function StudentsYearPage({ year }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<StudentApi[]>([]);
  const [count, setCount] = useState(0);
  const [nextSkip, setNextSkip] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchStudents = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await getStudentsByYear(year, search, 0, PAGE_SIZE);

        if (cancelled) return;

        setStudents(result.students);
        setCount(result.count);
        setNextSkip(result.nextSkip);
        setHasMore(result.hasMore);
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล"
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStudents();

    return () => {
      cancelled = true;
    };
  }, [year, search]);

  const handleSearch = () => {
    setSearch(keyword.trim());
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);

    try {
      const result = await getStudentsByYear(year, search, nextSkip, PAGE_SIZE);

      setStudents((prev) => [...prev, ...result.students]);
      setNextSkip(result.nextSkip);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "โหลดข้อมูลเพิ่มเติมไม่สำเร็จ"
      );
    } finally {
      setLoadingMore(false);
    }
  };

  const isSearching = search.trim().length > 0;

  return (
    <div className="min-h-screen bg-gray-50/50 w-full pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.push("/students")}
          disabled={loading}
          className="group  hidden sm:flex  items-center cursor-pointer gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
        >
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          ย้อนกลับ
        </button>
        <div className="border-b flex flex-col items-center border-iptm-light pb-4 mb-6">
          <Image
            src="/assets/images/iptmlogoalone.png"
            alt="IPTM Logo"
            width={150}
            height={150}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-iptm-black mb-2">
            ปีการศึกษา {year}{" "}
          </h1>
          <p className="text-iptm-dark-gray text-sm">
            สามารถค้นหานิสิตตามชื่อ รหัสนิสิต หรือสายงานที่ทำอยู่
          </p>
        </div>

        <div className="mb-3 flex justify-between bg-white md:p-4 rounded-xl md:border md:border-gray-200/80 md:shadow-sm">
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                placeholder="ค้นหาชื่อ, รหัสนักศึกษา, สายงาน"
                disabled={loading}
                className="w-full rounded-lg border border-gray-200 bg-gray-50/50 pl-10 pr-24 py-2 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="cursor-pointer rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              ค้นหา
            </button>
          </div>
          <div className="hidden md:flex items-center gap-2">
            {!loading && (
              <span className="text-xs text-nowrap font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                ทั้งหมด {count} คน
              </span>
            )}
          </div>
        </div>
        {isSearching && (
          <div className="mb-3 flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 p-2 rounded-md">
            <AlertCircle size={14} className="text-blue-500" />
            <span>
              กำลังค้นหาเฉพาะข้อมูลที่โหลดมาแล้ว ({students.length} คน) หากไม่พบ
              ให้กดล้างค่าแล้วกดปุ่มโหลดเพิ่มด้านล่างตาราง
            </span>
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => router.refresh()}
              className="flex items-center gap-1 text-xs font-semibold bg-white border border-red-200 px-3 py-1 rounded-md shadow-sm hover:bg-red-50"
            >
              <RefreshCw size={12} /> รีเฟรชหน้า
            </button>
          </div>
        )}

        {/* Loading Base State */}
        {loading && (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
            <Loader2 className="inline-block h-7 w-7 animate-spin text-blue-600" />
            <p className="mt-2 text-xs font-medium text-gray-400">
              กำลังเปิดสมุดทำเนียบนิสิต...
            </p>
          </div>
        )}

        {/* Table List View */}
        {!loading && !error && (
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
            <div className="px-5 py-2.5 bg-gray-50/50 border-b border-gray-200 text-xs text-gray-400 font-medium">
              แสดงผลอยู่ {students.length} จาก {count} คน
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100/40 text-[11px] font-bold tracking-wider text-gray-500 uppercase border-b border-gray-200">
                    <th className="py-2.5 px-5 w-32">
                      <span className="flex items-center gap-1">
                        <IdCard size={12} className="hidden md:block" />{" "}
                        รหัสนักศึกษา
                      </span>
                    </th>
                    <th className="py-2.5 px-5">
                      <span className="flex items-center gap-1">
                        <User size={12} className="hidden md:block" /> ชื่อ -
                        นามสกุล
                      </span>
                    </th>
                    <th className="py-2.5 px-5">
                      <span className="flex items-center gap-1">
                        <Briefcase size={12} className="hidden md:block" />{" "}
                        สายงาน / อาชีพ
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs sm:text-sm text-gray-700">
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-blue-50/20 transition-colors"
                    >
                      <td className="py-3 px-5 font-mono text-gray-600 text-xs font-medium">
                        {student.studentCode}
                      </td>
                      <td className="py-3 px-5 font-semibold text-gray-900">
                        {student.firstNameTh} {student.lastNameTh}
                      </td>
                      <td className="py-3 px-5">
                        {student.jobField ? (
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {student.jobField}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic text-xs">
                            ยังไม่ระบุข้อมูลงาน
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!isSearching && hasMore && (
              <div className="p-4 bg-gray-50/30 border-t border-gray-100 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex items-center cursor-pointer gap-2 px-4 py-1.5 rounded-lg border border-gray-300 bg-white text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <Loader2
                        size={12}
                        className="animate-spin text-gray-400"
                      />
                      กำลังดึงข้อมูลเพิ่ม...
                    </>
                  ) : (
                    "ดูข้อมูลเพิ่มเติม"
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {!loading && !error && students.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl mt-2 border border-gray-200 shadow-sm">
            <span className="text-3xl">
              <Search className="inline-block" />
            </span>
            <p className="text-sm text-gray-500 font-medium mt-2">
              ไม่พบรายชื่อที่ตรงกับเงื่อนไขการค้นหาในระบบ
            </p>
            <button
              onClick={() => {
                setKeyword("");
                setSearch("");
              }}
              className="mt-2 text-xs text-blue-600 font-semibold hover:underline"
            >
              ล้างค่าคำค้นหา
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
