/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, FileText, Send } from "lucide-react";
import Particles from "../bits/Particles";
import { createReview } from "@/action/backend/reviewAction";
import Image from "next/image";

export default function CareerReviewForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [jobField, setJobField] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      setError("กรุณากรอกหัวข้อและรายละเอียด");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await createReview({
        title,
        description,
        jobField: jobField || undefined,
      });
      if (res) {
        setSuccess("บันทึกรีวิวเรียบร้อยแล้ว");
        setTimeout(() => {
          router.refresh();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative z-10 max-w-3xl mx-auto bg-iptm-white rounded-2xl shadow-xl border border-iptm-light/50 p-8 mt-10">
        <div className="border-b flex flex-col items-center border-iptm-light pb-4 mb-6">
          <Image
            src="/assets/images/iptmlogoalone.png"
            alt="IPTM Logo"
            width={150}
            height={150}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-iptm-black mb-2">
            เขียนสิ่งที่อยากจะแนะนำ
          </h1>
          <p className="text-iptm-dark-gray text-sm">
            แนะนำหรือแชร์ประสบการณ์ต่างๆ
            เพื่อเป็นประโยชน์ในการเตรียมตัวของรุ่นน้อง
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm font-medium">
              {success}
            </div>
          )}

          {/* Grid Layout สำหรับหัวข้อและสายงานเพื่อให้กระชับขึ้นบนจอใหญ่ */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-iptm-dark-gray ml-1">
                หัวข้อแนะนำ & รีวิว <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-3.5 text-iptm-gray group-focus-within:text-iptm-navy transition-colors">
                  <FileText size={20} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="เช่น ประสบการณ์ทำงานสาย Backend"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 bg-iptm-white border border-iptm-light text-iptm-black placeholder:text-iptm-gray rounded-xl transition-all outline-none focus:border-iptm-navy focus:ring-1 focus:ring-iptm-navy disabled:opacity-50"
                />
              </div>
            </div>

            {/* Job Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-iptm-dark-gray ml-1">
                สายงาน / ตำแหน่ง (ถ้ามี)
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-3.5 text-iptm-gray group-focus-within:text-iptm-navy transition-colors">
                  <Briefcase size={20} />
                </div>
                <input
                  type="text"
                  placeholder="เช่น Software Developer, Data Analyst"
                  value={jobField}
                  onChange={(e) => setJobField(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 bg-iptm-white border border-iptm-light text-iptm-black placeholder:text-iptm-gray rounded-xl transition-all outline-none focus:border-iptm-navy focus:ring-1 focus:ring-iptm-navy disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-iptm-dark-gray ml-1">
              รายละเอียดเนื้อหา <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={8}
              required
              placeholder="เล่าประสบการณ์การทำงาน, ลักษณะงานที่เจอ, เงินเดือนเริ่มต้น หรือสิ่งที่คุณอยากให้รุ่นน้องเตรียมตัวล่วงหน้าก่อนเรียนจบ..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-iptm-white border border-iptm-light text-iptm-black placeholder:text-iptm-gray rounded-xl transition-all outline-none focus:border-iptm-navy focus:ring-1 focus:ring-iptm-navy disabled:opacity-50 resize-none min-h-[160px]"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-3 bg-iptm-gold text-iptm-white p-4 rounded-xl font-semibold shadow-md hover:bg-iptm-gold/90 cursor-pointer active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none group"
            >
              <Send className="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              <span>
                {isLoading ? "กำลังบันทึกข้อมูล..." : "บันทึกรีวิวและเผยแพร่"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
