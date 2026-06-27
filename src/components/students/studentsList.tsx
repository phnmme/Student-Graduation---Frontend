"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  User,
  Briefcase,
  GraduationCap,
  IdCard,
  ChevronDown,
} from "lucide-react";
import { getAllStudentsGrouped } from "@/action/studentsAction";
import type { StudentGroup } from "@/types/studentsList";
import Image from "next/image";

type Props = { years: number[] };

export default function StudentsList({ years }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [groups, setGroups] = useState<StudentGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryToken, setRetryToken] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | "">("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchStudents = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await getAllStudentsGrouped();
        if (cancelled) return;
        setGroups(result);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล"
        );
        setGroups([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchStudents();
    return () => {
      cancelled = true;
    };
  }, [retryToken]);

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groups;
    const q = search.toLowerCase().trim();
    return groups
      .map((group) => ({
        ...group,
        students: group.students.filter((s) => {
          const fullName = `${s.firstNameTh} ${s.lastNameTh}`.toLowerCase();
          return (
            fullName.includes(q) ||
            s.studentCode.toLowerCase().includes(q) ||
            (s.jobField || "").toLowerCase().includes(q)
          );
        }),
      }))
      .filter((group) => group.students.length > 0);
  }, [groups, search]);

  const isSearching = search.trim().length > 0;

  return (
    <div className="min-h-screen bg-gray-50/50 w-full pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="border-b flex flex-col items-center border-iptm-light pb-4 mb-6">
          <Image
            src="/assets/images/iptmlogoalone.png"
            alt="IPTM Logo"
            width={150}
            height={150}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-iptm-black mb-2">
            รายชื่อนิสิตที่จบการศึกษา
          </h1>
          <p className="text-iptm-dark-gray text-sm">
            สามารถค้นหานิสิตตามชื่อ รหัสนิสิต หรือสายงานที่ทำอยู่
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-end bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm">
          <div ref={dropdownRef} className="relative  w-full sm:w-56 text-sm">
            <button
              type="button"
              disabled={loading}
              onClick={() => setIsOpen(!isOpen)}
              className="flex w-full items-center cursor-pointer  justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            >
              <span
                className={!selectedYear ? "text-slate-400 font-normal " : ""}
              >
                {selectedYear
                  ? `ปีการศึกษา ${selectedYear}`
                  : "เลือกปีการศึกษาที่จบ"}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-slate-150 bg-white p-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedYear("");
                    setIsOpen(false);
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-slate-400 hover:bg-slate-50 transition-colors"
                >
                  เลือกปีการศึกษาที่จบ
                </button>

                {years.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => {
                      setSelectedYear(year);
                      setIsOpen(false);
                      router.push(`/students/${year}`);
                    }}
                    className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                      selectedYear === year
                        ? "bg-iptm-white font-semibold text-blue-600" // สไตล์ตอนคอลัมน์นั้นถูกเลือก
                        : "text-iptm-navy hover:hover:bg-gray-100 duration-500 transition-all cursor-pointer" // สไตล์ปกติ
                    }`}
                  >
                    ปีการศึกษา {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setRetryToken((t) => t + 1)}
              className="flex items-center gap-1 text-xs font-semibold bg-white border border-red-200 px-3 py-1 rounded-md shadow-sm hover:bg-red-50"
            >
              <RefreshCw size={12} /> โหลดใหม่
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p className="mt-2 text-xs font-medium text-gray-400">
              กำลังเรียกค้นข้อมูล...
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          filteredGroups.map((group) => (
            <div
              key={group.gradYear}
              className="mb-10 bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden"
            >
              <div className="bg-gray-50/70 px-5 py-3 border-b border-gray-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap size={18} className="text-blue-600" />
                  <h2 className="font-bold text-gray-800 text-sm sm:text-base">
                    ปีการศึกษา {group.gradYear}
                  </h2>
                </div>
                <button
                  onClick={() => router.push(`/students/${group.gradYear}`)}
                  className="flex items-center gap-0.5 text-xs cursor-pointer font-semibold text-blue-600 hover:text-blue-700 transition"
                >
                  ดูนิสิตทั้งหมด ({group.count})
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100/50 text-[11px] font-bold tracking-wider text-gray-500 uppercase border-b border-gray-200">
                      <th className="py-2.5 px-5 w-32">
                        <span className="flex items-center gap-1">
                          <IdCard size={12} className="hidden md:block" />
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
                          <Briefcase size={12} className="hidden md:block" />
                          สายงาน / อาชีพ
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs sm:text-sm text-gray-700">
                    {group.students.map((student) => (
                      <tr
                        key={student.id}
                        className="hover:bg-blue-50/30 transition-colors"
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
            </div>
          ))}

        {/* Empty State */}
        {!loading && !error && filteredGroups.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm max-w-md mx-auto">
            <span className="text-3xl">📋</span>
            <p className="text-sm text-gray-500 font-medium mt-2">
              ไม่พบรายชื่อหรือข้อมูลที่ตรงตามเงื่อนไข
            </p>
            {isSearching && (
              <button
                onClick={() => setSearch("")}
                className="mt-2 text-xs text-blue-600 font-semibold hover:underline"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
