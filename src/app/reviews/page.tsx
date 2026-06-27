/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import CareerReviewForm from "@/components/reviews/CareerReviewForm";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function ReviewsPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-iptm-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-iptm-blue mb-4"></div>
          <p className="text-iptm-blue">กำลังตรวจสอบ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center overflow-hidden py-10 pt-26 min-h-screen bg-iptm-white px-4 md:px-10">
      <CareerReviewForm />
    </div>
  );
}
