/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import { login } from "@/action/authAction";
import Image from "next/image";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // ป้องกันการ reload หน้าจอเมื่อส่งฟอร์ม

    if (!email || !password) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await login(email, password);

      if (response) {
        window.location.href = "/";
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      setError(error.message || "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center py-8 w-full max-w-md md:max-w-xl lg:max-w-2xl bg-iptm-white rounded-2xl shadow-xl border border-iptm-light/50">
      <Image
        src="/assets/images/iptmlogoalone.png"
        alt="IPTM Logo"
        width={150}
        height={150}
        className="mx-auto mb-4"
      />
      <h1 className="text-3xl font-bold text-iptm-black">เข้าสู่ระบบ</h1>

      <form onSubmit={handleLogin} className="p-8 space-y-6 w-full">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {/* อีเมล */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-iptm-dark-gray ml-1">
            อีเมล
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-iptm-gray group-focus-within:text-iptm-navy transition-colors">
              <Mail size={20} />
            </div>
            <input
              type="email"
              className="block w-full pl-12 pr-4 py-3 bg-iptm-white border border-iptm-light text-iptm-black placeholder:text-iptm-gray rounded-xl transition-all outline-none focus:border-iptm-navy focus:ring-1 focus:ring-iptm-navy"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* รหัสผ่าน */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-sm font-semibold text-iptm-dark-gray">
              รหัสผ่าน
            </label>
            {/* <a
              href="#"
              className="text-xs font-medium text-iptm-gray hover:text-iptm-navy hover:underline transition-colors"
            >
              ลืมรหัสผ่าน?
            </a> */}
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-iptm-gray group-focus-within:text-iptm-navy transition-colors">
              <Lock size={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              className="block w-full pl-12 pr-12 py-3 bg-iptm-white border border-iptm-light text-iptm-black placeholder:text-iptm-gray rounded-xl transition-all outline-none focus:border-iptm-navy focus:ring-1 focus:ring-iptm-navy"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center cursor-pointer pr-4 text-iptm-gray hover:text-iptm-navy transition-colors"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* ปุ่มเข้าสู่ระบบ */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-3 bg-iptm-gold text-iptm-white p-4 rounded-xl font-semibold cursor-pointer shadow-md hover:bg-iptm-gold/90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none group"
          >
            <LogIn
              className="transform group-hover:translate-x-1 transition-transform duration-300"
              size={20}
            />
            <span>{isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}</span>
          </button>
        </div>
      </form>

      {/* เส้นคั่น */}
      <div className="w-full px-8">
        <hr className="border-iptm-light w-full" />
      </div>

      {/* สมัครสมาชิก */}
      <div className="mt-6 mb-2 flex justify-center items-center space-x-2">
        <p className="text-sm text-iptm-dark-gray">ยังไม่มีบัญชีใช่ไหม?</p>
        <a
          href="/register"
          className="text-sm font-bold text-iptm-gold hover:underline hover:text-iptm-gold/90 transition-colors"
        >
          สมัครสมาชิก
        </a>
      </div>
    </div>
  );
}
