"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight, Plane, Loader2, Eye, EyeOff } from "lucide-react";
import authService from "@/lib/authService";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsLoading(true);

    try {
      // Sinh số điện thoại ngẫu nhiên để không bị trùng lặp trong DB
      const randomPhone = "09" + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');

      await authService.register({
        email: formData.email.toLowerCase().trim(),
        phoneNumber: randomPhone, // Thay placeholder cố định bằng số ngẫu nhiên
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        title: "Mr",
        gender: "Male",
        firstName: formData.fullName.split(" ")[0] || "User",
        lastName: formData.fullName.split(" ").slice(1).join(" ") || "Name",
        displayName: formData.fullName,
        dateOfBirth: "2000-01-01",
        nationality: "Vietnam",
        language: "vi",
        country: "Vietnam",
        province: "Hanoi",
        agreeTerms: true
      });

      // Tự động gửi Email Chào mừng (Welcome Email)
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'WELCOME',
          email: formData.email,
          data: { fullName: formData.fullName }
        })
      });

      // Chuyển hướng sang trang Đăng nhập sau khi thành công
      alert("Đăng ký thành công! Email thông báo đã được gửi. Vui lòng đăng nhập.");
      router.push("/login");

    } catch (err) {
      console.error(err);
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-[#005f73] p-3 rounded-full">
            <Plane className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Tạo tài khoản mới
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-medium text-[#005f73] hover:text-[#004a5a] underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200 text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="focus:ring-[#005f73] focus:border-[#005f73] block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border"
                  placeholder="VD: Nguyen Van A"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Địa chỉ Email</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  className="focus:ring-[#005f73] focus:border-[#005f73] block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border"
                  placeholder="nguyen@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="focus:ring-[#005f73] focus:border-[#005f73] block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md py-3 border"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="focus:ring-[#005f73] focus:border-[#005f73] block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md py-3 border"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#005f73] hover:bg-[#004a5a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#005f73] disabled:opacity-70 transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Đang xử lý...</span>
                ) : (
                  <span className="flex items-center gap-2">Tạo tài khoản <ArrowRight className="w-4 h-4" /></span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
