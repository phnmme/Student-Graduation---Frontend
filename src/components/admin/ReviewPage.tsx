"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  User,
  Calendar,
  Eye,
  X,
  FileText,
  RefreshCw,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Layers,
} from "lucide-react";
import {
  getReviews,
  getReviewJobFields,
  updateReviewStatus,
} from "@/action/backend/reviewAction";
import type {
  CareerReview,
  ReviewStatus,
  GetReviewsParams,
} from "@/action/backend/reviewAction";

// ─── Constants & Config ──────────────────────────────────────────────────────

const LIMIT = 10;

type StatusKey = ReviewStatus | "all";

interface StatusConfig {
  label: string;
  icon: React.ElementType;
  pill: string;
  rowAccent: string;
  stat: string;
}

const STATUS_CONFIG: Record<ReviewStatus, StatusConfig> = {
  pending: {
    label: "รออนุมัติ",
    icon: Clock,
    pill: "bg-amber-50 text-amber-700 border-amber-200",
    rowAccent: "border-l-amber-400",
    stat: "text-amber-600",
  },
  approved: {
    label: "อนุมัติแล้ว",
    icon: CheckCircle2,
    pill: "bg-emerald-50 text-emerald-700 border-emerald-100",
    rowAccent: "border-l-emerald-400",
    stat: "text-emerald-600",
  },
  rejected: {
    label: "ปฏิเสธ",
    icon: XCircle,
    pill: "bg-red-50 text-red-600 border-red-100",
    rowAccent: "border-l-red-400",
    stat: "text-red-600",
  },
};

// ─── Utilities ───────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "เพิ่งส่ง";
  if (m < 60) return `${m} นาทีที่แล้ว`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ชั่วโมงที่แล้ว`;
  return `${Math.floor(h / 24)} วันที่แล้ว`;
}

function getDisplayName(user: CareerReview["user"]): string {
  if (user.profile)
    return `${user.profile.firstNameTh} ${user.profile.lastNameTh}`;
  return user.email;
}

function getInitials(name: string): string {
  return name.charAt(0).toUpperCase();
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface ToastProps {
  msg: string;
  type: "success" | "error";
}

function Toast({ msg, type }: ToastProps) {
  return (
    <div
      className={`fixed top-5 right-5 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl border animate-in fade-in slide-in-from-top-3 duration-200 ${
        type === "success"
          ? "bg-iptm-white border-emerald-100 text-emerald-700"
          : "bg-iptm-white border-red-100 text-red-600"
      }`}
    >
      <span
        className={`flex items-center justify-center w-6 h-6 rounded-lg ${
          type === "success" ? "bg-emerald-50" : "bg-red-50"
        }`}
      >
        {type === "success" ? (
          <Check size={13} className="text-emerald-600" />
        ) : (
          <AlertTriangle size={13} className="text-red-500" />
        )}
      </span>
      {msg}
    </div>
  );
}

interface StatusPillProps {
  status: ReviewStatus;
  size?: "sm" | "md";
}

function StatusPill({ status, size = "sm" }: StatusPillProps) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold border rounded-md ${
        cfg.pill
      } ${size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1"}`}
    >
      <Icon size={size === "sm" ? 10 : 12} />
      {cfg.label}
    </span>
  );
}

interface AvatarProps {
  name: string;
  size?: "sm" | "md";
}

function Avatar({ name, size = "md" }: AvatarProps) {
  return (
    <div
      className={`rounded-xl bg-iptm-navy text-iptm-white flex items-center justify-center font-bold shrink-0 select-none ${
        size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm"
      }`}
    >
      {getInitials(name)}
    </div>
  );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-iptm-white border border-iptm-light/60 rounded-2xl p-4 flex gap-3 animate-pulse shadow-sm">
      <div className="w-10 h-10 rounded-xl bg-iptm-light shrink-0" />
      <div className="flex-1 space-y-2.5 pt-1">
        <div className="h-3.5 bg-iptm-light rounded w-2/5" />
        <div className="h-3 bg-iptm-light/60 rounded w-4/5" />
        <div className="h-3 bg-iptm-light/60 rounded w-1/3" />
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatTabProps {
  label: string;
  value: number | null;
  colorClass: string;
  active: boolean;
  loading: boolean;
  onClick: () => void;
  accent?: boolean;
}

function StatTab({
  label,
  value,
  colorClass,
  active,
  loading,
  onClick,
  accent,
}: StatTabProps) {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-start p-4 rounded-2xl border text-left transition-all shadow-sm ${
        active
          ? accent
            ? "bg-iptm-gold/10 border-iptm-gold/30 ring-1 ring-iptm-gold/20"
            : "bg-iptm-navy/5 border-iptm-navy/20 ring-1 ring-iptm-navy/10"
          : "bg-iptm-white border-iptm-light/60 hover:border-iptm-light"
      }`}
    >
      <span className="text-xs font-medium text-iptm-dark-gray tracking-wide mb-1.5">
        {label}
      </span>
      <span
        className={`text-3xl font-bold tabular-nums tracking-tight ${colorClass}`}
      >
        {loading ? (
          <span className="block h-8 w-12 bg-iptm-light rounded animate-pulse" />
        ) : (
          value ?? 0
        )}
      </span>
    </button>
  );
}

// ─── Detail Modal ────────────────────────────────────────────────────────────

interface DetailModalProps {
  review: CareerReview;
  actionLoadingId: number | null;
  onClose: () => void;
  onAction: (id: number, status: ReviewStatus) => void;
}

function DetailModal({
  review,
  actionLoadingId,
  onClose,
  onAction,
}: DetailModalProps) {
  const displayName = getDisplayName(review.user);
  const isActioning = actionLoadingId === review.id;
  const cfg = STATUS_CONFIG[review.status];

  const metaItems = [
    { label: "Review ID", value: `#${review.id}` },
    { label: "User ID", value: `#${review.userId}` },
    {
      label: "วันที่ส่ง",
      value: new Date(review.createdAt).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    },
    {
      label: "อัปเดตล่าสุด",
      value: new Date(review.updatedAt).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-iptm-white border border-iptm-light rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-iptm-light/60">
          <div className="flex items-center gap-3">
            <Avatar name={displayName} size="md" />
            <div>
              <h3 className="font-bold text-iptm-navy text-[15px] leading-snug line-clamp-1">
                {review.title}
              </h3>
              <p className="text-xs text-iptm-dark-gray mt-0.5">
                {displayName} · {review.user.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-iptm-gray hover:text-iptm-black p-1.5 rounded-xl hover:bg-iptm-light transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <StatusPill status={review.status} size="md" />
            {review.jobField && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-iptm-navy/5 text-iptm-navy border border-iptm-navy/10 px-2.5 py-1 rounded-md font-semibold">
                <Briefcase size={11} /> {review.jobField}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs bg-iptm-light/60 text-iptm-dark-gray border border-iptm-light px-2.5 py-1 rounded-md font-medium">
              <Calendar size={11} /> {timeAgo(review.createdAt)}
            </span>
          </div>

          {/* Description */}
          <div>
            <p className="text-[11px] font-bold text-iptm-dark-gray uppercase tracking-widest mb-2">
              คำอธิบาย
            </p>
            <p className="text-sm text-iptm-black leading-relaxed bg-iptm-light/30 border border-iptm-light rounded-xl p-4 whitespace-pre-line">
              {review.description}
            </p>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-2">
            {metaItems.map((m) => (
              <div
                key={m.label}
                className="bg-iptm-light/30 border border-iptm-light rounded-xl px-3.5 py-2.5"
              >
                <span className="block text-[10px] font-bold text-iptm-dark-gray uppercase tracking-wider mb-0.5">
                  {m.label}
                </span>
                <span className="text-xs font-semibold text-iptm-navy">
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-iptm-light/60 bg-iptm-light/20">
          {review.status === "pending" ? (
            <div className="flex gap-2.5">
              <button
                onClick={() => onAction(review.id, "rejected")}
                disabled={isActioning}
                className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold bg-iptm-white hover:bg-red-50 text-red-500 border border-red-200 py-2.5 rounded-xl transition-all disabled:opacity-40"
              >
                {isActioning ? (
                  <RefreshCw size={13} className="animate-spin" />
                ) : (
                  <X size={13} />
                )}
                ปฏิเสธ
              </button>
              <button
                onClick={() => onAction(review.id, "approved")}
                disabled={isActioning}
                className="flex-1 flex items-center justify-center gap-2 text-sm font-bold bg-iptm-navy hover:bg-iptm-navy/90 active:scale-95 text-iptm-white py-2.5 rounded-xl transition-all shadow-md disabled:opacity-40"
              >
                {isActioning ? (
                  <RefreshCw size={13} className="animate-spin" />
                ) : (
                  <Check size={13} />
                )}
                อนุมัติ
              </button>
            </div>
          ) : (
            <div
              className={`flex items-center justify-center gap-2 text-sm py-2.5 rounded-xl border font-semibold ${cfg.pill}`}
            >
              {(() => {
                const Icon = cfg.icon;
                return <Icon size={14} />;
              })()}
              รีวิวนี้{cfg.label}แล้ว
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Review Card ─────────────────────────────────────────────────────────────

interface ReviewCardProps {
  review: CareerReview;
  isActioning: boolean;
  onView: (id: number) => void;
  onAction: (id: number, status: ReviewStatus) => void;
}

function ReviewCard({
  review,
  isActioning,
  onView,
  onAction,
}: ReviewCardProps) {
  const cfg = STATUS_CONFIG[review.status];
  const displayName = getDisplayName(review.user);

  return (
    <div
      className={`group bg-iptm-white border border-iptm-light/60 border-l-2 ${cfg.rowAccent} rounded-2xl overflow-hidden hover:shadow-md hover:border-iptm-light transition-all duration-150 shadow-sm`}
    >
      <div className="flex items-start gap-3.5 px-4 py-3.5">
        <Avatar name={displayName} size="sm" />

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-semibold text-iptm-black text-sm leading-snug truncate max-w-[280px]">
              {review.title}
            </h3>
            <StatusPill status={review.status} size="sm" />
          </div>

          <p className="text-xs text-iptm-dark-gray line-clamp-1 mb-2">
            {review.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-iptm-gray">
            <span className="flex items-center gap-1">
              <User size={10} />
              {displayName}
            </span>
            {review.jobField && (
              <span className="flex items-center gap-1">
                <Briefcase size={10} />
                {review.jobField}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar size={10} />
              {timeAgo(review.createdAt)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {review.status === "pending" && (
            <div
              className="hidden sm:flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onAction(review.id, "approved")}
                disabled={isActioning}
                title="อนุมัติ"
                className="flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-40"
              >
                {isActioning ? (
                  <RefreshCw size={11} className="animate-spin" />
                ) : (
                  <Check size={11} />
                )}
                อนุมัติ
              </button>
              <button
                onClick={() => onAction(review.id, "rejected")}
                disabled={isActioning}
                title="ปฏิเสธ"
                className="flex items-center gap-1 text-[11px] font-semibold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-40"
              >
                {isActioning ? (
                  <RefreshCw size={11} className="animate-spin" />
                ) : (
                  <X size={11} />
                )}
                ปฏิเสธ
              </button>
            </div>
          )}

          <button
            onClick={() => onView(review.id)}
            title="ดูรายละเอียด"
            className="opacity-0 group-hover:opacity-100 text-iptm-gray hover:text-iptm-navy hover:bg-iptm-light p-2 rounded-xl border border-transparent hover:border-iptm-light/60 transition-all"
          >
            <Eye size={14} />
          </button>
        </div>
      </div>

      {/* Mobile actions */}
      {review.status === "pending" && (
        <div className="flex gap-2 sm:hidden px-4 pb-3">
          <button
            onClick={() => onAction(review.id, "approved")}
            disabled={isActioning}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 py-2 rounded-xl transition-colors"
          >
            <Check size={12} /> อนุมัติ
          </button>
          <button
            onClick={() => onAction(review.id, "rejected")}
            disabled={isActioning}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold bg-red-50 text-red-600 border border-red-200 py-2 rounded-xl transition-colors"
          >
            <X size={12} /> ปฏิเสธ
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
  page: number;
  totalPages: number;
  loading: boolean;
  onChange: (p: number) => void;
}

function Pagination({ page, totalPages, loading, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  return (
    <div className="flex items-center justify-between px-1">
      <p className="text-xs text-iptm-dark-gray">
        หน้า <span className="text-iptm-navy font-semibold">{page}</span> /{" "}
        {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1 || loading}
          className="p-1.5 rounded-xl text-iptm-gray hover:text-iptm-navy hover:bg-iptm-light disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft size={15} />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-8 h-8 text-xs rounded-xl font-semibold transition-all ${
              p === page
                ? "bg-iptm-navy text-iptm-white shadow-sm"
                : "text-iptm-dark-gray hover:text-iptm-navy hover:bg-iptm-light"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages || loading}
          className="p-1.5 rounded-xl text-iptm-gray hover:text-iptm-navy hover:bg-iptm-light disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReviewMainPage() {
  const [reviews, setReviews] = useState<CareerReview[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [statusFilter, setStatusFilter] = useState<StatusKey>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [jobFieldFilter, setJobFieldFilter] = useState("all");
  const [jobFields, setJobFields] = useState<string[]>(["all"]);

  const [loading, setLoading] = useState(false);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [toast, setToast] = useState<ToastProps | null>(null);

  const searchRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback(
    (msg: string, type: "success" | "error" = "success") => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 3000);
    },
    []
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, jobFieldFilter]);

  useEffect(() => {
    getReviewJobFields()
      .then((fields) => setJobFields(["all", ...fields]))
      .catch(() => {});
  }, []);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params: GetReviewsParams = {
        search: debouncedSearch || undefined,
        status:
          statusFilter !== "all" ? (statusFilter as ReviewStatus) : undefined,
        jobField: jobFieldFilter !== "all" ? jobFieldFilter : undefined,
        page,
        limit: LIMIT,
      };
      const res = await getReviews(params);
      setReviews(res.data);
      setTotalReviews(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "ดึงข้อมูลไม่สำเร็จ";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, jobFieldFilter, page, showToast]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const pageCounts = useMemo(
    () => ({
      pending: reviews.filter((r) => r.status === "pending").length,
      approved: reviews.filter((r) => r.status === "approved").length,
      rejected: reviews.filter((r) => r.status === "rejected").length,
    }),
    [reviews]
  );

  const handleAction = async (id: number, status: ReviewStatus) => {
    setActionLoadingId(id);
    try {
      await updateReviewStatus(id, status);
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
      setDetailId(null);
      showToast(
        status === "approved" ? "อนุมัติ Review สำเร็จ" : "ปฏิเสธ Review สำเร็จ"
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      showToast(msg, "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const detailReview = detailId
    ? reviews.find((r) => r.id === detailId) ?? null
    : null;
  const hasActiveFilter = search || jobFieldFilter !== "all";

  const statTabs = [
    {
      key: "all" as StatusKey,
      label: "ทั้งหมด",
      value: totalReviews,
      color: "text-iptm-navy",
    },
    {
      key: "pending" as StatusKey,
      label: "รออนุมัติ",
      value: pageCounts.pending,
      color: "text-amber-600",
    },
    {
      key: "approved" as StatusKey,
      label: "อนุมัติแล้ว",
      value: pageCounts.approved,
      color: "text-emerald-600",
      accent: true,
    },
    {
      key: "rejected" as StatusKey,
      label: "ปฏิเสธ",
      value: pageCounts.rejected,
      color: "text-red-500",
    },
  ];

  return (
    <>
      {toast && <Toast {...toast} />}

      <div className="relative z-10 w-full max-w-5xl mx-auto space-y-5 px-1">
        {/* ── Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-iptm-white border border-iptm-light/60 rounded-2xl px-6 py-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-iptm-navy/5 border border-iptm-navy/10 flex items-center justify-center shrink-0">
              <Layers size={22} className="text-iptm-navy" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-iptm-navy tracking-tight">
                Career Reviews
              </h1>
              <p className="text-xs text-iptm-dark-gray mt-0.5">
                {totalReviews} รายการ ·{" "}
                <span className="text-amber-600 font-medium">
                  {pageCounts.pending} รออนุมัติ
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={fetchReviews}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-iptm-gold cursor-pointer hover:bg-iptm-gold/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-iptm-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md w-full sm:w-auto"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            รีเฟรช
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statTabs.map((s) => (
            <StatTab
              key={s.key}
              label={s.label}
              value={s.value}
              colorClass={s.color}
              active={statusFilter === s.key}
              loading={loading}
              onClick={() => setStatusFilter(s.key)}
              accent={s.accent}
            />
          ))}
        </div>

        {/* ── Search & Filter Bar ── */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search */}
          <div className="relative flex-1 group">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-iptm-gray group-focus-within:text-iptm-navy transition-colors pointer-events-none"
            />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาหัวข้อ, รายละเอียด, ผู้ส่ง..."
              className="w-full bg-iptm-white border border-iptm-light text-iptm-black placeholder:text-iptm-gray rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-iptm-navy focus:ring-1 focus:ring-iptm-navy shadow-sm transition-all"
            />
          </div>

          <div className="flex gap-2">
            {/* Job field select */}
            <div className="relative flex-1 sm:flex-none">
              <SlidersHorizontal
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-iptm-gray pointer-events-none"
              />
              <select
                value={jobFieldFilter}
                onChange={(e) => setJobFieldFilter(e.target.value)}
                className="w-full appearance-none bg-iptm-white border border-iptm-light rounded-xl pl-9 pr-8 py-3 text-sm text-iptm-black outline-none focus:border-iptm-navy focus:ring-1 focus:ring-iptm-navy shadow-sm transition-all cursor-pointer sm:min-w-[160px]"
              >
                {jobFields.map((f) => (
                  <option key={f} value={f}>
                    {f === "all" ? "ทุกสายงาน" : f}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-iptm-gray pointer-events-none text-[9px]">
                ▼
              </span>
            </div>

            {/* Clear filter */}
            {hasActiveFilter && (
              <button
                onClick={() => {
                  setSearch("");
                  setJobFieldFilter("all");
                }}
                className="flex items-center gap-1.5 text-xs text-iptm-dark-gray hover:text-iptm-black border border-iptm-light hover:bg-iptm-light bg-iptm-white px-3 py-2 rounded-xl transition-all shrink-0 shadow-sm"
              >
                <X size={13} />
                <span className="hidden sm:inline">ล้าง</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Result summary ── */}
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-iptm-dark-gray">
            {loading ? (
              <span className="animate-pulse">กำลังโหลด...</span>
            ) : (
              <>
                แสดง{" "}
                <span className="text-iptm-navy font-semibold">
                  {reviews.length}
                </span>{" "}
                จาก {totalReviews} รายการ
              </>
            )}
          </p>
          {loading && (
            <RefreshCw size={12} className="animate-spin text-iptm-navy/50" />
          )}
        </div>

        {/* ── Review List ── */}
        {loading && reviews.length === 0 ? (
          <div className="space-y-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-iptm-white border border-iptm-light/60 border-dashed rounded-2xl shadow-sm">
            <FileText size={28} className="text-iptm-light mb-3" />
            <p className="text-sm text-iptm-dark-gray font-medium">
              ไม่พบรีวิวที่ตรงกับเงื่อนไข
            </p>
            <p className="text-xs text-iptm-gray mt-1">
              ลองปรับฟิลเตอร์หรือคำค้นหา
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                isActioning={actionLoadingId === review.id}
                onView={setDetailId}
                onAction={handleAction}
              />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        <Pagination
          page={page}
          totalPages={totalPages}
          loading={loading}
          onChange={setPage}
        />
      </div>

      {/* ── Detail Modal ── */}
      {detailReview && (
        <DetailModal
          review={detailReview}
          actionLoadingId={actionLoadingId}
          onClose={() => setDetailId(null)}
          onAction={handleAction}
        />
      )}
    </>
  );
}
