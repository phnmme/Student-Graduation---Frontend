/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  User,
  Mail,
  Lock,
  IdCard,
  Phone,
  GraduationCap,
  UserPlus,
  Eye,
  EyeOff,
} from "lucide-react";
import { SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import Particles from "../bits/Particles";
import { register } from "@/action/authAction";
import Image from "next/image";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [firstNameTh, setFirstNameTh] = useState("");
  const [lastNameTh, setLastNameTh] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [entryYear, setEntryYear] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !email ||
      !password ||
      !confirmPassword ||
      !studentCode ||
      !firstNameTh ||
      !lastNameTh ||
      !phoneNumber ||
      !entryYear
    ) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await register(
        email,
        password,
        confirmPassword,
        studentCode,
        firstNameTh,
        lastNameTh,
        phoneNumber,
        Number(entryYear)
      );

      if (response) {
        setSuccess("ลงทะเบียนสำเร็จ! กำลังนำคุณไปยังหน้าเข้าสู่ระบบ...");

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      setError(error.message || "ลงทะเบียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative z-10 flex flex-col justify-center items-center bg-iptm-white py-8 w-full max-w-md md:max-w-xl lg:max-w-3xl rounded-2xl shadow-xl border border-iptm-light/50 mx-auto">
        <Image
          src="/assets/images/iptmlogoalone.png"
          alt="IPTM Logo"
          width={150}
          height={150}
          className="mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-iptm-black mb-2">ลงทะเบียน</h1>

        <form className="p-8 space-y-8 w-full" onSubmit={handleSubmit}>
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

          {/* SECTION 1: ข้อมูลบัญชีผู้ใช้ */}
          <section className="space-y-4">
            <h2 className="font-bold text-iptm-navy flex items-center gap-2 border-b border-iptm-light pb-2">
              <Lock size={18} />
              ข้อมูลบัญชีผู้ใช้
            </h2>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-iptm-dark-gray ml-1">
                อีเมล (มหาวิทยาลัยเท่านั้น){" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-3.5 text-iptm-gray group-focus-within:text-iptm-navy transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-iptm-white border border-iptm-light text-iptm-black placeholder:text-iptm-gray rounded-xl transition-all outline-none focus:border-iptm-navy focus:ring-1 focus:ring-iptm-navy disabled:opacity-50"
                  placeholder="example@university.ac.th"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-iptm-dark-gray ml-1">
                  รหัสผ่าน <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-3.5 text-iptm-gray group-focus-within:text-iptm-navy transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-iptm-white border border-iptm-light text-iptm-black placeholder:text-iptm-gray rounded-xl transition-all outline-none focus:border-iptm-navy focus:ring-1 focus:ring-iptm-navy disabled:opacity-50"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-iptm-gray hover:text-iptm-navy transition-colors cursor-pointer"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-iptm-dark-gray ml-1">
                  ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-3.5 z-50 text-iptm-gray group-focus-within:text-iptm-navy transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-iptm-white border border-iptm-light text-iptm-black placeholder:text-iptm-gray rounded-xl transition-all outline-none focus:border-iptm-navy focus:ring-1 focus:ring-iptm-navy disabled:opacity-50"
                    disabled={isLoading}
                    style={{ contentVisibility: "auto" }}
                    onChangeCapture={(e: any) =>
                      setConfirmPassword(e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-3.5 text-iptm-gray hover:text-iptm-navy transition-colors cursor-pointer"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: ข้อมูลส่วนตัว */}
          <section className="space-y-4">
            <h2 className="font-bold text-iptm-navy flex items-center gap-2 border-b border-iptm-light pb-2">
              <User size={18} />
              ข้อมูลส่วนตัว
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="รหัสนักศึกษา"
                icon={<IdCard size={20} />}
                placeholder="รหัสนักศึกษา"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                required
                disabled={isLoading}
              />
              <Input
                label="ชื่อ (ไทย)"
                icon={<User size={20} />}
                placeholder="ชื่อ (ไทย)"
                value={firstNameTh}
                onChange={(e) => setFirstNameTh(e.target.value)}
                required
                disabled={isLoading}
              />
              <Input
                label="นามสกุล (ไทย)"
                icon={<User size={20} />}
                placeholder="นามสกุล (ไทย)"
                value={lastNameTh}
                onChange={(e) => setLastNameTh(e.target.value)}
                required
                disabled={isLoading}
              />
              <Input
                label="เบอร์โทรศัพท์"
                type="tel"
                icon={<Phone size={20} />}
                placeholder="เบอร์โทรศัพท์"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </section>

          {/* SECTION 3: ข้อมูลการศึกษา */}
          <section className="space-y-4">
            <h2 className="font-bold text-iptm-navy flex items-center gap-2 border-b border-iptm-light pb-2">
              <GraduationCap size={18} />
              ข้อมูลการศึกษา
            </h2>

            <div className="relative group">
              <div className="absolute left-4 top-3.5 text-iptm-gray">
                <GraduationCap size={20} />
              </div>
              <input
                readOnly
                value="การจัดการเทคโนโลยีสารการผลิตและสารสนเทศ"
                className="w-full pl-12 pr-4 py-3 bg-iptm-light/40 border border-iptm-light text-iptm-dark-gray rounded-xl cursor-not-allowed outline-none font-medium"
              />
            </div>

            <input
              type="number"
              required
              value={entryYear}
              onChange={(e) => setEntryYear(e.target.value)}
              className="w-full px-4 py-3 bg-iptm-white border border-iptm-light text-iptm-black placeholder:text-iptm-gray rounded-xl transition-all outline-none focus:border-iptm-navy focus:ring-1 focus:ring-iptm-navy disabled:opacity-50"
              placeholder="ปีที่เข้าศึกษา (เช่น 2567)"
              disabled={isLoading}
              min="2500"
              max="2600"
            />
          </section>

          {/* ปุ่ม Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-3 bg-iptm-gold text-iptm-white p-4 rounded-xl font-semibold shadow-md hover:bg-iptm-gold/90 cursor-pointer active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none group"
            >
              <UserPlus className="transform group-hover:scale-110 transition-transform duration-300" />
              <span>
                {isLoading ? "กำลังลงทะเบียน..." : "ลงทะเบียนและเริ่มต้นใช้งาน"}
              </span>
            </button>
          </div>
        </form>

        {/* เส้นคั่น */}
        <div className="w-full px-8">
          <hr className="border-iptm-light w-full" />
        </div>

        {/* ลิงก์กลับหน้า Login */}
        <div className="mt-6 mb-2 flex justify-center items-center space-x-2 text-sm">
          <span className="text-iptm-dark-gray">มีบัญชีอยู่แล้ว?</span>
          <a
            href="/login"
            className="font-bold text-iptm-gold hover:underline hover:text-iptm-gold/90 transition-colors"
          >
            เข้าสู่ระบบ
          </a>
        </div>
      </div>
    </>
  );
}

// Sub-Component: Input (ที่มีการเกลี่ยสีให้เหมือนกัน)
function Input({
  label,
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
}: {
  label: string;
  icon?: React.ReactNode;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-iptm-dark-gray ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-3.5 text-iptm-gray group-focus-within:text-iptm-navy transition-colors">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className="w-full pl-12 pr-4 py-3 bg-iptm-white border border-iptm-light text-iptm-black placeholder:text-iptm-gray rounded-xl transition-all outline-none focus:border-iptm-navy focus:ring-1 focus:ring-iptm-navy disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}
