"use client";

import Link from "next/link";
import { ReviewMainPage } from "@/components/admin";
import authGuard from "@/lib/authGuard";
import { useEffect, useState } from "react";

export default function ReviewPage() {
  const [authState, setAuthState] = useState<"checking" | "authorized" | "denied">("checking");

  useEffect(() => {
    let active = true;
    authGuard("admin").then((ok) => {
      if (active) setAuthState(ok ? "authorized" : "denied");
    }).catch(() => {
      if (active) setAuthState("denied");
    });
    return () => { active = false; };
  }, []);

  if (authState !== "authorized") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-iptm-white px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          {authState === "checking" ? (
            <div className="w-9 h-9 rounded-full border-2 border-violet-400/20 border-t-violet-400 animate-spin" />
          ) : (
            <p className="text-lg font-semibold text-red-600">ไม่มีสิทธิ์เข้าถึง</p>
          )}
          <p className="text-sm text-iptm-dark-gray">
            {authState === "checking" ? "กำลังตรวจสอบสิทธิ์..." : "บัญชีนี้ไม่มีสิทธิ์เข้าหน้าผู้ดูแลระบบ"}
          </p>
          {authState === "denied" && <Link href="/" className="text-sm underline text-iptm-navy hover:cursor-pointer">กลับหน้าหลัก</Link>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-iptm-white pt-20 pb-12">
      <ReviewMainPage />
    </div>
  );
}
