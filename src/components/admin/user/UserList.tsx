"use client";

import { ChevronRight } from "lucide-react";
import type { User } from "@/action/backend/usersAction";
import { NoProfileBadge, RoleBadge } from "./ui";
import { timeAgo } from "@/lib/utils";

interface UserListProps {
  users: User[];
  loading: boolean;
  selectedId: number | null;
  totalPages: number;
  totalUsers: number;
  page: number;
  onSelect: (id: number | null) => void;
  onPageChange: (page: number) => void;
}

export function UserList({
  users,
  loading,
  selectedId,
  totalPages,
  totalUsers,
  page,
  onSelect,
  onPageChange,
}: UserListProps) {
  return (
    <div
      className={`border border-iptm-light/60  rounded-2xl overflow-hidden shadow-sm transition-all ${
        selectedId ? "w-full lg:w-[46%] xl:w-2/5" : "w-full"
      }`}
    >
      {/* Table header */}
      <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50">
        {["ผู้ใช้", "Role", "อัปเดต", ""].map((h) => (
          <div
            key={h}
            className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest"
          >
            {h}
          </div>
        ))}
      </div>

      {/* Skeleton */}
      {loading && users.length === 0 ? (
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4">
              <div className="w-9 h-9 rounded-xl bg-gray-100 animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
                <div className="h-2.5 bg-gray-50 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="py-20 text-center text-gray-400 text-sm">
          ไม่พบผู้ใช้งาน
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {users.map((u) => {
            const isSelected = selectedId === u.id;
            const fullName = u.profile
              ? `${u.profile.firstNameTh} ${u.profile.lastNameTh}`
              : null;

            return (
              <div
                key={u.id}
                onClick={() => onSelect(isSelected ? null : u.id)}
                className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors group ${
                  isSelected
                    ? "bg-violet-50 border-l-2 border-violet-400"
                    : "border-l-2 border-transparent"
                }`}
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 border border-violet-200 flex items-center justify-center text-sm font-bold text-violet-600 shrink-0">
                  {(fullName ?? u.email).charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-gray-700 truncate">
                      {fullName ?? "—"}
                    </span>
                    <RoleBadge role={u.role} />
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {u.email}
                  </div>
                  {u.profile && (
                    <div className="text-[10px] text-gray-300 mt-0.5">
                      {u.profile.studentCode} · ปี {u.profile.entryYear}
                    </div>
                  )}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2 shrink-0">
                  {!u.profile && <NoProfileBadge />}
                  <span className="text-xs text-gray-300 hidden md:block whitespace-nowrap">
                    {timeAgo(u.updatedAt)}
                  </span>
                  <ChevronRight
                    size={13}
                    className={`text-gray-300 transition-transform ${
                      isSelected
                        ? "rotate-90 text-violet-400"
                        : "group-hover:translate-x-0.5"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50">
          <span className="text-xs text-gray-400">
            หน้า {page} / {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1 || loading}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-30 transition-all cursor-pointer"
            >
              ก่อนหน้า
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages || loading}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-30 transition-all cursor-pointer"
            >
              ถัดไป
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
