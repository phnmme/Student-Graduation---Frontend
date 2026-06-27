"use client";

import { ProfileFilter, RoleFilter } from "@/types/user";
import { Search, Filter } from "lucide-react";

interface UserFiltersProps {
  keyword: string;
  roleFilter: RoleFilter;
  profileFilter: ProfileFilter;
  hasFilter: boolean;
  onKeywordChange: (v: string) => void;
  onRoleChange: (v: RoleFilter) => void;
  onProfileChange: (v: ProfileFilter) => void;
  onClear: () => void;
}

export function UserFilters({
  keyword,
  roleFilter,
  profileFilter,
  hasFilter,
  onKeywordChange,
  onRoleChange,
  onProfileChange,
  onClear,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2.5">
      <div className="relative flex-1">
        <Search
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
        />
        <input
          type="text"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="ค้นหาอีเมล, ชื่อ, รหัสนักศึกษา..."
          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-300 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all shadow-sm"
        />
      </div>
      <select
        value={roleFilter}
        onChange={(e) => onRoleChange(e.target.value as RoleFilter)}
        className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all cursor-pointer min-w-[120px] shadow-sm"
      >
        <option value="all">ทุก Role</option>
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>
      <select
        value={profileFilter}
        onChange={(e) => onProfileChange(e.target.value as ProfileFilter)}
        className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all cursor-pointer min-w-[140px] shadow-sm"
      >
        <option value="all">ทุกโปรไฟล์</option>
        <option value="with">มีโปรไฟล์</option>
        <option value="without">ไม่มีโปรไฟล์</option>
      </select>
      {hasFilter && (
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all cursor-pointer shrink-0"
        >
          <Filter size={13} /> ล้าง
        </button>
      )}
    </div>
  );
}
