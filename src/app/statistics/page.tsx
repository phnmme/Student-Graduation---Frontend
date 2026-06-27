"use client";

import { useEffect, useState } from "react";
import { getStatistics } from "@/action/statisticsAction";
import { StatMain } from "@/components/statistics";
import { DashboardStatistics } from "@/types/staticType";

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const res = await getStatistics();

        if (!res?.data) {
          setError("ไม่สามารถโหลดข้อมูลสถิติได้");
          console.error("No data received from API");
          return;
        }

        setStatistics(res.data);
      } catch (err: any) {
        setError(err.message || "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-iptm-white pt-24 pb-16">
      <StatMain statistics={statistics} />
    </div>
  );
}
