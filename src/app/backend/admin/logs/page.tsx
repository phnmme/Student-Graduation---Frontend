"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ActivityLogPage } from "@/components/admin";
import authGuard from "@/lib/authGuard";

export default function LogPage() {
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
      <div className="min-h-screen flex items-center justify-center bg-bluez-tone-4 px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          {authState === "checking" ? (
            <div className="w-10 h-10 rounded-full border-2 border-violet-400/30 border-t-violet-400 animate-spin" />
          ) : (
            <p className="text-lg font-semibold text-red-400">ไม่มีสิทธิ์เข้าถึง</p>
          )}
          <p className="text-sm text-white/60">
            {authState === "checking" ? "กำลังตรวจสอบสิทธิ์..." : "บัญชีนี้ไม่มีสิทธิ์เข้าหน้าผู้ดูแลระบบ"}
          </p>
          {authState === "denied" && <Link href="/" className="text-sm underline text-white">กลับหน้าหลัก</Link>}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center overflow-hidden py-10 pt-26 min-h-screen bg-bluez-tone-4 px-4 md:px-10">
      <ActivityLogPage />
    </div>
  );
}
