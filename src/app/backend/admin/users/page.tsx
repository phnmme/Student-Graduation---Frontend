"use client";

import { UserMainPage } from "@/components/admin";
import authGuard from "@/lib/authGuard";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    authGuard("admin").then((isAuth) => {
      if (isAuth) setAuthorized(true);
    });
  }, []);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/50 animate-spin" />
          <p className="text-xs text-white/30">กำลังตรวจสอบสิทธิ์...</p>
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
