"use client";

import { AdminMainPage } from "@/components/admin";
import authGuard from "@/lib/authGuard";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    authGuard("admin").then((isAuth) => {
      if (isAuth) setAuthorized(true);
    });
  }, []);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-iptm-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-full border-2 border-violet-400/30 border-t-violet-400 animate-spin" />
          <p className="text-sm text-iptm-dark-gray">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-iptm-white px-4 md:px-10 py-10 pt-26 flex items-center justify-center overflow-hidden">
      <AdminMainPage />
    </div>
  );
}
