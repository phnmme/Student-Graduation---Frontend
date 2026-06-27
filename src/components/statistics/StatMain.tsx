import { DashboardStatistics } from "@/types/staticType";
import { CoopEmploymentChart } from "./CoopChart";
import { GraduationStatusChart } from "./GraduationStatusChart";
import Image from "next/image";
import { SectorComparisonChart } from "./EmployeeChart";

interface StatMainProps {
  statistics: DashboardStatistics;
}

export default function StatMain({ statistics }: StatMainProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b flex flex-col items-center border-iptm-light pb-4 mb-6">
        <Image
          src="/assets/images/iptmlogoalone.png"
          alt="IPTM Logo"
          width={150}
          height={150}
          className="mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-iptm-black mb-2">
          สถิติการฝึกงานและการทำงานของนิสิต
        </h1>
        <p className="text-iptm-dark-gray text-sm">
          ข้อมูลสถิติการฝึกงานและการทำงานของนิสิตจากระบบฐานข้อมูลของสาขาวิชา
        </p>
      </div>

      <div className="space-y-8">
        <section className="rounded-2xl">
          <GraduationStatusChart data={statistics.graduationStatusChart} />
        </section>
        <section className="rounded-2xl">
          <CoopEmploymentChart data={statistics.coopChart} />
        </section>
        <section className="rounded-2xl">
          <SectorComparisonChart data={statistics.employmentSectorChart} />
        </section>
      </div>
    </div>
  );
}
