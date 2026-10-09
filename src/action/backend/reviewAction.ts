/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import { getToken } from "../authAction";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export type ReviewStatus = "pending" | "approved" | "rejected";
export type ReviewCategory = "CAREER_PREP" | "CURRICULUM_IMPROVEMENT";

export const REVIEW_CATEGORY_LABELS: Record<ReviewCategory, string> = {
  CAREER_PREP: "แนะนำการทำงาน / เตรียมความพร้อมก่อนทำงาน",
  CURRICULUM_IMPROVEMENT: "แนะนำหลักสูตร / ปรับปรุงวิชาเรียน",
};

export type CareerReview = {
  id: number;
  title: string;
  description: string;
  jobField: string | null;
  category: ReviewCategory;
  status: ReviewStatus;
  userId: number;
  user: {
    id: number;
    email: string;
    role: string;
    profile: {
      firstNameTh: string;
      lastNameTh: string;
      studentCode: string;
    } | null;
  };
  createdAt: string;
  updatedAt: string;
};

export type ReviewPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type GetReviewsParams = {
  search?: string;
  status?: ReviewStatus | "all";
  jobField?: string;
  category?: ReviewCategory | "all";
  page?: number;
  limit?: number;
};

export type CreateReviewInput = {
  title: string;
  description: string;
  jobField?: string;
  category: ReviewCategory;
};

export async function getReviews(
  params: GetReviewsParams = {}
): Promise<{ data: CareerReview[]; pagination: ReviewPagination }> {
  try {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.status && params.status !== "all")
      query.set("status", params.status);
    if (params.jobField && params.jobField !== "all")
      query.set("jobField", params.jobField);
    if (params.category && params.category !== "all")
      query.set("category", params.category);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    const res = await api.get(
      `/api/v1/review/authorized/reviews?${query.toString()}`,
      {
        headers: authHeader(),
      }
    );
    return { data: res.data.data, pagination: res.data.pagination };
  } catch (error: any) {
    console.error("getReviews error:", error.response?.data);
    throw new Error(error.response?.data?.message || "ดึง Review ไม่สำเร็จ");
  }
}

export async function getReviewJobFields(): Promise<string[]> {
  try {
    const res = await api.get("/api/v1/review/authorized/reviews/jobfields", {
      headers: authHeader(),
    });
    return res.data.data; // string[]
  } catch (error: any) {
    console.error("getReviewJobFields error:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "ดึงรายชื่อสายงานไม่สำเร็จ"
    );
  }
}

export async function getReviewById(id: number): Promise<CareerReview> {
  try {
    const res = await api.get(`/api/v1/review/authorized/reviews/${id}`, {
      headers: authHeader(),
    });
    return res.data.data;
  } catch (error: any) {
    console.error("getReviewById error:", error.response?.data);
    throw new Error(error.response?.data?.message || "ดึง Review ไม่สำเร็จ");
  }
}

export async function createReview(input: CreateReviewInput) {
  try {
    const res = await api.post("/api/v1/review/authorized/reviews", input, {
      headers: authHeader(),
    });
    return res.data; // { message, data: CareerReview }
  } catch (error: any) {
    console.error("createReview error:", error.response?.data);
    throw new Error(error.response?.data?.message || "สร้าง Review ไม่สำเร็จ");
  }
}

export async function updateReviewStatus(id: number, status: ReviewStatus) {
  try {
    const res = await api.patch(
      `/api/v1/review/authorized/reviews/${id}/status`,
      { status },
      { headers: authHeader() }
    );
    return res.data;
  } catch (error: any) {
    console.error("updateReviewStatus error:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "อัปเดตสถานะ Review ไม่สำเร็จ"
    );
  }
}

export async function deleteReview(id: number) {
  try {
    const res = await api.delete(`/api/v1/review/authorized/reviews/${id}`, {
      headers: authHeader(),
    });
    return res.data; // { message }
  } catch (error: any) {
    console.error("deleteReview error:", error.response?.data);
    throw new Error(error.response?.data?.message || "ลบ Review ไม่สำเร็จ");
  }
}


export type PublicCareerReview = {
  id: number;
  title: string;
  description: string;
  jobField: string | null;
  category: ReviewCategory;
  createdAt: string;
  authorName: string;
};

export async function getApprovedReviews(params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: ReviewCategory | "all";
} = {}): Promise<{ data: PublicCareerReview[]; pagination: ReviewPagination }> {
  const query = new URLSearchParams();
  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? 12));
  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.category && params.category !== "all") {
    query.set("category", params.category);
  }

  const res = await api.get(
    `/api/v1/review/guest/approved?${query.toString()}`
  );
  return { data: res.data.data, pagination: res.data.pagination };
}
