"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Mail,
  UserPlus,
  Trash2,
  Crown,
  X,
  Shield,
  Circle,
  Search,
  User,
  AlertTriangle,
} from "lucide-react";
import {
  createAdmin,
  deleteAdmin,
  getAdmins,
} from "@/action/backend/adminAction";

// ─── Types ───────────────────────────────────────────────────────────────────

export type AdminRole = "OWNER" | "ADMIN";

export type AdminApi = {
  id: number;
  email: string;
  role: AdminRole;
  createdAt: string;
  updatedAt: string;
  profile: {
    firstNameTh: string;
    lastNameTh: string;
  };
  lastLoginAt: string | null;
  isOnline: boolean;
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function Avatar({ name, isOnline }: { name: string; isOnline: boolean }) {
  return (
    <div className="relative shrink-0">
      <div className="w-9 h-9 rounded-xl bg-iptm-navy text-iptm-white flex items-center justify-center text-sm font-bold select-none">
        {name.charAt(0)}
      </div>
      <span
        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
          isOnline ? "bg-emerald-500" : "bg-slate-300"
        }`}
      />
    </div>
  );
}

function RoleBadge({ role }: { role: AdminRole }) {
  if (role !== "OWNER") return null;
  return (
    <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] px-2 py-0.5 rounded-md font-semibold">
      <Crown size={9} />
      Owner
    </span>
  );
}

function StatusBadge({ isOnline }: { isOnline: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border ${
        isOnline
          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
          : "bg-slate-50 text-slate-500 border-slate-100"
      }`}
    >
      <Circle size={6} fill="currentColor" />
      {isOnline ? "Online" : "Offline"}
    </span>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`border rounded-2xl px-5 py-4 shadow-sm ${
        accent
          ? "bg-emerald-50/60 border-emerald-100"
          : "bg-iptm-white border-iptm-light/60"
      }`}
    >
      <p className="text-xs text-iptm-dark-gray font-medium">{label}</p>
      <p
        className={`text-3xl font-bold mt-1 tabular-nums ${
          accent ? "text-emerald-600" : "text-iptm-navy"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

interface ModalInputProps {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function ModalInput({
  label,
  placeholder,
  icon,
  value,
  onChange,
  type = "text",
}: ModalInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-iptm-dark-gray uppercase tracking-wider ml-0.5">
        {label}
      </label>
      <div className="relative group">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-iptm-gray group-focus-within:text-iptm-navy transition-colors">
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 bg-iptm-white border border-iptm-light rounded-xl text-sm text-iptm-black placeholder:text-iptm-gray outline-none focus:border-iptm-navy focus:ring-1 focus:ring-iptm-navy transition-all"
        />
      </div>
    </div>
  );
}

interface AddAdminModalProps {
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
  loading: boolean;
}

function AddAdminModal({ onClose, onSubmit, loading }: AddAdminModalProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!email.trim()) return;
    await onSubmit(email.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-iptm-white border border-iptm-light rounded-2xl p-6 sm:p-8 w-full max-w-md relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-iptm-gray hover:text-iptm-black p-1.5 rounded-xl hover:bg-iptm-light transition-colors"
          aria-label="ปิด"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-iptm-navy/5 border border-iptm-navy/10 flex items-center justify-center">
            <UserPlus size={20} className="text-iptm-navy" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-iptm-navy">เพิ่ม Admin</h2>
            <p className="text-xs text-iptm-dark-gray mt-0.5">
              ระบุอีเมลของผู้ใช้ที่ต้องการมอบสิทธิ์
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <ModalInput
            label="ที่อยู่อีเมล"
            placeholder="email@example.com"
            icon={<Mail size={16} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 bg-iptm-light hover:bg-iptm-light/80 text-iptm-dark-gray py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSubmit}
              disabled={!email.trim() || loading}
              className="flex-1 bg-iptm-gold hover:bg-iptm-gold/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-iptm-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
            >
              {loading ? (
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <UserPlus size={15} />
              )}
              มอบสิทธิ์
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DeleteConfirmProps {
  adminName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmInline({
  adminName,
  onConfirm,
  onCancel,
}: DeleteConfirmProps) {
  return (
    <div className="flex items-center gap-2 justify-end">
      <span className="text-xs text-iptm-dark-gray hidden sm:block truncate max-w-[140px]">
        ถอดสิทธิ์ {adminName}?
      </span>
      <button
        onClick={onConfirm}
        className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1"
      >
        <AlertTriangle size={11} />
        ยืนยัน
      </button>
      <button
        onClick={onCancel}
        className="text-xs bg-iptm-light hover:bg-iptm-light/80 text-iptm-dark-gray px-3 py-1.5 rounded-lg font-medium transition-colors"
      >
        ยกเลิก
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [admins, setAdmins] = useState<AdminApi[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [addLoading, setAddLoading] = useState(false);

  const loadAdmins = useCallback(async () => {
    const raw = await getAdmins();
    const normalized: AdminApi[] = raw.map((admin) => ({
      ...admin,
      lastLoginAt: admin.lastLoginAt ?? null,
      isOnline: admin.isOnline ?? false,
      profile: admin.profile ?? { firstNameTh: "", lastNameTh: "" },
    }));
    setAdmins(normalized);
  }, []);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const handleAddAdmin = async (email: string) => {
    setAddLoading(true);
    try {
      await createAdmin(email);
      setShowModal(false);
      await loadAdmins();
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    setAdmins((prev) => prev.filter((a) => a.id !== id));
    setDeleteConfirmId(null);
    await deleteAdmin(id);
  };

  const filteredAdmins = admins.filter(
    (a) =>
      `${a.profile.firstNameTh} ${a.profile.lastNameTh}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  const onlineCount = admins.filter((a) => a.isOnline).length;

  return (
    <>
      <div className="relative z-10 w-full max-w-5xl mx-auto space-y-5 px-1">
        {/* ── Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-iptm-white border border-iptm-light/60 rounded-2xl px-6 py-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-iptm-navy/5 border border-iptm-navy/10 flex items-center justify-center shrink-0">
              <Shield size={22} className="text-iptm-navy" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-iptm-navy tracking-tight">
                จัดการผู้ดูแลระบบ
              </h1>
              <p className="text-xs text-iptm-dark-gray mt-0.5">
                {admins.length} บัญชี ·{" "}
                <span className="text-emerald-600 font-medium">
                  {onlineCount} ออนไลน์
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-iptm-gold cursor-pointer hover:bg-iptm-gold/90 active:scale-95 text-iptm-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md w-full sm:w-auto"
          >
            <UserPlus size={15} />
            เพิ่ม Admin
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="ทั้งหมด" value={admins.length} />
          <StatCard label="ออนไลน์" value={onlineCount} accent />
          <StatCard label="ออฟไลน์" value={admins.length - onlineCount} />
        </div>

        {/* ── Search ── */}
        <div className="relative group">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-iptm-gray group-focus-within:text-iptm-navy transition-colors pointer-events-none"
          />
          <input
            type="text"
            placeholder="ค้นหาชื่อหรืออีเมล..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-iptm-white border border-iptm-light text-iptm-black placeholder:text-iptm-gray rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-iptm-navy focus:ring-1 focus:ring-iptm-navy shadow-sm transition-all"
          />
        </div>

        {/* ── Desktop Table ── */}
        <div className="hidden md:block bg-iptm-white border border-iptm-light/60 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-iptm-light bg-iptm-light/30">
                <th className="px-6 py-3.5 text-[11px] font-bold text-iptm-dark-gray uppercase tracking-wider">
                  ผู้ใช้งาน
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-iptm-dark-gray uppercase tracking-wider">
                  อีเมล
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-iptm-dark-gray uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-iptm-dark-gray uppercase tracking-wider text-right">
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-iptm-light/50">
              {filteredAdmins.map((admin) => {
                const fullName = `${admin.profile.firstNameTh} ${admin.profile.lastNameTh}`;
                return (
                  <tr
                    key={admin.id}
                    className="hover:bg-iptm-light/10 transition-colors group"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={admin.profile.firstNameTh}
                          isOnline={admin.isOnline}
                        />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-sm font-semibold text-iptm-black">
                              {fullName}
                            </span>
                            <RoleBadge role={admin.role} />
                          </div>
                          <div className="text-xs text-iptm-dark-gray mt-0.5">
                            เข้าร่วม{" "}
                            {new Date(admin.createdAt).toLocaleDateString(
                              "th-TH",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-sm text-iptm-dark-gray">
                        {admin.email}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge isOnline={admin.isOnline} />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {deleteConfirmId === admin.id ? (
                        <DeleteConfirmInline
                          adminName={admin.profile.firstNameTh}
                          onConfirm={() => handleDeleteAdmin(admin.id)}
                          onCancel={() => setDeleteConfirmId(null)}
                        />
                      ) : (
                        admin.role !== "OWNER" && (
                          <button
                            onClick={() => setDeleteConfirmId(admin.id)}
                            className="opacity-0 group-hover:opacity-100 text-iptm-gray hover:text-red-500 hover:bg-red-50 p-2 rounded-xl border border-transparent hover:border-red-100 transition-all"
                            aria-label={`ถอดสิทธิ์ ${fullName}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredAdmins.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-14 text-center text-iptm-dark-gray text-sm"
                  >
                    {search
                      ? `ไม่พบผู้ดูแลที่ตรงกับ "${search}"`
                      : "ยังไม่มีผู้ดูแลระบบในขณะนี้"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Mobile Cards ── */}
        <div className="md:hidden space-y-3">
          {filteredAdmins.map((admin) => {
            const fullName = `${admin.profile.firstNameTh} ${admin.profile.lastNameTh}`;
            return (
              <div
                key={admin.id}
                className="bg-iptm-white border border-iptm-light rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                      name={admin.profile.firstNameTh}
                      isOnline={admin.isOnline}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-iptm-black text-sm">
                          {fullName}
                        </span>
                        <RoleBadge role={admin.role} />
                      </div>
                      <p className="text-xs text-iptm-dark-gray mt-0.5 truncate">
                        {admin.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge isOnline={admin.isOnline} />
                    {admin.role !== "OWNER" && (
                      <button
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="text-iptm-gray hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-colors"
                        aria-label={`ถอดสิทธิ์ ${fullName}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filteredAdmins.length === 0 && (
            <div className="text-center py-12 text-iptm-dark-gray text-sm bg-iptm-white border border-iptm-light rounded-2xl">
              {search
                ? `ไม่พบผู้ดูแลที่ตรงกับ "${search}"`
                : "ยังไม่มีผู้ดูแลระบบในขณะนี้"}
            </div>
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <AddAdminModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddAdmin}
          loading={addLoading}
        />
      )}
    </>
  );
}
