/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import api from "@/lib/axios";
import type {
  ApiResponse,
  GetAllYearData,
  GetAllGroupedData,
  GetStudentByYearData,
  StudentGroup,
} from "@/types/studentsList";

export async function getAllYear(): Promise<ApiResponse<GetAllYearData>> {
  try {
    const { data } = await api.get<ApiResponse<GetAllYearData>>(
      "/api/v1/students/guest/getallyear"
    );
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ?? "โหลดข้อมูลปีการศึกษาไม่สำเร็จ"
    );
  }
}

export async function getAllStudentsGrouped(): Promise<StudentGroup[]> {
  try {
    const { data } = await api.get<ApiResponse<GetAllGroupedData>>(
      "/api/v1/students/guest/getall"
    );
    return data.data.groups;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ?? "โหลดข้อมูลนักศึกษาไม่สำเร็จ"
    );
  }
}

export async function getStudentsByYear(
  year: number,
  search = "",
  skip = 0,
  take = 10
): Promise<GetStudentByYearData> {
  try {
    const { data } = await api.get<ApiResponse<GetStudentByYearData>>(
      "/api/v1/students/guest/getstudentbyyear",
      {
        params: {
          year,
          search,
          skip,
          take,
        },
      }
    );

    return data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ?? "โหลดข้อมูลนักศึกษาไม่สำเร็จ"
    );
  }
}
