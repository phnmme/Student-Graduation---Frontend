"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  MessageSquareText,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";
import {
  getApprovedReviews,
  REVIEW_CATEGORY_LABELS,
  type PublicCareerReview,
  type ReviewCategory,
  type ReviewPagination,
} from "@/action/backend/reviewAction";

const PAGE_SIZE = 12;

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ApprovedReviewsPage() {
  const [reviews, setReviews] = useState<PublicCareerReview[]>([]);
  const [pagination, setPagination] = useState<ReviewPagination>({
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 0,
  });
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ReviewCategory | "all">("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getApprovedReviews({
        page,
        limit: PAGE_SIZE,
        search,
        category,
      });
      setReviews(result.data);
      setPagination(result.pagination);
    } catch {
      setError("ไม่สามารถโหลดรีวิวได้ กรุณาลองใหม่อีกครั้ง");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const changeCategory = (value: ReviewCategory | "all") => {
    setCategory(value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-iptm-white">
      <section className="relative overflow-hidden border-b border-iptm-light bg-gradient-to-br from-iptm-navy via-iptm-navy to-[#243d66] text-white">
        <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-8 -top-16 h-56 w-56 rounded-full border border-white/10" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90">
            <Sparkles size={14} />
            IPTM Alumni Community
          </div>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
            รีวิวและคำแนะนำจากศิษย์เก่า
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 md:text-base">
            เรียนรู้จากประสบการณ์จริง ทั้งการเตรียมตัวเข้าสู่โลกการทำงาน
            และข้อเสนอแนะเพื่อพัฒนาหลักสูตรให้ตอบโจทย์การทำงานมากยิ่งขึ้น
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-iptm-navy">
              <MessageSquareText size={18} />
              {pagination.total.toLocaleString("th-TH")} รีวิวที่เผยแพร่
            </div>
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 hover:cursor-pointer"
            >
              <BookOpen size={17} />
              แบ่งปันประสบการณ์ของคุณ
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <div className="mb-7 rounded-2xl border border-iptm-light bg-white p-4 shadow-sm md:p-5">
          <form onSubmit={handleSearch} className="flex flex-col gap-3 md:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">ค้นหารีวิว</span>
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-iptm-gray"
              />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="ค้นหาหัวข้อ เนื้อหา หรือสายงาน..."
                className="w-full rounded-xl border border-iptm-light bg-iptm-white py-3 pl-11 pr-4 text-sm text-iptm-black outline-none transition focus:border-iptm-navy focus:ring-2 focus:ring-iptm-navy/10"
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-iptm-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-iptm-navy/90 hover:cursor-pointer"
            >
              <Search size={16} />
              ค้นหา
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => changeCategory("all")}
              className={`hover:cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition ${
                category === "all"
                  ? "border-iptm-navy bg-iptm-navy text-white"
                  : "border-iptm-light bg-white text-iptm-dark-gray hover:border-iptm-navy/40"
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => changeCategory("CAREER_PREP")}
              className={`hover:cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition ${
                category === "CAREER_PREP"
                  ? "border-iptm-navy bg-iptm-navy text-white"
                  : "border-iptm-light bg-white text-iptm-dark-gray hover:border-iptm-navy/40"
              }`}
            >
              <BriefcaseBusiness className="mr-1 inline" size={14} />
              แนะนำการทำงาน
            </button>
            <button
              onClick={() => changeCategory("CURRICULUM_IMPROVEMENT")}
              className={`hover:cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition ${
                category === "CURRICULUM_IMPROVEMENT"
                  ? "border-iptm-gold bg-iptm-gold text-white"
                  : "border-iptm-light bg-white text-iptm-dark-gray hover:border-iptm-gold/50"
              }`}
            >
              <GraduationCap className="mr-1 inline" size={15} />
              แนะนำหลักสูตร
            </button>
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-iptm-navy md:text-2xl">
              คำแนะนำที่ผ่านการอนุมัติ
            </h2>
            <p className="mt-1 text-xs text-iptm-dark-gray">
              แสดงเฉพาะรีวิวที่ผู้ดูแลระบบอนุมัติแล้ว
            </p>
          </div>
          <button
            onClick={() => void loadReviews()}
            disabled={loading}
            aria-label="โหลดรีวิวใหม่"
            className="inline-flex items-center gap-2 rounded-lg border border-iptm-light px-3 py-2 text-xs font-medium text-iptm-dark-gray transition hover:bg-iptm-light/40 disabled:opacity-50 hover:cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            รีเฟรช
          </button>
        </div>

        {error && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button onClick={() => void loadReviews()} className="font-semibold underline hover:cursor-pointer">
              ลองอีกครั้ง
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-2xl border border-iptm-light bg-white p-5"
              >
                <div className="mb-4 h-5 w-2/3 rounded bg-iptm-light" />
                <div className="mb-2 h-3 w-full rounded bg-iptm-light/70" />
                <div className="mb-2 h-3 w-5/6 rounded bg-iptm-light/70" />
                <div className="mt-8 h-8 w-1/3 rounded bg-iptm-light" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-iptm-light bg-white px-6 py-16 text-center">
            <MessageSquareText className="mx-auto mb-4 text-iptm-gray" size={34} />
            <h3 className="font-semibold text-iptm-navy">ยังไม่พบรีวิวที่เผยแพร่</h3>
            <p className="mt-2 text-sm text-iptm-dark-gray">
              {search || category !== "all"
                ? "ลองเปลี่ยนคำค้นหาหรือเลือกประเภทอื่น"
                : "เมื่อมีรีวิวผ่านการอนุมัติแล้ว รีวิวจะปรากฏที่หน้านี้"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="flex h-full flex-col rounded-2xl border border-iptm-light bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-iptm-navy/25 hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <span
                      className={`inline-flex max-w-full items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold ${
                        review.category === "CAREER_PREP"
                          ? "border-blue-100 bg-blue-50 text-blue-800"
                          : "border-amber-100 bg-amber-50 text-amber-800"
                      }`}
                    >
                      {review.category === "CAREER_PREP" ? (
                        <BriefcaseBusiness size={13} />
                      ) : (
                        <GraduationCap size={14} />
                      )}
                      {REVIEW_CATEGORY_LABELS[review.category]}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold leading-snug text-iptm-navy">
                    {review.title}
                  </h3>
                  <p className="mt-3 flex-1 whitespace-pre-line break-words text-sm leading-7 text-iptm-dark-gray">
                    {review.description}
                  </p>

                  {review.jobField && (
                    <div className="mt-5 flex items-center gap-2 rounded-xl bg-iptm-light/30 px-3 py-2.5 text-xs text-iptm-navy">
                      <BriefcaseBusiness size={15} className="shrink-0" />
                      <span className="font-medium">{review.jobField}</span>
                    </div>
                  )}

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-iptm-light pt-4">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-iptm-navy/10 text-sm font-bold text-iptm-navy">
                        {review.authorName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-iptm-navy">
                          {review.authorName}
                        </p>
                        <p className="text-[11px] text-iptm-gray">ผู้แบ่งปันประสบการณ์</p>
                      </div>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 text-[11px] text-iptm-gray">
                      <CalendarDays size={13} />
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-iptm-light pt-5 sm:flex-row">
              <p className="text-xs text-iptm-dark-gray">
                หน้า {pagination.page} จาก {Math.max(1, pagination.totalPages)} · ทั้งหมด{" "}
                {pagination.total.toLocaleString("th-TH")} รีวิว
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1 || loading}
                  className="inline-flex items-center gap-1 rounded-xl border border-iptm-light px-4 py-2.5 text-sm font-medium text-iptm-navy transition hover:bg-iptm-light/40 disabled:cursor-not-allowed disabled:opacity-40 hover:cursor-pointer"
                >
                  <ChevronLeft size={16} />
                  ก่อนหน้า
                </button>
                <button
                  onClick={() =>
                    setPage((current) => Math.min(pagination.totalPages, current + 1))
                  }
                  disabled={page >= pagination.totalPages || loading}
                  className="inline-flex items-center gap-1 rounded-xl border border-iptm-light px-4 py-2.5 text-sm font-medium text-iptm-navy transition hover:bg-iptm-light/40 disabled:cursor-not-allowed disabled:opacity-40 hover:cursor-pointer"
                >
                  ถัดไป
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
