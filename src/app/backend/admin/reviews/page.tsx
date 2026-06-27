"use client";

import { ReviewMainPage } from "@/components/admin";
import authGuard from "@/lib/authGuard";
import { useEffect, useState } from "react";

export default function ReviewPage() {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    authGuard("admin").then((ok) => {
      if (ok) setAuthorized(true);
    });
  }, []);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-iptm-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-full border-2 border-violet-400/20 border-t-violet-400 animate-spin" />
          <p className="text-xs text-white/25">กำลังตรวจสอบสิทธิ์...</p>
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
