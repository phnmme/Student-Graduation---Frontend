/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface EmploymentHistoryItem {
  id: number;
  profileId: number;
  jobTitle: string;
  companyName: string | null;
  startYear: number | null;
  endYear: number | null;
  description: string | null;
  createdAt: string;
}

export async function getProfile() {
  try {
    const res = await api.get("/api/v1/profile/authorized/getprofile", {
      headers: authHeaders(),
    });
    return res.data;
  } catch (error: any) {
    console.error("Error fetching profile:", error.response?.data || error.message);
    return null;
  }
}

export async function updateProfile(profileData: {
  fullname: string;
  studentCode: string;
  department: string;
  gradYear: number;
  jobField: string;
  companyName: string | null;
  jobStartYear: number | null;
  continuedFromCoop: boolean;
  employmentSector: string | null;
}) {
  try {
    const res = await api.put("/api/v1/profile/authorized/updateprofile", profileData, {
      headers: authHeaders(),
    });
    return res.data;
  } catch (error: any) {
    console.error("Error updating profile:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Update profile failed");
  }
}

export async function addEmploymentHistory(data: {
  jobTitle: string;
  companyName: string;
  startYear: number;
  description?: string;
}) {
  try {
    const res = await api.post("/api/v1/profile/authorized/job-history", data, {
      headers: authHeaders(),
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "เพิ่มประวัติงานไม่สำเร็จ");
  }
}

export async function deleteEmploymentHistory(id: number) {
  try {
    const res = await api.delete(`/api/v1/profile/authorized/job-history/${id}`, {
      headers: authHeaders(),
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "ลบประวัติงานไม่สำเร็จ");
  }
}
