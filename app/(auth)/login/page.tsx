"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, Plane, Loader2, Eye, EyeOff } from "lucide-react";
import authService from "@/lib/authService";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  const handleForgotRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setForgotStep(2);
      } else {
        setForgotError(data.error || "Lỗi yêu cầu OTP");
      }
    } catch (error) {
      setForgotError("Lỗi hệ thống");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotOtp.length !== 6) {
      setForgotError("Mã OTP phải gồm 6 chữ số");
      return;
    }
    setForgotError("");
    setForgotStep(3);
  };

  const handleForgotResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError("Mật khẩu xác nhận không khớp");
      return;
    }
    setForgotError("");
    setForgotLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp: forgotOtp, newPassword: forgotNewPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setForgotSuccess("Đổi mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.");
        setTimeout(() => {
          setIsForgotModalOpen(false);
          setForgotStep(1);
          setForgotSuccess("");
          setForgotEmail("");
          setForgotOtp("");
          setForgotNewPassword("");
          setForgotConfirmPassword("");
        }, 3000);
      } else {
        setForgotError(data.error || "Lỗi đổi mật khẩu");
      }
    } catch (error) {
      setForgotError("Lỗi hệ thống");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authService.login({
        email: formData.email,
        password: formData.password
      });
      
      window.dispatchEvent(new Event("auth-change"));
      window.location.href = "/"; // redirect and force reload
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Đăng nhập thất bại.");
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
          Đăng nhập hệ thống
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="font-medium text-[#005f73] hover:text-[#004a5a] underline">
            Đăng ký ngay
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
              <div className="flex items-center justify-end mt-2">
                <div className="text-sm">
                  <button 
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="font-medium text-[#005f73] hover:text-[#004a5a]"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#005f73] hover:bg-[#004a5a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#005f73] disabled:opacity-70 transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Đang kiểm tra...</span>
                ) : (
                  <span className="flex items-center gap-2">Đăng nhập <LogIn className="w-4 h-4" /></span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#005f73] px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Khôi phục mật khẩu
              </h3>
              <button 
                onClick={() => {
                  setIsForgotModalOpen(false);
                  setForgotStep(1);
                  setForgotError("");
                  setForgotSuccess("");
                }}
                className="text-white/80 hover:text-white"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6">
              {forgotError && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200 text-center mb-4">
                  {forgotError}
                </div>
              )}
              {forgotSuccess && (
                <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg border border-green-200 text-center mb-4 font-medium">
                  {forgotSuccess}
                </div>
              )}

              {/* Step 1: Nhập Email */}
              {forgotStep === 1 && (
                <form onSubmit={handleForgotRequestOtp} className="space-y-4">
                  <p className="text-sm text-gray-600 mb-2">Vui lòng nhập email tài khoản của bạn để nhận mã xác thực OTP.</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ Email</label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="focus:ring-[#005f73] focus:border-[#005f73] block w-full sm:text-sm border-gray-300 rounded-md py-2.5 px-3 border"
                      placeholder="nguyen@example.com"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading || !forgotEmail}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#005f73] hover:bg-[#004a5a] focus:outline-none disabled:opacity-70 transition-colors mt-4"
                  >
                    {forgotLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Gửi mã OTP"}
                  </button>
                </form>
              )}

              {/* Step 2: Xác nhận OTP */}
              {forgotStep === 2 && (
                <form onSubmit={handleForgotVerifyOtp} className="space-y-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Mã xác thực 6 số đã được gửi tới <strong>{forgotEmail}</strong>. Nhập mã để tiếp tục.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã xác thực OTP</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      className="focus:ring-[#005f73] focus:border-[#005f73] block w-full sm:text-sm border-gray-300 rounded-md py-2.5 px-3 border text-center text-xl font-bold tracking-widest"
                      placeholder="------"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!forgotOtp || forgotOtp.length !== 6}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#005f73] hover:bg-[#004a5a] focus:outline-none disabled:opacity-70 transition-colors mt-4"
                  >
                    Xác nhận mã OTP
                  </button>
                  <div className="text-center mt-2">
                    <button type="button" onClick={() => setForgotStep(1)} className="text-xs text-[#005f73] hover:underline">
                      Nhập lại Email
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Đặt Mật Khẩu Mới */}
              {forgotStep === 3 && !forgotSuccess && (
                <form onSubmit={handleForgotResetPassword} className="space-y-4">
                  <p className="text-sm text-gray-600 mb-2">Mã OTP hợp lệ. Vui lòng thiết lập mật khẩu mới.</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                    <div className="relative">
                      <input
                        type={showForgotNewPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        className="focus:ring-[#005f73] focus:border-[#005f73] block w-full pr-10 sm:text-sm border-gray-300 rounded-md py-2.5 px-3 border"
                        placeholder="Ít nhất 6 ký tự"
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showForgotNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                    <div className="relative">
                      <input
                        type={showForgotConfirmPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        className="focus:ring-[#005f73] focus:border-[#005f73] block w-full pr-10 sm:text-sm border-gray-300 rounded-md py-2.5 px-3 border"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showForgotConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading || !forgotNewPassword || !forgotConfirmPassword}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#005f73] hover:bg-[#004a5a] focus:outline-none disabled:opacity-70 transition-colors mt-4"
                  >
                    {forgotLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Đổi mật khẩu"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
