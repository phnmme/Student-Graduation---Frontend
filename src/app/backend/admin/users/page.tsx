"use client";

import Link from "next/link";
import { UserMainPage } from "@/components/admin";
import authGuard from "@/lib/authGuard";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [authState, setAuthState] = useState<"checking" | "authorized" | "denied">("checking");

  useEffect(() => {
    let active = true;
    authGuard("admin").then((isAuth) => {
      if (active) setAuthState(isAuth ? "authorized" : "denied");
    }).catch(() => {
      if (active) setAuthState("denied");
    });
    return () => { active = false; };
  }, []);

  if (authState !== "authorized") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          {authState === "checking" ? (
            <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-violet-500 animate-spin" />
          ) : (
            <p className="text-lg font-semibold text-red-600">ไม่มีสิทธิ์เข้าถึง</p>
          )}
          <p className="text-sm text-gray-500">
            {authState === "checking" ? "กำลังตรวจสอบสิทธิ์..." : "บัญชีนี้ไม่มีสิทธิ์เข้าหน้าผู้ดูแลระบบ"}
          </p>
          {authState === "denied" && <Link href="/" className="text-sm underline">กลับหน้าหลัก</Link>}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center overflow-hidden py-10 pt-26 min-h-screen bg-iptm-white px-4 md:px-10">
      <UserMainPage />
    </div>
  );
}
