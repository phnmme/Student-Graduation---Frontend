import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-iptm-white">
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          {/* Logo */}
          <Image
            src="/assets/images/iptmlogoalone.png"
            alt="IPTM Logo"
            width={200}
            height={200}
            className="mx-auto mb-8 "
          />

          {/* Title */}
          <h1 className="text-4xl font-bold leading-tight text-iptm-black md:text-[55px]">
            ยินดีต้อนรับสู่
          </h1>

          <h2 className="mt-4 text-2xl font-semibold text-iptm-dark-gray md:text-4xl">
            เว็บไซต์การจัดการเทคโนโลยีการผลิตและสารสนเทศ
          </h2>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-iptm-dark-gray md:text-lg">
            ระบบสำหรับค้นหาและตรวจสอบข้อมูลนักศึกษาที่สำเร็จการศึกษา
            พร้อมแสดงรายละเอียดข้อมูลที่เกี่ยวข้องอย่างสะดวก รวดเร็ว และถูกต้อง
          </p>

          {/* Button */}
          <div className="mt-10">
            <Link
              href="/students"
              className="inline-flex items-center rounded-xl bg-iptm-gold px-8 py-4 text-lg font-semibold text-iptm-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-iptm-gold/90"
            >
              ค้นหาข้อมูลนักศึกษาที่สำเร็จการศึกษา
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
