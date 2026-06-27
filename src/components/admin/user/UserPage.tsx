"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Users } from "lucide-react";
import {
  getUsers,
  getUserById,
  deleteUser,
  resetUserPassword,
} from "@/action/backend/usersAction";
import type {
  User,
  UserDetail,
  GetUsersParams,
} from "@/action/backend/usersAction";
import { LIMIT, ProfileFilter, RoleFilter, ToastState } from "@/types/user";
import { RefreshButton, Toast } from "./ui";
import { StatsBar } from "./StatsBar";
import { UserFilters } from "./UserFilters";
import { UserList } from "./UserList";
import { UserDetailDrawer } from "./UserDetailDrawer";

export default function UserMainPage() {
  // ── Data state ───────────────────────────────────────────────────────────────
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  // ── Filter state ─────────────────────────────────────────────────────────────
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [profileFilter, setProfileFilter] = useState<ProfileFilter>("all");

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ── Temp password state ───────────────────────────────────────────────────────
  const [tempPassMap, setTempPassMap] = useState<Record<number, string>>({});
  const [showPassMap, setShowPassMap] = useState<Record<number, boolean>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // ── Confirm state ────────────────────────────────────────────────────────────
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [resetId, setResetId] = useState<number | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  // ── Toast ────────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback(
    (msg: string, type: "success" | "error" = "success") => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 3000);
    },
    []
  );

  // ── Debounce keyword ─────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    setPage(1);
  }, [roleFilter, profileFilter]);

  // ── Fetch list ───────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: GetUsersParams = {
        search: debouncedKeyword || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
        hasProfile: profileFilter !== "all" ? profileFilter : undefined,
        page,
        limit: LIMIT,
      };
      const res = await getUsers(params);
      setUsers(res.data);
      setTotalUsers(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch (err: unknown) {
      showToast((err as Error).message || "ดึงข้อมูลไม่สำเร็จ", "error");
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, roleFilter, profileFilter, page, showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ── Fetch detail ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (selectedId == null) {
      setSelectedDetail(null);
      return;
    }
    setDetailLoading(true);
    getUserById(selectedId)
      .then(setSelectedDetail)
      .catch((err: Error) => showToast(err.message, "error"))
      .finally(() => setDetailLoading(false));
  }, [selectedId, showToast]);

  // ── Stats ─────────────────────────────────────────────────────────────────────
  const stats = useMemo(
    () => ({
      total: totalUsers,
      admin: users.filter((u) => u.role === "ADMIN").length,
      noProfile: users.filter((u) => !u.profile).length,
    }),
    [users, totalUsers]
  );

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleReset = useCallback(
    async (id: number) => {
      setResetLoading(true);
      try {
        const res = await resetUserPassword(id);
        setTempPassMap((prev) => ({ ...prev, [id]: res.tempPassword }));
        setResetId(null);
        showToast("สร้าง Temp Password สำเร็จ");
      } catch (err: unknown) {
        showToast((err as Error).message, "error");
      } finally {
        setResetLoading(false);
      }
    },
    [showToast]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      setDeleteLoading(true);
      try {
        await deleteUser(id);
        setDeleteId(null);
        if (selectedId === id) setSelectedId(null);
        showToast("ลบบัญชีสำเร็จ");
        fetchUsers();
      } catch (err: unknown) {
        showToast((err as Error).message, "error");
      } finally {
        setDeleteLoading(false);
      }
    },
    [selectedId, showToast, fetchUsers]
  );

  const handleCopy = useCallback(
    (id: number) => {
      navigator.clipboard.writeText(tempPassMap[id] ?? "");
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    },
    [tempPassMap]
  );

  const handleTogglePass = useCallback((id: number) => {
    setShowPassMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const hasFilter =
    keyword !== "" || roleFilter !== "all" || profileFilter !== "all";

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {toast && <Toast toast={toast} />}

      <div className="relative z-10 w-full max-w-6xl mx-auto space-y-4">
        {/* Page Header */}
        <div className="flex flex-col border rounded-xl shadow-sm gap-4 sm:flex-row sm:items-center sm:justify-between px-6 py-5">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center shrink-0">
              <Users size={18} className="text-violet-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight leading-none">
                จัดการผู้ใช้งาน
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                ดูข้อมูล · ลบบัญชี · รีเซ็ตรหัสผ่าน
              </p>
            </div>
          </div>
          <RefreshButton loading={loading} onClick={fetchUsers} />
        </div>

        {/* Stats */}
        <StatsBar
          total={stats.total}
          admin={stats.admin}
          noProfile={stats.noProfile}
          loading={loading}
        />

        {/* Filters */}
        <UserFilters
          keyword={keyword}
          roleFilter={roleFilter}
          profileFilter={profileFilter}
          hasFilter={hasFilter}
          onKeywordChange={setKeyword}
          onRoleChange={setRoleFilter}
          onProfileChange={setProfileFilter}
          onClear={() => {
            setKeyword("");
            setRoleFilter("all");
            setProfileFilter("all");
          }}
        />

        {/* Result count */}
        <div className="text-xs text-gray-400 px-0.5">
          {loading
            ? "กำลังโหลด..."
            : `แสดง ${users.length} จาก ${totalUsers} บัญชี`}
        </div>

        {/* Main Layout */}
        <div
          className={`flex gap-4 items-start ${
            selectedId ? "flex-col lg:flex-row" : ""
          }`}
        >
          <UserList
            users={users}
            loading={loading}
            selectedId={selectedId}
            totalPages={totalPages}
            totalUsers={totalUsers}
            page={page}
            onSelect={setSelectedId}
            onPageChange={setPage}
          />

          {selectedId && (
            <UserDetailDrawer
              selectedId={selectedId}
              detail={selectedDetail}
              loading={detailLoading}
              tempPassMap={tempPassMap}
              showPassMap={showPassMap}
              copiedId={copiedId}
              deleteId={deleteId}
              deleteLoading={deleteLoading}
              resetId={resetId}
              resetLoading={resetLoading}
              onClose={() => setSelectedId(null)}
              onTogglePass={handleTogglePass}
              onCopy={handleCopy}
              onSetDeleteId={setDeleteId}
              onSetResetId={setResetId}
              onDelete={handleDelete}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </>
  );
}
