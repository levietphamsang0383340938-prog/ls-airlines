"use client";

import { useState } from "react";
import { Eye, EyeOff, Check, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChangePasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Validation rules
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&]/.test(newPassword);
  
  const isPasswordValid = hasUpperCase && hasLowerCase && hasMinLength && hasNumber && hasSpecialChar;
  const passwordsMatch = newPassword === confirmPassword && newPassword !== "";

  const validatePassword = (password: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&])[A-Za-z\d!@#$%^&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate client-side
    if (!currentPassword) {
      setError("Vui lòng nhập mật khẩu hiện tại");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError("Mật khẩu mới không thỏa mãn các điều kiện bảo mật");
      return;
    }

    if (!passwordsMatch) {
      setError("Mật khẩu xác nhận không khớp với mật khẩu mới");
      return;
    }

    setIsLoading(true);

    try {
      // Get token/user from localStorage
      const userJson = localStorage.getItem('currentUser');
      const allUsersJson = localStorage.getItem('users');
      
      if (!userJson || !allUsersJson) {
        setError("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
        setIsLoading(false);
        return;
      }

      const currentUser = JSON.parse(userJson);
      let allUsers = JSON.parse(allUsersJson);
      
      // Find the actual user record
      const userIndex = allUsers.findIndex((u: any) => u.email === currentUser.email);
      
      if (userIndex === -1) {
        setError("Không tìm thấy thông tin người dùng.");
        setIsLoading(false);
        return;
      }

      // Check current password
      if (allUsers[userIndex].password !== currentPassword) {
        setError("Mật khẩu hiện tại không chính xác.");
        setIsLoading(false);
        return;
      }

      // Update password
      allUsers[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(allUsers));
      
      // Send email notification
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'CHANGE_PASSWORD',
            email: currentUser.email,
            data: { fullName: currentUser.fullName || currentUser.email }
          })
        });
      } catch (emailErr) {
        console.error("Failed to send email notification", emailErr);
      }

      // Success
      setSuccess(true);
      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đổi mật khẩu thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Thay đổi mật khẩu</h1>
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800">Đổi mật khẩu thành công!</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mật khẩu hiện tại */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Mật khẩu hiện tại
            </label>
            <div className="md:col-span-2 relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f73] focus:border-transparent outline-none"
                placeholder="Nhập mật khẩu hiện tại"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mật khẩu mới */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Mật khẩu mới
            </label>
            <div className="md:col-span-2 relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005f73] focus:border-transparent outline-none"
                placeholder="Nhập mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Danh sách validate mật khẩu mới */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="md:col-span-3 md:col-start-2">
              <div className="space-y-2">
                <div className={cn("flex items-center gap-2 text-sm", hasUpperCase ? "text-green-600" : "text-gray-500")}>
                  <Check className={cn("w-4 h-4", hasUpperCase ? "text-green-600" : "text-gray-400")} />
                  <span>Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa.</span>
                </div>
                <div className={cn("flex items-center gap-2 text-sm", hasLowerCase ? "text-green-600" : "text-gray-500")}>
                  <Check className={cn("w-4 h-4", hasLowerCase ? "text-green-600" : "text-gray-400")} />
                  <span>Mật khẩu phải chứa ít nhất 1 chữ cái thường.</span>
                </div>
                <div className={cn("flex items-center gap-2 text-sm", hasMinLength ? "text-green-600" : "text-gray-500")}>
                  <Check className={cn("w-4 h-4", hasMinLength ? "text-green-600" : "text-gray-400")} />
                  <span>Mật khẩu phải có ít nhất 8 ký tự.</span>
                </div>
                <div className={cn("flex items-center gap-2 text-sm", hasNumber ? "text-green-600" : "text-gray-500")}>
                  <Check className={cn("w-4 h-4", hasNumber ? "text-green-600" : "text-gray-400")} />
                  <span>Mật khẩu phải chứa ít nhất 1 số.</span>
                </div>
                <div className={cn("flex items-center gap-2 text-sm", hasSpecialChar ? "text-green-600" : "text-gray-500")}>
                  <Check className={cn("w-4 h-4", hasSpecialChar ? "text-green-600" : "text-gray-400")} />
                  <span>Mật khẩu phải bao gồm ít nhất 1 ký tự đặc biệt (! @ $ % ^ &)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Xác nhận mật khẩu mới
            </label>
            <div className="md:col-span-2 relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={cn(
                  "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#005f73] focus:border-transparent outline-none",
                  confirmPassword && !passwordsMatch ? "border-red-500" : "border-gray-300"
                )}
                placeholder="Nhập lại mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {confirmPassword && !passwordsMatch && (
                <p className="mt-1 text-xs text-red-600">Mật khẩu xác nhận không khớp</p>
              )}
            </div>
          </div>

          {/* Nút Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#005f73] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#004d5c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}